import { Calendar, Target } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MetricCard } from "@/components/MetricCard";
import { RecommendedStock } from "@/components/RecommendedStock";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background text-white">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
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
                price="$795.35"
                change="+$7.16"
                changePercent="0.91%"
                description="Eli Lilly has been a fantastic growth stock to own in recent years. Entering trading this week, its five-year returns have totaled more than 550%."
              />
              <RecommendedStock
                name="Palantir"
                symbol="PLTR"
                price="$67.08"
                change="+$1.03"
                changePercent="1.56%"
                description="Palantir shares jumped 20% following its solid Q3 earnings results, in which it reported revenue of $726 million and adjusted earnings of $0.10 per share."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  [Performance Chart Placeholder]
                </div>
              </Card>
              <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Portfolio Composition</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  [Portfolio Composition Chart Placeholder]
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;