import { Calendar, Target } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MetricCard } from "@/components/MetricCard";
import { RecommendedStock } from "@/components/RecommendedStock";
import { Card } from "@/components/ui/card";
import { GeminiChat } from "@/components/GeminiChat";
import { useQuery } from "@tanstack/react-query";
import { getStockQuote } from "@/services/polygonService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const portfolioData = [
  { name: 'Stocks', value: 400 },
  { name: 'Bonds', value: 300 },
  { name: 'Real Estate', value: 300 },
  { name: 'Crypto', value: 200 },
];

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#3a108c'];

const Index = () => {
  const { data: llyData } = useQuery({
    queryKey: ['stock', 'LLY'],
    queryFn: () => getStockQuote('LLY'),
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: pltrData } = useQuery({
    queryKey: ['stock', 'PLTR'],
    queryFn: () => getStockQuote('PLTR'),
    refetchInterval: 60000,
  });

  const formatPrice = (price?: number) => {
    return price ? `$${price.toFixed(2)}` : 'Loading...';
  };

  const formatChange = (change?: number, changePercent?: number) => {
    if (!change || !changePercent) return 'Loading...';
    const sign = change >= 0 ? '+' : '';
    return `${sign}$${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background text-white">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Next Earnings Report"
                value="WMT Q1 FY 2025"
                icon={<Calendar className="w-6 h-6" />}
              />
              <MetricCard
                title="Sustainability Score"
                value="87/100"
                icon={<Target className="w-6 h-6" />}
              />
              <MetricCard
                title="Portfolio Value"
                value="$87,649.51"
                subtitle="0.12% (+$105.18)"
                className="text-success"
              />
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Recommended Stocks:</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecommendedStock
                name="Eli Lilly & Co"
                symbol="LLY"
                price={formatPrice(llyData?.price)}
                change={formatChange(llyData?.change, llyData?.changePercent)}
                changePercent={llyData?.changePercent ? `${llyData.changePercent.toFixed(2)}%` : 'Loading...'}
                description="Eli Lilly has been a fantastic growth stock to own in recent years. Entering trading this week, its five-year returns have totaled more than 550%."
              />
              <RecommendedStock
                name="Palantir"
                symbol="PLTR"
                price={formatPrice(pltrData?.price)}
                change={formatChange(pltrData?.change, pltrData?.changePercent)}
                changePercent={pltrData?.changePercent ? `${pltrData.changePercent.toFixed(2)}%` : 'Loading...'}
                description="Palantir shares jumped 20% following its solid Q3 earnings results, in which it reported revenue of $726 million and adjusted earnings of $0.10 per share."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #333',
                          borderRadius: '4px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#9b87f5" 
                        strokeWidth={2}
                        dot={{ fill: '#9b87f5' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Portfolio Composition</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #333',
                          borderRadius: '4px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="mt-6">
              <GeminiChat />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;