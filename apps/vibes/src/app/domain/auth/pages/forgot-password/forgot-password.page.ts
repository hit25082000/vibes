import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InjectSupabase } from '@shared/functions/inject-supabase.function';
import { RouterLink } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoadingService } from '@shared/services/loading/loading.service';

@Component({
  selector: 'v-forgot-password',
  imports: [NzButtonComponent, NzFormModule, NzInputModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
})
export class ForgotPasswordPage {
  private supabase = InjectSupabase();
  private notificationService = inject(NzNotificationService);
  protected loadingService = inject(LoadingService);

  email = model('');

  async submit() {
    this.loadingService.start();
    await this.supabase.auth.resetPasswordForEmail(this.email());

    this.notificationService.success('Email enviado', 'Verifique sua caixa de entrada');

    this.email.set('');
    this.loadingService.stop();
  }
}
