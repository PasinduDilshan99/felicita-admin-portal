"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookingService } from "@/services/bookingService";
import { BookingBasicDetails } from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Package,
  Users,
  DollarSign,
  CreditCard,
  Shield,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  X,
  UserCheck,
} from "lucide-react";
import {
  BOOKING_ASSIGN_VIEW_PAGE_URL,
  TOUR_BOOKINGS_DETAILS_VIEW_URL,
} from "@/utils/urls";
import { BOOKING_ASSIGN_DETAILS_VIEW_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { hexToRgba } from "@/utils/functions";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";

const BookingAssignDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const bookingId = parseInt(params?.bookingId as string);

  const [booking, setBooking] = useState<BookingBasicDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [assignMessage, setAssignMessage] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employees = [
    { id: 1, name: "John Doe", department: "Sales" },
    { id: 2, name: "Jane Smith", department: "Operations" },
    { id: 3, name: "Mike Johnson", department: "Customer Service" },
    { id: 4, name: "Sarah Williams", department: "Tour Management" },
  ];

  const breadcrumbItems = [
    ...BOOKING_ASSIGN_DETAILS_VIEW_BREADCRUMB_DATA,
    {
      label: booking?.bookingReference || "Details",
      href: `${BOOKING_ASSIGN_VIEW_PAGE_URL}/${bookingId}`,
    },
  ];

  useEffect(() => {
    if (bookingId) fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookingService.getBookingBasicDetails(bookingId);
      setBooking(response.data);
      setAssignMessage(response.data.assignMessage || "");
      setSelectedEmployeeId(response.data.assignedEmployeeId || null);
    } catch (err: any) {
      setError(
        err.message || "Failed to load booking details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(BOOKING_ASSIGN_VIEW_PAGE_URL);
    }
  };
  const handleRetry = () => {
    if (bookingId) fetchBookingDetails();
  };

  const handleViewFullBooking = () => {
    if (bookingId) {
      router.push(`${TOUR_BOOKINGS_DETAILS_VIEW_URL}/${bookingId}`);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setAssignMessage(booking?.assignMessage || "");
      setSelectedEmployeeId(booking?.assignedEmployeeId || null);
    }
  };

  const handleSaveAssignment = async () => {
    if (!selectedEmployeeId) {
      alert("Please select an employee to assign.");
      return;
    }

    setIsSubmitting(true);
    try {
      // In real implementation, call API to update assignment
      // await BookingService.updateBookingAssignment(bookingId, {
      //   employeeId: selectedEmployeeId,
      //   assignMessage: assignMessage,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      const updatedEmployee = employees.find(
        (e) => e.id === selectedEmployeeId,
      );
      setBooking((prev) =>
        prev
          ? {
              ...prev,
              assignedEmployeeId: selectedEmployeeId,
              assignedEmployeeName: updatedEmployee?.name || "",
              assignMessage: assignMessage,
            }
          : null,
      );

      setIsEditing(false);
      alert("Assignment updated successfully!");
    } catch (err: any) {
      alert("Failed to update assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAssignMessage(booking?.assignMessage || "");
    setSelectedEmployeeId(booking?.assignedEmployeeId || null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isActive =
    booking?.bookingStatusName === "CONFIRMED" ||
    booking?.bookingStatusName === "ACTIVE";

  // Status badge component
  const StatusBadge = () => {
    if (!booking) return null;
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {booking.bookingStatusName}
      </span>
    );
  };

  // Prepare quick stats
  const quickStats = [
    {
      label: "Total Amount",
      value: formatPrice(booking?.finalAmount || 0),
      icon: DollarSign,
      color: theme.primary,
    },
    {
      label: "Total Persons",
      value: booking?.totalPersons || 0,
      icon: Users,
      color: theme.success,
    },
    {
      label: "Tour Duration",
      value: `${booking?.tourDuration || 0} days`,
      icon: Clock,
      color: theme.primary,
    },
    {
      label: "Insurance",
      value: booking?.insuranceRequired ? "Yes" : "No",
      icon: Shield,
      color: booking?.insuranceRequired ? theme.success : theme.textSecondary,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Booking Date",
      value: formatDate(booking?.bookingDate || ""),
      icon: Calendar,
      date: booking?.bookingDate,
      color: theme.primary,
    },
    {
      label: "Travel Dates",
      value: `${formatDate(booking?.travelStartDate || "")} - ${formatDate(booking?.travelEndDate || "")}`,
      icon: Calendar,
      color: theme.primary,
    },
    {
      label: "Booking Status",
      value: booking?.bookingStatusName || "N/A",
      icon: isActive ? CheckCircle : AlertCircle,
      color: isActive ? theme.success : theme.warning,
    },
  ];

  if (loading)
    return (
      <CommonLoading
        message="Loading booking assignment details..."
        subMessage="Fetching booking information"
        size="lg"
      />
    );

  if (error || !booking) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Booking"
        message="The booking couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={handleRetry}
        backButtonText="Back to Assignments"
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
            title={`Booking Assignment`}
            description={`Reference: ${booking.bookingReference}`}
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
                  title: `Booking ${booking.bookingReference}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
          />
          <div className="flex gap-3">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Customer Information Card */}
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
                  <User
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Customer Information
                </h2>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                <div
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ backgroundColor: hexToRgba(theme.primary, 0.04) }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
                  >
                    <User
                      className="w-5 h-5"
                      style={{ color: theme.primary }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Customer Name
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {booking.customerName}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      @{booking.username}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.04),
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.1),
                    }}
                  >
                    <Mail
                      className="w-5 h-5"
                      style={{ color: theme.primary }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Email
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {booking.email}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ backgroundColor: hexToRgba(theme.success, 0.04) }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: hexToRgba(theme.success, 0.1) }}
                  >
                    <Phone
                      className="w-5 h-5"
                      style={{ color: theme.success }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Mobile Number
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {booking.mobileNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour & Package Information Card */}
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
                  <MapPin
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Tour & Package Details
                </h2>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: hexToRgba(theme.primary, 0.04) }}
                >
                  <p
                    className="text-xs font-medium uppercase tracking-wide mb-1"
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
                  <div
                    className="flex flex-wrap gap-3 mt-1 text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    <span>{booking.tourDuration} days</span>
                    <span>
                      {booking.startLocation} → {booking.endLocation}
                    </span>
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl"
                  style={{
                    backgroundColor: hexToRgba(
                      theme.accent || theme.primary,
                      0.04,
                    ),
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Package
                      className="w-4 h-4"
                      style={{ color: theme.accent || theme.primary }}
                    />
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Package
                    </p>
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {booking.packageName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: hexToRgba(theme.success, 0.04) }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Total Persons
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: theme.success }}
                    >
                      {booking.totalPersons}
                    </p>
                  </div>
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.04),
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Insurance
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: booking.insuranceRequired
                          ? theme.success
                          : theme.textSecondary,
                      }}
                    >
                      {booking.insuranceRequired
                        ? "Required ✓"
                        : "Not Required"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requirements Card */}
            {(booking.specialRequirements || booking.dietaryRestrictions) && (
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
                    Special Requirements
                  </h2>
                </div>

                <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                  {booking.specialRequirements && (
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: hexToRgba(theme.warning, 0.06),
                        border: `1px solid ${hexToRgba(theme.warning, 0.1)}`,
                      }}
                    >
                      <p
                        className="text-xs font-medium uppercase tracking-wide mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Special Requirements
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {booking.specialRequirements}
                      </p>
                    </div>
                  )}

                  {booking.dietaryRestrictions && (
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.06),
                        border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                      }}
                    >
                      <p
                        className="text-xs font-medium uppercase tracking-wide mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Dietary Restrictions
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {booking.dietaryRestrictions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="Booking Stats"
              statusBadge={<StatusBadge />}
              columns={2}
            />

            <CommonMetadata
              items={metadataItems}
              title="Booking Details"
              description="Key booking information"
              showCreatedAt={false}
            />

            {/* Assignment Card */}
            <div
              className="rounded-2xl overflow-hidden"
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
                  <UserCheck
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Assignment
                </h2>
                {!isEditing && (
                  <button
                    onClick={handleEditToggle}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-xs font-medium uppercase tracking-wide mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Assign Employee
                      </label>
                      <select
                        value={selectedEmployeeId || ""}
                        onChange={(e) =>
                          setSelectedEmployeeId(parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                        style={{
                          backgroundColor: theme.background,
                          border: `1.5px solid ${theme.border}`,
                          color: theme.text,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = theme.primary;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${hexToRgba(theme.primary, 0.14)}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = theme.border;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.department})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium uppercase tracking-wide mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Assignment Message
                      </label>
                      <textarea
                        value={assignMessage}
                        onChange={(e) => setAssignMessage(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                        style={{
                          backgroundColor: theme.background,
                          border: `1.5px solid ${theme.border}`,
                          color: theme.text,
                        }}
                        placeholder="Enter assignment message..."
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = theme.primary;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${hexToRgba(theme.primary, 0.14)}`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = theme.border;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveAssignment}
                        disabled={isSubmitting}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: theme.primary,
                          color: "#fff",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Assignment
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                        style={{
                          backgroundColor: hexToRgba(theme.error, 0.1),
                          color: theme.error,
                        }}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-3">
                    <div
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        backgroundColor: booking.assignedEmployeeId
                          ? hexToRgba(theme.success, 0.06)
                          : hexToRgba(theme.warning, 0.06),
                        border: `1px solid ${
                          booking.assignedEmployeeId
                            ? hexToRgba(theme.success, 0.15)
                            : hexToRgba(theme.warning, 0.15)
                        }`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: booking.assignedEmployeeId
                            ? hexToRgba(theme.success, 0.1)
                            : hexToRgba(theme.warning, 0.1),
                        }}
                      >
                        {booking.assignedEmployeeId ? (
                          <CheckCircle
                            className="w-5 h-5"
                            style={{ color: theme.success }}
                          />
                        ) : (
                          <AlertCircle
                            className="w-5 h-5"
                            style={{ color: theme.warning }}
                          />
                        )}
                      </div>
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
                          {booking.assignedEmployeeName || "Not Assigned"}
                        </p>
                        {booking.assignedEmployeeId && (
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            Employee ID: {booking.assignedEmployeeId}
                          </p>
                        )}
                      </div>
                    </div>

                    {booking.assignMessage && (
                      <div
                        className="flex items-start gap-2 p-3 rounded-xl"
                        style={{
                          backgroundColor: hexToRgba(theme.primary, 0.04),
                          border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                        }}
                      >
                        <MessageCircle
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: theme.primary }}
                        />
                        <div>
                          <p
                            className="text-xs font-medium uppercase tracking-wide"
                            style={{ color: theme.textSecondary }}
                          >
                            Assignment Message
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: theme.textSecondary }}
                          >
                            {booking.assignMessage}
                          </p>
                        </div>
                      </div>
                    )}

                    {!booking.assignedEmployeeId && (
                      <div
                        className="p-3 rounded-xl text-center"
                        style={{
                          backgroundColor: hexToRgba(theme.warning, 0.06),
                          border: `1px solid ${hexToRgba(theme.warning, 0.1)}`,
                        }}
                      >
                        <p className="text-sm" style={{ color: theme.warning }}>
                          ⚠️ This booking is not assigned to any employee yet.
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Click "Edit" to assign an employee.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Info */}
            {booking.cancellationDate && (
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
                    Cancellation Info
                  </h2>
                </div>

                <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: hexToRgba(theme.error, 0.06),
                      border: `1px solid ${hexToRgba(theme.error, 0.1)}`,
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Cancellation Date
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {formatDate(booking.cancellationDate)}
                    </p>
                  </div>

                  <div
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.04),
                      border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Refund Amount
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {formatPrice(booking.refundAmount)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingAssignDetailsViewPage;
