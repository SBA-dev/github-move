import type { ExerciceTrous } from "../../../catalogue/domain/index.ts";

const EMPLACEMENT_DU_MOT = "…";
const FIN_DE_PHRASE = /(?<=[.!?])\s+/;

export type QuestionDeTrou = Readonly<{ enonce: string; motAttendu: string; candidats: readonly string[] }>;

export function questionsDeTrous(exercice: ExerciceTrous): QuestionDeTrou[] {
  return exercice.motsAttendus.map((motAttendu, rang) => ({
    enonce: phraseDuTrou(exercice, rang),
    motAttendu,
    candidats: candidatsDuTrou(exercice, motAttendu),
  }));
}

function candidatsDuTrou(exercice: ExerciceTrous, motAttendu: string): string[] {
  const candidats = [...exercice.distracteurs, ...exercice.motsAttendus].filter((mot) => mot !== motAttendu);
  return [...new Set(candidats)];
}

function phraseDuTrou(exercice: ExerciceTrous, rang: number): string {
  let rangDuTrou = 0;
  const texte = exercice.segments
    .map((segment) => {
      if (segment.type === "texte") return segment.texte;
      return rangDuTrou++ === rang ? EMPLACEMENT_DU_MOT : segment.motAttendu;
    })
    .join("");
  const phrase = texte.split(FIN_DE_PHRASE).find((morceau) => morceau.includes(EMPLACEMENT_DU_MOT));
  return (phrase ?? texte).trim();
}
