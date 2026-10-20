import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCourses, invalidateDataCache } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await getCourses();
  return NextResponse.json({ courses });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, code, name, fullName, duration, years, type, eligibility, summary, learn, careers, accent } = body;

    const created = await db.course.create({
      data: {
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        code,
        name,
        fullName,
        duration,
        years: Number(years) || 2,
        type: type || "Diploma",
        eligibility: typeof eligibility === "string" ? eligibility : JSON.stringify(eligibility || []),
        summary,
        learn: typeof learn === "string" ? learn : JSON.stringify(learn || []),
        careers: typeof careers === "string" ? careers : JSON.stringify(careers || []),
        accent: accent || "rose",
        isActive: true,
      },
    });

    invalidateDataCache("courses");
    try {
      revalidatePath("/courses");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, course: created });
  } catch (err) {
    console.error("Create course error:", err);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, code, name, fullName, duration, years, type, eligibility, summary, learn, careers, accent, isActive } = body;

    const updated = await db.course.update({
      where: { slug },
      data: {
        code,
        name,
        fullName,
        duration,
        years: Number(years),
        type,
        eligibility: typeof eligibility === "string" ? eligibility : JSON.stringify(eligibility || []),
        summary,
        learn: typeof learn === "string" ? learn : JSON.stringify(learn || []),
        careers: typeof careers === "string" ? careers : JSON.stringify(careers || []),
        accent,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    invalidateDataCache("courses");
    try {
      revalidatePath("/courses");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, course: updated });
  } catch (err) {
    console.error("Update course error:", err);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    await db.course.delete({ where: { slug } });

    invalidateDataCache("courses");
    try {
      revalidatePath("/courses");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
