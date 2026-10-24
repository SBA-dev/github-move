import { MotIncomplet } from "./erreurs.ts";

const CARACTERES_DEJA_ECRITS = [" ", "'", "’", "-", "."];

export type CaseAEcrire = Readonly<{ genre: "aEcrire" }>;
export type CaractereDejaEcrit = Readonly<{ genre: "dejaEcrit"; caractere: string }>;
export type CaseDuMot = CaseAEcrire | CaractereDejaEcrit;

export type LettreFausse = Readonly<{ position: number; lettre: string }>;

export type CorrectionDuMot = Readonly<{
  juste: boolean;
  lettresFausses: readonly LettreFausse[];
  lettresGardees: readonly string[];
}>;

export class MotAEcrire {
  private constructor(private readonly texte: string) {}

  static de(texte: string): MotAEcrire {
    return new MotAEcrire(texte);
  }

  cases(): CaseDuMot[] {
    return [...this.texte].map((caractere) =>
      CARACTERES_DEJA_ECRITS.includes(caractere) ? { genre: "dejaEcrit", caractere } : { genre: "aEcrire" }
    );
  }

  lettresAEcrire(): string[] {
    return [...this.texte].filter((caractere) => !CARACTERES_DEJA_ECRITS.includes(caractere))
      .map((lettre) => lettre.toLowerCase());
  }

  corriger(lettres: readonly string[]): CorrectionDuMot {
    const attendues = this.lettresAEcrire();
    if (lettres.length !== attendues.length) throw new MotIncomplet();
    const ecrites = lettres.map((lettre) => lettre.toLowerCase());
    const lettresFausses = ecrites.flatMap((lettre, position) =>
      lettre === attendues[position] ? [] : [{ position, lettre }]
    );
    const premiereFausse = lettresFausses[0]?.position ?? ecrites.length;
    return { juste: lettresFausses.length === 0, lettresFausses, lettresGardees: ecrites.slice(0, premiereFausse) };
  }
}
