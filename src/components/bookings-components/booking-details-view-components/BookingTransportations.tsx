"use client";

import React, { useState } from "react";
import { Bus, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingTransportationsProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";
import { formatDate, formatTime } from "@/utils/commonFunctions";

export const BookingTransportations: React.FC<BookingTransportationsProps> = ({
  transportations,
}) => {
  const { theme } = useTheme();
  const [expandedTransport, setExpandedTransport] = useState<number | null>(
    null,
  );

  if (!transportations.length) {
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
            <Bus
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Transportation
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <Bus
            className="w-12 h-12 mx-auto mb-3 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No transportation details available for this booking.
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
            <Bus
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Transportation
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {transportations.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {transportations.map((transport) => {
          const isExpanded = expandedTransport === transport.transportationId;

          return (
            <div
              key={transport.transportationId}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
              }}
            >
              <button
                onClick={() =>
                  setExpandedTransport(
                    isExpanded ? null : transport.transportationId,
                  )
                }
                className="w-full flex items-center justify-between p-3 text-left cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: isExpanded
                    ? hexToRgba(theme.primary, 0.05)
                    : "transparent",
                }}
              >
                <div className="flex-1">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: theme.text }}
                  >
                    {transport.transportType}: {transport.carrierName}
                  </p>
                  <div
                    className="flex flex-wrap gap-3 mt-1 text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    <span>Ref: {transport.referenceNumber}</span>
                    <span>Seats: {transport.seatNumbers}</span>
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
                <div className="px-3 pb-3 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        From: {transport.departureLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        To: {transport.arrivalLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        Departure: {formatDate(transport.departureDate)} at{" "}
                        {formatTime(transport.departureTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        Arrival: {formatDate(transport.arrivalDate)} at{" "}
                        {formatTime(transport.arrivalTime)}
                      </span>
                    </div>
                  </div>
                  {transport.vehicleNumber && (
                    <div
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Vehicle: {transport.vehicleNumber}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
