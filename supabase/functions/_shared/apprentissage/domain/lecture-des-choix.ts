export function lectureDesChoix(choix: readonly string[]): string | undefined {
  if (choix.length < 2) return undefined;
  const dernier = choix[choix.length - 1];
  const debut = choix.slice(0, -1).join(", ");
  return `Est-ce ${debut}, ou ${dernier} ?`;
}
