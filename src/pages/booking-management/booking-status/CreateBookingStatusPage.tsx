"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { useTheme } from "@/contexts/ThemeContext";
import { Tag,  AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { FormActions } from "@/components/common-components/FormActions";
import { InputField } from "@/components/common-components/create-components/InputField";
import { StatusSelector } from "@/components/common-components/StatusSelector";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";
import { CreateBookingStatusRequest } from "@/types/booking-status-types";
import { ToastState } from "@/types/common-components-types";
import { BookingStatusService } from "@/services/bookingStatusService";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { BOOKING_STATUS_ADD_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const CreateBookingStatusPage = () => {
  const router = useRouter();
  const { theme } = useTheme();

  // Form state
  const [formData, setFormData] = useState<CreateBookingStatusRequest>({
    statusName: "",
    description: "",
    status: "ACTIVE",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Handle status change
  const handleStatusChange = (value: "ACTIVE" | "INACTIVE") => {
    setFormData({ ...formData, status: value });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.statusName.trim()) {
      newErrors.statusName = "Status name is required";
    } else if (formData.statusName.length > 100) {
      newErrors.statusName = "Status name must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit booking status
  const submitBookingStatus = async () => {
    setLoading(true);
    try {
      const response = await BookingStatusService.createBookingStatus(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Booking Status Created Successfully!",
          message: `${formData.statusName} has been added to booking statuses.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to create booking status");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle create button click - opens dialog
  const handleCreateClick = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Handle confirm create from dialog
  const handleConfirmCreate = async () => {
    await submitBookingStatus();
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      statusName: "",
      description: "",
      status: "ACTIVE",
    });
    setErrors({});
  };

  // Close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Get status color for preview
  const getStatusColor = (status: string) => {
    return status === "ACTIVE" ? theme.success : theme.textSecondary;
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notification */}
      {toast.show && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Create Booking Status"
            description="Add a new booking status for your bookings"
            breadcrumbItems={BOOKING_STATUS_ADD_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <form className="space-y-8">
              {/* Basic Information Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <Tag className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Booking Status Information
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Create a new booking status
                      </p>
                    </div>
                  </div>

                  <InputField
                    label="Status Name"
                    name="statusName"
                    value={formData.statusName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Confirmed, Pending, Cancelled, Completed"
                    maxLength={100}
                    showCounter
                    error={errors.statusName}
                    helperText="Unique name for this booking status"
                  />

                  <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    type="textarea"
                    required
                    rows={4}
                    placeholder="Describe what this status means..."
                    maxLength={500}
                    showCounter
                    error={errors.description}
                    helperText="Brief description of the status"
                  />

                  <StatusSelector
                    value={formData.status as "ACTIVE" | "INACTIVE"}
                    onChange={handleStatusChange}
                    required
                  />
                </div>
              </FormCard>

              {/* Preview Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <AlertCircle className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Status Preview
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        How the status will appear
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-6 text-center"
                    style={{
                      backgroundColor: `${theme.background}`,
                      border: `2px dashed ${theme.border}`,
                    }}
                  >
                    {formData.statusName ? (
                      <div>
                        <div
                          className="inline-flex items-center gap-3 px-6 py-3 rounded-xl"
                          style={{
                            backgroundColor: `${getStatusColor(formData.status)}10`,
                            border: `2px solid ${getStatusColor(formData.status)}`,
                          }}
                        >
                          {formData.status === "ACTIVE" ? (
                            <CheckCircle
                              className="w-5 h-5"
                              style={{ color: theme.success }}
                            />
                          ) : (
                            <XCircle
                              className="w-5 h-5"
                              style={{ color: theme.textSecondary }}
                            />
                          )}
                          <span
                            className="text-lg font-semibold"
                            style={{ color: getStatusColor(formData.status) }}
                          >
                            {formData.statusName}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${getStatusColor(formData.status)}20`,
                              color: getStatusColor(formData.status),
                            }}
                          >
                            {formData.status}
                          </span>
                        </div>
                        {formData.description && (
                          <p
                            className="mt-3 text-sm"
                            style={{ color: theme.textSecondary }}
                          >
                            {formData.description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: theme.textSecondary }}>
                        <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">
                          Enter status details to preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </FormCard>

              {/* Form Actions */}
              <FormActions
                loading={loading}
                uploadingImages={false}
                onSubmit={handleCreateClick}
                onReset={handleReset}
                errors={errors}
                submitText="Booking Status"
                submitButtonType="button"
              />
            </form>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Status Tips */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <h3 className="font-semibold" style={{ color: theme.text }}>
                  Status Guidelines
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: theme.success }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Clear and Concise
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Use short, descriptive names that are easy to understand
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: theme.warning }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Consistent Flow
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Ensure statuses follow a logical progression (e.g.,
                      Pending → Confirmed → Completed)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: theme.error }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Meaningful Descriptions
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Describe what each status means for the booking process
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Common Statuses
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Examples: Pending, Confirmed, In Progress, Completed,
                      Cancelled, On Hold
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <h3 className="font-semibold" style={{ color: theme.text }}>
                  Quick Actions
                </h3>
              </div>
              <div className="px-6 py-4 space-y-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-10"
                  style={{
                    color: theme.textSecondary,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                    e.currentTarget.style.color = theme.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = theme.textSecondary;
                  }}
                >
                  Reset Form
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push("/web-management/destinations/booking-statuses")
                  }
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-10"
                  style={{
                    color: theme.textSecondary,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.primary}10`;
                    e.currentTarget.style.color = theme.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = theme.textSecondary;
                  }}
                >
                  View All Statuses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <CreateConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmCreate}
        details={{
          title: "Create New Booking Status",
          message: "Are you sure you want to create this booking status?",
          itemName: formData.statusName || "Untitled Status",
          type: "create",
          estimatedTime: "~1-2 seconds",
          tips: [
            "Verify that the status name is clear and descriptive",
            "Check that the status follows your booking workflow",
            "Active statuses will be available for selection",
            "You can edit or deactivate this status anytime",
            "Consider the status flow: Pending → Confirmed → In Progress → Completed",
          ],
        }}
        confirmText="Create Status"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Booking status created successfully");
          // Optional: Redirect after success
          // setTimeout(() => {
          //   router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/booking-statuses`);
          // }, 1500);
        }}
        onError={(error) => {
          console.error("Failed to create booking status:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message:
              error.message ||
              "Failed to create booking status. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default CreateBookingStatusPage;
