"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Edit, Calendar, Users, DollarSign, Info } from "lucide-react";
import { BookingAllDetails } from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface BookingBasicInfoFormProps {
  booking: BookingAllDetails;
  onFieldChange: (field: string, value: any) => void;
  statusOptions: Array<{
    value: string;
    label: string;
    description: string;
    color: string;
  }>;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
  formatPrice: (price: number) => string;
}

export const BookingBasicInfoForm: React.FC<BookingBasicInfoFormProps> = ({
  booking,
  onFieldChange,
  statusOptions,
  expandedSections,
  onToggleSection,
  theme,
  formatPrice,
}) => {
  const info = booking.bookingInformation;

  const focusHandlers = {
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    return date.split("T")[0];
  };

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
        onClick={() => onToggleSection("basic")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("basic")
            ? `${theme.primary}05`
            : "transparent",
          borderBottom: expandedSections.has("basic")
            ? `1px solid ${theme.border}`
            : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.primary}18`,
              color: theme.primary,
            }}
          >
            <Edit className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-sm sm:text-base font-semibold"
              style={{ color: theme.text }}
            >
              Basic Information
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              Booking reference: {info.bookingReference}
            </p>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{
            transform: expandedSections.has("basic")
              ? "rotate(180deg)"
              : "none",
            color: theme.textSecondary,
          }}
        />
      </button>

      <AnimatePresence>
        {expandedSections.has("basic") && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-6 space-y-5"
          >
            {/* Booking Date */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                style={{ color: theme.textSecondary }}
              >
                <Calendar className="w-3.5 h-3.5" />
                Booking Date <span style={{ color: theme.error }}>*</span>
              </label>
              <input
                type="date"
                value={formatDateForInput(info.bookingDate)}
                onChange={(e) => onFieldChange("bookingDate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{ ...fieldBase, borderColor: theme.border }}
                {...focusHandlers}
              />
            </div>

            {/* Travel Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                  style={{ color: theme.textSecondary }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Travel Start Date{" "}
                  <span style={{ color: theme.error }}>*</span>
                </label>
                <input
                  type="date"
                  value={formatDateForInput(info.travelStartDate)}
                  onChange={(e) =>
                    onFieldChange("travelStartDate", e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                  style={{ ...fieldBase, borderColor: theme.border }}
                  {...focusHandlers}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                  style={{ color: theme.textSecondary }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Travel End Date <span style={{ color: theme.error }}>*</span>
                </label>
                <input
                  type="date"
                  value={formatDateForInput(info.travelEndDate)}
                  onChange={(e) =>
                    onFieldChange("travelEndDate", e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                  style={{ ...fieldBase, borderColor: theme.border }}
                  {...focusHandlers}
                />
              </div>
            </div>

            {/* Persons */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                style={{ color: theme.textSecondary }}
              >
                <Users className="w-3.5 h-3.5" />
                Total Persons <span style={{ color: theme.error }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                value={info.totalPersons}
                onChange={(e) =>
                  onFieldChange("totalPersons", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{ ...fieldBase, borderColor: theme.border }}
                {...focusHandlers}
              />
            </div>

            {/* Insurance Required */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={info.insuranceRequired}
                  onChange={(e) =>
                    onFieldChange("insuranceRequired", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                  style={{ accentColor: theme.primary }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Insurance Required
                </span>
              </label>
            </div>

            {/* Financial Details */}
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: `${theme.border}10` }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5"
                style={{ color: theme.textSecondary }}
              >
                <DollarSign className="w-3.5 h-3.5" /> Financial Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Total Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={info.totalAmount}
                    onChange={(e) =>
                      onFieldChange("totalAmount", parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{ ...fieldBase, borderColor: theme.border }}
                    {...focusHandlers}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={info.discountAmount}
                    onChange={(e) =>
                      onFieldChange(
                        "discountAmount",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{ ...fieldBase, borderColor: theme.border }}
                    {...focusHandlers}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Tax Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={info.taxAmount}
                    onChange={(e) =>
                      onFieldChange("taxAmount", parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{ ...fieldBase, borderColor: theme.border }}
                    {...focusHandlers}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Insurance Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={info.insuranceAmount}
                    onChange={(e) =>
                      onFieldChange(
                        "insuranceAmount",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{ ...fieldBase, borderColor: theme.border }}
                    {...focusHandlers}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Final Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={info.finalAmount}
                    onChange={(e) =>
                      onFieldChange("finalAmount", parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                    style={{ ...fieldBase, borderColor: theme.border }}
                    {...focusHandlers}
                  />
                </div>
                <div className="flex items-end">
                  <div
                    className="p-2 rounded-lg w-full text-center"
                    style={{ backgroundColor: `${theme.success}10` }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Final Amount
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: theme.success }}
                    >
                      {formatPrice(info.finalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textSecondary }}
              >
                Booking Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statusOptions.map((opt) => {
                  const isSelected =
                    booking.bookingStatusInformation.bookingStatusName ===
                    opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onFieldChange("bookingStatus", opt.value)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all"
                      style={{
                        backgroundColor: isSelected
                          ? `${opt.color}10`
                          : theme.background,
                        borderColor: isSelected ? opt.color : theme.border,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: opt.color }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: isSelected ? opt.color : theme.text }}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Requirements & Dietary Restrictions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                  style={{ color: theme.textSecondary }}
                >
                  <Info className="w-3.5 h-3.5" />
                  Special Requirements
                </label>
                <textarea
                  value={info.specialRequirements || ""}
                  onChange={(e) =>
                    onFieldChange("specialRequirements", e.target.value)
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                  style={{ ...fieldBase, borderColor: theme.border }}
                  placeholder="Any special requirements..."
                  {...focusHandlers}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                  style={{ color: theme.textSecondary }}
                >
                  <Info className="w-3.5 h-3.5" />
                  Dietary Restrictions
                </label>
                <textarea
                  value={info.dietaryRestrictions || ""}
                  onChange={(e) =>
                    onFieldChange("dietaryRestrictions", e.target.value)
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                  style={{ ...fieldBase, borderColor: theme.border }}
                  placeholder="Any dietary restrictions..."
                  {...focusHandlers}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper component
const ChevronDown: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);
