"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookingStatusService } from "@/services/bookingStatusService";
import { BookingStatusAllDetails } from "@/types/booking-status-types";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import {
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Clock,
  BookOpen,
  Users,
  Activity,
} from "lucide-react";
import {
  BOOKING_STATUS_VIEW_PAGE_URL,
  BOOKING_STATUS_UPDATE_PAGE_URL,
  BOOKING_STATUS_TERMINATE_PAGE_URL,
} from "@/utils/urls";
import { BOOKING_STATUS_DETAILS_VIEW_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { hexToRgba } from "@/utils/functions";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";

const BookingStatusDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const statusId = parseInt(params?.statusId as string);

  const [statusData, setStatusData] = useState<BookingStatusAllDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    ...BOOKING_STATUS_DETAILS_VIEW_HOME_BREADCRUMB_DATA,
    {
      label: statusData?.statusName || "Details",
      href: `${BOOKING_STATUS_VIEW_PAGE_URL}/${statusId}`,
    },
  ];

  useEffect(() => {
    if (statusId) fetchStatusDetails();
  }, [statusId]);

  const fetchStatusDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await BookingStatusService.getBookingStatusAllDetails(statusId);
      setStatusData(response.data);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load booking status details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(BOOKING_STATUS_VIEW_PAGE_URL);
    }
  };
  const handleEdit = () =>
    router.push(
      `${BOOKING_STATUS_UPDATE_PAGE_URL}/${statusId}?name=${statusData?.statusName}`,
    );

  const handleDelete = () =>
    router.push(
      `${BOOKING_STATUS_TERMINATE_PAGE_URL}/${statusId}?name=${statusData?.statusName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: statusData?.statusName,
        text: statusData?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!statusData) return null;
    const isActive = statusData.status === "ACTIVE";
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {statusData.status}
      </span>
    );
  };

  // Get status icon
  const getStatusIcon = () => {
    const name = statusData?.statusName?.toLowerCase() || "";
    if (name.includes("confirm") || name.includes("active")) {
      return CheckCircle;
    }
    if (name.includes("cancel")) {
      return XCircle;
    }
    if (name.includes("pending")) {
      return AlertCircle;
    }
    return Tag;
  };

  const StatusIcon = getStatusIcon();

  // Prepare quick stats
  const quickStats = [
    {
      label: "Total Bookings",
      value: statusData?.totalBookingsUsingThisStatus || 0,
      icon: BookOpen,
      color: theme.primary,
    },
    {
      label: "Active Bookings",
      value: statusData?.activeBookingsCount || 0,
      icon: Activity,
      color: theme.success,
    },
    {
      label: "Completed Bookings",
      value: statusData?.completedBookingsCount || 0,
      icon: CheckCircle,
      color: theme.primary,
    },
    {
      label: "Cancelled Bookings",
      value: statusData?.cancelledBookingsCount || 0,
      icon: XCircle,
      color: theme.error,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Created By",
      value: `User #${statusData?.createdBy}`,
      icon: User,
      date: statusData?.createdAt,
      color: theme.success,
    },
    {
      label: "Last Updated",
      value: statusData?.updatedBy ? `User #${statusData.updatedBy}` : "Never",
      icon: Clock,
      date: statusData?.updatedAt,
      color: theme.primary,
    },
  ];

  if (statusData?.terminatedAt) {
    metadataItems.push({
      label: "Terminated By",
      value: statusData.terminatedBy
        ? `User #${statusData.terminatedBy}`
        : "Unknown",
      icon: User,
      date: statusData.terminatedAt,
      color: theme.error,
    });
  }

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${statusData?.statusName}" status details...`}
        subMessage="Fetching booking status information"
        size="lg"
      />
    );

  if (error || !statusData) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Booking Status"
        message="The booking status couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchStatusDetails}
        backButtonText="Back to Booking Status"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

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
            title={statusData.statusName}
            description={`Status ID: ${statusData.statusId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={statusData.statusName}
          showShare={true}
          showEdit={true}
          showDelete={true}
          onShare={handleShare}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Status Overview Card */}
            <div
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <h2
                  className="text-base sm:text-lg font-semibold flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <Tag
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Status Overview
                </h2>
                <StatusBadge />
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
                {/* Status Name with Icon */}
                <div
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ backgroundColor: hexToRgba(theme.primary, 0.05) }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
                  >
                    <StatusIcon
                      className="w-8 h-8"
                      style={{ color: theme.primary }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Status Name
                    </p>
                    <h3
                      className="text-xl font-bold"
                      style={{ color: theme.text }}
                    >
                      {statusData.statusName}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                {statusData.description && (
                  <div>
                    <p
                      className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-2"
                      style={{ color: theme.textSecondary }}
                    >
                      Description
                    </p>
                    <div
                      className="text-xs sm:text-sm leading-relaxed rounded-xl p-3 sm:p-4"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.03),
                        border: `1px solid ${hexToRgba(theme.primary, 0.08)}`,
                      }}
                    >
                      <p style={{ color: theme.textSecondary }}>
                        {statusData.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status System Status */}
                <div
                  className="rounded-xl p-3 flex items-center gap-3"
                  style={{
                    backgroundColor: hexToRgba(
                      statusData.status === "ACTIVE"
                        ? theme.success
                        : theme.error,
                      0.06,
                    ),
                    border: `1px solid ${hexToRgba(
                      statusData.status === "ACTIVE"
                        ? theme.success
                        : theme.error,
                      0.15,
                    )}`,
                  }}
                >
                  {statusData.status === "ACTIVE" ? (
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: theme.success }}
                    />
                  ) : (
                    <XCircle
                      className="w-5 h-5"
                      style={{ color: theme.error }}
                    />
                  )}
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      System Status
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color:
                          statusData.status === "ACTIVE"
                            ? theme.success
                            : theme.error,
                      }}
                    >
                      {statusData.status === "ACTIVE"
                        ? "Active in System"
                        : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Counts Detail Card */}
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
                  <Users
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Booking Statistics
                </h2>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className="flex flex-col items-center p-4 rounded-xl text-center"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.04),
                      border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Total Bookings
                    </p>
                    <p
                      className="text-2xl font-bold mt-1"
                      style={{ color: theme.primary }}
                    >
                      {statusData.totalBookingsUsingThisStatus}
                    </p>
                  </div>

                  <div
                    className="flex flex-col items-center p-4 rounded-xl text-center"
                    style={{
                      backgroundColor: hexToRgba(theme.success, 0.04),
                      border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Active Bookings
                    </p>
                    <p
                      className="text-2xl font-bold mt-1"
                      style={{ color: theme.success }}
                    >
                      {statusData.activeBookingsCount}
                    </p>
                  </div>

                  {statusData.completedBookingsCount !== null && (
                    <div
                      className="flex flex-col items-center p-4 rounded-xl text-center"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.04),
                        border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                      }}
                    >
                      <p
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{ color: theme.textSecondary }}
                      >
                        Completed Bookings
                      </p>
                      <p
                        className="text-2xl font-bold mt-1"
                        style={{ color: theme.primary }}
                      >
                        {statusData.completedBookingsCount}
                      </p>
                    </div>
                  )}

                  {statusData.cancelledBookingsCount !== null && (
                    <div
                      className="flex flex-col items-center p-4 rounded-xl text-center"
                      style={{
                        backgroundColor: hexToRgba(theme.error, 0.04),
                        border: `1px solid ${hexToRgba(theme.error, 0.1)}`,
                      }}
                    >
                      <p
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{ color: theme.textSecondary }}
                      >
                        Cancelled Bookings
                      </p>
                      <p
                        className="text-2xl font-bold mt-1"
                        style={{ color: theme.error }}
                      >
                        {statusData.cancelledBookingsCount}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="Status Stats"
              statusBadge={<StatusBadge />}
              columns={2}
            />

            <CommonMetadata
              items={metadataItems}
              title="Audit Information"
              description="Creation and modification details"
              createdAt={{
                date: statusData.createdAt,
                label: "Created At",
              }}
              showCreatedAt={true}
            />

            {/* Status Usage Info */}
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
                  <AlertCircle
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Status Information
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
                    Status ID
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {statusData.statusId}
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
                    Status Name
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {statusData.statusName}
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
                    System Status
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      statusData.status === "ACTIVE"
                        ? "text-emerald-500"
                        : "text-gray-500"
                    }`}
                  >
                    {statusData.status}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Total Bookings
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {statusData.totalBookingsUsingThisStatus}
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

export default BookingStatusDetailsViewPage;
