// services/bookingService.ts

import {
  BookingIdAndReferenceApiResponse,
  BookingStatisticsApiResponse,
  BookingListApiResponse,
  BookingRequestParamsApiResponse,
  BookingFilterParams,
  BookingAllDetailsApiResponse,
  BookingBasicDetailsApiResponse,
  CreateBookingRequest,
  CreateBookingApiResponse,
  UpdateBookingRequest,
  UpdateBookingApiResponse,
  UpdateBookingStatusRequest,
  UpdateBookingStatusApiResponse,
  TerminateBookingApiResponse,
  GetBookingBasicDetailsRequest,
  GetBookingAllDetailsRequest,
  GetCreateBookingParamsRequest,
  CreateBookingParamsApiResponse,
  TerminateBookingRequest,
  BookingIdAndReference,
} from "@/types/booking-types";
import {
  ADD_BOOKING_DATA_FE,
  GET_BOOKING_ALL_DETAILS_BY_ID_DATA_FE,
  GET_BOOKING_BASIC_DETAILS_BY_ID_DATA_FE,
  GET_BOOKINGS_FOR_REQUEST_DATA_FE,
  GET_BOOKINGS_ID_AND_REFERENCES_DATA_FE,
  GET_BOOKINGS_REQUEST_PARAM_DATA_FE,
  GET_BOOKINGS_STATISTICS_DATA_FE,
  GET_CREATE_BOOKINGS_PARAMS_DATA_FE,
  TERMINATE_BOOKING_BY_ID_DATA_FE,
  UPDATE_BOOKING_DATA_FE,
  UPDATE_BOOKING_STATUS_DATA_FE,
} from "@/utils/frontEndConstant";

export class BookingService {
  // ============ GET APIs ============

  /**
   * Get all booking IDs and references for dropdown/selection
   */
  static async getBookingIdAndReferences(): Promise<BookingIdAndReferenceApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_ID_AND_REFERENCES_DATA_FE, {
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

      const data: BookingIdAndReferenceApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking IDs and references",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking IDs and references:", error);
      throw error;
    }
  }

  /**
   * Get booking statistics
   */
  static async getBookingStatistics(): Promise<BookingStatisticsApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_STATISTICS_DATA_FE, {
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

      const data: BookingStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch booking statistics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking statistics:", error);
      throw error;
    }
  }

  /**
   * Get bookings with pagination and filtering
   */
  static async getBookings(
    params: BookingFilterParams,
  ): Promise<BookingListApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_FOR_REQUEST_DATA_FE, {
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
          discountAmount: params.discountAmount || null,
          travelStartDate: params.travelStartDate || null,
          travelEndDate: params.travelEndDate || null,
          bookingFrom: params.bookingFrom || null,
          bookingTo: params.bookingTo || null,
          pageSize: params.pageSize || null,
          pageNumber: params.pageNumber || null,
          bookingStatusId: params.bookingStatusId || null,
          tourId: params.tourId || null,
          packageId: params.packageId || null,
          assignTo: params.assignTo || null,
          sortBy: params.sortBy || null,
          sortDirection: params.sortDirection || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BookingListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      return data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  }

  /**
   * Get booking request parameters for filters
   */
  static async getBookingRequestParams(): Promise<BookingRequestParamsApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_REQUEST_PARAM_DATA_FE, {
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

      const data: BookingRequestParamsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking request parameters",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking request parameters:", error);
      throw error;
    }
  }

  /**
   * Get booking all details by ID
   */
  static async getBookingAllDetails(
    bookingId: number,
  ): Promise<BookingAllDetailsApiResponse> {
    try {
      const requestBody: GetBookingAllDetailsRequest = { id: bookingId };

      const response = await fetch(GET_BOOKING_ALL_DETAILS_BY_ID_DATA_FE, {
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

      const data: BookingAllDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch booking all details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking all details:", error);
      throw error;
    }
  }

  /**
   * Get booking basic details by ID
   */
  static async getBookingBasicDetails(
    bookingId: number,
  ): Promise<BookingBasicDetailsApiResponse> {
    try {
      const requestBody: GetBookingBasicDetailsRequest = { id: bookingId };

      const response = await fetch(GET_BOOKING_BASIC_DETAILS_BY_ID_DATA_FE, {
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

      const data: BookingBasicDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking basic details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking basic details:", error);
      throw error;
    }
  }

  /**
   * Get create booking parameters
   */
  static async getCreateBookingParams(
    tourId: number,
  ): Promise<CreateBookingParamsApiResponse> {
    try {
      const requestBody: GetCreateBookingParamsRequest = { id: tourId };

      const response = await fetch(GET_CREATE_BOOKINGS_PARAMS_DATA_FE, {
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

      const data: CreateBookingParamsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch create booking parameters",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching create booking parameters:", error);
      throw error;
    }
  }

  // ============ CREATE/UPDATE/DELETE APIs ============

  /**
   * Create a new booking
   */
  static async createBooking(
    bookingData: CreateBookingRequest,
  ): Promise<CreateBookingApiResponse> {
    try {
      const response = await fetch(ADD_BOOKING_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateBookingApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to create booking");
      }

      return data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  /**
   * Update an existing booking
   */
  static async updateBooking(
    bookingData: UpdateBookingRequest,
  ): Promise<UpdateBookingApiResponse> {
    try {
      const response = await fetch(UPDATE_BOOKING_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateBookingApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update booking");
      }

      return data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(
    bookingId: number,
    bookingStatus: string,
  ): Promise<UpdateBookingStatusApiResponse> {
    try {
      const requestBody: UpdateBookingStatusRequest = {
        bookingId,
        bookingStatus,
      };

      const response = await fetch(UPDATE_BOOKING_STATUS_DATA_FE, {
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
   * Terminate a booking
   */
  static async terminateBooking(
    bookingId: number,
  ): Promise<TerminateBookingApiResponse> {
    try {
      const requestBody: TerminateBookingRequest = { id: bookingId };

      const response = await fetch(TERMINATE_BOOKING_BY_ID_DATA_FE, {
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

      const data: TerminateBookingApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate booking");
      }

      return data;
    } catch (error) {
      console.error("Error terminating booking:", error);
      throw error;
    }
  }

  // ============ Helper Methods ============

  /**
   * Helper method to format currency
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
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
   * Helper method to format date with time
   */
  static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  /**
   * Helper method to get payment status badge color
   */
  static getPaymentStatusColor(dueAmount: number, paidAmount: number): string {
    if (dueAmount === 0 && paidAmount > 0) {
      return "bg-green-100 text-green-800";
    } else if (paidAmount > 0 && dueAmount > 0) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  }

  /**
   * Helper method to get payment status text
   */
  static getPaymentStatusText(dueAmount: number, paidAmount: number): string {
    if (dueAmount === 0 && paidAmount > 0) {
      return "Paid";
    } else if (paidAmount > 0 && dueAmount > 0) {
      return "Partially Paid";
    } else {
      return "Unpaid";
    }
  }

  /**
   * Helper method to get item type badge color
   */
  static getItemTypeColor(itemType: string): string {
    switch (itemType) {
      case "TOUR":
        return "bg-blue-100 text-blue-800";
      case "PACKAGE":
        return "bg-purple-100 text-purple-800";
      case "ACTIVITY":
        return "bg-green-100 text-green-800";
      case "HOTEL":
        return "bg-yellow-100 text-yellow-800";
      case "TRANSPORT":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to get booking status badge color
   */
  static getBookingStatusColor(statusName: string): string {
    const statusMap: Record<string, string> = {
      NEW_INQUIRY: "bg-blue-100 text-blue-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      NEGOTIATION: "bg-orange-100 text-orange-800",
      CONFIRMED: "bg-green-100 text-green-800",
      BOOKED: "bg-green-100 text-green-800",
      COMPLETED: "bg-purple-100 text-purple-800",
      CANCELLED: "bg-red-100 text-red-800",
      PAYMENT_PENDING: "bg-pink-100 text-pink-800",
      QUOTATION_SENT: "bg-indigo-100 text-indigo-800",
      CONTACTED: "bg-cyan-100 text-cyan-800",
      EXPIRED: "bg-gray-100 text-gray-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return statusMap[statusName] || "bg-gray-100 text-gray-800";
  }

  /**
   * Helper method to get participant full name
   */
  static getParticipantFullName(participant: {
    firstName: string;
    lastName: string;
  }): string {
    return `${participant.firstName} ${participant.lastName}`.trim();
  }

  /**
   * Helper method to get booking reference from ID
   */
  static getBookingReference(
    bookingId: number,
    bookings: BookingIdAndReference[],
  ): string {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    return booking?.bookingReference || "Unknown";
  }
}
