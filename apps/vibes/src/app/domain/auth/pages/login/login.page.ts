import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Component, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { InjectSupabase } from '@shared/functions/inject-supabase.function';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { iDynamicFormConfig } from '@widget/components/dynamic-form/dynamic-form-config.interface';
import { eDynamicField } from '@widget/components/dynamic-form/dynamic-field.enum';
import { DynamicFormComponent } from '@widget/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'v-login',
  imports: [NzButtonComponent, NzFormModule, NzInputModule, ReactiveFormsModule, DynamicFormComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private supabase = InjectSupabase();
  private notificationService = inject(NzNotificationService);
  private router = inject(Router);

  loginConfig: iDynamicFormConfig[] = [
    {
      label: 'Email',
      name: 'email',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'email',
      },
      validations: [Validators.required, Validators.email],
      size: 24,
    },
    {
      label: 'Senha',
      name: 'password',
      type: {
        field: eDynamicField.INPUT,
        typeField: 'password',
      },
      showForgotPassword: true,
      forgotPasswordLink: 'forgot-password',
      validations: [Validators.required],
      size: 24,
    },
  ];

  @ViewChild(DynamicFormComponent) dynamicForm?: DynamicFormComponent;

  async login() {
    if (!this.dynamicForm?.form.valid) {
      this.notificationService.error('Erro', 'Preencha todos os campos corretamente');
      return;
    }

    const { email, password } = this.dynamicForm.form.value;

    const { error } = await this.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      this.notificationService.error('Erro ao fazer login', 'Verifique suas credenciais e tente novamente');
      return;
    }

    this.router.navigate(['/']);
  }
}
