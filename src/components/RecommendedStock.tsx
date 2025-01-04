import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface RecommendedStockProps {
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  description: string;
  logo?: string;
  isWatchlisted?: boolean;
}

export function RecommendedStock({
  name,
  symbol,
  price,
  change,
  changePercent,
  description,
  logo,
  isWatchlisted = false,
}: RecommendedStockProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(isWatchlisted);
  const [isLoading, setIsLoading] = useState(true);
  const isPositive = !change.includes('-');

  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('watchlist')
          .select('*')
          .eq('user_id', user.id)
          .eq('symbol', symbol)
          .maybeSingle();
        
        if (error) throw error;
        setIsInWatchlist(!!data);
      } catch (error) {
        console.error('Error checking watchlist:', error);
        toast({
          title: "Error",
          description: "Failed to check watchlist status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkWatchlist();
  }, [symbol]);

  const handleWatchlist = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to use the watchlist feature",
          variant: "destructive",
        });
        return;
      }

      if (isInWatchlist) {
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('symbol', symbol);

        if (error) throw error;
        
        setIsInWatchlist(false);
        toast({
          title: "Success",
          description: `${symbol} removed from watchlist`,
        });
      } else {
        const { error } = await supabase
          .from('watchlist')
          .insert([{ user_id: user.id, symbol }]);

        if (error) {
          // Check if it's a unique constraint violation
          if (error.code === '23505') {
            toast({
              title: "Info",
              description: `${symbol} is already in your watchlist`,
            });
            return;
          }
          throw error;
        }
        
        setIsInWatchlist(true);
        toast({
          title: "Success",
          description: `${symbol} added to watchlist`,
        });
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
      <div className="flex items-start gap-4">
        {logo && (
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-white/10">
            <img src={logo} alt={name} className="w-8 h-8" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white truncate">{name}</h3>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-semibold text-white">{price}</p>
              <p className={`text-sm ${isPositive ? "text-green-500" : "text-[#ea384c]"}`}>
                {change} {changePercent}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{description}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleWatchlist}
            disabled={isLoading}
            className={`w-full ${isInWatchlist ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-green-500/10 hover:bg-green-500/20'}`}
          >
            {isInWatchlist ? (
              <><Minus className="w-4 h-4 mr-1" /> Remove from Watchlist</>
            ) : (
              <><Plus className="w-4 h-4 mr-1" /> Add to Watchlist</>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}