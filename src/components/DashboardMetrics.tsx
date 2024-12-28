import { Calendar, Target } from "lucide-react";
import { MetricCard } from "./MetricCard";

const PORTFOLIO_VALUE = 87649.51;

export const DashboardMetrics = () => {
  return (
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
  );
};