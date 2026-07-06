"use client";

import { PageHeader } from "@/components/common-components/static-components/PageHeader";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { BookingAssignService } from "@/services/bookingAssignService";
import {
  UnassignBookingFilterParams,
  UnassignBookingBasicDetails,
  UnassignBookingRequestParams,
} from "@/types/booking-assign-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/common-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import { BOOKING_ASSIGN_VIEW_PAGE_URL } from "@/utils/urls";
import BookingAssignCard from "@/components/booking-assign-components/view-booking-assign-components/BookingAssignCard";
import {
  assignBookingsFiltersToUrlParams,
  assignBookingsUrlParamsToFilters,
} from "@/utils/urlParameterFunctions";
import { FilterField } from "@/types/filter-types";
import { ASSIGN_BOOKING_VIEW_SORTING_OPTIONS } from "@/data/sorting-options";
import { BOOKING_ASSIGN_VIEW_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import BookingAssignListCard from "@/components/booking-assign-components/view-booking-assign-components/BookingAssignListCard";

const BookingAssignViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  // State for filter request params
  const [requestParams, setRequestParams] =
    useState<UnassignBookingRequestParams | null>(null);
  const [requestParamsLoading, setRequestParamsLoading] = useState(true);

  const [filters, setFilters] = useState<UnassignBookingFilterParams>(() =>
    assignBookingsUrlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [bookings, setBookings] = useState<UnassignBookingBasicDetails[]>([]);
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
          await BookingAssignService.getUnassignBookingRequestParams();
        if (response.code === 200 && response.data) {
          setRequestParams(response.data);
        }
      } catch (error) {
        console.error("Error fetching unassign booking request params:", error);
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
        value: status.bookingStatusId.toString(),
        label: status.bookingStatusName,
      }));
    }
    return [];
  }, [requestParams]);

  // Get tour options from request params
  const getTourOptions = useCallback((): { value: string; label: string }[] => {
    if (requestParams?.tours) {
      return requestParams.tours.map((tour) => ({
        value: tour.tourId.toString(),
        label: tour.tourName,
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
        value: pkg.packageId.toString(),
        label: pkg.packageName,
      }));
    }
    return [];
  }, [requestParams]);

  // Get package schedule options from request params
  const getPackageScheduleOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.packageSchedules) {
      return requestParams.packageSchedules.map((schedule) => ({
        value: schedule.packageScheduleId.toString(),
        label: schedule.packageScheduleName,
      }));
    }
    return [];
  }, [requestParams]);

  // Get assign user options from request params
  const getAssignUserOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.assignedUsers) {
      return requestParams.assignedUsers.map((user) => ({
        value: user.employeeId.toString(),
        label: user.employeeName,
      }));
    }
    return [];
  }, [requestParams]);

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Search",
      type: "search",
      placeholder: "Search by name, reference, email...",
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
      key: "customerName",
      label: "Customer Name",
      type: "text",
      placeholder: "Enter customer name...",
      width: "third",
    },
    {
      key: "email",
      label: "Email",
      type: "text",
      placeholder: "Enter email...",
      width: "third",
    },
    {
      key: "mobileNumber",
      label: "Mobile Number",
      type: "text",
      placeholder: "Enter mobile number...",
      width: "third",
    },
    {
      key: "bookingStatusId",
      label: "Booking Status",
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
      key: "packageScheduleId",
      label: "Package Schedule",
      type: "select",
      options: getPackageScheduleOptions(),
      width: "third",
    },
    {
      key: "assignTo",
      label: "Assign To",
      type: "select",
      options: getAssignUserOptions(),
      width: "third",
    },
    {
      key: "bookingDateFrom",
      label: "Booking Date From",
      type: "date",
      placeholder: "Booking start date",
      width: "half",
    },
    {
      key: "bookingDateTo",
      label: "Booking Date To",
      type: "date",
      placeholder: "Booking end date",
      width: "half",
    },
    {
      key: "travelStartDateFrom",
      label: "Travel Start From",
      type: "date",
      placeholder: "Travel start date from",
      width: "half",
    },
    {
      key: "travelStartDateTo",
      label: "Travel Start To",
      type: "date",
      placeholder: "Travel start date to",
      width: "half",
    },
  ];

  // Get sort label
  const getSortLabel = (sortBy: string): string => {
    const option = ASSIGN_BOOKING_VIEW_SORTING_OPTIONS.find(
      (opt) => opt.value === sortBy,
    );
    return option ? option.label : sortBy;
  };

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: UnassignBookingFilterParams) => {
      const params = assignBookingsFiltersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${BOOKING_ASSIGN_VIEW_PAGE_URL}?${queryString}`
        : BOOKING_ASSIGN_VIEW_PAGE_URL;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchBookings = useCallback(
    async (currentFilters: UnassignBookingFilterParams) => {
      setLoading(true);
      try {
        const response =
          await BookingAssignService.getUnassignBookings(currentFilters);

        if (response.code === 200 && response.data) {
          setBookings(response.data.unassignBookingBasicDetailsResponses || []);
          setTotalItems(response.data.unassignBookingCount || 0);
        } else {
          setBookings([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching unassign bookings:", error);
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
    const initialFilters = assignBookingsUrlParamsToFilters(
      searchParams || new URLSearchParams(),
    );
    setFilters(initialFilters);
    fetchBookings(initialFilters);
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = assignBookingsUrlParamsToFilters(
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
    const resetFilters: UnassignBookingFilterParams = {
      name: null,
      bookingReference: null,
      bookingStatusId: null,
      customerName: null,
      email: null,
      mobileNumber: null,
      tourId: null,
      packageId: null,
      packageScheduleId: null,
      bookingDateFrom: null,
      bookingDateTo: null,
      travelStartDateFrom: null,
      travelStartDateTo: null,
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
    const updatedFilters: UnassignBookingFilterParams = {
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
      activeFilters.push({ key: "name", label: "Search", value: filters.name });
    }
    if (filters.bookingReference) {
      activeFilters.push({
        key: "bookingReference",
        label: "Reference",
        value: filters.bookingReference,
      });
    }
    if (filters.customerName) {
      activeFilters.push({
        key: "customerName",
        label: "Customer",
        value: filters.customerName,
      });
    }
    if (filters.email) {
      activeFilters.push({
        key: "email",
        label: "Email",
        value: filters.email,
      });
    }
    if (filters.mobileNumber) {
      activeFilters.push({
        key: "mobileNumber",
        label: "Mobile",
        value: filters.mobileNumber,
      });
    }
    if (filters.bookingStatusId && requestParams?.bookingStatuses) {
      const status = requestParams.bookingStatuses.find(
        (s) => s.bookingStatusId === filters.bookingStatusId,
      );
      activeFilters.push({
        key: "bookingStatusId",
        label: "Status",
        value: status?.bookingStatusName || filters.bookingStatusId.toString(),
      });
    }
    if (filters.tourId && requestParams?.tours) {
      const tour = requestParams.tours.find((t) => t.tourId === filters.tourId);
      activeFilters.push({
        key: "tourId",
        label: "Tour",
        value: tour?.tourName || filters.tourId.toString(),
      });
    }
    if (filters.packageId && requestParams?.packages) {
      const pkg = requestParams.packages.find(
        (p) => p.packageId === filters.packageId,
      );
      activeFilters.push({
        key: "packageId",
        label: "Package",
        value: pkg?.packageName || filters.packageId.toString(),
      });
    }
    if (filters.packageScheduleId && requestParams?.packageSchedules) {
      const schedule = requestParams.packageSchedules.find(
        (s) => s.packageScheduleId === filters.packageScheduleId,
      );
      activeFilters.push({
        key: "packageScheduleId",
        label: "Package Schedule",
        value:
          schedule?.packageScheduleName || filters.packageScheduleId.toString(),
      });
    }
    if (filters.assignTo && requestParams?.assignedUsers) {
      const user = requestParams.assignedUsers.find(
        (u) => u.employeeId === filters.assignTo,
      );
      activeFilters.push({
        key: "assignTo",
        label: "Assign To",
        value: user?.employeeName || filters.assignTo.toString(),
      });
    }
    if (filters.bookingDateFrom && filters.bookingDateTo) {
      activeFilters.push({
        key: "bookingDate",
        label: "Booking Date",
        value: `${filters.bookingDateFrom} to ${filters.bookingDateTo}`,
      });
    } else if (filters.bookingDateFrom) {
      activeFilters.push({
        key: "bookingDateFrom",
        label: "Booking From",
        value: filters.bookingDateFrom,
      });
    } else if (filters.bookingDateTo) {
      activeFilters.push({
        key: "bookingDateTo",
        label: "Booking To",
        value: filters.bookingDateTo,
      });
    }
    if (filters.travelStartDateFrom && filters.travelStartDateTo) {
      activeFilters.push({
        key: "travelStartDate",
        label: "Travel Start",
        value: `${filters.travelStartDateFrom} to ${filters.travelStartDateTo}`,
      });
    } else if (filters.travelStartDateFrom) {
      activeFilters.push({
        key: "travelStartDateFrom",
        label: "Travel Start From",
        value: filters.travelStartDateFrom,
      });
    } else if (filters.travelStartDateTo) {
      activeFilters.push({
        key: "travelStartDateTo",
        label: "Travel Start To",
        value: filters.travelStartDateTo,
      });
    }

    return activeFilters;
  };

  // Prepare sort filter for display
  const getSortFilter = () => {
    if (!filters.sortBy) return null;
    return {
      sortBy: filters.sortBy,
      sortLabel: getSortLabel(filters.sortBy),
      sortDirection: (filters.sortDirection || "ASC") as "ASC" | "DESC",
    };
  };

  const currentStart =
    bookings.length > 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    bookingReference: filters.bookingReference,
    bookingStatusId: filters.bookingStatusId,
    customerName: filters.customerName,
    email: filters.email,
    mobileNumber: filters.mobileNumber,
    tourId: filters.tourId,
    packageId: filters.packageId,
    packageScheduleId: filters.packageScheduleId,
    bookingDateFrom: filters.bookingDateFrom,
    bookingDateTo: filters.bookingDateTo,
    travelStartDateFrom: filters.travelStartDateFrom,
    travelStartDateTo: filters.travelStartDateTo,
    assignTo: filters.assignTo,
  };

  if (requestParamsLoading) {
    return (
      <CommonLoading
        message="Loading booking data..."
        subMessage="Please wait while we fetch unassigned bookings and filters"
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
            title="Unassigned Bookings View"
            description="Manage and assign unassigned customer bookings and reservations"
            breadcrumbItems={BOOKING_ASSIGN_VIEW_HOME_BREADCRUMB_DATA}
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
            sortOptions={ASSIGN_BOOKING_VIEW_SORTING_OPTIONS}
            sortBy={filters.sortBy || ""}
            sortDirection={(filters.sortDirection as "ASC" | "DESC") || "ASC"}
            title="Filter Unassigned Bookings"
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
            title="Unassigned Bookings"
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
            message="Loading unassigned bookings..."
            subMessage="Fetching bookings that need assignment"
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
                      <BookingAssignCard
                        key={booking.booking.bookingId}
                        booking={booking}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {bookings.map((booking) => (
                      <BookingAssignListCard
                        key={booking.booking.bookingId}
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
const BookingAssignViewPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <BookingAssignViewContent />
    </Suspense>
  );
};

export default BookingAssignViewPage;
