import { NextResponse } from "next/server"
import { verifySession } from "@/lib/server/dal/auth"
import { reorderBanners, listBanners } from "@/lib/server/controllers/banners.controller"

export async function POST(request: Request) {
  const session = await verifySession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { bannerIds } = body
    if (!Array.isArray(bannerIds)) {
      return NextResponse.json({ error: "bannerIds array is required" }, { status: 400 })
    }

    await reorderBanners(bannerIds)
    const updatedBanners = await listBanners()
    return NextResponse.json(updatedBanners)
  } catch (error: any) {
    console.error("Failed to reorder banners:", error)
    return NextResponse.json({ error: error?.message || "Failed to reorder banners" }, { status: 500 })
  }
}
