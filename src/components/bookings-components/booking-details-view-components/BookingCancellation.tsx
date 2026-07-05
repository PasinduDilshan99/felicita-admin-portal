"use client";

import React from "react";
import { XCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { formatDate, formatPrice } from "@/utils/commonFunctions";
import { BookingCancellationProps } from "@/types/booking-types";

export const BookingCancellation: React.FC<BookingCancellationProps> = ({
  cancellation,
}) => {
  const { theme } = useTheme();

  const isCancelled = cancellation.cancellationDate !== null;

  if (!isCancelled) {
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
            <XCircle
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Cancellation Information
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 text-center">
          <CheckCircle
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: theme.success }}
          />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No cancellation recorded for this booking.
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
        <h2
          className="text-base sm:text-lg font-semibold flex items-center gap-2"
          style={{ color: theme.text }}
        >
          <XCircle
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.error }}
          />
          Cancellation Information
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        <div
          className="flex items-start gap-3 p-3 rounded-xl"
          style={{
            backgroundColor: hexToRgba(theme.error, 0.06),
            border: `1px solid ${hexToRgba(theme.error, 0.15)}`,
          }}
        >
          <AlertTriangle
            className="w-5 h-5 flex-shrink-0"
            style={{ color: theme.error }}
          />
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Cancellation Date
            </p>
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {formatDate(cancellation.cancellationDate)}
            </p>
          </div>
        </div>

        {cancellation.cancellationReason && (
          <div
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{ backgroundColor: hexToRgba(theme.warning, 0.04) }}
          >
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Reason
              </p>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {cancellation.cancellationReason}
              </p>
            </div>
          </div>
        )}

        {cancellation.cancellationNotes && (
          <div
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.04),
            }}
          >
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Notes
              </p>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {cancellation.cancellationNotes}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div
            className="flex flex-col items-center p-3 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.error, 0.06),
              border: `1px solid ${hexToRgba(theme.error, 0.1)}`,
            }}
          >
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Refund Amount
            </span>
            <span className="text-sm font-bold" style={{ color: theme.error }}>
              {formatPrice(cancellation.refundAmount)}
            </span>
          </div>
          <div
            className="flex flex-col items-center p-3 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.06),
              border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
            }}
          >
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Refund Status
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: theme.primary }}
            >
              {cancellation.refundStatus || "Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
