import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { invalidateDataCache } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const photos = await db.galleryPhoto.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ photos });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load photos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, src, alt, caption, category, span, position, displayOrder } = body;

    let photo;
    if (id) {
      photo = await db.galleryPhoto.update({
        where: { id: Number(id) },
        data: {
          src,
          alt: alt || "Campus photo",
          caption: caption || "",
          category: category || "campus",
          span: span || "",
          position: position || "",
          displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        },
      });
    } else {
      photo = await db.galleryPhoto.create({
        data: {
          src,
          alt: alt || "Campus photo",
          caption: caption || "",
          category: category || "campus",
          span: span || "",
          position: position || "",
          displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
          isActive: true,
        },
      });
    }

    invalidateDataCache("gallery_photos");
    try {
      revalidatePath("/gallery");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, photo });
  } catch (err) {
    console.error("Gallery save error:", err);
    return NextResponse.json({ error: "Failed to save photo" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.galleryPhoto.delete({ where: { id: Number(id) } });

    invalidateDataCache("gallery_photos");
    try {
      revalidatePath("/gallery");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
