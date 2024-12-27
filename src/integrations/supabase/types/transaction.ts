export interface TransactionTables {
  transactions: {
    Row: {
      id: string
      user_id: string | null
      symbol: string
      type: string
      quantity: number
      price: number
      total_amount: number
      created_at: string
    }
    Insert: {
      id?: string
      user_id?: string | null
      symbol: string
      type: string
      quantity: number
      price: number
      total_amount: number
      created_at?: string
    }
    Update: {
      id?: string
      user_id?: string | null
      symbol?: string
      type?: string
      quantity?: number
      price?: number
      total_amount?: number
      created_at?: string
    }
    Relationships: []
  }
}