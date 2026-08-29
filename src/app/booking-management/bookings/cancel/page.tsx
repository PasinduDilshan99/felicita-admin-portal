import ProtectedRoute from "@/components/ProtectedRoute";
import CancelledBookingPage from "@/pages/booking-management/bookings/CancelledBookingPage";
import { TOUR_BOOKINGS_CANCELED_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_BOOKING_CANCEL_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_BOOKINGS_CANCELED_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_BOOKING_CANCEL_PRIVILEGE]}>
      <CancelledBookingPage />
    </ProtectedRoute>
  );
};

export default page;
