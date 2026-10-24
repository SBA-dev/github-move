import { type FormEvent, useState } from "react";
import { ChampMotDePasse } from "./ChampMotDePasse.tsx";
import { estAdresseOuMotDePasseIncorrect } from "./messages-de-connexion.ts";
import type { Connexion } from "./useConnexion.ts";
import { useSoumission } from "./useSoumission.ts";

type Props = {
  readonly connexion: Connexion;
  readonly onConnecte: () => void;
  readonly onCreerLeCompte: () => void;
  readonly onMotDePasseOublie: () => void;
};

export function FormulaireDeConnexion({ connexion, onConnecte, onCreerLeCompte, onMotDePasseOublie }: Props) {
  const [adresse, setAdresse] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const { erreur, message, enCours, soumettre } = useSoumission(onConnecte);

  const envoyer = (evenement: FormEvent) => {
    evenement.preventDefault();
    void soumettre(() => connexion.seConnecter.executer(adresse, motDePasse));
  };

  return (
    <>
      <p>Connecte-toi avec ton adresse e-mail et ton mot de passe pour retrouver ta famille.</p>
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
          autoComplete="current-password"
          valeur={motDePasse}
          onChange={setMotDePasse}
        />
        <button type="submit" disabled={enCours}>Se connecter</button>
      </form>
      {message && <p role="alert" className="message-erreur">{message}</p>}
      {estAdresseOuMotDePasseIncorrect(erreur) && (
        <button type="button" className="secondaire" onClick={onMotDePasseOublie}>Mot de passe oublié</button>
      )}
      <div className="autres-choix">
        <button type="button" className="secondaire" onClick={onCreerLeCompte}>Créer ton compte</button>
        <button type="button" className="secondaire" onClick={onMotDePasseOublie}>Mot de passe oublié</button>
      </div>
    </>
  );
}
