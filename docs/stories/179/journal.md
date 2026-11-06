# Journal de la story #179 : étape E2E ambiguë entre #20 et #163

Correctif du code de test seulement, demandé par le PO pendant le gel de `main` (`2097ff2`, mise en ligne MEP.1 B).

## Cause

L'étape générique « Tom répond « … » à « … » » (`features/steps/calcul-pour-les-autres-stories.steps.ts`) servait à #23 sans filtre de tags.
playwright-bdd donne la priorité à une étape filtrée sur une étape sans filtre : l'étape de #20, filtrée, l'emportait donc sans ambiguïté.
Le commit `b2a16e9` (#163) lui a ajouté le filtre `not @issue-163` : les deux étapes, toutes deux filtrées, s'appliquaient alors aux scénarios de #20, et `bddgen` échouait dès que `@issue-20` était inclus.

## Correctif

Le filtre devient `@issue-23` : seule la feature de #23 utilise cette étape. #20 et #163 ont la leur.
Aucun texte de scénario, aucun code de production modifié.

## Preuve

`npx bddgen --tags "(@socle or <features des stories fermées>) and not @hors-106a"` (sans #13, #14, #38 et #45, encore ouvertes) :
- sur `main` `2097ff2` : `Multiple definitions matched scenario step` ;
- sur la branche : génération sans erreur, aucune autre étape ambiguë.

## E2E

En attente du verrou `base` (détenu par la non-régression de mise en ligne).

## Mesures

- Début : 2026-11-06 22:36 UTC. Correctif et preuve `bddgen` : environ 30 min.
- Cycles TDD : 1 (rouge sur `main`, vert sur la branche). Cycles de review : à venir. Cycles d'E2E : à venir.
- Intégrations de `main` : 0 (gelé).
