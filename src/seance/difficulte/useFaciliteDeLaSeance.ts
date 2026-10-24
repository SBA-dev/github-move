import { useEffect, useState } from "react";
import type { Lecon } from "@domain/catalogue";
import { lireLaFaciliteDuProfil } from "./lecture-de-l-historique-de-calcul-supabase.ts";

const FACILITE_NORMALE = 1;

function tireDesOperations(lecon: Lecon): boolean {
  return lecon.exercices.some(({ type }) => type === "calcul" || type === "fluence" || type === "addition");
}

/** La facilité des nombres tirés ; `undefined` tant que l'historique de l'enfant se lit. Seule une leçon de calcul le lit. */
export function useFaciliteDeLaSeance(profilId: string, lecon: Lecon): number | undefined {
  const aLire = tireDesOperations(lecon);
  const [lue, setLue] = useState<number | undefined>();
  useEffect(() => {
    if (!aLire) return;
    let annule = false;
    void lireLaFaciliteDuProfil(profilId).then((facilite) => {
      if (!annule) setLue(facilite);
    });
    return () => {
      annule = true;
    };
  }, [aLire, profilId]);
  return aLire ? lue : FACILITE_NORMALE;
}
