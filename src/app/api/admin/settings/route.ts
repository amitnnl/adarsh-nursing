import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db, isDatabaseAvailable } from "@/lib/db";
import { getSiteSettings, invalidateDataCache } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { promises as fs } from "node:fs";
import path from "node:path";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // Map keys to update
    const entries: [string, string, string][] = [
      ["site_name", body.name, "general"],
      ["site_short_name", body.shortName, "general"],
      ["site_logo", body.logo || "", "general"],
      ["site_tagline", body.tagline, "general"],
      ["site_description", body.description, "general"],
      ["session_year", body.session, "admissions"],
      ["phone_1", body.phones?.[0] || "", "contact"],
      ["phone_2", body.phones?.[1] || "", "contact"],
      ["whatsapp_number", body.whatsapp, "contact"],
      ["email_address", body.email, "contact"],
      ["address_line1", body.address?.line1 || "", "contact"],
      ["address_line2", body.address?.line2 || "", "contact"],
      ["address_state", body.address?.state || "", "contact"],
      ["address_pin", body.address?.pin || "", "contact"],
      ["address_landmark", body.address?.landmark || "", "contact"],
      ["coords_lat", String(body.coords?.lat ?? ""), "contact"],
      ["coords_lng", String(body.coords?.lng ?? ""), "contact"],
      ["announcement_banner", body.bannerNotice || "", "announcements"],
      ["announcement_active", body.isBannerActive ? "true" : "false", "announcements"],
      // Hero section fields
      ["hero_badge", body.hero?.badge || "", "hero"],
      ["hero_title_lead", body.hero?.titleLead || "", "hero"],
      ["hero_title_highlight", body.hero?.titleHighlight || "", "hero"],
      ["hero_description", body.hero?.description || "", "hero"],
      ["hero_image", body.hero?.image || "", "hero"],
      ["hero_slides", body.hero?.slides ? JSON.stringify(body.hero.slides) : "", "hero"],
      ["hero_stat_1_val", body.hero?.stat1Val || "", "hero"],
      ["hero_stat_1_label", body.hero?.stat1Label || "", "hero"],
      ["hero_stat_2_val", body.hero?.stat2Val || "", "hero"],
      ["hero_stat_2_label", body.hero?.stat2Label || "", "hero"],
      ["hero_stat_3_val", body.hero?.stat3Val || "", "hero"],
      ["hero_stat_3_label", body.hero?.stat3Label || "", "hero"],
      ["hero_cta_primary", body.hero?.ctaPrimary || "", "hero"],
      ["hero_cta_primary_link", body.hero?.ctaPrimaryLink || "", "hero"],
      // Social & Brochure
      ["social_facebook", body.social?.facebook || "", "social"],
      ["social_instagram", body.social?.instagram || "", "social"],
      ["social_youtube", body.social?.youtube || "", "social"],
      ["social_twitter", body.social?.twitter || "", "social"],
      ["brochure_pdf", body.brochurePdf || "", "admissions"],
    ];

    // Save to local settings file backup so npm run dev works even if local MySQL is offline
    try {
      const localDir = path.join(process.cwd(), "public");
      const localFile = path.join(localDir, "local_settings.json");
      await fs.mkdir(localDir, { recursive: true });
      await fs.writeFile(localFile, JSON.stringify(body, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Could not write local settings file:", fsErr);
    }

    if (await isDatabaseAvailable()) {
      try {
        for (const [key, val, category] of entries) {
          if (val !== undefined && val !== null) {
            await db.siteSetting.upsert({
              where: { key },
              update: { value: String(val), category },
              create: { key, value: String(val), category },
            });
          }
        }
      } catch (dbErr) {
        console.warn("DB save error:", dbErr);
      }
    }

    // Trigger instant cache revalidation for all public pages
    invalidateDataCache("site_settings");
    try {
      revalidatePath("/");
      revalidatePath("/courses");
      revalidatePath("/admissions");
      revalidatePath("/facilities");
      revalidatePath("/gallery");
      revalidatePath("/contact");
      revalidatePath("/about");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save settings error:", err);
    return NextResponse.json({ error: "Failed to save settings", details: String(err), stack: err instanceof Error ? err.stack : undefined }, { status: 500 });
  }
}
