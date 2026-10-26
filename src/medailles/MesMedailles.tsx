import { useCallback, useEffect } from "react";
import type { ProfilEnCours } from "@domain/famille";
import {
  type Badge,
  type PastilleDeRecord,
  parolesALOuverture,
  parolesDeLaSectionDesBadgesOuSansBadge,
  parolesDeLaSectionDesRecords,
  phraseLueDeLaPastille,
  phraseDeLEtat,
  sectionsDeLEcran,
  titreDeLaSection,
  type Univers,
  NOM_DE_L_ECRAN_DES_MEDAILLES,
  TITRE_DES_RECORDS_DE_CALCUL_RAPIDE,
} from "@domain/motivation";
import { BulleDuPersonnageGuide } from "../seance/BulleDuPersonnageGuide.tsx";
import { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";
import { SectionDeLaCabane } from "./SectionDeLaCabane.tsx";
import { SectionDesBadges } from "./SectionDesBadges.tsx";
import { useBadges } from "./useBadges.ts";
import { useCabane } from "./useCabane.ts";
import { usePastillesDesRecords } from "./usePastillesDesRecords.ts";

type Props = {
  readonly profil: ProfilEnCours;
  readonly univers: Univers;
  readonly voix: Voix;
};

/** L'écran « Mes médailles » : il affiche ce que le domaine calcule et lit ce que le domaine lui dit de lire. */
export function MesMedailles({ profil, univers, voix }: Props) {
  const pastilles = usePastillesDesRecords(profil.id);
  const { chargee: cabaneChargee, cabane } = useCabane(profil.id);
  const { charges: badgesCharges, badges } = useBadges(profil.id);
  const { parole, rangDuMotPrononce, humeur, dire, faireSilence } = usePersonnageQuiParle(voix);
  const toutLire = profil.reglages.toutLireAVoixHaute;

  const direLaSuite = useCallback(async (textes: readonly string[]) => {
    for (const texte of textes) if (!(await dire({ texte, nature: "annonce" }))) return;
  }, [dire]);

  useEffect(() => {
    if (pastilles === undefined || !cabaneChargee || !badgesCharges) return;
    const [accueil = "", ...suite] = parolesALOuverture({ toutLire, pastilles, cabane, badges });
    void (async () => {
      if (!(await dire({ texte: accueil, nature: "accueil" }))) return;
      await direLaSuite(suite);
    })();
    return faireSilence;
  }, [pastilles, cabaneChargee, cabane, badgesCharges, badges, toutLire, dire, direLaSuite, faireSilence]);

  const ecouterLesRecords = () => direLaSuite(parolesDeLaSectionDesRecords(pastilles ?? []));
  const ecouterLaCabane = async () => {
    if (cabane) await direLaSuite([titreDeLaSection(), phraseDeLEtat(cabane)]);
  };
  const ecouterLesBadges = async () => {
    if (badges) await direLaSuite(parolesDeLaSectionDesBadgesOuSansBadge(badges));
  };
  const lireLeBadge = async (badge: Badge) => {
    await direLaSuite([badge.nom]);
  };
  const sections = sectionsDeLEcran({ pastilles: pastilles ?? [], cabane, badges });

  return (
    <section className="mes-medailles" aria-labelledby="titre-de-mes-medailles">
      <h1 id="titre-de-mes-medailles">{NOM_DE_L_ECRAN_DES_MEDAILLES}</h1>
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={humeur} />
        <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
      </div>
      {cabane !== undefined && sections.includes("cabane") && (
        <SectionDeLaCabane cabane={cabane} onEcouter={ecouterLaCabane} />
      )}
      {badges !== undefined && sections.includes("badges") && (
        <SectionDesBadges badges={badges} onEcouter={ecouterLesBadges} onLireLeBadge={lireLeBadge} />
      )}
      {pastilles !== undefined && sections.includes("recordsDeFluence") && (
        <SectionDesRecords pastilles={pastilles} onEcouter={ecouterLesRecords} />
      )}
    </section>
  );
}

type PropsDeLaSection = { readonly pastilles: readonly PastilleDeRecord[]; readonly onEcouter: () => Promise<void> };

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
          >
            <span className="visuellement-cache">{phraseLueDeLaPastille(pastille)}</span>
            <span className="libelle-de-la-pastille" aria-hidden="true">{pastille.libelle}</span>
            <span className="valeur-de-la-pastille" aria-hidden="true">{pastille.meilleurScore}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
