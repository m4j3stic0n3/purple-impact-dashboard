import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NewsTabContent } from "@/components/NewsTabContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const { data: savedArticles } = useQuery({
    queryKey: ['saved-articles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_articles')
        .select('article_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      return data.map(item => item.article_id);
    }
  });

  const articles = newsArticles.map(article => ({
    ...article,
    isSaved: savedArticles?.includes(article.id)
  }));

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

              <TabsContent value="all">
                <NewsTabContent articles={articles} />
              </TabsContent>

              <TabsContent value="saved">
                <NewsTabContent 
                  articles={articles.filter(article => article.isSaved)} 
                />
              </TabsContent>

              <TabsContent value="technology">
                <NewsTabContent articles={articles} category="Technology" />
              </TabsContent>

              <TabsContent value="economy">
                <NewsTabContent articles={articles} category="Economy" />
              </TabsContent>

              <TabsContent value="esg">
                <NewsTabContent articles={articles} category="ESG" />
              </TabsContent>

              <TabsContent value="crypto">
                <NewsTabContent articles={articles} category="Crypto" />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default News;
