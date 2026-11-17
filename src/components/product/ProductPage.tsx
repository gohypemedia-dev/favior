"use client";

import React, { useState, useMemo } from "react";
import { ProductGallery } from "./ProductGallery";
import { ProductSummary } from "./ProductSummary";
import { ProductHighlights } from "./ProductHighlights";
import { ProductReviews } from "./ProductReviews";
import { ProductRecommendations } from "./ProductRecommendations";
import type { ProductDetail } from "./productData";

export function ProductPage({ product }: { product: ProductDetail }) {
  const isShaker =
    (product.slug && product.slug.toLowerCase().includes("shaker")) ||
    (product.title && product.title.toLowerCase().includes("shaker"));

  const initialColor =
    product.colors && product.colors.length > 0
      ? product.colors[0].name
      : product.colorName || "Standard";

  const [selectedColor, setSelectedColor] = useState(initialColor);

  // Dynamic gallery switching based on selected color for shaker
  const currentGallery = useMemo(() => {
    if (!isShaker) return product.gallery;

    const isNude =
      selectedColor.toLowerCase().includes("nude") ||
      selectedColor.toLowerCase().includes("desert") ||
      selectedColor.toLowerCase().includes("dune");

    if (isNude) {
      return [
        { src: "/favior_pro_shaker_nude.jpg", alt: "Favior Dune Shaker (700ml) - Desert Nude" },
        { src: "/favior_pro_shaker_black.jpg", alt: "Favior Phantom Shaker (700ml) - Stealth Black" },
      ];
    } else {
      return [
        { src: "/favior_pro_shaker_black.jpg", alt: "Favior Phantom Shaker (700ml) - Stealth Black" },
        { src: "/favior_pro_shaker_nude.jpg", alt: "Favior Dune Shaker (700ml) - Desert Nude" },
      ];
    }
  }, [isShaker, selectedColor, product.gallery]);

  return (
    <main
      style={{
        width: "100%",
        backgroundColor: "transparent",
        color: "#111111",
        overflowX: "clip",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
      className="flex-1 min-w-0"
    >
      <section
        style={{
          width: "100%",
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "24px 20px 56px 20px",
          boxSizing: "border-box",
        }}
      >

        {/* Grid Layout: Sticky Gallery (Left) & Summary (Right) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "48px",
            alignItems: "start",
            width: "100%",
          }}
          className="clarte-product-main-grid"
        >
          {/* Sticky Gallery Column on Desktop (Fits within 100vh Viewport) */}
          <div
            className="clarte-sticky-gallery"
            style={{
              width: "100%",
              minWidth: 0,
            }}
          >
            <ProductGallery key={selectedColor} images={currentGallery} />
          </div>

          {/* Product Summary Column */}
          <div style={{ width: "100%", minWidth: 0 }}>
            <ProductSummary
              product={product}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              activeGallery={currentGallery}
            />
          </div>
        </div>
      </section>

      {/* Craftsmanship Highlights */}
      <ProductHighlights highlights={product.highlights} />

      {/* Customer Reviews Section */}
      <ProductReviews productSlug={product.slug} />

      {/* Recommended / You May Also Like Product Grid */}
      <ProductRecommendations
        currentSlug={product.slug}
        currentId={product.id}
        title="You May Also Like"
        subtitle="Curated Recommendations"
      />

      {/* Responsive Grid & Sticky Gallery Styles */}
      <style jsx>{`
        @media (min-width: 980px) {
          .clarte-product-main-grid {
            grid-template-columns: 1.15fr 1fr !important;
            gap: 56px !important;
          }
          .clarte-sticky-gallery {
            position: sticky !important;
            top: 76px !important;
            align-self: start !important;
            z-index: 10;
          }
        }
        @media (min-width: 1200px) {
          .clarte-product-main-grid {
            grid-template-columns: 1.2fr 1fr !important;
            gap: 64px !important;
          }
        }
      `}</style>
    </main>
  );
}
