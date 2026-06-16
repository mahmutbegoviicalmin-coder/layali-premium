export const companyInfo = {
  legalName: "S&B PREMIUM",
  brandName: "Layali",
  address: "ul. 8. mart br. 3",
  city: "76250 Gradačac",
  country: "Bosna i Hercegovina",
  mbs: "32-01-0298-10",
  idNumber: "4209993730000",
  pdvNumber: "209993730000",
  phones: ["+387 61 661 662", "+387 62 626 526"],
  email: "info@sbpremiumbih.com",
  instagram: "layaliaromas",
} as const;

export function getFullAddress() {
  return `${companyInfo.address}, ${companyInfo.city}, ${companyInfo.country}`;
}

export function getInstagramUrl() {
  return `https://instagram.com/${companyInfo.instagram}`;
}

export function getPhoneHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
