import { type CorpsDuTestDeDepart, estUnCorpsDuTestDeDepart } from "./corps-du-test-de-depart.ts";

const BASE = "savanturier-tests-de-depart-gardes";
const MAGASIN = "tests-de-depart-termines";

export type TestDeDepartGarde = {
  readonly parent: string;
  readonly corps: CorpsDuTestDeDepart;
  /** Les leçons que le navigateur a trouvées réussies : le parcours les montre avant l'enregistrement par le serveur. */
  readonly leconsReussies: readonly string[];
};

function estUneGarde(valeur: unknown): valeur is TestDeDepartGarde {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { parent, corps, leconsReussies } = valeur as Record<string, unknown>;
  return typeof parent === "string" && estUnCorpsDuTestDeDepart(corps) && Array.isArray(leconsReussies) &&
    leconsReussies.every((lecon) => typeof lecon === "string");
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
 * Les tests de départ terminés que le serveur n'a pas pu enregistrer, rangés par parent connecté et par identifiant de test
 * (un test renvoyé deux fois n'est gardé qu'une fois). Effacés à la déconnexion.
 * Un stockage indisponible (navigation privée) ne bloque jamais l'application.
 */
export class TestsDeDepartGardesSurLAppareil {
  /** Rend `false` si l'appareil n'a pas pu le garder. */
  async garder(parent: string, corps: CorpsDuTestDeDepart, leconsReussies: ReadonlySet<string>): Promise<boolean> {
    try {
      const garde: TestDeDepartGarde = { parent, corps, leconsReussies: [...leconsReussies] };
      await dansLeMagasin("readwrite", (magasin) => magasin.put(garde, corps.test));
      return true;
    } catch {
      return false;
    }
  }

  async lire(parent: string): Promise<readonly TestDeDepartGarde[]> {
    try {
      const gardes = await dansLeMagasin<unknown[]>("readonly", (magasin) => magasin.getAll());
      return gardes.filter(estUneGarde).filter((garde) => garde.parent === parent);
    } catch {
      return [];
    }
  }

  async retirer(test: string): Promise<void> {
    try {
      await dansLeMagasin("readwrite", (magasin) => magasin.delete(test));
    } catch {
      // Le test sera simplement renvoyé une fois de plus : le serveur ne le compte qu'une fois.
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
