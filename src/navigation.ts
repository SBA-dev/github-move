import { useCallback, useEffect, useState } from "react";

export type Ecran = "accueil" | "demonstration" | "espace-parent";

const CHEMINS: Readonly<Record<Ecran, string>> = {
  "accueil": "/",
  "demonstration": "/demonstration",
  "espace-parent": "/espace-parent",
};

function ecranDe(chemin: string): Ecran {
  const trouve = (Object.keys(CHEMINS) as Ecran[]).find((ecran) => CHEMINS[ecran] === chemin);
  return trouve ?? "accueil";
}

function profondeurCourante(): number {
  const etat: unknown = history.state;
  const profondeur = (etat as { profondeur?: unknown } | null)?.profondeur;
  return typeof profondeur === "number" ? profondeur : 0;
}

export function useNavigation() {
  const [ecran, setEcran] = useState<Ecran>(() => ecranDe(location.pathname));
  const [profondeur, setProfondeur] = useState(profondeurCourante);

  useEffect(() => {
    const surRetour = () => {
      setEcran(ecranDe(location.pathname));
      setProfondeur(profondeurCourante());
    };
    addEventListener("popstate", surRetour);
    return () => removeEventListener("popstate", surRetour);
  }, []);

  const aller = useCallback((destination: Ecran) => {
    if (CHEMINS[destination] === location.pathname) return;
    const suivante = profondeurCourante() + 1;
    history.pushState({ profondeur: suivante }, "", CHEMINS[destination]);
    setEcran(destination);
    setProfondeur(suivante);
  }, []);

  const remplacer = useCallback((destination: Ecran) => {
    history.replaceState({ profondeur: profondeurCourante() }, "", CHEMINS[destination]);
    setEcran(destination);
  }, []);

  const revenir = useCallback(() => history.back(), []);

  return { ecran, retourPossible: profondeur > 0, aller, remplacer, revenir };
}
