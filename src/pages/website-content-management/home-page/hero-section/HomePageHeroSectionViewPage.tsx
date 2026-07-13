import { HOME_PAGE_HERO_SECTION_VIEW_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import HeroSectionViewCommonPage from "@/pages/common/hero-section/HeroSectionViewCommonPage";
import {
  HOME_HERO_SECTION_DETAILS_VIEW_URL,
  HOME_HERO_SECTION_VIEW_URL,
} from "@/utils/urls";
import React from "react";

const HomePageHeroSectionViewPage = () => {
  return (
    <HeroSectionViewCommonPage
      heroSectionType="HOME"
      pageTitle="Home Hero Sections"
      pageDescription="Manage and monitor home page hero section configurations"
      heroSectionDetailsViewUrl={HOME_HERO_SECTION_DETAILS_VIEW_URL}
      heroSectionBaseUrl={HOME_HERO_SECTION_VIEW_URL}
      breadcrumbItems={HOME_PAGE_HERO_SECTION_VIEW_BREADCRUMB_DATA}
    />
  );
};

export default HomePageHeroSectionViewPage;
