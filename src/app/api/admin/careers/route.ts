import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getJobOpenings, invalidateDataCache } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const openings = await getJobOpenings();
  return NextResponse.json({ openings });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, category, status } = await req.json();

    const created = await db.jobOpening.create({
      data: {
        title,
        category: category || "teaching",
        status: status || "Open",
      },
    });

    invalidateDataCache("job_openings");
    try {
      revalidatePath("/careers");
      revalidatePath("/about");
    } catch {}

    return NextResponse.json({ success: true, opening: created });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create vacancy" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

    await db.jobOpening.deleteMany({ where: { title } });

    invalidateDataCache("job_openings");
    try {
      revalidatePath("/careers");
      revalidatePath("/about");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete vacancy" }, { status: 500 });
  }
}
