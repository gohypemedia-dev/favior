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

  // Find or create category
  let category = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: 'gym-accessories' },
        { slug: 'accessories' }
      ]
    }
  })

  if (!category) {
    category = await prisma.category.create({
      data: {
        title: 'Gym Accessories',
        slug: 'gym-accessories',
        description: 'Premium Favior Gym & Training Accessories',
        visible: true,
      }
    })
  }

  const slug = 'favior-luxury-gym-towel'

  // Upsert product
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    await prisma.product.delete({ where: { slug } })
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name: 'Favior Luxury Gym Towel',
      price: '1299',
      oldPrice: '1999',
      discount: '35% OFF',
      rating: 4.9,
      reviewsCount: '48',
      description: 'Engineered for athletes who demand the best. The Favior Luxury Gym Towel is woven from ultra-absorbent, quick-drying organic cotton. Features anti-odor treatment, soft microfiber touch, and comes encased in a signature Favior luxury collector box.',
      mainImage: '/favior_luxury_towel.jpg',
      shippingNotice: 'Ships within 24-48 hours. Free express shipping.',
      quantity: 85,
      showInBestSellers: true,
      categoryId: category.id,
      features: {
        create: [
          { featureText: 'Ultra-absorbent premium organic micro-cotton' },
          { featureText: 'Fast-drying & anti-bacterial technology' },
          { featureText: 'Signature luxury collector gift box included' },
          { featureText: 'Generous workout size for gym benches and machines' }
        ]
      },
      specs: {
        create: [
          { label: 'Material', value: '100% Premium Cotton' },
          { label: 'Color', value: 'Crisp White' },
          { label: 'Packaging', value: 'Luxury Hard Magnetic Box' },
          { label: 'Care', value: 'Machine washable' }
        ]
      },
      colors: {
        create: [
          { name: 'Crisp White', bgHex: '#ffffff', borderHex: '#e5e5e5' }
        ]
      }
    }
  })

  console.log('SUCCESS: Product created successfully!')
  console.log({ id: product.id, name: product.name, slug: product.slug, price: product.price })
}

main().catch((err) => {
  console.error('ERROR:', err)
  process.exit(1)
})
