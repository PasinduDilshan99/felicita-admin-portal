"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, ArrowRight, Tag, Hash, Link, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import { HeroSectionListCardProps } from "@/types/hero-section-types";
import { hexToRgba } from "@/utils/functions";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  imageVariants,
  itemVariants,
  overlayVariants,
  shineVariants,
} from "@/app/animations/variants";
import { getSafeString } from "@/utils/commonFunctions";

const truncateText = (text: string, maxLength: number = 150): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const HeroSectionListCard: React.FC<HeroSectionListCardProps> = ({
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
  const primaryButtonLink = getSafeString(heroSection?.primaryButtonLink, "");
  const secondaryButtonText = getSafeString(
    heroSection?.secondaryButtonText,
    "",
  );
  const secondaryButtonLink = getSafeString(
    heroSection?.secondaryButtonLink,
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
      className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-2/5 xl:w-1/3 relative h-56 lg:h-auto overflow-hidden">
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
          className="lg:w-3/5 xl:w-2/3 p-5 sm:p-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-4">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <motion.h3
                className="text-xl font-bold transition-colors duration-200 cursor-pointer"
                style={{ color: theme.text }}
                whileHover={{ color: theme.primary }}
                onClick={handleViewDetails}
              >
                {name}
              </motion.h3>
              <div className="flex items-center gap-2">
                <Hash
                  className="w-4 h-4"
                  style={{ color: theme.textSecondary }}
                />
                <span
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  ID: {heroSection.id}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Title & Subtitle */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
          >
            {title && (
              <div className="flex items-start gap-2">
                <FileText
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: theme.accent }}
                />
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Title
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {title}
                  </div>
                </div>
              </div>
            )}
            {subtitle && (
              <div className="flex items-start gap-2">
                <Tag
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: theme.textSecondary }}
                />
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Subtitle
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    {subtitle}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mb-4 leading-relaxed pl-4 py-2 rounded-r-lg text-sm line-clamp-2"
            style={{
              color: theme.textSecondary,
              borderLeft: `4px solid ${hexToRgba(theme.primary, 0.3)}`,
              background: `linear-gradient(90deg, ${hexToRgba(theme.primary, 0.05)}, transparent)`,
            }}
          >
            {truncateText(description, 120)}
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 py-4 mb-4"
            style={{
              borderTop: `1px solid ${theme.border}`,
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex items-center gap-2">
              <Link
                className="w-4 h-4"
                style={{ color: theme.textSecondary }}
              />
              <span className="text-sm" style={{ color: theme.textSecondary }}>
                Buttons:
              </span>
            </div>
            {primaryButtonText && (
              <div
                className="flex items-center gap-1 text-sm px-3 py-1 rounded-full"
                style={{
                  background: hexToRgba(theme.primary, 0.1),
                  color: theme.primary,
                }}
              >
                <span>{primaryButtonText}</span>
                {primaryButtonLink && (
                  <span className="text-xs opacity-70">
                    ({primaryButtonLink})
                  </span>
                )}
              </div>
            )}
            {secondaryButtonText && (
              <div
                className="flex items-center gap-1 text-sm px-3 py-1 rounded-full"
                style={{
                  background: hexToRgba(theme.secondary, 0.1),
                  color: theme.secondary,
                }}
              >
                <span>{secondaryButtonText}</span>
                {secondaryButtonLink && (
                  <span className="text-xs opacity-70">
                    ({secondaryButtonLink})
                  </span>
                )}
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

export default HeroSectionListCard;
