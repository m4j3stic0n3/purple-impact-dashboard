import { Card } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NewsArticleCardProps {
  id: number;
  title: string;
  source: string;
  date: string;
  category: string;
  summary: string;
  isSaved?: boolean;
}

export function NewsArticleCard({
  id,
  title,
  source,
  date,
  category,
  summary,
  isSaved = false,
}: NewsArticleCardProps) {
  const [isArticleSaved, setIsArticleSaved] = useState(isSaved);

  const handleSaveArticle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to save articles",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isArticleSaved) {
        const { error } = await supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', id);

        if (error) throw error;
        setIsArticleSaved(false);
        toast({
          title: "Success",
          description: "Article removed from saved articles",
        });
      } else {
        const { error } = await supabase
          .from('saved_articles')
          .insert([{ user_id: user.id, article_id: id }]);

        if (error) throw error;
        setIsArticleSaved(true);
        toast({
          title: "Success",
          description: "Article saved successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update saved articles",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-400 mb-2">
            {source} • {date} • {category}
          </p>
          <p className="text-gray-300">{summary}</p>
        </div>
        <button 
          className={`p-2 hover:bg-purple-700/20 rounded-full ${
            isArticleSaved ? 'text-purple-400' : ''
          }`}
          onClick={handleSaveArticle}
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
}