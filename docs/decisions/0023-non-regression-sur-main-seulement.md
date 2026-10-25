# 0023 : Non-régression complète sur `main` seulement, deux fois par jour ; merge par les équipes

**Statut** : Acceptée · 2026-10-25 · remplace les points 2 et 3 de 0022, précise 0017 et 0020

## Contexte

Mesures de la vague 1 (8 stories livrées en parallèle, 66 h du lancement au merge) :

- **≈ 42 % du temps** passe en attentes : nuit, autorisation de merge, session perdue. Hors nuit, les attentes du PO sont faibles (5 à 35 min par validation).
- **≈ 29 % du temps, soit la moitié du travail des équipes**, passe dans les tests E2E. La non-régression complète (environ 1 400 cas sur deux projets) dure de 1,5 à 2 h, car chaque scénario appelle le projet de développement en ligne. Environ 6 h sur 13 ont été perdues en runs invalides ou refaits.
- Les équipes partagent `savanturier-dev`. Deux non-régressions en même temps provoquent des dizaines de timeouts : 130 pour #72, 89 pour #26. Le responsable a donc dû n'en autoriser qu'une à la fois, et les équipes font la queue : #28 a attendu environ 3 h.
- Les sessions d'équipe ne pouvaient pas merger : leur mode de permission refuse un merge sans review humaine.

Le PO veut finir la beta le 2026-10-26 plutôt que le 2026-10-28. Il a validé les quatre pistes proposées : « OK A B C D ».

## Décision

1. **Plus de non-régression complète par story (A).** Avant `PRÊTE À MERGER`, puis sous le verrou `merge` après l'intégration de `main`, une équipe lance seulement :
   - tests unitaires, lint, format, typecheck et build ;
   - sur `telephone`, le **périmètre de sa story**, celui des **stories livrées de son contexte** et celui des **stories dont elle modifie des fichiers partagés**.

   Les KO de timeout sont relancés seuls avec `--workers=1`. Le compteur de 3 merges de 0022 disparaît.
2. **Non-régression complète sur `main` seulement, sur `telephone` (B)**, deux fois par jour (vers 13:00 et vers 20:00 UTC) et avant chaque pause. Le responsable désigne une équipe libre pour la lancer. Un KO gèle le verrou `merge`, et une PR `fix(#n)` passe en priorité (0022, point 4). La tablette est vérifiée une fois, par une non-régression complète sur les deux projets, avant la mise en ligne (#45).
3. **Cadrage d'avance de toutes les stories restantes de la beta (C)**, dans des sessions de cadrage seulement (0020, point 6). Les questions au PO sont posées en un seul lot.
4. **Travail de nuit (D).** Les équipes mergent elles-mêmes, et le responsable enchaîne les stories sans attendre le matin.
5. **Merge par les équipes.** Le PO a ajouté à `.claude/settings.json` (`permissions.allow`) `mcp__github__merge_pull_request` et `Bash(gh pr merge * --merge*)` (commit `d1d2def`). Vérifié avec #26 : une session lancée avant ce commit a mergé elle-même. Les conditions de merge d'`equipe.md` §5 ne changent pas.

## Options écartées

- **Garder la non-régression complète par story (0020, 0022)** : la plus sûre, mais 1,5 à 2 h par story, plus une file d'attente entre équipes.
- **Un environnement de test par équipe** (#86) : c'est la bonne réponse à terme, mais elle demande une demi-journée de travail. Elle est gardée pour après la beta.
- **Plus de workers** : sur un projet partagé, cela multiplie les timeouts.

## Conséquences

- On gagne environ 1,5 à 2 h par story, et la file d'attente des non-régressions disparaît.
- Une régression peut rester sur `main` jusqu'à une demi-journée. La non-régression sur `main` la retrouve, et sa correction passe avant tout le reste.
- On ne met rien en ligne depuis `main` sans une non-régression complète verte sur les deux projets, sur le commit visé.
- `CLAUDE.md` (tableau des commandes) et `equipe.md` (§5) sont à aligner en fin de vague.
- #87 (fiabiliser les non-régressions) et #86 (un environnement par équipe) restent utiles après la beta.
