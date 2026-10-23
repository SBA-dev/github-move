import { useCallback, useEffect, useState } from "react";

export type EcranSimple = "accueil" | "demonstration" | "espace-parent";

export type Lieu =
  | { readonly ecran: EcranSimple }
  | { readonly ecran: "lecon"; readonly leconId: string }
  | { readonly ecran: "seance"; readonly leconId: string; readonly exercice?: number };

export type Ecran = Lieu["ecran"];

export type Destination = EcranSimple | Lieu;

const CHEMINS: Readonly<Record<EcranSimple, string>> = {
  "accueil": "/",
  "demonstration": "/demonstration",
  "espace-parent": "/espace-parent",
};

const PAGE_D_UNE_LECON = /^\/lecon\/([^/]+)(?:\/(seance)(?:\/(\d+))?)?\/?$/;

function enLieu(destination: Destination): Lieu {
  return typeof destination === "string" ? { ecran: destination } : destination;
}

function cheminDe(lieu: Lieu): string {
  switch (lieu.ecran) {
    case "lecon":
      return `/lecon/${encodeURIComponent(lieu.leconId)}`;
    case "seance":
      return `/lecon/${encodeURIComponent(lieu.leconId)}/seance${lieu.exercice === undefined ? "" : `/${lieu.exercice}`}`;
    default:
      return CHEMINS[lieu.ecran];
  }
}

function lieuDe(chemin: string): Lieu {
  const ecranSimple = (Object.keys(CHEMINS) as EcranSimple[]).find((ecran) => CHEMINS[ecran] === chemin);
  if (ecranSimple) return { ecran: ecranSimple };
  const [, identifiant, seance, exercice] = PAGE_D_UNE_LECON.exec(chemin) ?? [];
  if (identifiant === undefined) return { ecran: "accueil" };
  try {
    const leconId = decodeURIComponent(identifiant);
    if (seance === undefined) return { ecran: "lecon", leconId };
    return exercice === undefined ? { ecran: "seance", leconId } : { ecran: "seance", leconId, exercice: Number(exercice) };
  } catch {
    return { ecran: "accueil" };
  }
}

function profondeurCourante(): number {
  const etat: unknown = history.state;
  const profondeur = (etat as { profondeur?: unknown } | null)?.profondeur;
  return typeof profondeur === "number" ? profondeur : 0;
}

export function useNavigation() {
  const [lieu, setLieu] = useState<Lieu>(() => lieuDe(location.pathname));
  const [profondeur, setProfondeur] = useState(profondeurCourante);
  const [viaRetour, setViaRetour] = useState(false);

  useEffect(() => {
    const surRetour = () => {
      setLieu(lieuDe(location.pathname));
      setProfondeur(profondeurCourante());
      setViaRetour(true);
    };
    addEventListener("popstate", surRetour);
    return () => removeEventListener("popstate", surRetour);
  }, []);

  const aller = useCallback((destination: Destination) => {
    const suivant = enLieu(destination);
    if (cheminDe(suivant) === location.pathname) return;
    const suivante = profondeurCourante() + 1;
    history.pushState({ profondeur: suivante }, "", cheminDe(suivant));
    setLieu(suivant);
    setProfondeur(suivante);
    setViaRetour(false);
  }, []);

  const remplacer = useCallback((destination: Destination) => {
    const suivant = enLieu(destination);
    history.replaceState({ profondeur: profondeurCourante() }, "", cheminDe(suivant));
    setLieu(suivant);
    setViaRetour(false);
  }, []);

  const revenir = useCallback(() => history.back(), []);

  return { lieu, retourPossible: profondeur > 0, viaRetour, aller, remplacer, revenir };
}
