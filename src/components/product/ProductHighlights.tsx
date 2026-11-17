"use client";

import React from "react";
import Image from "next/image";
import type { HighlightBlock } from "@/types/product";

const DEFAULT_HIGHLIGHTS: HighlightBlock[] = [
  {
    title: "Precision Food-Grade Steel",
    description:
      "Meticulously sculpted from aerospace-grade 18/8 stainless steel. Undergoes multi-stage vibration tumbling and precision polishing for exceptional tensile strength and lasting scratch resistance.",
    imageSrc: "/favior_pro_shaker_black.jpg",
    imageAlt: "Precision stainless steel detail view",
  },
  {
    title: "High-Density Ballistic Canvas",
    description:
      "Reinforced heavy-duty water-resistant construction designed for rugged daily gym use. Engineered to distribute weight evenly with reinforced stress points and antique brass hardware.",
    imageSrc: "/favior_heritage_duffle_bag.jpg",
    imageAlt: "High-density ballistic canvas and structural engineering",
  },
];

export function ProductHighlights({
  highlights,
  className,
}: {
  highlights?: HighlightBlock[];
  className?: string;
}) {
  const data = highlights && highlights.length > 0 ? highlights : DEFAULT_HIGHLIGHTS;

  return (
    <section
      id="product-highlights"
      className={className}
      style={{
        width: "100%",
        backgroundColor: "#000000",
        color: "#FFFFFF",
        padding: "96px 0",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Contained Centered Wrapper */}
      <div
        style={{
          width: "100%",
          maxWidth: "1160px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "32px",
          paddingRight: "32px",
          boxSizing: "border-box",
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#FFFFFF",
              margin: "0",
              lineHeight: "1.2",
            }}
          >
            PRODUCT HIGHLIGHTS
          </h2>
        </div>

        {/* Alternating Highlights Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "96px" }}>
          {data.map((block, index) => {
            const isImageLeft = index % 2 === 0;

            return (
              <div
                key={block.title}
                className="highlight-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "64px",
                  alignItems: "center",
                }}
              >
                {/* Image Container */}
                <div
                  style={{
                    order: isImageLeft ? 1 : 2,
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                  }}
                  className="highlight-image-box"
                >
                  <Image
                    src={block.imageSrc}
                    alt={block.imageAlt || block.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: "contain",
                      padding: "24px",
                      transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    className="hover:scale-105"
                  />
                </div>

                {/* Text Content Block */}
                <div
                  style={{
                    order: isImageLeft ? 2 : 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0 8px",
                  }}
                  className="highlight-text-box"
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#FFFFFF",
                      margin: "0 0 14px 0",
                      lineHeight: "1.3",
                    }}
                  >
                    {block.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      lineHeight: "1.8",
                      color: "rgba(255, 255, 255, 0.72)",
                      letterSpacing: "0.01em",
                      margin: 0,
                    }}
                  >
                    {block.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoped Media Queries to enforce Desktop 2-Column and Gap */}
      <style jsx>{`
        @media (min-width: 860px) {
          .highlight-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 80px !important;
          }
        }
        @media (max-width: 859px) {
          .highlight-image-box {
            order: 1 !important;
          }
          .highlight-text-box {
            order: 2 !important;
          }
        }
      `}</style>
    </section>
  );
}
