export interface WatchlistTables {
  watchlist: {
    Row: {
      id: string
      user_id: string | null
      symbol: string
      created_at: string
    }
    Insert: {
      id?: string
      user_id?: string | null
      symbol: string
      created_at?: string
    }
    Update: {
      id?: string
      user_id?: string | null
      symbol?: string
      created_at?: string
    }
    Relationships: []
  }
}