import type { CSSProperties } from "react";
import type { SchemaEnCours, SchemaResolu } from "@domain/apprentissage";
import { dessinerLeSchema, type Ligne, type Morceau, type Taille } from "./dessin-du-schema.ts";

type Props = {
  readonly schema: SchemaEnCours;
  /** Le problème réussi : la réponse remplace le « ? », et la description la lit. */
  readonly resolu?: SchemaResolu;
};

/** Le schéma en barres : des barres proportionnelles aux nombres, et « ? » pour ce qu'on cherche. */
export function SchemaEnBarres({ schema, resolu }: Props) {
  return (
    <div
      className="schema-en-barres"
      role="img"
      aria-label={resolu?.description ?? schema.description}
      data-testid="schema-en-barres"
      data-genre={schema.forme.genre}
      data-resolu={resolu === undefined ? undefined : "true"}
    >
      <div className="dessin-du-schema" aria-hidden="true">
        {dessinerLeSchema(schema.forme, resolu?.reponse).map((ligne, rang) => <LigneDuSchema key={rang} ligne={ligne} />)}
      </div>
    </div>
  );
}

function LigneDuSchema({ ligne }: { readonly ligne: Ligne }) {
  return (
    <div className="ligne-du-schema" data-testid="ligne-du-schema" data-role={ligne.role}>
      {ligne.nom !== undefined && <span className="nom-de-la-barre">{ligne.nom}</span>}
      <div className="morceaux">
        {ligne.morceaux.map((morceau, rang) => <MorceauDeBarre key={rang} morceau={morceau} />)}
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

function MorceauDeBarre({ morceau }: { readonly morceau: Morceau }) {
  const cherche = morceau.valeur === null && morceau.role !== "suite";
  return (
    <div
      className="morceau-de-barre"
      data-testid={morceau.vide ? "ecart-du-schema" : "barre"}
      data-role={morceau.role}
      data-valeur={morceau.valeur ?? (morceau.role === "suite" ? "…" : "?")}
      data-cherchee={cherche ? "true" : undefined}
      style={styleDeLaTaille(morceau.taille)}
    >
      <span className="valeur-de-la-barre" data-testid={cherche ? "valeur-cherchee" : undefined}>{libelle(morceau)}</span>
    </div>
  );
}
