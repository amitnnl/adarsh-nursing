import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { invalidateDataCache } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const notices = await db.notice.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ notices });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load notices" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, title, content, link, fileUrl, date, isUrgent, isActive, displayOrder } = body;

    let notice;
    if (id) {
      notice = await db.notice.update({
        where: { id: Number(id) },
        data: {
          title,
          content: content || "",
          link: link || null,
          fileUrl: fileUrl || null,
          date: date || null,
          isUrgent: Boolean(isUrgent),
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        },
      });
    } else {
      notice = await db.notice.create({
        data: {
          title,
          content: content || "",
          link: link || null,
          fileUrl: fileUrl || null,
          date: date || null,
          isUrgent: Boolean(isUrgent),
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        },
      });
    }

    invalidateDataCache("notices");
    try {
      revalidatePath("/");
      revalidatePath("/admissions");
    } catch {}

    return NextResponse.json({ success: true, notice });
  } catch (err) {
    console.error("Notice save error:", err);
    return NextResponse.json({ error: "Failed to save notice" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.notice.delete({ where: { id: Number(id) } });

    invalidateDataCache("notices");
    try {
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
  }
}
