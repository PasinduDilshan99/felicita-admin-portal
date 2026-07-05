"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookingStatusService } from "@/services/bookingStatusService";
import {
  BookingStatusIdAndName,
  BookingStatusAllDetails,
  UpdateBookingStatusRequest,
} from "@/types/booking-status-types";
import { Search, Edit, Save, RefreshCw, ChevronDown, Info, Calendar, User, Clock, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  UpdateConfirmationModal,
  ChangedField,
} from "@/components/common-components/UpdateConfirmationModal";
import { hexToRgba } from "@/utils/functions";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { BOOKING_STATUS_DETAILS_VIEW_URL } from "@/utils/urls";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { BOOKING_STATUS_UPDATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { StatCard } from "@/components/common-components/StatCard";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.32, ease: EASE_OUT },
  },
};

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Status is active",
    color: "#059669",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Status is inactive",
    color: "#6b7280",
  },
  {
    value: "TERMINATED",
    label: "Terminated",
    description: "Status is terminated",
    color: "#ef4444",
  },
];

const UpdateBookingStatusPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const initialStatusName = searchParams?.get("booking-status-name") || "";
  const initialStatusId = searchParams?.get("booking-status-id") || "";

  // State for statuses list
  const [statuses, setStatuses] = useState<BookingStatusIdAndName[]>([]);

  // State for selected status
  const [selectedStatus, setSelectedStatus] =
    useState<BookingStatusIdAndName | null>(
      initialStatusId && initialStatusName
        ? {
            bookingStatusId: parseInt(initialStatusId),
            bookingStatusName: initialStatusName,
          }
        : null,
    );

  // State for original status details
  const [originalStatus, setOriginalStatus] =
    useState<BookingStatusAllDetails | null>(null);

  // State for edited status
  const [editedStatus, setEditedStatus] =
    useState<BookingStatusAllDetails | null>(null);

  // State for basic details changes
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Add this with other state declarations
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"]),
  );

  // Add this toggle function
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  // Update URL when selected status changes
  const updateUrlWithSelectedStatus = useCallback(
    (status: BookingStatusIdAndName | null) => {
      const url = new URL(window.location.href);
      if (status) {
        url.searchParams.set(
          "booking-status-id",
          status.bookingStatusId.toString(),
        );
        url.searchParams.set("booking-status-name", status.bookingStatusName);
      } else {
        url.searchParams.delete("booking-status-id");
        url.searchParams.delete("booking-status-name");
      }
      router.replace(url.toString(), { scroll: false });
    },
    [router],
  );

  // Fetch statuses list on initial load
  useEffect(() => {
    if (!selectedStatus) {
      fetchStatuses();
    }
  }, []);

  // If initialStatusId is provided, fetch details
  useEffect(() => {
    if (initialStatusId && !originalStatus && !loadingDetails) {
      handleSelectStatus(parseInt(initialStatusId), initialStatusName);
    }
  }, [initialStatusId, initialStatusName]);

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

  const handleSelectStatus = async (id: number, name: string) => {
    const newSelectedStatus = { bookingStatusId: id, bookingStatusName: name };
    setSelectedStatus(newSelectedStatus);
    updateUrlWithSelectedStatus(newSelectedStatus);
    await fetchStatusDetails(id);
  };

  const fetchStatusDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalStatus(null);
    setEditedStatus(null);
    setBasicDetailsChanged(false);

    try {
      const response =
        await BookingStatusService.getBookingStatusAllDetails(id);
      const statusData = response.data;
      setOriginalStatus(statusData);
      setEditedStatus(statusData);
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

  // Handle basic field changes
  const handleBasicFieldChange = (field: string, value: any) => {
    if (!editedStatus) return;
    setBasicDetailsChanged(true);
    setEditedStatus({
      ...editedStatus,
      [field]: value,
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return basicDetailsChanged;
  }, [basicDetailsChanged]);

  // Prepare update data
  const prepareUpdateData = (): UpdateBookingStatusRequest | null => {
    if (!editedStatus || !selectedStatus) return null;

    return {
      statusId: selectedStatus.bookingStatusId,
      statusName: editedStatus.statusName,
      description: editedStatus.description,
      status: editedStatus.status,
    };
  };

  // Handle update submission
  const handleUpdateSubmit = async () => {
    const updateData = prepareUpdateData();
    if (!updateData) return;

    setLoadingUpdate(true);
    setError(null);
    setSuccess(null);

    try {
      const response =
        await BookingStatusService.updateBookingStatus(updateData);

      setSuccess(
        `Booking Status "${editedStatus?.statusName}" updated successfully!`,
      );

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedStatus?.statusName} has been updated successfully.`,
        actionLink: `${BOOKING_STATUS_DETAILS_VIEW_URL}/${selectedStatus?.bookingStatusId}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedStatus) {
          fetchStatusDetails(selectedStatus.bookingStatusId);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update booking status");
      setToast({
        type: "error",
        title: "Update Failed",
        message:
          err.message || "Failed to update booking status. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalStatus) {
      setEditedStatus(originalStatus);
      setBasicDetailsChanged(false);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearStatusSelection = () => {
    setSelectedStatus(null);
    setOriginalStatus(null);
    setEditedStatus(null);
    setToast(null);
    updateUrlWithSelectedStatus(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalStatus || !editedStatus) return [];

    const changes: ChangedField[] = [];

    const fields = [
      { key: "statusName", label: "Status Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
    ];

    fields.forEach(({ key, label }) => {
      const oldValue = originalStatus[key as keyof BookingStatusAllDetails];
      const newValue = editedStatus[key as keyof BookingStatusAllDetails];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    return changes;
  };

  // Convert statuses to search items format
  const searchItems: SearchItem[] = statuses.map((status) => ({
    id: status.bookingStatusId,
    name: status.bookingStatusName,
  }));

  const selectedSearchItem = selectedStatus
    ? {
        id: selectedStatus.bookingStatusId,
        name: selectedStatus.bookingStatusName,
      }
    : null;

  const focusHandlers = {
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  // Helper function to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Show loading state
  if (loading) {
    return (
      <CommonLoading
        message="Loading booking statuses..."
        subMessage="Please wait while we fetch available booking statuses"
        size="lg"
      />
    );
  }

  return (
    <motion.div
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
          actionText="View Status"
        />
      )}

      {/* Header with Breadcrumb */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Update Booking Status"
            description="Edit and update existing booking status information"
            breadcrumbItems={BOOKING_STATUS_UPDATE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedStatus && (
          <div
            className="rounded-2xl shadow-lg p-8 mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: theme.text }}
            >
              <Search className="w-6 h-6" style={{ color: theme.primary }} />
              Select Booking Status to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectStatus(item.id as number, item.name)
              }
              onClearSelection={handleClearStatusSelection}
              initialSearchTerm={initialStatusName}
              placeholder="Search booking statuses..."
              title="Booking Statuses"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Status Info Bar */}
        {selectedStatus && (
          <SelectedItemBar
            item={{
              id: selectedStatus.bookingStatusId,
              name: selectedStatus.bookingStatusName,
            }}
            onClear={handleClearStatusSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Status"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading status details..."
            subMessage="Please wait while we fetch the status information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Status Details Form */}
        {editedStatus && selectedStatus && (
          <div className="space-y-6">
            {/* Basic Information Section */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <button
                onClick={() => toggleSection("basic")}
                className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
                style={{
                  backgroundColor: expandedSections.has("basic")
                    ? `${theme.primary}05`
                    : "transparent",
                  borderBottom: expandedSections.has("basic")
                    ? `1px solid ${theme.border}`
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.primary}18`,
                      color: theme.primary,
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-sm sm:text-base font-semibold"
                      style={{ color: theme.text }}
                    >
                      Basic Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Core details about the booking status (editable)
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-200"
                  style={{
                    transform: expandedSections.has("basic")
                      ? "rotate(180deg)"
                      : "none",
                    color: theme.textSecondary,
                  }}
                />
              </button>

              <AnimatePresence>
                {expandedSections.has("basic") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="p-6 space-y-5"
                  >
                    {/* Status Name */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Status Name{" "}
                        <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={editedStatus.statusName}
                        onChange={(e) =>
                          handleBasicFieldChange("statusName", e.target.value)
                        }
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          ...fieldBase,
                          borderColor: basicDetailsChanged
                            ? theme.primary
                            : theme.border,
                        }}
                        placeholder="e.g., Confirmed"
                        {...focusHandlers}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Description
                      </label>
                      <textarea
                        value={editedStatus.description}
                        onChange={(e) =>
                          handleBasicFieldChange("description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Status description..."
                        {...focusHandlers}
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Status
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {STATUS_OPTIONS.map((opt) => {
                          const isSelected = editedStatus.status === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                handleBasicFieldChange("status", opt.value)
                              }
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all"
                              style={{
                                backgroundColor: isSelected
                                  ? `${opt.color}10`
                                  : theme.background,
                                borderColor: isSelected
                                  ? opt.color
                                  : theme.border,
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: opt.color }}
                              />
                              <div className="flex-1">
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color: isSelected ? opt.color : theme.text,
                                  }}
                                >
                                  {opt.label}
                                </span>
                                <p
                                  className="text-xs mt-0.5"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {opt.description}
                                </p>
                              </div>
                              {isSelected && (
                                <svg
                                  className="w-4 h-4"
                                  style={{ color: opt.color }}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Status Statistics Section (Read-only) */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    backgroundColor: `${theme.success}18`,
                    color: theme.success,
                  }}
                >
                  <Info className="w-4 h-4" />
                </span>
                <div>
                  <h2
                    className="text-sm sm:text-base font-semibold"
                    style={{ color: theme.text }}
                  >
                    Status Statistics
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Read-only usage statistics
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    label="Total Bookings"
                    value={editedStatus.totalBookingsUsingThisStatus}
                    color={theme.primary}
                  />

                  <StatCard
                    label="Active Bookings"
                    value={editedStatus.activeBookingsCount}
                    color={theme.success}
                  />

                  <StatCard
                    label="Completed Bookings"
                    value={editedStatus.completedBookingsCount || 0}
                    color={theme.accent}
                  />

                  <StatCard
                    label="Cancelled Bookings"
                    value={editedStatus.cancelledBookingsCount || 0}
                    color={theme.error}
                  />
                </div>
              </div>
            </motion.div>

            {/* System Information Section (Read-only) */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    backgroundColor: `${theme.accent}18`,
                    color: theme.accent,
                  }}
                >
                  <Clock className="w-4 h-4" />
                </span>
                <div>
                  <h2
                    className="text-sm sm:text-base font-semibold"
                    style={{ color: theme.text }}
                  >
                    System Information
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Audit trail and system metadata (read-only)
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-lg space-y-3"
                    style={{ backgroundColor: `${theme.border}10` }}
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 mt-0.5" style={{ color: theme.textSecondary }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                          Created At
                        </p>
                        <p className="text-sm" style={{ color: theme.text }}>
                          {formatDate(editedStatus.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 mt-0.5" style={{ color: theme.textSecondary }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                          Created By
                        </p>
                        <p className="text-sm" style={{ color: theme.text }}>
                          User ID: {editedStatus.createdBy}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-lg space-y-3"
                    style={{ backgroundColor: `${theme.border}10` }}
                  >
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 mt-0.5" style={{ color: theme.textSecondary }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                          Updated At
                        </p>
                        <p className="text-sm" style={{ color: theme.text }}>
                          {formatDate(editedStatus.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 mt-0.5" style={{ color: theme.textSecondary }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                          Updated By
                        </p>
                        <p className="text-sm" style={{ color: theme.text }}>
                          {editedStatus.updatedBy ? `User ID: ${editedStatus.updatedBy}` : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Termination Information Section (Conditional) */}
            {(editedStatus.terminatedAt || editedStatus.terminatedBy) && (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-2xl overflow-hidden border-2"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.error,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  className="flex items-center gap-3 px-6 py-4"
                  style={{ 
                    borderBottom: `1px solid ${theme.error}`,
                    backgroundColor: `${theme.error}08`
                  }}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.error}18`,
                      color: theme.error,
                    }}
                  >
                    <AlertCircle className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-sm sm:text-base font-semibold"
                      style={{ color: theme.error }}
                    >
                      Termination Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Details about when and by whom this status was terminated
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editedStatus.terminatedAt && (
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: `${theme.error}08` }}
                      >
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 mt-0.5" style={{ color: theme.error }} />
                          <div>
                            <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                              Terminated At
                            </p>
                            <p className="text-sm" style={{ color: theme.text }}>
                              {formatDate(editedStatus.terminatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {editedStatus.terminatedBy && (
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: `${theme.error}08` }}
                      >
                        <div className="flex items-start gap-3">
                          <User className="w-4 h-4 mt-0.5" style={{ color: theme.error }} />
                          <div>
                            <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                              Terminated By
                            </p>
                            <p className="text-sm" style={{ color: theme.text }}>
                              User ID: {editedStatus.terminatedBy}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {editedStatus && originalStatus && (
          <div
            className="rounded-2xl shadow-lg p-8 mt-8 transition-colors duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResetChanges}
                disabled={!hasChanges() || loadingUpdate}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.background;
                }}
              >
                <RefreshCw className="w-5 h-5" />
                Reset Changes
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!hasChanges() || loadingUpdate}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                }}
              >
                <Save className="w-5 h-5" />
                {loadingUpdate ? "Updating..." : "Update Status"}
              </button>
            </div>

            {/* Change Indicator */}
            {hasChanges() && !loadingUpdate && (
              <div
                className="mt-6 p-4 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5" style={{ color: theme.primary }} />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      You have unsaved changes
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Click "Update Status" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalStatus && editedStatus && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedStatus.statusName}
            changedFields={getChangedFields()}
            confirmText="Update Status"
            cancelText="Cancel"
            title="Confirm Status Update"
            message={`You are about to update "${editedStatus.statusName}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UpdateBookingStatusPage;