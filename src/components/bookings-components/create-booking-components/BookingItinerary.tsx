// components/bookings-components/create-booking-components/BookingItinerary.tsx
"use client";

import React, { useState } from "react";
import { Calendar, Plus, X, Clock, MapPin, FileText, Coffee } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { CreateBookingItineraryRequest } from "@/types/booking-types";

interface BookingItineraryProps {
  itineraries: CreateBookingItineraryRequest[];
  onItineraryChange: (itineraries: CreateBookingItineraryRequest[]) => void;
  includedMeals: string[];
}

const defaultItinerary: CreateBookingItineraryRequest = {
  dayNumber: 1,
  itineraryDate: "",
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  location: "",
  includedMeals: "",
  status: 1,
};

export const BookingItinerary: React.FC<BookingItineraryProps> = ({
  itineraries,
  onItineraryChange,
  includedMeals,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const addItinerary = () => {
    const nextDay = itineraries.length + 1;
    onItineraryChange([...itineraries, { ...defaultItinerary, dayNumber: nextDay }]);
  };

  const removeItinerary = (index: number) => {
    const updated = itineraries.filter((_, i) => i !== index);
    // Re-number days
    updated.forEach((item, idx) => {
      item.dayNumber = idx + 1;
    });
    onItineraryChange(updated);
  };

  const updateItinerary = (index: number, field: keyof CreateBookingItineraryRequest, value: any) => {
    const updated = [...itineraries];
    updated[index] = { ...updated[index], [field]: value };
    onItineraryChange(updated);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}>
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold" style={{ color: theme.text }}>Itinerary</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Add day-by-day itinerary</p>
          </div>
          {itineraries.length > 0 && (
            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
              {itineraries.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); addItinerary(); }}
          className="p-1.5 rounded-lg transition-colors hover:bg-opacity-20"
          style={{ color: theme.primary }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {itineraries.length === 0 ? (
            <div className="text-center py-8" style={{ color: theme.textSecondary }}>
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No itinerary added yet</p>
              <button type="button" onClick={addItinerary} className="mt-2 text-sm font-medium hover:underline" style={{ color: theme.primary }}>
                Add Day
              </button>
            </div>
          ) : (
            itineraries.map((itinerary, index) => (
              <div key={index} className="rounded-xl p-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.border}` }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: theme.text }}>Day {itinerary.dayNumber}</h4>
                  <button type="button" onClick={() => removeItinerary(index)} className="p-1 rounded-lg hover:bg-opacity-20" style={{ color: theme.error }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Date</label>
                    <input
                      type="date"
                      value={itinerary.itineraryDate}
                      onChange={(e) => updateItinerary(index, 'itineraryDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Title</label>
                    <input
                      type="text"
                      value={itinerary.title}
                      onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Day title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Start Time</label>
                    <input
                      type="time"
                      value={itinerary.startTime}
                      onChange={(e) => updateItinerary(index, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>End Time</label>
                    <input
                      type="time"
                      value={itinerary.endTime}
                      onChange={(e) => updateItinerary(index, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Location</label>
                  <input
                    type="text"
                    value={itinerary.location}
                    onChange={(e) => updateItinerary(index, 'location', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="Location"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Description</label>
                  <textarea
                    value={itinerary.description}
                    onChange={(e) => updateItinerary(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg text-sm border resize-none"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="Day description..."
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Included Meals</label>
                  <select
                    value={itinerary.includedMeals}
                    onChange={(e) => updateItinerary(index, 'includedMeals', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  >
                    <option value="">Select meals</option>
                    {includedMeals.map((meal) => (
                      <option key={meal} value={meal}>{meal}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};