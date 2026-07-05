// components/booking-components/BookingActivitySelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Activity, Calendar, Clock, Users, DollarSign, X, Plus, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";

interface ActivitySchedule {
  activityId: number;
  scheduleId: number;
  scheduleName: string;
}

interface BookingActivity {
  activityId: number;
  activityScheduleId: number;
  activityDate: string;
  startTime: string;
  endTime: string;
  numberOfParticipants: number;
  pricePerPerson: number;
  totalPrice: number;
  status: number;
}

interface BookingActivitySelectorProps {
  activities: { id: number; name: string }[];
  activitySchedules: ActivitySchedule[];
  selectedActivities: BookingActivity[];
  onActivitiesChange: (activities: BookingActivity[]) => void;
  errors?: Record<string, string>;
}

export const BookingActivitySelector: React.FC<BookingActivitySelectorProps> = ({
  activities,
  activitySchedules,
  selectedActivities,
  onActivitiesChange,
  errors,
}) => {
  const { theme } = useTheme();
  const [selectedActivityId, setSelectedActivityId] = useState<number>(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number>(0);

  const filteredSchedules = activitySchedules.filter(
    (s) => s.activityId === selectedActivityId
  );

  const getActivityName = (id: number) => {
    const activity = activities.find(a => a.id === id);
    return activity?.name || `Activity ${id}`;
  };

  const getScheduleName = (id: number) => {
    const schedule = activitySchedules.find(s => s.scheduleId === id);
    return schedule?.scheduleName || `Schedule ${id}`;
  };

  const handleAddActivity = () => {
    if (!selectedActivityId || !selectedScheduleId) return;

    const newActivity: BookingActivity = {
      activityId: selectedActivityId,
      activityScheduleId: selectedScheduleId,
      activityDate: "",
      startTime: "",
      endTime: "",
      numberOfParticipants: 1,
      pricePerPerson: 0,
      totalPrice: 0,
      status: 1,
    };

    onActivitiesChange([...selectedActivities, newActivity]);
    setSelectedActivityId(0);
    setSelectedScheduleId(0);
  };

  const handleRemoveActivity = (index: number) => {
    onActivitiesChange(selectedActivities.filter((_, i) => i !== index));
  };

  const handleActivityChange = (index: number, field: keyof BookingActivity, value: any) => {
    const updated = [...selectedActivities];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate total price
    if (field === 'numberOfParticipants' || field === 'pricePerPerson') {
      const participants = field === 'numberOfParticipants' ? value : updated[index].numberOfParticipants;
      const price = field === 'pricePerPerson' ? value : updated[index].pricePerPerson;
      updated[index].totalPrice = participants * price;
    }
    
    onActivitiesChange(updated);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <FormHeader title="Activities" description="Select and configure activities for the booking" icon={Activity} />

      <div className="px-6 py-6 space-y-6">
        {/* Add Activity Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
              Select Activity
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => {
                setSelectedActivityId(Number(e.target.value));
                setSelectedScheduleId(0);
              }}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              <option value={0}>Choose an activity...</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>{activity.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
              Select Schedule
            </label>
            <select
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
              disabled={!selectedActivityId}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm disabled:opacity-50"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              <option value={0}>Choose a schedule...</option>
              {filteredSchedules.map((schedule) => (
                <option key={schedule.scheduleId} value={schedule.scheduleId}>
                  {schedule.scheduleName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddActivity}
              disabled={!selectedActivityId || !selectedScheduleId}
              className="w-full px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: `${theme.success}10`,
                border: `1px solid ${theme.success}30`,
                color: theme.success,
              }}
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </button>
          </div>
        </div>

        {errors?.activities && (
          <p className="text-xs flex items-center gap-1" style={{ color: theme.error }}>
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.activities}
          </p>
        )}

        {/* Selected Activities List */}
        {selectedActivities.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Selected Activities:</p>
            {selectedActivities.map((activity, index) => (
              <div
                key={index}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: `${theme.primary}05`,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Activity</label>
                      <p className="text-sm font-medium" style={{ color: theme.text }}>
                        {getActivityName(activity.activityId)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Schedule</label>
                      <p className="text-sm" style={{ color: theme.text }}>
                        {getScheduleName(activity.activityScheduleId)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Date</label>
                      <input
                        type="date"
                        value={activity.activityDate}
                        onChange={(e) => handleActivityChange(index, 'activityDate', e.target.value)}
                        className="w-full px-2 py-1 rounded-lg text-sm border"
                        style={{
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                          color: theme.text,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Start</label>
                        <input
                          type="time"
                          value={activity.startTime}
                          onChange={(e) => handleActivityChange(index, 'startTime', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg text-sm border"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.text,
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>End</label>
                        <input
                          type="time"
                          value={activity.endTime}
                          onChange={(e) => handleActivityChange(index, 'endTime', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg text-sm border"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.text,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(index)}
                    className="p-1.5 rounded-lg hover:bg-opacity-20 flex-shrink-0"
                    style={{ color: theme.error }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Participants</label>
                    <input
                      type="number"
                      value={activity.numberOfParticipants}
                      onChange={(e) => handleActivityChange(index, 'numberOfParticipants', Number(e.target.value))}
                      min={1}
                      className="w-full px-2 py-1 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Price/Person</label>
                    <input
                      type="number"
                      value={activity.pricePerPerson}
                      onChange={(e) => handleActivityChange(index, 'pricePerPerson', Number(e.target.value))}
                      min={0}
                      step={0.01}
                      className="w-full px-2 py-1 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Total Price</label>
                    <p className="text-sm font-semibold" style={{ color: theme.success }}>
                      ${activity.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};