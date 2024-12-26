import { Card } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStockQuote } from "@/services/polygonService";
import { GeminiChat } from "@/components/GeminiChat";

// Real ETF tickers with descriptions
const portfolioETFs = [
  { 
    name: 'iShares Global Clean Energy ETF',
    ticker: 'ICLN',
    description: 'Tracks companies in the clean energy sector'
  },
  {
    name: 'First Trust NASDAQ Clean Edge Green Energy ETF',
    ticker: 'QCLN',
    description: 'Focuses on clean energy companies listed on NASDAQ'
  },
  {
    name: 'iShares Global Green Bond ETF',
    ticker: 'BGRN',
    description: 'Invests in green bonds funding environmental projects'
  },
  {
    name: 'Invesco Water Resources ETF',
    ticker: 'PHO',
    description: 'Focuses on companies in water conservation and purification'
  },
  {
    name: 'VanEck Green Bond ETF',
    ticker: 'GRNB',
    description: 'Tracks bonds funding environmental sustainability projects'
  },
];

const timePeriods = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' },
  { label: 'YTD', value: 'ytd' },
  { label: '5Y', value: '5y' },
  { label: 'MAX', value: 'max' },
];

// Mock performance data generator
const generatePerformanceData = (period: string) => {
  const dataPoints = period === '1d' ? 24 : 
                    period === '1w' ? 7 : 
                    period === '3m' ? 90 :
                    period === '1y' ? 12 :
                    period === 'ytd' ? new Date().getMonth() + 1 :
                    period === '5y' ? 60 : 120;

  const baseValue = 100000;
  const volatility = 0.02;
  
  return Array.from({ length: dataPoints }, (_, i) => {
    const randomChange = (Math.random() - 0.5) * volatility;
    const value = baseValue * (1 + randomChange * i);
    return {
      time: i,
      value: Math.round(value),
    };
  });
};

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#805AD5'];

const Portfolio = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1m');
  const performanceData = generatePerformanceData(selectedPeriod);

  // Portfolio composition data
  const portfolioComposition = [
    { name: 'Clean Energy', value: 35 },
    { name: 'Green Bonds', value: 25 },
    { name: 'Water Resources', value: 20 },
    { name: 'Sustainable Tech', value: 20 },
  ];

  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#3a108c'];

  // Fetch real-time prices for all ETFs
  const etfQueries = portfolioETFs.map(etf => ({
    ...etf,
    ...useQuery({
      queryKey: ['etfPrice', etf.ticker],
      queryFn: () => getStockQuote(etf.ticker),
      select: (data) => ({
        price: data.price,
        change: data.change,
        changePercent: data.changePercent
      }),
      refetchInterval: 60000 // Refresh every minute
    })
  }));

  // Calculate total portfolio value
  const totalValue = etfQueries.reduce((acc, etf) => {
    if (etf.data?.price) {
      return acc + etf.data.price * 100; // Assuming 100 shares of each ETF
    }
    return acc;
  }, 0);

  const handleInvest = (etf: string) => {
    toast({
      title: "Investment Simulated",
      description: `You've simulated investing in ${etf}`,
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-dashboard-background text-white">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Impact Portfolio</h1>
            <div className="flex gap-2">
              {timePeriods.map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "default" : "outline"}
                  onClick={() => setSelectedPeriod(period.value)}
                  className="bg-dashboard-highlight hover:bg-dashboard-highlight/80"
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
              <h3 className="text-xl font-semibold mb-4">Portfolio Performance</h3>
              <div className="h-[300px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#9b87f5" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>

            <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
              <h3 className="text-xl font-semibold mb-4">Portfolio Composition</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioComposition}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioComposition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid gap-4">
            {etfQueries.map((etf) => (
              <Card key={etf.ticker} className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{etf.name}</h4>
                      <span className="text-sm text-gray-400">({etf.ticker})</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{etf.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {etf.isLoading ? (
                      <div>Loading...</div>
                    ) : etf.error ? (
                      <div>Error loading price</div>
                    ) : (
                      <div className="text-right">
                        <p className="text-lg font-semibold text-white">
                          ${etf.data?.price.toFixed(2)}
                        </p>
                        <p className={`text-sm ${etf.data?.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {etf.data?.change.toFixed(2)} ({etf.data?.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => handleInvest(etf.name)}
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

          <div className="mt-8">
            <GeminiChat />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
