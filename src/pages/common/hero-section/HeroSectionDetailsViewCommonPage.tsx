// components/hero-section-components/HeroSectionDetailsViewCommonPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { HeroSectionService } from "@/services/heroSectionService";
import { HeroSectionDetails } from "@/types/hero-section-types";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";
import { hexToRgba } from "@/utils/functions";
import {
  formatDate,
  formatDateTime,
  formatPrice,
} from "@/utils/commonFunctions";

// Icons
import {
  Image,
  Tag,
  Calendar,
  User,
  Clock,
  Link,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface HeroSectionDetailsViewCommonPageProps {
  heroSectionId: number;
  heroSectionType: string;
  breadcrumbData: BreadcrumbItem[];
  updateUrl: string;
  terminateUrl: string;
  viewUrl?: string;
  onBack?: () => void;
  customTitle?: string;
  customDescription?: string;
}

const HeroSectionDetailsViewCommonPage: React.FC<
  HeroSectionDetailsViewCommonPageProps
> = ({
  heroSectionId,
  heroSectionType,
  breadcrumbData,
  updateUrl,
  terminateUrl,
  viewUrl,
  onBack,
  customTitle,
  customDescription,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [heroSection, setHeroSection] = useState<HeroSectionDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    ...breadcrumbData,
    {
      label: heroSection?.name || "Details",
      href: `${viewUrl || ""}/${heroSectionId}`,
    },
  ];

  useEffect(() => {
    if (heroSectionId && heroSectionType) {
      fetchHeroSectionDetails();
    }
  }, [heroSectionId, heroSectionType]);

  const fetchHeroSectionDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await HeroSectionService.getHeroSectionDetails(
        heroSectionType,
        heroSectionId,
      );
      setHeroSection(response.data);
    } catch (err: any) {
      setError(
        err.message || "Failed to load hero section details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleRetry = () => {
    if (heroSectionId && heroSectionType) {
      fetchHeroSectionDetails();
    }
  };

  const handleEdit = () => {
    if (heroSection?.id) {
      router.push(`${updateUrl}/${heroSection.id}?name=${heroSection.name}`);
    }
  };

  const handleDelete = () => {
    if (heroSection?.id) {
      router.push(`${terminateUrl}/${heroSection.id}?name=${heroSection.name}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: heroSection?.name,
        text: heroSection?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!heroSection) return null;
    const isActive = heroSection.status === "ACTIVE";
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {heroSection.status}
      </span>
    );
  };

  // Prepare quick stats
  const quickStats = [
    {
      label: "Hero Section Type",
      value: heroSectionType,
      icon: Tag,
      color: theme.primary,
    },
    {
      label: "Display Order",
      value: heroSection?.order || 0,
      icon: Clock,
      color: theme.primary,
    },
    {
      label: "Status",
      value: heroSection?.status || "N/A",
      icon: heroSection?.status === "ACTIVE" ? CheckCircle : AlertCircle,
      color: heroSection?.status === "ACTIVE" ? theme.success : theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Created By",
      value:
        heroSection?.createdByUsername || `User #${heroSection?.createdBy}`,
      icon: User,
      date: heroSection?.createdAt,
      color: theme.success,
    },
    {
      label: "Last Updated",
      value: heroSection?.updatedByUsername
        ? heroSection.updatedByUsername
        : heroSection?.updatedBy
          ? `User #${heroSection.updatedBy}`
          : "Never",
      icon: Clock,
      date: heroSection?.updatedAt,
      color: theme.primary,
    },
  ];

  if (heroSection?.terminatedAt) {
    metadataItems.push({
      label: "Terminated By",
      value: heroSection.terminatedByUsername
        ? heroSection.terminatedByUsername
        : heroSection.terminatedBy
          ? `User #${heroSection.terminatedBy}`
          : "Unknown",
      icon: User,
      date: heroSection.terminatedAt,
      color: theme.error,
    });
  }

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${heroSection?.name || "Hero Section"}" details...`}
        subMessage={`Fetching ${heroSectionType} hero section information`}
        size="lg"
      />
    );

  if (error || !heroSection) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Hero Section"
        message="The hero section couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={handleRetry}
        backButtonText="Back"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Sticky Top Bar */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={customTitle || heroSection.name}
            description={
              customDescription || `Hero Section ID: ${heroSection.id}`
            }
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={heroSection.name}
          showShare={true}
          showEdit={true}
          showDelete={true}
          onShare={handleShare}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Hero Image Card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-4 sm:px-6 py-3 sm:py-4"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <h2
                  className="text-base sm:text-lg font-semibold flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <Image
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Hero Image
                </h2>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5">
                <div
                  className="relative rounded-xl overflow-hidden aspect-video"
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.05),
                  }}
                >
                  {heroSection.imageUrl ? (
                    <img
                      src={heroSection.imageUrl}
                      alt={heroSection.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        className="w-16 h-16 opacity-30"
                        style={{ color: theme.textSecondary }}
                      />
                    </div>
                  )}
                </div>
                {heroSection.imageUrl && (
                  <a
                    href={heroSection.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs mt-2 hover:underline"
                    style={{ color: theme.primary }}
                  >
                    <Eye className="w-3 h-3" />
                    View Full Image
                  </a>
                )}
              </div>
            </div>

            {/* Hero Content Card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-4 sm:px-6 py-3 sm:py-4"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <h2
                  className="text-base sm:text-lg font-semibold flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <FileText
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Hero Content
                </h2>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
                {/* Title */}
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wide mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Title
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: theme.text }}
                  >
                    {heroSection.title}
                  </p>
                </div>

                {/* Subtitle */}
                {heroSection.subtitle && (
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wide mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Subtitle
                    </p>
                    <p
                      className="text-base font-medium"
                      style={{ color: theme.text }}
                    >
                      {heroSection.subtitle}
                    </p>
                  </div>
                )}

                {/* Description */}
                {heroSection.description && (
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-wide mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Description
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: theme.textSecondary }}
                    >
                      {heroSection.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons Card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-4 sm:px-6 py-3 sm:py-4"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <h2
                  className="text-base sm:text-lg font-semibold flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <Link
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Call to Action Buttons
                </h2>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                {/* Primary Button */}
                {heroSection.primaryButtonText && (
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.06),
                      border: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-wide mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Primary Button
                    </p>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      {heroSection.primaryButtonText}
                    </p>
                    {heroSection.primaryButtonLink && (
                      <a
                        href={heroSection.primaryButtonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs hover:underline"
                        style={{ color: theme.textSecondary }}
                      >
                        {heroSection.primaryButtonLink}
                      </a>
                    )}
                  </div>
                )}

                {/* Secondary Button */}
                {heroSection.secondaryButtonText && (
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: hexToRgba(
                        theme.accent || theme.primary,
                        0.06,
                      ),
                      border: `1px solid ${hexToRgba(theme.accent || theme.primary, 0.15)}`,
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-wide mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Secondary Button
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: theme.accent || theme.primary }}
                    >
                      {heroSection.secondaryButtonText}
                    </p>
                    {heroSection.secondaryButtonLink && (
                      <a
                        href={heroSection.secondaryButtonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs hover:underline"
                        style={{ color: theme.textSecondary }}
                      >
                        {heroSection.secondaryButtonLink}
                      </a>
                    )}
                  </div>
                )}

                {!heroSection.primaryButtonText &&
                  !heroSection.secondaryButtonText && (
                    <p
                      className="text-sm text-center"
                      style={{ color: theme.textSecondary }}
                    >
                      No buttons configured for this hero section.
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="Hero Section Stats"
              statusBadge={<StatusBadge />}
              columns={2}
            />

            <CommonMetadata
              items={metadataItems}
              title="Audit Information"
              description="Creation and modification details"
              createdAt={{
                date: heroSection.createdAt,
                label: "Created At",
              }}
              showCreatedAt={true}
            />

            {/* Additional Info Card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-4 sm:px-6 py-3 sm:py-4"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <h2
                  className="text-base sm:text-lg font-semibold flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <Tag
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.primary }}
                  />
                  Additional Information
                </h2>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
                <div
                  className="flex justify-between py-2 border-b"
                  style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                >
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Hero Section ID
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {heroSection.id}
                  </span>
                </div>

                <div
                  className="flex justify-between py-2 border-b"
                  style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                >
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Hero Section Type
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {heroSectionType}
                  </span>
                </div>

                <div
                  className="flex justify-between py-2 border-b"
                  style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                >
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Display Order
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {heroSection.order}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Name
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {heroSection.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionDetailsViewCommonPage;
