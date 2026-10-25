import { type FormEvent, useState } from "react";
import { ChampMotDePasse } from "./ChampMotDePasse.tsx";
import { estAdresseDejaUtilisee } from "./messages-de-connexion.ts";
import { ListeDesReglesDuMotDePasse } from "./ReglesDuMotDePasse.tsx";
import type { Connexion } from "./useConnexion.ts";
import { useSoumission } from "./useSoumission.ts";

type Props = {
  readonly connexion: Connexion;
  readonly onConnecte: () => void;
  readonly onSeConnecter: () => void;
};

export function FormulaireDInscription({ connexion, onConnecte, onSeConnecter }: Props) {
  const [adresse, setAdresse] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { erreur, message, enCours, soumettre } = useSoumission(onConnecte);

  const envoyer = (evenement: FormEvent) => {
    evenement.preventDefault();
    void soumettre(() => connexion.sInscrire.executer(adresse, motDePasse, confirmation));
  };

  return (
    <>
      <p>Crée ton compte avec ton adresse e-mail et un mot de passe.</p>
      <form onSubmit={envoyer} noValidate>
        <label htmlFor="adresse-email">Adresse e-mail</label>
        <input
          id="adresse-email"
          type="email"
          autoComplete="email"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
        <ChampMotDePasse
          id="mot-de-passe"
          libelle="Mot de passe"
          autoComplete="new-password"
          valeur={motDePasse}
          onChange={setMotDePasse}
          decritPar="regles-du-mot-de-passe"
        />
        <ListeDesReglesDuMotDePasse id="regles-du-mot-de-passe" motDePasse={motDePasse} />
        <ChampMotDePasse
          id="confirmation-du-mot-de-passe"
          libelle="Confirmation du mot de passe"
          autoComplete="new-password"
          valeur={confirmation}
          onChange={setConfirmation}
        />
        <button type="submit" disabled={enCours}>Créer ton compte</button>
      </form>
      {message && <p role="alert" className="message-erreur">{message}</p>}
      {estAdresseDejaUtilisee(erreur) && (
        <button type="button" className="secondaire" onClick={onSeConnecter}>Se connecter</button>
      )}
      <button type="button" className="secondaire" onClick={onSeConnecter}>J'ai déjà un compte</button>
    </>
  );
}
