import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsApi } from '@domain/subscription/apis/products.api';
import { eSubscriptionStep } from '@domain/subscription/enums/subscription-step.enum';
import { iPrice } from '@domain/subscription/interfaces/price.interface';
import { iProduct } from '@domain/subscription/interfaces/product.interface';
import { SubscriptionService } from '@domain/subscription/services/subscription.service';
import { LoadingService } from '@shared/services/loading/loading.service';

interface iProductWithPrice extends iProduct {
  price: iPrice | null;
}

@Component({
  selector: 'v-select-plan',
  imports: [CurrencyPipe, FormsModule, NzButtonModule, NzCardModule, NzFlexModule, NzIconModule, NzRadioModule, NzSpinModule, NzTagModule, NzTypographyModule, RouterModule],
  templateUrl: './select-plan.component.html',
  styleUrl: './select-plan.component.scss',
  providers: [LoadingService],
})
export class SelectPlanComponent implements OnInit, AfterViewInit {
  private productsApi = inject(ProductsApi);
  private subscriptionService = inject(SubscriptionService);
  protected loadingService = inject(LoadingService);

  step = model.required<eSubscriptionStep>();

  selectedPrice = '';
  products = signal<iProductWithPrice[]>([]);

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    const planForm = this.subscriptionService.getPlanForm();
    const price_id = planForm.get('price_id')?.value;

    if (price_id) this.selectedPrice = price_id;
  }

  async load() {
    this.loadingService.start();

    const products = await this.productsApi.getAll();
    this.products.set(
      products.map((product: any) => {
        const price = product.prices ? product.prices[0] : null;
        return { ...product, price };
      }),
    );

    if (products.length > 0 && !this.selectedPrice) this.selectedPrice = this.products()[0].price?.id || '';

    this.loadingService.stop();
  }

  changePlan(id?: string) {
    if (!id) return;

    this.selectedPrice = id;

    const planForm = this.subscriptionService.getPlanForm();
    planForm.get('price_id')?.setValue(id);
  }

  previousStep() {
    this.step.set(eSubscriptionStep.ESTABLISHMENT);
  }

  nextStep() {
    this.step.set(eSubscriptionStep.SUBMIT);
  }
}
