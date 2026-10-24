import {
  EssaisDeReinitialisationModifiesEnMemeTemps,
  type RegistreDesEssaisDeReinitialisation,
} from "../application/ports/registre-des-essais-de-reinitialisation.ts";
import type { AdresseEmail } from "../domain/adresse-email.ts";
import { EssaisDeReinitialisation } from "../domain/essais-de-reinitialisation.ts";

type EssaisVersionnes = { essais: EssaisDeReinitialisation; version: number };
type Stockage = { parAdresse: Map<string, EssaisVersionnes>; conflitsAProvoquer: number };

/** Une instance représente une requête : elle retient la version lue de chaque adresse, comme l'adaptateur Supabase. */
export class RegistreDesEssaisDeReinitialisationEnMemoire implements RegistreDesEssaisDeReinitialisation {
  private readonly versionsLues = new Map<string, number>();
  enregistrements = 0;

  constructor(
    private readonly journal: string[] = [],
    private readonly stockage: Stockage = { parAdresse: new Map(), conflitsAProvoquer: 0 },
  ) {}

  /** Une autre requête sur les mêmes essais : elle ne connaît que les versions qu'elle a lues elle-même. */
  uneAutreRequete(): RegistreDesEssaisDeReinitialisationEnMemoire {
    return new RegistreDesEssaisDeReinitialisationEnMemoire(this.journal, this.stockage);
  }

  provoquerDesConflits(nombre: number): void {
    this.stockage.conflitsAProvoquer = nombre;
  }

  pourAdresse(adresse: AdresseEmail): Promise<EssaisDeReinitialisation> {
    this.journal.push("registre.lire");
    const cle = adresse.valeur.toLowerCase();
    const conserve = this.stockage.parAdresse.get(cle);
    if (!conserve) {
      this.versionsLues.delete(cle);
      return Promise.resolve(EssaisDeReinitialisation.nouveaux(adresse));
    }
    this.versionsLues.set(cle, conserve.version);
    return Promise.resolve(copie(conserve.essais));
  }

  enregistrer(essais: EssaisDeReinitialisation, maintenant: Date): Promise<void> {
    const cle = essais.adresse.valeur.toLowerCase();
    const conserve = this.stockage.parAdresse.get(cle);
    if (this.stockage.conflitsAProvoquer > 0 || conserve?.version !== this.versionsLues.get(cle)) {
      this.stockage.conflitsAProvoquer = Math.max(0, this.stockage.conflitsAProvoquer - 1);
      this.journal.push("registre.conflit");
      return Promise.reject(new EssaisDeReinitialisationModifiesEnMemeTemps());
    }
    this.journal.push("registre.enregistrer");
    this.enregistrements += 1;
    if (essais.estOublie(maintenant)) {
      this.stockage.parAdresse.delete(cle);
      this.versionsLues.delete(cle);
    } else {
      const version = (conserve?.version ?? 0) + 1;
      this.stockage.parAdresse.set(cle, { essais: copie(essais), version });
      this.versionsLues.set(cle, version);
    }
    return Promise.resolve();
  }

  conserves(): EssaisDeReinitialisation[] {
    return [...this.stockage.parAdresse.values()].map(({ essais }) => copie(essais));
  }
}

function copie(essais: EssaisDeReinitialisation): EssaisDeReinitialisation {
  return EssaisDeReinitialisation.reconstituer(
    essais.adresse,
    essais.essaisRates,
    essais.dernierRateLe,
    essais.bloqueJusquA,
  );
}
