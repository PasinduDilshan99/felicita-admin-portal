"use client";

import { PageHeader } from "@/components/common-components/static-components/PageHeader";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { BookingStatusService } from "@/services/bookingStatusService";
import {
  BookingStatusFilterParams,
  BookingStatusListItem,
} from "@/types/booking-status-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/common-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  BOOKING_STATUS_PAGE_URL,
  BOOKING_STATUS_VIEW_PAGE_URL,
} from "@/utils/urls";
import BookingStatusCard from "@/components/booking-status-components/view-booking-status-components/BookingStatusCard";
import BookingStatusListCard from "@/components/booking-status-components/view-booking-status-components/BookingStatusListCard";
import {
  bookingStatusViewFiltersToUrlParams,
  bookingStatusViewUrlParamsToFilters,
} from "@/utils/urlParameterFunctions";
import { FilterField } from "@/types/filter-types";
import { BOOKING_STATUS_VIEW_SORTING_OPTIONS } from "@/data/sorting-options";
import { BOOKING_STATUS_VIEW_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const BookingStatusViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [filters, setFilters] = useState<BookingStatusFilterParams>(() =>
    bookingStatusViewUrlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [allStatuses, setAllStatuses] = useState<BookingStatusListItem[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<
    BookingStatusListItem[]
  >([]);
  const [displayedStatuses, setDisplayedStatuses] = useState<
    BookingStatusListItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter options state (derived from data)
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);

  // Fetch all booking statuses
  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await BookingStatusService.getBookingStatuses();

      if (response.code === 200 && response.data) {
        setAllStatuses(response.data);

        // Extract unique statuses for filter options
        const statuses = [...new Set(response.data.map((item) => item.status))];
        setAvailableStatuses(statuses);

        return response.data;
      } else {
        setAllStatuses([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching booking statuses:", error);
      setAllStatuses([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort statuses based on filters
  const filterAndSortStatuses = useCallback(
    (
      statuses: BookingStatusListItem[],
      currentFilters: BookingStatusFilterParams,
    ) => {
      let result = [...statuses];

      // Apply name filter
      if (currentFilters.name) {
        const searchTerm = currentFilters.name.toLowerCase();
        result = result.filter(
          (item) =>
            item.statusName.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm),
        );
      }

      // Apply status filter
      if (currentFilters.status) {
        result = result.filter((item) => item.status === currentFilters.status);
      }

      // Apply sorting
      result.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (currentFilters.sortBy) {
          case "statusName":
            aVal = a.statusName;
            bVal = b.statusName;
            break;
          case "statusId":
            aVal = a.statusId;
            bVal = b.statusId;
            break;
          case "status":
            aVal = a.status;
            bVal = b.status;
            break;
          default:
            aVal = a.statusName;
            bVal = b.statusName;
        }

        if (currentFilters.sortDirection === "ASC") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      return result;
    },
    [],
  );

  // Update filtered and displayed statuses when data or filters change
  useEffect(() => {
    if (allStatuses.length > 0) {
      const filtered = filterAndSortStatuses(allStatuses, filters);
      setFilteredStatuses(filtered);
      setTotalItems(filtered.length);

      // Apply pagination
      const start = (filters.pageNumber - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      setDisplayedStatuses(filtered.slice(start, end));
    }
  }, [allStatuses, filters, filterAndSortStatuses]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      await fetchStatuses();
      setIsInitialLoad(false);
    };

    loadData();
  }, [fetchStatuses]);

  // Apply URL filters after data is loaded and when searchParams change
  useEffect(() => {
    if (!isInitialLoad && allStatuses.length > 0) {
      const urlFilters = bookingStatusViewUrlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
    }
  }, [searchParams, isInitialLoad, allStatuses.length]);

  const updateURL = useCallback(
    (newFilters: BookingStatusFilterParams) => {
      const params = bookingStatusViewFiltersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${BOOKING_STATUS_VIEW_PAGE_URL}?${queryString}`
        : BOOKING_STATUS_VIEW_PAGE_URL;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageNumber: 1 }));
  };

  const handleSearch = () => {
    updateURL(filters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters: BookingStatusFilterParams = {
      ...filters,
      pageSize: newPageSize,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters: BookingStatusFilterParams = {
      ...filters,
      pageNumber: page,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: BookingStatusFilterParams = {
      name: null,
      status: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: "statusName",
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters: BookingStatusFilterParams = {
      ...filters,
      [key]: null,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: BookingStatusFilterParams = {
      ...filters,
      sortBy: "statusName",
      sortDirection: "ASC",
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortDirection: "ASC" | "DESC",
  ) => {
    const updatedFilters: BookingStatusFilterParams = {
      ...filters,
      sortBy: newSortBy,
      sortDirection: newSortDirection,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Get status options for filter
  const getStatusOptions = () => {
    return availableStatuses.map((status) => ({
      value: status,
      label:
        status === "ACTIVE"
          ? "Active"
          : status === "INACTIVE"
            ? "Inactive"
            : status,
    }));
  };

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Status Name",
      type: "search",
      placeholder: "Search by status name or description...",
      width: "full",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: getStatusOptions(),
      width: "third",
    },
  ];

  // Get sort label
  const getSortLabel = (sortBy: string): string => {
    const option = BOOKING_STATUS_VIEW_SORTING_OPTIONS.find(
      (opt) => opt.value === sortBy,
    );
    return option ? option.label : sortBy;
  };

  // Prepare active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({ key: "name", label: "Name", value: filters.name });
    }
    if (filters.status) {
      activeFilters.push({
        key: "status",
        label: "Status",
        value:
          filters.status === "ACTIVE"
            ? "Active"
            : filters.status === "INACTIVE"
              ? "Inactive"
              : filters.status,
      });
    }

    return activeFilters;
  };

  // Prepare sort filter for display
  const getSortFilter = () => {
    if (
      !filters.sortBy ||
      (filters.sortBy === "statusName" && filters.sortDirection === "ASC")
    )
      return null;
    return {
      sortBy: filters.sortBy,
      sortLabel: getSortLabel(filters.sortBy),
      sortDirection: (filters.sortDirection || "ASC") as "ASC" | "DESC",
    };
  };

  const currentStart =
    displayedStatuses.length > 0
      ? (filters.pageNumber - 1) * filters.pageSize + 1
      : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    status: filters.status,
  };

  if (loading && isInitialLoad) {
    return (
      <CommonLoading
        message="Loading booking statuses..."
        subMessage="Please wait while we fetch booking statuses"
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
            title="Booking Statuses View"
            description="Manage and monitor booking status configurations"
            breadcrumbItems={BOOKING_STATUS_VIEW_HOME_BREADCRUMB_DATA}
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
            sortOptions={BOOKING_STATUS_VIEW_SORTING_OPTIONS}
            sortBy={filters.sortBy}
            sortDirection={filters.sortDirection}
            title="Filter Booking Statuses"
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
            title="Booking Statuses"
            currentStart={currentStart}
            currentEnd={currentEnd}
            totalItems={totalItems}
            viewMode={viewMode}
            onViewModeChange={toggleViewMode}
          />
        </div>

        {/* Loading State for filter changes */}
        {loading && !isInitialLoad && (
          <CommonLoading
            message="Updating statuses..."
            subMessage="Please wait"
            size="lg"
          />
        )}

        {/* Statuses Grid/List */}
        {!loading && (
          <>
            {displayedStatuses.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedStatuses.map((status) => (
                      <BookingStatusCard
                        key={status.statusId}
                        status={status}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {displayedStatuses.map((status) => (
                      <BookingStatusListCard
                        key={status.statusId}
                        status={status}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalItems > filters.pageSize && (
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
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Wrap with Suspense for useSearchParams
const BookingStatusViewPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <BookingStatusViewContent />
    </Suspense>
  );
};

export default BookingStatusViewPage;
