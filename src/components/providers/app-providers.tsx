"use client";

import { SavedProductsProvider } from "@/context/saved-products-context";
import { InquiryBasketProvider } from "@/context/inquiry-basket-context";
import { ProductsProvider } from "@/context/products-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProductsProvider>
      <SavedProductsProvider>
        <InquiryBasketProvider>{children}</InquiryBasketProvider>
      </SavedProductsProvider>
    </ProductsProvider>
  );
}
