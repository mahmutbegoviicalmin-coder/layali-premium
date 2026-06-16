import {
  getActiveProducts,
  getHomepageProducts,
} from "@/lib/catalog/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");

  const products =
    scope === "homepage" ? getHomepageProducts() : getActiveProducts();

  return Response.json({ products });
}
