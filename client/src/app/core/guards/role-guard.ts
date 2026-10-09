import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { AuthUser } from '../../shared/models/auth.model';

export const RoleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user: AuthUser | null = auth.getCurrentUser();
  const allowedRoles = route.data['roles'] as string[] | undefined;

  if (!user) {
    auth.logout();
    return router.createUrlTree(['/login']);
  }

  if (allowedRoles?.includes(user.role)) {
    return true;
  }

  // Send authenticated users to their own role's home page.
  if (user.role === 'ADMIN') {
    return router.createUrlTree(['/admin/users']);
  }

  return router.createUrlTree(['/dashboard']);
};