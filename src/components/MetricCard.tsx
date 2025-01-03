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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-gray-400 truncate">{title}</h3>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-white truncate">{value}</p>
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-success truncate">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 text-white/80">{icon}</div>
        )}
      </div>
    </Card>
  );
}