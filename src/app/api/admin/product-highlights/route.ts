import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { DEFAULT_PRODUCT_HIGHLIGHTS } from "@/lib/product-highlights";
import { AuthError, requireAdmin } from "@/lib/server/dal/auth";
import { saveProductHighlight } from "@/lib/server/controllers/product-highlights.controller";

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  const form = await request.formData().catch(() => null);
  const id = form?.get("id");
  const title = form?.get("title");
  const description = form?.get("description");
  const imageSrc = form?.get("imageSrc");
  const imageAlt = form?.get("imageAlt");
  const fallback = DEFAULT_PRODUCT_HIGHLIGHTS.find((highlight) => highlight.id === id);

  if (!fallback || typeof title !== "string" || !title.trim() || title.length > 150 ||
    typeof description !== "string" || !description.trim() || description.length > 2000 ||
    typeof imageAlt !== "string" || imageAlt.length > 200 || typeof imageSrc !== "string" ||
    (imageSrc !== fallback.imageSrc && !/^\/api\/media\/products\/\d{4}-\d{2}-\d{2}\/[a-z0-9._-]+$/.test(imageSrc))) {
    return NextResponse.json({ error: "Enter a valid title, description, and image." }, { status: 400 });
  }

  try {
    await saveProductHighlight({
      id: fallback.id,
      title: title.trim(),
      description: description.trim(),
      imageSrc,
      imageAlt: imageAlt.trim(),
    });
    revalidatePath("/products/[slug]", "page");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save product highlight:", error);
    return NextResponse.json({ error: "Unable to save the product highlight." }, { status: 500 });
  }
}
