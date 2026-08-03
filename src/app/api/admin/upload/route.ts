import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

export const runtime = "nodejs";

const MAX_BYTES = 4.5 * 1024 * 1024; // Vercel body limit ~4.5MB

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Slika nije priložena." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Dozvoljene su samo slike." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Slika je prevelika (max ~4.5 MB)." },
        { status: 400 }
      );
    }

    const safeName = sanitizeFilename(file.name) || `upload-${Date.now()}.jpg`;
    const pathname = `proizvodi/${Date.now()}-${safeName}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(pathname, file, {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type || "image/jpeg",
      });
      return NextResponse.json({ url: blob.url });
    }

    // Local / non-Vercel fallback
    const uploadDir = path.join(process.cwd(), "public", "proizvodi");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const localName = `${Date.now()}-${safeName}`;
    writeFileSync(path.join(uploadDir, localName), buffer);

    return NextResponse.json({ url: `/proizvodi/${localName}` });
  } catch (error) {
    console.error("[admin/upload]", error);
    const message =
      error instanceof Error ? error.message : "Upload slike nije uspio.";
    return NextResponse.json(
      {
        error: process.env.BLOB_READ_WRITE_TOKEN
          ? `Greška pri uploadu: ${message}`
          : "Upload nije moguć na produkciji bez BLOB_READ_WRITE_TOKEN. Dodajte Vercel Blob store u projektu.",
      },
      { status: 500 }
    );
  }
}
