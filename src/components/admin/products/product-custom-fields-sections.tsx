"use client";

import { useState } from "react";
import { Plus, Trash2, Palette, Ruler, ShieldCheck, FileText, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const inputStyle: React.CSSProperties = {
  height: "2.5rem",
  width: "100%",
  borderRadius: "0.5rem",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgba(0,0,0,0.25)",
  backgroundColor: "white",
  paddingLeft: "0.75rem",
  paddingRight: "0.75rem",
  fontSize: "0.875rem",
  outline: "none",
};

const cardStyle: React.CSSProperties = {
  marginTop: "1rem",
  overflow: "hidden",
  borderRadius: "0.75rem",
  borderWidth: "1px",
  borderColor: "rgba(0,0,0,0.1)",
  backgroundColor: "rgb(255,255,255)",
  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem",
  padding: "1rem",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};

// ─── 1. Brand, Badges & Social Proof Section ───────────────────────────────────

export interface BrandBadgesProps {
  subtitle: string;
  setSubtitle: (val: string) => void;
  verifiedBadge: string;
  setVerifiedBadge: (val: string) => void;
  socialProofText: string;
  setSocialProofText: (val: string) => void;
  shippingNotice: string;
  setShippingNotice: (val: string) => void;
  rating: string;
  setRating: (val: string) => void;
  reviewsCount: string;
  setReviewsCount: (val: string) => void;
}

export function ProductBadgesSection({
  subtitle,
  setSubtitle,
  verifiedBadge,
  setVerifiedBadge,
  socialProofText,
  setSocialProofText,
  shippingNotice,
  setShippingNotice,
  rating,
  setRating,
  reviewsCount,
  setReviewsCount,
}: BrandBadgesProps) {
  return (
    <section style={cardStyle}>
      <div style={cardHeaderStyle}>
        <div>
          <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(0,0,0,0.8)", margin: 0 }}>
            Brand, Ratings &amp; Trust Badges
          </h2>
          <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "rgba(0,0,0,0.5)", margin: 0 }}>
            Configure the brand subtitle, verified order badge, rating, and storefront proof text.
          </p>
        </div>
      </div>

      <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          <label style={{ display: "grid", gap: "0.375rem", fontSize: "0.875rem", color: "rgba(0,0,0,0.75)" }}>
            <span style={{ fontWeight: 500 }}>Brand Tagline / Subtitle</span>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. FAVIOR PRO ATHLETICS"
              style={inputStyle}
            />
            <span style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.45)" }}>
              Displayed in uppercase above the product title.
            </span>
          </label>

          <label style={{ display: "grid", gap: "0.375rem", fontSize: "0.875rem", color: "rgba(0,0,0,0.75)" }}>
            <span style={{ fontWeight: 500 }}>Verified Orders Pill Badge</span>
            <input
              value={verifiedBadge}
              onChange={(e) => setVerifiedBadge(e.target.value)}
              placeholder="e.g. 88 VERIFIED ORDERS"
              style={inputStyle}
            />
            <span style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.45)" }}>
              Dark badge next to the product price.
            </span>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          <label style={{ display: "grid", gap: "0.375rem", fontSize: "0.875rem", color: "rgba(0,0,0,0.75)" }}>
            <span style={{ fontWeight: 500 }}>Storefront Rating (0.0 - 5.0)</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="4.9"
              style={inputStyle}
            />
            <span style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.45)" }}>
              Displayed beside gold star rating.
            </span>
          </label>

          <label style={{ display: "grid", gap: "0.375rem", fontSize: "0.875rem", color: "rgba(0,0,0,0.75)" }}>
            <span style={{ fontWeight: 500 }}>Reviews Count</span>
            <input
              value={reviewsCount}
              onChange={(e) => setReviewsCount(e.target.value)}
              placeholder="e.g. 128"
              style={inputStyle}
            />
            <span style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.45)" }}>
              Displayed as &quot;(128 REVIEWS)&quot;.
            </span>
          </label>
        </div>

        <label style={{ display: "grid", gap: "0.375rem", fontSize: "0.875rem", color: "rgba(0,0,0,0.75)" }}>
          <span style={{ fontWeight: 500 }}>Tax &amp; Shipping Notice (Under Price)</span>
          <input
            value={shippingNotice}
            onChange={(e) => setShippingNotice(e.target.value)}
            placeholder="INCL. OF ALL TAXES • FREE SHIPPING ABOVE ₹999"
            style={inputStyle}
          />
        </label>

        <label style={{ display: "grid", gap: "0.375rem", fontSize: "0.875rem", color: "rgba(0,0,0,0.75)" }}>
          <span style={{ fontWeight: 500 }}>Social Proof Line (Below Buy Buttons)</span>
          <input
            value={socialProofText}
            onChange={(e) => setSocialProofText(e.target.value)}
            placeholder="1,238+ SOLD TODAY • LOVED BY THE COMMUNITY"
            style={inputStyle}
          />
          <span style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.45)" }}>
            Displays customer avatars with live community social proof.
          </span>
        </label>
      </div>
    </section>
  );
}

// ─── 2. Product Color Swatches Section ─────────────────────────────────────────

export type ColorItem = {
  name: string;
  bgHex: string;
};

export interface ProductColorsSectionProps {
  colors: ColorItem[];
  onChange: (colors: ColorItem[]) => void;
}

export function ProductColorsSection({ colors, onChange }: ProductColorsSectionProps) {
  const [newName, setNewName] = useState("");
  const [newHex, setNewHex] = useState("#111111");

  function handleAdd() {
    if (!newName.trim()) return;
    onChange([...colors, { name: newName.trim(), bgHex: newHex || "#111111" }]);
    setNewName("");
    setNewHex("#111111");
  }

  function handleRemove(index: number) {
    const updated = [...colors];
    updated.splice(index, 1);
    onChange(updated);
  }

  return (
    <section style={cardStyle}>
      <div style={cardHeaderStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Palette className="size-4 text-black/60" />
          <div>
            <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(0,0,0,0.8)", margin: 0 }}>
              Colors &amp; Swatches
            </h2>
            <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "rgba(0,0,0,0.5)", margin: 0 }}>
              Add color variants with circular swatch previews for the product page.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "1rem" }}>
        {/* Existing Swatches */}
        {colors.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
            {colors.map((c, idx) => (
              <div
                key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.375rem 0.625rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  backgroundColor: "#ffffff",
                  fontSize: "0.8125rem",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "999px",
                    backgroundColor: c.bgHex,
                    border: "1px solid rgba(0,0,0,0.2)",
                    display: "inline-block",
                  }}
                />
                <span style={{ fontWeight: 500, color: "#111111" }}>{c.name}</span>
                <span style={{ fontSize: "0.6875rem", color: "#666666" }}>({c.bgHex})</span>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Remove color"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.45)", margin: "0 0 1rem 0" }}>
            No custom colors added yet. (Will default to Standard swatch on store).
          </p>
        )}

        {/* Add New Color Form */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Color name (e.g. Classic Black)"
            style={{ ...inputStyle, flex: "1 1 180px", minWidth: "160px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              border: "1px solid rgba(0,0,0,0.25)",
              borderRadius: "0.5rem",
              padding: "0 0.5rem",
              height: "2.5rem",
              backgroundColor: "white",
            }}
          >
            <input
              type="color"
              value={newHex}
              onChange={(e) => setNewHex(e.target.value)}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              title="Pick color"
            />
            <input
              value={newHex}
              onChange={(e) => setNewHex(e.target.value)}
              placeholder="#111111"
              style={{
                width: "75px",
                border: "none",
                outline: "none",
                fontSize: "0.8125rem",
                fontFamily: "monospace",
              }}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            style={{ height: "2.5rem", padding: "0 1rem" }}
          >
            <Plus className="size-4" style={{ marginRight: "0.25rem" }} /> Add Color
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Sizes & Volume Options Section ─────────────────────────────────────────

export interface ProductSizesSectionProps {
  sizes: string[];
  onChange: (sizes: string[]) => void;
}

export function ProductSizesSection({ sizes, onChange }: ProductSizesSectionProps) {
  const [newSize, setNewSize] = useState("");

  function handleAdd() {
    if (!newSize.trim()) return;
    onChange([...sizes, newSize.trim()]);
    setNewSize("");
  }

  function handleRemove(index: number) {
    const updated = [...sizes];
    updated.splice(index, 1);
    onChange(updated);
  }

  return (
    <section style={cardStyle}>
      <div style={cardHeaderStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Ruler className="size-4 text-black/60" />
          <div>
            <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(0,0,0,0.8)", margin: 0 }}>
              Sizes &amp; Volume Options
            </h2>
            <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "rgba(0,0,0,0.5)", margin: 0 }}>
              Options like &quot;35L&quot;, &quot;300ml&quot;, &quot;750ml&quot;, &quot;S&quot;, &quot;M&quot;, &quot;L&quot;. Leave empty if not applicable.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "1rem" }}>
        {sizes.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {sizes.map((s, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.3125rem 0.625rem",
                  borderRadius: "0.375rem",
                  backgroundColor: "#f3f4f6",
                  color: "#111827",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  border: "1px solid #e5e7eb",
                }}
              >
                {s}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "#9ca3af",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Remove size"
                >
                  <Trash2 className="size-3 text-red-500 hover:text-red-700" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.45)", margin: "0 0 1rem 0" }}>
            No sizes or volume variants configured.
          </p>
        )}

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="e.g. 35L or 750ml or Large"
            style={{ ...inputStyle, maxWidth: "260px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={handleAdd} style={{ height: "2.5rem" }}>
            <Plus className="size-4" style={{ marginRight: "0.25rem" }} /> Add Size
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── 4. Product Details Body & Accordions Section ─────────────────────────────

export interface ProductDetailsAccordionsProps {
  detailsBody: string;
  setDetailsBody: (val: string) => void;
  careNotes: string[];
  setCareNotes: (val: string[]) => void;
  shippingNotes: string[];
  setShippingNotes: (val: string[]) => void;
}

export function ProductDetailsAccordionsSection({
  detailsBody,
  setDetailsBody,
  careNotes,
  setCareNotes,
  shippingNotes,
  setShippingNotes,
}: ProductDetailsAccordionsProps) {
  // Care notes helpers
  function addCareNote() {
    setCareNotes([...careNotes, ""]);
  }
  function updateCareNote(idx: number, val: string) {
    const updated = [...careNotes];
    updated[idx] = val;
    setCareNotes(updated);
  }
  function removeCareNote(idx: number) {
    const updated = [...careNotes];
    updated.splice(idx, 1);
    setCareNotes(updated);
  }

  // Shipping notes helpers
  function addShippingNote() {
    setShippingNotes([...shippingNotes, ""]);
  }
  function updateShippingNote(idx: number, val: string) {
    const updated = [...shippingNotes];
    updated[idx] = val;
    setShippingNotes(updated);
  }
  function removeShippingNote(idx: number) {
    const updated = [...shippingNotes];
    updated.splice(idx, 1);
    setShippingNotes(updated);
  }

  return (
    <section style={cardStyle}>
      <div style={cardHeaderStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText className="size-4 text-black/60" />
          <div>
            <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(0,0,0,0.8)", margin: 0 }}>
              Product Details &amp; Accordions (Care, Shipping)
            </h2>
            <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "rgba(0,0,0,0.5)", margin: 0 }}>
              Deep-dive narrative paragraph and expandable accordion tabs on the storefront product page.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "1rem", display: "grid", gap: "1.25rem" }}>
        {/* In-depth PRODUCT DETAILS paragraph */}
        <label style={{ display: "grid", gap: "0.375rem", fontSize: "0.875rem", color: "rgba(0,0,0,0.75)" }}>
          <span style={{ fontWeight: 600 }}>PRODUCT DETAILS (In-depth Narrative Paragraph)</span>
          <Textarea
            value={detailsBody}
            onChange={(e) => setDetailsBody(e.target.value)}
            placeholder="The ultimate crossover between high-performance gym utility and timeless luxury travel. Built with ultra-durable water-resistant canvas, full-grain leather reinforced trims, and antique brass rivets. Features a dedicated shoe compartment, padded interior organizer, and detachable shoulder strap."
            rows={4}
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              border: "1px solid rgba(0,0,0,0.25)",
              backgroundColor: "white",
              padding: "0.625rem 0.75rem",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
          <span style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.45)" }}>
            Displayed under the &quot;PRODUCT DETAILS&quot; heading right above the feature bullets.
          </span>
        </label>

        {/* DETAILS & CARE Accordion */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <div>
              <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#111111", margin: 0 }}>
                DETAILS &amp; CARE (Accordion Items)
              </h3>
              <p style={{ fontSize: "0.75rem", color: "#666666", margin: "0.125rem 0 0 0" }}>
                Care instructions displayed inside the collapsible &quot;DETAILS &amp; CARE&quot; tab.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addCareNote}>
              <Plus className="size-3.5" style={{ marginRight: "0.25rem" }} /> Add Care Note
            </Button>
          </div>

          {careNotes.length > 0 ? (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {careNotes.map((note, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Input
                    value={note}
                    onChange={(e) => updateCareNote(idx, e.target.value)}
                    placeholder="e.g. Hand wash or rinse with lukewarm water after intense sessions."
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCareNote(idx)}
                    style={{ color: "#ef4444", flexShrink: 0 }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.75rem", color: "#888888", fontStyle: "italic", margin: 0 }}>
              No custom care notes. (Defaults to standard care instructions).
            </p>
          )}
        </div>

        {/* SHIPPING & PAYMENT Accordion */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <div>
              <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#111111", margin: 0 }}>
                SHIPPING &amp; PAYMENT (Accordion Items)
              </h3>
              <p style={{ fontSize: "0.75rem", color: "#666666", margin: "0.125rem 0 0 0" }}>
                Delivery and warranty notes displayed inside the collapsible &quot;SHIPPING &amp; PAYMENT&quot; tab.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addShippingNote}>
              <Plus className="size-3.5" style={{ marginRight: "0.25rem" }} /> Add Shipping Note
            </Button>
          </div>

          {shippingNotes.length > 0 ? (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {shippingNotes.map((note, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Input
                    value={note}
                    onChange={(e) => updateShippingNote(idx, e.target.value)}
                    placeholder="e.g. 100% genuine product guarantee with instant replacement warranty."
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeShippingNote(idx)}
                    style={{ color: "#ef4444", flexShrink: 0 }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.75rem", color: "#888888", fontStyle: "italic", margin: 0 }}>
              No custom shipping notes. (Defaults to standard delivery notes).
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
