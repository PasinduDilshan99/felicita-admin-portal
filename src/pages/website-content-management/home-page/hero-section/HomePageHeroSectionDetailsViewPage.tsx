"use client"
import { HOME_PAGE_HERO_SECTION_DETAILS_VIEW_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import HeroSectionDetailsViewCommonPage from "@/pages/common/hero-section/HeroSectionDetailsViewCommonPage";
import { HOME_HERO_SECTION_TERMINATE_URL, HOME_HERO_SECTION_UPDATE_URL } from "@/utils/urls";
import { useParams } from "next/navigation";
import React from "react";

const HomePageHeroSectionDetailsViewPage = () => {
  const params = useParams();
  const heroSectionId = parseInt(params?.heroSectionId as string);
  return (
    <div>
      <HeroSectionDetailsViewCommonPage
        heroSectionId={heroSectionId}
        heroSectionType="HOME"
        breadcrumbData={HOME_PAGE_HERO_SECTION_DETAILS_VIEW_BREADCRUMB_DATA}
        updateUrl={HOME_HERO_SECTION_UPDATE_URL}
        terminateUrl={HOME_HERO_SECTION_TERMINATE_URL}
      />
    </div>
  );
};

export default HomePageHeroSectionDetailsViewPage;
