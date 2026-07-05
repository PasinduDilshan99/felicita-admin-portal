// components/bookings-components/create-booking-components/BookingAccommodations.tsx
"use client";

import React, { useState } from "react";
import { Hotel, Plus, X, Calendar, Hash, Home } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { CreateAccommodationRequest } from "@/types/booking-types";

interface BookingAccommodationsProps {
  accommodations: CreateAccommodationRequest[];
  onAccommodationsChange: (accommodations: CreateAccommodationRequest[]) => void;
  hotels: { id: number; name: string }[];
  roomTypes: string[];
}

const defaultAccommodation: CreateAccommodationRequest = {
  checkInDate: "",
  checkOutDate: "",
  hotelId: "",
  roomType: "",
  roomNumber: "",
  confirmationNumber: "",
  status: 1,
};

export const BookingAccommodations: React.FC<BookingAccommodationsProps> = ({
  accommodations,
  onAccommodationsChange,
  hotels,
  roomTypes,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const addAccommodation = () => {
    onAccommodationsChange([...accommodations, { ...defaultAccommodation }]);
  };

  const removeAccommodation = (index: number) => {
    onAccommodationsChange(accommodations.filter((_, i) => i !== index));
  };

  const updateAccommodation = (index: number, field: keyof CreateAccommodationRequest, value: any) => {
    const updated = [...accommodations];
    updated[index] = { ...updated[index], [field]: value };
    onAccommodationsChange(updated);
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
            <Hotel className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold" style={{ color: theme.text }}>Accommodations</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Add hotel accommodations</p>
          </div>
          {accommodations.length > 0 && (
            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
              {accommodations.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); addAccommodation(); }}
          className="p-1.5 rounded-lg transition-colors hover:bg-opacity-20"
          style={{ color: theme.primary }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {accommodations.length === 0 ? (
            <div className="text-center py-8" style={{ color: theme.textSecondary }}>
              <Hotel className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No accommodations added yet</p>
              <button type="button" onClick={addAccommodation} className="mt-2 text-sm font-medium hover:underline" style={{ color: theme.primary }}>
                Add Accommodation
              </button>
            </div>
          ) : (
            accommodations.map((accommodation, index) => (
              <div key={index} className="rounded-xl p-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.border}` }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: theme.text }}>Accommodation #{index + 1}</h4>
                  <button type="button" onClick={() => removeAccommodation(index)} className="p-1 rounded-lg hover:bg-opacity-20" style={{ color: theme.error }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Hotel</label>
                    <select
                      value={accommodation.hotelId}
                      onChange={(e) => updateAccommodation(index, 'hotelId', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    >
                      <option value="">Select hotel</option>
                      {hotels.map((h) => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Room Type</label>
                    <select
                      value={accommodation.roomType}
                      onChange={(e) => updateAccommodation(index, 'roomType', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    >
                      <option value="">Select room type</option>
                      {roomTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Check-in Date</label>
                    <input
                      type="date"
                      value={accommodation.checkInDate}
                      onChange={(e) => updateAccommodation(index, 'checkInDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Check-out Date</label>
                    <input
                      type="date"
                      value={accommodation.checkOutDate}
                      onChange={(e) => updateAccommodation(index, 'checkOutDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Room Number</label>
                    <input
                      type="text"
                      value={accommodation.roomNumber}
                      onChange={(e) => updateAccommodation(index, 'roomNumber', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Room number"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Confirmation Number</label>
                    <input
                      type="text"
                      value={accommodation.confirmationNumber}
                      onChange={(e) => updateAccommodation(index, 'confirmationNumber', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Confirmation number"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};