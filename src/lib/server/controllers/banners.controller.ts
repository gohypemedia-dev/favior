import { db } from "@/lib/db"

export type HeroBannerItem = {
  id: string
  title: string
  category: string | null
  caption: string | null
  src: string
  mobileSrc: string | null
  images?: string[]
  alt: string
  cta: string | null
  linkUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export const BANNER_TYPES = [
  { value: "hero", label: "Hero Section (Homepage Slider)", description: "Main top banner on the homepage" },
  { value: "split_duffle", label: "Split Banner 1: Built for the Gym (Duffle Bag)", description: "Editorial split banner with duffle image on left & dark content on right" },
  { value: "split_shaker", label: "Split Banner 2: Never Miss a Rep (Shaker Bottle)", description: "Editorial split banner with light content on left & shaker image on right" },
  { value: "build_your_kit", label: "Build Your Kit Banner", description: "Banner for the custom kit creation section" },
  { value: "split_section", label: "Other Split Editorial Section", description: "Full-width featured product spotlight banner" },
  { value: "promotional", label: "Promotional Banner", description: "Special campaign, drop, or sale banner" },
] as const

export const DEFAULT_HERO_BANNERS = [
  {
    title: "PREMIUM FITNESS ESSENTIALS",
    category: "hero",
    caption: "Crafted for performance. Designed for you.",
    src: "/IMG_5576.PNG",
    mobileSrc: null,
    alt: "Favior Black Collection - Shaker, Gym Bag, Towel, and Deodorant",
    cta: "EXPLORE COLLECTION",
    linkUrl: "/all-products",
    sortOrder: 0,
    isActive: true,
  },
  {
    title: "PREMIUM FITNESS ESSENTIALS",
    category: "hero",
    caption: "Crafted for performance. Designed for you.",
    src: "/ChatGPT Image Aug 3, 2026, 03_43_32 PM.png",
    mobileSrc: null,
    alt: "Favior Beige Collection - Shaker, Gym Bag, Towel, and Deodorant",
    cta: "EXPLORE COLLECTION",
    linkUrl: "/all-products",
    sortOrder: 1,
    isActive: true,
  },
  {
    title: "Built for the gym. Crafted for travel",
    category: "split_duffle",
    caption:
      "The Favior Heritage Gym Duffle Bag delivers 35L of premium capacity. Constructed with heavy-duty water-resistant ballistic canvas, full-grain leather accents, brushed antique brass hardware, and a dedicated ventilated shoe compartment.",
    src: "/favior_heritage_duffle_bag.jpg",
    mobileSrc: null,
    alt: "Favior Heritage Gym Duffle Bag",
    cta: "SHOP DUFFLE BAG",
    linkUrl: "/all-products",
    sortOrder: 2,
    isActive: true,
  },
  {
    title: "Never miss a rep. Never miss a sip",
    category: "split_shaker",
    caption:
      "Crafted from shatterproof, BPA-free smoke Tritan with an integrated cyclone turbine mixing wheel. The Favior Pro Series Shaker delivers instantaneous, silky-smooth blending with a 100% leak-proof snap lock.",
    src: "/favior_pro_shaker_black.jpg",
    mobileSrc: null,
    images: [],
    alt: "Favior Phantom Shaker Bottle",
    cta: "SHOP SHAKERS",
    linkUrl: "/shakers",
    sortOrder: 3,
    isActive: true,
  },
  {
    title: "Build Your Kit",
    category: "build_your_kit",
    caption: "Customize your personal athlete bundle with premium shaker, duffle, and towel.",
    src: "/favior_combo_pack_banner.jpg",
    mobileSrc: null,
    images: [
      "/favior_heritage_duffle_bag.jpg",
      "/favior_pro_shaker_black.jpg",
      "/favior_luxury_towel.jpg",
    ],
    alt: "Build Your Kit - Duffle Bag, Shaker Bottle, and Towel",
    cta: "Buy Now",
    linkUrl: "/products/favior-complete-gym-kit",
    sortOrder: 4,
    isActive: true,
  },
]

export async function ensureDefaultBannersSeeded() {
  try {
    const count = await (db as any).heroBanner.count()
    if (count === 0) {
      for (const banner of DEFAULT_HERO_BANNERS) {
        await (db as any).heroBanner.create({ data: banner })
      }
    } else {
      // Ensure split duffle banner exists
      const hasDuffle = await (db as any).heroBanner.findFirst({
        where: { category: "split_duffle" },
      })
      if (!hasDuffle) {
        await (db as any).heroBanner.create({
          data: {
            title: "Built for the gym. Crafted for travel",
            category: "split_duffle",
            caption:
              "The Favior Heritage Gym Duffle Bag delivers 35L of premium capacity. Constructed with heavy-duty water-resistant ballistic canvas, full-grain leather accents, brushed antique brass hardware, and a dedicated ventilated shoe compartment.",
            src: "/favior_heritage_duffle_bag.jpg",
            mobileSrc: null,
            images: [],
            alt: "Favior Heritage Gym Duffle Bag",
            cta: "SHOP DUFFLE BAG",
            linkUrl: "/all-products",
            sortOrder: 2,
            isActive: true,
          },
        })
      }

      // Ensure split shaker banner exists
      const hasShaker = await (db as any).heroBanner.findFirst({
        where: { category: "split_shaker" },
      })
      if (!hasShaker) {
        await (db as any).heroBanner.create({
          data: {
            title: "Never miss a rep. Never miss a sip",
            category: "split_shaker",
            caption:
              "Crafted from shatterproof, BPA-free smoke Tritan with an integrated cyclone turbine mixing wheel. The Favior Pro Series Shaker delivers instantaneous, silky-smooth blending with a 100% leak-proof snap lock.",
            src: "/favior_pro_shaker_black.jpg",
            mobileSrc: null,
            images: [],
            alt: "Favior Phantom Shaker Bottle",
            cta: "SHOP SHAKERS",
            linkUrl: "/shakers",
            sortOrder: 3,
            isActive: true,
          },
        })
      }

      // Ensure build your kit banner exists
      const hasKit = await (db as any).heroBanner.findFirst({
        where: { category: "build_your_kit" },
      })
      if (!hasKit) {
        await (db as any).heroBanner.create({
          data: {
            title: "Build Your Kit",
            category: "build_your_kit",
            caption: "Customize your personal athlete bundle with premium shaker, duffle, and towel.",
            src: "/favior_combo_pack_banner.jpg",
            mobileSrc: null,
            images: [
              "/favior_heritage_duffle_bag.jpg",
              "/favior_pro_shaker_black.jpg",
              "/favior_luxury_towel.jpg",
            ],
            alt: "Build Your Kit - Duffle Bag, Shaker Bottle, and Towel",
            cta: "Buy Now",
            linkUrl: "/products/favior-complete-gym-kit",
            sortOrder: 4,
            isActive: true,
          },
        })
      }
    }
  } catch (err) {
    console.error("Failed to seed default banners:", err)
  }
}

export async function listBanners(category?: string) {
  await ensureDefaultBannersSeeded()
  const where: any = {}
  if (category && category !== "all") {
    if (category === "hero") {
      where.OR = [{ category: "hero" }, { category: null }]
    } else {
      where.category = category
    }
  } else {
    where.NOT = { category: "3d_shaker" }
  }
  return (db as any).heroBanner.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  })
}

export async function listActiveBanners(category?: string) {
  await ensureDefaultBannersSeeded()
  const where: any = { isActive: true }
  if (category && category !== "all") {
    if (category === "hero") {
      where.OR = [{ category: "hero" }, { category: null }]
    } else {
      where.category = category
    }
  } else {
    where.NOT = { category: "3d_shaker" }
  }
  return (db as any).heroBanner.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  })
}

export async function createBanner(data: {
  title: string
  category?: string
  caption?: string | null
  src: string
  mobileSrc?: string | null
  images?: string[]
  alt: string
  cta?: string | null
  linkUrl?: string | null
  sortOrder?: number
  isActive?: boolean
}) {
  return (db as any).heroBanner.create({
    data: {
      title: data.title,
      category: data.category || "hero",
      caption: data.caption || null,
      src: data.src,
      mobileSrc: data.mobileSrc || null,
      images: data.images || [],
      alt: data.alt || data.title,
      cta: data.cta || "EXPLORE COLLECTION",
      linkUrl: data.linkUrl || "/all-products",
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  })
}

export async function updateBanner(
  id: string,
  data: Partial<{
    title: string
    category: string | null
    caption: string | null
    src: string
    mobileSrc: string | null
    images: string[]
    alt: string
    cta: string | null
    linkUrl: string | null
    sortOrder: number
    isActive: boolean
  }>
) {
  return (db as any).heroBanner.update({
    where: { id },
    data,
  })
}

export async function deleteBanner(id: string) {
  return (db as any).heroBanner.delete({
    where: { id },
  })
}

export async function reorderBanners(bannerIds: string[]) {
  const updates = bannerIds.map((id, index) =>
    (db as any).heroBanner.update({
      where: { id },
      data: { sortOrder: index },
    })
  )
  return Promise.all(updates)
}
