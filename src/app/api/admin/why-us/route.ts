import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { invalidateDataCache } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items = await db.whyUsCard.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load Why Choose Us items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, title, text, displayOrder } = body;

    let item;
    if (id) {
      item = await db.whyUsCard.update({
        where: { id: Number(id) },
        data: {
          title,
          text,
          displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        },
      });
    } else {
      item = await db.whyUsCard.create({
        data: {
          title,
          text,
          displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
          isActive: true,
        },
      });
    }

    invalidateDataCache("why_us");
    try {
      revalidatePath("/");
      revalidatePath("/about");
    } catch {}

    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error("Why Choose Us save error:", err);
    return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.whyUsCard.delete({ where: { id: Number(id) } });

    invalidateDataCache("why_us");
    try {
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
