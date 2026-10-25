# Journal de la story #39 : Leçons personnelles (générateurs locaux)

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64), session `session_01PpRVtKEEmxcZy3RwzMAG9K`.
Branche de base : `main` (`6be4dc6`). Branche : `feature/39-lecons-personnelles`.

## 2026-10-25

- 16:30 UTC : démarrage. Dépendances mergées : #25, #26, #19, #20, #22. #14 sortie de la beta (décision du PO, Q1.a) : l'export et la suppression des leçons personnelles avec le profil sont reportés dans #14.
- Règles de non-régression en vigueur (DÉCISION DU PO sur #64, « OK A B C D ») : avant `PRÊTE À MERGER`, périmètre de la story et des stories livrées du contexte et des fichiers partagés touchés, sur `telephone`.
- 16:55 UTC : `domain-modeler` : modèle de domaine (`f4dae0b`). Contexte Accompagnement, agrégat `LeconPersonnelle` (par profil enfant), table `lecons_personnelles` (RLS par rattachement, cascade avec le profil), questions #39.1 à #39.16.
- 17:25 UTC : `po-acceptance` : critères d'acceptance (`19d3d7d`). 6 règles, 29 scénarios (31 cas), 16 `@a-valider`, 6 `@acces` ; questions #39.17 à #39.21.
- CADRAGE PRÊT publié sur #39, avec DÉCISION (numéro demandé pour #39.16). En attente du OK du PO.
