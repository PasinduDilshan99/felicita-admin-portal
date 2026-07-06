"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookingAssignService } from "@/services/bookingAssignService";
import { BookingService } from "@/services/bookingService";
import { EmployeeService } from "@/services/employeeService";
import {
  UnassignBookingId,
  UpdateUnassignBookingRequest,
} from "@/types/booking-assign-types";
import { TourAssignmentEmployee } from "@/types/employee-types";
import {
  Search,
  Edit,
  Save,
  RefreshCw,
  ChevronDown,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Info,
  Check,
  X,
  Mail,
  Phone,
  Briefcase,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
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
import { BOOKING_ASSIGN_PAGE_URL, TOUR_BOOKINGS_DETAILS_VIEW_URL } from "@/utils/urls";
import { InfoCard } from "@/components/common-components/InfoCard";
import { BookingBasicDetails } from "@/types/booking-types";
import { BOOKING_ASSIGN_UPDATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { cardVariants, sectionVariants } from "@/app/animations/variants";

const UpdateBookingAssignPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  const initialBookingReference = searchParams?.get("booking-reference") || "";
  const initialBookingId = searchParams?.get("booking-id") || "";

  // State for bookings list
  const [bookings, setBookings] = useState<UnassignBookingId[]>([]);

  // State for employees list
  const [employees, setEmployees] = useState<TourAssignmentEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // State for selected booking
  const [selectedBooking, setSelectedBooking] =
    useState<UnassignBookingId | null>(
      initialBookingId && initialBookingReference
        ? {
            bookingId: parseInt(initialBookingId),
            bookingReference: initialBookingReference,
          }
        : null,
    );

  // State for selected employee
  const [selectedEmployee, setSelectedEmployee] =
    useState<TourAssignmentEmployee | null>(null);

  // State for booking details
  const [bookingDetails, setBookingDetails] =
    useState<BookingBasicDetails | null>(null);

  // State for form fields
  const [assignTo, setAssignTo] = useState<string>("");
  const [assignMessage, setAssignMessage] = useState<string>("");
  const [formChanged, setFormChanged] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic", "booking-info"]),
  );
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [expandedEmployeeTours, setExpandedEmployeeTours] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  // Update URL when selected booking changes
  const updateUrlWithSelectedBooking = useCallback(
    (booking: UnassignBookingId | null) => {
      const url = new URL(window.location.href);
      if (booking) {
        url.searchParams.set("booking-id", booking.bookingId.toString());
        url.searchParams.set("booking-reference", booking.bookingReference);
      } else {
        url.searchParams.delete("booking-id");
        url.searchParams.delete("booking-reference");
      }
      router.replace(url.toString(), { scroll: false });
    },
    [router],
  );

  // Fetch bookings list on initial load
  useEffect(() => {
    if (!selectedBooking) {
      fetchBookings();
    }
  }, []);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // If initialBookingId is provided, fetch details
  useEffect(() => {
    if (initialBookingId && !bookingDetails && !loadingDetails) {
      handleSelectBooking(parseInt(initialBookingId), initialBookingReference);
    }
  }, [initialBookingId, initialBookingReference]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookingAssignService.getAssignBookingList();
      setBookings(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load bookings",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await EmployeeService.getEmployeesForTourAssignment();
      if (response.status === "success" || response.code === 200) {
        setEmployees(response.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch employees:", err);
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to load employees list",
      });
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSelectBooking = async (id: number, reference: string) => {
    const newSelectedBooking = { bookingId: id, bookingReference: reference };
    setSelectedBooking(newSelectedBooking);
    updateUrlWithSelectedBooking(newSelectedBooking);
    await fetchBookingDetails(id);
  };

  const fetchBookingDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setBookingDetails(null);
    setFormChanged(false);

    try {
      const response = await BookingService.getBookingBasicDetails(id);
      const data = response.data;
      setBookingDetails(data);
      
      // Pre-fill form with existing assignment data
      const assignedEmployee = employees.find(
        emp => `${emp.firstName} ${emp.lastName}` === data.assignedEmployeeName ||
        emp.employeeId.toString() === data.assignedEmployeeName
      );
      
      if (assignedEmployee) {
        setSelectedEmployee(assignedEmployee);
        setAssignTo(assignedEmployee.employeeId.toString());
      } else {
        setSelectedEmployee(null);
        setAssignTo("");
      }
      
      setAssignMessage(data.assignMessage || "");
    } catch (err: any) {
      setError(err.message || "Failed to load booking details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load booking details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle employee selection
  const handleEmployeeSelect = (employee: TourAssignmentEmployee) => {
    setSelectedEmployee(employee);
    setAssignTo(employee.employeeId.toString());
    setFormChanged(true);
    setEmployeeDropdownOpen(false);
    // Reset tour expansion when new employee is selected
    setExpandedEmployeeTours(false);
  };

  // Clear employee selection
  const handleClearEmployee = () => {
    setSelectedEmployee(null);
    setAssignTo("");
    setFormChanged(true);
    setEmployeeDropdownOpen(false);
    setExpandedEmployeeTours(false);
  };

  // Handle form field changes
  const handleAssignMessageChange = (value: string) => {
    setAssignMessage(value);
    setFormChanged(true);
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    if (!bookingDetails) return false;
    const currentEmployeeId = selectedEmployee?.employeeId.toString() || "";
    const originalEmployeeId = employees.find(
      emp => `${emp.firstName} ${emp.lastName}` === bookingDetails.assignedEmployeeName
    )?.employeeId.toString() || "";
    
    return (
      currentEmployeeId !== originalEmployeeId ||
      assignMessage !== bookingDetails.assignMessage
    );
  }, [bookingDetails, selectedEmployee, assignMessage, employees]);

  // Prepare update data
  const prepareUpdateData = (): UpdateUnassignBookingRequest | null => {
    if (!selectedBooking || !selectedEmployee) return null;

    return {
      bookingId: selectedBooking.bookingId,
      assignTo: selectedEmployee.employeeId,
      assignUsername: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      assignMessage: assignMessage,
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
        await BookingAssignService.updateUnassignBooking(updateData);

      setSuccess(
        `Booking "${bookingDetails?.bookingReference}" assignment updated successfully!`,
      );

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${bookingDetails?.bookingReference} has been reassigned successfully.`,
        actionLink: `${BOOKING_ASSIGN_PAGE_URL}/view?id=${selectedBooking?.bookingId}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedBooking) {
          fetchBookingDetails(selectedBooking.bookingId);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update booking assignment");
      setToast({
        type: "error",
        title: "Update Failed",
        message:
          err.message ||
          "Failed to update booking assignment. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (bookingDetails) {
      const assignedEmployee = employees.find(
        emp => `${emp.firstName} ${emp.lastName}` === bookingDetails.assignedEmployeeName
      );
      
      if (assignedEmployee) {
        setSelectedEmployee(assignedEmployee);
        setAssignTo(assignedEmployee.employeeId.toString());
      } else {
        setSelectedEmployee(null);
        setAssignTo("");
      }
      
      setAssignMessage(bookingDetails.assignMessage || "");
      setFormChanged(false);
      setError(null);
      setSuccess(null);
      setExpandedEmployeeTours(false);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearBookingSelection = () => {
    setSelectedBooking(null);
    setBookingDetails(null);
    setToast(null);
    updateUrlWithSelectedBooking(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!bookingDetails) return [];

    const changes: ChangedField[] = [];

    const currentEmployeeName = selectedEmployee 
      ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
      : "Not assigned";
    const originalEmployeeName = bookingDetails.assignedEmployeeName || "Not assigned";

    if (currentEmployeeName !== originalEmployeeName) {
      changes.push({
        field: "Assigned To",
        oldValue: originalEmployeeName,
        newValue: currentEmployeeName,
      });
    }

    if (assignMessage !== bookingDetails.assignMessage) {
      changes.push({
        field: "Assign Message",
        oldValue: bookingDetails.assignMessage || "(empty)",
        newValue: assignMessage || "(empty)",
      });
    }

    return changes;
  };

  // Convert bookings to search items format
  const searchItems: SearchItem[] = bookings.map((booking) => ({
    id: booking.bookingId,
    name: booking.bookingReference,
  }));

  const selectedSearchItem = selectedBooking
    ? {
        id: selectedBooking.bookingId,
        name: selectedBooking.bookingReference,
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

  // Navigate to tour details
  const navigateToTourDetails = (tourId: number) => {
    router.push(`${TOUR_BOOKINGS_DETAILS_VIEW_URL}/${tourId}`);
  };

  // Show loading state
  if (loading) {
    return (
      <CommonLoading
        message="Loading bookings..."
        subMessage="Please wait while we fetch available bookings"
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
          actionText="View Booking"
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
            title="Update Booking Assignment"
            description="Edit and update booking assignment information"
            breadcrumbItems={BOOKING_ASSIGN_UPDATE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedBooking && (
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
              Select Booking to Assign
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectBooking(item.id as number, item.name)
              }
              onClearSelection={handleClearBookingSelection}
              initialSearchTerm={initialBookingReference}
              placeholder="Search by booking reference..."
              title="Bookings"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Booking Info Bar */}
        {selectedBooking && (
          <SelectedItemBar
            item={{
              id: selectedBooking.bookingId,
              name: selectedBooking.bookingReference,
            }}
            onClear={handleClearBookingSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Booking"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading booking details..."
            subMessage="Please wait while we fetch the booking information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Booking Details Form */}
        {bookingDetails && selectedBooking && (
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
                      Assignment Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Update booking assignment details
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
                    {/* Current Assignment Info */}
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: `${theme.border}10` }}
                    >
                      <p
                        className="text-xs font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Current Assignment
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            Assigned To
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                          >
                            {bookingDetails.assignedEmployeeName ||
                              "Not assigned"}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            Assign Message
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: theme.textSecondary }}
                          >
                            {bookingDetails.assignMessage || "No message"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Employee Selection Dropdown */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        <User className="w-3.5 h-3.5" />
                        Assign To <span style={{ color: theme.error }}>*</span>
                      </label>
                      
                      <div className="relative">
                        {/* Employee Selection Input */}
                        <div
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm cursor-pointer flex items-center justify-between"
                          style={{
                            ...fieldBase,
                            borderColor: formChanged ? theme.primary : theme.border,
                          }}
                          onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {selectedEmployee ? (
                              <>
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                  {selectedEmployee.imageUrl ? (
                                    <img
                                      src={selectedEmployee.imageUrl}
                                      alt={selectedEmployee.firstName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div
                                      className="w-full h-full flex items-center justify-center text-white text-sm font-medium"
                                      style={{ backgroundColor: theme.primary }}
                                    >
                                      {selectedEmployee.firstName[0]}
                                      {selectedEmployee.lastName[0]}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate" style={{ color: theme.text }}>
                                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                                  </p>
                                  <p className="text-xs truncate" style={{ color: theme.textSecondary }}>
                                    {selectedEmployee.designationName}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <span style={{ color: theme.textSecondary }}>
                                Search for an employee...
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedEmployee && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearEmployee();
                                }}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <X className="w-4 h-4" style={{ color: theme.textSecondary }} />
                              </button>
                            )}
                            <ChevronDown
                              className="w-4 h-4 transition-transform duration-200"
                              style={{
                                transform: employeeDropdownOpen ? "rotate(180deg)" : "none",
                                color: theme.textSecondary,
                              }}
                            />
                          </div>
                        </div>

                        {/* Employee Dropdown */}
                        {employeeDropdownOpen && (
                          <div
                            className="absolute z-50 w-full mt-1 rounded-xl border shadow-lg max-h-80 overflow-y-auto"
                            style={{
                              backgroundColor: theme.surface,
                              borderColor: theme.border,
                            }}
                          >
                            {loadingEmployees ? (
                              <div className="p-4 text-center" style={{ color: theme.textSecondary }}>
                                Loading employees...
                              </div>
                            ) : employees.length === 0 ? (
                              <div className="p-4 text-center" style={{ color: theme.textSecondary }}>
                                No employees available
                              </div>
                            ) : (
                              <div className="py-2">
                                {employees.map((employee) => (
                                  <button
                                    key={employee.employeeId}
                                    onClick={() => handleEmployeeSelect(employee)}
                                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                                    style={{
                                      backgroundColor: selectedEmployee?.employeeId === employee.employeeId
                                        ? `${theme.primary}10`
                                        : "transparent",
                                    }}
                                  >
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                      {employee.imageUrl ? (
                                        <img
                                          src={employee.imageUrl}
                                          alt={employee.firstName}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div
                                          className="w-full h-full flex items-center justify-center text-white text-sm font-medium"
                                          style={{ backgroundColor: theme.primary }}
                                        >
                                          {employee.firstName[0]}
                                          {employee.lastName[0]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium truncate" style={{ color: theme.text }}>
                                          {employee.firstName} {employee.lastName}
                                        </p>
                                        {selectedEmployee?.employeeId === employee.employeeId && (
                                          <Check className="w-4 h-4 flex-shrink-0" style={{ color: theme.primary }} />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 text-xs" style={{ color: theme.textSecondary }}>
                                        <span>{employee.designationName}</span>
                                        <span>•</span>
                                        <span>{employee.email}</span>
                                      </div>
                                      {employee.tours && employee.tours.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                          {employee.tours.slice(0, 2).map((tour, index) => (
                                            tour.name && (
                                              <span
                                                key={index}
                                                className="px-2 py-0.5 rounded-full text-xs"
                                                style={{
                                                  backgroundColor: `${theme.primary}15`,
                                                  color: theme.primary,
                                                }}
                                              >
                                                {tour.name}
                                              </span>
                                            )
                                          ))}
                                          {employee.tours.length > 2 && (
                                            <span className="text-xs" style={{ color: theme.textSecondary }}>
                                              +{employee.tours.length - 2} more
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Selected Employee Details Card */}
                      {selectedEmployee && (
                        <div className="mt-3 space-y-3">
                          {/* Employee Details Grid */}
                          <div
                            className="p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                            style={{
                              backgroundColor: `${theme.primary}05`,
                              border: `1px solid ${theme.border}`,
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" style={{ color: theme.textSecondary }} />
                              <div>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>Email</p>
                                <p className="text-sm font-medium" style={{ color: theme.text }}>
                                  {selectedEmployee.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" style={{ color: theme.textSecondary }} />
                              <div>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>Mobile</p>
                                <p className="text-sm font-medium" style={{ color: theme.text }}>
                                  {selectedEmployee.mobileNumber1}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" style={{ color: theme.textSecondary }} />
                              <div>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>Designation</p>
                                <p className="text-sm font-medium" style={{ color: theme.text }}>
                                  {selectedEmployee.designationName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" style={{ color: theme.textSecondary }} />
                              <div>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>Assigned Tours</p>
                                <p className="text-sm font-medium" style={{ color: theme.text }}>
                                  {selectedEmployee.tours?.filter(t => t.name).length || 0}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Expandable Tours Section */}
                          {selectedEmployee.tours && selectedEmployee.tours.filter(t => t.name).length > 0 && (
                            <div
                              className="rounded-lg overflow-hidden"
                              style={{
                                border: `1px solid ${theme.border}`,
                              }}
                            >
                              <button
                                onClick={() => setExpandedEmployeeTours(!expandedEmployeeTours)}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                style={{
                                  backgroundColor: expandedEmployeeTours 
                                    ? `${theme.primary}05` 
                                    : 'transparent',
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4" style={{ color: theme.primary }} />
                                  <span className="text-sm font-medium" style={{ color: theme.text }}>
                                    Assigned Tours
                                  </span>
                                  <span
                                    className="text-xs px-2 py-0.5 rounded-full"
                                    style={{
                                      backgroundColor: `${theme.primary}15`,
                                      color: theme.primary,
                                    }}
                                  >
                                    {selectedEmployee.tours.filter(t => t.name).length}
                                  </span>
                                </div>
                                <ChevronRight
                                  className="w-4 h-4 transition-transform duration-200"
                                  style={{
                                    transform: expandedEmployeeTours ? "rotate(90deg)" : "none",
                                    color: theme.textSecondary,
                                  }}
                                />
                              </button>

                              <AnimatePresence>
                                {expandedEmployeeTours && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div
                                      className="p-3 space-y-2"
                                      style={{
                                        borderTop: `1px solid ${theme.border}`,
                                        backgroundColor: `${theme.background}`,
                                      }}
                                    >
                                      {selectedEmployee.tours
                                        .filter(tour => tour.name)
                                        .map((tour, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                            style={{
                                              backgroundColor: `${theme.surface}`,
                                              border: `1px solid ${theme.border}`,
                                            }}
                                          >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                              <span
                                                className="text-xs font-medium px-2 py-1 rounded bg-gray-100 flex-shrink-0"
                                                style={{
                                                  backgroundColor: `${theme.primary}10`,
                                                  color: theme.primary,
                                                }}
                                              >
                                                #{tour.tour_id}
                                              </span>
                                              <span
                                                className="text-sm truncate"
                                                style={{ color: theme.text }}
                                              >
                                                {tour.name}
                                              </span>
                                            </div>
                                            <button
                                              onClick={() => navigateToTourDetails(tour.tour_id!)}
                                              className="ml-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 flex-shrink-0"
                                              style={{
                                                backgroundColor: `${theme.primary}10`,
                                                color: theme.primary,
                                              }}
                                            >
                                              <ExternalLink className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      )}

                      <p
                        className="text-xs mt-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Select an employee from the dropdown to assign this booking
                      </p>
                    </div>

                    {/* Assign Message */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        <Info className="w-3.5 h-3.5" />
                        Assign Message
                      </label>
                      <textarea
                        value={assignMessage}
                        onChange={(e) =>
                          handleAssignMessageChange(e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{
                          ...fieldBase,
                          borderColor: formChanged
                            ? theme.primary
                            : theme.border,
                        }}
                        placeholder="Enter assignment message..."
                        {...focusHandlers}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Booking Information Section (Read-only) */}
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
                onClick={() => toggleSection("booking-info")}
                className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
                style={{
                  backgroundColor: expandedSections.has("booking-info")
                    ? `${theme.success}05`
                    : "transparent",
                  borderBottom: expandedSections.has("booking-info")
                    ? `1px solid ${theme.border}`
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.success}18`,
                      color: theme.success,
                    }}
                  >
                    <Package className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-sm sm:text-base font-semibold"
                      style={{ color: theme.text }}
                    >
                      Booking Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Read-only booking details
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-200"
                  style={{
                    transform: expandedSections.has("booking-info")
                      ? "rotate(180deg)"
                      : "none",
                    color: theme.textSecondary,
                  }}
                />
              </button>

              <AnimatePresence>
                {expandedSections.has("booking-info") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="p-6"
                  >
                    {/* Customer Info */}
                    <div className="mb-4">
                      <h3
                        className="text-sm font-semibold mb-3 flex items-center gap-2"
                        style={{ color: theme.text }}
                      >
                        <User
                          className="w-4 h-4"
                          style={{ color: theme.primary }}
                        />
                        Customer Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <InfoCard
                          label="Customer Name"
                          value={bookingDetails.customerName}
                          theme={theme}
                        />
                        <InfoCard
                          label="Email"
                          value={bookingDetails.email}
                          theme={theme}
                        />
                        <InfoCard
                          label="Mobile"
                          value={bookingDetails.mobileNumber}
                          theme={theme}
                        />
                      </div>
                    </div>

                    {/* Tour & Package Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3
                          className="text-sm font-semibold mb-3 flex items-center gap-2"
                          style={{ color: theme.text }}
                        >
                          <MapPin
                            className="w-4 h-4"
                            style={{ color: theme.accent }}
                          />
                          Tour Details
                        </h3>
                        <div className="space-y-2">
                          <InfoCard
                            label="Tour Name"
                            value={bookingDetails.tourName}
                            theme={theme}
                          />
                          <InfoCard
                            label="Duration"
                            value={`${bookingDetails.tourDuration} days`}
                            theme={theme}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <InfoCard
                              label="Start"
                              value={bookingDetails.startLocation}
                              theme={theme}
                            />
                            <InfoCard
                              label="End"
                              value={bookingDetails.endLocation}
                              theme={theme}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3
                          className="text-sm font-semibold mb-3 flex items-center gap-2"
                          style={{ color: theme.text }}
                        >
                          <Package
                            className="w-4 h-4"
                            style={{ color: theme.success }}
                          />
                          Package Details
                        </h3>
                        <div className="space-y-2">
                          <InfoCard
                            label="Package Name"
                            value={bookingDetails.packageName}
                            theme={theme}
                          />
                          <InfoCard
                            label="Total Persons"
                            value={bookingDetails.totalPersons}
                            theme={theme}
                          />
                          <InfoCard
                            label="Final Amount"
                            value={formatPrice(bookingDetails.finalAmount)}
                            theme={theme}
                            highlight
                          />
                        </div>
                      </div>
                    </div>

                    {/* Travel Dates & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InfoCard
                        label="Booking Date"
                        value={bookingDetails.bookingDate?.split("T")[0]}
                        theme={theme}
                      />
                      <InfoCard
                        label="Travel Start"
                        value={bookingDetails.travelStartDate?.split("T")[0]}
                        theme={theme}
                      />
                      <InfoCard
                        label="Travel End"
                        value={bookingDetails.travelEndDate?.split("T")[0]}
                        theme={theme}
                      />
                    </div>

                    {/* Status & Requirements */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${theme.border}10` }}
                      >
                        <p
                          className="text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Booking Status
                        </p>
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor:
                              bookingDetails.bookingStatusName === "ACTIVE"
                                ? `${theme.success}15`
                                : `${theme.warning}15`,
                            color:
                              bookingDetails.bookingStatusName === "ACTIVE"
                                ? theme.success
                                : theme.warning,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor:
                                bookingDetails.bookingStatusName === "ACTIVE"
                                  ? theme.success
                                  : theme.warning,
                            }}
                          />
                          {bookingDetails.bookingStatusName}
                        </span>
                      </div>
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${theme.border}10` }}
                      >
                        <p
                          className="text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Insurance Required
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: bookingDetails.insuranceRequired
                              ? theme.success
                              : theme.error,
                          }}
                        >
                          {bookingDetails.insuranceRequired ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    {/* Special Requirements */}
                    {(bookingDetails.specialRequirements ||
                      bookingDetails.dietaryRestrictions) && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {bookingDetails.specialRequirements && (
                          <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${theme.border}10` }}
                          >
                            <p
                              className="text-xs font-medium mb-1"
                              style={{ color: theme.textSecondary }}
                            >
                              Special Requirements
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: theme.textSecondary }}
                            >
                              {bookingDetails.specialRequirements}
                            </p>
                          </div>
                        )}
                        {bookingDetails.dietaryRestrictions && (
                          <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${theme.border}10` }}
                          >
                            <p
                              className="text-xs font-medium mb-1"
                              style={{ color: theme.textSecondary }}
                            >
                              Dietary Restrictions
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: theme.textSecondary }}
                            >
                              {bookingDetails.dietaryRestrictions}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Action Buttons */}
        {bookingDetails && selectedBooking && (
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
                disabled={!hasChanges() || loadingUpdate || !selectedEmployee}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                }}
              >
                <Save className="w-5 h-5" />
                {loadingUpdate ? "Updating..." : "Update Assignment"}
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
                      Click "Update Assignment" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && bookingDetails && selectedBooking && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={bookingDetails.bookingReference}
            changedFields={getChangedFields()}
            confirmText="Update Assignment"
            cancelText="Cancel"
            title="Confirm Assignment Update"
            message={`You are about to update the assignment for booking "${bookingDetails.bookingReference}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UpdateBookingAssignPage;