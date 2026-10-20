"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

import { setAdminToken } from "@/lib/admin-fetch";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const ct = res.headers.get("content-type");
      const data = ct && ct.includes("application/json") ? await res.json() : null;
      if (!res.ok) {
        setError(data?.error || "Login failed. Check your credentials.");
      } else {
        if (data?.token) {
          setAdminToken(data.token);
        }
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Network error. Could not connect to authentication service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1F2937] p-4">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-white border border-[#E4E7EC] shadow-xs mb-3">
            <Image
              src="/images/logo-mark.png"
              alt="Adarsh College of Nursing"
              width={44}
              height={44}
              className="object-contain"
              unoptimized
            />
          </div>
          <h1 className="text-2xl font-bold text-[#17324D] tracking-tight">
            Adarsh College of Nursing
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-medium">
            Administration Portal & Management Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white border border-[#E4E7EC] p-7 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-wider text-[#168C8C]">
            <ShieldCheck className="h-4 w-4" />
            Admin Secure Sign In
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FDF2F2] border border-[#FAC5C5] flex items-start gap-2.5 text-[#C93636] text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-xl bg-white border border-[#D1D5DB] pl-10 pr-4 py-2.5 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#374151] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl bg-white border border-[#D1D5DB] pl-10 pr-4 py-2.5 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#168C8C] focus:ring-1 focus:ring-[#168C8C] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium py-3 text-sm shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign in to Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E4E7EC] text-center">
            <p className="text-xs text-[#667085]">
              Default bootstrap credentials:{" "}
              <span className="text-[#17324D] font-mono font-semibold">admin</span> /{" "}
              <span className="text-[#17324D] font-mono font-semibold">Adarsh@2026</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          © {new Date().getFullYear()} Adarsh College of Nursing · Niwaz Nagar, Narnaul
        </p>
      </div>
    </div>
  );
}

