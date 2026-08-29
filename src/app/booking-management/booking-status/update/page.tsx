import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateBookingStatusPage from "@/pages/booking-management/booking-status/UpdateBookingStatusPage";
import { BOOKINGS_STATUS_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_STATUS_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_STATUS_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_STATUS_UPDATE_PRIVILEGE]}>
      <UpdateBookingStatusPage />
    </ProtectedRoute>
  );
};

export default page;
