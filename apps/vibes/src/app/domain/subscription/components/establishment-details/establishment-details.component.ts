import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { debounceTime } from 'rxjs';

import { AfterViewInit, Component, inject, model, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { eSubscriptionStep } from '@domain/subscription/enums/subscription-step.enum';
import { SubscriptionService } from '@domain/subscription/services/subscription.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { iDynamicFormConfig } from '@widget/components/dynamic-form/dynamic-form-config.interface';
import { DynamicFormComponent } from '@widget/components/dynamic-form/dynamic-form.component';
import { Establishment_FORM_CONFIG } from '@domain/subscription/constants/establishment-form-config.constant';

@UntilDestroy()
@Component({
  selector: 'v-establishment-details',
  imports: [DynamicFormComponent, NzButtonModule, NzFlexModule, NzIconModule, NzTypographyModule, RouterModule],
  templateUrl: './establishment-details.component.html',
  styleUrl: './establishment-details.component.scss',
})
export class EstablishmentDetailsComponent implements AfterViewInit {
  private subscriptionService = inject(SubscriptionService);

  step = model.required<eSubscriptionStep>();

  formConfig: iDynamicFormConfig[] = Establishment_FORM_CONFIG();

  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  ngAfterViewInit(): void {
    this.dynamicForm?.form.statusChanges.pipe(untilDestroyed(this), debounceTime(300)).subscribe(() => {
      const form = this.subscriptionService.getEstablishmentForm();
      form.patchValue(this.dynamicForm.form.getRawValue());
    });

    this.dynamicForm.form.patchValue(this.subscriptionService.getEstablishmentForm().getRawValue());
  }

  previousStep() {
    this.step.set(eSubscriptionStep.ADMIN);
  }

  nextStep() {
    this.step.set(eSubscriptionStep.PLAN);
  }
}
