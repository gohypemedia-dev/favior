"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WriteReviewForm({ productId, orderId, userId }: { productId: string, orderId: string, userId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you would use a Server Action or API route here.
      // We will create a server action for this.
      const { submitReview } = await import("./actions");
      const result = await submitReview({ productId, orderId, rating, title, text });
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/profile/reviews?tab=my-reviews");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px" }}>
      
      {error && (
        <div style={{ padding: "16px", backgroundColor: "#fef2f2", color: "#991b1b", fontSize: "14px", border: "1px solid #fca5a5" }}>
          {error}
        </div>
      )}

      {/* Rating */}
      <div>
        <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px", color: "#18181b" }}>
          Rate this product *
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <Star 
                size={32} 
                fill={(hoverRating || rating) >= star ? "#eab308" : "none"} 
                color={(hoverRating || rating) >= star ? "#eab308" : "#d4d4d8"} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px", color: "#18181b" }}>
          Review Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your thoughts"
          style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", fontSize: "14px", boxSizing: "border-box" }}
        />
      </div>

      {/* Text */}
      <div>
        <label htmlFor="text" style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px", color: "#18181b" }}>
          Tell us about the product
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you like or dislike?"
          rows={5}
          style={{ width: "100%", padding: "12px", border: "1px solid #e4e4e7", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }}
        />
      </div>

      {/* Mock Upload UI */}
      <div>
        <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px", color: "#18181b" }}>
          Add photos or videos
        </label>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100px", height: "100px", border: "1px dashed #a1a1aa", backgroundColor: "#fafafa", cursor: "pointer" }}>
          <span style={{ fontSize: "24px", color: "#71717a" }}>+</span>
        </div>
        <p style={{ fontSize: "12px", color: "#71717a", marginTop: "8px" }}>Media upload is mocked for now.</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "16px",
          backgroundColor: "#000",
          color: "#fff",
          fontSize: "12px",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          border: "none",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.7 : 1
        }}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>

    </form>
  );
}
