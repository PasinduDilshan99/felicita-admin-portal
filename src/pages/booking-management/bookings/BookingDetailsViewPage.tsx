"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookingService } from "@/services/bookingService";
import { BookingAllDetails } from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import {
  Calendar,
  Hotel,
  Bus,
  Activity,
  FileText,
  Receipt,
  Info,
  Eye,
} from "lucide-react";
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
import { TOUR_BOOKING_DETAILS_VIEW_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";

const BookingDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const bookingId = parseInt(params?.bookingId as string);

  const [booking, setBooking] = useState<BookingAllDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const breadcrumbItems = [
    ...TOUR_BOOKING_DETAILS_VIEW_BREADCRUMB_DATA,
    {
      label: booking?.bookingInformation?.bookingReference || "Details",
      href: `${TOUR_BOOKINGS_DETAILS_VIEW_URL}/${bookingId}`,
    },
  ];

  useEffect(() => {
    if (bookingId) fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookingService.getBookingAllDetails(bookingId);
      setBooking(response.data);
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
      router.push(TOUR_BOOKINGS_VIEW_PAGE_URL);
    }
  };
  const handleRetry = () => {
    if (bookingId) fetchBooking();
  };

  const handleViewBilling = () => {
    if (bookingId) {
      router.push(`${BILLING_VIEW_PAGE_URL}/${bookingId}`);
    }
  };

  if (loading)
    return (
      <CommonLoading
        message="Loading booking details..."
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
        backButtonText="Back to Bookings"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

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
    booking.bookingItineraries && booking.bookingItineraries.length > 0;
  const hasDocuments = booking.documents && booking.documents.length > 0;
  const hasNotes = booking.bookingNotes && booking.bookingNotes.length > 0;

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
            title={`Booking Details`}
            description={`Reference: ${booking.bookingInformation.bookingReference}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <ActionButtons
            title=""
            showShare={true}
            showEdit={true}
            showDelete={true}
            onShare={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Booking ${booking.bookingInformation.bookingReference}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            onEdit={() => router.push(`/bookings/update/${bookingId}`)}
            onDelete={() => router.push(`/bookings/terminate/${bookingId}`)}
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
        <BookingHeader booking={booking.bookingInformation} />

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
                  backgroundColor: isActive ? theme.primary : "transparent",
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
                <BookingCustomerInfo customer={booking.customerInformation} />
                <BookingTourPackageInfo
                  tour={booking.tourInformation}
                  packageInfo={booking.packageInformation}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <BookingStatusAssignment
                  status={booking.bookingStatusInformation}
                  assignment={booking.assignmentInformation}
                />
                <BookingCancellation
                  cancellation={booking.cancellationInformation}
                />
              </div>

              <BookingParticipants participants={booking.participants || []} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <BookingPriceBreakdown items={booking.priceBreakDowns || []} />
                <BookingInvoice invoice={booking.bookingInvoice} />
              </div>

              {booking.bookingInsurance && (
                <BookingInsurance insurance={booking.bookingInsurance} />
              )}
            </>
          )}

          {/* Accommodations Tab */}
          {activeTab === "accommodations" && (
            <BookingAccommodations
              accommodations={booking.accommodations || []}
            />
          )}

          {/* Transportation Tab */}
          {activeTab === "transportation" && (
            <BookingTransportations
              transportations={booking.transportations || []}
            />
          )}

          {/* Activities Tab */}
          {activeTab === "activities" && (
            <BookingActivities activities={booking.activities || []} />
          )}

          {/* Itinerary Tab */}
          {activeTab === "itinerary" && hasItinerary && (
            <BookingItinerary itineraries={booking.bookingItineraries || []} />
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && hasDocuments && (
            <BookingDocuments documents={booking.documents || []} />
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && hasNotes && (
            <BookingNotes notes={booking.bookingNotes || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsViewPage;
