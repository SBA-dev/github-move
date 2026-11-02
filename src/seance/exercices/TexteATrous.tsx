import type { SegmentDuTexteATrous } from "@domain/apprentissage";
import { TexteEnSyllabes } from "../../reglages/index.ts";
import { type DepartDuMot, useMotQuiVoyage } from "./mot-qui-voyage/useMotQuiVoyage.tsx";

type Props = {
  readonly segments: readonly SegmentDuTexteATrous[];
  /** La phrase du trou en cours, trou marqué par « … » : annoncée aux lecteurs d'écran. */
  readonly phraseDuTrouEnCours: string | undefined;
  /** Le mot que l'enfant vient de choisir : s'il est juste, il voyage de sa bulle jusqu'à son trou. */
  readonly motChoisi: DepartDuMot | undefined;
};

/** Le texte entier : les mots trouvés s'écrivent dans leurs trous, le prochain trou est mis en avant. */
export function TexteATrous({ segments, phraseDuTrouEnCours, motChoisi }: Props) {
  const voyage = useMotQuiVoyage(segments.map((segment) => (segment.type === "trou" ? segment.mot : undefined)), motChoisi);
  const rangDuTrouEnCours = segments.findIndex((segment) => segment.type === "trou" && segment.mot === undefined);
  return (
    <>
      <p className="texte-a-trous" data-testid="texte-a-trous">
        {segments.map((segment, rang) => {
          if (segment.type === "texte") return <span key={rang}><TexteEnSyllabes texte={segment.texte} /></span>;
          if (segment.mot !== undefined) {
            return (
              <span
                key={rang}
                ref={voyage.refDeLaPlace(rang)}
                className="trou"
                data-testid="trou-rempli"
                data-etat="rempli"
                data-eclat={voyage.eclat(rang) ? "true" : undefined}
              >
                <span className="mot-du-trou" data-en-route={voyage.enRoute(rang) ? "true" : undefined}>
                  <TexteEnSyllabes texte={segment.mot} />
                </span>
              </span>
            );
          }
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
      {voyage.voyage}
      <p className="visuellement-cache" role="status" data-testid="trou-annonce">
        {phraseDuTrouEnCours === undefined ? "" : `Mot manquant dans « ${phraseDuTrouEnCours} »`}
      </p>
    </>
  );
}
