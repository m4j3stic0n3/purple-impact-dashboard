export interface Profile {
  id: string;
  user_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  billing_address: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_postal_code: string | null;
  billing_country: string | null;
  billing_updated: boolean | null;
}

export interface ProfileInsert {
  avatar_url?: string | null;
  billing_address?: string | null;
  billing_city?: string | null;
  billing_country?: string | null;
  billing_postal_code?: string | null;
  billing_state?: string | null;
  billing_updated?: boolean | null;
  created_at?: string;
  full_name?: string | null;
  id?: string;
  updated_at?: string;
  user_id?: string | null;
}

export interface ProfileUpdate {
  avatar_url?: string | null;
  billing_address?: string | null;
  billing_city?: string | null;
  billing_country?: string | null;
  billing_postal_code?: string | null;
  billing_state?: string | null;
  billing_updated?: boolean | null;
  created_at?: string;
  full_name?: string | null;
  id?: string;
  updated_at?: string;
  user_id?: string | null;
}