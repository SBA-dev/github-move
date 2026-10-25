import { type Lecon, libelleDuType } from "@domain/catalogue";

export const AUCUNE_LECON_CREEE = "Aucune leçon créée pour l'instant. Utilise l'onglet « Créer une leçon ».";
export const PROGRAMME_INDISPONIBLE = "Le programme n'est pas disponible pour l'instant. Réessaie dans un instant.";
export const PREPARATION_IMPOSSIBLE = "La leçon n'a pas pu être préparée. Réessaie dans un instant.";
export const LECONS_INDISPONIBLES = "Les leçons ne sont pas disponibles pour l'instant. Réessaie dans un instant.";
export const SUPPRESSION_IMPOSSIBLE = "La leçon n'a pas pu être supprimée. Réessaie dans un instant.";
export const AUCUN_ENFANT = "Crée d'abord le profil d'un enfant dans la section « Profils ».";

export function messageApresEnregistrement(prenom: string): string {
  return `La leçon apparaît maintenant dans « Toutes les leçons » de ${prenom}, avec « Pour toi ».`;
}

export function typesDeLaLecon(lecon: Lecon): string {
  const types = new Set(lecon.exercices.map(({ type }) => libelleDuType(type)));
  return [...types].join(", ");
}

export function niveauMatiereEtTypes(lecon: Lecon): string {
  return `${lecon.niveau.valeur} · ${lecon.matiere.libelle} · ${typesDeLaLecon(lecon)}`;
}
