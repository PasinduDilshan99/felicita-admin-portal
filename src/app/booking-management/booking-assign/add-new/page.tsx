import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewBookingAssignPage from "@/pages/booking-management/bookings-assign/AddNewBookingAssignPage";
import { BOOKINGS_ASSIGN_ADD_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_ASSIGN_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKINGS_ASSIGN_ADD_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_ASSIGN_CREATE_PRIVILEGE]}>
      <AddNewBookingAssignPage />
    </ProtectedRoute>
  );
};

export default page;
