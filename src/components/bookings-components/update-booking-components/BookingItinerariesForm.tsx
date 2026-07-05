"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calendar, Plus, X, ChevronDown, Edit2, Trash2, MapPin, Clock } from "lucide-react";
import { BookingItinerary, CreateBookingParams, CreateBookingItineraryRequest, UpdateBookingItineraryRequest } from "@/types/booking-types";
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

interface BookingItinerariesFormProps {
  itineraries: BookingItinerary[];
  removedItineraries: number[];
  bookingParams: CreateBookingParams;
  onAddItinerary: (itinerary: CreateBookingItineraryRequest) => void;
  onRemoveItinerary: (itineraryId: number) => void;
  onUpdateItinerary: (itinerary: UpdateBookingItineraryRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const BookingItinerariesForm: React.FC<BookingItinerariesFormProps> = ({
  itineraries,
  removedItineraries,
  bookingParams,
  onAddItinerary,
  onRemoveItinerary,
  onUpdateItinerary,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<BookingItinerary | null>(null);

  const [newItinerary, setNewItinerary] = useState<CreateBookingItineraryRequest>({
    dayNumber: itineraries.length + 1,
    itineraryDate: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    includedMeals: "",
    status: 1,
  });

  const [editItineraryData, setEditItineraryData] = useState<UpdateBookingItineraryRequest>({
    itineraryId: 0,
    dayNumber: 0,
    itineraryDate: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    includedMeals: "",
    status: 1,
  });

  const isItineraryRemoved = (id: number) => removedItineraries.includes(id);
  const visibleItineraries = itineraries.filter(i => !isItineraryRemoved(i.itineraryId || 0));

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

  const handleAddItinerary = () => {
    if (!newItinerary.title || !newItinerary.itineraryDate) {
      alert("Title and date are required");
      return;
    }
    onAddItinerary(newItinerary);
    setNewItinerary({
      dayNumber: itineraries.length + 2,
      itineraryDate: "",
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      includedMeals: "",
      status: 1,
    });
    setShowAddForm(false);
  };

  const handleUpdateItinerary = () => {
    if (!editItineraryData.title || !editItineraryData.itineraryDate) {
      alert("Title and date are required");
      return;
    }
    onUpdateItinerary(editItineraryData);
    setEditingItinerary(null);
    setEditItineraryData({
      itineraryId: 0,
      dayNumber: 0,
      itineraryDate: "",
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      includedMeals: "",
      status: 1,
    });
  };

  const handleEditClick = (itinerary: BookingItinerary) => {
    setEditingItinerary(itinerary);
    setEditItineraryData({
      itineraryId: itinerary.itineraryId || 0,
      dayNumber: itinerary.dayNumber,
      itineraryDate: itinerary.itineraryDate,
      title: itinerary.title,
      description: itinerary.description,
      startTime: itinerary.startTime,
      endTime: itinerary.endTime,
      location: itinerary.location,
      includedMeals: itinerary.includedMeals,
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
        onClick={() => onToggleSection("itineraries")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("itineraries") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("itineraries") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
          >
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Itineraries
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {visibleItineraries.length} itineraries
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
            style={{ transform: expandedSections.has("itineraries") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("itineraries") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {/* Add Itinerary Form */}
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
                    Add Itinerary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Day Number
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newItinerary.dayNumber}
                        onChange={(e) => setNewItinerary({ ...newItinerary, dayNumber: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Itinerary Date <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="date"
                        value={newItinerary.itineraryDate}
                        onChange={(e) => setNewItinerary({ ...newItinerary, itineraryDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Title <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newItinerary.title}
                        onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., City Tour"
                        {...focusHandlers}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Description
                      </label>
                      <textarea
                        value={newItinerary.description}
                        onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Detailed description..."
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={newItinerary.startTime}
                        onChange={(e) => setNewItinerary({ ...newItinerary, startTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        End Time
                      </label>
                      <input
                        type="time"
                        value={newItinerary.endTime}
                        onChange={(e) => setNewItinerary({ ...newItinerary, endTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <MapPin className="w-3 h-3 inline mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={newItinerary.location}
                        onChange={(e) => setNewItinerary({ ...newItinerary, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., City Center"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Included Meals
                      </label>
                      <input
                        type="text"
                        value={newItinerary.includedMeals}
                        onChange={(e) => setNewItinerary({ ...newItinerary, includedMeals: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Breakfast, Lunch"
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
                      onClick={handleAddItinerary}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.success }}
                    >
                      Add Itinerary
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Itinerary Modal */}
            <AnimatePresence>
              {editingItinerary && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setEditingItinerary(null)}
                >
                  <div
                    className="rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                    style={{ backgroundColor: theme.surface }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                      Edit Itinerary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Day Number
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={editItineraryData.dayNumber}
                          onChange={(e) => setEditItineraryData({ ...editItineraryData, dayNumber: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Itinerary Date
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(editItineraryData.itineraryDate)}
                          onChange={(e) => setEditItineraryData({ ...editItineraryData, itineraryDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Title
                        </label>
                        <input
                          type="text"
                          value={editItineraryData.title}
                          onChange={(e) => setEditItineraryData({ ...editItineraryData, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Description
                        </label>
                        <textarea
                          value={editItineraryData.description}
                          onChange={(e) => setEditItineraryData({ ...editItineraryData, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border-2 resize-none"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={editItineraryData.startTime}
                          onChange={(e) => setEditItineraryData({ ...editItineraryData, startTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          End Time
                        </label>
                        <input
                          type="time"
                          value={editItineraryData.endTime}
                          onChange={(e) => setEditItineraryData({ ...editItineraryData, endTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Location
                        </label>
                        <input
                          type="text"
                          value={editItineraryData.location}
                          onChange={(e) => setEditItineraryData({ ...editItineraryData, location: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Included Meals
                        </label>
                        <input
                          type="text"
                          value={editItineraryData.includedMeals}
                          onChange={(e) => setEditItineraryData({ ...editItineraryData, includedMeals: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-2">
                      <button
                        onClick={() => setEditingItinerary(null)}
                        className="flex-1 px-4 py-2 rounded-lg"
                        style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateItinerary}
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

            {/* Itineraries List */}
            {visibleItineraries.length === 0 ? (
              <div className="text-center py-8" style={{ backgroundColor: `${theme.border}10`, borderRadius: "12px" }}>
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>No itineraries added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleItineraries.map((itinerary) => (
                  <div
                    key={itinerary.itineraryId}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.border}10`, border: `1px solid ${theme.border}` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primary, color: "#fff" }}>
                            Day {itinerary.dayNumber}
                          </span>
                          <span className="text-sm font-medium" style={{ color: theme.text }}>{itinerary.title}</span>
                          {itinerary.itineraryDate && (
                            <span className="text-xs" style={{ color: theme.textSecondary }}>
                              {itinerary.itineraryDate.split("T")[0]}
                            </span>
                          )}
                        </div>
                        {itinerary.description && (
                          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{itinerary.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: theme.textSecondary }}>
                          {itinerary.startTime && itinerary.endTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {itinerary.startTime.slice(0,5)} - {itinerary.endTime.slice(0,5)}
                            </span>
                          )}
                          {itinerary.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {itinerary.location}
                            </span>
                          )}
                          {itinerary.includedMeals && (
                            <span className="flex items-center gap-1">
                              🍽️ {itinerary.includedMeals}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(itinerary)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.primary }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemoveItinerary(itinerary.itineraryId || 0)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.error }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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