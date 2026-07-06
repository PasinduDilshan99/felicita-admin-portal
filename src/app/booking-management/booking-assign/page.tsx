import ProtectedRoute from "@/components/ProtectedRoute";
import BookingAssignPage from "@/pages/booking-management/bookings-assign/BookingAssignPage";
import { BOOKINGS_ASSIGN_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_ASSIGN_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_ASSIGN_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_ASSIGN_PRIVILEGE]}>
      <BookingAssignPage />
    </ProtectedRoute>
  );
};

export default page;
