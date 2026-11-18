"use client"

import { useState } from "react"
import {
  BoxIcon,
  UploadIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
  RefreshCwIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"
import { toast } from "sonner"
import Model3D from "@/components/Model3D"
import type { ThreeDShakerData } from "@/lib/server/controllers/three-d-shaker.controller"
import { uploadProductImage } from "@/lib/client/upload-product-image"

export function ThreeDShakerManager({ initialData }: { initialData: ThreeDShakerData }) {
  const [data, setData] = useState<ThreeDShakerData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingModel, setIsUploadingModel] = useState(false)

  // Feature Bullets Management
  function handleAddFeature() {
    setData((prev) => ({
      ...prev,
      features: [...prev.features, "New feature specification"],
    }))
  }

  function handleUpdateFeature(index: number, val: string) {
    setData((prev) => {
      const updated = [...prev.features]
      updated[index] = val
      return { ...prev, features: updated }
    })
  }

  function handleRemoveFeature(index: number) {
    setData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  // Variants Management
  function handleAddVariant() {
    setData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "1000ml", price: "1,999", desc: "Pro Series • 1000ml" }],
    }))
  }

  function handleUpdateVariant(index: number, field: "name" | "price", val: string) {
    setData((prev) => {
      const updated = [...prev.variants]
      updated[index] = { ...updated[index], [field]: val }
      return { ...prev, variants: updated }
    })
  }

  function handleRemoveVariant(index: number) {
    if (data.variants.length <= 1) {
      toast.error("At least one volume variant is required")
      return
    }
    setData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  // File Upload Handlers
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingImage(true)
    try {
      const uploaded = await uploadProductImage(file)
      setData((prev) => ({ ...prev, fallbackImage: uploaded.url }))
      toast.success("Image uploaded successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Image upload failed")
    } finally {
      setIsUploadingImage(false)
    }
  }

  async function handleModelFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingModel(true)
    try {
      const uploaded = await uploadProductImage(file)
      setData((prev) => ({ ...prev, modelSrc: uploaded.url }))
      toast.success("3D Model uploaded successfully!")
    } catch (err) {
      console.error(err)
      toast.error("3D model upload failed (check file size and network)")
    } finally {
      setIsUploadingModel(false)
    }
  }

  // Save Changes
  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/3d-shaker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.error || "Failed to update 3D Shaker banner")
      }

      const updated = await res.json()
      setData(updated)
      toast.success("3D Shaker Banner updated successfully!")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || "Failed to save changes")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{
      display: "flex",
      flex: "1 1 0%",
      flexDirection: "column",
      gap: "1.5rem",
      backgroundColor: "#f6f6f6",
      padding: "1.5rem",
      minHeight: "100vh",
    }}>
      {/* Top Header */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.5rem",
              backgroundColor: "#111827",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <BoxIcon style={{ width: "1.25rem", height: "1.25rem" }} />
            </div>
            <div>
              <h1 style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#111827",
                margin: 0,
                lineHeight: 1.2,
              }}>
                3D Shaker Banner Management
              </h1>
              <p style={{ marginTop: "0.25rem", fontSize: "0.8125rem", color: "#6b7280", margin: 0 }}>
                Control the 3D bottle model, specifications, prices, bullet features, and marquee ribbons.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a
            href="/#section-3d-model"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
          >
            <span>View Live Section</span>
            <ExternalLinkIcon style={{ width: "0.875rem", height: "0.875rem", color: "#6b7280" }} />
          </a>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSubmitting}
            className="admin-btn admin-btn-primary"
          >
            {isSubmitting ? (
              <Loader2Icon style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
            ) : null}
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <form onSubmit={handleSave} style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
        gap: "1.5rem",
        alignItems: "start",
      }}>
        {/* ── LEFT COLUMN: 3D Model Asset & Media ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}>
          {/* 3D Model Live Canvas Card */}
          <div style={{
            borderRadius: "0.875rem",
            border: "1.5px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BoxIcon style={{ width: "1rem", height: "1rem", color: "#111827" }} />
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827", margin: 0 }}>
                  3D Shaker Interactive Preview
                </h3>
              </div>
              <span className="admin-pill-badge" style={{ backgroundColor: "#f3f4f6", color: "#374151" }}>
                Interactive Canvas
              </span>
            </div>

            {/* Live 3D Model Interactive Viewport */}
            <div style={{
              position: "relative",
              width: "100%",
              height: "360px",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              backgroundColor: "#fcfcfc",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
            }}>
              <Model3D
                src={data.modelSrc}
                alt={data.title}
                cameraOrbit="0deg 75deg 200%"
              />
              <div style={{
                position: "absolute",
                bottom: "0.75rem",
                left: "0.75rem",
                borderRadius: "0.375rem",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(4px)",
                padding: "0.25rem 0.625rem",
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "#ffffff",
              }}>
                Drag to rotate 3D bottle
              </div>
            </div>

            {/* 3D Model GLB / GLTF Source Path */}
            <div style={{ marginTop: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                3D Model File Path or URL (.glb / .gltf) *
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="text"
                  required
                  placeholder="/3d model/favior.glb or https://..."
                  value={data.modelSrc}
                  onChange={(e) => setData({ ...data, modelSrc: e.target.value })}
                  style={{
                    flex: 1,
                    padding: "0.625rem 0.875rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    fontFamily: "monospace",
                    fontSize: "0.8125rem",
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <label className="admin-btn admin-btn-secondary" style={{ height: "40px", minHeight: "40px" }}>
                  {isUploadingModel ? (
                    <Loader2Icon style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
                  ) : (
                    <UploadIcon style={{ width: "1rem", height: "1rem" }} />
                  )}
                  <span>Upload .glb</span>
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    style={{ display: "none" }}
                    onChange={handleModelFileUpload}
                  />
                </label>
              </div>
              <p style={{ margin: "0.375rem 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                Current default model is stored locally in <code style={{ backgroundColor: "#f3f4f6", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>/3d model/favior.glb</code>
              </p>
            </div>

            {/* Fallback Poster Image */}
            <div style={{ marginTop: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                Fallback / Cart Product Thumbnail Image *
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="text"
                  required
                  placeholder="/favior_pro_shaker_black.jpg or https://..."
                  value={data.fallbackImage}
                  onChange={(e) => setData({ ...data, fallbackImage: e.target.value })}
                  style={{
                    flex: 1,
                    padding: "0.625rem 0.875rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    fontFamily: "monospace",
                    fontSize: "0.8125rem",
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <label className="admin-btn admin-btn-secondary" style={{ height: "40px", minHeight: "40px" }}>
                  {isUploadingImage ? (
                    <Loader2Icon style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
                  ) : (
                    <UploadIcon style={{ width: "1rem", height: "1rem" }} />
                  )}
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Live Visibility Status Toggle */}
            <div style={{
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.875rem 1rem",
              borderRadius: "0.625rem",
              border: "1.5px solid #e5e7eb",
              backgroundColor: data.isActive ? "#f0fdf4" : "#f9fafb",
            }}>
              <div>
                <label htmlFor="activeToggle3D" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#111827", cursor: "pointer" }}>
                  Display 3D Shaker Section on Homepage
                </label>
                <p style={{ margin: "0.125rem 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                  Status: <strong>{data.isActive ? "Published & Visible" : "Hidden / Draft"}</strong>
                </p>
              </div>
              <input
                type="checkbox"
                id="activeToggle3D"
                checked={data.isActive}
                onChange={(e) => setData({ ...data, isActive: e.target.checked })}
                style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer", accentColor: "#111827" }}
              />
            </div>
          </div>

          {/* Marquee Ticker Settings Card */}
          <div style={{
            borderRadius: "0.875rem",
            border: "1.5px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827", margin: "0 0 1rem 0" }}>
              Marquee Tickers (Moving Top & Bottom Banners)
            </h3>

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                Top Moving Marquee Text
              </label>
              <textarea
                rows={2}
                value={data.topMarquee}
                onChange={(e) => setData({ ...data, topMarquee: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.8125rem",
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                Bottom Moving Marquee Text
              </label>
              <textarea
                rows={2}
                value={data.bottomMarquee}
                onChange={(e) => setData({ ...data, bottomMarquee: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.8125rem",
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Specifications, Bullets, Variants ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}>
          {/* Information & Copy Card */}
          <div style={{
            borderRadius: "0.875rem",
            border: "1.5px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827", margin: "0 0 1rem 0" }}>
              Right-Side Product Information
            </h3>

            {/* Title & Subtitle */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FAVIOR SHAKER"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                  Subtitle / Series Tag *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PRO SERIES"
                  value={data.subtitle}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    fontSize: "0.875rem",
                    color: "#111827",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                Description Paragraph *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Engineered for the dedicated athlete. Leak-proof guarantee with a premium matte finish."
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.8125rem",
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Feature Bullets */}
            <div style={{ marginTop: "1.25rem", borderTop: "1px solid #f3f4f6", paddingTop: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1f2937" }}>
                  Key Feature Bullet Points
                </label>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="admin-btn admin-btn-secondary"
                  style={{ height: "30px", minHeight: "30px", padding: "0 0.75rem", fontSize: "11px" }}
                >
                  <PlusIcon style={{ width: "12px", height: "12px" }} />
                  <span>Add Feature</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {data.features.map((feat, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af", width: "20px" }}>
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                      placeholder="e.g. Double-wall vacuum insulation"
                      style={{
                        flex: 1,
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d1d5db",
                        fontSize: "0.8125rem",
                        color: "#111827",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "0.375rem",
                        border: "1px solid #fecaca",
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        cursor: "pointer",
                      }}
                      title="Remove feature"
                    >
                      <Trash2Icon style={{ width: "13px", height: "13px" }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Volume Variants & Prices */}
            <div style={{ marginTop: "1.25rem", borderTop: "1px solid #f3f4f6", paddingTop: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1f2937" }}>
                    Volume Variants & Prices (₹)
                  </label>
                  <p style={{ margin: "0.125rem 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                    Pill buttons on live site allow user to toggle between sizes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="admin-btn admin-btn-secondary"
                  style={{ height: "30px", minHeight: "30px", padding: "0 0.75rem", fontSize: "11px" }}
                >
                  <PlusIcon style={{ width: "12px", height: "12px" }} />
                  <span>Add Size</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {data.variants.map((variant, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr auto",
                      gap: "0.625rem",
                      alignItems: "center",
                      padding: "0.625rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#6b7280" }}>
                        Size / Name
                      </span>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => handleUpdateVariant(idx, "name", e.target.value)}
                        placeholder="e.g. 300ml"
                        style={{
                          width: "100%",
                          marginTop: "0.25rem",
                          padding: "0.4rem 0.625rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #d1d5db",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "#111827",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div>
                      <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#6b7280" }}>
                        Price (₹)
                      </span>
                      <input
                        type="text"
                        value={variant.price}
                        onChange={(e) => handleUpdateVariant(idx, "price", e.target.value)}
                        placeholder="e.g. 599"
                        style={{
                          width: "100%",
                          marginTop: "0.25rem",
                          padding: "0.4rem 0.625rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #d1d5db",
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          color: "#111827",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ paddingTop: "1rem" }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        disabled={data.variants.length <= 1}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "0.375rem",
                          border: "1px solid #fecaca",
                          backgroundColor: "#fef2f2",
                          color: "#dc2626",
                          cursor: data.variants.length <= 1 ? "not-allowed" : "pointer",
                          opacity: data.variants.length <= 1 ? 0.3 : 1,
                        }}
                        title="Remove variant"
                      >
                        <Trash2Icon style={{ width: "13px", height: "13px" }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save Button */}
            <div style={{ marginTop: "1.75rem", borderTop: "1px solid #f3f4f6", paddingTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="admin-btn admin-btn-primary"
                style={{ height: "42px", minHeight: "42px", padding: "0 1.75rem" }}
              >
                {isSubmitting ? (
                  <Loader2Icon style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
                ) : null}
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
