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

  // Find or create category for Bags / Accessories
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

  const slug = 'favior-heritage-gym-duffle-bag'

  // Upsert product
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    await prisma.product.delete({ where: { slug } })
  }

  const product = await prisma.product.create({
    data: {
      slug,
      name: 'Favior Heritage Gym Duffle Bag (35L)',
      price: '₹3,499.00',
      oldPrice: '₹5,999.00',
      discount: '42% OFF',
      rating: 4.9,
      reviewsCount: '88',
      description: 'The ultimate crossover between high-performance gym utility and timeless luxury travel. Built with ultra-durable water-resistant canvas, full-grain leather reinforced trims, and antique brass rivets. Features a dedicated shoe compartment, padded interior organizer, and detachable shoulder strap.',
      mainImage: '/favior_heritage_duffle_bag.jpg',
      shippingNotice: 'In Stock. Complimentary Express Delivery across India.',
      quantity: 65,
      showInBestSellers: true,
      categoryId: category.id,
      features: {
        create: [
          { featureText: 'Heavy-duty water-repellent canvas with full-grain leather handles & trims' },
          { featureText: 'Brushed antique brass hardware and smooth industrial dual zippers' },
          { featureText: 'Dedicated ventilated side compartment for training shoes / wet gym gear' },
          { featureText: 'Padded interior sleeve fitting laptops up to 15-inch plus phone/key organizers' },
          { featureText: 'Detachable padded leather shoulder strap and protective metal base feet' }
        ]
      },
      specs: {
        create: [
          { label: 'Capacity', value: '35 Liters' },
          { label: 'Dimensions', value: '50 cm x 26 cm x 26 cm' },
          { label: 'Material', value: 'Water-Resistant Canvas & Vegan Leather Trims' },
          { label: 'Hardware', value: 'Brushed Antique Brass' },
          { label: 'Colorway', value: 'Classic Black with Brass Accent' }
        ]
      },
      colors: {
        create: [
          { name: 'Classic Black', bgHex: '#121212', borderHex: '#C5A059' }
        ]
      }
    }
  })

  console.log('SUCCESS: Heritage Duffle Bag created successfully!')
  console.log({ id: product.id, name: product.name, slug: product.slug, price: product.price })
}

main().catch((err) => {
  console.error('ERROR:', err)
  process.exit(1)
})
