"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookingStatusService } from "@/services/bookingStatusService";
import {
  BookingStatusAllDetails,
  BookingStatusIdAndName,
} from "@/types/booking-status-types";
import {
  AlertTriangle,
  Search,
  AlertCircle,
  BookOpen,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { ImpactWarning } from "@/components/common-components/terminate-components/ImpactWarning";
import {
  TerminationItem,
  TerminationModal,
} from "@/components/common-components/terminate-components/TerminationModal";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { BOOKING_STATUS_TERMINATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { hexToRgba } from "@/utils/functions";
import { BookingStatusStats } from "@/components/booking-status-components/terminate-booking-status-components/BookingStatusStats";
import { BasicInfoPanel } from "@/components/booking-status-components/terminate-booking-status-components/BasicInfoPanel";

interface BookingStatusSearchItem {
  id: number;
  name: string;
}

const TerminateBookingStatusPage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialStatusName = searchParams?.get("status-name") || "";
  const initialStatusId = searchParams?.get("status-id") || "";

  const [statuses, setStatuses] = useState<BookingStatusIdAndName[]>([]);
  const [selectedStatus, setSelectedStatus] =
    useState<BookingStatusIdAndName | null>(
      initialStatusId && initialStatusName
        ? {
            bookingStatusId: parseInt(initialStatusId),
            bookingStatusName: initialStatusName,
          }
        : null,
    );
  const [statusDetails, setStatusDetails] =
    useState<BookingStatusAllDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const fetchStatuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookingStatusService.getBookingStatusIdAndNames();
      setStatuses(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load booking statuses");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load booking statuses",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setStatusDetails(null);
    try {
      const response =
        await BookingStatusService.getBookingStatusAllDetails(id);
      setStatusDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load status details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load status details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectStatus = async (id: number, name: string) => {
    setSelectedStatus({ bookingStatusId: id, bookingStatusName: name });
    await fetchStatusDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("status-id", id.toString());
    url.searchParams.set("status-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearStatusSelection = () => {
    setSelectedStatus(null);
    setStatusDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("status-id");
    url.searchParams.delete("status-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedStatus) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedStatus) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await BookingStatusService.terminateBookingStatus(
        selectedStatus.bookingStatusId,
      );

      setSuccess("Booking status terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedStatus.bookingStatusName}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearStatusSelection();
        fetchStatuses();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate status");
      setToast({
        type: "error",
        title: "Termination Failed",
        message: err.message || "Failed to terminate status. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Convert statuses to search items format
  const searchItems: BookingStatusSearchItem[] = statuses.map((status) => ({
    id: status.bookingStatusId,
    name: status.bookingStatusName,
  }));

  const selectedSearchItem: BookingStatusSearchItem | null = selectedStatus
    ? {
        id: selectedStatus.bookingStatusId,
        name: selectedStatus.bookingStatusName,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedStatus
    ? {
        id: selectedStatus.bookingStatusId,
        name: selectedStatus.bookingStatusName,
        type: "custom",
        additionalInfo: "Booking Status",
      }
    : null;

  useEffect(() => {
    if (!selectedStatus) {
      fetchStatuses();
    }
  }, []);

  useEffect(() => {
    if (initialStatusId && !statusDetails) {
      handleSelectStatus(parseInt(initialStatusId), initialStatusName);
    }
  }, [initialStatusId, initialStatusName]);

  if (loading && !selectedStatus) {
    return (
      <CommonLoading
        message="Loading booking statuses..."
        subMessage="Please wait while we fetch available statuses"
        size="lg"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          actionLink={toast.actionLink}
          actionText="View Details"
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Booking Status"
            description="Permanently remove a booking status from the system"
            breadcrumbItems={BOOKING_STATUS_TERMINATE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no status is selected */}
        {!selectedStatus && (
          <div
            className="rounded-2xl shadow-lg mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-5 sm:px-6 py-4 flex items-center gap-3 border-b"
              style={{ borderColor: theme.border }}
            >
              <span
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: hexToRgba(theme.error, 0.1),
                  color: theme.error,
                }}
              >
                <Search className="w-4 h-4" />
              </span>
              <div>
                <h2
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Select Booking Status to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a status to review its data before
                  termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<BookingStatusSearchItem>
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) => handleSelectStatus(item.id, item.name)}
                onClearSelection={handleClearStatusSelection}
                initialSearchTerm={initialStatusName}
                placeholder="Search booking statuses..."
                title="Booking Statuses"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Status Info Bar */}
        <SelectedItemBar
          item={
            selectedStatus
              ? {
                  id: selectedStatus.bookingStatusId,
                  name: selectedStatus.bookingStatusName,
                }
              : null
          }
          onClear={handleClearStatusSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Status Details Section */}
        {selectedStatus && (
          <div
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1.5px solid ${hexToRgba(theme.error, 0.5)}`,
              boxShadow: `0 4px 32px ${hexToRgba(theme.error, 0.07)}`,
            }}
          >
            {/* Warning Header */}
            <div
              className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-4"
              style={{
                background: `linear-gradient(90deg, ${hexToRgba(theme.error, 0.08)}, ${hexToRgba(theme.error, 0.03)})`,
                borderBottom: `1.5px solid ${hexToRgba(theme.error, 0.3)}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.error}, ${theme.error})`,
                  color: "#fff",
                }}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className="text-base font-bold"
                  style={{ color: theme.error }}
                >
                  Booking Status Termination Review
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.error }}>
                  Review all data carefully. This action is permanent and cannot
                  be undone.
                </p>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
                style={{
                  background: hexToRgba(theme.error, 0.08),
                  border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                }}
              >
                <span className="text-xs" style={{ color: theme.error }}>
                  ID
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: theme.error }}
                >
                  #{selectedStatus.bookingStatusId}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading status details..."
                subMessage="Please wait while we fetch the status information"
                size="lg"
              />
            )}

            {/* Status Details Content */}
            {!loadingDetails && statusDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                <BookingStatusStats statusDetails={statusDetails} />

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  }}
                >
                  {/* Left Column */}
                  <div className="space-y-5">
                    <BasicInfoPanel statusDetails={statusDetails} />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    {/* Custom Impact Warning for Booking Statuses */}
                    <ImpactWarning
                      title="Status Termination Impact"
                      customItems={[
                        {
                          icon: <BookOpen size={11} />,
                          text: `${statusDetails.totalBookingsUsingThisStatus} booking(s) currently using this status will need to be reassigned`,
                        },
                        {
                          icon: <CheckCircle size={11} />,
                          text: `${statusDetails.activeBookingsCount} active booking(s) will be affected`,
                        },
                        ...(statusDetails.completedBookingsCount !== null
                          ? [
                              {
                                icon: <CheckCircle size={11} />,
                                text: `${statusDetails.completedBookingsCount} completed booking(s) will be affected`,
                              },
                            ]
                          : []),
                        ...(statusDetails.cancelledBookingsCount !== null
                          ? [
                              {
                                icon: <XCircle size={11} />,
                                text: `${statusDetails.cancelledBookingsCount} cancelled booking(s) will be affected`,
                              },
                            ]
                          : []),
                        {
                          icon: <AlertCircle size={11} />,
                          text: "This action cannot be undone — recovery is not possible",
                        },
                        {
                          icon: <AlertCircle size={11} />,
                          text: "This termination will be logged for audit trail purposes",
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Termination Button */}
                <div
                  className="flex justify-center pt-4"
                  style={{
                    borderTop: `1.5px solid ${hexToRgba(theme.error, 0.2)}`,
                  }}
                >
                  <button
                    onClick={handleTerminateClick}
                    disabled={loadingTerminate}
                    className="cursor-pointer flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:hover:scale-100"
                    style={{
                      background: loadingTerminate
                        ? `linear-gradient(135deg, ${theme.error}, ${theme.error}dd)`
                        : `linear-gradient(135deg, ${theme.error}, ${hexToRgba(theme.error, 0.8)})`,
                      color: "#fff",
                      opacity: loadingTerminate ? 0.6 : 1,
                      boxShadow: `0 4px 16px ${hexToRgba(theme.error, 0.3)}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {loadingTerminate ? (
                      <>
                        <div className="relative w-4 h-4">
                          <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
                          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                        <span className="animate-pulse">Processing…</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Terminate Status Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !statusDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Status"
                message="The status couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearStatusSelection}
                onRetry={() =>
                  selectedStatus &&
                  fetchStatusDetails(selectedStatus.bookingStatusId)
                }
                backButtonText="Change Selection"
                retryButtonText="Try Again"
                fullScreen={false}
              />
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <TerminationModal
        isOpen={showConfirmModal}
        item={terminationItem}
        loading={loadingTerminate}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTerminate}
        title="Confirm Status Termination"
        description="You are about to permanently terminate:"
        warningMessage={`${statusDetails?.totalBookingsUsingThisStatus || 0} booking(s) using this status will need to be reassigned.`}
      />
    </div>
  );
};

export default TerminateBookingStatusPage;
