import { Card } from "@/components/ui/card";

interface RecommendedStockProps {
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  description: string;
  logo?: string;
}

export function RecommendedStock({
  name,
  symbol,
  price,
  change,
  changePercent,
  description,
  logo,
}: RecommendedStockProps) {
  const isPositive = !change.startsWith("-");

  return (
    <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
      <div className="flex items-start gap-4">
        {logo && (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10">
            <img src={logo} alt={name} className="w-8 h-8" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">{price}</p>
              <p className={`text-sm ${isPositive ? "text-success" : "text-red-500"}`}>
                {change} ({changePercent})
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </Card>
  );
}