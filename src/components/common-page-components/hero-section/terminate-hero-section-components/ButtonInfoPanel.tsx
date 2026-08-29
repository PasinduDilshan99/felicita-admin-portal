// components/hero-section-components/terminate-hero-section-components/ButtonInfoPanel.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Link, ExternalLink, AlertCircle } from "lucide-react";
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

interface ButtonInfoPanelProps {
  heroDetails: HeroSectionDetails;
}

export const ButtonInfoPanel: React.FC<ButtonInfoPanelProps> = ({ heroDetails }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.success, 0.05),
        border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}` }}
      >
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4" style={{ color: theme.success }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Button Information
          </h3>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: hexToRgba(theme.error, 0.1),
            color: theme.error,
            border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
          }}
        >
          Will be removed
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-4"
      >
        {/* Primary Button */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: theme.textSecondary }}>
            Primary Button
          </p>
          <div className="space-y-2">
            <motion.div variants={infoRowVariants}>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>Text</p>
              <motion.div
                variants={valueVariants}
                className="text-sm font-medium"
                style={{ color: theme.text }}
              >
                {heroDetails.primaryButtonText || "N/A"}
              </motion.div>
            </motion.div>
            <motion.div variants={infoRowVariants}>
              <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                <Link size={10} />
                Link
              </p>
              <motion.div
                variants={valueVariants}
                className="text-sm text-blue-500 hover:underline flex items-center gap-1"
              >
                {heroDetails.primaryButtonLink || "N/A"}
                {heroDetails.primaryButtonLink && <ExternalLink size={12} />}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Secondary Button */}
        {(heroDetails.secondaryButtonText || heroDetails.secondaryButtonLink) && (
          <div className="pt-3 border-t" style={{ borderColor: hexToRgba(theme.border, 0.5) }}>
            <p className="text-xs font-semibold mb-2" style={{ color: theme.textSecondary }}>
              Secondary Button
            </p>
            <div className="space-y-2">
              {heroDetails.secondaryButtonText && (
                <motion.div variants={infoRowVariants}>
                  <p className="text-[10px]" style={{ color: theme.textSecondary }}>Text</p>
                  <motion.div
                    variants={valueVariants}
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {heroDetails.secondaryButtonText}
                  </motion.div>
                </motion.div>
              )}
              {heroDetails.secondaryButtonLink && (
                <motion.div variants={infoRowVariants}>
                  <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                    <Link size={10} />
                    Link
                  </p>
                  <motion.div
                    variants={valueVariants}
                    className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                  >
                    {heroDetails.secondaryButtonLink}
                    <ExternalLink size={12} />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Note */}
        <motion.div
          variants={infoRowVariants}
          className="flex items-start gap-2 p-2 rounded-lg"
          style={{
            background: hexToRgba(theme.warning || "#f59e0b", 0.08),
            border: `1px solid ${hexToRgba(theme.warning || "#f59e0b", 0.2)}`,
          }}
        >
          <AlertCircle size={14} style={{ color: theme.warning || "#f59e0b", marginTop: 1 }} />
          <p className="text-xs" style={{ color: theme.warning || "#f59e0b" }}>
            Both buttons and their links will be permanently removed upon termination.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};