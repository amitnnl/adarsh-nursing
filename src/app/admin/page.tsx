"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  ArrowRight,
  Phone,
  MessageCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Sliders,
  Images,
  FileCheck2,
  Bell,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface EnquiryItem {
  id: number;
  name: string;
  phone: string;
  course: string;
  city?: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    enquiriesCount: 0,
    coursesCount: 3,
    facilitiesCount: 6,
    openingsCount: 10,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [enqRes, coursesRes] = await Promise.all([
        adminFetch("/api/admin/enquiries"),
        adminFetch("/api/admin/courses"),
      ]);

      if (enqRes.ok) {
        const enqData = await enqRes.json();
        setStats((prev) => ({ ...prev, enquiriesCount: enqData.enquiries?.length || 0 }));
        setRecentEnquiries((enqData.enquiries || []).slice(0, 5));
      }

      if (coursesRes.ok) {
        const cData = await coursesRes.json();
        if (cData.courses?.length) {
          setStats((prev) => ({ ...prev, coursesCount: cData.courses.length }));
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Heading & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17324D] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-medium">
            Overview of college administration and live operations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            title="Refresh metrics"
            className="p-2 rounded-xl bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors shadow-xs"
            aria-label="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium px-4 py-2 text-xs shadow-xs transition-colors"
          >
            <Users className="h-4 w-4" />
            View Leads
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-[#F5F7FA] text-[#1F2937] font-medium px-4 py-2 text-xs border border-[#E4E7EC] shadow-xs transition-colors"
          >
            <Sliders className="h-4 w-4 text-[#667085]" />
            Site Settings
          </Link>
        </div>
      </div>

      {/* College Session Banner */}
      <div className="rounded-2xl bg-white border border-[#E4E7EC] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#168C8C]/10 border border-[#168C8C]/20 text-[#168C8C] text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Admissions Session 2026-27 Active
          </div>
          <h2 className="text-base font-bold text-[#17324D]">
            Adarsh College of Nursing Administration
          </h2>
          <p className="text-xs text-[#667085] max-w-2xl leading-relaxed">
            Manage academic courses, student enquiries CRM, notices, campus facilities, and live website configurations from one secure administrative portal.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#168C8C] bg-[#168C8C]/10 hover:bg-[#168C8C]/15 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Public Site
          </Link>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#667085] font-semibold">
              Total Enquiries
            </span>
            <span className="p-2.5 rounded-xl bg-[#168C8C]/10 text-[#168C8C]">
              <Users className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#17324D]">{stats.enquiriesCount}</h3>
            <p className="text-xs text-[#667085] mt-0.5">Student admission enquiries</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#667085] font-semibold">
              Programmes
            </span>
            <span className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <GraduationCap className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#17324D]">{stats.coursesCount}</h3>
            <p className="text-xs text-[#667085] mt-0.5">ANM, GNM & B.Sc. Nursing</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#667085] font-semibold">
              Facilities
            </span>
            <span className="p-2.5 rounded-xl bg-[#B7791F]/10 text-[#B7791F]">
              <Building2 className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#17324D]">{stats.facilitiesCount}</h3>
            <p className="text-xs text-[#667085] mt-0.5">Hostel, Labs, Transport</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#667085] font-semibold">
              Staff Openings
            </span>
            <span className="p-2.5 rounded-xl bg-[#16803C]/10 text-[#16803C]">
              <Briefcase className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#17324D]">{stats.openingsCount}</h3>
            <p className="text-xs text-[#667085] mt-0.5">Faculty & Staff Posts</p>
          </div>
        </div>
      </div>

      {/* Quick Customization Hub */}
      <div>
        <h2 className="text-xs uppercase font-semibold tracking-wider text-[#667085] mb-3">
          Quick Management
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Link
            href="/admin/gallery"
            className="p-4 rounded-xl bg-white border border-[#E4E7EC] hover:border-[#168C8C] hover:shadow-xs transition-all group"
          >
            <div className="h-8 w-8 rounded-lg bg-[#168C8C]/10 text-[#168C8C] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Images className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-[#17324D] text-xs">Campus Gallery</h3>
            <p className="text-[11px] text-[#667085] mt-0.5">Manage photo album</p>
          </Link>

          <Link
            href="/admin/admissions"
            className="p-4 rounded-xl bg-white border border-[#E4E7EC] hover:border-[#168C8C] hover:shadow-xs transition-all group"
          >
            <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileCheck2 className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-[#17324D] text-xs">Admissions Setup</h3>
            <p className="text-[11px] text-[#667085] mt-0.5">4 Steps & document checklist</p>
          </Link>

          <Link
            href="/admin/why-us"
            className="p-4 rounded-xl bg-white border border-[#E4E7EC] hover:border-[#168C8C] hover:shadow-xs transition-all group"
          >
            <div className="h-8 w-8 rounded-lg bg-[#B7791F]/10 text-[#B7791F] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-[#17324D] text-xs">Why Choose Us</h3>
            <p className="text-[11px] text-[#667085] mt-0.5">6 Pillar feature cards</p>
          </Link>

          <Link
            href="/admin/notices"
            className="p-4 rounded-xl bg-white border border-[#E4E7EC] hover:border-[#168C8C] hover:shadow-xs transition-all group"
          >
            <div className="h-8 w-8 rounded-lg bg-[#17324D]/10 text-[#17324D] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Bell className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-[#17324D] text-xs">Notices & Board</h3>
            <p className="text-[11px] text-[#667085] mt-0.5">Urgent circulars & PDFs</p>
          </Link>
        </div>
      </div>

      {/* Recent Enquiries / Leads Section */}
      <div className="rounded-2xl bg-white border border-[#E4E7EC] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-[#17324D]">
              Recent Admission Enquiries
            </h2>
            <p className="text-xs text-[#667085] mt-0.5">
              Students who recently submitted the enquiry form online
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-semibold text-[#168C8C] hover:text-[#127272] flex items-center gap-1 transition-colors"
          >
            All Enquiries
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#F8FAFC] border border-dashed border-[#E4E7EC]">
            <Users className="h-8 w-8 text-[#9CA3AF] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#17324D]">No enquiries yet</p>
            <p className="text-xs text-[#667085] mt-1">
              New submissions from the website enquiry form will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-[#667085] border-b border-[#E4E7EC] bg-[#F8FAFC]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Phone Number</th>
                  <th className="py-3 px-4 font-semibold">Interested Course</th>
                  <th className="py-3 px-4 font-semibold">City / Area</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#17324D]">
                      {enq.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#4B5563] font-mono text-xs">
                      {enq.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#168C8C]/10 text-[#168C8C] border border-[#168C8C]/20">
                        {enq.course}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#667085]">
                      {enq.city || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          enq.status === "New"
                            ? "bg-[#FEF7EC] text-[#B7791F] border border-[#F8DCB3]"
                            : enq.status === "Enrolled"
                            ? "bg-[#EBF7EE] text-[#16803C] border border-[#B7E4C7]"
                            : enq.status === "Closed"
                            ? "bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]"
                            : "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/91${enq.phone}?text=Hello%20${encodeURIComponent(
                            enq.name
                          )},%20this%20is%20Adarsh%20College%20of%20Nursing.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#EBF7EE] hover:bg-[#D4EED8] text-[#16803C] border border-[#B7E4C7] transition-colors"
                          title="WhatsApp Student"
                          aria-label="WhatsApp Student"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={`tel:+91${enq.phone}`}
                          className="p-1.5 rounded-lg bg-white hover:bg-[#F5F7FA] text-[#4B5563] border border-[#E4E7EC] transition-colors"
                          title="Call Student"
                          aria-label="Call Student"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
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

