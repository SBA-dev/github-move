import { useEffect, useRef, useState } from "react";
import { leconSuivanteDansLeParcours, type Seance } from "@domain/apprentissage";
import { pageDeLaLecon } from "@domain/catalogue";
import { annonceDeLObjetRecu, calculsReussis, type MeilleuresEtoilesDuProfil, type ObjetDeLaCabane, titreDeLAnnonce } from "@domain/motivation";
import { niveauDuProfil } from "../../parcours/index.ts";
import { lireLEtatDuTestDeDepart } from "../../test-de-depart/etat-du-test-de-depart.ts";
import { chargerToutesLesLecons } from "../bibliotheque.ts";
import { EtoilesDessinees } from "./EtoilesDessinees.tsx";
import { Etincelles } from "./Etincelles.tsx";
import { lireLesMeilleuresEtoilesDuProfil } from "./meilleures-etoiles-du-profil.ts";
import { etoilesSurTrois } from "./texte-des-etoiles.ts";
import { useObjetRecuParLaSeance } from "./useObjetRecuParLaSeance.ts";
import { useSauvegardeDeLaSeance } from "./useSauvegardeDeLaSeance.ts";

type Suivante = { readonly id: string; readonly titre: string };

type Props = {
  readonly seance: Seance;
  /** Niveau du profil en cours : la leçon suivante se cherche dans le parcours de ce niveau. */
  readonly niveau: string;
  /** Fait dire au personnage guide ses paroles de fin ; sans étoiles (fluence seule), il a déjà tout dit. */
  readonly onDireLaFin: (etoiles: number | undefined, objetRecu: ObjetDeLaCabane | undefined) => void;
  /** Les meilleures étoiles du profil lues au lancement de la séance, avant que celle-ci ne les change ; `undefined` si elles n'ont pas pu être lues. */
  readonly meilleuresEtoilesAvant: Promise<MeilleuresEtoilesDuProfil | undefined>;
  readonly onRejouer: () => void;
  readonly onLeconSuivante: (leconId: string) => void;
  readonly onAccueil: () => void;
};

/** Sans bibliothèque (hors ligne, pas encore en cache), l'écran de fin reste valable : il n'annonce simplement pas de leçon suivante. */
function bibliothequeIndisponible(): void {}

function useLeconSuivante(seance: Seance, niveau: string): Suivante | undefined {
  const [suivante, setSuivante] = useState<Suivante | undefined>();
  const { enfant, lecon: leconId } = seance;
  useEffect(() => {
    const niveauDeLEnfant = niveauDuProfil(niveau);
    if (!niveauDeLEnfant) return;
    let annule = false;
    void Promise.all([
      chargerToutesLesLecons(),
      lireLesMeilleuresEtoilesDuProfil(enfant),
      lireLEtatDuTestDeDepart(enfant),
    ]).then(([lecons, meilleuresEtoiles, testDeDepart]) => {
      const entrees = {
        lecons,
        niveau: niveauDeLEnfant,
        meilleuresEtoiles,
        leconsReussiesAuTestDeDepart: testDeDepart.leconsReussies,
      };
      const idSuivante = leconSuivanteDansLeParcours(entrees, leconId);
      const prochaine = lecons.find((lecon) => lecon.id === idSuivante);
      if (!annule && prochaine) setSuivante({ id: prochaine.id, titre: pageDeLaLecon(prochaine).titre });
    }).catch(bibliothequeIndisponible);
    return () => {
      annule = true;
    };
  }, [enfant, leconId, niveau]);
  return suivante;
}

/** La fin de la séance : étoiles gagnées (dessinées et écrites), paroles du personnage guide, et la suite à choisir. */
export function EcranDeFin({ seance, niveau, onDireLaFin, meilleuresEtoilesAvant, onRejouer, onLeconSuivante, onAccueil }: Props) {
  const { terminee, message } = useSauvegardeDeLaSeance(seance);
  const suivante = useLeconSuivante(seance, niveau);
  const { pret, objet } = useObjetRecuParLaSeance(
    meilleuresEtoilesAvant,
    seance.lecon,
    terminee !== undefined,
    terminee?.etoiles,
  );
  const accueil = useRef<HTMLButtonElement>(null);
  const dite = useRef(false);
  useEffect(() => {
    accueil.current?.focus();
    if (dite.current || terminee === undefined || !pret) return;
    dite.current = true;
    onDireLaFin(terminee.etoiles, objet);
  }, [terminee, pret, objet, onDireLaFin]);

  const etoiles = terminee?.etoiles;
  const scores = Object.entries(terminee?.scoresDeFluence ?? {});
  return (
    <div className="fin-de-seance" data-testid="fin-de-seance">
      <Etincelles />
      {etoiles !== undefined && (
        <>
          <EtoilesDessinees nombre={etoiles} />
          <p className="etoiles-gagnees" data-testid="etoiles-gagnees">{etoilesSurTrois(etoiles)}</p>
        </>
      )}
      <div className="pour-la-cabane" role="status" data-testid="annonce-de-la-cabane">
        {objet && (
          <>
            <strong>{titreDeLAnnonce()}</strong>
            <p>{annonceDeLObjetRecu(objet)}</p>
          </>
        )}
      </div>
      {scores.length > 0 && (
        <ul className="scores-de-fluence" aria-label="Scores de fluence" data-testid="scores-de-fluence">
          {scores.map(([exercice, score]) => (
            <li key={exercice} data-testid="score-de-fluence" data-score={score}>
              {exercice} : {calculsReussis(score)}
            </li>
          ))}
        </ul>
      )}
      {suivante && <p data-testid="ensuite">Ensuite : {suivante.titre}</p>}
      <div className="actions-de-fin">
        {suivante && <button type="button" onClick={() => onLeconSuivante(suivante.id)}>Leçon suivante</button>}
        <button type="button" ref={accueil} onClick={onAccueil}>Accueil</button>
        <button type="button" onClick={onRejouer}>Rejouer</button>
      </div>
      <p className="message-erreur" role="status" data-testid="sauvegarde">{message}</p>
    </div>
  );
}
