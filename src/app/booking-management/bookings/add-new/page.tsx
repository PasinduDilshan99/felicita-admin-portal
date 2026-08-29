import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewBookingPage from "@/pages/booking-management/bookings/AddNewBookingPage";
import { TOUR_BOOKINGS_ADD_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_BOOKING_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_BOOKINGS_ADD_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_BOOKING_CREATE_PRIVILEGE]}>
      <AddNewBookingPage />
    </ProtectedRoute>
  );
};

export default page;
