import ProtectedRoute from "@/components/ProtectedRoute";
import BookingViewPage from "@/pages/booking-management/bookings/BookingViewPage";
import { TOUR_BOOKINGS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_BOOKING_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_BOOKINGS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_BOOKING_VIEW_PRIVILEGE]}>
      <BookingViewPage />
    </ProtectedRoute>
  );
};

export default page;
