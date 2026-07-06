// components/bookings-components/create-booking-components/BookingTransportation.tsx
"use client";

import React, { useState } from "react";
import { Car, Plus, X, Calendar, Clock, MapPin, Hash } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { CreateTransportationRequest } from "@/types/booking-types";

interface BookingTransportationProps {
  transportations: CreateTransportationRequest[];
  onTransportationChange: (transportations: CreateTransportationRequest[]) => void;
  vehicles: { id: number; name: string }[];
  transportTypes: string[];
}

const defaultTransportation: CreateTransportationRequest = {
  transportType: "",
  vehicleId: 0,
  departureDate: "",
  departureTime: "",
  arrivalDate: "",
  arrivalTime: "",
  departureLocation: "",
  arrivalLocation: "",
  carrierName: "",
  referenceNumber: "",
  seatNumbers: "",
  status: 1,
};

export const BookingTransportation: React.FC<BookingTransportationProps> = ({
  transportations,
  onTransportationChange,
  vehicles,
  transportTypes,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const addTransportation = () => {
    onTransportationChange([...transportations, { ...defaultTransportation }]);
  };

  const removeTransportation = (index: number) => {
    onTransportationChange(transportations.filter((_, i) => i !== index));
  };

  const updateTransportation = (index: number, field: keyof CreateTransportationRequest, value: any) => {
    const updated = [...transportations];
    updated[index] = { ...updated[index], [field]: value };
    onTransportationChange(updated);
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
            <Car className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold" style={{ color: theme.text }}>Transportation</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Add transportation details</p>
          </div>
          {transportations.length > 0 && (
            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
              {transportations.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); addTransportation(); }}
          className="p-1.5 rounded-lg transition-colors hover:bg-opacity-20"
          style={{ color: theme.primary }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {transportations.length === 0 ? (
            <div className="text-center py-8" style={{ color: theme.textSecondary }}>
              <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No transportation added yet</p>
              <button type="button" onClick={addTransportation} className="mt-2 text-sm font-medium hover:underline" style={{ color: theme.primary }}>
                Add Transportation
              </button>
            </div>
          ) : (
            transportations.map((transport, index) => (
              <div key={index} className="rounded-xl p-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.border}` }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: theme.text }}>Transport #{index + 1}</h4>
                  <button type="button" onClick={() => removeTransportation(index)} className="p-1 rounded-lg hover:bg-opacity-20" style={{ color: theme.error }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Transport Type</label>
                    <select
                      value={transport.transportType}
                      onChange={(e) => updateTransportation(index, 'transportType', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    >
                      <option value="">Select type</option>
                      {transportTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Vehicle</label>
                    <select
                      value={transport.vehicleId}
                      onChange={(e) => updateTransportation(index, 'vehicleId', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    >
                      <option value={0}>Select vehicle</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Departure Date</label>
                    <input
                      type="date"
                      value={transport.departureDate}
                      onChange={(e) => updateTransportation(index, 'departureDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Departure Time</label>
                    <input
                      type="time"
                      value={transport.departureTime}
                      onChange={(e) => updateTransportation(index, 'departureTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Arrival Date</label>
                    <input
                      type="date"
                      value={transport.arrivalDate}
                      onChange={(e) => updateTransportation(index, 'arrivalDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Arrival Time</label>
                    <input
                      type="time"
                      value={transport.arrivalTime}
                      onChange={(e) => updateTransportation(index, 'arrivalTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Departure Location</label>
                    <input
                      type="text"
                      value={transport.departureLocation}
                      onChange={(e) => updateTransportation(index, 'departureLocation', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Departure location"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Arrival Location</label>
                    <input
                      type="text"
                      value={transport.arrivalLocation}
                      onChange={(e) => updateTransportation(index, 'arrivalLocation', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Arrival location"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Carrier Name</label>
                    <input
                      type="text"
                      value={transport.carrierName}
                      onChange={(e) => updateTransportation(index, 'carrierName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Carrier name"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Reference Number</label>
                    <input
                      type="text"
                      value={transport.referenceNumber}
                      onChange={(e) => updateTransportation(index, 'referenceNumber', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Reference number"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Seat Numbers</label>
                    <input
                      type="text"
                      value={transport.seatNumbers}
                      onChange={(e) => updateTransportation(index, 'seatNumbers', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Seat numbers"
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