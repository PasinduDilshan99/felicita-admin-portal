"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Cell,
  PieChart,
  Pie,
  Area,
} from "recharts";
import { BookingAssignService } from "@/services/bookingAssignService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { bookingManagementSideBarData } from "@/data/side-bar-data";
import { BOOKING_ASSIGN_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getBookingAssignStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  EmployeeWorkloadTooltip,
  EmployeeRevenueTooltip,
  DepartmentTooltip,
  DesignationTooltip,
  AssignmentTrendTooltip,
  AssignmentStatusTooltip,
} from "@/components/statistics-components";
import { BookingAssignStatisticsData } from "@/types/booking-assign-types";

const BookingAssignPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<BookingAssignStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingAssignData = bookingManagementSideBarData.find(
    (item) => item.name === "Assign Bookings",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await BookingAssignService.getBookingAssignStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError(
        "We couldn't load the booking assignment statistics. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const employeeWorkloadData = statistics?.employeeWorkloads || [];
  const employeeRevenueData = statistics?.employeeRevenues || [];
  const departmentData = statistics?.departmentDistributions || [];
  const designationData = statistics?.designationDistributions || [];
  const trendData = statistics?.monthlyAssignmentTrends || [];
  const assignmentStatusData = statistics?.assignmentStatusDistributions || [];

  /* Chart Colors */
  const PIE_COLORS = [
    theme.primary ?? "#0D4E4A",
    "#FDA4AF",
    "#60A5FA",
    "#FBBF24",
    "#34D399",
    "#A78BFA",
    "#F472B6",
    "#2DD4BF",
  ];

  // Format trend data for display
  const formattedTrendData = trendData.map((item) => ({
    ...item,
    label: `${item.year}-${String(item.month).padStart(2, "0")}`,
  }));

  const statCards = getBookingAssignStatisticsData(statistics);

  const p = theme.primary ?? "#0D4E4A";
  const acc = theme.accent ?? "#1a7a74";
  const surf = theme.surface ?? "#ffffff";
  const bg = theme.background ?? "#f8fafb";
  const border = theme.border ?? "#e5e7eb";
  const textPrimary = theme.text ?? "#111827";
  const textSecondary = theme.textSecondary ?? "#6b7280";
  const errColor = theme.error ?? "#ef4444";
  const successColor = theme.success ?? "#10b981";

  const styles = getStatisticsStyles(
    "ba",
    p,
    acc,
    surf,
    bg,
    border,
    textPrimary,
    textSecondary,
    errColor,
    successColor,
    isDarkMode,
  );

  // Show CommonLoading while loading
  if (loading) {
    return (
      <CommonLoading
        message="Loading booking assignment statistics..."
        subMessage="Booking Assignment"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Booking Assignment-specific Styles */
        .ba-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .ba-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .ba-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .ba-stats-grid { grid-template-columns: 1fr; } }

        .ba-stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -.04em;
          position: relative;
          z-index: 1;
        }

        .ba-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .ba-charts-grid { grid-template-columns: 1fr; }
        }

        .ba-chart-card-full {
          grid-column: 1 / -1;
        }

        .ba-empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .ba-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }

        .ba-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 9px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,.28);
          border: 1px solid rgba(255,255,255,.07);
        }
        .ba-tooltip__label {
          font-size: .7rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .055em;
          margin-bottom: 4px;
        }
        .ba-tooltip__value {
          font-size: .9375rem;
          color: #f8fafc;
          font-weight: 700;
        }
        .ba-tooltip__sub {
          font-size: .75rem;
          color: #94a3b8;
          margin-top: 4px;
        }
      `}</style>

      <div className="ba-root">
        <div>
          <Reveal delay={0}>
            <div
              className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: `${theme.surface}D9`,
                borderColor: theme.border,
              }}
            >
              <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <PageHeader
                  title="Booking Assignment"
                  description="Manage and analyze booking assignment performance and workload distribution"
                  breadcrumbItems={BOOKING_ASSIGN_HOME_BREADCRUMB_DATA}
                />
              </div>
            </div>
          </Reveal>

          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Quick Actions ── */}
            <Reveal delay={60}>
              <section>
                <SectionHeader
                  title="Quick Actions"
                  subtitle="Jump directly to any booking assignment management task"
                  badge={`${bookingAssignData?.subData.length ?? 0} actions`}
                  prefix="ba"
                />
                <div className="ba-actions-grid">
                  {bookingAssignData?.subData.map((action) => {
                    const { accent, icon, pillLabel } = getActionConfig(
                      action.name,
                    );
                    return (
                      <ActionCard
                        key={action.id}
                        id={action.id}
                        name={action.name}
                        description={action.description}
                        url={action.url}
                        accent={accent}
                        icon={icon}
                        pillLabel={pillLabel}
                        ctaText="Open"
                        theme={theme}
                        isDarkMode={isDarkMode}
                      />
                    );
                  })}
                </div>
              </section>
            </Reveal>

            {/* ── Error ── */}
            {error && (
              <Reveal delay={0}>
                <div className="ba-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="ba"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="ba-mt-8">
                  <SectionHeader
                    title="Assignment Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="ba"
                  />
                  <div className="ba-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`ba-stat-card ba-stat-card--${card.accent}`}
                      >
                        <div
                          className={`ba-stat-icon ba-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="ba-stat-value">
                          <AnimatedCount
                            value={card.value}
                            duration={950 + i * 70}
                            decimals={
                              card.title === "Avg Bookings/Employee" ? 0 : 0
                            }
                          />
                          {card.suffix && (
                            <span className="ba-stat-suffix">
                              {card.suffix}
                            </span>
                          )}
                        </div>
                        <div className="ba-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Employee Workload + Employee Revenue */}
                <Reveal delay={180}>
                  <section className="ba-mt-8">
                    <SectionHeader
                      title="Employee Performance"
                      subtitle="Workload distribution and revenue generation"
                      prefix="ba"
                    />
                    <div className="ba-charts-grid">
                      {/* Bar Chart - Employee Workload */}
                      <div className="ba-chart-card">
                        <div className="ba-chart-header">
                          <div className="ba-chart-title">
                            <span className="ba-chart-dot ba-chart-dot--p" />
                            Employee Workload
                          </div>
                          <span className="ba-chart-sub">
                            {employeeWorkloadData.length} employees
                          </span>
                        </div>
                        {employeeWorkloadData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={employeeWorkloadData}
                                layout="vertical"
                                margin={{
                                  top: 4,
                                  right: 30,
                                  bottom: 4,
                                  left: 120,
                                }}
                                barSize={28}
                              >
                                <defs>
                                  <linearGradient
                                    id="workloadGrad"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={p}
                                      stopOpacity={0.9}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={p}
                                      stopOpacity={0.6}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.8)}
                                  horizontal={false}
                                />
                                <XAxis
                                  type="number"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  axisLine={false}
                                  tickLine={false}
                                  tickFormatter={(value) =>
                                    value.toLocaleString()
                                  }
                                />
                                <YAxis
                                  type="category"
                                  dataKey="employeeName"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={115}
                                />
                                <Tooltip
                                  content={<EmployeeWorkloadTooltip />}
                                />
                                <Bar
                                  dataKey="totalBookings"
                                  fill="url(#workloadGrad)"
                                  radius={[0, 6, 6, 0]}
                                  name="Bookings"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="ba-empty-state">
                            <p className="ba-empty-text">
                              No employee workload data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bar Chart - Employee Revenue */}
                      <div className="ba-chart-card">
                        <div className="ba-chart-header">
                          <div className="ba-chart-title">
                            <span className="ba-chart-dot ba-chart-dot--acc" />
                            Employee Revenue
                          </div>
                          <span className="ba-chart-sub">
                            {employeeRevenueData.length} employees
                          </span>
                        </div>
                        {employeeRevenueData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={employeeRevenueData}
                                layout="vertical"
                                margin={{
                                  top: 4,
                                  right: 30,
                                  bottom: 4,
                                  left: 120,
                                }}
                                barSize={28}
                              >
                                <defs>
                                  <linearGradient
                                    id="revenueGrad"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={acc}
                                      stopOpacity={0.9}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={acc}
                                      stopOpacity={0.6}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.8)}
                                  horizontal={false}
                                />
                                <XAxis
                                  type="number"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  axisLine={false}
                                  tickLine={false}
                                  tickFormatter={(value) =>
                                    `$${value.toLocaleString()}`
                                  }
                                />
                                <YAxis
                                  type="category"
                                  dataKey="employeeName"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={115}
                                />
                                <Tooltip content={<EmployeeRevenueTooltip />} />
                                <Bar
                                  dataKey="totalRevenue"
                                  fill="url(#revenueGrad)"
                                  radius={[0, 6, 6, 0]}
                                  name="Revenue"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="ba-empty-state">
                            <p className="ba-empty-text">
                              No employee revenue data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Department Distribution + Designation Distribution */}
                <Reveal delay={240}>
                  <section className="ba-mt-7">
                    <SectionHeader
                      title="Distribution Analysis"
                      subtitle="Booking distribution by department and designation"
                      prefix="ba"
                    />
                    <div className="ba-charts-grid">
                      {/* Pie Chart - Department Distribution */}
                      <div className="ba-chart-card">
                        <div className="ba-chart-header">
                          <div className="ba-chart-title">
                            <span className="ba-chart-dot ba-chart-dot--p" />
                            Department Distribution
                          </div>
                          <span className="ba-chart-sub">
                            {departmentData.length} departments
                          </span>
                        </div>
                        {departmentData.length > 0 ? (
                          <>
                            <div style={{ width: "100%", height: 280 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <defs>
                                    {PIE_COLORS.map((color, idx) => (
                                      <linearGradient
                                        key={`grad-${idx}`}
                                        id={`pieGrad-${idx}`}
                                        x1="0"
                                        y1="0"
                                        x2="1"
                                        y2="1"
                                      >
                                        <stop
                                          offset="0%"
                                          stopColor={color}
                                          stopOpacity={0.9}
                                        />
                                        <stop
                                          offset="100%"
                                          stopColor={color}
                                          stopOpacity={0.7}
                                        />
                                      </linearGradient>
                                    ))}
                                  </defs>
                                  <Pie
                                    data={departmentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    dataKey="totalBookings"
                                    nameKey="departmentName"
                                    animationBegin={200}
                                    animationDuration={900}
                                  >
                                    {departmentData.map((_, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#pieGrad-${index % PIE_COLORS.length})`}
                                        stroke={surf}
                                        strokeWidth={2}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<DepartmentTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="ba-pie-legend">
                              {departmentData.map((item, i) => (
                                <div key={i} className="ba-pie-legend-item">
                                  <span
                                    className="ba-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.departmentName}
                                  <span className="ba-pie-legend-count">
                                    {item.totalBookings.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="ba-empty-state">
                            <p className="ba-empty-text">
                              No department data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Pie Chart - Designation Distribution */}
                      <div className="ba-chart-card">
                        <div className="ba-chart-header">
                          <div className="ba-chart-title">
                            <span className="ba-chart-dot ba-chart-dot--acc" />
                            Designation Distribution
                          </div>
                          <span className="ba-chart-sub">
                            {designationData.length} designations
                          </span>
                        </div>
                        {designationData.length > 0 ? (
                          <>
                            <div style={{ width: "100%", height: 280 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <defs>
                                    {PIE_COLORS.map((color, idx) => (
                                      <linearGradient
                                        key={`grad-${idx}`}
                                        id={`pieGrad-${idx}`}
                                        x1="0"
                                        y1="0"
                                        x2="1"
                                        y2="1"
                                      >
                                        <stop
                                          offset="0%"
                                          stopColor={color}
                                          stopOpacity={0.9}
                                        />
                                        <stop
                                          offset="100%"
                                          stopColor={color}
                                          stopOpacity={0.7}
                                        />
                                      </linearGradient>
                                    ))}
                                  </defs>
                                  <Pie
                                    data={designationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    dataKey="totalBookings"
                                    nameKey="designationName"
                                    animationBegin={200}
                                    animationDuration={900}
                                  >
                                    {designationData.map((_, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#pieGrad-${index % PIE_COLORS.length})`}
                                        stroke={surf}
                                        strokeWidth={2}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<DesignationTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="ba-pie-legend">
                              {designationData.map((item, i) => (
                                <div key={i} className="ba-pie-legend-item">
                                  <span
                                    className="ba-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.designationName}
                                  <span className="ba-pie-legend-count">
                                    {item.totalBookings.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="ba-empty-state">
                            <p className="ba-empty-text">
                              No designation data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Monthly Assignment Trend + Assignment Status Distribution */}
                <Reveal delay={300}>
                  <section className="ba-mt-7">
                    <SectionHeader
                      title="Trends & Status"
                      subtitle="Monthly assignment trends and status distribution"
                      prefix="ba"
                    />
                    <div className="ba-charts-grid">
                      {/* Line Chart - Monthly Assignment Trend */}
                      <div className="ba-chart-card">
                        <div className="ba-chart-header">
                          <div className="ba-chart-title">
                            <span className="ba-chart-dot ba-chart-dot--p" />
                            Monthly Assignment Trend
                          </div>
                          <span className="ba-chart-sub">
                            {formattedTrendData.length} months
                          </span>
                        </div>
                        {formattedTrendData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart
                                data={formattedTrendData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="trendGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={p}
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={p}
                                      stopOpacity={0.02}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.8)}
                                />
                                <XAxis
                                  dataKey="label"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  angle={-35}
                                  textAnchor="end"
                                  interval={0}
                                  height={60}
                                />
                                <YAxis
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={45}
                                  tickFormatter={(value) =>
                                    value.toLocaleString()
                                  }
                                />
                                <Tooltip content={<AssignmentTrendTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="totalAssignedBookings"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  fill="url(#trendGrad)"
                                  name="Assigned Bookings"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="totalAssignedBookings"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  dot={{
                                    fill: p,
                                    r: 4,
                                    strokeWidth: 2,
                                    stroke: surf,
                                  }}
                                  activeDot={{ r: 6, fill: p }}
                                  name="Assigned Bookings"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="ba-empty-state">
                            <p className="ba-empty-text">
                              No trend data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Pie Chart - Assignment Status Distribution */}
                      <div className="ba-chart-card">
                        <div className="ba-chart-header">
                          <div className="ba-chart-title">
                            <span className="ba-chart-dot ba-chart-dot--acc" />
                            Assignment Status
                          </div>
                          <span className="ba-chart-sub">
                            {assignmentStatusData.length} statuses
                          </span>
                        </div>
                        {assignmentStatusData.length > 0 ? (
                          <>
                            <div style={{ width: "100%", height: 280 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <defs>
                                    {PIE_COLORS.map((color, idx) => (
                                      <linearGradient
                                        key={`grad-${idx}`}
                                        id={`pieGrad-${idx}`}
                                        x1="0"
                                        y1="0"
                                        x2="1"
                                        y2="1"
                                      >
                                        <stop
                                          offset="0%"
                                          stopColor={color}
                                          stopOpacity={0.9}
                                        />
                                        <stop
                                          offset="100%"
                                          stopColor={color}
                                          stopOpacity={0.7}
                                        />
                                      </linearGradient>
                                    ))}
                                  </defs>
                                  <Pie
                                    data={assignmentStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    dataKey="totalBookings"
                                    nameKey="assignmentType"
                                    animationBegin={200}
                                    animationDuration={900}
                                  >
                                    {assignmentStatusData.map((_, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#pieGrad-${index % PIE_COLORS.length})`}
                                        stroke={surf}
                                        strokeWidth={2}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    content={<AssignmentStatusTooltip />}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="ba-pie-legend">
                              {assignmentStatusData.map((item, i) => (
                                <div key={i} className="ba-pie-legend-item">
                                  <span
                                    className="ba-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.assignmentType}
                                  <span className="ba-pie-legend-count">
                                    {item.totalBookings.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="ba-empty-state">
                            <p className="ba-empty-text">
                              No assignment status data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>
              </>
            )}

            {/* ── Info banner ── */}
            <Reveal delay={360}>
              <section className="ba-mt-7">
                <InfoBanner
                  title="Booking Assignment Management"
                  description="Manage and analyze booking assignments across your organization. Track employee workload distribution, revenue generation, department and designation performance, and monthly assignment trends. Use the quick actions above to assign bookings, view employee workloads, or manage assignments. All statistics and charts reflect real-time data from your backend."
                  prefix="ba"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingAssignPage;
