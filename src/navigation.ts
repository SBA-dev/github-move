import { useCallback, useEffect, useState } from "react";

export type Ecran = "accueil" | "demonstration" | "espace-parent" | "lecon";
type Destination = Exclude<Ecran, "lecon">;

const CHEMINS: Readonly<Record<Destination, string>> = {
  "accueil": "/",
  "demonstration": "/demonstration",
  "espace-parent": "/espace-parent",
};

const PREFIXE_DE_LA_LECON = "/lecon/";

function leconIdDe(chemin: string): string | undefined {
  if (!chemin.startsWith(PREFIXE_DE_LA_LECON)) return undefined;
  try {
    return decodeURIComponent(chemin.slice(PREFIXE_DE_LA_LECON.length)) || undefined;
  } catch {
    return undefined;
  }
}

function ecranDe(chemin: string): Ecran {
  if (leconIdDe(chemin) !== undefined) return "lecon";
  const trouve = (Object.keys(CHEMINS) as Destination[]).find((ecran) => CHEMINS[ecran] === chemin);
  return trouve ?? "accueil";
}

function profondeurCourante(): number {
  const etat: unknown = history.state;
  const profondeur = (etat as { profondeur?: unknown } | null)?.profondeur;
  return typeof profondeur === "number" ? profondeur : 0;
}

export function useNavigation() {
  const [chemin, setChemin] = useState(() => location.pathname);
  const [profondeur, setProfondeur] = useState(profondeurCourante);

  useEffect(() => {
    const surRetour = () => {
      setChemin(location.pathname);
      setProfondeur(profondeurCourante());
    };
    addEventListener("popstate", surRetour);
    return () => removeEventListener("popstate", surRetour);
  }, []);

  const aller = useCallback((destination: Destination) => {
    if (CHEMINS[destination] === location.pathname) return;
    const suivante = profondeurCourante() + 1;
    history.pushState({ profondeur: suivante }, "", CHEMINS[destination]);
    setChemin(CHEMINS[destination]);
    setProfondeur(suivante);
  }, []);

  const remplacer = useCallback((destination: Destination) => {
    history.replaceState({ profondeur: profondeurCourante() }, "", CHEMINS[destination]);
    setChemin(CHEMINS[destination]);
  }, []);

  const revenir = useCallback(() => history.back(), []);

  return { ecran: ecranDe(chemin), leconId: leconIdDe(chemin), retourPossible: profondeur > 0, aller, remplacer, revenir };
}
