"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calendar, Plus, X, ChevronDown, Edit2, Trash2, Clock, Users, DollarSign } from "lucide-react";
import { BookingActivity, CreateBookingParams, CreateBookingActivityRequest, UpdateBookingActivityRequest } from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

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

interface BookingActivitiesFormProps {
  activities: BookingActivity[];
  removedActivities: number[];
  bookingParams: CreateBookingParams;
  onAddActivity: (activity: CreateBookingActivityRequest) => void;
  onRemoveActivity: (activityId: number) => void;
  onUpdateActivity: (activity: UpdateBookingActivityRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
  formatPrice: (price: number) => string;
}

export const BookingActivitiesForm: React.FC<BookingActivitiesFormProps> = ({
  activities,
  removedActivities,
  bookingParams,
  onAddActivity,
  onRemoveActivity,
  onUpdateActivity,
  expandedSections,
  onToggleSection,
  theme,
  formatPrice,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<BookingActivity | null>(null);

  const [newActivity, setNewActivity] = useState<CreateBookingActivityRequest>({
    activityId: 0,
    activityScheduleId: 0,
    activityDate: "",
    startTime: "",
    endTime: "",
    numberOfParticipants: 1,
    pricePerPerson: 0,
    totalPrice: 0,
    status: 1,
  });

  const [editActivityData, setEditActivityData] = useState<UpdateBookingActivityRequest>({
    bookingActivityId: 0,
    activityId: 0,
    activityScheduleId: 0,
    activityDate: "",
    startTime: "",
    endTime: "",
    numberOfParticipants: 1,
    pricePerPerson: 0,
    totalPrice: 0,
    status: 1,
  });

  const isActivityRemoved = (id: number) => removedActivities.includes(id);
  const visibleActivities = activities.filter(a => !isActivityRemoved(a.bookingActivityId));

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

  const handleAddActivity = () => {
    if (!newActivity.activityId || !newActivity.activityDate) {
      alert("Activity and date are required");
      return;
    }
    // Calculate total price
    newActivity.totalPrice = newActivity.numberOfParticipants * newActivity.pricePerPerson;
    onAddActivity(newActivity);
    setNewActivity({
      activityId: 0,
      activityScheduleId: 0,
      activityDate: "",
      startTime: "",
      endTime: "",
      numberOfParticipants: 1,
      pricePerPerson: 0,
      totalPrice: 0,
      status: 1,
    });
    setShowAddForm(false);
  };

  const handleUpdateActivity = () => {
    if (!editActivityData.activityId || !editActivityData.activityDate) {
      alert("Activity and date are required");
      return;
    }
    // Calculate total price
    editActivityData.totalPrice = editActivityData.numberOfParticipants * editActivityData.pricePerPerson;
    onUpdateActivity(editActivityData);
    setEditingActivity(null);
    setEditActivityData({
      bookingActivityId: 0,
      activityId: 0,
      activityScheduleId: 0,
      activityDate: "",
      startTime: "",
      endTime: "",
      numberOfParticipants: 1,
      pricePerPerson: 0,
      totalPrice: 0,
      status: 1,
    });
  };

  const handleEditClick = (activity: BookingActivity) => {
    setEditingActivity(activity);
    setEditActivityData({
      bookingActivityId: activity.bookingActivityId,
      activityId: activity.activityId,
      activityScheduleId: 0,
      activityDate: activity.activityDate,
      startTime: activity.startTime,
      endTime: activity.endTime,
      numberOfParticipants: activity.numberOfParticipants,
      pricePerPerson: activity.pricePerPerson,
      totalPrice: activity.totalPrice,
      status: 1,
    });
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
        onClick={() => onToggleSection("activities")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("activities") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("activities") ? `1px solid ${theme.border}` : "none",
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
              Activities
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {visibleActivities.length} activities
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
            style={{ transform: expandedSections.has("activities") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("activities") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {/* Add Activity Form */}
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
                    Add Activity
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Activity ID <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="number"
                        value={newActivity.activityId}
                        onChange={(e) => setNewActivity({ ...newActivity, activityId: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Enter activity ID"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Activity Date <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="date"
                        value={newActivity.activityDate}
                        onChange={(e) => setNewActivity({ ...newActivity, activityDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={newActivity.startTime}
                        onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        End Time
                      </label>
                      <input
                        type="time"
                        value={newActivity.endTime}
                        onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <Users className="w-3 h-3 inline mr-1" />
                        Number of Participants <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newActivity.numberOfParticipants}
                        onChange={(e) => setNewActivity({ ...newActivity, numberOfParticipants: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <DollarSign className="w-3 h-3 inline mr-1" />
                        Price Per Person
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newActivity.pricePerPerson}
                        onChange={(e) => setNewActivity({ ...newActivity, pricePerPerson: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <DollarSign className="w-3 h-3 inline mr-1" />
                        Total Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newActivity.numberOfParticipants * newActivity.pricePerPerson}
                        disabled
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm opacity-70"
                        style={{ ...fieldBase, borderColor: theme.border }}
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
                      onClick={handleAddActivity}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.success }}
                    >
                      Add Activity
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Activity Modal */}
            <AnimatePresence>
              {editingActivity && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setEditingActivity(null)}
                >
                  <div
                    className="rounded-2xl p-6 max-w-2xl w-full mx-4"
                    style={{ backgroundColor: theme.surface }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                      Edit Activity
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Activity ID
                        </label>
                        <input
                          type="number"
                          value={editActivityData.activityId}
                          onChange={(e) => setEditActivityData({ ...editActivityData, activityId: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Activity Date
                        </label>
                        <input
                          type="date"
                          value={editActivityData.activityDate}
                          onChange={(e) => setEditActivityData({ ...editActivityData, activityDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={editActivityData.startTime}
                          onChange={(e) => setEditActivityData({ ...editActivityData, startTime: e.target.value })}
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
                          value={editActivityData.endTime}
                          onChange={(e) => setEditActivityData({ ...editActivityData, endTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Number of Participants
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={editActivityData.numberOfParticipants}
                          onChange={(e) => setEditActivityData({ ...editActivityData, numberOfParticipants: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Price Per Person
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editActivityData.pricePerPerson}
                          onChange={(e) => setEditActivityData({ ...editActivityData, pricePerPerson: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-2">
                      <button
                        onClick={() => setEditingActivity(null)}
                        className="flex-1 px-4 py-2 rounded-lg"
                        style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateActivity}
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

            {/* Activities List */}
            {visibleActivities.length === 0 ? (
              <div className="text-center py-8" style={{ backgroundColor: `${theme.border}10`, borderRadius: "12px" }}>
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>No activities added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleActivities.map((activity) => (
                  <div
                    key={activity.bookingActivityId}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.border}10`, border: `1px solid ${theme.border}` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Calendar className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                        <span className="text-sm font-medium" style={{ color: theme.text }}>
                          {activity.activityName || `Activity #${activity.activityId}`}
                        </span>
                        {activity.activityDate && (
                          <span className="text-xs" style={{ color: theme.textSecondary }}>
                            {activity.activityDate.split("T")[0]}
                          </span>
                        )}
                        {activity.startTime && activity.endTime && (
                          <span className="text-xs" style={{ color: theme.textSecondary }}>
                            {activity.startTime.slice(0,5)} - {activity.endTime.slice(0,5)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: theme.textSecondary }}>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {activity.numberOfParticipants} persons
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatPrice(activity.totalPrice)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(activity)}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{ color: theme.primary }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveActivity(activity.bookingActivityId)}
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