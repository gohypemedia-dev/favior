import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { CollectionPage } from "@/components/collection/CollectionPage";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { collectionsRegistry } from "@/components/collection/collectionData";
import { db } from "@/lib/db";
import type { CatalogItem } from "@/components/collection/collectionData";

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: "Stainless Steel Shakers — Favior",
  description: "Double-wall insulated stainless steel shaker bottles and thermal flasks.",
};

export default async function ShakersPage() {
  const dbProducts = await db.product.findMany({
    where: {
      OR: [
        { slug: { contains: "shaker" } },
        { name: { contains: "shaker", mode: "insensitive" } },
      ],
    },
    include: { colors: true },
    orderBy: { createdAt: "desc" },
  });

  const products: CatalogItem[] = dbProducts.map((p: any) => {
    const isNude = p.slug?.includes("nude") || p.name?.toLowerCase().includes("nude") || p.name?.toLowerCase().includes("dune");
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      desc: p.description,
      price: `RS. ${p.price}`,
      originalPrice: p.oldPrice ? `RS. ${p.oldPrice}` : undefined,
      numericPrice: parseFloat(p.price.replace(/,/g, "")),
      rating: p.rating,
      reviews: parseInt(p.reviewsCount, 10) || 0,
      img: p.mainImage,
      gallery: isNude
        ? ["/favior_pro_shaker_nude.jpg", "/favior_pro_shaker_black.jpg"]
        : ["/favior_pro_shaker_black.jpg", "/favior_pro_shaker_nude.jpg"],
      category: "shakers",
      inStock: p.quantity > 0,
      colorName: isNude ? "Desert Nude" : "Stealth Black",
      swatches: isNude ? ["#D2B48C", "#111111"] : ["#111111", "#D2B48C"],
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-14 sm:pt-16 flex-1 flex flex-col">
        <CollectionPage
          initialCollection={collectionsRegistry.shakers}
          initialCategory="shakers"
          products={products}
        />
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
