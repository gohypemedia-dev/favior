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
  const [dbProducts, activeBanners] = await Promise.all([
    db.product.findMany({
      orderBy: { createdAt: "desc" }
    }),
    listActiveBanners()
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
  const duffleImg: string = duffleProduct?.mainImage ?? "";
  const shakerImg: string = shakerProduct?.mainImage ?? "";

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
      <div id="section-3d-model">
        <Model3DSection />
      </div>

      {/* ── Featured Products Grid ── */}
      <CardGridSection
        title="Bestsellers"
        products={products.slice(0, 4)}
        viewAllHref="/all-products"
      />






      {/* ── Split: Favior Duffle Bag / Text ── */}
      {duffleImg && (
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
            src={duffleImg}
            alt="Favior Heritage Gym Duffle Bag"
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
          <h2 className="serif">Built for the gym. Crafted for travel</h2>
          <p>
            The Favior Heritage Gym Duffle Bag delivers 35L of premium capacity.
            Constructed with heavy-duty water-resistant ballistic canvas, full-grain
            leather accents, brushed antique brass hardware, and a dedicated
            ventilated shoe compartment.
          </p>
          <a href="/all-products" className="btn btn-light" style={{ alignSelf: "flex-start" }}>
            Shop Duffle Bag
          </a>
        </div>
      </section>
      )}

      {/* ── Split: Shaker Text (Left) / Favior Shaker (Right) ── */}
      {shakerImg && (
      <section className="split-section">
        <div className="split-content" style={{ background: "var(--bg-cream)" }}>
          <h2 className="serif" style={{ color: "var(--text-dark)" }}>
            Never miss a rep. <em>Never miss a sip</em>
          </h2>
          <p>
            Crafted from shatterproof, BPA-free smoke Tritan with an integrated
            cyclone turbine mixing wheel. The Favior Pro Series Shaker delivers
            instantaneous, silky-smooth blending with a 100% leak-proof snap lock.
          </p>
          <a href="/shakers" className="btn btn-dark" style={{ alignSelf: "flex-start" }}>
            Shop Shakers
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
            src={shakerImg}
            alt="Favior Phantom Shaker Bottle"
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

      {/* ── Build Your Kit: DB Product Grid Banner ── */}
      {kitImages.length > 0 && (
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
            marginBottom: "24px",
          }}
        >
          <h2
            className="font-heading font-bold uppercase tracking-tight"
            style={{ fontSize: "28px", lineHeight: "1.1", color: "#111111" }}
          >
            Build Your Kit
          </h2>
        </div>

        {/* End-to-End High-Impact Combo Pack Banner */}
        <Link
          href="/all-products"
          className="group relative block w-full bg-white transition-opacity hover:opacity-95"
          style={{ width: "100%" }}
        >
          <div className="relative w-full aspect-[16/7.5] sm:aspect-[2400/1100] min-h-[380px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[640px] bg-white flex items-center justify-center">
            <Image
              src="/favior_combo_pack_banner.jpg"
              alt="Favior Complete Athlete Combo Pack Kit"
              fill
              priority
              sizes="100vw"
              className="object-contain w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            />
          </div>
        </Link>
      </section>
      )}






      {/* ── FAQ Section ── */}
      <FaqSection />

      {/* ── Footer ── */}
      <SiteFooter />
    </>
  );
}
