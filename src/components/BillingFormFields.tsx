import { Input } from "@/components/ui/input";
import { BillingFormData } from "@/types/billing";

interface BillingFormFieldsProps {
  formData: BillingFormData;
  onChange: (field: keyof BillingFormData, value: string) => void;
}

export const BillingFormFields = ({ formData, onChange }: BillingFormFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-200">
          Card Number
        </label>
        <Input
          id="cardNumber"
          type="text"
          value={formData.cardNumber}
          onChange={(e) => onChange("cardNumber", e.target.value)}
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
            value={formData.expiryDate}
            onChange={(e) => onChange("expiryDate", e.target.value)}
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
            value={formData.cvv}
            onChange={(e) => onChange("cvv", e.target.value)}
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
          value={formData.address}
          onChange={(e) => onChange("address", e.target.value)}
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
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
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
            value={formData.state}
            onChange={(e) => onChange("state", e.target.value)}
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
            value={formData.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
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
            value={formData.country}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Country"
            className="mt-1"
          />
        </div>
      </div>
    </>
  );
};