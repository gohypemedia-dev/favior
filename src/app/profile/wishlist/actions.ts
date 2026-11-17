"use server";

import { toggleWishlist } from "@/lib/server/controllers/wishlist.controller";

export async function toggleWishlistAction(userId: string, productId: string) {
  return await toggleWishlist(userId, productId);
}
