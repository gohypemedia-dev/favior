"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface ComboBuyNowButtonProps {
  product?: {
    id: string;
    slug: string;
    name: string;
    price: string;
    image: string;
  };
  text?: string;
}

export default function ComboBuyNowButton({
  product,
  text = "BUY NOW",
}: ComboBuyNowButtonProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleBuyNow = () => {
    setLoading(true);
    addToCart({
      id: product?.id || "favior-complete-gym-kit",
      slug: product?.slug || "favior-complete-gym-kit",
      name: product?.name || "Favior Complete Gym Kit",
      price: product?.price || "₹1,999",
      image: product?.image || "/favior_complete_gym_kit.jpg",
      size: "PRO KIT",
      color: "Standard",
    });
    router.push("/checkout");
  };

  return (
    <div className="w-full flex items-center justify-center pt-8 pb-4">
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={loading}
        className="inline-block px-10 sm:px-12 py-3 border border-black bg-white text-black text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] transition-colors duration-200 hover:bg-black hover:text-white active:scale-[0.99] cursor-pointer"
        style={{
          border: "1px solid #000000",
          backgroundColor: "#ffffff",
          color: "#000000",
          letterSpacing: "0.2em",
          borderRadius: 0,
        }}
      >
        {loading ? "PROCEEDING..." : text}
      </button>
    </div>
  );
}
