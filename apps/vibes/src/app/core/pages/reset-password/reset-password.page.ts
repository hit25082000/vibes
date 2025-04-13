import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InjectSupabase } from '@shared/functions/inject-supabase.function';
import { Router, RouterLink } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'v-reset-password',
  imports: [NzButtonComponent, NzFormModule, NzInputModule, FormsModule, RouterLink],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.scss',
})
export class ResetPasswordPage {
  private supabase = InjectSupabase();
  private notificationService = inject(NzNotificationService);
  private router = inject(Router);

  password = model('');

  async submit() {
    await this.supabase.auth.updateUser({ password: this.password() });
    this.notificationService.success('Senha alterada', 'Sua senha foi alterada com sucesso');

    this.password.set('');
    this.router.navigate(['/']);
  }
}
