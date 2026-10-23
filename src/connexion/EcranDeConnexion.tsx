import { type FormEvent, useState } from "react";
import { AdresseEmail, AdresseEmailInvalide, CodeDeConnexionInvalide, CodeDeConnexionMalForme } from "@domain/famille";
import type { Connexion } from "./useConnexion.ts";

type Props = {
  readonly connexion: Connexion;
  readonly onConnecte: () => void;
};

type Etape = { readonly nom: "adresse" } | { readonly nom: "code"; readonly adresse: string };

function messageDErreur(erreur: unknown): string {
  if (erreur instanceof AdresseEmailInvalide) return "Cette adresse e-mail n'est pas valide. Vérifie-la et réessaie.";
  if (erreur instanceof CodeDeConnexionMalForme) return "Le code de connexion doit avoir 6 chiffres. Ressaisis-le.";
  if (erreur instanceof CodeDeConnexionInvalide) {
    return "Ce code de connexion ne marche plus. Ressaisis-le ou demande un nouveau lien de connexion.";
  }
  return "Un souci est survenu. Réessaie dans un instant.";
}

export function EcranDeConnexion({ connexion, onConnecte }: Props) {
  const [etape, setEtape] = useState<Etape>({ nom: "adresse" });
  const [adresseSaisie, setAdresseSaisie] = useState("");
  const [codeSaisi, setCodeSaisi] = useState("");
  const [erreur, setErreur] = useState<string | undefined>();
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const demanderLeLien = async (evenement: FormEvent) => {
    evenement.preventDefault();
    setErreur(undefined);
    connexion.oublierLeLienRefuse();
    setEnvoiEnCours(true);
    try {
      await connexion.demanderLeLien.executer(adresseSaisie);
      setCodeSaisi("");
      setEtape({ nom: "code", adresse: AdresseEmail.de(adresseSaisie).valeur });
    } catch (cause) {
      setErreur(messageDErreur(cause));
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const ouvrirAvecLeCode = async (evenement: FormEvent) => {
    evenement.preventDefault();
    if (etape.nom !== "code") return;
    setErreur(undefined);
    setEnvoiEnCours(true);
    try {
      await connexion.ouvrirAvecLeCode.executer(etape.adresse, codeSaisi);
      onConnecte();
    } catch (cause) {
      setErreur(messageDErreur(cause));
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const redemander = () => {
    setErreur(undefined);
    setEtape({ nom: "adresse" });
  };

  return (
    <section className="connexion" aria-labelledby="titre-connexion">
      <h2 id="titre-connexion">Se connecter</h2>
      <p>Connecte-toi avec ton adresse e-mail pour retrouver ta famille.</p>
      {connexion.lienRefuse && etape.nom === "adresse" && (
        <p role="alert" className="message-erreur">
          Ce lien de connexion ne marche plus. Demande-en un nouveau ci-dessous.
        </p>
      )}
      {etape.nom === "adresse"
        ? (
          <form onSubmit={demanderLeLien} noValidate>
            <label htmlFor="adresse-email">Adresse e-mail</label>
            <input
              id="adresse-email"
              type="email"
              autoComplete="email"
              value={adresseSaisie}
              onChange={(e) => setAdresseSaisie(e.target.value)}
            />
            <button type="submit" disabled={envoiEnCours}>Recevoir un lien de connexion</button>
          </form>
        )
        : (
          <>
            <p role="status">Un lien de connexion a été envoyé à {etape.adresse}.</p>
            <p>Ouvre le lien reçu, ou saisis ici le code de connexion à 6 chiffres reçu dans le même e-mail.</p>
            <form onSubmit={ouvrirAvecLeCode} noValidate>
              <label htmlFor="code-de-connexion">Code de connexion</label>
              <input
                id="code-de-connexion"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={codeSaisi}
                onChange={(e) => setCodeSaisi(e.target.value)}
              />
              <button type="submit" disabled={envoiEnCours}>Me connecter avec le code</button>
            </form>
            <button type="button" className="secondaire" onClick={redemander}>Demander un nouveau lien</button>
          </>
        )}
      {erreur && <p role="alert" className="message-erreur">{erreur}</p>}
    </section>
  );
}
