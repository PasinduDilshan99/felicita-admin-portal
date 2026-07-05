"use client";

import React, { useState } from "react";
import {
  Activity,
  Calendar,
  Clock,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { formatDate, formatPrice, formatTime } from "@/utils/commonFunctions";
import { BookingActivitiesProps } from "@/types/booking-types";

export const BookingActivities: React.FC<BookingActivitiesProps> = ({
  activities,
}) => {
  const { theme } = useTheme();
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "ACTIVE":
        return theme.success;
      case "PENDING":
        return theme.warning;
      case "CANCELLED":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  if (!activities.length) {
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
            <Activity
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Activities
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <Activity
            className="w-12 h-12 mx-auto mb-3 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No activities available for this booking.
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
            <Activity
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Activities
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {activities.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {activities.map((activity) => {
          const isExpanded = expandedActivity === activity.bookingActivityId;
          const statusColor = getStatusColor(activity.status);

          return (
            <div
              key={activity.bookingActivityId}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(theme.accent || theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.accent || theme.primary, 0.1)}`,
              }}
            >
              <button
                onClick={() =>
                  setExpandedActivity(
                    isExpanded ? null : activity.bookingActivityId,
                  )
                }
                className="w-full flex items-center justify-between p-3 text-left cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: isExpanded
                    ? hexToRgba(theme.accent || theme.primary, 0.05)
                    : "transparent",
                }}
              >
                <div className="flex-1">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: theme.text }}
                  >
                    {activity.activityName}
                  </p>
                  <div
                    className="flex flex-wrap gap-3 mt-1 text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(activity.activityDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {activity.numberOfParticipants} persons
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {formatPrice(activity.totalPrice)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: statusColor }}
                  >
                    {activity.status}
                  </span>
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
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        {formatTime(activity.startTime)} -{" "}
                        {formatTime(activity.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        {activity.numberOfParticipants} participants ×{" "}
                        {formatPrice(activity.pricePerPerson)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        Total: {formatPrice(activity.totalPrice)}
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
