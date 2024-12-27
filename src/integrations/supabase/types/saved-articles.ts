export interface SavedArticlesTables {
  saved_articles: {
    Row: {
      id: string
      user_id: string | null
      article_id: number
      created_at: string
    }
    Insert: {
      id?: string
      user_id?: string | null
      article_id: number
      created_at?: string
    }
    Update: {
      id?: string
      user_id?: string | null
      article_id?: number
      created_at?: string
    }
    Relationships: []
  }
}