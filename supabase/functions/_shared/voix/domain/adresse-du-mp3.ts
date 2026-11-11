import type { Allure } from "./allure.ts";

export function adresseDuMp3(cle: string, empreinte: string, allure: Allure): string {
  return allure === "lente" ? `/voix/${cle}-lente-${empreinte}.mp3` : `/voix/${cle}-${empreinte}.mp3`;
}
