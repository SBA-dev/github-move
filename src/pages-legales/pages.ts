export type PageLegale = "politique-de-confidentialite" | "mentions-legales";

export const CHEMINS_DES_PAGES_LEGALES: Readonly<Record<PageLegale, string>> = {
  "politique-de-confidentialite": "/politique-de-confidentialite",
  "mentions-legales": "/mentions-legales",
};
