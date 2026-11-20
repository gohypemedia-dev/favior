import { db } from "@/lib/db"

export type ThreeDShakerVariant = {
  name: string
  price: string
  desc?: string
}

export type ThreeDShakerData = {
  id: string
  title: string
  subtitle: string
  description: string
  modelSrc: string
  fallbackImage: string
  features: string[]
  variants: ThreeDShakerVariant[]
  topMarquee: string
  bottomMarquee: string
  isActive: boolean
}

export const DEFAULT_3D_SHAKER_DATA: ThreeDShakerData = {
  id: "3d-shaker-banner",
  title: "FAVIOR SHAKER",
  subtitle: "Pro Series",
  description: "Engineered for the dedicated athlete. Leak-proof guarantee with a premium matte finish.",
  modelSrc: "/3d model/favior.glb",
  fallbackImage: "/favior_pro_shaker_black.jpg",
  features: [
    "Premium Food-Grade Stainless Steel",
    "Double-wall vacuum insulation",
  ],
  variants: [
    { name: "300ml", price: "599", desc: "Pro Series • 300ml" },
    { name: "750ml", price: "1,499", desc: "Pro Series • 750ml" },
  ],
  topMarquee: "FAVIOR PRO SERIES • LEAK-PROOF GUARANTEE • FOOD-GRADE STAINLESS STEEL • DOUBLE-WALL VACUUM •",
  bottomMarquee: "PREMIUM PERFORMANCE • ENGINEERED FOR ATHLETES • MATTE BLACK FINISH • 300ML / 750ML •",
  isActive: true,
}

function parseBannerRecord(record: any): ThreeDShakerData {
  let extra: any = {}
  if (record.linkUrl) {
    try {
      extra = JSON.parse(record.linkUrl)
    } catch {
      extra = {}
    }
  }

  return {
    id: record.id,
    title: record.title || DEFAULT_3D_SHAKER_DATA.title,
    subtitle: extra.subtitle || record.cta || DEFAULT_3D_SHAKER_DATA.subtitle,
    description: record.caption || DEFAULT_3D_SHAKER_DATA.description,
    modelSrc: record.src || DEFAULT_3D_SHAKER_DATA.modelSrc,
    fallbackImage: record.mobileSrc || DEFAULT_3D_SHAKER_DATA.fallbackImage,
    features: Array.isArray(extra.features) && extra.features.length > 0
      ? extra.features
      : DEFAULT_3D_SHAKER_DATA.features,
    variants: Array.isArray(extra.variants) && extra.variants.length > 0
      ? extra.variants
      : DEFAULT_3D_SHAKER_DATA.variants,
    topMarquee: extra.topMarquee || DEFAULT_3D_SHAKER_DATA.topMarquee,
    bottomMarquee: extra.bottomMarquee || DEFAULT_3D_SHAKER_DATA.bottomMarquee,
    isActive: record.isActive !== undefined ? record.isActive : true,
  }
}

export async function get3DShakerData(): Promise<ThreeDShakerData> {
  try {
    const existing = await (db as any).heroBanner.findFirst({
      where: { category: "3d_shaker" },
    })

    if (!existing) {
      // Seed initial 3D shaker banner record
      const extraPayload = JSON.stringify({
        subtitle: DEFAULT_3D_SHAKER_DATA.subtitle,
        features: DEFAULT_3D_SHAKER_DATA.features,
        variants: DEFAULT_3D_SHAKER_DATA.variants,
        topMarquee: DEFAULT_3D_SHAKER_DATA.topMarquee,
        bottomMarquee: DEFAULT_3D_SHAKER_DATA.bottomMarquee,
      })

      const created = await (db as any).heroBanner.create({
        data: {
          title: DEFAULT_3D_SHAKER_DATA.title,
          category: "3d_shaker",
          caption: DEFAULT_3D_SHAKER_DATA.description,
          src: DEFAULT_3D_SHAKER_DATA.modelSrc,
          mobileSrc: DEFAULT_3D_SHAKER_DATA.fallbackImage,
          alt: "Favior 3D Shaker",
          cta: DEFAULT_3D_SHAKER_DATA.subtitle,
          linkUrl: extraPayload,
          sortOrder: 99,
          isActive: true,
        },
      })
      return parseBannerRecord(created)
    }

    return parseBannerRecord(existing)
  } catch (err) {
    console.error("Failed to load 3D shaker data:", err)
    return DEFAULT_3D_SHAKER_DATA
  }
}

export async function update3DShakerData(data: Partial<ThreeDShakerData>): Promise<ThreeDShakerData> {
  const current = await get3DShakerData()

  const updatedTitle = data.title !== undefined ? data.title : current.title
  const updatedSubtitle = data.subtitle !== undefined ? data.subtitle : current.subtitle
  const updatedDescription = data.description !== undefined ? data.description : current.description
  const updatedModelSrc = data.modelSrc !== undefined ? data.modelSrc : current.modelSrc
  const updatedFallbackImage = data.fallbackImage !== undefined ? data.fallbackImage : current.fallbackImage
  const updatedFeatures = data.features !== undefined ? data.features : current.features
  const updatedVariants = data.variants !== undefined ? data.variants : current.variants
  const updatedTopMarquee = data.topMarquee !== undefined ? data.topMarquee : current.topMarquee
  const updatedBottomMarquee = data.bottomMarquee !== undefined ? data.bottomMarquee : current.bottomMarquee
  const updatedIsActive = data.isActive !== undefined ? data.isActive : current.isActive

  const extraPayload = JSON.stringify({
    subtitle: updatedSubtitle,
    features: updatedFeatures,
    variants: updatedVariants,
    topMarquee: updatedTopMarquee,
    bottomMarquee: updatedBottomMarquee,
  })

  const updatedRecord = await (db as any).heroBanner.update({
    where: { id: current.id },
    data: {
      title: updatedTitle,
      caption: updatedDescription,
      src: updatedModelSrc,
      mobileSrc: updatedFallbackImage,
      cta: updatedSubtitle,
      linkUrl: extraPayload,
      isActive: updatedIsActive,
    },
  })

  return parseBannerRecord(updatedRecord)
}
