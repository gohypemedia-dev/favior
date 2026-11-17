import { getCurrentUser } from "@/lib/server/dal/auth";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import Link from "next/link";
import { getPendingReviewsCount } from "@/lib/server/controllers/reviews.controller";

export default async function ProfileOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Fetch recent order
  const recentOrder = await db.order.findFirst({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Check for active orders
  const activeOrdersCount = await db.order.count({
    where: {
      userId: user.id,
      status: {
        in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED],
      },
    },
  });

  const pendingReviewsCount = await getPendingReviewsCount(user.id);
  
  const wishlistCount = await db.wishlist.count({
    where: { userId: user.id },
  });

  return (
    <>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: "0 0 24px 0" }}>
        Overview
      </h2>

      <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "32px" }}>
        Welcome back, <span style={{ fontWeight: "bold", color: "#18181b" }}>{user.name || "Customer"}</span>
      </p>

      {/* Action / Notification Banners */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
        {pendingReviewsCount > 0 && (
          <div style={{ backgroundColor: "#fafafa", border: "1px solid #f4f4f5", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "13px", fontWeight: "500", color: "#18181b", margin: 0 }}>
              You have {pendingReviewsCount} product{pendingReviewsCount > 1 ? "s" : ""} waiting for review
            </p>
            <Link href="/profile/reviews" style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff", backgroundColor: "#000", padding: "8px 16px", textDecoration: "none" }}>
              Review Products
            </Link>
          </div>
        )}

        {activeOrdersCount > 0 && (
          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "13px", fontWeight: "500", color: "#166534", margin: 0 }}>
              You have {activeOrdersCount} active order{activeOrdersCount > 1 ? "s" : ""} on the way
            </p>
            <Link href="/profile/orders" style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff", backgroundColor: "#166534", padding: "8px 16px", textDecoration: "none" }}>
              Track Orders
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "48px" }}>
        <Link href="/profile/orders" style={{ textDecoration: "none", color: "inherit", border: "1px solid #f4f4f5", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fafafa", transition: "border-color 0.2s" }}>
          <span style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>📦</span>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "500" }}>All Orders</span>
        </Link>
        <Link href="/profile/wishlist" style={{ textDecoration: "none", color: "inherit", border: "1px solid #f4f4f5", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fafafa", transition: "border-color 0.2s" }}>
          <span style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>{wishlistCount}</span>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "500" }}>Wishlist</span>
        </Link>
        <Link href="/profile/support" style={{ textDecoration: "none", color: "inherit", border: "1px solid #f4f4f5", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fafafa", transition: "border-color 0.2s" }}>
          <span style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>💬</span>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "500" }}>Support</span>
        </Link>
      </div>

      {/* Recent Order */}
      {recentOrder && (
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: "0 0 16px 0", borderBottom: "1px solid #f4f4f5", paddingBottom: "8px" }}>
            Recent Order
          </h3>
          <div style={{ border: "1px solid #f4f4f5", padding: "24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {recentOrder.items[0]?.product.mainImage && (
                <img src={recentOrder.items[0].product.mainImage} alt="Product" style={{ width: "64px", height: "64px", objectFit: "cover", backgroundColor: "#fafafa" }} />
              )}
              <div>
                <p style={{ fontSize: "13px", fontWeight: "bold", margin: "0 0 4px 0", color: "#18181b" }}>
                  {recentOrder.items[0]?.product.name} {recentOrder.items.length > 1 ? `+ ${recentOrder.items.length - 1} more` : ""}
                </p>
                <p style={{ fontSize: "12px", color: "#71717a", margin: "0 0 4px 0" }}>
                  {recentOrder.status} on {new Date(recentOrder.createdAt).toLocaleDateString()}
                </p>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#18181b", margin: 0 }}>
                  ${recentOrder.total.toFixed(2)}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <Link href={`/profile/orders`} style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 16px", border: "1px solid #e4e4e7", color: "#18181b", textDecoration: "none" }}>
                View Order
              </Link>
              <Link href={`/product/${recentOrder.items[0]?.product.slug}`} style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 16px", backgroundColor: "#18181b", color: "#fff", textDecoration: "none" }}>
                Buy Again
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
