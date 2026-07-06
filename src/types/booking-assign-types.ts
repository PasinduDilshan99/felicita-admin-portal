// types/booking-assign-types.ts

import { ApiResponse } from "./common-types";

// ============ Unassign Booking List ============
export interface UnassignBookingBasicDetails {
  booking: {
    bookingId: number;
    bookingReference: string;
    bookingDate: string;
    travelStartDate: string | null;
    travelEndDate: string | null;
    totalPersons: number;
  };
  customer: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    nic: string;
    passportNumber: string;
  };
  tour: {
    tourId: number;
    tourName: string;
    description: string;
    duration: number;
    startLocation: string;
    endLocation: string;
  };
  packageDetails: {
    packageId: number;
    packageName: string;
    totalPrice: number;
    pricePerPerson: number;
    minPersonCount: number;
    maxPersonCount: number;
  };
  schedule: {
    packageScheduleId: number;
    scheduleName: string | null;
    assumeStartDate: string | null;
    assumeEndDate: string | null;
  };
  financial: {
    totalAmount: number;
    discountAmount: number;
    taxAmount: number;
    insuranceAmount: number;
    finalAmount: number;
    paidAmount: number;
    dueAmount: number;
  };
  assignment: {
    assignedTo: number;
    assignedUser: string;
    assignMessage: string | null;
  };
  status: {
    bookingStatusId: number;
    bookingStatus: string;
  };
}

export interface UnassignBookingResponse {
  unassignBookingCount: number;
  unassignBookingBasicDetailsResponses: UnassignBookingBasicDetails[];
}

export type UnassignBookingListApiResponse = ApiResponse<UnassignBookingResponse>;

// ============ Unassign Booking Filter Params ============
export interface UnassignBookingFilterParams {
  name: string | null;
  bookingReference: string | null;
  bookingStatusId: number | null;
  customerName: string | null;
  email: string | null;
  mobileNumber: string | null;
  tourId: number | null;
  packageId: number | null;
  packageScheduleId: number | null;
  bookingDateFrom: string | null;
  bookingDateTo: string | null;
  travelStartDateFrom: string | null;
  travelStartDateTo: string | null;
  assignTo: number | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string | null;
  sortDirection: string | null;
}

// ============ Unassign Booking Request Params ============
export interface UnassignBookingRequestParams {
  bookingRefences: string[];
  bookingStatuses: { bookingStatusId: number; bookingStatusName: string }[];
  tours: { tourId: number; tourName: string }[];
  packages: { packageId: number; packageName: string }[];
  packageSchedules: { packageScheduleId: number; packageScheduleName: string }[];
  assignedUsers: { employeeId: number; employeeName: string }[];
}

export type UnassignBookingRequestParamsApiResponse = ApiResponse<UnassignBookingRequestParams>;

// ============ Unassign Booking ID List ============
export interface UnassignBookingId {
  bookingId: number;
  bookingReference: string;
}

export type UnassignBookingIdListApiResponse = ApiResponse<UnassignBookingId[]>;

// ============ Assign Booking ============
export interface AssignBookingRequest {
  bookingId: number;
  assignTo: number;
  assignUsername: string;
  assignMessage: string;
}

export interface AssignBookingResponse {
  message: string;
  id: number;
}

export type AssignBookingApiResponse = ApiResponse<AssignBookingResponse>;

// ============ Update Unassign Booking ============
export interface UpdateUnassignBookingRequest {
  bookingId: number;
  assignTo: number;
  assignUsername: string;
  assignMessage: string;
}

export interface UpdateUnassignBookingResponse {
  message: string;
  id: number;
}

export type UpdateUnassignBookingApiResponse = ApiResponse<UpdateUnassignBookingResponse>;

// ============ Booking Assign Statistics ============
export interface BookingAssignStatisticsSummary {
  totalBookings: number;
  assignedBookings: number;
  unassignedBookings: number;
  totalAssignedEmployees: number;
  averageBookingsPerEmployee: number;
}

export interface EmployeeWorkload {
  employeeId: number;
  userId: number;
  employeeName: string;
  designationName: string;
  departmentName: string;
  totalBookings: number;
}

export interface EmployeeRevenue {
  employeeId: number;
  userId: number;
  employeeName: string;
  totalBookings: number;
  totalRevenue: number;
}

export interface DepartmentDistribution {
  departmentId: number;
  departmentName: string;
  totalBookings: number;
  percentage: number;
}

export interface DesignationDistribution {
  designationId: number;
  designationName: string;
  totalBookings: number;
  percentage: number;
}

export interface MonthlyAssignmentTrend {
  year: number;
  month: number;
  totalAssignedBookings: number;
}

export interface AssignmentStatusDistribution {
  assignmentType: string;
  totalBookings: number;
  percentage: number;
}

export interface BookingAssignStatisticsData {
  summary: BookingAssignStatisticsSummary;
  employeeWorkloads: EmployeeWorkload[];
  employeeRevenues: EmployeeRevenue[];
  departmentDistributions: DepartmentDistribution[];
  designationDistributions: DesignationDistribution[];
  monthlyAssignmentTrends: MonthlyAssignmentTrend[];
  assignmentStatusDistributions: AssignmentStatusDistribution[];
}

export type BookingAssignStatisticsApiResponse = ApiResponse<BookingAssignStatisticsData>;