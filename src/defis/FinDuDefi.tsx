import { useEffect, useRef, useState } from "react";
import { type DefiReleve, releveDuDefi, type SeanceDeDefi } from "@domain/apprentissage";
import {
  type CelebrationDeLaFin,
  celebrationDeLaFin,
  defiReleveParLaSeance,
  parolesDeFinDeDefi,
  parolesDeFinDeGrandDefi,
  type Univers,
} from "@domain/motivation";
import { Confettis } from "../celebration/index.ts";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import { retenirLesQuestionsRatees } from "../revision/copie-de-la-file-sur-l-appareil.ts";
import type { Personnage } from "../revision/useDeroulementDeRevision.ts";
import { messageDeSauvegarde } from "../seance/fin-de-seance/useSauvegardeDeLaSeance.ts";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { ParoleDuGuide } from "../test-de-depart/ParoleDuGuide.tsx";
import { SceneDeCelebration } from "../univers/celebrations/index.ts";
import { defisRelevesDeLAppareil, retenirLesDefisReleves } from "./defis-releves-sur-l-appareil.ts";
import { sauvegarderLeDefi } from "./sauvegarde-du-defi.ts";

type IssueDuDefi = ReturnType<typeof defiReleveParLaSeance>;

type Props = {
  readonly seance: SeanceDeDefi;
  readonly prenom: string;
  readonly personnage: Personnage;
  readonly univers: Univers;
  /** Les défis déjà relevés, lus au lancement du défi, avant que celui-ci ne s'y ajoute. */
  readonly relevesAvant: Promise<readonly DefiReleve[]>;
  readonly onMonParcours: () => void;
  readonly onAccueil: () => void;
};

function parolesDeFin(releve: DefiReleve, prenom: string, dejaReleve: boolean): string {
  return releve.grandDefi === true
    ? parolesDeFinDeGrandDefi({ prenom, matiere: releve.matiere.code, dejaReleve })
    : parolesDeFinDeDefi({ prenom, numeroDuDefi: releve.numero, dejaReleve });
}

/**
 * La fin du défi : le défi est relevé (avec ou sans erreurs), sans étoile ni récompense de la cabane. La première fois il est annoncé
 * et fêté par la célébration de l'univers de l'enfant si elle existe ; sinon, comme rejoué, par la célébration commune (confettis).
 * Les questions ratées entrent dans la file de révision de l'appareil, puis le défi est envoyé au serveur en arrière-plan.
 */
export function FinDuDefi({ seance, prenom, personnage, univers, relevesAvant, onMonParcours, onAccueil }: Props) {
  const { dire, faireSilence, reecouter } = personnage;
  const lancee = useRef(false);
  const dite = useRef(false);
  const affichee = useRef(true);
  const [issue, setIssue] = useState<IssueDuDefi | undefined>();
  const [celebration, setCelebration] = useState<CelebrationDeLaFin | undefined>();
  const [releve, setReleve] = useState<DefiReleve | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const parcours = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (lancee.current) return;
    lancee.current = true;
    const maintenant = new Date();
    const jour = jourDuNavigateur(maintenant);
    const terminee = seance.terminer(maintenant, jour);
    const relevee = releveDuDefi(terminee.defi);
    retenirLesQuestionsRatees(terminee.enfant, terminee.questionsRatees, jour, maintenant);
    void relevesAvant
      .catch(() => defisRelevesDeLAppareil(terminee.enfant))
      .then((avant) => {
        retenirLesDefisReleves(terminee.enfant, [relevee]);
        setReleve(relevee);
        const issueDuDefi = defiReleveParLaSeance(avant, relevee);
        setCelebration(
          celebrationDeLaFin({ defiRelevePourLaPremiereFois: issueDuDefi.annonce !== undefined }, univers.cle, hasardDuNavigateur),
        );
        setIssue(issueDuDefi);
      });
    void sauvegarderLeDefi(seance.aEnregistrer()).then((sauvegarde) => setMessage(messageDeSauvegarde(sauvegarde)));
  }, [seance, relevesAvant, univers.cle]);

  useEffect(() => {
    if (dite.current || !issue || !releve || !affichee.current) return;
    dite.current = true;
    void dire({
      texte: parolesDeFin(releve, prenom, issue.annonce === undefined),
      nature: "felicitation",
      humeur: "applaudit",
      effetsAvant: [celebration?.sorte === "univers" ? celebration.celebration.musique : issue.effetSonore],
    });
  }, [issue, celebration, prenom, releve, dire]);

  useEffect(() => {
    affichee.current = true;
    return () => {
      affichee.current = false;
      faireSilence();
    };
  }, [faireSilence]);
  useEffect(() => {
    if (issue) parcours.current?.focus();
  }, [issue]);

  return (
    <div className="fin-de-seance fin-du-defi" data-testid="fin-du-defi">
      {celebration?.sorte === "commune" && <Confettis />}
      {celebration?.sorte === "univers" && <SceneDeCelebration celebration={celebration.celebration} />}
      <ParoleDuGuide
        personnage={personnage}
        univers={univers}
        onReecouter={reecouter}
        sansPersonnage={celebration?.sorte === "univers"}
      />
      <div className="pour-le-defi" role="status" data-testid="annonce-du-defi-releve">
        {issue?.annonce && <p>{issue.annonce}</p>}
      </div>
      {issue && (
        <div className="actions-de-fin">
          <button type="button" className="action-principale" ref={parcours} onClick={onMonParcours}>Mon parcours</button>
          <button type="button" onClick={onAccueil}>Accueil</button>
        </div>
      )}
      <p className="message-erreur" role="status" data-testid="sauvegarde">{message}</p>
    </div>
  );
}
