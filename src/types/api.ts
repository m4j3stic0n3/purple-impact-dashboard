export interface PolygonQuoteResponse {
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface BillingInfo {
  id: string;
  user_id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}