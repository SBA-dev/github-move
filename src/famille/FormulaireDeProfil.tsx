import { type FormEvent, useId, useState } from "react";
import { type CodeDeNiveau, Niveau, NiveauInconnu } from "@domain/catalogue";
import { lireCleUnivers, PrenomObligatoire, Prenom, UniversInconnu } from "@domain/famille";
import { UNIVERS } from "@domain/motivation";
import { type DonneesDeProfil, EcritureDeProfilRefusee } from "./profils/ecriture-des-profils-supabase.ts";

const CLASSES: readonly CodeDeNiveau[] = ["CP", "CE1", "CE2", "CM1", "CM2"];

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
    erreur instanceof NiveauInconnu || erreur instanceof UniversInconnu;
  return metier && erreur instanceof Error ? erreur.message : "Le profil n'a pas pu être enregistré. Réessaie dans un instant.";
}

/** Le retour immédiat vient du domaine ; le serveur revalide, il reste la source de vérité. */
function validerAvecLeDomaine({ prenom, niveau, univers }: DonneesDeProfil): DonneesDeProfil {
  return { prenom: Prenom.de(prenom).valeur, niveau: Niveau.de(niveau).valeur, univers: lireCleUnivers(univers) };
}

export function FormulaireDeProfil({ titre, valeurInitiale, libelleDuBouton, onEnvoyer, onAnnuler, viderApresEnvoi = false }: Props) {
  const identifiant = useId();
  const [saisie, setSaisie] = useState<DonneesDeProfil>(valeurInitiale);
  const [erreur, setErreur] = useState<string | undefined>();
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

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
        {CLASSES.map((classe) => <option key={classe} value={classe}>{classe}</option>)}
      </select>
      <label htmlFor={`${identifiant}-univers`}>Univers</label>
      <select
        id={`${identifiant}-univers`}
        value={saisie.univers}
        onChange={(evenement) => setSaisie({ ...saisie, univers: evenement.target.value })}
      >
        {UNIVERS.map((univers) => <option key={univers.cle} value={univers.cle}>{univers.libelle}</option>)}
      </select>
      <div className="actions">
        <button type="submit" disabled={envoiEnCours}>{libelleDuBouton}</button>
        {onAnnuler && <button type="button" className="secondaire" onClick={onAnnuler}>Annuler</button>}
      </div>
      {erreur && <p role="alert" className="message-erreur">{erreur}</p>}
    </form>
  );
}
