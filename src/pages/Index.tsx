import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { RecommendedStock } from "@/components/RecommendedStock";
import { useQuery } from "@tanstack/react-query";
import { getStockQuote } from "@/services/stockService";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PortfolioComposition } from "@/components/PortfolioComposition";
import { useState, useEffect } from "react";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { WatchlistSection } from "@/components/WatchlistSection";
import { PerformanceChart } from "@/components/PerformanceChart";

const portfolioData = [
  { name: 'Stocks', value: 400 },
  { name: 'Bonds', value: 300 },
  { name: 'Real Estate', value: 300 },
  { name: 'Crypto', value: 200 },
];

const mockStockData = {
  LLY: {
    price: 598.42,
    change: 2.15,
    changePercent: 0.36,
  },
  PLTR: {
    price: 17.85,
    change: -0.25,
    changePercent: -1.38,
  }
};

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate('/login');
        return;
      }
      setUser(session.user);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const { data: llyData, error: llyError } = useQuery({
    queryKey: ['stock', 'LLY'],
    queryFn: () => getStockQuote('LLY'),
    refetchInterval: 120000, // 2 minutes
    staleTime: 60000, // 1 minute
    retry: 1,
    meta: {
      errorMessage: 'Failed to fetch LLY stock data'
    }
  });

  const { data: pltrData, error: pltrError } = useQuery({
    queryKey: ['stock', 'PLTR'],
    queryFn: () => getStockQuote('PLTR'),
    refetchInterval: 120000,
    staleTime: 60000,
    retry: 1,
    meta: {
      errorMessage: 'Failed to fetch PLTR stock data'
    }
  });

  const getStockData = (symbol: string, data: any, error: any) => {
    if (error || !data) {
      console.log(`Using mock data for ${symbol} due to error:`, error);
      return mockStockData[symbol];
    }
    return data;
  };

  const formatPrice = (data?: any) => {
    if (!data) return '$0.00';
    return `$${data.price.toFixed(2)}`;
  };

  const formatChange = (data?: any) => {
    if (!data) return '+$0.00 (0.00%)';
    const sign = data.change >= 0 ? '+' : '';
    return `${sign}$${data.change.toFixed(2)} (${sign}${data.changePercent.toFixed(2)}%)`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-dashboard-background text-white">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <DashboardMetrics />
          <WatchlistSection user={user} />

          <h2 className="text-xl font-semibold mt-8 mb-4">Recommended Stocks:</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecommendedStock
              name="Eli Lilly & Co"
              symbol="LLY"
              price={formatPrice(getStockData('LLY', llyData, llyError))}
              change={formatChange(getStockData('LLY', llyData, llyError))}
              changePercent={getStockData('LLY', llyData, llyError)?.changePercent ? 
                `${getStockData('LLY', llyData, llyError).changePercent.toFixed(2)}%` : '0.00%'}
              description="Eli Lilly has been a fantastic growth stock to own in recent years. Entering trading this week, its five-year returns have totaled more than 550%."
            />
            <RecommendedStock
              name="Palantir"
              symbol="PLTR"
              price={formatPrice(getStockData('PLTR', pltrData, pltrError))}
              change={formatChange(getStockData('PLTR', pltrData, pltrError))}
              changePercent={getStockData('PLTR', pltrData, pltrError)?.changePercent ? 
                `${getStockData('PLTR', pltrData, pltrError).changePercent.toFixed(2)}%` : '0.00%'}
              description="Palantir shares jumped 20% following its solid Q3 earnings results, in which it reported revenue of $726 million and adjusted earnings of $0.10 per share."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <PerformanceChart />
            <PortfolioComposition data={portfolioData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;