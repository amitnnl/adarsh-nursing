import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { invalidateDataCache } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [steps, documents] = await Promise.all([
      db.admissionStep.findMany({ orderBy: { displayOrder: "asc" } }),
      db.admissionDocument.findMany({ orderBy: { displayOrder: "asc" } }),
    ]);

    return NextResponse.json({ steps, documents });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load admission configuration" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { steps, documents } = await req.json();

    if (Array.isArray(steps)) {
      await db.admissionStep.deleteMany();
      for (let i = 0; i < steps.length; i++) {
        const s = steps[i];
        if (s.title && s.text) {
          await db.admissionStep.create({
            data: {
              stepNumber: i + 1,
              title: s.title,
              text: s.text,
              displayOrder: i + 1,
              isActive: true,
            },
          });
        }
      }
    }

    if (Array.isArray(documents)) {
      await db.admissionDocument.deleteMany();
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const docName = typeof doc === "string" ? doc : doc.title;
        if (docName) {
          await db.admissionDocument.create({
            data: {
              title: docName,
              displayOrder: i + 1,
              isActive: true,
            },
          });
        }
      }
    }

    invalidateDataCache("admission_steps");
    invalidateDataCache("admission_documents");
    try {
      revalidatePath("/admissions");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admissions config save error:", err);
    return NextResponse.json({ error: "Failed to save admissions data" }, { status: 500 });
  }
}
