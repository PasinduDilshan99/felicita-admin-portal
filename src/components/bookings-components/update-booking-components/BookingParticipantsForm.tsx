"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Users,
  Plus,
  X,
  ChevronDown,
  Edit2,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  IdCard
} from "lucide-react";
import {
  Participant,
  CreateBookingParams,
  CreateParticipantRequest,
  UpdateParticipantRequest,
} from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface BookingParticipantsFormProps {
  participants: Participant[];
  removedParticipants: number[];
  bookingParams: CreateBookingParams;
  onAddParticipant: (participant: CreateParticipantRequest) => void;
  onRemoveParticipant: (participantId: number) => void;
  onUpdateParticipant: (participant: UpdateParticipantRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const BookingParticipantsForm: React.FC<
  BookingParticipantsFormProps
> = ({
  participants,
  removedParticipants,
  bookingParams,
  onAddParticipant,
  onRemoveParticipant,
  onUpdateParticipant,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);

  const [newParticipant, setNewParticipant] =
    useState<CreateParticipantRequest>({
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
    });

  const [editParticipantData, setEditParticipantData] =
    useState<UpdateParticipantRequest>({
      participantId: 0,
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
    });

  const isParticipantRemoved = (id: number) => removedParticipants.includes(id);
  const visibleParticipants = participants.filter(
    (p) => !isParticipantRemoved(p.participantId),
  );

  const focusHandlers = {
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const handleAddParticipant = () => {
    if (!newParticipant.firstName || !newParticipant.lastName) {
      alert("First name and last name are required");
      return;
    }
    onAddParticipant(newParticipant);
    setNewParticipant({
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
    });
    setShowAddForm(false);
  };

  const handleUpdateParticipant = () => {
    if (!editParticipantData.firstName || !editParticipantData.lastName) {
      alert("First name and last name are required");
      return;
    }
    onUpdateParticipant(editParticipantData);
    setEditingParticipant(null);
    setEditParticipantData({
      participantId: 0,
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
    });
  };

  const handleEditClick = (participant: Participant) => {
    setEditingParticipant(participant);
    setEditParticipantData({
      participantId: participant.participantId,
      firstName: participant.firstName,
      lastName: participant.lastName,
      dateOfBirth: participant.dateOfBirth,
      genderId: 0,
      passportNumber: participant.passportNumber,
      nationalityCountryId: 0,
      email: participant.email,
      mobileNumber: participant.mobileNumber,
      emergencyContactName: participant.emergencyContactName,
      emergencyContactPhone: participant.emergencyContactPhone,
      emergencyContactRelationship: participant.emergencyContactRelationship,
      medicalConditions: participant.medicalConditions,
      allergies: participant.allergies,
      specialAssistanceRequired: participant.specialAssistanceRequired,
      assistanceDetails: participant.assistanceDetails,
      roomSharingWith: null,
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
        onClick={() => onToggleSection("participants")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("participants")
            ? `${theme.primary}05`
            : "transparent",
          borderBottom: expandedSections.has("participants")
            ? `1px solid ${theme.border}`
            : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.primary}18`,
              color: theme.primary,
            }}
          >
            <Users className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-sm sm:text-base font-semibold"
              style={{ color: theme.text }}
            >
              Participants
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {visibleParticipants.length} participants
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
            style={{
              backgroundColor: `${theme.success}15`,
              color: theme.success,
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              transform: expandedSections.has("participants")
                ? "rotate(180deg)"
                : "none",
              color: theme.textSecondary,
            }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("participants") && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-6"
          >
            {/* Add Participant Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl"
                  style={{
                    backgroundColor: `${theme.success}08`,
                    border: `1px solid ${theme.success}30`,
                  }}
                >
                  <h4
                    className="text-sm font-semibold mb-4"
                    style={{ color: theme.text }}
                  >
                    Add Participant
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        First Name <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newParticipant.firstName}
                        onChange={(e) =>
                          setNewParticipant({
                            ...newParticipant,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Last Name <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newParticipant.lastName}
                        onChange={(e) =>
                          setNewParticipant({
                            ...newParticipant,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={newParticipant.dateOfBirth}
                        onChange={(e) =>
                          setNewParticipant({
                            ...newParticipant,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Passport Number
                      </label>
                      <input
                        type="text"
                        value={newParticipant.passportNumber}
                        onChange={(e) =>
                          setNewParticipant({
                            ...newParticipant,
                            passportNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={newParticipant.email}
                        onChange={(e) =>
                          setNewParticipant({
                            ...newParticipant,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={newParticipant.mobileNumber}
                        onChange={(e) =>
                          setNewParticipant({
                            ...newParticipant,
                            mobileNumber: e.target.value,
                          })
                        }
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
                      style={{
                        backgroundColor: theme.background,
                        border: `1px solid ${theme.border}`,
                        color: theme.textSecondary,
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddParticipant}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.success }}
                    >
                      Add Participant
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Participant Modal */}
            <AnimatePresence>
              {editingParticipant && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setEditingParticipant(null)}
                >
                  <div
                    className="rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                    style={{ backgroundColor: theme.surface }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3
                      className="text-lg font-semibold mb-4"
                      style={{ color: theme.text }}
                    >
                      Edit Participant
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editParticipantData.firstName}
                          onChange={(e) =>
                            setEditParticipantData({
                              ...editParticipantData,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editParticipantData.lastName}
                          onChange={(e) =>
                            setEditParticipantData({
                              ...editParticipantData,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={editParticipantData.dateOfBirth}
                          onChange={(e) =>
                            setEditParticipantData({
                              ...editParticipantData,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Passport Number
                        </label>
                        <input
                          type="text"
                          value={editParticipantData.passportNumber}
                          onChange={(e) =>
                            setEditParticipantData({
                              ...editParticipantData,
                              passportNumber: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          value={editParticipantData.email}
                          onChange={(e) =>
                            setEditParticipantData({
                              ...editParticipantData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          value={editParticipantData.mobileNumber}
                          onChange={(e) =>
                            setEditParticipantData({
                              ...editParticipantData,
                              mobileNumber: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-2">
                      <button
                        onClick={() => setEditingParticipant(null)}
                        className="flex-1 px-4 py-2 rounded-lg"
                        style={{
                          backgroundColor: theme.background,
                          border: `1px solid ${theme.border}`,
                          color: theme.textSecondary,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateParticipant}
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

            {/* Participants List */}
            {visibleParticipants.length === 0 ? (
              <div
                className="text-center py-8"
                style={{
                  backgroundColor: `${theme.border}10`,
                  borderRadius: "12px",
                }}
              >
                <Users
                  className="w-12 h-12 mx-auto mb-3 opacity-30"
                  style={{ color: theme.textSecondary }}
                />
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  No participants added yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleParticipants.map((participant) => (
                  <div
                    key={participant.participantId}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{
                      backgroundColor: `${theme.border}10`,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <User
                          className="w-3.5 h-3.5"
                          style={{ color: theme.primary }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: theme.text }}
                        >
                          {participant.fullName}
                        </span>
                        {participant.email && (
                          <span
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            <Mail className="w-3 h-3 inline mr-1" />
                            {participant.email}
                          </span>
                        )}
                        {participant.mobileNumber && (
                          <span
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            <Phone className="w-3 h-3 inline mr-1" />
                            {participant.mobileNumber}
                          </span>
                        )}
                      </div>
                      {participant.passportNumber && (
                        <p
                          className="text-xs mt-1 flex items-center gap-1"
                          style={{ color: theme.textSecondary }}
                        >
                          <IdCard className="w-3 h-3" />
                          Passport: {participant.passportNumber}
                        </p>
                      )}
                      {participant.dateOfBirth && (
                        <p
                          className="text-xs flex items-center gap-1"
                          style={{ color: theme.textSecondary }}
                        >
                          <Calendar className="w-3 h-3" />
                          DOB: {participant.dateOfBirth.split("T")[0]}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(participant)}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{ color: theme.primary }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          onRemoveParticipant(participant.participantId)
                        }
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
