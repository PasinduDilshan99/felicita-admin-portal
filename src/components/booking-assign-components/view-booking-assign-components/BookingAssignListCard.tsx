// components/booking-assign-components/view-booking-assign-components/BookingAssignListCard.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  User,
  Calendar,
  DollarSign,
  Hash,
  MapPin,
  Users,
  Eye,
  ArrowRight,
  UserPlus,
  Phone,
  Mail,
  Gift,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { UnassignBookingBasicDetails } from "@/types/booking-assign-types";
import { hexToRgba } from "@/utils/functions";
import { formatDate, formatPrice, getSafeString } from "@/utils/commonFunctions";
import { BOOKING_ASSIGN_DETAILS_VIEW_URL } from "@/utils/urls";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  itemVariants,
  shineVariants,
} from "@/app/animations/variants";

interface BookingAssignListCardProps {
  booking: UnassignBookingBasicDetails;
}

const BookingAssignListCard: React.FC<BookingAssignListCardProps> = ({
  booking,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const bookingData = booking?.booking;
  const customer = booking?.customer;
  const tour = booking?.tour;
  const packageDetails = booking?.packageDetails;
  const schedule = booking?.schedule;
  const financial = booking?.financial;
  const assignment = booking?.assignment;
  const status = booking?.status;

  const customerName =
    `${getSafeString(customer?.firstName, "")} ${getSafeString(customer?.lastName, "")}`.trim() ||
    "Unknown Customer";
  const bookingReference = getSafeString(bookingData?.bookingReference, "N/A");
  const bookingStatus = getSafeString(status?.bookingStatus, "Pending");
  const tourName = getSafeString(tour?.tourName, "");
  const packageName = getSafeString(packageDetails?.packageName, "");
  const assignedUser = getSafeString(assignment?.assignedUser, "");
  const assignMessage = getSafeString(assignment?.assignMessage, "");
  const startLocation = getSafeString(tour?.startLocation, "N/A");
  const endLocation = getSafeString(tour?.endLocation, "N/A");
  const email = getSafeString(customer?.email, "");
  const mobileNumber = getSafeString(customer?.mobileNumber, "");
  const scheduleName = getSafeString(schedule?.scheduleName, "");

  const handleViewDetails = () => {
    router.push(`${BOOKING_ASSIGN_DETAILS_VIEW_URL}/${bookingData?.bookingId}`);
  };

  const isAssigned = !!assignment?.assignedTo;

  if (!booking || !bookingData?.bookingId) return null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div className="p-5 sm:p-6">
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.15)}, ${hexToRgba(theme.accent, 0.1)})`,
                  }}
                >
                  <User className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <motion.h3
                    className="text-xl font-bold transition-colors duration-200 cursor-pointer"
                    style={{ color: theme.text }}
                    whileHover={{ color: theme.primary }}
                    onClick={handleViewDetails}
                  >
                    {customerName}
                  </motion.h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Hash
                        className="w-3 h-3"
                        style={{ color: theme.textSecondary }}
                      />
                      <span
                        className="text-xs font-mono"
                        style={{ color: theme.textSecondary }}
                      >
                        {bookingReference}
                      </span>
                    </div>
                    {email && (
                      <div className="flex items-center gap-1">
                        <Mail
                          className="w-3 h-3"
                          style={{ color: theme.textSecondary }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          {email}
                        </span>
                      </div>
                    )}
                    {mobileNumber && (
                      <div className="flex items-center gap-1">
                        <Phone
                          className="w-3 h-3"
                          style={{ color: theme.textSecondary }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          {mobileNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
                  isAssigned
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                    : "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                }`}
              >
                {isAssigned ? "Assigned" : "Unassigned"}
              </span>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
                style={{
                  background: hexToRgba(theme.primary, 0.1),
                  color: theme.primary,
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                {bookingStatus}
              </span>
            </div>
          </motion.div>

          {/* Main Info Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 mb-4"
            style={{
              borderTop: `1px solid ${theme.border}`,
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            {/* Tour/Package */}
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Tour / Package
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{ color: theme.text }}
              >
                {tourName || packageName || "N/A"}
              </div>
              {scheduleName && (
                <div
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Schedule: {scheduleName}
                </div>
              )}
            </div>

            {/* Travel Dates */}
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Travel Dates
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{ color: theme.text }}
              >
                {formatDate(bookingData?.travelStartDate)} -{" "}
                {formatDate(bookingData?.travelEndDate)}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Booked: {formatDate(bookingData?.bookingDate)}
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Location
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin
                  className="w-3.5 h-3.5"
                  style={{ color: theme.textSecondary }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {startLocation} → {endLocation}
                </span>
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                {bookingData?.totalPersons} guests
              </div>
            </div>

            {/* Pricing */}
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Pricing
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  Total: {formatPrice(financial?.totalAmount || 0)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold" style={{ color: theme.primary }}>
                  Final: {formatPrice(financial?.finalAmount || 0)}
                </span>
                {financial?.discountAmount > 0 && (
                  <span className="text-xs" style={{ color: theme.success }}>
                    (-{formatPrice(financial?.discountAmount)})
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Additional Details */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-4"
          >
            {/* Assigned To */}
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: theme.textSecondary }}
            >
              <UserPlus className="w-4 h-4" />
              <span>
                Assigned:{" "}
                <span style={{ color: theme.text }}>
                  {assignedUser || "Not assigned"}
                </span>
              </span>
            </div>

            {/* Payment Status */}
            {financial && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: theme.textSecondary }}
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  Paid:{" "}
                  <span style={{ color: theme.success }}>
                    {formatPrice(financial.paidAmount || 0)}
                  </span>
                </span>
                <span>
                  | Due:{" "}
                  <span style={{ color: theme.warning }}>
                    {formatPrice(financial.dueAmount || 0)}
                  </span>
                </span>
              </div>
            )}

            {/* Insurance */}
            {financial?.insuranceAmount > 0 && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: theme.textSecondary }}
              >
                <Gift className="w-4 h-4" style={{ color: theme.primary }} />
                <span>
                  Insurance:{" "}
                  <span style={{ color: theme.primary }}>
                    {formatPrice(financial.insuranceAmount)}
                  </span>
                </span>
              </div>
            )}
          </motion.div>

          {/* Assign Message */}
          {assignMessage && (
            <motion.div variants={itemVariants} className="mb-4">
              <div
                className="flex items-start gap-2 p-3 rounded-lg"
                style={{ background: hexToRgba(theme.primary, 0.08) }}
              >
                <MessageSquare
                  className="w-4 h-4 mt-0.5"
                  style={{ color: theme.primary }}
                />
                <div>
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: theme.primary }}
                  >
                    Assignment Note
                  </div>
                  <span className="text-sm" style={{ color: theme.primary }}>
                    {assignMessage}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* View Details Button */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={handleViewDetails}
            className="relative cursor-pointer font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap w-full sm:w-auto"
            style={{
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent || theme.primary} 100%)`,
              color: "#fff",
              boxShadow: `0 4px 15px -3px ${theme.primary}55`,
            }}
          >
            <motion.span
              variants={shineVariants}
              initial="rest"
              animate="hover"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
              }}
            />
            <span
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "rgba(255,255,255,0.35)" }}
            />
            <Eye className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
            <span className="relative tracking-wide text-sm">
              View & Assign
            </span>
            <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookingAssignListCard;
