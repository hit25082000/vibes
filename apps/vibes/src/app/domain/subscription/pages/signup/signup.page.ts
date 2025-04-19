import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormStorageDirective } from '@widget/directives/form-storage/form-storage.directive';
import { BreadcrumbComponent } from '@widget/components/breadcrumb/breadcrumb.component';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'v-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NzCardModule, NzFormModule, NzInputModule, NzButtonModule, FormStorageDirective, BreadcrumbComponent],
  template: `
    <v-breadcrumb [items]="[{ label: 'Registro' }]" />

    <nz-card>
      <form [formGroup]="form" mbFormStorage="user-subscription-form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label>Nome</nz-form-label>
          <nz-form-control nzErrorTip="Por favor, insira seu nome">
            <input nz-input formControlName="name" placeholder="Nome completo" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>Email</nz-form-label>
          <nz-form-control [nzErrorTip]="emailErrorTpl">
            <input nz-input formControlName="email" placeholder="Email" />
            <ng-template #emailErrorTpl let-control>
              @if (control.hasError('required')) {
                Por favor, insira seu email
              } @else if (control.hasError('email')) {
                Por favor, insira um email válido
              }
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>Telefone</nz-form-label>
          <nz-form-control nzErrorTip="Por favor, insira seu telefone">
            <input nz-input formControlName="phone" placeholder="(00) 00000-0000" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>Senha</nz-form-label>
          <nz-form-control nzErrorTip="Por favor, insira sua senha">
            <input nz-input type="password" formControlName="password" placeholder="Senha" />
          </nz-form-control>
        </nz-form-item>

        <button nz-button nzType="primary" [disabled]="form.invalid">Registrar</button>
      </form>
    </nz-card>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 600px;
        margin: 2rem auto;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      button {
        align-self: flex-end;
      }
    `,
  ],
})
export class SignupPage {
  private fb = inject(FormBuilder);
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.form.valid) {
      await this.subscriptionService.createAdminUser(this.form);
      this.router.navigate(['/establishment/new']);
    }
  }
}
