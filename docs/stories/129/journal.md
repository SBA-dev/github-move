# Journal : story #129, exercices comme des jeux (98e) : textes qui se dévoilent comme un parchemin

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64), à la demande du PO (« Graphe #129 »).
Session : `session_015z4jmPZvaeGzuQqi2WPvHh`. Branche : `feature/129-parchemin`, partie de `main` (`d609058`). Branche de base : `main`.
Dépendances mergées : #97, #98 (98a), #126 (bulles de choix). Stories voisines en parallèle : #128 (claviers, 98d), #131 (boîte et barres, 98c).
Numéro de décision : aucun réservé (prochain libre 0040, à demander par DÉCISION). Ressources prévues : aucune.

## 2026-11-03

- 08:10 UTC : démarrage. Lu : issue #129 et son commentaire [Responsable] (découpage révisé, 4e règle « parchemin de l'univers », 98.28, 98.29, 98.31), #64 (annonces jusqu'à 6598473573), `docs/stories/98/domain-model.md` (98e, 98.12, invariants), journal de #126.
- 08:12 UTC : étape 1, délégation à `domain-modeler` : aucun concept nouveau attendu (le dévoilement se lit dans `rangDuMotPrononce` et `versLu`), mais un dessin par univers et le découpage du texte en lignes sont à cadrer. Modèle court, centré sur la tranche.
- 08:40 UTC : `domain-modeler` rend `domain-model.md` (`1c5bb7a`) : rien ne change dans Apprentissage. Un texte de `lecture` n'a pas de lignes (un paragraphe de 170 à 489 caractères) et « ligne » est un synonyme interdit de **Vers** : reco « phrase après phrase » pour `lecture` (lecture pure dans Voix, même coupure que `texteALire`, par TDD), « vers après vers » pour `memoriser`. 4 règles, invariants P1 à P6. Questions #129.1 à #129.9. Dessins relus contre la règle absolue : rien à signaler.
- 08:41 UTC : étape 2, délégation à `po-acceptance`.
- 09:05 UTC : `po-acceptance` rend `acceptance.md` et `features/129-parchemin.feature` (`d3c04b3`) : 5 règles, 33 scénarios (20 plans, 77 cas), 12 `@a-valider` (24 cas). Nouvelles questions #129.10 (parchemin roulé pendant la présentation) et #129.11 (enchaînement de la question de lecture en révision). Le plan des étoiles joue tout l'exercice « Le petit chat Plume » : `@issue-129` à ajouter au `Before` de `delais.steps.ts` (par `e2e-tester`). Un step de #22 (« les 6 vers, un par ligne ») devra attendre la fin de l'écoute, sans changer de sens. Textes d'exemple tirés de la bibliothèque, relus contre la règle absolue : rien à signaler.
- 09:07 UTC : CADRAGE PRÊT publié sur #129. Attente de l'annonce [Responsable]. Pendant l'attente : planche `parchemin.png` (⛔ intermédiaire, reco de #129.6), sans code de production.
- 09:25 UTC : planche `parchemin.png` rendue par `implementer` en rôle d'illustrateur (`a3bff1f`), selon la reco de #129.6 : 6 univers × 5 états (roulé, en cours, déroulé, mode dys, fond sombre), à 360 px, texte de « Le petit chat Plume ». Contrastes ≥ 4,86:1. Relue par l'orchestrateur sur le PNG contre la règle absolue : rien à signaler (clé de sol redessinée, loupe sans reflet, casque sans symbole). `PLANCHES PRÊTES` publié sur #129 (⛔ intermédiaire).
- 11:06 UTC : ⛔ validation n°1 levée (annonce [Responsable] 6602153212 sur #64 et 6602152458 sur #129, PO : « 129 reco tout »). #129 passe en `graphe:dev`. La planche `parchemin.png` attend encore sa validation (ne bloque pas le code, seulement les dessins définitifs).
- Liste des comportements unitaires : **un seul**, dans Voix : le rang de phrase de chaque mot affiché, avec la coupure de la voix (#129.1). Le reste se lit dans les faits existants (`rangDuMotPrononce`, `versLu`, parole en cours, Muet, mouvements réduits, clé d'univers). Une règle qui apparaîtrait dans React pendant le câblage repasse par un cycle TDD.
- 11:12 UTC : `po-acceptance` reporte les réponses (`8536f01`) : 0 `@a-valider`, 33 scénarios (77 cas).
- 11:14 UTC : cycle TDD 1, RED par `test-writer` (`c2893ca`, `phrases-des-mots-affiches_test.ts`, 9 cas) : échec vérifié par l'orchestrateur (module absent).
- 11:20 UTC : GREEN par `implementer` (`36999f6`, `phrasesDesMotsAffiches`, réutilise `texteALire` et `rangAffichePourChaqueMotPrononce`) : `deno test` 2787 verts, vérifié par l'orchestrateur. Refactor : rien.
- 11:21 UTC : en parallèle, `e2e-tester` écrit les étapes de `@issue-129` (RED) et propose le contrat d'attributs ; `mr-reviewer` relit le bloc Voix en mode delta (`8536f01..36999f6`).
