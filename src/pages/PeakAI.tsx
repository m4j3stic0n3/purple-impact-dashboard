import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send } from "lucide-react";

const PeakAI = () => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I am PeakAI, your personal investment assistant. How can I help you today?'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    setConversation(prev => [...prev, { role: 'user', content: query }]);
    
    // Simulate AI response
    setTimeout(() => {
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: `I understand you're interested in ${query}. Based on your interest in sustainable investing, I would recommend looking into companies with strong ESG scores in this sector. Would you like me to provide more specific recommendations?`
      }]);
    }, 1000);

    setQuery("");
  };

  return (
    <div className="min-h-screen flex w-full bg-dashboard-background text-white">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dashboard-card/60 backdrop-blur-lg border-gray-800 p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">PeakAI Assistant</h1>
            <p className="text-gray-300">
              Your personal AI assistant for sustainable investment research and recommendations.
            </p>
          </Card>

          <Card className="bg-dashboard-card/60 backdrop-blur-lg border-gray-800 p-6 min-h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white ml-4'
                        : 'bg-gray-800 text-gray-100 mr-4'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about sustainable investments..."
                className="flex-1 bg-gray-800 border-gray-700 text-white"
              />
              <Button type="submit" className="bg-primary hover:bg-primary-dark">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PeakAI;