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
import { type Lieu, useNavigation } from "./navigation.ts";
import { EcranDeSeance, PageDeLaLecon } from "./seance/index.ts";
import { ChoixDeLaVoix, useVoix } from "./voix/index.ts";
import { PALETTES, Paysage, PersonnageGuide } from "./univers/index.ts";

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

const ACCUEIL: Lieu = { ecran: "accueil" };

function estPageDeLEnfant(lieu: Lieu): boolean {
  return lieu.ecran === "demonstration" || lieu.ecran === "lecon" || lieu.ecran === "seance";
}

// Tant que le profil enfant n'existe que préparé (page de démonstration du lot 1), les pages de l'enfant ne sont pas publiées.
function lieuAffiche(demande: Lieu, espaceParent: EtatDeLEspaceParent["type"], connecte: boolean): Lieu {
  if (estPageDeLEnfant(demande) && !PAGE_DEMONSTRATION_DISPONIBLE) return ACCUEIL;
  if (demande.ecran === "espace-parent" && connecte && espaceParent === "ferme") return ACCUEIL;
  return demande;
}

export function Application() {
  const { lieu: lieuDemande, retourPossible, viaRetour, aller, remplacer, revenir } = useNavigation();
  const acces = useAccesALEspaceParent();
  const connexion = useConnexion();
  const connecte = connexion.etat === "connecte";
  const lieuPossible = lieuAffiche(lieuDemande, acces.etat.type, connecte);
  const { profil: profilEnCours, charge: profilCharge } = useProfilPrepare(
    estPageDeLEnfant(lieuPossible) || lieuPossible.ecran === "espace-parent",
  );
  const enfantAbsent = profilCharge && !profilEnCours && (lieuPossible.ecran === "lecon" || lieuPossible.ecran === "seance");
  const lieu = enfantAbsent ? ACCUEIL : lieuPossible;
  const ecran = lieu.ecran;
  const ecranDemande = lieuDemande.ecran;
  const surLaDemonstration = ecran === "demonstration";
  const profil = estPageDeLEnfant(lieu) ? profilEnCours : undefined;
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
    if (lieu !== lieuDemande) remplacer(lieu);
  }, [lieu, lieuDemande, remplacer]);
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
          retourPossible={retourPossible && ecran !== "seance"}
          onBasculerLeSon={voix.basculerLeSon}
          onAccueil={() => aller("accueil")}
          onRetour={revenir}
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
          {lieu.ecran === "lecon" && profilCharge && profilEnCours && (
            <PageDeLaLecon
              key={lieu.leconId}
              leconId={lieu.leconId}
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
              prenom={profilEnCours.prenom}
              univers={univers}
              voix={voix}
              onRetour={() => (retourPossible ? revenir() : remplacer({ ecran: "lecon", leconId: lieu.leconId }))}
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
              <ChoixDeLaVoix voix={voix} />
            </EspaceParent>
          )}
        </main>
      </div>
    </MotionConfig>
  );
}
