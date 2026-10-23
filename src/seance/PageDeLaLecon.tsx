import { useEffect, useState } from "react";
import { type PageDeLaLecon as Page } from "@domain/catalogue";
import { accueilDeLaLecon, HUMEUR_PAR_DEFAUT, type Univers } from "@domain/motivation";
import { PersonnageGuide } from "../univers/index.ts";
import { ConsigneLue, type Voix } from "../voix/index.ts";
import { BulleDuPersonnage } from "./BulleDuPersonnage.tsx";
import { sourceDeLaSection } from "./bibliotheque.ts";
import { useParoleLue } from "./useParoleLue.ts";

type Props = {
  readonly page: Page;
  readonly prenom: string;
  readonly univers: Univers;
  readonly voix: Voix;
  readonly modeDys: boolean;
  readonly message?: string;
  readonly onSeanceComplete: () => void;
  readonly onUnExercice: (position: number) => void;
};

function PassagePourLesAdultes({ passage }: { readonly passage: Page["passagePourLesAdultes"] }) {
  const [source, setSource] = useState<string | undefined>();
  const section = passage.programme.section;
  useEffect(() => {
    let annule = false;
    void sourceDeLaSection(section).then((texte) => !annule && setSource(texte));
    return () => {
      annule = true;
    };
  }, [section]);
  const guide = passage.guideFondamental;
  return (
    <section className="passage-pour-les-adultes" aria-labelledby="titre-passage-adultes" data-testid="passage-adultes">
      <h3 id="titre-passage-adultes">Pour les adultes : ce que dit le programme</h3>
      <blockquote data-testid="citation-du-programme">{passage.programme.citation}</blockquote>
      {source && <p data-testid="source-du-programme">{source}</p>}
      {guide && (
        <>
          <h4>Ce que conseille le guide fondamental</h4>
          <blockquote data-testid="extrait-du-guide-fondamental">{guide.extrait}</blockquote>
          <p data-testid="source-du-guide-fondamental">
            Guide fondamental « {guide.titre} » (Eduscol), page {guide.page}.
          </p>
        </>
      )}
    </section>
  );
}

export function PageDeLaLecon(
  { page, prenom, univers, voix, modeDys, message, onSeanceComplete, onUnExercice }: Props,
) {
  const accueil = accueilDeLaLecon(prenom);
  const { lireLaParole, arreter, rangDuMotPrononceDans } = useParoleLue(voix);
  useEffect(() => {
    void lireLaParole(accueil);
    return arreter;
  }, [accueil, lireLaParole, arreter]);

  return (
    <section className="page-de-la-lecon" aria-labelledby="titre-lecon">
      <h2 id="titre-lecon">{page.titre}</h2>
      <p data-testid="niveau-et-matiere">{page.niveauEtMatiere}</p>
      <div className="guide-et-parole">
        <PersonnageGuide univers={univers} humeur={HUMEUR_PAR_DEFAUT} />
        <BulleDuPersonnage modeDys={modeDys}>
          <ConsigneLue consigne={{ texte: accueil }} rangDuMotPrononce={rangDuMotPrononceDans(accueil)} />
        </BulleDuPersonnage>
      </div>
      {message && <p className="message-erreur" role="status">{message}</p>}
      <button type="button" onClick={onSeanceComplete}>Leçon et tous les jeux</button>
      <p id="choix-d-un-jeu">Ou choisis un seul jeu :</p>
      <ul className="exercices-proposes" aria-labelledby="choix-d-un-jeu">
        {page.exercices.map(({ position, titre, libelleDuType }) => (
          <li key={position}>
            <button type="button" data-testid="exercice-propose" onClick={() => onUnExercice(position)}>
              <span className="titre-de-l-exercice">{titre}</span>
              {titre !== libelleDuType && <span className="libelle-du-type">{libelleDuType}</span>}
            </button>
          </li>
        ))}
      </ul>
      <PassagePourLesAdultes passage={page.passagePourLesAdultes} />
    </section>
  );
}
