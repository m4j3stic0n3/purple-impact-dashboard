import { Star, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SAMPLE_WATCHLIST = [
  { symbol: 'MRNA', name: 'Moderna Inc', change: -3.15, changePercent: -4.02 },
  { symbol: 'NKE', name: 'Nike Inc', change: 3.42, changePercent: 0.91 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', change: 25.33, changePercent: 5.21 },
  { symbol: 'AXP', name: 'American Express', change: 2.44, changePercent: 0.85 },
];

export const WatchlistSection = ({ user }) => {
  const queryClient = useQueryClient();

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

  const deleteWatchlistItem = useMutation({
    mutationFn: async (symbol: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] });
      toast({
        title: "Success",
        description: "Stock removed from watchlist",
      });
    },
    onError: (error) => {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove stock from watchlist",
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        Watchlist <span className="text-sm text-gray-400">({SAMPLE_WATCHLIST.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_WATCHLIST.map((stock) => (
          <Card 
            key={stock.symbol} 
            className="p-4 bg-dashboard-card/40 backdrop-blur-lg border-purple-800/20 group relative hover:bg-dashboard-card/60 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-white truncate">{stock.symbol}</h4>
                  <p className="text-sm text-gray-400 truncate">{stock.name}</p>
                </div>
              </div>
              <div className="flex items-end flex-col gap-1">
                <p className={`text-sm font-medium ${stock.change >= 0 ? 'text-success' : 'text-red-500'}`}>
                  ${Math.abs(stock.change).toFixed(2)}
                </p>
                <p className={`text-xs ${stock.change >= 0 ? 'text-success' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '+' : '-'}{Math.abs(stock.changePercent).toFixed(2)}%
                </p>
              </div>
              <button
                onClick={() => deleteWatchlistItem.mutate(stock.symbol)}
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-red-500/10 rounded-full"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};