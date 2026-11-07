import { estUnGrandDefi } from "../../apprentissage/domain/index.ts";
import type { Defi, DefiReleve, GrandDefi } from "../../apprentissage/domain/index.ts";
import { type CodeDeMatiere, matiereAvecArticle, matiereAvecDe } from "../../catalogue/domain/index.ts";
import { vocatif } from "./vocatif.ts";

function invitationARelever(numeroDuDefi: number, prenom?: string): string {
  return `Bravo${vocatif(prenom)} ! Tu as réussi toutes les leçons avant le défi ${numeroDuDefi}. Tu veux le relever ?`;
}

export function inviterARelever({ prenom, numeroDuDefi }: { prenom: string; numeroDuDefi: number }): string {
  return invitationARelever(numeroDuDefi, prenom);
}

export function inviterAReleverSansPrenom({ numeroDuDefi }: { numeroDuDefi: number }): string {
  return invitationARelever(numeroDuDefi);
}

export function parolesDeDebutDeDefi({ nombreDeLecons }: { nombreDeLecons: number }): string {
  return `Voici des questions de ${nombreDeLecons} leçons que tu connais. Prends ton temps, je suis avec toi !`;
}

function finDeDefi(numeroDuDefi: number, dejaReleve: boolean, prenom?: string): string {
  const encore = dejaReleve ? "encore " : "";
  return `Bravo${vocatif(prenom)} ! Tu as ${encore}relevé le défi ${numeroDuDefi} !`;
}

export function parolesDeFinDeDefi(
  { prenom, numeroDuDefi, dejaReleve }: { prenom: string; numeroDuDefi: number; dejaReleve: boolean },
): string {
  return finDeDefi(numeroDuDefi, dejaReleve, prenom);
}

export function parolesDeFinDeDefiSansPrenom(
  { numeroDuDefi, dejaReleve }: { numeroDuDefi: number; dejaReleve: boolean },
): string {
  return finDeDefi(numeroDuDefi, dejaReleve);
}

export function annonceDuDefiOuvert(numeroDuDefi: number): string {
  return `Le défi ${numeroDuDefi} est ouvert !`;
}

export function titreDuDefiReleve(): string {
  return "Défi relevé !";
}

/** Le personnage guide propose le défi ouvert après sa phrase de fin ; il ne le lance pas. */
export function phraseDeFinAvecLeDefi(phraseDeFin: string, prenom: string, numeroDuDefi: number | undefined): string {
  return numeroDuDefi === undefined ? phraseDeFin : `${phraseDeFin} ${inviterARelever({ prenom, numeroDuDefi })}`;
}

export function nomDuDefi(numero: number): string {
  return `Défi ${numero}`;
}

export function nomDuGrandDefi(): string {
  return "Grand défi";
}

export function annonceDuGrandDefiOuvert(matiere: CodeDeMatiere): string {
  return `Le grand défi ${matiereAvecArticle(matiere)} est ouvert !`;
}

function invitationAReleverLeGrandDefi(matiere: CodeDeMatiere, prenom?: string): string {
  return `Bravo${vocatif(prenom)} ! Tu as réussi toutes les leçons ${matiereAvecDe(matiere)}. Le grand défi t'attend !`;
}

export function inviterAReleverLeGrandDefi({ prenom, matiere }: { prenom: string; matiere: CodeDeMatiere }): string {
  return invitationAReleverLeGrandDefi(matiere, prenom);
}

export function inviterAReleverLeGrandDefiSansPrenom({ matiere }: { matiere: CodeDeMatiere }): string {
  return invitationAReleverLeGrandDefi(matiere);
}

export function parolesDeDebutDeGrandDefi({ matiere }: { matiere: CodeDeMatiere }): string {
  return `Voici des questions de toutes tes leçons ${matiereAvecDe(matiere)}. Prends ton temps, je suis avec toi !`;
}

function finDeGrandDefi(matiere: CodeDeMatiere, dejaReleve: boolean, prenom?: string): string {
  const encore = dejaReleve ? "encore " : "";
  return `Bravo${vocatif(prenom)} ! Tu as ${encore}relevé le grand défi ${matiereAvecArticle(matiere)} !`;
}

export function parolesDeFinDeGrandDefi(
  { prenom, matiere, dejaReleve }: { prenom: string; matiere: CodeDeMatiere; dejaReleve: boolean },
): string {
  return finDeGrandDefi(matiere, dejaReleve, prenom);
}

export function parolesDeFinDeGrandDefiSansPrenom(
  { matiere, dejaReleve }: { matiere: CodeDeMatiere; dejaReleve: boolean },
): string {
  return finDeGrandDefi(matiere, dejaReleve);
}

export function titreDuGrandDefiReleve(): string {
  return "Grand défi relevé !";
}

export function phraseDeFinAvecLeGrandDefi(phraseDeFin: string, prenom: string, matiere: CodeDeMatiere): string {
  return `${phraseDeFin} ${inviterAReleverLeGrandDefi({ prenom, matiere })}`;
}

export function nomDuDefiOuvert(defi: Defi | GrandDefi | DefiReleve): string {
  return estUnGrandDefi(defi) ? nomDuGrandDefi() : nomDuDefi(defi.numero);
}

export function annonceDuDefiOuvertPour(defi: Defi | GrandDefi): string {
  return estUnGrandDefi(defi) ? annonceDuGrandDefiOuvert(defi.matiere.code) : annonceDuDefiOuvert(defi.numero);
}

export function phraseDeFinAvecLeDefiOuvert(
  phraseDeFin: string,
  prenom: string,
  defi: Defi | GrandDefi | undefined,
): string {
  if (defi === undefined) return phraseDeFin;
  return estUnGrandDefi(defi)
    ? phraseDeFinAvecLeGrandDefi(phraseDeFin, prenom, defi.matiere.code)
    : phraseDeFinAvecLeDefi(phraseDeFin, prenom, defi.numero);
}

export function phraseDeFinAvecLeDefiOuvertSansPrenom(
  phraseDeFin: string,
  defi: Defi | GrandDefi | undefined,
): string {
  if (defi === undefined) return phraseDeFin;
  const invitation = estUnGrandDefi(defi)
    ? inviterAReleverLeGrandDefiSansPrenom({ matiere: defi.matiere.code })
    : inviterAReleverSansPrenom({ numeroDuDefi: defi.numero });
  return `${phraseDeFin} ${invitation}`;
}

export function parolesDeDebutDuDefi(defi: Defi | GrandDefi): string {
  return estUnGrandDefi(defi)
    ? parolesDeDebutDeGrandDefi({ matiere: defi.matiere.code })
    : parolesDeDebutDeDefi({ nombreDeLecons: defi.lecons.length });
}

export function parolesDeFinDuDefiReleve(
  { prenom, defi, dejaReleve }: { prenom: string; defi: DefiReleve; dejaReleve: boolean },
): string {
  return estUnGrandDefi(defi)
    ? parolesDeFinDeGrandDefi({ prenom, matiere: defi.matiere.code, dejaReleve })
    : parolesDeFinDeDefi({ prenom, numeroDuDefi: defi.numero, dejaReleve });
}

export function parolesDeFinDuDefiReleveSansPrenom(
  { defi, dejaReleve }: { defi: DefiReleve; dejaReleve: boolean },
): string {
  return estUnGrandDefi(defi)
    ? parolesDeFinDeGrandDefiSansPrenom({ matiere: defi.matiere.code, dejaReleve })
    : parolesDeFinDeDefiSansPrenom({ numeroDuDefi: defi.numero, dejaReleve });
}
