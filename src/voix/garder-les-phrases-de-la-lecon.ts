import { useEffect } from "react";
import type { Lecon } from "@domain/catalogue";
import { adressesDesPhrasesDeLaLecon } from "@application/voix/adresses-des-phrases-de-la-lecon";
import { RepertoireDesPhrasesEnregistreesDuNavigateur } from "./repertoire-des-phrases-enregistrees-du-navigateur.ts";

const CACHE_DES_VOIX = "savanturier-voix";

/** Demande au navigateur de garder les MP3 de la leçon pour la lire hors ligne. Sans cache ou sans réseau : rien ne se voit. */
async function garderLesPhrasesDeLaLecon(lecon: Lecon): Promise<void> {
  try {
    const repertoire = new RepertoireDesPhrasesEnregistreesDuNavigateur();
    await repertoire.charger();
    const adresses = adressesDesPhrasesDeLaLecon(lecon, repertoire);
    if (adresses.length === 0) return;
    const cache = await caches.open(CACHE_DES_VOIX);
    await cache.addAll(adresses);
  } catch {
    // Hors ligne ou cache indisponible : la voix lira depuis le réseau, ou à la voix de l'appareil.
  }
}

export function useGarderLesPhrasesDeLaLecon(lecon: Lecon): void {
  useEffect(() => {
    void garderLesPhrasesDeLaLecon(lecon);
  }, [lecon]);
}
