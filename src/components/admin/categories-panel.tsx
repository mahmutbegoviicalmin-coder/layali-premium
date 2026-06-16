"use client";

import { useState } from "react";
import { FolderOpen, Plus, Save, Tag } from "lucide-react";
import type { CatalogCategory, ProductCategory } from "@/lib/types";
import { slugify } from "@/lib/utils/slugify";

interface CategoriesPanelProps {
  categories: CatalogCategory[];
  onSave: (categories: CatalogCategory[]) => Promise<void>;
}

export function CategoriesPanel({ categories, onSave }: CategoriesPanelProps) {
  const [items, setItems] = useState(categories);
  const [newId, setNewId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await onSave(items);
      setMessage("Kategorije su sačuvane.");
    } catch {
      setMessage("Greška pri čuvanju kategorija.");
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    const id = (newId.trim() || slugify(newLabel)) as ProductCategory;
    const label = newLabel.trim();
    if (!id || !label) return;
    if (items.some((c) => c.id === id)) {
      setMessage("Kategorija sa ovim ID već postoji.");
      return;
    }
    setItems([...items, { id, label }]);
    setNewId("");
    setNewLabel("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-neutral-500" />
          <h2 className="text-base font-semibold text-neutral-900">
            Kategorije proizvoda
          </h2>
        </div>
        <p className="mt-2 text-sm text-neutral-500">
          Ovdje mijenjate nazive kategorija koje se prikazuju na karticama
          proizvoda. ID kategorije koristite samo za internu vezu u sistemu.
        </p>

        <div className="mt-5 space-y-3">
          {items.map((category, index) => (
            <div
              key={category.id}
              className="grid gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4 sm:grid-cols-[140px_1fr]"
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  ID kategorije
                </label>
                <input
                  value={category.id}
                  readOnly
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Naziv za prikaz
                </label>
                <input
                  value={category.label}
                  onChange={(e) => {
                    const next = [...items];
                    next[index] = { ...category, label: e.target.value };
                    setItems(next);
                  }}
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Čuvanje..." : "Sačuvaj kategorije"}
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-neutral-500" />
          <h3 className="text-base font-semibold text-neutral-900">
            Dodaj novu kategoriju
          </h3>
        </div>
        <p className="mt-2 text-sm text-neutral-500">
          Unesite naziv. ID se generiše automatski iz naziva ako ga ne unesete
          ručno (npr. voćni-okusi).
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Naziv kategorije"
            className="h-10 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
          />
          <input
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="ID (opcionalno)"
            className="h-10 rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <button
          type="button"
          onClick={addCategory}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <Plus className="h-4 w-4" />
          Dodaj u listu
        </button>
      </div>

      {message && (
        <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {message}
        </p>
      )}
    </div>
  );
}
