import { CanActivateFn } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const fingerprint = localStorage.getItem('fingerprint');

  if (fingerprint) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};