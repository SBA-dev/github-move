import type { EtoilesAffichees, LeconJouee, MentionDeClasse, TableauDesLeconsJouees } from "@domain/accompagnement";
import { BlocReplie } from "./BlocReplie.tsx";
import { libelleDeLaMatiere } from "./libelle-de-la-matiere.ts";

const LIBELLES_DES_MENTIONS: Readonly<Record<MentionDeClasse, string>> = {
  classePrecedente: "classe précédente",
  classeAuDessus: "classe au-dessus",
};

const SANS_VALEUR = "–";

function dateAffichee(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function Etoiles({ etoiles }: { readonly etoiles: EtoilesAffichees }) {
  if (etoiles.genre === "reussieAuTestDeDepart") return <span data-colonne="etoiles">réussie au test de départ</span>;
  if (etoiles.genre === "aucune") return <span data-colonne="etoiles">{SANS_VALEUR}</span>;
  return (
    <span data-colonne="etoiles" role="img" aria-label={`${etoiles.nombre} ${etoiles.nombre > 1 ? "étoiles" : "étoile"} sur 3`}>
      {"★".repeat(etoiles.nombre)}
    </span>
  );
}

function LigneDeLeconJouee({ lecon }: { readonly lecon: LeconJouee }) {
  return (
    <li className="lecon-jouee" data-testid="lecon-jouee">
      <strong data-colonne="lecon">{lecon.titre}</strong>
      <span data-colonne="matiere">{libelleDeLaMatiere(lecon.matiere)}</span>
      {lecon.mention && <span data-colonne="mention">{LIBELLES_DES_MENTIONS[lecon.mention]}</span>}
      <Etoiles etoiles={lecon.etoiles} />
      <span>
        Erreurs la dernière fois : <span data-colonne="erreurs">{lecon.erreursDeLaDerniereSeance ?? SANS_VALEUR}</span>
      </span>
      <span>
        Dernière séance : <span data-colonne="derniere-seance">{dateAffichee(lecon.derniereSeance)}</span>
      </span>
    </li>
  );
}

function ListeDeLeconsJouees({ lecons, testid }: { readonly lecons: readonly LeconJouee[]; readonly testid: string }) {
  return (
    <ul className="lecons-jouees" data-testid={testid}>
      {lecons.map((lecon) => <LigneDeLeconJouee key={lecon.lecon} lecon={lecon} />)}
    </ul>
  );
}

/** Les leçons jouées de la classe en cours, puis celles des autres classes à part, la plus récente d'abord. */
export function LeconsJouees({ tableau }: { readonly tableau: TableauDesLeconsJouees }) {
  const { deLaClasseEnCours, dAutresClasses } = tableau;
  return (
    <>
      <BlocReplie titre="Toutes les leçons jouées">
        {deLaClasseEnCours.length > 0 && <ListeDeLeconsJouees lecons={deLaClasseEnCours} testid="lecons-jouees" />}
        {dAutresClasses.length > 0 && (
          <section className="lecons-d-autres-classes" aria-labelledby="titre-des-autres-classes">
            <h5 id="titre-des-autres-classes">Leçons jouées dans d'autres classes</h5>
            <ListeDeLeconsJouees lecons={dAutresClasses} testid="lecons-jouees-d-autres-classes" />
          </section>
        )}
      </BlocReplie>
      {deLaClasseEnCours.length === 0 && <p data-testid="aucune-lecon-jouee">Pas encore de leçon jouée.</p>}
    </>
  );
}
