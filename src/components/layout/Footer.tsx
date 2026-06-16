import Link from "next/link";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import {
  companyInfo,
  getFullAddress,
  getInstagramUrl,
  getPhoneHref,
} from "@/lib/data/company";

const footerLinks = {
  Proizvodi: [
    { label: "Bestseleri", href: "/products?tab=best-sellers" },
    { label: "Novi proizvodi", href: "/products?tab=new-arrivals" },
    { label: "Voćni okusi", href: "/products?tab=fruit" },
    { label: "Ledeni okusi", href: "/products?tab=ice" },
    { label: "Premium serija", href: "/products?tab=premium" },
  ],
  Stranice: [
    { label: "Početna", href: "/" },
    { label: "Proizvodi", href: "/products" },
    { label: "Brendovi", href: "/brands" },
    { label: "Kategorije", href: "/categories" },
    { label: "O nama", href: "/about" },
  ],
  Kompanija: [
    { label: "O nama", href: "/about" },
    { label: "Postani partner", href: "/contact" },
    { label: "Veleprodajni program", href: "/about#wholesale" },
    { label: "Kontakt", href: "/contact" },
  ],
  Podrška: [
    { label: "Kontakt", href: "/contact" },
    { label: "Pošalji upit", href: "/inquiry" },
    { label: "Često postavljana pitanja", href: "/contact#faq" },
    { label: "Informacije o dostavi", href: "/about#distribution" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-8 border-t-4 border-primary bg-ink text-white">
      <div className="mx-auto w-[95%] max-w-7xl py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <span className="font-heading text-2xl font-semibold tracking-[0.15em]">
              LAYALI
            </span>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/45">
              {companyInfo.legalName}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Premium veleprodaja okusa za nargilu za lounge barove, kafiće,
              trgovine i distributere u regiji.
            </p>

            <div className="mt-6 space-y-3">
              <p className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {getFullAddress()}
              </p>

              {companyInfo.phones.map((phone) => (
                <a
                  key={phone}
                  href={getPhoneHref(phone)}
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {phone}
                </a>
              ))}

              <a
                href={`mailto:${companyInfo.email}`}
                className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {companyInfo.email}
              </a>

              <a
                href={getInstagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-primary"
              >
                <Instagram className="h-4 w-4 shrink-0" />
                @{companyInfo.instagram}
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/50">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-heading text-xl font-medium md:text-2xl">
                Budite u toku
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Primajte obavijesti o novim okusima, brendu i veleprodajnim
                ponudama.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
          <p className="text-center text-xs leading-relaxed text-white/40 md:text-left">
            {companyInfo.legalName} · MBS: {companyInfo.mbs} · ID broj:{" "}
            {companyInfo.idNumber} · PDV broj: {companyInfo.pdvNumber}
          </p>

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} {companyInfo.legalName}. Sva
              prava zadržana.
            </p>
            <a
              href={getInstagramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/60 transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
