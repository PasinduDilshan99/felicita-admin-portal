import { ApiResponse } from "./common-types";

// ============ Hero Section Basic Details ============
export interface HeroSectionBasic {
  id: number;
  name: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  statusId: number;
  status: string;
  order: number;
}

export interface HeroSectionBasicResponse {
  count: number;
  heroSectionBasicResponses: HeroSectionBasic[];
}

export type HeroSectionBasicListApiResponse =
  ApiResponse<HeroSectionBasicResponse>;

// ============ Hero Section Filter Params ============
export interface HeroSectionFilterParams {
  name: string | null;
  heroSectionType: string | null;
  title: string | null;
  subTitle: string | null;
  description: string | null;
  primaryButtonText: string | null;
  secondaryButtonText: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

// ============ Hero Section Request Params ============
export interface HeroSectionRequestParams {
  primaryButtonText: string[];
  secondaryButtonText: string[];
}

export type HeroSectionRequestParamsApiResponse =
  ApiResponse<HeroSectionRequestParams>;

// ============ Hero Section Details ============
export interface HeroSectionDetails {
  id: number;
  name: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  statusId: number;
  status: string;
  order: number;
  createdAt: string;
  createdBy: number;
  createdByUsername: string;
  updatedAt: string;
  updatedBy: number;
  updatedByUsername: string | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
  terminatedByUsername: string | null;
}

export type HeroSectionDetailsApiResponse = ApiResponse<HeroSectionDetails>;

// ============ Create Hero Section ============
export interface CreateHeroSectionRequest {
  heroSectionType: string;
  name: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  statusId: number;
  order: number;
}

export interface CreateHeroSectionResponse {
  message: string;
}

export type CreateHeroSectionApiResponse =
  ApiResponse<CreateHeroSectionResponse>;

// ============ Update Hero Section ============
export interface UpdateHeroSectionRequest {
  heroSectionId: number;
  heroSectionType: string;
  name: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  statusId: number;
  order: number;
}

export interface UpdateHeroSectionResponse {
  message: string;
  id: number;
}

export type UpdateHeroSectionApiResponse =
  ApiResponse<UpdateHeroSectionResponse>;

// ============ Terminate Hero Section ============
export interface TerminateHeroSectionRequest {
  id: number;
  type: string;
}

export interface TerminateHeroSectionResponse {
  message: string;
}

export type TerminateHeroSectionApiResponse =
  ApiResponse<TerminateHeroSectionResponse>;

// ============ Get Hero Section Details Request ============
export interface GetHeroSectionDetailsRequest {
  heroSectionType: string;
  heroSectionId: number;
}

// ============ Get Hero Section Request Params Request ============
export interface GetHeroSectionRequestParamsRequest {
  heroSectionType: string;
}

// Add these to your existing types/hero-section-types.ts file

// ============ Hero Section Statistics ============
export interface HeroSectionStatisticsSummary {
  totalHeroSections: number;
  activeHeroSections: number;
  inactiveHeroSections: number;
  terminatedHeroSections: number;
  createdThisMonth: number;
  updatedThisMonth: number;
}

export interface HeroSectionStatusStatistic {
  statusId: number;
  status: string;
  count: number;
}

export interface HeroSectionMonthlyStatistic {
  year: number;
  month: number;
  monthName: string;
  count: number;
}

export interface HeroSectionActivityStatistic {
  year: number;
  month: number;
  monthName: string;
  createdCount: number;
  updatedCount: number;
}

export interface HeroSectionTopEditor {
  userId: number;
  username: string;
  updateCount: number;
}

export interface HeroSectionStatisticsData {
  summary: HeroSectionStatisticsSummary;
  statusStatistics: HeroSectionStatusStatistic[];
  monthlyStatistics: HeroSectionMonthlyStatistic[];
  activityStatistics: HeroSectionActivityStatistic[];
  topEditorStatistics: HeroSectionTopEditor[];
}

export type HeroSectionStatisticsApiResponse =
  ApiResponse<HeroSectionStatisticsData>;

// ============ Get Hero Section Statistics Request ============
export interface GetHeroSectionStatisticsRequest {
  heroSectionType: string;
}

export interface HeroSectionFilterParamsWithType extends HeroSectionFilterParams {
  heroSectionType: string;
}

export interface HeroSectionViewCommonPageProps {
  heroSectionType: string;
  heroSectionDetailsViewUrl: string;
  heroSectionBaseUrl: string;
  breadcrumbItems: Array<{ label: string; href: string }>;
  pageTitle?: string;
  pageDescription?: string;
}

export interface HeroSectionCardProps {
  heroSection: HeroSectionBasic;
  heroSectionType: string;
  heroSectionDetailsViewUrl: string;
}

export interface HeroSectionListCardProps {
  heroSection: HeroSectionBasic;
  heroSectionType: string;
  heroSectionDetailsViewUrl: string;
}
