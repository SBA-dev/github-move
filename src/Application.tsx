import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import { type Ecran as EcranDuDomaine, type EtatDeLEspaceParent, estUnEcranDuParent } from "@domain/famille";
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
import { DockDeLEnfant, type EcranDuDock, estUnEcranDuDock } from "./accueil/index.ts";
import { LeconsPersonnellesDuParent } from "./accompagnement/index.ts";
import { EcranDeLEpisode } from "./histoire/index.ts";
import { MesMedailles } from "./medailles/index.ts";
import { SuiviDeLEspaceParent } from "./suivi/index.ts";
import { MonParcours, useProchainesLeconsConnues } from "./parcours/index.ts";
import { EcranDeRevision, useQuestionsDuesALAccueil, useRenvoiDesSeancesDeRevisionGardees } from "./revision/index.ts";
import { ToutesLesLecons, useChoixDeToutesLesLecons } from "./toutes-les-lecons/index.ts";
import { AideEcranDAccueil } from "./installation/index.ts";
import { type Lieu, useNavigation } from "./navigation.ts";
import { EcranQuiArrive, cleDeLEcran, transitionVers } from "./transitions/index.ts";
import { EcranDeSeance, PageDeLaLecon, useRenvoiDesSeancesGardees } from "./seance/index.ts";
import { oublierLesEtoilesGagnees } from "./seance/fin-de-seance/etoiles-gagnees-pendant-l-utilisation.ts";
import { oublierLesSeancesDeRevisionTerminees } from "./revision/seances-de-revision-terminees-pendant-l-utilisation.ts";
import { oublierLesDernieresLecturesDuServeur } from "./histoire/seances-terminees-du-profil.ts";
import { oublierLesSeancesTerminees } from "./seance/fin-de-seance/seances-terminees-pendant-l-utilisation.ts";
import {
  EcranDuTestDeDepart,
  oublierLesTestsDeDepartFaits,
  useRenvoiDesTestsDeDepartGardes,
  useTestDeDepartAFaire,
} from "./test-de-depart/index.ts";
import { brancherLeSonDesBoutons } from "./boutons/son-des-boutons.ts";
import { ChoixDeLaVoix, useVoix } from "./voix/index.ts";
import { TenueDuProfil } from "./tenue/index.ts";
import { HABILLAGE_DU_PARENT, habillageDeLUnivers, Paysage } from "./univers/index.ts";

const ACCUEIL: Lieu = { ecran: "accueil" };

function estPageDeLEnfant(lieu: Lieu): boolean {
  return lieu.ecran === "jeu" || lieu.ecran === "parcours" || lieu.ecran === "toutes-les-lecons" || lieu.ecran === "medailles" ||
    lieu.ecran === "test-de-depart" || lieu.ecran === "revision" || lieu.ecran === "lecon" || lieu.ecran === "seance" ||
    lieu.ecran === "episode";
}

function ecranAffiche(lieu: Lieu, espaceParent: EtatDeLEspaceParent["type"], connecte: boolean): EcranDuDomaine {
  switch (lieu.ecran) {
    case "accueil":
      return connecte ? "qui-joue" : "connexion";
    case "espace-parent":
      if (!connecte) return "connexion";
      return espaceParent === "questionPosee" ? "controle-parental" : "espace-parent";
    case "jeu":
      return "accueil-de-l-enfant";
    case "lecon":
      return "page-de-la-lecon";
    case "episode":
      return "medailles";
    case "parcours":
    case "toutes-les-lecons":
    case "medailles":
    case "test-de-depart":
    case "seance":
    case "revision":
      return lieu.ecran;
  }
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
  const voix = useVoix(universDe(profilEnCours?.univers).personnageGuide);
  const parent = estUnEcranDuParent(ecranAffiche(lieu, acces.etat.type, connecte));
  const { suspendre: suspendreLaVoix, reprendre: reprendreLaVoix, toucherUnBouton } = voix;
  useEffect(() => brancherLeSonDesBoutons(toucherUnBouton), [toucherUnBouton]);
  useLayoutEffect(() => {
    if (parent) suspendreLaVoix();
    else reprendreLaVoix();
  }, [parent, suspendreLaVoix, reprendreLaVoix]);
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
  const { connues: prochainesLeconsConnues, memoriser: memoriserLaProchaineLecon, oublier: oublierLesProchainesLeconsConnues } =
    useProchainesLeconsConnues(profilEnCours);
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
    oublierLesProchainesLeconsConnues();
    oublierLesChoixDeToutesLesLecons();
  };
  const seDeconnecter = async () => {
    setDeconnexionEchouee(false);
    try {
      await connexion.seDeconnecter.executer();
      fermerEspaceParent();
      oublierLeProfilEtSaProgression();
      oublierLesEtoilesGagnees();
      oublierLesSeancesTerminees();
      oublierLesDernieresLecturesDuServeur();
      oublierLesSeancesDeRevisionTerminees();
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
  /** Depuis l'accueil le dock ouvre un écran ; entre deux écrans du dock il le remplace, pour que le retour mène toujours à l'accueil. */
  const ouvrirParLeDock = (destination: EcranDuDock) => {
    if (ecran === destination) return;
    if (destination === "jeu") revenirA("jeu");
    else if (ecran === "jeu") aller(destination);
    else remplacer(destination);
  };
  const habillage = parent ? HABILLAGE_DU_PARENT : habillageDeLUnivers(univers.cle);

  return (
    <MotionConfig reducedMotion="user">
      <TenueDuProfil profil={profil?.id}>
        <div className="application" style={habillage} data-univers={univers.cle} data-registre={parent ? "parent" : "enfant"}>
          {!parent && <Paysage univers={univers.cle} />}
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
              <EcranQuiArrive cle={cleDeLEcran(lieu)} transition={transitionVers(lieu, viaRetour)}>
                {ecran === "accueil" && (
                  <>
                    {connexion.etat === "deconnecte" && <EcranDeConnexion connexion={connexion} onConnecte={ouvrirLEspaceParentConnecte} />}
                    <p>Réviser le programme du CP au CM2, en jouant.</p>
                    {connecte && (
                      <QuiJoue
                        etat={profilsDuParent.etat}
                        onChoisir={(profilChoisi) => {
                          choisirQuiJoue.executer(profilChoisi);
                          aller("jeu");
                        }}
                        onAjouterUnEnfant={entrerDansLEspaceParent}
                      />
                    )}
                    <AideEcranDAccueil />
                  </>
                )}
                {lieu.ecran === "jeu" && profilCharge && profilEnCours && (
                  <AccueilDeLEnfant
                    profil={profilEnCours}
                    univers={univers}
                    voix={voix}
                    saluer={!viaRetour}
                    testDeDepartAProposer={testDeDepartAFaire}
                    questionsDuesALaRevision={questionsDuesALaRevision}
                    onMonTestDeDepart={() => aller("test-de-depart")}
                    onJeRevise={() => aller("revision")}
                    onCommencerLaLecon={(leconId) => aller({ ecran: "lecon", leconId })}
                    onOuvrirLaMatiere={(matiere) => {
                      setMatiereDuParcours(matiere);
                      aller("parcours");
                    }}
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
                    onLireLEpisode={(numero) => aller({ ecran: "episode", numero, origine: "fin-de-seance" })}
                    onAccueil={() => revenirA("jeu")}
                  />
                )}
                {lieu.ecran === "parcours" && profilCharge && profilEnCours && (
                  <MonParcours
                    profil={profilEnCours}
                    univers={univers}
                    matiereChoisie={matiereDuParcours}
                    onChoisirLaMatiere={setMatiereDuParcours}
                    classesDAvantDeplieesPour={classesDAvantDeplieesPour}
                    onBasculerLesClassesDAvant={basculerLesClassesDAvant}
                    onOuvrirLaLecon={(leconId) => aller({ ecran: "lecon", leconId })}
                    prochainesLeconsConnues={prochainesLeconsConnues}
                    onMemoriserLaProchaineLecon={memoriserLaProchaineLecon}
                  />
                )}
                {lieu.ecran === "toutes-les-lecons" && profilCharge && profilEnCours && (
                  <ToutesLesLecons
                    profil={profilEnCours}
                    univers={univers}
                    choix={choixDeToutesLesLecons}
                    onOuvrirLaLecon={(leconId) => aller({ ecran: "lecon", leconId })}
                  />
                )}
                {lieu.ecran === "medailles" && profilCharge && profilEnCours && (
                  <MesMedailles
                    profil={profilEnCours}
                    univers={univers}
                    voix={voix}
                    onOuvrirLEpisode={(numero) => aller({ ecran: "episode", numero, origine: "medailles" })}
                  />
                )}
                {lieu.ecran === "episode" && profilCharge && profilEnCours && (
                  <EcranDeLEpisode
                    profil={profilEnCours}
                    univers={univers}
                    voix={voix}
                    numero={lieu.numero}
                    onFermerLeLivre={() => revenirA(lieu.origine === "medailles" ? "medailles" : "jeu")}
                    onEpisodeSuivant={(numero) => remplacer({ ecran: "episode", numero, origine: lieu.origine })}
                  />
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
                    onLireLEpisode={(numero) => aller({ ecran: "episode", numero, origine: "fin-de-seance" })}
                    onLeconSuivante={(leconId) => aller({ ecran: "lecon", leconId })}
                    onToutesLesLecons={() => {
                      remplacer("jeu");
                      aller("toutes-les-lecons");
                    }}
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
                    <SuiviDeLEspaceParent etat={profilsDuParent.etat} />
                    <ProfilsDeLEspaceParent
                      etat={profilsDuParent.etat}
                      onModifie={profilsDuParent.relire}
                      onCree={(profilCree) => proposerLeTestDeDepart(() => definir(profilCree))}
                      onRefaireLeTestDeDepart={(profilExistant) => proposerLeTestDeDepart(() => choisirQuiJoue.executer(profilExistant))}
                    />
                    <LeconsPersonnellesDuParent profils={profilsDuParent.etat.type === "charges" ? profilsDuParent.etat.profils : undefined} />
                    <ChoixDeLaVoix voix={voix} />
                  </EspaceParent>
                )}
              </EcranQuiArrive>
            </main>
            {profilCharge && profilEnCours && estUnEcranDuDock(ecran) && <DockDeLEnfant ecranEnCours={ecran} onOuvrir={ouvrirParLeDock} />}
          </ModeDys>
        </div>
      </TenueDuProfil>
    </MotionConfig>
  );
}
