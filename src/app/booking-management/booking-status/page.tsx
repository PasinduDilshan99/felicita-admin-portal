import ProtectedRoute from "@/components/ProtectedRoute";
import BookingStatusPage from "@/pages/booking-management/booking-status/BookingStatusPage";
import { BOOKINGS_STATUS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_STATUS_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_STATUS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_STATUS_PRIVILEGE]}>
      <BookingStatusPage />
    </ProtectedRoute>
  );
};

export default page;
