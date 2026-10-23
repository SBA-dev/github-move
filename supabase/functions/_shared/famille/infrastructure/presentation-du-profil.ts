import type { ProfilEnfant } from "../domain/profil-enfant.ts";

export function presenterLeProfil(profil: ProfilEnfant | null) {
  if (profil === null) throw new Error("Le profil enregistré est introuvable à la relecture.");
  return {
    profil: {
      id: profil.id.valeur,
      prenom: profil.prenom.valeur,
      niveau: profil.niveau.valeur,
      univers: profil.univers,
      reglages: {
        modeDys: profil.reglages.modeDys,
        toutLireAVoixHaute: profil.reglages.toutLireAVoixHaute,
        parcoursLibre: profil.reglages.parcoursLibre,
        clavierDesDictees: profil.reglages.clavierDesDictees.valeur,
        langueDuParent: profil.reglages.langueDuParent.valeur,
      },
    },
  };
}
