import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateBookingStatusPage from "@/pages/booking-management/booking-status/TerminateBookingStatusPage";
import { BOOKINGS_STATUS_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_STATUS_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_STATUS_TERMINATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_STATUS_TERMINATE_PRIVILEGE]}>
      <TerminateBookingStatusPage />
    </ProtectedRoute>
  );
};

export default page;
