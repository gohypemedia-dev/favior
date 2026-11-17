import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  // Find or create category for shakers
  let category = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: 'shakers' },
        { slug: 'gym-accessories' },
        { title: { contains: 'Shaker', mode: 'insensitive' } }
      ]
    }
  })

  if (!category) {
    category = await prisma.category.create({
      data: {
        title: 'Shakers',
        slug: 'shakers',
        description: 'Engineered gym shakers and hydration gear',
        visible: true,
      }
    })
  }

  const slug = 'favior-pro-series-shaker-nude'

  // Upsert product
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    await prisma.product.delete({ where: { slug } })
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name: 'Favior Pro Series Shaker (700ml) - Desert Nude',
      price: '899',
      oldPrice: '1499',
      discount: '40% OFF',
      rating: 4.9,
      reviewsCount: '64',
      description: 'Precision engineered for smooth, lump-free protein shakes. Crafted from crystal-clear shatterproof Tritan with a signature Desert Nude lid and built-in turbine mixing wheel. Completely leak-proof, BPA-free, and designed to fit modern active lifestyles.',
      mainImage: '/favior_pro_shaker_nude.jpg',
      shippingNotice: 'In Stock. Ships in 24 hours with free tracking.',
      quantity: 120,
      showInBestSellers: true,
      categoryId: category.id,
      features: {
        create: [
          { featureText: 'Turbine Mixing Wheel for clump-free protein & pre-workout blending' },
          { featureText: '100% Leak-Proof flip cap with security snap lock' },
          { featureText: 'Premium BPA-free, odor & stain resistant crystal clear body' },
          { featureText: 'Ergonomic loop handle for gym bags and active transport' },
          { featureText: 'Embossed milliliter and ounce measurement markings' }
        ]
      },
      specs: {
        create: [
          { label: 'Capacity', value: '700 ml / 24 oz' },
          { label: 'Colorway', value: 'Desert Nude & Smoke Clear' },
          { label: 'Material', value: 'Food-Grade BPA-Free Tritan & PP' },
          { label: 'Care', value: 'Dishwasher Safe (Top Rack)' },
          { label: 'Dimensions', value: '22 cm x 8.5 cm' }
        ]
      },
      colors: {
        create: [
          { name: 'Desert Nude', bgHex: '#E3C8AA', borderHex: '#D1B291' }
        ]
      }
    }
  })

  console.log('SUCCESS: Shaker product created successfully!')
  console.log({ id: product.id, name: product.name, slug: product.slug, price: product.price })
}

main().catch((err) => {
  console.error('ERROR:', err)
  process.exit(1)
})
