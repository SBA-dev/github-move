import { accorder } from "./accord.ts";
import type { Badge } from "./badges.ts";
import type { ObjetDeLaCabane } from "./cabane.ts";
import { finDePhraseDuPersonnageGuide } from "./paroles-de-la-cabane.ts";

export function titreDeLaSectionDesBadges(): string {
  return "Mes badges";
}

export function phraseSansBadge(): string {
  return "Gagne au moins 2 étoiles dans une leçon pour gagner son badge.";
}

export function phraseDeLaSectionDesBadges(badges: readonly Badge[]): string {
  return `Tu as ${accorder(badges.length, "badge")}.`;
}

export function libelleDeLaListeDesBadges(badges: readonly Badge[]): string {
  return `${titreDeLaSectionDesBadges()}, avec ${accorder(badges.length, "badge")}`;
}

export function parolesDeLaSectionDesBadges(badges: readonly Badge[]): string[] {
  return [titreDeLaSectionDesBadges(), phraseDeLaSectionDesBadges(badges)];
}

export function titreDeLAnnonceDuBadge(): string {
  return "Nouveau badge";
}

export function finDePhraseDuBadge(badge: Badge): string {
  return `${titreDeLAnnonceDuBadge()} : ${badge.nom} !`;
}

export function phraseDeFinAvecLesNouveautes(
  phraseDeFin: string,
  { objet, badge }: { objet: ObjetDeLaCabane | undefined; badge: Badge | undefined },
): string {
  const fins = [
    objet && finDePhraseDuPersonnageGuide(objet),
    badge && finDePhraseDuBadge(badge),
  ].filter((fin) => fin !== undefined);
  return [phraseDeFin, ...fins].join(" ");
}
