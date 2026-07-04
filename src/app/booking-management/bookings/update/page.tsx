import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateBookingPage from "@/pages/booking-management/bookings/UpdateBookingPage";
import { TOUR_BOOKINGS_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_BOOKING_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_BOOKINGS_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_BOOKING_UPDATE_PRIVILEGE]}>
      <UpdateBookingPage />
    </ProtectedRoute>
  );
};

export default page;
