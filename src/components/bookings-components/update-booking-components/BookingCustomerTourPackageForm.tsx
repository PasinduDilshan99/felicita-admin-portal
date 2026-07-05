"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { User, MapPin, Package, ChevronDown } from "lucide-react";
import { BookingAllDetails, CreateBookingParams } from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";

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

interface BookingCustomerTourPackageFormProps {
  booking: BookingAllDetails;
  bookingParams: CreateBookingParams;
  onFieldChange: (field: string, value: any) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const BookingCustomerTourPackageForm: React.FC<BookingCustomerTourPackageFormProps> = ({
  booking,
  bookingParams,
  onFieldChange,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const customer = booking.customerInformation;
  const tour = booking.tourInformation;
  const pkg = booking.packageInformation;
  const assignment = booking.assignmentInformation;

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const InfoRow = ({ label, value }: { label: string; value: string | number | null }) => (
    <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
      <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>{label}</p>
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
        onClick={() => onToggleSection("customer-tour")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("customer-tour") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("customer-tour") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.success}18`, color: theme.success }}
          >
            <User className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Customer, Tour & Package
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {customer.fullName} - {tour.tourName}
            </p>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{ 
            transform: expandedSections.has("customer-tour") ? "rotate(180deg)" : "none", 
            color: theme.textSecondary 
          }}
        />
      </button>

      <AnimatePresence>
        {expandedSections.has("customer-tour") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6 space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: theme.text }}>
                <User className="w-4 h-4" style={{ color: theme.primary }} />
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InfoRow label="Full Name" value={customer.fullName} />
                <InfoRow label="Email" value={customer.email} />
                <InfoRow label="Mobile Number" value={customer.mobileNumber} />
                <InfoRow label="Passport Number" value={customer.passportNumber} />
              </div>
            </div>

            {/* Tour Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: theme.text }}>
                <MapPin className="w-4 h-4" style={{ color: theme.accent }} />
                Tour Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InfoRow label="Tour Name" value={tour.tourName} />
                <InfoRow label="Duration" value={`${tour.duration} days`} />
                <InfoRow label="Start Location" value={tour.startLocation} />
                <InfoRow label="End Location" value={tour.endLocation} />
              </div>
              {tour.tourDescription && (
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
                  <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Description</p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>{tour.tourDescription}</p>
                </div>
              )}
            </div>

            {/* Package Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: theme.text }}>
                <Package className="w-4 h-4" style={{ color: theme.success }} />
                Package Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InfoRow label="Package Name" value={pkg.packageName} />
                <InfoRow label="Total Price" value={`$${pkg.packageTotalPrice}`} />
                <InfoRow label="Price Per Person" value={`$${pkg.pricePerPerson}`} />
                <InfoRow label="Discount" value={`${pkg.discountPercentage}%`} />
              </div>
              {pkg.packageDescription && (
                <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
                  <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Description</p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>{pkg.packageDescription}</p>
                </div>
              )}
            </div>

            {/* Assignment Information */}
            {assignment && (
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>
                  Assignment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow label="Assigned To" value={assignment.employeeName} />
                  <InfoRow label="Department" value={assignment.departmentName} />
                  <InfoRow label="Designation" value={assignment.designationName} />
                  <InfoRow label="Message" value={assignment.assignMessage} />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};