import type { HighlightBlock } from "@/types/product";

export type ProductHighlight = HighlightBlock & { id: string };

export const DEFAULT_PRODUCT_HIGHLIGHTS: ProductHighlight[] = [
  {
    id: "product-highlight-steel",
    title: "Precision Food-Grade Steel",
    description:
      "Meticulously sculpted from aerospace-grade 18/8 stainless steel. Undergoes multi-stage vibration tumbling and precision polishing for exceptional tensile strength and lasting scratch resistance.",
    imageSrc: "/favior_pro_shaker_black.jpg",
    imageAlt: "Precision stainless steel detail view",
  },
  {
    id: "product-highlight-canvas",
    title: "High-Density Ballistic Canvas",
    description:
      "Reinforced heavy-duty water-resistant construction designed for rugged daily gym use. Engineered to distribute weight evenly with reinforced stress points and antique brass hardware.",
    imageSrc: "/favior_heritage_duffle_bag.jpg",
    imageAlt: "High-density ballistic canvas and structural engineering",
  },
];

export const PRODUCT_HIGHLIGHT_IDS = DEFAULT_PRODUCT_HIGHLIGHTS.map(({ id }) => id);
