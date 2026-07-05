// components/bookings-components/create-booking-components/BookingNotes.tsx
"use client";

import React, { useState } from "react";
import { FileText, Plus, X, Star, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { CreateBookingNoteRequest } from "@/types/booking-types";

interface BookingNotesProps {
  notes: CreateBookingNoteRequest[];
  onNotesChange: (notes: CreateBookingNoteRequest[]) => void;
  noteTypes: string[];
}

const defaultNote: CreateBookingNoteRequest = {
  noteType: "",
  noteText: "",
  isImportant: false,
  followUpDate: "",
  followUpComplete: false,
  status: 1,
};

export const BookingNotes: React.FC<BookingNotesProps> = ({
  notes,
  onNotesChange,
  noteTypes,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const addNote = () => {
    onNotesChange([...notes, { ...defaultNote }]);
  };

  const removeNote = (index: number) => {
    onNotesChange(notes.filter((_, i) => i !== index));
  };

  const updateNote = (index: number, field: keyof CreateBookingNoteRequest, value: any) => {
    const updated = [...notes];
    updated[index] = { ...updated[index], [field]: value };
    onNotesChange(updated);
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
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold" style={{ color: theme.text }}>Notes</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Add notes</p>
          </div>
          {notes.length > 0 && (
            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
              {notes.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); addNote(); }}
          className="p-1.5 rounded-lg transition-colors hover:bg-opacity-20"
          style={{ color: theme.primary }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {notes.length === 0 ? (
            <div className="text-center py-8" style={{ color: theme.textSecondary }}>
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notes added yet</p>
              <button type="button" onClick={addNote} className="mt-2 text-sm font-medium hover:underline" style={{ color: theme.primary }}>
                Add Note
              </button>
            </div>
          ) : (
            notes.map((note, index) => (
              <div key={index} className="rounded-xl p-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.border}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-medium" style={{ color: theme.text }}>Note #{index + 1}</h4>
                    {note.isImportant && (
                      <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: `${theme.warning}20`, color: theme.warning }}>
                        <Star className="w-3 h-3" />
                        Important
                      </span>
                    )}
                    {note.followUpComplete && (
                      <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: `${theme.success}20`, color: theme.success }}>
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={() => removeNote(index)} className="p-1 rounded-lg hover:bg-opacity-20" style={{ color: theme.error }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Note Type</label>
                    <select
                      value={note.noteType}
                      onChange={(e) => updateNote(index, 'noteType', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    >
                      <option value="">Select type</option>
                      {noteTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Follow-up Date</label>
                    <input
                      type="date"
                      value={note.followUpDate}
                      onChange={(e) => updateNote(index, 'followUpDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Note Text</label>
                  <textarea
                    value={note.noteText}
                    onChange={(e) => updateNote(index, 'noteText', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg text-sm border resize-none"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="Enter note..."
                  />
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={note.isImportant}
                      onChange={(e) => updateNote(index, 'isImportant', e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: theme.primary }}
                    />
                    <span className="text-sm" style={{ color: theme.textSecondary }}>Mark as Important</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={note.followUpComplete}
                      onChange={(e) => updateNote(index, 'followUpComplete', e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: theme.primary }}
                    />
                    <span className="text-sm" style={{ color: theme.textSecondary }}>Follow-up Complete</span>
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};