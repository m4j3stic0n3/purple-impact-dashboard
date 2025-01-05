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
            {/* Portfolio Value and Performance Section */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column: Portfolio Value and Performance Chart */}
              <div className="col-span-12 lg:col-span-4">
                <div className="space-y-6">
                  <div className="bg-dashboard-card/40 backdrop-blur-lg border-purple-800/20 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Portfolio Value</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-3xl font-bold text-white">$87,649.51</span>
                        <span className="text-success text-sm">+0.12% (+$105.18)</span>
                      </div>
                      <PerformanceChart />
                    </div>
                  </div>
                  <DashboardMetrics />
                </div>
              </div>

              {/* Center Column: Watchlist */}
              <div className="col-span-12 lg:col-span-4">
                <WatchlistSection user={user} />
              </div>

              {/* Right Column: Portfolio Composition */}
              <div className="col-span-12 lg:col-span-4">
                <PortfolioComposition data={portfolioData} />
              </div>
            </div>

            {/* Recommended Stocks Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">Recommended Stocks</h2>
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