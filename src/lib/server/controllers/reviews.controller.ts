import { db } from "@/lib/db";
import { ReviewStatus, OrderStatus } from "@prisma/client";

export async function createReview(
  userId: string,
  productId: string,
  orderId: string,
  data: {
    rating: number;
    title?: string;
    text?: string;
    qualityRating?: number;
    valueRating?: number;
    fitRating?: number;
    images?: string[];
    videos?: string[];
  }
) {
  // Check if order is DELIVERED and belongs to user
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== userId) {
    throw new Error("Order not found or access denied");
  }

  if (order.status !== OrderStatus.DELIVERED) {
    throw new Error("You can only review delivered orders");
  }

  // Check if product is in order
  const hasProduct = order.items.some((item) => item.productId === productId);
  if (!hasProduct) {
    throw new Error("Product not found in this order");
  }

  // Check if review already exists
  const existingReview = await db.review.findUnique({
    where: {
      userId_productId_orderId: {
        userId,
        productId,
        orderId,
      },
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product for this order");
  }

  return await db.review.create({
    data: {
      userId,
      productId,
      orderId,
      rating: data.rating,
      title: data.title,
      text: data.text,
      qualityRating: data.qualityRating,
      valueRating: data.valueRating,
      fitRating: data.fitRating,
      images: data.images || [],
      videos: data.videos || [],
      status: ReviewStatus.APPROVED, // Auto-approve for V1, or make PENDING
    },
  });
}

export async function getUserReviews(userId: string) {
  return await db.review.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          mainImage: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPendingReviewsCount(userId: string) {
  // Find products from DELIVERED orders that have not been reviewed by this user
  const deliveredOrders = await db.order.findMany({
    where: {
      userId,
      status: OrderStatus.DELIVERED,
    },
    include: {
      items: true,
      reviews: true,
    },
  });

  let pendingCount = 0;

  for (const order of deliveredOrders) {
    const reviewedProductIds = order.reviews.map((r) => r.productId);
    for (const item of order.items) {
      if (!reviewedProductIds.includes(item.productId)) {
        pendingCount++;
      }
    }
  }

  return pendingCount;
}

export async function getPendingReviews(userId: string) {
  // Get products to review
  const deliveredOrders = await db.order.findMany({
    where: {
      userId,
      status: OrderStatus.DELIVERED,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              mainImage: true,
              price: true,
            },
          },
        },
      },
      reviews: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const toReview = [];

  for (const order of deliveredOrders) {
    const reviewedProductIds = order.reviews.map((r) => r.productId);
    for (const item of order.items) {
      if (!reviewedProductIds.includes(item.productId)) {
        toReview.push({
          orderId: order.id,
          orderDate: order.createdAt,
          product: item.product,
        });
      }
    }
  }

  return toReview;
}

export async function getProductReviews(productId: string) {
  return await db.review.findMany({
    where: {
      productId,
      status: ReviewStatus.APPROVED,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
