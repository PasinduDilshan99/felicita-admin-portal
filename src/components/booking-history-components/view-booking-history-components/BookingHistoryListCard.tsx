// components/booking-history-components/view-booking-history-components/BookingHistoryListCard.tsx
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
  History,
  CreditCard,
  Gift,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingHistoryBasicDetails } from "@/types/booking-history-types";
import { hexToRgba } from "@/utils/functions";
import {
  formatDate,
  formatPrice,
  getSafeString,
} from "@/utils/commonFunctions";
import { BOOKING_HISTORY_DETAILS_VIEW_URL } from "@/utils/urls";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  itemVariants,
  shineVariants,
} from "@/app/animations/variants";

interface BookingHistoryListCardProps {
  booking: BookingHistoryBasicDetails;
}

const BookingHistoryListCard: React.FC<BookingHistoryListCardProps> = ({
  booking,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const customerName = getSafeString(booking?.customerName, "Unknown Customer");
  const bookingReference = getSafeString(booking?.bookingReference, "N/A");
  const bookingStatus = getSafeString(booking?.bookingStatus, "Pending");
  const tourName = getSafeString(booking?.tourName, "");
  const packageName = getSafeString(booking?.packageName, "");
  const assignedEmployee = getSafeString(
    booking?.assignedEmployee,
    "Unassigned",
  );
  const history = getSafeString(booking?.history, "");
  const bookingDate = booking?.bookingDate;
  const travelStartDate = booking?.travelStartDate;
  const travelEndDate = booking?.travelEndDate;
  const totalPersons = booking?.totalPersons || 0;
  const finalAmount = booking?.finalAmount || 0;
  const paidAmount = booking?.paidAmount || 0;
  const dueAmount = booking?.dueAmount || 0;
  const refundAmount = booking?.refundAmount || 0;

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("confirmed") || statusLower.includes("active")) {
      return { bg: "from-green-500 to-emerald-600", text: "text-green-600" };
    } else if (statusLower.includes("pending")) {
      return { bg: "from-amber-500 to-orange-600", text: "text-amber-600" };
    } else if (
      statusLower.includes("cancelled") ||
      statusLower.includes("canceled")
    ) {
      return { bg: "from-red-500 to-rose-600", text: "text-red-600" };
    } else if (statusLower.includes("completed")) {
      return { bg: "from-blue-500 to-indigo-600", text: "text-blue-600" };
    } else if (statusLower.includes("refunded")) {
      return { bg: "from-purple-500 to-violet-600", text: "text-purple-600" };
    }
    return { bg: "from-gray-500 to-gray-600", text: "text-gray-600" };
  };

  const statusColor = getStatusColor(bookingStatus);

  const handleViewDetails = () => {
    router.push(`${BOOKING_HISTORY_DETAILS_VIEW_URL}/${booking.bookingId}`);
  };

  if (!booking || !booking.bookingId) return null;

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
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg bg-gradient-to-r ${statusColor.bg} text-white`}
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
              {tourName && packageName && (
                <div
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  + Package: {packageName}
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
                {formatDate(travelStartDate)} - {formatDate(travelEndDate)}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Booked: {formatDate(bookingDate)}
              </div>
            </div>

            {/* Guests & Assigned */}
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Details
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Users
                  className="w-3.5 h-3.5"
                  style={{ color: theme.textSecondary }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {totalPersons} guests
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <UserCheck
                  className="w-3.5 h-3.5"
                  style={{ color: theme.textSecondary }}
                />
                <span
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  {assignedEmployee}
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Financial
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-sm font-bold"
                  style={{ color: theme.primary }}
                >
                  Final: {formatPrice(finalAmount)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span style={{ color: theme.success }}>
                  Paid: {formatPrice(paidAmount)}
                </span>
                <span
                  style={{ color: dueAmount > 0 ? theme.error : theme.success }}
                >
                  Due: {formatPrice(dueAmount)}
                </span>
                {refundAmount > 0 && (
                  <span style={{ color: theme.secondary }}>
                    Refund: {formatPrice(refundAmount)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* History Note */}
          {history && (
            <motion.div variants={itemVariants} className="mb-4">
              <div
                className="flex items-start gap-2 p-3 rounded-lg"
                style={{ background: hexToRgba(theme.primary, 0.08) }}
              >
                <History
                  className="w-4 h-4 mt-0.5"
                  style={{ color: theme.primary }}
                />
                <div>
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: theme.primary }}
                  >
                    History Note
                  </div>
                  <span className="text-sm" style={{ color: theme.primary }}>
                    {history}
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
            <span className="relative tracking-wide text-sm">View Details</span>
            <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookingHistoryListCard;
