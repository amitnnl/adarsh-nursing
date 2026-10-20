"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Bell,
  Images,
  FileCheck2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { adminFetch, removeAdminToken } from "@/lib/admin-fetch";

const navSections = [
  {
    title: "Core Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Enquiries CRM", href: "/admin/enquiries", icon: Users },
    ],
  },
  {
    title: "Academics & Admissions",
    items: [
      { name: "Admissions Setup", href: "/admin/admissions", icon: FileCheck2 },
      { name: "Courses", href: "/admin/courses", icon: GraduationCap },
      { name: "Facilities", href: "/admin/facilities", icon: Building2 },
    ],
  },
  {
    title: "Content Management",
    items: [
      { name: "Campus Gallery", href: "/admin/gallery", icon: Images },
      { name: "Why Choose Us", href: "/admin/why-us", icon: Sparkles },
      { name: "Notices & Board", href: "/admin/notices", icon: Bell },
      { name: "Careers & Jobs", href: "/admin/careers", icon: Briefcase },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Site & Hero Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);
  const [logo, setLogo] = useState("/images/logo-mark.png");

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    adminFetch("/api/admin/me")
      .then(async (res) => {
        if (!res.ok) {
          router.push("/admin/login");
          return null;
        }
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => router.push("/admin/login"));

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
        if (data?.settings?.logo) setLogo(data.settings.logo);
      })
      .catch(() => {});
  }, [router, pathname, isLoginPage]);

  // If on login page, render clean layout without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  async function handleLogout() {
    await adminFetch("/api/admin/logout", { method: "POST" });
    removeAdminToken();
    router.push("/admin/login");
    router.refresh();
  }

  // Derive current page title for breadcrumb
  let currentPageName = "Dashboard";
  for (const section of navSections) {
    for (const item of section.items) {
      if (item.href === pathname) {
        currentPageName = item.name;
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1F2937] flex flex-col antialiased">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E4E7EC] flex flex-col transition-transform duration-300 shadow-sm lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#E4E7EC] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-[#F5F7FA] border border-[#E4E7EC] p-1 flex items-center justify-center overflow-hidden">
              <Image
                src={logo}
                alt="Adarsh College Logo"
                width={28}
                height={28}
                style={{ width: "auto", height: "auto" }}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm leading-tight text-[#17324D] truncate">
                Adarsh College
              </h2>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#168C8C]">
                Administration
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#667085]">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#168C8C]/10 text-[#17324D] font-semibold border-l-3 border-[#168C8C]"
                          : "text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA]"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-[#168C8C]" : "text-[#667085]"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick link to live public site */}
          <div className="pt-2 border-t border-[#E4E7EC]">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="h-4 w-4 text-[#168C8C]" />
                View Public Site
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#16803C]/10 text-[#16803C] px-2 py-0.5 rounded-full border border-[#16803C]/20">
                Live
              </span>
            </Link>
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-[#E4E7EC] bg-[#F8FAFC]">
          <div className="flex items-center justify-between gap-2 p-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-[#17324D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user?.name?.[0] || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#17324D] truncate">
                  {user?.name || "Administrator"}
                </p>
                <p className="text-[10px] text-[#667085] truncate">
                  @{user?.username || "admin"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#667085] hover:text-[#C93636] hover:bg-[#FDF2F2] transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E4E7EC] flex items-center justify-between px-4 sm:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] lg:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-[#667085]">
              <span className="font-medium hover:text-[#17324D]">Adarsh Admin</span>
              <ChevronRight className="h-3 w-3 text-[#9CA3AF]" />
              <span className="font-semibold text-[#17324D]">{currentPageName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#667085] hover:text-[#17324D] bg-[#F5F7FA] border border-[#E4E7EC] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#168C8C]" />
              Public Portal
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-[#E4E7EC] text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#168C8C]/10 text-[#168C8C] font-medium text-[11px]">
                <ShieldCheck className="h-3 w-3" />
                Auth Active
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

