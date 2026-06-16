import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { CatalogCategory, ProductCategory } from "@/lib/types";
import { readCatalog, writeCatalog } from "@/lib/catalog/store";

export async function GET() {
  const catalog = readCatalog();
  return NextResponse.json({ categories: catalog.categories });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { categories: CatalogCategory[] };

  if (!body.categories?.length) {
    return NextResponse.json(
      { error: "Lista kategorija ne može biti prazna." },
      { status: 400 }
    );
  }

  const catalog = readCatalog();
  catalog.categories = body.categories;

  catalog.products = catalog.products.map((product) => {
    const category = catalog.categories.find((c) => c.id === product.category);
    return category
      ? { ...product, categoryLabel: category.label }
      : product;
  });

  writeCatalog(catalog);
  revalidatePath("/");
  revalidatePath("/products");

  return NextResponse.json({ categories: catalog.categories });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { id?: string; label?: string };
  const id = body.id?.trim() as ProductCategory | undefined;
  const label = body.label?.trim();

  if (!id || !label) {
    return NextResponse.json(
      { error: "ID i naziv kategorije su obavezni." },
      { status: 400 }
    );
  }

  const catalog = readCatalog();
  if (catalog.categories.some((c) => c.id === id)) {
    return NextResponse.json(
      { error: "Kategorija sa ovim ID već postoji." },
      { status: 400 }
    );
  }

  catalog.categories.push({ id, label });
  writeCatalog(catalog);

  return NextResponse.json({ categories: catalog.categories });
}
