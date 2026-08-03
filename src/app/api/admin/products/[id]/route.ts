import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Product } from "@/lib/types";
import {
  readCatalog,
  writeCatalog,
  enrichProduct,
} from "@/lib/catalog/store";
import { slugify } from "@/lib/utils/slugify";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const catalog = await readCatalog();
    const product = catalog.products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product: enrichProduct(product, catalog.categories),
    });
  } catch (error) {
    console.error("[admin/products/:id GET]", error);
    return NextResponse.json(
      { error: "Neuspješno učitavanje proizvoda." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<Product>;
    const catalog = await readCatalog();
    const index = catalog.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen." },
        { status: 404 }
      );
    }

    const current = catalog.products[index];
    const name = body.name?.trim() || current.name;
    const slug = body.slug?.trim()
      ? body.slug.trim()
      : body.name?.trim()
        ? slugify(body.name.trim())
        : current.slug;

    if (catalog.products.some((p) => p.slug === slug && p.id !== id)) {
      return NextResponse.json(
        { error: "Proizvod sa ovim slugom već postoji." },
        { status: 400 }
      );
    }

    const category = catalog.categories.find(
      (c) => c.id === (body.category ?? current.category)
    );

    const updated: Product = {
      ...current,
      ...body,
      id: current.id,
      name,
      slug,
      categoryLabel:
        category?.label ?? body.categoryLabel ?? current.categoryLabel,
      images: body.images?.length
        ? body.images
        : body.image
          ? [body.image]
          : current.images,
    };

    catalog.products[index] = updated;
    await writeCatalog(catalog);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${current.slug}`);
    revalidatePath(`/products/${updated.slug}`);

    return NextResponse.json({
      product: enrichProduct(updated, catalog.categories),
    });
  } catch (error) {
    console.error("[admin/products/:id PUT]", error);
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

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const catalog = await readCatalog();
    const index = catalog.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Proizvod nije pronađen." },
        { status: 404 }
      );
    }

    const [removed] = catalog.products.splice(index, 1);
    await writeCatalog(catalog);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${removed.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/products/:id DELETE]", error);
    return NextResponse.json(
      { error: "Brisanje nije uspjelo." },
      { status: 500 }
    );
  }
}
