import { Star, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export const WatchlistSection = ({ user }) => {
  const queryClient = useQueryClient();
  const [watchlistItems, setWatchlistItems] = useState([]);

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
      <h2 className="text-xl font-semibold mt-8 mb-4">Watchlist:</h2>
      {watchlistLoading ? (
        <div>Loading watchlist...</div>
      ) : watchlistData?.length === 0 ? (
        <div className="text-gray-400">No stocks in watchlist</div>
      ) : (
        <div className="grid gap-4 mb-8">
          {watchlistData.map((stock) => (
            <Card 
              key={stock.symbol} 
              className="p-4 bg-dashboard-card/60 backdrop-blur-lg border-purple-800 group relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <div>
                    <h4 className="font-semibold">{stock.symbol}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => deleteWatchlistItem.mutate(stock.symbol)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-red-500/10 rounded-full"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};