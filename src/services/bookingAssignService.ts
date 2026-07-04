import {
  UnassignBookingListApiResponse,
  UnassignBookingFilterParams,
  UnassignBookingRequestParamsApiResponse,
  UnassignBookingIdListApiResponse,
  AssignBookingRequest,
  AssignBookingApiResponse,
  UpdateUnassignBookingRequest,
  UpdateUnassignBookingApiResponse,
  BookingAssignStatisticsApiResponse,
} from "@/types/booking-assign-types";
import { ASSIGN_UNASSIGN_BOOKING_DATA_FE, GET_ASSIGN_BOOKINGS_LIST_DATA_FE, GET_BOOKINGS_ASSIGN_STATISTICS_DATA_FE, GET_UNASSIGN_BOOKINGS_DATA_FE, GET_UNASSIGN_BOOKINGS_LIST_DATA_FE, GET_UNASSIGN_BOOKINGS_REQUEST_PARAM_DATA_FE, UPDATE_UNASSIGN_BOOKING_DATA_FE } from "@/utils/frontEndConstant";

export class BookingAssignService {
  // ============ GET APIs ============

  /**
   * Get unassigned bookings with pagination and filtering
   */
  static async getUnassignBookings(
    params: UnassignBookingFilterParams,
  ): Promise<UnassignBookingListApiResponse> {
    try {
      const response = await fetch(GET_UNASSIGN_BOOKINGS_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: params.name || null,
          bookingReference: params.bookingReference || null,
          bookingStatusId: params.bookingStatusId || null,
          customerName: params.customerName || null,
          email: params.email || null,
          mobileNumber: params.mobileNumber || null,
          tourId: params.tourId || null,
          packageId: params.packageId || null,
          packageScheduleId: params.packageScheduleId || null,
          bookingDateFrom: params.bookingDateFrom || null,
          bookingDateTo: params.bookingDateTo || null,
          travelStartDateFrom: params.travelStartDateFrom || null,
          travelStartDateTo: params.travelStartDateTo || null,
          assignTo: params.assignTo || null,
          pageSize: params.pageSize,
          pageNumber: params.pageNumber,
          sortBy: params.sortBy || null,
          sortDirection: params.sortDirection || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UnassignBookingListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch unassign bookings");
      }

      return data;
    } catch (error) {
      console.error("Error fetching unassign bookings:", error);
      throw error;
    }
  }

  /**
   * Get unassign booking request parameters for filters
   */
  static async getUnassignBookingRequestParams(): Promise<UnassignBookingRequestParamsApiResponse> {
    try {
      const response = await fetch(GET_UNASSIGN_BOOKINGS_REQUEST_PARAM_DATA_FE, {
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

      const data: UnassignBookingRequestParamsApiResponse =
        await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch unassign booking request parameters",
        );
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching unassign booking request parameters:",
        error,
      );
      throw error;
    }
  }

  /**
   * Get unassign booking list (IDs and references)
   */
  static async getUnassignBookingList(): Promise<UnassignBookingIdListApiResponse> {
    try {
      const response = await fetch(GET_UNASSIGN_BOOKINGS_LIST_DATA_FE, {
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

      const data: UnassignBookingIdListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch unassign booking list",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching unassign booking list:", error);
      throw error;
    }
  }

  /**
   * Get assign booking list (IDs and references)
   */
  static async getAssignBookingList(): Promise<UnassignBookingIdListApiResponse> {
    try {
      const response = await fetch(GET_ASSIGN_BOOKINGS_LIST_DATA_FE, {
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

      const data: UnassignBookingIdListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch assign booking list");
      }

      return data;
    } catch (error) {
      console.error("Error fetching assign booking list:", error);
      throw error;
    }
  }

  /**
   * Get booking assign statistics
   */
  static async getBookingAssignStatistics(): Promise<BookingAssignStatisticsApiResponse> {
    try {
      const response = await fetch(GET_BOOKINGS_ASSIGN_STATISTICS_DATA_FE, {
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

      const data: BookingAssignStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch booking assign statistics",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching booking assign statistics:", error);
      throw error;
    }
  }

  // ============ CREATE/UPDATE APIs ============

  /**
   * Assign a booking to an employee
   */
  static async assignBooking(
    assignData: AssignBookingRequest,
  ): Promise<AssignBookingApiResponse> {
    try {
      const response = await fetch(ASSIGN_UNASSIGN_BOOKING_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(assignData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AssignBookingApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to assign booking");
      }

      return data;
    } catch (error) {
      console.error("Error assigning booking:", error);
      throw error;
    }
  }

  /**
   * Update unassign booking assignment
   */
  static async updateUnassignBooking(
    updateData: UpdateUnassignBookingRequest,
  ): Promise<UpdateUnassignBookingApiResponse> {
    try {
      const response = await fetch(UPDATE_UNASSIGN_BOOKING_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateUnassignBookingApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update unassign booking");
      }

      return data;
    } catch (error) {
      console.error("Error updating unassign booking:", error);
      throw error;
    }
  }

  // ============ Helper Methods ============

  /**
   * Helper method to get assignment status badge color
   */
  static getAssignmentStatusColor(assignmentType: string): string {
    switch (assignmentType) {
      case "ASSIGNED":
        return "bg-green-100 text-green-800";
      case "UNASSIGNED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

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
   * Helper method to get default assign form data
   */
  static getDefaultAssignFormData(bookingId: number): AssignBookingRequest {
    return {
      bookingId: bookingId,
      assignTo: 0,
      assignUsername: "",
      assignMessage: "",
    };
  }

  /**
   * Helper method to validate assign form data
   */
  static validateAssignForm(
    formData: Partial<AssignBookingRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.bookingId || formData.bookingId <= 0) {
      errors.bookingId = "Booking ID is required";
    }

    if (!formData.assignTo || formData.assignTo <= 0) {
      errors.assignTo = "Employee selection is required";
    }

    if (!formData.assignUsername?.trim()) {
      errors.assignUsername = "Username is required";
    }

    return errors;
  }

  /**
   * Helper method to get employee workload color
   */
  static getWorkloadColor(totalBookings: number, average: number): string {
    const ratio = totalBookings / average;
    if (ratio <= 0.8) return "text-green-600";
    if (ratio <= 1.2) return "text-yellow-600";
    if (ratio <= 1.5) return "text-orange-600";
    return "text-red-600";
  }

  /**
   * Helper method to get workload badge color
   */
  static getWorkloadBadgeColor(totalBookings: number, average: number): string {
    const ratio = totalBookings / average;
    if (ratio <= 0.8) return "bg-green-100 text-green-800";
    if (ratio <= 1.2) return "bg-yellow-100 text-yellow-800";
    if (ratio <= 1.5) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  }

  /**
   * Helper method to get month name
   */
  static getMonthName(month: number): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] || "Unknown";
  }
}
