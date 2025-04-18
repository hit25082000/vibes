import { Component, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ReactiveFormsModule } from '@angular/forms';
import { FormStorageDirective } from '@widget/directives/form-storage/form-storage.directive';
import { EstablishmentDetailsComponent } from '../../components/establishment-details/establishment-details.component';
import { SelectPlanComponent } from '../../components/select-plan/select-plan.component';
import { AdminDetailsComponent } from '../../components/admin-details/admin-details.component';
import { SubscriptionService } from '../../services/subscription.service';
import { eSubscriptionStep } from '@domain/subscription/enums/subscription-step.enum';

@Component({
  selector: 'v-subscription',
  standalone: true,
  imports: [ReactiveFormsModule, NzCardModule, NzStepsModule, FormStorageDirective, AdminDetailsComponent, EstablishmentDetailsComponent, SelectPlanComponent],
  templateUrl: './subscription.page.html',
  styleUrl: 'subscription.page.scss',
})
export class SubscriptionPage {
  private router = inject(Router);
  protected subscriptionService = inject(SubscriptionService);
  protected eSubscriptionStep = eSubscriptionStep;

  currentStep = signal<eSubscriptionStep>(eSubscriptionStep.ADMIN);

  constructor() {
    effect(() => {
      if (this.currentStep() == eSubscriptionStep.SUBMIT) this.onSubmit();
    });
  }

  async onSubmit() {
    try {
      await this.subscriptionService.SendSubcription();
      this.router.navigate(['/']);
    } catch (error) {
      // Erro já tratado pelo serviço
    }
  }
}
