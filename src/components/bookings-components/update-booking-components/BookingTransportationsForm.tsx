"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Bus, Plus, X, ChevronDown, Edit2, Trash2, Calendar, MapPin } from "lucide-react";
import { Transportation, CreateBookingParams, CreateTransportationRequest, UpdateTransportationRequest } from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto", 
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }
  },
};

interface BookingTransportationsFormProps {
  transportations: Transportation[];
  removedTransportations: number[];
  bookingParams: CreateBookingParams;
  onAddTransportation: (transportation: CreateTransportationRequest) => void;
  onRemoveTransportation: (transportationId: number) => void;
  onUpdateTransportation: (transportation: UpdateTransportationRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const BookingTransportationsForm: React.FC<BookingTransportationsFormProps> = ({
  transportations,
  removedTransportations,
  bookingParams,
  onAddTransportation,
  onRemoveTransportation,
  onUpdateTransportation,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransportation, setEditingTransportation] = useState<Transportation | null>(null);

  const [newTransportation, setNewTransportation] = useState<CreateTransportationRequest>({
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
  });

  const [editTransportationData, setEditTransportationData] = useState<UpdateTransportationRequest>({
    transportationId: 0,
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
  });

  const isTransportationRemoved = (id: number) => removedTransportations.includes(id);
  const visibleTransportations = transportations.filter(t => !isTransportationRemoved(t.transportationId));

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const handleAddTransportation = () => {
    if (!newTransportation.transportType || !newTransportation.departureLocation || !newTransportation.arrivalLocation) {
      alert("Transport type, departure and arrival locations are required");
      return;
    }
    onAddTransportation(newTransportation);
    setNewTransportation({
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
    });
    setShowAddForm(false);
  };

  const handleUpdateTransportation = () => {
    if (!editTransportationData.transportType || !editTransportationData.departureLocation || !editTransportationData.arrivalLocation) {
      alert("Transport type, departure and arrival locations are required");
      return;
    }
    onUpdateTransportation(editTransportationData);
    setEditingTransportation(null);
    setEditTransportationData({
      transportationId: 0,
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
    });
  };

  const handleEditClick = (transportation: Transportation) => {
    setEditingTransportation(transportation);
    setEditTransportationData({
      transportationId: transportation.transportationId,
      transportType: transportation.transportType,
      vehicleId: 0,
      departureDate: transportation.departureDate,
      departureTime: transportation.departureTime,
      arrivalDate: transportation.arrivalDate,
      arrivalTime: transportation.arrivalTime,
      departureLocation: transportation.departureLocation,
      arrivalLocation: transportation.arrivalLocation,
      carrierName: transportation.carrierName,
      referenceNumber: transportation.referenceNumber,
      seatNumbers: transportation.seatNumbers,
      status: 1,
    });
  };

  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    return date.split("T")[0];
  };

  return (
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
        onClick={() => onToggleSection("transportations")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("transportations") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("transportations") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
          >
            <Bus className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Transportations
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {visibleTransportations.length} transportations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddForm(true);
            }}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all"
            style={{ backgroundColor: `${theme.success}15`, color: theme.success }}
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{ transform: expandedSections.has("transportations") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("transportations") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {/* Add Transportation Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl"
                  style={{ backgroundColor: `${theme.success}08`, border: `1px solid ${theme.success}30` }}
                >
                  <h4 className="text-sm font-semibold mb-4" style={{ color: theme.text }}>
                    Add Transportation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Transport Type <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newTransportation.transportType}
                        onChange={(e) => setNewTransportation({ ...newTransportation, transportType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Bus, Flight, Train"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Carrier Name
                      </label>
                      <input
                        type="text"
                        value={newTransportation.carrierName}
                        onChange={(e) => setNewTransportation({ ...newTransportation, carrierName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Reference Number
                      </label>
                      <input
                        type="text"
                        value={newTransportation.referenceNumber}
                        onChange={(e) => setNewTransportation({ ...newTransportation, referenceNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Seat Numbers
                      </label>
                      <input
                        type="text"
                        value={newTransportation.seatNumbers}
                        onChange={(e) => setNewTransportation({ ...newTransportation, seatNumbers: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <MapPin className="w-3 h-3 inline mr-1" />
                        Departure Location <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newTransportation.departureLocation}
                        onChange={(e) => setNewTransportation({ ...newTransportation, departureLocation: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <MapPin className="w-3 h-3 inline mr-1" />
                        Arrival Location <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newTransportation.arrivalLocation}
                        onChange={(e) => setNewTransportation({ ...newTransportation, arrivalLocation: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Departure Date
                      </label>
                      <input
                        type="date"
                        value={newTransportation.departureDate}
                        onChange={(e) => setNewTransportation({ ...newTransportation, departureDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Departure Time
                      </label>
                      <input
                        type="time"
                        value={newTransportation.departureTime}
                        onChange={(e) => setNewTransportation({ ...newTransportation, departureTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Arrival Date
                      </label>
                      <input
                        type="date"
                        value={newTransportation.arrivalDate}
                        onChange={(e) => setNewTransportation({ ...newTransportation, arrivalDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Arrival Time
                      </label>
                      <input
                        type="time"
                        value={newTransportation.arrivalTime}
                        onChange={(e) => setNewTransportation({ ...newTransportation, arrivalTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 pt-2">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTransportation}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.success }}
                    >
                      Add Transportation
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Transportation Modal */}
            <AnimatePresence>
              {editingTransportation && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setEditingTransportation(null)}
                >
                  <div
                    className="rounded-2xl p-6 max-w-2xl w-full mx-4"
                    style={{ backgroundColor: theme.surface }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                      Edit Transportation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Transport Type
                        </label>
                        <input
                          type="text"
                          value={editTransportationData.transportType}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, transportType: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Carrier Name
                        </label>
                        <input
                          type="text"
                          value={editTransportationData.carrierName}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, carrierName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Reference Number
                        </label>
                        <input
                          type="text"
                          value={editTransportationData.referenceNumber}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, referenceNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Seat Numbers
                        </label>
                        <input
                          type="text"
                          value={editTransportationData.seatNumbers}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, seatNumbers: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Departure Location
                        </label>
                        <input
                          type="text"
                          value={editTransportationData.departureLocation}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, departureLocation: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Arrival Location
                        </label>
                        <input
                          type="text"
                          value={editTransportationData.arrivalLocation}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, arrivalLocation: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Departure Date
                        </label>
                        <input
                          type="date"
                          value={editTransportationData.departureDate}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, departureDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Departure Time
                        </label>
                        <input
                          type="time"
                          value={editTransportationData.departureTime}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, departureTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Arrival Date
                        </label>
                        <input
                          type="date"
                          value={editTransportationData.arrivalDate}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, arrivalDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Arrival Time
                        </label>
                        <input
                          type="time"
                          value={editTransportationData.arrivalTime}
                          onChange={(e) => setEditTransportationData({ ...editTransportationData, arrivalTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-2">
                      <button
                        onClick={() => setEditingTransportation(null)}
                        className="flex-1 px-4 py-2 rounded-lg"
                        style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateTransportation}
                        className="flex-1 px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transportations List */}
            {visibleTransportations.length === 0 ? (
              <div className="text-center py-8" style={{ backgroundColor: `${theme.border}10`, borderRadius: "12px" }}>
                <Bus className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>No transportations added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleTransportations.map((transportation) => (
                  <div
                    key={transportation.transportationId}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.border}10`, border: `1px solid ${theme.border}` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Bus className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                        <span className="text-sm font-medium" style={{ color: theme.text }}>
                          {transportation.transportType}
                        </span>
                        {transportation.carrierName && (
                          <span className="text-xs" style={{ color: theme.textSecondary }}>
                            {transportation.carrierName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: theme.textSecondary }}>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {transportation.departureLocation}
                        </span>
                        <span>→</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {transportation.arrivalLocation}
                        </span>
                        {transportation.departureDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateForInput(transportation.departureDate)} {transportation.departureTime?.slice(0,5)}
                          </span>
                        )}
                      </div>
                      {transportation.referenceNumber && (
                        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                          Ref: {transportation.referenceNumber}
                          {transportation.seatNumbers && ` | Seats: ${transportation.seatNumbers}`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(transportation)}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{ color: theme.primary }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveTransportation(transportation.transportationId)}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{ color: theme.error }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};