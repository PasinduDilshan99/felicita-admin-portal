"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HeroSectionService } from "@/services/heroSectionService";
import {
  HeroSectionNameAndId,
  HeroSectionDetails,
  UpdateHeroSectionRequest,
} from "@/types/hero-section-types";
import {
  Search,
  Edit,
  Save,
  RefreshCw,
  Loader2,
  ChevronDown,
  ImageIcon,
  Link,
  AlignLeft,
  Type,
  Hash,
  Info,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCommon } from "@/contexts/CommonContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonSearch, { SearchItem } from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import { UpdateConfirmationModal, ChangedField } from "@/components/common-components/UpdateConfirmationModal";
import { ImageUploader, BaseImageData } from "@/components/common-components/ImageUploader";
import { hexToRgba } from "@/utils/functions";
import { motion, AnimatePresence } from "framer-motion";
import { HOME_HERO_SECTION_DETAILS_VIEW_URL } from "@/utils/urls";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { cardVariants, sectionVariants } from "@/app/animations/variants";

// Interface for hero section image data
interface HeroImageData extends BaseImageData {
  id?: number;
}

interface HeroSectionUpdateCommonPageProps {
  heroSectionType: string;
  breadcrumbData: Array<{ label: string; href: string }>;
  title?: string;
  description?: string;
}

const HeroSectionUpdateCommonPage: React.FC<HeroSectionUpdateCommonPageProps> = ({
  heroSectionType,
  breadcrumbData,
  title = "Update Hero Section",
  description = "Edit and update hero section information",
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { categories, loading: commonLoading, error: commonError } = useCommon();

  const initialHeroName = searchParams?.get("hero-name") || "";
  const initialHeroId = searchParams?.get("hero-id") || "";

  // State for hero sections list
  const [heroSections, setHeroSections] = useState<HeroSectionNameAndId[]>([]);

  // State for selected hero section
  const [selectedHero, setSelectedHero] = useState<HeroSectionNameAndId | null>(
    initialHeroId && initialHeroName
      ? {
          id: parseInt(initialHeroId),
          name: initialHeroName,
        }
      : null,
  );

  // State for original hero details
  const [originalHero, setOriginalHero] = useState<HeroSectionDetails | null>(null);

  // State for edited hero
  const [editedHero, setEditedHero] = useState<HeroSectionDetails | null>(null);

  // State for basic details changes
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);

  // State for image upload
  const [uploadingImage, setUploadingImage] = useState(false);
  const [heroImages, setHeroImages] = useState<HeroImageData[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["basic"]));

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  // Get status list from common context
  const statusList = categories?.statusList || [];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  // Update URL when selected hero section changes
  const updateUrlWithSelectedHero = useCallback(
    (hero: HeroSectionNameAndId | null) => {
      const url = new URL(window.location.href);
      if (hero) {
        url.searchParams.set("hero-id", hero.id.toString());
        url.searchParams.set("hero-name", hero.name);
      } else {
        url.searchParams.delete("hero-id");
        url.searchParams.delete("hero-name");
      }
      router.replace(url.toString(), { scroll: false });
    },
    [router],
  );

  // Fetch hero sections list on initial load
  useEffect(() => {
    if (!selectedHero) {
      fetchHeroSections();
    }
  }, [heroSectionType]);

  // If initialHeroId is provided, fetch details
  useEffect(() => {
    if (initialHeroId && !originalHero && !loadingDetails) {
      handleSelectHero(parseInt(initialHeroId), initialHeroName);
    }
  }, [initialHeroId, initialHeroName]);

  const fetchHeroSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await HeroSectionService.getHeroSectionNameAndId(heroSectionType);
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

  const handleSelectHero = async (id: number, name: string) => {
    const newSelectedHero = { id, name };
    setSelectedHero(newSelectedHero);
    updateUrlWithSelectedHero(newSelectedHero);
    await fetchHeroDetails(id);
  };

  const fetchHeroDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalHero(null);
    setEditedHero(null);
    setBasicDetailsChanged(false);
    setHeroImages([]);

    try {
      const response = await HeroSectionService.getHeroSectionDetails(heroSectionType, id);
      const heroData = response.data;
      setOriginalHero(heroData);
      setEditedHero(heroData);
      
      // Set hero image if exists
      if (heroData.imageUrl) {
        setHeroImages([
          {
            name: heroData.name || "Hero Image",
            description: heroData.title || "",
            imageUrl: heroData.imageUrl,
            status: "ACTIVE",
            id: heroData.id,
          },
        ]);
      }
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

  // Handle image changes from ImageUploader
  const handleImagesChange = (images: HeroImageData[]) => {
    setHeroImages(images);
    // Update the imageUrl in the hero data
    if (editedHero && images.length > 0) {
      handleBasicFieldChange("imageUrl", images[0].imageUrl);
    } else if (editedHero && images.length === 0) {
      handleBasicFieldChange("imageUrl", "");
    }
  };

  const handleUploadingChange = (uploading: boolean) => {
    setUploadingImage(uploading);
  };

  // Handle basic field changes
  const handleBasicFieldChange = (field: string, value: any) => {
    if (!editedHero) return;
    setBasicDetailsChanged(true);
    setEditedHero({
      ...editedHero,
      [field]: value,
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    if (!originalHero || !editedHero) return false;
    
    // Check if any fields changed
    const fields: (keyof HeroSectionDetails)[] = [
      "name", "title", "subtitle", "description", 
      "primaryButtonText", "primaryButtonLink", 
      "secondaryButtonText", "secondaryButtonLink", 
      "statusId", "order"
    ];
    
    for (const field of fields) {
      if (originalHero[field] !== editedHero[field]) {
        return true;
      }
    }
    
    // Check image changes
    if (originalHero.imageUrl !== editedHero.imageUrl) {
      return true;
    }
    
    return false;
  }, [originalHero, editedHero]);

  // Prepare update data
  const prepareUpdateData = (): UpdateHeroSectionRequest | null => {
    if (!editedHero || !selectedHero) return null;

    return {
      heroSectionId: selectedHero.id,
      heroSectionType: heroSectionType,
      name: editedHero.name,
      imageUrl: editedHero.imageUrl,
      title: editedHero.title,
      subtitle: editedHero.subtitle,
      description: editedHero.description,
      primaryButtonText: editedHero.primaryButtonText,
      primaryButtonLink: editedHero.primaryButtonLink,
      secondaryButtonText: editedHero.secondaryButtonText,
      secondaryButtonLink: editedHero.secondaryButtonLink,
      statusId: editedHero.statusId,
      order: editedHero.order,
    };
  };

  // Handle update submission
  const handleUpdateSubmit = async () => {
    const updateData = prepareUpdateData();
    if (!updateData) return;

    setLoadingUpdate(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await HeroSectionService.updateHeroSection(updateData);

      setSuccess(`Hero Section "${editedHero?.name}" updated successfully!`);

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedHero?.name} has been updated successfully.`,
        actionLink: `${HOME_HERO_SECTION_DETAILS_VIEW_URL}/${selectedHero?.id}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedHero) {
          fetchHeroDetails(selectedHero.id);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update hero section");
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update hero section. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalHero) {
      setEditedHero(originalHero);
      setBasicDetailsChanged(false);
      setError(null);
      setSuccess(null);
      
      // Reset images
      if (originalHero.imageUrl) {
        setHeroImages([
          {
            name: originalHero.name || "Hero Image",
            description: originalHero.title || "",
            imageUrl: originalHero.imageUrl,
            status: "ACTIVE",
            id: originalHero.id,
          },
        ]);
      } else {
        setHeroImages([]);
      }

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearHeroSelection = () => {
    setSelectedHero(null);
    setOriginalHero(null);
    setEditedHero(null);
    setHeroImages([]);
    setToast(null);
    updateUrlWithSelectedHero(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalHero || !editedHero) return [];

    const changes: ChangedField[] = [];

    const fields = [
      { key: "name", label: "Name" },
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle" },
      { key: "description", label: "Description" },
      { key: "primaryButtonText", label: "Primary Button Text" },
      { key: "primaryButtonLink", label: "Primary Button Link" },
      { key: "secondaryButtonText", label: "Secondary Button Text" },
      { key: "secondaryButtonLink", label: "Secondary Button Link" },
      { key: "order", label: "Order" },
    ];

    fields.forEach(({ key, label }) => {
      const oldValue = originalHero[key as keyof HeroSectionDetails];
      const newValue = editedHero[key as keyof HeroSectionDetails];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    if (originalHero.imageUrl !== editedHero.imageUrl) {
      changes.push({
        field: "Image",
        oldValue: originalHero.imageUrl ? "Has Image" : "No Image",
        newValue: editedHero.imageUrl ? "Has Image" : "No Image",
      });
    }

    if (originalHero.statusId !== editedHero.statusId) {
      const oldStatus = statusList.find((s) => s.statusId === originalHero.statusId)?.statusName || "Unknown";
      const newStatus = statusList.find((s) => s.statusId === editedHero.statusId)?.statusName || "Unknown";
      changes.push({
        field: "Status",
        oldValue: oldStatus,
        newValue: newStatus,
      });
    }

    return changes;
  };

  // Convert hero sections to search items format
  const searchItems: SearchItem[] = heroSections.map((hero) => ({
    id: hero.id,
    name: hero.name,
  }));

  const selectedSearchItem = selectedHero
    ? {
        id: selectedHero.id,
        name: selectedHero.name,
      }
    : null;

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  // Show loading state
  if (loading || commonLoading) {
    return (
      <CommonLoading
        message="Loading hero sections..."
        subMessage="Please wait while we fetch available hero sections"
        size="lg"
      />
    );
  }

  return (
    <motion.div
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
          actionText="View Hero Section"
        />
      )}

      {/* Header with Breadcrumb */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={title}
            description={description}
            breadcrumbItems={breadcrumbData}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedHero && (
          <div
            className="rounded-2xl shadow-lg p-8 mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: theme.text }}
            >
              <Search className="w-6 h-6" style={{ color: theme.primary }} />
              Select Hero Section to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) => handleSelectHero(item.id as number, item.name)}
              onClearSelection={handleClearHeroSelection}
              initialSearchTerm={initialHeroName}
              placeholder="Search hero sections..."
              title="Hero Sections"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Hero Info Bar */}
        {selectedHero && (
          <SelectedItemBar
            item={{
              id: selectedHero.id,
              name: selectedHero.name,
            }}
            onClear={handleClearHeroSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Hero"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading hero section details..."
            subMessage="Please wait while we fetch the hero section information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Hero Details Form */}
        {editedHero && selectedHero && (
          <div className="space-y-6">
            {/* Basic Information Section */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <button
                onClick={() => toggleSection("basic")}
                className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
                style={{
                  backgroundColor: expandedSections.has("basic") ? `${theme.primary}05` : "transparent",
                  borderBottom: expandedSections.has("basic") ? `1px solid ${theme.border}` : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.primary}18`,
                      color: theme.primary,
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
                      Basic Information
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                      Core details about the hero section (editable)
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-200"
                  style={{
                    transform: expandedSections.has("basic") ? "rotate(180deg)" : "none",
                    color: theme.textSecondary,
                  }}
                />
              </button>

              <AnimatePresence>
                {expandedSections.has("basic") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="p-6 space-y-5"
                  >
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                        Name <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={editedHero.name}
                        onChange={(e) => handleBasicFieldChange("name", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          ...fieldBase,
                          borderColor: basicDetailsChanged ? theme.primary : theme.border,
                        }}
                        placeholder="e.g., Home Hero"
                        {...focusHandlers}
                      />
                    </div>

                    {/* Image Upload using ImageUploader */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                        <ImageIcon className="w-3.5 h-3.5" />
                        Hero Image
                      </label>
                      <ImageUploader
                        images={heroImages}
                        onImagesChange={handleImagesChange}
                        onUploadingChange={handleUploadingChange}
                        maxImages={1}
                        title="Hero Image"
                        description="Upload a hero image (max 5MB)"
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                        <Type className="w-3.5 h-3.5" />
                        Title <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={editedHero.title}
                        onChange={(e) => handleBasicFieldChange("title", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          ...fieldBase,
                          borderColor: basicDetailsChanged ? theme.primary : theme.border,
                        }}
                        placeholder="e.g., Explore the World"
                        {...focusHandlers}
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                        <Type className="w-3.5 h-3.5" />
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={editedHero.subtitle}
                        onChange={(e) => handleBasicFieldChange("subtitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          ...fieldBase,
                          borderColor: basicDetailsChanged ? theme.primary : theme.border,
                        }}
                        placeholder="e.g., Discover amazing places"
                        {...focusHandlers}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                        <AlignLeft className="w-3.5 h-3.5" />
                        Description
                      </label>
                      <textarea
                        value={editedHero.description}
                        onChange={(e) => handleBasicFieldChange("description", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{
                          ...fieldBase,
                          borderColor: basicDetailsChanged ? theme.primary : theme.border,
                        }}
                        placeholder="Describe the hero section..."
                        {...focusHandlers}
                      />
                    </div>

                    {/* Primary Button */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                          <Link className="w-3.5 h-3.5" />
                          Primary Button Text
                        </label>
                        <input
                          type="text"
                          value={editedHero.primaryButtonText}
                          onChange={(e) => handleBasicFieldChange("primaryButtonText", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{
                            ...fieldBase,
                            borderColor: basicDetailsChanged ? theme.primary : theme.border,
                          }}
                          placeholder="e.g., Get Started"
                          {...focusHandlers}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                          <Link className="w-3.5 h-3.5" />
                          Primary Button Link
                        </label>
                        <input
                          type="text"
                          value={editedHero.primaryButtonLink}
                          onChange={(e) => handleBasicFieldChange("primaryButtonLink", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{
                            ...fieldBase,
                            borderColor: basicDetailsChanged ? theme.primary : theme.border,
                          }}
                          placeholder="/contact"
                          {...focusHandlers}
                        />
                      </div>
                    </div>

                    {/* Secondary Button */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                          <Link className="w-3.5 h-3.5" />
                          Secondary Button Text
                        </label>
                        <input
                          type="text"
                          value={editedHero.secondaryButtonText}
                          onChange={(e) => handleBasicFieldChange("secondaryButtonText", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{
                            ...fieldBase,
                            borderColor: basicDetailsChanged ? theme.primary : theme.border,
                          }}
                          placeholder="e.g., Learn More"
                          {...focusHandlers}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                          <Link className="w-3.5 h-3.5" />
                          Secondary Button Link
                        </label>
                        <input
                          type="text"
                          value={editedHero.secondaryButtonLink}
                          onChange={(e) => handleBasicFieldChange("secondaryButtonLink", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{
                            ...fieldBase,
                            borderColor: basicDetailsChanged ? theme.primary : theme.border,
                          }}
                          placeholder="/about"
                          {...focusHandlers}
                        />
                      </div>
                    </div>

                    {/* Status & Order */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                          <Info className="w-3.5 h-3.5" />
                          Status <span style={{ color: theme.error }}>*</span>
                        </label>
                        <select
                          value={editedHero.statusId}
                          onChange={(e) => handleBasicFieldChange("statusId", parseInt(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm cursor-pointer"
                          style={{
                            ...fieldBase,
                            borderColor: basicDetailsChanged ? theme.primary : theme.border,
                          }}
                          {...focusHandlers}
                        >
                          {statusList.map((status) => (
                            <option key={status.statusId} value={status.statusId}>
                              {status.statusName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                          <Hash className="w-3.5 h-3.5" />
                          Order <span style={{ color: theme.error }}>*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editedHero.order}
                          onChange={(e) => handleBasicFieldChange("order", parseInt(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{
                            ...fieldBase,
                            borderColor: basicDetailsChanged ? theme.primary : theme.border,
                          }}
                          placeholder="0"
                          {...focusHandlers}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Created/Updated Info Section (Read-only) */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    backgroundColor: `${theme.success}18`,
                    color: theme.success,
                  }}
                >
                  <Info className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
                    Audit Information
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                    Created and updated details
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
                    <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Created</p>
                    <p style={{ color: theme.text }}>
                      {new Date(editedHero.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                      By: {editedHero.createdByUsername}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
                    <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Updated</p>
                    <p style={{ color: theme.text }}>
                      {new Date(editedHero.updatedAt).toLocaleString()}
                    </p>
                    <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                      By: {editedHero.updatedByUsername || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Action Buttons */}
        {editedHero && originalHero && (
          <div
            className="rounded-2xl shadow-lg p-8 mt-8 transition-colors duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResetChanges}
                disabled={!hasChanges() || loadingUpdate || uploadingImage}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.background;
                }}
              >
                <RefreshCw className="w-5 h-5" />
                Reset Changes
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!hasChanges() || loadingUpdate || uploadingImage}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                }}
              >
                <Save className="w-5 h-5" />
                {loadingUpdate ? "Updating..." : "Update Hero Section"}
              </button>
            </div>

            {/* Change Indicator */}
            {hasChanges() && !uploadingImage && (
              <div
                className="mt-6 p-4 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5" style={{ color: theme.primary }} />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      You have unsaved changes
                    </p>
                    <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                      Click "Update Hero Section" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Uploading Indicator */}
            {uploadingImage && (
              <div
                className="mt-4 p-4 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: theme.primary }} />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      Uploading image to Cloudinary...
                    </p>
                    <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                      Please wait for the image to finish uploading before updating
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalHero && editedHero && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedHero.name}
            changedFields={getChangedFields()}
            confirmText="Update Hero Section"
            cancelText="Cancel"
            title="Confirm Hero Section Update"
            message={`You are about to update "${editedHero.name}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default HeroSectionUpdateCommonPage;