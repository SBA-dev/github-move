import { type FormEvent, useId, useState } from "react";
import { Niveau, NiveauInconnu } from "@domain/catalogue";
import {
  ClavierDesDicteesInconnu,
  LANGUES_DU_PARENT_PROPOSEES,
  LangueDuParentInconnue,
  lireCleUnivers,
  Prenom,
  PrenomObligatoire,
  Reglages,
  UniversInconnu,
  type ValeurDuClavierDesDictees,
} from "@domain/famille";
import { UNIVERS } from "@domain/motivation";
import { enReglagesComplets, type ReglagesComplets } from "../reglages/index.ts";
import { type DonneesDeProfil, EcritureDeProfilRefusee } from "./profils/ecriture-des-profils-supabase.ts";

type Props = {
  /** Nom accessible du formulaire : « Ajouter un enfant » ou « Modifier <prénom> ». */
  readonly titre: string;
  readonly valeurInitiale: DonneesDeProfil;
  readonly libelleDuBouton: string;
  readonly onEnvoyer: (donnees: DonneesDeProfil) => Promise<void>;
  readonly onAnnuler?: () => void;
  /** Un formulaire de création se vide une fois le profil créé. */
  readonly viderApresEnvoi?: boolean;
};

function message(erreur: unknown): string {
  const metier = erreur instanceof EcritureDeProfilRefusee || erreur instanceof PrenomObligatoire ||
    erreur instanceof NiveauInconnu || erreur instanceof UniversInconnu || erreur instanceof ClavierDesDicteesInconnu ||
    erreur instanceof LangueDuParentInconnue;
  return metier && erreur instanceof Error ? erreur.message : "Le profil n'a pas pu être enregistré. Réessaie dans un instant.";
}

/** Le retour immédiat vient du domaine ; le serveur revalide, il reste la source de vérité. */
function validerAvecLeDomaine({ prenom, niveau, univers, reglages }: DonneesDeProfil): DonneesDeProfil {
  return {
    prenom: Prenom.de(prenom).valeur,
    niveau: Niveau.de(niveau).valeur,
    univers: lireCleUnivers(univers),
    reglages: enReglagesComplets(Reglages.depuis(reglages)),
  };
}

const CLAVIERS_DES_DICTEES: readonly { readonly valeur: ValeurDuClavierDesDictees; readonly libelle: string }[] = [
  { valeur: "automatique", libelle: "Automatique" },
  { valeur: "lettresDuMot", libelle: "Lettres du mot seulement" },
  { valeur: "clavierComplet", libelle: "Clavier complet" },
];

const REGLAGES_A_COCHER: readonly {
  readonly cle: "modeDys" | "toutLireAVoixHaute" | "parcoursLibre";
  readonly libelle: string;
}[] = [
  { cle: "modeDys", libelle: "Mode dys" },
  { cle: "toutLireAVoixHaute", libelle: "Tout lire à voix haute" },
  { cle: "parcoursLibre", libelle: "Parcours libre" },
];

export function FormulaireDeProfil({ titre, valeurInitiale, libelleDuBouton, onEnvoyer, onAnnuler, viderApresEnvoi = false }: Props) {
  const identifiant = useId();
  const [saisie, setSaisie] = useState<DonneesDeProfil>(valeurInitiale);
  const [erreur, setErreur] = useState<string | undefined>();
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const changerLesReglages = (changement: Partial<ReglagesComplets>) =>
    setSaisie({ ...saisie, reglages: { ...saisie.reglages, ...changement } });

  const envoyer = async (evenement: FormEvent) => {
    evenement.preventDefault();
    setErreur(undefined);
    setEnvoiEnCours(true);
    try {
      await onEnvoyer(validerAvecLeDomaine(saisie));
      if (viderApresEnvoi) setSaisie(valeurInitiale);
    } catch (cause) {
      setErreur(message(cause));
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <form className="formulaire-de-profil" aria-label={titre} onSubmit={envoyer} noValidate>
      <label htmlFor={`${identifiant}-prenom`}>Prénom</label>
      <input
        id={`${identifiant}-prenom`}
        type="text"
        autoComplete="off"
        value={saisie.prenom}
        onChange={(evenement) => setSaisie({ ...saisie, prenom: evenement.target.value })}
      />
      <label htmlFor={`${identifiant}-classe`}>Classe</label>
      <select
        id={`${identifiant}-classe`}
        value={saisie.niveau}
        onChange={(evenement) => setSaisie({ ...saisie, niveau: evenement.target.value })}
      >
        {Niveau.tous().map(({ valeur }) => <option key={valeur} value={valeur}>{valeur}</option>)}
      </select>
      <label htmlFor={`${identifiant}-univers`}>Univers</label>
      <select
        id={`${identifiant}-univers`}
        value={saisie.univers}
        onChange={(evenement) => setSaisie({ ...saisie, univers: evenement.target.value })}
      >
        {UNIVERS.map((univers) => <option key={univers.cle} value={univers.cle}>{univers.libelle}</option>)}
      </select>
      <fieldset className="reglages" data-testid="reglages">
        <legend>Réglages</legend>
        {REGLAGES_A_COCHER.map(({ cle, libelle }) => (
          <label key={cle} className="reglage-a-cocher">
            <input
              type="checkbox"
              checked={saisie.reglages[cle]}
              onChange={(evenement) => changerLesReglages({ [cle]: evenement.target.checked })}
            />
            {libelle}
          </label>
        ))}
        <label htmlFor={`${identifiant}-clavier`}>Clavier des dictées</label>
        <select
          id={`${identifiant}-clavier`}
          value={saisie.reglages.clavierDesDictees}
          onChange={(evenement) => changerLesReglages({ clavierDesDictees: evenement.target.value })}
        >
          {CLAVIERS_DES_DICTEES.map(({ valeur, libelle }) => <option key={valeur} value={valeur}>{libelle}</option>)}
        </select>
        <label htmlFor={`${identifiant}-langue`}>Langue du parent</label>
        <select
          id={`${identifiant}-langue`}
          value={saisie.reglages.langueDuParent}
          onChange={(evenement) => changerLesReglages({ langueDuParent: evenement.target.value })}
        >
          <option value="aucune">Aucune</option>
          {LANGUES_DU_PARENT_PROPOSEES.map(({ code, libelle }) => <option key={code} value={code}>{libelle}</option>)}
        </select>
      </fieldset>
      <div className="actions">
        <button type="submit" disabled={envoiEnCours}>{libelleDuBouton}</button>
        {onAnnuler && <button type="button" className="secondaire" onClick={onAnnuler}>Annuler</button>}
      </div>
      {erreur && <p role="alert" className="message-erreur">{erreur}</p>}
    </form>
  );
}
