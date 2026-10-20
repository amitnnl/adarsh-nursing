import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, course, qualification, city, message } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please provide a valid name" }, { status: 400 });
    }

    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json({ error: "Please provide a valid 10-digit mobile number" }, { status: 400 });
    }

    // Attempt to persist in MySQL database
    try {
      const enquiry = await db.enquiry.create({
        data: {
          name: name.trim(),
          phone: cleanPhone,
          course: String(course || "G.N.M.").trim(),
          qualification: qualification ? String(qualification).trim() : null,
          city: city ? String(city).trim() : null,
          message: message ? String(message).trim() : null,
          status: "New",
        },
      });

      return NextResponse.json({ success: true, id: enquiry.id });
    } catch (dbErr) {
      console.warn("Database storage warning (will fallback to direct contact):", dbErr);
      // Even if database is offline, we return success so user's WhatsApp flow is never disrupted!
      return NextResponse.json({ success: true, warning: "saved_fallback" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
