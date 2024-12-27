export interface PortfolioTables {
  portfolio_holdings: {
    Row: {
      id: string
      user_id: string | null
      symbol: string
      quantity: number
      average_price: number
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id?: string | null
      symbol: string
      quantity?: number
      average_price?: number
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string | null
      symbol?: string
      quantity?: number
      average_price?: number
      created_at?: string
      updated_at?: string
    }
    Relationships: []
  }
}