import { LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", margin: "0 0 32px 0", display: "flex", alignItems: "center", gap: "8px" }}>
        <LifeBuoy size={20} /> Help & Support
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <div style={{ border: "1px solid #f4f4f5", padding: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 16px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Frequently Asked Questions</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <details style={{ cursor: "pointer" }}>
              <summary style={{ fontSize: "14px", fontWeight: "500", color: "#18181b", outline: "none" }}>How do I track my order?</summary>
              <p style={{ fontSize: "14px", color: "#71717a", marginTop: "8px", lineHeight: "1.5" }}>
                You can track your order by navigating to the "My Orders" section and clicking the "Track Order" button next to your active orders.
              </p>
            </details>
            <details style={{ cursor: "pointer" }}>
              <summary style={{ fontSize: "14px", fontWeight: "500", color: "#18181b", outline: "none" }}>What is your return policy?</summary>
              <p style={{ fontSize: "14px", color: "#71717a", marginTop: "8px", lineHeight: "1.5" }}>
                We offer a 30-day return policy for all unused and unopened items. Go to the "Returns & Refunds" section to initiate a return.
              </p>
            </details>
            <details style={{ cursor: "pointer" }}>
              <summary style={{ fontSize: "14px", fontWeight: "500", color: "#18181b", outline: "none" }}>How can I change my shipping address?</summary>
              <p style={{ fontSize: "14px", color: "#71717a", marginTop: "8px", lineHeight: "1.5" }}>
                You can manage your shipping addresses in the "Addresses" section. If you need to change the address for an active order, please contact support immediately.
              </p>
            </details>
          </div>
        </div>

        <div style={{ border: "1px solid #f4f4f5", padding: "24px", backgroundColor: "#fafafa", textAlign: "center" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Still need help?</h3>
          <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>Our support team is available 24/7 to assist you.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link href="mailto:support@favior.com" style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 24px", backgroundColor: "#000", color: "#fff", textDecoration: "none" }}>
              Email Support
            </Link>
            <Link href="tel:+1234567890" style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px 24px", border: "1px solid #e4e4e7", color: "#18181b", textDecoration: "none" }}>
              Call Us
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
