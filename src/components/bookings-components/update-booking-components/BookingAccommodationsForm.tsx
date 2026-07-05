"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Hotel, Plus, X, ChevronDown, Edit2, Trash2, Calendar } from "lucide-react";
import { Accommodation, CreateBookingParams, CreateAccommodationRequest, UpdateAccommodationRequest } from "@/types/booking-types";
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

interface BookingAccommodationsFormProps {
  accommodations: Accommodation[];
  removedAccommodations: number[];
  bookingParams: CreateBookingParams;
  onAddAccommodation: (accommodation: CreateAccommodationRequest) => void;
  onRemoveAccommodation: (accommodationId: number) => void;
  onUpdateAccommodation: (accommodation: UpdateAccommodationRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const BookingAccommodationsForm: React.FC<BookingAccommodationsFormProps> = ({
  accommodations,
  removedAccommodations,
  bookingParams,
  onAddAccommodation,
  onRemoveAccommodation,
  onUpdateAccommodation,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);

  const [newAccommodation, setNewAccommodation] = useState<CreateAccommodationRequest>({
    checkInDate: "",
    checkOutDate: "",
    hotelId: "",
    roomType: "",
    roomNumber: "",
    confirmationNumber: "",
    status: 1,
  });

  const [editAccommodationData, setEditAccommodationData] = useState<UpdateAccommodationRequest>({
    accommodationId: 0,
    checkInDate: "",
    checkOutDate: "",
    hotelId: "",
    roomType: "",
    roomNumber: "",
    confirmationNumber: "",
    status: 1,
  });

  const isAccommodationRemoved = (id: number) => removedAccommodations.includes(id);
  const visibleAccommodations = accommodations.filter(a => !isAccommodationRemoved(a.accommodationId));

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

  const handleAddAccommodation = () => {
    if (!newAccommodation.hotelId || !newAccommodation.roomType) {
      alert("Hotel and room type are required");
      return;
    }
    onAddAccommodation(newAccommodation);
    setNewAccommodation({
      checkInDate: "",
      checkOutDate: "",
      hotelId: "",
      roomType: "",
      roomNumber: "",
      confirmationNumber: "",
      status: 1,
    });
    setShowAddForm(false);
  };

  const handleUpdateAccommodation = () => {
    if (!editAccommodationData.hotelId || !editAccommodationData.roomType) {
      alert("Hotel and room type are required");
      return;
    }
    onUpdateAccommodation(editAccommodationData);
    setEditingAccommodation(null);
    setEditAccommodationData({
      accommodationId: 0,
      checkInDate: "",
      checkOutDate: "",
      hotelId: "",
      roomType: "",
      roomNumber: "",
      confirmationNumber: "",
      status: 1,
    });
  };

  const handleEditClick = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setEditAccommodationData({
      accommodationId: accommodation.accommodationId,
      checkInDate: accommodation.checkInDate,
      checkOutDate: accommodation.checkOutDate,
      hotelId: accommodation.hotelName,
      roomType: accommodation.roomType,
      roomNumber: accommodation.roomNumber,
      confirmationNumber: accommodation.confirmationNumber,
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
        onClick={() => onToggleSection("accommodations")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("accommodations") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("accommodations") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
          >
            <Hotel className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Accommodations
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {visibleAccommodations.length} accommodations
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
            style={{ transform: expandedSections.has("accommodations") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("accommodations") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {/* Add Accommodation Form */}
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
                    Add Accommodation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Hotel <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newAccommodation.hotelId}
                        onChange={(e) => setNewAccommodation({ ...newAccommodation, hotelId: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Hotel name or ID"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Room Type <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newAccommodation.roomType}
                        onChange={(e) => setNewAccommodation({ ...newAccommodation, roomType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Deluxe"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Room Number
                      </label>
                      <input
                        type="text"
                        value={newAccommodation.roomNumber}
                        onChange={(e) => setNewAccommodation({ ...newAccommodation, roomNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Confirmation Number
                      </label>
                      <input
                        type="text"
                        value={newAccommodation.confirmationNumber}
                        onChange={(e) => setNewAccommodation({ ...newAccommodation, confirmationNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        value={newAccommodation.checkInDate}
                        onChange={(e) => setNewAccommodation({ ...newAccommodation, checkInDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        value={newAccommodation.checkOutDate}
                        onChange={(e) => setNewAccommodation({ ...newAccommodation, checkOutDate: e.target.value })}
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
                      onClick={handleAddAccommodation}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.success }}
                    >
                      Add Accommodation
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Accommodation Modal */}
            <AnimatePresence>
              {editingAccommodation && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setEditingAccommodation(null)}
                >
                  <div
                    className="rounded-2xl p-6 max-w-2xl w-full mx-4"
                    style={{ backgroundColor: theme.surface }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                      Edit Accommodation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Hotel
                        </label>
                        <input
                          type="text"
                          value={editAccommodationData.hotelId}
                          onChange={(e) => setEditAccommodationData({ ...editAccommodationData, hotelId: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Room Type
                        </label>
                        <input
                          type="text"
                          value={editAccommodationData.roomType}
                          onChange={(e) => setEditAccommodationData({ ...editAccommodationData, roomType: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Room Number
                        </label>
                        <input
                          type="text"
                          value={editAccommodationData.roomNumber}
                          onChange={(e) => setEditAccommodationData({ ...editAccommodationData, roomNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Confirmation Number
                        </label>
                        <input
                          type="text"
                          value={editAccommodationData.confirmationNumber}
                          onChange={(e) => setEditAccommodationData({ ...editAccommodationData, confirmationNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          value={editAccommodationData.checkInDate}
                          onChange={(e) => setEditAccommodationData({ ...editAccommodationData, checkInDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          value={editAccommodationData.checkOutDate}
                          onChange={(e) => setEditAccommodationData({ ...editAccommodationData, checkOutDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-2">
                      <button
                        onClick={() => setEditingAccommodation(null)}
                        className="flex-1 px-4 py-2 rounded-lg"
                        style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateAccommodation}
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

            {/* Accommodations List */}
            {visibleAccommodations.length === 0 ? (
              <div className="text-center py-8" style={{ backgroundColor: `${theme.border}10`, borderRadius: "12px" }}>
                <Hotel className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>No accommodations added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleAccommodations.map((accommodation) => (
                  <div
                    key={accommodation.accommodationId}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.border}10`, border: `1px solid ${theme.border}` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Hotel className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                        <span className="text-sm font-medium" style={{ color: theme.text }}>
                          {accommodation.hotelName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
                          {accommodation.roomType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: theme.textSecondary }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          In: {formatDateForInput(accommodation.checkInDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Out: {formatDateForInput(accommodation.checkOutDate)}
                        </span>
                        {accommodation.roomNumber && <span>Room: {accommodation.roomNumber}</span>}
                        {accommodation.confirmationNumber && <span>Conf: {accommodation.confirmationNumber}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(accommodation)}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{ color: theme.primary }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveAccommodation(accommodation.accommodationId)}
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