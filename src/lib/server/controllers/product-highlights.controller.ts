import { db } from "@/lib/db";
import { DEFAULT_PRODUCT_HIGHLIGHTS, PRODUCT_HIGHLIGHT_IDS, type ProductHighlight } from "@/lib/product-highlights";

export async function getProductHighlights(): Promise<ProductHighlight[]> {
  const records = await db.heroBanner.findMany({
    where: { id: { in: PRODUCT_HIGHLIGHT_IDS } },
    select: { id: true, title: true, caption: true, src: true, alt: true },
  });

  return DEFAULT_PRODUCT_HIGHLIGHTS.map((fallback) => {
    const record = records.find(({ id }) => id === fallback.id);
    if (!record) return fallback;

    return {
      id: record.id,
      title: record.title,
      description: record.caption ?? fallback.description,
      imageSrc: record.src,
      imageAlt: record.alt,
    };
  });
}

export async function saveProductHighlight(highlight: ProductHighlight) {
  const { id, title, description, imageSrc, imageAlt } = highlight;
  const fields = { title, caption: description, src: imageSrc, alt: imageAlt };

  await db.heroBanner.upsert({
    where: { id },
    update: fields,
    create: { id, category: "product_highlights", ...fields },
  });
}
