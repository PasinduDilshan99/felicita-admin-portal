"use client";

import React, { useState } from "react";
import { Info, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingNotesProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";
import { formatDate } from "@/utils/commonFunctions";

export const BookingNotes: React.FC<BookingNotesProps> = ({ notes }) => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  const visibleNotes = showAll ? notes : notes.slice(0, 5);
  const hasMore = notes.length > 5;

  if (!notes.length) {
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
            <Info
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Notes
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {notes.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {visibleNotes.map((note) => (
          <div
            key={note.noteId || note.noteText}
            className={`rounded-xl p-3 transition-all duration-200 ${
              note.isImportant ? "border-l-4" : ""
            }`}
            style={{
              backgroundColor: note.isImportant
                ? hexToRgba(theme.error, 0.06)
                : hexToRgba(theme.primary, 0.04),
              borderColor: note.isImportant ? theme.error : "transparent",
              border: note.isImportant
                ? `1px solid ${hexToRgba(theme.error, 0.2)}`
                : `1px solid ${hexToRgba(theme.primary, 0.1)}`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full text-white ${
                      note.noteType === "INTERNAL"
                        ? "bg-blue-500"
                        : "bg-purple-500"
                    }`}
                  >
                    {note.noteType}
                  </span>
                  {note.isImportant && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                      Important
                    </span>
                  )}
                  {note.followUpComplete && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  {note.noteText}
                </p>
              </div>
            </div>
            <div
              className="flex flex-wrap gap-3 mt-2 text-xs"
              style={{ color: theme.textSecondary }}
            >
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Follow-up: {formatDate(note.followUpDate)}
              </span>
              <span className="flex items-center gap-1">
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] text-white ${
                    note.status === "ACTIVE" ? "bg-emerald-500" : "bg-gray-500"
                  }`}
                >
                  {note.status}
                </span>
              </span>
            </div>
          </div>
        ))}

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
                Show All {notes.length} Notes
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
