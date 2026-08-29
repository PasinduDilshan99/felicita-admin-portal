"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingInvoiceProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";
import { formatDate, formatPrice } from "@/utils/commonFunctions";

export const BookingInvoice: React.FC<BookingInvoiceProps> = ({ invoice }) => {
  const { theme } = useTheme();

  if (!invoice || !invoice.invoiceId) {
    return null;
  }

  const isPaid = invoice.balanceDue === 0;
  const isOverdue = new Date(invoice.dueDate) < new Date() && !isPaid;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-base sm:text-lg font-semibold flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <CreditCard
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Invoice
          </h2>
          <span
            className={`text-xs px-2 py-0.5 rounded-full text-white ${
              isPaid
                ? "bg-emerald-500"
                : isOverdue
                  ? "bg-red-500"
                  : "bg-yellow-500"
            }`}
          >
            {isPaid ? "PAID" : isOverdue ? "OVERDUE" : "PENDING"}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {/* Billing Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.04),
            }}
          >
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Due Date
            </p>
            <p className="text-sm" style={{ color: theme.text }}>
              {formatDate(invoice.dueDate)}
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.04),
            }}
          >
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Status
            </p>
            <p
              className="text-sm font-medium"
              style={{
                color: isPaid
                  ? theme.success
                  : isOverdue
                    ? theme.error
                    : theme.warning,
              }}
            >
              {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
            </p>
          </div>
        </div>

        {/* Billing Address */}
        <div
          className="p-3 rounded-xl"
          style={{
            backgroundColor: hexToRgba(theme.success, 0.04),
            border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
          }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: theme.textSecondary }}
          >
            Billing Details
          </p>
          <p className="text-sm font-medium" style={{ color: theme.text }}>
            {invoice.billingFullName}
          </p>
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            {invoice.billingAddress}
          </p>
          <div className="flex flex-wrap gap-3 mt-1 text-sm">
            <span style={{ color: theme.textSecondary }}>
              {invoice.billingEmail}
            </span>
            <span style={{ color: theme.textSecondary }}>
              {invoice.billingPhone}
            </span>
          </div>
        </div>

        {/* Amounts */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm py-1">
            <span style={{ color: theme.textSecondary }}>Subtotal</span>
            <span style={{ color: theme.text }}>
              {formatPrice(invoice.subTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span style={{ color: theme.textSecondary }}>Tax Amount</span>
            <span style={{ color: theme.text }}>
              {formatPrice(invoice.taxAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span style={{ color: theme.textSecondary }}>Discount</span>
            <span style={{ color: theme.success }}>
              -{formatPrice(invoice.discountAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span style={{ color: theme.textSecondary }}>Insurance</span>
            <span style={{ color: theme.text }}>
              {formatPrice(invoice.insuranceAmount)}
            </span>
          </div>

          <div
            className="flex justify-between text-base font-bold py-2 border-t"
            style={{ borderColor: hexToRgba(theme.border, 0.5) }}
          >
            <span style={{ color: theme.text }}>Total Amount</span>
            <span style={{ color: theme.primary }}>
              {formatPrice(invoice.totalAmount)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div
              className="flex flex-col items-center p-2 rounded-lg"
              style={{
                backgroundColor: hexToRgba(theme.success, 0.06),
                border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
              }}
            >
              <span
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Amount Paid
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: theme.success }}
              >
                {formatPrice(invoice.amountPaid)}
              </span>
            </div>
            <div
              className="flex flex-col items-center p-2 rounded-lg"
              style={{
                backgroundColor: hexToRgba(
                  invoice.balanceDue === 0 ? theme.success : theme.error,
                  0.06,
                ),
                border: `1px solid ${hexToRgba(invoice.balanceDue === 0 ? theme.success : theme.error, 0.1)}`,
              }}
            >
              <span
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Balance Due
              </span>
              <span
                className="text-sm font-bold"
                style={{
                  color: invoice.balanceDue === 0 ? theme.success : theme.error,
                }}
              >
                {formatPrice(invoice.balanceDue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
