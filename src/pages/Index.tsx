import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@supabase/auth-helpers-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { WatchlistSection } from "@/components/WatchlistSection";
import { RecommendedStock } from "@/components/RecommendedStock";
import { PerformanceChart } from "@/components/PerformanceChart";
import { PortfolioComposition } from "@/components/PortfolioComposition";
import { getStockQuoteFromPolygon } from "@/services/polygonService";
import { SidebarProvider } from "@/components/ui/sidebar";

// Sample portfolio data for demonstration
const portfolioData = [
  { name: 'Berkshire Hathaway B', value: 30 },
  { name: 'Dupont', value: 20 },
  { name: 'Morgan Stanley', value: 15 },
  { name: 'Alphabet Inc.', value: 15 },
  { name: 'Bank of America', value: 12 },
  { name: 'Other', value: 8 }
];

const Index = () => {
  const user = useUser();

  // Fetch LLY stock data using Polygon API
  const { data: llyData, error: llyError } = useQuery({
    queryKey: ['stock', 'LLY'],
    queryFn: () => getStockQuoteFromPolygon('LLY'),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 1,
    meta: {
      errorMessage: 'Failed to fetch LLY stock data'
    }
  });

  // Debug logs for component rendering and data
  useEffect(() => {
    console.log('Index component rendered');
    console.log('User:', user);
    console.log('LLY Data:', llyData);
    if (llyError) console.error('LLY Error:', llyError);
  }, [user, llyData, llyError]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#1A0B2E]">
        <DashboardSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <DashboardMetrics />
                <PerformanceChart />
              </div>
              <PortfolioComposition data={portfolioData} />
            </div>
            
            {user && <WatchlistSection user={user} />}

            <h2 className="text-xl font-semibold mt-8 mb-4 text-white">Recommended Stock:</h2>
            <div className="grid grid-cols-1 gap-6">
              <RecommendedStock
                name="Eli Lilly & Co"
                symbol="LLY"
                price={llyData?.price ? `$${llyData.price.toFixed(2)}` : '$0.00'}
                change={llyData?.change ? `${llyData.change > 0 ? '+' : ''}${llyData.change.toFixed(2)}` : '+0.00'}
                changePercent={llyData?.changePercent ? `${llyData.changePercent.toFixed(2)}%` : '0.00%'}
                description="Eli Lilly has been a fantastic growth stock to own in recent years. Entering trading this week, its five-year returns have totaled more than 550%."
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;