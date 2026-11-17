import { getCurrentUser } from "@/lib/server/dal/auth";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import Link from "next/link";
import { getPendingReviews, getUserReviews } from "@/lib/server/controllers/reviews.controller";

export default async function ReviewsPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const searchParams = await props.searchParams;
  const currentTab = searchParams.tab || "to-review";

  const toReview = await getPendingReviews(user.id);
  const myReviews = await getUserReviews(user.id);

  return (
    <>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: "0 0 32px 0", display: "flex", alignItems: "center", gap: "8px" }}>
        <Star size={20} /> Reviews & Ratings
      </h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid #f4f4f5", marginBottom: "32px" }}>
        <Link 
          href="/profile/reviews?tab=to-review"
          style={{ 
            fontSize: "12px", 
            fontWeight: "bold", 
            textTransform: "uppercase", 
            letterSpacing: "0.05em",
            paddingBottom: "12px",
            textDecoration: "none",
            color: currentTab === "to-review" ? "#18181b" : "#a1a1aa",
            borderBottom: currentTab === "to-review" ? "2px solid #18181b" : "2px solid transparent"
          }}
        >
          To Review ({toReview.length})
        </Link>
        <Link 
          href="/profile/reviews?tab=my-reviews"
          style={{ 
            fontSize: "12px", 
            fontWeight: "bold", 
            textTransform: "uppercase", 
            letterSpacing: "0.05em",
            paddingBottom: "12px",
            textDecoration: "none",
            color: currentTab === "my-reviews" ? "#18181b" : "#a1a1aa",
            borderBottom: currentTab === "my-reviews" ? "2px solid #18181b" : "2px solid transparent"
          }}
        >
          My Reviews ({myReviews.length})
        </Link>
      </div>

      {/* Tab Content: To Review */}
      {currentTab === "to-review" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {toReview.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#71717a", textAlign: "center", padding: "48px 0" }}>You have no products waiting for a review.</p>
          ) : (
            toReview.map((item, idx) => (
              <div key={idx} style={{ border: "1px solid #f4f4f5", padding: "24px", display: "flex", gap: "24px", alignItems: "center" }}>
                {item.product.mainImage ? (
                  <img src={item.product.mainImage} alt={item.product.name} style={{ width: "80px", height: "80px", objectFit: "cover", backgroundColor: "#fafafa" }} />
                ) : (
                  <div style={{ width: "80px", height: "80px", backgroundColor: "#fafafa" }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 4px 0", color: "#18181b" }}>{item.product.name}</p>
                  <p style={{ fontSize: "12px", color: "#71717a", margin: "0 0 16px 0" }}>Delivered on {new Date(item.orderDate).toLocaleDateString()}</p>
                  <Link href={`/profile/reviews/write?productId=${item.product.id}&orderId=${item.orderId}`} style={{ display: "inline-block", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 16px", backgroundColor: "#18181b", color: "#fff", textDecoration: "none" }}>
                    Write a Review
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: My Reviews */}
      {currentTab === "my-reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {myReviews.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#71717a", textAlign: "center", padding: "48px 0" }}>You haven't written any reviews yet.</p>
          ) : (
            myReviews.map((review) => (
              <div key={review.id} style={{ border: "1px solid #f4f4f5", padding: "24px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
                   {review.product.mainImage && (
                    <img src={review.product.mainImage} alt={review.product.name} style={{ width: "48px", height: "48px", objectFit: "cover" }} />
                  )}
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "bold", margin: "0 0 4px 0" }}>{review.product.name}</p>
                    <p style={{ fontSize: "11px", color: "#71717a", margin: 0 }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "#eab308" : "none"} color={i < review.rating ? "#eab308" : "#d4d4d8"} />
                  ))}
                </div>

                {review.title && <h4 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 8px 0" }}>{review.title}</h4>}
                {review.text && <p style={{ fontSize: "14px", color: "#3f3f46", margin: "0 0 16px 0", lineHeight: "1.5" }}>{review.text}</p>}

                {review.images && review.images.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    {review.images.map((img, i) => (
                      <img key={i} src={img} alt="Review" style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "2px" }} />
                    ))}
                  </div>
                )}

                <div style={{ fontSize: "11px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", color: "#a1a1aa" }}>
                  Status: <span style={{ color: review.status === "APPROVED" ? "#166534" : review.status === "REJECTED" ? "#991b1b" : "#ca8a04" }}>{review.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
