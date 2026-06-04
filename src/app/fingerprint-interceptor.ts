import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const fingerprintInterceptor: HttpInterceptorFn = (req, next) => {
  const fingerprint = window.localStorage.getItem('fingerprint') ?? 'unknown-device';
  const router = inject(Router);

  const clonedReq = req.clone({
    setHeaders: {
      'X-Client-Fingerprint': fingerprint
    }
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('401 Unauthorized! Redirecting to login...');
        localStorage.removeItem('fingerprint');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};