import Image from "next/image";
import Link from "next/link";
import ProductCard, { Product } from "@/components/ProductCard";
import ProductSlider from "@/components/ProductSlider";
import CardGridSection from "@/components/CardGridSection";
import Model3DSection from "@/components/Model3DSection";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroVideo from "@/components/HeroVideo";
import FaqSection from "@/components/FaqSection";
import SiteFooter from "@/components/SiteFooter";
import { db } from "@/lib/db";
import { listActiveBanners } from "@/lib/server/controllers/banners.controller";
import { get3DShakerData } from "@/lib/server/controllers/three-d-shaker.controller";

export const dynamic = 'force-dynamic';

/* ─────────────────────────────────────
   SVG Icon Helpers
───────────────────────────────────── */
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const BagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    style={{ width: 14, height: 14, display: "inline-block", marginLeft: 6 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    />
  </svg>
);

/* ─────────────────────────────────────
   Page Component
───────────────────────────────────── */
export default async function Home() {
  const [dbProducts, activeBanners, shakerBanner, allActiveBanners] = await Promise.all([
    db.product.findMany({
      orderBy: { createdAt: "desc" }
    }),
    listActiveBanners("hero"),
    get3DShakerData(),
    listActiveBanners("all")
  ]);

  const allProducts: Product[] = dbProducts.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    desc: p.description,
    price: p.price?.toString().startsWith("₹")
      ? `RS. ${p.price.replace(/^₹/, "")}`
      : p.price?.toString().startsWith("RS.")
      ? p.price
      : `RS. ${p.price}`,
    originalPrice: p.oldPrice
      ? p.oldPrice.toString().startsWith("₹")
        ? `RS. ${p.oldPrice.replace(/^₹/, "")}`
        : p.oldPrice.toString().startsWith("RS.")
        ? p.oldPrice
        : `RS. ${p.oldPrice}`
      : undefined,
    rating: p.rating,
    reviews: parseInt(p.reviewsCount, 10) || 0,
    img: p.mainImage,
    gallery: [p.mainImage]
  }));

  const duffle = allProducts.find((p) => p.slug === "favior-heritage-gym-duffle-bag");
  const phantomShaker = allProducts.find((p) => p.slug === "favior-pro-series-shaker-stealth-black");
  const comboKit = allProducts.find((p) => p.slug === "favior-complete-gym-kit");
  const towel = allProducts.find((p) => p.slug === "favior-luxury-gym-towel");

  const bestsellersList = [
    duffle,
    phantomShaker,
    comboKit,
    towel,
  ].filter(Boolean) as Product[];

  const products = bestsellersList.length === 4
    ? bestsellersList
    : allProducts.filter((p) => p.slug !== "favior-pro-series-shaker-700ml-desert-nude").slice(0, 4);

  const curateItems = allProducts.slice(4, 8);

  // DB-driven images for split sections — find by slug
  const duffleProduct = dbProducts.find((p: any) => p.slug === "favior-heritage-gym-duffle-bag");
  const shakerProduct = dbProducts.find((p: any) => p.slug === "favior-pro-series-shaker-stealth-black");
  const comboProduct = dbProducts.find((p: any) => p.slug === "favior-complete-gym-kit");
  const duffleImg: string = duffleProduct?.mainImage ?? "";
  const shakerImg: string = shakerProduct?.mainImage ?? "";

  // Dynamic Split Banners & Build Your Kit Banner from DB
  const duffleBanner = allActiveBanners.find((b: any) => b.category === "split_duffle") || {
    title: "Built for the gym. Crafted for travel",
    caption:
      "The Favior Heritage Gym Duffle Bag delivers 35L of premium capacity. Constructed with heavy-duty water-resistant ballistic canvas, full-grain leather accents, brushed antique brass hardware, and a dedicated ventilated shoe compartment.",
    src: duffleImg || "/favior_heritage_duffle_bag.jpg",
    cta: "Shop Duffle Bag",
    linkUrl: "/all-products",
    isActive: true,
  };

  const shakerSplitBanner = allActiveBanners.find((b: any) => b.category === "split_shaker") || {
    title: "Never miss a rep. Never miss a sip",
    caption:
      "Crafted from shatterproof, BPA-free smoke Tritan with an integrated cyclone turbine mixing wheel. The Favior Pro Series Shaker delivers instantaneous, silky-smooth blending with a 100% leak-proof snap lock.",
    src: shakerImg || "/favior_pro_shaker_black.jpg",
    cta: "Shop Shakers",
    linkUrl: "/shakers",
    isActive: true,
  };

  const kitBanner = allActiveBanners.find((b: any) => b.category === "build_your_kit") || {
    title: "Build Your Kit",
    src: "/favior_combo_pack_banner.jpg",
    images: [
      duffleImg || "/favior_heritage_duffle_bag.jpg",
      shakerImg || "/favior_pro_shaker_black.jpg",
      "/favior_luxury_towel.jpg",
    ],
    cta: "Buy Now",
    linkUrl: "/products/favior-complete-gym-kit",
    isActive: true,
  };

  const kitCaption = kitBanner.caption?.trim() ===
    "Customize your personal athlete bundle with premium shaker, duffle, and towel."
    ? null
    : kitBanner.caption;

  // Build Your Kit — 4 newest product images from DB
  const kitImages = dbProducts.slice(0, 4).map((p: any) => ({ img: p.mainImage as string, name: p.name as string, slug: p.slug as string }));

  return (
    <>
      {/* ── Announcement Bar ── */}
      <AnnouncementBar />

      {/* ── Smart Aesop Navigation (Scroll-Up Reveal) ── */}
      <Navbar />

      {/* ── Hero Video Section ── */}
      <HeroVideo banners={activeBanners} />

      {/* ── 3D Interactive Model Section ── */}
      <div id="section-3d-model" className="scroll-mt-14 sm:scroll-mt-16">
        <Model3DSection data={shakerBanner} />
      </div>

      {/* ── Featured Products Grid ── */}
      <CardGridSection
        title="Bestsellers"
        products={products.slice(0, 4)}
        viewAllHref="/all-products"
      />






      {/* ── Split 1: Built for the gym (Duffle Bag) ── */}
      {duffleBanner.isActive && (duffleBanner.src || duffleImg) && (
      <section className="split-section">
        <div
          style={{
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            minHeight: "480px",
            padding: "36px",
          }}
        >
          <Image
            src={duffleBanner.src || duffleImg}
            alt={duffleBanner.alt || duffleBanner.title}
            width={800}
            height={600}
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "480px",
              objectFit: "contain",
            }}
          />
        </div>
        <div className="split-content dark">
          <h2 className="serif">{duffleBanner.title}</h2>
          {duffleBanner.caption && <p>{duffleBanner.caption}</p>}
          <a href={duffleBanner.linkUrl || "/all-products"} className="btn btn-light" style={{ alignSelf: "flex-start" }}>
            {duffleBanner.cta || "Shop Duffle Bag"}
          </a>
        </div>
      </section>
      )}

      {/* ── Split 2: Never miss a rep (Shaker Bottle) ── */}
      {shakerSplitBanner.isActive && (shakerSplitBanner.src || shakerImg) && (
      <section className="split-section">
        <div className="split-content" style={{ background: "var(--bg-cream)" }}>
          <h2 className="serif" style={{ color: "var(--text-dark)" }}>
            {shakerSplitBanner.title.includes(".") ? (
              <>
                {shakerSplitBanner.title.split(".")[0]}.{" "}
                <em>{shakerSplitBanner.title.split(".").slice(1).join(".").trim()}</em>
              </>
            ) : (
              shakerSplitBanner.title
            )}
          </h2>
          {shakerSplitBanner.caption && <p>{shakerSplitBanner.caption}</p>}
          <a href={shakerSplitBanner.linkUrl || "/shakers"} className="btn btn-dark" style={{ alignSelf: "flex-start" }}>
            {shakerSplitBanner.cta || "Shop Shakers"}
          </a>
        </div>
        <div
          style={{
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            minHeight: "480px",
            padding: "36px",
          }}
        >
          <Image
            src={shakerSplitBanner.src || shakerImg}
            alt={shakerSplitBanner.alt || shakerSplitBanner.title}
            width={800}
            height={600}
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "480px",
              objectFit: "contain",
            }}
          />
        </div>
      </section>
      )}

      {/* ── Build Your Kit: Dynamic Multi-Image / Composite Banner ── */}
      {kitBanner.isActive && (
      <section
        className="w-full overflow-hidden bg-white"
        style={{
          paddingTop: "40px",
          paddingBottom: "48px",
          borderTop: "1px solid #e5e5e5",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            paddingLeft: "24px",
            paddingRight: "24px",
            marginBottom: "28px",
          }}
        >
          <h2
            className="font-heading font-bold uppercase tracking-tight"
            style={{ fontSize: "28px", lineHeight: "1.1", color: "#111111" }}
          >
            {kitBanner.title || "Build Your Kit"}
          </h2>
          {kitCaption && (
            <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#666666" }}>
              {kitCaption}
            </p>
          )}
        </div>

        {/* Multi-Image Horizontal Showcase or Full-Width Combo Banner */}
        <Link
          href={kitBanner.linkUrl || "/products/favior-complete-gym-kit"}
          className="group relative block w-full bg-white transition-opacity hover:opacity-95"
          style={{ width: "100%" }}
        >
          {kitBanner.images && kitBanner.images.length > 1 ? (
            <div
              style={{
                maxWidth: "1320px",
                margin: "0 auto",
                paddingLeft: "24px",
                paddingRight: "24px",
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(kitBanner.images.length, 4)}, minmax(0, 1fr))`,
                gap: "28px",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "360px",
              }}
            >
              {kitBanner.images.map((imgSrc: string, i: number) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "360px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={imgSrc}
                    alt={`${kitBanner.title || "Build Your Kit"} Item ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-full aspect-[16/7.5] sm:aspect-[2400/1100] min-h-[380px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[640px] bg-white flex items-center justify-center">
              <Image
                src={kitBanner.src || "/favior_combo_pack_banner.jpg"}
                alt={kitBanner.alt || kitBanner.title || "Favior Complete Athlete Combo Pack Kit"}
                fill
                priority
                sizes="100vw"
                className="object-contain w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />
            </div>
          )}
        </Link>

        {/* Center Outlined CTA Button matching Bestsellers */}
        <div
          className="flex justify-center w-full"
          style={{
            marginTop: "40px",
            marginBottom: "8px",
          }}
        >
          <Link
            href={kitBanner.linkUrl || "/products/favior-complete-gym-kit"}
            className="inline-flex items-center justify-center bg-transparent hover:bg-[#111111] text-[#111111] hover:text-white border border-[#111111] text-[11px] font-semibold uppercase tracking-[0.18em] leading-none transition-colors duration-200 cursor-pointer"
            style={{
              padding: "16px 36px",
              lineHeight: 1,
            }}
          >
            {kitBanner.cta || "Buy Now"}
          </Link>
        </div>
      </section>
      )}






      {/* ── FAQ Section ── */}
      <FaqSection />

      {/* ── Footer ── */}
      <SiteFooter />
    </>
  );
}
