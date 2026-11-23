"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadProductImage } from "@/lib/client/upload-product-image";
import type { ProductHighlight } from "@/lib/product-highlights";

function HighlightForm({ highlight }: { highlight: ProductHighlight }) {
  const [imageSrc, setImageSrc] = useState(highlight.imageSrc);
  const [busy, setBusy] = useState<"uploading" | "saving" | null>(null);
  const [feedback, setFeedback] = useState("");

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    setBusy("uploading");
    setFeedback("");
    try {
      const uploaded = await uploadProductImage(file);
      setImageSrc(uploaded.url);
      setFeedback("Image uploaded. Save to publish it on product pages.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to upload the image.");
    } finally {
      setBusy(null);
    }
  }

  async function saveHighlight(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.set("id", highlight.id);
    form.set("imageSrc", imageSrc);
    setBusy("saving");
    setFeedback("");

    try {
      const response = await fetch("/api/admin/product-highlights", { method: "PATCH", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save the highlight.");
      setFeedback("Highlight saved.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to save the highlight.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <form onSubmit={saveHighlight} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1rem" }}>
      <fieldset disabled={busy !== null} style={{ display: "grid", gap: "0.875rem", minWidth: 0, fontSize: "0.875rem" }}>
        <div style={{ position: "relative", height: "10rem", borderRadius: "0.5rem", overflow: "hidden", background: "#fafafa" }}>
          <Image src={imageSrc} alt="Highlight preview" fill sizes="(max-width: 640px) 90vw, 400px" style={{ objectFit: "contain" }} />
        </div>
        <label>
          Image
          <Input type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" onChange={uploadImage} />
        </label>
        <label>
          Title
          <Input name="title" defaultValue={highlight.title} maxLength={150} required />
        </label>
        <label>
          Description
          <Textarea name="description" defaultValue={highlight.description} maxLength={2000} rows={4} required />
        </label>
        <label>
          Image alt text
          <Input name="imageAlt" defaultValue={highlight.imageAlt} maxLength={200} />
        </label>
        <div>
          <button type="submit" className="admin-btn admin-btn-primary">
            {busy === "uploading" ? "Uploading image…" : busy === "saving" ? "Saving…" : "Save Highlight"}
          </button>
        </div>
      </fieldset>
      <p role="status" style={{ marginTop: feedback ? "0.5rem" : 0, fontSize: "0.875rem" }}>{feedback}</p>
    </form>
  );
}

export function ProductHighlightsEditor({ highlights }: { highlights: ProductHighlight[] }) {
  return (
    <section aria-labelledby="product-highlights-heading" style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
      <h2 id="product-highlights-heading" style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700 }}>
        Product Highlights
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))", gap: "1rem" }}>
        {highlights.map((highlight) => <HighlightForm key={highlight.id} highlight={highlight} />)}
      </div>
    </section>
  );
}
