"use client";

import React, { useState } from "react";
import { Hotel, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingAccommodationsProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";
import { formatDate } from "@/utils/commonFunctions";

export const BookingAccommodations: React.FC<BookingAccommodationsProps> = ({
  accommodations,
}) => {
  const { theme } = useTheme();
  const [expandedAccommodation, setExpandedAccommodation] = useState<
    number | null
  >(null);

  if (!accommodations.length) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
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
            <Hotel
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Accommodations
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <Hotel
            className="w-12 h-12 mx-auto mb-3 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No accommodations available for this booking.
          </p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between">
          <h2
            className="text-base sm:text-lg font-semibold flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <Hotel
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Accommodations
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {accommodations.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {accommodations.map((acc) => {
          const isExpanded = expandedAccommodation === acc.accommodationId;

          return (
            <div
              key={acc.accommodationId}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(theme.success, 0.03),
                border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
              }}
            >
              <button
                onClick={() =>
                  setExpandedAccommodation(
                    isExpanded ? null : acc.accommodationId,
                  )
                }
                className="w-full flex items-center justify-between p-3 text-left cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: isExpanded
                    ? hexToRgba(theme.success, 0.05)
                    : "transparent",
                }}
              >
                <div className="flex-1">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: theme.text }}
                  >
                    {acc.hotelName}
                  </p>
                  <div
                    className="flex flex-wrap gap-3 mt-1 text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    <span>{acc.roomType}</span>
                    <span>Room: {acc.roomNumber}</span>
                    <span>Confirmation: {acc.confirmationNumber}</span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp
                    className="w-4 h-4"
                    style={{ color: theme.textSecondary }}
                  />
                ) : (
                  <ChevronDown
                    className="w-4 h-4"
                    style={{ color: theme.textSecondary }}
                  />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        Check-in: {formatDate(acc.checkInDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        Check-out: {formatDate(acc.checkOutDate)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
