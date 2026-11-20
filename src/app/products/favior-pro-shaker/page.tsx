import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Model3D from "@/components/Model3D";
import { ShakerPurchaseOptions } from "@/components/product/ShakerPurchaseOptions";
import { get3DShakerData } from "@/lib/server/controllers/three-d-shaker.controller";

export const dynamic = "force-dynamic";

const loadShaker = cache(get3DShakerData);

export async function generateMetadata(): Promise<Metadata> {
  const shaker = await loadShaker();
  return {
    title: `${shaker.title} | Favior`,
    description: shaker.description,
  };
}

export default async function ShakerProductPage({
  searchParams,
}: {
  searchParams: Promise<{ size?: string | string[] }>;
}) {
  const [shaker, { size }] = await Promise.all([loadShaker(), searchParams]);
  const selectedSize = shaker.variants.find((variant) => variant.name === size)?.name ??
    shaker.variants[0].name;

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <AnnouncementBar />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-24 sm:px-8 sm:pt-28">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-zinc-600">
          <Link href="/" className="hover:text-black">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{shaker.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="h-[340px] rounded-2xl border border-zinc-100 bg-zinc-50 sm:h-[460px]">
            <Model3D
              src={shaker.modelSrc}
              poster={shaker.fallbackImage}
              alt={shaker.title}
              cameraOrbit="0deg 75deg 200%"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-600">
              {shaker.subtitle}
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {shaker.title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">{shaker.description}</p>
            {shaker.features.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                {shaker.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            )}
            <ShakerPurchaseOptions key={selectedSize} shaker={shaker} initialSize={selectedSize} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
