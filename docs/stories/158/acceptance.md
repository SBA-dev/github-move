# Story #158 : l'écusson à la place des étoiles sur le dessin fixe d'Agent Max

## Contexte

Le dessin fixe d'Agent Max livré par #96 porte deux étoiles dorées à cinq branches, que les décisions 106.34 et 106.35 interdisent pour ne pas les confondre avec l'Étoile de récompense.
Le PO a retenu la reco A de #106.39 : le dessin fixe porte le même écusson bleu et blanc sans étoile que la célébration (106e) et #130/#131.

## Objectif

En tant qu'enfant de l'univers « Police », je veux que le dessin d'Agent Max ne montre aucune étoile, afin de ne pas confondre son insigne avec l'Étoile de récompense.

## Règle

| Règle | Scénarios |
|---|---|
| Le dessin fixe d'Agent Max porte l'écusson bleu et blanc sans étoile, sur la casquette et sur la chemise. Aucune étoile à cinq branches n'y figure, à aucune taille. | `features/96-refonte-visuelle.feature` : Plan « Dans l'univers « <univers> », <personnage guide> a <son dessin> » (exemple Police), et « Dans « Qui joue ? », chaque profil enfant garde le dessin de son personnage guide » |

## Scénario modifié

`features/96-refonte-visuelle.feature`, Plan du Scénario « Dans l'univers « <univers> », <personnage guide> a <son dessin> », exemple Police (seule la colonne « son dessin » change, les autres lignes sont réalignées) :

- Avant : `le dessin validé : casquette de police à étoile dorée, chemise bleue et pantalon`
- Après : `le dessin validé : casquette de police à écusson bleu et blanc, chemise bleue et pantalon, sans étoile`

Un commentaire au-dessus du Plan renvoie à #158 et à la reco A de #106.39. Aucun tag ajouté : les scénarios restent `@issue-96`.

## Scénarios rejoués

Les deux seuls scénarios qui inspectent le dessin d'Agent Max (vérifié par `data-signe` dans `features/steps/` : seule `refonte-visuelle.steps.ts` le vérifie pour Agent Max) :

1. Plan « Dans l'univers « <univers> », <personnage guide> a <son dessin> », exemple Police.
2. « Dans « Qui joue ? », chaque profil enfant garde le dessin de son personnage guide » (`le profil enfant de Léa montre le dessin validé d'Agent Max`).

Les deux passent par la même vérification du dessin validé d'Agent Max.

## Ce que vérifiera le step

- Signes présents : `casquette-de-police`, `ecusson` (sur la chemise et sur la casquette), `chemise-bleue`, `pantalon`.
- Signe absent : `etoile-doree`.

## Hors périmètre

- La scène de la célébration d'Agent Max (#106, 106e).
- Tout autre personnage.

## Questions ouvertes

Aucune.
