"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  CheckCircle2,
  ArrowRight,
  Building2,
} from "lucide-react";
import {
  companyInfo,
  getFullAddress,
  getInstagramUrl,
  getPhoneHref,
} from "@/lib/data/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn, SectionContainer, SectionTitle } from "@/components/ui/section";

const contactItems = [
  {
    icon: MapPin,
    label: "Adresa",
    value: getFullAddress(),
    href: undefined,
  },
  ...companyInfo.phones.map((phone) => ({
    icon: Phone,
    label: "Telefon",
    value: phone,
    href: getPhoneHref(phone),
  })),
  {
    icon: Mail,
    label: "Email",
    value: companyInfo.email,
    href: `mailto:${companyInfo.email}`,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: `@${companyInfo.instagram}`,
    href: getInstagramUrl(),
  },
];

export function ContactPageContent() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="pt-36 pb-16">
        <SectionContainer>
          <div className="mx-auto max-w-lg rounded-3xl border border-border bg-white p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 font-heading text-2xl text-primary">
              Poruka poslana
            </h2>
            <p className="mt-3 text-muted">
              Naš tim će vam odgovoriti u roku od 24 sata.
            </p>
          </div>
        </SectionContainer>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-16">
      <SectionContainer>
        <FadeIn>
          <SectionTitle
            title="Kontakt"
            subtitle="Stupite u kontakt sa našim veleprodajnim timom u Gradačcu"
          />
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <FadeIn delay={0.1} className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-surface p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
                  <Building2 className="h-5 w-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {companyInfo.legalName}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-medium text-foreground">
                    Ekskluzivni predstavnik {companyInfo.brandName}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Veleprodaja premium okusa za nargilu. Tu smo za lounge
                    barove, kafiće i trgovine u regiji.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                      <Icon className="h-4 w-4 text-white" strokeWidth={1.75} />
                    </div>
                    <div className="mt-4 min-w-0">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-snug text-primary">
                        {item.value}
                      </p>
                    </div>
                  </>
                );

                return item.href ? (
                  <a
                    key={`${item.label}-${item.value}`}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group block rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)]"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={`${item.label}-${item.value}`}
                    className="rounded-2xl border border-border bg-white p-5"
                  >
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border bg-white px-5 py-4">
              <p className="text-[0.6875rem] leading-relaxed text-muted">
                {companyInfo.legalName} · MBS: {companyInfo.mbs} · ID broj:{" "}
                {companyInfo.idNumber} · PDV broj: {companyInfo.pdvNumber}
              </p>
            </div>

            <Link href="/inquiry" className="inline-flex">
              <Button variant="gold" className="gap-2">
                Pošalji upit za proizvode
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:col-span-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.04)] md:p-8"
            >
              <div>
                <h3 className="font-heading text-xl font-medium text-foreground">
                  Pošaljite nam poruku
                </h3>
                <p className="mt-1.5 text-sm text-muted">
                  Popunite formu i naš tim će vam se javiti u najkraćem roku.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Ime *" required />
                <Input label="Prezime *" required />
              </div>
              <Input label="Naziv firme *" required />
              <Input label="Email adresa *" type="email" required />
              <Input label="Broj telefona *" type="tel" required />
              <Textarea label="Poruka" placeholder="Kako vam možemo pomoći?" />
              <Button type="submit" variant="gold" size="lg" className="w-full">
                Pošalji poruku
              </Button>
            </form>
          </FadeIn>
        </div>

        <div id="faq" className="mt-16 scroll-mt-32 md:mt-20">
          <FadeIn>
            <h2 className="mb-8 text-center font-heading text-2xl font-medium text-foreground">
              Često postavljana pitanja
            </h2>
            <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
              {[
                {
                  q: "Da li prodajete krajnjim kupcima?",
                  a: "Ne. Saradjujemo isključivo sa firmama i B2B partnerima.",
                },
                {
                  q: "Kako mogu dobiti cijene?",
                  a: "Pošaljite upit preko kontakt forme ili liste za upit. Odgovor stiže sa veleprodajnim uslovima prema volumenu.",
                },
                {
                  q: "Koliki je minimalni order?",
                  a: "Minimalne količine zavise od proizvoda i lokacije. Kontaktirajte nas za tačne uslove.",
                },
                {
                  q: "Da li vršite dostavu?",
                  a: "Da. Isporučujemo na području BiH i u dogovoru za odabrane destinacije u regiji.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-border bg-white p-6"
                >
                  <h3 className="font-medium text-primary">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </SectionContainer>
    </div>
  );
}
