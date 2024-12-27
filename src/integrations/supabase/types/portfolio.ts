export interface PortfolioHolding {
  id: string;
  user_id: string | null;
  symbol: string;
  quantity: number;
  average_price: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioHoldingInsert {
  average_price?: number;
  created_at?: string;
  id?: string;
  quantity?: number;
  symbol: string;
  updated_at?: string;
  user_id?: string | null;
}

export interface PortfolioHoldingUpdate {
  average_price?: number;
  created_at?: string;
  id?: string;
  quantity?: number;
  symbol?: string;
  updated_at?: string;
  user_id?: string | null;
}