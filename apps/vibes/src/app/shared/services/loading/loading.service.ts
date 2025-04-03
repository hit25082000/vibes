import { signal } from '@angular/core';

export class LoadingService {
  loading = signal(false);

  start() {
    this.loading.set(true);
  }

  stop() {
    this.loading.set(false);
  }
}
