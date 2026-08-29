import ProtectedRoute from "@/components/ProtectedRoute";
import HotelRatesRequestEmailPage from "@/pages/hotel-management/hotel-rates/HotelRatesRequestEmailPage";
import { HOTEL_RATES_REQUEST_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { HOTEL_RATES_REQUEST_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: HOTEL_RATES_REQUEST_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[HOTEL_RATES_REQUEST_PRIVILEGE]}>
      <HotelRatesRequestEmailPage />
    </ProtectedRoute>
  );
};

export default page;
