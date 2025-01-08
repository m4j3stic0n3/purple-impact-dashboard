import { Card } from "./ui/card";
import { Star, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface WatchlistItemProps {
  symbol: string;
  name: string;
  change: number;
  changePercent: number;
}

export const WatchlistItem = ({ symbol, name, change, changePercent }: WatchlistItemProps) => {
  const queryClient = useQueryClient();

  const deleteWatchlistItem = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
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

  return (
    <Card className="p-4 bg-dashboard-card/40 backdrop-blur-lg border-purple-800/20 group relative hover:bg-dashboard-card/60 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <h4 className="font-semibold text-white">{symbol}</h4>
            <p className="text-sm text-gray-400">{name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className={`text-sm font-medium ${changePercent >= 0 ? 'text-success' : 'text-red-500'}`}>
            {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}% ({change >= 0 ? '+' : ''}${Math.abs(change).toFixed(2)})
          </p>
          <button
            onClick={() => deleteWatchlistItem.mutate()}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-full"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </Card>
  );
};