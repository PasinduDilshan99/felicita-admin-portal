import { HOME_PAGE_HERO_SECTION_MANAGEMENT_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { webSiteContentManagementSideBarData } from "@/data/side-bar-data";
import HeroSectionStatisticsCommonPage from "@/pages/common/hero-section/HeroSectionStatisticsCommonPage";
import React from "react";

const HomePageHeroSectionPage = () => {
  const heroSectionData = webSiteContentManagementSideBarData
    .find((item) =>
      item.subData?.some((subItem) => subItem.name === "Hero Section"),
    )
    ?.subData?.find((subItem) => subItem.name === "Hero Section");

  const actions =
    heroSectionData?.grandSubData?.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      url: item.url,
      color: item.color || heroSectionData.color,
      privilege: item.privilege,
    })) || [];

  return (
    <HeroSectionStatisticsCommonPage
      heroSectionType="HOME"
      title="Home Page Hero Sections"
      description="Manage home page hero section performance"
      breadcrumbItems={HOME_PAGE_HERO_SECTION_MANAGEMENT_BREADCRUMB_DATA}
      actions={actions}
    />
  );
};

export default HomePageHeroSectionPage;
