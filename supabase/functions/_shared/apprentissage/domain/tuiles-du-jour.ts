export type EntreesDesTuilesDuJour = Readonly<{
  nombreDeQuestionsDues: number | undefined;
  testDeDepartAProposer: boolean;
}>;

export type TuileDuJour =
  | { genre: "revision"; nombreDeQuestionsDues: number }
  | { genre: "testDeDepart" };

export function tuilesDuJour(entrees: EntreesDesTuilesDuJour): TuileDuJour[] {
  const { nombreDeQuestionsDues, testDeDepartAProposer } = entrees;
  const revision: TuileDuJour[] = nombreDeQuestionsDues ? [{ genre: "revision", nombreDeQuestionsDues }] : [];
  const testDeDepart: TuileDuJour[] = testDeDepartAProposer ? [{ genre: "testDeDepart" }] : [];
  return [...revision, ...testDeDepart];
}
