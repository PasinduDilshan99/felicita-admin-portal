"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastNotification } from "@/components/common-components/ToastNotification";

import { useTheme } from "@/contexts/ThemeContext";
import { useCommon } from "@/contexts/CommonContext";
import {
  Image as ImageIcon,
  FileText,
  Link,
  AlertCircle,
  Loader,
  Layout,
  Type,
  AlignLeft,
  Hash,
  Eye,
} from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { FormActions } from "@/components/common-components/FormActions";
import { InputField } from "@/components/common-components/create-components/InputField";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";
import { HeroSectionService } from "@/services/heroSectionService";
import { CreateHeroSectionRequest } from "@/types/hero-section-types";
import { ToastState } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";

interface HeroSectionAddNewCommonPageProps {
  heroSectionType: string;
  breadcrumbData: Array<{ label: string; href: string }>;
  onSuccess?: () => void;
}

const HeroSectionAddNewCommonPage: React.FC<
  HeroSectionAddNewCommonPageProps
> = ({ heroSectionType, breadcrumbData, onSuccess }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { categories, loading: categoriesLoading } = useCommon();

  // Form state
  const [formData, setFormData] = useState<CreateHeroSectionRequest>({
    heroSectionType: heroSectionType,
    name: "",
    imageUrl: "",
    title: "",
    subtitle: "",
    description: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    statusId: 0,
    order: 0,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // Get status list from context
  const statusList = categories?.statusList || [];

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    if (name === "order" || name === "statusId") {
      processedValue = value === "" ? 0 : parseInt(value);
    }

    setFormData({ ...formData, [name]: processedValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else if (!formData.imageUrl.match(/^https?:\/\/.+/)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
    } else if (formData.subtitle.length > 200) {
      newErrors.subtitle = "Subtitle must be less than 200 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!formData.primaryButtonText.trim()) {
      newErrors.primaryButtonText = "Primary button text is required";
    } else if (formData.primaryButtonText.length > 50) {
      newErrors.primaryButtonText =
        "Button text must be less than 50 characters";
    }

    if (!formData.primaryButtonLink.trim()) {
      newErrors.primaryButtonLink = "Primary button link is required";
    } else if (!formData.primaryButtonLink.match(/^https?:\/\/.+/)) {
      newErrors.primaryButtonLink = "Please enter a valid URL";
    }

    if (!formData.secondaryButtonText.trim()) {
      newErrors.secondaryButtonText = "Secondary button text is required";
    } else if (formData.secondaryButtonText.length > 50) {
      newErrors.secondaryButtonText =
        "Button text must be less than 50 characters";
    }

    if (!formData.secondaryButtonLink.trim()) {
      newErrors.secondaryButtonLink = "Secondary button link is required";
    } else if (!formData.secondaryButtonLink.match(/^https?:\/\/.+/)) {
      newErrors.secondaryButtonLink = "Please enter a valid URL";
    }

    if (!formData.statusId) {
      newErrors.statusId = "Status is required";
    }

    if (!formData.order && formData.order !== 0) {
      newErrors.order = "Order is required";
    } else if (formData.order < 0) {
      newErrors.order = "Order must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit hero section
  const submitHeroSection = async () => {
    setLoading(true);
    try {
      const response = await HeroSectionService.createHeroSection(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Hero Section Created Successfully!",
          message: `${formData.name} has been added to ${heroSectionType} hero sections.`,
        });
        handleReset();
        if (onSuccess) onSuccess();
        return response;
      } else {
        throw new Error(response.message || "Failed to create hero section");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle create button click - opens dialog
  const handleCreateClick = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Handle confirm create from dialog
  const handleConfirmCreate = async () => {
    await submitHeroSection();
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      heroSectionType: heroSectionType,
      name: "",
      imageUrl: "",
      title: "",
      subtitle: "",
      description: "",
      primaryButtonText: "",
      primaryButtonLink: "",
      secondaryButtonText: "",
      secondaryButtonLink: "",
      statusId: 0,
      order: 0,
    });
    setErrors({});
  };

  // Close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Get status name by ID
  const getStatusName = (statusId: number): string => {
    const status = statusList.find((s) => s.statusId === statusId);
    return status?.statusName || `Status ${statusId}`;
  };

  if (categoriesLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <Loader
            className="w-12 h-12 animate-spin mx-auto mb-4"
            style={{ color: theme.primary }}
          />
          <p style={{ color: theme.textSecondary }}>Loading categories...</p>
        </div>
      </div>
    );
  }

  // Get status options for dropdown
  const statusOptions = statusList.map((status) => ({
    value: String(status.statusId),
    label: status.statusName,
  }));

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notification */}
      {toast.show && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={`Add New ${heroSectionType} Hero Section`}
            description={`Create a new hero section for ${heroSectionType} page`}
            breadcrumbItems={breadcrumbData}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <form className="space-y-8">
              {/* Basic Information Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <Layout className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Hero Section Information
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Basic details for the hero section
                      </p>
                    </div>
                  </div>

                  <InputField
                    label="Section Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder={`e.g., ${heroSectionType} Hero Banner`}
                    maxLength={100}
                    showCounter
                    error={errors.name}
                    helperText="Unique name for this hero section"
                  />

                  <InputField
                    label="Image URL"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                    placeholder="https://example.com/hero-image.jpg"
                    error={errors.imageUrl}
                    helperText="URL of the hero section background image"
                  />

                  <InputField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Discover Amazing Adventures"
                    maxLength={200}
                    showCounter
                    error={errors.title}
                    helperText="Main heading for the hero section"
                  />

                  <InputField
                    label="Subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Explore the world with us"
                    maxLength={200}
                    showCounter
                    error={errors.subtitle}
                    helperText="Subheading below the title"
                  />

                  <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    type="textarea"
                    required
                    rows={4}
                    placeholder="Detailed description of the hero section..."
                    maxLength={500}
                    showCounter
                    error={errors.description}
                    helperText="Brief description of the hero section content"
                  />
                </div>
              </FormCard>

              {/* Buttons Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <Link className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Buttons
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Configure call-to-action buttons
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Primary Button Text"
                      name="primaryButtonText"
                      value={formData.primaryButtonText}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Get Started"
                      maxLength={50}
                      showCounter
                      error={errors.primaryButtonText}
                    />
                    <InputField
                      label="Primary Button Link"
                      name="primaryButtonLink"
                      value={formData.primaryButtonLink}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/start"
                      error={errors.primaryButtonLink}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Secondary Button Text"
                      name="secondaryButtonText"
                      value={formData.secondaryButtonText}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Learn More"
                      maxLength={50}
                      showCounter
                      error={errors.secondaryButtonText}
                    />
                    <InputField
                      label="Secondary Button Link"
                      name="secondaryButtonLink"
                      value={formData.secondaryButtonLink}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/learn"
                      error={errors.secondaryButtonLink}
                    />
                  </div>
                </div>
              </FormCard>

              {/* Settings Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <Hash className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Settings
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Configure status and display order
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Status"
                      name="statusId"
                      value={formData.statusId}
                      onChange={handleInputChange}
                      type="select"
                      required
                      options={statusOptions}
                      error={errors.statusId}
                      helperText="Select the status of this hero section"
                    />

                    <InputField
                      label="Display Order"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      type="number"
                      required
                      min={0}
                      step={1}
                      placeholder="0"
                      error={errors.order}
                      helperText="Order in which hero sections are displayed (lower numbers first)"
                    />
                  </div>
                </div>
              </FormCard>

              {/* Preview Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Preview
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Preview of the hero section
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-xl overflow-hidden relative min-h-[200px] p-6 flex items-center"
                    style={{
                      backgroundImage: formData.imageUrl
                        ? `url(${formData.imageUrl})`
                        : "none",
                      backgroundColor: formData.imageUrl
                        ? "rgba(0,0,0,0.5)"
                        : theme.background,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {formData.imageUrl && (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                      />
                    )}
                    <div className="relative z-10 max-w-2xl">
                      {formData.title && (
                        <h3
                          className="text-2xl font-bold mb-2"
                          style={{
                            color: formData.imageUrl ? "#ffffff" : theme.text,
                          }}
                        >
                          {formData.title}
                        </h3>
                      )}
                      {formData.subtitle && (
                        <h4
                          className="text-lg mb-2"
                          style={{
                            color: formData.imageUrl
                              ? "#f0f0f0"
                              : theme.textSecondary,
                          }}
                        >
                          {formData.subtitle}
                        </h4>
                      )}
                      {formData.description && (
                        <p
                          className="text-sm mb-4"
                          style={{
                            color: formData.imageUrl
                              ? "#d0d0d0"
                              : theme.textSecondary,
                          }}
                        >
                          {formData.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {formData.primaryButtonText && (
                          <span
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{
                              backgroundColor: theme.primary,
                              color: "#ffffff",
                            }}
                          >
                            {formData.primaryButtonText}
                          </span>
                        )}
                        {formData.secondaryButtonText && (
                          <span
                            className="px-4 py-2 rounded-lg text-sm font-medium border-2"
                            style={{
                              borderColor: formData.imageUrl
                                ? "#ffffff"
                                : theme.border,
                              color: formData.imageUrl ? "#ffffff" : theme.text,
                            }}
                          >
                            {formData.secondaryButtonText}
                          </span>
                        )}
                      </div>
                      {!formData.title &&
                        !formData.subtitle &&
                        !formData.description && (
                          <p style={{ color: theme.textSecondary }}>
                            Enter content to preview
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </FormCard>

              {/* Form Actions */}
              <FormActions
                loading={loading}
                uploadingImages={false}
                onSubmit={handleCreateClick}
                onReset={handleReset}
                errors={errors}
                submitText={`${heroSectionType} Hero Section`}
                submitButtonType="button"
              />
            </form>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Guidelines */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <h3 className="font-semibold" style={{ color: theme.text }}>
                  Hero Section Guidelines
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Image Quality
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Use high-quality images (1920x1080 recommended)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Clear CTAs
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Use clear and action-oriented button text
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Concise Content
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Keep titles and descriptions brief and impactful
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Order Matters
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Lower order numbers appear first on the page
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <h3 className="font-semibold" style={{ color: theme.text }}>
                  Current Selection
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Type
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {heroSectionType}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Status
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: formData.statusId
                        ? theme.text
                        : theme.textSecondary,
                    }}
                  >
                    {formData.statusId
                      ? getStatusName(formData.statusId)
                      : "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Order
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color:
                        formData.order >= 0 ? theme.text : theme.textSecondary,
                    }}
                  >
                    {formData.order >= 0 ? formData.order : "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <CreateConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmCreate}
        details={{
          title: `Create New ${heroSectionType} Hero Section`,
          message: `Are you sure you want to create this ${heroSectionType} hero section?`,
          itemName: formData.name || "Untitled Hero Section",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: [
            "Verify that all content is correct",
            "Check that the image URL is valid",
            "Ensure buttons link to the correct pages",
            "You can edit this hero section anytime after creation",
            "The hero section will appear based on the display order",
          ],
        }}
        confirmText={`Create ${heroSectionType} Hero Section`}
        cancelText="Cancel"
        onSuccess={() => {
          console.log(`${heroSectionType} hero section created successfully`);
        }}
        onError={(error) => {
          console.error("Failed to create hero section:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message:
              error.message ||
              "Failed to create hero section. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default HeroSectionAddNewCommonPage;
