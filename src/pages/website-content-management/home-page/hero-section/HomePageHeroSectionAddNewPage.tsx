import { HOME_PAGE_HERO_SECTION_ADD_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import HeroSectionAddNewCommonPage from "@/pages/common/hero-section/HeroSectionAddNewCommonPage";
import React from "react";

const HomePageHeroSectionAddNewPage = () => {
  return (
    <div>
      <HeroSectionAddNewCommonPage
        heroSectionType="HOME"
        breadcrumbData={HOME_PAGE_HERO_SECTION_ADD_BREADCRUMB_DATA}
      />
    </div>
  );
};

export default HomePageHeroSectionAddNewPage;
