// app/web-management/bookings/cancelled/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookingService } from "@/services/bookingService";
import {
  BookingAllDetails,
  BookingIdAndReference,
} from "@/types/booking-types";
import {
  AlertTriangle,
  Search,
  Calendar,
  User,
  MapPin,
  Package,
  DollarSign,
  Users,
  AlertCircle,
  XCircle,
  Receipt,
  FileText,
  Hotel,
  Bus,
  Activity,
  Eye,
  Info,
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
import ActionButtons from "@/components/common-components/ActionButtons";

// Booking detail view components
import { BookingHeader } from "@/components/bookings-components/booking-details-view-components/BookingHeader";
import { BookingCustomerInfo } from "@/components/bookings-components/booking-details-view-components/BookingCustomerInfo";
import { BookingTourPackageInfo } from "@/components/bookings-components/booking-details-view-components/BookingTourPackageInfo";
import { BookingStatusAssignment } from "@/components/bookings-components/booking-details-view-components/BookingStatusAssignment";
import { BookingParticipants } from "@/components/bookings-components/booking-details-view-components/BookingParticipants";
import { BookingAccommodations } from "@/components/bookings-components/booking-details-view-components/BookingAccommodations";
import { BookingTransportations } from "@/components/bookings-components/booking-details-view-components/BookingTransportations";
import { BookingActivities } from "@/components/bookings-components/booking-details-view-components/BookingActivities";
import { BookingItinerary } from "@/components/bookings-components/booking-details-view-components/BookingItinerary";
import { BookingDocuments } from "@/components/bookings-components/booking-details-view-components/BookingDocuments";
import { BookingInsurance } from "@/components/bookings-components/booking-details-view-components/BookingInsurance";
import { BookingNotes } from "@/components/bookings-components/booking-details-view-components/BookingNotes";
import { BookingPriceBreakdown } from "@/components/bookings-components/booking-details-view-components/BookingPriceBreakdown";
import { BookingInvoice } from "@/components/bookings-components/booking-details-view-components/BookingInvoice";
import { BookingCancellation } from "@/components/bookings-components/booking-details-view-components/BookingCancellation";

import {
  BILLING_VIEW_PAGE_URL,
  TOUR_BOOKINGS_DETAILS_VIEW_URL,
  TOUR_BOOKINGS_VIEW_PAGE_URL,
} from "@/utils/urls";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_BOOKING_TERMINATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Type for search items
interface BookingSearchItem {
  id: number;
  name: string;
}

const CancelledBookingPage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialBookingReference = searchParams?.get("booking-reference") || "";
  const initialBookingId = searchParams?.get("booking-id") || "";

  const [bookings, setBookings] = useState<BookingIdAndReference[]>([]);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingIdAndReference | null>(
      initialBookingId && initialBookingReference
        ? {
            bookingId: parseInt(initialBookingId),
            bookingReference: initialBookingReference,
          }
        : null,
    );
  const [bookingDetails, setBookingDetails] =
    useState<BookingAllDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

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

  const fetchBookingDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setBookingDetails(null);
    try {
      const response = await BookingService.getBookingAllDetails(id);
      setBookingDetails(response.data);
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

  const handleSelectBooking = async (id: number, reference: string) => {
    setSelectedBooking({ bookingId: id, bookingReference: reference });
    await fetchBookingDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("booking-id", id.toString());
    url.searchParams.set("booking-reference", reference);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearBookingSelection = () => {
    setSelectedBooking(null);
    setBookingDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("booking-id");
    url.searchParams.delete("booking-reference");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedBooking) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedBooking) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await BookingService.terminateBooking(selectedBooking.bookingId);

      setSuccess("Booking terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `Booking "${selectedBooking.bookingReference}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearBookingSelection();
        fetchBookings();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate booking");
      setToast({
        type: "error",
        title: "Termination Failed",
        message:
          err.message || "Failed to terminate booking. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(TOUR_BOOKINGS_VIEW_PAGE_URL);
    }
  };

  const handleRetry = () => {
    if (selectedBooking) {
      fetchBookingDetails(selectedBooking.bookingId);
    } else {
      fetchBookings();
    }
  };

  const handleViewBilling = () => {
    if (selectedBooking) {
      router.push(`${BILLING_VIEW_PAGE_URL}/${selectedBooking.bookingId}`);
    }
  };

  // Convert bookings to search items format
  const searchItems: BookingSearchItem[] = bookings.map((booking) => ({
    id: booking.bookingId,
    name: `${booking.bookingReference} (ID: ${booking.bookingId})`,
  }));

  const selectedSearchItem: BookingSearchItem | null = selectedBooking
    ? {
        id: selectedBooking.bookingId,
        name: `${selectedBooking.bookingReference} (ID: ${selectedBooking.bookingId})`,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedBooking
    ? {
        id: selectedBooking.bookingId,
        name: selectedBooking.bookingReference,
        type: "custom",
        additionalInfo: "Booking",
      }
    : null;

  useEffect(() => {
    if (!selectedBooking) {
      fetchBookings();
    }
  }, []);

  useEffect(() => {
    if (initialBookingId && !bookingDetails) {
      handleSelectBooking(parseInt(initialBookingId), initialBookingReference);
    }
  }, [initialBookingId, initialBookingReference]);

  if (loading && !selectedBooking) {
    return (
      <CommonLoading
        message="Loading bookings..."
        subMessage="Please wait while we fetch available bookings"
        size="lg"
        fullScreen={true}
      />
    );
  }

  // Tabs for booking details
  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "accommodations", label: "Accommodations", icon: Hotel },
    { id: "transportation", label: "Transportation", icon: Bus },
    { id: "activities", label: "Activities", icon: Activity },
    { id: "itinerary", label: "Itinerary", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "notes", label: "Notes", icon: Info },
  ];

  const hasItinerary =
    bookingDetails?.bookingItineraries &&
    bookingDetails.bookingItineraries.length > 0;
  const hasDocuments =
    bookingDetails?.documents && bookingDetails.documents.length > 0;
  const hasNotes =
    bookingDetails?.bookingNotes && bookingDetails.bookingNotes.length > 0;

  const filteredTabs = tabs.filter((tab) => {
    if (tab.id === "itinerary") return hasItinerary;
    if (tab.id === "documents") return hasDocuments;
    if (tab.id === "notes") return hasNotes;
    return true;
  });

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
            title="Cancel Booking"
            description="Permanently cancel and remove a booking from the system"
            breadcrumbItems={TOUR_BOOKING_TERMINATE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no booking is selected */}
        {!selectedBooking && (
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
                  Select Booking to Cancel
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a booking to review its data before
                  cancellation
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<BookingSearchItem>
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) =>
                  handleSelectBooking(item.id, item.name.split(" (ID:")[0])
                }
                onClearSelection={handleClearBookingSelection}
                initialSearchTerm={initialBookingReference}
                placeholder="Search by booking reference or ID..."
                title="Bookings"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Booking Info Bar */}
        <SelectedItemBar
          item={
            selectedBooking
              ? {
                  id: selectedBooking.bookingId,
                  name: selectedBooking.bookingReference,
                }
              : null
          }
          onClear={handleClearBookingSelection}
          variant="error"
          title="Selected for Cancellation"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Booking Details Section */}
        {selectedBooking && (
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
                <XCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className="text-base font-bold"
                  style={{ color: theme.error }}
                >
                  Booking Cancellation Review
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
                  #{selectedBooking.bookingId}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading booking details..."
                subMessage="Please wait while we fetch the booking information"
                size="lg"
              />
            )}

            {/* Booking Details Content */}
            {!loadingDetails && bookingDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <ActionButtons
                    title=""
                    showShare={true}
                    showEdit={true}
                    showDelete={true}
                    onShare={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `Booking ${bookingDetails.bookingInformation.bookingReference}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                    onEdit={() =>
                      router.push(
                        `/bookings/update/${selectedBooking.bookingId}`,
                      )
                    }
                    onDelete={() =>
                      router.push(
                        `/bookings/terminate/${selectedBooking.bookingId}`,
                      )
                    }
                  />
                  <button
                    onClick={handleViewBilling}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: theme.accent || theme.primary,
                      color: "#fff",
                    }}
                  >
                    <Receipt className="w-4 h-4" />
                    View Billing
                  </button>
                </div>

                {/* Booking Header */}
                <BookingHeader booking={bookingDetails.bookingInformation} />

                {/* Tabs Navigation */}
                <div
                  className="flex flex-wrap gap-1 sm:gap-2 mb-6 overflow-x-auto pb-2"
                  style={{ borderBottom: `1px solid ${theme.border}` }}
                >
                  {filteredTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                          isActive ? "text-white" : "hover:bg-opacity-10"
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? theme.primary
                            : "transparent",
                          color: isActive ? "#fff" : theme.textSecondary,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="space-y-5">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <BookingCustomerInfo
                          customer={bookingDetails.customerInformation}
                        />
                        <BookingTourPackageInfo
                          tour={bookingDetails.tourInformation}
                          packageInfo={bookingDetails.packageInformation}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <BookingStatusAssignment
                          status={bookingDetails.bookingStatusInformation}
                          assignment={bookingDetails.assignmentInformation}
                        />
                        <BookingCancellation
                          cancellation={bookingDetails.cancellationInformation}
                        />
                      </div>

                      <BookingParticipants
                        participants={bookingDetails.participants || []}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <BookingPriceBreakdown
                          items={bookingDetails.priceBreakDowns || []}
                        />
                        <BookingInvoice
                          invoice={bookingDetails.bookingInvoice}
                        />
                      </div>

                      {bookingDetails.bookingInsurance && (
                        <BookingInsurance
                          insurance={bookingDetails.bookingInsurance}
                        />
                      )}
                    </>
                  )}

                  {/* Accommodations Tab */}
                  {activeTab === "accommodations" && (
                    <BookingAccommodations
                      accommodations={bookingDetails.accommodations || []}
                    />
                  )}

                  {/* Transportation Tab */}
                  {activeTab === "transportation" && (
                    <BookingTransportations
                      transportations={bookingDetails.transportations || []}
                    />
                  )}

                  {/* Activities Tab */}
                  {activeTab === "activities" && (
                    <BookingActivities
                      activities={bookingDetails.activities || []}
                    />
                  )}

                  {/* Itinerary Tab */}
                  {activeTab === "itinerary" && hasItinerary && (
                    <BookingItinerary
                      itineraries={bookingDetails.bookingItineraries || []}
                    />
                  )}

                  {/* Documents Tab */}
                  {activeTab === "documents" && hasDocuments && (
                    <BookingDocuments
                      documents={bookingDetails.documents || []}
                    />
                  )}

                  {/* Notes Tab */}
                  {activeTab === "notes" && hasNotes && (
                    <BookingNotes notes={bookingDetails.bookingNotes || []} />
                  )}
                </div>

                {/* Impact Warning */}
                <ImpactWarning
                  title="Booking Cancellation Impact"
                  customItems={[
                    {
                      icon: <Users size={11} />,
                      text: `All ${bookingDetails.participants?.length || 0} participant(s) associated with this booking will be permanently removed`,
                    },
                    {
                      icon: <Hotel size={11} />,
                      text: `All ${bookingDetails.accommodations?.length || 0} accommodation(s) will be permanently removed`,
                    },
                    {
                      icon: <Bus size={11} />,
                      text: `All ${bookingDetails.transportations?.length || 0} transportation(s) will be permanently removed`,
                    },
                    {
                      icon: <Activity size={11} />,
                      text: `All ${bookingDetails.activities?.length || 0} activity(ies) will be permanently removed`,
                    },
                    {
                      icon: <FileText size={11} />,
                      text: "All booking documents and records will be permanently deleted",
                    },
                    {
                      icon: <Receipt size={11} />,
                      text: "All payment and invoice records will be permanently deleted",
                    },
                    {
                      icon: <AlertCircle size={11} />,
                      text: "This action cannot be undone — recovery is not possible",
                    },
                    {
                      icon: <AlertCircle size={11} />,
                      text: "This cancellation will be logged for audit trail purposes",
                    },
                  ]}
                />

                {/* Cancel Booking Button */}
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
                        <XCircle className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                        Cancel Booking Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !bookingDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Booking"
                message="The booking couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearBookingSelection}
                onRetry={handleRetry}
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
        title="Confirm Booking Cancellation"
        description="You are about to permanently cancel:"
        warningMessage={`All ${bookingDetails?.participants?.length || 0} participants, ${bookingDetails?.accommodations?.length || 0} accommodations, ${bookingDetails?.transportations?.length || 0} transportations, and ${bookingDetails?.activities?.length || 0} activities associated with this booking will be permanently deleted.`}
      />
    </div>
  );
};

export default CancelledBookingPage;
