import { NewsArticleCard } from "./NewsArticleCard";

interface NewsTabContentProps {
  articles: Array<{
    id: number;
    title: string;
    source: string;
    date: string;
    category: string;
    summary: string;
    isSaved?: boolean;
  }>;
  category?: string;
}

export function NewsTabContent({ articles, category }: NewsTabContentProps) {
  const filteredArticles = category
    ? articles.filter((article) => article.category === category)
    : articles;

  return (
    <div className="space-y-4">
      {filteredArticles.map((article) => (
        <NewsArticleCard key={article.id} {...article} />
      ))}
    </div>
  );
}