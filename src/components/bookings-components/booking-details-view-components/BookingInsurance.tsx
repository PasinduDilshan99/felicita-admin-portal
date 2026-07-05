"use client";

import React from "react";
import { Shield, CheckCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingInsuranceProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";
import { formatDate, formatPrice } from "@/utils/commonFunctions";

export const BookingInsurance: React.FC<BookingInsuranceProps> = ({
  insurance,
}) => {
  const { theme } = useTheme();

  if (!insurance || !insurance.insuranceProvider) {
    return null;
  }

  const isActive = insurance.status === "ACTIVE";

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
            <Shield
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Insurance Details
          </h2>
          <span
            className={`text-xs px-2 py-0.5 rounded-full text-white ${
              isActive ? "bg-emerald-500" : "bg-gray-500"
            }`}
          >
            {insurance.status}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
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
              Provider
            </p>
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {insurance.insuranceProvider}
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
              Policy Number
            </p>
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {insurance.policyNumber}
            </p>
          </div>
        </div>

        <div
          className="p-3 rounded-xl"
          style={{
            backgroundColor: hexToRgba(theme.success, 0.04),
            border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" style={{ color: theme.success }} />
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Coverage
            </p>
          </div>
          <p className="text-sm font-medium" style={{ color: theme.text }}>
            {insurance.coverageType}
          </p>
          {insurance.coverageDetails && (
            <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
              {insurance.coverageDetails}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.warning, 0.04),
            }}
          >
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Policy Period
            </p>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {formatDate(insurance.policyStartDate)} -{" "}
              {formatDate(insurance.policyEndDate)}
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.success, 0.04),
            }}
          >
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Premium Amount
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: theme.success }}
            >
              {formatPrice(insurance.premiumAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
