"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  LogOut,
  ExternalLink,
  Plus,
} from "lucide-react";
import type { CatalogCategory, Product } from "@/lib/types";
import { ProductsTable } from "@/components/admin/products-table";
import { ProductForm } from "@/components/admin/product-form";
import { CategoriesPanel } from "@/components/admin/categories-panel";
import { AdminModal } from "@/components/admin/admin-modal";

type AdminTab = "overview" | "products" | "categories";

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = (await res.json()) as {
        products: Product[];
        categories: CatalogCategory[];
      };
      setProducts(data.products ?? []);
      setCategories(data.categories ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleDelete = async (product: Product) => {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    if (!res.ok) return;
    await loadData();
  };

  const handleSaveCategories = async (next: CatalogCategory[]) => {
    const res = await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories: next }),
    });
    if (!res.ok) throw new Error("save failed");
    setCategories(next);
    await loadData();
  };

  const homepageCount = products.filter((p) => p.showOnHomepage).length;
  const activeCount = products.filter((p) => p.isActive !== false).length;

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const formOpen = showForm || Boolean(editingProduct);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Pregled",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "products",
      label: "Proizvodi",
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: "categories",
      label: "Kategorije",
      icon: <FolderOpen className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Layali Admin
            </p>
            <h1 className="text-lg font-semibold text-neutral-900">
              Upravljanje katalogom
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Otvori sajt
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Odjava
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                closeForm();
              }}
              className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors ${
                tab === item.id
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center text-sm text-neutral-500">
            Učitavanje podataka...
          </div>
        ) : tab === "overview" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Ukupno proizvoda",
                value: products.length,
                hint: "Svi proizvodi u katalogu",
              },
              {
                label: "Aktivni proizvodi",
                value: activeCount,
                hint: "Vidljivi na sajtu",
              },
              {
                label: "Na početnoj",
                value: homepageCount,
                hint: "Prikazani u sekciji ponude",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-neutral-200 bg-white p-5"
              >
                <p className="text-sm text-neutral-500">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900">
                  {card.value}
                </p>
                <p className="mt-2 text-xs text-neutral-400">{card.hint}</p>
              </div>
            ))}
          </div>
        ) : tab === "products" ? (
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Lista proizvoda
                </h2>
                <p className="text-sm text-neutral-500">
                  Uredite, obrišite ili dodajte proizvod u katalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
              >
                <Plus className="h-4 w-4" />
                Novi proizvod
              </button>
            </div>
            <ProductsTable
              products={products}
              onEdit={(product) => {
                setEditingProduct(product);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <CategoriesPanel
            categories={categories}
            onSave={handleSaveCategories}
          />
        )}
      </div>

      <AdminModal
        open={formOpen}
        title={editingProduct ? "Uredi proizvod" : "Dodaj novi proizvod"}
        description={
          editingProduct
            ? `Izmjene za proizvod ${editingProduct.name}.`
            : "Popunite podatke. Proizvod koristi isti layout kao postojeći na sajtu."
        }
        onClose={closeForm}
      >
        <ProductForm
          key={editingProduct?.id ?? "new"}
          categories={categories}
          initialProduct={editingProduct}
          variant="modal"
          homepageCount={homepageCount}
          onSaved={() => {
            void loadData();
            closeForm();
          }}
          onCancel={closeForm}
        />
      </AdminModal>
    </div>
  );
}
