import { lazy } from "react";

// Page réservée aux tests du lot 1, retirée au lot 3 (docs/stories/lot-1-decisions.md, décision 1).
// Les imports dynamiques restent sous la garde dans ce module : le bundle de production ne contient pas la page.
export const PAGE_DEMONSTRATION_DISPONIBLE: boolean = import.meta.env.DEV ||
  import.meta.env.VITE_PAGE_DEMONSTRATION === "1";

export const PageDemonstration = PAGE_DEMONSTRATION_DISPONIBLE
  ? lazy(() => import("./PageDemonstration.tsx").then((m) => ({ default: m.PageDemonstration })))
  : undefined;

export const chargerProfilPrepare = PAGE_DEMONSTRATION_DISPONIBLE
  ? () => import("./profil-prepare.ts").then((m) => m.lireProfilPrepare())
  : undefined;

export const chargerLeconsPreparees = PAGE_DEMONSTRATION_DISPONIBLE
  ? () => import("./lecons-preparees.ts").then((m) => m.lireLeconsPreparees())
  : undefined;
