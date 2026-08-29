// components/bookings-components/create-booking-components/BookingParticipants.tsx
"use client";

import React, { useState } from "react";
import { Users, Plus, X, AlertCircle, User, Mail, Phone, Calendar, MapPin, Shield } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { CreateParticipantRequest } from "@/types/booking-types";

interface BookingParticipantsProps {
  participants: CreateParticipantRequest[];
  onParticipantsChange: (participants: CreateParticipantRequest[]) => void;
  genders: { id: number; name: string }[];
  countries: { id: number; name: string }[];
  errors?: Record<string, string>;
}

const defaultParticipant: CreateParticipantRequest = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  genderId: 0,
  passportNumber: "",
  nationalityCountryId: 0,
  email: "",
  mobileNumber: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  medicalConditions: null,
  allergies: null,
  specialAssistanceRequired: false,
  assistanceDetails: null,
  roomSharingWith: null,
  status: 1,
};

export const BookingParticipants: React.FC<BookingParticipantsProps> = ({
  participants,
  onParticipantsChange,
  genders,
  countries,
  errors,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const addParticipant = () => {
    onParticipantsChange([...participants, { ...defaultParticipant }]);
  };

  const removeParticipant = (index: number) => {
    onParticipantsChange(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: keyof CreateParticipantRequest, value: any) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    onParticipantsChange(updated);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
          >
            <Users className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold" style={{ color: theme.text }}>
              Participants
            </h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Add participant details
            </p>
          </div>
          {participants.length > 0 && (
            <span
              className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
            >
              {participants.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {errors?.participants && (
            <AlertCircle className="w-4 h-4" style={{ color: theme.error }} />
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); addParticipant(); }}
            className="p-1.5 rounded-lg transition-colors hover:bg-opacity-20"
            style={{ color: theme.primary }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {participants.length === 0 ? (
            <div className="text-center py-8" style={{ color: theme.textSecondary }}>
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No participants added yet</p>
              <button
                type="button"
                onClick={addParticipant}
                className="mt-2 text-sm font-medium hover:underline"
                style={{ color: theme.primary }}
              >
                Add Participant
              </button>
            </div>
          ) : (
            participants.map((participant, index) => (
              <div
                key={index}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: `${theme.primary}05`,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: theme.text }}>
                    Participant #{index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="p-1 rounded-lg hover:bg-opacity-20"
                    style={{ color: theme.error }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={participant.firstName}
                      onChange={(e) => updateParticipant(index, 'firstName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={participant.lastName}
                      onChange={(e) => updateParticipant(index, 'lastName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={participant.dateOfBirth}
                      onChange={(e) => updateParticipant(index, 'dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Gender *
                    </label>
                    <select
                      value={participant.genderId}
                      onChange={(e) => updateParticipant(index, 'genderId', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    >
                      <option value={0}>Select gender</option>
                      {genders.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Passport Number
                    </label>
                    <input
                      type="text"
                      value={participant.passportNumber}
                      onChange={(e) => updateParticipant(index, 'passportNumber', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Nationality *
                    </label>
                    <select
                      value={participant.nationalityCountryId}
                      onChange={(e) => updateParticipant(index, 'nationalityCountryId', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    >
                      <option value={0}>Select nationality</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={participant.email}
                      onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      value={participant.mobileNumber}
                      onChange={(e) => updateParticipant(index, 'mobileNumber', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-medium block mb-2" style={{ color: theme.textSecondary }}>
                    Emergency Contact
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={participant.emergencyContactName}
                      onChange={(e) => updateParticipant(index, 'emergencyContactName', e.target.value)}
                      className="px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={participant.emergencyContactPhone}
                      onChange={(e) => updateParticipant(index, 'emergencyContactPhone', e.target.value)}
                      className="px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Relationship"
                      value={participant.emergencyContactRelationship}
                      onChange={(e) => updateParticipant(index, 'emergencyContactRelationship', e.target.value)}
                      className="px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Medical Conditions
                    </label>
                    <input
                      type="text"
                      value={participant.medicalConditions || ''}
                      onChange={(e) => updateParticipant(index, 'medicalConditions', e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                      placeholder="Any medical conditions..."
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Allergies
                    </label>
                    <input
                      type="text"
                      value={participant.allergies || ''}
                      onChange={(e) => updateParticipant(index, 'allergies', e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                      placeholder="Any allergies..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={participant.specialAssistanceRequired}
                      onChange={(e) => updateParticipant(index, 'specialAssistanceRequired', e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: theme.primary }}
                    />
                    <span className="text-sm" style={{ color: theme.textSecondary }}>
                      Special Assistance Required
                    </span>
                  </label>
                </div>

                {participant.specialAssistanceRequired && (
                  <div className="mt-3">
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                      Assistance Details
                    </label>
                    <input
                      type="text"
                      value={participant.assistanceDetails || ''}
                      onChange={(e) => updateParticipant(index, 'assistanceDetails', e.target.value || null)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                      placeholder="Describe assistance needed..."
                    />
                  </div>
                )}
              </div>
            ))
          )}
          {errors?.participants && (
            <p className="text-xs flex items-center gap-1" style={{ color: theme.error }}>
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.participants}
            </p>
          )}
        </div>
      )}
    </div>
  );
};