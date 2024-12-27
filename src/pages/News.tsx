import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const newsArticles = [
  {
    id: 1,
    title: "Tesla's New Battery Technology Breakthrough",
    source: "TechCrunch",
    date: "2024-02-15",
    category: "Technology",
    summary: "Tesla announces revolutionary new battery technology that could increase range by 50%..."
  },
  {
    id: 2,
    title: "Federal Reserve Holds Interest Rates Steady",
    source: "Bloomberg",
    date: "2024-02-14",
    category: "Economy",
    summary: "The Federal Reserve maintains current interest rates, signals potential cuts later this year..."
  },
  {
    id: 3,
    title: "Apple's AI Strategy Revealed",
    source: "Reuters",
    date: "2024-02-13",
    category: "Technology",
    summary: "Apple's ambitious plans for AI integration across its product lineup detailed in new report..."
  },
  {
    id: 4,
    title: "Green Energy Investment Surge",
    source: "Financial Times",
    date: "2024-02-12",
    category: "ESG",
    summary: "Global investment in renewable energy projects reaches record high in Q4 2023..."
  },
  {
    id: 5,
    title: "Cryptocurrency Market Analysis",
    source: "CoinDesk",
    date: "2024-02-11",
    category: "Crypto",
    summary: "Bitcoin and major altcoins show strong recovery amid institutional adoption..."
  }
];

const News = () => {
  const [savedArticles, setSavedArticles] = useState<number[]>([]);

  const handleSaveArticle = async (articleId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to save articles",
          variant: "destructive",
        });
        return;
      }

      if (savedArticles.includes(articleId)) {
        setSavedArticles(savedArticles.filter(id => id !== articleId));
        toast({
          title: "Success",
          description: "Article removed from saved articles",
        });
      } else {
        setSavedArticles([...savedArticles, articleId]);
        toast({
          title: "Success",
          description: "Article saved successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background text-white">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Market News & Analysis</h1>
            
            <Tabs defaultValue="all" className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All News</TabsTrigger>
                <TabsTrigger value="saved">Saved Articles</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="economy">Economy</TabsTrigger>
                <TabsTrigger value="esg">ESG</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {newsArticles.map((article) => (
                  <Card key={article.id} className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {article.source} • {article.date} • {article.category}
                        </p>
                        <p className="text-gray-300">{article.summary}</p>
                      </div>
                      <button 
                        className={`p-2 hover:bg-purple-700/20 rounded-full ${
                          savedArticles.includes(article.id) ? 'text-purple-400' : ''
                        }`}
                        onClick={() => handleSaveArticle(article.id)}
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                {newsArticles
                  .filter(article => savedArticles.includes(article.id))
                  .map((article) => (
                    <Card key={article.id} className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {article.source} • {article.date} • {article.category}
                          </p>
                          <p className="text-gray-300">{article.summary}</p>
                        </div>
                        <button 
                          className="p-2 hover:bg-purple-700/20 rounded-full text-purple-400"
                          onClick={() => handleSaveArticle(article.id)}
                        >
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="technology" className="space-y-4">
                {newsArticles
                  .filter((article) => article.category === "Technology")
                  .map((article) => (
                    <Card key={article.id} className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {article.source} • {article.date} • {article.category}
                          </p>
                          <p className="text-gray-300">{article.summary}</p>
                        </div>
                        <button className="p-2 hover:bg-purple-700/20 rounded-full">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="economy" className="space-y-4">
                {newsArticles
                  .filter((article) => article.category === "Economy")
                  .map((article) => (
                    <Card key={article.id} className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {article.source} • {article.date} • {article.category}
                          </p>
                          <p className="text-gray-300">{article.summary}</p>
                        </div>
                        <button className="p-2 hover:bg-purple-700/20 rounded-full">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="esg" className="space-y-4">
                {newsArticles
                  .filter((article) => article.category === "ESG")
                  .map((article) => (
                    <Card key={article.id} className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {article.source} • {article.date} • {article.category}
                          </p>
                          <p className="text-gray-300">{article.summary}</p>
                        </div>
                        <button className="p-2 hover:bg-purple-700/20 rounded-full">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="crypto" className="space-y-4">
                {newsArticles
                  .filter((article) => article.category === "Crypto")
                  .map((article) => (
                    <Card key={article.id} className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {article.source} • {article.date} • {article.category}
                          </p>
                          <p className="text-gray-300">{article.summary}</p>
                        </div>
                        <button className="p-2 hover:bg-purple-700/20 rounded-full">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default News;
