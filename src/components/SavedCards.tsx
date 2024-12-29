import { SavedCard } from "@/types/billing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface SavedCardsProps {
  cards: SavedCard[];
}

export const SavedCards = ({ cards }: SavedCardsProps) => {
  return (
    <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Current Cards</h2>
      <div className="space-y-4">
        {cards.map((card) => (
          <div key={card.last4} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-purple-400" />
              <div>
                <p className="font-medium">{card.brand} •••• {card.last4}</p>
                <p className="text-sm text-gray-400">Expires {card.expiryMonth}/{card.expiryYear}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Remove</Button>
          </div>
        ))}
      </div>
    </Card>
  );
};