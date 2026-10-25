import { useCallback, useEffect, useState } from "react";
import type { ProfilEnfant } from "@domain/famille";
import { EcritureDeLeconRefusee, leconsPersonnellesEcritesParLesEdgeFunctions } from "./ecriture-des-lecons-personnelles.ts";
import { type LeconPersonnelleLue, lireLesLeconsPersonnellesDuParent } from "./lecons-personnelles-lues.ts";
import { AUCUNE_LECON_CREEE, LECONS_INDISPONIBLES, niveauMatiereEtTypes, SUPPRESSION_IMPOSSIBLE } from "./textes-des-lecons-personnelles.ts";

type Props = { readonly profils: readonly ProfilEnfant[] };

type Etat =
  | { readonly type: "chargement" }
  | { readonly type: "indisponible" }
  | { readonly type: "chargees"; readonly lecons: readonly LeconPersonnelleLue[] };

/** L'onglet « Mes leçons » : les leçons personnelles de tous les enfants du parent, la plus récente d'abord. Seule la suppression est proposée. */
export function MesLecons({ profils }: Props) {
  const [etat, setEtat] = useState<Etat>({ type: "chargement" });
  const [aConfirmer, setAConfirmer] = useState<string | undefined>();
  const [erreur, setErreur] = useState<string | undefined>();

  const lire = useCallback(async () => {
    try {
      setEtat({ type: "chargees", lecons: await lireLesLeconsPersonnellesDuParent() });
    } catch {
      setEtat({ type: "indisponible" });
    }
  }, []);
  useEffect(() => {
    void lire();
  }, [lire]);

  const supprimer = async (identifiant: string) => {
    setErreur(undefined);
    try {
      await leconsPersonnellesEcritesParLesEdgeFunctions.supprimer(identifiant);
      setAConfirmer(undefined);
      await lire();
    } catch (cause) {
      setErreur(cause instanceof EcritureDeLeconRefusee ? cause.message : SUPPRESSION_IMPOSSIBLE);
    }
  };

  if (etat.type === "chargement") return <p role="status">Chargement des leçons…</p>;
  if (etat.type === "indisponible") return <p role="status">{LECONS_INDISPONIBLES}</p>;
  if (etat.lecons.length === 0) return <p>{AUCUNE_LECON_CREEE}</p>;
  const prenomDe = (profil: string) => profils.find(({ id }) => id.valeur === profil)?.prenom.valeur ?? "";
  return (
    <>
      <ul className="mes-lecons">
        {etat.lecons.map(({ lecon, profil, texteDuParent }) => (
          <li key={lecon.id} data-testid="lecon-personnelle">
            <h4 data-testid="titre-de-la-lecon-personnelle">{lecon.titre}</h4>
            <p data-testid="enfant-de-la-lecon-personnelle">{prenomDe(profil)}</p>
            <p data-testid="description-de-la-lecon-personnelle">{niveauMatiereEtTypes(lecon)}</p>
            <details className="texte-colle">
              <summary>Texte collé</summary>
              <pre data-testid="texte-colle">{texteDuParent}</pre>
            </details>
            {aConfirmer === lecon.id
              ? (
                <div className="actions">
                  <button type="button" onClick={() => void supprimer(lecon.id)}>Confirmer la suppression</button>
                  <button type="button" className="secondaire" onClick={() => setAConfirmer(undefined)}>Annuler</button>
                </div>
              )
              : (
                <button type="button" className="secondaire" onClick={() => setAConfirmer(lecon.id)}>
                  Supprimer<span className="visuellement-cache"> la leçon {lecon.titre}</span>
                </button>
              )}
          </li>
        ))}
      </ul>
      {erreur && <p role="alert" className="message-erreur">{erreur}</p>}
    </>
  );
}
