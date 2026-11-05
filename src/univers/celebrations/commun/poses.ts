import { type Courbe, lerp } from "./courbes.ts";

/** Une image clé : à l'instant `t`, le personnage est dans la pose `p`, atteinte avec la courbe `e`. */
export type ImageCle<P> = { readonly t: number; readonly e: Courbe; readonly p: P };
export type ImagePartielle<P> = { readonly t: number; readonly e: Courbe; readonly p: Partial<P> };

/** Chaque image clé reprend la pose de la précédente, modifiée par ce qu'elle change : la première part du repos. */
export function compiler<P>(repos: P, liste: readonly ImagePartielle<P>[]): readonly ImageCle<P>[] {
  let precedente = repos;
  return liste.map(({ t, e, p }) => {
    precedente = { ...precedente, ...p };
    return { t, e, p: precedente };
  });
}

/** La pose à l'instant `t`, interpolée entre les deux images clés qui l'encadrent. */
export function poseA<K extends string>(repos: Record<K, number>, poses: readonly ImageCle<Record<K, number>>[], t: number): Record<K, number> {
  const premiere = poses[0];
  if (!premiere || t <= premiere.t) return premiere?.p ?? repos;
  const cles = Object.keys(repos) as K[];
  for (let i = 1; i < poses.length; i++) {
    const k = poses[i];
    const a = poses[i - 1];
    if (!k || !a || t > k.t) continue;
    const u = k.e((t - a.t) / (k.t - a.t));
    const r = { ...repos };
    for (const c of cles) r[c] = lerp(a.p[c], k.p[c], u);
    return r;
  }
  return poses[poses.length - 1]?.p ?? repos;
}
