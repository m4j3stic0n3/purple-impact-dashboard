import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
  variant?: "primary" | "secondary";
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  className = "",
  variant = "primary"
}: MetricCardProps) {
  return (
    <Card 
      className={`
        p-6 bg-dashboard-card/40 backdrop-blur-lg border-purple-800/20 
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-medium text-white mb-4">{title}</h3>
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 text-white/80">{icon}</div>
            )}
            <p className="text-2xl font-semibold text-white">
              {value}
            </p>
          </div>
          {subtitle && (
            <p className="mt-2 text-sm text-success">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}