import type { SegmentDuTexteATrous } from "@domain/apprentissage";
import { TexteEnSyllabes } from "../../reglages/index.ts";

type Props = {
  readonly segments: readonly SegmentDuTexteATrous[];
  /** La phrase du trou en cours, trou marqué par « … » : annoncée aux lecteurs d'écran. */
  readonly phraseDuTrouEnCours: string | undefined;
};

/** Le texte entier : les mots trouvés s'écrivent dans leurs trous, le prochain trou est mis en avant. */
export function TexteATrous({ segments, phraseDuTrouEnCours }: Props) {
  const rangDuTrouEnCours = segments.findIndex((segment) => segment.type === "trou" && segment.mot === undefined);
  return (
    <>
      <p className="texte-a-trous" data-testid="texte-a-trous">
        {segments.map((segment, rang) => {
          if (segment.type === "texte") return <span key={rang}><TexteEnSyllabes texte={segment.texte} /></span>;
          if (segment.mot !== undefined) return <span key={rang} className="trou" data-etat="rempli"><TexteEnSyllabes texte={segment.mot} /></span>;
          const enCours = rang === rangDuTrouEnCours;
          return (
            <span
              key={rang}
              className="trou"
              data-testid="trou"
              data-etat={enCours ? "en-cours" : "vide"}
              aria-current={enCours ? "true" : undefined}
            >
              …
            </span>
          );
        })}
      </p>
      <p className="visuellement-cache" role="status" data-testid="trou-annonce">
        {phraseDuTrouEnCours === undefined ? "" : `Mot manquant dans « ${phraseDuTrouEnCours} »`}
      </p>
    </>
  );
}
