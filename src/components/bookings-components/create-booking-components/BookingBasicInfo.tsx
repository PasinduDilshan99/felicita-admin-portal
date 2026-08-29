// components/booking-components/BookingBasicInfo.tsx
"use client";

import React from "react";
import { Calendar, Users, DollarSign, Info } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { InputField } from "@/components/common-components/create-components/InputField";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";

interface BookingBasicInfoProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  customers: { id: number; name: string }[];
  bookingStatuses: { bookingStatusId: number; bookingStatusName: string }[];
  employees: { employeeId: number; employeeName: string }[];
}

export const BookingBasicInfo: React.FC<BookingBasicInfoProps> = ({
  formData,
  errors,
  onInputChange,
  customers,
  bookingStatuses,
  employees,
}) => {
  const { theme } = useTheme();

  const customerOptions = customers.map(c => ({ value: String(c.id), label: c.name }));
  const statusOptions = bookingStatuses.map(s => ({ value: String(s.bookingStatusId), label: s.bookingStatusName }));
  const employeeOptions = employees.map(e => ({ value: String(e.employeeId), label: e.employeeName }));

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <FormHeader title="Booking Information" description="Basic booking details" icon={Calendar} />

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Customer"
            name="customerId"
            value={formData.customerId}
            onChange={onInputChange}
            type="select"
            required
            options={customerOptions}
            error={errors.customerId}
            helperText="Select the customer"
          />

          <InputField
            label="Booking Status"
            name="bookingStatusId"
            value={formData.bookingStatusId}
            onChange={onInputChange}
            type="select"
            required
            options={statusOptions}
            error={errors.bookingStatusId}
            helperText="Current booking status"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Booking Date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={onInputChange}
            type="date"
            required
            error={errors.bookingDate}
          />

          <InputField
            label="Travel Start Date"
            name="travelStartDate"
            value={formData.travelStartDate}
            onChange={onInputChange}
            type="date"
            required
            error={errors.travelStartDate}
          />

          <InputField
            label="Travel End Date"
            name="travelEndDate"
            value={formData.travelEndDate}
            onChange={onInputChange}
            type="date"
            required
            error={errors.travelEndDate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Total Persons"
            name="totalPersons"
            value={formData.totalPersons}
            onChange={onInputChange}
            type="number"
            required
            min={1}
            step={1}
            placeholder="1"
            error={errors.totalPersons}
            helperText="Total number of participants"
          />

          <InputField
            label="Assign To"
            name="assignTo"
            value={formData.assignTo}
            onChange={onInputChange}
            type="select"
            options={employeeOptions}
            error={errors.assignTo}
            helperText="Assign booking to an employee"
          />
        </div>

        <InputField
          label="Assign Message"
          name="assignMessage"
          value={formData.assignMessage}
          onChange={onInputChange}
          type="textarea"
          rows={2}
          placeholder="Any message for the assigned employee..."
          error={errors.assignMessage}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Special Requirements"
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={onInputChange}
            type="textarea"
            rows={2}
            placeholder="Any special requirements..."
            error={errors.specialRequirements}
          />

          <InputField
            label="Dietary Restrictions"
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={onInputChange}
            type="textarea"
            rows={2}
            placeholder="Any dietary restrictions..."
            error={errors.dietaryRestrictions}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.insuranceRequired}
              onChange={(e) => {
                const { name, checked } = e.target;
                onInputChange({ target: { name, value: checked } } as any);
              }}
              name="insuranceRequired"
              className="w-4 h-4 rounded"
              style={{ accentColor: theme.primary }}
            />
            <span className="text-sm font-medium" style={{ color: theme.text }}>Insurance Required</span>
          </label>
        </div>
      </div>
    </div>
  );
};