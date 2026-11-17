"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistClientActions({ userId, productId }: { userId: string, productId: string }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const { toggleWishlistAction } = await import("./actions");
      await toggleWishlistAction(userId, productId);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <button 
        style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 16px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Add to Cart
      </button>
      <button 
        onClick={handleRemove}
        disabled={isRemoving}
        style={{ background: "none", border: "none", cursor: isRemoving ? "not-allowed" : "pointer", color: "#a1a1aa", padding: "8px" }}
        aria-label="Remove from Wishlist"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
