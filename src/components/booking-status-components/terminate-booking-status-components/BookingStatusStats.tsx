"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  AlertCircle,
  Hash,
} from "lucide-react";
import { BookingStatusAllDetails } from "@/types/booking-status-types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  containerVariants,
  statCardVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

interface BookingStatusStatsProps {
  statusDetails: BookingStatusAllDetails;
}

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export const BookingStatusStats: React.FC<BookingStatusStatsProps> = ({
  statusDetails,
}) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return theme.success;
      case "INACTIVE":
        return theme.warning || "#f59e0b";
      case "TERMINATED":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const formatDate = (date: string): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const statItems: StatItem[] = [
    {
      label: "Total Bookings",
      value: statusDetails.totalBookingsUsingThisStatus,
      icon: <BookOpen size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Active Bookings",
      value: statusDetails.activeBookingsCount,
      icon: <CheckCircle size={14} />,
      color: theme.success,
      formatter: (val) => val,
    },
    {
      label: "Completed Bookings",
      value: statusDetails.completedBookingsCount ?? 0,
      icon: <CheckCircle size={14} />,
      color: theme.accent,
      formatter: (val) => val,
    },
    {
      label: "Cancelled Bookings",
      value: statusDetails.cancelledBookingsCount ?? 0,
      icon: <XCircle size={14} />,
      color: theme.error,
      formatter: (val) => val,
    },
    {
      label: "Status",
      value: statusDetails.status || "Unknown",
      icon: <AlertCircle size={14} />,
      color: getStatusColor(statusDetails.status),
      formatter: (val) => val,
    },
    {
      label: "Created By",
      value: statusDetails.createdBy || "N/A",
      icon: <User size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Created At",
      value: formatDate(statusDetails.createdAt),
      icon: <Calendar size={14} />,
      color: theme.textSecondary,
      formatter: (val) => val,
    },
    {
      label: "Updated At",
      value: formatDate(statusDetails.updatedAt),
      icon: <Calendar size={14} />,
      color: theme.textSecondary,
      formatter: (val) => val,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        }}
      >
        {statItems.map((item, i) => {
          const displayValue = item.formatter
            ? item.formatter(item.value)
            : item.value;

          return (
            <motion.div
              key={`${item.label}-${i}`}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              className="relative rounded-xl p-3 transition-all duration-200 cursor-pointer"
              style={{
                background: hexToRgba(item.color, 0.08),
                border: `1.5px solid ${hexToRgba(item.color, 0.2)}`,
                backdropFilter: "blur(0px)",
              }}
            >
              <div
                className="flex items-center gap-1.5"
                style={{ color: item.color, opacity: 0.85 }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-xs font-medium tracking-wide">
                  {item.label}
                </span>
              </div>

              <motion.p
                variants={valueVariants}
                className="text-base sm:text-lg font-bold mt-1.5 truncate"
                style={{ color: theme.text }}
                key={`value-${item.label}-${String(displayValue)}`}
                initial="hidden"
                animate="visible"
              >
                {displayValue}
              </motion.p>

              {/* Status indicator dot */}
              {item.label === "Status" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                  className="absolute top-2 right-2"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 0 2px ${hexToRgba(item.color, 0.2)}`,
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
