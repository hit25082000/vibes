import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NavbarService, NavMenuItem } from './navbar.service';
import { AuthService } from '../../../domain/auth/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'v-navbar-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, NzLayoutModule, NzMenuModule, NzIconModule, NzButtonModule],
  template: `
    <nz-layout>
      <nz-header>
        <div class="logo"></div>
        <ul nz-menu nzTheme="dark" nzMode="horizontal">
          <ng-container *ngFor="let item of menuItems">
            <li *ngIf="!item.children" nz-menu-item [routerLink]="item.path">
              <span nz-icon [nzType]="item.icon"></span>
              {{ item.label }}
            </li>
            <li *ngIf="item.children" nz-submenu [nzTitle]="item.label" [nzIcon]="item.icon">
              <ul>
                <li *ngFor="let child of item.children" nz-menu-item [routerLink]="child.path">
                  <span nz-icon [nzType]="child.icon"></span>
                  {{ child.label }}
                </li>
              </ul>
            </li>
          </ng-container>
        </ul>
        <div class="user-actions">
          <ng-container *ngIf="authService.isLoggedIn()">
            <button nz-button nzType="primary" nzDanger (click)="handleLogout()" class="logout-button">
              <span nz-icon nzType="logout"></span>
              Sair
            </button>
          </ng-container>
        </div>
      </nz-header>
    </nz-layout>
  `,
  styles: [
    `
      nz-header {
        position: fixed;
        width: 100%;
        z-index: 1000;
        display: flex;
        align-items: center;
      }

      .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px 24px 16px 0;
        float: left;
      }

      [nz-menu] {
        flex: 1;
        line-height: 64px;
      }

      nz-layout {
        min-height: 64px;
      }

      .user-actions {
        margin-left: 16px;
      }

      .logout-button {
        margin-right: 16px;
      }

      .logout-button span {
        margin-right: 8px;
      }
    `,
  ],
})
export class NavbarWidget implements OnInit {
  menuItems: NavMenuItem[] = [];

  constructor(
    private navbarService: NavbarService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.menuItems = this.navbarService.getMenuItems();
  }

  async handleLogout() {
    try {
      await this.authService.logout();
      await this.authService.purgeAndRedirect();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}
