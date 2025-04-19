import { Route } from '@angular/router';
import { isLoggedInGuard } from '@core/guards/is-logged-in/is-logged-in.guard';

export const SUBSCRIPTION_ROUTES: Route[] = [
  {
    path: '',
    title: 'Assinatura',
    loadComponent: () => import('./pages/subscription/subscription.page').then(m => m.SubscriptionPage),
  },
  {
    path: 'establishment',
    title: 'Novo Estabelecimento',
    loadComponent: () => import('./pages/new-establishment/new-establishment.page').then(m => m.NewEstablishmentPage),
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'signup',
    title: 'Registro',
    loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage),
  },
];
