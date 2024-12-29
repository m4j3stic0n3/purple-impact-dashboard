import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { RecommendedStock } from "@/components/RecommendedStock";
import { useQuery } from "@tanstack/react-query";
import { getStockQuote } from "@/services/polygonService";
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

  const formatPrice = (price?: number) => {
    return price ? `$${price.toFixed(2)}` : 'Loading...';
  };

  const formatChange = (change?: number, changePercent?: number) => {
    if (!change || !changePercent) return 'Loading...';
    const sign = change >= 0 ? '+' : '';
    return `${sign}$${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
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
            <PerformanceChart />
            <PortfolioComposition data={portfolioData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;