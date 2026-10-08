import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adarshnursingcollege.com";
  const routes = [
    "",
    "/about",
    "/courses",
    "/admissions",
    "/facilities",
    "/gallery",
    "/careers",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/admissions" || route === "/courses" ? 0.9 : 0.8,
  }));
}
