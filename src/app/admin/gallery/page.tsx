"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Images,
  Plus,
  Trash2,
  UploadCloud,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
  category?: string;
  span?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    src: "",
    alt: "",
    caption: "",
    category: "campus",
    span: "",
    displayOrder: 0,
  });

  const [showModal, setShowModal] = useState(false);

  async function loadPhotos() {
    try {
      const res = await adminFetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        if (data.photos) {
          setPhotos(data.photos);
        }
      }
    } catch {
      setErrorMsg("Failed to load gallery photos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Upload failed");
      } else if (json.url) {
        setForm((prev) => ({
          ...prev,
          src: json.url,
          alt: prev.alt || file.name.split(".")[0],
        }));
      }
    } catch {
      setErrorMsg("Error uploading photo to server");
    } finally {
      setUploading(false);
    }
  }

  async function handleSavePhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!form.src) {
      setErrorMsg("Please upload an image or provide an image URL");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const res = await adminFetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatusMsg("Photo added to gallery successfully!");
        setShowModal(false);
        setForm({
          src: "",
          alt: "",
          caption: "",
          category: "campus",
          span: "",
          displayOrder: photos.length + 1,
        });
        loadPhotos();
        setTimeout(() => setStatusMsg(""), 4000);
      } else {
        const json = await res.json();
        setErrorMsg(json.error || "Failed to save photo");
      }
    } catch {
      setErrorMsg("Network error saving photo");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to remove this photo from the campus gallery?")) return;

    try {
      const res = await adminFetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setStatusMsg("Photo deleted");
        loadPhotos();
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch {
      setErrorMsg("Failed to delete photo");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17324D] tracking-tight flex items-center gap-2.5">
            <Images className="h-6 w-6 text-[#168C8C]" />
            Campus Gallery Manager
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-medium">
            Upload and arrange photos of college classrooms, labs, events, and campus grounds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadPhotos}
            title="Refresh gallery"
            className="p-2 rounded-xl bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors shadow-xs"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setForm({
                src: "",
                alt: "",
                caption: "",
                category: "campus",
                span: "",
                displayOrder: photos.length + 1,
              });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add New Photo
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-[#EBF7EE] border border-[#B7E4C7] text-[#16803C] flex items-center gap-2.5 text-xs">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {statusMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#FDF2F2] border border-[#FAC5C5] text-[#C93636] flex items-center gap-2.5 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Photos Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-[#667085] gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-[#168C8C]" />
          <p className="text-xs">Loading campus gallery...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="p-16 rounded-2xl bg-white border border-[#E4E7EC] text-center">
          <Images className="h-10 w-10 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#17324D]">No photos in gallery yet</h3>
          <p className="text-xs text-[#667085] mt-1">Click &quot;Add New Photo&quot; to upload campus photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl overflow-hidden bg-white border border-[#E4E7EC] hover:border-[#168C8C]/40 transition-colors flex flex-col shadow-xs"
            >
              <div className="relative aspect-[4/3] w-full bg-[#F5F7FA] overflow-hidden">
                <Image
                  src={p.src}
                  alt={p.alt || "Campus photo"}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#17324D]/80 backdrop-blur-xs text-[10px] font-semibold text-white uppercase tracking-wider">
                  {p.category || "Campus"}
                </div>
                {p.span && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#168C8C] text-[10px] text-white font-medium">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-[#17324D] text-sm">{p.caption || p.alt || "Campus Photo"}</h3>
                  <p className="text-[11px] text-[#667085] mt-1 truncate font-mono">{p.src}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex items-center justify-between">
                  <span className="text-xs text-[#667085]">Order: #{p.displayOrder}</span>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-lg text-[#C93636] hover:bg-[#FDF2F2] transition-colors"
                    title="Delete photo"
                    aria-label="Delete photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E7EC] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <h2 className="text-lg font-bold text-[#17324D]">Upload New Photo</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#17324D] rounded-lg"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
              {/* Image Preview / File Drop */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                  Photo File
                </label>
                {form.src ? (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#E4E7EC] mb-2 bg-[#F5F7FA]">
                    <Image src={form.src} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, src: "" }))}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-[#C93636] transition-colors"
                      aria-label="Remove uploaded preview"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#D1D5DB] hover:border-[#168C8C] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#F8FAFC]">
                    <input
                      type="file"
                      id="gallery-file-input"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="gallery-file-input" className="cursor-pointer block">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-[#168C8C]" />
                          <span className="text-xs text-[#667085]">Uploading photo...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud className="h-7 w-7 text-[#168C8C]" />
                          <span className="text-xs font-semibold text-[#17324D]">Click to select photo</span>
                          <span className="text-[11px] text-[#667085]">PNG, JPG, WebP up to 15MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                  Photo Caption
                </label>
                <input
                  type="text"
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="e.g. Modern Nursing Foundation Lab with Simulation Mannequins"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#168C8C] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#1F2937] focus:outline-none focus:border-[#168C8C] text-xs"
                  >
                    <option value="campus">Campus & Building</option>
                    <option value="labs">Labs & Practical</option>
                    <option value="hostel">Hostel & Facilities</option>
                    <option value="events">Events & Ceremonies</option>
                    <option value="admissions">Admissions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#1F2937] focus:outline-none focus:border-[#168C8C] text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#4B5563] hover:bg-[#F5F7FA] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

