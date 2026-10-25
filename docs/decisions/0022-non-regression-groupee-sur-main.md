# 0022 : Non-régression complète groupée sur `main`, merges autorisés pour la vague

**Statut** : Acceptée · 2026-10-25 · précise 0017 et 0020

## Contexte

Mesures de la vague 1, faites depuis le tableau de bord d'avancement : temps de travail estimé à partir des écarts entre commits, coût en équivalent API.

| | 8 stories livrées une par une (#11, #12, #16 à #19, #23, #24) | 7 stories livrées en parallèle (#20, #21, #22, #25, #27, #58, #65) |
|---|---|---|
| Temps de travail moyen par story | 3,7 h | 4,9 h (+33 %) |
| Coût moyen par story | ≈ 21 $ | ≈ 40 $, plus ≈ 20 $ de coordination |
| Débit | 0,32 story/h | 0,35 story/h sur 24 h, 0,45 en journée |

- Le parallélisme fait gagner du débit, mais **chaque story demande un tiers de travail en plus**. Une grande partie vient de la non-régression complète relancée sous le verrou `merge` dès que `main` a bougé (décision 0020) : environ 1 h pour #20, et de nouveau pour #58. Avec 3 équipes, `main` bouge presque toujours entre `PRÊTE À MERGER` et le merge.
- Cette relance teste surtout ce que la story a déjà vérifié. Ce qui change, c'est la combinaison avec les stories mergées entre-temps, et elle est couverte par leur périmètre.
- **Ce qui freine le plus, ce sont les attentes du PO.** #27 et #58, prêtes le soir, ont attendu environ 7 h une autorisation de merge donnée story par story.

## Décision

1. **Merges autorisés pour la vague.** Le PO autorise les merges de toute la vague en cours (phrase du 2026-10-25 : « Applique les pistes pour gagner davantage »). Une équipe n'attend donc plus d'autorisation pour sa PR. Les autres conditions de merge ne changent pas : review APPROUVÉ, tout vert sur le dernier commit, verrou `merge`. Le PO peut retirer l'autorisation à tout moment. Les cadrages (⛔ n°1) restent validés par le PO.
2. **Sous le verrou `merge`, plus de non-régression complète.** La non-régression complète faite juste avant `PRÊTE À MERGER` reste obligatoire, une fois par story (0020). Si `main` a bougé depuis, l'équipe intègre `main` puis lance seulement :
   - tests unitaires, lint, format, typecheck et build ;
   - le **périmètre de sa story**, sur le projet `telephone` ;
   - le **périmètre de chaque story mergée depuis sa non-régression complète** (ses tags `@issue-<m>` et les stories livrées de son contexte).
3. **Une non-régression complète groupée sur `main`**, sur les deux projets, **après 3 merges** depuis la dernière, et **avant chaque pause** (le soir, ou quand plus aucune PR n'attend). C'est l'équipe qui vient de merger qui la lance sur `main` à jour, avant d'écrire `MERGÉE`. Elle écrit `MERGÉE` dès son merge fait, puis `NON-RÉGRESSION MAIN : OK` ou `KO` avec le rapport. Le responsable tient le compteur de merges dans le tableau de la vague.
4. **Une régression trouvée sur `main` est un signal d'arrêt** (`docs/graphe/nombre-d-equipes.md`) :
   - le responsable gèle le verrou `merge` ;
   - l'équipe de la story en cause (sinon celle qui vient de merger) écrit d'abord le test qui reproduit la régression, puis la corrige dans une PR `fix(#<n>)`, mergée en priorité ;
   - le parallélisme revient à 2 équipes pour la vague suivante.

## Options écartées

- **Garder la relance complète à chaque merge (0020)** : c'est l'option la plus sûre, mais elle coûte 30 à 60 min par story et s'allonge à chaque livraison.
- **Ne plus jamais lancer de non-régression complète sur `main`** : une régression entre deux contextes éloignés pourrait passer inaperçue jusqu'à la mise en ligne.
- **Grouper les merges en un seul train** (intégrer plusieurs PR ensemble, une seule vérification) : quand ça casse, on ne sait plus quelle story est en cause, et les PR dépendent les unes des autres.

## Conséquences

- On gagne environ 30 à 60 min par story mergée après un autre merge, et il n'y a plus d'attente de nuit pour l'autorisation de merge.
- Une régression peut atteindre `main` et y rester jusqu'à 3 merges. La non-régression groupée la retrouve, et la correction passe avant tout le reste.
- `main` peut être rouge entre deux non-régressions groupées : on ne met rien en ligne depuis `main` sans une non-régression complète verte sur le commit visé.
- À mesurer à la fin de la vague (`docs/graphe/nombre-d-equipes.md`) : durée entre `PRÊTE À MERGER` et `MERGÉE`, et régressions trouvées par la non-régression groupée.
