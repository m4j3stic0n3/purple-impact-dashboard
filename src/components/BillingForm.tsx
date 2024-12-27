import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const BillingForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update billing information",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          billing_address: address,
          billing_city: city,
          billing_state: state,
          billing_postal_code: postalCode,
          billing_country: country,
          billing_updated: true
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Billing information updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update billing information",
        variant: "destructive",
      });
    }
  };

  const savedCards = [
    {
      last4: "4242",
      brand: "Visa",
      expiryMonth: "12",
      expiryYear: "24"
    }
  ];

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Current Cards</h2>
        <div className="space-y-4">
          {savedCards.map((card) => (
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-200">
            Card Number
          </label>
          <Input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-200">
              Expiry Date
            </label>
            <Input
              id="expiryDate"
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-200">
              CVV
            </label>
            <Input
              id="cvv"
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-200">
            Address
          </label>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street Address"
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-200">
              City
            </label>
            <Input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-200">
              State
            </label>
            <Input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="mt-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-200">
              Postal Code
            </label>
            <Input
              id="postalCode"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Postal Code"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-200">
              Country
            </label>
            <Input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="mt-1"
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Save Billing Information
        </Button>
      </form>
    </div>
  );
};
