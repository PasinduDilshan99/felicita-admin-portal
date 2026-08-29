"use client";

import React from "react";
import { Calendar, Users, DollarSign, Clock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingHeaderProps } from "@/types/booking-types";
import { formatDate, formatPrice } from "@/utils/commonFunctions";
import { hexToRgba } from "@/utils/functions";

export const BookingHeader: React.FC<BookingHeaderProps> = ({ booking }) => {
  const { theme } = useTheme();

  const stats = [
    {
      label: "Booking Date",
      value: formatDate(booking.bookingDate),
      icon: Calendar,
      color: theme.primary,
    },
    {
      label: "Total Persons",
      value: booking.totalPersons,
      icon: Users,
      color: theme.success,
    },
    {
      label: "Final Amount",
      value: formatPrice(booking.finalAmount),
      icon: DollarSign,
      color: theme.warning,
    },
    {
      label: "Travel Dates",
      value: `${formatDate(booking.travelStartDate)} - ${formatDate(booking.travelEndDate)}`,
      icon: Clock,
      color: theme.primary,
    },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden mb-6"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-4 sm:px-6 py-4 sm:py-5"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.05)}, ${hexToRgba(theme.accent || theme.primary, 0.02)})`,
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: hexToRgba(stat.color, 0.1) }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: theme.textSecondary }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
