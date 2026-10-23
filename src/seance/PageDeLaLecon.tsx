import { useEffect, useMemo, useState } from "react";
import { pageDeLaLecon } from "@domain/catalogue";
import { accueillirSurLaPageDeLaLecon, type Univers } from "@domain/motivation";
import { PersonnageGuide } from "../univers/index.ts";
import type { Voix } from "../voix/index.ts";
import { EtoilesDessinees } from "./fin-de-seance/EtoilesDessinees.tsx";
import { meilleuresEtoilesSurTrois } from "./fin-de-seance/texte-des-etoiles.ts";
import { useMeilleuresEtoiles } from "./fin-de-seance/useMeilleuresEtoiles.ts";
import { BulleDuPersonnageGuide } from "./BulleDuPersonnageGuide.tsx";
import { useLecon, useSectionDuProgramme } from "./useLecon.ts";
import { usePersonnageQuiParle } from "./usePersonnageQuiParle.ts";

type Props = {
  readonly leconId: string;
  readonly profilId: string;
  readonly prenom: string;
  readonly univers: Univers;
  readonly voix: Voix;
  /** Faux quand l'enfant revient de la séance : le personnage guide ne lui répète pas l'accueil. */
  readonly accueillir: boolean;
  /** Sans position : la séance complète ; avec une position : un seul exercice. */
  readonly onCommencer: (exercice?: number) => void;
  readonly onRetourALAccueil: () => void;
};

export function PageDeLaLecon({ leconId, profilId, prenom, univers, voix, accueillir, onCommencer, onRetourALAccueil }: Props) {
  const chargee = useLecon(leconId);
  if (chargee.type === "chargement") return <p>Chargement de la leçon…</p>;
  if (chargee.type === "introuvable") {
    return (
      <section className="page-de-la-lecon">
        <h2>Leçon introuvable</h2>
        <p>Cette leçon n'est pas dans la bibliothèque.</p>
        <button type="button" onClick={onRetourALAccueil}>Retour à l'accueil</button>
      </section>
    );
  }
  return (
    <LeconAffichee
      lecon={chargee.lecon}
      profilId={profilId}
      prenom={prenom}
      univers={univers}
      voix={voix}
      accueillir={accueillir}
      onCommencer={onCommencer}
    />
  );
}

type PropsAffichage = Omit<Props, "leconId" | "onRetourALAccueil"> & {
  readonly lecon: Parameters<typeof pageDeLaLecon>[0];
};

function LeconAffichee({ lecon, profilId, prenom, univers, voix, accueillir, onCommencer }: PropsAffichage) {
  const section = useSectionDuProgramme(lecon.programme.section);
  const page = useMemo(() => pageDeLaLecon(lecon, section), [lecon, section]);
  const { parole, rangDuMotPrononce, humeur, dire, reecouter, faireSilence } = usePersonnageQuiParle(voix);
  const [accueilALire] = useState(accueillir);
  useEffect(() => {
    if (accueilALire) void dire({ texte: accueillirSurLaPageDeLaLecon(prenom), nature: "accueil" });
    return faireSilence;
  }, [accueilALire, prenom, dire, faireSilence]);
  const { passagePourLesAdultes: adultes } = page;
  const meilleuresEtoiles = useMeilleuresEtoiles(profilId, lecon.id);

  return (
    <section className="page-de-la-lecon" aria-labelledby="titre-de-la-lecon">
      <h2 id="titre-de-la-lecon">{page.titre}</h2>
      <p data-testid="niveau-et-matiere">{page.niveauEtMatiere}</p>
      {meilleuresEtoiles && (
        <div className="meilleures-etoiles" data-testid="meilleures-etoiles" data-etoiles={meilleuresEtoiles.nombre}>
          <EtoilesDessinees nombre={meilleuresEtoiles.nombre} />
          <p>{meilleuresEtoilesSurTrois(meilleuresEtoiles.nombre)}</p>
        </div>
      )}
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={humeur} />
        <BulleDuPersonnageGuide texte={parole?.texte} nature={parole?.nature} rangDuMotPrononce={rangDuMotPrononce} />
      </div>
      <button type="button" onClick={reecouter}>Réécouter</button>
      <button type="button" className="commencer" onClick={() => onCommencer()}>Leçon et tous les jeux</button>
      <p id="choix-d-un-jeu">Ou choisis un seul jeu :</p>
      <ul className="exercices-proposes" aria-labelledby="choix-d-un-jeu">
        {page.exercicesProposes.map(({ position, libelle, intitule }) => (
          <li key={position}>
            <button type="button" data-testid="exercice-propose" onClick={() => onCommencer(position)}>
              <span className="libelle-du-type">{libelle}</span>
              {intitule !== libelle && <span className="intitule">{intitule}</span>}
            </button>
          </li>
        ))}
      </ul>
      <details className="pour-les-adultes" data-testid="pour-les-adultes">
        <summary>Pour les adultes : ce que dit le programme</summary>
        <blockquote data-testid="citation-du-programme">{adultes.citation}</blockquote>
        {adultes.source && <p data-testid="source-du-programme">{adultes.source}</p>}
        {adultes.guide && (
          <div data-testid="guide-fondamental">
            <h3>Ce que conseille le guide fondamental</h3>
            <blockquote>{adultes.guide.extrait}</blockquote>
            <p>{adultes.guide.reference}</p>
          </div>
        )}
      </details>
    </section>
  );
}
