// components/booking-components/BookingPricing.tsx
"use client";

import React from "react";
import { DollarSign, Percent, Shield } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { InputField } from "@/components/common-components/create-components/InputField";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";

interface BookingPricingProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const BookingPricing: React.FC<BookingPricingProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <FormHeader title="Pricing Details" description="Booking financial information" icon={DollarSign} />

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Total Amount"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={onInputChange}
            type="number"
            required
            min={0}
            step={0.01}
            placeholder="0.00"
            error={errors.totalAmount}
            helperText="Total booking amount"
          />

          <InputField
            label="Discount Amount"
            name="discountAmount"
            value={formData.discountAmount}
            onChange={onInputChange}
            type="number"
            min={0}
            step={0.01}
            placeholder="0.00"
            error={errors.discountAmount}
            helperText="Discount applied"
          />

          <InputField
            label="Tax Amount"
            name="taxAmount"
            value={formData.taxAmount}
            onChange={onInputChange}
            type="number"
            min={0}
            step={0.01}
            placeholder="0.00"
            error={errors.taxAmount}
            helperText="Tax amount"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Insurance Amount"
            name="insuranceAmount"
            value={formData.insuranceAmount}
            onChange={onInputChange}
            type="number"
            min={0}
            step={0.01}
            placeholder="0.00"
            error={errors.insuranceAmount}
            helperText="Insurance cost"
          />

          <InputField
            label="Final Amount"
            name="finalAmount"
            value={formData.finalAmount}
            onChange={onInputChange}
            type="number"
            required
            min={0}
            step={0.01}
            placeholder="0.00"
            error={errors.finalAmount}
            helperText="Final amount after all calculations"
          />
        </div>
      </div>
    </div>
  );
};