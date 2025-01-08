import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Star, Search, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const SearchStocks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const addToWatchlist = useMutation({
    mutationFn: async (symbol: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('watchlist')
        .insert([{ user_id: user.id, symbol: symbol.toUpperCase() }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      setIsOpen(false);
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

  const handleAddStock = (symbol: string) => {
    if (symbol.trim()) {
      addToWatchlist.mutate(symbol.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-purple-500/10"
        >
          <Star className="h-5 w-5 text-purple-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#1A0B2E]/95 border-purple-800/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Add to Watchlist</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stock symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background/50"
            />
          </div>
          <Button 
            onClick={() => handleAddStock(searchTerm)}
            disabled={addToWatchlist.isPending || !searchTerm.trim()}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {addToWatchlist.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};