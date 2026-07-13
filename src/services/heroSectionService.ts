import {
  HeroSectionBasicListApiResponse,
  HeroSectionFilterParams,
  HeroSectionRequestParamsApiResponse,
  HeroSectionDetailsApiResponse,
  CreateHeroSectionRequest,
  CreateHeroSectionApiResponse,
  UpdateHeroSectionRequest,
  UpdateHeroSectionApiResponse,
  TerminateHeroSectionApiResponse,
  GetHeroSectionDetailsRequest,
  GetHeroSectionRequestParamsRequest,
  TerminateHeroSectionRequest,
  HeroSectionStatisticsApiResponse,
  GetHeroSectionStatisticsRequest,
} from "@/types/hero-section-types";
import {
  ADD_HERO_SECTION_DATA_FE,
  GET_HERO_SECTION_BASIC_DETAILS_FOR_REQUEST_DATA_FE,
  GET_HERO_SECTION_DETAILS_BY_ID_DATA_FE,
  GET_HERO_SECTION_REQUEST_PARAM_DATA_FE,
  GET_HERO_SECTION_STATISTICS_DATA_FE,
  TERMINATE_HERO_SECTION_DATA_FE,
  UPDATE_HERO_SECTION_DATA_FE,
} from "@/utils/frontEndConstant";

export class HeroSectionService {
  static async getHeroSectionBasicDetails(
    params: HeroSectionFilterParams,
  ): Promise<HeroSectionBasicListApiResponse> {
    try {
      const response = await fetch(
        GET_HERO_SECTION_BASIC_DETAILS_FOR_REQUEST_DATA_FE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: params.name || null,
            heroSectionType: params.heroSectionType || null,
            title: params.title || null,
            subTitle: params.subTitle || null,
            description: params.description || null,
            primaryButtonText: params.primaryButtonText || null,
            secondaryButtonText: params.secondaryButtonText || null,
            status: params.status || null,
            pageSize: params.pageSize,
            pageNumber: params.pageNumber,
            sortBy: params.sortBy,
            sortDirection: params.sortDirection,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HeroSectionBasicListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch hero section basic details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching hero section basic details:", error);
      throw error;
    }
  }

  /**
   * Get hero section request parameters (button texts)
   */
  static async getHeroSectionRequestParams(
    heroSectionType: string,
  ): Promise<HeroSectionRequestParamsApiResponse> {
    try {
      const requestBody: GetHeroSectionRequestParamsRequest = {
        heroSectionType,
      };

      const response = await fetch(GET_HERO_SECTION_REQUEST_PARAM_DATA_FE, {
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

      const data: HeroSectionRequestParamsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch hero section request parameters",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching hero section request parameters:", error);
      throw error;
    }
  }

  /**
   * Get hero section details by ID
   */
  static async getHeroSectionDetails(
    heroSectionType: string,
    heroSectionId: number,
  ): Promise<HeroSectionDetailsApiResponse> {
    try {
      const requestBody: GetHeroSectionDetailsRequest = {
        heroSectionType,
        heroSectionId,
      };

      const response = await fetch(GET_HERO_SECTION_DETAILS_BY_ID_DATA_FE, {
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

      const data: HeroSectionDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch hero section details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching hero section details:", error);
      throw error;
    }
  }

  // ============ CREATE/UPDATE/DELETE APIs ============

  /**
   * Create a new hero section
   */
  static async createHeroSection(
    heroSectionData: CreateHeroSectionRequest,
  ): Promise<CreateHeroSectionApiResponse> {
    try {
      const response = await fetch(ADD_HERO_SECTION_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(heroSectionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateHeroSectionApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to create hero section");
      }

      return data;
    } catch (error) {
      console.error("Error creating hero section:", error);
      throw error;
    }
  }

  /**
   * Update an existing hero section
   */
  static async updateHeroSection(
    heroSectionData: UpdateHeroSectionRequest,
  ): Promise<UpdateHeroSectionApiResponse> {
    try {
      const response = await fetch(UPDATE_HERO_SECTION_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(heroSectionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateHeroSectionApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update hero section");
      }

      return data;
    } catch (error) {
      console.error("Error updating hero section:", error);
      throw error;
    }
  }

  /**
   * Terminate a hero section
   */
  static async terminateHeroSection(
    id: number,
    type: string,
  ): Promise<TerminateHeroSectionApiResponse> {
    try {
      const requestBody: TerminateHeroSectionRequest = { id, type };

      const response = await fetch(TERMINATE_HERO_SECTION_DATA_FE, {
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

      const data: TerminateHeroSectionApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate hero section");
      }

      return data;
    } catch (error) {
      console.error("Error terminating hero section:", error);
      throw error;
    }
  }

  // Add this method to the HeroSectionService class

  /**
   * Get hero section statistics
   */
  static async getHeroSectionStatistics(
    heroSectionType: string,
  ): Promise<HeroSectionStatisticsApiResponse> {
    try {
      const requestBody: GetHeroSectionStatisticsRequest = { heroSectionType };

      const response = await fetch(GET_HERO_SECTION_STATISTICS_DATA_FE, {
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

      const data: HeroSectionStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch hero section statistics",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching hero section statistics:", error);
      throw error;
    }
  }

  // ============ Helper Methods ============

  /**
   * Helper method to get status badge color
   */
  static getStatusColor(status: string): string {
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
   * Helper method to get status ID from status string
   */
  static getStatusId(status: string): number {
    switch (status) {
      case "ACTIVE":
        return 1;
      case "INACTIVE":
        return 0;
      default:
        return -1;
    }
  }

  /**
   * Helper method to get default form data for creating a hero section
   */
  static getDefaultCreateFormData(): CreateHeroSectionRequest {
    return {
      heroSectionType: "HOME",
      name: "",
      imageUrl: "",
      title: "",
      subtitle: "",
      description: "",
      primaryButtonText: "",
      primaryButtonLink: "",
      secondaryButtonText: "",
      secondaryButtonLink: "",
      statusId: 1,
      order: 0,
    };
  }

  /**
   * Helper method to get default update form data
   */
  static getDefaultUpdateFormData(id: number): UpdateHeroSectionRequest {
    return {
      heroSectionId: id,
      heroSectionType: "HOME",
      name: "",
      imageUrl: "",
      title: "",
      subtitle: "",
      description: "",
      primaryButtonText: "",
      primaryButtonLink: "",
      secondaryButtonText: "",
      secondaryButtonLink: "",
      statusId: 1,
      order: 0,
    };
  }

  /**
   * Helper method to validate hero section form data
   */
  static validateHeroSectionForm(
    formData: Partial<CreateHeroSectionRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.heroSectionType?.trim()) {
      errors.heroSectionType = "Hero section type is required";
    }

    if (!formData.name?.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (!formData.imageUrl?.trim()) {
      errors.imageUrl = "Image URL is required";
    } else if (!formData.imageUrl.startsWith("https://")) {
      errors.imageUrl = "Image URL must be a valid HTTPS URL";
    }

    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!formData.subtitle?.trim()) {
      errors.subtitle = "Subtitle is required";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!formData.primaryButtonText?.trim()) {
      errors.primaryButtonText = "Primary button text is required";
    }

    if (!formData.primaryButtonLink?.trim()) {
      errors.primaryButtonLink = "Primary button link is required";
    }

    if (!formData.secondaryButtonText?.trim()) {
      errors.secondaryButtonText = "Secondary button text is required";
    }

    if (!formData.secondaryButtonLink?.trim()) {
      errors.secondaryButtonLink = "Secondary button link is required";
    }

    if (formData.order === undefined || formData.order < 0) {
      errors.order = "Valid order number is required";
    }

    return errors;
  }

  /**
   * Helper method to get hero section type options
   */
  static getHeroSectionTypes(): string[] {
    return ["HOME", "ABOUT_US", "CONTACT", "SERVICES", "PACKAGES", "TOURS"];
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
   * Helper method to truncate text
   */
  static truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }
}
