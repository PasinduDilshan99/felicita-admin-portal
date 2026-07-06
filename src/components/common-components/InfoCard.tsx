// components/common-components/InfoCard.tsx
"use client";

import React from "react";

interface InfoCardProps {
  label: string;
  value: string | number | null;
  theme: any;
  highlight?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({ 
  label, 
  value, 
  theme, 
  highlight = false 
}) => (
  <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
    <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>{label}</p>
    <p className={`text-sm ${highlight ? 'font-semibold' : ''}`} style={{ color: highlight ? theme.success : theme.text }}>
      {value || "N/A"}
    </p>
  </div>
);