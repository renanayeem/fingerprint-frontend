import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { FingerprintService } from './fingerprint.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const fingerprintInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const fingerprintService = inject(FingerprintService);
  const router = inject(Router);

  const clonedReq = req.clone({
    withCredentials: true,
    setHeaders: {
      'X-Client-Fingerprint': fingerprintService.getHash()
    }
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/api/profile') && !req.url.includes('/api/logout')) {
        console.log('Unauthorized! Redirecting to login...');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};