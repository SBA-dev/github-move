# 0005 : Pas de limite de temps d'écran

**Statut** : Acceptée · 2026-10-22

## Contexte

L'application actuelle propose un réglage « temps d'écran maximum » par jour. Au-delà, une pause s'affiche et un adulte peut accorder 10 minutes de plus.

## Décision

**Pas de temps d'écran** dans l'application. Le terme ne fait pas partie du domaine (voir `docs/domain/glossaire.md`).

## Conséquences

- Aucun contexte ne porte de limite de durée de jeu.
- Le réglage existe encore dans `app/` (legacy). Il n'est pas repris dans la nouvelle application. Son retrait de `app/` attend la décision du PO (voir `docs/feuille-de-route.md`).
