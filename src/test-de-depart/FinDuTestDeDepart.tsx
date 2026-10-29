import { useEffect, useRef, useState } from "react";
import { leconsNouvellementReussies, leconsReussiesAuTestDeDepart, type TestDeDepart } from "@domain/apprentissage";
import type { Lecon, Niveau } from "@domain/catalogue";
import { effetsSonoresDeLaFin, type Univers } from "@domain/motivation";
import { Confettis } from "../celebration/index.ts";
import { lireLesMeilleuresEtoilesDuProfil } from "../seance/fin-de-seance/meilleures-etoiles-du-profil.ts";
import { messageDeSauvegarde } from "../seance/fin-de-seance/useSauvegardeDeLaSeance.ts";
import { lireLEtatDuTestDeDepart } from "./etat-du-test-de-depart.ts";
import { ParoleDuGuide } from "./ParoleDuGuide.tsx";
import { remercierApresLeTestDeDepart } from "./paroles-du-test-de-depart.ts";
import { sauvegarderLeTestDeDepart } from "./sauvegarde-du-test-de-depart.ts";
import { retenirLeTestDeDepartFait } from "./tests-de-depart-faits-pendant-l-utilisation.ts";
import type { Personnage } from "./useDeroulementDuTestDeDepart.ts";

type Props = {
  readonly test: TestDeDepart;
  readonly prenom: string;
  readonly lecons: readonly Lecon[];
  readonly niveau: Niveau;
  readonly personnage: Personnage;
  readonly univers: Univers;
  readonly onVoirMonParcours: () => void;
};

/**
 * La fin du test de départ : le résultat est calculé par le domaine, retenu dans le navigateur (le parcours est à jour tout de suite),
 * puis envoyé au serveur en arrière-plan. Pas d'étoiles : le personnage guide dit combien de leçons il a cochées.
 */
export function FinDuTestDeDepart({ test, prenom, lecons, niveau, personnage, univers, onVoirMonParcours }: Props) {
  const { dire, faireSilence, reecouter } = personnage;
  const lancee = useRef(false);
  const affichee = useRef(true);
  const [pret, setPret] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const parcours = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (lancee.current) return;
    lancee.current = true;
    void (async () => {
      const terminee = test.terminer(new Date());
      const reussiesAuTest = leconsReussiesAuTestDeDepart(lecons, niveau, terminee.questions);
      const [meilleuresEtoiles, avant] = await Promise.all([
        lireLesMeilleuresEtoilesDuProfil(terminee.enfant),
        lireLEtatDuTestDeDepart(terminee.enfant),
      ]);
      const dejaReussies = new Set([...meilleuresEtoiles.keys(), ...avant.leconsReussies]);
      const nouvelles = leconsNouvellementReussies(reussiesAuTest, dejaReussies);
      retenirLeTestDeDepartFait(terminee.enfant, reussiesAuTest);
      setPret(true);
      if (affichee.current) {
        void dire({
          texte: remercierApresLeTestDeDepart(prenom, nouvelles.size),
          nature: "felicitation",
          humeur: "applaudit",
          effetsAvant: effetsSonoresDeLaFin({
            fin: "testDeDepart",
            leconAcquise: false,
            fluenceSeule: false,
            issueDuRecord: "aucunRecord",
            objetRecu: false,
            tenueRecue: false,
            episodeOuvert: false,
          }),
        });
      }
      setMessage(messageDeSauvegarde(await sauvegarderLeTestDeDepart(test.aEnregistrer(), reussiesAuTest)));
    })();
  }, [test, prenom, lecons, niveau, dire]);

  useEffect(() => {
    affichee.current = true;
    return () => {
      affichee.current = false;
      faireSilence();
    };
  }, [faireSilence]);
  useEffect(() => {
    if (pret) parcours.current?.focus();
  }, [pret]);

  return (
    <div className="fin-de-seance fin-du-test-de-depart" data-testid="fin-du-test-de-depart">
      {pret && <Confettis />}
      <ParoleDuGuide personnage={personnage} univers={univers} onReecouter={reecouter} />
      {pret && (
        <div className="actions-de-fin">
          <button type="button" className="action-principale" ref={parcours} onClick={onVoirMonParcours}>Voir mon parcours</button>
        </div>
      )}
      <p className="message-erreur" role="status" data-testid="sauvegarde">{message}</p>
    </div>
  );
}
