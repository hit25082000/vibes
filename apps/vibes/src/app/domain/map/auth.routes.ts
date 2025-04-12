import { Route } from '@angular/router';

export const AUTH_ROTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up.page').then(m => m.SignUpPage),
  },
];
