import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateBookingAssignPage from "@/pages/booking-management/bookings-assign/UpdateBookingAssignPage";
import { BOOKINGS_ASSIGN_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_ASSIGN_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_ASSIGN_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_ASSIGN_UPDATE_PRIVILEGE]}>
      <UpdateBookingAssignPage />
    </ProtectedRoute>
  );
};

export default page;
