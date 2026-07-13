"use client";

import { PageHeader } from "@/components/common-components/static-components/PageHeader";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { HeroSectionService } from "@/services/heroSectionService";
import {
  HeroSectionBasic,
  HeroSectionFilterParamsWithType,
  HeroSectionRequestParams,
  HeroSectionViewCommonPageProps,
} from "@/types/hero-section-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/common-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import { FilterField } from "@/types/filter-types";
import HeroSectionListCard from "@/components/common-page-components/hero-section/HeroSectionListCard";
import HeroSectionCard from "@/components/common-page-components/hero-section/HeroSectionCard";
import { COMMON_HERO_SECTION_VIEW_SORTING_OPTIONS } from "@/data/sorting-options";
import {
  commonHeroSectionViewFiltersToUrlParams,
  commonHeroSectionViewUrlParamsToFilters,
} from "@/utils/urlParameterFunctions";
import { COMMON_HERO_SECTION_VIEW_STATUS_OPTIONS } from "@/data/status-options-data";

const HeroSectionViewContent: React.FC<{
  heroSectionType: string;
  heroSectionDetailsViewUrl: string;
  heroSectionBaseUrl: string;
  breadcrumbItems: Array<{ label: string; href: string }>;
  pageTitle?: string;
  pageDescription?: string;
}> = ({
  heroSectionType,
  heroSectionDetailsViewUrl,
  heroSectionBaseUrl,
  breadcrumbItems,
  pageTitle,
  pageDescription,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [requestParams, setRequestParams] =
    useState<HeroSectionRequestParams | null>(null);
  const [requestParamsLoading, setRequestParamsLoading] = useState(true);

  const finalPageTitle =
    pageTitle ||
    `${heroSectionType.charAt(0).toUpperCase() + heroSectionType.slice(1).toLowerCase()} Hero Sections`;
  const finalPageDescription =
    pageDescription ||
    `Manage and monitor ${heroSectionType.toLowerCase()} hero section configurations`;

  const [filters, setFilters] = useState<HeroSectionFilterParamsWithType>(
    () => {
      const urlFilters = commonHeroSectionViewUrlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      return {
        ...urlFilters,
        heroSectionType: urlFilters.heroSectionType || heroSectionType,
      };
    },
  );

  const [heroSections, setHeroSections] = useState<HeroSectionBasic[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch request parameters for filters
  useEffect(() => {
    const fetchRequestParams = async () => {
      try {
        setRequestParamsLoading(true);
        const response =
          await HeroSectionService.getHeroSectionRequestParams(heroSectionType);
        if (response.code === 200 && response.data) {
          setRequestParams(response.data);
        }
      } catch (error) {
        console.error("Error fetching hero section request params:", error);
      } finally {
        setRequestParamsLoading(false);
      }
    };

    fetchRequestParams();
  }, [heroSectionType]);

  // Get primary button text options from request params
  const getPrimaryButtonOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.primaryButtonText) {
      return requestParams.primaryButtonText.map((text) => ({
        value: text,
        label: text,
      }));
    }
    return [];
  }, [requestParams]);

  // Get secondary button text options from request params
  const getSecondaryButtonOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.secondaryButtonText) {
      return requestParams.secondaryButtonText.map((text) => ({
        value: text,
        label: text,
      }));
    }
    return [];
  }, [requestParams]);

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Name",
      type: "search",
      placeholder: "Search by name...",
      width: "full",
    },
    {
      key: "title",
      label: "Title",
      type: "text",
      placeholder: "Search by title...",
      width: "third",
    },
    {
      key: "subTitle",
      label: "Subtitle",
      type: "text",
      placeholder: "Search by subtitle...",
      width: "third",
    },
    {
      key: "description",
      label: "Description",
      type: "text",
      placeholder: "Search by description...",
      width: "third",
    },
    {
      key: "primaryButtonText",
      label: "Primary Button",
      type: "select",
      options: getPrimaryButtonOptions(),
      width: "third",
    },
    {
      key: "secondaryButtonText",
      label: "Secondary Button",
      type: "select",
      options: getSecondaryButtonOptions(),
      width: "third",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: COMMON_HERO_SECTION_VIEW_STATUS_OPTIONS,
      width: "third",
    },
  ];

  // Get sort label
  const getSortLabel = (sortBy: string): string => {
    const option = COMMON_HERO_SECTION_VIEW_SORTING_OPTIONS.find(
      (opt) => opt.value === sortBy,
    );
    return option ? option.label : sortBy;
  };

  const updateURL = useCallback(
    (newFilters: HeroSectionFilterParamsWithType) => {
      const params = commonHeroSectionViewFiltersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${heroSectionBaseUrl}?${queryString}`
        : heroSectionBaseUrl;
      router.replace(newURL, { scroll: false });
    },
    [router, heroSectionType],
  );

  const fetchHeroSections = useCallback(
    async (currentFilters: HeroSectionFilterParamsWithType) => {
      setLoading(true);
      try {
        const response =
          await HeroSectionService.getHeroSectionBasicDetails(currentFilters);

        if (response.code === 200 && response.data) {
          setHeroSections(response.data.heroSectionBasicResponses || []);
          setTotalItems(response.data.count || 0);
        } else {
          setHeroSections([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching hero sections:", error);
        setHeroSections([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    },
    [],
  );

  // Initial load from URL params
  useEffect(() => {
    const initialFilters = commonHeroSectionViewUrlParamsToFilters(
      searchParams || new URLSearchParams(),
    );
    setFilters({
      ...initialFilters,
      heroSectionType: initialFilters.heroSectionType || heroSectionType,
    });
    fetchHeroSections({
      ...initialFilters,
      heroSectionType: initialFilters.heroSectionType || heroSectionType,
    });
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = commonHeroSectionViewUrlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      const updatedFilters = {
        ...urlFilters,
        heroSectionType: urlFilters.heroSectionType || heroSectionType,
      };
      setFilters(updatedFilters);
      fetchHeroSections(updatedFilters);
    }
  }, [searchParams, isInitialLoad, fetchHeroSections, heroSectionType]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchHeroSections(updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchHeroSections(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchHeroSections(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: HeroSectionFilterParamsWithType = {
      name: null,
      heroSectionType: heroSectionType,
      title: null,
      subTitle: null,
      description: null,
      primaryButtonText: null,
      secondaryButtonText: null,
      status: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: "id",
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchHeroSections(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchHeroSections(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: HeroSectionFilterParamsWithType = {
      ...filters,
      sortBy: "id",
      sortDirection: "ASC",
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchHeroSections(updatedFilters);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortDirection: "ASC" | "DESC",
  ) => {
    const updatedFilters = {
      ...filters,
      sortBy: newSortBy || "id",
      sortDirection: newSortDirection,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchHeroSections(updatedFilters);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Prepare active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({ key: "name", label: "Name", value: filters.name });
    }
    if (filters.title) {
      activeFilters.push({
        key: "title",
        label: "Title",
        value: filters.title,
      });
    }
    if (filters.subTitle) {
      activeFilters.push({
        key: "subTitle",
        label: "Subtitle",
        value: filters.subTitle,
      });
    }
    if (filters.description) {
      activeFilters.push({
        key: "description",
        label: "Description",
        value: filters.description,
      });
    }
    if (filters.primaryButtonText) {
      activeFilters.push({
        key: "primaryButtonText",
        label: "Primary Button",
        value: filters.primaryButtonText,
      });
    }
    if (filters.secondaryButtonText) {
      activeFilters.push({
        key: "secondaryButtonText",
        label: "Secondary Button",
        value: filters.secondaryButtonText,
      });
    }
    if (filters.status) {
      activeFilters.push({
        key: "status",
        label: "Status",
        value: filters.status === "ACTIVE" ? "Active" : "Inactive",
      });
    }

    return activeFilters;
  };

  // Prepare sort filter for display
  const getSortFilter = () => {
    if (
      !filters.sortBy ||
      (filters.sortBy === "id" && filters.sortDirection === "ASC")
    )
      return null;
    return {
      sortBy: filters.sortBy,
      sortLabel: getSortLabel(filters.sortBy),
      sortDirection: (filters.sortDirection || "ASC") as "ASC" | "DESC",
    };
  };

  const currentStart =
    heroSections.length > 0
      ? (filters.pageNumber - 1) * filters.pageSize + 1
      : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    title: filters.title,
    subTitle: filters.subTitle,
    description: filters.description,
    primaryButtonText: filters.primaryButtonText,
    secondaryButtonText: filters.secondaryButtonText,
    status: filters.status,
  };

  if (requestParamsLoading) {
    return (
      <CommonLoading
        message={`Loading ${heroSectionType.toLowerCase()} hero sections...`}
        subMessage="Please wait while we fetch hero section data and filters"
        size="md"
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={finalPageTitle}
            description={finalPageDescription}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <FilterPanel
            filters={filterPanelFilters}
            fields={filterFields}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
            pageSize={filters.pageSize}
            pageSizeOptions={[6, 9, 12, 24, 48]}
            showPageSize={true}
            showSorting={true}
            sortOptions={COMMON_HERO_SECTION_VIEW_SORTING_OPTIONS}
            sortBy={filters.sortBy}
            sortDirection={filters.sortDirection}
            title={`Filter ${heroSectionType.charAt(0).toUpperCase() + heroSectionType.slice(1).toLowerCase()} Hero Sections`}
            searchButtonText="Search"
            resetButtonText="Reset"
            showActiveFilters={false}
            collapsible={true}
            isLoading={loading}
          />
        </div>

        {/* Active Filters Display */}
        <ActiveFilters
          filters={getActiveFilters()}
          sortFilter={getSortFilter()}
          onRemoveFilter={handleRemoveFilter}
          onRemoveSort={handleRemoveSort}
          onClearAll={handleReset}
          title="Active Filters"
          showClearAll={true}
          variant="default"
        />

        {/* Results Header with View Toggle */}
        <div className="mb-6">
          <ResultsHeader
            title={`${heroSectionType.charAt(0).toUpperCase() + heroSectionType.slice(1).toLowerCase()} Hero Sections`}
            currentStart={currentStart}
            currentEnd={currentEnd}
            totalItems={totalItems}
            viewMode={viewMode}
            onViewModeChange={toggleViewMode}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <CommonLoading
            message={`Loading ${heroSectionType.toLowerCase()} hero sections...`}
            subMessage="Fetching hero section configurations"
            size="lg"
          />
        )}

        {/* Hero Sections Grid/List */}
        {!loading && (
          <>
            {heroSections.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {heroSections.map((section) => (
                      <HeroSectionCard
                        key={section.id}
                        heroSection={section}
                        heroSectionType={heroSectionType}
                        heroSectionDetailsViewUrl={heroSectionDetailsViewUrl}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {heroSections.map((section) => (
                      <HeroSectionListCard
                        key={section.id}
                        heroSection={section}
                        heroSectionType={heroSectionType}
                        heroSectionDetailsViewUrl={heroSectionDetailsViewUrl}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="mt-10">
                  <Pagination
                    currentPage={filters.pageNumber}
                    totalItems={totalItems}
                    pageSize={filters.pageSize}
                    onPageChange={handlePageChange}
                    showResultsCount={true}
                    showFirstLastButtons={true}
                    showProgressBar={true}
                    size="md"
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Wrapper component with Suspense
const HeroSectionViewCommonPage: React.FC<HeroSectionViewCommonPageProps> = ({
  heroSectionType,
  breadcrumbItems,
  pageTitle,
  pageDescription,
  heroSectionDetailsViewUrl,
  heroSectionBaseUrl,
}) => {
  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <HeroSectionViewContent
        heroSectionType={heroSectionType}
        breadcrumbItems={breadcrumbItems}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        heroSectionDetailsViewUrl={heroSectionDetailsViewUrl}
        heroSectionBaseUrl={heroSectionBaseUrl}
      />
    </Suspense>
  );
};

export default HeroSectionViewCommonPage;
