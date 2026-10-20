"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  RotateCcw,
  Loader2,
  Building,
  Rocket,
  Phone,
  Bell,
  Share2,
  FileText,
  Plus,
  Trash2,
  Layers,
} from "lucide-react";
import type { HeroSlide } from "@/lib/data";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "contact" | "announcement" | "social">("general");

  const [form, setForm] = useState({
    name: "Adarsh College of Nursing",
    shortName: "Adarsh Nursing",
    logo: "/images/logo-mark.png",
    tagline: "Care Today, Cure Tomorrow",
    description: "",
    session: "2026-27",
    phones: ["9466187931", "7082867931"],
    whatsapp: "919466187931",
    email: "adarshnursingcollegenl@gmail.com",
    address: {
      line1: "Niwaz Nagar, Post-Dharsoon",
      line2: "Tehsil Narnaul, Dist. Mahendergarh",
      state: "Haryana",
      pin: "123001",
      landmark: "Near Narnaul Bypass",
    },
    coords: { lat: 28.108861, lng: 76.092917 },
    bannerNotice: "Admissions open for session 2026-27 · A.N.M. · G.N.M. · B.Sc. Nursing",
    isBannerActive: true,
    hero: {
      badge: "Admissions open for 2026-27",
      titleLead: "Nurturing compassionate",
      titleHighlight: "healthcare professionals.",
      description: "",
      image: "/images/campus.jpg",
      slides: [
        {
          src: "/images/campus.jpg",
          alt: "Adarsh College of Nursing campus building and lawns",
          tag: "Our Campus",
          caption: "Near Narnaul Bypass",
        },
        {
          src: "/images/nursing-lab.jpg",
          alt: "Practical nursing simulation and clinical skills lab",
          tag: "Practical Skills Lab",
          caption: "Clinical mannequins & hospital simulation beds",
        },
        {
          src: "/images/nursing-library.jpg",
          alt: "College library and medical learning study hall",
          tag: "College Library",
          caption: "Medical books, journals & quiet study spaces",
        },
        {
          src: "/images/poster.jpg",
          alt: "Admissions open poster for session 2026-27",
          tag: "Admissions Open",
          caption: "A.N.M. · G.N.M. · B.Sc. Nursing",
        },
      ] as HeroSlide[],
      stat1Val: "100%",
      stat1Label: "Clinical Exposure",
      stat2Val: "3+",
      stat2Label: "Recognized Courses",
      stat3Val: "10:1",
      stat3Label: "Student-Faculty Ratio",
      ctaPrimary: "Enquire now",
      ctaPrimaryLink: "/admissions",
    },
    social: {
      facebook: "",
      instagram: "",
      youtube: "",
      twitter: "",
    },
    brochurePdf: "",
  });

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHeroImg, setUploadingHeroImg] = useState(false);
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(null);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileUpload(file: File, target: "logo" | "heroImage" | "brochure" | number) {
    if (!file) return;

    if (target === "logo") setUploadingLogo(true);
    else if (target === "heroImage") setUploadingHeroImg(true);
    else if (target === "brochure") setUploadingBrochure(true);
    else setUploadingSlideIndex(target);

    setUploadError("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const ct = res.headers.get("content-type");
      const json = ct && ct.includes("application/json") ? await res.json() : null;

      if (!res.ok) {
        setUploadError(json?.error || `Upload failed with HTTP status ${res.status}`);
      } else if (json?.url) {
        let updatedForm = { ...form };
        if (target === "logo") {
          updatedForm = { ...updatedForm, logo: json.url };
          setForm(updatedForm);
          setStatusMsg("Logo uploaded and updated! Saving to live site...");
        } else if (target === "heroImage") {
          const nextSlides = [...(updatedForm.hero.slides || [])];
          if (nextSlides.length > 0) nextSlides[0] = { ...nextSlides[0], src: json.url };
          const nextHero = { ...updatedForm.hero, image: json.url, slides: nextSlides };
          updatedForm = { ...updatedForm, hero: nextHero };
          setForm(updatedForm);
          setStatusMsg("Hero image uploaded and updated! Saving to live site...");
        } else if (typeof target === "number") {
          const nextSlides = [...(updatedForm.hero.slides || [])];
          if (nextSlides[target]) nextSlides[target] = { ...nextSlides[target], src: json.url };
          const heroImage = target === 0 ? json.url : updatedForm.hero.image;
          const nextHero = { ...updatedForm.hero, image: heroImage, slides: nextSlides };
          updatedForm = { ...updatedForm, hero: nextHero };
          setForm(updatedForm);
          setStatusMsg(`Slide 0${target + 1} photo uploaded! Saving to live site...`);
        } else if (target === "brochure") {
          updatedForm = { ...updatedForm, brochurePdf: json.url };
          setForm(updatedForm);
          setStatusMsg("Prospectus PDF uploaded! Saving to live site...");
        }

        // Auto-persist immediately to the database so changes apply instantly
        try {
          const saveRes = await adminFetch("/api/admin/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedForm),
          });
          if (saveRes.ok) {
            try {
              localStorage.setItem("admin_settings_updated", Date.now().toString());
            } catch {}
            setStatusMsg("Saved successfully to live site and database!");
          } else {
            setStatusMsg("File uploaded! Click 'Save All Changes' to finish applying.");
          }
        } catch {
          setStatusMsg("File uploaded! Click 'Save All Changes' to finish applying.");
        }
        setTimeout(() => setStatusMsg(""), 6000);
      }
    } catch {
      setUploadError("Network connection error while uploading file.");
    } finally {
      setUploadingLogo(false);
      setUploadingHeroImg(false);
      setUploadingBrochure(false);
      setUploadingSlideIndex(null);
    }
  }

  useEffect(() => {
    adminFetch("/api/admin/settings")
      .then(async (res) => {
        if (!res.ok) return null;
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data?.settings) {
          setForm((prev) => ({
            ...prev,
            ...data.settings,
            hero: { ...prev.hero, ...(data.settings.hero || {}) },
            social: { ...prev.social, ...(data.settings.social || {}) },
          }));
        }
      })
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    setUploadError("");

    try {
      const res = await adminFetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const ct = res.headers.get("content-type");
      const json = ct && ct.includes("application/json") ? await res.json() : null;

      if (res.ok) {
        try {
          localStorage.setItem("admin_settings_updated", Date.now().toString());
        } catch {}
        setStatusMsg("All settings saved successfully to the database and live site!");
        setTimeout(() => setStatusMsg(""), 6000);
      } else {
        setUploadError(json?.error || `Failed to save settings (status ${res.status}).`);
      }
    } catch {
      setUploadError("Network error while saving settings.");
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: "general", label: "Branding & College Info", icon: Building },
    { id: "hero", label: "Homepage Hero Section", icon: Rocket },
    { id: "contact", label: "Helplines & Campus Map", icon: Phone },
    { id: "announcement", label: "Announcement Ticker", icon: Bell },
    { id: "social", label: "Social Media & Prospectus", icon: Share2 },
  ] as const;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E4E7EC]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#168C8C]/10 border border-[#168C8C]/20 text-[#168C8C] text-xs font-semibold mb-2">
            <Settings className="h-3.5 w-3.5" />
            Full Customization Engine
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#17324D]">
            Site & Page Settings
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Edit every text, helpline, hero element, and brochure link on your live website.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#1f4264] text-white font-medium text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Changes
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] flex items-center gap-3 text-sm font-medium">
          <CheckCircle className="h-5 w-5 shrink-0" />
          {statusMsg}
        </div>
      )}

      {uploadError && (
        <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#C93636]/30 text-[#C93636] flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {uploadError}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white border border-[#E4E7EC] shadow-sm">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                active
                  ? "bg-[#17324D] text-white shadow-sm"
                  : "text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* TAB 1: General & Branding */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E7EC] space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#17324D] flex items-center gap-2.5">
                <Building className="h-5 w-5 text-[#168C8C]" />
                College Brand & Emblem
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-5 rounded-xl bg-[#F9FAFB] border border-[#E4E7EC]">
                <div className="relative h-20 w-20 shrink-0 rounded-xl bg-white p-2 flex items-center justify-center overflow-hidden border border-[#D1D5DB] shadow-inner">
                  <Image src={form.logo || "/images/logo-mark.png"} alt="College Logo" width={64} height={64} style={{ width: "auto", height: "auto" }} className="object-contain" unoptimized />
                </div>
                <div className="space-y-3 flex-1 min-w-0">
                  <div>
                    <p className="text-sm font-bold text-[#17324D]">College Logo / Emblem</p>
                    <p className="text-xs text-[#667085]">Displayed on public header, public footer, and admin dashboard.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="text"
                      value={form.logo || ""}
                      onChange={(e) => setForm({ ...form, logo: e.target.value })}
                      placeholder="/images/logo-mark.png or /uploads/..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#1F2937] text-xs font-mono focus:outline-none focus:border-[#168C8C]"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "logo");
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="px-3.5 py-2 rounded-xl bg-[#17324D] hover:bg-[#1f4264] text-xs font-medium text-white cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        {uploadingLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                        Upload File
                      </label>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, logo: "/images/logo-mark.png" }))}
                        className="px-3 py-2 rounded-xl bg-white border border-[#D1D5DB] hover:bg-[#F5F7FA] text-xs font-medium text-[#667085] hover:text-[#17324D] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    College Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Short Name / Subtitle
                  </label>
                  <input
                    type="text"
                    value={form.shortName}
                    onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Current Academic Session Year
                  </label>
                  <input
                    type="text"
                    value={form.session}
                    onChange={(e) => setForm({ ...form, session: e.target.value })}
                    placeholder="2026-27"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Official College Tagline
                  </label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                  College Description (SEO & Footer)
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Homepage Hero Section */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E7EC] space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#17324D] flex items-center gap-2.5">
                <Rocket className="h-5 w-5 text-[#168C8C]" />
                Hero Section Customization
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Hero Badge Text (Flashing dot)
                  </label>
                  <input
                    type="text"
                    value={form.hero?.badge || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: { ...form.hero, badge: e.target.value },
                      })
                    }
                    placeholder="Admissions open for 2026-27"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Headline Lead (Line 1)
                  </label>
                  <input
                    type="text"
                    value={form.hero?.titleLead || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: { ...form.hero, titleLead: e.target.value },
                      })
                    }
                    placeholder="Nurturing compassionate"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Headline Highlight (Underline Swash)
                  </label>
                  <input
                    type="text"
                    value={form.hero?.titleHighlight || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: { ...form.hero, titleHighlight: e.target.value },
                      })
                    }
                    placeholder="healthcare professionals."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Hero Subtitle / Description Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={form.hero?.description || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: { ...form.hero, description: e.target.value },
                      })
                    }
                    placeholder="A.N.M., G.N.M. and B.Sc. Nursing at a modern campus near Narnaul Bypass..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Hero Primary Image / Fallback URL
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={form.hero?.image || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hero: { ...form.hero, image: e.target.value },
                        })
                      }
                      placeholder="/images/campus.jpg or /uploads/..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-xs font-mono focus:outline-none focus:bg-white focus:border-[#168C8C]"
                    />
                    <input
                      type="file"
                      id="hero-img-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "heroImage");
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="hero-img-upload"
                      className="px-4 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#1f4264] text-xs font-medium text-white cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                      {uploadingHeroImg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                      Upload Photo
                    </label>
                  </div>
                </div>

                {/* Hero Carousel Slides Manager */}
                <div className="md:col-span-2 p-5 rounded-xl bg-[#F9FAFB] border border-[#E4E7EC] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E7EC] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#168C8C]" />
                        <h4 className="text-sm font-bold text-[#17324D]">
                          Hero Carousel Slides & Photos ({form.hero?.slides?.length || 0})
                        </h4>
                      </div>
                      <p className="text-xs text-[#667085] mt-0.5">
                        These images rotate smoothly in the homepage hero slider. Upload new photos or enter image URLs directly.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newSlide: HeroSlide = {
                            src: "/images/campus.jpg",
                            alt: "College slide photo",
                            tag: "Campus Facility",
                            caption: "Adarsh College of Nursing",
                          };
                          setForm((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              slides: [...(prev.hero?.slides || []), newSlide],
                            },
                          }));
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#168C8C]/10 hover:bg-[#168C8C]/20 text-[#168C8C] border border-[#168C8C]/20 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Slide
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {(form.hero?.slides || []).map((slide, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white border border-[#E4E7EC] space-y-3 relative group shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#168C8C]">
                            Slide 0{idx + 1} {idx === 0 ? "· Primary" : ""}
                          </span>
                          {(form.hero?.slides?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setForm((prev) => {
                                  const updated = (prev.hero?.slides || []).filter((_, i) => i !== idx);
                                  return {
                                    ...prev,
                                    hero: {
                                      ...prev.hero,
                                      image: updated[0]?.src || prev.hero.image,
                                      slides: updated,
                                    },
                                  };
                                });
                              }}
                              className="text-[#9CA3AF] hover:text-[#C93636] transition-colors p-1 cursor-pointer"
                              title="Delete slide"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="relative h-16 w-24 shrink-0 rounded-lg bg-[#E4E7EC] overflow-hidden border border-[#D1D5DB]">
                            <Image
                              src={slide.src || "/images/campus.jpg"}
                              alt={slide.alt || "Slide preview"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                id={`slide-upload-${idx}`}
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file, idx);
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`slide-upload-${idx}`}
                                className="inline-flex px-3 py-1.5 rounded-lg bg-[#17324D] hover:bg-[#1f4264] text-xs font-medium text-white cursor-pointer transition-colors items-center gap-1.5 shadow-sm"
                              >
                                {uploadingSlideIndex === idx ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <UploadCloud className="h-3 w-3" />
                                )}
                                Upload Photo
                              </label>
                            </div>
                            <input
                              type="text"
                              value={slide.src || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm((prev) => {
                                  const next = [...(prev.hero?.slides || [])];
                                  next[idx] = { ...next[idx], src: val };
                                  const heroImage = idx === 0 ? val : prev.hero.image;
                                  return { ...prev, hero: { ...prev.hero, image: heroImage, slides: next } };
                                });
                              }}
                              placeholder="/images/campus.jpg or /uploads/..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-[11px] font-mono focus:outline-none focus:bg-white focus:border-[#168C8C]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] uppercase font-bold tracking-wider text-[#667085] mb-1">
                              Category Tag
                            </label>
                            <input
                              type="text"
                              value={slide.tag || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm((prev) => {
                                  const next = [...(prev.hero?.slides || [])];
                                  next[idx] = { ...next[idx], tag: val };
                                  return { ...prev, hero: { ...prev.hero, slides: next } };
                                });
                              }}
                              placeholder="e.g. Our Campus"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-xs focus:outline-none focus:bg-white focus:border-[#168C8C]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase font-bold tracking-wider text-[#667085] mb-1">
                              Caption Title
                            </label>
                            <input
                              type="text"
                              value={slide.caption || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm((prev) => {
                                  const next = [...(prev.hero?.slides || [])];
                                  next[idx] = { ...next[idx], caption: val };
                                  return { ...prev, hero: { ...prev.hero, slides: next } };
                                });
                              }}
                              placeholder="e.g. Near Narnaul Bypass"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-xs focus:outline-none focus:bg-white focus:border-[#168C8C]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Stats */}
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Stat 1 (Value & Label)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.hero?.stat1Val || ""}
                      onChange={(e) => setForm({ ...form, hero: { ...form.hero, stat1Val: e.target.value } })}
                      placeholder="100%"
                      className="px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C]"
                    />
                    <input
                      type="text"
                      value={form.hero?.stat1Label || ""}
                      onChange={(e) => setForm({ ...form, hero: { ...form.hero, stat1Label: e.target.value } })}
                      placeholder="Clinical Exposure"
                      className="px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Stat 2 (Value & Label)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.hero?.stat2Val || ""}
                      onChange={(e) => setForm({ ...form, hero: { ...form.hero, stat2Val: e.target.value } })}
                      placeholder="3+"
                      className="px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C]"
                    />
                    <input
                      type="text"
                      value={form.hero?.stat2Label || ""}
                      onChange={(e) => setForm({ ...form, hero: { ...form.hero, stat2Label: e.target.value } })}
                      placeholder="Recognized Courses"
                      className="px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Stat 3 (Value & Label)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.hero?.stat3Val || ""}
                      onChange={(e) => setForm({ ...form, hero: { ...form.hero, stat3Val: e.target.value } })}
                      placeholder="10:1"
                      className="px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C]"
                    />
                    <input
                      type="text"
                      value={form.hero?.stat3Label || ""}
                      onChange={(e) => setForm({ ...form, hero: { ...form.hero, stat3Label: e.target.value } })}
                      placeholder="Faculty Ratio"
                      className="px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Contact & Helplines */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E7EC] space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#17324D] flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-[#168C8C]" />
                Admission Helplines & Physical Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Primary Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={form.phones[0] || ""}
                    onChange={(e) => {
                      const updated = [...form.phones];
                      updated[0] = e.target.value;
                      setForm({ ...form, phones: updated });
                    }}
                    placeholder="9466187931"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Secondary Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={form.phones[1] || ""}
                    onChange={(e) => {
                      const updated = [...form.phones];
                      updated[1] = e.target.value;
                      setForm({ ...form, phones: updated });
                    }}
                    placeholder="7082867931"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Official WhatsApp Number (With Country Code)
                  </label>
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="919466187931"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Landmark / Proximity
                  </label>
                  <input
                    type="text"
                    value={form.address.landmark}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, landmark: e.target.value } })}
                    placeholder="Near Narnaul Bypass"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={form.address.line1}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, line1: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Address Line 2 (Tehsil / District)
                  </label>
                  <input
                    type="text"
                    value={form.address.line2}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, line2: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={form.address.state}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={form.address.pin}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, pin: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Google Maps Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={form.coords.lat}
                    onChange={(e) => setForm({ ...form, coords: { ...form.coords, lat: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Google Maps Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={form.coords.lng}
                    onChange={(e) => setForm({ ...form, coords: { ...form.coords, lng: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Announcement Ticker */}
        {activeTab === "announcement" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E7EC] space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#17324D] flex items-center gap-2.5">
                <Bell className="h-5 w-5 text-[#168C8C]" />
                Urgent Top Bar Announcement
              </h2>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F9FAFB] border border-[#E4E7EC]">
                <input
                  type="checkbox"
                  id="banner-toggle"
                  checked={form.isBannerActive}
                  onChange={(e) => setForm({ ...form, isBannerActive: e.target.checked })}
                  className="h-5 w-5 rounded text-[#168C8C] focus:ring-[#168C8C] border-[#D1D5DB]"
                />
                <label htmlFor="banner-toggle" className="text-sm font-semibold text-[#17324D] cursor-pointer">
                  Enable top notification strip on live website
                </label>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                  Announcement Strip Text
                </label>
                <input
                  type="text"
                  value={form.bannerNotice}
                  onChange={(e) => setForm({ ...form, bannerNotice: e.target.value })}
                  placeholder="Admissions open for session 2026-27 · A.N.M. · G.N.M. · B.Sc. Nursing"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                />
                <p className="text-xs text-[#667085] mt-1.5">
                  Appears at the very top of the screen on the live website alongside helpline numbers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Social & Brochure */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E7EC] space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#17324D] flex items-center gap-2.5">
                <Share2 className="h-5 w-5 text-[#168C8C]" />
                Social Media Handles & Downloadable Brochure
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={form.social?.facebook || ""}
                    onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={form.social?.instagram || ""}
                    onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={form.social?.youtube || ""}
                    onChange={(e) => setForm({ ...form, social: { ...form.social, youtube: e.target.value } })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Twitter / X Profile URL
                  </label>
                  <input
                    type="url"
                    value={form.social?.twitter || ""}
                    onChange={(e) => setForm({ ...form, social: { ...form.social, twitter: e.target.value } })}
                    placeholder="https://x.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] text-sm focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
                  />
                </div>

                {/* Brochure PDF */}
                <div className="md:col-span-2 p-5 rounded-xl bg-[#F9FAFB] border border-[#E4E7EC]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#17324D] flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#16803C]" />
                        Downloadable College Prospectus / Brochure (PDF)
                      </p>
                      <p className="text-xs text-[#667085] mt-0.5">
                        {form.brochurePdf ? `Attached: ${form.brochurePdf}` : "No brochure PDF uploaded yet."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="brochure-pdf-upload"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "brochure");
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="brochure-pdf-upload"
                        className="px-4 py-2 rounded-xl bg-[#168C8C]/10 hover:bg-[#168C8C]/20 text-[#168C8C] border border-[#168C8C]/20 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        {uploadingBrochure ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                        Upload PDF Brochure
                      </label>
                      {form.brochurePdf && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, brochurePdf: "" })}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-[#C93636] hover:underline transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button at bottom of form */}
        <div className="flex justify-end pt-4 border-t border-[#E4E7EC]">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#17324D] hover:bg-[#1f4264] text-white font-medium text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
