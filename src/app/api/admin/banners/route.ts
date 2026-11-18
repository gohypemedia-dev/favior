import { NextResponse } from "next/server"
import { verifySession } from "@/lib/server/dal/auth"
import { listBanners, createBanner } from "@/lib/server/controllers/banners.controller"

export async function GET(request: Request) {
  const session = await verifySession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || undefined

  const banners = await listBanners(category)
  return NextResponse.json(banners)
}

export async function POST(request: Request) {
  const session = await verifySession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    if (!body.src || !body.title) {
      return NextResponse.json({ error: "Title and Image URL (src) are required." }, { status: 400 })
    }

    const banner = await createBanner({
      title: body.title,
      category: body.category || "hero",
      caption: body.caption || null,
      src: body.src,
      mobileSrc: body.mobileSrc || null,
      images: Array.isArray(body.images) ? body.images : [],
      alt: body.alt || body.title,
      cta: body.cta || "EXPLORE COLLECTION",
      linkUrl: body.linkUrl || "/all-products",
      sortOrder: Number(body.sortOrder) || 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error: any) {
    console.error("Failed to create banner:", error)
    return NextResponse.json({ error: error?.message || "Failed to create banner" }, { status: 500 })
  }
}
