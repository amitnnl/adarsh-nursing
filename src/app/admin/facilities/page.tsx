"use client";

import { useEffect, useState } from "react";
import { Building2, Plus, Trash2, RefreshCw } from "lucide-react";
import { FacilityIcon } from "@/components/facility-icon";
import { adminFetch } from "@/lib/admin-fetch";

interface FacilityItem {
  id?: number;
  title: string;
  text: string;
  icon: string;
}

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [newIcon, setNewIcon] = useState("BedDouble");

  async function loadFacilities() {
    try {
      const res = await adminFetch("/api/admin/facilities");
      if (res.ok) {
        const data = await res.json();
        setFacilities(data.facilities || []);
      }
    } catch (err) {
      console.error("Error loading facilities:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFacilities();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const res = await adminFetch("/api/admin/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, text: newText, icon: newIcon }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewText("");
        loadFacilities();
      }
    } catch (err) {
      console.error("Error adding facility:", err);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to remove this facility?")) return;
    try {
      const res = await adminFetch(`/api/admin/facilities?id=${id}`, { method: "DELETE" });
      if (res.ok) loadFacilities();
    } catch (err) {
      console.error("Error deleting facility:", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17324D] tracking-tight flex items-center gap-2.5">
            <Building2 className="h-6 w-6 text-[#168C8C]" />
            Campus Facilities
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-medium">
            Manage campus amenities displayed across the website (Hostel, Transport, Labs, Library).
          </p>
        </div>
        <button
          onClick={loadFacilities}
          title="Refresh facilities"
          className="p-2 rounded-xl bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors shadow-xs self-start sm:self-auto"
          aria-label="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Add New Facility Card */}
      <form onSubmit={handleAdd} className="p-6 rounded-2xl bg-white border border-[#E4E7EC] space-y-4 shadow-xs">
        <h2 className="text-xs uppercase tracking-wider text-[#168C8C] font-semibold">
          Add New Facility
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="Facility Title (e.g. Computer Lab)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="rounded-xl bg-white border border-[#D1D5DB] px-3.5 py-2 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#168C8C]"
          />
          <input
            type="text"
            placeholder="Short Description"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="rounded-xl bg-white border border-[#D1D5DB] px-3.5 py-2 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#168C8C]"
          />
          <div className="flex gap-2">
            <select
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="flex-1 rounded-xl bg-white border border-[#D1D5DB] px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#168C8C]"
            >
              <option value="Stethoscope">Stethoscope (Nursing Foundations)</option>
              <option value="Microscope">Microscope (Anatomy / Physiology)</option>
              <option value="FlaskConical">Flask (Science / Chemistry Lab)</option>
              <option value="ShieldAlert">Shield (Community Health)</option>
              <option value="Apple">Apple (Nutrition & Dietetics)</option>
              <option value="GraduationCap">Cap (Computer Lab / Academics)</option>
              <option value="BookOpen">Book (Library & Reading Room)</option>
              <option value="BedDouble">Bed (Hostel / Residential)</option>
              <option value="Bus">Bus (College Transport)</option>
              <option value="Presentation">Classroom / Smart Lecture</option>
              <option value="Building2">Building (Campus Infrastructure)</option>
              <option value="TreePine">Tree (Lush Green Campus)</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium text-xs inline-flex items-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
      </form>

      {/* Facilities Grid */}
      {loading ? (
        <div className="p-16 text-center text-[#667085]">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#168C8C]" />
          <p className="text-xs">Loading campus facilities...</p>
        </div>
      ) : facilities.length === 0 ? (
        <div className="p-16 rounded-2xl bg-white border border-[#E4E7EC] text-center">
          <Building2 className="h-10 w-10 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#17324D]">No campus facilities added yet</h3>
          <p className="text-xs text-[#667085] mt-1">Use the form above to add laboratories, hostel, transport, etc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((f, i) => (
            <div
              key={f.id || i}
              className="p-6 rounded-2xl bg-white border border-[#E4E7EC] flex flex-col justify-between shadow-xs hover:border-[#168C8C]/40 transition-colors"
            >
              <div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#168C8C]/10 text-[#168C8C] border border-[#168C8C]/20 mb-3">
                  <FacilityIcon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold text-[#17324D]">{f.title}</h3>
                <p className="text-xs text-[#667085] mt-2 leading-relaxed">{f.text}</p>
              </div>
              {f.id && (
                <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex justify-end">
                  <button
                    onClick={() => handleDelete(f.id!)}
                    className="p-1.5 rounded-lg bg-[#FDF2F2] hover:bg-[#FEE2E2] text-[#C93636] border border-[#FAC5C5] transition-colors"
                    title="Delete facility"
                    aria-label="Delete facility"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

