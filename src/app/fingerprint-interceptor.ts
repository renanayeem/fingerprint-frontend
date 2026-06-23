import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { FingerprintService } from './fingerprint.service';
import { HmacService } from './hmacservice';
import {
  catchError,
  throwError,
  from,
  switchMap,
  BehaviorSubject,
  filter,
  take
} from 'rxjs';
import { environment } from '../environments/environment';

const SIGNED_ROUTES = [
  { method: 'POST', path: '/api/vehicles' }  // bug 1 fix: removed /api/logout
];

function needsSignature(method: string, url: string): boolean {
  return SIGNED_ROUTES.some(
    route => route.method === method && url.includes(route.path)
  );
}

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<boolean | null>(null);  // bug 4 fix: null as initial value

export const fingerprintInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const fingerprintService = inject(FingerprintService);
  const hmacService = inject(HmacService);

  const fingerprint = fingerprintService.getHash();

  const buildRequest = async () => {
    if (!needsSignature(req.method, req.url)) {
      return req.clone({
        withCredentials: true,
        setHeaders: {
          'X-Client-Fingerprint': fingerprint
        }
      });
    }

    const payload = req.body ? JSON.stringify(req.body) : '';
    const timestamp = Date.now().toString();

    const payloadHash = await hmacService.hashPayload(payload);

    const signature = await hmacService.computeSignature(
      fingerprint,
      payloadHash,
      timestamp,
      environment.hmacSecret
    );

    return req.clone({
      withCredentials: true,
      setHeaders: {
        'X-Client-Fingerprint': fingerprint,
        'X-Signature': signature,
        'X-Timestamp': timestamp
      }
    });
  };

  return from(buildRequest()).pipe(
    switchMap(clonedReq =>
      next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {

          const isRefreshRequest = req.url.includes('/refresh');

          if (
            error.status === 401 &&
            !req.url.includes('/logout') &&
            !isRefreshRequest
          ) {

            if (!isRefreshing) {

              isRefreshing = true;
              refreshSubject.next(null);

              return authService.refreshToken().pipe(

                switchMap(() => {

                  isRefreshing = false;
                  refreshSubject.next(true);

                  console.log('Token refreshed. Retrying request...');

                  return from(buildRequest()).pipe(
                    switchMap(newReq => next(newReq))
                  );

                }),

                catchError(() => {

                  isRefreshing = false;
                  refreshSubject.next(false);  // bug 4 fix: unblock waiting requests

                  console.log('Refresh failed. Logging out...');
                  authService.logout();

                  return throwError(() => error);

                })
              );
            }

            // bug 4 fix: let both true and false through, handle false explicitly
            return refreshSubject.pipe(
              filter(refreshed => refreshed !== null),
              take(1),
              switchMap(refreshed => {
                if (!refreshed) return throwError(() => error);
                return from(buildRequest()).pipe(
                  switchMap(newReq => next(newReq))
                );
              })
            );
          }

          return throwError(() => error);

        })
      )
    )
  ); 
};