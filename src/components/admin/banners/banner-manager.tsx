"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  PlusIcon,
  Trash2Icon,
  PencilIcon,
  ImageIcon,
  EyeIcon,
  EyeOffIcon,
  UploadIcon,
  Loader2Icon,
  XIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  LayersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronsUpIcon,
  BoxIcon,
} from "lucide-react"
import { toast } from "sonner"
import type { HeroBannerItem } from "@/lib/server/controllers/banners.controller"
import { uploadProductImage } from "@/lib/client/upload-product-image"

const BANNER_TYPE_OPTIONS = [
  { value: "hero", label: "Hero Section Banner (Main Homepage Slider)", desc: "Displayed at top of homepage with headline, tagline, and trust badges." },
  { value: "hero", label: "Hero Section Banner (Main Homepage Slider)", desc: "Displayed at top of homepage with headline, tagline, and CTA button." },
  { value: "split_duffle", label: "Split Banner 1: Built for the Gym (Duffle Bag)", desc: "Editorial split banner with duffle image on left & dark content on right." },
  { value: "split_shaker", label: "Split Banner 2: Never Miss a Rep (Shaker Bottle)", desc: "Editorial split banner with light content on left & shaker bottle on right." },
  { value: "build_your_kit", label: "Build Your Kit Section Banner", desc: "Displayed above or inside the custom kit builder section." },
  { value: "split_section", label: "Split Editorial Feature Banner", desc: "Full-width featured spotlight editorial banner." },
  { value: "split_section", label: "Other Split Editorial Feature Banner", desc: "Full-width featured spotlight editorial banner." },
  { value: "promotional", label: "Promotional / Sale Banner", desc: "Campaign drops, seasonal sale highlights." },
]

export function BannerManager({ initialBanners }: { initialBanners: HeroBannerItem[] }) {
  const [banners, setBanners] = useState<HeroBannerItem[]>(initialBanners)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<HeroBannerItem | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false)
  const [isUploadingMobile, setIsUploadingMobile] = useState(false)
  const [isUploadingMulti, setIsUploadingMulti] = useState(false)
  const [multiUrlInput, setMultiUrlInput] = useState("")

  useEffect(() => {
    if (initialBanners && initialBanners.length > 0) {
      setBanners(initialBanners)
    } else {
      fetch("/api/admin/banners")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setBanners(data)
        })
        .catch(() => { })
    }
  }, [initialBanners])

  async function handleRestoreDefaults() {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/banners/seed", { method: "POST" })
      if (!res.ok) throw new Error("Failed to restore default banners")
      const data = await res.json()
      setBanners(data)
      toast.success("Default banners loaded successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to load default banners")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "hero",
    caption: "",
    src: "",
    mobileSrc: "",
    images: [] as string[],
    alt: "",
    cta: "EXPLORE COLLECTION",
    linkUrl: "/all-products",
    sortOrder: 0,
    isActive: true,
  })

  function openAddModal() {
    setEditingBanner(null)
    setFormData({
      title: "",
      category: "hero",
      caption: "",
      src: "",
      mobileSrc: "",
      images: [],
      alt: "",
      cta: "EXPLORE COLLECTION",
      linkUrl: "/all-products",
      sortOrder: banners.length,
      isActive: true,
    })
    setMultiUrlInput("")
    setIsModalOpen(true)
  }

  function openEditModal(banner: HeroBannerItem) {
    setEditingBanner(banner)
    setFormData({
      title: banner.title || "",
      category: banner.category || "hero",
      caption: banner.caption || "",
      src: banner.src || "",
      mobileSrc: banner.mobileSrc || "",
      images: banner.images || [],
      alt: banner.alt || banner.title || "",
      cta: banner.cta || "EXPLORE COLLECTION",
      linkUrl: banner.linkUrl || "/all-products",
      sortOrder: banner.sortOrder ?? 0,
      isActive: banner.isActive,
    })
    setMultiUrlInput("")
    setIsModalOpen(true)
  }

  // Reorder Handlers
  async function saveReorder(newBanners: HeroBannerItem[]) {
    // Optimistic local state update
    const updatedWithSort = newBanners.map((b, idx) => ({ ...b, sortOrder: idx }))
    setBanners(updatedWithSort)

    try {
      const bannerIds = newBanners.map((b) => b.id)
      const res = await fetch("/api/admin/banners/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerIds }),
      })

      if (!res.ok) {
        throw new Error("Failed to save reorder")
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setBanners(data)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to persist order")
    }
  }

  function handleMoveToTop(bannerId: string) {
    const currentIndex = banners.findIndex((b) => b.id === bannerId)
    if (currentIndex <= 0) return
    const target = banners[currentIndex]
    const rest = banners.filter((b) => b.id !== bannerId)
    const updated = [target, ...rest]
    saveReorder(updated)
    toast.success(`"${target.title}" set to TOP (#1)!`)
  }

  function handleMoveUp(index: number) {
    if (index <= 0) return
    const updated = [...banners]
    const temp = updated[index]
    updated[index] = updated[index - 1]
    updated[index - 1] = temp
    saveReorder(updated)
    toast.success("Banner moved up")
  }

  function handleMoveDown(index: number) {
    if (index >= banners.length - 1) return
    const updated = [...banners]
    const temp = updated[index]
    updated[index] = updated[index + 1]
    updated[index + 1] = temp
    saveReorder(updated)
    toast.success("Banner moved down")
  }

  function handleSetPosition(bannerId: string, newPosition: number) {
    const currentIndex = banners.findIndex((b) => b.id === bannerId)
    if (currentIndex === -1 || newPosition < 0 || newPosition >= banners.length) return
    if (currentIndex === newPosition) return

    const updated = [...banners]
    const [movedItem] = updated.splice(currentIndex, 1)
    updated.splice(newPosition, 0, movedItem)
    saveReorder(updated)
    toast.success(`Moved to position #${newPosition + 1}`)
  }

  async function handleToggleActive(banner: HeroBannerItem) {
    const newStatus = !banner.isActive
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, isActive: newStatus } : b))
    )

    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      })

      if (!res.ok) {
        throw new Error("Failed to update status")
      }
      toast.success(`Banner ${newStatus ? "activated" : "deactivated"}`)
    } catch {
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, isActive: banner.isActive } : b))
      )
      toast.error("Failed to update banner status")
    }
  }

  async function handleDelete(id: string) {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete banner")

      setBanners((prev) => prev.filter((b) => b.id !== id))
      toast.success("Banner deleted successfully")
      setDeleteTargetId(null)
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDesktopFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingDesktop(true)
    try {
      const uploaded = await uploadProductImage(file)
      setFormData((prev) => ({ ...prev, src: uploaded.url }))
      toast.success("Desktop image uploaded successfully")
    } catch (err) {
      console.error(err)
      toast.error("Image upload failed")
    } finally {
      setIsUploadingDesktop(false)
    }
  }

  async function handleMobileFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingMobile(true)
    try {
      const uploaded = await uploadProductImage(file)
      setFormData((prev) => ({ ...prev, mobileSrc: uploaded.url }))
      toast.success("Mobile image uploaded successfully")
    } catch (err) {
      console.error(err)
      toast.error("Mobile image upload failed")
    } finally {
      setIsUploadingMobile(false)
    }
  }

  async function handleMultiImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setIsUploadingMulti(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of files) {
        const res = await uploadProductImage(file)
        if (res?.url) uploadedUrls.push(res.url)
      }
      setFormData((prev) => {
        const nextImages = [...(prev.images || []), ...uploadedUrls]
        return {
          ...prev,
          images: nextImages,
          src: prev.src || nextImages[0] || "",
        }
      })
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to upload some images")
    } finally {
      setIsUploadingMulti(false)
      e.target.value = ""
    }
  }

  function handleAddMultiImageUrl() {
    if (!multiUrlInput.trim()) return
    setFormData((prev) => {
      const nextImages = [...(prev.images || []), multiUrlInput.trim()]
      return {
        ...prev,
        images: nextImages,
        src: prev.src || nextImages[0] || "",
      }
    })
    setMultiUrlInput("")
  }

  function handleRemoveMultiImage(index: number) {
    setFormData((prev) => {
      const nextImages = [...(prev.images || [])]
      nextImages.splice(index, 1)
      return {
        ...prev,
        images: nextImages,
        src: prev.src === prev.images?.[index] ? (nextImages[0] || "") : prev.src,
      }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("Banner title/headline is required")
      return
    }

    const effectiveSrc = formData.src.trim() || formData.images[0] || ""
    if (!effectiveSrc) {
      toast.error("Banner Desktop Image or at least 1 image is required")
      return
    }

    const payload = {
      ...formData,
      src: effectiveSrc,
    }

    setIsSubmitting(true)
    try {
      if (editingBanner) {
        const res = await fetch(`/api/admin/banners/${editingBanner.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to update banner")
        }
        const updated = await res.json()

        setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
        toast.success("Banner updated successfully!")
      } else {
        const res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to create banner")
        }
        const created = await res.json()

        setBanners((prev) => [...prev, created])
        toast.success("New banner created successfully!")
      }
      setIsModalOpen(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || "Failed to save banner")
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
      {/* Header Bar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <h1 style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#111827",
              margin: 0,
              lineHeight: 1.2,
            }}>
              Banner Management
            </h1>
            <span className="admin-pill-badge" style={{ backgroundColor: "#111827", color: "#ffffff" }}>
              {banners.length} Total Banners
            </span>
          </div>
          <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "#6b7280", lineHeight: 1.4 }}>
            All website banners in vertical display order. Use position controls to set any banner to top or move up/down.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={handleRestoreDefaults}
            disabled={isSubmitting}
            className="admin-btn admin-btn-secondary"
          >
            {isSubmitting ? (
              <Loader2Icon style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
            ) : (
              <RefreshCwIcon style={{ width: "1rem", height: "1rem", color: "#6b7280" }} />
            )}
            <span>Restore Defaults</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="admin-btn admin-btn-primary"
          >
            <PlusIcon style={{ width: "1rem", height: "1rem" }} />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Live Storefront Status Banner */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        borderRadius: "0.75rem",
        border: "1.5px solid #e5e7eb",
        backgroundColor: "#ffffff",
        padding: "0.875rem 1.25rem",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}>
        <div>
          <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", margin: 0 }}>
            Vertical Display Order (Top to Bottom)
          </h2>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.125rem 0 0 0" }}>
            The banner at position <strong>#1 (TOP)</strong> appears first on the website. Click <strong>&quot;Set to Top&quot;</strong> or arrow buttons to reorder instantly.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-secondary"
          style={{ height: "34px", minHeight: "34px", padding: "0 0.875rem", fontSize: "0.75rem" }}
        >
          <span>View Live Storefront</span>
          <ExternalLinkIcon style={{ width: "0.75rem", height: "0.75rem", color: "#6b7280" }} />
        </a>
      </div>

      {/* Vertical Banners Stack List */}
      {banners.length === 0 ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "1rem",
          border: "1px dashed #d1d5db",
          backgroundColor: "#ffffff",
          padding: "4rem 2rem",
          textAlign: "center",
        }}>
          <div style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "9999px",
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <ImageIcon style={{ width: "1.5rem", height: "1.5rem", color: "#9ca3af" }} />
          </div>
          <h3 style={{ marginTop: "1rem", fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>
            No banners created yet
          </h3>
          <p style={{ marginTop: "0.25rem", maxWidth: "24rem", fontSize: "0.8125rem", color: "#6b7280" }}>
            Add your custom banner or restore default hero banners to get started immediately.
          </p>
          <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={handleRestoreDefaults}
              disabled={isSubmitting}
              className="admin-btn admin-btn-secondary"
            >
              {isSubmitting ? (
                <Loader2Icon style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
              ) : (
                <RefreshCwIcon style={{ width: "1rem", height: "1rem" }} />
              )}
              <span>Restore Defaults</span>
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="admin-btn admin-btn-primary"
            >
              <PlusIcon style={{ width: "1rem", height: "1rem" }} />
              <span>Add Banner</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
          {banners.map((banner, index) => {
            const isTop = index === 0
            const isHero = !banner.category || banner.category === "hero"
            const placementLabel =
              BANNER_TYPE_OPTIONS.find((t) => t.value === banner.category)?.label ||
              (isHero ? "Hero Section Banner" : banner.category)

            return (
              <div
                key={banner.id}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  borderRadius: "0.875rem",
                  border: isTop ? "2px solid #111827" : "1.5px solid #e5e7eb",
                  backgroundColor: "#ffffff",
                  boxShadow: isTop ? "0 4px 14px rgba(0, 0, 0, 0.08)" : "0 1px 3px rgba(0, 0, 0, 0.03)",
                  opacity: banner.isActive ? 1 : 0.65,
                  transition: "all 0.15s ease",
                  overflow: "hidden",
                }}
              >
                {/* 1. Left Reordering & Position Control Column */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                  padding: "1rem 0.875rem",
                  backgroundColor: isTop ? "#f3f4f6" : "#f9fafb",
                  borderRight: "1px solid #e5e7eb",
                  minWidth: "100px",
                  flexShrink: 0,
                  boxSizing: "border-box",
                }}>
                  {/* Position Pill */}
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.25rem 0.625rem",
                    borderRadius: "9999px",
                    fontSize: "0.6875rem",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                    backgroundColor: isTop ? "#111827" : "#e5e7eb",
                    color: isTop ? "#ffffff" : "#374151",
                  }}>
                    {isTop ? "★ #1 TOP" : `#${index + 1}`}
                  </span>

                  {/* Up / Down Move Arrows */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        borderRadius: "0.375rem",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        color: index === 0 ? "#9ca3af" : "#111827",
                        cursor: index === 0 ? "not-allowed" : "pointer",
                        opacity: index === 0 ? 0.4 : 1,
                      }}
                      title="Move up"
                    >
                      <ArrowUpIcon style={{ width: "14px", height: "14px" }} />
                    </button>

                    <button
                      type="button"
                      disabled={index === banners.length - 1}
                      onClick={() => handleMoveDown(index)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        borderRadius: "0.375rem",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        color: index === banners.length - 1 ? "#9ca3af" : "#111827",
                        cursor: index === banners.length - 1 ? "not-allowed" : "pointer",
                        opacity: index === banners.length - 1 ? 0.4 : 1,
                      }}
                      title="Move down"
                    >
                      <ArrowDownIcon style={{ width: "14px", height: "14px" }} />
                    </button>
                  </div>

                  {/* Direct Position Dropdown */}
                  <select
                    value={index}
                    onChange={(e) => handleSetPosition(banner.id, Number(e.target.value))}
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      padding: "0.2rem 0.375rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#ffffff",
                      color: "#374151",
                      cursor: "pointer",
                      outline: "none",
                    }}
                    title="Change position"
                  >
                    {banners.map((_, pIdx) => (
                      <option key={pIdx} value={pIdx}>
                        Pos #{pIdx + 1} {pIdx === 0 ? "(Top)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Banner Thumbnail Preview */}
                <div style={{
                  position: "relative",
                  width: "220px",
                  height: "130px",
                  overflow: "hidden",
                  backgroundColor: "#09090b",
                  flexShrink: 0,
                }}>
                  <Image
                    src={banner.src}
                    alt={banner.alt || banner.title}
                    fill
                    style={{ objectFit: "contain", padding: "0.5rem" }}
                    sizes="220px"
                  />

                  {/* Thumbnail Status Pill */}
                  <div style={{
                    position: "absolute",
                    left: "0.5rem",
                    top: "0.5rem",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}>
                    <span className="admin-pill-badge" style={{
                      backgroundColor: banner.isActive ? "#059669" : "#374151",
                      color: "#ffffff",
                      fontSize: "10px",
                      height: "22px",
                      padding: "0 0.5rem",
                    }}>
                      {banner.isActive ? <EyeIcon style={{ width: "10px", height: "10px" }} /> : <EyeOffIcon style={{ width: "10px", height: "10px" }} />}
                      <span>{banner.isActive ? "ACTIVE" : "HIDDEN"}</span>
                    </span>
                  </div>

                  <div style={{
                    position: "absolute",
                    bottom: "0.5rem",
                    right: "0.5rem",
                    zIndex: 10,
                  }}>
                    <span className="admin-pill-badge" style={{
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                      color: "#ffffff",
                      fontSize: "10px",
                      height: "22px",
                      padding: "0 0.5rem",
                    }}>
                      {isHero ? "Hero Slider" : banner.category}
                      {isHero
                        ? "Hero Slider"
                        : banner.category === "split_duffle"
                          ? "Split Banner 1 (Duffle)"
                          : banner.category === "split_shaker"
                            ? "Split Banner 2 (Shaker)"
                            : banner.category}
                    </span>
                  </div>
                </div>

                {/* 3. Middle Content & Information */}
                <div style={{
                  display: "flex",
                  flex: "1 1 300px",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "1rem 1.25rem",
                  minWidth: 0,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#9ca3af",
                      lineHeight: 1,
                    }}>
                      {placementLabel}
                    </span>
                    {isTop && (
                      <span style={{
                        borderRadius: "9999px",
                        backgroundColor: "#fef3c7",
                        border: "1px solid #fde68a",
                        color: "#92400e",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "0.1rem 0.5rem",
                        lineHeight: 1.2,
                      }}>
                        Current #1 Top Banner
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    margin: "0.25rem 0 0 0",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.3,
                  }}>
                    {banner.title}
                  </h3>

                  {banner.caption && (
                    <p style={{
                      margin: "0.25rem 0 0 0",
                      fontSize: "0.8125rem",
                      color: "#4b5563",
                      lineHeight: 1.4,
                    }}>
                      {banner.caption}
                    </p>
                  )}

                  {/* CTA & Link row */}
                  <div style={{
                    marginTop: "0.625rem",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "1rem",
                    fontSize: "0.75rem",
                  }}>
                    <div>
                      <span style={{ color: "#6b7280" }}>Button CTA: </span>
                      <strong style={{ color: "#111827" }}>{banner.cta || "EXPLORE COLLECTION"}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#6b7280" }}>Link: </span>
                      <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#374151" }} title={banner.linkUrl || "/all-products"}>
                        {banner.linkUrl || "/all-products"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Right Action Buttons */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.625rem",
                  padding: "1rem 1.25rem",
                  borderLeft: "1px solid #f3f4f6",
                  flexShrink: 0,
                }}>
                  {/* Quick "Set to Top" Action Button */}
                  {!isTop ? (
                    <button
                      type="button"
                      onClick={() => handleMoveToTop(banner.id)}
                      className="admin-btn admin-btn-secondary"
                      style={{
                        height: "36px",
                        minHeight: "36px",
                        padding: "0 0.875rem",
                        fontSize: "12px",
                        borderColor: "#111827",
                        color: "#111827",
                      }}
                      title="Move this banner to the very top (#1)"
                    >
                      <ChevronsUpIcon style={{ width: "14px", height: "14px" }} />
                      <span>Set to Top</span>
                    </button>
                  ) : null}

                  {/* Toggle Active / Hide */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    className="admin-btn admin-btn-secondary"
                    style={{
                      height: "36px",
                      minHeight: "36px",
                      padding: "0 0.875rem",
                      fontSize: "12px",
                      color: banner.isActive ? "#374151" : "#047857",
                      backgroundColor: banner.isActive ? "#ffffff" : "#ecfdf5",
                      borderColor: banner.isActive ? "#d1d5db" : "#a7f3d0",
                    }}
                  >
                    {banner.isActive ? (
                      <>
                        <EyeOffIcon style={{ width: "13px", height: "13px" }} />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <EyeIcon style={{ width: "13px", height: "13px" }} />
                        <span>Activate</span>
                      </>
                    )}
                  </button>

                  {/* Edit Banner Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(banner)}
                    className="admin-btn admin-btn-primary"
                    style={{ height: "36px", minHeight: "36px", padding: "0 1rem", fontSize: "12px" }}
                  >
                    <PencilIcon style={{ width: "13px", height: "13px" }} />
                    <span>Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(banner.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "36px",
                      width: "36px",
                      minHeight: "36px",
                      minWidth: "36px",
                      borderRadius: "0.5rem",
                      border: "1px solid #fecaca",
                      backgroundColor: "#fef2f2",
                      color: "#dc2626",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                    title="Delete banner"
                  >
                    <Trash2Icon style={{ width: "14px", height: "14px" }} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Spacious 2-Column Add / Edit Banner Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(4px)",
          padding: "1.25rem",
        }}>
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: "1120px",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            borderRadius: "1rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}>
            {/* Modal Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.25rem 1.75rem",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
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
                  <LayersIcon style={{ width: "1.25rem", height: "1.25rem" }} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.3 }}>
                    {editingBanner ? "Edit Banner Information & Image" : "Add New Banner"}
                  </h2>
                  <p style={{ fontSize: "0.8125rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>
                    Configure banner placement, headline tagline, subtitle description, CTA button, and upload images.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  color: "#6b7280",
                  cursor: "pointer",
                }}
              >
                <XIcon style={{ width: "1.125rem", height: "1.125rem" }} />
              </button>
            </div>

            {/* Modal Body (Scrollable 2-Column Layout) */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.75rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                gap: "2.25rem",
              }}>
                {/* LEFT COLUMN: Content & Text Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>
                      1. Placement & Content Information
                    </span>
                  </div>

                  {/* Banner Placement */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                      Banner Placement / Type <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.875rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                        fontSize: "0.875rem",
                        color: "#111827",
                        outline: "none",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      {BANNER_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                      Choose &apos;Hero Section Banner&apos; for the main homepage top slider.
                    </p>
                  </div>

                  {/* Title / Main Tagline */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                      Banner Title / Main Tagline <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PREMIUM FITNESS ESSENTIALS"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.875rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d1d5db",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#111827",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                      In Hero section, this is displayed as the primary bold uppercase headline.
                    </p>
                  </div>

                  {/* Subheadline / Caption */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                      Subheadline / Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Crafted for performance. Designed for you."
                      value={formData.caption}
                      onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.875rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #d1d5db",
                        fontSize: "0.875rem",
                        color: "#111827",
                        outline: "none",
                        boxSizing: "border-box",
                        resize: "vertical",
                      }}
                    />
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                      Short supporting sentence displayed below the main headline.
                    </p>
                  </div>

                  {/* Button Text & Target Link */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                        Primary Button Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. EXPLORE COLLECTION"
                        value={formData.cta}
                        onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
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
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                        Target Link URL
                      </label>
                      <input
                        type="text"
                        placeholder="/all-products or /shop?filter=..."
                        value={formData.linkUrl}
                        onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                        style={{
                          width: "100%",
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
                    </div>
                  </div>

                  {/* Display Order & Accessibility Alt */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                        Display Order (Rank)
                      </label>
                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
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
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                        Image Alt (SEO)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Favior Fitness Essentials"
                        value={formData.alt}
                        onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
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

                  {/* Active Status Card */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.875rem 1rem",
                    borderRadius: "0.625rem",
                    border: "1px solid #e5e7eb",
                    backgroundColor: formData.isActive ? "#f0fdf4" : "#f9fafb",
                    transition: "all 0.15s",
                  }}>
                    <input
                      type="checkbox"
                      id="isActiveToggle"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={{
                        width: "1.125rem",
                        height: "1.125rem",
                        cursor: "pointer",
                        accentColor: "#111827",
                      }}
                    />
                    <label htmlFor="isActiveToggle" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#111827", cursor: "pointer", userSelect: "none" }}>
                      Publish banner to live website ({formData.isActive ? "Active / Visible" : "Hidden / Draft"})
                    </label>
                  </div>
                </div>

                {/* RIGHT COLUMN: Media Upload & Live Visual Preview */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>
                      2. Visual Media & Real-Time Preview
                    </span>
                  </div>

                  {/* Multi-Image Upload (Build Your Kit & Multi-item Showcases) */}
                  <div style={{
                    borderRadius: "0.75rem",
                    border: "1.5px solid #e5e7eb",
                    backgroundColor: formData.category === "build_your_kit" ? "#fbfbfe" : "#ffffff",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#111827" }}>
                            Multiple Banner Images (Build Your Kit)
                          </span>
                          {formData.category === "build_your_kit" && (
                            <span className="admin-pill-badge" style={{ backgroundColor: "#111827", color: "#ffffff", fontSize: "10px", padding: "0 0.4rem" }}>
                              Recommended
                            </span>
                          )}
                        </div>
                        <p style={{ margin: "0.125rem 0 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                          Upload multiple product items to showcase side-by-side in this banner.
                        </p>
                      </div>
                      <label
                        className="admin-btn admin-btn-primary"
                        style={{ height: "34px", minHeight: "34px", padding: "0 0.875rem", fontSize: "12px", cursor: isUploadingMulti ? "not-allowed" : "pointer" }}
                      >
                        {isUploadingMulti ? (
                          <Loader2Icon style={{ width: "0.875rem", height: "0.875rem", animation: "spin 1s linear infinite" }} />
                        ) : (
                          <PlusIcon style={{ width: "0.875rem", height: "0.875rem" }} />
                        )}
                        <span>{isUploadingMulti ? "Uploading..." : "Upload Multiple Images"}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: "none" }}
                          disabled={isUploadingMulti}
                          onChange={handleMultiImageUpload}
                        />
                      </label>
                    </div>

                    {/* Image URL Adder Input */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Or paste an image URL (e.g. /favior_heritage_duffle_bag.jpg)..."
                        value={multiUrlInput}
                        onChange={(e) => setMultiUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddMultiImageUrl();
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #d1d5db",
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          color: "#111827",
                          outline: "none",
                          backgroundColor: "#ffffff",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddMultiImageUrl}
                        className="admin-btn admin-btn-secondary"
                        style={{ height: "32px", minHeight: "32px", padding: "0 0.75rem", fontSize: "11px" }}
                      >
                        Add URL
                      </button>
                    </div>

                    {/* Thumbnails Grid of Uploaded Multiple Images */}
                    {formData.images && formData.images.length > 0 ? (
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                        gap: "0.625rem",
                        paddingTop: "0.25rem",
                      }}>
                        {formData.images.map((imgUrl, i) => (
                          <div
                            key={i}
                            style={{
                              position: "relative",
                              aspectRatio: "1 / 1",
                              borderRadius: "0.5rem",
                              border: "1px solid #e5e7eb",
                              backgroundColor: "#ffffff",
                              overflow: "hidden",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                            }}
                          >
                            <Image
                              src={imgUrl}
                              alt={`Item ${i + 1}`}
                              fill
                              style={{ objectFit: "contain", padding: "4px" }}
                              sizes="90px"
                            />
                            <span style={{
                              position: "absolute",
                              top: "3px",
                              left: "3px",
                              backgroundColor: "rgba(0,0,0,0.7)",
                              color: "#ffffff",
                              fontSize: "9px",
                              fontWeight: 700,
                              padding: "1px 4px",
                              borderRadius: "3px",
                              zIndex: 2,
                            }}>
                              #{i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveMultiImage(i)}
                              style={{
                                position: "absolute",
                                top: "3px",
                                right: "3px",
                                backgroundColor: "#ef4444",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "3px",
                                width: "18px",
                                height: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                padding: 0,
                                zIndex: 2,
                              }}
                              title="Remove image"
                            >
                              <Trash2Icon style={{ width: "10px", height: "10px" }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af", fontStyle: "italic" }}>
                        No multiple images added yet. Upload 2 or more images above, or use the single desktop image below.
                      </p>
                    )}
                  </div>

                  {/* Desktop Image */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                      Desktop Banner Image (Primary / Fallback) <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="text"
                        required={!formData.images || formData.images.length === 0}
                        placeholder="/favior_combo_pack_banner.jpg or https://..."
                        value={formData.src}
                        onChange={(e) => setFormData({ ...formData, src: e.target.value })}
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
                      <label className="admin-btn admin-btn-primary" style={{ height: "40px", minHeight: "40px" }}>
                        {isUploadingDesktop ? (
                          <Loader2Icon style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
                        ) : (
                          <UploadIcon style={{ width: "1rem", height: "1rem" }} />
                        )}
                        <span>Upload Single</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleDesktopFileUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Live Preview Box */}
                  <div style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: "0.75rem",
                    border: "1px solid #e5e7eb",
                    backgroundColor: formData.images && formData.images.length > 1 ? "#ffffff" : "#09090b",
                    overflow: "hidden",
                    boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
                  }}>
                    {formData.images && formData.images.length > 1 ? (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        padding: "1rem",
                        boxSizing: "border-box",
                      }}>
                        {formData.images.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: "relative",
                              flex: 1,
                              height: "100%",
                              maxHeight: "160px",
                            }}
                          >
                            <Image
                              src={imgUrl}
                              alt={`Preview item ${idx + 1}`}
                              fill
                              style={{ objectFit: "contain" }}
                              sizes="120px"
                            />
                          </div>
                        ))}
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
                          letterSpacing: "0.025em",
                        }}>
                          Build Your Kit Multi-Item Preview ({formData.images.length} items)
                        </div>
                      </div>
                    ) : formData.src ? (
                      <>
                        <Image
                          src={formData.src}
                          alt="Desktop Preview"
                          fill
                          style={{ objectFit: "contain", padding: "0.5rem" }}
                          sizes="(max-width: 1024px) 100vw, 500px"
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
                          letterSpacing: "0.025em",
                        }}>
                          Desktop Live Preview
                        </div>
                      </>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#9ca3af" }}>
                        <ImageIcon style={{ width: "2.5rem", height: "2.5rem", opacity: 0.5 }} />
                        <span style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}>No image selected</span>
                      </div>
                    )}
                  </div>

                  {/* Mobile Image (Optional) */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.375rem" }}>
                      Mobile Banner Image (Optional)
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Optional mobile image path or URL"
                        value={formData.mobileSrc}
                        onChange={(e) => setFormData({ ...formData, mobileSrc: e.target.value })}
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
                        {isUploadingMobile ? (
                          <Loader2Icon style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
                        ) : (
                          <UploadIcon style={{ width: "1rem", height: "1rem" }} />
                        )}
                        <span>Upload Mobile</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleMobileFileUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Live Hero Simulation Card */}
                  <div style={{
                    borderRadius: "0.75rem",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                    padding: "1rem",
                  }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>
                      Live Storefront Simulation
                    </span>
                    <div style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                      padding: "0.875rem 1rem",
                      boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)"
                    }}>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#000" }}>favior.</div>
                      <div style={{ marginTop: "0.375rem", fontSize: "0.8125rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "#111827" }}>
                        {formData.title || "PREMIUM FITNESS ESSENTIALS"}
                      </div>
                      <div style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#6b7280" }}>
                        {formData.caption || "Crafted for performance. Designed for you."}
                      </div>
                      <div style={{ marginTop: "0.625rem", display: "flex", gap: "0.5rem" }}>
                        <span style={{
                          display: "inline-block",
                          backgroundColor: "#000000",
                          color: "#ffffff",
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          padding: "0.25rem 0.625rem",
                          borderRadius: "0.25rem",
                        }}>
                          {formData.cta || "EXPLORE COLLECTION"}
                        </span>
                        <span style={{
                          display: "inline-block",
                          border: "1px solid #d1d5db",
                          color: "#374151",
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          padding: "0.25rem 0.625rem",
                          borderRadius: "0.25rem",
                        }}>
                          SHOP NOW
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.75rem",
                padding: "1rem 1.75rem",
                borderTop: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                flexShrink: 0,
              }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                  style={{ height: "42px", minHeight: "42px", padding: "0 1.5rem" }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="admin-btn admin-btn-primary"
                  style={{ height: "42px", minHeight: "42px", padding: "0 1.75rem" }}
                >
                  {isSubmitting && (
                    <Loader2Icon style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
                  )}
                  <span>{editingBanner ? "Save Changes" : "Create Banner"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(4px)",
          padding: "1rem",
        }}>
          <div style={{
            width: "100%",
            maxWidth: "24rem",
            borderRadius: "0.75rem",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            padding: "1.25rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827", margin: 0 }}>Delete Banner?</h3>
            <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "#6b7280" }}>
              Are you sure you want to delete this banner? It will be permanently removed from the website and dashboard.
            </p>
            <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="admin-btn admin-btn-secondary"
                style={{ height: "36px", minHeight: "36px", padding: "0 1rem", fontSize: "12px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDelete(deleteTargetId)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#dc2626",
                  height: "36px",
                  minHeight: "36px",
                  padding: "0 1.25rem",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#ffffff",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxSizing: "border-box",
                  lineHeight: 1,
                }}
              >
                {isSubmitting && <Loader2Icon style={{ width: "0.875rem", height: "0.875rem", animation: "spin 1s linear infinite" }} />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
