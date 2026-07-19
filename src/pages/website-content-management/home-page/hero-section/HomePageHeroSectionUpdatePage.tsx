import { HOME_PAGE_HERO_SECTION_UPDATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import HeroSectionUpdateCommonPage from "@/pages/common/hero-section/HeroSectionUpdateCommonPage";
import React from "react";

const HomePageHeroSectionUpdatePage = () => {
  return (
    <div>
      <HeroSectionUpdateCommonPage
        heroSectionType="HOME"
        breadcrumbData={HOME_PAGE_HERO_SECTION_UPDATE_BREADCRUMB_DATA}
      />
    </div>
  );
};

export default HomePageHeroSectionUpdatePage;
