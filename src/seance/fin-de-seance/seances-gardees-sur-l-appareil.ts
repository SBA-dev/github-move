import { type CorpsDeLaSeance, estUnCorpsDeSeance } from "./corps-de-la-seance.ts";

const BASE = "savanturier-seances-gardees";
const MAGASIN = "seances-terminees";

type Garde = { readonly parent: string; readonly corps: CorpsDeLaSeance };

function estUneGarde(valeur: unknown): valeur is Garde {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { parent, corps } = valeur as Record<string, unknown>;
  return typeof parent === "string" && estUnCorpsDeSeance(corps);
}

function ouvrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const demande = indexedDB.open(BASE, 1);
    demande.onupgradeneeded = () => demande.result.createObjectStore(MAGASIN);
    demande.onsuccess = () => resolve(demande.result);
    demande.onerror = () => reject(demande.error);
  });
}

async function dansLeMagasin<T>(mode: IDBTransactionMode, operation: (magasin: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const base = await ouvrir();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = base.transaction(MAGASIN, mode);
      const demande = operation(transaction.objectStore(MAGASIN));
      transaction.oncomplete = () => resolve(demande.result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    base.close();
  }
}

/**
 * Les séances terminées que le serveur n'a pas pu enregistrer, rangées par parent connecté et par identifiant de séance
 * (une séance renvoyée deux fois n'est gardée qu'une fois). Effacées à la déconnexion.
 * Un stockage indisponible (navigation privée) ne bloque jamais l'application.
 */
export class SeancesGardeesSurLAppareil {
  /** Rend `false` si l'appareil n'a pas pu la garder. */
  async garder(parent: string, corps: CorpsDeLaSeance): Promise<boolean> {
    try {
      await dansLeMagasin("readwrite", (magasin) => magasin.put({ parent, corps }, corps.seance));
      return true;
    } catch {
      return false;
    }
  }

  async lire(parent: string): Promise<readonly CorpsDeLaSeance[]> {
    try {
      const gardes = await dansLeMagasin<unknown[]>("readonly", (magasin) => magasin.getAll());
      return gardes.filter(estUneGarde).filter((garde) => garde.parent === parent).map((garde) => garde.corps);
    } catch {
      return [];
    }
  }

  async retirer(seance: string): Promise<void> {
    try {
      await dansLeMagasin("readwrite", (magasin) => magasin.delete(seance));
    } catch {
      // La séance sera simplement renvoyée une fois de plus : le serveur ne la compte qu'une fois.
    }
  }

  async effacer(): Promise<void> {
    try {
      await dansLeMagasin("readwrite", (magasin) => magasin.clear());
    } catch {
      // Rien à effacer si le stockage est indisponible.
    }
  }
}
