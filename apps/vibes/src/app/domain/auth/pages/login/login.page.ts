import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Component, inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme/theme.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { InjectSupabase } from '@shared/functions/inject-supabase.function';
import { RouterLink } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'v-login',
  imports: [NzButtonComponent, NzFormModule, NzInputModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private themeService = inject(ThemeService);
  private supabase = InjectSupabase();
  private notificationService = inject(NzNotificationService);
  private router = inject(Router);
  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async login() {
    if (!this.loginForm.valid) {
      this.notificationService.error('Erro', 'Preencha todos os campos corretamente');
      return;
    }

    const { email, password } = this.loginForm.value;

    const { error } = await this.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      this.notificationService.error('Erro ao fazer login', 'Verifique suas credenciais e tente novamente');
      return;
    }

    this.router.navigate(['/']);
  }
}
