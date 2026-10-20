"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Plus, Edit2, Trash2, Clock, X, RefreshCw } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface CourseItem {
  slug: string;
  code: string;
  name: string;
  fullName: string;
  duration: string;
  years: number;
  type: string;
  eligibility: string[];
  summary: string;
  learn?: string[];
  careers?: string[];
  accent?: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function loadCourses() {
    try {
      const res = await adminFetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      const isNew = !courses.some((c) => c.slug === editingCourse.slug);
      const res = await adminFetch("/api/admin/courses", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCourse),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingCourse(null);
        loadCourses();
      }
    } catch (err) {
      console.error("Error saving course:", err);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Are you sure you want to remove the course "${slug}"?`)) return;
    try {
      const res = await adminFetch(`/api/admin/courses?slug=${slug}`, { method: "DELETE" });
      if (res.ok) {
        loadCourses();
      }
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Heading & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17324D] tracking-tight flex items-center gap-2.5">
            <GraduationCap className="h-6 w-6 text-[#168C8C]" />
            Courses & Programmes
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-medium">
            Manage degree and diploma courses, eligibility requirements, and curricula.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCourses}
            title="Refresh courses"
            className="p-2 rounded-xl bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors shadow-xs"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setEditingCourse({
                slug: "",
                code: "",
                name: "",
                fullName: "",
                duration: "2 Years",
                years: 2,
                type: "Diploma",
                eligibility: ["10+2 pass"],
                summary: "",
                learn: [],
                careers: [],
                accent: "navy",
              });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium px-4 py-2 text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </button>
        </div>
      </div>

      {/* Courses Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-[#667085]">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#168C8C]" />
          <p className="text-xs">Loading academic programmes...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-16 rounded-2xl bg-white border border-[#E4E7EC] text-center">
          <GraduationCap className="h-10 w-10 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#17324D]">No courses configured</h3>
          <p className="text-xs text-[#667085] mt-1">Click &quot;Add Course&quot; to define academic programmes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div
              key={c.slug}
              className="p-6 rounded-2xl bg-white border border-[#E4E7EC] flex flex-col justify-between shadow-xs hover:border-[#168C8C]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#168C8C]/10 text-[#168C8C] border border-[#168C8C]/20">
                    {c.type}
                  </span>
                  <span className="text-xs text-[#667085] font-medium flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {c.duration}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#17324D]">{c.name}</h3>
                <p className="text-xs text-[#4B5563] font-medium mt-0.5">{c.fullName}</p>
                <p className="text-xs text-[#667085] mt-3 line-clamp-3 leading-relaxed">{c.summary}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E4E7EC] flex items-center justify-between">
                <span className="text-[11px] text-[#9CA3AF] font-mono">#{c.slug}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingCourse(c);
                      setShowModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#E4E7EC] text-[#17324D] border border-[#E4E7EC] transition-colors"
                    title="Edit Course"
                    aria-label="Edit Course"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.slug)}
                    className="p-1.5 rounded-lg bg-[#FDF2F2] hover:bg-[#FEE2E2] text-[#C93636] border border-[#FAC5C5] transition-colors"
                    title="Delete Course"
                    aria-label="Delete Course"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Edit/Create Modal */}
      {showModal && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E4E7EC] rounded-2xl p-6 sm:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4E7EC]">
              <h2 className="text-lg font-bold text-[#17324D]">
                {editingCourse.slug ? `Edit ${editingCourse.name}` : "Create New Programme"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#17324D] rounded-lg"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#374151] font-semibold mb-1">Course Code (e.g. A.N.M.)</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.name}
                    onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value, code: e.target.value })}
                    className="w-full rounded-xl bg-white border border-[#D1D5DB] px-3 py-2 text-[#1F2937] focus:outline-none focus:border-[#168C8C]"
                  />
                </div>
                <div>
                  <label className="block text-[#374151] font-semibold mb-1">URL Slug (e.g. anm)</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.slug}
                    onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                    className="w-full rounded-xl bg-white border border-[#D1D5DB] px-3 py-2 text-[#1F2937] focus:outline-none focus:border-[#168C8C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#374151] font-semibold mb-1">Full Degree Name</label>
                <input
                  type="text"
                  required
                  value={editingCourse.fullName}
                  onChange={(e) => setEditingCourse({ ...editingCourse, fullName: e.target.value })}
                  placeholder="Auxiliary Nurse Midwifery"
                  className="w-full rounded-xl bg-white border border-[#D1D5DB] px-3 py-2 text-[#1F2937] focus:outline-none focus:border-[#168C8C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#374151] font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    placeholder="2 Years"
                    className="w-full rounded-xl bg-white border border-[#D1D5DB] px-3 py-2 text-[#1F2937] focus:outline-none focus:border-[#168C8C]"
                  />
                </div>
                <div>
                  <label className="block text-[#374151] font-semibold mb-1">Programme Type</label>
                  <select
                    value={editingCourse.type}
                    onChange={(e) => setEditingCourse({ ...editingCourse, type: e.target.value })}
                    className="w-full rounded-xl bg-white border border-[#D1D5DB] px-3 py-2 text-[#1F2937] focus:outline-none focus:border-[#168C8C]"
                  >
                    <option value="Diploma">Diploma</option>
                    <option value="Degree">Degree</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#374151] font-semibold mb-1">Course Summary</label>
                <textarea
                  rows={3}
                  value={editingCourse.summary}
                  onChange={(e) => setEditingCourse({ ...editingCourse, summary: e.target.value })}
                  className="w-full rounded-xl bg-white border border-[#D1D5DB] px-3 py-2 text-[#1F2937] focus:outline-none focus:border-[#168C8C]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E4E7EC]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#4B5563] hover:bg-[#F5F7FA] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium shadow-xs"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

