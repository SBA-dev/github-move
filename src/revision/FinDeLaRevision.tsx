import { useEffect, useRef, useState } from "react";
import type { SeanceDeRevision } from "@domain/apprentissage";
import { parolesDeFinDeRevision, type Univers } from "@domain/motivation";
import { messageDeSauvegarde } from "../seance/fin-de-seance/useSauvegardeDeLaSeance.ts";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { ParoleDuGuide } from "../test-de-depart/ParoleDuGuide.tsx";
import { enregistrerLaRevisionSurLAppareil } from "./copie-de-la-file-sur-l-appareil.ts";
import { retenirLaSeanceDeRevisionTerminee } from "./seances-de-revision-terminees-pendant-l-utilisation.ts";
import { sauvegarderLaSeanceDeRevision } from "./sauvegarde-de-la-seance-de-revision.ts";
import type { Personnage } from "./useDeroulementDeRevision.ts";

type Props = {
  readonly seance: SeanceDeRevision;
  readonly prenom: string;
  readonly personnage: Personnage;
  readonly univers: Univers;
  readonly onAccueil: () => void;
};

/**
 * La fin de la séance de révision : pas d'étoiles, le personnage guide dit combien d'erreurs s'effacent.
 * La copie de la file est mise à jour tout de suite par le domaine, puis la séance est envoyée au serveur en arrière-plan.
 */
export function FinDeLaRevision({ seance, prenom, personnage, univers, onAccueil }: Props) {
  const { dire, faireSilence, reecouter } = personnage;
  const lancee = useRef(false);
  const affichee = useRef(true);
  const [pret, setPret] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const accueil = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (lancee.current) return;
    lancee.current = true;
    const maintenant = new Date();
    const terminee = seance.terminer(maintenant, jourDuNavigateur(maintenant));
    enregistrerLaRevisionSurLAppareil(terminee.enfant, terminee.resultats, terminee.jour, terminee.termineeLe);
    retenirLaSeanceDeRevisionTerminee(terminee.enfant, terminee.jour.toString(), terminee.id);
    setPret(true);
    if (affichee.current) {
      void dire({
        texte: parolesDeFinDeRevision({ prenom, questionsJustes: terminee.nombreDeQuestionsJustes }),
        nature: "felicitation",
        humeur: "applaudit",
      });
    }
    void sauvegarderLaSeanceDeRevision(seance.aEnregistrer()).then((sauvegarde) => setMessage(messageDeSauvegarde(sauvegarde)));
  }, [seance, prenom, dire]);

  useEffect(() => {
    affichee.current = true;
    return () => {
      affichee.current = false;
      faireSilence();
    };
  }, [faireSilence]);
  useEffect(() => {
    if (pret) accueil.current?.focus();
  }, [pret]);

  return (
    <div className="fin-de-seance fin-de-la-revision" data-testid="fin-de-la-revision">
      <ParoleDuGuide personnage={personnage} univers={univers} onReecouter={reecouter} />
      {pret && (
        <div className="actions-de-fin">
          <button type="button" className="action-principale" ref={accueil} onClick={onAccueil}>Accueil</button>
        </div>
      )}
      <p className="message-erreur" role="status" data-testid="sauvegarde">{message}</p>
    </div>
  );
}
