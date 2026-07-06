// components/bookings-components/create-booking-components/BookingInvoice.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus, X, Calendar, DollarSign, User, Mail, Phone, MapPin } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { CreateBookingInvoiceRequest } from "@/types/booking-types";

interface BookingInvoiceProps {
  invoice: CreateBookingInvoiceRequest;
  onInvoiceChange: (invoice: CreateBookingInvoiceRequest) => void;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  insuranceAmount: number;
}

export const BookingInvoice: React.FC<BookingInvoiceProps> = ({
  invoice,
  onInvoiceChange,
  totalAmount,
  discountAmount,
  taxAmount,
  insuranceAmount,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-calculate invoice totals
  useEffect(() => {
    const subTotal = totalAmount || 0;
    const discount = discountAmount || 0;
    const tax = taxAmount || 0;
    const insurance = insuranceAmount || 0;
    const total = subTotal - discount + tax + insurance;
    const balanceDue = total - (invoice.amountPaid || 0);

    onInvoiceChange({
      ...invoice,
      subTotal,
      totalAmount: total,
      discountAmount: discount,
      taxAmount: tax,
      insuranceAmount: insurance,
      balanceDue: balanceDue > 0 ? balanceDue : 0,
    });
  }, [totalAmount, discountAmount, taxAmount, insuranceAmount]);

  const updateInvoice = (field: keyof CreateBookingInvoiceRequest, value: any) => {
    const updated = { ...invoice, [field]: value };
    
    // Recalculate balance due when amount paid changes
    if (field === 'amountPaid') {
      const balance = (invoice.totalAmount || 0) - (value || 0);
      updated.balanceDue = balance > 0 ? balance : 0;
    }
    
    onInvoiceChange(updated);
  };

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
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold" style={{ color: theme.text }}>Invoice</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Invoice details</p>
          </div>
        </div>
        {invoice.totalAmount > 0 && (
          <span className="text-sm font-bold" style={{ color: theme.success }}>
            ${invoice.totalAmount.toFixed(2)}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          <div className="rounded-xl p-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.border}` }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => updateInvoice('dueDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm border"
                  style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Amount Paid</label>
                <input
                  type="number"
                  value={invoice.amountPaid}
                  onChange={(e) => updateInvoice('amountPaid', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg text-sm border"
                  style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-3 rounded-lg" style={{ backgroundColor: `${theme.surface}`, border: `1px solid ${theme.border}` }}>
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Sub Total</p>
                <p className="text-sm font-medium" style={{ color: theme.text }}>${invoice.subTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Discount</p>
                <p className="text-sm font-medium" style={{ color: theme.warning }}>-${invoice.discountAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Tax</p>
                <p className="text-sm font-medium" style={{ color: theme.text }}>${invoice.taxAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Insurance</p>
                <p className="text-sm font-medium" style={{ color: theme.text }}>${invoice.insuranceAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Balance Due</p>
                <p className="text-lg font-bold" style={{ color: invoice.balanceDue > 0 ? theme.error : theme.success }}>
                  ${invoice.balanceDue.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: theme.textSecondary }}>Total Amount</p>
                <p className="text-lg font-bold" style={{ color: theme.success }}>
                  ${invoice.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.border }}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>Billing Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Full Name</label>
                  <input
                    type="text"
                    value={invoice.billingFullName}
                    onChange={(e) => updateInvoice('billingFullName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Email</label>
                  <input
                    type="email"
                    value={invoice.billingEmail}
                    onChange={(e) => updateInvoice('billingEmail', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Phone</label>
                  <input
                    type="text"
                    value={invoice.billingPhone}
                    onChange={(e) => updateInvoice('billingPhone', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Billing Address</label>
                  <input
                    type="text"
                    value={invoice.billingAddress}
                    onChange={(e) => updateInvoice('billingAddress', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="Billing address"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};