import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';
export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['GENERAL_USER'] },
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(
        (m) => m.Dashboard
      )
  },
  {
    path: 'admin/users',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/admin/users/users').then(
        (m) => m.Users
      )
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];