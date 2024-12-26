import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { BillingInfo } from '@/types/api';

export const BillingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<BillingInfo>();

  const onSubmit = async (data: Partial<BillingInfo>) => {
    try {
      setIsLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase
        .from('billing_info')
        .upsert({
          ...data,
          user_id: userData.user.id,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Billing information updated successfully',
      });
    } catch (error) {
      console.error('Error updating billing info:', error);
      toast({
        title: 'Error',
        description: 'Failed to update billing information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            {...register('full_name')}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_line1">Address Line 1</Label>
          <Input
            id="address_line1"
            {...register('address_line1')}
            placeholder="123 Main St"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_line2">Address Line 2</Label>
          <Input
            id="address_line2"
            {...register('address_line2')}
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="New York"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...register('state')}
              placeholder="NY"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              {...register('postal_code')}
              placeholder="10001"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              {...register('country')}
              placeholder="United States"
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Billing Information'}
        </Button>
      </form>
    </Card>
  );
};