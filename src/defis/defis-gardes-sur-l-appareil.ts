import { type CorpsDuDefi, estUnCorpsDeDefi } from "./corps-du-defi.ts";

const BASE = "savanturier-defis-gardes";
const MAGASIN = "defis-termines";

type Garde = { readonly parent: string; readonly corps: CorpsDuDefi };

function estUneGarde(valeur: unknown): valeur is Garde {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { parent, corps } = valeur as Record<string, unknown>;
  return typeof parent === "string" && estUnCorpsDeDefi(corps);
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
 * Les défis terminés que le serveur n'a pas pu enregistrer, rangés par parent connecté et par identifiant de défi
 * (un défi renvoyé deux fois n'est gardé qu'une fois). Effacés à la déconnexion.
 * Un stockage indisponible (navigation privée) ne bloque jamais l'application.
 */
export class DefisGardesSurLAppareil {
  /** Rend `false` si l'appareil n'a pas pu le garder. */
  async garder(parent: string, corps: CorpsDuDefi): Promise<boolean> {
    try {
      await dansLeMagasin("readwrite", (magasin) => magasin.put({ parent, corps }, corps.id));
      return true;
    } catch {
      return false;
    }
  }

  async lire(parent: string): Promise<readonly CorpsDuDefi[]> {
    try {
      const gardes = await dansLeMagasin<unknown[]>("readonly", (magasin) => magasin.getAll());
      return gardes.filter(estUneGarde).filter((garde) => garde.parent === parent).map((garde) => garde.corps);
    } catch {
      return [];
    }
  }

  async retirer(defi: string): Promise<void> {
    try {
      await dansLeMagasin("readwrite", (magasin) => magasin.delete(defi));
    } catch {
      // Le défi sera simplement renvoyé une fois de plus : le serveur ne le compte qu'une fois.
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
