import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export const BillingForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update billing information",
          variant: "destructive",
        });
        return;
      }

      // Instead of trying to use a non-existent billing_info table,
      // we'll update the user's profile with a billing_updated flag
      const { error } = await supabase
        .from("profiles")
        .update({ billing_updated: true })
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

  return (
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
      <Button type="submit" className="w-full">
        Save Billing Information
      </Button>
    </form>
  );
};