"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  FileText,
  ExternalLink,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  link?: string;
  fileUrl?: string;
  date?: string;
  isUrgent: boolean;
  isActive: boolean;
  displayOrder: number;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    id: undefined as number | undefined,
    title: "",
    content: "",
    link: "",
    fileUrl: "",
    date: "",
    isUrgent: false,
    isActive: true,
    displayOrder: 1,
  });

  const [showModal, setShowModal] = useState(false);

  async function loadNotices() {
    try {
      const res = await adminFetch("/api/admin/notices");
      if (res.ok) {
        const data = await res.json();
        if (data.notices) setNotices(data.notices);
      }
    } catch {
      setErrorMsg("Failed to load notices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
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
        setErrorMsg(json.error || "File upload failed");
      } else if (json.url) {
        setForm((prev) => ({ ...prev, fileUrl: json.url }));
        setStatusMsg("Attachment uploaded successfully!");
      }
    } catch {
      setErrorMsg("Network error uploading attachment");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) {
      setErrorMsg("Please provide a notice title");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const res = await adminFetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatusMsg("Notice saved successfully!");
        setShowModal(false);
        loadNotices();
        setTimeout(() => setStatusMsg(""), 4000);
      } else {
        setErrorMsg("Failed to save notice");
      }
    } catch {
      setErrorMsg("Network error saving notice");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      const res = await adminFetch(`/api/admin/notices?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMsg("Notice deleted");
        loadNotices();
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch {
      setErrorMsg("Failed to delete notice");
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E4E7EC]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#168C8C]/10 border border-[#168C8C]/20 text-[#168C8C] text-xs font-semibold mb-2">
            <Bell className="h-3.5 w-3.5" />
            Circulars & Announcements
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#17324D]">
            Notices & News Board
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Publish urgent examination updates, admission notifications, and downloadable circular PDFs.
          </p>
        </div>

        <button
          onClick={() => {
            setForm({
              id: undefined,
              title: "",
              content: "",
              link: "",
              fileUrl: "",
              date: "Session 2026-27",
              isUrgent: false,
              isActive: true,
              displayOrder: notices.length + 1,
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#1f4264] text-white font-medium text-sm shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create New Notice
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] flex items-center gap-3 text-sm font-medium">
          <CheckCircle className="h-5 w-5 shrink-0" />
          {statusMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#C93636]/30 text-[#C93636] flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-[#667085] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#168C8C]" />
          <p className="text-sm font-medium">Loading notices...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="p-16 rounded-2xl bg-white border border-[#E4E7EC] text-center shadow-sm">
          <Bell className="h-12 w-12 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#17324D]">No notices published yet</h3>
          <p className="text-sm text-[#667085] mt-1">Click &ldquo;Create New Notice&rdquo; to post a circular or alert.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className="p-6 rounded-2xl bg-white border border-[#E4E7EC] hover:border-[#168C8C]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {n.isUrgent && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FDF2F2] text-[#C93636] border border-[#C93636]/30 text-[11px] font-bold uppercase tracking-wider">
                      Urgent Alert
                    </span>
                  )}
                  {n.date && (
                    <span className="text-xs text-[#667085] font-medium">Date / Tag: {n.date}</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-[#17324D]">{n.title}</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed max-w-3xl">{n.content}</p>
                <div className="flex items-center gap-4 text-xs pt-1">
                  {n.link && (
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#168C8C] hover:underline flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Link: {n.link}
                    </a>
                  )}
                  {n.fileUrl && (
                    <a
                      href={n.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#16803C] hover:underline flex items-center gap-1 font-medium"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View Attachment PDF
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E4E7EC]">
                <button
                  onClick={() => {
                    setForm({
                      id: n.id,
                      title: n.title,
                      content: n.content,
                      link: n.link || "",
                      fileUrl: n.fileUrl || "",
                      date: n.date || "",
                      isUrgent: n.isUrgent,
                      isActive: n.isActive,
                      displayOrder: n.displayOrder,
                    });
                    setShowModal(true);
                  }}
                  className="p-2 rounded-xl text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors"
                  title="Edit notice"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-2 rounded-xl text-[#C93636] hover:bg-[#FDF2F2] transition-colors"
                  title="Delete notice"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#17324D]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E7EC] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
              <h2 className="text-xl font-bold text-[#17324D]">
                {form.id ? "Edit Notice" : "Create New Notice"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#667085] hover:text-[#17324D] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Schedule for First Terminal Examination 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                  Content / Details
                </label>
                <textarea
                  rows={3}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Notice details and instructions for students..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Date / Session Tag
                  </label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. October 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] focus:outline-none focus:bg-white focus:border-[#168C8C] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                    Direct Link URL
                  </label>
                  <input
                    type="text"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="e.g. /admissions"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] text-[#1F2937] focus:outline-none focus:bg-white focus:border-[#168C8C] text-sm"
                  />
                </div>
              </div>

              {/* PDF Circular Attachment */}
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#374151] mb-1.5">
                  PDF Circular / Document Attachment
                </label>
                {form.fileUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#EBF7EE] border border-[#16803C]/30 text-xs text-[#16803C] font-medium">
                    <span className="truncate">{form.fileUrl}</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, fileUrl: "" })}
                      className="text-[#C93636] hover:underline ml-2 cursor-pointer font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="notice-pdf-input"
                      accept=".pdf,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="notice-pdf-input"
                      className="px-4 py-2 rounded-xl bg-[#F5F7FA] border border-[#D1D5DB] hover:bg-[#E4E7EC] text-xs font-semibold text-[#17324D] cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                      Upload PDF
                    </label>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#374151]">
                  <input
                    type="checkbox"
                    checked={form.isUrgent}
                    onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })}
                    className="rounded text-[#168C8C] focus:ring-[#168C8C] border-[#D1D5DB]"
                  />
                  Mark as Urgent Alert (High Priority)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#1f4264] text-white font-medium text-sm shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2 transition-all"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
