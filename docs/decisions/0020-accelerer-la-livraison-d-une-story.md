# 0020 : Accélérer la livraison d'une story (E2E, review, cadrage)

**Statut** : Acceptée · 2026-10-24 · précise 0006, 0010 et 0017

## Contexte

Mesure de la vague 1 (#20 et #25), faite sur les transcripts des deux sessions d'équipe, environ 3 h 40 chacune à la mesure :

| Étape | #20 | #25 |
|---|---|---|
| Domaine + critères | 0 (faits au lot 3) | 23 min |
| Validation PO | 0 | 22 min, bloquantes |
| TDD | 61 min | 9 min |
| Câblage | 16 min | 5 min |
| Review | 16 min | 11 min |
| **E2E** | **67 à 77 min** | **153 min** |
| Intégration de `main` et merge | 56 min (surtout une 2e non-régression) | 4 min |

- **L'E2E est le goulot** : l'`e2e-tester` tourne 116 min (#20) et 149 min (#25). Il attend Playwright, pas le modèle.
- Une **non-régression complète** prend 30 à 60 min et s'allonge à chaque story livrée (708, puis 794, puis 850 cas). Elle était relancée à chaque fois que `main` bougeait. Le merge de #19 a coûté environ 1 h à #20 et fait jeter un cycle E2E de 29 min à #25.
- Les runs lancés en arrière-plan étaient suivis par des `sleep` de 10 min (55 min cumulées sur #20).
- Sans `fullyParallel`, Playwright exécute un fichier `.feature` sur un seul worker. Mesure sur #24, 28 cas, projet `telephone` : 7,2 min ; même temps que les deux projets (56 cas, 7,7 min), car le temps est de la latence réseau vers Supabase, pas du calcul.
- Le suffixe qui isole les données de test valait `<projet><index du worker>`, identique d'une exécution à l'autre : deux équipes qui lançaient leurs E2E en même temps contre `savanturier-dev` créaient et supprimaient les mêmes parents de test (404 à la suppression, 409 au rattachement, échecs « flaky »).
- La première review a rendu « À CORRIGER » pour les 8 stories livrées par `/feature` qui ont un journal de review (#11, #12, #16 à #19, #23, #24), avec 3 cycles pour #16 et #17.
- Le modèle n'est pas en cause : `test-writer`, `implementer` et `e2e-tester` tournent déjà sur Sonnet ; l'orchestrateur Opus n'est actif que 14 % à 33 % du temps.

## Décision

1. **Une seule non-régression complète par story**, sur les deux projets, juste avant de passer la PR en « prête », après la dernière intégration de `main`. Elle n'est refaite sous le verrou `merge` que si `main` a bougé depuis. Pendant la mise au point, on ne lance que le périmètre de la story : `@issue-<n>`, les `@depend-de-<n>` levés, et les stories livrées du même bounded context que les fichiers modifiés.
2. **Scénarios en parallèle** : `fullyParallel: true` et 3 workers par défaut (`E2E_WORKERS` pour changer). Pendant la mise au point, seul le projet `telephone` (360 px, le plus contraint) tourne. Le suffixe des données de test inclut un jeton tiré par processus worker : deux exécutions simultanées ne partagent plus de données.
3. **Attendre un run sans `sleep` long** : outil `Monitor`, ou boucle qui vérifie toutes les 30 s le résumé final.
4. **Un run E2E n'est jamais interrompu** parce que `main` a bougé : on le finit, et on n'intègre `main` qu'avant la non-régression complète.
5. **Review plus tôt** : revue intermédiaire de `mr-reviewer` (mode delta) à la fin de chaque bloc de comportements TDD, et auto-relecture de l'`implementer` avec la liste des bloquants avant de rendre la main. La review finale se concentre sur le câblage et la cohérence d'ensemble.
6. **Cadrer la vague suivante pendant la vague en cours** : domaine et scénarios des stories qui vont devenir prêtes sont préparés à l'avance et validés dans la ⛔ n°1 groupée, comme aux lots 2 et 3.

## Options écartées

- **Plus de 3 workers** : sur les 4 cœurs du conteneur, 4 workers saturent le serveur de dev et les navigateurs (6 dépassements de délai sur 56 cas, pour un gain de 1,3×).
- **Servir le front en build de production pour les E2E** : moins de calcul, mais le service worker s'enregistre et la page de démonstration disparaît en production ; le comportement testé changerait.
- **Passer les agents restants (orchestrateur, `domain-modeler`, `po-acceptance`, `mr-reviewer`) sur Sonnet** : ils totalisent 20 à 30 min par story ; le gain de temps serait faible et la qualité de la review conditionne le nombre de cycles. À évaluer séparément, pour le coût.
- **Lancer la non-régression sur un seul projet** : la tablette reste couverte une fois par story ; les écarts de mise en page entre 360 px et 820 px se voient là.

## Conséquences

- Une régression dans un autre contexte que celui de la story n'est vue qu'à la non-régression finale : la corriger peut demander un cycle de plus à ce moment-là.
- Les steps E2E doivent rester indépendants **à l'intérieur d'un même fichier** : aucun état partagé entre scénarios hors du suffixe de `famille`.
- Les mesures de `docs/graphe/nombre-d-equipes.md` de la vague suivante diront si le gain est au rendez-vous (durée de l'étape E2E, cycles de review).
