# 0043 : Un bug, une amélioration ou une nouvelle fonctionnalité se signale par `/signaler`, qui crée l'issue et la traite jusqu'à la PR selon son type ; le merge reste humain

**Statut** : Acceptée · 2026-11-09 (demande du PO : « remonter un bug ou signaler une amélioration, créer l'issue et la traiter directement »).

## Contexte

Les retours du PO (application publiée, non-régressions de nuit) arrivent en une phrase : « sur tel écran, tel élément ne marche pas ». Il fallait jusqu'ici retrouver le composant et le contexte, rédiger l'issue à la main (comme #186), puis lancer `/feature`, dont les deux arrêts humains sont lourds pour une correction d'une ligne. L'épopée #122 couvre le signalement par un parent **depuis l'application** ; elle ne sert pas à l'équipe de développement.

## Décision

1. Un skill `signaler` (`.claude/skills/signaler/`), lancé par `/signaler <description>`, identifie le **type** (bug, amélioration d'une fonctionnalité existante, nouvelle fonctionnalité), l'**écran**, la **section**, le **composant**, le **bounded context** et la story d'origine, à l'aide d'une carte des écrans tenue à jour dans le skill. Il cherche les doublons, puis crée l'issue (labels `signalement` et `bug`, `amelioration` ou `nouvelle-fonctionnalite`).
2. Le traitement dépend du type :
   - **bug** dont le comportement attendu est déjà écrit (scénario de `features/` ou issue livrée) : **aucun arrêt** avant l'issue ; un test qui reproduit le bug (unitaire, scénario de non-régression `@issue-<n>`, pytest ou caractérisation legacy), la correction, la review en mode delta, les E2E du périmètre, la PR ;
   - **petite amélioration** (un écran, un contexte, sans nouvelle table ni nouveau concept) : **un seul ⛔**, sur le brouillon de l'issue et ses critères, qui tient lieu de validation n°1 ; puis le même chemin ;
   - **nouvelle fonctionnalité**, amélioration large, ou bug dont le comportement attendu n'est écrit nulle part : l'issue est rédigée comme une story, puis `/feature <n>` prend le relais avec ses deux arrêts.
3. Lancer `/signaler` vaut demande explicite de créer l'issue, la branche et la PR. La session suit la PR (CI, commentaires de review). **Le merge reste un ⛔ humain.**
4. `test-writer` peut écrire les tests de caractérisation du legacy (`tests/legacy/`), que `CLAUDE.md` exige avant toute correction dans `app/`.

## Options écartées

- **Tout passer par `/feature`** : deux arrêts et un modèle de domaine pour une correction sans nouvelle règle.
- **Corriger sans issue** : la correction perd sa trace (commits `fix(#n)`, scénario `@issue-<n>`, lien avec la story d'origine).
- **Aucun arrêt, même pour une amélioration** : le comportement souhaité est une décision du PO ; l'agent ne l'invente pas.
- **Merge automatique** : contraire aux deux ⛔ du workflow de livraison.

## Conséquences

- Les bugs se corrigent en une passe, avec un test qui prouve le bug avant la correction.
- La carte des écrans (`.claude/skills/signaler/carte-des-ecrans.md`) est corrigée dans la PR du signalement qui la trouve fausse.
- Pendant une vague `/graphe`, un signalement est annoncé dans l'issue de coordination ; seul le responsable des équipes modifie `docs/graphe/` et `docs/feuille-de-route.md`.
