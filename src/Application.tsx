import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import type { EtatDeLEspaceParent } from "@domain/famille";
import type { CodeDeMatiere } from "@domain/catalogue";
import { universDe } from "@domain/motivation";
import { EcranDeConnexion, useConnexion } from "./connexion/index.ts";
import { ModeDys } from "./reglages/index.ts";
import { EnTete } from "./en-tete/EnTete.tsx";
import {
  AccueilDeLEnfant,
  ControleParental,
  EspaceParent,
  ProfilsDeLEspaceParent,
  QuiJoue,
  useAccesALEspaceParent,
  useProfilEnCours,
  useProfilsDuParent,
} from "./famille/index.ts";
import { MesMedailles } from "./medailles/index.ts";
import { MonParcours } from "./parcours/index.ts";
import { EcranDeRevision, useQuestionsDuesALAccueil, useRenvoiDesSeancesDeRevisionGardees } from "./revision/index.ts";
import { ToutesLesLecons, useChoixDeToutesLesLecons } from "./toutes-les-lecons/index.ts";
import { AideEcranDAccueil } from "./installation/index.ts";
import { type Lieu, useNavigation } from "./navigation.ts";
import { EcranDeSeance, PageDeLaLecon, useRenvoiDesSeancesGardees } from "./seance/index.ts";
import { oublierLesEtoilesGagnees } from "./seance/fin-de-seance/etoiles-gagnees-pendant-l-utilisation.ts";
import {
  EcranDuTestDeDepart,
  oublierLesTestsDeDepartFaits,
  useRenvoiDesTestsDeDepartGardes,
  useTestDeDepartAFaire,
} from "./test-de-depart/index.ts";
import { ChoixDeLaVoix, useVoix } from "./voix/index.ts";
import { PALETTES, Paysage, PersonnageGuide } from "./univers/index.ts";

type Habillage = CSSProperties & { readonly "--accent": string; readonly "--accent-fonce": string };

const ACCUEIL: Lieu = { ecran: "accueil" };

function estPageDeLEnfant(lieu: Lieu): boolean {
  return lieu.ecran === "jeu" || lieu.ecran === "parcours" || lieu.ecran === "toutes-les-lecons" || lieu.ecran === "medailles" ||
    lieu.ecran === "test-de-depart" || lieu.ecran === "revision" || lieu.ecran === "lecon" || lieu.ecran === "seance";
}

function lieuAffiche(demande: Lieu, espaceParent: EtatDeLEspaceParent["type"], connecte: boolean): Lieu {
  if (demande.ecran === "espace-parent" && connecte && espaceParent === "ferme") return ACCUEIL;
  return demande;
}

export function Application() {
  const { lieu: lieuDemande, retourPossible, viaRetour, aller, remplacer, revenir, revenirA } = useNavigation();
  const acces = useAccesALEspaceParent();
  const connexion = useConnexion();
  const connecte = connexion.etat === "connecte";
  useRenvoiDesSeancesGardees(connecte);
  useRenvoiDesTestsDeDepartGardes(connecte);
  useRenvoiDesSeancesDeRevisionGardees(connecte);
  const lieuPossible = lieuAffiche(lieuDemande, acces.etat.type, connecte);
  const { profil: profilEnCours, charge: profilCharge, choisirQuiJoue, definir, oublier: oublierLeProfilEnCours } = useProfilEnCours();
  const enfantAbsent = profilCharge && !profilEnCours && estPageDeLEnfant(lieuPossible);
  const lieu = enfantAbsent ? ACCUEIL : lieuPossible;
  const ecran = lieu.ecran;
  const testDeDepartAFaire = useTestDeDepartAFaire(profilEnCours, ecran === "jeu");
  const questionsDuesALaRevision = useQuestionsDuesALAccueil(profilEnCours?.id, ecran === "jeu");
  const ecranDemande = lieuDemande.ecran;
  const profil = estPageDeLEnfant(lieu) ? profilEnCours : undefined;
  const univers = universDe(profil?.univers);
  const palette = PALETTES[univers.cle];
  const voix = useVoix(universDe(profilEnCours?.univers).personnageGuide);
  const profilsDuParent = useProfilsDuParent(connecte, ecran === "accueil" || ecran === "espace-parent");
  const { etat: etatEspaceParent, quitter: fermerEspaceParent, ouvrirApresLaConnexion } = acces;
  const ouvrirLEspaceParentConnecte = useCallback(() => {
    ouvrirApresLaConnexion();
    aller("espace-parent");
  }, [ouvrirApresLaConnexion, aller]);
  const { arriveParLeLien, consommerLArrivee } = connexion;
  useEffect(() => {
    if (!connecte || !arriveParLeLien) return;
    consommerLArrivee();
    ouvrirLEspaceParentConnecte();
  }, [connecte, arriveParLeLien, consommerLArrivee, ouvrirLEspaceParentConnecte]);
  useEffect(() => {
    if (ecranDemande !== "espace-parent") fermerEspaceParent();
  }, [ecranDemande, fermerEspaceParent]);
  useEffect(() => {
    if (lieu !== lieuDemande) remplacer(lieu);
  }, [lieu, lieuDemande, remplacer]);
  const [matiereDuParcours, setMatiereDuParcours] = useState<CodeDeMatiere | undefined>();
  const [classesDAvantDeplieesPour, setClassesDAvantDeplieesPour] = useState<ReadonlySet<CodeDeMatiere>>(new Set());
  const choixDeToutesLesLecons = useChoixDeToutesLesLecons();
  const { oublier: oublierLesChoixDeToutesLesLecons } = choixDeToutesLesLecons;
  const basculerLesClassesDAvant = (matiere: CodeDeMatiere) =>
    setClassesDAvantDeplieesPour((actuelles) => {
      const suivantes = new Set(actuelles);
      if (!suivantes.delete(matiere)) suivantes.add(matiere);
      return suivantes;
    });
  const [deconnexionEchouee, setDeconnexionEchouee] = useState(false);
  const oublierLeProfilEtSaProgression = () => {
    oublierLeProfilEnCours();
    setMatiereDuParcours(undefined);
    setClassesDAvantDeplieesPour(new Set());
    oublierLesChoixDeToutesLesLecons();
  };
  const seDeconnecter = async () => {
    setDeconnexionEchouee(false);
    try {
      await connexion.seDeconnecter.executer();
      fermerEspaceParent();
      oublierLeProfilEtSaProgression();
      oublierLesEtoilesGagnees();
      oublierLesTestsDeDepartFaits();
      remplacer("accueil");
    } catch {
      setDeconnexionEchouee(true);
    }
  };
  /** L'espace parent se ferme sur l'enfant choisi, dont le personnage guide propose le test de départ ; le retour mène à son accueil. */
  const proposerLeTestDeDepart = (choisirLEnfant: () => void) => {
    fermerEspaceParent();
    choisirLEnfant();
    setMatiereDuParcours(undefined);
    remplacer("jeu");
    aller("test-de-depart");
  };
  const entrerDansLEspaceParent = () => {
    if (connecte) acces.demanderLEntree();
    aller("espace-parent");
  };
  const habillage: Habillage = { "--accent": palette.principale, "--accent-fonce": palette.foncee };

  return (
    <MotionConfig reducedMotion="user">
      <div className="application" style={habillage} data-univers={univers.cle}>
        <Paysage univers={univers.cle} />
        <EnTete
          surAccueil={ecran === "accueil"}
          enfant={profil}
          son={voix.son}
          retourPossible={retourPossible && ecran !== "seance"}
          onBasculerLeSon={voix.basculerLeSon}
          onAccueil={() => aller("accueil")}
          onRetour={revenir}
          onEspaceParent={entrerDansLEspaceParent}
        />
        <ModeDys value={profil?.reglages.modeDys ?? false}>
          <main className="ecran" data-mode-dys={profil?.reglages.modeDys ? "true" : undefined}>
            <div role="status" className="voix-bloquee">
              {voix.nomDuPersonnageGuideDeLaVoixBloquee &&
                `La voix de ${voix.nomDuPersonnageGuideDeLaVoixBloquee} est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte.`}
            </div>
            {ecran === "accueil" && (
              <>
                {connexion.etat === "deconnecte" && <EcranDeConnexion connexion={connexion} onConnecte={ouvrirLEspaceParentConnecte} />}
                <p>Réviser le programme du CP au CM2, en jouant.</p>
                {connecte
                  ? (
                    <QuiJoue
                      etat={profilsDuParent.etat}
                      voix={voix}
                      onChoisir={(profilChoisi) => {
                        choisirQuiJoue.executer(profilChoisi);
                        aller("jeu");
                      }}
                      onAjouterUnEnfant={entrerDansLEspaceParent}
                    />
                  )
                  : <PersonnageGuide univers={univers} humeur="content" />}
                <AideEcranDAccueil />
              </>
            )}
            {lieu.ecran === "jeu" && profilCharge && profilEnCours && (
              <AccueilDeLEnfant
                profil={profilEnCours}
                univers={univers}
                voix={voix}
                saluer={!viaRetour}
                onMonParcours={() => aller("parcours")}
                onToutesLesLecons={() => aller("toutes-les-lecons")}
                onMesMedailles={() => aller("medailles")}
                onMonTestDeDepart={testDeDepartAFaire ? () => aller("test-de-depart") : undefined}
                questionsDuesALaRevision={questionsDuesALaRevision}
                onJeRevise={() => aller("revision")}
                onChangerDEnfant={() => {
                  aller("accueil");
                  oublierLeProfilEtSaProgression();
                }}
              />
            )}
            {lieu.ecran === "test-de-depart" && profilCharge && profilEnCours && (
              <EcranDuTestDeDepart
                key={profilEnCours.id}
                profil={profilEnCours}
                univers={univers}
                voix={voix}
                onPlusTard={() => revenirA("jeu")}
                onVoirMonParcours={() => remplacer("parcours")}
              />
            )}
            {lieu.ecran === "revision" && profilCharge && profilEnCours && (
              <EcranDeRevision
                key={profilEnCours.id}
                profil={profilEnCours}
                univers={univers}
                voix={voix}
                onAccueil={() => revenirA("jeu")}
              />
            )}
            {lieu.ecran === "parcours" && profilCharge && profilEnCours && (
              <MonParcours
                profil={profilEnCours}
                matiereChoisie={matiereDuParcours}
                onChoisirLaMatiere={setMatiereDuParcours}
                classesDAvantDeplieesPour={classesDAvantDeplieesPour}
                onBasculerLesClassesDAvant={basculerLesClassesDAvant}
                onOuvrirLaLecon={(leconId) => aller({ ecran: "lecon", leconId })}
              />
            )}
            {lieu.ecran === "toutes-les-lecons" && profilCharge && profilEnCours && (
              <ToutesLesLecons
                profil={profilEnCours}
                choix={choixDeToutesLesLecons}
                onOuvrirLaLecon={(leconId) => aller({ ecran: "lecon", leconId })}
              />
            )}
            {lieu.ecran === "medailles" && profilCharge && profilEnCours && (
              <MesMedailles profil={profilEnCours} univers={univers} voix={voix} />
            )}
            {lieu.ecran === "lecon" && profilCharge && profilEnCours && (
              <PageDeLaLecon
                key={lieu.leconId}
                leconId={lieu.leconId}
                profilId={profilEnCours.id}
                prenom={profilEnCours.prenom}
                univers={univers}
                voix={voix}
                accueillir={!viaRetour}
                onCommencer={(exercice) => aller({ ecran: "seance", leconId: lieu.leconId, exercice })}
                onRetourALAccueil={() => aller("accueil")}
              />
            )}
            {lieu.ecran === "seance" && profilCharge && profilEnCours && (
              <EcranDeSeance
                key={`${lieu.leconId}/${lieu.exercice ?? "complete"}`}
                leconId={lieu.leconId}
                exercice={lieu.exercice}
                profilId={profilEnCours.id}
                prenom={profilEnCours.prenom}
                niveau={profilEnCours.niveau}
                univers={univers}
                voix={voix}
                toutLireAVoixHaute={profilEnCours.reglages.toutLireAVoixHaute}
                clavierDesDictees={profilEnCours.reglages.clavierDesDictees.valeur}
                onRetour={() => revenirA({ ecran: "lecon", leconId: lieu.leconId })}
                onLeconSuivante={(leconId) => aller({ ecran: "lecon", leconId })}
                onAccueil={() => aller("accueil")}
              />
            )}
            {ecran === "espace-parent" && connexion.etat === "deconnecte" && (
              <EcranDeConnexion connexion={connexion} onConnecte={ouvrirLEspaceParentConnecte} />
            )}
            {ecran === "espace-parent" && connecte && etatEspaceParent.type === "questionPosee" && (
              <ControleParental
                enonce={etatEspaceParent.enonce}
                onReponse={acces.repondre}
                onRenoncer={() => (retourPossible ? revenir() : remplacer("accueil"))}
              />
            )}
            {ecran === "espace-parent" && connecte && etatEspaceParent.type === "ouvert" && (
              <EspaceParent
                onQuitter={() => {
                  fermerEspaceParent();
                  remplacer("accueil");
                }}
                onSeDeconnecter={seDeconnecter}
                deconnexionEchouee={deconnexionEchouee}
              >
                <ProfilsDeLEspaceParent
                  etat={profilsDuParent.etat}
                  onModifie={profilsDuParent.relire}
                  onCree={(profilCree) => proposerLeTestDeDepart(() => definir(profilCree))}
                  onRefaireLeTestDeDepart={(profilExistant) => proposerLeTestDeDepart(() => choisirQuiJoue.executer(profilExistant))}
                />
                <ChoixDeLaVoix voix={voix} />
              </EspaceParent>
            )}
          </main>
        </ModeDys>
      </div>
    </MotionConfig>
  );
}
