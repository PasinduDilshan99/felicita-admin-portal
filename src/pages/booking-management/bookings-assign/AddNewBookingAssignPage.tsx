"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Search,
  ChevronDown,
  Check,
  AlertCircle,
  Loader,
  RefreshCw,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  User,
  Mail,
  Phone,
  Package,
  FileText,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { FormActions } from "@/components/common-components/FormActions";
import { InputField } from "@/components/common-components/create-components/InputField";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";
import { EmployeeService } from "@/services/employeeService";
import { BookingService } from "@/services/bookingService";
import {
  AssignBookingRequest,
  UnassignBookingId,
} from "@/types/booking-assign-types";
import { BookingBasicDetails } from "@/types/booking-types";
import { TourAssignmentEmployee } from "@/types/employee-types";
import { ToastState } from "@/types/common-components-types";
import { BookingAssignService } from "@/services/bookingAssignService";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { BOOKING_ASSIGN_ADD_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

const AddNewBookingAssignPage = () => {
  const { theme } = useTheme();

  // State for unassign bookings
  const [unassignBookings, setUnassignBookings] = useState<UnassignBookingId[]>(
    [],
  );
  const [selectedBooking, setSelectedBooking] =
    useState<UnassignBookingId | null>(null);
  const [bookingDetails, setBookingDetails] =
    useState<BookingBasicDetails | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // State for employees
  const [employees, setEmployees] = useState<TourAssignmentEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<TourAssignmentEmployee | null>(null);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");

  // Form state
  const [assignMessage, setAssignMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // Dropdown position state (for portaled menus)
  const [bookingDropdownPos, setBookingDropdownPos] =
    useState<DropdownPosition>({ top: 0, left: 0, width: 0 });
  const [employeeDropdownPos, setEmployeeDropdownPos] =
    useState<DropdownPosition>({ top: 0, left: 0, width: 0 });

  // Refs for outside-click detection (input wrappers)
  const dropdownRef = useRef<HTMLDivElement>(null);
  const employeeDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const employeeSearchRef = useRef<HTMLInputElement>(null);

  // Refs used purely to measure position for the portaled dropdowns
  const bookingInputWrapperRef = useRef<HTMLDivElement>(null);
  const employeeInputWrapperRef = useRef<HTMLDivElement>(null);

  // Refs for the portaled menus themselves (so outside-click also checks these)
  const bookingPortalRef = useRef<HTMLDivElement>(null);
  const employeePortalRef = useRef<HTMLDivElement>(null);

  // Compute a dropdown's position relative to the viewport/document
  const computeDropdownPosition = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>): DropdownPosition => {
      if (!ref.current) return { top: 0, left: 0, width: 0 };
      const rect = ref.current.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY + 8, // 8px gap, matches mt-2
        left: rect.left + window.scrollX,
        width: rect.width,
      };
    },
    [],
  );

  // Fetch unassign bookings
  const fetchUnassignBookings = async () => {
    if (loadingBookings) return;
    try {
      setLoadingBookings(true);
      setApiError(null);
      const response = await BookingAssignService.getUnassignBookingList();
      if (response.code === 200 && response.data) {
        setUnassignBookings(response.data);
      } else {
        setApiError(response.message || "Failed to load unassign bookings");
      }
    } catch (error) {
      console.error("Error fetching unassign bookings:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Error loading bookings. Please try again.",
      );
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    if (loadingEmployees) return;
    try {
      setLoadingEmployees(true);
      const response = await EmployeeService.getEmployeesForTourAssignment();
      if (response.code === 200 && response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setToast({
        show: true,
        type: "error",
        title: "Error",
        message: "Failed to load employees. Please try again.",
      });
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Load unassign bookings on mount
  useEffect(() => {
    fetchUnassignBookings();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdowns on click outside (checks both the trigger AND the portaled menu)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideBookingTrigger =
        dropdownRef.current && dropdownRef.current.contains(target);
      const clickedInsideBookingMenu =
        bookingPortalRef.current && bookingPortalRef.current.contains(target);

      if (!clickedInsideBookingTrigger && !clickedInsideBookingMenu) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }

      const clickedInsideEmployeeTrigger =
        employeeDropdownRef.current &&
        employeeDropdownRef.current.contains(target);
      const clickedInsideEmployeeMenu =
        employeePortalRef.current &&
        employeePortalRef.current.contains(target);

      if (!clickedInsideEmployeeTrigger && !clickedInsideEmployeeMenu) {
        setIsEmployeeDropdownOpen(false);
        setEmployeeSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keep portaled dropdowns aligned with their trigger on scroll/resize
  useEffect(() => {
    if (!isDropdownOpen && !isEmployeeDropdownOpen) return;

    const handleReposition = () => {
      if (isDropdownOpen) {
        setBookingDropdownPos(computeDropdownPosition(bookingInputWrapperRef));
      }
      if (isEmployeeDropdownOpen) {
        setEmployeeDropdownPos(
          computeDropdownPosition(employeeInputWrapperRef),
        );
      }
    };

    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isDropdownOpen, isEmployeeDropdownOpen, computeDropdownPosition]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return unassignBookings;
    return unassignBookings.filter((booking: UnassignBookingId) =>
      booking.bookingReference
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [unassignBookings, searchQuery]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    if (!employeeSearchQuery.trim()) return employees;
    return employees.filter((emp: TourAssignmentEmployee) =>
      `${emp.firstName} ${emp.lastName}`
        .toLowerCase()
        .includes(employeeSearchQuery.toLowerCase()),
    );
  }, [employees, employeeSearchQuery]);

  // Handle booking selection
  const handleSelectBooking = async (booking: UnassignBookingId) => {
    setSelectedBooking(booking);
    setIsDropdownOpen(false);
    setSearchQuery("");

    try {
      setLoadingDetails(true);
      const response = await BookingService.getBookingBasicDetails(
        booking.bookingId,
      );
      if (response.code === 200 && response.data) {
        setBookingDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setToast({
        show: true,
        type: "error",
        title: "Error",
        message: "Failed to load booking details. Please try again.",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle employee selection
  const handleSelectEmployee = (employee: TourAssignmentEmployee) => {
    setSelectedEmployee(employee);
    setIsEmployeeDropdownOpen(false);
    setEmployeeSearchQuery("");
  };

  // Handle clear booking
  const handleClearBooking = () => {
    setSelectedBooking(null);
    setBookingDetails(null);
    setSelectedEmployee(null);
    setAssignMessage("");
  };

  // Handle clear employee
  const handleClearEmployee = () => {
    setSelectedEmployee(null);
  };

  // Open booking dropdown + position it
  const openBookingDropdown = () => {
    setIsDropdownOpen(true);
    setBookingDropdownPos(computeDropdownPosition(bookingInputWrapperRef));
  };

  // Open employee dropdown + position it
  const openEmployeeDropdown = () => {
    setIsEmployeeDropdownOpen(true);
    setEmployeeDropdownPos(computeDropdownPosition(employeeInputWrapperRef));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedBooking) {
      newErrors.booking = "Please select a booking to assign";
    }

    if (!selectedEmployee) {
      newErrors.employee = "Please select an employee to assign";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit assignment
  const submitAssignment = async () => {
    if (!selectedBooking || !selectedEmployee) return;

    setLoading(true);
    try {
      const assignData: AssignBookingRequest = {
        bookingId: selectedBooking.bookingId,
        assignTo: selectedEmployee.employeeId,
        assignUsername: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        assignMessage: assignMessage,
      };

      const response = await BookingAssignService.assignBooking(assignData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Booking Assigned Successfully!",
          message: `Booking #${selectedBooking.bookingReference} has been assigned to ${selectedEmployee.firstName} ${selectedEmployee.lastName}.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to assign booking");
      }
    } catch (error: any) {
      console.error("Assignment error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

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

  const handleConfirmCreate = async () => {
    await submitAssignment();
  };

  // Reset form
  const handleReset = () => {
    setSelectedBooking(null);
    setBookingDetails(null);
    setSelectedEmployee(null);
    setAssignMessage("");
    setErrors({});
    // Refresh the unassign bookings list
    fetchUnassignBookings();
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to check if booking is selected
  const isBookingSelected = (booking: UnassignBookingId): boolean => {
    return selectedBooking?.bookingId === booking.bookingId;
  };

  // Helper function to check if employee is selected
  const isEmployeeSelected = (employee: TourAssignmentEmployee): boolean => {
    return selectedEmployee?.employeeId === employee.employeeId;
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {toast.show && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}

      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Assign Booking"
            description="Assign an unassigned booking to an employee"
            breadcrumbItems={BOOKING_ASSIGN_ADD_BREADCRUMB_DATA}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Selector */}
            <div className="relative">
              <FormCard>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <FileText className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Select Booking
                      </h2>
                      <p
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        Choose an unassigned booking to assign
                      </p>
                    </div>
                    {selectedBooking && (
                      <button
                        type="button"
                        onClick={handleClearBooking}
                        className="ml-auto text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20"
                        style={{ color: theme.error }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {!selectedBooking ? (
                    <div className="relative" ref={dropdownRef}>
                      <div className="relative" ref={bookingInputWrapperRef}>
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                          style={{ color: theme.textSecondary }}
                        />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search by booking reference..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            openBookingDropdown();
                          }}
                          onFocus={openBookingDropdown}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: errors.booking
                              ? theme.error
                              : isDropdownOpen
                                ? theme.primary
                                : theme.border,
                            color: theme.text,
                          }}
                        />
                        <ChevronDown
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 cursor-pointer"
                          style={{
                            color: theme.textSecondary,
                            transform: isDropdownOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                          onClick={() => {
                            if (isDropdownOpen) {
                              setIsDropdownOpen(false);
                            } else {
                              openBookingDropdown();
                            }
                          }}
                        />
                      </div>

                      {isDropdownOpen &&
                        typeof document !== "undefined" &&
                        createPortal(
                          <div
                            ref={bookingPortalRef}
                            className="rounded-xl shadow-lg"
                            style={{
                              position: "absolute",
                              top: bookingDropdownPos.top,
                              left: bookingDropdownPos.left,
                              width: bookingDropdownPos.width,
                              backgroundColor: theme.surface,
                              border: `1px solid ${theme.border}`,
                              maxHeight: "300px",
                              overflowY: "auto",
                              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                              zIndex: 9999,
                            }}
                          >
                            {loadingBookings ? (
                              <div
                                className="p-4 text-center text-sm"
                                style={{ color: theme.textSecondary }}
                              >
                                <Loader
                                  className="w-5 h-5 animate-spin mx-auto mb-2"
                                  style={{ color: theme.primary }}
                                />
                                Loading bookings...
                              </div>
                            ) : apiError ? (
                              <div className="p-4 text-center">
                                <div
                                  className="text-sm mb-2"
                                  style={{ color: theme.error }}
                                >
                                  <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                                  {apiError}
                                </div>
                                <button
                                  onClick={fetchUnassignBookings}
                                  className="text-xs px-3 py-1 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                                  style={{
                                    backgroundColor: `${theme.primary}20`,
                                    color: theme.primary,
                                  }}
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  Retry
                                </button>
                              </div>
                            ) : filteredBookings.length === 0 ? (
                              <div
                                className="p-4 text-center text-sm"
                                style={{ color: theme.textSecondary }}
                              >
                                {searchQuery
                                  ? "No bookings match your search"
                                  : "No unassigned bookings available"}
                              </div>
                            ) : (
                              filteredBookings.map(
                                (booking: UnassignBookingId) => {
                                  const isSelected =
                                    isBookingSelected(booking);
                                  return (
                                    <button
                                      key={booking.bookingId}
                                      type="button"
                                      onClick={() =>
                                        handleSelectBooking(booking)
                                      }
                                      className="w-full px-4 py-3 text-left transition-all duration-150 flex items-center justify-between group"
                                      style={{
                                        backgroundColor: isSelected
                                          ? `${theme.primary}10`
                                          : "transparent",
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!isSelected) {
                                          e.currentTarget.style.backgroundColor = `${theme.border}30`;
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isSelected) {
                                          e.currentTarget.style.backgroundColor =
                                            "transparent";
                                        }
                                      }}
                                    >
                                      <div className="flex-1">
                                        <p
                                          className="text-sm font-medium"
                                          style={{ color: theme.text }}
                                        >
                                          {booking.bookingReference}
                                        </p>
                                        <p
                                          className="text-xs"
                                          style={{ color: theme.textSecondary }}
                                        >
                                          Booking ID: {booking.bookingId}
                                        </p>
                                      </div>
                                      {isSelected && (
                                        <Check
                                          className="w-4 h-4 ml-2 flex-shrink-0"
                                          style={{ color: theme.primary }}
                                        />
                                      )}
                                    </button>
                                  );
                                },
                              )
                            )}
                          </div>,
                          document.body,
                        )}
                    </div>
                  ) : (
                    <div
                      className="rounded-xl p-4 flex items-center justify-between"
                      style={{
                        backgroundColor: `${theme.success}08`,
                        border: `1px solid ${theme.success}30`,
                      }}
                    >
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: theme.text }}
                        >
                          {selectedBooking.bookingReference}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Booking ID: {selectedBooking.bookingId}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearBooking}
                        className="text-xs px-2 py-1 rounded-lg hover:bg-opacity-20"
                        style={{ color: theme.error }}
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {errors.booking && (
                    <p
                      className="text-xs flex items-center gap-1"
                      style={{ color: theme.error }}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.booking}
                    </p>
                  )}
                </div>
              </FormCard>
            </div>

            {/* Booking Details */}
            {selectedBooking && (
              <FormCard>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <FileText className="w-4 h-4" />
                    </span>
                    <h2
                      className="text-base font-semibold"
                      style={{ color: theme.text }}
                    >
                      Booking Details
                    </h2>
                  </div>

                  {loadingDetails ? (
                    <div className="text-center py-8">
                      <Loader
                        className="w-8 h-8 animate-spin mx-auto mb-2"
                        style={{ color: theme.primary }}
                      />
                      <p style={{ color: theme.textSecondary }}>
                        Loading booking details...
                      </p>
                    </div>
                  ) : bookingDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            {bookingDetails.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail
                          className="w-4 h-4"
                          style={{ color: theme.primary }}
                        />
                        <div>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            Email
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                          >
                            {bookingDetails.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone
                          className="w-4 h-4"
                          style={{ color: theme.primary }}
                        />
                        <div>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            Mobile
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                          >
                            {bookingDetails.mobileNumber}
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
                            {bookingDetails.tourName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package
                          className="w-4 h-4"
                          style={{ color: theme.primary }}
                        />
                        <div>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            Package
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                          >
                            {bookingDetails.packageName || "N/A"}
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
                            {formatDate(bookingDetails.travelStartDate)} -{" "}
                            {formatDate(bookingDetails.travelEndDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users
                          className="w-4 h-4"
                          style={{ color: theme.primary }}
                        />
                        <div>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            Persons
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                          >
                            {bookingDetails.totalPersons}
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
                            style={{ color: theme.success }}
                          >
                            {formatCurrency(bookingDetails.finalAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <FileText
                          className="w-4 h-4"
                          style={{ color: theme.primary }}
                        />
                        <div>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            Status
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                          >
                            <span
                              className="px-2 py-0.5 rounded-full text-xs"
                              style={{
                                backgroundColor:
                                  bookingDetails.bookingStatusName ===
                                  "Confirmed"
                                    ? `${theme.success}20`
                                    : `${theme.warning}20`,
                                color:
                                  bookingDetails.bookingStatusName ===
                                  "Confirmed"
                                    ? theme.success
                                    : theme.warning,
                              }}
                            >
                              {bookingDetails.bookingStatusName}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-center py-8"
                      style={{ color: theme.textSecondary }}
                    >
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>No details available</p>
                    </div>
                  )}
                </div>
              </FormCard>
            )}

            {/* Employee Selector */}
            {selectedBooking && (
              <div className="relative">
                <FormCard>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-lg"
                        style={{
                          backgroundColor: `${theme.primary}18`,
                          color: theme.primary,
                        }}
                      >
                        <UserCheck className="w-4 h-4" />
                      </span>
                      <div>
                        <h2
                          className="text-base font-semibold"
                          style={{ color: theme.text }}
                        >
                          Select Employee
                        </h2>
                        <p
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Choose an employee to assign this booking
                        </p>
                      </div>
                      {selectedEmployee && (
                        <button
                          type="button"
                          onClick={handleClearEmployee}
                          className="ml-auto text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20"
                          style={{ color: theme.error }}
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {!selectedEmployee ? (
                      <div className="relative" ref={employeeDropdownRef}>
                        <div
                          className="relative"
                          ref={employeeInputWrapperRef}
                        >
                          <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                            style={{ color: theme.textSecondary }}
                          />
                          <input
                            ref={employeeSearchRef}
                            type="text"
                            placeholder="Search employees..."
                            value={employeeSearchQuery}
                            onChange={(e) => {
                              setEmployeeSearchQuery(e.target.value);
                              openEmployeeDropdown();
                            }}
                            onFocus={openEmployeeDropdown}
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                            style={{
                              backgroundColor: theme.background,
                              borderColor: errors.employee
                                ? theme.error
                                : isEmployeeDropdownOpen
                                  ? theme.primary
                                  : theme.border,
                              color: theme.text,
                            }}
                          />
                          <ChevronDown
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 cursor-pointer"
                            style={{
                              color: theme.textSecondary,
                              transform: isEmployeeDropdownOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                            onClick={() => {
                              if (isEmployeeDropdownOpen) {
                                setIsEmployeeDropdownOpen(false);
                              } else {
                                openEmployeeDropdown();
                              }
                            }}
                          />
                        </div>

                        {isEmployeeDropdownOpen &&
                          typeof document !== "undefined" &&
                          createPortal(
                            <div
                              ref={employeePortalRef}
                              className="rounded-xl shadow-lg"
                              style={{
                                position: "absolute",
                                top: employeeDropdownPos.top,
                                left: employeeDropdownPos.left,
                                width: employeeDropdownPos.width,
                                backgroundColor: theme.surface,
                                border: `1px solid ${theme.border}`,
                                maxHeight: "300px",
                                overflowY: "auto",
                                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                                zIndex: 9999,
                              }}
                            >
                              {loadingEmployees ? (
                                <div
                                  className="p-4 text-center text-sm"
                                  style={{ color: theme.textSecondary }}
                                >
                                  <Loader
                                    className="w-5 h-5 animate-spin mx-auto mb-2"
                                    style={{ color: theme.primary }}
                                  />
                                  Loading employees...
                                </div>
                              ) : filteredEmployees.length === 0 ? (
                                <div
                                  className="p-4 text-center text-sm"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {employeeSearchQuery
                                    ? "No employees match your search"
                                    : "No employees available"}
                                </div>
                              ) : (
                                filteredEmployees.map(
                                  (employee: TourAssignmentEmployee) => {
                                    const isSelected =
                                      isEmployeeSelected(employee);
                                    return (
                                      <button
                                        key={employee.employeeId}
                                        type="button"
                                        onClick={() =>
                                          handleSelectEmployee(employee)
                                        }
                                        className="w-full px-4 py-3 text-left transition-all duration-150 flex items-center justify-between group"
                                        style={{
                                          backgroundColor: isSelected
                                            ? `${theme.primary}10`
                                            : "transparent",
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = `${theme.border}30`;
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isSelected) {
                                            e.currentTarget.style.backgroundColor =
                                              "transparent";
                                          }
                                        }}
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span
                                              className="w-1.5 h-1.5 rounded-full transition-all duration-200 group-hover:scale-150"
                                              style={{
                                                backgroundColor: isSelected
                                                  ? theme.primary
                                                  : theme.textSecondary,
                                              }}
                                            />
                                            <p
                                              className="text-sm font-medium"
                                              style={{ color: theme.text }}
                                            >
                                              {employee.firstName}{" "}
                                              {employee.lastName}
                                            </p>
                                          </div>
                                          <p
                                            className="text-xs"
                                            style={{
                                              color: theme.textSecondary,
                                            }}
                                          >
                                            {employee.designationName}
                                          </p>
                                        </div>
                                        {isSelected && (
                                          <Check
                                            className="w-4 h-4 ml-2 flex-shrink-0"
                                            style={{ color: theme.primary }}
                                          />
                                        )}
                                      </button>
                                    );
                                  },
                                )
                              )}
                            </div>,
                            document.body,
                          )}
                      </div>
                    ) : (
                      <div
                        className="rounded-xl p-4 flex items-center justify-between"
                        style={{
                          backgroundColor: `${theme.success}08`,
                          border: `1px solid ${theme.success}30`,
                        }}
                      >
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: theme.text }}
                          >
                            {selectedEmployee.firstName}{" "}
                            {selectedEmployee.lastName}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            {selectedEmployee.designationName}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearEmployee}
                          className="text-xs px-2 py-1 rounded-lg hover:bg-opacity-20"
                          style={{ color: theme.error }}
                        >
                          Change
                        </button>
                      </div>
                    )}

                    {errors.employee && (
                      <p
                        className="text-xs flex items-center gap-1"
                        style={{ color: theme.error }}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.employee}
                      </p>
                    )}
                  </div>
                </FormCard>
              </div>
            )}

            {/* Assign Message */}
            {selectedBooking && selectedEmployee && (
              <FormCard>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Assign Message
                      </h2>
                      <p
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        Add a message for the assigned employee
                      </p>
                    </div>
                  </div>

                  <InputField
                    label="Message"
                    name="assignMessage"
                    value={assignMessage}
                    onChange={(e) => setAssignMessage(e.target.value)}
                    type="textarea"
                    rows={3}
                    placeholder="Add any instructions or notes for the assigned employee..."
                    error={errors.assignMessage}
                    helperText="Optional message for the employee"
                  />
                </div>
              </FormCard>
            )}

            {/* Form Actions */}
            {selectedBooking && selectedEmployee && (
              <FormActions
                loading={loading}
                uploadingImages={false}
                onSubmit={handleCreateClick}
                onReset={handleReset}
                errors={errors}
                submitText="Assign Booking"
                submitButtonType="button"
              />
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-8">
            {/* Assignment Summary */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <h3 className="font-semibold" style={{ color: theme.text }}>
                  Assignment Summary
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Booking
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: selectedBooking ? theme.text : theme.textSecondary,
                    }}
                  >
                    {selectedBooking
                      ? selectedBooking.bookingReference
                      : "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Employee
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: selectedEmployee
                        ? theme.text
                        : theme.textSecondary,
                    }}
                  >
                    {selectedEmployee
                      ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                      : "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Status
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color:
                        selectedBooking && selectedEmployee
                          ? theme.success
                          : theme.textSecondary,
                    }}
                  >
                    {selectedBooking && selectedEmployee
                      ? "Ready to assign"
                      : "Incomplete"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <h3 className="font-semibold" style={{ color: theme.text }}>
                  Assignment Tips
                </h3>
              </div>
              <div className="px-6 py-4 space-y-2">
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  • Assign bookings to employees based on their expertise
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  • Add clear instructions in the assign message
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  • Review booking details before assigning
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  • Assignments can be changed later if needed
                </p>
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
          title: "Assign Booking",
          message: `Are you sure you want to assign booking #${selectedBooking?.bookingReference || ""} to ${selectedEmployee?.firstName || ""} ${selectedEmployee?.lastName || ""}?`,
          itemName: `Booking #${selectedBooking?.bookingReference || ""}`,
          type: "create",
          estimatedTime: "~1-2 seconds",
          tips: [
            "Verify the booking details before assigning",
            "Make sure the employee is available for this assignment",
            "The employee will be notified about the assignment",
            "You can reassign if needed later",
          ],
        }}
        confirmText="Assign Booking"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Booking assigned successfully");
        }}
        onError={(error) => {
          console.error("Failed to assign booking:", error);
          setToast({
            show: true,
            type: "error",
            title: "Assignment Failed",
            message:
              error.message || "Failed to assign booking. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default AddNewBookingAssignPage;