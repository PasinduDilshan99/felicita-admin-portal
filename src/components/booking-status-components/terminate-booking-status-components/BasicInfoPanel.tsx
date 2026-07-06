"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Tag, Info, Hash, Clock, User } from "lucide-react";
import { BookingStatusAllDetails } from "@/types/booking-status-types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

interface BasicInfoPanelProps {
  statusDetails: BookingStatusAllDetails;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({
  statusDetails,
}) => {
  const { theme } = useTheme();

  const formatDate = (date: string): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.primary, 0.04),
        border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}` }}
      >
        <Tag className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Status Information
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Status Name */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <Hash size={11} />
            Status Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {statusDetails.statusName}
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <Info size={11} />
            Description
          </p>
          <motion.div
            variants={valueVariants}
            className="text-xs leading-relaxed break-words"
            style={{ color: theme.textSecondary }}
          >
            {statusDetails.description || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Status Badge */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Status Level
          </p>
          <motion.div
            variants={valueVariants}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: hexToRgba(getStatusColor(statusDetails.status), 0.1),
              color: getStatusColor(statusDetails.status),
              border: `1px solid ${hexToRgba(getStatusColor(statusDetails.status), 0.3)}`,
            }}
          >
            {statusDetails.status || "Unknown"}
          </motion.div>
        </motion.div>

        {/* Audit Information */}
        <motion.div
          variants={infoRowVariants}
          className="pt-2 space-y-2 border-t"
          style={{ borderColor: hexToRgba(theme.border, 0.5) }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p
                className="text-[10px] flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <User size={10} />
                Created By
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                ID: {statusDetails.createdBy}
              </p>
            </div>
            <div>
              <p
                className="text-[10px] flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <Clock size={10} />
                Created At
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {formatDate(statusDetails.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p
                className="text-[10px] flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <User size={10} />
                Updated By
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {statusDetails.updatedBy !== null
                  ? `ID: ${statusDetails.updatedBy}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p
                className="text-[10px] flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <Clock size={10} />
                Updated At
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {formatDate(statusDetails.updatedAt)}
              </p>
            </div>
          </div>

          {statusDetails.terminatedBy !== null && (
            <div
              className="grid grid-cols-2 gap-3 pt-1 border-t"
              style={{ borderColor: hexToRgba(theme.error, 0.3) }}
            >
              <div>
                <p
                  className="text-[10px] flex items-center gap-1"
                  style={{ color: theme.error }}
                >
                  <User size={10} />
                  Terminated By
                </p>
                <p className="text-xs" style={{ color: theme.error }}>
                  ID: {statusDetails.terminatedBy}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] flex items-center gap-1"
                  style={{ color: theme.error }}
                >
                  <Clock size={10} />
                  Terminated At
                </p>
                <p className="text-xs" style={{ color: theme.error }}>
                  {formatDate(statusDetails.terminatedAt || "")}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
