"use client";

import React from "react";
import { CheckCircle, AlertCircle, User, MessageCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingStatusAssignmentProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";

export const BookingStatusAssignment: React.FC<
  BookingStatusAssignmentProps
> = ({ status, assignment }) => {
  const { theme } = useTheme();

  const isActive =
    status.bookingStatusName === "CONFIRMED" ||
    status.bookingStatusName === "ACTIVE";

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
          <CheckCircle
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.primary }}
          />
          Status & Assignment
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Status */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{
            backgroundColor: hexToRgba(
              isActive ? theme.success : theme.warning,
              0.06,
            ),
            border: `1px solid ${hexToRgba(isActive ? theme.success : theme.warning, 0.15)}`,
          }}
        >
          {isActive ? (
            <CheckCircle className="w-5 h-5" style={{ color: theme.success }} />
          ) : (
            <AlertCircle className="w-5 h-5" style={{ color: theme.warning }} />
          )}
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Booking Status
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: isActive ? theme.success : theme.warning }}
            >
              {status.bookingStatusName}
            </p>
            {status.bookingStatusDescription && (
              <p
                className="text-xs mt-1"
                style={{ color: theme.textSecondary }}
              >
                {status.bookingStatusDescription}
              </p>
            )}
          </div>
        </div>

        {/* Assignment */}
        {assignment.employeeId && (
          <div className="space-y-2">
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.04),
                border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
              }}
            >
              <User className="w-5 h-5" style={{ color: theme.primary }} />
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: theme.textSecondary }}
                >
                  Assigned Employee
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {assignment.employeeName}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: theme.textSecondary }}
                >
                  {assignment.designationName} • {assignment.departmentName}
                </p>
              </div>
            </div>

            {assignment.assignMessage && (
              <div
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{
                  backgroundColor: hexToRgba(theme.warning, 0.06),
                  border: `1px solid ${hexToRgba(theme.warning, 0.1)}`,
                }}
              >
                <MessageCircle
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: theme.warning }}
                />
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: theme.textSecondary }}
                  >
                    Assignment Message
                  </p>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {assignment.assignMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
