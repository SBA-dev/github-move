import { createContext, useContext } from "react";

/** Vrai tant que la voix dit quelque chose (consigne, question, choix, mot à écouter, relectures comprises). */
export const ContexteDeLaLecture = createContext(false);

export const useLectureEnCours = () => useContext(ContexteDeLaLecture);
