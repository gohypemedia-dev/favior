import { getCurrentUser } from "@/lib/server/dal/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import WriteReviewForm from "./write-review-form";

export default async function WriteReviewPage(props: { searchParams: Promise<{ productId?: string; orderId?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const searchParams = await props.searchParams;
  const { productId, orderId } = searchParams;

  if (!productId || !orderId) {
    redirect("/profile/reviews");
  }

  // Verify the product and order belong to the user
  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId: user.id,
      status: "DELIVERED",
      items: {
        some: { productId }
      }
    },
    include: {
      items: {
        where: { productId },
        include: { product: true }
      }
    }
  });

  if (!order || order.items.length === 0) {
    return (
      <div style={{ padding: "48px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "#71717a" }}>Invalid order or product, or order is not yet delivered.</p>
      </div>
    );
  }

  const product = order.items[0].product;

  return (
    <>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: "0 0 32px 0" }}>
        Write a Review
      </h2>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginBottom: "48px", borderBottom: "1px solid #f4f4f5", paddingBottom: "32px" }}>
        {product.mainImage && (
          <img src={product.mainImage} alt={product.name} style={{ width: "80px", height: "80px", objectFit: "cover", backgroundColor: "#fafafa" }} />
        )}
        <div>
          <p style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 8px 0", color: "#18181b" }}>{product.name}</p>
          <p style={{ fontSize: "12px", color: "#71717a", margin: 0 }}>Order #{order.id.slice(-6)} • Delivered on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <WriteReviewForm productId={productId} orderId={orderId} userId={user.id} />
    </>
  );
}
