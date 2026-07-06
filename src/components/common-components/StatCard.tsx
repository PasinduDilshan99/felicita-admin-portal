// components/common-components/StatCard.tsx
"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  color, 
  icon 
}) => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="p-4 rounded-xl text-center transition-all hover:scale-105"
      style={{ 
        backgroundColor: color ? `${color}10` : `${theme.border}10`,
        border: `1px solid ${color ? `${color}30` : theme.border}`,
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon && <span style={{ color: color || theme.primary }}>{icon}</span>}
        <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>{label}</p>
      </div>
      <p className="text-2xl font-bold" style={{ color: color || theme.primary }}>
        {value.toLocaleString()}
      </p>
    </div>
  );
};