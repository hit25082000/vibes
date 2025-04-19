import { Component, Input } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

export interface IBreadcrumbItem {
  label: string;
  path?: string;
}

@Component({
  selector: 'v-breadcrumb',
  standalone: true,
  imports: [NzBreadCrumbModule],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Home</nz-breadcrumb-item>
      @for (item of items; track item.label) {
        <nz-breadcrumb-item>{{ item.label }}</nz-breadcrumb-item>
      }
    </nz-breadcrumb>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class BreadcrumbComponent {
  @Input() items: IBreadcrumbItem[] = [];
}
