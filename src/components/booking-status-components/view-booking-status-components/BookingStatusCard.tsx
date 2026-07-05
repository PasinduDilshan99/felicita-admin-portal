// components/booking-status-components/view-booking-status-components/BookingStatusCard.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Hash,
  FileText,
  Eye,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingStatusListItem } from "@/types/booking-status-types";
import { hexToRgba } from "@/utils/functions";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  itemVariants,
  shineVariants,
} from "@/app/animations/variants";
import { getSafeString } from "@/utils/commonFunctions";
import { BOOKING_STATUS_DETAILS_VIEW_URL } from "@/utils/urls";

interface BookingStatusCardProps {
  status: BookingStatusListItem;
}

const BookingStatusCard: React.FC<BookingStatusCardProps> = ({ status }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const statusName = getSafeString(status?.statusName, "Unnamed Status");
  const description = getSafeString(status?.description, "");
  const statusValue = status?.status || "INACTIVE";
  const isActive = statusValue === "ACTIVE";

  const handleViewDetails = () => {
    router.push(
      `${BOOKING_STATUS_DETAILS_VIEW_URL}/${status.statusId}?name=${encodeURIComponent(statusName)}`,
    );
  };

  if (!status || !status.statusId) return null;

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
              isActive
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
            }`}
          >
            {isActive ? (
              <>
                <motion.div
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Active
              </>
            ) : (
              "Inactive"
            )}
          </span>
        </div>

        <div className="flex items-start gap-3 pr-24">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.15)}, ${hexToRgba(theme.accent, 0.1)})`,
            }}
          >
            <FileText className="w-5 h-5" style={{ color: theme.primary }} />
          </div>
          <div>
            <motion.h3
              className="text-lg font-bold transition-colors duration-200"
              style={{ color: theme.text }}
              whileHover={{ color: theme.primary }}
              onClick={handleViewDetails}
            >
              {statusName}
            </motion.h3>
            <div className="flex items-center gap-2 mt-1">
              <Hash
                className="w-3 h-3"
                style={{ color: theme.textSecondary }}
              />
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                ID: {status.statusId}
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
        className="p-5 flex-grow flex flex-col"
      >
        {/* Description */}
        {description && (
          <motion.p
            variants={itemVariants}
            className="text-sm leading-relaxed mb-4 line-clamp-3"
            style={{ color: theme.textSecondary }}
          >
            {description}
          </motion.p>
        )}

        {/* Status Icon */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center py-4 rounded-xl mb-4"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(isActive ? theme.success : theme.error, 0.05)}, ${hexToRgba(isActive ? theme.success : theme.error, 0.02)})`,
            border: `1px solid ${hexToRgba(isActive ? theme.success : theme.error, 0.15)}`,
            marginTop: "auto",
          }}
        >
          {isActive ? (
            <div className="flex items-center gap-2">
              <CheckCircle
                className="w-6 h-6"
                style={{ color: theme.success }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: theme.success }}
              >
                Status is Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="w-6 h-6" style={{ color: theme.error }} />
              <span
                className="text-sm font-medium"
                style={{ color: theme.error }}
              >
                Status is Inactive
              </span>
            </div>
          )}
        </motion.div>

        {/* View Details Button */}
        <motion.button
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={handleViewDetails}
          className="relative w-full mt-auto font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
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

export default BookingStatusCard;
