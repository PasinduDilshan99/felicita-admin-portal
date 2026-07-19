// components/hero-section-components/terminate-hero-section-components/BasicInfoPanel.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { FileText, Hash, Calendar, Clock, User, AlertCircle, Image } from "lucide-react";
import { HeroSectionDetails } from "@/types/hero-section-types";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1, duration: 0.3 } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
    },
  },
};

const infoRowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const valueVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
};

interface BasicInfoPanelProps {
  heroDetails: HeroSectionDetails;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ heroDetails }) => {
  const { theme } = useTheme();

  const formatDate = (date: string): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
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
        <FileText className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Content Information
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Name */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
            <Hash size={11} />
            Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {heroDetails.name}
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
            Title
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {heroDetails.title}
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        {heroDetails.subtitle && (
          <motion.div variants={infoRowVariants}>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
              Subtitle
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {heroDetails.subtitle}
            </motion.div>
          </motion.div>
        )}

        {/* Description */}
        {heroDetails.description && (
          <motion.div variants={infoRowVariants}>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
              Description
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm leading-relaxed"
              style={{ color: theme.textSecondary }}
            >
              {heroDetails.description}
            </motion.div>
          </motion.div>
        )}

        {/* Audit Info */}
        <motion.div variants={infoRowVariants} className="pt-2 border-t" style={{ borderColor: hexToRgba(theme.border, 0.5) }}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                <User size={10} />
                Created By
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {heroDetails.createdByUsername} (ID: {heroDetails.createdBy})
              </p>
            </div>
            <div>
              <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                <Clock size={10} />
                Created At
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {formatDate(heroDetails.createdAt)}
              </p>
            </div>
          </div>

          {heroDetails.updatedByUsername && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                  <User size={10} />
                  Updated By
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  {heroDetails.updatedByUsername} (ID: {heroDetails.updatedBy})
                </p>
              </div>
              <div>
                <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                  <Clock size={10} />
                  Updated At
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  {formatDate(heroDetails.updatedAt)}
                </p>
              </div>
            </div>
          )}

          {heroDetails.terminatedByUsername && (
            <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={{ borderColor: hexToRgba(theme.error, 0.3) }}>
              <div>
                <p className="text-[10px] flex items-center gap-1" style={{ color: theme.error }}>
                  <User size={10} />
                  Terminated By
                </p>
                <p className="text-xs" style={{ color: theme.error }}>
                  {heroDetails.terminatedByUsername} (ID: {heroDetails.terminatedBy})
                </p>
              </div>
              <div>
                <p className="text-[10px] flex items-center gap-1" style={{ color: theme.error }}>
                  <Clock size={10} />
                  Terminated At
                </p>
                <p className="text-xs" style={{ color: theme.error }}>
                  {formatDate(heroDetails.terminatedAt || "")}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};