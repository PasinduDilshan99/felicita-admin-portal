"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookingService } from "@/services/bookingService";
import {
  BookingIdAndReference,
  BookingAllDetails,
  UpdateBookingRequest,
  UpdateParticipantRequest,
  UpdateAccommodationRequest,
  UpdateTransportationRequest,
  UpdateBookingActivityRequest,
  UpdateDocumentRequest,
  UpdateBookingInsuranceRequest,
  UpdateBookingItineraryRequest,
  UpdateBookingNoteRequest,
  UpdatePriceBreakDownRequest,
  UpdateBookingInvoiceRequest,
  CreateParticipantRequest,
  CreateAccommodationRequest,
  CreateTransportationRequest,
  CreateBookingActivityRequest,
  CreateDocumentRequest,
  CreateBookingInsuranceRequest,
  CreateBookingItineraryRequest,
  CreateBookingNoteRequest,
  CreatePriceBreakDownRequest,
  CreateBookingInvoiceRequest,
  CreateBookingParams,
  Participant,
  Accommodation,
  Transportation,
  BookingActivity,
  BookingDocument,
  BookingInsurance,
  BookingItinerary,
  BookingNote,
  PriceBreakDown,
  BookingInvoice,
} from "@/types/booking-types";
import { Search, Edit, Save, RefreshCw, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  UpdateConfirmationModal,
  ChangedField,
} from "@/components/common-components/UpdateConfirmationModal";
import { hexToRgba } from "@/utils/functions";
import { BookingBasicInfoForm } from "@/components/bookings-components/update-booking-components/BookingBasicInfoForm";
import { BookingCustomerTourPackageForm } from "@/components/bookings-components/update-booking-components/BookingCustomerTourPackageForm";
import { BookingParticipantsForm } from "@/components/bookings-components/update-booking-components/BookingParticipantsForm";
import { BookingAccommodationsForm } from "@/components/bookings-components/update-booking-components/BookingAccommodationsForm";
import { BookingTransportationsForm } from "@/components/bookings-components/update-booking-components/BookingTransportationsForm";
import { BookingActivitiesForm } from "@/components/bookings-components/update-booking-components/BookingActivitiesForm";
import { BookingDocumentsForm } from "@/components/bookings-components/update-booking-components/BookingDocumentsForm";
import { BookingInsuranceForm } from "@/components/bookings-components/update-booking-components/BookingInsuranceForm";
import { BookingItinerariesForm } from "@/components/bookings-components/update-booking-components/BookingItinerariesForm";
import { BookingNotesForm } from "@/components/bookings-components/update-booking-components/BookingNotesForm";
import { BookingPriceBreakdownForm } from "@/components/bookings-components/update-booking-components/BookingPriceBreakdownForm";
import { BookingInvoiceForm } from "@/components/bookings-components/update-booking-components/BookingInvoiceForm";
import { TOUR_BOOKINGS_DETAILS_VIEW_URL } from "@/utils/urls";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_BOOKING_UPDATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Booking is active",
    color: "#059669",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Booking is inactive",
    color: "#6b7280",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    description: "Booking is cancelled",
    color: "#ef4444",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    description: "Booking is completed",
    color: "#3b82f6",
  },
];

const UpdateBookingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  const initialBookingReference = searchParams?.get("booking-reference") || "";
  const initialBookingId = searchParams?.get("booking-id") || "";

  // State for bookings list
  const [bookings, setBookings] = useState<BookingIdAndReference[]>([]);

  // State for create booking params (dropdown data)
  const [bookingParams, setBookingParams] =
    useState<CreateBookingParams | null>(null);
  const [loadingParams, setLoadingParams] = useState(false);

  // State for selected booking
  const [selectedBooking, setSelectedBooking] =
    useState<BookingIdAndReference | null>(
      initialBookingId && initialBookingReference
        ? {
            bookingId: parseInt(initialBookingId),
            bookingReference: initialBookingReference,
          }
        : null,
    );

  // State for original booking details
  const [originalBooking, setOriginalBooking] =
    useState<BookingAllDetails | null>(null);

  // State for edited booking
  const [editedBooking, setEditedBooking] = useState<BookingAllDetails | null>(
    null,
  );

  // State for tracking changes
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);
  const [customerTourPackageChanged, setCustomerTourPackageChanged] =
    useState(false);

  // State for removed items
  const [removedParticipants, setRemovedParticipants] = useState<number[]>([]);
  const [removedAccommodations, setRemovedAccommodations] = useState<number[]>(
    [],
  );
  const [removedTransportations, setRemovedTransportations] = useState<
    number[]
  >([]);
  const [removedActivities, setRemovedActivities] = useState<number[]>([]);
  const [removedDocuments, setRemovedDocuments] = useState<number[]>([]);
  const [removedItineraries, setRemovedItineraries] = useState<number[]>([]);
  const [removedNotes, setRemovedNotes] = useState<number[]>([]);
  const [removedPriceBreakdowns, setRemovedPriceBreakdowns] = useState<
    number[]
  >([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([
      "basic",
      "customer-tour",
      "participants",
      "accommodations",
      "transportations",
      "activities",
      "documents",
      "insurance",
      "itineraries",
      "notes",
      "price-breakdown",
      "invoice",
    ]),
  );

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
    (booking: BookingIdAndReference | null) => {
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

  // Fetch booking params
  useEffect(() => {
    fetchBookingParams();
  }, []);

  // If initialBookingId is provided, fetch details
  useEffect(() => {
    if (initialBookingId && !originalBooking && !loadingDetails) {
      handleSelectBooking(parseInt(initialBookingId), initialBookingReference);
    }
  }, [initialBookingId, initialBookingReference]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookingService.getBookingIdAndReferences();
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

  const fetchBookingParams = async () => {
    setLoadingParams(true);
    try {
      // We need a default tour ID - in practice, you'd get this from context or selection
      // For now, we'll fetch with a default or handle when tour is selected
      const response = await BookingService.getCreateBookingParams(1);
      setBookingParams(response.data);
    } catch (err: any) {
      console.error("Failed to fetch booking params:", err);
    } finally {
      setLoadingParams(false);
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
    setOriginalBooking(null);
    setEditedBooking(null);
    setBasicDetailsChanged(false);
    setCustomerTourPackageChanged(false);
    setRemovedParticipants([]);
    setRemovedAccommodations([]);
    setRemovedTransportations([]);
    setRemovedActivities([]);
    setRemovedDocuments([]);
    setRemovedItineraries([]);
    setRemovedNotes([]);
    setRemovedPriceBreakdowns([]);

    try {
      const response = await BookingService.getBookingAllDetails(id);
      const bookingData = response.data;
      setOriginalBooking(bookingData);
      setEditedBooking(bookingData);
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

  // Handle basic field changes
  const handleBasicFieldChange = (field: string, value: any) => {
    if (!editedBooking) return;
    setBasicDetailsChanged(true);
    setEditedBooking({
      ...editedBooking,
      bookingInformation: {
        ...editedBooking.bookingInformation,
        [field]: value,
      },
    });
  };

  // Handle customer/tour/package changes
  const handleCustomerTourPackageChange = (field: string, value: any) => {
    if (!editedBooking) return;
    setCustomerTourPackageChanged(true);
    setEditedBooking({
      ...editedBooking,
      [field]: value,
    });
  };

  // Handle participant changes
  const handleAddParticipant = (participant: CreateParticipantRequest) => {
    // Add to edited booking
    if (editedBooking) {
      const tempParticipant: Participant = {
        participantId: Date.now(),
        firstName: participant.firstName,
        lastName: participant.lastName,
        fullName: `${participant.firstName} ${participant.lastName}`,
        dateOfBirth: participant.dateOfBirth,
        gender: "",
        nationality: "",
        passportNumber: participant.passportNumber,
        email: participant.email,
        mobileNumber: participant.mobileNumber,
        emergencyContactName: participant.emergencyContactName,
        emergencyContactPhone: participant.emergencyContactPhone,
        emergencyContactRelationship: participant.emergencyContactRelationship,
        medicalConditions: participant.medicalConditions,
        allergies: participant.allergies,
        specialAssistanceRequired: participant.specialAssistanceRequired,
        assistanceDetails: participant.assistanceDetails,
      };
      setEditedBooking({
        ...editedBooking,
        participants: [...editedBooking.participants, tempParticipant],
      });
    }
  };

  const handleRemoveParticipant = (participantId: number) => {
    setRemovedParticipants((prev) => [...prev, participantId]);
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: prev.participants.filter(
          (p) => p.participantId !== participantId,
        ),
      };
    });
  };

  const handleUpdateParticipant = (participant: UpdateParticipantRequest) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: prev.participants.map((p) =>
          p.participantId === participant.participantId
            ? {
                ...p,
                firstName: participant.firstName,
                lastName: participant.lastName,
                fullName: `${participant.firstName} ${participant.lastName}`,
                dateOfBirth: participant.dateOfBirth,
                passportNumber: participant.passportNumber,
                email: participant.email,
                mobileNumber: participant.mobileNumber,
                emergencyContactName: participant.emergencyContactName,
                emergencyContactPhone: participant.emergencyContactPhone,
                emergencyContactRelationship:
                  participant.emergencyContactRelationship,
                medicalConditions: participant.medicalConditions,
                allergies: participant.allergies,
                specialAssistanceRequired:
                  participant.specialAssistanceRequired,
                assistanceDetails: participant.assistanceDetails,
              }
            : p,
        ),
      };
    });
  };

  // Handle accommodation changes
  const handleAddAccommodation = (
    accommodation: CreateAccommodationRequest,
  ) => {
    if (editedBooking) {
      const tempAccommodation: Accommodation = {
        accommodationId: Date.now(),
        hotelName: "",
        roomType: accommodation.roomType,
        roomNumber: accommodation.roomNumber,
        confirmationNumber: accommodation.confirmationNumber,
        checkInDate: accommodation.checkInDate,
        checkOutDate: accommodation.checkOutDate,
      };
      setEditedBooking({
        ...editedBooking,
        accommodations: [...editedBooking.accommodations, tempAccommodation],
      });
    }
  };

  const handleRemoveAccommodation = (accommodationId: number) => {
    setRemovedAccommodations((prev) => [...prev, accommodationId]);
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        accommodations: prev.accommodations.filter(
          (a) => a.accommodationId !== accommodationId,
        ),
      };
    });
  };

  const handleUpdateAccommodation = (
    accommodation: UpdateAccommodationRequest,
  ) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        accommodations: prev.accommodations.map((a) =>
          a.accommodationId === accommodation.accommodationId
            ? {
                ...a,
                checkInDate: accommodation.checkInDate,
                checkOutDate: accommodation.checkOutDate,
                roomType: accommodation.roomType,
                roomNumber: accommodation.roomNumber,
                confirmationNumber: accommodation.confirmationNumber,
              }
            : a,
        ),
      };
    });
  };

  // Handle transportation changes
  const handleAddTransportation = (
    transportation: CreateTransportationRequest,
  ) => {
    if (editedBooking) {
      const tempTransportation: Transportation = {
        transportationId: Date.now(),
        transportType: transportation.transportType,
        departureDate: transportation.departureDate,
        departureTime: transportation.departureTime,
        arrivalDate: transportation.arrivalDate,
        arrivalTime: transportation.arrivalTime,
        departureLocation: transportation.departureLocation,
        arrivalLocation: transportation.arrivalLocation,
        carrierName: transportation.carrierName,
        referenceNumber: transportation.referenceNumber,
        seatNumbers: transportation.seatNumbers,
        vehicleNumber: "",
      };
      setEditedBooking({
        ...editedBooking,
        transportations: [...editedBooking.transportations, tempTransportation],
      });
    }
  };

  const handleRemoveTransportation = (transportationId: number) => {
    setRemovedTransportations((prev) => [...prev, transportationId]);
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        transportations: prev.transportations.filter(
          (t) => t.transportationId !== transportationId,
        ),
      };
    });
  };

  const handleUpdateTransportation = (
    transportation: UpdateTransportationRequest,
  ) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        transportations: prev.transportations.map((t) =>
          t.transportationId === transportation.transportationId
            ? {
                ...t,
                transportType: transportation.transportType,
                departureDate: transportation.departureDate,
                departureTime: transportation.departureTime,
                arrivalDate: transportation.arrivalDate,
                arrivalTime: transportation.arrivalTime,
                departureLocation: transportation.departureLocation,
                arrivalLocation: transportation.arrivalLocation,
                carrierName: transportation.carrierName,
                referenceNumber: transportation.referenceNumber,
                seatNumbers: transportation.seatNumbers,
              }
            : t,
        ),
      };
    });
  };

  // Handle activity changes
  const handleAddActivity = (activity: CreateBookingActivityRequest) => {
    if (editedBooking) {
      const tempActivity: BookingActivity = {
        bookingActivityId: Date.now(),
        activityId: activity.activityId,
        activityName: "",
        activityDate: activity.activityDate,
        startTime: activity.startTime,
        endTime: activity.endTime,
        numberOfParticipants: activity.numberOfParticipants,
        pricePerPerson: activity.pricePerPerson,
        totalPrice: activity.totalPrice,
        status: "ACTIVE",
      };
      setEditedBooking({
        ...editedBooking,
        activities: [...editedBooking.activities, tempActivity],
      });
    }
  };

  const handleRemoveActivity = (activityId: number) => {
    setRemovedActivities((prev) => [...prev, activityId]);
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activities: prev.activities.filter(
          (a) => a.bookingActivityId !== activityId,
        ),
      };
    });
  };

  const handleUpdateActivity = (activity: UpdateBookingActivityRequest) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activities: prev.activities.map((a) =>
          a.bookingActivityId === activity.bookingActivityId
            ? {
                ...a,
                activityDate: activity.activityDate,
                startTime: activity.startTime,
                endTime: activity.endTime,
                numberOfParticipants: activity.numberOfParticipants,
                pricePerPerson: activity.pricePerPerson,
                totalPrice: activity.totalPrice,
              }
            : a,
        ),
      };
    });
  };

  // Handle document changes
  const handleAddDocument = (document: CreateDocumentRequest) => {
    if (editedBooking) {
      const tempDocument: BookingDocument = {
        documentId: Date.now(),
        documentName: document.documentName,
        documentType: document.documentType,
        documentUrl: document.documentUrl,
        fileSize: document.fileSize,
        mimiType: document.mimiType,
        status: "ACTIVE",
      };
      setEditedBooking({
        ...editedBooking,
        documents: [...editedBooking.documents, tempDocument],
      });
    }
  };

  const handleRemoveDocument = (documentId: number) => {
    setRemovedDocuments((prev) => [...prev, documentId]);
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        documents: prev.documents.filter((d) => d.documentId !== documentId),
      };
    });
  };

  const handleUpdateDocument = (document: UpdateDocumentRequest) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        documents: prev.documents.map((d) =>
          d.documentId === document.documentId
            ? {
                ...d,
                documentName: document.documentName,
                documentType: document.documentType,
                documentUrl: document.documentUrl,
                fileSize: document.fileSize,
                mimiType: document.mimiType,
              }
            : d,
        ),
      };
    });
  };

  // Handle insurance changes
  const handleUpdateInsurance = (insurance: UpdateBookingInsuranceRequest) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bookingInsurance: {
          ...prev.bookingInsurance,
          insuranceProvider: insurance.insuranceProvider,
          policyNumber: insurance.policyNumber,
          coverageType: insurance.coverageType,
          coverageDetails: insurance.coverageDetails,
          premiumAmount: insurance.premiumAmount,
          policyStartDate: insurance.policyStartDate,
          policyEndDate: insurance.policyEndDate,
        },
      };
    });
  };

  // Handle itinerary changes
  const handleAddItinerary = (itinerary: CreateBookingItineraryRequest) => {
    if (editedBooking) {
      const tempItinerary: BookingItinerary = {
        itineraryId: Date.now(),
        dayNumber: itinerary.dayNumber,
        itineraryDate: itinerary.itineraryDate,
        title: itinerary.title,
        description: itinerary.description,
        startTime: itinerary.startTime,
        endTime: itinerary.endTime,
        location: itinerary.location,
        includedMeals: itinerary.includedMeals,
        status: "ACTIVE",
      };
      setEditedBooking({
        ...editedBooking,
        bookingItineraries: [
          ...editedBooking.bookingItineraries,
          tempItinerary,
        ],
      });
    }
  };

  const handleRemoveItinerary = (itineraryId: number) => {
    setRemovedItineraries((prev) => [...prev, itineraryId]);
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bookingItineraries: prev.bookingItineraries.filter(
          (i) => i.itineraryId !== itineraryId,
        ),
      };
    });
  };

  const handleUpdateItinerary = (itinerary: UpdateBookingItineraryRequest) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bookingItineraries: prev.bookingItineraries.map((i) =>
          i.itineraryId === itinerary.itineraryId
            ? {
                ...i,
                dayNumber: itinerary.dayNumber,
                itineraryDate: itinerary.itineraryDate,
                title: itinerary.title,
                description: itinerary.description,
                startTime: itinerary.startTime,
                endTime: itinerary.endTime,
                location: itinerary.location,
                includedMeals: itinerary.includedMeals,
              }
            : i,
        ),
      };
    });
  };

  // Handle note changes
  const handleAddNote = (note: CreateBookingNoteRequest) => {
    if (editedBooking) {
      const tempNote: BookingNote = {
        noteId: Date.now(),
        noteType: note.noteType,
        noteText: note.noteText,
        isImportant: note.isImportant,
        followUpDate: note.followUpDate,
        followUpComplete: note.followUpComplete,
        status: "ACTIVE",
      };
      setEditedBooking({
        ...editedBooking,
        bookingNotes: [...editedBooking.bookingNotes, tempNote],
      });
    }
  };

  const handleRemoveNote = (noteId: number) => {
    setRemovedNotes((prev) => [...prev, noteId]);
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bookingNotes: prev.bookingNotes.filter((n) => n.noteId !== noteId),
      };
    });
  };

  const handleUpdateNote = (note: UpdateBookingNoteRequest) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bookingNotes: prev.bookingNotes.map((n) =>
          n.noteId === note.noteId
            ? {
                ...n,
                noteType: note.noteType,
                noteText: note.noteText,
                isImportant: note.isImportant,
                followUpDate: note.followUpDate,
                followUpComplete: note.followUpComplete,
              }
            : n,
        ),
      };
    });
  };

  // Handle price breakdown changes
  const handleAddPriceBreakdown = (item: CreatePriceBreakDownRequest) => {
    if (editedBooking) {
      const tempItem: PriceBreakDown = {
        priceBreakDownId: Date.now(),
        itemType: item.itemType,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        status: "ACTIVE",
      };
      setEditedBooking({
        ...editedBooking,
        priceBreakDowns: [...editedBooking.priceBreakDowns, tempItem],
      });
    }
  };

  const handleRemovePriceBreakdown = (itemId: number) => {
    setRemovedPriceBreakdowns((prev) => [...prev, itemId]);
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        priceBreakDowns: prev.priceBreakDowns.filter(
          (p) => p.priceBreakDownId !== itemId,
        ),
      };
    });
  };

  const handleUpdatePriceBreakdown = (item: UpdatePriceBreakDownRequest) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        priceBreakDowns: prev.priceBreakDowns.map((p) =>
          p.priceBreakDownId === item.priceBreakDownId
            ? {
                ...p,
                itemType: item.itemType,
                itemName: item.itemName,
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              }
            : p,
        ),
      };
    });
  };

  // Handle invoice changes
  const handleUpdateInvoice = (invoice: UpdateBookingInvoiceRequest) => {
    setEditedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bookingInvoice: {
          ...prev.bookingInvoice,
          dueDate: invoice.dueDate,
          subTotal: invoice.subTotal,
          taxAmount: invoice.taxAmount,
          totalAmount: invoice.totalAmount,
          discountAmount: invoice.discountAmount,
          insuranceAmount: invoice.insuranceAmount,
          amountPaid: invoice.amountPaid,
          balanceDue: invoice.balanceDue,
          billingFullName: invoice.billingFullName,
          billingAddress: invoice.billingAddress,
          billingEmail: invoice.billingEmail,
          billingPhone: invoice.billingPhone,
        },
      };
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return (
      basicDetailsChanged ||
      customerTourPackageChanged ||
      removedParticipants.length > 0 ||
      removedAccommodations.length > 0 ||
      removedTransportations.length > 0 ||
      removedActivities.length > 0 ||
      removedDocuments.length > 0 ||
      removedItineraries.length > 0 ||
      removedNotes.length > 0 ||
      removedPriceBreakdowns.length > 0
    );
  }, [
    basicDetailsChanged,
    customerTourPackageChanged,
    removedParticipants,
    removedAccommodations,
    removedTransportations,
    removedActivities,
    removedDocuments,
    removedItineraries,
    removedNotes,
    removedPriceBreakdowns,
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdateBookingRequest | null => {
    if (!editedBooking || !selectedBooking) return null;

    const bookingInfo = editedBooking.bookingInformation;
    const customerInfo = editedBooking.customerInformation;
    const tourInfo = editedBooking.tourInformation;
    const packageInfo = editedBooking.packageInformation;
    const statusInfo = editedBooking.bookingStatusInformation;

    return {
      bookingId: selectedBooking.bookingId,
      customerId: customerInfo.userId,
      tourId: tourInfo.tourId,
      packageId: packageInfo.packageId,
      packageScheduleId: null,
      bookingDate: bookingInfo.bookingDate,
      travelStartDate: bookingInfo.travelStartDate,
      travelEndDate: bookingInfo.travelEndDate,
      totalPersons: bookingInfo.totalPersons,
      totalAmount: bookingInfo.totalAmount,
      discountAmount: bookingInfo.discountAmount,
      taxAmount: bookingInfo.taxAmount,
      insuranceAmount: bookingInfo.insuranceAmount,
      finalAmount: bookingInfo.finalAmount,
      insuranceRequired: bookingInfo.insuranceRequired,
      bookingStatusId: statusInfo.bookingStatusId,
      specialRequirements: bookingInfo.specialRequirements,
      dietaryRestrictions: bookingInfo.dietaryRestrictions,
      assignTo: editedBooking.assignmentInformation?.employeeId || 0,
      assignMessage: editedBooking.assignmentInformation?.assignMessage || "",
      addParticipants: [],
      removeParticipants: removedParticipants,
      updateParticipants: [],
      addAccommodations: [],
      removeAccommodations: removedAccommodations,
      updateAccommodations: [],
      addTransportations: [],
      removeTransportations: removedTransportations,
      updateTransportations: [],
      addActivities: [],
      removeActivities: removedActivities,
      updateActivities: [],
      addDocuments: [],
      removeDocuments: removedDocuments,
      updateDocuments: [],
      addBookingInsurance: null,
      removeBookingInsurance: null,
      updateBookingInsurance: null,
      addBookingItineraries: [],
      removeBookingItineraries: removedItineraries,
      updateBookingItineraries: [],
      addBookingNotes: [],
      removeBookingNotes: removedNotes,
      updateBookingNotes: [],
      addPriceBreakDowns: [],
      removePriceBreakDowns: removedPriceBreakdowns,
      updatePriceBreakDowns: [],
      addBookingInvoice: null,
      removeBookingInvoice: null,
      updateBookingInvoice: null,
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
      const response = await BookingService.updateBooking(updateData);

      setSuccess(
        `Booking "${editedBooking?.bookingInformation.bookingReference}" updated successfully!`,
      );

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedBooking?.bookingInformation.bookingReference} has been updated successfully.`,
        actionLink: `${TOUR_BOOKINGS_DETAILS_VIEW_URL}/${selectedBooking?.bookingId}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedBooking) {
          fetchBookingDetails(selectedBooking.bookingId);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update booking");
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update booking. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalBooking) {
      setEditedBooking(originalBooking);
      setBasicDetailsChanged(false);
      setCustomerTourPackageChanged(false);
      setRemovedParticipants([]);
      setRemovedAccommodations([]);
      setRemovedTransportations([]);
      setRemovedActivities([]);
      setRemovedDocuments([]);
      setRemovedItineraries([]);
      setRemovedNotes([]);
      setRemovedPriceBreakdowns([]);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearBookingSelection = () => {
    setSelectedBooking(null);
    setOriginalBooking(null);
    setEditedBooking(null);
    setToast(null);
    updateUrlWithSelectedBooking(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalBooking || !editedBooking) return [];

    const changes: ChangedField[] = [];

    const originalInfo = originalBooking.bookingInformation;
    const editedInfo = editedBooking.bookingInformation;

    const fields = [
      { key: "bookingDate", label: "Booking Date" },
      { key: "travelStartDate", label: "Travel Start Date" },
      { key: "travelEndDate", label: "Travel End Date" },
      { key: "totalPersons", label: "Total Persons" },
      { key: "totalAmount", label: "Total Amount" },
      { key: "discountAmount", label: "Discount Amount" },
      { key: "taxAmount", label: "Tax Amount" },
      { key: "insuranceAmount", label: "Insurance Amount" },
      { key: "finalAmount", label: "Final Amount" },
    ];

    fields.forEach(({ key, label }) => {
      const oldValue = originalInfo[key as keyof typeof originalInfo];
      const newValue = editedInfo[key as keyof typeof editedInfo];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    if (
      originalBooking.bookingStatusInformation.bookingStatusName !==
      editedBooking.bookingStatusInformation.bookingStatusName
    ) {
      changes.push({
        field: "Booking Status",
        oldValue: originalBooking.bookingStatusInformation.bookingStatusName,
        newValue: editedBooking.bookingStatusInformation.bookingStatusName,
      });
    }

    if (removedParticipants.length > 0) {
      changes.push({
        field: "Participants Removed",
        oldValue: originalBooking.participants.length,
        newValue: editedBooking.participants.length,
      });
    }

    if (removedAccommodations.length > 0) {
      changes.push({
        field: "Accommodations Removed",
        oldValue: originalBooking.accommodations.length,
        newValue: editedBooking.accommodations.length,
      });
    }

    if (removedTransportations.length > 0) {
      changes.push({
        field: "Transportations Removed",
        oldValue: originalBooking.transportations.length,
        newValue: editedBooking.transportations.length,
      });
    }

    if (removedActivities.length > 0) {
      changes.push({
        field: "Activities Removed",
        oldValue: originalBooking.activities.length,
        newValue: editedBooking.activities.length,
      });
    }

    if (removedDocuments.length > 0) {
      changes.push({
        field: "Documents Removed",
        oldValue: originalBooking.documents.length,
        newValue: editedBooking.documents.length,
      });
    }

    if (removedItineraries.length > 0) {
      changes.push({
        field: "Itineraries Removed",
        oldValue: originalBooking.bookingItineraries.length,
        newValue: editedBooking.bookingItineraries.length,
      });
    }

    if (removedNotes.length > 0) {
      changes.push({
        field: "Notes Removed",
        oldValue: originalBooking.bookingNotes.length,
        newValue: editedBooking.bookingNotes.length,
      });
    }

    if (removedPriceBreakdowns.length > 0) {
      changes.push({
        field: "Price Breakdown Items Removed",
        oldValue: originalBooking.priceBreakDowns.length,
        newValue: editedBooking.priceBreakDowns.length,
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

  // Show loading state
  if (loading || loadingParams) {
    return (
      <CommonLoading
        message="Loading booking data..."
        subMessage="Please wait while we fetch available bookings"
        size="lg"
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
            title="Update Booking"
            description="Edit and update existing booking information"
            breadcrumbItems={TOUR_BOOKING_UPDATE_BREADCRUMB_DATA}
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
              Select Booking to Update
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
        {editedBooking && selectedBooking && bookingParams && (
          <div className="space-y-6">
            <BookingBasicInfoForm
              booking={editedBooking}
              onFieldChange={handleBasicFieldChange}
              statusOptions={STATUS_OPTIONS}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
              formatPrice={formatPrice}
            />

            <BookingCustomerTourPackageForm
              booking={editedBooking}
              bookingParams={bookingParams}
              onFieldChange={handleCustomerTourPackageChange}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            <BookingParticipantsForm
              participants={editedBooking.participants}
              removedParticipants={removedParticipants}
              bookingParams={bookingParams}
              onAddParticipant={handleAddParticipant}
              onRemoveParticipant={handleRemoveParticipant}
              onUpdateParticipant={handleUpdateParticipant}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            <BookingAccommodationsForm
              accommodations={editedBooking.accommodations}
              removedAccommodations={removedAccommodations}
              bookingParams={bookingParams}
              onAddAccommodation={handleAddAccommodation}
              onRemoveAccommodation={handleRemoveAccommodation}
              onUpdateAccommodation={handleUpdateAccommodation}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            <BookingTransportationsForm
              transportations={editedBooking.transportations}
              removedTransportations={removedTransportations}
              bookingParams={bookingParams}
              onAddTransportation={handleAddTransportation}
              onRemoveTransportation={handleRemoveTransportation}
              onUpdateTransportation={handleUpdateTransportation}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            <BookingActivitiesForm
              activities={editedBooking.activities}
              removedActivities={removedActivities}
              bookingParams={bookingParams}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              onUpdateActivity={handleUpdateActivity}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
              formatPrice={formatPrice}
            />

            <BookingDocumentsForm
              documents={editedBooking.documents}
              removedDocuments={removedDocuments}
              bookingParams={bookingParams}
              onAddDocument={handleAddDocument}
              onRemoveDocument={handleRemoveDocument}
              onUpdateDocument={handleUpdateDocument}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            <BookingInsuranceForm
              insurance={editedBooking.bookingInsurance}
              bookingParams={bookingParams}
              onUpdateInsurance={handleUpdateInsurance}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
              formatPrice={formatPrice}
            />

            <BookingItinerariesForm
              itineraries={editedBooking.bookingItineraries}
              removedItineraries={removedItineraries}
              bookingParams={bookingParams}
              onAddItinerary={handleAddItinerary}
              onRemoveItinerary={handleRemoveItinerary}
              onUpdateItinerary={handleUpdateItinerary}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            <BookingNotesForm
              notes={editedBooking.bookingNotes}
              removedNotes={removedNotes}
              bookingParams={bookingParams}
              onAddNote={handleAddNote}
              onRemoveNote={handleRemoveNote}
              onUpdateNote={handleUpdateNote}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            <BookingPriceBreakdownForm
              priceBreakdowns={editedBooking.priceBreakDowns}
              removedPriceBreakdowns={removedPriceBreakdowns}
              bookingParams={bookingParams}
              onAddPriceBreakdown={handleAddPriceBreakdown}
              onRemovePriceBreakdown={handleRemovePriceBreakdown}
              onUpdatePriceBreakdown={handleUpdatePriceBreakdown}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
              formatPrice={formatPrice}
            />

            <BookingInvoiceForm
              invoice={editedBooking.bookingInvoice}
              bookingParams={bookingParams}
              onUpdateInvoice={handleUpdateInvoice}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
              formatPrice={formatPrice}
            />
          </div>
        )}

        {/* Action Buttons */}
        {editedBooking && originalBooking && (
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
                {loadingUpdate ? "Updating..." : "Update Booking"}
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
                      Click "Update Booking" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalBooking && editedBooking && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedBooking.bookingInformation.bookingReference}
            changedFields={getChangedFields()}
            confirmText="Update Booking"
            cancelText="Cancel"
            title="Confirm Booking Update"
            message={`You are about to update booking "${editedBooking.bookingInformation.bookingReference}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateBookingPage;
