import { ApiResponse } from "./common-types";

// Booking ID and Reference Response
export interface BookingIdAndReference {
  bookingId: number;
  bookingReference: string;
}

export type BookingIdAndReferenceApiResponse = ApiResponse<
  BookingIdAndReference[]
>;

// ============ Booking Statistics ============
export interface BookingStatisticsSummary {
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  cancelledBookings: number;
  totalTravellers: number;
  averageBookingValue: number;
}

export interface MonthlyBookingTrend {
  year: number;
  month: number;
  totalBookings: number;
}

export interface MonthlyRevenueTrend {
  year: number;
  month: number;
  totalRevenue: number;
}

export interface BookingStatusDistribution {
  bookingStatusId: number;
  bookingStatusName: string;
  totalBookings: number;
  percentage: number;
}

export interface BookingFunnel {
  stepOrder: number;
  bookingStatusName: string;
  totalBookings: number;
  conversionPercentage: number;
}

export interface TopTour {
  tourId: number;
  tourName: string;
  totalBookings: number;
  totalParticipants: number;
  totalRevenue: number;
}

export interface PopularActivity {
  activityId: number;
  activityName: string;
  totalBookings: number;
  totalParticipants: number;
  totalRevenue: number;
}

export interface BookingStatisticsData {
  summary: BookingStatisticsSummary;
  monthlyBookingTrends: MonthlyBookingTrend[];
  monthlyRevenueTrends: MonthlyRevenueTrend[];
  bookingStatusDistributions: BookingStatusDistribution[];
  bookingFunnels: BookingFunnel[];
  topTours: TopTour[];
  popularActivities: PopularActivity[];
}

export type BookingStatisticsApiResponse = ApiResponse<BookingStatisticsData>;

// ============ Booking Basic Details ============
export interface BookingBasicDetails {
  bookingId: number;
  bookingReference: string;
  bookingDate: string;
  travelStartDate: string;
  travelEndDate: string;
  userId: number;
  username: string;
  customerName: string;
  email: string;
  mobileNumber: string;
  tourId: number;
  tourName: string;
  tourDuration: number;
  startLocation: string;
  endLocation: string;
  packageId: number;
  packageName: string;
  totalPersons: number;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  insuranceAmount: number;
  finalAmount: number;
  insuranceRequired: boolean;
  bookingStatusId: number;
  bookingStatusName: string;
  assignedEmployeeId: number;
  assignedEmployeeName: string;
  assignMessage: string;
  cancellationDate: string | null;
  refundAmount: number;
  specialRequirements: string;
  dietaryRestrictions: string;
}

export interface BookingListResponse {
  bookingCount: number;
  bookingsBasicDetails: BookingBasicDetails[];
}

export type BookingListApiResponse = ApiResponse<BookingListResponse>;

// ============ Booking Request Params ============
export interface BookingRequestParams {
  minPrice: number;
  maxPrice: number;
  minDiscountAmount: number;
  maxDiscountAmount: number;
  minBookingDate: string;
  maxBookingDate: string;
  minTravelStartDate: string;
  maxTravelStartDate: string;
  bookingStatuses: { id: number; name: string }[];
  tours: { id: number; name: string }[];
  packages: { id: number; name: string }[];
  assignEmployees: { id: number; name: string }[];
}

export type BookingRequestParamsApiResponse = ApiResponse<BookingRequestParams>;

// ============ Booking Filter Params ============
export interface BookingFilterParams {
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  bookingReference: string | null;
  discountAmount: number | null;
  travelStartDate: string | null;
  travelEndDate: string | null;
  bookingFrom: string | null;
  bookingTo: string | null;
  pageSize: number | null;
  pageNumber: number | null;
  bookingStatusId: number | null;
  tourId: number | null;
  packageId: number | null;
  assignTo: number | null;
  sortBy: string | null;
  sortDirection: string | null;
}

// ============ Booking All Details ============
export interface BookingInformation {
  bookingId: number;
  bookingReference: string;
  bookingDate: string;
  travelStartDate: string;
  travelEndDate: string;
  totalPersons: number;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  insuranceAmount: number;
  finalAmount: number;
  insuranceRequired: boolean;
  specialRequirements: string;
  dietaryRestrictions: string;
}

export interface CustomerInformation {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  passportNumber: string;
}

export interface TourInformation {
  tourId: number;
  tourName: string;
  tourDescription: string;
  duration: number;
  startLocation: string;
  endLocation: string;
  latitude: number;
  longitude: number;
}

export interface PackageInformation {
  packageId: number;
  packageName: string;
  packageDescription: string | null;
  packageTotalPrice: number;
  pricePerPerson: number;
  discountPercentage: number;
}

export interface BookingStatusInformation {
  bookingStatusId: number;
  bookingStatusName: string;
  bookingStatusDescription: string;
}

export interface AssignmentInformation {
  employeeId: number;
  employeeUserId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  designationName: string;
  assignMessage: string;
}

export interface CancellationInformation {
  cancellationDate: string | null;
  cancellationReason: string | null;
  cancellationNotes: string | null;
  refundAmount: number;
  refundStatus: string | null;
}

export interface Participant {
  participantId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  email: string;
  mobileNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  medicalConditions: string | null;
  allergies: string | null;
  specialAssistanceRequired: boolean;
  assistanceDetails: string | null;
}

export interface Accommodation {
  accommodationId: number;
  hotelName: string;
  roomType: string;
  roomNumber: string;
  confirmationNumber: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface Transportation {
  transportationId: number;
  transportType: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
  carrierName: string;
  referenceNumber: string;
  seatNumbers: string;
  vehicleNumber: string;
}

export interface BookingActivity {
  bookingActivityId: number;
  activityId: number;
  activityName: string;
  activityDate: string;
  startTime: string;
  endTime: string;
  numberOfParticipants: number;
  pricePerPerson: number;
  totalPrice: number;
  status: string;
}

export interface BookingDocument {
  documentId: number | null;
  documentName: string;
  documentType: string;
  documentUrl: string;
  fileSize: number;
  mimiType: string;
  status: string;
}

export interface BookingInsurance {
  insuranceId: number | null;
  insuranceProvider: string;
  policyNumber: string;
  coverageType: string;
  coverageDetails: string;
  premiumAmount: number;
  policyStartDate: string;
  policyEndDate: string;
  status: string;
}

export interface BookingItinerary {
  itineraryId: number | null;
  dayNumber: number;
  itineraryDate: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  includedMeals: string;
  status: string;
}

export interface BookingNote {
  noteId: number | null;
  noteType: string;
  noteText: string;
  isImportant: boolean;
  followUpDate: string;
  followUpComplete: boolean;
  status: string;
}

export interface PriceBreakDown {
  priceBreakDownId: number | null;
  itemType: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
}

export interface BookingInvoice {
  invoiceId: number | null;
  dueDate: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  discountAmount: number;
  insuranceAmount: number;
  amountPaid: number;
  balanceDue: number;
  billingFullName: string;
  billingAddress: string;
  billingEmail: string;
  billingPhone: string;
  status: string;
}

export interface BookingAllDetails {
  bookingInformation: BookingInformation;
  customerInformation: CustomerInformation;
  tourInformation: TourInformation;
  packageInformation: PackageInformation;
  bookingStatusInformation: BookingStatusInformation;
  assignmentInformation: AssignmentInformation;
  cancellationInformation: CancellationInformation;
  participants: Participant[];
  accommodations: Accommodation[];
  transportations: Transportation[];
  activities: BookingActivity[];
  documents: BookingDocument[];
  bookingInsurance: BookingInsurance;
  bookingItineraries: BookingItinerary[];
  bookingNotes: BookingNote[];
  priceBreakDowns: PriceBreakDown[];
  bookingInvoice: BookingInvoice;
}

export type BookingAllDetailsApiResponse = ApiResponse<BookingAllDetails>;

export type BookingBasicDetailsApiResponse = ApiResponse<BookingBasicDetails>;

// ============ Create Booking ============
export interface CreateParticipantRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  genderId: number;
  passportNumber: string;
  nationalityCountryId: number;
  email: string;
  mobileNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  medicalConditions: string | null;
  allergies: string | null;
  specialAssistanceRequired: boolean;
  assistanceDetails: string | null;
  roomSharingWith: string | null;
  status: number;
}

export interface CreateAccommodationRequest {
  checkInDate: string;
  checkOutDate: string;
  hotelId: string;
  roomType: string;
  roomNumber: string;
  confirmationNumber: string;
  status: number;
}

export interface CreateTransportationRequest {
  transportType: string;
  vehicleId: number;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
  carrierName: string;
  referenceNumber: string;
  seatNumbers: string;
  status: number;
}

export interface CreateBookingActivityRequest {
  activityId: number;
  activityScheduleId: number;
  activityDate: string;
  startTime: string;
  endTime: string;
  numberOfParticipants: number;
  pricePerPerson: number;
  totalPrice: number;
  status: number;
}

export interface CreateDocumentRequest {
  documentName: string;
  documentType: string;
  documentUrl: string;
  fileSize: number;
  mimiType: string;
  status: number;
}

export interface CreateBookingInsuranceRequest {
  insuranceProvider: string;
  policyNumber: string;
  coverageType: string;
  coverageDetails: string;
  premiumAmount: number;
  policyStartDate: string;
  policyEndDate: string;
  status: number;
}

export interface CreateBookingItineraryRequest {
  dayNumber: number;
  itineraryDate: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  includedMeals: string;
  status: number;
}

export interface CreateBookingNoteRequest {
  noteType: string;
  noteText: string;
  isImportant: boolean;
  followUpDate: string;
  followUpComplete: boolean;
  status: number;
}

export interface CreatePriceBreakDownRequest {
  itemType: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: number;
}

export interface CreateBookingInvoiceRequest {
  dueDate: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  discountAmount: number;
  insuranceAmount: number;
  amountPaid: number;
  balanceDue: number;
  billingFullName: string;
  billingAddress: string;
  billingEmail: string;
  billingPhone: string;
  status: number;
}

export interface CreateBookingRequest {
  customerId: number;
  tourId: number;
  packageId: number;
  packageScheduleId: number | null;
  bookingDate: string;
  travelStartDate: string;
  travelEndDate: string;
  totalPersons: number;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  insuranceAmount: number;
  finalAmount: number;
  insuranceRequired: boolean;
  bookingStatusId: number;
  specialRequirements: string;
  dietaryRestrictions: string;
  assignTo: number;
  assignMessage: string;
  participants: CreateParticipantRequest[];
  accommodations: CreateAccommodationRequest[];
  transportations: CreateTransportationRequest[];
  activities: CreateBookingActivityRequest[];
  documents: CreateDocumentRequest[];
  bookingInsurance: CreateBookingInsuranceRequest;
  bookingItineraries: CreateBookingItineraryRequest[];
  bookingNotes: CreateBookingNoteRequest[];
  priceBreakDowns: CreatePriceBreakDownRequest[];
  bookingInvoice: CreateBookingInvoiceRequest;
}

export interface CreateBookingResponse {
  message: string;
}

export type CreateBookingApiResponse = ApiResponse<CreateBookingResponse>;

// ============ Update Booking ============
export interface UpdateParticipantRequest {
  participantId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  genderId: number;
  passportNumber: string;
  nationalityCountryId: number;
  email: string;
  mobileNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  medicalConditions: string | null;
  allergies: string | null;
  specialAssistanceRequired: boolean;
  assistanceDetails: string | null;
  roomSharingWith: string | null;
  status: number;
}

export interface UpdateAccommodationRequest {
  accommodationId: number;
  checkInDate: string;
  checkOutDate: string;
  hotelId: string;
  roomType: string;
  roomNumber: string;
  confirmationNumber: string;
  status: number;
}

export interface UpdateTransportationRequest {
  transportationId: number;
  transportType: string;
  vehicleId: number;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
  carrierName: string;
  referenceNumber: string;
  seatNumbers: string;
  status: number;
}

export interface UpdateBookingActivityRequest {
  bookingActivityId: number;
  activityId: number;
  activityScheduleId: number;
  activityDate: string;
  startTime: string;
  endTime: string;
  numberOfParticipants: number;
  pricePerPerson: number;
  totalPrice: number;
  status: number;
}

export interface UpdateDocumentRequest {
  documentId: number;
  documentName: string;
  documentType: string;
  documentUrl: string;
  fileSize: number;
  mimiType: string;
  status: number;
}

export interface UpdateBookingInsuranceRequest {
  insuranceId: number;
  insuranceProvider: string;
  policyNumber: string;
  coverageType: string;
  coverageDetails: string;
  premiumAmount: number;
  policyStartDate: string;
  policyEndDate: string;
  status: number;
}

export interface UpdateBookingItineraryRequest {
  itineraryId: number;
  dayNumber: number;
  itineraryDate: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  includedMeals: string;
  status: number;
}

export interface UpdateBookingNoteRequest {
  noteId: number;
  noteType: string;
  noteText: string;
  isImportant: boolean;
  followUpDate: string;
  followUpComplete: boolean;
  status: number;
}

export interface UpdatePriceBreakDownRequest {
  priceBreakDownId: number;
  itemType: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: number;
}

export interface UpdateBookingInvoiceRequest {
  invoiceId: number;
  dueDate: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  discountAmount: number;
  insuranceAmount: number;
  amountPaid: number;
  balanceDue: number;
  billingFullName: string;
  billingAddress: string;
  billingEmail: string;
  billingPhone: string;
  status: number;
}

export interface UpdateBookingRequest {
  bookingId: number;
  customerId: number;
  tourId: number;
  packageId: number;
  packageScheduleId: number | null;
  bookingDate: string;
  travelStartDate: string;
  travelEndDate: string;
  totalPersons: number;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  insuranceAmount: number;
  finalAmount: number;
  insuranceRequired: boolean;
  bookingStatusId: number;
  specialRequirements: string;
  dietaryRestrictions: string;
  assignTo: number;
  assignMessage: string;
  addParticipants: CreateParticipantRequest[];
  removeParticipants: number[];
  updateParticipants: UpdateParticipantRequest[];
  addAccommodations: CreateAccommodationRequest[];
  removeAccommodations: number[];
  updateAccommodations: UpdateAccommodationRequest[];
  addTransportations: CreateTransportationRequest[];
  removeTransportations: number[];
  updateTransportations: UpdateTransportationRequest[];
  addActivities: CreateBookingActivityRequest[];
  removeActivities: number[];
  updateActivities: UpdateBookingActivityRequest[];
  addDocuments: CreateDocumentRequest[];
  removeDocuments: number[];
  updateDocuments: UpdateDocumentRequest[];
  addBookingInsurance: CreateBookingInsuranceRequest | null;
  removeBookingInsurance: any | null;
  updateBookingInsurance: UpdateBookingInsuranceRequest | null;
  addBookingItineraries: CreateBookingItineraryRequest[];
  removeBookingItineraries: number[];
  updateBookingItineraries: UpdateBookingItineraryRequest[];
  addBookingNotes: CreateBookingNoteRequest[];
  removeBookingNotes: number[];
  updateBookingNotes: UpdateBookingNoteRequest[];
  addPriceBreakDowns: CreatePriceBreakDownRequest[];
  removePriceBreakDowns: number[];
  updatePriceBreakDowns: UpdatePriceBreakDownRequest[];
  addBookingInvoice: CreateBookingInvoiceRequest | null;
  removeBookingInvoice: any | null;
  updateBookingInvoice: UpdateBookingInvoiceRequest | null;
}

export interface UpdateBookingResponse {
  message: string | null;
  id: number | null;
}

export type UpdateBookingApiResponse = ApiResponse<UpdateBookingResponse>;

// ============ Update Booking Status ============
export interface UpdateBookingStatusRequest {
  bookingId: number;
  bookingStatus: string;
}

export type UpdateBookingStatusApiResponse = ApiResponse<{
  message: string | null;
  id: number | null;
}>;

// ============ Terminate Booking ============
export interface TerminateBookingRequest {
  id: number;
}

export interface TerminateBookingResponse {
  message: string | null;
}

export type TerminateBookingApiResponse = ApiResponse<TerminateBookingResponse>;

// ============ Booking Billing Details ============
export interface BookingCustomer {
  userId: number;
  fullName: string;
  email: string;
  mobileNumber: string;
}

export interface BookingTour {
  tourId: number;
  tourName: string;
  duration: number;
  startLocation: string;
  endLocation: string;
  travelStartDate: string | null;
  travelEndDate: string | null;
  totalPersons: number;
}

// export interface BookingPackageDetails {
//   packageId: number;
//   packageName: string | null;
//   scheduleName: string | null;
// }

// export interface BillingSummary {
//   subtotal: number;
//   discountAmount: number;
//   taxAmount: number;
//   insuranceAmount: number;
//   finalAmount: number;
//   paidAmount: number;
//   dueAmount: number;
// }

// export interface BookingParticipant {
//   firstName: string;
//   lastName: string;
//   passportNumber: string;
// }

// export interface PriceBreakdownItem {
//   itemType: string;
//   itemName: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
// }

// export interface BookingBillingDetails {
//   bookingId: number;
//   bookingReference: string;
//   bookingDate: string;
//   customer: BookingCustomer;
//   tour: BookingTour;
//   packageDetails: BookingPackageDetails;
//   billingSummary: BillingSummary;
//   participants: BookingParticipant[];
//   priceBreakdown: PriceBreakdownItem[];
// }

// export type BookingBillingDetailsApiResponse =
//   ApiResponse<BookingBillingDetails>;

// ============ Create Booking Params ============
export interface CreateBookingParams {
  customerList: { id: number; name: string }[];
  tourList: { tourId: number; tourName: string }[];
  packageList: { id: number; name: string }[];
  packageScheduleList: {
    packageId: number;
    scheduleId: number;
    scheduleName: string;
  }[];
  bookingStatuses: { bookingStatusId: number; bookingStatusName: string }[];
  assignEmployeeList: { employeeId: number; employeeName: string }[];
  genders: { id: number; name: string }[];
  countries: { id: number; name: string }[];
  statusList: { id: number; name: string }[];
  hotelList: { id: number; name: string }[];
  roomTypes: string[];
  vehicleList: { id: number; name: string }[];
  transportTypes: string[];
  activityList: { id: number; name: string }[];
  activityScheduleList: {
    activityId: number;
    scheduleId: number;
    scheduleName: string;
  }[];
  documentTypes: string[];
  mimeTypes: string[];
  insuranceProviders: string[];
  coverageType: string[];
  includedMeals: string[];
  noteTypes: string[];
  priceBreakDownType: string[];
}

export type CreateBookingParamsApiResponse = ApiResponse<CreateBookingParams>;

// Request types
// export interface GetBookingBillingDetailsRequest {
//   id: number;
// }

export interface GetBookingBasicDetailsRequest {
  id: number;
}

export interface GetBookingAllDetailsRequest {
  id: number;
}

export interface GetCreateBookingParamsRequest {
  id: number;
}
