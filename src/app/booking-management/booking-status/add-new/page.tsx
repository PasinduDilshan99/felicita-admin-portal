import ProtectedRoute from "@/components/ProtectedRoute";
import CreateBookingStatusPage from "@/pages/booking-management/booking-status/CreateBookingStatusPage";
import { BOOKINGS_STATUS_ADD_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_STATUS_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_STATUS_ADD_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_STATUS_CREATE_PRIVILEGE]}>
      <CreateBookingStatusPage />
    </ProtectedRoute>
  );
};

export default page;
