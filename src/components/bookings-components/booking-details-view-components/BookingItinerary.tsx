"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingItineraryProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";
import { formatDate, formatTime } from "@/utils/commonFunctions";

export const BookingItinerary: React.FC<BookingItineraryProps> = ({
  itineraries,
}) => {
  const { theme } = useTheme();
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  if (!itineraries.length) {
    return null;
  }

  const sortedItineraries = [...itineraries].sort(
    (a, b) => a.dayNumber - b.dayNumber,
  );

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
            <Calendar
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Itinerary
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {sortedItineraries.length} days
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {sortedItineraries.map((item) => {
          const isExpanded = expandedDay === item.dayNumber;

          return (
            <div
              key={item.itineraryId || item.dayNumber}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
              }}
            >
              <button
                onClick={() =>
                  setExpandedDay(isExpanded ? null : item.dayNumber)
                }
                className="w-full flex items-center justify-between p-3 text-left cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: isExpanded
                    ? hexToRgba(theme.primary, 0.05)
                    : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {item.dayNumber}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: theme.text }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      {formatDate(item.itineraryDate)}
                    </p>
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
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {item.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        {formatTime(item.startTime)} -{" "}
                        {formatTime(item.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        {item.location}
                      </span>
                    </div>
                    {item.includedMeals && (
                      <div className="flex items-center gap-1">
                        <Utensils
                          className="w-4 h-4"
                          style={{ color: theme.textSecondary }}
                        />
                        <span style={{ color: theme.textSecondary }}>
                          Meals: {item.includedMeals}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${
                          item.status === "CONFIRMED"
                            ? "bg-emerald-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {item.status}
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
