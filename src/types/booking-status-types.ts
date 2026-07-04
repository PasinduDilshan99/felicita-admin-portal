// types/booking-status-types.ts

import { ApiResponse } from "./common-types";

// ============ Booking Status Statistics ============
export interface BookingStatusStatisticsSummary {
  totalStatuses: number;
  activeStatuses: number;
  mostUsedStatus: string;
  mostUsedStatusCount: number;
  inquiryToBookedPercentage: number;
}

export interface BookingStatusDistribution {
  bookingStatusId: number;
  bookingStatusName: string;
  totalBookings: number;
  percentage: number;
}

export interface BookingStatusFunnel {
  stepOrder: number;
  bookingStatusName: string;
  totalBookings: number;
  conversionPercentage: number;
}

export interface BookingStatusTrend {
  year: number;
  month: number;
  bookingStatusId: number;
  bookingStatusName: string;
  totalBookings: number;
}

export interface BookingDropOffStatistics {
  bookingStatusName: string;
  totalBookings: number;
  percentage: number;
}

export interface BookingStatusStatisticsData {
  summary: BookingStatusStatisticsSummary;
  statusDistributions: BookingStatusDistribution[];
  statusFunnels: BookingStatusFunnel[];
  statusTrends: BookingStatusTrend[];
  dropOffStatistics: BookingDropOffStatistics[];
}

export type BookingStatusStatisticsApiResponse = ApiResponse<BookingStatusStatisticsData>;

// ============ Booking Status List ============
export interface BookingStatusListItem {
  statusId: number;
  statusName: string;
  description: string;
  status: string;
}

export type BookingStatusListApiResponse = ApiResponse<BookingStatusListItem[]>;

// ============ Booking Status Basic Details ============
export interface BookingStatusBasicDetails {
  statusId: number;
  statusName: string;
  description: string;
  status: string;
}

export type BookingStatusBasicDetailsApiResponse = ApiResponse<BookingStatusBasicDetails>;

// ============ Booking Status All Details ============
export interface BookingStatusAllDetails {
  statusId: number;
  statusName: string;
  description: string;
  status: string;
  totalBookingsUsingThisStatus: number;
  activeBookingsCount: number;
  completedBookingsCount: number | null;
  cancelledBookingsCount: number | null;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
}

export type BookingStatusAllDetailsApiResponse = ApiResponse<BookingStatusAllDetails>;

// ============ Create Booking Status ============
export interface CreateBookingStatusRequest {
  statusName: string;
  description: string;
  status: string;
}

export interface CreateBookingStatusResponse {
  message: string | null;
}

export type CreateBookingStatusApiResponse = ApiResponse<CreateBookingStatusResponse>;

// ============ Update Booking Status ============
export interface UpdateBookingStatusRequest {
  statusId: number;
  statusName: string;
  description: string;
  status: string;
}

export interface UpdateBookingStatusResponse {
  message: string | null;
  id: number | null;
}

export type UpdateBookingStatusApiResponse = ApiResponse<UpdateBookingStatusResponse>;

// ============ Terminate Booking Status ============
export interface TerminateBookingStatusRequest {
  id: number;
}

export interface TerminateBookingStatusResponse {
  message: string | null;
}

export type TerminateBookingStatusApiResponse = ApiResponse<TerminateBookingStatusResponse>;

// ============ Get Booking Status Basic Details Request ============
export interface GetBookingStatusBasicDetailsRequest {
  id: number;
}

// ============ Get Booking Status All Details Request ============
export interface GetBookingStatusAllDetailsRequest {
  id: number;
}