import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { FingerprintService } from './fingerprint.service';
import { HmacService } from './hmacservice';
import { Router } from '@angular/router';
import { catchError, throwError, from, switchMap } from 'rxjs';

const SIGNED_ROUTES = [
  { method: 'POST', path: '/api/vehicles' },
  { method: 'POST', path: '/api/logout' }
];

function needsSignature(method: string, url: string): boolean {
  return SIGNED_ROUTES.some(route => route.method === method && url.includes(route.path));
}

export const fingerprintInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const fingerprintService = inject(FingerprintService);
  const hmacService = inject(HmacService);
  const router = inject(Router);

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

    const secret = authService.getSessionSecret();
    const payload = req.body ? JSON.stringify(req.body) : '';
    const timestamp = Date.now().toString();
    const payloadHash = await hmacService.hashPayload(payload);
    const signature = await hmacService.computeSignature(fingerprint, payloadHash, timestamp, secret);

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
    switchMap(clonedReq => next(clonedReq)),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/api/profile') && !req.url.includes('/api/logout')) {
        console.log('Unauthorized! Redirecting to login...');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};