export interface ProfileTables {
  profiles: {
    Row: {
      id: string
      user_id: string | null
      full_name: string | null
      avatar_url: string | null
      created_at: string
      updated_at: string
      billing_address: string | null
      billing_city: string | null
      billing_state: string | null
      billing_postal_code: string | null
      billing_country: string | null
      billing_updated: boolean | null
    }
    Insert: {
      id?: string
      user_id?: string | null
      full_name?: string | null
      avatar_url?: string | null
      created_at?: string
      updated_at?: string
      billing_address?: string | null
      billing_city?: string | null
      billing_state?: string | null
      billing_postal_code?: string | null
      billing_country?: string | null
      billing_updated?: boolean | null
    }
    Update: {
      id?: string
      user_id?: string | null
      full_name?: string | null
      avatar_url?: string | null
      created_at?: string
      updated_at?: string
      billing_address?: string | null
      billing_city?: string | null
      billing_state?: string | null
      billing_postal_code?: string | null
      billing_country?: string | null
      billing_updated?: boolean | null
    }
    Relationships: []
  }
}