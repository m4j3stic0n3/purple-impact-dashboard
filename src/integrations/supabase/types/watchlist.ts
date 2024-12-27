export interface Watchlist {
  id: string;
  user_id: string | null;
  symbol: string;
  created_at: string;
}

export interface WatchlistInsert {
  created_at?: string;
  id?: string;
  symbol: string;
  user_id?: string | null;
}

export interface WatchlistUpdate {
  created_at?: string;
  id?: string;
  symbol?: string;
  user_id?: string | null;
}