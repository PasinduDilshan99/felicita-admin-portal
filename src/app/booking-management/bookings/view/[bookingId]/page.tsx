import ProtectedRoute from "@/components/ProtectedRoute";
import BookingDetailsViewPage from "@/pages/booking-management/bookings/BookingDetailsViewPage";
import { TOUR_BOOKINGS_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_BOOKING_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_BOOKINGS_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_BOOKING_DETAILS_VIEW_PRIVILEGE]}>
      <BookingDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
