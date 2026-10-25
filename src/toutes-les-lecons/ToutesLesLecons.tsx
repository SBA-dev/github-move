import { type ChangeEvent, useId } from "react";
import { type ChoixDuFiltre, choixDuFiltre, type EntreesDuParcours, toutesLesLecons } from "@domain/apprentissage";
import type { CodeDeMatiere } from "@domain/catalogue";
import type { ProfilEnCours } from "@domain/famille";
import {
  annonceDeLaLeconDeToutesLesLecons,
  AUCUNE_LECON_POUR_LA_CLASSE,
  BoutonDeLecon,
  libelleDeLOnglet,
  nombreDeLecons,
  SectionDesClassesDAvant,
  useLecturesDuParcours,
} from "../parcours/index.ts";
import { niveauDuProfil } from "../parcours/niveau-du-profil.ts";
import type { ChoixEnCours } from "./choix-de-toutes-les-lecons.ts";
import { AUCUNE_LECON_POUR_CE_CHOIX, TOUS_LES_NIVEAUX, TOUTES_LES_MATIERES } from "./textes-de-toutes-les-lecons.ts";

type Props = {
  readonly profil: ProfilEnCours;
  readonly choix: ChoixEnCours;
  readonly onOuvrirLaLecon: (leconId: string) => void;
};

/** L'écran « Toutes les leçons » : la classe de l'enfant et ce qu'il peut voir au-dessus, puis les classes d'avant. Il n'affiche que ce que le domaine calcule. */
export function ToutesLesLecons({ profil, choix, onOuvrirLaLecon }: Props) {
  const lectures = useLecturesDuParcours(profil.id);
  const niveau = niveauDuProfil(profil.niveau);
  return (
    <section className="toutes-les-lecons" aria-labelledby="titre-de-toutes-les-lecons">
      <h2 id="titre-de-toutes-les-lecons">Toutes les leçons</h2>
      {lectures === undefined && <p role="status">Chargement des leçons…</p>}
      {lectures !== undefined && niveau === undefined && <p>{AUCUNE_LECON_POUR_LA_CLASSE}</p>}
      {lectures !== undefined && niveau !== undefined && (
        <LeconsDuNiveau entrees={{ ...lectures, niveau }} choix={choix} onOuvrirLaLecon={onOuvrirLaLecon} />
      )}
    </section>
  );
}

type PropsDuNiveau = Omit<Props, "profil"> & { readonly entrees: EntreesDuParcours };

function LeconsDuNiveau({ entrees, choix, onOuvrirLaLecon }: PropsDuNiveau) {
  const { choix: choisi } = choix;
  const proposes = choixDuFiltre(entrees);
  const matiere = proposes.matieres.find(({ code }) => code === choisi.matiere);
  const niveau = proposes.niveaux.find(({ valeur }) => valeur === choisi.niveau);
  const { lecons, leconsDesClassesDAvant } = toutesLesLecons(entrees, { matiere, niveau });
  const nombreDansLaSection = leconsDesClassesDAvant.reduce((somme, classe) => somme + classe.lecons.length, 0);
  const nombre = lecons.length + nombreDansLaSection;
  const matiereDeLaLecon = new Map(entrees.lecons.map((lecon) => [lecon.id, lecon.matiere.code]));
  const classeDAvantChoisie = niveau !== undefined && entrees.niveau.estAuDessusDe(niveau);
  return (
    <>
      <ListesDeChoix
        proposes={proposes}
        matiere={matiere?.code}
        niveau={niveau?.valeur}
        onChoisirLaMatiere={choix.choisirLaMatiere}
        onChoisirLeNiveau={choix.choisirLeNiveau}
      />
      <p role="status" className="nombre-de-lecons" data-testid="nombre-de-lecons">
        {nombre === 0 ? AUCUNE_LECON_POUR_CE_CHOIX : nombreDeLecons(nombre)}
      </p>
      {lecons.length > 0 && (
        <ul className="lecons-du-parcours">
          {lecons.map((lecon) => (
            <li key={lecon.lecon}>
              <BoutonDeLecon
                titre={lecon.titre}
                repere={`${lecon.niveau.valeur} · ${libelleDeLOnglet(lecon.matiere.code)}`}
                etat={lecon.etat}
                annonce={annonceDeLaLeconDeToutesLesLecons(lecon, lecon.matiere.code)}
                testid="lecon-de-toutes-les-lecons"
                onOuvrir={() => onOuvrirLaLecon(lecon.lecon)}
              />
            </li>
          ))}
        </ul>
      )}
      {nombreDansLaSection > 0 && (
        <SectionDesClassesDAvant
          nombre={nombreDansLaSection}
          deplie={choisi.sectionDesClassesDAvantDeployee || classeDAvantChoisie}
          onBasculer={choix.basculerLaSection}
        >
          {leconsDesClassesDAvant.map((classe) => (
            <div key={classe.niveau.valeur} className="lecons-d-une-classe-d-avant">
              <h4>{classe.niveau.valeur}</h4>
              <ul className="lecons-du-parcours">
                {classe.lecons.map((lecon) => {
                  const matiereDeLecon = matiereDeLaLecon.get(lecon.lecon);
                  if (!matiereDeLecon) return null;
                  return (
                    <li key={lecon.lecon}>
                      <BoutonDeLecon
                        titre={lecon.titre}
                        repere={libelleDeLOnglet(matiereDeLecon)}
                        etat={lecon.etat}
                        annonce={annonceDeLaLeconDeToutesLesLecons(lecon, matiereDeLecon)}
                        testid="lecon-des-classes-d-avant"
                        onOuvrir={() => onOuvrirLaLecon(lecon.lecon)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </SectionDesClassesDAvant>
      )}
    </>
  );
}

type PropsDesListes = {
  readonly proposes: ChoixDuFiltre;
  readonly matiere: CodeDeMatiere | undefined;
  readonly niveau: string | undefined;
  readonly onChoisirLaMatiere: (matiere: CodeDeMatiere | undefined) => void;
  readonly onChoisirLeNiveau: (niveau: string | undefined) => void;
};

function ListesDeChoix({ proposes, matiere, niveau, onChoisirLaMatiere, onChoisirLeNiveau }: PropsDesListes) {
  const idDeLaMatiere = useId();
  const idDuNiveau = useId();
  const surLaMatiere = (evenement: ChangeEvent<HTMLSelectElement>) =>
    onChoisirLaMatiere(proposes.matieres.find(({ code }) => code === evenement.target.value)?.code);
  const surLeNiveau = (evenement: ChangeEvent<HTMLSelectElement>) =>
    onChoisirLeNiveau(proposes.niveaux.find(({ valeur }) => valeur === evenement.target.value)?.valeur);
  return (
    <div className="choix-des-lecons">
      <label htmlFor={idDeLaMatiere}>Matière</label>
      <select id={idDeLaMatiere} value={matiere ?? ""} onChange={surLaMatiere}>
        <option value="">{TOUTES_LES_MATIERES}</option>
        {proposes.matieres.map(({ code }) => <option key={code} value={code}>{libelleDeLOnglet(code)}</option>)}
      </select>
      <label htmlFor={idDuNiveau}>Niveau</label>
      <select id={idDuNiveau} value={niveau ?? ""} onChange={surLeNiveau}>
        <option value="">{TOUS_LES_NIVEAUX}</option>
        {proposes.niveaux.map(({ valeur }) => <option key={valeur} value={valeur}>{valeur}</option>)}
      </select>
    </div>
  );
}
