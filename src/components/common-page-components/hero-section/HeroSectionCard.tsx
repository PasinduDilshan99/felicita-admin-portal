"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, ArrowRight, Tag, Hash, Link, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import {
  HeroSectionCardProps,
} from "@/types/hero-section-types";
import { hexToRgba } from "@/utils/functions";
import { getSafeString } from "@/utils/commonFunctions";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  imageVariants,
  itemVariants,
  overlayVariants,
  shineVariants,
} from "@/app/animations/variants";

const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const HeroSectionCard: React.FC<HeroSectionCardProps> = ({
  heroSection,
  heroSectionType,
  heroSectionDetailsViewUrl,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const name = getSafeString(heroSection?.name, "Unnamed Section");
  const title = getSafeString(heroSection?.title, "");
  const subtitle = getSafeString(heroSection?.subtitle, "");
  const description = getSafeString(heroSection?.description, "");
  const imageUrl = getSafeString(heroSection?.imageUrl, PLACE_HOLDER_IMAGE);
  const primaryButtonText = getSafeString(heroSection?.primaryButtonText, "");
  const secondaryButtonText = getSafeString(
    heroSection?.secondaryButtonText,
    "",
  );
  const status = getSafeString(heroSection?.status, "INACTIVE");
  const order = heroSection?.order || 0;
  const isActive = status === "ACTIVE";

  const handleViewDetails = () => {
    router.push(
      `${heroSectionDetailsViewUrl}/${heroSection.id}?type=${heroSectionType}&name=${encodeURIComponent(name)}`,
    );
  };

  if (!heroSection || !heroSection.id) return null;

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
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <div className="relative w-full h-full">
          <motion.img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            variants={imageVariants}
            initial="rest"
            animate="hover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
            }}
          />

          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
          />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
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

          {/* Order Badge */}
          <div className="absolute top-4 right-4">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
              style={{
                background: hexToRgba(theme.primary, 0.9),
                color: "#fff",
              }}
            >
              Order #{order}
            </span>
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
        <motion.div variants={itemVariants} className="mb-3">
          <motion.h3
            className="text-lg font-bold transition-colors duration-200 cursor-pointer line-clamp-1"
            style={{ color: theme.text }}
            whileHover={{ color: theme.primary }}
            onClick={handleViewDetails}
          >
            {name}
          </motion.h3>
          <div className="flex items-center gap-2 mt-1">
            <Hash className="w-3 h-3" style={{ color: theme.textSecondary }} />
            <span className="text-xs" style={{ color: theme.textSecondary }}>
              ID: {heroSection.id}
            </span>
          </div>
        </motion.div>

        {/* Title */}
        {title && (
          <motion.div variants={itemVariants} className="mb-2">
            <div className="flex items-start gap-2">
              <FileText
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: theme.accent }}
              />
              <span
                className="text-sm font-medium line-clamp-1"
                style={{ color: theme.text }}
              >
                {title}
              </span>
            </div>
          </motion.div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <motion.div variants={itemVariants} className="mb-2">
            <div className="flex items-start gap-2">
              <Tag
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: theme.textSecondary }}
              />
              <span
                className="text-sm line-clamp-1"
                style={{ color: theme.textSecondary }}
              >
                {subtitle}
              </span>
            </div>
          </motion.div>
        )}

        {/* Description */}
        {description && (
          <motion.p
            variants={itemVariants}
            className="text-sm leading-relaxed mb-3 line-clamp-2"
            style={{ color: theme.textSecondary }}
          >
            {truncateText(description, 80)}
          </motion.p>
        )}

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-2 py-3 rounded-xl mb-3"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.05)}, ${hexToRgba(theme.accent, 0.05)})`,
            borderTop: `1px solid ${theme.border}`,
            marginTop: "auto",
          }}
        >
          {primaryButtonText && (
            <div
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
              style={{
                background: hexToRgba(theme.primary, 0.1),
                color: theme.primary,
              }}
            >
              <Link className="w-3 h-3" />
              <span>{primaryButtonText}</span>
            </div>
          )}
          {secondaryButtonText && (
            <div
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
              style={{
                background: hexToRgba(theme.secondary, 0.1),
                color: theme.secondary,
              }}
            >
              <Link className="w-3 h-3" />
              <span>{secondaryButtonText}</span>
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
          className="relative w-full mt-auto font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
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

export default HeroSectionCard;
