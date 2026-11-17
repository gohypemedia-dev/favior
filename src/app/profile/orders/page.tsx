import { getCurrentUser } from "@/lib/server/dal/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Package } from "lucide-react";
import { OrderStatus } from "@prisma/client";

export default async function MyOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: "0 0 32px 0", display: "flex", alignItems: "center", gap: "8px" }}>
        <Package size={20} /> My Orders
      </h2>

      {orders.length === 0 ? (
        <div style={{ backgroundColor: "#fafafa", border: "1px solid #f4f4f5", borderRadius: "2px", padding: "48px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>You haven't placed any orders yet.</p>
          <Link href="/all-products" style={{ display: "inline-block", backgroundColor: "#000", color: "#fff", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", padding: "16px 32px", textDecoration: "none" }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: "1px solid #f4f4f5", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f4f4f5", paddingBottom: "16px" }}>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: "#18181b", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>
                    Order #{order.id.slice(-6)}
                  </p>
                  <p style={{ fontSize: "11px", color: "#71717a", margin: 0 }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold", color: "#18181b", margin: "0 0 8px 0" }}>
                    ${order.total.toFixed(2)}
                  </p>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 8px", backgroundColor: "#fafafa", border: "1px solid #e4e4e7", color: "#18181b" }}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    {item.product.mainImage ? (
                      <img src={item.product.mainImage} alt={item.product.name} style={{ width: "80px", height: "80px", objectFit: "cover", backgroundColor: "#fafafa", border: "1px solid #f4f4f5" }} />
                    ) : (
                      <div style={{ width: "80px", height: "80px", backgroundColor: "#fafafa", border: "1px solid #f4f4f5" }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: "500", color: "#18181b", margin: "0 0 4px 0" }}>
                        {item.product.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#71717a", margin: "0 0 8px 0" }}>
                        Qty: {item.quantity} | ${item.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f4f4f5" }}>
                <button style={{ flex: 1, fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px", border: "1px solid #e4e4e7", backgroundColor: "transparent", color: "#18181b", cursor: "pointer" }}>
                  Track Order
                </button>
                <Link href={`/product/${order.items[0]?.product.slug}`} style={{ flex: 1, textAlign: "center", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px", backgroundColor: "#18181b", color: "#fff", textDecoration: "none" }}>
                  Buy Again
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
