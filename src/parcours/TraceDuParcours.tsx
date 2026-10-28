import type { MesuresDuDessin } from "./useMesuresDuDessin.ts";
import { tracePassantPar } from "./geometrie-du-dessin.ts";

/** Le sentier qui serpente de leçon en leçon jusqu'à la fin du dessin. Décoratif : caché des lecteurs d'écran. */
export function TraceDuParcours({ mesures }: { readonly mesures: MesuresDuDessin }) {
  const trace = tracePassantPar(mesures.centres);
  return (
    <svg
      className="trace-du-parcours"
      data-testid="trace-du-parcours"
      aria-hidden="true"
      width={mesures.largeur}
      height={mesures.hauteur}
      viewBox={`0 0 ${mesures.largeur} ${mesures.hauteur}`}
    >
      <path d={trace} fill="none" stroke="var(--surface)" strokeOpacity=".8" strokeWidth="22" strokeLinecap="round" />
      <path d={trace} fill="none" stroke="var(--principale-foncee)" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 12" />
    </svg>
  );
}
