import ProtectedRoute from "@/components/ProtectedRoute";
import BookingStatusViewPage from "@/pages/booking-management/booking-status/BookingStatusViewPage";
import { BOOKINGS_STATUS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_STATUS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_STATUS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_STATUS_VIEW_PRIVILEGE]}>
      <BookingStatusViewPage />
    </ProtectedRoute>
  );
};

export default page;
