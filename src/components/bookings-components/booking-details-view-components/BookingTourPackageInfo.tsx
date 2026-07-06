"use client";

import React from "react";
import { MapPin, Clock, Package, DollarSign } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingTourPackageInfoProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";
import { formatPrice } from "@/utils/commonFunctions";

export const BookingTourPackageInfo: React.FC<BookingTourPackageInfoProps> = ({
  tour,
  packageInfo,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2
          className="text-base sm:text-lg font-semibold flex items-center gap-2"
          style={{ color: theme.text }}
        >
          <MapPin
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.primary }}
          />
          Tour & Package Details
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Tour Info */}
        <div>
          <p
            className="text-xs font-medium uppercase tracking-wide mb-2"
            style={{ color: theme.textSecondary }}
          >
            Tour Information
          </p>
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.04) }}
          >
            <p
              className="text-base font-semibold"
              style={{ color: theme.text }}
            >
              {tour.tourName}
            </p>
            {tour.tourDescription && (
              <p
                className="text-sm mt-1"
                style={{ color: theme.textSecondary }}
              >
                {tour.tourDescription}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              <span
                className="flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <Clock className="w-4 h-4" style={{ color: theme.primary }} />
                {tour.duration} days
              </span>
              <span
                className="flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
                {tour.startLocation} → {tour.endLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Package Info */}
        {packageInfo.packageId && (
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wide mb-2"
              style={{ color: theme.textSecondary }}
            >
              Package Information
            </p>
            <div
              className="p-3 rounded-xl"
              style={{
                backgroundColor: hexToRgba(theme.accent || theme.primary, 0.04),
              }}
            >
              <div className="flex items-center gap-2">
                <Package
                  className="w-4 h-4"
                  style={{ color: theme.accent || theme.primary }}
                />
                <p
                  className="text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  {packageInfo.packageName}
                </p>
              </div>
              {packageInfo.packageDescription && (
                <p
                  className="text-sm mt-1"
                  style={{ color: theme.textSecondary }}
                >
                  {packageInfo.packageDescription}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-sm">
                <span
                  className="flex items-center gap-1"
                  style={{ color: theme.textSecondary }}
                >
                  <DollarSign
                    className="w-4 h-4"
                    style={{ color: theme.success }}
                  />
                  Total: {formatPrice(packageInfo.packageTotalPrice)}
                </span>
                <span
                  className="flex items-center gap-1"
                  style={{ color: theme.textSecondary }}
                >
                  <DollarSign
                    className="w-4 h-4"
                    style={{ color: theme.primary }}
                  />
                  Per Person: {formatPrice(packageInfo.pricePerPerson)}
                </span>
                {packageInfo.discountPercentage > 0 && (
                  <span
                    className="flex items-center gap-1"
                    style={{ color: theme.success }}
                  >
                    Discount: {packageInfo.discountPercentage}%
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
