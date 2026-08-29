// services/emailService.ts

import {
  RequestHotelRatesRequest,
  RequestHotelRatesApiResponse,
} from "@/types/email-types";
import { REQUEST_HOTEL_RATES_EMAILS_DATA_FE } from "@/utils/frontEndConstant";


export class EmailService {
  /**
   * Request hotel rates via email
   * @param request - The hotel rates request data
   */
  static async requestHotelRates(
    request: RequestHotelRatesRequest
  ): Promise<RequestHotelRatesApiResponse> {
    try {
      const response = await fetch(REQUEST_HOTEL_RATES_EMAILS_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RequestHotelRatesApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to request hotel rates");
      }

      return data;
    } catch (error) {
      console.error("Error requesting hotel rates:", error);
      throw error;
    }
  }
}