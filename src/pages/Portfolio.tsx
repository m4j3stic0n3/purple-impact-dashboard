import { Card } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const samplePortfolioData = [
  { name: 'Clean Energy', value: 35000, growth: 12.5 },
  { name: 'Sustainable Tech', value: 28000, growth: 8.2 },
  { name: 'Green Buildings', value: 22000, growth: -2.1 },
  { name: 'Water Tech', value: 18000, growth: 5.4 },
  { name: 'Circular Economy', value: 15000, growth: 9.8 },
];

const Portfolio = () => {
  const handleInvest = (sector: string) => {
    toast({
      title: "Investment Simulated",
      description: `You've simulated investing in ${sector}`,
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-[#1A1F2C] text-white">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Impact Portfolio</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-[#2A2F3C]/60 backdrop-blur-lg border-purple-800">
              <h3 className="text-xl font-semibold mb-4">Portfolio Performance</h3>
              <div className="h-[300px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={samplePortfolioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#9b87f5" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>

            <div className="grid gap-4">
              {samplePortfolioData.map((item) => (
                <Card key={item.name} className="p-4 bg-[#2A2F3C]/60 backdrop-blur-lg border-purple-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-400">${item.value.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center ${item.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.growth >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {Math.abs(item.growth)}%
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => handleInvest(item.name)}
                        className="bg-purple-700 hover:bg-purple-600"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Invest
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;