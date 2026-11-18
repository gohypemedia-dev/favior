import { NextResponse } from "next/server"
import { verifySession } from "@/lib/server/dal/auth"
import { updateBanner, deleteBanner } from "@/lib/server/controllers/banners.controller"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    const body = await request.json()
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.category !== undefined) updateData.category = body.category
    if (body.caption !== undefined) updateData.caption = body.caption
    if (body.src !== undefined) updateData.src = body.src
    if (body.mobileSrc !== undefined) updateData.mobileSrc = body.mobileSrc
    if (body.images !== undefined) updateData.images = Array.isArray(body.images) ? body.images : []
    if (body.alt !== undefined) updateData.alt = body.alt
    if (body.cta !== undefined) updateData.cta = body.cta
    if (body.linkUrl !== undefined) updateData.linkUrl = body.linkUrl
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)

    const updated = await updateBanner(id, updateData)
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Failed to update banner:", error)
    return NextResponse.json({ error: error?.message || "Failed to update banner" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    await deleteBanner(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete banner:", error)
    return NextResponse.json({ error: error?.message || "Failed to delete banner" }, { status: 500 })
  }
}
