import ProtectedRoute from "@/components/ProtectedRoute";
import BookingStatusDetailsViewPage from "@/pages/booking-management/booking-status/BookingStatusDetailsViewPage";
import { BOOKINGS_STATUS_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_STATUS_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_STATUS_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_STATUS_DETAILS_VIEW_PRIVILEGE]}>
      <BookingStatusDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
