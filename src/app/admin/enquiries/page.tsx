"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Download,
  Phone,
  MessageCircle,
  Trash2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface EnquiryRecord {
  id: number;
  name: string;
  phone: string;
  course: string;
  qualification?: string;
  city?: string;
  message?: string;
  status: string;
  createdAt: string;
}

export default function EnquiriesCRMPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  async function loadEnquiries() {
    try {
      const res = await adminFetch("/api/admin/enquiries");
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.error("Error loading enquiries:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function updateStatus(id: number, newStatus: string) {
    try {
      const res = await adminFetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  async function deleteEnquiry(id: number) {
    if (!confirm("Are you sure you want to delete this admission enquiry?")) return;
    try {
      const res = await adminFetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Error deleting enquiry:", err);
    }
  }

  const filtered = enquiries.filter((e) => {
    const matchesStatus = filterStatus === "All" || e.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.phone.includes(q) ||
      e.course.toLowerCase().includes(q) ||
      (e.city && e.city.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  function exportCSV() {
    if (filtered.length === 0) return;
    const headers = ["ID", "Name", "Phone", "Course", "Qualification", "City", "Message", "Status", "Date"];
    const rows = filtered.map((e) => [
      e.id,
      `"${(e.name || "").replace(/"/g, '""')}"`,
      e.phone,
      `"${(e.course || "").replace(/"/g, '""')}"`,
      `"${(e.qualification || "").replace(/"/g, '""')}"`,
      `"${(e.city || "").replace(/"/g, '""')}"`,
      `"${(e.message || "").replace(/"/g, '""')}"`,
      e.status,
      new Date(e.createdAt).toLocaleString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `adarsh_college_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Page Heading & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17324D] tracking-tight flex items-center gap-2.5">
            <Users className="h-6 w-6 text-[#168C8C]" />
            Admission Enquiries (CRM)
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-medium">
            Track student leads from website, update admissions status, and export for offline reporting.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadEnquiries}
            className="p-2 rounded-xl bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors shadow-xs"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium px-4 py-2 text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export to Excel / CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E4E7EC] flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search by student, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-white border border-[#D1D5DB] pl-10 pr-4 py-2 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C] transition-colors"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
          <div className="flex flex-wrap gap-1.5">
            {["All", "New", "Contacted", "Enrolled", "Closed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === s
                    ? "bg-[#17324D] text-white shadow-xs"
                    : "bg-white text-[#667085] border border-[#E4E7EC] hover:bg-[#F5F7FA] hover:text-[#17324D]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-medium text-[#667085] hidden lg:inline-block pl-2 border-l border-[#E4E7EC]">
            {filtered.length} {filtered.length === 1 ? "record" : "records"}
          </span>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-2xl bg-white border border-[#E4E7EC] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-[#667085]">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#168C8C]" />
            <p className="text-xs">Loading enquiries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="h-10 w-10 text-[#9CA3AF] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#17324D]">No matching enquiries found</h3>
            <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
              {search || filterStatus !== "All"
                ? "Try clearing your search keyword or changing the status filter."
                : "No student admission leads received yet."}
            </p>
            {(search || filterStatus !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterStatus("All");
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#17324D] bg-[#F5F7FA] border border-[#E4E7EC] hover:bg-[#E4E7EC] transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-[#667085] border-b border-[#E4E7EC] bg-[#F8FAFC]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Phone Number</th>
                  <th className="py-3 px-4 font-semibold">Interested Course</th>
                  <th className="py-3 px-4 font-semibold">Qualification / City</th>
                  <th className="py-3 px-4 font-semibold">Message</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#17324D]">
                      {enq.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#4B5563] font-mono">
                      {enq.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#168C8C]/10 text-[#168C8C] border border-[#168C8C]/20">
                        {enq.course}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#4B5563]">
                      <div>{enq.qualification || "—"}</div>
                      <div className="text-[10px] text-[#667085]">{enq.city || ""}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#667085] max-w-xs truncate" title={enq.message}>
                      {enq.message || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => updateStatus(enq.id, e.target.value)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border focus:outline-none cursor-pointer ${
                          enq.status === "New"
                            ? "bg-[#FEF7EC] border-[#F8DCB3] text-[#B7791F]"
                            : enq.status === "Enrolled"
                            ? "bg-[#EBF7EE] border-[#B7E4C7] text-[#16803C]"
                            : enq.status === "Closed"
                            ? "bg-[#F3F4F6] border-[#E5E7EB] text-[#374151]"
                            : "bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/91${enq.phone}?text=Hello%20${encodeURIComponent(
                            enq.name
                          )},%20this%20is%20Adarsh%20College%20of%20Nursing%20regarding%20your%20admission%20enquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#EBF7EE] hover:bg-[#D4EED8] text-[#16803C] border border-[#B7E4C7] transition-colors"
                          title="WhatsApp Student"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={`tel:+91${enq.phone}`}
                          className="p-1.5 rounded-lg bg-white hover:bg-[#F5F7FA] text-[#4B5563] border border-[#E4E7EC] transition-colors"
                          title="Call Student"
                          aria-label="Call"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => deleteEnquiry(enq.id)}
                          className="p-1.5 rounded-lg bg-[#FDF2F2] hover:bg-[#FEE2E2] text-[#C93636] border border-[#FAC5C5] transition-colors"
                          title="Delete enquiry"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

