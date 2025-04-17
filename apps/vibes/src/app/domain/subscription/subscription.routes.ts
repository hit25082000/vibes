import { Route } from '@angular/router';

export const SUBSCRIPTION_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: '',
    title: 'Assinatura',
    loadComponent: () => import('./pages/subscription/subscription.page').then(m => m.SubscriptionPage),
    children: [
      {
        path: 'admin',
        loadComponent: () => import('./components/admin-details/admin-details.component').then(m => m.AdminDetailsComponent),
      },
      {
        path: 'establishment',
        loadComponent: () => import('./components/establishment-details/establishment-details.component').then(m => m.EstablishmentDetailsComponent),
      },
      {
        path: 'select-plan',
        loadComponent: () => import('./components/select-plan/select-plan.component').then(m => m.SelectPlanComponent),
      },
    ],
  },
];
