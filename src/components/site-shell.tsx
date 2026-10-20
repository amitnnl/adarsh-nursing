"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import type { SiteData } from "@/lib/data";

export function SiteShell({
  children,
  siteData,
  logo,
  siteName,
  shortName,
  tagline,
}: {
  children: React.ReactNode;
  siteData?: SiteData;
  logo?: string;
  siteName?: string;
  shortName?: string;
  tagline?: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [liveData, setLiveData] = useState<SiteData | undefined>(undefined);

  useEffect(() => {
    if (isAdmin) return;
    const handleSync = () => {
      fetch("/api/admin/settings")
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
            setLiveData((prev) => ({
              ...(prev || siteData || {}),
              ...data.settings,
              address: {
                ...((prev?.address || siteData?.address) || {}),
                ...(data.settings.address || {}),
              },
              hero: {
                ...((prev?.hero || siteData?.hero) || {}),
                ...(data.settings.hero || {}),
              },
              social: {
                ...((prev?.social || siteData?.social) || {}),
                ...(data.settings.social || {}),
              },
            } as SiteData));
          }
        })
        .catch(() => {});
    };

    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, [isAdmin, siteData]);

  // On admin routes (/admin, /admin/login, /admin/enquiries, etc.),
  // do NOT render the public website header, footer, or floating WhatsApp button.
  if (isAdmin) {
    return <>{children}</>;
  }

  const effectiveLogo = liveData?.logo || siteData?.logo || logo;
  const effectiveName = liveData?.name || siteData?.name || siteName;
  const effectiveShort = liveData?.shortName || siteData?.shortName || shortName;
  const effectiveTagline = liveData?.tagline || siteData?.tagline || tagline;

  return (
    <>
      <SiteHeader
        siteData={liveData}
        logo={effectiveLogo}
        siteName={effectiveName}
        shortName={effectiveShort}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        siteData={liveData}
        logo={effectiveLogo}
        siteName={effectiveName}
        tagline={effectiveTagline}
      />
      <WhatsAppFab whatsapp={liveData?.whatsapp || siteData?.whatsapp} />
    </>
  );
}

