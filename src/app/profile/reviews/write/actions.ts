"use server";

import { getCurrentUser } from "@/lib/server/dal/auth";
import { createReview } from "@/lib/server/controllers/reviews.controller";
import { revalidatePath } from "next/cache";

export async function submitReview(data: {
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  text?: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to submit a review." };
    }

    await createReview(user.id, data.productId, data.orderId, {
      rating: data.rating,
      title: data.title,
      text: data.text,
    });

    revalidatePath(`/profile/reviews`);
    revalidatePath(`/product/[slug]`); // we don't have the slug here, but we can revalidate the layout if needed.
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to submit review" };
  }
}
