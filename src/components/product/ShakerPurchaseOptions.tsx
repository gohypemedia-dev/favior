"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { ThreeDShakerData } from "@/lib/server/controllers/three-d-shaker.controller";
import { getShakerCartItem } from "@/lib/shaker-product";

export function ShakerPurchaseOptions({
  shaker,
  initialSize,
}: {
  shaker: ThreeDShakerData;
  initialSize: string;
}) {
  const router = useRouter();
  const { addToCart, closeCart } = useCart();
  const [size, setSize] = useState(initialSize);
  const variant = shaker.variants.find((option) => option.name === size) ?? shaker.variants[0];
  const item = getShakerCartItem(shaker, variant);

  function buyNow() {
    addToCart(item);
    closeCart();
    router.push("/checkout");
  }

  return (
    <div className="mt-6">
      <p aria-live="polite" className="text-2xl font-semibold tabular-nums">
        {item.price}
      </p>
      <fieldset className="mt-4">
        <legend className="mb-2 text-sm font-semibold">Capacity</legend>
        <div className="flex flex-wrap gap-2">
          {shaker.variants.map((option) => (
            <button
              key={option.name}
              type="button"
              aria-pressed={option.name === variant.name}
              onClick={() => setSize(option.name)}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold hover:border-black aria-pressed:border-black aria-pressed:bg-black aria-pressed:text-white"
            >
              {option.name}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="hero-action-row mt-5">
        <button type="button" onClick={buyNow} className="hero-btn-buy">Buy Now</button>
        <button type="button" onClick={() => addToCart(item)} className="hero-btn-cart">Add to Cart</button>
      </div>
    </div>
  );
}
