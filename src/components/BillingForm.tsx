import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { SavedCards } from "./SavedCards";
import { BillingFormFields } from "./BillingFormFields";
import { BillingFormData, SavedCard } from "@/types/billing";
import debounce from "lodash/debounce";

export const BillingForm = () => {
  const [formData, setFormData] = useState<BillingFormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const savedCards: SavedCard[] = [
    {
      last4: "4242",
      brand: "Visa",
      expiryMonth: "12",
      expiryYear: "24"
    }
  ];

  const handleFieldChange = useCallback(
    debounce((field: keyof BillingFormData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    }, 300),
    []
  );

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
          billing_address: formData.address,
          billing_city: formData.city,
          billing_state: formData.state,
          billing_postal_code: formData.postalCode,
          billing_country: formData.country,
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

  return (
    <div className="space-y-8">
      <SavedCards cards={savedCards} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <BillingFormFields formData={formData} onChange={handleFieldChange} />
        <Button type="submit" className="w-full">
          Save Billing Information
        </Button>
      </form>
    </div>
  );
};