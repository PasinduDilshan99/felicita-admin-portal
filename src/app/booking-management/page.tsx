import ProtectedRoute from "@/components/ProtectedRoute";
import TravelManagementPage from "@/pages/booking-management/TravelManagementPage";
import { BOOKING_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { BOOKING_MANAGEMENT_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: BOOKING_MANAGEMENT_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[BOOKING_MANAGEMENT_PRIVILEGE]}>
      <TravelManagementPage />
    </ProtectedRoute>
  );
};

export default page;
