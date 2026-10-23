import { type CSSProperties, Suspense, useCallback, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import type { EtatDeLEspaceParent } from "@domain/famille";
import { universDe } from "@domain/motivation";
import { chargerProfilPrepare, PAGE_DEMONSTRATION_DISPONIBLE, PageDemonstration } from "./demonstration/disponibilite.ts";
import type { ProfilPrepare } from "./demonstration/profil-prepare.ts";
import { EcranDeConnexion, useConnexion } from "./connexion/index.ts";
import { EnTete } from "./en-tete/EnTete.tsx";
import { ControleParental, EspaceParent, useAccesALEspaceParent } from "./famille/index.ts";
import { AideEcranDAccueil } from "./installation/index.ts";
import { type Ecran, useNavigation } from "./navigation.ts";
import { PageLecon } from "./seance/index.ts";
import { ChoixDeLaVoix, useVoix } from "./voix/index.ts";
import { PALETTES, Paysage, PersonnageGuide } from "./univers/index.ts";

const ID_DU_PROFIL_PREPARE = "profil-prepare";

type Habillage = CSSProperties & { readonly "--accent": string; readonly "--accent-fonce": string };

function useProfilPrepare(actif: boolean) {
  const [profil, setProfil] = useState<ProfilPrepare | undefined>();
  const [charge, setCharge] = useState(false);
  useEffect(() => {
    if (!actif || !chargerProfilPrepare) return;
    let annule = false;
    chargerProfilPrepare().then((profilLu) => {
      if (annule) return;
      setProfil(profilLu);
      setCharge(true);
    });
    return () => {
      annule = true;
    };
  }, [actif]);
  return { profil: actif ? profil : undefined, charge: actif && charge };
}

function ecranAffiche(demande: Ecran, espaceParent: EtatDeLEspaceParent["type"], connecte: boolean): Ecran {
  if (demande === "demonstration" && !PAGE_DEMONSTRATION_DISPONIBLE) return "accueil";
  if (demande === "espace-parent" && connecte && espaceParent === "ferme") return "accueil";
  return demande;
}

export function Application() {
  const { ecran: ecranDemande, leconId, retourPossible, aller, remplacer, revenir } = useNavigation();
  const acces = useAccesALEspaceParent();
  const connexion = useConnexion();
  const connecte = connexion.etat === "connecte";
  const ecran = ecranAffiche(ecranDemande, acces.etat.type, connecte);
  const surLaDemonstration = ecran === "demonstration";
  const surUneLecon = ecran === "lecon";
  const { profil: profilEnCours, charge: profilCharge } = useProfilPrepare(
    surLaDemonstration || surUneLecon || ecran === "espace-parent",
  );
  const profil = surLaDemonstration || surUneLecon ? profilEnCours : undefined;
  const [retourDeLaSeance, setRetourDeLaSeance] = useState<(() => void) | undefined>();
  const definirLeRetourDeLaSeance = useCallback(
    (retour: (() => void) | undefined) => setRetourDeLaSeance(() => retour),
    [],
  );
  const univers = universDe(profil?.univers);
  const palette = PALETTES[univers.cle];
  const voix = useVoix(universDe(profilEnCours?.univers).personnageGuide);
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
    if (ecran !== ecranDemande && ecran !== "lecon") remplacer(ecran);
  }, [ecran, ecranDemande, remplacer]);
  const [deconnexionEchouee, setDeconnexionEchouee] = useState(false);
  const seDeconnecter = async () => {
    setDeconnexionEchouee(false);
    try {
      await connexion.seDeconnecter.executer();
      fermerEspaceParent();
      remplacer("accueil");
    } catch {
      setDeconnexionEchouee(true);
    }
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
          retourPossible={retourPossible || retourDeLaSeance !== undefined}
          onBasculerLeSon={voix.basculerLeSon}
          onAccueil={() => aller("accueil")}
          onRetour={retourDeLaSeance ?? revenir}
          onEspaceParent={() => {
            if (connecte) acces.demanderLEntree();
            aller("espace-parent");
          }}
        />
        <main className="ecran">
          <div role="status" className="voix-bloquee">
            {voix.nomDuPersonnageGuideDeLaVoixBloquee &&
              `La voix de ${voix.nomDuPersonnageGuideDeLaVoixBloquee} est bloquée par ce navigateur. Touche « Réécouter » pour réessayer, ou lis avec un adulte.`}
          </div>
          {ecran === "accueil" && (
            <>
              {connexion.etat === "deconnecte" && <EcranDeConnexion connexion={connexion} onConnecte={ouvrirLEspaceParentConnecte} />}
              <p>Réviser le programme du CP au CM2, en jouant.</p>
              <PersonnageGuide univers={univers} humeur="content" />
              <AideEcranDAccueil />
            </>
          )}
          {surLaDemonstration && PageDemonstration && profilCharge && (
            <Suspense fallback={null}>
              <PageDemonstration univers={univers} voix={voix} />
            </Suspense>
          )}
          {surUneLecon && leconId !== undefined && profilCharge && profil && (
            <PageLecon
              leconId={leconId}
              enfant={{ id: ID_DU_PROFIL_PREPARE, prenom: profil.prenom, modeDys: profil.modeDys ?? false }}
              univers={univers}
              voix={voix}
              onRetourSurLaSeance={definirLeRetourDeLaSeance}
              onQuitter={() => aller("accueil")}
            />
          )}
          {surUneLecon && (profilCharge || !chargerProfilPrepare) && !profil && (
            <p className="message-erreur" role="status">
              Il faut d'abord un profil enfant pour ouvrir une leçon. Demande à un parent de le créer.
            </p>
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
              <ChoixDeLaVoix voix={voix} />
            </EspaceParent>
          )}
        </main>
      </div>
    </MotionConfig>
  );
}
