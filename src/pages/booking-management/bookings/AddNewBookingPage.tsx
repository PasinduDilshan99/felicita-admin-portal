"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { useTheme } from "@/contexts/ThemeContext";
import { FormActions } from "@/components/common-components/FormActions";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";
import { BookingService } from "@/services/bookingService";
import {
  CreateBookingRequest,
  CreateBookingParams,
  CreateParticipantRequest,
  CreateAccommodationRequest,
  CreateTransportationRequest,
  CreateDocumentRequest,
  CreateBookingInsuranceRequest,
  CreateBookingItineraryRequest,
  CreateBookingNoteRequest,
  CreatePriceBreakDownRequest,
  CreateBookingInvoiceRequest,
} from "@/types/booking-types";
import { ToastState } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_BOOKING_ADD_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { TourSelector } from "@/components/bookings-components/create-booking-components/TourSelector";
import { BookingBasicInfo } from "@/components/bookings-components/create-booking-components/BookingBasicInfo";
import { BookingPricing } from "@/components/bookings-components/create-booking-components/BookingPricing";
import { BookingActivitySelector } from "@/components/bookings-components/create-booking-components/BookingActivitySelector";
import { BookingParticipants } from "@/components/bookings-components/create-booking-components/BookingParticipants";
import { BookingAccommodations } from "@/components/bookings-components/create-booking-components/BookingAccommodations";
import { BookingTransportation } from "@/components/bookings-components/create-booking-components/BookingTransportation";
import { BookingDocuments } from "@/components/bookings-components/create-booking-components/BookingDocuments";
import { BookingInsurance } from "@/components/bookings-components/create-booking-components/BookingInsurance";
import { BookingItinerary } from "@/components/bookings-components/create-booking-components/BookingItinerary";
import { BookingNotes } from "@/components/bookings-components/create-booking-components/BookingNotes";
import { BookingPriceBreakdown } from "@/components/bookings-components/create-booking-components/BookingPriceBreakdown";
import { BookingInvoice } from "@/components/bookings-components/create-booking-components/BookingInvoice";

const AddNewBookingPage = () => {
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const tourIdFromUrl = searchParams?.get("tourId") ?? null;

  // Refs to prevent infinite loops
  const isFetchingRef = useRef(false);
  const lastFetchedTourIdRef = useRef<number | null>(null);
  const isInitialMountRef = useRef(true);

  // State
  const [formData, setFormData] = useState<CreateBookingRequest>({
    customerId: 0,
    tourId: 0,
    packageId: 0,
    packageScheduleId: null,
    bookingDate: "",
    travelStartDate: "",
    travelEndDate: "",
    totalPersons: 1,
    totalAmount: 0,
    discountAmount: 0,
    taxAmount: 0,
    insuranceAmount: 0,
    finalAmount: 0,
    insuranceRequired: false,
    bookingStatusId: 0,
    specialRequirements: "",
    dietaryRestrictions: "",
    assignTo: 0,
    assignMessage: "",
    participants: [],
    accommodations: [],
    transportations: [],
    activities: [],
    documents: [],
    bookingInsurance: {
      insuranceProvider: "",
      policyNumber: "",
      coverageType: "",
      coverageDetails: "",
      premiumAmount: 0,
      policyStartDate: "",
      policyEndDate: "",
      status: 1,
    },
    bookingItineraries: [],
    bookingNotes: [],
    priceBreakDowns: [],
    bookingInvoice: {
      dueDate: "",
      subTotal: 0,
      taxAmount: 0,
      totalAmount: 0,
      discountAmount: 0,
      insuranceAmount: 0,
      amountPaid: 0,
      balanceDue: 0,
      billingFullName: "",
      billingAddress: "",
      billingEmail: "",
      billingPhone: "",
      status: 1,
    },
  });

  const [bookingParams, setBookingParams] =
    useState<CreateBookingParams | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingParams, setLoadingParams] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // Fetch booking params when tour is selected
  const fetchBookingParams = useCallback(async (tourId: number) => {
    if (isFetchingRef.current) return;
    if (!tourId || tourId <= 0) return;
    if (lastFetchedTourIdRef.current === tourId) return;

    try {
      isFetchingRef.current = true;
      setLoadingParams(true);

      const response = await BookingService.getCreateBookingParams(tourId);

      if (response.code === 200 && response.data) {
        setBookingParams(response.data);
        setFormData((prev) => {
          if (prev.tourId !== tourId) {
            return { ...prev, tourId };
          }
          return prev;
        });
        lastFetchedTourIdRef.current = tourId;
      } else {
        setToast({
          show: true,
          type: "error",
          title: "Error",
          message: response.message || "Failed to load booking parameters.",
        });
      }
    } catch (error) {
      console.error("Error fetching booking params:", error);
      setToast({
        show: true,
        type: "error",
        title: "Error",
        message: "Failed to load booking parameters. Please try again.",
      });
    } finally {
      setLoadingParams(false);
      isFetchingRef.current = false;
    }
  }, []);

  const handleTourSelect = useCallback(
    (tourId: number, tourName: string) => {
      if (lastFetchedTourIdRef.current === tourId) return;

      try {
        const url = new URL(window.location.href);
        url.searchParams.set("tourId", String(tourId));
        window.history.replaceState({}, "", url.toString());
      } catch (error) {
        console.error("Error updating URL:", error);
      }

      fetchBookingParams(tourId);
    },
    [fetchBookingParams],
  );

  const handleTourClear = useCallback(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("tourId");
      window.history.replaceState({}, "", url.toString());
    } catch (error) {
      console.error("Error updating URL:", error);
    }

    setFormData((prev) => ({ ...prev, tourId: 0 }));
    lastFetchedTourIdRef.current = null;
    setBookingParams(null);
  }, []);

  // Load tour from URL on initial mount
  useEffect(() => {
    if (isInitialMountRef.current && tourIdFromUrl) {
      const tourId = Number(tourIdFromUrl);
      if (tourId > 0) {
        setFormData((prev) => ({ ...prev, tourId }));
        fetchBookingParams(tourId);
      }
      isInitialMountRef.current = false;
    }
  }, [tourIdFromUrl, fetchBookingParams]);

  // Cleanup
  useEffect(() => {
    return () => {
      isFetchingRef.current = false;
      lastFetchedTourIdRef.current = null;
      isInitialMountRef.current = true;
    };
  }, []);

  // Generic input change handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let processedValue: any = value;

    if (type === "number") {
      processedValue = value === "" ? 0 : parseFloat(value);
    }

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      processedValue = target.checked;
    }

    setFormData({ ...formData, [name]: processedValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Section change handlers
  const handleActivitiesChange = (activities: any[]) => {
    setFormData({ ...formData, activities });
    if (errors.activities) setErrors({ ...errors, activities: "" });
  };

  const handleParticipantsChange = (
    participants: CreateParticipantRequest[],
  ) => {
    setFormData({ ...formData, participants });
    if (errors.participants) setErrors({ ...errors, participants: "" });
  };

  const handleAccommodationsChange = (
    accommodations: CreateAccommodationRequest[],
  ) => {
    setFormData({ ...formData, accommodations });
  };

  const handleTransportationChange = (
    transportations: CreateTransportationRequest[],
  ) => {
    setFormData({ ...formData, transportations });
  };

  const handleDocumentsChange = (documents: CreateDocumentRequest[]) => {
    setFormData({ ...formData, documents });
  };

  const handleInsuranceChange = (insurance: CreateBookingInsuranceRequest) => {
    setFormData({ ...formData, bookingInsurance: insurance });
  };

  const handleItineraryChange = (
    itineraries: CreateBookingItineraryRequest[],
  ) => {
    setFormData({ ...formData, bookingItineraries: itineraries });
  };

  const handleNotesChange = (notes: CreateBookingNoteRequest[]) => {
    setFormData({ ...formData, bookingNotes: notes });
  };

  const handlePriceBreakdownChange = (
    priceBreakDowns: CreatePriceBreakDownRequest[],
  ) => {
    setFormData({ ...formData, priceBreakDowns });
  };

  const handleInvoiceChange = (invoice: CreateBookingInvoiceRequest) => {
    setFormData({ ...formData, bookingInvoice: invoice });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) newErrors.customerId = "Customer is required";
    if (!formData.tourId) newErrors.tourId = "Tour is required";
    if (!formData.bookingDate)
      newErrors.bookingDate = "Booking date is required";
    if (!formData.travelStartDate)
      newErrors.travelStartDate = "Travel start date is required";
    if (!formData.travelEndDate)
      newErrors.travelEndDate = "Travel end date is required";
    if (!formData.totalPersons || formData.totalPersons < 1)
      newErrors.totalPersons = "At least 1 person is required";
    if (formData.activities.length === 0)
      newErrors.activities = "At least one activity is required";
    if (formData.participants.length === 0)
      newErrors.participants = "At least one participant is required";

    if (formData.travelStartDate && formData.travelEndDate) {
      if (
        new Date(formData.travelStartDate) > new Date(formData.travelEndDate)
      ) {
        newErrors.travelEndDate = "Travel end date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitBooking = async () => {
    setLoading(true);
    try {
      const response = await BookingService.createBooking(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Booking Created Successfully!",
          message: `Booking has been created.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to create booking");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
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
      if (firstError)
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleConfirmCreate = async () => {
    await submitBooking();
  };

  const handleReset = () => {
    setFormData({
      customerId: 0,
      tourId: 0,
      packageId: 0,
      packageScheduleId: null,
      bookingDate: "",
      travelStartDate: "",
      travelEndDate: "",
      totalPersons: 1,
      totalAmount: 0,
      discountAmount: 0,
      taxAmount: 0,
      insuranceAmount: 0,
      finalAmount: 0,
      insuranceRequired: false,
      bookingStatusId: 0,
      specialRequirements: "",
      dietaryRestrictions: "",
      assignTo: 0,
      assignMessage: "",
      participants: [],
      accommodations: [],
      transportations: [],
      activities: [],
      documents: [],
      bookingInsurance: {
        insuranceProvider: "",
        policyNumber: "",
        coverageType: "",
        coverageDetails: "",
        premiumAmount: 0,
        policyStartDate: "",
        policyEndDate: "",
        status: 1,
      },
      bookingItineraries: [],
      bookingNotes: [],
      priceBreakDowns: [],
      bookingInvoice: {
        dueDate: "",
        subTotal: 0,
        taxAmount: 0,
        totalAmount: 0,
        discountAmount: 0,
        insuranceAmount: 0,
        amountPaid: 0,
        balanceDue: 0,
        billingFullName: "",
        billingAddress: "",
        billingEmail: "",
        billingPhone: "",
        status: 1,
      },
    });
    setErrors({});
    setBookingParams(null);
    lastFetchedTourIdRef.current = null;
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  if (loadingParams) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: theme.primary }}
          />
          <p style={{ color: theme.textSecondary }}>
            Loading booking parameters...
          </p>
        </div>
      </div>
    );
  }

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
            title="Add New Booking"
            description="Create a new booking"
            breadcrumbItems={TOUR_BOOKING_ADD_BREADCRUMB_DATA}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Tour Selector */}
            <TourSelector
              selectedTourId={formData.tourId}
              onTourSelect={handleTourSelect}
              onTourClear={handleTourClear}
              error={errors.tourId}
              required
            />

            {bookingParams && (
              <>
                {/* Basic Information */}
                <BookingBasicInfo
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                  customers={bookingParams.customerList || []}
                  bookingStatuses={bookingParams.bookingStatuses || []}
                  employees={bookingParams.assignEmployeeList || []}
                />

                {/* Participants */}
                <BookingParticipants
                  participants={formData.participants}
                  onParticipantsChange={handleParticipantsChange}
                  genders={bookingParams.genders || []}
                  countries={bookingParams.countries || []}
                  errors={errors}
                />

                {/* Activities */}
                <BookingActivitySelector
                  activities={bookingParams.activityList || []}
                  activitySchedules={bookingParams.activityScheduleList || []}
                  selectedActivities={formData.activities}
                  onActivitiesChange={handleActivitiesChange}
                  errors={errors}
                />

                {/* Accommodations */}
                <BookingAccommodations
                  accommodations={formData.accommodations}
                  onAccommodationsChange={handleAccommodationsChange}
                  hotels={bookingParams.hotelList || []}
                  roomTypes={bookingParams.roomTypes || []}
                />

                {/* Transportation */}
                <BookingTransportation
                  transportations={formData.transportations}
                  onTransportationChange={handleTransportationChange}
                  vehicles={bookingParams.vehicleList || []}
                  transportTypes={bookingParams.transportTypes || []}
                />

                {/* Pricing */}
                <BookingPricing
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                />

                {/* Price Breakdown */}
                <BookingPriceBreakdown
                  priceBreakDowns={formData.priceBreakDowns}
                  onPriceBreakdownChange={handlePriceBreakdownChange}
                  priceBreakdownTypes={bookingParams.priceBreakDownType || []}
                />

                {/* Insurance */}
                <BookingInsurance
                  insurance={formData.bookingInsurance}
                  onInsuranceChange={handleInsuranceChange}
                  insuranceProviders={bookingParams.insuranceProviders || []}
                  coverageTypes={bookingParams.coverageType || []}
                />

                {/* Itinerary */}
                <BookingItinerary
                  itineraries={formData.bookingItineraries}
                  onItineraryChange={handleItineraryChange}
                  includedMeals={bookingParams.includedMeals || []}
                />

                {/* Notes */}
                <BookingNotes
                  notes={formData.bookingNotes}
                  onNotesChange={handleNotesChange}
                  noteTypes={bookingParams.noteTypes || []}
                />

                {/* Documents */}
                <BookingDocuments
                  documents={formData.documents}
                  onDocumentsChange={handleDocumentsChange}
                  documentTypes={bookingParams.documentTypes || []}
                  mimeTypes={bookingParams.mimeTypes || []}
                />

                {/* Invoice */}
                <BookingInvoice
                  invoice={formData.bookingInvoice}
                  onInvoiceChange={handleInvoiceChange}
                  totalAmount={formData.totalAmount}
                  discountAmount={formData.discountAmount}
                  taxAmount={formData.taxAmount}
                  insuranceAmount={formData.insuranceAmount}
                />

                {/* Form Actions */}
                <FormActions
                  loading={loading}
                  uploadingImages={false}
                  onSubmit={handleCreateClick}
                  onReset={handleReset}
                  errors={errors}
                  submitText="Booking"
                  submitButtonType="button"
                />
              </>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-8">
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
                  Booking Summary
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Tour
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: formData.tourId ? theme.text : theme.textSecondary,
                    }}
                  >
                    {formData.tourId
                      ? `Tour ID: ${formData.tourId}`
                      : "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Total Persons
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: formData.totalPersons
                        ? theme.text
                        : theme.textSecondary,
                    }}
                  >
                    {formData.totalPersons || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Participants
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color:
                        formData.participants.length > 0
                          ? theme.text
                          : theme.textSecondary,
                    }}
                  >
                    {formData.participants.length > 0
                      ? `${formData.participants.length} participant(s)`
                      : "None"}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Activities
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color:
                        formData.activities.length > 0
                          ? theme.text
                          : theme.textSecondary,
                    }}
                  >
                    {formData.activities.length > 0
                      ? `${formData.activities.length} activity(s)`
                      : "None"}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Accommodations
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color:
                        formData.accommodations.length > 0
                          ? theme.text
                          : theme.textSecondary,
                    }}
                  >
                    {formData.accommodations.length > 0
                      ? `${formData.accommodations.length} accommodation(s)`
                      : "None"}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Insurance
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: formData.insuranceRequired
                        ? theme.success
                        : theme.textSecondary,
                    }}
                  >
                    {formData.insuranceRequired ? "Required" : "Not required"}
                  </p>
                </div>
                <div
                  className="pt-3 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Final Amount
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{
                      color:
                        formData.finalAmount > 0
                          ? theme.success
                          : theme.textSecondary,
                    }}
                  >
                    {formData.finalAmount > 0
                      ? `$${formData.finalAmount.toFixed(2)}`
                      : "Not set"}
                  </p>
                </div>
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
          title: "Create New Booking",
          message: "Are you sure you want to create this booking?",
          itemName: `Booking for Tour #${formData.tourId}`,
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: [
            "Verify that all activity details are correct",
            "Ensure pricing is accurate",
            "Check that travel dates are correct",
            "You can edit this booking anytime after creation",
          ],
        }}
        confirmText="Create Booking"
        cancelText="Cancel"
        onError={(error) => {
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message:
              error.message || "Failed to create booking. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default AddNewBookingPage;
