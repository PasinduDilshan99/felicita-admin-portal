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
  Legend,
  ComposedChart,
  Line,
  Cell,
  PieChart,
  Pie,
  Area,
  AreaChart,
} from "recharts";
import { BookingHistoryService } from "@/services/bookingHistoryService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { bookingManagementSideBarData } from "@/data/side-bar-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getBookingHistoryStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  BookingGrowthTooltip,
  RevenueGrowthTooltip,
  StatusHistoryTooltip,
  CancellationTooltip,
  TopTourTooltip,
  CustomerReturnTooltip,
  PeakPeriodTooltip,
} from "@/components/statistics-components";
import { BookingHistoryStatisticsData } from "@/types/booking-history-types";
import { BOOKING_HISTORY_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const BookingHistoryPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<BookingHistoryStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingHistoryData = bookingManagementSideBarData.find(
    (item) => item.name === "Booking History",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response =
        await BookingHistoryService.getBookingHistoryStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError(
        "We couldn't load the booking history statistics. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const bookingGrowthData = statistics?.bookingGrowthTrends || [];
  const revenueGrowthData = statistics?.revenueGrowthTrends || [];
  const statusHistoryData = statistics?.bookingStatusHistories || [];
  const cancellationData = statistics?.cancellationTrends || [];
  const topToursData = statistics?.historicalTopTours || [];
  const customerReturnData = statistics?.customerReturnStatistics || [];
  const peakPeriodData = statistics?.peakBookingPeriods || [];

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

  // Format monthly data for display
  const formattedBookingGrowth = bookingGrowthData.map((item) => ({
    ...item,
    label: `${item.year}-${String(item.month).padStart(2, "0")}`,
  }));

  const formattedRevenueGrowth = revenueGrowthData.map((item) => ({
    ...item,
    label: `${item.year}-${String(item.month).padStart(2, "0")}`,
  }));

  const formattedCancellationData = cancellationData.map((item) => ({
    ...item,
    label: `${item.year}-${String(item.month).padStart(2, "0")}`,
  }));

  // Group status history by month for stacked area
  const groupedStatusData = statusHistoryData.reduce((acc: any[], item) => {
    const key = `${item.year}-${String(item.month).padStart(2, "0")}`;
    const existing = acc.find((d) => d.label === key);
    if (existing) {
      existing[item.bookingStatusName] =
        (existing[item.bookingStatusName] || 0) + item.totalBookings;
    } else {
      acc.push({
        label: key,
        [item.bookingStatusName]: item.totalBookings,
      });
    }
    return acc;
  }, []);

  const statCards = getBookingHistoryStatisticsData(statistics);

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
    "bh",
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
        message="Loading booking history statistics..."
        subMessage="Booking History"
        fullScreen
      />
    );
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Booking History-specific Styles */
        .bh-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .bh-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .bh-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .bh-stats-grid { grid-template-columns: 1fr; } }

        .bh-stat-prefix {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
          margin-right: 2px;
        }

        .bh-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .bh-charts-grid { grid-template-columns: 1fr; }
        }

        .bh-chart-card-full {
          grid-column: 1 / -1;
        }

        .bh-empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .bh-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }

        .bh-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 9px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,.28);
          border: 1px solid rgba(255,255,255,.07);
        }
        .bh-tooltip__label {
          font-size: .7rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .055em;
          margin-bottom: 4px;
        }
        .bh-tooltip__value {
          font-size: .9375rem;
          color: #f8fafc;
          font-weight: 700;
        }
        .bh-tooltip__sub {
          font-size: .75rem;
          color: #94a3b8;
          margin-top: 4px;
        }

        /* Date info cards */
        .bh-date-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .bh-date-card {
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }
        .bh-date-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .bh-date-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          margin-top: 0.25rem;
        }
      `}</style>

      <div className="bh-root">
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
                  title="Booking History"
                  description="Analyze historical booking data, trends, and customer behavior"
                  breadcrumbItems={BOOKING_HISTORY_HOME_BREADCRUMB_DATA}
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
                  subtitle="Jump directly to any booking history management task"
                  badge={`${bookingHistoryData?.subData.length ?? 0} actions`}
                  prefix="bh"
                />
                <div className="bh-actions-grid">
                  {bookingHistoryData?.subData.map((action) => {
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
                <div className="bh-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="bh"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="bh-mt-8">
                  <SectionHeader
                    title="History Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="bh"
                  />
                  <div className="bh-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`bh-stat-card bh-stat-card--${card.accent}`}
                      >
                        <div
                          className={`bh-stat-icon bh-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="bh-stat-value">
                          {card.prefix && (
                            <span className="bh-stat-prefix">
                              {card.prefix}
                            </span>
                          )}
                          <AnimatedCount
                            value={card.value}
                            duration={950 + i * 70}
                            decimals={0}
                          />
                          {card.suffix && (
                            <span className="bh-stat-suffix">
                              {card.suffix}
                            </span>
                          )}
                        </div>
                        <div className="bh-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>

                  {/* Date Information */}
                  {statistics && (
                    <div className="bh-date-info">
                      <div className="bh-date-card">
                        <div className="bh-date-label">First Booking</div>
                        <div className="bh-date-value">
                          {formatDate(statistics.summary.firstBookingDate)}
                        </div>
                      </div>
                      <div className="bh-date-card">
                        <div className="bh-date-label">Latest Booking</div>
                        <div className="bh-date-value">
                          {formatDate(statistics.summary.latestBookingDate)}
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Booking Growth + Revenue Growth */}
                <Reveal delay={180}>
                  <section className="bh-mt-8">
                    <SectionHeader
                      title="Growth Trends"
                      subtitle="Booking and revenue growth over time"
                      prefix="bh"
                    />
                    <div className="bh-charts-grid">
                      {/* Line Chart - Booking Growth */}
                      <div className="bh-chart-card">
                        <div className="bh-chart-header">
                          <div className="bh-chart-title">
                            <span className="bh-chart-dot bh-chart-dot--p" />
                            Booking Growth
                          </div>
                          <span className="bh-chart-sub">
                            {formattedBookingGrowth.length} months
                          </span>
                        </div>
                        {formattedBookingGrowth.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart
                                data={formattedBookingGrowth}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="bookingGrowthGrad"
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
                                <Tooltip content={<BookingGrowthTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="totalBookings"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  fill="url(#bookingGrowthGrad)"
                                  name="Bookings"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="totalBookings"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  dot={{
                                    fill: p,
                                    r: 4,
                                    strokeWidth: 2,
                                    stroke: surf,
                                  }}
                                  activeDot={{ r: 6, fill: p }}
                                  name="Bookings"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="bh-empty-state">
                            <p className="bh-empty-text">
                              No booking growth data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Line Chart - Revenue Growth */}
                      <div className="bh-chart-card">
                        <div className="bh-chart-header">
                          <div className="bh-chart-title">
                            <span className="bh-chart-dot bh-chart-dot--acc" />
                            Revenue Growth
                          </div>
                          <span className="bh-chart-sub">
                            {formattedRevenueGrowth.length} months
                          </span>
                        </div>
                        {formattedRevenueGrowth.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart
                                data={formattedRevenueGrowth}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="revenueGrowthGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={acc}
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={acc}
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
                                  width={55}
                                  tickFormatter={(value) =>
                                    `$${value.toLocaleString()}`
                                  }
                                />
                                <Tooltip content={<RevenueGrowthTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="totalRevenue"
                                  stroke={acc}
                                  strokeWidth={2.5}
                                  fill="url(#revenueGrowthGrad)"
                                  name="Revenue"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="totalRevenue"
                                  stroke={acc}
                                  strokeWidth={2.5}
                                  dot={{
                                    fill: acc,
                                    r: 4,
                                    strokeWidth: 2,
                                    stroke: surf,
                                  }}
                                  activeDot={{ r: 6, fill: acc }}
                                  name="Revenue"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="bh-empty-state">
                            <p className="bh-empty-text">
                              No revenue growth data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Status History (Stacked Area) + Cancellation Trends */}
                <Reveal delay={240}>
                  <section className="bh-mt-7">
                    <SectionHeader
                      title="Status & Cancellation Analysis"
                      subtitle="Booking status evolution and cancellation patterns"
                      prefix="bh"
                    />
                    <div className="bh-charts-grid">
                      {/* Stacked Area Chart - Status History */}
                      <div className="bh-chart-card">
                        <div className="bh-chart-header">
                          <div className="bh-chart-title">
                            <span className="bh-chart-dot bh-chart-dot--p" />
                            Status History
                          </div>
                          <span className="bh-chart-sub">
                            {groupedStatusData.length} months
                          </span>
                        </div>
                        {groupedStatusData.length > 0 &&
                        statusHistoryData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={groupedStatusData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  {statusHistoryData.map((item, idx) => {
                                    const color =
                                      PIE_COLORS[idx % PIE_COLORS.length];
                                    return (
                                      <linearGradient
                                        key={`grad-${idx}`}
                                        id={`statusGrad-${idx}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="0%"
                                          stopColor={color}
                                          stopOpacity={0.8}
                                        />
                                        <stop
                                          offset="100%"
                                          stopColor={color}
                                          stopOpacity={0.1}
                                        />
                                      </linearGradient>
                                    );
                                  })}
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
                                <Tooltip content={<StatusHistoryTooltip />} />
                                <Legend verticalAlign="top" height={36} />
                                {statusHistoryData.map((item, idx) => {
                                  const color =
                                    PIE_COLORS[idx % PIE_COLORS.length];
                                  return (
                                    <Area
                                      key={idx}
                                      type="monotone"
                                      dataKey={item.bookingStatusName}
                                      stackId="1"
                                      stroke={color}
                                      fill={`url(#statusGrad-${idx})`}
                                      name={item.bookingStatusName}
                                      animationBegin={300 + idx * 100}
                                      animationDuration={900}
                                    />
                                  );
                                })}
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="bh-empty-state">
                            <p className="bh-empty-text">
                              No status history data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Combo Chart - Cancellation Trends */}
                      <div className="bh-chart-card">
                        <div className="bh-chart-header">
                          <div className="bh-chart-title">
                            <span className="bh-chart-dot bh-chart-dot--acc" />
                            Cancellation Trends
                          </div>
                          <span className="bh-chart-sub">
                            {formattedCancellationData.length} months
                          </span>
                        </div>
                        {formattedCancellationData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart
                                data={formattedCancellationData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="cancellationGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={errColor}
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={errColor}
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
                                  yAxisId="left"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={45}
                                  tickFormatter={(value) =>
                                    value.toLocaleString()
                                  }
                                />
                                <YAxis
                                  yAxisId="right"
                                  orientation="right"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={45}
                                  tickFormatter={(value) =>
                                    `${value.toFixed(1)}%`
                                  }
                                  domain={[0, 100]}
                                />
                                <Tooltip content={<CancellationTooltip />} />
                                <Legend verticalAlign="top" height={36} />
                                <Bar
                                  yAxisId="left"
                                  dataKey="totalCancelledBookings"
                                  fill="url(#cancellationGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Cancellations"
                                  barSize={30}
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Line
                                  yAxisId="right"
                                  type="monotone"
                                  dataKey="cancellationRate"
                                  stroke={errColor}
                                  strokeWidth={2.5}
                                  dot={{ fill: errColor, r: 4 }}
                                  name="Cancellation Rate"
                                  animationBegin={400}
                                  animationDuration={900}
                                />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="bh-empty-state">
                            <p className="bh-empty-text">
                              No cancellation data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Top Tours + Customer Return Analysis */}
                <Reveal delay={300}>
                  <section className="bh-mt-7">
                    <SectionHeader
                      title="Top Performers & Customer Insights"
                      subtitle="Historical top tours and customer return statistics"
                      prefix="bh"
                    />
                    <div className="bh-charts-grid">
                      {/* Bar Chart - Historical Top Tours */}
                      <div className="bh-chart-card">
                        <div className="bh-chart-header">
                          <div className="bh-chart-title">
                            <span className="bh-chart-dot bh-chart-dot--p" />
                            Historical Top Tours
                          </div>
                          <span className="bh-chart-sub">
                            By total bookings
                          </span>
                        </div>
                        {topToursData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={topToursData}
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
                                    id="topTourGrad"
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
                                  dataKey="tourName"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={115}
                                />
                                <Tooltip content={<TopTourTooltip />} />
                                <Bar
                                  dataKey="totalBookings"
                                  fill="url(#topTourGrad)"
                                  radius={[0, 6, 6, 0]}
                                  name="Bookings"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="bh-empty-state">
                            <p className="bh-empty-text">
                              No top tour data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Pie Chart - Customer Return Statistics */}
                      <div className="bh-chart-card">
                        <div className="bh-chart-header">
                          <div className="bh-chart-title">
                            <span className="bh-chart-dot bh-chart-dot--acc" />
                            Customer Return Analysis
                          </div>
                          <span className="bh-chart-sub">
                            {customerReturnData.length} categories
                          </span>
                        </div>
                        {customerReturnData.length > 0 ? (
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
                                    data={customerReturnData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    dataKey="totalCustomers"
                                    nameKey="customerType"
                                    animationBegin={200}
                                    animationDuration={900}
                                  >
                                    {customerReturnData.map((_, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#pieGrad-${index % PIE_COLORS.length})`}
                                        stroke={surf}
                                        strokeWidth={2}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    content={<CustomerReturnTooltip />}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="bh-pie-legend">
                              {customerReturnData.map((item, i) => (
                                <div key={i} className="bh-pie-legend-item">
                                  <span
                                    className="bh-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.customerType}
                                  <span className="bh-pie-legend-count">
                                    {item.totalCustomers.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="bh-empty-state">
                            <p className="bh-empty-text">
                              No customer return data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 4: Peak Booking Periods */}
                <Reveal delay={360}>
                  <section className="bh-mt-7">
                    <SectionHeader
                      title="Peak Booking Periods"
                      subtitle="Seasonal booking patterns and high-demand months"
                      prefix="bh"
                    />
                    <div className="bh-chart-card bh-chart-card-full">
                      <div style={{ width: "100%", height: 320 }}>
                        {peakPeriodData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={peakPeriodData}
                              margin={{
                                top: 20,
                                right: 30,
                                bottom: 40,
                                left: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="peakGrad"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
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
                                vertical={false}
                              />
                              <XAxis
                                dataKey="monthName"
                                tick={{
                                  fontSize: 11,
                                  fill: textSecondary,
                                  fontWeight: 500,
                                }}
                                axisLine={false}
                                tickLine={false}
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
                              <Tooltip content={<PeakPeriodTooltip />} />
                              <Legend verticalAlign="top" height={36} />
                              <Bar
                                dataKey="totalBookings"
                                fill="url(#peakGrad)"
                                radius={[7, 7, 0, 0]}
                                name="Bookings"
                                animationBegin={300}
                                animationDuration={900}
                                label={{
                                  position: "right",
                                  formatter: (value: any) => {
                                    const numValue =
                                      typeof value === "number"
                                        ? value
                                        : Number(value);
                                    return isNaN(numValue)
                                      ? "0"
                                      : numValue.toLocaleString();
                                  },
                                  style: {
                                    fill: textSecondary,
                                    fontSize: 11,
                                    fontWeight: 600,
                                  },
                                }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="bh-empty-state">
                            <p className="bh-empty-text">
                              No peak period data available
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
            <Reveal delay={420}>
              <section className="bh-mt-7">
                <InfoBanner
                  title="Booking History Management"
                  description="Analyze historical booking data, trends, and customer behavior. Track booking and revenue growth over time, monitor status evolution, analyze cancellation patterns, and identify peak booking periods. Use the quick actions above to view detailed history, generate reports, or analyze specific periods. All statistics reflect real-time data from your backend and update each time you visit this page."
                  prefix="bh"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingHistoryPage;
