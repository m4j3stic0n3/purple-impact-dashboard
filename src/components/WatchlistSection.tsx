import { Star, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SAMPLE_WATCHLIST = [
  { symbol: 'MRNA', change: -3.15, changePercent: -4.02 },
  { symbol: 'NKE', change: 3.42, changePercent: 0.91 },
  { symbol: 'QQQ', change: 25.33, changePercent: 5.21 },
  { symbol: 'AXP', change: 2.44, changePercent: 0.85 },
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
    <>
      <h2 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
        Watchlist <span className="text-sm text-gray-400">+</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {SAMPLE_WATCHLIST.map((stock) => (
          <Card 
            key={stock.symbol} 
            className="p-4 bg-dashboard-card/40 backdrop-blur-lg border-purple-800/20 group relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <h4 className="font-semibold text-white">{stock.symbol}</h4>
                  <p className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                  </p>
                </div>
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
    </>
  );
};