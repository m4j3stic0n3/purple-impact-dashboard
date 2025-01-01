import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@supabase/auth-helpers-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { WatchlistSection } from "@/components/WatchlistSection";
import { RecommendedStock } from "@/components/RecommendedStock";
import { PerformanceChart } from "@/components/PerformanceChart";
import { PortfolioComposition } from "@/components/PortfolioComposition";
import { getStockQuote } from "@/services/stockService";
import { SidebarProvider } from "@/components/ui/sidebar";

// Sample portfolio data for demonstration
const portfolioData = [
  { name: 'Stocks', value: 45 },
  { name: 'Bonds', value: 25 },
  { name: 'Cash', value: 15 },
  { name: 'Other', value: 15 }
];

// Helper function to format price
const formatPrice = (data: any) => {
  if (!data) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(data.price);
};

// Helper function to format change
const formatChange = (data: any) => {
  if (!data) return '+$0.00';
  const prefix = data.change >= 0 ? '+' : '';
  return `${prefix}${data.change.toFixed(2)}`;
};

// Helper function to get stock data safely
const getStockData = (symbol: string, data: any, error: any) => {
  console.log(`Getting stock data for ${symbol}:`, { data, error });
  if (error) {
    console.error(`Error fetching ${symbol} data:`, error);
    return null;
  }
  return data;
};

const Index = () => {
  const user = useUser();

  // Fetch LLY stock data
  const { data: llyData, error: llyError } = useQuery({
    queryKey: ['stock', 'LLY'],
    queryFn: () => getStockQuote('LLY'),
    refetchInterval: 120000,
    staleTime: 60000,
    retry: 1,
    meta: {
      errorMessage: 'Failed to fetch LLY stock data'
    }
  });

  // Fetch PLTR stock data
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

  // Debug logs for component rendering and data
  useEffect(() => {
    console.log('Index component rendered');
    console.log('User:', user);
    console.log('LLY Data:', llyData);
    console.log('PLTR Data:', pltrData);
  }, [user, llyData, pltrData]);

  if (!user) {
    console.log('No user found, returning null');
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardMetrics />
            <WatchlistSection user={user} />

            <h2 className="text-xl font-semibold mt-8 mb-4 text-white">Recommended Stocks:</h2>
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
    </SidebarProvider>
  );
};

export default Index;