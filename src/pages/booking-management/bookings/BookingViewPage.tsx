"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { BookingService } from "@/services/bookingService";
import {
  BookingFilterParams,
  BookingBasicDetails,
  BookingRequestParams,
} from "@/types/booking-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import CommonLoading from "@/components/common-components/CommonLoading";
import BookingCard from "@/components/bookings-components/view-booking-components/BookingCard";
import BookingListCard from "@/components/bookings-components/view-booking-components/BookingListCard";
import {
  bookingsViewFiltersToUrlParams,
  bookingsViewUrlParamsToFilters,
} from "@/utils/urlParameterFunctions";
import { BOOKINGS_VIEW_SORTING_OPTIONS } from "@/data/sorting-options";
import { FilterField } from "@/types/filter-types";
import { TOUR_BOOKINGS_VIEW_PAGE_URL } from "@/utils/urls";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_BOOKING_VIEW_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { EmptyState } from "@/components/common-components/EmptyState";

const BookingsViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [requestParams, setRequestParams] =
    useState<BookingRequestParams | null>(null);
  const [requestParamsLoading, setRequestParamsLoading] = useState(true);

  const [filters, setFilters] = useState<BookingFilterParams>(() =>
    bookingsViewUrlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [bookings, setBookings] = useState<BookingBasicDetails[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch request parameters for filters
  useEffect(() => {
    const fetchRequestParams = async () => {
      try {
        setRequestParamsLoading(true);
        const response = await BookingService.getBookingRequestParams();
        if (response.code === 200 && response.data) {
          setRequestParams(response.data);
        }
      } catch (error) {
        console.error("Error fetching booking request params:", error);
      } finally {
        setRequestParamsLoading(false);
      }
    };

    fetchRequestParams();
  }, []);

  // Get booking status options from request params
  const getBookingStatusOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.bookingStatuses) {
      return requestParams.bookingStatuses.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      }));
    }
    return [];
  }, [requestParams]);

  // Get tour options from request params
  const getTourOptions = useCallback((): { value: string; label: string }[] => {
    if (requestParams?.tours) {
      return requestParams.tours.map((tour) => ({
        value: tour.id.toString(),
        label: tour.name,
      }));
    }
    return [];
  }, [requestParams]);

  // Get package options from request params
  const getPackageOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.packages) {
      return requestParams.packages.map((pkg) => ({
        value: pkg.id.toString(),
        label: pkg.name,
      }));
    }
    return [];
  }, [requestParams]);

  // Get assign employee options from request params
  const getAssignEmployeeOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.assignEmployees) {
      return requestParams.assignEmployees.map((employee) => ({
        value: employee.id.toString(),
        label: employee.name,
      }));
    }
    return [];
  }, [requestParams]);

  const getSortOptions = useCallback((): { value: string; label: string }[] => {
    if (requestParams) {
      return BOOKINGS_VIEW_SORTING_OPTIONS;
    }
    return BOOKINGS_VIEW_SORTING_OPTIONS;
  }, [requestParams]);

  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Customer Name",
      type: "search",
      placeholder: "Search by customer name...",
      width: "full",
    },
    {
      key: "bookingReference",
      label: "Booking Reference",
      type: "text",
      placeholder: "Enter booking reference...",
      width: "third",
    },
    {
      key: "bookingStatusId",
      label: "Status",
      type: "select",
      options: getBookingStatusOptions(),
      width: "third",
    },
    {
      key: "tourId",
      label: "Tour",
      type: "select",
      options: getTourOptions(),
      width: "third",
    },
    {
      key: "packageId",
      label: "Package",
      type: "select",
      options: getPackageOptions(),
      width: "third",
    },
    {
      key: "assignTo",
      label: "Assigned To",
      type: "select",
      options: getAssignEmployeeOptions(),
      width: "third",
    },
    {
      key: "minPrice",
      label: "Min Price",
      type: "number",
      placeholder: "Minimum price",
      min: requestParams?.minPrice || 0,
      max: requestParams?.maxPrice || 100000,
      step: 100,
      width: "quarter",
    },
    {
      key: "maxPrice",
      label: "Max Price",
      type: "number",
      placeholder: "Maximum price",
      min: requestParams?.minPrice || 0,
      max: requestParams?.maxPrice || 100000,
      step: 100,
      width: "quarter",
    },
    {
      key: "discountAmount",
      label: "Discount Amount",
      type: "number",
      placeholder: "Discount amount",
      min: requestParams?.minDiscountAmount || 0,
      max: requestParams?.maxDiscountAmount || 100000,
      step: 100,
      width: "quarter",
    },
    {
      key: "bookingFrom",
      label: "Booking From",
      type: "date",
      placeholder: "Booking start date",
      width: "third",
    },
    {
      key: "bookingTo",
      label: "Booking To",
      type: "date",
      placeholder: "Booking end date",
      width: "third",
    },
    {
      key: "travelStartDate",
      label: "Travel Start Date",
      type: "date",
      placeholder: "Travel start date",
      width: "third",
    },
    {
      key: "travelEndDate",
      label: "Travel End Date",
      type: "date",
      placeholder: "Travel end date",
      width: "third",
    },
  ];

  // Get sort label
  const getSortLabel = (sortBy: string): string => {
    const options = getSortOptions();
    const option = options.find((opt) => opt.value === sortBy);
    return option ? option.label : sortBy;
  };

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: BookingFilterParams) => {
      const params = bookingsViewFiltersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${TOUR_BOOKINGS_VIEW_PAGE_URL}?${queryString}`
        : TOUR_BOOKINGS_VIEW_PAGE_URL;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchBookings = useCallback(
    async (currentFilters: BookingFilterParams) => {
      setLoading(true);
      try {
        const response = await BookingService.getBookings(currentFilters);

        if (response.code === 200 && response.data) {
          setBookings(response.data.bookingsBasicDetails || []);
          setTotalItems(response.data.bookingCount || 0);
        } else {
          setBookings([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
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
    const initialFilters = bookingsViewUrlParamsToFilters(
      searchParams || new URLSearchParams(),
    );
    setFilters(initialFilters);
    fetchBookings(initialFilters);
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = bookingsViewUrlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
      fetchBookings(urlFilters);
    }
  }, [searchParams, isInitialLoad, fetchBookings]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchBookings(updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchBookings(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchBookings(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: BookingFilterParams = {
      name: null,
      minPrice: null,
      maxPrice: null,
      bookingReference: null,
      discountAmount: null,
      travelStartDate: null,
      travelEndDate: null,
      bookingFrom: null,
      bookingTo: null,
      bookingStatusId: null,
      tourId: null,
      packageId: null,
      assignTo: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: null,
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchBookings(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchBookings(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: BookingFilterParams = {
      ...filters,
      sortBy: null,
      sortDirection: "ASC",
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchBookings(updatedFilters);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortDirection: "ASC" | "DESC",
  ) => {
    const updatedFilters = {
      ...filters,
      sortBy: newSortBy || null,
      sortDirection: newSortDirection,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchBookings(updatedFilters);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Prepare active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({
        key: "name",
        label: "Customer",
        value: filters.name,
      });
    }
    if (filters.bookingReference) {
      activeFilters.push({
        key: "bookingReference",
        label: "Reference",
        value: filters.bookingReference,
      });
    }
    if (filters.bookingStatusId && requestParams?.bookingStatuses) {
      const status = requestParams.bookingStatuses.find(
        (s) => s.id === filters.bookingStatusId,
      );
      activeFilters.push({
        key: "bookingStatusId",
        label: "Status",
        value: status?.name || filters.bookingStatusId.toString(),
      });
    }
    if (filters.tourId && requestParams?.tours) {
      const tour = requestParams.tours.find((t) => t.id === filters.tourId);
      activeFilters.push({
        key: "tourId",
        label: "Tour",
        value: tour?.name || filters.tourId.toString(),
      });
    }
    if (filters.packageId && requestParams?.packages) {
      const pkg = requestParams.packages.find(
        (p) => p.id === filters.packageId,
      );
      activeFilters.push({
        key: "packageId",
        label: "Package",
        value: pkg?.name || filters.packageId.toString(),
      });
    }
    if (filters.assignTo && requestParams?.assignEmployees) {
      const employee = requestParams.assignEmployees.find(
        (e) => e.id === filters.assignTo,
      );
      activeFilters.push({
        key: "assignTo",
        label: "Assigned To",
        value: employee?.name || filters.assignTo.toString(),
      });
    }
    if (filters.minPrice && filters.maxPrice) {
      activeFilters.push({
        key: "price",
        label: "Price Range",
        value: `$${filters.minPrice} - $${filters.maxPrice}`,
      });
    } else if (filters.minPrice) {
      activeFilters.push({
        key: "minPrice",
        label: "Min Price",
        value: `$${filters.minPrice}`,
      });
    } else if (filters.maxPrice) {
      activeFilters.push({
        key: "maxPrice",
        label: "Max Price",
        value: `$${filters.maxPrice}`,
      });
    }
    if (filters.discountAmount) {
      activeFilters.push({
        key: "discountAmount",
        label: "Discount",
        value: `$${filters.discountAmount}`,
      });
    }
    if (filters.bookingFrom && filters.bookingTo) {
      activeFilters.push({
        key: "bookingDate",
        label: "Booking Date",
        value: `${filters.bookingFrom} to ${filters.bookingTo}`,
      });
    } else if (filters.bookingFrom) {
      activeFilters.push({
        key: "bookingFrom",
        label: "Booking From",
        value: filters.bookingFrom,
      });
    } else if (filters.bookingTo) {
      activeFilters.push({
        key: "bookingTo",
        label: "Booking To",
        value: filters.bookingTo,
      });
    }
    if (filters.travelStartDate && filters.travelEndDate) {
      activeFilters.push({
        key: "travelDate",
        label: "Travel Date",
        value: `${filters.travelStartDate} to ${filters.travelEndDate}`,
      });
    } else if (filters.travelStartDate) {
      activeFilters.push({
        key: "travelStartDate",
        label: "Travel Start",
        value: filters.travelStartDate,
      });
    } else if (filters.travelEndDate) {
      activeFilters.push({
        key: "travelEndDate",
        label: "Travel End",
        value: filters.travelEndDate,
      });
    }

    return activeFilters;
  };

const getSortFilter = () => {
  if (!filters.sortBy) return null;
  return {
    sortBy: filters.sortBy,
    sortLabel: getSortLabel(filters.sortBy),
    sortDirection: (filters.sortDirection || "ASC") as "ASC" | "DESC",
  };
};

  const currentStart =
    bookings.length > 0 ? (filters?.pageNumber - 1) * filters?.pageSize + 1 : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    bookingReference: filters.bookingReference,
    bookingStatusId: filters.bookingStatusId,
    tourId: filters.tourId,
    packageId: filters.packageId,
    assignTo: filters.assignTo,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    discountAmount: filters.discountAmount,
    bookingFrom: filters.bookingFrom,
    bookingTo: filters.bookingTo,
    travelStartDate: filters.travelStartDate,
    travelEndDate: filters.travelEndDate,
  };

  if (requestParamsLoading) {
    return (
      <CommonLoading
        message="Loading booking data..."
        subMessage="Please wait while we fetch available bookings and filters"
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
            title="Bookings View"
            description="Manage and monitor customer bookings, reservations, and travel plans"
            breadcrumbItems={TOUR_BOOKING_VIEW_BREADCRUMB_DATA}
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
            sortOptions={getSortOptions()}
            sortBy={filters.sortBy || ""}
            sortDirection={(filters.sortDirection as "ASC" | "DESC") || "ASC"}
            title="Filter Bookings"
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
            title="Bookings"
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
            message="Loading bookings..."
            subMessage="Fetching customer reservations and bookings"
            size="lg"
          />
        )}

        {/* Bookings Grid/List */}
        {!loading && (
          <>
            {bookings.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {bookings.map((booking) => (
                      <BookingCard key={booking.bookingId} booking={booking} />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {bookings.map((booking) => (
                      <BookingListCard
                        key={booking.bookingId}
                        booking={booking}
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

// Wrap with Suspense for useSearchParams
const BookingViewPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <BookingsViewContent />
    </Suspense>
  );
};

export default BookingViewPage;
