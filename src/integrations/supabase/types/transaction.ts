export interface Transaction {
  id: string;
  user_id: string | null;
  symbol: string;
  type: string;
  quantity: number;
  price: number;
  total_amount: number;
  created_at: string;
}

export interface TransactionInsert {
  created_at?: string;
  id?: string;
  price: number;
  quantity: number;
  symbol: string;
  total_amount: number;
  type: string;
  user_id?: string | null;
}

export interface TransactionUpdate {
  created_at?: string;
  id?: string;
  price?: number;
  quantity?: number;
  symbol?: string;
  total_amount?: number;
  type?: string;
  user_id?: string | null;
}