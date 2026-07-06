// components/booking-assign-components/view-booking-assign-components/BookingAssignCard.tsx
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
  CreditCard,
  Gift,
  MessageSquare,
  Eye,
  ArrowRight,
  UserPlus,
  Phone,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { UnassignBookingBasicDetails } from "@/types/booking-assign-types";
import { hexToRgba } from "@/utils/functions";
import {
  formatDate,
  formatPrice,
  getSafeString,
} from "@/utils/commonFunctions";
import { BOOKING_ASSIGN_DETAILS_VIEW_URL } from "@/utils/urls";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  itemVariants,
  shineVariants,
} from "@/app/animations/variants";

interface BookingAssignCardProps {
  booking: UnassignBookingBasicDetails;
}

const BookingAssignCard: React.FC<BookingAssignCardProps> = ({ booking }) => {
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
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
              isAssigned
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                : "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
            }`}
          >
            {isAssigned ? "Assigned" : "Unassigned"}
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
        className="p-5 flex-grow flex flex-col gap-2"
      >
        {/* Customer Contact */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col gap-1 text-xs">
            {email && (
              <div className="flex items-center gap-2">
                <Mail
                  className="w-3.5 h-3.5"
                  style={{ color: theme.textSecondary }}
                />
                <span style={{ color: theme.text }}>{email}</span>
              </div>
            )}
            {mobileNumber && (
              <div className="flex items-center gap-2">
                <Phone
                  className="w-3.5 h-3.5"
                  style={{ color: theme.textSecondary }}
                />
                <span style={{ color: theme.text }}>{mobileNumber}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tour or Package */}
        <motion.div variants={itemVariants}>
          {tourName && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: theme.accent }} />
              <span
                className="text-sm font-medium line-clamp-1"
                style={{ color: theme.accent }}
              >
                {tourName}
              </span>
            </div>
          )}
          {packageName && (
            <div className="flex items-center gap-2 mt-1">
              <Gift className="w-4 h-4" style={{ color: theme.success }} />
              <span
                className="text-sm font-medium line-clamp-1"
                style={{ color: theme.success }}
              >
                {packageName}
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

        {/* Booking Details */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-2">
              <Calendar
                className="w-3.5 h-3.5"
                style={{ color: theme.textSecondary }}
              />
              <span style={{ color: theme.textSecondary }}>Booked:</span>
              <span style={{ color: theme.text }}>
                {formatDate(bookingData?.bookingDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users
                className="w-3.5 h-3.5"
                style={{ color: theme.textSecondary }}
              />
              <span style={{ color: theme.textSecondary }}>Guests:</span>
              <span style={{ color: theme.text }}>
                {bookingData?.totalPersons}
              </span>
            </div>
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
              Travel: {formatDate(bookingData?.travelStartDate)} -{" "}
              {formatDate(bookingData?.travelEndDate)}
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
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Total
              </div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                {formatPrice(financial?.totalAmount || 0)}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Final
              </div>
              <div
                className="text-sm font-bold"
                style={{ color: theme.primary }}
              >
                {formatPrice(financial?.finalAmount || 0)}
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
            <UserPlus className="w-3.5 h-3.5" />
            <span>Assigned to: {assignedUser || "Not assigned"}</span>
          </div>
        </motion.div>

        {/* Assign Message */}
        {assignMessage && (
          <motion.div variants={itemVariants}>
            <div
              className="flex items-start gap-2 text-xs px-2 py-1 rounded"
              style={{
                background: hexToRgba(theme.primary, 0.08),
              }}
            >
              <MessageSquare
                className="w-3.5 h-3.5 mt-0.5"
                style={{ color: theme.primary }}
              />
              <span className="line-clamp-1" style={{ color: theme.primary }}>
                {assignMessage}
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
          <span className="relative tracking-wide text-sm">View & Assign</span>
          <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BookingAssignCard;
