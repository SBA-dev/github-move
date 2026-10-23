export type ChoixDeSeance =
  | Readonly<{ genre: "complete" }>
  | Readonly<{ genre: "unExercice"; position: number }>;

export const ChoixDeSeance = {
  complete: (): ChoixDeSeance => ({ genre: "complete" }),
  unExercice: (position: number): ChoixDeSeance => ({ genre: "unExercice", position }),
};
