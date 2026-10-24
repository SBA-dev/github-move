import { useEffect } from "react";
import type { ProfilEnCours } from "@domain/famille";
import {
  type PastilleDeRecord,
  parolesALOuverture,
  parolesDeLaSectionDesRecords,
  phraseLueDeLaPastille,
  sectionsAAfficher,
  type Univers,
  NOM_DE_L_ECRAN_DES_MEDAILLES,
  TITRE_DES_RECORDS_DE_CALCUL_RAPIDE,
} from "@domain/motivation";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";
import { usePastillesDesRecords } from "./usePastillesDesRecords.ts";

type Props = {
  readonly profil: ProfilEnCours;
  readonly univers: Univers;
  readonly voix: Voix;
};

/** L'écran « Mes médailles » : il affiche ce que le domaine calcule et lit ce que le domaine lui dit de lire. */
export function MesMedailles({ profil, univers, voix }: Props) {
  const pastilles = usePastillesDesRecords(profil.id);
  const { parole, rangDuMotPrononce, humeur, dire, faireSilence } = usePersonnageQuiParle(voix);
  const toutLire = profil.reglages.toutLireAVoixHaute;
  const { lire } = voix;

  useEffect(() => {
    if (pastilles === undefined) return;
    const [accueil = "", ...suite] = parolesALOuverture({ toutLire, pastilles });
    void (async () => {
      if (!(await dire({ texte: accueil, nature: "accueil" }))) return;
      for (const texte of suite) await lire(texte);
    })();
    return faireSilence;
  }, [pastilles, toutLire, dire, lire, faireSilence]);

  const ecouterLesRecords = async () => {
    for (const texte of parolesDeLaSectionDesRecords(pastilles ?? [])) await lire(texte);
  };
  const sections = sectionsAAfficher(pastilles && pastilles.length > 0 ? ["recordsDeFluence"] : []);

  return (
    <section className="mes-medailles" aria-labelledby="titre-de-mes-medailles">
      <h1 id="titre-de-mes-medailles">{NOM_DE_L_ECRAN_DES_MEDAILLES}</h1>
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={humeur} />
        <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
      </div>
      {pastilles !== undefined && sections.includes("recordsDeFluence") && (
        <SectionDesRecords pastilles={pastilles} onEcouter={ecouterLesRecords} />
      )}
    </section>
  );
}

type PropsDeLaSection = { readonly pastilles: readonly PastilleDeRecord[]; readonly onEcouter: () => void };

function SectionDesRecords({ pastilles, onEcouter }: PropsDeLaSection) {
  return (
    <section className="section-des-medailles" aria-labelledby="titre-des-records-de-calcul-rapide">
      <h2 id="titre-des-records-de-calcul-rapide">{TITRE_DES_RECORDS_DE_CALCUL_RAPIDE}</h2>
      <button type="button" className="secondaire" onClick={onEcouter}>Écouter</button>
      <ul className="pastilles-de-record">
        {pastilles.map((pastille) => (
          <li
            key={`${pastille.lecon}/${pastille.exercice}`}
            className="pastille-de-record"
            data-testid="pastille-de-record"
            aria-label={phraseLueDeLaPastille(pastille)}
          >
            <span className="libelle-de-la-pastille" aria-hidden="true">{pastille.libelle}</span>
            <span className="valeur-de-la-pastille" aria-hidden="true">{pastille.meilleurScore}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
