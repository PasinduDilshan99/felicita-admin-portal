import ProtectedRoute from "@/components/ProtectedRoute";
import BookingAssignViewPage from "@/pages/booking-management/bookings-assign/BookingAssignViewPage";
import { BOOKINGS_ASSIGN_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_ASSIGN_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_ASSIGN_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_ASSIGN_VIEW_PRIVILEGE]}>
      <BookingAssignViewPage />
    </ProtectedRoute>
  );
};

export default page;
