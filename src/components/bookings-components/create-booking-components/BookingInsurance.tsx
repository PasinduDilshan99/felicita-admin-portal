// components/bookings-components/create-booking-components/BookingInsurance.tsx
"use client";

import React, { useState } from "react";
import { Shield, Plus, X, Calendar, DollarSign, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { CreateBookingInsuranceRequest } from "@/types/booking-types";

interface BookingInsuranceProps {
  insurance: CreateBookingInsuranceRequest;
  onInsuranceChange: (insurance: CreateBookingInsuranceRequest) => void;
  insuranceProviders: string[];
  coverageTypes: string[];
}

export const BookingInsurance: React.FC<BookingInsuranceProps> = ({
  insurance,
  onInsuranceChange,
  insuranceProviders,
  coverageTypes,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const updateInsurance = (field: keyof CreateBookingInsuranceRequest, value: any) => {
    onInsuranceChange({ ...insurance, [field]: value });
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
            <Shield className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold" style={{ color: theme.text }}>Insurance</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Add insurance details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={insurance.policyNumber !== "" || insurance.insuranceProvider !== ""}
              onChange={(e) => {
                if (!e.target.checked) {
                  onInsuranceChange({
                    insuranceProvider: "",
                    policyNumber: "",
                    coverageType: "",
                    coverageDetails: "",
                    premiumAmount: 0,
                    policyStartDate: "",
                    policyEndDate: "",
                    status: 1,
                  });
                }
              }}
              className="w-4 h-4 rounded"
              style={{ accentColor: theme.primary }}
            />
            <span style={{ color: theme.textSecondary }}>Add Insurance</span>
          </label>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {(insurance.insuranceProvider || insurance.policyNumber) ? (
            <div className="rounded-xl p-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.border}` }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Insurance Provider</label>
                  <select
                    value={insurance.insuranceProvider}
                    onChange={(e) => updateInsurance('insuranceProvider', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  >
                    <option value="">Select provider</option>
                    {insuranceProviders.map((provider) => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Policy Number</label>
                  <input
                    type="text"
                    value={insurance.policyNumber}
                    onChange={(e) => updateInsurance('policyNumber', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="Policy number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Coverage Type</label>
                  <select
                    value={insurance.coverageType}
                    onChange={(e) => updateInsurance('coverageType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  >
                    <option value="">Select coverage type</option>
                    {coverageTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Premium Amount</label>
                  <input
                    type="number"
                    value={insurance.premiumAmount}
                    onChange={(e) => updateInsurance('premiumAmount', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="0.00"
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Policy Start Date</label>
                  <input
                    type="date"
                    value={insurance.policyStartDate}
                    onChange={(e) => updateInsurance('policyStartDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Policy End Date</label>
                  <input
                    type="date"
                    value={insurance.policyEndDate}
                    onChange={(e) => updateInsurance('policyEndDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Coverage Details</label>
                <textarea
                  value={insurance.coverageDetails}
                  onChange={(e) => updateInsurance('coverageDetails', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm border resize-none"
                  style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  placeholder="Describe what is covered..."
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: theme.textSecondary }}>
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No insurance added</p>
              <p className="text-xs mt-1">Check the box above to add insurance details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};