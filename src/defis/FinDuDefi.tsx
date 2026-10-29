import { useEffect, useRef, useState } from "react";
import type { DefiReleve, SeanceDeDefi } from "@domain/apprentissage";
import { defiReleveParLaSeance, parolesDeFinDeDefi, type Univers } from "@domain/motivation";
import { Confettis } from "../celebration/index.ts";
import { retenirLesQuestionsRatees } from "../revision/copie-de-la-file-sur-l-appareil.ts";
import type { Personnage } from "../revision/useDeroulementDeRevision.ts";
import { messageDeSauvegarde } from "../seance/fin-de-seance/useSauvegardeDeLaSeance.ts";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { ParoleDuGuide } from "../test-de-depart/ParoleDuGuide.tsx";
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

/**
 * La fin du défi : le défi est relevé (avec ou sans erreurs), sans étoile ni récompense de la cabane. La première fois il est annoncé
 * et fêté ; rejoué, il ne l'est plus. Les questions ratées entrent dans la file de révision de l'appareil, puis le défi est envoyé
 * au serveur en arrière-plan.
 */
export function FinDuDefi({ seance, prenom, personnage, univers, relevesAvant, onMonParcours, onAccueil }: Props) {
  const { dire, faireSilence, reecouter } = personnage;
  const lancee = useRef(false);
  const dite = useRef(false);
  const affichee = useRef(true);
  const [issue, setIssue] = useState<IssueDuDefi | undefined>();
  const [numero, setNumero] = useState(0);
  const [message, setMessage] = useState<string | undefined>();
  const parcours = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (lancee.current) return;
    lancee.current = true;
    const maintenant = new Date();
    const jour = jourDuNavigateur(maintenant);
    const terminee = seance.terminer(maintenant, jour);
    const releve = { matiere: terminee.defi.matiere, niveau: terminee.defi.niveau, numero: terminee.defi.numero };
    retenirLesQuestionsRatees(terminee.enfant, terminee.questionsRatees, jour, maintenant);
    void relevesAvant
      .catch(() => defisRelevesDeLAppareil(terminee.enfant))
      .then((avant) => {
        retenirLesDefisReleves(terminee.enfant, [releve]);
        setNumero(releve.numero);
        setIssue(defiReleveParLaSeance(avant, releve));
      });
    void sauvegarderLeDefi(seance.aEnregistrer()).then((sauvegarde) => setMessage(messageDeSauvegarde(sauvegarde)));
  }, [seance, relevesAvant]);

  useEffect(() => {
    if (dite.current || !issue || !affichee.current) return;
    dite.current = true;
    void dire({
      texte: parolesDeFinDeDefi({ prenom, numeroDuDefi: numero, dejaReleve: issue.annonce === undefined }),
      nature: "felicitation",
      humeur: "applaudit",
      effetsAvant: [issue.effetSonore],
    });
  }, [issue, prenom, numero, dire]);

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
      {issue && <Confettis />}
      <ParoleDuGuide personnage={personnage} univers={univers} onReecouter={reecouter} />
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
