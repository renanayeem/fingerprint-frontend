import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { FingerprintService } from './fingerprint.service';
import { catchError, throwError } from 'rxjs';

export const fingerprintInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const fingerprintService = inject(FingerprintService);

  const clonedReq = req.clone({
    withCredentials: true,
    setHeaders: {
      'X-Client-Fingerprint': fingerprintService.getHash()
    }
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.log('Unauthorized! Redirecting to login...');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};