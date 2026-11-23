import type { Metadata } from "next"
import { AppSidebar } from "@/components/admin/navigation/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { listBanners } from "@/lib/server/controllers/banners.controller"
import { BannerManager } from "@/components/admin/banners/banner-manager"
import { ProductHighlightsEditor } from "@/components/admin/banners/product-highlights-editor"
import { getProductHighlights } from "@/lib/server/controllers/product-highlights.controller"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Hero Banners | Favior Admin",
}

export default async function BannersPage() {
  const [banners, highlights] = await Promise.all([listBanners(), getProductHighlights()])

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <BannerManager initialBanners={banners}>
            <ProductHighlightsEditor highlights={highlights} />
          </BannerManager>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
