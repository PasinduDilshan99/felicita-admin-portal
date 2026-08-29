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
import { HeroSectionService } from "@/services/heroSectionService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
} from "@/components/statistics-components";
import { HeroSectionStatisticsData } from "@/types/hero-section-types";
import { getHeroSectionStatisticsData } from "@/data/statistics-data";

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */
interface ActionItem {
  id: number;
  name: string;
  description: string;
  url: string;
  color?: string;
  privilege: string;
}

interface HeroSectionStatisticsCommonPageProps {
  heroSectionType: string;
  title: string;
  description: string;
  breadcrumbItems: Array<{ label: string; href: string }>;
  actions?: ActionItem[];
}

/* ─────────────────────────────────────────────
   Custom Tooltips
───────────────────────────────────────────── */
const StatusTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="hs-tooltip">
      <p className="hs-tooltip__label">{payload[0].name}</p>
      <p className="hs-tooltip__value">
        {payload[0].value.toLocaleString()} sections
      </p>
      {data?.percentage !== undefined && (
        <p className="hs-tooltip__sub">
          {data.percentage.toFixed(1)}% of total
        </p>
      )}
    </div>
  );
};

const MonthlyTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="hs-tooltip">
      <p className="hs-tooltip__label">{label}</p>
      <p className="hs-tooltip__value">
        {payload[0].value.toLocaleString()} sections
      </p>
    </div>
  );
};

const ActivityTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="hs-tooltip">
      <p className="hs-tooltip__label">{label}</p>
      <p className="hs-tooltip__value">
        Created: {data?.createdCount?.toLocaleString() || 0}
      </p>
      <p className="hs-tooltip__sub">
        Updated: {data?.updatedCount?.toLocaleString() || 0}
      </p>
    </div>
  );
};

const TopEditorTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="hs-tooltip">
      <p className="hs-tooltip__label">{label}</p>
      <p className="hs-tooltip__value">
        {payload[0].value.toLocaleString()} updates
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Helper: truncate long editor usernames so the
   YAxis never forces the chart wider than its card
───────────────────────────────────────────── */
const truncateLabel = (value: string, max = 12) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const HeroSectionStatisticsCommonPage: React.FC<
  HeroSectionStatisticsCommonPageProps
> = ({
  heroSectionType,
  title,
  description,
  breadcrumbItems,
  actions = [],
}) => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<HeroSectionStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, [heroSectionType]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response =
        await HeroSectionService.getHeroSectionStatistics(heroSectionType);
      if (response.data) setStatistics(response.data);
    } catch {
      setError(
        `We couldn't load the ${title?.toLowerCase()} statistics. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const statusData = statistics?.statusStatistics || [];
  const monthlyData = statistics?.monthlyStatistics || [];
  const activityData = statistics?.activityStatistics || [];
  const topEditorData = statistics?.topEditorStatistics || [];

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
  const formattedMonthlyData = monthlyData.map((item) => ({
    ...item,
    label: `${item.year}-${String(item.month).padStart(2, "0")}`,
  }));

  const formattedActivityData = activityData.map((item) => ({
    ...item,
    label: `${item.year}-${String(item.month).padStart(2, "0")}`,
  }));

  const statCards = getHeroSectionStatisticsData(statistics);

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
    "hs",
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
        message={`Loading ${title?.toLowerCase()} statistics...`}
        subMessage={title}
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Hero Section-specific Styles */

        /* Prevent any stray overflow from ever creating a horizontal scrollbar */
        .hs-root {
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
        }

        .hs-stats-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 1rem;
          min-width: 0;
        }
        @media (max-width: 1200px) { .hs-stats-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (max-width: 768px)  { .hs-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 580px)  { .hs-stats-grid { grid-template-columns: minmax(0, 1fr); } }

        .hs-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
          min-width: 0;
        }
        @media (max-width: 1024px) {
          .hs-charts-grid { grid-template-columns: minmax(0, 1fr); }
        }

        .hs-chart-card,
        .hs-chart-card-full,
        .hs-stat-card {
          min-width: 0;
        }

        .hs-chart-card-full {
          grid-column: 1 / -1;
        }

        .hs-empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .hs-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }

        .hs-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 9px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,.28);
          border: 1px solid rgba(255,255,255,.07);
        }
        .hs-tooltip__label {
          font-size: .7rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .055em;
          margin-bottom: 4px;
        }
        .hs-tooltip__value {
          font-size: .9375rem;
          color: #f8fafc;
          font-weight: 700;
        }
        .hs-tooltip__sub {
          font-size: .75rem;
          color: #94a3b8;
          margin-top: 4px;
        }
      `}</style>

      <div className="hs-root">
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
                  title={title}
                  description={description}
                  breadcrumbItems={breadcrumbItems}
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
                  subtitle={`Manage ${title?.toLowerCase()} sections`}
                  badge={`${actions.length} actions`}
                  prefix="hs"
                />
                <div className="hs-actions-grid">
                  {actions.map((action) => {
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
                <div className="hs-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="hs"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="hs-mt-8">
                  <SectionHeader
                    title="Overview"
                    subtitle={`Key metrics for ${title?.toLowerCase()}`}
                    badge="Live"
                    live
                    prefix="hs"
                  />
                  <div className="hs-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`hs-stat-card hs-stat-card--${card.accent}`}
                      >
                        <div
                          className={`hs-stat-icon hs-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="hs-stat-value">
                          <AnimatedCount
                            value={card.value}
                            duration={950 + i * 70}
                          />
                          {card.suffix && (
                            <span className="hs-stat-suffix">
                              {card.suffix}
                            </span>
                          )}
                        </div>
                        <div className="hs-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Status Distribution (Pie) + Monthly Trend (Line) */}
                <Reveal delay={180}>
                  <section className="hs-mt-8">
                    <SectionHeader
                      title="Status & Trend Analysis"
                      subtitle="Status distribution and monthly trends"
                      prefix="hs"
                    />
                    <div className="hs-charts-grid">
                      {/* Pie Chart - Status Distribution */}
                      <div className="hs-chart-card">
                        <div className="hs-chart-header">
                          <div className="hs-chart-title">
                            <span className="hs-chart-dot hs-chart-dot--p" />
                            Status Distribution
                          </div>
                          <span className="hs-chart-sub">
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
                                    dataKey="count"
                                    nameKey="status"
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
                                  <Tooltip content={<StatusTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="hs-pie-legend">
                              {statusData.map((item, i) => (
                                <div key={i} className="hs-pie-legend-item">
                                  <span
                                    className="hs-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.status}
                                  <span className="hs-pie-legend-count">
                                    {item.count.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="hs-empty-state">
                            <p className="hs-empty-text">
                              No status data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Line Chart - Monthly Trend */}
                      <div className="hs-chart-card">
                        <div className="hs-chart-header">
                          <div className="hs-chart-title">
                            <span className="hs-chart-dot hs-chart-dot--acc" />
                            Monthly Trend
                          </div>
                          <span className="hs-chart-sub">
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
                                    id="monthlyGrad"
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
                                <Tooltip content={<MonthlyTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="count"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  fill="url(#monthlyGrad)"
                                  name="Sections"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="count"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  dot={{
                                    fill: p,
                                    r: 4,
                                    strokeWidth: 2,
                                    stroke: surf,
                                  }}
                                  activeDot={{ r: 6, fill: p }}
                                  name="Sections"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="hs-empty-state">
                            <p className="hs-empty-text">
                              No monthly trend data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Activity Statistics (Stacked Bar) + Top Editors (Bar) */}
                <Reveal delay={240}>
                  <section className="hs-mt-7">
                    <SectionHeader
                      title="Activity & Editor Analysis"
                      subtitle="Creation/update activity and top editors"
                      prefix="hs"
                    />
                    <div className="hs-charts-grid">
                      {/* Stacked Bar - Activity Statistics */}
                      <div className="hs-chart-card">
                        <div className="hs-chart-header">
                          <div className="hs-chart-title">
                            <span className="hs-chart-dot hs-chart-dot--p" />
                            Activity Statistics
                          </div>
                          <span className="hs-chart-sub">
                            Created vs Updated
                          </span>
                        </div>
                        {formattedActivityData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={formattedActivityData}
                                margin={{
                                  top: 4,
                                  right: 4,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="createdGrad"
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
                                  <linearGradient
                                    id="updatedGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
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
                                  vertical={false}
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
                                  width={35}
                                />
                                <Tooltip content={<ActivityTooltip />} />
                                <Legend verticalAlign="top" height={36} />
                                <Bar
                                  dataKey="createdCount"
                                  stackId="a"
                                  fill="url(#createdGrad)"
                                  name="Created"
                                  radius={[7, 7, 0, 0]}
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Bar
                                  dataKey="updatedCount"
                                  stackId="a"
                                  fill="url(#updatedGrad)"
                                  name="Updated"
                                  animationBegin={400}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="hs-empty-state">
                            <p className="hs-empty-text">
                              No activity data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bar Chart - Top Editors */}
                      <div className="hs-chart-card">
                        <div className="hs-chart-header">
                          <div className="hs-chart-title">
                            <span className="hs-chart-dot hs-chart-dot--acc" />
                            Top Editors
                          </div>
                          <span className="hs-chart-sub">By update count</span>
                        </div>
                        {topEditorData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={topEditorData}
                                layout="vertical"
                                margin={{
                                  top: 4,
                                  right: 30,
                                  bottom: 4,
                                  left: 8,
                                }}
                                barSize={28}
                              >
                                <defs>
                                  <linearGradient
                                    id="editorGrad"
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
                                  dataKey="username"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={90}
                                  tickFormatter={(value) =>
                                    truncateLabel(value, 12)
                                  }
                                />
                                <Tooltip content={<TopEditorTooltip />} />
                                <Bar
                                  dataKey="updateCount"
                                  fill="url(#editorGrad)"
                                  radius={[0, 6, 6, 0]}
                                  name="Updates"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="hs-empty-state">
                            <p className="hs-empty-text">
                              No editor data available
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
              <section className="hs-mt-7">
                <InfoBanner
                  title={`${title} Management`}
                  description={`Manage and analyze ${title?.toLowerCase()} performance. Track status distribution, monthly trends, creation/update activity, and top editors. Use the quick actions above to create, edit, or manage ${title?.toLowerCase()} sections. All statistics reflect real-time data from your backend.`}
                  prefix="hs"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSectionStatisticsCommonPage;
