export interface IEstablishmentWithPlan {
  establishment: {
    name: string;
    cnpj: string;
    address: {
      zip_code: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
    };
  };
  plan: {
    price_id: string;
  };
}
