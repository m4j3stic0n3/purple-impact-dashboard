import { Calendar, Target, Star, Trash2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MetricCard } from "@/components/MetricCard";
import { RecommendedStock } from "@/components/RecommendedStock";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStockQuote } from "@/services/polygonService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { PortfolioComposition } from "@/components/PortfolioComposition";
import { useState } from "react";

const PORTFOLIO_VALUE = 87649.51;

const portfolioData = [
  { name: 'Stocks', value: 400 },
  { name: 'Bonds', value: 300 },
  { name: 'Real Estate', value: 300 },
  { name: 'Crypto', value: 200 },
];

const generatePerformanceData = () => {
  // Simulate daily fluctuations based on the actual portfolio value
  return Array.from({ length: 30 }, (_, i) => {
    const randomFluctuation = (Math.random() - 0.5) * 0.02; // ±1% daily change
    const value = PORTFOLIO_VALUE * (1 + randomFluctuation);
    return {
      name: `Day ${i + 1}`,
      value: Math.round(value)
    };
  });
};

const Index = () => {
  const queryClient = useQueryClient();
  const [watchlistItems, setWatchlistItems] = useState([]);

  // Fetch watchlist items
  const { data: watchlistData } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Delete watchlist item mutation
  const deleteWatchlistItem = useMutation({
    mutationFn: async (symbol: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user?.id)
        .eq('symbol', symbol);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast({
        title: "Success",
        description: "Stock removed from watchlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove stock from watchlist",
        variant: "destructive",
      });
    },
  });

  const { data: llyData } = useQuery({
    queryKey: ['stock', 'LLY'],
    queryFn: () => getStockQuote('LLY'),
    refetchInterval: 120000,
    staleTime: 60000,
  });

  const { data: pltrData } = useQuery({
    queryKey: ['stock', 'PLTR'],
    queryFn: () => getStockQuote('PLTR'),
    refetchInterval: 120000,
    staleTime: 60000,
  });

  // Fetch data for watchlist stocks
  const watchlistQueries = watchlistData?.map(item => ({
    ...item,
    ...useQuery({
      queryKey: ['stock', item.symbol],
      queryFn: () => getStockQuote(item.symbol),
      refetchInterval: 120000,
      staleTime: 60000,
    })
  })) || [];

  const performanceData = generatePerformanceData();

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
                value={`$${PORTFOLIO_VALUE.toLocaleString()}`}
                subtitle="0.12% (+$105.18)"
                className="text-success"
              />
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Watchlist:</h2>
            <div className="grid gap-4 mb-8">
              {watchlistQueries.map((stock) => (
                <Card 
                  key={stock.symbol} 
                  className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800 group relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <div>
                        <h4 className="font-semibold">{stock.symbol}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {stock.isLoading ? (
                        <div>Loading...</div>
                      ) : stock.error ? (
                        <div>Error loading price</div>
                      ) : (
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            ${stock.data?.price.toFixed(2)}
                          </p>
                          <p className={`text-sm ${stock.data?.change >= 0 ? 'text-success' : 'text-red-500'}`}>
                            {stock.data?.change >= 0 ? '+' : ''}{stock.data?.change.toFixed(2)} 
                            ({stock.data?.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => deleteWatchlistItem.mutate(stock.symbol)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-red-500/10 rounded-full"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
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
              <PortfolioComposition data={portfolioData} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;