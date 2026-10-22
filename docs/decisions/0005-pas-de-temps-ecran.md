# 0005 : Pas de limite de temps d'écran

**Statut** : Acceptée · 2026-10-22

## Contexte

L'application actuelle propose un réglage « temps d'écran maximum » par jour. Au-delà, une pause s'affiche et un adulte peut accorder 10 minutes de plus.

## Décision

**Pas de temps d'écran** dans l'application. Le terme ne fait pas partie du domaine (voir `docs/domain/glossaire.md`).

## Conséquences

- Aucun contexte ne porte de limite de durée de jeu.
- Le réglage, l'écran de pause et les « 10 minutes de plus » ont été retirés de `app/` (legacy), et ne seront pas repris dans la nouvelle application.
- Le temps joué reste compté, seulement pour informer le parent dans le rapport de la semaine (« environ 25 minutes »). Ce n'est pas une limite.
