"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Save,
  Upload,
  RefreshCw,
  Info,
  Package,
  ImageIcon,
  ListChecks,
} from "lucide-react";
import type {
  CatalogCategory,
  Product,
  ProductCategory,
  ProductTab,
} from "@/lib/types";
import { slugify } from "@/lib/utils/slugify";
import { MAX_HOMEPAGE_PRODUCTS } from "@/lib/catalog/filters";

/** Keep tags aligned with category + visibility flags for filters/badges. */
function syncTags(form: Partial<Product>): ProductTab[] {
  const tags = new Set<ProductTab>();
  const categoryTabs: ProductTab[] = ["fruit", "ice", "exotic", "premium"];
  if (form.category && categoryTabs.includes(form.category as ProductTab)) {
    tags.add(form.category as ProductTab);
  }
  if (form.isBestSeller) tags.add("best-sellers");
  if (form.isNew) tags.add("new-arrivals");
  return Array.from(tags);
}

const emptyProduct = (): Partial<Product> => ({
  name: "",
  slug: "",
  brand: "Layali",
  brandSlug: "layali",
  category: "premium",
  strength: 3,
  origin: "Premium serija",
  image: "",
  images: [],
  description: "",
  packagingSizes: ["200g", "250g"],
  specifications: {
    Rez: "Srednji",
    Vlaga: "Srednja",
    "Tolerancija na toplinu": "Visoka",
    "Trajanje sesije": "60-80 min",
  },
  tags: [],
  isNew: false,
  isBestSeller: false,
  isHighlighted: false,
  showOnHomepage: false,
  homepageOrder: 1,
  price: null,
  salePrice: null,
  availableQuantity: null,
  isActive: true,
});

interface ProductFormProps {
  categories: CatalogCategory[];
  initialProduct?: Product | null;
  variant?: "modal" | "page";
  homepageCount?: number;
  onSaved: () => void;
  onCancel?: () => void;
}

function Section({
  title,
  icon,
  children,
  modal,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  modal?: boolean;
}) {
  return (
    <div
      className={
        modal
          ? "rounded-xl border border-neutral-100 bg-neutral-50/80 p-4 sm:p-5"
          : "rounded-2xl border border-neutral-200 bg-white p-6"
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-neutral-500">{icon}</span>
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 flex items-start gap-1.5 text-xs text-neutral-500">
      <Info className="mt-0.5 h-3 w-3 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function ProductForm({
  categories,
  initialProduct,
  variant = "page",
  homepageCount = 0,
  onSaved,
  onCancel,
}: ProductFormProps) {
  const isModal = variant === "modal";
  const [form, setForm] = useState<Partial<Product>>(
    initialProduct ?? emptyProduct()
  );
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>(
    []
  );
  const [packagingInput, setPackagingInput] = useState("200g, 250g");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (initialProduct) {
      setForm(initialProduct);
      setSpecRows(
        Object.entries(initialProduct.specifications).map(([key, value]) => ({
          key,
          value,
        }))
      );
      setPackagingInput(initialProduct.packagingSizes.join(", "));
    } else {
      setForm(emptyProduct());
      setSpecRows([
        { key: "Rez", value: "Srednji" },
        { key: "Vlaga", value: "Srednja" },
        { key: "Profil", value: "" },
        { key: "Preporuka", value: "" },
      ]);
      setPackagingInput("200g, 250g");
    }
  }, [initialProduct]);

  const update = <K extends keyof Product>(key: K, value: Product[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      let data: { url?: string; error?: string } = {};
      try {
        data = (await res.json()) as { url?: string; error?: string };
      } catch {
        setError("Upload slike nije uspio (nevažeći odgovor servera).");
        return;
      }
      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload slike nije uspio.");
        return;
      }
      setForm((prev) => ({
        ...prev,
        image: data.url,
        images: [data.url!],
      }));
      setSuccess("Slika je učitana.");
    } catch {
      setError("Greška pri uploadu slike.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!form.image?.trim()) {
      setError("Dodajte sliku proizvoda prije čuvanja.");
      setSaving(false);
      return;
    }

    const specifications = Object.fromEntries(
      specRows
        .filter((row) => row.key.trim())
        .map((row) => [row.key.trim(), row.value.trim()])
    );

    const withFlags = {
      ...form,
      packagingSizes: packagingInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      specifications,
      availableQuantity:
        form.availableQuantity === undefined || form.availableQuantity === null
          ? null
          : Number(form.availableQuantity),
    };

    const payload: Partial<Product> = {
      ...withFlags,
      tags: syncTags(withFlags),
    };

    try {
      const url = initialProduct
        ? `/api/admin/products/${initialProduct.id}`
        : "/api/admin/products";
      const method = initialProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { error?: string } = {};
      try {
        data = (await res.json()) as { error?: string };
      } catch {
        setError("Greška pri čuvanju proizvoda (nevažeći odgovor servera).");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Čuvanje nije uspjelo.");
        return;
      }

      setSuccess(
        initialProduct ? "Proizvod je ažuriran." : "Proizvod je dodan."
      );
      onSaved();
      if (!initialProduct) {
        setForm(emptyProduct());
        setPackagingInput("200g, 250g");
      }
    } catch {
      setError("Greška pri čuvanju proizvoda.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Section title="Osnovni podaci" icon={<Package className="h-4 w-4" />} modal={isModal}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Naziv proizvoda
            </label>
            <input
              required
              value={form.name ?? ""}
              onChange={(e) => {
                const name = e.target.value;
                update("name", name);
                if (!initialProduct) update("slug", slugify(name));
              }}
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
            <FieldHint>
              Prikazuje se na kartici proizvoda i na detaljnoj stranici.
            </FieldHint>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Slug (URL)
            </label>
            <div className="flex gap-2">
              <input
                required
                value={form.slug ?? ""}
                onChange={(e) => update("slug", e.target.value)}
                className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
              />
              <button
                type="button"
                onClick={() => update("slug", slugify(form.name ?? ""))}
                className="inline-flex h-11 shrink-0 items-center gap-1 rounded-xl border border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Generiši
              </button>
            </div>
            <FieldHint>
              Koristi se u linku: /products/slug. Koristite mala slova i crtice.
            </FieldHint>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Kategorija
            </label>
            <select
              value={form.category ?? "premium"}
              onChange={(e) => {
                const category = e.target.value as ProductCategory;
                update("category", category);
                const label = categories.find((c) => c.id === category)?.label;
                if (label) update("categoryLabel", label);
              }}
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-neutral-400"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <FieldHint>
              Odabir kategorije određuje gdje se proizvod pojavljuje u filterima
              i grupama na /products stranici.
            </FieldHint>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Brend
            </label>
            <input
              value={form.brand ?? ""}
              onChange={(e) => update("brand", e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Slug brenda
            </label>
            <input
              value={form.brandSlug ?? ""}
              onChange={(e) => update("brandSlug", e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Serija / porijeklo
            </label>
            <input
              value={form.origin ?? ""}
              onChange={(e) => update("origin", e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Jačina (1 do 5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={form.strength ?? 3}
              onChange={(e) =>
                update("strength", Number(e.target.value) as Product["strength"])
              }
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Opis proizvoda
            </label>
            <textarea
              rows={4}
              value={form.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400"
            />
            <FieldHint>
              Detaljan tekst koji se prikazuje na stranici proizvoda.
            </FieldHint>
          </div>
        </div>
      </Section>

      <Section title="Slika proizvoda" icon={<ImageIcon className="h-4 w-4" />} modal={isModal}>
        <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
            {form.image ? (
              <Image
                src={form.image}
                alt={form.name || "Preview"}
                fill
                unoptimized={form.image.startsWith("http")}
                className="object-cover"
                sizes="120px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-400">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <input
              value={form.image ?? ""}
              onChange={(e) => {
                update("image", e.target.value);
                update("images", [e.target.value]);
              }}
              placeholder="/proizvodi/naziv-slike.png"
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
              <Upload className="h-4 w-4" />
              {uploading ? "Upload..." : "Učitaj sliku"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />
            </label>
            <FieldHint>
              Na Vercelu se slika čuva u Blob storage-u i odmah je dostupna na
              sajtu. Preporučena veličina kao kod postojećih proizvoda.
            </FieldHint>
          </div>
        </div>
      </Section>

      <Section
        title="Pakovanje, specifikacije i zalihe"
        icon={<ListChecks className="h-4 w-4" />}
        modal={isModal}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Pakovanja (odvojena zarezom)
            </label>
            <input
              value={packagingInput}
              onChange={(e) => setPackagingInput(e.target.value)}
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
            <FieldHint>Npr. 200g, 250g</FieldHint>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Dostupna količina (grami)
            </label>
            <input
              type="number"
              min={0}
              value={form.availableQuantity ?? ""}
              onChange={(e) =>
                update(
                  "availableQuantity",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              placeholder="Prazno = bez limita"
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
            <FieldHint>
              Opcionalno. Prikazuje se na detaljnoj stranici proizvoda.
            </FieldHint>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Cijena (KM)
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.price ?? ""}
              onChange={(e) =>
                update(
                  "price",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              placeholder="npr. 45"
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Snižena cijena (KM)
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.salePrice ?? ""}
              onChange={(e) =>
                update(
                  "salePrice",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              placeholder="Opcionalno"
              className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
            <FieldHint>
              Ako je unesena, prikazuje se kao akcijska cijena (stara se
              precrtava).
            </FieldHint>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium text-neutral-700">Specifikacije</p>
          {specRows.map((row, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-2">
              <input
                value={row.key}
                onChange={(e) => {
                  const next = [...specRows];
                  next[index] = { ...row, key: e.target.value };
                  setSpecRows(next);
                }}
                placeholder="Naziv (npr. Profil)"
                className="h-10 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
              />
              <input
                value={row.value}
                onChange={(e) => {
                  const next = [...specRows];
                  next[index] = { ...row, value: e.target.value };
                  setSpecRows(next);
                }}
                placeholder="Vrijednost"
                className="h-10 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecRows([...specRows, { key: "", value: "" }])}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            + Dodaj specifikaciju
          </button>
        </div>
      </Section>

      <Section title="Prikaz i istaknutost" icon={<Package className="h-4 w-4" />} modal={isModal}>
        <p className="mb-4 text-sm text-neutral-500">
          Na početnoj može biti najviše {MAX_HOMEPAGE_PRODUCTS} proizvoda.
          Novi istaknuti ide na prvo mjesto.
          {` Trenutno: ${
            form.showOnHomepage && !initialProduct?.showOnHomepage
              ? homepageCount + 1
              : form.showOnHomepage
                ? Math.max(homepageCount, 1)
                : homepageCount - (initialProduct?.showOnHomepage ? 1 : 0)
          }/${MAX_HOMEPAGE_PRODUCTS}.`}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={Boolean(form.showOnHomepage)}
              onChange={(e) => {
                const checked = e.target.checked;
                const othersCount = initialProduct?.showOnHomepage
                  ? homepageCount - 1
                  : homepageCount;
                if (checked && othersCount >= MAX_HOMEPAGE_PRODUCTS) {
                  setError(
                    `Na početnoj može biti najviše ${MAX_HOMEPAGE_PRODUCTS} proizvoda.`
                  );
                  return;
                }
                setError("");
                setForm((prev) => ({
                  ...prev,
                  showOnHomepage: checked,
                  homepageOrder: checked ? 1 : prev.homepageOrder,
                }));
              }}
            />
            Prikaži na početnoj stranici (max {MAX_HOMEPAGE_PRODUCTS})
          </label>
          {(
            [
              { key: "isBestSeller" as const, label: "Označi kao bestseler" },
              { key: "isNew" as const, label: "Označi kao novi proizvod" },
              {
                key: "isHighlighted" as const,
                label: "Istakni vizuelno (okvir)",
              },
              { key: "isActive" as const, label: "Aktivan (vidljiv na sajtu)" },
            ] as const
          ).map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-700"
            >
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => update(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>

        {form.showOnHomepage && (
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Redoslijed na početnoj
            </label>
            <input
              type="number"
              min={1}
              max={MAX_HOMEPAGE_PRODUCTS}
              value={form.homepageOrder ?? 1}
              onChange={(e) => update("homepageOrder", Number(e.target.value))}
              className="h-11 w-full max-w-xs rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
            />
            <FieldHint>
              1 = prvi na početnoj. Pri uključivanju automatski ide na 1.
            </FieldHint>
          </div>
        )}
      </Section>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      )}

      <div className="sticky bottom-0 -mx-5 flex flex-wrap gap-3 border-t border-neutral-100 bg-white px-5 py-4 sm:-mx-6 sm:px-6">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-neutral-900 px-5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Čuvanje..." : initialProduct ? "Sačuvaj izmjene" : "Dodaj proizvod"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center rounded-xl border border-neutral-200 px-5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Otkaži
          </button>
        )}
      </div>
    </form>
  );
}
