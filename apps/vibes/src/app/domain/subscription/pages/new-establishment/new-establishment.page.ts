import { Component, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { FormStorageDirective } from '@widget/directives/form-storage/form-storage.directive';
import { EstablishmentDetailsComponent } from '../../components/establishment-details/establishment-details.component';
import { SelectPlanComponent } from '../../components/select-plan/select-plan.component';
import { eSubscriptionStep } from '@domain/subscription/enums/subscription-step.enum';
import { SubscriptionService } from '@domain/subscription/services/subscription.service';

@Component({
  selector: 'v-new-establishment',
  standalone: true,
  imports: [ReactiveFormsModule, NzCardModule, NzStepsModule, FormStorageDirective, EstablishmentDetailsComponent, SelectPlanComponent],
  templateUrl: './new-establishment.page.html',
  styleUrl: './new-establishment.page.scss',
})
export class NewEstablishmentPage {
  private router = inject(Router);
  protected subscriptionService = inject(SubscriptionService);
  protected eSubscriptionStep = eSubscriptionStep;

  currentStep = signal<eSubscriptionStep>(eSubscriptionStep.ESTABLISHMENT);

  constructor() {
    effect(() => {
      if (this.currentStep() == eSubscriptionStep.SUBMIT) this.onSubmit();
    });
  }

  async onSubmit() {
    try {
      await this.subscriptionService.SendNewEstablishment();
      this.router.navigate(['/']);
    } catch (error) {
      // Erro já tratado pelo serviço
    }
  }
}
