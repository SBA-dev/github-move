# Journal de la story #26 : Leçons des classes d'avant

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64), session `session_01FYbQscG1fi793kik9CHgA4`.
Branche de base : `main` (`2173dba`). Branche : `feature/26-lecons-des-classes-d-avant`.

## 2026-10-24

- 23:15 UTC : démarrage anticipé, **cadrage seulement** (pas de code avant le merge de #27, qui modifie `apprentissage/domain/parcours.ts`).
- Story redéfinie par les décisions du PO sur #25 : 25.1 b (aucun verrou), N1 (bloc « Déjà réussies en CE2 »), N2 (le parcours libre n'a plus d'effet ; son retrait relève d'une story Famille), N7 (leçons réussies d'une classe au-dessus visibles dans « Toutes les leçons »). Les questions 1 à 5 de l'issue sont reprises en #26.<n>.
- Lu : branche `feature/27-test-de-depart` (décision 27.15 : leçon de CE2 réussie au test de départ dans « Déjà réussies en CE2 », sans étoile ; les leçons du CP réussies au test de départ par un CE1 s'afficheront dans « Revoir les classes d'avant », #26).
- 23:20 UTC : `domain-modeler` : modèle de domaine (`0d5dd32`). Vue calculée, pas d'agrégat, pas de migration ; questions #26.1 à #26.12.
- 23:40 UTC : `po-acceptance` : critères d'acceptance (`a620c8e`). 6 règles, 37 scénarios (46 cas), 25 `@a-valider`, 2 `@depend-de-27`, 0 `@acces` ; questions #26.13 à #26.16.
- CADRAGE PRÊT publié sur #26. En attente du OK du PO et du merge de #27 avant le TDD.
- 23:30 UTC : réponses du PO (annonces `[Responsable]` sur #64) : 26.1 remplacée (« Toutes les leçons » : classe de l'enfant, puis classe juste au-dessus d'une matière réussie, section des classes d'avant en dessous) ; 26.1a matière par matière ; 26.1b classe juste au-dessus seulement ; 26.2 à 26.16 reco. OK du PO, label `graphe:dev`.
- `domain-modeler` : modèle mis à jour (`166c439`, `c9fc593`) ; nouvelles questions #26.17 à #26.20.
- `po-acceptance` : critères mis à jour (`053491d`) : 6 règles, 48 scénarios (56 cas), 15 `@a-valider` (#26.17 à #26.20), 3 `@depend-de-27`.
- Questions #26.17 à #26.20 publiées sur #26. TDD toujours bloqué jusqu'au merge de #27.

## 2026-10-25

- 08:27 UTC : annonce `[Responsable]` sur #64 : le PO retient les recos #26.17 à #26.20 (« OK #26 reco »). Cadrage entièrement validé. Le TDD attend `MAIN A BOUGÉ : #27 mergée`.
- `po-acceptance` : critères validés (`0d71753`) : 6 règles, 48 scénarios (56 cas), 0 `@a-valider`, 3 `@depend-de-27`.
- `domain-modeler` : modèle validé, glossaire et context map complétés par ajouts seulement (`4229b9e`) : « Matière réussie », décisions n°36 et n°37 du glossaire (n°35 laissée à #27).
- À reprendre hors vague (ajouts seulement pendant la vague) : réécrire les lignes « Leçon des classes d'avant » et « Leçon à découvrir » du glossaire selon la décision n°36.
- 08:32 UTC : annonce `MAIN A BOUGÉ : #27 mergée` ; `main` (`89b5729`) intégrée en `b987f07`, seul conflit sur des ajouts au glossaire (les deux gardés). `@depend-de-27` levés (`2b0f53f`).
- TDD bloc A (parcours) : comportement 1 RED `eafb1ca` → GREEN `381bb5b` ; comportements 2, 3, 4 écrits comme tests de caractérisation (`7591f39`, `36f1f00`, `6a4a57a`) : l'extraction de `etatHorsDuParcours` au GREEN 1 les donnait déjà. Revue delta du bloc A depuis `b987f07`.
- Revue delta bloc A (`b987f07..af44534`) : **APPROUVÉ**, aucun bloquant. Non bloquants traités tout de suite : type renommé `LeconDesClassesDAvant` (terme du glossaire), prédicat de niveau nommé, test de l'invariant 1 avec une leçon de CM1, types métier dans un utilitaire de test. Tests de caractérisation 2 à 4 acceptés : la logique d'état existait déjà (testée par #25 et #27) et le GREEN 1 l'a réutilisée. Pour la suite : un test rouge par état. Dernier commit relu : `af44534`.
- Bloc B (« Toutes les leçons ») : comportement 5 RED `6dfcb9e`.
- TDD bloc B (« Toutes les leçons », `toutes-les-lecons.ts`) : comportement 5 RED `6dfcb9e` → GREEN `52e6a6b` ; 6 RED `06776f8` → GREEN `206f5d4`, refactor `0d12ff1` ; 7 RED `a980445` → GREEN `613587c` (+ caractérisation CM2 `591bf32`) ; 8 RED `2e45986` → GREEN `411bebf`, refactor `276c1bd` (+ caractérisation CP `acd1fa1`) ; 9 RED `95a893a` → GREEN `8b11c26` ; 10 RED `54c1575` → GREEN `8a4b282`. 1514 tests verts. Revue delta du bloc B depuis `af44534`.
- Revue delta bloc B (`af44534..604e9bc`) : **APPROUVÉ**, aucun bloquant. Non bloquants : refactors (`choixDuFiltre` calculé une fois, rang des matières, `leconsDeLaClasse`, `LeconsDUnNiveau`, `classeJusteAuDessus`) et deux tests de caractérisation (filtre sur la classe au-dessus, leçon ajoutée qui referme la classe au-dessus), faits tout de suite. Dernier commit relu : `604e9bc`.
- Leçon de discipline TDD (non bloquant de la revue) : trois commits ne compilent pas seuls (`8b4d1c0`, `83f9ba4`, `8b11c26`). Deux RED étaient en attente en même temps, ou un refactor a été fait pendant un RED. L'historique est déjà poussé, on ne le réécrit pas. Pour la suite : un RED, son GREEN, puis le RED suivant, et jamais de refactor pendant un RED.
- Câblage front : `f276dbb` (bloc replié dans « Mon parcours »), `ac020cf` (écran « Toutes les leçons », bouton sur l'accueil de l'enfant). Aucune migration, aucune Edge Function.
- Review complète, cycle 1 : **À CORRIGER**, 1 bloquant : React décidait lui-même de la règle 26.20 (section forcée dépliée quand une classe d'avant est choisie), ce qui laissait un bouton de repli sans effet. Correction par un cycle TDD : le domaine donne l'indicateur, et en même temps la matière des leçons de la section et le nombre de leçons montrées. Ensuite, `implementer` corrige le front et les non bloquants (titre `h3`, import, textes rangés dans `toutes-les-lecons`, « dépliée »).
- E2E : steps et mise au point sur le téléphone lancées en parallèle de la revue.
