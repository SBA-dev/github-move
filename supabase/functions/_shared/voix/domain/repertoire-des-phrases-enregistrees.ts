export type RepertoireDesPhrasesEnregistrees = {
  readonly voixEnregistree: string;
  readonly phrases: Readonly<Record<string, { readonly normale: string; readonly lente?: string }>>;
};
