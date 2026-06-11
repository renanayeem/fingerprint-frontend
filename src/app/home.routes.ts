import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const homeRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.Home),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },
];