"use client";

import React, { useState } from "react";
import {
  Users,
  Calendar,
  Shield,
  Phone,
  Heart,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Mail,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingParticipantsProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";

export const BookingParticipants: React.FC<BookingParticipantsProps> = ({
  participants,
}) => {
  const { theme } = useTheme();
  const [expandedParticipant, setExpandedParticipant] = useState<number | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false);

  const visibleParticipants = showAll ? participants : participants.slice(0, 5);
  const hasMore = participants.length > 5;

  if (!participants.length) {
    return null;
  }

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
        className="px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-base sm:text-lg font-semibold flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <Users
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Participants
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {participants.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {visibleParticipants.map((participant) => {
          const isExpanded = expandedParticipant === participant.participantId;

          return (
            <div
              key={participant.participantId}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
              }}
            >
              <button
                onClick={() =>
                  setExpandedParticipant(
                    isExpanded ? null : participant.participantId,
                  )
                }
                className="w-full flex items-center justify-between p-3 text-left cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: isExpanded
                    ? hexToRgba(theme.primary, 0.05)
                    : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {participant.fullName.charAt(0)}
                  </div>
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: theme.text }}
                    >
                      {participant.fullName}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      {participant.nationality} • {participant.gender}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp
                    className="w-4 h-4"
                    style={{ color: theme.textSecondary }}
                  />
                ) : (
                  <ChevronDown
                    className="w-4 h-4"
                    style={{ color: theme.textSecondary }}
                  />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar
                        className="w-3.5 h-3.5"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        DOB:{" "}
                        {new Date(participant.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield
                        className="w-3.5 h-3.5"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        Passport: {participant.passportNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail
                        className="w-3.5 h-3.5"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        {participant.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone
                        className="w-3.5 h-3.5"
                        style={{ color: theme.textSecondary }}
                      />
                      <span style={{ color: theme.textSecondary }}>
                        {participant.mobileNumber}
                      </span>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div
                    className="rounded-lg p-2 text-xs"
                    style={{
                      backgroundColor: hexToRgba(theme.warning, 0.06),
                      border: `1px solid ${hexToRgba(theme.warning, 0.1)}`,
                    }}
                  >
                    <p className="font-medium" style={{ color: theme.warning }}>
                      Emergency Contact
                    </p>
                    <p style={{ color: theme.textSecondary }}>
                      {participant.emergencyContactName} (
                      {participant.emergencyContactRelationship})
                    </p>
                    <p style={{ color: theme.textSecondary }}>
                      {participant.emergencyContactPhone}
                    </p>
                  </div>

                  {/* Medical Information */}
                  {(participant.medicalConditions ||
                    participant.allergies ||
                    participant.specialAssistanceRequired) && (
                    <div
                      className="rounded-lg p-2 text-xs"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.06),
                        border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                      }}
                    >
                      <p
                        className="font-medium"
                        style={{ color: theme.primary }}
                      >
                        Medical Information
                      </p>
                      {participant.medicalConditions && (
                        <p
                          className="flex items-start gap-1"
                          style={{ color: theme.textSecondary }}
                        >
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{participant.medicalConditions}</span>
                        </p>
                      )}
                      {participant.allergies && (
                        <p
                          className="flex items-start gap-1"
                          style={{ color: theme.textSecondary }}
                        >
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{participant.allergies}</span>
                        </p>
                      )}
                      {participant.specialAssistanceRequired && (
                        <p
                          className="flex items-start gap-1"
                          style={{ color: theme.textSecondary }}
                        >
                          <Heart className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>
                            {participant.assistanceDetails ||
                              "Special assistance required"}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors hover:opacity-80"
            style={{ color: theme.primary }}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show All {participants.length} Participants
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
