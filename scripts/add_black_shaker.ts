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

  const slug = 'favior-pro-series-shaker-stealth-black'

  // Upsert product
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    await prisma.product.delete({ where: { slug } })
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name: 'Favior Pro Series Shaker (700ml) - Stealth Onyx',
      price: '899',
      oldPrice: '1499',
      discount: '40% OFF',
      rating: 4.9,
      reviewsCount: '72',
      description: 'The stealth edition of our signature shaker bottle. Built with deep smoke-tinted Tritan and an ultra-durable matte black lid. Equipped with an integrated turbine mixing wheel to deliver silky-smooth protein shakes in seconds with zero clumps. 100% leak-proof, BPA-free, and sweat-resistant.',
      mainImage: '/favior_pro_shaker_black.jpg',
      shippingNotice: 'In Stock. Ships in 24 hours with free express shipping.',
      quantity: 150,
      showInBestSellers: true,
      categoryId: category.id,
      features: {
        create: [
          { featureText: 'Cyclone Turbine Blending Wheel for instantaneous, clump-free shakes' },
          { featureText: 'Matte Black Leak-Proof Snap Cap with airtight silicone seal' },
          { featureText: 'Smoke-tinted impact-resistant Tritan body (100% BPA & DEHP Free)' },
          { featureText: 'Tactile ergonomic finger loop for gym bags and active transport' },
          { featureText: 'Embossed milliliter and ounce measurement indicators on back' }
        ]
      },
      specs: {
        create: [
          { label: 'Capacity', value: '700 ml / 24 oz' },
          { label: 'Colorway', value: 'Stealth Onyx & Smoke Clear' },
          { label: 'Material', value: 'Food-Grade BPA-Free Tritan & PP' },
          { label: 'Care', value: 'Dishwasher Safe (Top Rack)' },
          { label: 'Dimensions', value: '22 cm x 8.5 cm' }
        ]
      },
      colors: {
        create: [
          { name: 'Stealth Onyx', bgHex: '#1C1C1E', borderHex: '#3A3A3C' }
        ]
      }
    }
  })

  console.log('SUCCESS: Stealth Onyx Shaker created successfully!')
  console.log({ id: product.id, name: product.name, slug: product.slug, price: product.price })
}

main().catch((err) => {
  console.error('ERROR:', err)
  process.exit(1)
})
