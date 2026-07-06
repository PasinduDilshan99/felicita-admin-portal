// components/bookings-components/create-booking-components/BookingDocuments.tsx
"use client";

import React, { useState } from "react";
import { FileText, Plus, X, Upload, File, Hash } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { CreateDocumentRequest } from "@/types/booking-types";

interface BookingDocumentsProps {
  documents: CreateDocumentRequest[];
  onDocumentsChange: (documents: CreateDocumentRequest[]) => void;
  documentTypes: string[];
  mimeTypes: string[];
}

const defaultDocument: CreateDocumentRequest = {
  documentName: "",
  documentType: "",
  documentUrl: "",
  fileSize: 0,
  mimiType: "",
  status: 1,
};

export const BookingDocuments: React.FC<BookingDocumentsProps> = ({
  documents,
  onDocumentsChange,
  documentTypes,
  mimeTypes,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addDocument = () => {
    onDocumentsChange([...documents, { ...defaultDocument }]);
  };

  const removeDocument = (index: number) => {
    onDocumentsChange(documents.filter((_, i) => i !== index));
  };

  const updateDocument = (index: number, field: keyof CreateDocumentRequest, value: any) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    onDocumentsChange(updated);
  };

  const handleFileUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...documents];
      updated[index] = {
        ...updated[index],
        documentName: file.name,
        fileSize: file.size,
        documentUrl: e.target?.result as string || "",
        mimiType: file.type,
      };
      onDocumentsChange(updated);
    };
    reader.readAsDataURL(file);
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
            <h2 className="text-base font-semibold" style={{ color: theme.text }}>Documents</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Add documents</p>
          </div>
          {documents.length > 0 && (
            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
              {documents.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); addDocument(); }}
          className="p-1.5 rounded-lg transition-colors hover:bg-opacity-20"
          style={{ color: theme.primary }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {documents.length === 0 ? (
            <div className="text-center py-8" style={{ color: theme.textSecondary }}>
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No documents added yet</p>
              <button type="button" onClick={addDocument} className="mt-2 text-sm font-medium hover:underline" style={{ color: theme.primary }}>
                Add Document
              </button>
            </div>
          ) : (
            documents.map((doc, index) => (
              <div key={index} className="rounded-xl p-4" style={{ backgroundColor: `${theme.primary}05`, border: `1px solid ${theme.border}` }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium" style={{ color: theme.text }}>Document #{index + 1}</h4>
                  <button type="button" onClick={() => removeDocument(index)} className="p-1 rounded-lg hover:bg-opacity-20" style={{ color: theme.error }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Document Name</label>
                    <input
                      type="text"
                      value={doc.documentName}
                      onChange={(e) => updateDocument(index, 'documentName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Document name"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Document Type</label>
                    <select
                      value={doc.documentType}
                      onChange={(e) => updateDocument(index, 'documentType', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    >
                      <option value="">Select type</option>
                      {documentTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>MIME Type</label>
                    <select
                      value={doc.mimiType}
                      onChange={(e) => updateDocument(index, 'mimiType', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    >
                      <option value="">Select MIME type</option>
                      {mimeTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>File Size (bytes)</label>
                    <input
                      type="number"
                      value={doc.fileSize}
                      onChange={(e) => updateDocument(index, 'fileSize', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="File size in bytes"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>File Upload</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(index, e.target.files[0]);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors hover:bg-opacity-20"
                      style={{ backgroundColor: `${theme.primary}10`, color: theme.primary, border: `1px solid ${theme.primary}30` }}
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </button>
                    {doc.documentUrl && (
                      <span className="text-xs" style={{ color: theme.success }}>
                        <File className="w-4 h-4 inline mr-1" />
                        File uploaded
                      </span>
                    )}
                  </div>
                </div>

                {doc.documentUrl && (
                  <div className="mt-2">
                    <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>Preview URL</label>
                    <input
                      type="text"
                      value={doc.documentUrl}
                      onChange={(e) => updateDocument(index, 'documentUrl', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border"
                      style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                      placeholder="Document URL"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};