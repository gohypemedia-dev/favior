import { NextResponse } from "next/server"
import { verifySession } from "@/lib/server/dal/auth"
import { listBanners, DEFAULT_HERO_BANNERS } from "@/lib/server/controllers/banners.controller"
import { db } from "@/lib/db"
import { PRODUCT_HIGHLIGHT_IDS } from "@/lib/product-highlights"

export async function POST() {
  const session = await verifySession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    for (const banner of DEFAULT_HERO_BANNERS) {
      const existing = await (db as any).heroBanner.findFirst({
        where: { src: banner.src, id: { notIn: PRODUCT_HIGHLIGHT_IDS } },
      })
      if (!existing) {
        await (db as any).heroBanner.create({ data: banner })
      }
    }

    const banners = await listBanners()
    return NextResponse.json(banners)
  } catch (error: any) {
    console.error("Failed to seed default banners:", error)
    return NextResponse.json({ error: error?.message || "Failed to seed banners" }, { status: 500 })
  }
}
