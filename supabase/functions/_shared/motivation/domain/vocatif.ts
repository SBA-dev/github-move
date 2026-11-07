// Le prénom est un vocatif : sans prénom, on retire aussi l'espace ou la virgule qui l'introduit.
export function vocatif(prenom?: string): string {
  return prenom === undefined ? "" : ` ${prenom}`;
}

export function vocatifApresVirgule(prenom?: string): string {
  return prenom === undefined ? "" : `, ${prenom}`;
}
