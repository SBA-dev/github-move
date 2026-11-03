import type { RecordDeFluence } from "@domain/apprentissage";
import { useUnivers } from "../../../univers/index.ts";
import { DessinDeLUnivers } from "../claviers/DessinDeLUnivers.tsx";
import { dessinDeLaMarque } from "../claviers/dessins-des-claviers.ts";

type Props = {
  /** Le record connu au départ de la fluence. */
  readonly record: RecordDeFluence;
  readonly score: number;
};

/** La marque du record, posée à côté du score : à atteindre, puis dépassée. Décor pour les yeux, jamais annoncé ni accompagné d'un son. */
export function MarqueDuRecord({ record, score }: Props) {
  const univers = useUnivers();
  const etat = record.estDepassePar(score) ? "depassee" : "a-atteindre";
  return (
    <span className="marque-du-record" data-testid="marque-du-record" data-univers={univers} data-etat={etat}>
      <DessinDeLUnivers identifiant="dessin-de-la-marque" contenu={dessinDeLaMarque(univers, etat)} />
      Ton record : {record.meilleurScore}
    </span>
  );
}
