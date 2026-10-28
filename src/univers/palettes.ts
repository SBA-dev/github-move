import type { CleUnivers } from "@domain/motivation";

export type Palette = {
  readonly ciel: readonly [string, string];
  readonly lointain: string;
  readonly collines: readonly [string, string, string];
  readonly arbres: string;
  readonly soleil: string;
  readonly principale: string;
  readonly foncee: string;
};

export const PALETTES: Readonly<Record<CleUnivers, Palette>> = {
  animaux: { ciel: ["#BFE5FF", "#FFF3DF"], lointain: "#B8CCE8", collines: ["#A8D9A4", "#6CBF84", "#3F9A63"], arbres: "#2E7E52", soleil: "#FFD978", principale: "#C03E29", foncee: "#9E3322" },
  princesse: { ciel: ["#E7D9FF", "#FFE6F1"], lointain: "#D7C8F0", collines: ["#F2C9E4", "#D8A6E3", "#A97FD6"], arbres: "#7E56BC", soleil: "#FFE3F0", principale: "#A23BB8", foncee: "#7C2690" },
  sports: { ciel: ["#BDE3FF", "#F0FAFF"], lointain: "#BFD7EE", collines: ["#A5DE8F", "#63C46A", "#2F9A4C"], arbres: "#237A3B", soleil: "#FFF0A0", principale: "#1F63D8", foncee: "#164BA8" },
  police: { ciel: ["#C9D6FF", "#EEF2FF"], lointain: "#B6C3E6", collines: ["#B9C9EC", "#8AA2DA", "#5A75BF"], arbres: "#41589E", soleil: "#FFFFFF", principale: "#3450C8", foncee: "#253B9C" },
  pompier: { ciel: ["#FFC9A8", "#FFF0D9"], lointain: "#F3C2A6", collines: ["#F2C08F", "#E39561", "#C06A3E"], arbres: "#9C4A2A", soleil: "#FFE08A", principale: "#C2341B", foncee: "#931F0C" },
  danse: { ciel: ["#F3D2FF", "#FFF0F7"], lointain: "#E6C8F2", collines: ["#F4BEDD", "#DE93C8", "#B565AE"], arbres: "#934C94", soleil: "#FFE7F4", principale: "#7A35C8", foncee: "#5A1F9E" },
};
