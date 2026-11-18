"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard, type Product } from "@/components/ProductCard";

interface ProductRecommendationsProps {
  currentSlug?: string;
  currentId?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

const COMBO_PACK_PRODUCT: Product = {
  id: "favior-complete-gym-kit",
  slug: "favior-complete-gym-kit",
  name: "Favior Complete Gym Kit",
  desc: "The complete athlete suite: Insulated shaker, heavy-duty wrist wraps, and latex resistance bands.",
  price: "RS. 1,999",
  originalPrice: "RS. 2,999",
  rating: 5.0,
  reviews: 215,
  badge: "COMBO PACK",
  img: "/favior_complete_gym_kit.jpg",
  gallery: ["/favior_complete_gym_kit.jpg"],
  href: "/products/favior-complete-gym-kit",
};

const DEFAULT_RECOMMENDATIONS: Product[] = [
  COMBO_PACK_PRODUCT,
  {
    id: "favior-heritage-gym-duffle-bag",
    slug: "favior-heritage-gym-duffle-bag",
    name: "Favior Heritage Gym Duffle Bag (35L)",
    desc: "Heavy-duty ballistic canvas with ventilated shoe compartment and full-grain leather accents.",
    price: "RS. 3,499",
    originalPrice: "RS. 4,999",
    rating: 4.9,
    reviews: 142,
    badge: "BESTSELLER",
    img: "/favior_heritage_duffle_bag.jpg",
    gallery: ["/favior_heritage_duffle_bag.jpg"],
    href: "/products/favior-heritage-gym-duffle-bag",
  },
  {
    id: "favior-pro-series-shaker-stealth-black",
    slug: "favior-pro-series-shaker-stealth-black",
    name: "Favior Phantom Shaker (700ml)",
    desc: "Shatterproof BPA-free Tritan with cyclone turbine mixing wheel and 100% leak-proof lid.",
    price: "RS. 899",
    originalPrice: "RS. 1,299",
    rating: 4.8,
    reviews: 98,
    badge: "ESSENTIAL",
    img: "/favior_pro_shaker_black.jpg",
    gallery: ["/favior_pro_shaker_black.jpg", "/favior_pro_shaker_nude.jpg"],
    href: "/products/favior-pro-series-shaker-stealth-black",
  },
  {
    id: "favior-luxury-gym-towel",
    slug: "favior-luxury-gym-towel",
    name: "Favior Luxury Gym Towel",
    desc: "Ultra-absorbent high-density micro-cotton engineered for intense sweat and gym sessions.",
    price: "RS. 1,299",
    originalPrice: "RS. 1,699",
    rating: 4.9,
    reviews: 84,
    badge: "LUXURY",
    img: "/favior_luxury_towel.jpg",
    gallery: ["/favior_luxury_towel.jpg"],
    href: "/products/favior-luxury-gym-towel",
  },
  {
    id: "favior-pro-steel-shaker-black",
    slug: "favior-pro-series-shaker-stealth-black",
    name: "Favior Phantom Shaker (700ml)",
    desc: "Shatterproof BPA-free Tritan with cyclone turbine mixing wheel and 100% leak-proof lid.",
    price: "RS. 899",
    originalPrice: "RS. 1,299",
    rating: 4.8,
    reviews: 98,
    badge: "ESSENTIAL",
    img: "/favior_pro_shaker_black.jpg",
    gallery: ["/favior_pro_shaker_black.jpg"],
    href: "/products/favior-pro-series-shaker-stealth-black",
  },
];

export function ProductRecommendations({
  currentSlug = "",
  currentId = "",
  title = "You May Also Like",
  subtitle = "Complete Your Setup",
  limit = 4,
}: ProductRecommendationsProps) {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: Product[] = json.data.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            desc: p.description,
            price: p.price?.toString().startsWith("RS.") || p.price?.toString().startsWith("₹")
              ? p.price
              : `RS. ${p.price}`,
            originalPrice: p.oldPrice
              ? p.oldPrice.toString().startsWith("RS.") || p.oldPrice.toString().startsWith("₹")
                ? p.oldPrice
                : `RS. ${p.oldPrice}`
              : undefined,
            rating: p.rating,
            reviews: parseInt(p.reviewsCount, 10) || 0,
            img: p.mainImage,
            gallery: [p.mainImage],
            href: `/products/${p.slug}`,
          }));
          setDbProducts(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Normalize current identifier
  const normalizedSlug = currentSlug.toLowerCase().trim();
  const normalizedId = currentId.toLowerCase().trim();

  const isCurrentProduct = (p: Product) => {
    const itemSlug = (p.slug || (p.href ? p.href.split("/").pop() : "") || "").toLowerCase().trim();
    const itemId = p.id.toLowerCase().trim();
    return (
      (normalizedSlug !== "" && itemSlug === normalizedSlug) ||
      (normalizedId !== "" && itemId === normalizedId) ||
      (normalizedSlug !== "" && itemId === normalizedSlug)
    );
  };

  const isComboKit = (p: Product) => {
    const itemSlug = (p.slug || (p.href ? p.href.split("/").pop() : "") || "").toLowerCase().trim();
    const itemId = p.id.toLowerCase().trim();
    return (
      itemSlug === "favior-complete-gym-kit" ||
      itemId === "favior-complete-gym-kit" ||
      p.name.toLowerCase().includes("complete gym kit")
    );
  };

  const isViewingComboKit =
    normalizedSlug === "favior-complete-gym-kit" ||
    normalizedId === "favior-complete-gym-kit";

  // Base list from DB or fallbacks (exclude standalone desert nude shaker)
  const sourceProducts = (dbProducts.length > 0 ? dbProducts : DEFAULT_RECOMMENDATIONS).filter(
    (p) => !p.slug?.includes("desert-nude") && !p.name?.toLowerCase().includes("dune shaker")
  );

  // Eligible products excluding current viewed product
  const eligibleProducts = sourceProducts.filter((p) => !isCurrentProduct(p));

  // Resolved combo pack product
  const comboPackProduct =
    sourceProducts.find(isComboKit) || COMBO_PACK_PRODUCT;

  const result: Product[] = [];

  // When user is NOT viewing the combo pack itself, ALWAYS feature the combo pack prominently!
  if (!isViewingComboKit) {
    result.push(comboPackProduct);
  }

  // Append other eligible products without duplicates
  for (const item of eligibleProducts) {
    if (result.length >= limit) break;
    const isAlreadyInResult = result.some(
      (r) =>
        r.id.toLowerCase() === item.id.toLowerCase() ||
        (r.slug && item.slug && r.slug.toLowerCase() === item.slug.toLowerCase()) ||
        (r.href && item.href && r.href.toLowerCase() === item.href.toLowerCase())
    );
    if (!isAlreadyInResult) {
      result.push(item);
    }
  }

  // If still fewer than limit (e.g. 4), pull supplemental items from DEFAULT_RECOMMENDATIONS
  if (result.length < limit) {
    for (const fb of DEFAULT_RECOMMENDATIONS) {
      if (result.length >= limit) break;
      if (isCurrentProduct(fb)) continue;
      const isAlreadyInResult = result.some(
        (r) =>
          r.id.toLowerCase() === fb.id.toLowerCase() ||
          (r.slug && fb.slug && r.slug.toLowerCase() === fb.slug.toLowerCase()) ||
          (r.href && fb.href && r.href.toLowerCase() === fb.href.toLowerCase())
      );
      if (!isAlreadyInResult) {
        result.push(fb);
      }
    }
  }

  // If still fewer than limit (e.g. when viewing shaker itself), add shaker with second image
  if (result.length < limit) {
    const shakerFallback: Product = {
      id: "favior-pro-series-shaker-featured",
      slug: "favior-pro-series-shaker-stealth-black",
      name: "Favior Phantom Shaker (700ml)",
      desc: "Shatterproof BPA-free Tritan with cyclone turbine mixing wheel and 100% leak-proof lid.",
      price: "RS. 899",
      originalPrice: "RS. 1,299",
      rating: 4.8,
      reviews: 98,
      badge: "FEATURED",
      img: "/favior_pro_shaker_black.jpg",
      gallery: ["/favior_pro_shaker_black.jpg"],
      href: "/products/favior-pro-series-shaker-stealth-black",
    };
    result.push(shakerFallback);
  }

  const displayProducts: Product[] = result.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section
      className="w-full relative block overflow-hidden"
      style={{
        backgroundColor: "transparent",
        paddingTop: "56px",
        paddingBottom: "72px",
        paddingLeft: "16px",
        paddingRight: "16px",
        width: "100%",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Section Header */}
        <div
          className="flex w-full flex-col items-center gap-1 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"
          style={{ marginBottom: "28px" }}
        >
          <div className="flex flex-col items-center sm:items-start">
            <h2
              className="font-bold uppercase tracking-tight"
              style={{
                fontSize: "26px",
                lineHeight: "1.15",
                color: "#111111",
                margin: 0,
              }}
            >
              {title}
            </h2>
          </div>

          <Link
            href="/collection/all"
            className="hidden sm:inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-800 hover:text-black transition-colors"
            style={{ textDecoration: "none" }}
          >
            Explore Catalog &rarr;
          </Link>
        </div>

        {/* 4-Column Product Grid (2 on mobile, 4 on desktop) */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 w-full"
          style={{
            gap: "14px",
            width: "100%",
          }}
        >
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Center Outlined CTA Button on Mobile */}
        <div
          className="flex justify-center w-full sm:hidden"
          style={{
            marginTop: "32px",
          }}
        >
          <Link
            href="/collection/all"
            className="inline-flex items-center justify-center bg-transparent text-[11px] font-semibold uppercase tracking-[0.18em] leading-none transition-all"
            style={{
              padding: "14px 28px",
              lineHeight: 1,
              border: "1px solid #111111",
              color: "#111111",
              textDecoration: "none",
            }}
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductRecommendations;
