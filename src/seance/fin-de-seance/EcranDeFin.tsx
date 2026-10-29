import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Confettis } from "../../celebration/index.ts";
import { mouvementsReduits } from "../../transitions/index.ts";
import { leconSuivanteEnFinDeSeance, type Seance } from "@domain/apprentissage";
import { pageDeLaLecon } from "@domain/catalogue";
import {
  annonceDeLObjetRecu,
  calculsReussis,
  type MeilleuresEtoilesDuProfil,
  type QueteDuJour,
  titreDeLAnnonce,
  titreDeLAnnonceDuBadge,
  type Univers,
} from "@domain/motivation";
import { AnnonceDeLaQueteAccomplie } from "../../accueil/AnnonceDeLaQueteAccomplie.tsx";
import { useQueteAccomplieParLaSeance } from "../../accueil/useQueteAccomplieParLaSeance.ts";
import { AnnonceDuNouvelEpisode } from "../../histoire/AnnonceDuNouvelEpisode.tsx";
import { useEpisodeOuvertParLaSeance } from "../../histoire/useEpisodeOuvertParLaSeance.ts";
import { niveauDuProfil } from "../../parcours/index.ts";
import { lireLEtatDuTestDeDepart } from "../../test-de-depart/etat-du-test-de-depart.ts";
import { chargerToutesLesLecons } from "../bibliotheque.ts";
import { AnnonceDeLaTenue } from "./AnnonceDeLaTenue.tsx";
import { EtoilesGagnees } from "./EtoilesGagnees.tsx";
import { lireLesMeilleuresEtoilesDuProfil } from "./meilleures-etoiles-du-profil.ts";
import { annonceDesEtoiles, etoilesSurTrois } from "./texte-des-etoiles.ts";
import type { NouveautesDeFin } from "./nouveautes-de-fin.ts";
import { useBadgeGagneParLaSeance } from "./useBadgeGagneParLaSeance.ts";
import { useObjetRecuParLaSeance } from "./useObjetRecuParLaSeance.ts";
import { useTenueRecueParLaSeance } from "./useTenueRecueParLaSeance.ts";
import { useLeconAcquiseParLaSeance } from "./useLeconAcquiseParLaSeance.ts";
import { useSauvegardeDeLaSeance } from "./useSauvegardeDeLaSeance.ts";

type Suivante = { readonly id: string; readonly titre: string };

/** `suivante` est absente quand la fin de la séance ne propose aucune leçon. */
type LaSuite = { readonly suivante: Suivante | undefined };

type Props = {
  readonly seance: Seance;
  /** L'univers du profil : son personnage guide reçoit les tenues. */
  readonly univers: Univers;
  /** Niveau du profil en cours : la leçon suivante se cherche dans le parcours de ce niveau. */
  readonly niveau: string;
  /** Fait dire au personnage guide ses paroles de fin ; sans étoiles (fluence seule), il a déjà tout dit. */
  readonly onDireLaFin: (etoiles: number | undefined, nouveautes: NouveautesDeFin) => void;
  /** Les meilleures étoiles du profil lues au lancement de la séance, avant que celle-ci ne les change ; `undefined` si elles n'ont pas pu être lues. */
  readonly meilleuresEtoilesAvant: Promise<MeilleuresEtoilesDuProfil | undefined>;
  /** Le nombre de séances terminées lu au lancement de la séance, avant que celle-ci ne s'y ajoute ; `undefined` s'il n'a pas pu être lu. */
  readonly nombreDeSeancesAvant: Promise<number | undefined>;
  /** La quête du jour lue au lancement de la séance, avant que celle-ci ne la change ; `undefined` si elle n'a pas pu être lue. */
  readonly queteAvant: Promise<QueteDuJour | undefined>;
  /** Le prénom de l'enfant, pour la fête de la quête accomplie. */
  readonly prenom: string;
  readonly onRejouer: () => void;
  readonly onLireLEpisode: (numero: number) => void;
  readonly onLeconSuivante: (leconId: string) => void;
  readonly onToutesLesLecons: () => void;
  readonly onAccueil: () => void;
};

/** Sans bibliothèque (hors ligne, pas encore en cache), l'écran de fin reste valable : il ne dit rien de la suite. */
function bibliothequeIndisponible(): void {}

/** La suite de la séance : `undefined` tant qu'elle n'est pas connue (ou sans bibliothèque), pour ne proposer ni « Toutes les leçons » ni leçon suivante à tort. */
function useLaSuite(seance: Seance, niveau: string): LaSuite | undefined {
  const [suite, setSuite] = useState<LaSuite | undefined>();
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
      if (annule || lecons.length === 0) return;
      const idSuivante = leconSuivanteEnFinDeSeance(entrees, leconId);
      const prochaine = lecons.find((lecon) => lecon.id === idSuivante);
      setSuite({ suivante: prochaine && { id: prochaine.id, titre: pageDeLaLecon(prochaine).titre } });
    }).catch(bibliothequeIndisponible);
    return () => {
      annule = true;
    };
  }, [enfant, leconId, niveau]);
  return suite;
}

/** La fin de la séance : étoiles gagnées (dessinées et écrites), paroles du personnage guide, et la suite à choisir. */
export function EcranDeFin({ seance, univers, niveau, onDireLaFin, meilleuresEtoilesAvant, nombreDeSeancesAvant, queteAvant, prenom, onRejouer, onLireLEpisode, onLeconSuivante, onToutesLesLecons, onAccueil }: Props) {
  const { terminee, message } = useSauvegardeDeLaSeance(seance);
  const suite = useLaSuite(seance, niveau);
  const suivante = suite?.suivante;
  const { pret, objet } = useObjetRecuParLaSeance(
    meilleuresEtoilesAvant,
    seance.lecon,
    terminee !== undefined,
    terminee?.etoiles,
  );
  const { prete: tenuePrete, tenue } = useTenueRecueParLaSeance(
    meilleuresEtoilesAvant,
    seance.lecon,
    terminee !== undefined,
    terminee?.etoiles,
  );
  const { pret: badgePret, badge } = useBadgeGagneParLaSeance(
    meilleuresEtoilesAvant,
    seance.lecon,
    terminee !== undefined,
    terminee?.etoiles,
  );
  const { pret: acquisePret, acquise: leconAcquise } = useLeconAcquiseParLaSeance(
    meilleuresEtoilesAvant,
    seance.lecon,
    terminee !== undefined,
    terminee?.etoiles,
  );
  const { pret: episodePret, episode } = useEpisodeOuvertParLaSeance(nombreDeSeancesAvant, terminee !== undefined);
  const { prete: quetePrete, accomplie: queteAccomplie } = useQueteAccomplieParLaSeance(queteAvant, seance.enfant, niveau, terminee !== undefined);
  const accueil = useRef<HTMLButtonElement>(null);
  const dite = useRef(false);
  useEffect(() => {
    accueil.current?.focus();
  }, []);
  useEffect(() => {
    if (dite.current || terminee === undefined || !pret || !tenuePrete || !episodePret || !badgePret || !acquisePret || !quetePrete) return;
    dite.current = true;
    onDireLaFin(terminee.etoiles, { objet, tenue, episode, badge, leconAcquise, queteAccomplie });
  }, [terminee, pret, objet, tenuePrete, tenue, episodePret, episode, badgePret, badge, acquisePret, leconAcquise, quetePrete, queteAccomplie, onDireLaFin]);
  const [etoilesAffichees, setEtoilesAffichees] = useState(false);
  const afficherToutesLesEtoiles = useCallback(() => setEtoilesAffichees(true), []);

  const sansMouvement = mouvementsReduits();
  const etoiles = terminee?.etoiles;
  const scores = Object.entries(terminee?.scoresDeFluence ?? {});
  return (
    <motion.div
      className="fin-de-seance"
      data-testid="fin-de-seance"
      data-transition={sansMouvement ? "aucune" : "fondu"}
      initial={sansMouvement ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {terminee !== undefined && (etoiles === undefined || etoilesAffichees) && <Confettis />}
      {etoiles !== undefined && (
        <>
          <EtoilesGagnees nombre={etoiles} onToutesAffichees={afficherToutesLesEtoiles} />
          <p className="etoiles-gagnees" data-testid="etoiles-gagnees">{etoilesSurTrois(etoiles)}</p>
          <p className="visuellement-cache" aria-live="polite" data-testid="annonce-des-etoiles">
            {etoilesAffichees && etoiles > 0 ? annonceDesEtoiles(etoiles) : ""}
          </p>
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
      <AnnonceDeLaTenue univers={univers} tenue={tenue} />
      <AnnonceDuNouvelEpisode episode={episode} />
      <div className="pour-le-badge" role="status" data-testid="annonce-de-nouveau-badge">
        {badge && (
          <>
            <strong>{titreDeLAnnonceDuBadge()}</strong>
            <p>{badge.nom}</p>
          </>
        )}
      </div>
      <AnnonceDeLaQueteAccomplie prenom={prenom} accomplie={queteAccomplie} />
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
        {episode && <button type="button" onClick={() => onLireLEpisode(episode.numero)}>Lire l'épisode</button>}
        {suite && !suivante && <button type="button" onClick={onToutesLesLecons}>Toutes les leçons</button>}
      </div>
      <p className="message-erreur" role="status" data-testid="sauvegarde">{message}</p>
    </motion.div>
  );
}
