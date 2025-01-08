import { Calendar, Target } from "lucide-react";
import { MetricCard } from "./MetricCard";

export const DashboardMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MetricCard
        title="Next Earnings Report:"
        value="WMT Q1 FY 2025"
        icon={<Calendar className="w-8 h-8 text-white/80" />}
        variant="secondary"
      />
      <MetricCard
        title="Sustainability Score:"
        value="87/100"
        icon={<Target className="w-8 h-8 text-white/80" />}
        variant="secondary"
      />
    </div>
  );
};