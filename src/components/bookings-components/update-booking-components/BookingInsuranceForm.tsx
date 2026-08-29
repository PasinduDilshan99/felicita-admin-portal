"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Shield, ChevronDown, Edit2, Calendar, DollarSign } from "lucide-react";
import { BookingInsurance, CreateBookingParams, UpdateBookingInsuranceRequest } from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto", 
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }
  },
};

interface BookingInsuranceFormProps {
  insurance: BookingInsurance;
  bookingParams: CreateBookingParams;
  onUpdateInsurance: (insurance: UpdateBookingInsuranceRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
  formatPrice: (price: number) => string;
}

export const BookingInsuranceForm: React.FC<BookingInsuranceFormProps> = ({
  insurance,
  bookingParams,
  onUpdateInsurance,
  expandedSections,
  onToggleSection,
  theme,
  formatPrice,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [editInsuranceData, setEditInsuranceData] = useState<UpdateBookingInsuranceRequest>({
    insuranceId: insurance?.insuranceId || 0,
    insuranceProvider: insurance?.insuranceProvider || "",
    policyNumber: insurance?.policyNumber || "",
    coverageType: insurance?.coverageType || "",
    coverageDetails: insurance?.coverageDetails || "",
    premiumAmount: insurance?.premiumAmount || 0,
    policyStartDate: insurance?.policyStartDate || "",
    policyEndDate: insurance?.policyEndDate || "",
    status: 1,
  });

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditInsuranceData({
      insuranceId: insurance?.insuranceId || 0,
      insuranceProvider: insurance?.insuranceProvider || "",
      policyNumber: insurance?.policyNumber || "",
      coverageType: insurance?.coverageType || "",
      coverageDetails: insurance?.coverageDetails || "",
      premiumAmount: insurance?.premiumAmount || 0,
      policyStartDate: insurance?.policyStartDate || "",
      policyEndDate: insurance?.policyEndDate || "",
      status: 1,
    });
  };

  const handleUpdateInsurance = () => {
    if (!editInsuranceData.insuranceProvider || !editInsuranceData.policyNumber) {
      alert("Insurance provider and policy number are required");
      return;
    }
    onUpdateInsurance(editInsuranceData);
    setIsEditing(false);
  };

  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const InfoRow = ({ label, value }: { label: string; value: string | number | null }) => (
    <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.border}05` }}>
      <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>{label}</p>
      <p className="text-sm" style={{ color: theme.text }}>{value || "N/A"}</p>
    </div>
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      <button
        onClick={() => onToggleSection("insurance")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("insurance") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("insurance") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
          >
            <Shield className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Insurance
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {insurance?.insuranceProvider ? insurance.insuranceProvider : "No insurance added"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all"
            style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{ transform: expandedSections.has("insurance") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("insurance") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {!insurance?.insuranceId ? (
              <div className="text-center py-8" style={{ backgroundColor: `${theme.border}10`, borderRadius: "12px" }}>
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>No insurance added yet</p>
                <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>Click Edit to add insurance details</p>
              </div>
            ) : (
              <>
                {/* Edit Insurance Modal */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                      onClick={() => setIsEditing(false)}
                    >
                      <div
                        className="rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        style={{ backgroundColor: theme.surface }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                          Edit Insurance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                              Insurance Provider <span style={{ color: theme.error }}>*</span>
                            </label>
                            <input
                              type="text"
                              value={editInsuranceData.insuranceProvider}
                              onChange={(e) => setEditInsuranceData({ ...editInsuranceData, insuranceProvider: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{ ...fieldBase, borderColor: theme.border }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                              Policy Number <span style={{ color: theme.error }}>*</span>
                            </label>
                            <input
                              type="text"
                              value={editInsuranceData.policyNumber}
                              onChange={(e) => setEditInsuranceData({ ...editInsuranceData, policyNumber: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{ ...fieldBase, borderColor: theme.border }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                              Coverage Type
                            </label>
                            <input
                              type="text"
                              value={editInsuranceData.coverageType}
                              onChange={(e) => setEditInsuranceData({ ...editInsuranceData, coverageType: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{ ...fieldBase, borderColor: theme.border }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                              <DollarSign className="w-3 h-3 inline mr-1" />
                              Premium Amount
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editInsuranceData.premiumAmount}
                              onChange={(e) => setEditInsuranceData({ ...editInsuranceData, premiumAmount: parseFloat(e.target.value) })}
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{ ...fieldBase, borderColor: theme.border }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                              <Calendar className="w-3 h-3 inline mr-1" />
                              Policy Start Date
                            </label>
                            <input
                              type="date"
                              value={formatDateForInput(editInsuranceData.policyStartDate)}
                              onChange={(e) => setEditInsuranceData({ ...editInsuranceData, policyStartDate: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{ ...fieldBase, borderColor: theme.border }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                              <Calendar className="w-3 h-3 inline mr-1" />
                              Policy End Date
                            </label>
                            <input
                              type="date"
                              value={formatDateForInput(editInsuranceData.policyEndDate)}
                              onChange={(e) => setEditInsuranceData({ ...editInsuranceData, policyEndDate: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{ ...fieldBase, borderColor: theme.border }}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                              Coverage Details
                            </label>
                            <textarea
                              value={editInsuranceData.coverageDetails}
                              onChange={(e) => setEditInsuranceData({ ...editInsuranceData, coverageDetails: e.target.value })}
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg border-2 resize-none"
                              style={{ ...fieldBase, borderColor: theme.border }}
                              placeholder="Details of coverage..."
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4 pt-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 px-4 py-2 rounded-lg"
                            style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateInsurance}
                            className="flex-1 px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: theme.primary }}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Insurance Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InfoRow label="Provider" value={insurance.insuranceProvider} />
                  <InfoRow label="Policy Number" value={insurance.policyNumber} />
                  <InfoRow label="Coverage Type" value={insurance.coverageType} />
                  <InfoRow label="Premium Amount" value={formatPrice(insurance.premiumAmount)} />
                  <InfoRow label="Start Date" value={insurance.policyStartDate?.split("T")[0]} />
                  <InfoRow label="End Date" value={insurance.policyEndDate?.split("T")[0]} />
                </div>
                {insurance.coverageDetails && (
                  <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
                    <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Coverage Details</p>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>{insurance.coverageDetails}</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};