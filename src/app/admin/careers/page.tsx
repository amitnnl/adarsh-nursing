"use client";

import { useEffect, useState } from "react";
import { Briefcase, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminCareersPage() {
  const [openings, setOpenings] = useState<{ teaching: string[]; nonTeaching: string[] }>({
    teaching: [],
    nonTeaching: [],
  });
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"teaching" | "nonTeaching">("teaching");

  async function loadOpenings() {
    try {
      const res = await adminFetch("/api/admin/careers");
      if (res.ok) {
        const data = await res.json();
        setOpenings(data.openings || { teaching: [], nonTeaching: [] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOpenings();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await adminFetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category }),
      });

      if (res.ok) {
        setTitle("");
        loadOpenings();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(jobTitle: string) {
    if (!confirm(`Remove vacancy "${jobTitle}"?`)) return;
    try {
      const res = await adminFetch(`/api/admin/careers?title=${encodeURIComponent(jobTitle)}`, { method: "DELETE" });
      if (res.ok) loadOpenings();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E4E7EC]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#168C8C]/10 border border-[#168C8C]/20 text-[#168C8C] text-xs font-semibold mb-2">
            <Briefcase className="h-3.5 w-3.5" />
            Recruitment & Faculty
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#17324D] flex items-center gap-2.5">
            Careers & Job Vacancies
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Post and manage open teaching and non-teaching positions for Adarsh College of Nursing.
          </p>
        </div>
      </div>

      {/* Add New Vacancy Form */}
      <form onSubmit={handleAdd} className="p-6 rounded-2xl bg-white border border-[#E4E7EC] space-y-4 shadow-sm">
        <h2 className="text-xs uppercase tracking-wider text-[#17324D] font-bold">Post New Job Vacancy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="Position Title (e.g. Nursing Tutor)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="sm:col-span-2 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] px-3.5 py-2.5 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C]"
          />
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "teaching" | "nonTeaching")}
              className="flex-1 rounded-xl bg-[#F9FAFB] border border-[#D1D5DB] px-3 py-2.5 text-sm text-[#1F2937] focus:outline-none focus:bg-white focus:border-[#168C8C]"
            >
              <option value="teaching">Teaching Staff</option>
              <option value="nonTeaching">Non-Teaching Staff</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#1f4264] text-white font-medium text-sm inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Post
            </button>
          </div>
        </div>
      </form>

      {/* Vacancies Display */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-[#667085] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#168C8C]" />
          <p className="text-sm font-medium">Loading career vacancies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teaching Positions */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4E7EC] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
            <h2 className="font-display text-base font-bold text-[#17324D]">Teaching Faculty Openings</h2>
            <span className="text-xs font-semibold text-[#168C8C] bg-[#168C8C]/10 px-2.5 py-0.5 rounded-full border border-[#168C8C]/20">
              {openings.teaching.length} Active
            </span>
          </div>
          {openings.teaching.length === 0 ? (
            <p className="text-center py-8 text-xs text-[#9CA3AF]">No active teaching positions posted.</p>
          ) : (
            <ul className="space-y-2">
              {openings.teaching.map((t) => (
                <li
                  key={t}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E4E7EC] text-sm text-[#1F2937] hover:border-[#168C8C]/30 transition-all"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#168C8C] shrink-0" />
                    {t}
                  </span>
                  <button
                    onClick={() => handleDelete(t)}
                    className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#C93636] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
                    title={`Delete ${t}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Non-Teaching Positions */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4E7EC] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
            <h2 className="font-display text-base font-bold text-[#17324D]">Administrative & Support Roles</h2>
            <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#2563EB]/20">
              {openings.nonTeaching.length} Active
            </span>
          </div>
          {openings.nonTeaching.length === 0 ? (
            <p className="text-center py-8 text-xs text-[#9CA3AF]">No active administrative roles posted.</p>
          ) : (
            <ul className="space-y-2">
              {openings.nonTeaching.map((nt) => (
                <li
                  key={nt}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E4E7EC] text-sm text-[#1F2937] hover:border-[#168C8C]/30 transition-all"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
                    {nt}
                  </span>
                  <button
                    onClick={() => handleDelete(nt)}
                    className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#C93636] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
                    title={`Delete ${nt}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )}
  </div>
);
}
