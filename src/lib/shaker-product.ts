import type { ThreeDShakerData, ThreeDShakerVariant } from "@/lib/server/controllers/three-d-shaker.controller";

export const SHAKER_PRODUCT_SLUG = "favior-pro-shaker";

export function getShakerProductHref(size: string) {
  return `/products/${SHAKER_PRODUCT_SLUG}?size=${encodeURIComponent(size)}`;
}

export function isShakerVariantSlug(slug: unknown): slug is string {
  return typeof slug === "string" && slug.startsWith(SHAKER_PRODUCT_SLUG + "-");
}

export function formatShakerPrice(price: string) {
  return `₹${price.trim().replace(/^₹\s*/, "") || "599"}`;
}

export function getShakerCartItem(data: ThreeDShakerData, variant: ThreeDShakerVariant) {
  return {
    id: `${SHAKER_PRODUCT_SLUG}-${variant.name}`,
    slug: SHAKER_PRODUCT_SLUG,
    name: `${data.title} (${variant.name})`,
    price: formatShakerPrice(variant.price),
    image: data.fallbackImage,
    color: "Matte Black",
    size: variant.name,
  };
}
