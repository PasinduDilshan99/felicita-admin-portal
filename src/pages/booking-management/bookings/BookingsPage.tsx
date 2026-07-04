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
} from "recharts";
import { BookingService } from "@/services/bookingService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { bookingManagementSideBarData } from "@/data/side-bar-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getBookingStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  RevenueTrendTooltip,
  BookingTrendTooltip,
  StatusPieTooltip,
  FunnelTooltip,
  TopTourTooltip,
  PopularActivityTooltip,
} from "@/components/statistics-components";
import { BookingStatisticsData } from "@/types/booking-types";
import { TOUR_BOOKING_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const BookingsPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<BookingStatisticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingsData = bookingManagementSideBarData.find(
    (item) => item.name === "Tour Bookings",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await BookingService.getBookingStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the booking statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const monthlyBookingData = statistics?.monthlyBookingTrends || [];
  const monthlyRevenueData = statistics?.monthlyRevenueTrends || [];
  const statusData = statistics?.bookingStatusDistributions || [];
  const funnelData = statistics?.bookingFunnels || [];
  const topToursData = statistics?.topTours || [];
  const popularActivitiesData = statistics?.popularActivities || [];

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
  const formattedMonthlyData = monthlyBookingData.map((item) => ({
    ...item,
    label: `${item.year}-${String(item.month).padStart(2, "0")}`,
  }));

  const formattedRevenueData = monthlyRevenueData.map((item) => ({
    ...item,
    label: `${item.year}-${String(item.month).padStart(2, "0")}`,
  }));

  const statCards = getBookingStatisticsData(statistics);

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
    "bk",
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
        message="Loading booking statistics..."
        subMessage="Bookings"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Booking-specific Styles */
        .bk-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .bk-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .bk-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .bk-stats-grid { grid-template-columns: 1fr; } }

        .bk-stat-prefix {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
          margin-right: 2px;
        }

        .bk-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .bk-charts-grid { grid-template-columns: 1fr; }
        }

        .bk-chart-card-full {
          grid-column: 1 / -1;
        }

        .bk-empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .bk-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }

        .bk-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 9px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,.28);
          border: 1px solid rgba(255,255,255,.07);
        }
        .bk-tooltip__label {
          font-size: .7rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .055em;
          margin-bottom: 4px;
        }
        .bk-tooltip__value {
          font-size: .9375rem;
          color: #f8fafc;
          font-weight: 700;
        }
        .bk-tooltip__sub {
          font-size: .75rem;
          color: #94a3b8;
          margin-top: 4px;
        }

        /* Funnel chart custom styles */
        .bk-funnel-bar {
          transition: all 0.3s ease;
        }
        .bk-funnel-bar:hover {
          filter: brightness(0.95);
          transform: scaleX(1.02);
        }
        .bk-funnel-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text);
        }
        .bk-funnel-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--p);
        }
      `}</style>

      <div className="bk-root">
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
                  title="Bookings"
                  description="Manage and analyze booking performance and trends"
                  breadcrumbItems={TOUR_BOOKING_HOME_BREADCRUMB_DATA}
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
                  subtitle="Jump directly to any booking management task"
                  badge={`${bookingsData?.subData.length ?? 0} actions`}
                  prefix="bk"
                />
                <div className="bk-actions-grid">
                  {bookingsData?.subData.map((action) => {
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
                <div className="bk-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="bk"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="bk-mt-8">
                  <SectionHeader
                    title="Booking Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="bk"
                  />
                  <div className="bk-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`bk-stat-card bk-stat-card--${card.accent}`}
                      >
                        <div
                          className={`bk-stat-icon bk-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="bk-stat-value">
                          {card.prefix && (
                            <span className="bk-stat-prefix">
                              {card.prefix}
                            </span>
                          )}
                          <AnimatedCount
                            value={card.value}
                            duration={950 + i * 70}
                            decimals={
                              card.title === "Average Booking Value" ? 0 : 0
                            }
                          />
                          {card.suffix && (
                            <span className="bk-stat-suffix">
                              {card.suffix}
                            </span>
                          )}
                        </div>
                        <div className="bk-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Monthly Booking Trends + Monthly Revenue Trends */}
                <Reveal delay={180}>
                  <section className="bk-mt-8">
                    <SectionHeader
                      title="Monthly Trends"
                      subtitle="Booking and revenue trends over time"
                      prefix="bk"
                    />
                    <div className="bk-charts-grid">
                      {/* Line Chart - Monthly Booking Trends */}
                      <div className="bk-chart-card">
                        <div className="bk-chart-header">
                          <div className="bk-chart-title">
                            <span className="bk-chart-dot bk-chart-dot--p" />
                            Monthly Bookings
                          </div>
                          <span className="bk-chart-sub">
                            {formattedMonthlyData.length} months
                          </span>
                        </div>
                        {formattedMonthlyData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart
                                data={formattedMonthlyData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="bookingGrad"
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
                                <Tooltip content={<BookingTrendTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="totalBookings"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  fill="url(#bookingGrad)"
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
                          <div className="bk-empty-state">
                            <p className="bk-empty-text">
                              No booking trend data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Line Chart - Monthly Revenue Trends */}
                      <div className="bk-chart-card">
                        <div className="bk-chart-header">
                          <div className="bk-chart-title">
                            <span className="bk-chart-dot bk-chart-dot--acc" />
                            Monthly Revenue
                          </div>
                          <span className="bk-chart-sub">
                            {formattedRevenueData.length} months
                          </span>
                        </div>
                        {formattedRevenueData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart
                                data={formattedRevenueData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="revenueGrad"
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
                                <Tooltip content={<RevenueTrendTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="totalRevenue"
                                  stroke={acc}
                                  strokeWidth={2.5}
                                  fill="url(#revenueGrad)"
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
                          <div className="bk-empty-state">
                            <p className="bk-empty-text">
                              No revenue trend data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Booking Status Distribution (Pie) + Booking Funnel */}
                <Reveal delay={240}>
                  <section className="bk-mt-7">
                    <SectionHeader
                      title="Status & Funnel Analysis"
                      subtitle="Booking status distribution and conversion funnel"
                      prefix="bk"
                    />
                    <div className="bk-charts-grid">
                      {/* Pie Chart - Booking Status Distribution */}
                      <div className="bk-chart-card">
                        <div className="bk-chart-header">
                          <div className="bk-chart-title">
                            <span className="bk-chart-dot bk-chart-dot--p" />
                            Status Distribution
                          </div>
                          <span className="bk-chart-sub">
                            {statusData.length} statuses
                          </span>
                        </div>
                        {statusData.length > 0 ? (
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
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    dataKey="totalBookings"
                                    nameKey="bookingStatusName"
                                    animationBegin={200}
                                    animationDuration={900}
                                  >
                                    {statusData.map((_, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#pieGrad-${index % PIE_COLORS.length})`}
                                        stroke={surf}
                                        strokeWidth={2}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<StatusPieTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="bk-pie-legend">
                              {statusData.map((item, i) => (
                                <div key={i} className="bk-pie-legend-item">
                                  <span
                                    className="bk-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.bookingStatusName}
                                  <span className="bk-pie-legend-count">
                                    {item.totalBookings.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="bk-empty-state">
                            <p className="bk-empty-text">
                              No status data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Funnel Chart - Booking Funnel */}
                      <div className="bk-chart-card">
                        <div className="bk-chart-header">
                          <div className="bk-chart-title">
                            <span className="bk-chart-dot bk-chart-dot--acc" />
                            Booking Funnel
                          </div>
                          <span className="bk-chart-sub">
                            Conversion journey
                          </span>
                        </div>
                        {funnelData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={funnelData}
                                layout="vertical"
                                margin={{
                                  top: 4,
                                  right: 60,
                                  bottom: 4,
                                  left: 120,
                                }}
                                barSize={32}
                              >
                                <defs>
                                  <linearGradient
                                    id="funnelGrad"
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
                                      stopOpacity={0.5}
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
                                  dataKey="bookingStatusName"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={115}
                                />
                                <Tooltip content={<FunnelTooltip />} />
                                <Legend
                                  verticalAlign="top"
                                  height={36}
                                  formatter={() => (
                                    <span
                                      style={{
                                        color: textSecondary,
                                        fontSize: 12,
                                      }}
                                    >
                                      Conversion Rate:{" "}
                                      {funnelData[0]?.conversionPercentage?.toFixed(
                                        1,
                                      ) || 0}
                                      %
                                    </span>
                                  )}
                                />
                                <Bar
                                  dataKey="totalBookings"
                                  fill="url(#funnelGrad)"
                                  radius={[0, 6, 6, 0]}
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
                          </div>
                        ) : (
                          <div className="bk-empty-state">
                            <p className="bk-empty-text">
                              No funnel data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Top Tours + Popular Activities */}
                <Reveal delay={300}>
                  <section className="bk-mt-7">
                    <SectionHeader
                      title="Top Performers"
                      subtitle="Best performing tours and popular activities"
                      prefix="bk"
                    />
                    <div className="bk-charts-grid">
                      {/* Bar Chart - Top Tours */}
                      <div className="bk-chart-card">
                        <div className="bk-chart-header">
                          <div className="bk-chart-title">
                            <span className="bk-chart-dot bk-chart-dot--p" />
                            Top Tours
                          </div>
                          <span className="bk-chart-sub">
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
                          <div className="bk-empty-state">
                            <p className="bk-empty-text">
                              No tour data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bar Chart - Popular Activities */}
                      <div className="bk-chart-card">
                        <div className="bk-chart-header">
                          <div className="bk-chart-title">
                            <span className="bk-chart-dot bk-chart-dot--acc" />
                            Popular Activities
                          </div>
                          <span className="bk-chart-sub">
                            By total bookings
                          </span>
                        </div>
                        {popularActivitiesData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={popularActivitiesData}
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
                                    id="activityGrad"
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
                                    value.toLocaleString()
                                  }
                                />
                                <YAxis
                                  type="category"
                                  dataKey="activityName"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={115}
                                />
                                <Tooltip content={<PopularActivityTooltip />} />
                                <Bar
                                  dataKey="totalBookings"
                                  fill="url(#activityGrad)"
                                  radius={[0, 6, 6, 0]}
                                  name="Bookings"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="bk-empty-state">
                            <p className="bk-empty-text">
                              No activity data available
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
              <section className="bk-mt-7">
                <InfoBanner
                  title="Booking Management"
                  description="Manage and analyze booking performance across your platform. Track monthly trends, revenue patterns, status distributions, and conversion funnels. Identify top-performing tours and popular activities. Use the quick actions above to view, create, update, or manage bookings. All statistics and charts reflect real-time data from your backend."
                  prefix="bk"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingsPage;
