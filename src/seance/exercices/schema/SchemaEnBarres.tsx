import { type CSSProperties, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { SchemaEnCours, SchemaResolu } from "@domain/apprentissage";
import type { CleUnivers } from "@domain/motivation";
import { useUnivers } from "../../../univers/index.ts";
import { DESSINS_DES_JAUGES } from "./dessins/jauges.tsx";
import { dessinerLeSchema, type Ligne, type Morceau, type Taille } from "./dessin-du-schema.ts";
import { useEtatDeLaJauge } from "./useEtatDeLaJauge.ts";

const ROLES_DU_TOUT = ["tout", "total", "grand"];

type Props = {
  readonly schema: SchemaEnCours;
  /** Le problème réussi : la réponse remplace le « ? », et la description la lit. */
  readonly resolu?: SchemaResolu;
  /** Le nombre de phrases déjà dites : les barres connues se remplissent quand l'énoncé est lu et que l'explication du schéma commence. */
  readonly phrasesDites: number;
};

const PHRASES_AVANT_DE_REMPLIR = 1;

/** Le schéma en barres : des barres proportionnelles aux nombres, et « ? » pour ce qu'on cherche. */
export function SchemaEnBarres({ schema, resolu, phrasesDites }: Props) {
  const univers = useUnivers();
  const mouvementsReduits = useReducedMotion() ?? false;
  const connuesRemplies = useBarresConnuesRemplies(phrasesDites >= PHRASES_AVANT_DE_REMPLIR) || mouvementsReduits;
  return (
    <div
      className="schema-en-barres"
      role="img"
      aria-label={resolu?.description ?? schema.description}
      data-testid="schema-en-barres"
      data-genre={schema.forme.genre}
      data-univers={univers}
      data-resolu={resolu === undefined ? undefined : "true"}
    >
      <div className="dessin-du-schema" aria-hidden="true">
        {dessinerLeSchema(schema.forme, resolu?.reponse).map((ligne, rang) => (
          <LigneDuSchema key={rang} ligne={ligne} connuesRemplies={connuesRemplies} trouvee={resolu !== undefined} />
        ))}
      </div>
    </div>
  );
}

/** Une fois remplies, les barres connues le restent, même quand la question est réécoutée. */
function useBarresConnuesRemplies(ontCommence: boolean): boolean {
  const [remplies, setRemplies] = useState(false);
  useEffect(() => {
    if (ontCommence) setRemplies(true);
  }, [ontCommence]);
  return remplies;
}

type PropsDeLaLigne = { readonly ligne: Ligne; readonly connuesRemplies: boolean; readonly trouvee: boolean };

function LigneDuSchema({ ligne, connuesRemplies, trouvee }: PropsDeLaLigne) {
  return (
    <div className="ligne-du-schema" data-testid="ligne-du-schema" data-role={ligne.role}>
      {ligne.nom !== undefined && <span className="nom-de-la-barre">{ligne.nom}</span>}
      <div className="morceaux">
        {ligne.morceaux.map((morceau, rang) => (
          <MorceauDeBarre
            key={`${morceau.role}-${rang}`}
            morceau={morceau}
            rempli={morceau.aTrouver === true ? trouvee : connuesRemplies}
          />
        ))}
      </div>
    </div>
  );
}

function styleDeLaTaille(taille: Taille): CSSProperties {
  switch (taille.genre) {
    case "proportion":
      return { flex: `0 0 calc(100% * ${taille.de} / ${taille.sur})` };
    case "poids":
      return { flex: `${taille.valeur} 1 0` };
    case "reste":
      return { flex: "1 1 0" };
  }
}

function libelle({ role, valeur }: Morceau): string {
  if (role === "suite") return "…";
  return valeur === null ? "?" : String(valeur);
}

function MorceauDeBarre({ morceau, rempli }: { readonly morceau: Morceau; readonly rempli: boolean }) {
  const univers = useUnivers();
  const mouvementsReduits = useReducedMotion() ?? false;
  const etatDeLaJauge = useEtatDeLaJauge(rempli, mouvementsReduits);
  const cherche = morceau.valeur === null && morceau.role !== "suite";
  const aUneJauge = morceau.vide !== true;
  const { contour, rayon, decoupe } = DESSINS_DES_JAUGES[univers];
  return (
    <div
      className="morceau-de-barre"
      data-testid={aUneJauge ? "barre" : "ecart-du-schema"}
      data-role={morceau.role}
      data-valeur={morceau.valeur ?? (morceau.role === "suite" ? "…" : "?")}
      data-cherchee={cherche ? "true" : undefined}
      data-jauge={aUneJauge ? etatDeLaJauge : undefined}
      data-univers={univers}
      style={{ ...styleDeLaTaille(morceau.taille), ...silhouetteDeLaJauge(contour, rayon, decoupe) }}
    >
      {aUneJauge && (etatDeLaJauge === "vide"
        ? <DecorDeLaBarreVide univers={univers} />
        : <JaugeDeLaBarre role={morceau.role} univers={univers} />)}
      <span className="valeur-de-la-barre" data-testid={cherche ? "valeur-cherchee" : undefined}>{libelle(morceau)}</span>
    </div>
  );
}

type Silhouette = CSSProperties & Record<`--${string}`, string>;

function silhouetteDeLaJauge(contour: string, rayon: string, decoupe: string | undefined): Silhouette {
  return {
    "--contour-de-la-jauge": contour,
    "--rayon-de-la-jauge": rayon,
    ...(decoupe === undefined ? {} : { "--decoupe-de-la-jauge": decoupe }),
  };
}

function BoutsDeLaJauge({ univers }: { readonly univers: CleUnivers }) {
  const { boutGauche, boutDroit } = DESSINS_DES_JAUGES[univers];
  return (
    <>
      <svg className="bout-de-jauge" viewBox="0 0 24 44" preserveAspectRatio="none" focusable="false">{boutGauche}</svg>
      <svg className="bout-de-jauge" viewBox="0 0 24 44" preserveAspectRatio="none" focusable="false">{boutDroit}</svg>
    </>
  );
}

/** Une barre qui attend d'être remplie garde la silhouette de l'univers : ses bouts sont dessinés en pointillés, sans remplissage. */
function DecorDeLaBarreVide({ univers }: { readonly univers: CleUnivers }) {
  return (
    <div className="decor-de-la-barre-vide" aria-hidden="true">
      <BoutsDeLaJauge univers={univers} />
    </div>
  );
}

function JaugeDeLaBarre({ role, univers }: { readonly role: string; readonly univers: CleUnivers }) {
  const { partie, tout } = DESSINS_DES_JAUGES[univers];
  return (
    <div
      className="jauge"
      data-testid="jauge"
      data-univers={univers}
      aria-hidden="true"
      style={{ backgroundColor: ROLES_DU_TOUT.includes(role) ? tout : partie }}
    >
      <BoutsDeLaJauge univers={univers} />
    </div>
  );
}
