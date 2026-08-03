import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { CatalogCategory, ProductCategory } from "@/lib/types";
import { readCatalog, writeCatalog } from "@/lib/catalog/store";

export async function GET() {
  try {
    const catalog = await readCatalog();
    return NextResponse.json({ categories: catalog.categories });
  } catch (error) {
    console.error("[admin/categories GET]", error);
    return NextResponse.json(
      { error: "Neuspješno učitavanje kategorija." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { categories: CatalogCategory[] };

    if (!body.categories?.length) {
      return NextResponse.json(
        { error: "Lista kategorija ne može biti prazna." },
        { status: 400 }
      );
    }

    const catalog = await readCatalog();
    catalog.categories = body.categories;

    catalog.products = catalog.products.map((product) => {
      const category = catalog.categories.find((c) => c.id === product.category);
      return category
        ? { ...product, categoryLabel: category.label }
        : product;
    });

    await writeCatalog(catalog);
    revalidatePath("/");
    revalidatePath("/products");

    return NextResponse.json({ categories: catalog.categories });
  } catch (error) {
    console.error("[admin/categories PUT]", error);
    return NextResponse.json(
      {
        error: process.env.BLOB_READ_WRITE_TOKEN
          ? "Greška pri čuvanju kategorija."
          : "Čuvanje nije moguće na produkciji bez BLOB_READ_WRITE_TOKEN.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; label?: string };
    const id = body.id?.trim() as ProductCategory | undefined;
    const label = body.label?.trim();

    if (!id || !label) {
      return NextResponse.json(
        { error: "ID i naziv kategorije su obavezni." },
        { status: 400 }
      );
    }

    const catalog = await readCatalog();
    if (catalog.categories.some((c) => c.id === id)) {
      return NextResponse.json(
        { error: "Kategorija sa ovim ID već postoji." },
        { status: 400 }
      );
    }

    catalog.categories.push({ id, label });
    await writeCatalog(catalog);

    return NextResponse.json({ categories: catalog.categories });
  } catch (error) {
    console.error("[admin/categories POST]", error);
    return NextResponse.json(
      { error: "Greška pri dodavanju kategorije." },
      { status: 500 }
    );
  }
}
