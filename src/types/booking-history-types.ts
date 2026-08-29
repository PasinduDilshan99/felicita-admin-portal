// types/booking-history-types.ts

import { ApiResponse } from "./common-types";

// ============ Booking History Basic Details ============
export interface BookingHistoryBasicDetails {
  bookingId: number;
  bookingReference: string;
  customerName: string;
  tourName: string;
  packageName: string;
  totalPersons: number;
  bookingDate: string;
  travelStartDate: string | null;
  travelEndDate: string | null;
  finalAmount: number;
  paidAmount: number;
  dueAmount: number;
  refundAmount: number;
  bookingStatus: string;
  assignedEmployee: string;
  history: string | null;
}

export interface BookingHistoryResponse {
  bookingHistoryCount: number;
  bookingHistoryBasicDetailsResponses: BookingHistoryBasicDetails[];
}

export type BookingHistoryListApiResponse = ApiResponse<BookingHistoryResponse>;

// ============ Booking History Filter Params ============
export interface BookingHistoryFilterParams {
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  bookingReference: string | null;
  travelStartDate: string | null;
  travelEndDate: string | null;
  bookingFrom: string | null;
  bookingTo: string | null;
  tourId: number | null;
  packageId: number | null;
  bookingStatusId: number | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string | null;
  sortDirection: string | null;
}

// ============ Booking History Request Params ============
export interface BookingHistoryRequestParams {
  bookingRefences: string[];
  bookingStatuses: { bookingStatusId: number; bookingStatusName: string }[];
  tours: { tourId: number; tourName: string }[];
  packages: { packageId: number; packageName: string }[];
  assignedEmployees: { employeeId: number; employeeName: string }[];
}

export type BookingHistoryRequestParamsApiResponse = ApiResponse<BookingHistoryRequestParams>;

// ============ Booking History Statistics ============
export interface BookingHistoryStatisticsSummary {
  totalBookings: number;
  totalRevenue: number;
  firstBookingDate: string;
  latestBookingDate: string;
  averageMonthlyBookings: number;
  averageMonthlyRevenue: number;
}

export interface BookingGrowthTrend {
  year: number;
  month: number;
  totalBookings: number;
}

export interface RevenueGrowthTrend {
  year: number;
  month: number;
  totalRevenue: number;
}

export interface BookingStatusHistory {
  year: number;
  month: number;
  bookingStatusId: number;
  bookingStatusName: string;
  totalBookings: number;
}

export interface CancellationTrend {
  year: number;
  month: number;
  totalCancelledBookings: number;
  cancellationRate: number;
}

export interface HistoricalTopTour {
  tourId: number;
  tourName: string;
  totalBookings: number;
  totalParticipants: number;
  totalRevenue: number;
}

export interface CustomerReturnStatistics {
  customerType: string;
  totalCustomers: number;
  percentage: number;
}

export interface PeakBookingPeriod {
  month: number;
  monthName: string;
  totalBookings: number;
}

export interface BookingHistoryStatisticsData {
  summary: BookingHistoryStatisticsSummary;
  bookingGrowthTrends: BookingGrowthTrend[];
  revenueGrowthTrends: RevenueGrowthTrend[];
  bookingStatusHistories: BookingStatusHistory[];
  cancellationTrends: CancellationTrend[];
  historicalTopTours: HistoricalTopTour[];
  customerReturnStatistics: CustomerReturnStatistics[];
  peakBookingPeriods: PeakBookingPeriod[];
}

export type BookingHistoryStatisticsApiResponse = ApiResponse<BookingHistoryStatisticsData>;

// ============ Booking History Details ============
export interface BookingActivityHistory {
  activityType: string;
  description: string;
  updatedBy: string;
  updatedAt: string;
}

export interface BookingStatusHistoryDetail {
  previousStatus: string;
  newStatus: string;
  updatedBy: string;
  updatedAt: string;
}

export interface BookingAssignmentHistory {
  previousEmployee: string;
  newEmployee: string;
  updatedBy: string;
  updatedAt: string;
}

export interface BookingPaymentHistory {
  previousPaidAmount: number;
  newPaidAmount: number;
  previousDueAmount: number;
  newDueAmount: number;
  previousRefundAmount: number;
  newRefundAmount: number;
  paymentReference: string;
  remarks: string;
  updatedBy: string;
  updatedAt: string;
}

// Using the existing BookingsBasicDetails from booking-types
export interface BookingHistoryDetails {
  bookingsBasicDetails: import("./booking-types").BookingBasicDetails;
  bookingActivityHistories: BookingActivityHistory[];
  bookingStatusHistories: BookingStatusHistoryDetail[];
  bookingAssignmentHistories: BookingAssignmentHistory[];
  bookingPaymentHistories: BookingPaymentHistory[];
}

export type BookingHistoryDetailsApiResponse = ApiResponse<BookingHistoryDetails>;

// ============ Request Types ============
export interface GetBookingHistoryDetailsRequest {
  id: number;
}