import ProtectedRoute from "@/components/ProtectedRoute";
import BookingHistoryViewPage from "@/pages/booking-management/booking-history/BookingHistoryViewPage";
import { BOOKINGS_HISTORY_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_HISTORY_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_HISTORY_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_HISTORY_VIEW_PRIVILEGE]}>
      <BookingHistoryViewPage />
    </ProtectedRoute>
  );
};

export default page;
