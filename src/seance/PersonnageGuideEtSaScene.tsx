import type { Humeur, Univers } from "@domain/motivation";
import { useTenueDuProfil } from "../tenue/TenueDuProfil.tsx";
import { PersonnageGuide } from "../univers/index.ts";
import { cleDeTenueConnue } from "../univers/celebrations/index.ts";
import { SceneDeReponseFausse } from "../univers/reponse-fausse/index.ts";
import type { useSceneDeReponseFausse } from "./useSceneDeReponseFausse.ts";

type Props = {
  readonly univers: Univers;
  readonly humeur: Humeur;
  readonly reponseFausse: ReturnType<typeof useSceneDeReponseFausse>;
};

/**
 * Le personnage guide pendant une question : son dessin, ou sa scène de réponse fausse à la place du dessin, à sa taille.
 * Le dessin n'est montré qu'une fois : il revient, avec l'humeur du moment, quand la scène finit ou s'arrête.
 * La zone n'ajoute aucune boîte à la mise en page (`display: contents`) : elle sert à mesurer le dessin.
 */
export function PersonnageGuideEtSaScene({ univers, humeur, reponseFausse: { zoneDuPersonnageGuide, enCours, jouee, terminer } }: Props) {
  const tenue = cleDeTenueConnue(useTenueDuProfil());
  const dessin = <PersonnageGuide univers={univers} humeur={humeur} />;
  return (
    <div
      ref={zoneDuPersonnageGuide}
      className="personnage-guide-et-sa-scene"
      data-scene-de-reponse-fausse-jouee={jouee ? "oui" : "non"}
    >
      {enCours
        ? <SceneDeReponseFausse scene={enCours.scene} tenue={tenue} avecBulleEcrite={enCours.avecBulleEcrite} onFinie={terminer} repli={dessin} />
        : dessin}
    </div>
  );
}
