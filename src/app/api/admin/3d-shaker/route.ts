import { NextResponse } from "next/server"
import { verifySession } from "@/lib/server/dal/auth"
import { get3DShakerData, update3DShakerData } from "@/lib/server/controllers/three-d-shaker.controller"

export async function GET() {
  const session = await verifySession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await get3DShakerData()
  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const session = await verifySession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const updated = await update3DShakerData(body)
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Failed to update 3D shaker banner:", error)
    return NextResponse.json({ error: error?.message || "Failed to update 3D shaker banner" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return PATCH(request)
}
