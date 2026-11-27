"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Users,
  ShoppingBag,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Tag,
  ExternalLink,
  Package,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";

export type DashboardData = {
  rangeLabel?: string;
  rangeKey?: string;
  totalSales: number;
  periodSales: number;
  orderCount: number;
  periodOrderCount: number;
  productCount: number;
  customerCount: number;
  itemsOrdered: number;
  fulfilledOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  currentPeriodLabel: string;
  previousPeriodLabel: string;
  chartData: { date: string; current: number; previous: number }[];
  recentOrders: { id: string; status: string; total: number; customerName: string; itemCount: number }[];
  topProducts: { name: string; quantity: number }[];
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatOrderReference(id: string) {
  return `#${id.slice(-8).toUpperCase()}`;
}

function formatOrderStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function getStatusStyle(status: string) {
  const s = status.toUpperCase();
  if (s === "DELIVERED") return { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" };
  if (s === "SHIPPED") return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
  if (s === "PROCESSING" || s === "CONFIRMED") return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
  if (s === "CANCELLED") return { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };
  return { bg: "#f3f4f6", color: "#4b5563", border: "#e5e7eb" };
}

export function AdminOverview({ data }: { data: DashboardData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [currentData, setCurrentData] = useState<DashboardData>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("Total sales");

  const [customNum, setCustomNum] = useState("30");
  const [customUnit, setCustomUnit] = useState("Days");

  const rangeLabel = currentData.rangeLabel || "Last 30 days";

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  // Click outside to close date picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    if (isDatePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerOpen]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const metrics = [
    { label: "Sessions", value: "—", change: "No data" },
    { label: "Total sales", value: currencyFormatter.format(currentData.periodSales), change: rangeLabel },
    { label: "Orders", value: currentData.periodOrderCount.toLocaleString("en-IN"), change: rangeLabel },
    { label: "Conversion rate", value: "—", change: "No data" },
  ];

  const chartMaximum = Math.max(10, ...currentData.chartData.flatMap((point) => [point.current, point.previous]));

  async function applyRangeKey(rangeKey: string) {
    setIsLoading(true);
    setIsDatePickerOpen(false);

    router.push(`/dashboard?range=${rangeKey}`, { scroll: false });

    try {
      const res = await fetch(`/api/admin/dashboard-overview?range=${rangeKey}`);
      if (res.ok) {
        const updated = await res.json();
        setCurrentData(updated);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard overview data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOptionClick(option: string) {
    let key = "last30";
    if (option === "Today") key = "today";
    else if (option === "Yesterday") key = "yesterday";
    else if (option === "Last 7 days") key = "last7";
    else if (option === "Last 30 days") key = "last30";
    else if (option === "Quarter to date") key = "quarter";
    else if (option === "Custom range") return;

    applyRangeKey(key);
  }

  function handleApplyCustom() {
    const count = parseInt(customNum, 10) || 30;
    let totalDays = count;
    if (customUnit === "Weeks") totalDays = count * 7;
    if (customUnit === "Months") totalDays = count * 30;

    applyRangeKey(`days_${totalDays}`);
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        backgroundColor: "#f4f4f5",
        padding: "1.5rem",
        minHeight: "100%",
        color: "#111827",
        opacity: isLoading ? 0.7 : 1,
        transition: "opacity 0.15s ease",
      }}
    >
      {/* Top Welcome & Date Range Header */}
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {greeting}, Admin
          </h1>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "0.2rem 0 0 0" }}>
            Here is what is happening with your Favior storefront today.
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div style={{ position: "relative" }} ref={datePickerRef}>
          <button
            type="button"
            aria-expanded={isDatePickerOpen}
            onClick={() => setIsDatePickerOpen((open) => !open)}
            style={{
              display: "inline-flex",
              height: "2.25rem",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              backgroundColor: "#ffffff",
              paddingLeft: "0.85rem",
              paddingRight: "0.85rem",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
              cursor: "pointer",
            }}
          >
            {isLoading ? (
              <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} />
            ) : (
              <CalendarDays style={{ width: "14px", height: "14px", color: "#4b5563" }} />
            )}
            <span>{rangeLabel}</span>
            <ChevronDown style={{ width: "14px", height: "14px", color: "#9ca3af" }} />
          </button>

          {/* Date Picker Popover Menu */}
          {isDatePickerOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "2.75rem",
                zIndex: 50,
                width: "240px",
                backgroundColor: "#ffffff",
                borderRadius: "0.65rem",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                padding: "0.4rem",
              }}
            >
              <div style={{ padding: "0.4rem 0.6rem", borderBottom: "1px solid #f3f4f6", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>
                Select Timeframe
              </div>
              {["Today", "Yesterday", "Last 7 days", "Last 30 days", "Quarter to date"].map((option) => {
                const isSelected = option === rangeLabel;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    style={{
                      width: "100%",
                      borderRadius: "0.375rem",
                      padding: "0.5rem 0.75rem",
                      textAlign: "left",
                      fontSize: "12.5px",
                      fontWeight: isSelected ? 600 : 500,
                      backgroundColor: isSelected ? "#f3f4f6" : "transparent",
                      color: isSelected ? "#111827" : "#4b5563",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span>{option}</span>
                    {isSelected && <span style={{ color: "#0284c7", fontSize: "12px" }}>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Performance Chart Card */}
      <section
        style={{
          position: "relative",
          borderRadius: "0.75rem",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
          padding: "1.25rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        }}
      >
        <button
          type="button"
          aria-label={isExpanded ? "Collapse overview" : "Expand overview"}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          style={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
            zIndex: 10,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "0.375rem",
            border: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            color: "#4b5563",
            cursor: "pointer",
          }}
        >
          {isExpanded ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
        </button>

        {/* 4 Interactive Metric Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.75rem",
            paddingRight: "2.5rem",
          }}
        >
          {metrics.map((metric) => {
            const isSelected = selectedMetric === metric.label;
            return (
              <button
                type="button"
                key={metric.label}
                aria-pressed={isSelected}
                onClick={() => setSelectedMetric(metric.label)}
                style={{
                  position: "relative",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  border: isSelected ? "1.5px solid #111827" : "1px solid #e5e7eb",
                  backgroundColor: isSelected ? "#fafafa" : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ margin: 0, fontSize: "11.5px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>
                    {metric.label}
                  </p>
                  {isSelected && (
                    <span style={{ width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: "#111827" }} />
                  )}
                </div>
                <p
                  style={{
                    margin: "0.35rem 0 0 0",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#111827",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {metric.value}
                </p>
                <span style={{ fontSize: "11px", color: "#9ca3af" }}>{metric.change}</span>
              </button>
            );
          })}
        </div>

        {/* Expanded Line Chart */}
        {isExpanded && (
          <div style={{ marginTop: "1.25rem", height: "230px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.chartData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  domain={[0, chartMaximum]}
                  tickCount={3}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  width={55}
                  tickFormatter={(value: number) => {
                    if (value === 0) return "₹0";
                    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
                    return `₹${value}`;
                  }}
                />
                <Tooltip
                  cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
                  formatter={(val: unknown) => [currencyFormatter.format(Number(val || 0)), "Sales"]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#0284c7"
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 4, stroke: "#0284c7", strokeWidth: 2, fill: "#ffffff" }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Chart Legend with visible dots */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.5rem",
                marginTop: "0.75rem",
                paddingTop: "0.6rem",
                borderTop: "1px solid #f3f4f6",
                fontSize: "11.5px",
                color: "#6b7280",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "#0284c7" }} />
                Current: {currentData.currentPeriodLabel}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ width: "12px", height: "2px", backgroundColor: "#94a3b8", borderStyle: "dashed" }} />
                Prior: {currentData.previousPeriodLabel}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Operational Highlights Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "0.75rem 1rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "0.375rem",
              backgroundColor: currentData.pendingOrders > 0 ? "#fef3c7" : "#ecfdf5",
              color: currentData.pendingOrders > 0 ? "#92400e" : "#047857",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Package style={{ width: "16px", height: "16px" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 600, color: "#111827" }}>
              {currentData.pendingOrders} {currentData.pendingOrders === 1 ? "Order" : "Orders"} to fulfil
            </p>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              {currentData.fulfilledOrders} orders already shipped
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "0.75rem 1rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "0.375rem",
              backgroundColor: "#ecfdf5",
              color: "#047857",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CheckCircle2 style={{ width: "16px", height: "16px" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 600, color: "#111827" }}>
              Payment Gateways Active
            </p>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              UPI, Credit/Debit Cards, NetBanking &amp; COD
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "0.75rem 1rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "0.375rem",
              backgroundColor: currentData.lowStockCount > 0 ? "#fef3c7" : "#eff6ff",
              color: currentData.lowStockCount > 0 ? "#b45309" : "#1d4ed8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle style={{ width: "16px", height: "16px" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 600, color: "#111827" }}>
              Inventory Health
            </p>
            <span style={{ fontSize: "11px", color: "#6b7280" }}>
              {currentData.lowStockCount} low stock • {currentData.outOfStockCount} out of stock
            </span>
          </div>
        </div>
      </div>

      {/* Balanced 2-Column Dashboard Grid (Left 65% Main Activity, Right 35% Quick Tools) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {/* LEFT COLUMN: Recent Orders & Top Products */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", minWidth: 0, flex: "2 1 0%" }}>
          {/* Recent Orders Panel */}
          <section
            style={{
              borderRadius: "0.75rem",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShoppingBag style={{ width: "16px", height: "16px", color: "#111827" }} />
                <h2 style={{ fontSize: "13px", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", color: "#111827" }}>
                  Recent Orders
                </h2>
              </div>
              <Link
                href="/dashboard/orders"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0284c7",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                View all orders <ArrowUpRight style={{ width: "13px", height: "13px" }} />
              </Link>
            </div>

            {currentData.recentOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#6b7280", fontSize: "13px" }}>
                <Clock style={{ width: "28px", height: "28px", margin: "0 auto 0.5rem auto", color: "#d1d5db" }} />
                <p style={{ margin: "0 0 0.25rem 0", fontWeight: 600, color: "#111827" }}>No orders placed yet</p>
                <p style={{ margin: 0, fontSize: "12px" }}>Customer purchases will appear here in real time.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {currentData.recentOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <Link
                      key={order.id}
                      href={`/dashboard/orders/${order.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        backgroundColor: "#fafafa",
                        borderRadius: "0.5rem",
                        border: "1px solid #f3f4f6",
                        textDecoration: "none",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "9999px",
                            backgroundColor: "#111827",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {order.customerName ? order.customerName.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#111827" }}>
                            {formatOrderReference(order.id)}
                          </p>
                          <span style={{ fontSize: "11px", color: "#6b7280" }}>
                            {order.customerName} • {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "0.2rem 0.55rem",
                            borderRadius: "9999px",
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                          }}
                        >
                          {formatOrderStatus(order.status)}
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827", fontVariantNumeric: "tabular-nums" }}>
                          {currencyFormatter.format(order.total)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Top Selling Products Panel */}
          <section
            style={{
              borderRadius: "0.75rem",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Layers style={{ width: "16px", height: "16px", color: "#111827" }} />
                <h2 style={{ fontSize: "13px", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", color: "#111827" }}>
                  Top Selling Products
                </h2>
              </div>
              <Link
                href="/dashboard/products"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0284c7",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                View all inventory <ArrowUpRight style={{ width: "13px", height: "13px" }} />
              </Link>
            </div>

            {currentData.topProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#6b7280", fontSize: "12.5px" }}>
                Top performing products will automatically appear here once customer orders are placed.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {currentData.topProducts.map((product, idx) => (
                  <div
                    key={product.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      backgroundColor: "#fafafa",
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
                          backgroundColor: idx === 0 ? "#111827" : "#e5e7eb",
                          color: idx === 0 ? "#ffffff" : "#4b5563",
                          fontSize: "11px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#111827",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={product.name}
                      >
                        {product.name}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 600,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "9999px",
                        backgroundColor: "#ecfdf5",
                        color: "#065f46",
                        flexShrink: 0,
                      }}
                    >
                      {product.quantity} sold
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Quick Actions, Inventory, Customer Snapshot, Store Health */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", minWidth: 0, flex: "1 1 0%" }}>
          {/* Quick Actions (Replaced giant 100% black bars with clean grid cards!) */}
          <section
            style={{
              borderRadius: "0.75rem",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <h2 style={{ fontSize: "13px", fontWeight: 700, margin: "0 0 0.85rem 0", textTransform: "uppercase", letterSpacing: "0.04em", color: "#111827" }}>
              Quick Actions
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <Link
                href="/dashboard/products/new"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.35rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111827")}
              >
                <Plus style={{ width: "16px", height: "16px" }} />
                <span>Add Product</span>
              </Link>

              <Link
                href="/dashboard/customers"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.35rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  color: "#111827",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <Users style={{ width: "16px", height: "16px", color: "#4b5563" }} />
                <span>Customers</span>
              </Link>

              <Link
                href="/dashboard/banners"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.35rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  color: "#111827",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <Layers style={{ width: "16px", height: "16px", color: "#4b5563" }} />
                <span>Banners</span>
              </Link>

              <Link
                href="/dashboard/discounts"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.35rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  color: "#111827",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <Tag style={{ width: "16px", height: "16px", color: "#4b5563" }} />
                <span>Discounts</span>
              </Link>
            </div>
          </section>

          {/* Inventory Alerts Card */}
          <section
            style={{
              borderRadius: "0.75rem",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", color: "#111827" }}>
                Inventory Alerts
              </h2>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>{currentData.productCount} SKUs</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.65rem", backgroundColor: "#fafafa", borderRadius: "0.375rem" }}>
                <span style={{ fontSize: "12px", color: "#4b5563" }}>Low stock items</span>
                <span
                  style={{
                    borderRadius: "9999px",
                    backgroundColor: currentData.lowStockCount > 0 ? "#fef3c7" : "#f3f4f6",
                    color: currentData.lowStockCount > 0 ? "#92400e" : "#6b7280",
                    padding: "0.15rem 0.55rem",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {currentData.lowStockCount} items
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.65rem", backgroundColor: "#fafafa", borderRadius: "0.375rem" }}>
                <span style={{ fontSize: "12px", color: "#4b5563" }}>Out of stock</span>
                <span
                  style={{
                    borderRadius: "9999px",
                    backgroundColor: currentData.outOfStockCount > 0 ? "#fee2e2" : "#f3f4f6",
                    color: currentData.outOfStockCount > 0 ? "#991b1b" : "#6b7280",
                    padding: "0.15rem 0.55rem",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {currentData.outOfStockCount} items
                </span>
              </div>

              <Link
                href="/dashboard/products"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0284c7",
                  textDecoration: "none",
                  marginTop: "0.25rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                Review inventory in catalog →
              </Link>
            </div>
          </section>

          {/* Customer Snapshot Card */}
          <section
            style={{
              borderRadius: "0.75rem",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", color: "#111827" }}>
                Customer Base
              </h2>
              <Users style={{ width: "16px", height: "16px", color: "#6b7280" }} />
            </div>

            <p style={{ margin: "0.25rem 0 0 0", fontSize: "1.6rem", fontWeight: 800, color: "#111827" }}>
              {currentData.customerCount.toLocaleString("en-IN")}
            </p>
            <p style={{ margin: "0.15rem 0 0.75rem 0", fontSize: "11.5px", color: "#6b7280" }}>
              Registered customer accounts
            </p>

            <Link
              href="/dashboard/customers"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#0284c7",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              Manage all customers →
            </Link>
          </section>

          {/* Store Health & Services Card */}
          <section
            style={{
              borderRadius: "0.75rem",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck style={{ width: "16px", height: "16px", color: "#047857" }} />
                <h2 style={{ fontSize: "13px", fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", color: "#111827" }}>
                  Store Health
                </h2>
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#047857",
                  backgroundColor: "#ecfdf5",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: "#10b981" }} />
                100% Online
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "12px", color: "#4b5563" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Web Storefront</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>Active (favior.com)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Database Connectivity</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>PostgreSQL Neon OK</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Checkout &amp; Cart API</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>Operational</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
