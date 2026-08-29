"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HeroSectionService } from "@/services/heroSectionService";
import {
  HeroSectionDetails,
  HeroSectionNameAndId,
} from "@/types/hero-section-types";
import {
  AlertTriangle,
  Search,
  AlertCircle,
  Image,
  FileText,
  Link,
  Hash,
  Eye,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import ImageModal from "@/components/common-components/ImageModal";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { ImpactWarning } from "@/components/common-components/terminate-components/ImpactWarning";
import {
  TerminationItem,
  TerminationModal,
} from "@/components/common-components/terminate-components/TerminationModal";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { hexToRgba } from "@/utils/functions";
import { HeroSectionStats } from "@/components/common-page-components/hero-section/terminate-hero-section-components/HeroSectionStats";
import { BasicInfoPanel } from "@/components/common-page-components/hero-section/terminate-hero-section-components/BasicInfoPanel";
import { ButtonInfoPanel } from "@/components/common-page-components/hero-section/terminate-hero-section-components/ButtonInfoPanel";


interface HeroSectionSearchItem {
  id: number;
  name: string;
}

interface HeroSectionTerminateCommonPageProps {
  heroSectionType: string;
  breadcrumbData: Array<{ label: string; href: string }>;
}

const HeroSectionTerminateCommonPage: React.FC<
  HeroSectionTerminateCommonPageProps
> = ({ heroSectionType, breadcrumbData }) => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialHeroName = searchParams?.get("hero-name") || "";
  const initialHeroId = searchParams?.get("hero-id") || "";

  const [heroSections, setHeroSections] = useState<HeroSectionNameAndId[]>([]);
  const [selectedHero, setSelectedHero] = useState<HeroSectionNameAndId | null>(
    initialHeroId && initialHeroName
      ? {
          id: parseInt(initialHeroId),
          name: initialHeroName,
        }
      : null,
  );
  const [heroDetails, setHeroDetails] = useState<HeroSectionDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  // Image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const fetchHeroSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await HeroSectionService.getHeroSectionNameAndId(heroSectionType);
      setHeroSections(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load hero sections");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load hero sections",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setHeroDetails(null);
    try {
      const response = await HeroSectionService.getHeroSectionDetails(
        heroSectionType,
        id,
      );
      setHeroDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load hero section details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load hero section details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectHero = async (id: number, name: string) => {
    setSelectedHero({ id, name });
    await fetchHeroDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("hero-id", id.toString());
    url.searchParams.set("hero-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearHeroSelection = () => {
    setSelectedHero(null);
    setHeroDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("hero-id");
    url.searchParams.delete("hero-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedHero) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedHero) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await HeroSectionService.terminateHeroSection(
        selectedHero.id,
        heroSectionType,
      );

      setSuccess("Hero section terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedHero.name}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearHeroSelection();
        fetchHeroSections();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate hero section");
      setToast({
        type: "error",
        title: "Termination Failed",
        message:
          err.message || "Failed to terminate hero section. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Convert hero sections to search items format
  const searchItems: HeroSectionSearchItem[] = heroSections.map((hero) => ({
    id: hero.id,
    name: hero.name,
  }));

  const selectedSearchItem: HeroSectionSearchItem | null = selectedHero
    ? {
        id: selectedHero.id,
        name: selectedHero.name,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedHero
    ? {
        id: selectedHero.id,
        name: selectedHero.name,
        type: "custom",
        additionalInfo: `${heroSectionType} Hero Section`,
      }
    : null;

  useEffect(() => {
    if (!selectedHero) {
      fetchHeroSections();
    }
  }, []);

  useEffect(() => {
    if (initialHeroId && !heroDetails) {
      handleSelectHero(parseInt(initialHeroId), initialHeroName);
    }
  }, [initialHeroId, initialHeroName]);

  if (loading && !selectedHero) {
    return (
      <CommonLoading
        message={`Loading ${heroSectionType} hero sections...`}
        subMessage={`Please wait while we fetch available ${heroSectionType?.toLowerCase()} hero sections`}
        size="lg"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          actionLink={toast.actionLink}
          actionText="View Details"
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={`Terminate ${heroSectionType} Hero Section`}
            description={`Permanently remove a ${heroSectionType?.toLowerCase()} hero section from the system`}
            breadcrumbItems={breadcrumbData}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no hero section is selected */}
        {!selectedHero && (
          <div
            className="rounded-2xl shadow-lg mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-5 sm:px-6 py-4 flex items-center gap-3 border-b"
              style={{ borderColor: theme.border }}
            >
              <span
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: hexToRgba(theme.error, 0.1),
                  color: theme.error,
                }}
              >
                <Search className="w-4 h-4" />
              </span>
              <div>
                <h2
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Select {heroSectionType} Hero Section to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a hero section to review its data before
                  termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<HeroSectionSearchItem>
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) => handleSelectHero(item.id, item.name)}
                onClearSelection={handleClearHeroSelection}
                initialSearchTerm={initialHeroName}
                placeholder={`Search ${heroSectionType?.toLowerCase()} hero sections...`}
                title={`${heroSectionType} Hero Sections`}
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Hero Info Bar */}
        <SelectedItemBar
          item={
            selectedHero
              ? {
                  id: selectedHero.id,
                  name: selectedHero.name,
                }
              : null
          }
          onClear={handleClearHeroSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Hero Details Section */}
        {selectedHero && (
          <div
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1.5px solid ${hexToRgba(theme.error, 0.5)}`,
              boxShadow: `0 4px 32px ${hexToRgba(theme.error, 0.07)}`,
            }}
          >
            {/* Warning Header */}
            <div
              className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-4"
              style={{
                background: `linear-gradient(90deg, ${hexToRgba(theme.error, 0.08)}, ${hexToRgba(theme.error, 0.03)})`,
                borderBottom: `1.5px solid ${hexToRgba(theme.error, 0.3)}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.error}, ${theme.error})`,
                  color: "#fff",
                }}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className="text-base font-bold"
                  style={{ color: theme.error }}
                >
                  {heroSectionType} Hero Section Termination Review
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.error }}>
                  Review all data carefully. This action is permanent and cannot
                  be undone.
                </p>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
                style={{
                  background: hexToRgba(theme.error, 0.08),
                  border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                }}
              >
                <span className="text-xs" style={{ color: theme.error }}>
                  ID
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: theme.error }}
                >
                  #{selectedHero.id}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading hero section details..."
                subMessage="Please wait while we fetch the hero section information"
                size="lg"
              />
            )}

            {/* Hero Details Content */}
            {!loadingDetails && heroDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                <HeroSectionStats heroDetails={heroDetails} />

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  }}
                >
                  {/* Left Column */}
                  <div className="space-y-5">
                    <BasicInfoPanel heroDetails={heroDetails} />

                    {/* Hero Image Preview */}
                    {heroDetails.imageUrl && (
                      <div
                        className="rounded-xl overflow-hidden transition-all duration-200"
                        style={{
                          background: hexToRgba(theme.accent, 0.05),
                          border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
                        }}
                      >
                        <div
                          className="flex items-center justify-between px-4 py-3"
                          style={{
                            borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              className="w-4 h-4"
                              style={{ color: theme.accent }}
                            />
                            <h3
                              className="text-sm font-semibold"
                              style={{ color: theme.text }}
                            >
                              Hero Image
                            </h3>
                          </div>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: hexToRgba(theme.error, 0.1),
                              color: theme.error,
                              border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                            }}
                          >
                            Will be deleted
                          </span>
                        </div>
                        <div className="px-4 py-4">
                          <div className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer group">
                            <img
                              src={heroDetails.imageUrl}
                              alt={heroDetails.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onClick={() => setImageModalOpen(true)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <ButtonInfoPanel heroDetails={heroDetails} />

                    {/* Custom Impact Warning for Hero Sections */}
                    <ImpactWarning
                      title="Hero Section Termination Impact"
                      customItems={[
                        {
                          icon: <Image size={11} />,
                          text: "The hero image will be permanently deleted from storage",
                        },
                        {
                          icon: <FileText size={11} />,
                          text: "All text content (title, subtitle, description) will be removed",
                        },
                        {
                          icon: <Link size={11} />,
                          text: "All button links will be permanently removed",
                        },
                        {
                          icon: <AlertCircle size={11} />,
                          text: "This action cannot be undone — recovery is not possible",
                        },
                        {
                          icon: <AlertCircle size={11} />,
                          text: "This termination will be logged for audit trail purposes",
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Termination Button */}
                <div
                  className="flex justify-center pt-4"
                  style={{
                    borderTop: `1.5px solid ${hexToRgba(theme.error, 0.2)}`,
                  }}
                >
                  <button
                    onClick={handleTerminateClick}
                    disabled={loadingTerminate}
                    className="cursor-pointer flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:hover:scale-100"
                    style={{
                      background: loadingTerminate
                        ? `linear-gradient(135deg, ${theme.error}, ${theme.error}dd)`
                        : `linear-gradient(135deg, ${theme.error}, ${hexToRgba(theme.error, 0.8)})`,
                      color: "#fff",
                      opacity: loadingTerminate ? 0.6 : 1,
                      boxShadow: `0 4px 16px ${hexToRgba(theme.error, 0.3)}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {loadingTerminate ? (
                      <>
                        <div className="relative w-4 h-4">
                          <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
                          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                        <span className="animate-pulse">Processing…</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Terminate Hero Section Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !heroDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Hero Section"
                message="The hero section couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearHeroSelection}
                onRetry={() =>
                  selectedHero && fetchHeroDetails(selectedHero.id)
                }
                backButtonText="Change Selection"
                retryButtonText="Try Again"
                fullScreen={false}
              />
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <TerminationModal
        isOpen={showConfirmModal}
        item={terminationItem}
        loading={loadingTerminate}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTerminate}
        title={`Confirm ${heroSectionType} Hero Section Termination`}
        description="You are about to permanently terminate:"
        warningMessage="All content, images, and button links associated with this hero section will be permanently deleted."
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        images={
          heroDetails?.imageUrl
            ? [{ url: heroDetails.imageUrl, name: heroDetails.name }]
            : []
        }
        initialIndex={0}
        onClose={() => setImageModalOpen(false)}
        showNavigation={false}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </div>
  );
};

export default HeroSectionTerminateCommonPage;
