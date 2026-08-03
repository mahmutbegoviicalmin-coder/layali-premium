import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Product } from "@/lib/types";
import {
  readCatalog,
  writeCatalog,
  enrichProduct,
} from "@/lib/catalog/store";
import { slugify } from "@/lib/utils/slugify";

export async function GET() {
  try {
    const catalog = await readCatalog();
    const products = catalog.products.map((p) =>
      enrichProduct(p, catalog.categories)
    );
    return NextResponse.json({ products, categories: catalog.categories });
  } catch (error) {
    console.error("[admin/products GET]", error);
    return NextResponse.json(
      { error: "Neuspješno učitavanje proizvoda." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Product>;
    const catalog = await readCatalog();

    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json(
        { error: "Naziv proizvoda je obavezan." },
        { status: 400 }
      );
    }

    const slug = body.slug?.trim() || slugify(name);
    if (catalog.products.some((p) => p.slug === slug)) {
      return NextResponse.json(
        { error: "Proizvod sa ovim slugom već postoji." },
        { status: 400 }
      );
    }

    const category = catalog.categories.find((c) => c.id === body.category);
    const nextId = String(
      Math.max(0, ...catalog.products.map((p) => Number(p.id) || 0)) + 1
    );

    const image =
      body.image?.trim() || "/proizvodi/placeholder.png";

    const product: Product = {
      id: nextId,
      slug,
      name,
      brand: body.brand?.trim() || "Layali",
      brandSlug: body.brandSlug?.trim() || "layali",
      category: body.category ?? "premium",
      categoryLabel: category?.label ?? body.categoryLabel ?? "Premium serija",
      strength: body.strength ?? 3,
      origin: body.origin?.trim() || "Premium serija",
      image,
      images: body.images?.length ? body.images : [image],
      description: body.description?.trim() || "",
      packagingSizes: body.packagingSizes?.length
        ? body.packagingSizes
        : ["200g", "250g"],
      specifications: body.specifications ?? {},
      tags: body.tags ?? [],
      isNew: body.isNew ?? false,
      isBestSeller: body.isBestSeller ?? false,
      isHighlighted: body.isHighlighted ?? false,
      showOnHomepage: body.showOnHomepage ?? false,
      homepageOrder: body.homepageOrder ?? catalog.products.length + 1,
      availableQuantity: body.availableQuantity ?? null,
      isActive: body.isActive !== false,
    };

    catalog.products.push(product);
    await writeCatalog(catalog);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);

    return NextResponse.json({
      product: enrichProduct(product, catalog.categories),
    });
  } catch (error) {
    console.error("[admin/products POST]", error);
    const message =
      error instanceof Error ? error.message : "Čuvanje nije uspjelo.";
    return NextResponse.json(
      {
        error: process.env.BLOB_READ_WRITE_TOKEN
          ? `Greška pri čuvanju: ${message}`
          : "Čuvanje nije moguće na produkciji bez BLOB_READ_WRITE_TOKEN. Dodajte Vercel Blob store u projektu.",
      },
      { status: 500 }
    );
  }
}
