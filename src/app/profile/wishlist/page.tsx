import { getCurrentUser } from "@/lib/server/dal/auth";
import { redirect } from "next/navigation";
import { getWishlist } from "@/lib/server/controllers/wishlist.controller";
import { Heart } from "lucide-react";
import Link from "next/link";
import WishlistClientActions from "./wishlist-client-actions";

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const wishlist = await getWishlist(user.id);

  return (
    <>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: "0 0 32px 0", display: "flex", alignItems: "center", gap: "8px" }}>
        <Heart size={20} /> My Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <div style={{ backgroundColor: "#fafafa", border: "1px solid #f4f4f5", borderRadius: "2px", padding: "48px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>Your wishlist is empty.</p>
          <Link href="/all-products" style={{ display: "inline-block", backgroundColor: "#000", color: "#fff", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", padding: "16px 32px", textDecoration: "none" }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
          {wishlist.map((item) => (
            <div key={item.id} style={{ border: "1px solid #f4f4f5", padding: "16px", position: "relative" }}>
              <Link href={`/product/${item.product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                {item.product.mainImage ? (
                  <img src={item.product.mainImage} alt={item.product.name} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", backgroundColor: "#fafafa", marginBottom: "16px" }} />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#fafafa", marginBottom: "16px" }} />
                )}
                <p style={{ fontSize: "13px", fontWeight: "bold", color: "#18181b", margin: "0 0 8px 0" }}>{item.product.name}</p>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <p style={{ fontSize: "12px", color: "#18181b", fontWeight: "bold", margin: 0 }}>${item.product.price}</p>
                  {item.product.oldPrice && (
                    <p style={{ fontSize: "11px", color: "#a1a1aa", textDecoration: "line-through", margin: 0 }}>${item.product.oldPrice}</p>
                  )}
                </div>
              </Link>
              
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f4f4f5" }}>
                 <WishlistClientActions userId={user.id} productId={item.productId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
