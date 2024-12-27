export interface SavedArticle {
  id: string;
  user_id: string | null;
  article_id: number;
  created_at: string;
}

export interface SavedArticleInsert {
  article_id: number;
  created_at?: string;
  id?: string;
  user_id?: string | null;
}

export interface SavedArticleUpdate {
  article_id?: number;
  created_at?: string;
  id?: string;
  user_id?: string | null;
}