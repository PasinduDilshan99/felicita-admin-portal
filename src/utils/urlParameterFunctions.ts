import { ActivityCategoryFilterParams } from "@/types/activity-category-types";
import { ActivityScheduleFilterParams } from "@/types/activity-schedule-types";
import { ActivityFilterParams } from "@/types/activity-types";
import { UnassignBookingFilterParams } from "@/types/booking-assign-types";
import { BookingHistoryFilterParams } from "@/types/booking-history-types";
import { BookingStatusFilterParams } from "@/types/booking-status-types";
import { BookingFilterParams } from "@/types/booking-types";
import { CategoryFilterParams } from "@/types/destination-category-types";
import { DestinationFilterParams } from "@/types/destination-types";
import { EmployeeFilterParams } from "@/types/employee-types";
import { HeroSectionFilterParamsWithType } from "@/types/hero-section-types";
import { PackageScheduleFilterParams } from "@/types/package-schedule-types";
import { PackageTypeFilterParams } from "@/types/package-type-types";
import { PackageFilterParams } from "@/types/package-types";
import { PrivilegeFilterParams } from "@/types/privilege-types";
import { RoleFilterParams } from "@/types/role-types";
import { SeasonFilterParams } from "@/types/season-types";
import { TourCategoryFilterParams } from "@/types/tour-category-types";
import { TourScheduleFilterParams } from "@/types/tour-schedule-types";
import { TourTypeFilterParams } from "@/types/tour-type-types";
import { TourFilterParams } from "@/types/tour-types";

export const destinationViewFiltersToUrlParams = (
  filters: DestinationFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.destinationCategory)
    params.set("destinationCategory", filters.destinationCategory);
  if (filters.season) params.set("season", filters.season);
  if (filters.status) params.set("status", filters.status);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const destinationViewUrlParamsToFilters = (
  params: URLSearchParams,
): DestinationFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: null,
    maxPrice: null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    destinationCategory: params.get("destinationCategory") || null,
    season: params.get("season") || null,
    status: (params.get("status") as "ACTIVE" | "INACTIVE" | null) || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const destinationCategoryFiltersToUrlParams = (
  filters: CategoryFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name); // Changed from searchTerm to name
  if (filters.categoryStatus)
    params.set("categoryStatus", filters.categoryStatus);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const destinationCategoryUrlParamsToFilters = (
  params: URLSearchParams,
): CategoryFilterParams => {
  return {
    name: params.get("name") || null, // Changed from searchTerm to name
    categoryStatus:
      (params.get("categoryStatus") as "ACTIVE" | "INACTIVE" | null) || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const ActivityViewFiltersToUrlParams = (
  filters: ActivityFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.activityCategory)
    params.set("activityCategory", filters.activityCategory);
  if (filters.season) params.set("season", filters.season);
  if (filters.status) params.set("status", filters.status);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const ActivityViewUrlParamsToFilters = (
  params: URLSearchParams,
): ActivityFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: null,
    maxPrice: null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    activityCategory: params.get("activityCategory") || null,
    season: params.get("season") || null,
    status: (params.get("status") as "ACTIVE" | "INACTIVE" | null) || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const activityCategoryViewFiltersToUrlParams = (
  filters: ActivityCategoryFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const activityCategoryViewUrlParamsToFilters = (
  params: URLSearchParams,
): ActivityCategoryFilterParams => {
  const sortDirection = params.get("sortDirection");
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "categoryName",
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};

export const tourViewFiltersToUrlParams = (
  filters: TourFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.tourType) params.set("tourType", filters.tourType);
  if (filters.tourCategory) params.set("tourCategory", filters.tourCategory);
  if (filters.season) params.set("season", filters.season);
  if (filters.location) params.set("location", filters.location);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());

  return params;
};

export const tourViewUrlParamsToFilters = (
  params: URLSearchParams,
): TourFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: params.get("minPrice")
      ? parseFloat(params.get("minPrice")!)
      : null,
    maxPrice: params.get("maxPrice")
      ? parseFloat(params.get("maxPrice")!)
      : null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    tourType: params.get("tourType") || null,
    tourCategory: params.get("tourCategory") || null,
    season: params.get("season") || null,
    location: params.get("location") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
  };
};

export const tourCategoryViewFiltersToUrlParams = (
  filters: TourCategoryFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const tourCategoryViewUrlParamsToFilters = (
  params: URLSearchParams,
): TourCategoryFilterParams => {
  const sortDirection = params.get("sortDirection");
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "categoryName",
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};

export const tourTypeViewFiltersToUrlParams = (
  filters: TourTypeFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const tourTypeViewUrlParamsToFilters = (
  params: URLSearchParams,
): TourTypeFilterParams => {
  const sortDirection = params.get("sortDirection");
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "typeName",
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};

export const packageViewFiltersToUrlParams = (
  filters: PackageFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.packageType) params.set("packageType", filters.packageType);
  if (filters.location) params.set("location", filters.location);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
  if (filters.minGroupSize)
    params.set("minGroupSize", filters.minGroupSize.toString());
  if (filters.maxGroupSize)
    params.set("maxGroupSize", filters.maxGroupSize.toString());
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());

  return params;
};

export const packageViewUrlParamsToFilters = (
  params: URLSearchParams,
): PackageFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: params.get("minPrice")
      ? parseFloat(params.get("minPrice")!)
      : null,
    maxPrice: params.get("maxPrice")
      ? parseFloat(params.get("maxPrice")!)
      : null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    packageType: params.get("packageType") || null,
    location: params.get("location") || null,
    minGroupSize: params.get("minGroupSize")
      ? parseInt(params.get("minGroupSize")!)
      : null,
    maxGroupSize: params.get("maxGroupSize")
      ? parseInt(params.get("maxGroupSize")!)
      : null,
    fromDate: params.get("fromDate") || null,
    toDate: params.get("toDate") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
  };
};

export const packageTypeViewFiltersToUrlParams = (
  filters: PackageTypeFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const packageTypeViewUrlParamsToFilters = (
  params: URLSearchParams,
): PackageTypeFilterParams => {
  const sortDirection = params.get("sortDirection");
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "typeName",
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};

export const activityScheduleViewFiltersToUrlParams = (
  filters: ActivityScheduleFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.activityId)
    params.set("activityId", filters.activityId.toString());
  if (filters.destinationId)
    params.set("destinationId", filters.destinationId.toString());
  if (filters.packageScheduleId)
    params.set("packageScheduleId", filters.packageScheduleId.toString());
  if (filters.tourScheduleId)
    params.set("tourScheduleId", filters.tourScheduleId.toString());
  if (filters.activityCategory)
    params.set("activityCategory", filters.activityCategory);
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  if (filters.season) params.set("season", filters.season);
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const activityScheduleViewUrlParamsToFilters = (
  params: URLSearchParams,
): ActivityScheduleFilterParams => {
  return {
    name: params.get("name") || null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    activityId: params.get("activityId")
      ? parseInt(params.get("activityId")!)
      : null,
    destinationId: params.get("destinationId")
      ? parseInt(params.get("destinationId")!)
      : null,
    packageScheduleId: params.get("packageScheduleId")
      ? parseInt(params.get("packageScheduleId")!)
      : null,
    tourScheduleId: params.get("tourScheduleId")
      ? parseInt(params.get("tourScheduleId")!)
      : null,
    activityCategory: params.get("activityCategory") || null,
    fromDate: params.get("fromDate") || null,
    toDate: params.get("toDate") || null,
    season: params.get("season") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || null,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const tourScheduleViewFiltersToUrlParams = (
  filters: TourScheduleFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.tourId) params.set("tourId", filters.tourId.toString());
  if (filters.tourTypeId)
    params.set("tourTypeId", filters.tourTypeId.toString());
  if (filters.tourCategoryId)
    params.set("tourCategoryId", filters.tourCategoryId.toString());
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  if (filters.seasonId) params.set("seasonId", filters.seasonId.toString());
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const tourScheduleViewUrlParamsToFilters = (
  params: URLSearchParams,
): TourScheduleFilterParams => {
  return {
    name: params.get("name") || null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    tourId: params.get("tourId") ? parseInt(params.get("tourId")!) : null,
    tourTypeId: params.get("tourTypeId")
      ? parseInt(params.get("tourTypeId")!)
      : null,
    tourCategoryId: params.get("tourCategoryId")
      ? parseInt(params.get("tourCategoryId")!)
      : null,
    fromDate: params.get("fromDate") || null,
    toDate: params.get("toDate") || null,
    seasonId: params.get("seasonId") ? parseInt(params.get("seasonId")!) : null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "",
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const packageScheduleViewFiltersToUrlParams = (
  filters: PackageScheduleFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.packageId) params.set("packageId", filters.packageId.toString());
  if (filters.tourScheduleId)
    params.set("tourScheduleId", filters.tourScheduleId.toString());
  if (filters.tourId) params.set("tourId", filters.tourId.toString());
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const packageScheduleViewUrlParamsToFilters = (
  params: URLSearchParams,
): PackageScheduleFilterParams => {
  return {
    name: params.get("name") || null,
    packageId: params.get("packageId")
      ? parseInt(params.get("packageId")!)
      : null,
    tourScheduleId: params.get("tourScheduleId")
      ? parseInt(params.get("tourScheduleId")!)
      : null,
    tourId: params.get("tourId") ? parseInt(params.get("tourId")!) : null,
    startDate: params.get("startDate") || null,
    endDate: params.get("endDate") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "",
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const seasonsViewFiltersToUrlParams = (
  filters: SeasonFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.isPeak !== null) params.set("isPeak", filters.isPeak.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const seasonsViewUrlParamsToFilters = (
  params: URLSearchParams,
): SeasonFilterParams => {
  const sortDirection = params.get("sortDirection");
  const isPeak = params.get("isPeak");
  return {
    name: params.get("name") || null,
    isPeak: isPeak !== null ? isPeak === "true" : null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "displayOrder",
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};

export const employeeViewFiltersToUrlParams = (
  filters: EmployeeFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.employeeTypeId)
    params.set("employeeTypeId", filters.employeeTypeId.toString());
  if (filters.departmentId)
    params.set("departmentId", filters.departmentId.toString());
  if (filters.employmentType)
    params.set("employmentType", filters.employmentType);
  if (filters.workLocation) params.set("workLocation", filters.workLocation);
  if (filters.employeeGrade) params.set("employeeGrade", filters.employeeGrade);
  if (filters.supervisorId)
    params.set("supervisorId", filters.supervisorId.toString());
  if (filters.reportingManagerId)
    params.set("reportingManagerId", filters.reportingManagerId.toString());
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const employeeViewUrlParamsToFilters = (
  params: URLSearchParams,
): EmployeeFilterParams => {
  return {
    name: params.get("name") || null,
    employeeTypeId: params.get("employeeTypeId")
      ? parseInt(params.get("employeeTypeId")!)
      : null,
    status: params.get("status") || null,
    departmentId: params.get("departmentId")
      ? parseInt(params.get("departmentId")!)
      : null,
    employmentType: params.get("employmentType") || null,
    workLocation: params.get("workLocation") || null,
    employeeGrade: params.get("employeeGrade") || null,
    supervisorId: params.get("supervisorId")
      ? parseInt(params.get("supervisorId")!)
      : null,
    reportingManagerId: params.get("reportingManagerId")
      ? parseInt(params.get("reportingManagerId")!)
      : null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 12,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const privilegeViewFiltersToUrlParams = (
  filters: PrivilegeFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const privilegeViewUrlParamsToFilters = (
  params: URLSearchParams,
): PrivilegeFilterParams => {
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 12,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") as
      | "name"
      | "privilegeId"
      | "privilegeStatus"
      | "createdAt"
      | "updatedAt"
      | undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const rolesViewFiltersToUrlParams = (
  filters: RoleFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const rolesViewUrlParamsToFilters = (
  params: URLSearchParams,
): RoleFilterParams => {
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 12,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") as
      | "name"
      | "roleId"
      | "roleStatus"
      | "createdAt"
      | "updatedAt"
      | undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const bookingsViewFiltersToUrlParams = (
  filters: BookingFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
  if (filters.bookingReference)
    params.set("bookingReference", filters.bookingReference);
  if (filters.discountAmount)
    params.set("discountAmount", filters.discountAmount.toString());
  if (filters.travelStartDate)
    params.set("travelStartDate", filters.travelStartDate);
  if (filters.travelEndDate) params.set("travelEndDate", filters.travelEndDate);
  if (filters.bookingFrom) params.set("bookingFrom", filters.bookingFrom);
  if (filters.bookingTo) params.set("bookingTo", filters.bookingTo);
  if (filters.bookingStatusId)
    params.set("bookingStatusId", filters.bookingStatusId.toString());
  if (filters.tourId) params.set("tourId", filters.tourId.toString());
  if (filters.packageId) params.set("packageId", filters.packageId.toString());
  if (filters.assignTo) params.set("assignTo", filters.assignTo.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const bookingsViewUrlParamsToFilters = (
  params: URLSearchParams,
): BookingFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: params.get("minPrice")
      ? parseFloat(params.get("minPrice")!)
      : null,
    maxPrice: params.get("maxPrice")
      ? parseFloat(params.get("maxPrice")!)
      : null,
    bookingReference: params.get("bookingReference") || null,
    discountAmount: params.get("discountAmount")
      ? parseFloat(params.get("discountAmount")!)
      : null,
    travelStartDate: params.get("travelStartDate") || null,
    travelEndDate: params.get("travelEndDate") || null,
    bookingFrom: params.get("bookingFrom") || null,
    bookingTo: params.get("bookingTo") || null,
    bookingStatusId: params.get("bookingStatusId")
      ? parseInt(params.get("bookingStatusId")!)
      : null,
    tourId: params.get("tourId") ? parseInt(params.get("tourId")!) : null,
    packageId: params.get("packageId")
      ? parseInt(params.get("packageId")!)
      : null,
    assignTo: params.get("assignTo") ? parseInt(params.get("assignTo")!) : null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || null,
    sortDirection: params.get("sortDirection") || "ASC",
  };
};

export const bookingStatusViewFiltersToUrlParams = (
  filters: BookingStatusFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const bookingStatusViewUrlParamsToFilters = (
  params: URLSearchParams,
): BookingStatusFilterParams => {
  const sortDirection = params.get("sortDirection");
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "statusName",
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};

export const assignBookingsFiltersToUrlParams = (
  filters: UnassignBookingFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.bookingReference)
    params.set("bookingReference", filters.bookingReference);
  if (filters.bookingStatusId)
    params.set("bookingStatusId", filters.bookingStatusId.toString());
  if (filters.customerName) params.set("customerName", filters.customerName);
  if (filters.email) params.set("email", filters.email);
  if (filters.mobileNumber) params.set("mobileNumber", filters.mobileNumber);
  if (filters.tourId) params.set("tourId", filters.tourId.toString());
  if (filters.packageId) params.set("packageId", filters.packageId.toString());
  if (filters.packageScheduleId)
    params.set("packageScheduleId", filters.packageScheduleId.toString());
  if (filters.bookingDateFrom)
    params.set("bookingDateFrom", filters.bookingDateFrom);
  if (filters.bookingDateTo) params.set("bookingDateTo", filters.bookingDateTo);
  if (filters.travelStartDateFrom)
    params.set("travelStartDateFrom", filters.travelStartDateFrom);
  if (filters.travelStartDateTo)
    params.set("travelStartDateTo", filters.travelStartDateTo);
  if (filters.assignTo) params.set("assignTo", filters.assignTo.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const assignBookingsUrlParamsToFilters = (
  params: URLSearchParams,
): UnassignBookingFilterParams => {
  return {
    name: params.get("name") || null,
    bookingReference: params.get("bookingReference") || null,
    bookingStatusId: params.get("bookingStatusId")
      ? parseInt(params.get("bookingStatusId")!)
      : null,
    customerName: params.get("customerName") || null,
    email: params.get("email") || null,
    mobileNumber: params.get("mobileNumber") || null,
    tourId: params.get("tourId") ? parseInt(params.get("tourId")!) : null,
    packageId: params.get("packageId")
      ? parseInt(params.get("packageId")!)
      : null,
    packageScheduleId: params.get("packageScheduleId")
      ? parseInt(params.get("packageScheduleId")!)
      : null,
    bookingDateFrom: params.get("bookingDateFrom") || null,
    bookingDateTo: params.get("bookingDateTo") || null,
    travelStartDateFrom: params.get("travelStartDateFrom") || null,
    travelStartDateTo: params.get("travelStartDateTo") || null,
    assignTo: params.get("assignTo") ? parseInt(params.get("assignTo")!) : null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || null,
    sortDirection: params.get("sortDirection") || "ASC",
  };
};

export const bookingHistoryFiltersToUrlParams = (
  filters: BookingHistoryFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
  if (filters.bookingReference)
    params.set("bookingReference", filters.bookingReference);
  if (filters.travelStartDate)
    params.set("travelStartDate", filters.travelStartDate);
  if (filters.travelEndDate) params.set("travelEndDate", filters.travelEndDate);
  if (filters.bookingFrom) params.set("bookingFrom", filters.bookingFrom);
  if (filters.bookingTo) params.set("bookingTo", filters.bookingTo);
  if (filters.tourId) params.set("tourId", filters.tourId.toString());
  if (filters.packageId) params.set("packageId", filters.packageId.toString());
  if (filters.bookingStatusId)
    params.set("bookingStatusId", filters.bookingStatusId.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const bookingHistoryUrlParamsToFilters = (
  params: URLSearchParams,
): BookingHistoryFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: params.get("minPrice")
      ? parseFloat(params.get("minPrice")!)
      : null,
    maxPrice: params.get("maxPrice")
      ? parseFloat(params.get("maxPrice")!)
      : null,
    bookingReference: params.get("bookingReference") || null,
    travelStartDate: params.get("travelStartDate") || null,
    travelEndDate: params.get("travelEndDate") || null,
    bookingFrom: params.get("bookingFrom") || null,
    bookingTo: params.get("bookingTo") || null,
    tourId: params.get("tourId") ? parseInt(params.get("tourId")!) : null,
    packageId: params.get("packageId")
      ? parseInt(params.get("packageId")!)
      : null,
    bookingStatusId: params.get("bookingStatusId")
      ? parseInt(params.get("bookingStatusId")!)
      : null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || null,
    sortDirection: params.get("sortDirection") || "ASC",
  };
};

export const commonHeroSectionViewFiltersToUrlParams = (
  filters: HeroSectionFilterParamsWithType,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.title) params.set("title", filters.title);
  if (filters.subTitle) params.set("subTitle", filters.subTitle);
  if (filters.description) params.set("description", filters.description);
  if (filters.primaryButtonText)
    params.set("primaryButtonText", filters.primaryButtonText);
  if (filters.secondaryButtonText)
    params.set("secondaryButtonText", filters.secondaryButtonText);
  if (filters.status) params.set("status", filters.status);
  if (filters.heroSectionType)
    params.set("heroSectionType", filters.heroSectionType);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const commonHeroSectionViewUrlParamsToFilters = (
  params: URLSearchParams,
): HeroSectionFilterParamsWithType => {
  return {
    name: params.get("name") || null,
    heroSectionType: params.get("heroSectionType") || "",
    title: params.get("title") || null,
    subTitle: params.get("subTitle") || null,
    description: params.get("description") || null,
    primaryButtonText: params.get("primaryButtonText") || null,
    secondaryButtonText: params.get("secondaryButtonText") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "id",
    sortDirection: (params.get("sortDirection") === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};
