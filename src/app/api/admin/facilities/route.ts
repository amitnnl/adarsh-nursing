import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getFacilities, invalidateDataCache } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const facilities = await getFacilities();
  return NextResponse.json({ facilities });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, text, icon } = await req.json();

    const created = await db.facility.create({
      data: {
        title,
        text,
        icon: icon || "BedDouble",
        isActive: true,
      },
    });

    invalidateDataCache("facilities");
    try {
      revalidatePath("/facilities");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, facility: created });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create facility" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.facility.delete({ where: { id: Number(id) } });

    invalidateDataCache("facilities");
    try {
      revalidatePath("/facilities");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete facility" }, { status: 500 });
  }
}
