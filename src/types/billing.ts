export interface BillingFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SavedCard {
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
}