import { Routes } from '@angular/router';
import { authRoutes } from './auth.routes';
import { homeRoutes } from './home.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  ...authRoutes,
  ...homeRoutes
];