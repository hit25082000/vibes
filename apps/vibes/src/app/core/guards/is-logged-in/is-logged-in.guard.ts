import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@domain/auth/services/auth.service';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  return false;
};
