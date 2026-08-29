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
import { BookingStatusService } from "@/services/bookingStatusService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { bookingManagementSideBarData } from "@/data/side-bar-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getBookingStatusStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  StatusDistributionTooltip,
  FunnelTooltip,
  TrendTooltip,
  DropOffTooltip,
} from "@/components/statistics-components";
import { BookingStatusStatisticsData } from "@/types/booking-status-types";
import { BOOKING_STATUS_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const BookingStatusPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<BookingStatusStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingStatusData = bookingManagementSideBarData.find(
    (item) => item.name === "Booking Status",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await BookingStatusService.getBookingStatusStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError(
        "We couldn't load the booking status statistics. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const statusDistributionData = statistics?.statusDistributions || [];
  const funnelData = statistics?.statusFunnels || [];
  const trendData = statistics?.statusTrends || [];
  const dropOffData = statistics?.dropOffStatistics || [];

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

  const statCards = getBookingStatusStatisticsData(statistics);

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
    "bs",
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
        message="Loading booking status statistics..."
        subMessage="Booking Status"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Booking Status-specific Styles */
        .bs-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .bs-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .bs-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .bs-stats-grid { grid-template-columns: 1fr; } }

        .bs-stat-value--text {
          font-size: 1rem;
          font-weight: 600;
          color: var(--p);
          word-break: break-word;
        }

        .bs-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .bs-charts-grid { grid-template-columns: 1fr; }
        }

        .bs-chart-card-full {
          grid-column: 1 / -1;
        }

        .bs-empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .bs-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }

        .bs-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 9px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,.28);
          border: 1px solid rgba(255,255,255,.07);
        }
        .bs-tooltip__label {
          font-size: .7rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .055em;
          margin-bottom: 4px;
        }
        .bs-tooltip__value {
          font-size: .9375rem;
          color: #f8fafc;
          font-weight: 700;
        }
        .bs-tooltip__sub {
          font-size: .75rem;
          color: #94a3b8;
          margin-top: 4px;
        }
        .bs-tooltip--dropoff {
          min-width: 160px;
        }

        /* Drop-off chart custom styles */
        .bs-dropoff-bar {
          transition: all 0.3s ease;
        }
        .bs-dropoff-bar:hover {
          filter: brightness(0.95);
        }
      `}</style>

      <div className="bs-root">
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
                  title="Booking Status"
                  description="Manage and analyze booking status performance and trends"
                  breadcrumbItems={BOOKING_STATUS_HOME_BREADCRUMB_DATA}
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
                  subtitle="Jump directly to any booking status management task"
                  badge={`${bookingStatusData?.subData.length ?? 0} actions`}
                  prefix="bs"
                />
                <div className="bs-actions-grid">
                  {bookingStatusData?.subData.map((action) => {
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
                <div className="bs-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="bs"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="bs-mt-8">
                  <SectionHeader
                    title="Status Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="bs"
                  />
                  <div className="bs-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`bs-stat-card bs-stat-card--${card.accent}`}
                      >
                        <div
                          className={`bs-stat-icon bs-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        {card.valueText ? (
                          <div className="bs-stat-value bs-stat-value--text">
                            {card.valueText}
                          </div>
                        ) : card.title === "Inquiry to Booked Rate" ? (
                          <div className="bs-stat-value">
                            <AnimatedCount
                              value={card.value}
                              duration={950 + i * 70}
                              decimals={1}
                            />
                            <span className="bs-stat-suffix">%</span>
                          </div>
                        ) : (
                          <div className="bs-stat-value">
                            <AnimatedCount
                              value={card.value}
                              duration={950 + i * 70}
                            />
                            {card.suffix && (
                              <span className="bs-stat-suffix">
                                {card.suffix}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="bs-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Status Distribution (Pie) + Status Funnel (Bar) */}
                <Reveal delay={180}>
                  <section className="bs-mt-8">
                    <SectionHeader
                      title="Distribution & Funnel"
                      subtitle="Status distribution and conversion funnel"
                      prefix="bs"
                    />
                    <div className="bs-charts-grid">
                      {/* Pie Chart - Status Distribution */}
                      <div className="bs-chart-card">
                        <div className="bs-chart-header">
                          <div className="bs-chart-title">
                            <span className="bs-chart-dot bs-chart-dot--p" />
                            Status Distribution
                          </div>
                          <span className="bs-chart-sub">
                            {statusDistributionData.length} statuses
                          </span>
                        </div>
                        {statusDistributionData.length > 0 ? (
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
                                    data={statusDistributionData}
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
                                    {statusDistributionData.map((_, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#pieGrad-${index % PIE_COLORS.length})`}
                                        stroke={surf}
                                        strokeWidth={2}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    content={<StatusDistributionTooltip />}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="bs-pie-legend">
                              {statusDistributionData.map((item, i) => (
                                <div key={i} className="bs-pie-legend-item">
                                  <span
                                    className="bs-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.bookingStatusName}
                                  <span className="bs-pie-legend-count">
                                    {item.totalBookings.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="bs-empty-state">
                            <p className="bs-empty-text">
                              No status distribution data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Funnel Chart - Status Funnel */}
                      <div className="bs-chart-card">
                        <div className="bs-chart-header">
                          <div className="bs-chart-title">
                            <span className="bs-chart-dot bs-chart-dot--acc" />
                            Status Funnel
                          </div>
                          <span className="bs-chart-sub">
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
                          <div className="bs-empty-state">
                            <p className="bs-empty-text">
                              No funnel data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Status Trends (Line) + Drop-off Analysis (Bar) */}
                <Reveal delay={240}>
                  <section className="bs-mt-7">
                    <SectionHeader
                      title="Trends & Drop-off Analysis"
                      subtitle="Status trends over time and drop-off patterns"
                      prefix="bs"
                    />
                    <div className="bs-charts-grid">
                      {/* Line Chart - Status Trends */}
                      <div className="bs-chart-card">
                        <div className="bs-chart-header">
                          <div className="bs-chart-title">
                            <span className="bs-chart-dot bs-chart-dot--p" />
                            Status Trends
                          </div>
                          <span className="bs-chart-sub">Over time</span>
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
                                <Tooltip content={<TrendTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="totalBookings"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  fill="url(#trendGrad)"
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
                          <div className="bs-empty-state">
                            <p className="bs-empty-text">
                              No trend data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bar Chart - Drop-off Statistics */}
                      <div className="bs-chart-card">
                        <div className="bs-chart-header">
                          <div className="bs-chart-title">
                            <span className="bs-chart-dot bs-chart-dot--acc" />
                            Drop-off Analysis
                          </div>
                          <span className="bs-chart-sub">
                            Booking drop-off points
                          </span>
                        </div>
                        {dropOffData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={dropOffData}
                                margin={{
                                  top: 4,
                                  right: 30,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="dropoffGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={errColor}
                                      stopOpacity={0.9}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={errColor}
                                      stopOpacity={0.5}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.8)}
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="bookingStatusName"
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
                                <Tooltip content={<DropOffTooltip />} />
                                <Bar
                                  dataKey="totalBookings"
                                  fill="url(#dropoffGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Drop-offs"
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
                          <div className="bs-empty-state">
                            <p className="bs-empty-text">
                              No drop-off data available
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
              <section className="bs-mt-7">
                <InfoBanner
                  title="Booking Status Management"
                  description="Manage and analyze booking status performance across your platform. Track status distribution, conversion funnels, trends over time, and drop-off patterns. Identify bottlenecks in the booking journey and optimize status workflows. Use the quick actions above to view, create, update, or manage booking statuses. All statistics and charts reflect real-time data from your backend."
                  prefix="bs"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingStatusPage;
