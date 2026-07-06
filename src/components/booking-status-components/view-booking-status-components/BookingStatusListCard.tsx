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
import { getSafeString } from "@/utils/commonFunctions";
import { BOOKING_STATUS_DETAILS_VIEW_URL } from "@/utils/urls";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  itemVariants,
  shineVariants,
} from "@/app/animations/variants";

interface BookingStatusListCardProps {
  status: BookingStatusListItem;
}

const BookingStatusListCard: React.FC<BookingStatusListCardProps> = ({
  status,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const statusName = getSafeString(status?.statusName, "Unnamed Status");
  const description = getSafeString(
    status?.description,
    "No description available",
  );
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
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.15)}, ${hexToRgba(theme.accent, 0.1)})`,
                  }}
                >
                  <FileText
                    className="w-5 h-5"
                    style={{ color: theme.primary }}
                  />
                </div>
                <div>
                  <motion.h3
                    className="text-xl font-bold transition-colors duration-200 cursor-pointer"
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
                    <span
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      ID: {status.statusId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
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
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mb-6 leading-relaxed pl-4 py-2 rounded-r-lg text-sm"
            style={{
              color: theme.textSecondary,
              borderLeft: `4px solid ${hexToRgba(theme.primary, 0.3)}`,
              background: `linear-gradient(90deg, ${hexToRgba(theme.primary, 0.05)}, transparent)`,
            }}
          >
            {description}
          </motion.p>

          {/* Status Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 py-4 mb-6"
            style={{
              borderTop: `1px solid ${theme.border}`,
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle
                className="w-4 h-4"
                style={{ color: theme.textSecondary }}
              />
              <span className="text-sm" style={{ color: theme.textSecondary }}>
                Status Type:
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isActive ? (
                <>
                  <CheckCircle
                    className="w-4 h-4"
                    style={{ color: theme.success }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.success }}
                  >
                    Active
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" style={{ color: theme.error }} />
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.error }}
                  >
                    Inactive
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Hash
                className="w-4 h-4"
                style={{ color: theme.textSecondary }}
              />
              <span className="text-sm" style={{ color: theme.textSecondary }}>
                Status Code: {status.statusId}
              </span>
            </div>
          </motion.div>

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

export default BookingStatusListCard;
