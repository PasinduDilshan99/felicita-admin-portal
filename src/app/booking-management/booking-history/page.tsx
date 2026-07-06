import ProtectedRoute from "@/components/ProtectedRoute";
import BookingHistoryPage from "@/pages/booking-management/booking-history/BookingHistoryPage";
import { BOOKINGS_HISTORY_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_HISTORY_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_HISTORY_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_HISTORY_PRIVILEGE]}>
      <BookingHistoryPage />
    </ProtectedRoute>
  );
};

export default page;
