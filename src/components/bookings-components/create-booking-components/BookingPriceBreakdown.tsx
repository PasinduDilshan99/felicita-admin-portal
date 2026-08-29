// components/bookings-components/create-booking-components/BookingPriceBreakdown.tsx
"use client";

import React, { useState } from "react";
import { DollarSign, Plus, X, FileText, Hash } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { CreatePriceBreakDownRequest } from "@/types/booking-types";

interface BookingPriceBreakdownProps {
  priceBreakDowns: CreatePriceBreakDownRequest[];
  onPriceBreakdownChange: (priceBreakDowns: CreatePriceBreakDownRequest[]) => void;
  priceBreakdownTypes: string[];
}

const defaultPriceBreakdown: CreatePriceBreakDownRequest = {
  itemType: "",
  itemName: "",
  itemDescription: "",
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  status: 1,
};

export const BookingPriceBreakdown: React.FC<BookingPriceBreakdownProps> = ({
  priceBreakDowns,
  onPriceBreakdownChange,
  priceBreakdownTypes,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const addPriceBreakdown = () => {
    onPriceBreakdownChange([...priceBreakDowns, { ...defaultPriceBreakdown }]);
  };

  const removePriceBreakdown = (index: number) => {
    onPriceBreakdownChange(priceBreakDowns.filter((_, i) => i !== index));
  };

  const updatePriceBreakdown = (index: number, field: keyof CreatePriceBreakDownRequest, value: any) => {
    const updated = [...priceBreakDowns];
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate total price
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? numValue : updated[index].quantity;
      const unitPrice = field === 'unitPrice' ? numValue : updated[index].unitPrice;
      updated[index].totalPrice = quantity * unitPrice;
    }
    
    onPriceBreakdownChange(updated);
  };

  // Calculate total
  const total = priceBreakDowns.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}>
            <DollarSign className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold" style={{ color: theme.text }}>Price Breakdown</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Add price breakdown items</p>
          </div>
          {priceBreakDowns.length > 0 && (
            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
              {priceBreakDowns.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <span className="text-sm font-semibold" style={{ color: theme.success }}>
              ${total.toFixed(2)}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); addPriceBreakdown(); }}
            className="p-1.5 rounded-lg transition-colors hover:bg-opacity-20"
            style={{ color: theme.primary }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {priceBreakDowns.length === 0 ? (
            <div className="text-center py-8" style={{ color: theme.textSecondary }}>
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No price breakdown items added yet</p>
              <button type="button" onClick={addPriceBreakdown} className="mt-2 text-sm font-medium hover:underline" style={{ color: theme.primary }}>
                Add Item
              </button>
            </div>
          ) : (
            <>
              {priceBreakDowns.map((item, index) => (
                <div key={index} className="rounded-xl p-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.border}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium" style={{ color: theme.text }}>Item #{index + 1}</h4>
                    <button type="button" onClick={() => removePriceBreakdown(index)} className="p-1 rounded-lg hover:bg-opacity-20" style={{ color: theme.error }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Item Type</label>
                      <select
                        value={item.itemType}
                        onChange={(e) => updatePriceBreakdown(index, 'itemType', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm border"
                        style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      >
                        <option value="">Select type</option>
                        {priceBreakdownTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Item Name</label>
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => updatePriceBreakdown(index, 'itemName', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm border"
                        style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                        placeholder="Item name"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Item Description</label>
                    <input
                      type="text"
                      value={item.itemDescription}
                      onChange={(e) => updatePriceBreakdown(index, 'itemDescription', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updatePriceBreakdown(index, 'quantity', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg text-sm border"
                        style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                        min={1}
                        step={1}
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Unit Price</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updatePriceBreakdown(index, 'unitPrice', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg text-sm border"
                        style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                        min={0}
                        step={0.01}
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Total Price</label>
                      <div className="px-3 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: `${theme.success}10`, color: theme.success }}>
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: theme.border }}>
                <span className="font-medium" style={{ color: theme.text }}>Total</span>
                <span className="text-lg font-bold" style={{ color: theme.success }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};