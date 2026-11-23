"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { ThreeDShakerData } from "@/lib/server/controllers/three-d-shaker.controller";
import { getShakerCartItem } from "@/lib/shaker-product";
import styles from "./ShakerPurchaseOptions.module.css";

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
    <div className={styles.purchaseOptions}>
      <p aria-live="polite" className="text-2xl font-semibold tabular-nums">
        {item.price}
      </p>
      <fieldset className={styles.capacity}>
        <legend className={styles.label}>Capacity</legend>
        <div className={styles.sizes}>
          {shaker.variants.map((option) => (
            <button
              key={option.name}
              type="button"
              aria-pressed={option.name === variant.name}
              onClick={() => setSize(option.name)}
              className={styles.sizeButton}
            >
              {option.name}
            </button>
          ))}
        </div>
      </fieldset>
      <div className={`hero-action-row ${styles.actions}`}>
        <button type="button" onClick={buyNow} className="hero-btn-buy">Buy Now</button>
        <button type="button" onClick={() => addToCart(item)} className="hero-btn-cart">Add to Cart</button>
      </div>
    </div>
  );
}
