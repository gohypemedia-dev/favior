"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  X,
  User,
  ShoppingBag,
  ArrowRight,
  Filter,
  Check,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

export type DashboardCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  amountSpent: number;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function getInitials(name: string): string {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function CustomersTable({ initialCustomers }: { initialCustomers: DashboardCustomer[] }) {
  const router = useRouter();
  const selectAllRef = useRef<HTMLInputElement>(null);

  const [customers, setCustomers] = useState<DashboardCustomer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "with_orders" | "no_orders">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalError, setModalError] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  // Filtering
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return customers.filter((c) => {
      // Order status filter
      if (filterType === "with_orders" && c.orderCount === 0) return false;
      if (filterType === "no_orders" && c.orderCount > 0) return false;

      // Search filter
      if (!q) return true;
      const matchName = c.name?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      const matchPhone = c.phone?.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone;
    });
  }, [customers, searchQuery, filterType]);

  // Selection
  const allSelected =
    filteredCustomers.length > 0 &&
    filteredCustomers.every((c) => selectedIds.has(c.id));
  const someSelected =
    filteredCustomers.some((c) => selectedIds.has(c.id)) && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCustomers.map((c) => c.id)));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Add Customer Handler
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setModalError("Name and Email are required.");
      return;
    }

    setIsCreating(true);
    setModalError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim().toLowerCase(),
          phone: newPhone.trim() || undefined,
          password: `Favior@${Math.floor(1000 + Math.random() * 9000)}`,
          role: "CUSTOMER",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create customer");
      }

      // Success
      setIsAddModalOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      router.refresh();
    } catch (err: any) {
      setModalError(err.message || "An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Left: Search input & Filter pills */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "280px" }}>
          {/* Search Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "0.45rem 0.75rem",
              width: "100%",
              maxWidth: "340px",
            }}
          >
            <Search style={{ width: "15px", height: "15px", color: "#9ca3af", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "12.5px",
                width: "100%",
                color: "#111827",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af" }}
              >
                <X style={{ width: "14px", height: "14px" }} />
              </button>
            )}
          </div>

          {/* Quick Filter Tabs */}
          <div style={{ display: "inline-flex", alignItems: "center", backgroundColor: "#f3f4f6", borderRadius: "0.5rem", padding: "2px" }}>
            <button
              type="button"
              onClick={() => setFilterType("all")}
              style={{
                border: "none",
                borderRadius: "0.375rem",
                padding: "0.35rem 0.75rem",
                fontSize: "12px",
                fontWeight: filterType === "all" ? 600 : 500,
                backgroundColor: filterType === "all" ? "#ffffff" : "transparent",
                color: filterType === "all" ? "#111827" : "#6b7280",
                boxShadow: filterType === "all" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              All ({customers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("with_orders")}
              style={{
                border: "none",
                borderRadius: "0.375rem",
                padding: "0.35rem 0.75rem",
                fontSize: "12px",
                fontWeight: filterType === "with_orders" ? 600 : 500,
                backgroundColor: filterType === "with_orders" ? "#ffffff" : "transparent",
                color: filterType === "with_orders" ? "#111827" : "#6b7280",
                boxShadow: filterType === "with_orders" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              With Orders ({customers.filter((c) => c.orderCount > 0).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("no_orders")}
              style={{
                border: "none",
                borderRadius: "0.375rem",
                padding: "0.35rem 0.75rem",
                fontSize: "12px",
                fontWeight: filterType === "no_orders" ? 600 : 500,
                backgroundColor: filterType === "no_orders" ? "#ffffff" : "transparent",
                color: filterType === "no_orders" ? "#111827" : "#6b7280",
                boxShadow: filterType === "no_orders" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              No Orders ({customers.filter((c) => c.orderCount === 0).length})
            </button>
          </div>
        </div>

        {/* Right: Selected count or Add customer button */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {selectedIds.size > 0 && (
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#1d4ed8",
                backgroundColor: "#eff6ff",
                padding: "0.35rem 0.75rem",
                borderRadius: "9999px",
                border: "1px solid #bfdbfe",
              }}
            >
              {selectedIds.size} selected
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              height: "2.25rem",
              borderRadius: "0.5rem",
              backgroundColor: "#111827",
              color: "#ffffff",
              padding: "0 0.875rem",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111827")}
          >
            <Plus style={{ width: "14px", height: "14px" }} />
            Add customer
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div style={{ overflowX: "auto", width: "100%", backgroundColor: "#ffffff" }}>
        <table
          style={{
            width: "100%",
            minWidth: "960px",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "13px",
            lineHeight: "1.25rem",
          }}
        >
          {/* Clean, well-spaced Table Header */}
          <thead>
            <tr
              style={{
                backgroundColor: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {/* Checkbox column */}
              <th
                style={{
                  width: "50px",
                  padding: "0.85rem 0.75rem",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all customers"
                    style={{
                      width: "15px",
                      height: "15px",
                      cursor: "pointer",
                      accentColor: "#111827",
                    }}
                  />
                </div>
              </th>

              {/* Customer Name */}
              <th
                style={{
                  minWidth: "200px",
                  padding: "0.85rem 1rem",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                Customer Name
              </th>

              {/* Email */}
              <th
                style={{
                  minWidth: "220px",
                  padding: "0.85rem 1rem",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                Email Address
              </th>

              {/* Phone */}
              <th
                style={{
                  minWidth: "140px",
                  padding: "0.85rem 1rem",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                Phone
              </th>

              {/* Orders */}
              <th
                style={{
                  minWidth: "110px",
                  padding: "0.85rem 1rem",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Orders
              </th>

              {/* Amount Spent - Distinct, generous right-aligned column */}
              <th
                style={{
                  minWidth: "140px",
                  padding: "0.85rem 1.25rem",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                  textAlign: "right",
                }}
              >
                Amount Spent
              </th>

              {/* Joined - Clean left-aligned column with separate padding */}
              <th
                style={{
                  minWidth: "140px",
                  padding: "0.85rem 1.25rem",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                  textAlign: "left",
                }}
              >
                Joined Date
              </th>

              {/* Actions */}
              <th
                style={{
                  width: "70px",
                  padding: "0.85rem 0.75rem",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "3.5rem 1rem",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                    <User style={{ width: "32px", height: "32px", margin: "0 auto 0.75rem auto", color: "#d1d5db" }} />
                    <p style={{ fontWeight: 600, color: "#111827", margin: "0 0 0.25rem 0" }}>No customers found</p>
                    <p style={{ fontSize: "12px", margin: 0 }}>
                      {searchQuery ? "Try refining your search term." : "New customers will appear here."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => {
                const isSelected = selectedIds.has(customer.id);
                const initials = getInitials(customer.name);

                return (
                  <tr
                    key={customer.id}
                    onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#f0f7ff" : "#ffffff",
                      borderBottom: "1px solid #f3f4f6",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    {/* Checkbox */}
                    <td
                      style={{
                        padding: "0.9rem 0.75rem",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleSelectRow(customer.id, e as any)}
                          aria-label={`Select ${customer.name}`}
                          style={{
                            width: "15px",
                            height: "15px",
                            cursor: "pointer",
                            accentColor: "#111827",
                          }}
                        />
                      </div>
                    </td>

                    {/* Customer Name with Avatar */}
                    <td style={{ padding: "0.9rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "9999px",
                            backgroundColor: "#111827",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "13px" }}>
                            {customer.name}
                          </p>
                          <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                            ID: #{customer.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: "0.9rem 1rem", color: "#374151" }}>
                      <span style={{ wordBreak: "break-all" }}>{customer.email}</span>
                    </td>

                    {/* Phone */}
                    <td style={{ padding: "0.9rem 1rem", color: customer.phone ? "#374151" : "#9ca3af" }}>
                      {customer.phone || "—"}
                    </td>

                    {/* Orders Count with Badge */}
                    <td style={{ padding: "0.9rem 1rem", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          backgroundColor: customer.orderCount > 0 ? "#ecfdf5" : "#f3f4f6",
                          color: customer.orderCount > 0 ? "#047857" : "#6b7280",
                          border: customer.orderCount > 0 ? "1px solid #a7f3d0" : "1px solid #e5e7eb",
                        }}
                      >
                        {customer.orderCount} {customer.orderCount === 1 ? "order" : "orders"}
                      </span>
                    </td>

                    {/* Amount Spent */}
                    <td
                      style={{
                        padding: "0.9rem 1.25rem",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#111827",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {currencyFormatter.format(customer.amountSpent)}
                    </td>

                    {/* Joined Date */}
                    <td style={{ padding: "0.9rem 1.25rem", textAlign: "left", color: "#4b5563" }}>
                      {dateFormatter.format(new Date(customer.createdAt))}
                    </td>

                    {/* Actions */}
                    <td
                      style={{
                        padding: "0.9rem 0.75rem",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/customers/${customer.id}`);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.35rem 0.5rem",
                          borderRadius: "0.375rem",
                          color: "#6b7280",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "color 0.15s, background-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#111827";
                          e.currentTarget.style.backgroundColor = "#f3f4f6";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#6b7280";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title="View Customer Profile"
                      >
                        <ArrowRight style={{ width: "15px", height: "15px" }} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.25rem",
          backgroundColor: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        <span>
          Showing <strong>{filteredCustomers.length}</strong> of <strong>{customers.length}</strong> customers
        </span>
        {filteredCustomers.length > 0 && (
          <span style={{ fontWeight: 500 }}>
            Total spent across displayed:{" "}
            <strong style={{ color: "#111827" }}>
              {currencyFormatter.format(
                filteredCustomers.reduce((sum, c) => sum + c.amountSpent, 0)
              )}
            </strong>
          </span>
        )}
      </div>

      {/* Add Customer Modal Dialog */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0.75rem",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User style={{ width: "18px", height: "18px", color: "#111827" }} />
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                  Add New Customer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px" }}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCustomer} style={{ padding: "1.25rem" }}>
              {modalError && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#991b1b",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "12px",
                    marginBottom: "1rem",
                  }}
                >
                  {modalError}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #d1d5db",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #d1d5db",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #d1d5db",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "0.375rem",
                    border: "none",
                    backgroundColor: "#111827",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#ffffff",
                    cursor: isCreating ? "wait" : "pointer",
                  }}
                >
                  {isCreating ? "Creating..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
