"use server";

import { db } from "@/lib/db";
import { ReviewStatus } from "@prisma/client";

export async function getReviewsBySlug(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (!product) return [];

  return await db.review.findMany({
    where: {
      productId: product.id,
      status: ReviewStatus.APPROVED
    },
    include: {
      user: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}
