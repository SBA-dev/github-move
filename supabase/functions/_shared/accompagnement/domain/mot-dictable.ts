const TOUCHES_DU_CLAVIER = new Set("azertyuiopqsdfghjklmwxcvbnéèêàçùëïôâîûœ");
const CARACTERES_DEJA_ECRITS = new Set(" '’-.");
const NOMBRE_MAXIMAL_DE_LETTRES_DICTEES = 18;

export function estUnMotDictable(mot: string): boolean {
  const lettres = lettresAEcrire(mot);
  return lettres.length <= NOMBRE_MAXIMAL_DE_LETTRES_DICTEES &&
    lettres.every((lettre) => TOUCHES_DU_CLAVIER.has(lettre));
}

function lettresAEcrire(mot: string): string[] {
  return Array.from(mot.toLowerCase()).filter((caractere) => !CARACTERES_DEJA_ECRITS.has(caractere));
}
