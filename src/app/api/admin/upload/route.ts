import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { promises as fs } from "node:fs";
import path from "node:path";

export async function POST(req: Request) {
  const admin = await getCurrentAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate mime type (images and PDF documents)
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image (PNG, JPG, WebP, SVG) or PDF document." },
        { status: 400 }
      );
    }

    // Validate size (limit to 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 15MB limit." },
        { status: 400 }
      );
    }

    // Extract safe extension
    let ext = "png";
    if (file.type === "application/pdf") ext = "pdf";
    else if (file.type === "image/jpeg") ext = "jpg";
    else if (file.type === "image/webp") ext = "webp";
    else if (file.type === "image/svg+xml") ext = "svg";
    else if (file.name.includes(".")) {
      ext = file.name.split(".").pop()?.toLowerCase() || "png";
    }

    const prefix = isPdf ? "doc" : "media";
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to server." },
      { status: 500 }
    );
  }
}
