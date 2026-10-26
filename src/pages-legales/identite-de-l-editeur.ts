/** Identité de l'éditeur, lue dans l'environnement du build (vite.config.ts) : elle n'est jamais dans le dépôt. */
export const IDENTITE_DE_L_EDITEUR = {
  editeur: String(import.meta.env.VITE_EDITEUR),
  directeurDePublication: String(import.meta.env.VITE_DIRECTEUR_DE_PUBLICATION),
  adresseDeContact: String(import.meta.env.VITE_ADRESSE_DE_CONTACT),
} as const;
