import { inject, Injectable, signal, Signal } from '@angular/core';
import { iUser } from '../interfaces/user.interface';
import { InjectSupabase } from '@shared/functions/inject-supabase.function';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase = InjectSupabase();
  private router = inject(Router);

  currentUser = signal<iUser | null>(null);
  isLoggedIn = signal<boolean>(false);

  async load() {
    const { data } = await this.supabase.auth.getSession();
    if (!data.session) {
      await this.purgeAndRedirect();
      return;
    }

    this.currentUser.set(data.session.user as unknown as iUser);
    this.isLoggedIn.set(true);
  }

  async purgeAndRedirect() {
    await this.supabase.auth.signOut();
    this.router.navigate(['/auth']);
  }
}
