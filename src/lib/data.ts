import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { db, isDatabaseAvailable } from "@/lib/db";
import {
  site as defaultSite,
  courses as defaultCourses,
  facilities as defaultFacilities,
  openings as defaultOpenings,
  whyUs as defaultWhyUs,
  admissionSteps as defaultSteps,
  documents as defaultDocs,
  type Course,
} from "@/lib/site";

export type HeroSlide = {
  src: string;
  alt: string;
  tag: string;
  caption: string;
};

export type HeroData = {
  badge: string;
  titleLead: string;
  titleHighlight: string;
  description: string;
  image: string;
  slides?: HeroSlide[];
  stat1Val: string;
  stat1Label: string;
  stat2Val: string;
  stat2Label: string;
  stat3Val: string;
  stat3Label: string;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
};

export type SocialLinks = {
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
};

export type SiteData = typeof defaultSite & {
  marqueeText?: string[];
  bannerNotice?: string;
  isBannerActive?: boolean;
  hero: HeroData;
  social: SocialLinks;
  brochurePdf?: string;
};

// Global in-memory cache preserved across requests in server runtime
type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const globalDataCache = globalThis as unknown as {
  __dataMemoryCache?: Map<string, CacheEntry<unknown>>;
  __dataInFlight?: Map<string, Promise<unknown>>;
};

if (!globalDataCache.__dataMemoryCache) {
  globalDataCache.__dataMemoryCache = new Map();
}
if (!globalDataCache.__dataInFlight) {
  globalDataCache.__dataInFlight = new Map();
}

const memoryCache = globalDataCache.__dataMemoryCache;
const inFlight = globalDataCache.__dataInFlight;
const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds

async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const existingPromise = inFlight.get(key);
  if (existingPromise) {
    return existingPromise as Promise<T>;
  }

  const promise = (async () => {
    try {
      const data = await fetcher();
      memoryCache.set(key, { data, expiresAt: Date.now() + ttlMs });
      return data;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, promise);
  return promise;
}

/**
 * Invalidate cached data so subsequent calls re-fetch from database immediately.
 * Called whenever an admin saves updates.
 */
export function invalidateDataCache(key?: string) {
  if (key) {
    memoryCache.delete(key);
  } else {
    memoryCache.clear();
  }
}

async function fetchSiteSettingsInternal(): Promise<SiteData> {
  const defaultSlides: HeroSlide[] = [
    {
      src: "/images/campus.jpg",
      alt: "Adarsh College of Nursing campus building and lawns",
      tag: "Our Campus",
      caption: defaultSite.address.landmark || defaultSite.address.line1,
    },
    {
      src: "/images/nursing-lab.jpg",
      alt: "Practical nursing simulation and clinical skills lab",
      tag: "Practical Skills Lab",
      caption: "Clinical mannequins & hospital simulation beds",
    },
    {
      src: "/images/nursing-library.jpg",
      alt: "College library and medical learning study hall",
      tag: "College Library",
      caption: "Medical books, journals & quiet study spaces",
    },
    {
      src: "/images/poster.jpg",
      alt: "Admissions open poster for session 2026-27",
      tag: "Admissions Open",
      caption: `A.N.M. · G.N.M. · B.Sc. Nursing (${defaultSite.session})`,
    },
  ];

  const defaultHero: HeroData = {
    badge: `Admissions open for ${defaultSite.session}`,
    titleLead: "Nurturing compassionate",
    titleHighlight: "healthcare professionals.",
    description: defaultSite.description,
    image: "/images/campus.jpg",
    slides: defaultSlides,
    stat1Val: "100%",
    stat1Label: "Clinical Exposure",
    stat2Val: "3+",
    stat2Label: "Recognized Courses",
    stat3Val: "10:1",
    stat3Label: "Student-Faculty Ratio",
    ctaPrimary: "Enquire now",
    ctaPrimaryLink: "/admissions",
    ctaSecondary: "Explore courses",
    ctaSecondaryLink: "/courses",
  };

  const defaultSocial: SocialLinks = {
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
  };

  const localBackup = () => {
    try {
      const localFile = path.join(process.cwd(), "public", "local_settings.json");
      if (fs.existsSync(localFile)) {
        const raw = fs.readFileSync(localFile, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return {
            ...defaultSite,
            ...parsed,
            address: { ...defaultSite.address, ...(parsed.address || {}) },
            hero: { ...defaultHero, ...(parsed.hero || {}) },
            social: { ...defaultSocial, ...(parsed.social || {}) },
          };
        }
      }
    } catch {}
    return {
      ...defaultSite,
      hero: defaultHero,
      social: defaultSocial,
    };
  };

  try {
    if (!(await isDatabaseAvailable())) {
      return localBackup();
    }

    const settings = await db.siteSetting.findMany();
    if (!settings || settings.length === 0) {
      return localBackup();
    }

    const map = new Map<string, string>();
    for (const s of settings) {
      map.set(s.key, s.value);
    }

    const lat = parseFloat(map.get("coords_lat") || String(defaultSite.coords.lat));
    const lng = parseFloat(map.get("coords_lng") || String(defaultSite.coords.lng));

    let heroSlides: HeroSlide[] = defaultSlides;
    const rawSlides = map.get("hero_slides");
    if (rawSlides) {
      try {
        const parsed = JSON.parse(rawSlides);
        if (Array.isArray(parsed) && parsed.length > 0) {
          heroSlides = parsed;
        }
      } catch {}
    } else if (map.get("hero_image")) {
      heroSlides = [
        {
          src: map.get("hero_image")!,
          alt: "Adarsh College of Nursing campus building and lawns",
          tag: "Our Campus",
          caption: map.get("address_landmark") || defaultSite.address.landmark,
        },
        ...defaultSlides.slice(1),
      ];
    }

    return {
      name: map.get("site_name") || defaultSite.name,
      shortName: map.get("site_short_name") || defaultSite.shortName,
      tagline: map.get("site_tagline") || defaultSite.tagline,
      description: map.get("site_description") || defaultSite.description,
      session: map.get("session_year") || defaultSite.session,
      phones: [
        map.get("phone_1") || defaultSite.phones[0],
        map.get("phone_2") || defaultSite.phones[1],
      ].filter(Boolean),
      whatsapp: map.get("whatsapp_number") || defaultSite.whatsapp,
      email: map.get("email_address") || defaultSite.email,
      address: {
        line1: map.get("address_line1") || defaultSite.address.line1,
        line2: map.get("address_line2") || defaultSite.address.line2,
        state: map.get("address_state") || defaultSite.address.state,
        pin: map.get("address_pin") || defaultSite.address.pin,
        landmark: map.get("address_landmark") || defaultSite.address.landmark,
      },
      coords: { lat, lng },
      values: defaultSite.values,
      logo: map.get("site_logo") || defaultSite.logo || "/images/logo-mark.png",
      bannerNotice: map.get("announcement_banner") || "",
      isBannerActive: map.get("announcement_active") !== "false",
      hero: {
        badge: map.get("hero_badge") || defaultHero.badge,
        titleLead: map.get("hero_title_lead") || defaultHero.titleLead,
        titleHighlight: map.get("hero_title_highlight") || defaultHero.titleHighlight,
        description: map.get("hero_description") || defaultHero.description,
        image: map.get("hero_image") || defaultHero.image,
        slides: heroSlides,
        stat1Val: map.get("hero_stat_1_val") || defaultHero.stat1Val,
        stat1Label: map.get("hero_stat_1_label") || defaultHero.stat1Label,
        stat2Val: map.get("hero_stat_2_val") || defaultHero.stat2Val,
        stat2Label: map.get("hero_stat_2_label") || defaultHero.stat2Label,
        stat3Val: map.get("hero_stat_3_val") || defaultHero.stat3Val,
        stat3Label: map.get("hero_stat_3_label") || defaultHero.stat3Label,
        ctaPrimary: map.get("hero_cta_primary") || defaultHero.ctaPrimary,
        ctaPrimaryLink: map.get("hero_cta_primary_link") || defaultHero.ctaPrimaryLink,
        ctaSecondary: map.get("hero_cta_secondary") || defaultHero.ctaSecondary,
        ctaSecondaryLink: map.get("hero_cta_secondary_link") || defaultHero.ctaSecondaryLink,
      },
      social: {
        facebook: map.get("social_facebook") || "",
        instagram: map.get("social_instagram") || "",
        youtube: map.get("social_youtube") || "",
        twitter: map.get("social_twitter") || "",
      },
      brochurePdf: map.get("brochure_pdf") || "",
    };
  } catch {
    return localBackup();
  }
}

async function fetchCoursesInternal(): Promise<Course[]> {
  try {
    if (!(await isDatabaseAvailable())) return defaultCourses;
    const records = await db.course.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    if (!records || records.length === 0) return defaultCourses;

    return records.map((r) => ({
      slug: r.slug,
      code: r.code,
      name: r.name,
      fullName: r.fullName,
      duration: r.duration,
      years: r.years,
      type: r.type as "Diploma" | "Degree",
      eligibility: JSON.parse(r.eligibility || "[]"),
      summary: r.summary,
      learn: JSON.parse(r.learn || "[]"),
      careers: JSON.parse(r.careers || "[]"),
      accent: (r.accent as "rose" | "navy" | "green") || "rose",
    }));
  } catch {
    return defaultCourses;
  }
}

async function fetchFacilitiesInternal() {
  try {
    if (!(await isDatabaseAvailable())) return defaultFacilities;
    const records = await db.facility.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    if (!records || records.length === 0) return defaultFacilities;

    return records.map((r) => ({
      title: r.title,
      text: r.text,
      icon: r.icon,
    }));
  } catch {
    return defaultFacilities;
  }
}

async function fetchJobOpeningsInternal() {
  try {
    if (!(await isDatabaseAvailable())) return defaultOpenings;
    const records = await db.jobOpening.findMany({
      orderBy: { displayOrder: "asc" },
    });

    if (!records || records.length === 0) return defaultOpenings;

    const teaching = records
      .filter((r) => r.category === "teaching" && r.status === "Open")
      .map((r) => r.title);
    const nonTeaching = records
      .filter((r) => r.category === "nonTeaching" && r.status === "Open")
      .map((r) => r.title);

    return {
      teaching: teaching.length > 0 ? teaching : defaultOpenings.teaching,
      nonTeaching: nonTeaching.length > 0 ? nonTeaching : defaultOpenings.nonTeaching,
    };
  } catch {
    return defaultOpenings;
  }
}

const defaultGalleryFallback = [
  {
    id: 1,
    src: "/images/campus.jpg",
    alt: "College building at dusk",
    caption: "Main building at dusk",
    category: "campus",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    src: "/images/campus.jpg",
    alt: "Front entrance",
    caption: "Main entrance",
    category: "campus",
    position: "object-[50%_58%]",
  },
  {
    id: 3,
    src: "/images/campus.jpg",
    alt: "Front lawn and garden",
    caption: "Lawns and seating",
    category: "campus",
    position: "object-[20%_75%]",
  },
  {
    id: 4,
    src: "/images/campus.jpg",
    alt: "College signage",
    caption: "Adarsh College of Nursing",
    category: "campus",
    position: "object-[50%_12%]",
  },
  {
    id: 5,
    src: "/images/poster.jpg",
    alt: "Admission poster",
    caption: "Admissions 2026-27",
    category: "admissions",
    position: "object-top",
  },
];

async function fetchGalleryPhotosInternal() {
  try {
    if (!(await isDatabaseAvailable())) {
      return defaultGalleryFallback;
    }
    const records = await db.galleryPhoto.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    if (!records || records.length === 0) {
      return defaultGalleryFallback;
    }

    return records.map((r) => ({
      id: r.id,
      src: r.src,
      alt: r.alt,
      caption: r.caption,
      category: r.category || "campus",
      span: r.span || undefined,
      position: r.position || undefined,
    }));
  } catch {
    return defaultGalleryFallback;
  }
}

async function fetchWhyUsInternal() {
  try {
    if (!(await isDatabaseAvailable())) return defaultWhyUs;
    const records = await db.whyUsCard.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    if (!records || records.length === 0) return defaultWhyUs;

    return records.map((r) => ({
      id: r.id,
      title: r.title,
      text: r.text,
    }));
  } catch {
    return defaultWhyUs;
  }
}

async function fetchAdmissionStepsInternal() {
  try {
    if (!(await isDatabaseAvailable())) return defaultSteps;
    const records = await db.admissionStep.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    if (!records || records.length === 0) return defaultSteps;

    return records.map((r) => ({
      id: r.id,
      stepNumber: r.stepNumber,
      title: r.title,
      text: r.text,
    }));
  } catch {
    return defaultSteps;
  }
}

async function fetchAdmissionDocumentsInternal() {
  try {
    if (!(await isDatabaseAvailable())) return defaultDocs;
    const records = await db.admissionDocument.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    if (!records || records.length === 0) return defaultDocs;

    return records.map((r) => r.title);
  } catch {
    return defaultDocs;
  }
}

async function fetchNoticesInternal() {
  try {
    if (!(await isDatabaseAvailable())) return [];
    const records = await db.notice.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    return records;
  } catch {
    return [];
  }
}

// React cache (per request deduplication) + Memory cache (cross request sub-millisecond serving)
export const getSiteSettings = cache(async function getSiteSettings(): Promise<SiteData> {
  return cachedFetch("site_settings", fetchSiteSettingsInternal, 60000);
});

export const getCourses = cache(async function getCourses(): Promise<Course[]> {
  return cachedFetch("courses", fetchCoursesInternal, 60000);
});

export const getFacilities = cache(async function getFacilities() {
  return cachedFetch("facilities", fetchFacilitiesInternal, 60000);
});

export const getJobOpenings = cache(async function getJobOpenings() {
  return cachedFetch("job_openings", fetchJobOpeningsInternal, 60000);
});

export const getGalleryPhotos = cache(async function getGalleryPhotos() {
  return cachedFetch("gallery_photos", fetchGalleryPhotosInternal, 60000);
});

export const getWhyUs = cache(async function getWhyUs() {
  return cachedFetch("why_us", fetchWhyUsInternal, 60000);
});

export const getAdmissionSteps = cache(async function getAdmissionSteps() {
  return cachedFetch("admission_steps", fetchAdmissionStepsInternal, 60000);
});

export const getAdmissionDocuments = cache(async function getAdmissionDocuments() {
  return cachedFetch("admission_documents", fetchAdmissionDocumentsInternal, 60000);
});

export const getNotices = cache(async function getNotices() {
  return cachedFetch("notices", fetchNoticesInternal, 60000);
});
