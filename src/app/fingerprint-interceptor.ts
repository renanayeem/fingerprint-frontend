import { HttpInterceptorFn } from '@angular/common/http';

export const fingerprintInterceptor: HttpInterceptorFn = (req, next) => {
  const fingerprint = window.localStorage.getItem('fingerprint') ?? 'unknown-device';
  
  console.log('Interceptor fired! Fingerprint:', fingerprint);

  const clonedReq = req.clone({
    setHeaders: {
      'X-Client-Fingerprint': fingerprint
    }
  });

  return next(clonedReq);
};