"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Package,
  Pencil,
  Trash2,
  Home,
  Star,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, getDisplayPrice } from "@/lib/utils/price";
import { MAX_HOMEPAGE_PRODUCTS } from "@/lib/catalog/filters";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmId) return;
    const timer = setTimeout(() => setConfirmId(null), 4000);
    return () => clearTimeout(timer);
  }, [confirmId]);

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
        <Package className="mx-auto h-8 w-8 text-neutral-300" />
        <p className="mt-3 text-sm font-medium text-neutral-700">
          Još nema proizvoda
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Dodajte prvi proizvod pomoću forme desno.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Proizvod</th>
              <th className="px-4 py-3 font-medium">Kategorija</th>
              <th className="px-4 py-3 font-medium">Cijena</th>
              <th className="px-4 py-3 font-medium">
                Početna (max {MAX_HOMEPAGE_PRODUCTS})
              </th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Količina</th>
              <th className="px-4 py-3 font-medium text-right">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50/80">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized={product.image.startsWith("http")}
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-500">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {product.categoryLabel}
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {(() => {
                    const display = getDisplayPrice(product);
                    if (!display) {
                      return <span className="text-xs text-neutral-400">—</span>;
                    }
                    return (
                      <span className="text-sm font-medium">
                        {formatPrice(display.current)}
                        {display.original != null && (
                          <span className="ml-1 text-xs font-normal text-neutral-400 line-through">
                            {formatPrice(display.original)}
                          </span>
                        )}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-4 py-3">
                  {product.showOnHomepage ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <Home className="h-3 w-3" />
                      #{product.homepageOrder ?? "-"}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400">Ne</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.isActive === false && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                        <EyeOff className="h-3 w-3" />
                        Skriven
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                        <Star className="h-3 w-3" />
                        Bestseler
                      </span>
                    )}
                    {product.isNew && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700">
                        <Sparkles className="h-3 w-3" />
                        Novo
                      </span>
                    )}
                    {product.isHighlighted && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
                        <Eye className="h-3 w-3" />
                        Istaknut
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {product.availableQuantity == null
                    ? "Bez limita"
                    : `${product.availableQuantity} g`}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-neutral-200 px-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Uredi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirmId === product.id) {
                          onDelete(product);
                          setConfirmId(null);
                        } else {
                          setConfirmId(product.id);
                        }
                      }}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 px-2.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {confirmId === product.id ? "Potvrdi" : "Obriši"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
