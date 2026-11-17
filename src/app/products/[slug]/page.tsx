import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { ProductPage } from "@/components/product/ProductPage";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { db } from "@/lib/db";
import type { ProductDetail } from "@/components/product/productData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchDbProduct(slug: string) {
  const legacyMap: Record<string, string> = {
    "the-havane": "favior-heritage-gym-duffle-bag",
    "the-aube": "favior-pro-series-shaker-stealth-black",
    "the-lumen": "favior-pro-series-shaker-700ml-desert-nude",
    "the-brume": "favior-luxury-gym-towel",
  };
  const targetSlug = legacyMap[slug] || slug;

  const product = await db.product.findFirst({
    where: {
      OR: [
        { slug: targetSlug },
        { id: targetSlug },
      ],
    },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: true,
    },
  });

  if (product) return product;

  // Fallback to latest product if slug is not found
  return db.product.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      colors: true,
      features: true,
      specs: true,
      media: { orderBy: { sortOrder: "asc" } },
      category: true,
    },
  });
}

function mapToProductDetail(p: any): ProductDetail {
  const priceDisplay = p.price?.toString().startsWith("₹") || p.price?.toString().startsWith("RS.")
    ? p.price
    : `₹${p.price}`;

  const oldPriceDisplay = p.oldPrice
    ? p.oldPrice.toString().startsWith("₹") || p.oldPrice.toString().startsWith("RS.")
      ? p.oldPrice
      : `₹${p.oldPrice}`
    : "";

  const isShaker =
    (p.slug && p.slug.toLowerCase().includes("shaker")) ||
    (p.name && p.name.toLowerCase().includes("shaker"));

  const isNudeShaker =
    isShaker &&
    ((p.slug && p.slug.toLowerCase().includes("nude")) ||
      (p.name && (p.name.toLowerCase().includes("nude") || p.name.toLowerCase().includes("dune"))));

  // Shaker has exactly 2 colors: Stealth Black and Desert Nude
  const shakerColors = isNudeShaker
    ? [
        { name: "Desert Nude", value: "#D2B48C" },
        { name: "Stealth Black", value: "#111111" },
      ]
    : [
        { name: "Stealth Black", value: "#111111" },
        { name: "Desert Nude", value: "#D2B48C" },
      ];

  const shakerGallery = isNudeShaker
    ? [
        { src: "/favior_pro_shaker_nude.jpg", alt: "Favior Dune Shaker (700ml)" },
        { src: "/favior_pro_shaker_black.jpg", alt: "Favior Phantom Shaker (700ml)" },
      ]
    : [
        { src: "/favior_pro_shaker_black.jpg", alt: "Favior Phantom Shaker (700ml)" },
        { src: "/favior_pro_shaker_nude.jpg", alt: "Favior Dune Shaker (700ml)" },
      ];

  const defaultGallery = [
    { src: p.mainImage, alt: p.name },
    ...(p.media || []).map((m: any) => ({ src: m.url, alt: p.name })),
  ].filter((img: any) => Boolean(img.src));

  const finalGallery = isShaker
    ? shakerGallery
    : defaultGallery.length > 0
    ? defaultGallery
    : [{ src: p.mainImage, alt: p.name }];

  const parsedColors = (p.colors || []).map((c: any) => ({
    name: c.name,
    value: c.bgHex || c.bg || "#111111",
  }));

  const finalColors = isShaker
    ? shakerColors
    : parsedColors.length > 0
    ? parsedColors
    : [{ name: "Standard", value: "#111111" }];

  return {
    id: p.id,
    merchandiseId: p.id,
    slug: p.slug,
    editLabel: "FAVIOR PRO ATHLETICS",
    title: p.name,
    breadcrumb: [
      { label: "Homepage", href: "/" },
      { label: "Collections", href: "/all-products" },
      { label: p.name },
    ],
    originalPrice: oldPriceDisplay,
    price: priceDisplay,
    sold: `${p.reviewsCount || "150+"} Verified Orders`,
    rating: (p.rating || 4.9).toString(),
    description: p.description,
    detailsBody: p.description,
    careNotes: [
      "Hand wash or rinse with lukewarm water after intense sessions.",
      "Store in a clean, ventilated gear compartment.",
    ],
    shippingNotes: [
      p.shippingNotice || "Free express delivery across India.",
      "100% genuine product guarantee with instant replacement warranty.",
    ],
    colorName: finalColors[0].name,
    colors: finalColors,
    sizes: isShaker ? ["700ML"] : [],
    gallery: finalGallery,
    deliveryPerks: [
      { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
      { label: "Easy exchange", detail: "7 days", icon: "exchange" },
      { label: "Secure checkout", detail: "UPI / COD", icon: "shield" },
      { label: "Tracked shipping", detail: "Live updates", icon: "card" },
    ],
    completeLook: [],
    highlights: [],
  };
}

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbProduct = await fetchDbProduct(slug);
  if (!dbProduct) {
    return { title: "Product — Favior" };
  }
  const product = mapToProductDetail(dbProduct);
  return {
    title: `${product.title} — Favior`,
    description: product.description,
    openGraph: {
      title: `${product.title} | Favior`,
      description: product.description,
      images: product.gallery.map((img) => img.src),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dbProduct = await fetchDbProduct(slug);

  if (!dbProduct) {
    notFound();
  }

  const product = mapToProductDetail(dbProduct);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <div className="pt-20 sm:pt-24 flex-1 flex flex-col">
        <ProductPage product={product} />
      </div>
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
