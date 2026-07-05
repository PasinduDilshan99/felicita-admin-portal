"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Receipt, ChevronDown, Edit2, Calendar, DollarSign, User, Mail, Phone, MapPin } from "lucide-react";
import { BookingInvoice, CreateBookingParams, UpdateBookingInvoiceRequest } from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

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

interface BookingInvoiceFormProps {
  invoice: BookingInvoice;
  bookingParams: CreateBookingParams;
  onUpdateInvoice: (invoice: UpdateBookingInvoiceRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
  formatPrice: (price: number) => string;
}

export const BookingInvoiceForm: React.FC<BookingInvoiceFormProps> = ({
  invoice,
  bookingParams,
  onUpdateInvoice,
  expandedSections,
  onToggleSection,
  theme,
  formatPrice,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [editInvoiceData, setEditInvoiceData] = useState<UpdateBookingInvoiceRequest>({
    invoiceId: invoice?.invoiceId || 0,
    dueDate: invoice?.dueDate || "",
    subTotal: invoice?.subTotal || 0,
    taxAmount: invoice?.taxAmount || 0,
    totalAmount: invoice?.totalAmount || 0,
    discountAmount: invoice?.discountAmount || 0,
    insuranceAmount: invoice?.insuranceAmount || 0,
    amountPaid: invoice?.amountPaid || 0,
    balanceDue: invoice?.balanceDue || 0,
    billingFullName: invoice?.billingFullName || "",
    billingAddress: invoice?.billingAddress || "",
    billingEmail: invoice?.billingEmail || "",
    billingPhone: invoice?.billingPhone || "",
    status: 1,
  });

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

  const handleEditClick = () => {
    setIsEditing(true);
    setEditInvoiceData({
      invoiceId: invoice?.invoiceId || 0,
      dueDate: invoice?.dueDate || "",
      subTotal: invoice?.subTotal || 0,
      taxAmount: invoice?.taxAmount || 0,
      totalAmount: invoice?.totalAmount || 0,
      discountAmount: invoice?.discountAmount || 0,
      insuranceAmount: invoice?.insuranceAmount || 0,
      amountPaid: invoice?.amountPaid || 0,
      balanceDue: invoice?.balanceDue || 0,
      billingFullName: invoice?.billingFullName || "",
      billingAddress: invoice?.billingAddress || "",
      billingEmail: invoice?.billingEmail || "",
      billingPhone: invoice?.billingPhone || "",
      status: 1,
    });
  };

  const handleUpdateInvoice = () => {
    if (!editInvoiceData.billingFullName || !editInvoiceData.billingEmail) {
      alert("Billing name and email are required");
      return;
    }
    // Calculate balance due
    editInvoiceData.balanceDue = 
      editInvoiceData.totalAmount - 
      editInvoiceData.amountPaid - 
      editInvoiceData.discountAmount;
    onUpdateInvoice(editInvoiceData);
    setIsEditing(false);
  };

  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const InfoRow = ({ label, value, highlight = false }: { label: string; value: string | number | null; highlight?: boolean }) => (
    <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.border}05` }}>
      <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>{label}</p>
      <p className={`text-sm ${highlight ? 'font-semibold' : ''}`} style={{ color: highlight ? theme.success : theme.text }}>
        {typeof value === 'number' ? formatPrice(value) : (value || "N/A")}
      </p>
    </div>
  );

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
        onClick={() => onToggleSection("invoice")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("invoice") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("invoice") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
          >
            <Receipt className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Invoice
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Total: {formatPrice(invoice?.totalAmount || 0)} · Balance: {formatPrice(invoice?.balanceDue || 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all"
            style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{ transform: expandedSections.has("invoice") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("invoice") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {!invoice?.invoiceId ? (
              <div className="text-center py-8" style={{ backgroundColor: `${theme.border}10`, borderRadius: "12px" }}>
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>No invoice generated yet</p>
                <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>Click Edit to create invoice details</p>
              </div>
            ) : (
              <>
                {/* Edit Invoice Modal */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                      onClick={() => setIsEditing(false)}
                    >
                      <div
                        className="rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        style={{ backgroundColor: theme.surface }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                          Edit Invoice
                        </h3>

                        {/* Billing Information */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-3" style={{ color: theme.textSecondary }}>
                            <User className="w-4 h-4 inline mr-1" /> Billing Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                Full Name <span style={{ color: theme.error }}>*</span>
                              </label>
                              <input
                                type="text"
                                value={editInvoiceData.billingFullName}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, billingFullName: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                <Mail className="w-3 h-3 inline mr-1" />
                                Email <span style={{ color: theme.error }}>*</span>
                              </label>
                              <input
                                type="email"
                                value={editInvoiceData.billingEmail}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, billingEmail: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                <Phone className="w-3 h-3 inline mr-1" />
                                Phone
                              </label>
                              <input
                                type="text"
                                value={editInvoiceData.billingPhone}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, billingPhone: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                <MapPin className="w-3 h-3 inline mr-1" />
                                Address
                              </label>
                              <input
                                type="text"
                                value={editInvoiceData.billingAddress}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, billingAddress: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                <Calendar className="w-3 h-3 inline mr-1" />
                                Due Date
                              </label>
                              <input
                                type="date"
                                value={formatDateForInput(editInvoiceData.dueDate)}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, dueDate: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Financial Details */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3" style={{ color: theme.textSecondary }}>
                            <DollarSign className="w-4 h-4 inline mr-1" /> Financial Details
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                Sub Total
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editInvoiceData.subTotal}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, subTotal: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                Tax Amount
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editInvoiceData.taxAmount}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, taxAmount: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                Total Amount
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editInvoiceData.totalAmount}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, totalAmount: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                Discount Amount
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editInvoiceData.discountAmount}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, discountAmount: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                Insurance Amount
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editInvoiceData.insuranceAmount}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, insuranceAmount: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                Amount Paid
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editInvoiceData.amountPaid}
                                onChange={(e) => setEditInvoiceData({ ...editInvoiceData, amountPaid: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg border-2"
                                style={{ ...fieldBase, borderColor: theme.border }}
                                {...focusHandlers}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                                Balance Due
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editInvoiceData.balanceDue}
                                disabled
                                className="w-full px-3 py-2 rounded-lg border-2 opacity-70"
                                style={{ ...fieldBase, borderColor: theme.border }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4 pt-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 px-4 py-2 rounded-lg"
                            style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateInvoice}
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

                {/* Invoice Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold" style={{ color: theme.textSecondary }}>Billing Information</h4>
                    <InfoRow label="Full Name" value={invoice.billingFullName} />
                    <InfoRow label="Email" value={invoice.billingEmail} />
                    <InfoRow label="Phone" value={invoice.billingPhone} />
                    <InfoRow label="Address" value={invoice.billingAddress} />
                    <InfoRow label="Due Date" value={invoice.dueDate?.split("T")[0]} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold" style={{ color: theme.textSecondary }}>Financial Summary</h4>
                    <InfoRow label="Sub Total" value={invoice.subTotal} />
                    <InfoRow label="Tax Amount" value={invoice.taxAmount} />
                    <InfoRow label="Total Amount" value={invoice.totalAmount} highlight />
                    <InfoRow label="Discount" value={invoice.discountAmount} />
                    <InfoRow label="Insurance" value={invoice.insuranceAmount} />
                    <InfoRow label="Amount Paid" value={invoice.amountPaid} />
                    <InfoRow label="Balance Due" value={invoice.balanceDue} highlight />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};