import type { Metadata } from "next"
import { AppSidebar } from "@/components/admin/navigation/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { get3DShakerData } from "@/lib/server/controllers/three-d-shaker.controller"
import { ThreeDShakerManager } from "@/components/admin/banners/three-d-shaker-manager"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "3D Shaker Banner | Favior Admin",
}

export default async function ThreeDShakerPage() {
  const data = await get3DShakerData()

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <ThreeDShakerManager initialData={data} />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
