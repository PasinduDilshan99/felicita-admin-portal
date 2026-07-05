"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookingHistoryService } from "@/services/bookingHistoryService";
import { BookingHistoryDetails } from "@/types/booking-history-types";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import {
  Calendar,
  User,
  MapPin,
  DollarSign,
  CreditCard,
  Activity,
  CheckCircle,
  XCircle,
  UserCheck,
  History,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  Info,
  LucideIcon,
} from "lucide-react";
import {
  BOOKING_HISTORY_VIEW_PAGE_URL,
  TOUR_BOOKINGS_DETAILS_VIEW_URL,
} from "@/utils/urls";
import { BOOKING_HISTORY_DETAILS_VIEW_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import {
  formatDate,
  formatDateTime,
  formatPrice,
} from "@/utils/commonFunctions";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { hexToRgba } from "@/utils/functions";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";

interface ActivityItem {
  type: string;
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  updatedBy: string;
  updatedAt: string;
  details: Record<string, any>;
  paymentRef?: string;
  remarks?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count: number;
}

const BookingHistoryDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const bookingId = parseInt(params?.bookingId as string);

  const [history, setHistory] = useState<BookingHistoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const breadcrumbItems = [
    ...BOOKING_HISTORY_DETAILS_VIEW_HOME_BREADCRUMB_DATA,
    {
      label: history?.bookingsBasicDetails?.bookingReference || "Details",
      href: `${BOOKING_HISTORY_VIEW_PAGE_URL}/${bookingId}`,
    },
  ];

  useEffect(() => {
    if (bookingId) fetchHistory();
  }, [bookingId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await BookingHistoryService.getBookingHistoryDetails(bookingId);
      setHistory(response.data);
    } catch (err: any) {
      setError(
        err.message || "Failed to load booking history. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(BOOKING_HISTORY_VIEW_PAGE_URL);
    }
  };

  const handleRetry = () => {
    if (bookingId) fetchHistory();
  };

  const handleViewFullBooking = () => {
    if (bookingId) {
      router.push(`${TOUR_BOOKINGS_DETAILS_VIEW_URL}/${bookingId}`);
    }
  };

  const getActivityIcon = (type: string): LucideIcon => {
    const typeLower = type?.toLowerCase() || "";
    if (typeLower.includes("status")) return CheckCircle;
    if (typeLower.includes("assignment") || typeLower.includes("assign"))
      return UserCheck;
    if (typeLower.includes("payment")) return DollarSign;
    if (typeLower.includes("create")) return FileText;
    if (typeLower.includes("update")) return RefreshCw;
    if (typeLower.includes("cancel")) return XCircle;
    return Activity;
  };

  const getActivityColor = (type: string): string => {
    const typeLower = type?.toLowerCase() || "";
    if (typeLower.includes("status")) return theme.success;
    if (typeLower.includes("assignment") || typeLower.includes("assign"))
      return theme.primary;
    if (typeLower.includes("payment")) return theme.warning;
    if (typeLower.includes("create")) return theme.primary;
    if (typeLower.includes("update")) return theme.primary;
    if (typeLower.includes("cancel")) return theme.error;
    return theme.textSecondary;
  };

  const booking = history?.bookingsBasicDetails;

  const quickStats = [
    {
      label: "Total Activities",
      value:
        (history?.bookingActivityHistories?.length || 0) +
        (history?.bookingStatusHistories?.length || 0) +
        (history?.bookingAssignmentHistories?.length || 0) +
        (history?.bookingPaymentHistories?.length || 0),
      icon: History,
      color: theme.primary,
    },
    {
      label: "Status Changes",
      value: history?.bookingStatusHistories?.length || 0,
      icon: CheckCircle,
      color: theme.success,
    },
    {
      label: "Assignment Changes",
      value: history?.bookingAssignmentHistories?.length || 0,
      icon: UserCheck,
      color: theme.primary,
    },
    {
      label: "Payment Updates",
      value: history?.bookingPaymentHistories?.length || 0,
      icon: DollarSign,
      color: theme.warning,
    },
  ];

  if (loading)
    return (
      <CommonLoading
        message="Loading booking history..."
        subMessage="Fetching historical records"
        size="lg"
      />
    );

  if (error || !history) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Booking History"
        message="The booking history couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={handleRetry}
        backButtonText="Back to History"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  // Filter activities based on active tab
  const getFilteredActivities = (): ActivityItem[] => {
    const allActivities: ActivityItem[] = [];

    // Status Histories
    if (activeTab === "all" || activeTab === "status") {
      history.bookingStatusHistories?.forEach((item) => {
        allActivities.push({
          type: "Status Change",
          icon: CheckCircle,
          color: theme.success,
          title: `Status changed from "${item.previousStatus}" to "${item.newStatus}"`,
          description: `Booking status was updated`,
          updatedBy: item.updatedBy,
          updatedAt: item.updatedAt,
          details: { previous: item.previousStatus, new: item.newStatus },
        });
      });
    }

    // Assignment Histories
    if (activeTab === "all" || activeTab === "assignment") {
      history.bookingAssignmentHistories?.forEach((item) => {
        allActivities.push({
          type: "Assignment Change",
          icon: UserCheck,
          color: theme.primary,
          title: `Assigned from "${item.previousEmployee}" to "${item.newEmployee}"`,
          description: `Booking assignment was updated`,
          updatedBy: item.updatedBy,
          updatedAt: item.updatedAt,
          details: { previous: item.previousEmployee, new: item.newEmployee },
        });
      });
    }

    // Payment Histories
    if (activeTab === "all" || activeTab === "payment") {
      history.bookingPaymentHistories?.forEach((item) => {
        allActivities.push({
          type: "Payment Update",
          icon: DollarSign,
          color: theme.warning,
          title: `Payment updated`,
          description: `Paid: ${formatPrice(item.previousPaidAmount)} → ${formatPrice(item.newPaidAmount)} | Due: ${formatPrice(item.previousDueAmount)} → ${formatPrice(item.newDueAmount)}`,
          updatedBy: item.updatedBy,
          updatedAt: item.updatedAt,
          details: item,
          paymentRef: item.paymentReference,
          remarks: item.remarks,
        });
      });
    }

    // Activity Histories (General)
    if (activeTab === "all" || activeTab === "activity") {
      history.bookingActivityHistories?.forEach((item) => {
        allActivities.push({
          type: item.activityType || "Activity",
          icon: getActivityIcon(item.activityType),
          color: getActivityColor(item.activityType),
          title: item.activityType || "Activity",
          description: item.description,
          updatedBy: item.updatedBy,
          updatedAt: item.updatedAt,
          details: {},
        });
      });
    }

    // Sort by date (newest first)
    return allActivities.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  };

  const filteredActivities = getFilteredActivities();

  const tabs: TabItem[] = [
    {
      id: "all",
      label: "All Activities",
      icon: History,
      count: filteredActivities.length,
    },
    {
      id: "status",
      label: "Status Changes",
      icon: CheckCircle,
      count: history.bookingStatusHistories?.length || 0,
    },
    {
      id: "assignment",
      label: "Assignments",
      icon: UserCheck,
      count: history.bookingAssignmentHistories?.length || 0,
    },
    {
      id: "payment",
      label: "Payments",
      icon: DollarSign,
      count: history.bookingPaymentHistories?.length || 0,
    },
    {
      id: "activity",
      label: "Activities",
      icon: Activity,
      count: history.bookingActivityHistories?.length || 0,
    },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Sticky Top Bar */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={`Booking History`}
            description={`Reference: ${booking?.bookingReference || "N/A"}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <ActionButtons
            title=""
            showShare={true}
            showEdit={false}
            showDelete={false}
            onShare={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Booking History ${booking?.bookingReference}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
          />
          <button
            onClick={handleViewFullBooking}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
            style={{
              backgroundColor: theme.accent || theme.primary,
              color: "#fff",
            }}
          >
            <CreditCard className="w-4 h-4" />
            View Full Booking
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN - Timeline */}
          <div className="flex flex-col gap-4">
            {/* Booking Summary Card */}
            {booking && (
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
                    <FileText
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: theme.primary }}
                    />
                    Booking Summary
                  </h2>
                </div>

                <div className="px-4 sm:px-6 py-4 sm:py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <User
                        className="w-4 h-4"
                        style={{ color: theme.primary }}
                      />
                      <div>
                        <p
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Customer
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: theme.text }}
                        >
                          {booking.customerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: theme.primary }}
                      />
                      <div>
                        <p
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Tour
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: theme.text }}
                        >
                          {booking.tourName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: theme.primary }}
                      />
                      <div>
                        <p
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Travel Dates
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: theme.text }}
                        >
                          {formatDate(booking.travelStartDate)} -{" "}
                          {formatDate(booking.travelEndDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        className="w-4 h-4"
                        style={{ color: theme.primary }}
                      />
                      <div>
                        <p
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Final Amount
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: theme.text }}
                        >
                          {formatPrice(booking.finalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Tabs */}
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
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          isActive ? "text-white" : "hover:bg-opacity-10"
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? theme.primary
                            : "transparent",
                          color: isActive ? "#fff" : theme.textSecondary,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                        {tab.count > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timeline */}
              <div className="px-4 sm:px-6 py-4 sm:py-5">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <History
                      className="w-12 h-12 mx-auto mb-3 opacity-30"
                      style={{ color: theme.textSecondary }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      No history records found for this category.
                    </p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4">
                    {/* Vertical Timeline Line */}
                    <div
                      className="absolute left-[7px] top-2 bottom-0 w-0.5"
                      style={{ backgroundColor: hexToRgba(theme.primary, 0.2) }}
                    />

                    {filteredActivities.map((activity, index) => (
                      <div key={index} className="relative">
                        {/* Timeline Dot */}
                        <div
                          className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                          style={{
                            backgroundColor: theme.surface,
                            borderColor: activity.color || theme.primary,
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: activity.color || theme.primary,
                            }}
                          />
                        </div>

                        {/* Activity Card */}
                        <div
                          className="rounded-xl p-3 transition-all duration-200 hover:translate-x-1"
                          style={{
                            backgroundColor: hexToRgba(
                              activity.color || theme.primary,
                              0.04,
                            ),
                            border: `1px solid ${hexToRgba(activity.color || theme.primary, 0.1)}`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded-full text-white"
                                  style={{
                                    backgroundColor:
                                      activity.color || theme.primary,
                                  }}
                                >
                                  {activity.type}
                                </span>
                                <span
                                  className="text-xs"
                                  style={{ color: theme.textSecondary }}
                                >
                                  by {activity.updatedBy}
                                </span>
                              </div>
                              <p
                                className="text-sm font-medium mt-1"
                                style={{ color: theme.text }}
                              >
                                {activity.title}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: theme.textSecondary }}
                              >
                                {activity.description}
                              </p>

                              {/* Additional Details */}
                              {activity.type === "Payment Update" &&
                                activity.details && (
                                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-1">
                                      <TrendingUp
                                        className="w-3 h-3"
                                        style={{ color: theme.success }}
                                      />
                                      <span
                                        style={{ color: theme.textSecondary }}
                                      >
                                        Paid:{" "}
                                        {formatPrice(
                                          activity.details.previousPaidAmount,
                                        )}{" "}
                                        →{" "}
                                        {formatPrice(
                                          activity.details.newPaidAmount,
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TrendingDown
                                        className="w-3 h-3"
                                        style={{ color: theme.warning }}
                                      />
                                      <span
                                        style={{ color: theme.textSecondary }}
                                      >
                                        Due:{" "}
                                        {formatPrice(
                                          activity.details.previousDueAmount,
                                        )}{" "}
                                        →{" "}
                                        {formatPrice(
                                          activity.details.newDueAmount,
                                        )}
                                      </span>
                                    </div>
                                    {activity.paymentRef && (
                                      <div className="col-span-2 flex items-center gap-1">
                                        <FileText
                                          className="w-3 h-3"
                                          style={{ color: theme.textSecondary }}
                                        />
                                        <span
                                          style={{ color: theme.textSecondary }}
                                        >
                                          Ref: {activity.paymentRef}
                                        </span>
                                      </div>
                                    )}
                                    {activity.remarks && (
                                      <div className="col-span-2">
                                        <span
                                          style={{ color: theme.textSecondary }}
                                        >
                                          📝 {activity.remarks}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}

                              {activity.type === "Status Change" &&
                                activity.details && (
                                  <div className="mt-2 flex items-center gap-2 text-xs">
                                    <span
                                      className="px-1.5 py-0.5 rounded"
                                      style={{
                                        backgroundColor: hexToRgba(
                                          theme.warning,
                                          0.1,
                                        ),
                                        color: theme.warning,
                                      }}
                                    >
                                      {activity.details.previous}
                                    </span>
                                    <span
                                      style={{ color: theme.textSecondary }}
                                    >
                                      →
                                    </span>
                                    <span
                                      className="px-1.5 py-0.5 rounded"
                                      style={{
                                        backgroundColor: hexToRgba(
                                          theme.success,
                                          0.1,
                                        ),
                                        color: theme.success,
                                      }}
                                    >
                                      {activity.details.new}
                                    </span>
                                  </div>
                                )}

                              {activity.type === "Assignment Change" &&
                                activity.details && (
                                  <div className="mt-2 flex items-center gap-2 text-xs">
                                    <span
                                      className="px-1.5 py-0.5 rounded"
                                      style={{
                                        backgroundColor: hexToRgba(
                                          theme.warning,
                                          0.1,
                                        ),
                                        color: theme.warning,
                                      }}
                                    >
                                      {activity.details.previous ||
                                        "Unassigned"}
                                    </span>
                                    <span
                                      style={{ color: theme.textSecondary }}
                                    >
                                      →
                                    </span>
                                    <span
                                      className="px-1.5 py-0.5 rounded"
                                      style={{
                                        backgroundColor: hexToRgba(
                                          theme.success,
                                          0.1,
                                        ),
                                        color: theme.success,
                                      }}
                                    >
                                      {activity.details.new}
                                    </span>
                                  </div>
                                )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                {formatDateTime(activity.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Stats */}
          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="History Stats"
              columns={2}
            />

            {/* History Summary Card */}
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
                  <History
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  History Summary
                </h2>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                <div
                  className="flex justify-between py-2 border-b"
                  style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                >
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Total Activities
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {quickStats[0].value}
                  </span>
                </div>

                <div
                  className="flex justify-between py-2 border-b"
                  style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                >
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Status Changes
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {history.bookingStatusHistories?.length || 0}
                  </span>
                </div>

                <div
                  className="flex justify-between py-2 border-b"
                  style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                >
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Assignment Changes
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {history.bookingAssignmentHistories?.length || 0}
                  </span>
                </div>

                <div
                  className="flex justify-between py-2 border-b"
                  style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                >
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Payment Updates
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {history.bookingPaymentHistories?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    General Activities
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {history.bookingActivityHistories?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
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
                  <Info
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Booking Info
                </h2>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>Booking ID</span>
                  <span className="font-medium" style={{ color: theme.text }}>
                    {booking?.bookingId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>Reference</span>
                  <span className="font-medium" style={{ color: theme.text }}>
                    {booking?.bookingReference}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>Status</span>
                  <span
                    className={`font-medium ${
                      booking?.bookingStatusName === "CONFIRMED" ||
                      booking?.bookingStatusName === "ACTIVE"
                        ? "text-emerald-500"
                        : "text-gray-500"
                    }`}
                  >
                    {booking?.bookingStatusName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.textSecondary }}>
                    Total Persons
                  </span>
                  <span className="font-medium" style={{ color: theme.text }}>
                    {booking?.totalPersons}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryDetailsViewPage;
