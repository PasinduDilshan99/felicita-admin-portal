"use client";

import React from "react";
import { FileText, Download, Eye } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingDocumentsProps } from "@/types/booking-types";
import { hexToRgba } from "@/utils/functions";
import { formatFileSize, getFileIcon } from "@/utils/commonFunctions";

export const BookingDocuments: React.FC<BookingDocumentsProps> = ({
  documents,
}) => {
  const { theme } = useTheme();

  if (!documents.length) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          className="px-4 sm:px-6 py-3 sm:py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <h2
            className="text-base sm:text-lg font-semibold flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <FileText
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Documents
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <FileText
            className="w-12 h-12 mx-auto mb-3 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No documents available for this booking.
          </p>
        </div>
      </div>
    );
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
            <FileText
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Documents
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {documents.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.documentId || doc.documentName}
              className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:translate-x-1"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.04),
                border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getFileIcon(doc.documentType)}
                </span>
                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: theme.text }}
                  >
                    {doc.documentName}
                  </p>
                  <div
                    className="flex flex-wrap gap-3 text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    <span>{doc.documentType}</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] text-white ${
                        doc.status === "ACTIVE"
                          ? "bg-emerald-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-opacity-20"
                  style={{ color: theme.primary }}
                  onClick={() => window.open(doc.documentUrl, "_blank")}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-opacity-20"
                  style={{ color: theme.primary }}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = doc.documentUrl;
                    link.download = doc.documentName;
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
