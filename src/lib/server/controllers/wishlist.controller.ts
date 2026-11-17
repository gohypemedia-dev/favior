import { db } from "@/lib/db";

export async function getWishlist(userId: string) {
  return await db.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          oldPrice: true,
          discount: true,
          mainImage: true,
          quantity: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleWishlist(userId: string, productId: string) {
  const existing = await db.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    await db.wishlist.delete({
      where: { id: existing.id },
    });
    return { added: false };
  } else {
    await db.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
    return { added: true };
  }
}
