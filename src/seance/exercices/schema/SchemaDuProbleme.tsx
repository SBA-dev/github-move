import type { SchemaEnCours, SchemaResolu } from "@domain/apprentissage";
import { ReponseAuCalcul } from "../ReponseAuCalcul.tsx";
import { SchemaEnBarres } from "./SchemaEnBarres.tsx";

type Props = {
  readonly schema: SchemaEnCours;
  readonly resolu: SchemaResolu | undefined;
  /** Le nombre de phrases déjà dites : l'énoncé, puis l'explication du schéma. */
  readonly phrasesDites: number;
  readonly reussi: boolean;
  readonly onChoisir: (texte: string) => void;
  readonly onValider: (nombre: number) => void;
  readonly onJeNeSaisPas: () => void;
};

const PHRASES_AVANT_DE_REPONDRE = 2;

/** Un problème en barres : son énoncé, son schéma, puis de quoi répondre une fois le schéma expliqué. */
export function SchemaDuProbleme({ schema, resolu, phrasesDites, reussi, ...reponseDeLEnfant }: Props) {
  return (
    <div className="probleme-en-barres" data-testid="probleme-en-barres" data-mode={schema.mode.genre}>
      <p className="question enonce-du-probleme" data-testid="enonce-du-probleme">{schema.enonce}</p>
      <SchemaEnBarres schema={schema} resolu={resolu} />
      {phrasesDites >= PHRASES_AVANT_DE_REPONDRE && <ReponseAuCalcul calcul={schema} reussi={reussi} {...reponseDeLEnfant} />}
    </div>
  );
}
