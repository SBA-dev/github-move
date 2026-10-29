import { createContext, useContext } from "react";
import type { CleUnivers } from "@domain/motivation";

/** L'univers du profil de l'enfant, pour les dessins qui s'habillent selon lui (animaux de la forêt tant qu'aucun n'est fourni). */
export const ContexteDeLUnivers = createContext<CleUnivers>("animaux");

export const useUnivers = () => useContext(ContexteDeLUnivers);
