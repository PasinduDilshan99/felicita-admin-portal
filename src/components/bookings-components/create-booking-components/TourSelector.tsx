// components/booking-components/TourSelector.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Compass,
  Search,
  ChevronDown,
  Check,
  AlertCircle,
  Loader,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourService } from "@/services/tourService";
import { TourNameId } from "@/types/tour-types";

interface TourSelectorProps {
  selectedTourId?: number;
  onTourSelect: (tourId: number, tourName: string) => void;
  onTourClear?: () => void;
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

export const TourSelector: React.FC<TourSelectorProps> = ({
  selectedTourId,
  onTourSelect,
  onTourClear,
  error,
  required = false,
  label = "Select Tour",
  placeholder = "Search and select a tour...",
}) => {
  const { theme } = useTheme();
  const [tours, setTours] = useState<TourNameId[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourNameId | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);
  const isInitialMountRef = useRef(true);

  const fetchTours = async () => {
    if (loading || !isMountedRef.current) return;

    try {
      setLoading(true);
      setApiError(null);
      const response = await TourService.getAllTourNames();

      if (!isMountedRef.current) return;

      if (response.code === 200 && response.data) {
        // Ensure response.data is properly typed
        const tourData: TourNameId[] = response.data.map((item: any) => ({
          tourId: item.tourId || item.id,
          tourName: item.tourName || item.name,
        }));

        setTours(tourData);

        // Handle pre-selected tour
        if (selectedTourId && selectedTourId > 0) {
          const preSelected = tourData.find((t) => t.tourId === selectedTourId);
          if (preSelected) {
            setSelectedTour(preSelected);
            onTourSelect(preSelected.tourId, preSelected.tourName);
          }
        }
      } else {
        setApiError(response.message || "Failed to load tours");
      }
    } catch (err) {
      console.error("Error fetching tours:", err);
      if (isMountedRef.current) {
        setApiError(
          err instanceof Error
            ? err.message
            : "Error loading tours. Please try again.",
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (isInitialMountRef.current) {
      fetchTours();
      isInitialMountRef.current = false;
    }

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fix: Explicitly type filteredTours
  const filteredTours: TourNameId[] = useMemo(() => {
    if (!searchQuery.trim()) return tours;
    return tours.filter((tour) =>
      tour.tourName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tours, searchQuery]);

  const handleSelectTour = (tour: TourNameId) => {
    setSelectedTour(tour);
    setIsDropdownOpen(false);
    setSearchQuery("");
    onTourSelect(tour.tourId, tour.tourName);
  };

  const handleClearTour = () => {
    setSelectedTour(null);
    if (onTourClear) onTourClear();
    onTourSelect(0, "");
  };

  // Render function for dropdown items
  const renderDropdownItems = () => {
    if (loading) {
      return (
        <div
          className="p-4 text-center text-sm"
          style={{ color: theme.textSecondary }}
        >
          <Loader
            className="w-5 h-5 animate-spin mx-auto mb-2"
            style={{ color: theme.primary }}
          />
          Loading tours...
        </div>
      );
    }

    if (apiError) {
      return (
        <div className="p-4 text-center">
          <div className="text-sm mb-2" style={{ color: theme.error }}>
            <AlertCircle className="w-5 h-5 mx-auto mb-2" />
            {apiError}
          </div>
          <button
            onClick={fetchTours}
            className="text-xs px-3 py-1 rounded-lg transition-colors flex items-center gap-1 mx-auto"
            style={{
              backgroundColor: `${theme.primary}20`,
              color: theme.primary,
            }}
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      );
    }

    if (filteredTours.length === 0) {
      return (
        <div
          className="p-4 text-center text-sm"
          style={{ color: theme.textSecondary }}
        >
          {searchQuery ? "No tours match your search" : "No tours available"}
        </div>
      );
    }

    return filteredTours.map((tour) => {
      const isSelected = selectedTour?.tourId === tour.tourId;
      return (
        <button
          key={tour.tourId}
          type="button"
          onClick={() => handleSelectTour(tour)}
          className="w-full px-4 py-3 text-left transition-all duration-150 flex items-center justify-between group"
          style={{
            backgroundColor: isSelected ? `${theme.primary}10` : "transparent",
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = `${theme.border}30`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full transition-all duration-200 group-hover:scale-150"
                style={{
                  backgroundColor: isSelected
                    ? theme.primary
                    : theme.textSecondary,
                }}
              />
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {tour.tourName}
              </p>
            </div>
          </div>
          {isSelected && (
            <Check
              className="w-4 h-4 ml-2 flex-shrink-0"
              style={{ color: theme.primary }}
            />
          )}
        </button>
      );
    });
  };

  return (
    <div
      className="rounded-2xl overflow-visible transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${error ? theme.error : theme.border}`,
        boxShadow: error
          ? `0 0 0 3px ${theme.error}18`
          : "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            backgroundColor: `${theme.primary}18`,
            color: theme.primary,
          }}
        >
          <Compass className="w-4 h-4" />
        </span>
        <div>
          <h2
            className="text-base font-semibold leading-tight"
            style={{ color: theme.text }}
          >
            {label}
            {required && <span style={{ color: theme.error }}> *</span>}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Search and select a tour to book
          </p>
        </div>
        {selectedTour && (
          <button
            type="button"
            onClick={handleClearTour}
            className="ml-auto text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20"
            style={{ color: theme.error }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="px-6 py-6 space-y-4">
        {!selectedTour ? (
          <div
            className="relative"
            ref={dropdownRef}
            style={{ position: "relative", zIndex: 50 }}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: theme.textSecondary }}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 focus:outline-none text-sm transition-all duration-200"
                style={{
                  backgroundColor: theme.background,
                  borderColor: isDropdownOpen ? theme.primary : theme.border,
                  color: theme.text,
                }}
              />
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 cursor-pointer"
                style={{
                  color: theme.textSecondary,
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              />
            </div>

            {isDropdownOpen && (
              <div
                className="absolute w-full mt-2 rounded-xl shadow-lg z-[9999]"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  maxHeight: "300px",
                  overflowY: "auto",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                }}
              >
                {renderDropdownItems()}
              </div>
            )}
          </div>
        ) : (
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{
              backgroundColor: `${theme.primary}08`,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5" style={{ color: theme.primary }} />
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  {selectedTour.tourName}
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Tour ID: {selectedTour.tourId}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearTour}
              className="text-xs px-2 py-1 rounded-lg hover:bg-opacity-20 transition-colors"
              style={{ color: theme.error }}
            >
              Change
            </button>
          </div>
        )}

        {error && (
          <p
            className="text-xs flex items-center gap-1"
            style={{ color: theme.error }}
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
