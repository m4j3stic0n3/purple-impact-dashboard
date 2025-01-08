import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SearchStocks } from "./SearchStocks";
import { WatchlistItem } from "./WatchlistItem";

const SAMPLE_WATCHLIST = [
  { symbol: 'MRNA', name: 'Moderna Inc', change: -3.15, changePercent: -4.02 },
  { symbol: 'NKE', name: 'Nike Inc', change: 3.42, changePercent: 0.91 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', change: 25.33, changePercent: 5.21 },
  { symbol: 'AXP', name: 'American Express', change: 2.44, changePercent: 0.85 },
];

export const WatchlistSection = ({ user }) => {
  const { data: watchlistData, isLoading: watchlistLoading } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch watchlist",
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Watchlist</h2>
        <SearchStocks />
      </div>
      <div className="grid grid-cols-1 gap-3">
        {SAMPLE_WATCHLIST.map((stock) => (
          <WatchlistItem
            key={stock.symbol}
            symbol={stock.symbol}
            name={stock.name}
            change={stock.change}
            changePercent={stock.changePercent}
          />
        ))}
      </div>
    </div>
  );
};