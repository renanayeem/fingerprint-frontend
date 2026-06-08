import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

export const fingerprintInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();

  const clonedReq = req.clone({
    withCredentials: true,
    setHeaders: token ? { 'Authorization': `Bearer ${token}` } : {}
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('401 Unauthorized! Redirecting to login...');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};