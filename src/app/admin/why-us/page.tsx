"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface WhyUsItem {
  id: number;
  title: string;
  text: string;
  displayOrder: number;
}

export default function AdminWhyUsPage() {
  const [items, setItems] = useState<WhyUsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editingItem, setEditingItem] = useState<{ id?: number; title: string; text: string; displayOrder: number } | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function loadItems() {
    try {
      const res = await adminFetch("/api/admin/why-us");
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setItems(data.items);
        }
      }
    } catch {
      setErrorMsg("Failed to load feature cards");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.text) {
      setErrorMsg("Please provide both title and description");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const res = await adminFetch("/api/admin/why-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        setStatusMsg("Card saved successfully!");
        setShowModal(false);
        setEditingItem(null);
        loadItems();
        setTimeout(() => setStatusMsg(""), 3000);
      } else {
        const json = await res.json();
        setErrorMsg(json.error || "Failed to save card");
      }
    } catch {
      setErrorMsg("Network error saving card");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this feature card?")) return;

    try {
      const res = await adminFetch(`/api/admin/why-us?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMsg("Card deleted");
        loadItems();
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch {
      setErrorMsg("Failed to delete card");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17324D] tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-[#168C8C]" />
            Why Choose Us Cards
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-medium">
            Customize the 6 core pillars and key reasons students choose Adarsh College of Nursing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadItems}
            title="Refresh list"
            className="p-2 rounded-xl bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors shadow-xs"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setEditingItem({
                title: "",
                text: "",
                displayOrder: items.length + 1,
              });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Feature Card
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

      {/* Grid of cards */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-[#667085] gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-[#168C8C]" />
          <p className="text-xs">Loading feature cards...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-16 rounded-2xl bg-white border border-[#E4E7EC] text-center">
          <Sparkles className="h-10 w-10 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#17324D]">No feature cards added yet</h3>
          <p className="text-xs text-[#667085] mt-1">Click &quot;Add Feature Card&quot; to define why students should choose the college.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="p-6 rounded-2xl bg-white border border-[#E4E7EC] hover:border-[#168C8C]/40 transition-colors flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="text-2xl font-bold text-[#168C8C]">
                  0{idx + 1}
                </span>
                <h3 className="mt-2 text-base font-bold text-[#17324D]">{it.title}</h3>
                <p className="mt-2 text-xs text-[#667085] leading-relaxed">{it.text}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E4E7EC] flex items-center justify-between">
                <span className="text-xs text-[#667085]">Order: #{it.displayOrder}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingItem(it);
                      setShowModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#E4E7EC] text-[#17324D] border border-[#E4E7EC] transition-colors"
                    title="Edit card"
                    aria-label="Edit card"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(it.id)}
                    className="p-1.5 rounded-lg bg-[#FDF2F2] hover:bg-[#FEE2E2] text-[#C93636] border border-[#FAC5C5] transition-colors"
                    title="Delete card"
                    aria-label="Delete card"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E7EC] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <h2 className="text-lg font-bold text-[#17324D]">
                {editingItem.id ? "Edit Feature Card" : "Add Feature Card"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#17324D] rounded-lg"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                  Card Title
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Practical Training & Clinical Exposure"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#168C8C] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                  Description Text
                </label>
                <textarea
                  rows={3}
                  value={editingItem.text}
                  onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                  placeholder="Regular clinical postings so students gain real patient-care experience..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#168C8C] text-xs leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingItem.displayOrder}
                  onChange={(e) => setEditingItem({ ...editingItem, displayOrder: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#1F2937] focus:outline-none focus:border-[#168C8C] text-xs"
                />
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
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

