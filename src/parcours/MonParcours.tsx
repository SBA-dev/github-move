import { type KeyboardEvent, useEffect, useRef } from "react";
import { type LeconReussieDUneClasseAuDessus, matieresDuParcours, type Parcours, parcoursDeLaMatiere } from "@domain/apprentissage";
import type { CodeDeMatiere, Matiere, Niveau } from "@domain/catalogue";
import type { ProfilEnCours } from "@domain/famille";
import {
  annonceDeLaLecon,
  annonceDeLaLeconDUneClasseAuDessus, AUCUNE_LECON_POUR_LA_CLASSE, compteurDuParcours, libelleDeLEtat, libelleDeLOnglet,
  titreDesLeconsDejaReussies,
} from "./textes-du-parcours.ts";
import { niveauDuProfil } from "./niveau-du-profil.ts";
import { type LecturesDuParcours, useLecturesDuParcours } from "./useLecturesDuParcours.ts";

type Props = {
  readonly profil: ProfilEnCours;
  /** La dernière matière choisie pendant l'utilisation en cours. */
  readonly matiereChoisie: CodeDeMatiere | undefined;
  readonly onChoisirLaMatiere: (matiere: CodeDeMatiere) => void;
  readonly onOuvrirLaLecon: (leconId: string) => void;
};

function matiereOuverte(matieres: readonly Matiere[], choisie: CodeDeMatiere | undefined): Matiere | undefined {
  const parCode = (code: CodeDeMatiere) => matieres.find((matiere) => matiere.code === code);
  return (choisie && parCode(choisie)) ?? parCode("francais") ?? matieres[0];
}

/** L'écran « Mon parcours » : les leçons du niveau de l'enfant, matière par matière. Il n'affiche que ce que le domaine calcule. */
export function MonParcours({ profil, matiereChoisie, onChoisirLaMatiere, onOuvrirLaLecon }: Props) {
  const lectures = useLecturesDuParcours(profil.id);
  const niveau = niveauDuProfil(profil.niveau);
  return (
    <section className="mon-parcours" aria-labelledby="titre-de-mon-parcours">
      <h2 id="titre-de-mon-parcours">Mon parcours</h2>
      {lectures === undefined && <p role="status">Chargement du parcours…</p>}
      {lectures !== undefined && niveau === undefined && <p>{AUCUNE_LECON_POUR_LA_CLASSE}</p>}
      {lectures !== undefined && niveau !== undefined && (
        <ParcoursDuNiveau
          lectures={lectures}
          niveau={niveau}
          matiereChoisie={matiereChoisie}
          onChoisirLaMatiere={onChoisirLaMatiere}
          onOuvrirLaLecon={onOuvrirLaLecon}
        />
      )}
    </section>
  );
}

type PropsDuNiveau = Omit<Props, "profil"> & { readonly lectures: LecturesDuParcours; readonly niveau: Niveau };

function ParcoursDuNiveau({ lectures, niveau, matiereChoisie, onChoisirLaMatiere, onOuvrirLaLecon }: PropsDuNiveau) {
  const entrees = { ...lectures, niveau };
  const matieres = matieresDuParcours(entrees);
  const ouverte = matiereOuverte(matieres, matiereChoisie);
  if (!ouverte) return <p>{AUCUNE_LECON_POUR_LA_CLASSE}</p>;
  const parcours = parcoursDeLaMatiere(entrees, ouverte);
  return (
    <>
      <OngletsDesMatieres matieres={matieres} ouverte={ouverte.code} onChoisir={onChoisirLaMatiere} />
      <div role="tabpanel" id="parcours-de-la-matiere" aria-labelledby={`onglet-${ouverte.code}`} className="parcours-de-la-matiere">
        <h3 data-testid="titre-du-parcours">{ouverte.libelle} · {niveau.valeur}</h3>
        <LeconsDuParcours parcours={parcours} onOuvrirLaLecon={onOuvrirLaLecon} />
        <BlocsDesLeconsDejaReussies lecons={parcours.leconsReussiesDesClassesAuDessus} onOuvrirLaLecon={onOuvrirLaLecon} />
      </div>
    </>
  );
}

type PropsDesOnglets = {
  readonly matieres: readonly Matiere[];
  readonly ouverte: CodeDeMatiere;
  readonly onChoisir: (matiere: CodeDeMatiere) => void;
};

function OngletsDesMatieres({ matieres, ouverte, onChoisir }: PropsDesOnglets) {
  const onglets = useRef(new Map<CodeDeMatiere, HTMLButtonElement>());
  const choisir = (matiere: Matiere | undefined) => {
    if (!matiere) return;
    onChoisir(matiere.code);
    onglets.current.get(matiere.code)?.focus();
  };
  const surUneTouche = (evenement: KeyboardEvent) => {
    const rang = matieres.findIndex((matiere) => matiere.code === ouverte);
    const voisine = { ArrowRight: 1, ArrowLeft: -1 }[evenement.key];
    if (voisine !== undefined) choisir(matieres[(rang + voisine + matieres.length) % matieres.length]);
    else if (evenement.key === "Home") choisir(matieres[0]);
    else if (evenement.key === "End") choisir(matieres[matieres.length - 1]);
    else return;
    evenement.preventDefault();
  };
  return (
    <div role="tablist" aria-label="Matières" className="onglets-des-matieres" onKeyDown={surUneTouche}>
      {matieres.map((matiere) => (
        <button
          key={matiere.code}
          type="button"
          role="tab"
          id={`onglet-${matiere.code}`}
          aria-selected={matiere.code === ouverte}
          aria-controls="parcours-de-la-matiere"
          tabIndex={matiere.code === ouverte ? 0 : -1}
          ref={(onglet) => {
            if (onglet) onglets.current.set(matiere.code, onglet);
            else onglets.current.delete(matiere.code);
          }}
          onClick={() => onChoisir(matiere.code)}
        >
          {libelleDeLOnglet(matiere.code)}
        </button>
      ))}
    </div>
  );
}

function defilerJusqua(element: HTMLElement | null): void {
  const sansAnimation = matchMedia("(prefers-reduced-motion: reduce)").matches;
  element?.scrollIntoView({ block: "nearest", behavior: sansAnimation ? "auto" : "smooth" });
}

type PropsDesLecons = { readonly parcours: Parcours; readonly onOuvrirLaLecon: (leconId: string) => void };

function LeconsDuParcours({ parcours, onOuvrirLaLecon }: PropsDesLecons) {
  const prochaine = useRef<HTMLLIElement>(null);
  const { prochaineLecon } = parcours;
  useEffect(() => defilerJusqua(prochaine.current), [prochaineLecon]);
  return (
    <>
      <div className="progression-du-parcours">
        <progress value={parcours.nombreDeLeconsReussies} max={parcours.nombreDeLecons} aria-hidden="true" />
        <p data-testid="compteur-du-parcours">{compteurDuParcours(parcours.nombreDeLeconsReussies, parcours.nombreDeLecons)}</p>
      </div>
      <ol className="lecons-du-parcours">
        {parcours.lecons.map((lecon) => (
          <li key={lecon.lecon} ref={lecon.lecon === prochaineLecon ? prochaine : undefined}>
            <button
              type="button"
              className="lecon-du-parcours"
              data-testid="lecon-du-parcours"
              data-etat={lecon.etat.genre}
              aria-label={annonceDeLaLecon(lecon)}
              onClick={() => onOuvrirLaLecon(lecon.lecon)}
            >
              <span className="place-de-la-lecon" data-testid="place-de-la-lecon">Leçon {lecon.place}</span>
              <span className="titre-de-la-lecon">{lecon.titre}</span>
              <span className="etat-de-la-lecon" data-testid="etat-de-la-lecon" aria-hidden="true">
                {lecon.etat.genre === "reussie" && <span className="etoiles-de-la-lecon">{"★".repeat(lecon.etat.etoiles.nombre)} ✓</span>}
                {lecon.etat.genre === "reussieAuTestDeDepart" && <span className="etoiles-de-la-lecon">✓ {libelleDeLEtat(lecon)}</span>}
                {lecon.etat.genre !== "reussie" && lecon.etat.genre !== "reussieAuTestDeDepart" && libelleDeLEtat(lecon)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}

type PropsDesBlocs = {
  readonly lecons: readonly LeconReussieDUneClasseAuDessus[];
  readonly onOuvrirLaLecon: (leconId: string) => void;
};

function parNiveau(lecons: readonly LeconReussieDUneClasseAuDessus[]): ReadonlyMap<string, LeconReussieDUneClasseAuDessus[]> {
  const groupes = new Map<string, LeconReussieDUneClasseAuDessus[]>();
  for (const lecon of lecons) groupes.set(lecon.niveau.valeur, [...(groupes.get(lecon.niveau.valeur) ?? []), lecon]);
  return groupes;
}

/** Les leçons déjà réussies dans une classe au-dessus : hors compteur, à rejouer si l'enfant le souhaite. */
function BlocsDesLeconsDejaReussies({ lecons, onOuvrirLaLecon }: PropsDesBlocs) {
  return [...parNiveau(lecons)].map(([niveau, duNiveau]) => {
    const idDuTitre = `titre-deja-reussies-${niveau}`;
    return (
      <section key={niveau} className="lecons-deja-reussies" aria-labelledby={idDuTitre}>
        <h4 id={idDuTitre}>{titreDesLeconsDejaReussies(niveau)}</h4>
        <ul className="lecons-du-parcours">
          {duNiveau.map((lecon) => (
            <li key={lecon.lecon}>
              <button
                type="button"
                className="lecon-du-parcours"
                data-testid="lecon-deja-reussie"
                data-etat="reussie"
                aria-label={annonceDeLaLeconDUneClasseAuDessus(lecon)}
                onClick={() => onOuvrirLaLecon(lecon.lecon)}
              >
                <span className="place-de-la-lecon" aria-hidden="true">{lecon.niveau.valeur}</span>
                <span className="titre-de-la-lecon" aria-hidden="true">{lecon.titre}</span>
                <span className="etat-de-la-lecon" aria-hidden="true">
                  <span className="etoiles-de-la-lecon">{"★".repeat(lecon.etoiles?.nombre ?? 0)} ✓</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  });
}
