import { Injectable } from '@angular/core';
import { BaseApi } from '@shared/apis/base.api';
import { iUserEstablishment } from '../interfaces/user-establishment.interface';

@Injectable({
  providedIn: 'root',
})
export class UserEstablishmentApi extends BaseApi<iUserEstablishment> {
  constructor() {
    super('user_establishment');
  }
}
