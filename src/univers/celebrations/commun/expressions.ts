import { fenetre } from "./courbes.ts";

/** À partir de l'instant `t`, le personnage prend l'expression `emo`. */
export type ChangementDExpression<Emo extends string> = { readonly t: number; readonly emo: Emo };
export type Expression<Emo extends string> = { readonly emo: Emo; readonly prec: Emo; readonly u: number };

/** L'expression à l'instant `t` : l'expression en cours, la précédente et l'avancement du fondu de l'une à l'autre. */
export function expressionA<Emo extends string>(expressions: readonly ChangementDExpression<Emo>[], t: number): Expression<Emo> {
  const premiere = expressions[0];
  if (!premiere) throw new Error("Une scène de célébration a au moins une expression");
  let courante = premiere, precedente: typeof premiere | null = null;
  for (const e of expressions) {
    if (e.t > t) continue;
    precedente = courante === e ? precedente : courante;
    courante = e;
  }
  const u = precedente && precedente !== courante ? fenetre(t, courante.t, .14) : 1;
  return { emo: courante.emo, prec: precedente ? precedente.emo : courante.emo, u };
}
