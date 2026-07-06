import ProtectedRoute from "@/components/ProtectedRoute";
import BookingHistoryDetailsViewPage from "@/pages/booking-management/booking-history/BookingHistoryDetailsViewPage";
import { BOOKINGS_HISTORY_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_HISTORY_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_HISTORY_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute
      requiredPrivileges={[BOOKING_HISTORY_DETAILS_VIEW_PRIVILEGE]}
    >
      <BookingHistoryDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
