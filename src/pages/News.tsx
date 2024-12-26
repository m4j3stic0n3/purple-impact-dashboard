import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Tabs, TabsContent, TabsList, TabsTrigger } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

const sampleNews = [
  {
    id: 1,
    title: "Renewable Energy Investment Surge",
    description: "Global investment in renewable energy reaches record high as sustainable technologies become more cost-effective.",
    category: "Clean Energy",
    date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  {
    id: 2,
    title: "ESG Funds Outperform Traditional Investments",
    description: "Environmental, Social, and Governance funds show strong performance in Q1 2024.",
    category: "ESG Investing",
    date: "2024-03-14",
    image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c"
  },
  {
    id: 3,
    title: "New Sustainable Technology Breakthrough",
    description: "Revolutionary carbon capture technology shows promising results in initial trials.",
    category: "Innovation",
    date: "2024-03-13",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  }
];

const savedArticles = [
  {
    id: 4,
    title: "Green Energy Revolution",
    description: "How renewable energy is reshaping the global economy and investment landscape.",
    category: "Sustainability",
    date: "2024-03-12",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9"
  },
  // Add more saved articles as needed
];

const News = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const handleBookmark = (id: number) => {
    toast({
      title: "Article Bookmarked",
      description: "The article has been saved to your bookmarks.",
    });
  };

  const handleShare = (id: number) => {
    toast({
      title: "Share Link Copied",
      description: "The article link has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-[#1A1F2C] text-white">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Impact Investment News</h1>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "all" ? "default" : "outline"}
                onClick={() => setActiveTab("all")}
                className="bg-purple-700 hover:bg-purple-600"
              >
                All News
              </Button>
              <Button
                variant={activeTab === "saved" ? "default" : "outline"}
                onClick={() => setActiveTab("saved")}
                className="bg-purple-700 hover:bg-purple-600"
              >
                Saved Articles
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6">
            {(activeTab === "all" ? sampleNews : savedArticles).map((article) => (
              <Card key={article.id} className="p-6 bg-[#2A2F3C]/60 backdrop-blur-lg border-purple-800">
                <div className="flex gap-6">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-sm text-purple-400">{article.category}</span>
                        <h2 className="text-xl font-semibold mt-1">{article.title}</h2>
                        <p className="text-gray-400 mt-2">{article.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleBookmark(article.id)}
                          className={`bg-purple-700 hover:bg-purple-600 ${activeTab === "saved" ? "text-yellow-400" : ""}`}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleShare(article.id)}
                          className="bg-purple-700 hover:bg-purple-600"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                      Published on {new Date(article.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default News;
