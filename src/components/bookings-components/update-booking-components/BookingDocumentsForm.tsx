"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  File,
  Plus,
  X,
  ChevronDown,
  Edit2,
  Trash2,
  Download,
  FileText,
  FileImage,
} from "lucide-react";
import {
  BookingDocument,
  CreateBookingParams,
  CreateDocumentRequest,
  UpdateDocumentRequest,
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

interface BookingDocumentsFormProps {
  documents: BookingDocument[];
  removedDocuments: number[];
  bookingParams: CreateBookingParams;
  onAddDocument: (document: CreateDocumentRequest) => void;
  onRemoveDocument: (documentId: number) => void;
  onUpdateDocument: (document: UpdateDocumentRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const BookingDocumentsForm: React.FC<BookingDocumentsFormProps> = ({
  documents,
  removedDocuments,
  bookingParams,
  onAddDocument,
  onRemoveDocument,
  onUpdateDocument,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDocument, setEditingDocument] =
    useState<BookingDocument | null>(null);

  const [newDocument, setNewDocument] = useState<CreateDocumentRequest>({
    documentName: "",
    documentType: "",
    documentUrl: "",
    fileSize: 0,
    mimiType: "",
    status: 1,
  });

  const [editDocumentData, setEditDocumentData] =
    useState<UpdateDocumentRequest>({
      documentId: 0,
      documentName: "",
      documentType: "",
      documentUrl: "",
      fileSize: 0,
      mimiType: "",
      status: 1,
    });

  const isDocumentRemoved = (id: number) => removedDocuments.includes(id);
  const visibleDocuments = documents.filter(
    (d) => !isDocumentRemoved(d.documentId || 0),
  );

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

  const handleAddDocument = () => {
    if (!newDocument.documentName || !newDocument.documentType) {
      alert("Document name and type are required");
      return;
    }
    onAddDocument(newDocument);
    setNewDocument({
      documentName: "",
      documentType: "",
      documentUrl: "",
      fileSize: 0,
      mimiType: "",
      status: 1,
    });
    setShowAddForm(false);
  };

  const handleUpdateDocument = () => {
    if (!editDocumentData.documentName || !editDocumentData.documentType) {
      alert("Document name and type are required");
      return;
    }
    onUpdateDocument(editDocumentData);
    setEditingDocument(null);
    setEditDocumentData({
      documentId: 0,
      documentName: "",
      documentType: "",
      documentUrl: "",
      fileSize: 0,
      mimiType: "",
      status: 1,
    });
  };

  const handleEditClick = (document: BookingDocument) => {
    setEditingDocument(document);
    setEditDocumentData({
      documentId: document.documentId || 0,
      documentName: document.documentName,
      documentType: document.documentType,
      documentUrl: document.documentUrl,
      fileSize: document.fileSize,
      mimiType: document.mimiType,
      status: 1,
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="w-4 h-4" />;
    if (type.includes("image")) return <FileImage className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
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
        onClick={() => onToggleSection("documents")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("documents")
            ? `${theme.primary}05`
            : "transparent",
          borderBottom: expandedSections.has("documents")
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
            <File className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-sm sm:text-base font-semibold"
              style={{ color: theme.text }}
            >
              Documents
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {visibleDocuments.length} documents
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
              transform: expandedSections.has("documents")
                ? "rotate(180deg)"
                : "none",
              color: theme.textSecondary,
            }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("documents") && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-6"
          >
            {/* Add Document Form */}
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
                    Add Document
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Document Name{" "}
                        <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newDocument.documentName}
                        onChange={(e) =>
                          setNewDocument({
                            ...newDocument,
                            documentName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Passport Copy"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Document Type{" "}
                        <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newDocument.documentType}
                        onChange={(e) =>
                          setNewDocument({
                            ...newDocument,
                            documentType: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., PDF, Image"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Document URL
                      </label>
                      <input
                        type="text"
                        value={newDocument.documentUrl}
                        onChange={(e) =>
                          setNewDocument({
                            ...newDocument,
                            documentUrl: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="https://example.com/document.pdf"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        File Size (bytes)
                      </label>
                      <input
                        type="number"
                        value={newDocument.fileSize}
                        onChange={(e) =>
                          setNewDocument({
                            ...newDocument,
                            fileSize: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="1024"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        MIME Type
                      </label>
                      <input
                        type="text"
                        value={newDocument.mimiType}
                        onChange={(e) =>
                          setNewDocument({
                            ...newDocument,
                            mimiType: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="application/pdf"
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
                      onClick={handleAddDocument}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.success }}
                    >
                      Add Document
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Document Modal */}
            <AnimatePresence>
              {editingDocument && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setEditingDocument(null)}
                >
                  <div
                    className="rounded-2xl p-6 max-w-2xl w-full mx-4"
                    style={{ backgroundColor: theme.surface }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3
                      className="text-lg font-semibold mb-4"
                      style={{ color: theme.text }}
                    >
                      Edit Document
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Document Name
                        </label>
                        <input
                          type="text"
                          value={editDocumentData.documentName}
                          onChange={(e) =>
                            setEditDocumentData({
                              ...editDocumentData,
                              documentName: e.target.value,
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
                          Document Type
                        </label>
                        <input
                          type="text"
                          value={editDocumentData.documentType}
                          onChange={(e) =>
                            setEditDocumentData({
                              ...editDocumentData,
                              documentType: e.target.value,
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
                          Document URL
                        </label>
                        <input
                          type="text"
                          value={editDocumentData.documentUrl}
                          onChange={(e) =>
                            setEditDocumentData({
                              ...editDocumentData,
                              documentUrl: e.target.value,
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
                          File Size (bytes)
                        </label>
                        <input
                          type="number"
                          value={editDocumentData.fileSize}
                          onChange={(e) =>
                            setEditDocumentData({
                              ...editDocumentData,
                              fileSize: parseInt(e.target.value),
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
                          MIME Type
                        </label>
                        <input
                          type="text"
                          value={editDocumentData.mimiType}
                          onChange={(e) =>
                            setEditDocumentData({
                              ...editDocumentData,
                              mimiType: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-2">
                      <button
                        onClick={() => setEditingDocument(null)}
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
                        onClick={handleUpdateDocument}
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

            {/* Documents List */}
            {visibleDocuments.length === 0 ? (
              <div
                className="text-center py-8"
                style={{
                  backgroundColor: `${theme.border}10`,
                  borderRadius: "12px",
                }}
              >
                <File
                  className="w-12 h-12 mx-auto mb-3 opacity-30"
                  style={{ color: theme.textSecondary }}
                />
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  No documents added yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleDocuments.map((document) => (
                  <div
                    key={document.documentId}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{
                      backgroundColor: `${theme.border}10`,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: `${theme.primary}10`,
                          color: theme.primary,
                        }}
                      >
                        {getFileIcon(document.documentType)}
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: theme.text }}
                        >
                          {document.documentName}
                        </p>
                        <div
                          className="flex items-center gap-2 text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          <span>{document.documentType}</span>
                          {document.fileSize > 0 && (
                            <span>
                              • {(document.fileSize / 1024).toFixed(1)} KB
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {document.documentUrl && (
                        <a
                          href={document.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.primary }}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEditClick(document)}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{ color: theme.primary }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          onRemoveDocument(document.documentId || 0)
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
