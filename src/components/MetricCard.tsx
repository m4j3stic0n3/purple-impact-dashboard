import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function MetricCard({ title, value, icon, subtitle, className = "" }: MetricCardProps) {
  return (
    <Card className={`p-6 bg-dashboard-card/40 backdrop-blur-lg border-purple-800/20 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-white">{value}</p>
          </div>
          {subtitle && <p className="mt-1 text-sm text-success">{subtitle}</p>}
        </div>
        {icon && <div className="text-white/80">{icon}</div>}
      </div>
    </Card>
  );
}