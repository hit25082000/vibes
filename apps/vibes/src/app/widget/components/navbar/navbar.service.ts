import { Injectable } from '@angular/core';

export interface NavMenuItem {
  path: string;
  label: string;
  icon: string;
  children?: NavMenuItem[];
}

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private menuItems: NavMenuItem[] = [
    {
      path: '/subscription',
      label: 'Assinatura',
      icon: 'shopping-cart',
    },
    {
      path: '/auth',
      label: 'Autenticação',
      icon: 'user',
      children: [
        {
          path: '/auth',
          label: 'Login',
          icon: 'login',
        },
        {
          path: '/auth/reset-password',
          label: 'Redefinir Senha',
          icon: 'key',
        },
      ],
    },
  ];

  getMenuItems(): NavMenuItem[] {
    return this.menuItems;
  }
}
