import { NzMessageService } from 'ng-zorro-antd/message';

import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@domain/auth/services/auth.service';

import { InjectSupabase } from '@shared/functions/inject-supabase.function';
import { eUserStatus } from '@domain/auth/enums/user-status.enum';
import { UserEstablishmentApi } from '../apis/user-establishment.api';
import { iEstablishment } from '@shared/interfaces/establishment.interface';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private authService = inject(AuthService);
  private supabase = InjectSupabase();
  private messageService = inject(NzMessageService);
  private userEstablishmentApi = inject(UserEstablishmentApi);
  private router = inject(Router);

  form = new FormGroup({
    admin: new FormGroup({
      name: new FormControl<string | null>(null),
      email: new FormControl<string | null>(null),
      phone: new FormControl<string | null>(null),
      password: new FormControl<string | null>(null),
    }),
    establishment: new FormGroup({
      name: new FormControl<string | null>(null),
      cnpj: new FormControl<string | null>(null),
      zip_code: new FormControl<string | null>(null),
      street: new FormControl<string | null>(null),
      number: new FormControl<string | null>(null),
      complement: new FormControl<string | null>(null),
      neighborhood: new FormControl<string | null>(null),
      city: new FormControl<string | null>(null),
      state: new FormControl<string | null>(null),
      country: new FormControl<string | null>(null),
    }),
    plan: new FormGroup({
      price_id: new FormControl<string | null>(null),
    }),
  });

  esteblishmentForm = new FormGroup({
    establishment: new FormGroup({
      name: new FormControl<string | null>(null),
      cnpj: new FormControl<string | null>(null),
      zip_code: new FormControl<string | null>(null),
      street: new FormControl<string | null>(null),
      number: new FormControl<string | null>(null),
      complement: new FormControl<string | null>(null),
      neighborhood: new FormControl<string | null>(null),
      city: new FormControl<string | null>(null),
      state: new FormControl<string | null>(null),
      country: new FormControl<string | null>(null),
    }),
    plan: new FormGroup({
      price_id: new FormControl<string | null>(null),
    }),
  });

  getAdminForm() {
    const form = this.form.get('admin') as FormGroup;

    return form;
  }

  getEstablishmentForm() {
    let form = this.form.get('establishment') as FormGroup;

    if (form == null) {
      form = this.esteblishmentForm.get('establishment') as FormGroup;
    }

    return form;
  }

  getPlanForm() {
    let form = this.form.get('plan') as FormGroup;

    if (form == null) {
      form = this.esteblishmentForm.get('plan') as FormGroup;
    }

    return form;
  }

  async SendSubcription() {
    try {
      const { price_id } = this.getPlanForm().getRawValue();
      if (!price_id) throw new Error('O plano é obrigatório.');

      await this.createAdminUser(this.getAdminForm());
      const establishment = await this.createEstablishment(this.getEstablishmentForm());
      await this.createSubscription(establishment.id, price_id);

      this.router.navigate(['/']);
      this.form.reset();
    } catch (error: unknown) {
      if (error instanceof Error) this.messageService.error(error.message);
      else this.messageService.error('Erro ao criar assinatura' + error);
    }
  }

  async SendNewEstablishment() {
    try {
      const { price_id } = (this.esteblishmentForm.get('plan') as FormGroup).getRawValue();
      if (!price_id) throw new Error('O plano é obrigatório.');

      const establishment = await this.createEstablishment(this.esteblishmentForm.get('establishment') as FormGroup);
      await this.createSubscription(establishment.id, price_id);

      this.router.navigate(['/']);
      this.form.reset();
    } catch (error: unknown) {
      if (error instanceof Error) this.messageService.error(error.message);
      else this.messageService.error('Erro ao criar assinatura' + error);
    }
  }

  async createAdminUser(form: FormGroup<any>) {
    const formValues = form.getRawValue();
    const { name, email, phone, password } = formValues;

    const payload = {
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
        },
      },
    };

    const { data, error: signUpError } = await this.supabase.auth.signUp(payload);
    await this.authService.login(password, email);

    if (signUpError || !data.user) {
      throw new Error(signUpError?.message === 'User already registered' ? 'Usuário já cadastrado' : 'Erro ao cadastrar usuário');
    }
    const newUser = data.user;
    await this.authService.updateUser({ phone, status: eUserStatus.ACTIVE }, newUser.id);
    await this.authService.load();

    return newUser;
  }

  async createEstablishment(form: FormGroup<any>) {
    const formValues = form.getRawValue();
    const { name, cnpj, zip_code, street, number, complement, neighborhood, city, state, country } = formValues;

    const payload = {
      name,
      cnpj,
      address: {
        zip_code,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        country,
      },
    };

    const { data, error } = await this.supabase.from('establishments').insert(payload).select('*').returns<iEstablishment>().single();
    if (error) throw new Error('Erro ao cadastrar empresa');
    const establishment = data as iEstablishment;

    const user_id = this.authService.currentUser()?.id;
    if (!user_id) throw new Error('Usuário não encontrado');

    const userEstablishmentPayload = {
      establishment_id: establishment.id,
      user_id,
    };

    const { error: userEstablishmentError } = await this.userEstablishmentApi.insert(userEstablishmentPayload);
    if (userEstablishmentError) throw new Error('Erro ao vincular usuário a empresa' + userEstablishmentError);

    return establishment;
  }

  async createSubscription(establishment_id: string, price_id: string) {
    const user = this.authService.currentUser();
    if (!user) throw new Error('Usuário não encontrado');

    const payload = {
      establishment_id,
      price_id,
      name: user.fullname,
      email: user.email,
      phone: user.phone,
    };

    const { data, error } = await this.supabase.functions.invoke('create_subscription', {
      body: JSON.stringify(payload),
    });
    if (error) throw new Error('Erro ao cadastrar assinatura');

    return data;
  }
}
