import { type FormEvent, useState } from "react";
import { ChampMotDePasse } from "./ChampMotDePasse.tsx";
import { ListeDesReglesDuMotDePasse } from "./ReglesDuMotDePasse.tsx";
import type { Connexion } from "./useConnexion.ts";
import { useSoumission } from "./useSoumission.ts";

type Props = {
  readonly connexion: Connexion;
  readonly onConnecte: () => void;
  readonly onSeConnecter: () => void;
};

export function FormulaireDeReinitialisation({ connexion, onConnecte, onSeConnecter }: Props) {
  const [adresse, setAdresse] = useState("");
  const [prenom, setPrenom] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { message, enCours, soumettre } = useSoumission(onConnecte);

  const envoyer = (evenement: FormEvent) => {
    evenement.preventDefault();
    void soumettre(() => connexion.reinitialiserLeMotDePasse.executer(adresse, prenom, motDePasse, confirmation));
  };

  return (
    <>
      <p>Pour choisir un nouveau mot de passe, écris ton adresse e-mail et le prénom d'un de tes enfants.</p>
      <form onSubmit={envoyer} noValidate>
        <label htmlFor="adresse-email">Adresse e-mail</label>
        <input
          id="adresse-email"
          type="email"
          autoComplete="email"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
        <label htmlFor="prenom-d-un-enfant">Prénom d'un de tes enfants</label>
        <input
          id="prenom-d-un-enfant"
          type="text"
          autoComplete="off"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <ChampMotDePasse
          id="mot-de-passe"
          libelle="Nouveau mot de passe"
          autoComplete="new-password"
          valeur={motDePasse}
          onChange={setMotDePasse}
          decritPar="regles-du-mot-de-passe"
        />
        <ListeDesReglesDuMotDePasse id="regles-du-mot-de-passe" motDePasse={motDePasse} />
        <ChampMotDePasse
          id="confirmation-du-mot-de-passe"
          libelle="Confirmation du nouveau mot de passe"
          autoComplete="new-password"
          valeur={confirmation}
          onChange={setConfirmation}
        />
        <button type="submit" disabled={enCours}>Choisir ce mot de passe</button>
      </form>
      {message && <p role="alert" className="message-erreur">{message}</p>}
      <button type="button" className="secondaire" onClick={onSeConnecter}>Retour à la connexion</button>
    </>
  );
}
