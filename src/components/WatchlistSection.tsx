import { Star, Trash2, Plus } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "./ui/input";

const SAMPLE_WATCHLIST = [
  { symbol: 'MRNA', name: 'Moderna Inc', change: -3.15, changePercent: -4.02 },
  { symbol: 'NKE', name: 'Nike Inc', change: 3.42, changePercent: 0.91 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', change: 25.33, changePercent: 5.21 },
  { symbol: 'AXP', name: 'American Express', change: 2.44, changePercent: 0.85 },
];

export const WatchlistSection = ({ user }) => {
  const [newSymbol, setNewSymbol] = useState('');
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

  const addToWatchlist = useMutation({
    mutationFn: async (symbol: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('watchlist')
        .insert([{ user_id: user.id, symbol: symbol.toUpperCase() }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] });
      setNewSymbol('');
      toast({
        title: "Success",
        description: "Stock added to watchlist",
      });
    },
    onError: (error) => {
      console.error('Error adding to watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to add stock to watchlist",
        variant: "destructive",
      });
    },
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

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      addToWatchlist.mutate(newSymbol.trim());
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Watchlist</h2>
        <form onSubmit={handleAddStock} className="flex gap-2">
          <Input
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Enter stock symbol"
            className="w-40 bg-dashboard-card/40"
          />
          <Button 
            type="submit"
            variant="ghost" 
            size="icon"
            className="hover:bg-purple-500/10"
          >
            <Plus className="h-5 w-5 text-purple-500" />
          </Button>
        </form>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {SAMPLE_WATCHLIST.map((stock) => (
          <Card 
            key={stock.symbol} 
            className="p-4 bg-dashboard-card/40 backdrop-blur-lg border-purple-800/20 group relative hover:bg-dashboard-card/60 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{stock.symbol}</h4>
                  <p className="text-sm text-gray-400">{stock.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={`text-sm font-medium ${stock.changePercent >= 0 ? 'text-success' : 'text-red-500'}`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}% ({stock.change >= 0 ? '+' : ''}${Math.abs(stock.change).toFixed(2)})
                </p>
                <button
                  onClick={() => deleteWatchlistItem.mutate(stock.symbol)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-full"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};