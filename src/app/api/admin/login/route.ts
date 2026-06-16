import { NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminToken,
  ADMIN_COOKIE,
  getAdminCookieOptions,
} from "@/lib/auth/admin-token";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if (!body.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json(
      { error: "Pogrešna šifra. Pokušajte ponovo." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(
    ADMIN_COOKIE,
    await createAdminToken(),
    getAdminCookieOptions()
  );
  return response;
}
