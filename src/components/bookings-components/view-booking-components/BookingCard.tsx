// components/bookings-components/view-booking-components/BookingCard.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  User,
  Calendar,
  DollarSign,
  Hash,
  Tag,
  MapPin,
  Users,
  CreditCard,
  Gift,
  Shield,
  MessageSquare,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingBasicDetails } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";
import {
  formatDate,
  formatPrice,
  getSafeString,
} from "@/utils/commonFunctions";
import { TOUR_BOOKINGS_DETAILS_VIEW_URL } from "@/utils/urls";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  itemVariants,
  shineVariants,
} from "@/app/animations/variants";

interface BookingCardProps {
  booking: BookingBasicDetails;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const customerName = getSafeString(booking?.customerName, "Unknown Customer");
  const bookingReference = getSafeString(booking?.bookingReference, "N/A");
  const bookingStatusName = getSafeString(
    booking?.bookingStatusName,
    "Pending",
  );
  const tourName = getSafeString(booking?.tourName, "");
  const packageName = getSafeString(booking?.packageName, "");
  const startLocation = getSafeString(booking?.startLocation, "N/A");
  const endLocation = getSafeString(booking?.endLocation, "N/A");
  const assignedEmployeeName = getSafeString(
    booking?.assignedEmployeeName,
    "Unassigned",
  );
  const specialRequirements = getSafeString(booking?.specialRequirements, "");
  const bookingDate = booking?.bookingDate;
  const travelStartDate = booking?.travelStartDate;
  const travelEndDate = booking?.travelEndDate;
  const totalPersons = booking?.totalPersons || 0;
  const totalAmount = booking?.totalAmount || 0;
  const discountAmount = booking?.discountAmount || 0;
  const finalAmount = booking?.finalAmount || 0;
  const insuranceRequired = booking?.insuranceRequired || false;
  const insuranceAmount = booking?.insuranceAmount || 0;

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
    }
    return { bg: "from-gray-500 to-gray-600", text: "text-gray-600" };
  };

  const statusColor = getStatusColor(bookingStatusName);

  const handleViewDetails = () => {
    router.push(`${TOUR_BOOKINGS_DETAILS_VIEW_URL}/${booking.bookingId}`);
  };

  if (!booking || !booking.bookingId) return null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Header Section with Status */}
      <div
        className="relative p-5"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.08)}, ${hexToRgba(theme.accent, 0.05)})`,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg bg-gradient-to-r ${statusColor.bg} text-white`}
          >
            {bookingStatusName}
          </span>
        </div>

        <div className="flex items-start gap-3 pr-24">
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
              className="text-lg font-bold transition-colors duration-200 line-clamp-1"
              style={{ color: theme.text }}
              whileHover={{ color: theme.primary }}
              onClick={handleViewDetails}
            >
              {customerName}
            </motion.h3>
            <div className="flex items-center gap-2 mt-1">
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

      {/* Content Section */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="p-5 flex-grow flex flex-col gap-3"
      >
        {/* Booking Details */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar
                className="w-4 h-4"
                style={{ color: theme.textSecondary }}
              />
              <span style={{ color: theme.textSecondary }}>Booked:</span>
              <span style={{ color: theme.text }}>
                {formatDate(bookingDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users
                className="w-4 h-4"
                style={{ color: theme.textSecondary }}
              />
              <span style={{ color: theme.textSecondary }}>Guests:</span>
              <span style={{ color: theme.text }}>{totalPersons}</span>
            </div>
          </div>
        </motion.div>

        {/* Tour or Package */}
        <motion.div variants={itemVariants}>
          {tourName && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" style={{ color: theme.accent }} />
              <span
                className="text-sm font-medium"
                style={{ color: theme.accent }}
              >
                Tour: {tourName}
              </span>
            </div>
          )}
          {packageName && (
            <div className="flex items-center gap-2 mt-1">
              <Gift className="w-4 h-4" style={{ color: theme.success }} />
              <span
                className="text-sm font-medium"
                style={{ color: theme.success }}
              >
                Package: {packageName}
              </span>
            </div>
          )}
        </motion.div>

        {/* Location */}
        <motion.div variants={itemVariants}>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: theme.textSecondary }}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {startLocation} → {endLocation}
            </span>
          </div>
        </motion.div>

        {/* Travel Dates */}
        <motion.div variants={itemVariants}>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: theme.textSecondary }}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Travel: {formatDate(travelStartDate)} -{" "}
              {formatDate(travelEndDate)}
            </span>
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          variants={itemVariants}
          className="py-3 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.05)}, ${hexToRgba(theme.accent, 0.05)})`,
            borderTop: `1px solid ${theme.border}`,
            marginTop: "auto",
          }}
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Total
              </div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                {formatPrice(totalAmount)}
              </div>
            </div>
            {discountAmount > 0 && (
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Discount
                </div>
                <div
                  className="text-sm font-bold"
                  style={{ color: theme.success }}
                >
                  -{formatPrice(discountAmount)}
                </div>
              </div>
            )}
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Final
              </div>
              <div
                className="text-sm font-bold"
                style={{ color: theme.primary }}
              >
                {formatPrice(finalAmount)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Assigned To */}
        <motion.div variants={itemVariants}>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: theme.textSecondary }}
          >
            <User className="w-3.5 h-3.5" />
            <span>Assigned to: {assignedEmployeeName}</span>
          </div>
        </motion.div>

        {/* Insurance Badge */}
        {insuranceRequired && (
          <motion.div variants={itemVariants}>
            <div
              className="flex items-center gap-2 text-xs px-2 py-1 rounded-full w-fit"
              style={{
                background: hexToRgba(theme.primary, 0.1),
                color: theme.primary,
              }}
            >
              <Shield className="w-3 h-3" />
              <span>Insurance: {formatPrice(insuranceAmount)}</span>
            </div>
          </motion.div>
        )}

        {/* Special Requirements */}
        {specialRequirements && (
          <motion.div variants={itemVariants}>
            <div
              className="flex items-start gap-2 text-xs px-2 py-1 rounded"
              style={{
                background: hexToRgba(theme.warning, 0.08),
              }}
            >
              <MessageSquare
                className="w-3.5 h-3.5 mt-0.5"
                style={{ color: theme.warning }}
              />
              <span className="line-clamp-1" style={{ color: theme.warning }}>
                {specialRequirements}
              </span>
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
          className="relative w-full mt-2 font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
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
          <Eye className="relative w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="relative tracking-wide text-sm">View Details</span>
          <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BookingCard;
