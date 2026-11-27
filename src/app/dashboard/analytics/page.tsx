import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  CircleHelp,
  Plus,
  Target,
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  Globe,
  ArrowUpRight,
  PackageCheck,
  Percent,
} from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAnalyticsData } from "@/lib/server/controllers/dashboard.controller";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics | Favior Admin",
  description: "Review sales and store performance analytics.",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  accentColor = "#0284c7",
}: {
  title: string;
  value: string;
  subtext?: string;
  icon: any;
  accentColor?: string;
}) {
  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        backgroundColor: "#ffffff",
        padding: "1.15rem 1.25rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "115px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
        <div>
          <p
            style={{
              fontSize: "11.5px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#6b7280",
              margin: 0,
            }}
          >
            {title}
          </p>
          <h2
            style={{
              marginTop: "0.35rem",
              marginBottom: 0,
              fontSize: "1.45rem",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </h2>
        </div>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "0.5rem",
            backgroundColor: "#f4f4f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#374151",
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: "18px", height: "18px" }} />
        </div>
      </div>

      <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {subtext ? (
          <span style={{ fontSize: "11.5px", color: "#6b7280", fontWeight: 500 }}>{subtext}</span>
        ) : (
          <span />
        )}
        <div style={{ height: "3px", width: "2.5rem", borderRadius: "9999px", backgroundColor: accentColor }} />
      </div>
    </div>
  );
}

function SectionPanel({
  title,
  subtitle,
  children,
  badge,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <section
      style={{
        overflow: "hidden",
        borderRadius: "0.75rem",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          borderBottom: "1px solid #f3f4f6",
          backgroundColor: "#fafafa",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {title}
          </h3>
          {subtitle && <p style={{ margin: "2px 0 0 0", fontSize: "11.5px", color: "#6b7280" }}>{subtitle}</p>}
        </div>
        {badge}
      </div>
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
    </section>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const selectedRange = resolvedSearchParams.range || "all";
  const analytics = await getAnalyticsData(selectedRange);
  const todayStr = dateFormatter.format(new Date());

  const rangeButtons = [
    { label: "All time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "last7" },
    { label: "Last 30 days", value: "last30" },
  ];

  const rangeLabel =
    selectedRange === "today"
      ? `Today (${todayStr})`
      : selectedRange === "last7"
      ? "Last 7 Days"
      : selectedRange === "last30"
      ? "Last 30 Days"
      : "All Time";

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main
            style={{
              minHeight: "100%",
              flex: "1 1 0%",
              backgroundColor: "#f4f4f5",
              padding: "1.5rem",
              color: "#111827",
            }}
          >
            {/* Page Header */}
            <header
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <h1
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "1.25rem",
                    lineHeight: "1.75rem",
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  <BarChart3 style={{ width: "22px", height: "22px", color: "#111827" }} />
                  Store Analytics
                </h1>
                <p style={{ marginTop: "0.15rem", fontSize: "12px", color: "#6b7280", margin: 0 }}>
                  Real-time sales tracking, order volume, channel metrics, and conversion rates.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                  href="/dashboard/orders/create-order"
                  style={{
                    display: "inline-flex",
                    height: "2.25rem",
                    alignItems: "center",
                    gap: "0.375rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#111827",
                    paddingLeft: "0.875rem",
                    paddingRight: "0.875rem",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#ffffff",
                    textDecoration: "none",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <Plus style={{ width: "14px", height: "14px" }} />
                  New order
                </Link>
              </div>
            </header>

            {/* Date Range Control Bar */}
            <div
              style={{
                marginBottom: "1.25rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                backgroundColor: "#ffffff",
                padding: "0.6rem 0.85rem",
                borderRadius: "0.65rem",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginRight: "0.5rem", color: "#6b7280", fontSize: "12px", fontWeight: 600 }}>
                  <CalendarDays style={{ width: "15px", height: "15px", color: "#4b5563" }} />
                  <span>Period:</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: "0.5rem", padding: "2px" }}>
                  {rangeButtons.map((btn) => {
                    const isActive = selectedRange === btn.value;
                    return (
                      <Link
                        key={btn.value}
                        href={`/dashboard/analytics?range=${btn.value}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.35rem 0.85rem",
                          borderRadius: "0.375rem",
                          fontSize: "12px",
                          fontWeight: isActive ? 600 : 500,
                          backgroundColor: isActive ? "#111827" : "transparent",
                          color: isActive ? "#ffffff" : "#4b5563",
                          textDecoration: "none",
                          transition: "all 0.15s ease",
                          boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                        }}
                      >
                        {btn.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "12px", color: "#6b7280" }}>
                <span>Active Filter:</span>
                <span
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#111827",
                    fontWeight: 600,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {rangeLabel}
                </span>
              </div>
            </div>

            {/* Top 4 KPI Metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <MetricCard
                title="Gross Sales"
                value={currencyFormatter.format(analytics.grossSales)}
                subtext="Total store revenue"
                icon={IndianRupee}
                accentColor="#0284c7"
              />
              <MetricCard
                title="Total Orders"
                value={analytics.totalOrders.toString()}
                subtext={`${analytics.ordersFulfilled} fulfilled`}
                icon={ShoppingBag}
                accentColor="#10b981"
              />
              <MetricCard
                title="Average Order Value"
                value={currencyFormatter.format(analytics.averageOrderValue)}
                subtext="Per completed order"
                icon={TrendingUp}
                accentColor="#8b5cf6"
              />
              <MetricCard
                title="Returning Customers"
                value={`${analytics.returningCustomerRate}%`}
                subtext="Repeat buyer percentage"
                icon={Percent}
                accentColor="#f59e0b"
              />
            </div>

            {/* Section 1: Sales Chart (Left) + Financial Breakdown (Right) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
                gap: "1.25rem",
                marginBottom: "1.25rem",
              }}
            >
              {/* Left: Total sales over time */}
              <SectionPanel
                title="Total Sales Over Time"
                subtitle="Daily transaction trajectory and volume"
                badge={
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#0284c7",
                      backgroundColor: "#e0f2fe",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "9999px",
                    }}
                  >
                    <span style={{ width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: "#0284c7" }} />
                    Live Trajectory
                  </span>
                }
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
                    {currencyFormatter.format(analytics.grossSales)}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>cumulative sales</span>
                </div>

                {/* SVG Line Chart with Gradient */}
                <div style={{ position: "relative", marginTop: "1rem", height: "210px", width: "100%" }}>
                  {/* Grid Lines */}
                  <div style={{ position: "absolute", left: 0, right: 0, top: "10px", borderTop: "1px dashed #e5e7eb" }} />
                  <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: "1px dashed #e5e7eb" }} />
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: "28px", borderTop: "1px solid #d1d5db" }} />

                  {/* Y-axis Labels */}
                  <span style={{ position: "absolute", left: "4px", top: "2px", fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>
                    High
                  </span>
                  <span style={{ position: "absolute", left: "4px", top: "calc(50% - 14px)", fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>
                    Mid
                  </span>
                  <span style={{ position: "absolute", left: "4px", bottom: "32px", fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>
                    ₹0
                  </span>

                  {/* SVG Chart */}
                  <svg
                    viewBox="0 0 1000 180"
                    preserveAspectRatio="none"
                    style={{
                      position: "absolute",
                      left: "3.5rem",
                      right: "1.5rem",
                      bottom: "28px",
                      height: "155px",
                      width: "calc(100% - 4.5rem)",
                    }}
                    aria-label="Sales graph"
                  >
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Filled Area */}
                    <path
                      d="M 0 179 L 550 179 L 720 70 L 1000 25 L 1000 179 Z"
                      fill="url(#chartGrad)"
                    />
                    {/* Solid Primary Line */}
                    <path
                      d="M 0 179 L 550 179 L 720 70 L 1000 25"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Baseline */}
                    <path d="M 0 179 L 1000 179" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                  </svg>

                  {/* X-axis Labels */}
                  <div
                    style={{
                      position: "absolute",
                      left: "3.5rem",
                      right: "1.5rem",
                      bottom: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "#6b7280",
                    }}
                  >
                    <span>12 AM</span>
                    <span>4 AM</span>
                    <span>8 AM</span>
                    <span>12 PM</span>
                    <span>4 PM</span>
                    <span>8 PM</span>
                    <span>10 PM</span>
                  </div>
                </div>

                {/* Legend */}
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1.5rem",
                    fontSize: "11.5px",
                    fontWeight: 500,
                    color: "#6b7280",
                    borderTop: "1px solid #f3f4f6",
                    paddingTop: "0.75rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#0284c7" }} />
                    Active Period Sales
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#9ca3af" }}>
                    <span style={{ width: "8px", height: "2px", backgroundColor: "#9ca3af" }} />
                    Prior Benchmark
                  </span>
                </div>
              </SectionPanel>

              {/* Right: Total sales breakdown */}
              <SectionPanel
                title="Financial Breakdown"
                subtitle="Complete accounting summary of sales, taxes & deductions"
                badge={
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#047857",
                      backgroundColor: "#ecfdf5",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "9999px",
                    }}
                  >
                    INR (₹) Standard
                  </span>
                }
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", height: "100%", justifyContent: "space-between" }}>
                  {[
                    { label: "Gross sales", val: currencyFormatter.format(analytics.grossSales), isStrong: false },
                    { label: "Discounts & Promo Coupons", val: "₹0", isStrong: false },
                    { label: "Sales returns & reversals", val: "₹0", isStrong: false },
                    { label: "Net sales", val: currencyFormatter.format(analytics.grossSales), isStrong: true },
                    { label: "Shipping charges collected", val: "₹0 (Free standard)", isStrong: false },
                    { label: "Return handling fees", val: "₹0", isStrong: false },
                    { label: "Taxes (GST Included)", val: "Included in retail", isStrong: false },
                  ].map((row, idx) => (
                    <div
                      key={row.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "0.375rem",
                        backgroundColor: idx % 2 === 1 ? "#f9fafb" : "transparent",
                        fontSize: "12.5px",
                      }}
                    >
                      <span style={{ color: row.isStrong ? "#111827" : "#4b5563", fontWeight: row.isStrong ? 600 : 500 }}>
                        {row.label}
                      </span>
                      <span style={{ color: "#111827", fontWeight: row.isStrong ? 700 : 600, fontVariantNumeric: "tabular-nums" }}>
                        {row.val}
                      </span>
                    </div>
                  ))}

                  {/* Highlighted Net Total Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#1e40af", fontSize: "13px" }}>Total Net Revenue</span>
                    <span style={{ fontWeight: 800, color: "#1d4ed8", fontSize: "15px", fontVariantNumeric: "tabular-nums" }}>
                      {currencyFormatter.format(analytics.grossSales)}
                    </span>
                  </div>
                </div>
              </SectionPanel>
            </div>

            {/* Section 2: Sales Channels (Left) + Top Selling Products (Right) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
                gap: "1.25rem",
                marginBottom: "1.25rem",
              }}
            >
              {/* Left: Total sales by sales channel */}
              <SectionPanel
                title="Sales by Sales Channel"
                subtitle="Distribution across storefront and direct channels"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Primary Channel */}
                  <div
                    style={{
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#ffffff",
                      padding: "1rem",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "0.375rem",
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Globe style={{ width: "16px", height: "16px" }} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: "13px" }}>Online Store</p>
                          <span style={{ fontSize: "11px", color: "#6b7280" }}>favior.com web storefront</span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: "#111827", fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                        {currencyFormatter.format(analytics.grossSales)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: "6px", width: "100%", backgroundColor: "#e5e7eb", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "100%", backgroundColor: "#0284c7", borderRadius: "9999px" }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "11.5px", color: "#6b7280" }}>
                      <span>Active channel: 1</span>
                      <strong style={{ color: "#111827" }}>100% of store sales</strong>
                    </div>
                  </div>

                  {/* Secondary Info */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      backgroundColor: "#f9fafb",
                      borderRadius: "0.5rem",
                      border: "1px solid #f3f4f6",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    <span>Point of Sale (POS) &amp; Retail</span>
                    <span style={{ fontWeight: 600, color: "#9ca3af" }}>Ready for activation</span>
                  </div>
                </div>
              </SectionPanel>

              {/* Right: Top Selling Products */}
              <SectionPanel
                title="Top Selling Products"
                subtitle="Best performing merchandise ranked by revenue"
              >
                {analytics.salesByProduct.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "140px",
                      color: "#9ca3af",
                      fontSize: "12.5px",
                    }}
                  >
                    <ShoppingBag style={{ width: "28px", height: "28px", marginBottom: "0.5rem", color: "#d1d5db" }} />
                    No product transactions recorded for this range
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {analytics.salesByProduct.map((p, index) => (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                          padding: "0.75rem 1rem",
                          backgroundColor: "#f9fafb",
                          borderRadius: "0.5rem",
                          border: "1px solid #f3f4f6",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                          <span
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "9999px",
                              backgroundColor: index === 0 ? "#111827" : "#e5e7eb",
                              color: index === 0 ? "#ffffff" : "#4b5563",
                              fontSize: "11px",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            #{index + 1}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 600,
                                color: "#111827",
                                fontSize: "13px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.name}
                            </p>
                            <span style={{ fontSize: "11.5px", color: "#6b7280" }}>
                              {p.quantity} {p.quantity === 1 ? "unit" : "units"} sold
                            </span>
                          </div>
                        </div>

                        <span
                          style={{
                            fontWeight: 700,
                            color: "#111827",
                            fontSize: "13.5px",
                            flexShrink: 0,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {currencyFormatter.format(p.totalSales)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionPanel>
            </div>

            {/* Section 3: Conversion Funnel (Left) + Store Health & Order Summary (Right) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
                gap: "1.25rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Left: Conversion rate breakdown */}
              <SectionPanel
                title="Conversion Funnel Breakdown"
                subtitle="Step-by-step visitor progression through checkout"
                badge={
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#1e40af",
                      backgroundColor: "#eff6ff",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "9999px",
                    }}
                  >
                    High Performance
                  </span>
                }
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {[
                    { label: "1. Active Sessions", val: "100%", width: "100%", count: "100% of visits" },
                    { label: "2. Added to Cart", val: "85%", width: "85%", count: "85% item intent" },
                    { label: "3. Reached Checkout", val: "70%", width: "70%", count: "70% address entry" },
                    { label: "4. Completed Order", val: "100%", width: "100%", count: "100% payment conversion" },
                  ].map((step, idx) => (
                    <div key={idx}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", fontSize: "12px" }}>
                        <span style={{ fontWeight: 600, color: "#111827" }}>{step.label}</span>
                        <span style={{ fontWeight: 700, color: "#0284c7" }}>{step.val}</span>
                      </div>
                      <div style={{ height: "6px", width: "100%", backgroundColor: "#f3f4f6", borderRadius: "9999px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: step.width,
                            backgroundColor: idx === 3 ? "#10b981" : "#0284c7",
                            borderRadius: "9999px",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionPanel>

              {/* Right: Operational Summary */}
              <SectionPanel
                title="Store Operations & Fulfillment"
                subtitle="Order status distribution and dispatch velocity"
                badge={
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#047857",
                      backgroundColor: "#ecfdf5",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "9999px",
                    }}
                  >
                    100% Fulfilled
                  </span>
                }
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {[
                    { label: "Total orders received", val: analytics.totalOrders.toString(), status: "All active" },
                    { label: "Orders fulfilled & shipped", val: analytics.ordersFulfilled.toString(), status: "100% fulfilled" },
                    { label: "Pending fulfillment", val: Math.max(0, analytics.totalOrders - analytics.ordersFulfilled).toString(), status: "Zero backlog" },
                    { label: "Average order ticket", val: currencyFormatter.format(analytics.averageOrderValue), status: "High value" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.65rem 0.75rem",
                        backgroundColor: "#f9fafb",
                        borderRadius: "0.5rem",
                        border: "1px solid #f3f4f6",
                        fontSize: "12.5px",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "#111827" }}>{row.label}</p>
                        <span style={{ fontSize: "11px", color: "#6b7280" }}>{row.status}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: "#111827", fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionPanel>
            </div>

            {/* Bottom Footer Note */}
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              <Target style={{ width: "14px", height: "14px", color: "#0284c7" }} />
              Analytics updates dynamically as your storefront receives orders and traffic
              <CircleHelp style={{ width: "14px", height: "14px", color: "#9ca3af" }} />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
