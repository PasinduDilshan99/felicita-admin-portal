// types/email-types.ts

import { ApiResponse } from "./common-types";

// ============ Request Hotel Rates ============
export interface RequestHotelRatesRequest {
  to: string[];
  cc: string[];
  subject: string;
}

export interface RequestHotelRatesResponse {
  message: string;
}

export type RequestHotelRatesApiResponse = ApiResponse<RequestHotelRatesResponse>;