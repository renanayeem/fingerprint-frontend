import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { fingerprintInterceptor } from './fingerprint-interceptor';
import { FingerprintService } from './fingerprint.service';

export function initFingerprint(fingerprintService: FingerprintService) {
  return () => fingerprintService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([fingerprintInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initFingerprint,
      deps: [FingerprintService],
      multi: true
    }
  ]
};