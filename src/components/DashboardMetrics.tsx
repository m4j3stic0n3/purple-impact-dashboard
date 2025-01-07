import { Calendar, Target } from "lucide-react";
import { MetricCard } from "./MetricCard";

const PORTFOLIO_VALUE = 87649.51;

export const DashboardMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Next Earnings Report"
        value="WMT Q1 FY 2025"
        icon={<Calendar className="w-6 h-6 text-white/80" />}
        variant="secondary"
      />
      <MetricCard
        title="Sustainability Score"
        value="87/100"
        icon={<Target className="w-6 h-6 text-white/80" />}
        variant="secondary"
      />
      <MetricCard
        title="Portfolio Value"
        value={`$${PORTFOLIO_VALUE.toLocaleString()}`}
        subtitle="0.12% (+$105.18)"
        variant="secondary"
        className="text-success"
      />
    </div>
  );
};