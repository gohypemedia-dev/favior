export type ProductImage = {
  src: string
  alt: string
  objectPosition?: string
}

export type ProductSwatch = {
  name: string
  value: string
}

export type DeliveryPerk = {
  label: string
  detail: string
  icon: "truck" | "exchange" | "shield" | "card"
}

export type ProductCard = {
  id: string
  merchandiseId?: string
  handle?: string
  href?: string
  image: string
  alt: string
  badge?: string
  featured?: boolean
  sizes?: string[]
  swatches: string[]
  gallery?: string[]
  name?: string
  price?: string
  category?: "Heritage" | "Noyer" | "Crystal" | "Atelier"
  type?: "Sunglasses" | "Optical"
  shape?: string
  material?: string
  colorGroup?: string
}

export type ProductDetail = {
  id?: string
  merchandiseId?: string
  slug: string
  editLabel: string
  title: string
  breadcrumb: Array<{
    label: string
    href?: string
  }>
  originalPrice: string
  price: string
  sold: string
  rating: string
  description: string
  detailsBody: string
  careNotes: string[]
  shippingNotes: string[]
  colorName: string
  colors: ProductSwatch[]
  sizes: string[]
  gallery: ProductImage[]
  deliveryPerks: DeliveryPerk[]
  completeLook: ProductImage[]
  highlights?: any[]
  specifications?: string[]
}

export const trendingProducts: ProductCard[] = [
  {
    id: "product-1",
    image: "/favior_heritage_duffle_bag.jpg",
    alt: "Favior Heritage Gym Duffle Bag",
    badge: "BESTSELLER",
    swatches: ["#000000"],
    gallery: [
      "/favior_heritage_duffle_bag.jpg",
    ],
  },
  {
    id: "product-2",
    image: "/favior_pro_shaker_black.jpg",
    alt: "Favior Phantom Shaker Bottle",
    badge: "ESSENTIAL",
    swatches: ["#111111"],
    gallery: [
      "/favior_pro_shaker_black.jpg",
    ],
  },
  {
    id: "product-3",
    image: "/favior_complete_gym_kit.jpg",
    alt: "Favior Complete Gym Kit",
    badge: "COMBO PACK",
    swatches: ["#111111"],
    gallery: [
      "/favior_complete_gym_kit.jpg",
    ],
  },
  {
    id: "product-4",
    image: "/favior_luxury_towel.jpg",
    alt: "Favior Luxury Gym Towel",
    badge: "LUXURY",
    swatches: ["#1a1a1a"],
    gallery: [
      "/favior_luxury_towel.jpg",
    ],
  },
]

const sharedChairPose = {
  src: "/favior_heritage_duffle_bag.jpg",
  alt: "Premium tortoiseshell D-frame sunglasses styled next to protective leather case",
}

export const featuredProduct: ProductDetail = {
  id: "favior-heritage-gym-duffle-bag",
  merchandiseId: "favior-heritage-gym-duffle-bag",
  slug: "favior-heritage-gym-duffle-bag",
  editLabel: "FAVIOR PRO ATHLETICS",
  title: "Favior Heritage Gym Duffle Bag (35L)",
  breadcrumb: [
    { label: "Homepage", href: "/" },
    { label: "Collections", href: "/all-products" },
    { label: "Heritage Duffle Bag" },
  ],
  originalPrice: "₹4,999",
  price: "₹3,499",
  sold: "320 Sold",
  rating: "4.9",
  description:
    "The Favior Heritage Gym Duffle Bag delivers 35L of premium capacity. Constructed with heavy-duty water-resistant ballistic canvas, full-grain leather accents, brushed antique brass hardware, and a dedicated ventilated shoe compartment.",
  detailsBody:
    "Engineered for high-performance athletes with durable YKK zippers, reinforced bottom base, and ergonomic padded shoulder strap.",
  careNotes: [
    "Wipe clean with a damp microfiber cloth.",
    "Air dry in a shaded, well-ventilated area.",
  ],
  shippingNotes: [
    "Standard delivery in 2-4 business days across India.",
    "Free replacement warranty for transit damage.",
  ],
  colorName: "Midnight Black",
  colors: [
    { name: "Midnight Black", value: "#000000" },
  ],
  sizes: [],
  gallery: [
    { src: "/favior_heritage_duffle_bag.jpg", alt: "Favior Heritage Gym Duffle Bag", objectPosition: "center" },
    { src: "/favior_pro_shaker_black.jpg", alt: "Favior Phantom Shaker", objectPosition: "center" },
    { src: "/favior_complete_gym_kit.jpg", alt: "Favior Complete Gym Kit", objectPosition: "center" },
    { src: "/favior_luxury_towel.jpg", alt: "Favior Luxury Gym Towel", objectPosition: "center" },
  ],
  deliveryPerks: [
    {
      label: "Fast delivery",
      detail: "2-4 days",
      icon: "truck",
    },
    {
      label: "Easy exchange",
      detail: "7 days",
      icon: "exchange",
    },
    {
      label: "Secure checkout",
      detail: "UPI / COD",
      icon: "shield",
    },
    {
      label: "Tracked shipping",
      detail: "Live updates",
      icon: "card",
    },
  ],
  completeLook: [],
}

export function getAllProductDetails() {
  return [featuredProduct];
}

export function getProductBySlug(slug: string) {
  // In a real app, this would find the product by slug.
  // For now, return the featured product as a fallback.
  return featuredProduct;
}
