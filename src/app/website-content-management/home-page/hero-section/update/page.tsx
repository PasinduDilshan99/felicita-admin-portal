import ProtectedRoute from "@/components/ProtectedRoute";
import HomePageHeroSectionUpdatePage from "@/pages/website-content-management/home-page/hero-section/HomePageHeroSectionUpdatePage";
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
      <HomePageHeroSectionUpdatePage />
    </ProtectedRoute>
  );
};

export default page;
