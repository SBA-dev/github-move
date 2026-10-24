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
