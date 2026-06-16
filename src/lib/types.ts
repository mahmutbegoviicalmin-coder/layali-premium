export type ProductCategory =
  | "fruit"
  | "ice"
  | "exotic"
  | "premium"
  | "dessert"
  | "mint";

export type ProductTab =
  | "best-sellers"
  | "new-arrivals"
  | "fruit"
  | "ice"
  | "exotic"
  | "premium";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: ProductCategory;
  categoryLabel: string;
  strength: 1 | 2 | 3 | 4 | 5;
  origin: string;
  image: string;
  images: string[];
  description: string;
  packagingSizes: string[];
  specifications: Record<string, string>;
  tags: ProductTab[];
  isNew?: boolean;
  isBestSeller?: boolean;
  /** Istaknut vizuelno na kartici (poseban okvir) */
  isHighlighted?: boolean;
  /** Prikaz na početnoj stranici */
  showOnHomepage?: boolean;
  /** Redoslijed na početnoj (manji broj = prije) */
  homepageOrder?: number;
  /** Dostupna količina u gramima; null = bez ograničenja */
  availableQuantity?: number | null;
  /** Neaktivan proizvod se ne prikazuje na sajtu */
  isActive?: boolean;
}

export interface CatalogCategory {
  id: ProductCategory;
  label: string;
}

export interface CatalogData {
  categories: CatalogCategory[];
  products: Product[];
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
}

export interface InquiryItem {
  product: Product;
  /** @deprecated koristi packCount */
  quantity?: number;
  packSizeGrams?: 200 | 250;
  packCount?: number;
}

export interface InquiryFormData {
  firstName: string;
  lastName: string;
  businessName: string;
  city: string;
  phone: string;
  email: string;
  message?: string;
  preferredBrands?: string;
  expectedVolume?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface HeroSlide {
  id: number;
  image: string;
  alt: string;
  flavor: string;
  bgColor: string;
  accentColor: string;
  controlTheme: "light" | "dark";
  isBestSeller?: boolean;
  /** B2B tekst — ne ponavlja ono što piše na baneru */
  eyebrow: string;
  headline: string;
  subheadline: string;
}

export interface CategoryCard {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}
