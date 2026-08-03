/** Format price in KM (Bosnian Convertible Mark). */
export function formatPrice(value: number): string {
  return `${value.toLocaleString("bs-BA", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} KM`;
}

export function getDisplayPrice(product: {
  price?: number | null;
  salePrice?: number | null;
}): { current: number; original?: number } | null {
  const price = product.price;
  const sale = product.salePrice;
  if (sale != null && sale > 0) {
    return {
      current: sale,
      original: price != null && price > sale ? price : undefined,
    };
  }
  if (price != null && price > 0) {
    return { current: price };
  }
  return null;
}
