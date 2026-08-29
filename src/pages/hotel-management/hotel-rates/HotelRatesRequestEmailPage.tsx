"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Mail,
  Plus,
  X,
  Hotel,
  FileText,
  AlertCircle,
  Users,
  CheckCircle,
  Send,
  User,
  Phone,
  Globe,
  Building,
  MapPin,
} from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { FormActions } from "@/components/common-components/FormActions";
import { InputField } from "@/components/common-components/create-components/InputField";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";
import { EmailService } from "@/services/emailService";
import { RequestHotelRatesRequest } from "@/types/email-types";
import { ToastType } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { HOTEL_RATES_REQUEST_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
}

const HotelRatesRequestEmailPage = () => {
  const router = useRouter();
  const { theme } = useTheme();

  // Form state - removed hotelName
  const [formData, setFormData] = useState<RequestHotelRatesRequest>({
    to: [],
    cc: [],
    subject: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // Temporary input states for email fields
  const [emailInput, setEmailInput] = useState("");
  const [ccInput, setCcInput] = useState("");

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Handle adding email to "to" list
  const handleAddToEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrors({ ...errors, to: "Please enter a valid email address" });
      return;
    }

    if (formData.to.includes(email)) {
      setErrors({ ...errors, to: "This email is already added" });
      return;
    }

    setFormData({ ...formData, to: [...formData.to, email] });
    setEmailInput("");
    if (errors.to) setErrors({ ...errors, to: "" });
  };

  // Handle adding email to "cc" list
  const handleAddCcEmail = () => {
    const email = ccInput.trim();
    if (!email) return;

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrors({ ...errors, cc: "Please enter a valid email address" });
      return;
    }

    if (formData.cc.includes(email)) {
      setErrors({ ...errors, cc: "This email is already added" });
      return;
    }

    setFormData({ ...formData, cc: [...formData.cc, email] });
    setCcInput("");
    if (errors.cc) setErrors({ ...errors, cc: "" });
  };

  // Handle removing email from "to" list
  const handleRemoveToEmail = (email: string) => {
    setFormData({
      ...formData,
      to: formData.to.filter((e) => e !== email),
    });
  };

  // Handle removing email from "cc" list
  const handleRemoveCcEmail = (email: string) => {
    setFormData({
      ...formData,
      cc: formData.cc.filter((e) => e !== email),
    });
  };

  // Handle key press for email inputs
  const handleEmailKeyPress = (e: React.KeyboardEvent, type: "to" | "cc") => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "to") {
        handleAddToEmail();
      } else {
        handleAddCcEmail();
      }
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.to.length === 0) {
      newErrors.to = "At least one recipient is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length > 200) {
      newErrors.subject = "Subject must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit email request
  const submitEmailRequest = async () => {
    setLoading(true);
    try {
      const response = await EmailService.requestHotelRates(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Email Sent Successfully!",
          message: `Hotel rates request email has been sent to ${formData.to.length} recipient(s).`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to send email request");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle send button click - opens dialog
  const handleSendClick = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Handle confirm send from dialog
  const handleConfirmSend = async () => {
    await submitEmailRequest();
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      to: [],
      cc: [],
      subject: "",
    });
    setEmailInput("");
    setCcInput("");
    setErrors({});
  };

  // Close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Generate a default subject
  const generateDefaultSubject = () => {
    return "Request for Travel Agent Rates – Summer & Winter";
  };

  // Handle auto-fill subject
  const handleAutoFillSubject = () => {
    const subject = generateDefaultSubject();
    setFormData({ ...formData, subject });
  };

  // Escape HTML special characters
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  // Build email body - removed hotelName parameter
  const buildEmailBody = () => {
    return `
      <p style='font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: ${theme.text};'>
        Dear Sales Team,<br><br>
        Greetings from Felicita Trips.<br><br>
        We are a newly established travel company specializing in inbound tourism in Sri Lanka. 
        We have already received several tour inquiries and have recommended hotels to our potential guests.<br><br>
        In this regard, we would appreciate it if you could share your travel agent rates for the Summer and Winter seasons.<br><br>
        We look forward to hearing from you and hope to establish a good business relationship with your team.<br><br>
        Kind regards,<br>
      </p>
    `;
  };

  // Get email signature HTML with theme colors
  const getEmailSignature = () => {
    const logoUrl = "https://res.cloudinary.com/dtzrivqye/image/upload/v1775493945/gi5x2y4vwaplhkwchp0p.png";

    return `
      <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; border-collapse: collapse;">
        <tr>
          <td style="padding-right:18px; vertical-align:middle;" width="90">
            <img src="${logoUrl}" width="80" height="80" alt="Felicita Trips" style="display:block; border:0;">
          </td>
          <td style="border-left:2px solid ${theme.primary}; padding-left:18px; vertical-align:middle;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-size:19px; font-weight:bold; color:${theme.text}; padding-bottom:2px;">
                  Pasindu Dilshan
                </td>
              </tr>
              <tr>
                <td style="font-size:13px; font-style:italic; color:${theme.primary}; font-weight:bold; padding-bottom:8px;">
                  Proprietor, Felicita Trips
                </td>
              </tr>
              <tr>
                <td style="font-size:12.5px; color:${theme.text}; padding-bottom:3px;">
                  <span style="color:${theme.primary}; font-weight:bold;">M:</span>
                  <a href="https://wa.me/94701774488" style="color:${theme.text}; text-decoration:none;">+94 70 177 4488</a>
                </td>
              </tr>
              <tr>
                <td style="font-size:12.5px; color:${theme.text}; padding-bottom:3px;">
                  <span style="color:${theme.primary}; font-weight:bold;">E:</span>
                  <a href="mailto:info@felicitatrips.com" style="color:${theme.text}; text-decoration:none;">info@felicitatrips.com</a>
                </td>
              </tr>
              <tr>
                <td style="font-size:12.5px; color:${theme.text}; padding-bottom:8px;">
                  <span style="color:${theme.primary}; font-weight:bold;">W:</span>
                  <a href="https://www.felicitatrips.com" style="color:${theme.text}; text-decoration:none;">www.felicitatrips.com</a>
                </td>
              </tr>
              <tr>
                <td style="font-size:11px; color:${theme.textSecondary}; padding-top:4px;">
                  Colombo, Sri Lanka
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  };

  // Build complete email preview
  const getEmailPreview = () => {
    const body = buildEmailBody();
    const signature = getEmailSignature();

    return `
      ${body}
      <div style='margin-top: 30px;'>
        ${signature}
      </div>
    `;
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notification */}
      {toast.show && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Hotel Rates Request"
            description="Send email to request hotel rates"
            breadcrumbItems={HOTEL_RATES_REQUEST_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <form className="space-y-8">
              {/* Recipients Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
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
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Recipients
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Add recipients and CC recipients for the email
                      </p>
                    </div>
                  </div>

                  {/* To Recipients */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: theme.textSecondary }}
                    >
                      To <span style={{ color: theme.error }}>*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Enter email address..."
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyPress={(e) => handleEmailKeyPress(e, "to")}
                        className="flex-1 px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          backgroundColor: theme.background,
                          borderColor: errors.to ? theme.error : theme.border,
                          color: theme.text,
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddToEmail}
                        className="px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors hover:bg-opacity-20"
                        style={{
                          backgroundColor: `${theme.primary}15`,
                          color: theme.primary,
                          border: `1px solid ${theme.primary}30`,
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    {errors.to && (
                      <p
                        className="mt-1.5 text-xs flex items-center gap-1"
                        style={{ color: theme.error }}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.to}
                      </p>
                    )}

                    {/* To Email Tags */}
                    {formData.to.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.to.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${theme.primary}15`,
                              color: theme.primary,
                              border: `1px solid ${theme.primary}30`,
                            }}
                          >
                            <Mail className="w-3 h-3" />
                            {email}
                            <button
                              type="button"
                              onClick={() => handleRemoveToEmail(email)}
                              className="ml-1 hover:scale-110 transition-transform"
                              style={{ color: theme.primary }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CC Recipients */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: theme.textSecondary }}
                    >
                      CC (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Enter CC email address..."
                        value={ccInput}
                        onChange={(e) => setCcInput(e.target.value)}
                        onKeyPress={(e) => handleEmailKeyPress(e, "cc")}
                        className="flex-1 px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          backgroundColor: theme.background,
                          borderColor: errors.cc ? theme.error : theme.border,
                          color: theme.text,
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCcEmail}
                        className="px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors hover:bg-opacity-20"
                        style={{
                          backgroundColor: `${theme.primary}15`,
                          color: theme.primary,
                          border: `1px solid ${theme.primary}30`,
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    {errors.cc && (
                      <p
                        className="mt-1.5 text-xs flex items-center gap-1"
                        style={{ color: theme.error }}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.cc}
                      </p>
                    )}

                    {/* CC Email Tags */}
                    {formData.cc.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.cc.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${theme.warning}15`,
                              color: theme.warning,
                              border: `1px solid ${theme.warning}30`,
                            }}
                          >
                            <Mail className="w-3 h-3" />
                            {email}
                            <button
                              type="button"
                              onClick={() => handleRemoveCcEmail(email)}
                              className="ml-1 hover:scale-110 transition-transform"
                              style={{ color: theme.warning }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </FormCard>

              {/* Email Content Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <FileText className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Email Content
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Compose the email content
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        className="block text-sm font-medium"
                        style={{ color: theme.textSecondary }}
                      >
                        Subject <span style={{ color: theme.error }}>*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoFillSubject}
                        className="text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20"
                        style={{ color: theme.primary }}
                      >
                        Auto-fill
                      </button>
                    </div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter email subject..."
                      className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: errors.subject
                          ? theme.error
                          : theme.border,
                        color: theme.text,
                      }}
                    />
                    {errors.subject && (
                      <p
                        className="mt-1.5 text-xs flex items-center gap-1"
                        style={{ color: theme.error }}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>
              </FormCard>

              {/* Email Preview Card - Updated with theme colors */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <Mail className="w-4 h-4" />
                    </span>
                    <div>
                      <h2
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        Email Preview
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Preview of the email that will be sent
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 space-y-3"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div
                      className="flex items-center gap-2 text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      <Users className="w-4 h-4" />
                      <span>
                        To:{" "}
                        {formData.to.length > 0
                          ? formData.to.join(", ")
                          : "No recipients"}
                      </span>
                    </div>
                    {formData.cc.length > 0 && (
                      <div
                        className="flex items-center gap-2 text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        <Mail className="w-4 h-4" />
                        <span>CC: {formData.cc.join(", ")}</span>
                      </div>
                    )}
                    <div
                      className="flex items-center gap-2 text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Subject: {formData.subject || "Not set"}</span>
                    </div>

                    <div
                      className="pt-3 mt-3 border-t"
                      style={{ borderColor: theme.border }}
                    >
                      <p
                        className="text-sm font-medium mb-2"
                        style={{ color: theme.text }}
                      >
                        Email Body:
                      </p>
                      <div
                        className="mt-2 p-4 rounded-lg text-sm overflow-auto max-h-[500px]"
                        style={{
                          backgroundColor: theme.surface,
                          border: `1px solid ${theme.border}`,
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          color: theme.text,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: getEmailPreview(),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </FormCard>

              {/* Form Actions */}
              <FormActions
                loading={loading}
                uploadingImages={false}
                onSubmit={handleSendClick}
                onReset={handleReset}
                errors={errors}
                submitText="Send Email"
                submitButtonType="button"
              />
            </form>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Tips */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <h3 className="font-semibold" style={{ color: theme.text }}>
                  Quick Tips
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: theme.success }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Multiple Recipients
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Add multiple email addresses for wider reach
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: theme.success }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      Clear Subject
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Use a clear and descriptive subject line
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: theme.success }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      CC for Visibility
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Add CC recipients for team visibility
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Summary */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <h3 className="font-semibold" style={{ color: theme.text }}>
                  Email Summary
                </h3>
              </div>
              <div className="px-6 py-4 space-y-2">
                <div className="flex justify-between">
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Recipients
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {formData.to.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    CC Recipients
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {formData.cc.length}
                  </span>
                </div>
                <div
                  className="flex justify-between pt-2 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Total Recipients
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: theme.success }}
                  >
                    {formData.to.length + formData.cc.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <CreateConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSend}
        details={{
          title: "Send Hotel Rates Request",
          message: `Are you sure you want to send this hotel rates request email to ${formData.to.length} recipient(s)?`,
          itemName: "Hotel Rates Request",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: [
            "Verify that all recipient email addresses are correct",
            "Ensure the subject line is clear and professional",
            "Review the email preview before sending",
          ],
        }}
        confirmText="Send Email"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Hotel rates request email sent successfully");
        }}
        onError={(error) => {
          console.error("Failed to send email:", error);
          setToast({
            show: true,
            type: "error",
            title: "Send Failed",
            message: error.message || "Failed to send email. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default HotelRatesRequestEmailPage;