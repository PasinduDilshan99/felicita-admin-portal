// services/bookingHistoryService.ts

import {
  BookingHistoryListApiResponse,
  BookingHistoryFilterParams,
  BookingHistoryRequestParamsApiResponse,
  BookingHistoryStatisticsApiResponse,
  BookingHistoryDetailsApiResponse,
  GetBookingHistoryDetailsRequest,
} from "@/types/booking-history-types";
import { GET_BOOKINGS_HISTORY_DATA_FE, GET_BOOKINGS_HISTORY_DETAILS_DATA_FE, GET_BOOKINGS_HISTORY_REQUEST_PARAM_DATA_FE, GET_BOOKINGS_HISTORY_STATISTICS_DATA_FE } from "@/utils/frontEndConstant";


export class BookingHistoryService {
  // ============ GET APIs ============

  /**
   * Get booking history with pagination and filtering
   */
  static async getBookingHistory(
    params: BookingHistoryFilterParams
  ): Promise<BookingHistoryListApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_HISTORY_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: params.name || null,
          minPrice: params.minPrice || null,
          maxPrice: params.maxPrice || null,
          bookingReference: params.bookingReference || null,
          travelStartDate: params.travelStartDate || null,
          travelEndDate: params.travelEndDate || null,
          bookingFrom: params.bookingFrom || null,
          bookingTo: params.bookingTo || null,
          tourId: params.tourId || null,
          packageId: params.packageId || null,
          bookingStatusId: params.bookingStatusId || null,
          pageSize: params.pageSize,
          pageNumber: params.pageNumber,
          sortBy: params.sortBy || null,
          sortDirection: params.sortDirection || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BookingHistoryListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch booking history");
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking history:", error);
      throw error;
    }
  }

  /**
   * Get booking history request parameters for filters
   */
  static async getBookingHistoryRequestParams(): Promise<BookingHistoryRequestParamsApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_HISTORY_REQUEST_PARAM_DATA_FE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BookingHistoryRequestParamsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch booking history request parameters");
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking history request parameters:", error);
      throw error;
    }
  }

  /**
   * Get booking history statistics
   */
  static async getBookingHistoryStatistics(): Promise<BookingHistoryStatisticsApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_HISTORY_STATISTICS_DATA_FE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BookingHistoryStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch booking history statistics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking history statistics:", error);
      throw error;
    }
  }

  /**
   * Get booking history details by booking ID
   */
  static async getBookingHistoryDetails(
    bookingId: number
  ): Promise<BookingHistoryDetailsApiResponse> {
    try {
      const requestBody: GetBookingHistoryDetailsRequest = { id: bookingId };
      
      const response = await fetch(GET_BOOKINGS_HISTORY_DETAILS_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BookingHistoryDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch booking history details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking history details:", error);
      throw error;
    }
  }

  // ============ Helper Methods ============

  /**
   * Helper method to format currency
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Helper method to format date
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Helper method to format datetime
   */
  static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  /**
   * Helper method to get activity type badge color
   */
  static getActivityTypeColor(activityType: string): string {
    const typeMap: Record<string, string> = {
      "CREATED_BOOKING": "bg-blue-100 text-blue-800",
      "UPDATED_BOOKING": "bg-yellow-100 text-yellow-800",
      "CANCELLED_BOOKING": "bg-red-100 text-red-800",
      "CONFIRMED_BOOKING": "bg-green-100 text-green-800",
      "COMPLETED_BOOKING": "bg-purple-100 text-purple-800",
      "PAYMENT_RECEIVED": "bg-emerald-100 text-emerald-800",
      "REFUND_PROCESSED": "bg-pink-100 text-pink-800",
      "ASSIGNED_BOOKING": "bg-indigo-100 text-indigo-800",
      "STATUS_CHANGED": "bg-orange-100 text-orange-800",
    };
    return typeMap[activityType] || "bg-gray-100 text-gray-800";
  }

  /**
   * Helper method to get cancellation rate color
   */
  static getCancellationRateColor(rate: number): string {
    if (rate <= 10) return "text-green-600";
    if (rate <= 25) return "text-yellow-600";
    if (rate <= 50) return "text-orange-600";
    return "text-red-600";
  }

  /**
   * Helper method to get customer type badge color
   */
  static getCustomerTypeColor(customerType: string): string {
    switch (customerType) {
      case "RETURNING_CUSTOMER":
        return "bg-green-100 text-green-800";
      case "NEW_CUSTOMER":
        return "bg-blue-100 text-blue-800";
      case "VIP_CUSTOMER":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to get month name
   */
  static getMonthName(month: number): string {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1] || "Unknown";
  }

  /**
   * Helper method to get booking status badge color
   */
  static getBookingStatusColor(statusName: string): string {
    const statusMap: Record<string, string> = {
      "NEW_INQUIRY": "bg-blue-100 text-blue-800",
      "PENDING": "bg-yellow-100 text-yellow-800",
      "CONTACTED": "bg-cyan-100 text-cyan-800",
      "QUOTATION_SENT": "bg-indigo-100 text-indigo-800",
      "NEGOTIATION": "bg-orange-100 text-orange-800",
      "CONFIRMED": "bg-green-100 text-green-800",
      "PAYMENT_PENDING": "bg-pink-100 text-pink-800",
      "BOOKED": "bg-green-100 text-green-800",
      "COMPLETED": "bg-purple-100 text-purple-800",
      "CANCELLED": "bg-red-100 text-red-800",
      "REJECTED": "bg-red-100 text-red-800",
      "EXPIRED": "bg-gray-100 text-gray-800",
    };
    return statusMap[statusName] || "bg-gray-100 text-gray-800";
  }

  /**
   * Helper method to format activity type display
   */
  static formatActivityType(activityType: string): string {
    return activityType.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Helper method to get status change display
   */
  static getStatusChangeDisplay(previousStatus: string, newStatus: string): string {
    return `${previousStatus} → ${newStatus}`;
  }

  /**
   * Helper method to get payment change display
   */
  static getPaymentChangeDisplay(
    previousAmount: number,
    newAmount: number,
    type: 'paid' | 'due' | 'refund'
  ): string {
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    if (previousAmount === newAmount) {
      return `${label}: ${this.formatCurrency(newAmount)} (unchanged)`;
    }
    const direction = newAmount > previousAmount ? '↑' : '↓';
    return `${label}: ${this.formatCurrency(previousAmount)} ${direction} ${this.formatCurrency(newAmount)}`;
  }
}