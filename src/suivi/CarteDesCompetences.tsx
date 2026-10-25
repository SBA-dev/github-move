import type { CarteDesCompetences as Carte, EtatDeLaSection, LigneDeLaCarte } from "@domain/accompagnement";
import { BlocReplie } from "./BlocReplie.tsx";
import { libelleDeLaMatiere } from "./libelle-de-la-matiere.ts";

const LIBELLES_DES_ETATS: Readonly<Record<EtatDeLaSection, string>> = {
  acquise: "acquise",
  enCours: "en cours",
  aFaire: "à faire",
  pasEncoreDeLecon: "pas encore de leçon",
};

const ETATS: readonly EtatDeLaSection[] = ["acquise", "enCours", "aFaire", "pasEncoreDeLecon"];

function LigneDeLaCarte({ ligne }: { readonly ligne: LigneDeLaCarte }) {
  return (
    <li data-testid="ligne-de-la-carte" data-section={ligne.section} data-etat={ligne.etat}>
      <span className="intitule">{ligne.intitule}</span> : <span className="etat">{LIBELLES_DES_ETATS[ligne.etat]}</span>
      {ligne.titresDesLecons.length > 0 && (
        <ul className="lecons-de-la-ligne">
          {ligne.titresDesLecons.map((titre) => <li key={titre}>{titre}</li>)}
        </ul>
      )}
    </li>
  );
}

/** La carte des compétences du niveau de l'enfant : légende, puis matières, domaines et sections, dans l'ordre du programme. */
export function CarteDesCompetences({ carte }: { readonly carte: Carte }) {
  return (
    <BlocReplie titre={`Carte des compétences du programme (${carte.niveau.valeur})`}>
      <ul className="legende-de-la-carte" data-testid="legende-de-la-carte">
        {ETATS.map((etat) => (
          <li key={etat} data-etat={etat}>{LIBELLES_DES_ETATS[etat]} ({carte.legende[etat]})</li>
        ))}
      </ul>
      {carte.matieres.map(({ matiere, domaines }) => (
        <section key={matiere} className="matiere-de-la-carte" data-testid="matiere-de-la-carte" data-matiere={matiere}>
          <h5>{libelleDeLaMatiere(matiere)}</h5>
          {domaines.map(({ domaine, lignes }) => (
            <section key={domaine} data-testid="domaine-de-la-carte">
              <h6>{domaine}</h6>
              <ul className="lignes-de-la-carte">
                {lignes.map((ligne) => <LigneDeLaCarte key={ligne.section} ligne={ligne} />)}
              </ul>
            </section>
          ))}
        </section>
      ))}
    </BlocReplie>
  );
}
