"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Send, CheckCircle2, ShoppingBag } from "lucide-react";
import type { InquiryFormData } from "@/lib/types";
import { useInquiryBasket } from "@/context/inquiry-basket-context";
import { OrderMinimumPanel } from "@/components/inquiry/order-minimum-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn, SectionContainer, SectionTitle } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import {
  PACK_SIZE_OPTIONS,
  formatGrams,
  getItemGrams,
  normalizeInquiryItem,
} from "@/lib/order-rules";

export function InquiryPage() {
  const {
    items,
    removeFromInquiry,
    updatePackSize,
    updatePackCount,
    clearInquiry,
    itemCount,
    totalOrderGrams,
    minimumOrderGrams,
    meetsMinimumOrder,
    gramsRemaining,
    orderProgress,
  } = useInquiryBasket();
  const [submitted, setSubmitted] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({});
  const [form, setForm] = useState<InquiryFormData>({
    firstName: "",
    lastName: "",
    businessName: "",
    city: "",
    phone: "",
    email: "",
    message: "",
    preferredBrands: "",
    expectedVolume: "",
  });

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Obavezno polje";
    if (!form.lastName.trim()) newErrors.lastName = "Obavezno polje";
    if (!form.businessName.trim()) newErrors.businessName = "Obavezno polje";
    if (!form.city.trim()) newErrors.city = "Obavezno polje";
    if (!form.phone.trim()) newErrors.phone = "Obavezno polje";
    if (!form.email.trim()) newErrors.email = "Obavezno polje";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Neispravna email adresa";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");

    if (items.length > 0 && !meetsMinimumOrder) {
      setOrderError(
        `Minimalna narudžba je ${formatGrams(minimumOrderGrams)}. Još vam treba ${formatGrams(gramsRemaining)}.`
      );
      return;
    }

    if (!validate()) return;
    setSubmitted(true);
    clearInquiry();
  };

  if (submitted) {
    return (
      <div className="pt-36 pb-16">
        <SectionContainer>
          <FadeIn>
            <div className="mx-auto max-w-lg rounded-3xl border border-border bg-white p-12 text-center md:p-16">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mt-8 font-heading text-3xl font-medium text-foreground">
                Hvala vam
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Naš veleprodajni tim će vas uskoro kontaktirati.
              </p>
              <Link href="/products" className="mt-8 inline-block">
                <Button variant="gold" size="lg">
                  Nastavi pregled
                </Button>
              </Link>
            </div>
          </FadeIn>
        </SectionContainer>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-16">
      <SectionContainer>
        <FadeIn>
          <SectionTitle
            title="Lista za upit"
            subtitle="Odaberite okuse, pakovanja i količine. Minimalna narudžba je 1 kg, mix okusa je dozvoljen."
          />
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <FadeIn delay={0.1}>
              <OrderMinimumPanel
                totalGrams={totalOrderGrams}
                minimumGrams={minimumOrderGrams}
                progress={orderProgress}
                meetsMinimum={meetsMinimumOrder}
                gramsRemaining={gramsRemaining}
                itemCount={itemCount}
              />
            </FadeIn>

            <FadeIn delay={0.12}>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-heading text-lg font-medium text-primary">
                  Odabrani proizvodi
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  Pakovanja: 200 g i 250 g. Kombinujte različite okuse do
                  minimuma od {formatGrams(minimumOrderGrams)}.
                </p>

                {items.length === 0 ? (
                  <div className="mt-6 py-8 text-center">
                    <ShoppingBag className="mx-auto h-10 w-10 text-muted/40" />
                    <p className="mt-3 text-sm text-muted">
                      Vaša lista za upit je prazna
                    </p>
                    <Link href="/products" className="mt-4 inline-block">
                      <Button variant="secondary" size="sm">
                        Pregledaj proizvode
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {items.map((rawItem) => {
                      const item = normalizeInquiryItem(rawItem);
                      const lineGrams = getItemGrams(item);

                      return (
                        <div
                          key={item.product.id}
                          className="rounded-2xl border border-border p-4"
                        >
                          <div className="flex gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-muted">
                                {item.product.brand}
                              </p>
                              <p className="truncate text-sm font-medium text-primary">
                                {item.product.name}
                              </p>
                              <p className="mt-1 text-xs font-medium text-primary/80">
                                {formatGrams(lineGrams)} ukupno
                              </p>
                            </div>
                            <button
                              aria-label="Ukloni proizvod"
                              onClick={() => removeFromInquiry(item.product.id)}
                              className="shrink-0 text-muted transition-colors hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div>
                              <p className="mb-2 text-xs text-muted">Pakovanje</p>
                              <div className="flex gap-2">
                                {PACK_SIZE_OPTIONS.map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() =>
                                      updatePackSize(item.product.id, size)
                                    }
                                    className={cn(
                                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                                      item.packSizeGrams === size
                                        ? "bg-primary text-white"
                                        : "border border-border bg-background text-muted hover:text-primary"
                                    )}
                                  >
                                    {size} g
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="mb-2 block text-xs text-muted">
                                Broj pakovanja
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={item.packCount ?? 1}
                                onChange={(e) =>
                                  updatePackCount(
                                    item.product.id,
                                    parseInt(e.target.value, 10) || 1
                                  )
                                }
                                className="h-9 w-full rounded-lg border border-border px-3 text-sm focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {items.length > 0 && (
                  <div className="mt-6 space-y-3 border-t border-border pt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Broj okusa</span>
                      <span className="font-medium text-primary">{itemCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Ukupna težina</span>
                      <span className="font-medium text-primary">
                        {formatGrams(totalOrderGrams)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Minimum</span>
                      <span className="font-medium text-primary">
                        {formatGrams(minimumOrderGrams)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Status</span>
                      <span
                        className={cn(
                          "font-medium",
                          meetsMinimumOrder ? "text-primary" : "text-amber-700"
                        )}
                      >
                        {meetsMinimumOrder
                          ? "Spremno za slanje"
                          : `Nedostaje ${formatGrams(gramsRemaining)}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-3">
            <FadeIn delay={0.2}>
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-border bg-white p-6 md:p-8"
              >
                <h3 className="font-heading text-lg font-medium text-primary">
                  Forma za veleprodajni upit
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Ime *"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Prezime *"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    error={errors.lastName}
                    required
                  />
                </div>

                <Input
                  label="Naziv firme *"
                  value={form.businessName}
                  onChange={(e) =>
                    setForm({ ...form, businessName: e.target.value })
                  }
                  error={errors.businessName}
                  required
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Grad *"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    error={errors.city}
                    required
                  />
                  <Input
                    label="Broj telefona *"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    error={errors.phone}
                    required
                  />
                </div>

                <Input
                  label="Email adresa *"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                  required
                />

                <Input
                  label="Preferirani brendovi"
                  value={form.preferredBrands}
                  onChange={(e) =>
                    setForm({ ...form, preferredBrands: e.target.value })
                  }
                  placeholder="npr. Layali"
                />

                <Input
                  label="Očekivani mjesečni volumen"
                  value={form.expectedVolume}
                  onChange={(e) =>
                    setForm({ ...form, expectedVolume: e.target.value })
                  }
                  placeholder="npr. 5 kg mjesečno"
                />

                <Textarea
                  label="Poruka"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Opišite vaš lokal, potrebe i očekivanja..."
                />

                {items.length > 0 && (
                  <p className="text-xs text-muted">
                    {itemCount} okus(a), ukupno {formatGrams(totalOrderGrams)}{" "}
                    bit će priloženo ovom upitu.
                  </p>
                )}

                {orderError && (
                  <p className="rounded-xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    {orderError}
                  </p>
                )}

                {items.length > 0 && !meetsMinimumOrder && (
                  <p className="rounded-xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Minimalna narudžba je {formatGrams(minimumOrderGrams)}. Dodajte
                    još {formatGrams(gramsRemaining)} u različitim okusima ili
                    pakovanjima.
                  </p>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={items.length > 0 && !meetsMinimumOrder}
                >
                  <Send className="h-5 w-5" />
                  Pošalji upit
                </Button>
              </form>
            </FadeIn>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
