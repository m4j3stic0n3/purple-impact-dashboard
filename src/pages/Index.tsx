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
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 1,
    meta: {
      errorMessage: 'Failed to fetch LLY stock data'
    }
  });

  // Fetch PLTR stock data using Polygon API
  const { data: pltrData, error: pltrError } = useQuery({
    queryKey: ['stock', 'PLTR'],
    queryFn: () => getStockQuoteFromPolygon('PLTR'),
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 1,
    meta: {
      errorMessage: 'Failed to fetch PLTR stock data'
    }
  });

  // Debug logs for component rendering and data
  useEffect(() => {
    console.log('Index component rendered');
    console.log('User:', user);
    console.log('LLY Data:', llyData);
    if (llyError) console.error('LLY Error:', llyError);
    if (pltrError) console.error('PLTR Error:', pltrError);
  }, [user, llyData, llyError, pltrData, pltrError]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#1A0B2E]">
        <DashboardSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Top Section with Metrics and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardMetrics />
                <div className="mt-6">
                  <PerformanceChart />
                </div>
              </div>
              <div className="lg:col-span-1">
                <PortfolioComposition data={portfolioData} />
              </div>
            </div>

            {/* Watchlist Section */}
            <div className="mt-8">
              {user && <WatchlistSection user={user} />}
            </div>

            {/* Recommended Stocks */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recommended Stocks:</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RecommendedStock
                  name="Eli Lilly & Co"
                  symbol="LLY"
                  price={`$795.35`}
                  change={`+7.16`}
                  changePercent={`0.91%`}
                  description="Eli Lilly has been a fantastic growth stock to own in recent years. Entering trading this week, its five-year returns have totaled more than 550%."
                  logo="https://companieslogo.com/img/orig/LLY-0d650b8a.png?t=1633508957"
                />
                <RecommendedStock
                  name="Palantir"
                  symbol="PLTR"
                  price={`$67.08`}
                  change={`+1.03`}
                  changePercent={`1.56%`}
                  description="Palantir shares jumped 20% following its solid Q3 earnings results, in which it reported revenue of $726 million."
                  logo="https://companieslogo.com/img/orig/PLTR-c1b7c9e2.png?t=1677157547"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;