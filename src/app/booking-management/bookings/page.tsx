import ProtectedRoute from "@/components/ProtectedRoute";
import BookingsPage from "@/pages/booking-management/bookings/BookingsPage";
import { TOUR_BOOKINGS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_BOOKING_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_BOOKINGS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_BOOKING_PRIVILEGE]}>
      <BookingsPage />
    </ProtectedRoute>
  );
};

export default page;
