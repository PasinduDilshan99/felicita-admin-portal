import { HOME_PAGE_HERO_SECTION_TERMINATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import HeroSectionTerminateCommonPage from "@/pages/common/hero-section/HeroSectionTerminateCommonPage";
import React from "react";

const HomePageHeroSectionTerminatePage = () => {
  return (
    <div>
      <HeroSectionTerminateCommonPage
        heroSectionType="HOME"
        breadcrumbData={HOME_PAGE_HERO_SECTION_TERMINATE_BREADCRUMB_DATA}
      />
    </div>
  );
};

export default HomePageHeroSectionTerminatePage;
