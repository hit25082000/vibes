import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarWidget } from './widget/components/navbar/navbar.component';

@Component({
  selector: 'v-root',
  standalone: true,
  imports: [RouterOutlet, NavbarWidget],
  template: `
    <v-navbar-widget></v-navbar-widget>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      :host {
        display: block;
        padding-top: 64px;
      }
    `,
  ],
})
export class AppComponent {
  title = 'vibes';
}
