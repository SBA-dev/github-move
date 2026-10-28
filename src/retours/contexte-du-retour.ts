import { createContext } from "react";
import type { RetourDeLaReponse } from "./retour-de-la-reponse.ts";

/** Le retour de la dernière réponse, lu par les éléments qui peuvent réagir (choix, étiquettes, clavier, mot). */
export const ContexteDuRetour = createContext<RetourDeLaReponse | undefined>(undefined);
