// services/bookingStatusService.ts

import {
  BookingStatusStatisticsApiResponse,
  BookingStatusListApiResponse,
  BookingStatusBasicDetailsApiResponse,
  BookingStatusAllDetailsApiResponse,
  CreateBookingStatusRequest,
  CreateBookingStatusApiResponse,
  UpdateBookingStatusRequest,
  UpdateBookingStatusApiResponse,
  TerminateBookingStatusApiResponse,
  GetBookingStatusBasicDetailsRequest,
  GetBookingStatusAllDetailsRequest,
  TerminateBookingStatusRequest,
  BookingStatusIdAndNameApiResponse,
} from "@/types/booking-status-types";
import {
  ADD_BOOKINGS_STATUS_DATA_FE,
  GET_BOOKING_STATUS_ID_AND_NAMES_FE,
  GET_BOOKINGS_STATUS_ALL_DETAILS_BY_ID_DATA_FE,
  GET_BOOKINGS_STATUS_BASIC_DETAILS_BY_ID_DATA_FE,
  GET_BOOKINGS_STATUSES_DATA_FE,
  GET_BOOKINGS_STATUSES_STATISTICS_DATA_FE,
  TERMINATE_BOOKINGS_STATUS_DATA_FE,
  UPDATE_BOOKINGS_STATUS_DATA_FE,
} from "@/utils/frontEndConstant";

export class BookingStatusService {
  // ============ GET APIs ============

  /**
   * Get booking status statistics
   */
  static async getBookingStatusStatistics(): Promise<BookingStatusStatisticsApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_STATUSES_STATISTICS_DATA_FE, {
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

      const data: BookingStatusStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking status statistics",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking status statistics:", error);
      throw error;
    }
  }

  /**
   * Get all booking statuses
   */
  static async getBookingStatuses(): Promise<BookingStatusListApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_STATUSES_DATA_FE, {
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

      const data: BookingStatusListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch booking statuses");
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking statuses:", error);
      throw error;
    }
  }

  /**
   * Get booking status basic details by ID
   */
  static async getBookingStatusBasicDetails(
    statusId: number,
  ): Promise<BookingStatusBasicDetailsApiResponse> {
    try {
      const requestBody: GetBookingStatusBasicDetailsRequest = { id: statusId };

      const response = await fetch(
        GET_BOOKINGS_STATUS_BASIC_DETAILS_BY_ID_DATA_FE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BookingStatusBasicDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking status basic details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking status basic details:", error);
      throw error;
    }
  }

  /**
   * Get booking status all details by ID (includes usage statistics)
   */
  static async getBookingStatusAllDetails(
    statusId: number,
  ): Promise<BookingStatusAllDetailsApiResponse> {
    try {
      const requestBody: GetBookingStatusAllDetailsRequest = { id: statusId };
      const response = await fetch(
        GET_BOOKINGS_STATUS_ALL_DETAILS_BY_ID_DATA_FE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BookingStatusAllDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking status all details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking status all details:", error);
      throw error;
    }
  }

  // ============ CREATE/UPDATE/DELETE APIs ============

  /**
   * Create a new booking status
   */
  static async createBookingStatus(
    statusData: CreateBookingStatusRequest,
  ): Promise<CreateBookingStatusApiResponse> {
    try {
      const response = await fetch(ADD_BOOKINGS_STATUS_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateBookingStatusApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to create booking status");
      }

      return data;
    } catch (error) {
      console.error("Error creating booking status:", error);
      throw error;
    }
  }

  /**
   * Update an existing booking status
   */
  static async updateBookingStatus(
    statusData: UpdateBookingStatusRequest,
  ): Promise<UpdateBookingStatusApiResponse> {
    try {
      const response = await fetch(UPDATE_BOOKINGS_STATUS_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateBookingStatusApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update booking status");
      }

      return data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  }

  /**
   * Terminate a booking status
   */
  static async terminateBookingStatus(
    statusId: number,
  ): Promise<TerminateBookingStatusApiResponse> {
    try {
      const requestBody: TerminateBookingStatusRequest = { id: statusId };

      const response = await fetch(TERMINATE_BOOKINGS_STATUS_DATA_FE, {
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

      const data: TerminateBookingStatusApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate booking status");
      }

      return data;
    } catch (error) {
      console.error("Error terminating booking status:", error);
      throw error;
    }
  }

  // Add this method to the BookingStatusService class

  /**
   * Get all booking status IDs and names for dropdown/selection
   */
  static async getBookingStatusIdAndNames(): Promise<BookingStatusIdAndNameApiResponse> {
    try {
      const response = await fetch(GET_BOOKING_STATUS_ID_AND_NAMES_FE, {
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

      const data: BookingStatusIdAndNameApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking status IDs and names",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking status IDs and names:", error);
      throw error;
    }
  }

  // ============ Helper Methods ============

  /**
   * Helper method to get status badge color
   */
  static getStatusBadgeColor(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-800";
      case "TERMINATED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to get booking status badge color by name
   */
  static getBookingStatusColor(statusName: string): string {
    const statusMap: Record<string, string> = {
      NEW_INQUIRY: "bg-blue-100 text-blue-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CONTACTED: "bg-cyan-100 text-cyan-800",
      QUOTATION_SENT: "bg-indigo-100 text-indigo-800",
      NEGOTIATION: "bg-orange-100 text-orange-800",
      CONFIRMED: "bg-green-100 text-green-800",
      PAYMENT_PENDING: "bg-pink-100 text-pink-800",
      BOOKED: "bg-green-100 text-green-800",
      COMPLETED: "bg-purple-100 text-purple-800",
      CANCELLED: "bg-red-100 text-red-800",
      REJECTED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-800",
    };
    return statusMap[statusName] || "bg-gray-100 text-gray-800";
  }

  /**
   * Helper method to get default form data for creating a booking status
   */
  static getDefaultCreateFormData(): CreateBookingStatusRequest {
    return {
      statusName: "",
      description: "",
      status: "ACTIVE",
    };
  }

  /**
   * Helper method to get default update form data
   */
  static getDefaultUpdateFormData(
    statusId: number,
  ): UpdateBookingStatusRequest {
    return {
      statusId: statusId,
      statusName: "",
      description: "",
      status: "ACTIVE",
    };
  }

  /**
   * Helper method to validate booking status form data
   */
  static validateBookingStatusForm(
    formData: Partial<CreateBookingStatusRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.statusName?.trim()) {
      errors.statusName = "Status name is required";
    } else if (formData.statusName.length < 3) {
      errors.statusName = "Status name must be at least 3 characters";
    } else if (!/^[A-Z_]+$/.test(formData.statusName)) {
      errors.statusName =
        "Status name must be uppercase letters and underscores only";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!formData.status) {
      errors.status = "Status is required";
    }

    return errors;
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
   * Helper method to get conversion rate display
   */
  static getConversionRateDisplay(percentage: number): string {
    return percentage.toFixed(2) + "%";
  }

  /**
   * Helper method to get drop-off rate color
   */
  static getDropOffRateColor(percentage: number): string {
    if (percentage <= 10) return "text-green-600";
    if (percentage <= 25) return "text-yellow-600";
    if (percentage <= 50) return "text-orange-600";
    return "text-red-600";
  }
}
