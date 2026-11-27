import type { Metadata } from "next";
import { UserRound, Users, ShoppingBag, IndianRupee, TrendingUp } from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { CustomersTable, DashboardCustomer } from "@/components/admin/customers/customers-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCustomersForDashboard } from "@/lib/server/controllers/dashboard.controller";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customers | Favior Admin",
  description: "Review customer profiles, orders, and spending in Favior.",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default async function CustomersPage() {
  const customers = (await getCustomersForDashboard()) as DashboardCustomer[];

  const totalCustomers = customers.length;
  const customersWithOrders = customers.filter((c) => c.orderCount > 0).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.amountSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.orderCount, 0);

  const stats = [
    {
      label: "Total Customers",
      value: totalCustomers.toLocaleString("en-IN"),
      sub: "Registered accounts",
      icon: Users,
    },
    {
      label: "Active Buyers",
      value: customersWithOrders.toLocaleString("en-IN"),
      sub: `${totalCustomers > 0 ? Math.round((customersWithOrders / totalCustomers) * 100) : 0}% conversion`,
      icon: TrendingUp,
    },
    {
      label: "Total Revenue",
      value: currencyFormatter.format(totalRevenue),
      sub: "Customer lifetime sales",
      icon: IndianRupee,
    },
    {
      label: "Orders Placed",
      value: totalOrders.toLocaleString("en-IN"),
      sub: "Total completed orders",
      icon: ShoppingBag,
    },
  ];

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
            {/* Top Page Title */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "0.5rem",
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#111827",
                  }}
                >
                  <UserRound style={{ width: "18px", height: "18px" }} />
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#111827",
                      margin: 0,
                      lineHeight: "1.3",
                    }}
                  >
                    Customers
                  </h1>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      margin: "0.15rem 0 0 0",
                    }}
                  >
                    Manage registered customer profiles, contact info, and lifetime purchase history.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      padding: "1rem 1.25rem",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "#6b7280",
                          margin: 0,
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {stat.label}
                      </p>
                      <h2
                        style={{
                          fontSize: "1.35rem",
                          fontWeight: 700,
                          color: "#111827",
                          margin: "0.25rem 0 0.15rem 0",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {stat.value}
                      </h2>
                      <span style={{ fontSize: "11px", color: "#9ca3af" }}>{stat.sub}</span>
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
                        color: "#4b5563",
                      }}
                    >
                      <Icon style={{ width: "18px", height: "18px" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Customer Table Card */}
            <section
              style={{
                overflow: "hidden",
                borderRadius: "0.75rem",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              }}
            >
              <CustomersTable initialCustomers={customers} />
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
