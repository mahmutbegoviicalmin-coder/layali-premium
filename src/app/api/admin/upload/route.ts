import { NextResponse } from "next/server";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Slika nije priložena." },
      { status: 400 }
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "proizvodi");
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-");

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(path.join(uploadDir, safeName), buffer);

  return NextResponse.json({ url: `/proizvodi/${safeName}` });
}
