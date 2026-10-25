import type { EtatDeLaCabane, ObjetDeLaCabane, PalierDeLaCabane } from "./cabane.ts";

const NOM_DU_PERSONNAGE_DE_LA_CABANE = "Noisette";

function accorder(nombre: number, singulier: string): string {
  return `${nombre} ${singulier}${nombre > 1 ? "s" : ""}`;
}

export function titreDeLaSection(): string {
  return `La cabane de ${NOM_DU_PERSONNAGE_DE_LA_CABANE}`;
}

export function phraseDeLEtat({ total, prochainPalier }: EtatDeLaCabane): string {
  const etoiles = `Tu as ${accorder(total, "étoile")}.`;
  if (prochainPalier === undefined) return `${etoiles} La cabane est complète, quelle merveille !`;
  const manquantes = accorder(prochainPalier.etoilesManquantes, "étoile");
  return `${etoiles} Encore ${manquantes} et ${NOM_DU_PERSONNAGE_DE_LA_CABANE} recevra ${prochainPalier.objet.nom} !`;
}

export function descriptionDuDessin({ objetsRecus }: EtatDeLaCabane): string {
  return `${titreDeLaSection()}, avec ${accorder(objetsRecus.length, "objet")}`;
}

export function libelleDuPalier(palier: PalierDeLaCabane, atteint: boolean): string {
  return atteint ? palier.objet.nom : `${palier.seuil} ★`;
}

export function libelleLuDuPalier(palier: PalierDeLaCabane, atteint: boolean): string {
  return atteint ? palier.objet.nom : accorder(palier.seuil, "étoile");
}

export function titreDeLAnnonce(): string {
  return "Pour la cabane";
}

export function annonceDeLObjetRecu(objet: ObjetDeLaCabane): string {
  return `${NOM_DU_PERSONNAGE_DE_LA_CABANE} a reçu ${objet.nom} !`;
}

export function finDePhraseDuPersonnageGuide(objet: ObjetDeLaCabane): string {
  return `${NOM_DU_PERSONNAGE_DE_LA_CABANE} a reçu ${objet.nom} pour sa cabane.`;
}

export function phraseDeFinAvecLaCabane(
  phraseDeFin: string,
  objet: ObjetDeLaCabane | undefined,
): string {
  return objet ? `${phraseDeFin} ${finDePhraseDuPersonnageGuide(objet)}` : phraseDeFin;
}
