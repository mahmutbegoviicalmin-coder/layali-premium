import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  isValidAdminToken,
} from "@/lib/auth/admin-token";

export {
  ADMIN_COOKIE,
  createAdminToken,
  getAdminCookieOptions,
  verifyAdminPassword,
} from "@/lib/auth/admin-token";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
