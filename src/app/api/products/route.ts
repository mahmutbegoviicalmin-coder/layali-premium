import {
  getActiveProducts,
  getAromaProducts,
  getHomepageProducts,
} from "@/lib/catalog/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");

  let products;
  if (scope === "homepage") {
    products = await getHomepageProducts();
  } else if (scope === "aroma") {
    products = await getAromaProducts();
  } else {
    products = await getActiveProducts();
  }

  return Response.json({ products });
}
