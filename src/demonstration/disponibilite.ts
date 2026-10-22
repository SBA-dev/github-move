// Page réservée aux tests du lot 1, retirée au lot 3 (docs/stories/lot-1-decisions.md, décision 1).
export const PAGE_DEMONSTRATION_DISPONIBLE: boolean = import.meta.env.DEV ||
  import.meta.env.VITE_PAGE_DEMONSTRATION === "1";
