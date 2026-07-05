"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { StickyNote, Plus, X, ChevronDown, Edit2, Trash2, Flag, CheckCircle2, Calendar } from "lucide-react";
import { BookingNote, CreateBookingParams, CreateBookingNoteRequest, UpdateBookingNoteRequest } from "@/types/booking-types";
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

interface BookingNotesFormProps {
  notes: BookingNote[];
  removedNotes: number[];
  bookingParams: CreateBookingParams;
  onAddNote: (note: CreateBookingNoteRequest) => void;
  onRemoveNote: (noteId: number) => void;
  onUpdateNote: (note: UpdateBookingNoteRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const BookingNotesForm: React.FC<BookingNotesFormProps> = ({
  notes,
  removedNotes,
  bookingParams,
  onAddNote,
  onRemoveNote,
  onUpdateNote,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<BookingNote | null>(null);

  const [newNote, setNewNote] = useState<CreateBookingNoteRequest>({
    noteType: "",
    noteText: "",
    isImportant: false,
    followUpDate: "",
    followUpComplete: false,
    status: 1,
  });

  const [editNoteData, setEditNoteData] = useState<UpdateBookingNoteRequest>({
    noteId: 0,
    noteType: "",
    noteText: "",
    isImportant: false,
    followUpDate: "",
    followUpComplete: false,
    status: 1,
  });

  const isNoteRemoved = (id: number) => removedNotes.includes(id);
  const visibleNotes = notes.filter(n => !isNoteRemoved(n.noteId || 0));

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

  const handleAddNote = () => {
    if (!newNote.noteType || !newNote.noteText) {
      alert("Note type and text are required");
      return;
    }
    onAddNote(newNote);
    setNewNote({
      noteType: "",
      noteText: "",
      isImportant: false,
      followUpDate: "",
      followUpComplete: false,
      status: 1,
    });
    setShowAddForm(false);
  };

  const handleUpdateNote = () => {
    if (!editNoteData.noteType || !editNoteData.noteText) {
      alert("Note type and text are required");
      return;
    }
    onUpdateNote(editNoteData);
    setEditingNote(null);
    setEditNoteData({
      noteId: 0,
      noteType: "",
      noteText: "",
      isImportant: false,
      followUpDate: "",
      followUpComplete: false,
      status: 1,
    });
  };

  const handleEditClick = (note: BookingNote) => {
    setEditingNote(note);
    setEditNoteData({
      noteId: note.noteId || 0,
      noteType: note.noteType,
      noteText: note.noteText,
      isImportant: note.isImportant,
      followUpDate: note.followUpDate,
      followUpComplete: note.followUpComplete,
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
        onClick={() => onToggleSection("notes")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("notes") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("notes") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
          >
            <StickyNote className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Notes
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {visibleNotes.length} notes
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
            style={{ transform: expandedSections.has("notes") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("notes") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {/* Add Note Form */}
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
                    Add Note
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Note Type <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newNote.noteType}
                        onChange={(e) => setNewNote({ ...newNote, noteType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Internal, Customer"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        value={newNote.followUpDate}
                        onChange={(e) => setNewNote({ ...newNote, followUpDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Note Text <span style={{ color: theme.error }}>*</span>
                      </label>
                      <textarea
                        value={newNote.noteText}
                        onChange={(e) => setNewNote({ ...newNote, noteText: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Enter note..."
                        {...focusHandlers}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newNote.isImportant}
                          onChange={(e) => setNewNote({ ...newNote, isImportant: e.target.checked })}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: theme.warning }}
                        />
                        <span className="text-xs" style={{ color: theme.textSecondary }}>
                          <Flag className="w-3 h-3 inline mr-1" />
                          Important
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newNote.followUpComplete}
                          onChange={(e) => setNewNote({ ...newNote, followUpComplete: e.target.checked })}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: theme.success }}
                        />
                        <span className="text-xs" style={{ color: theme.textSecondary }}>
                          <CheckCircle2 className="w-3 h-3 inline mr-1" />
                          Complete
                        </span>
                      </label>
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
                      onClick={handleAddNote}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.success }}
                    >
                      Add Note
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Note Modal */}
            <AnimatePresence>
              {editingNote && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setEditingNote(null)}
                >
                  <div
                    className="rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                    style={{ backgroundColor: theme.surface }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                      Edit Note
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Note Type
                        </label>
                        <input
                          type="text"
                          value={editNoteData.noteType}
                          onChange={(e) => setEditNoteData({ ...editNoteData, noteType: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Follow-up Date
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(editNoteData.followUpDate)}
                          onChange={(e) => setEditNoteData({ ...editNoteData, followUpDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Note Text
                        </label>
                        <textarea
                          value={editNoteData.noteText}
                          onChange={(e) => setEditNoteData({ ...editNoteData, noteText: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border-2 resize-none"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editNoteData.isImportant}
                            onChange={(e) => setEditNoteData({ ...editNoteData, isImportant: e.target.checked })}
                            className="w-4 h-4 rounded"
                            style={{ accentColor: theme.warning }}
                          />
                          <span className="text-xs" style={{ color: theme.textSecondary }}>Important</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editNoteData.followUpComplete}
                            onChange={(e) => setEditNoteData({ ...editNoteData, followUpComplete: e.target.checked })}
                            className="w-4 h-4 rounded"
                            style={{ accentColor: theme.success }}
                          />
                          <span className="text-xs" style={{ color: theme.textSecondary }}>Complete</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-2">
                      <button
                        onClick={() => setEditingNote(null)}
                        className="flex-1 px-4 py-2 rounded-lg"
                        style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateNote}
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

            {/* Notes List */}
            {visibleNotes.length === 0 ? (
              <div className="text-center py-8" style={{ backgroundColor: `${theme.border}10`, borderRadius: "12px" }}>
                <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>No notes added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleNotes.map((note) => (
                  <div
                    key={note.noteId}
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: note.isImportant ? `${theme.warning}08` : `${theme.border}10`,
                      border: `1px solid ${note.isImportant ? theme.warning : theme.border}`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {note.isImportant && (
                            <Flag className="w-3.5 h-3.5" style={{ color: theme.warning }} />
                          )}
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
                            {note.noteType}
                          </span>
                          {note.followUpComplete && (
                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: theme.success }} />
                          )}
                          {note.followUpDate && (
                            <span className="text-xs flex items-center gap-1" style={{ color: theme.textSecondary }}>
                              <Calendar className="w-3 h-3" />
                              Follow-up: {note.followUpDate.split("T")[0]}
                            </span>
                          )}
                        </div>
                        <p className="text-sm mt-1" style={{ color: theme.text }}>{note.noteText}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(note)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.primary }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemoveNote(note.noteId || 0)}
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