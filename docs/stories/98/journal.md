# Journal : story #98, des exercices qui ressemblent à des jeux

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64).
Branche : `feature/98-exercices-comme-des-jeux`, partie de `main` (`ea2cca3`). Branche de base : `main`.
**Cadrage seulement** (décision 0020, `graphe.md` étape 1 point 5) : domaine puis scénarios, puis CADRAGE PRÊT. Aucun code avant le merge de #97, qui dépend de #96 (PR #124).
Numéro de décision réservé : 0035.

## 2026-10-28

- 08:30 UTC : démarrage. Commentaire `Avancement` créé sur #98. Cadrages voisins lus : `docs/stories/96/` (branche `feature/96-refonte-visuelle`, `a52f6ff`) et `docs/stories/97/` (branche `feature/97-retours-animes-et-sonores`, `78fcd4a`).
- 08:35 UTC : étape 1, délégation à `domain-modeler` (la story touche l'affichage seulement, mais introduit des concepts nouveaux, habillage de jeu, glisser-déposer, record de fluence présenté comme une course, et un découpage à proposer).
- 08:41 UTC : `domain-modeler` rend `domain-model.md` : aucun agrégat nouveau, affichage seulement. Répartition avec #97 posée. Découpage proposé en 98a à 98e (98a = socle du glisser + `classer`, `ordre`, ordre des vers de `memoriser`). 17 questions (98.1 à 98.17).
- 08:42 UTC : étape 2, délégation à `po-acceptance` pour les scénarios de la tranche 98a seulement (les autres tranches deviendraient de nouvelles issues créées par le PO).
- 08:55 UTC : `po-acceptance` rend `acceptance.md` et `features/98-exercices-comme-des-jeux.feature` (tranche 98a) : 6 règles, 34 scénarios (8 plans), 21 `@a-valider`, 4 `@depend-de-97`. Questions nouvelles 98.18 à 98.24.
- 08:56 UTC : CADRAGE PRÊT publié sur #98. Arrêt : on attend la validation du PO, transmise par une annonce `[Responsable]`. Pas de code avant le merge de #97.
- 16:22 UTC : ⛔ validation n°1 levée par le responsable (#64) : réponse du PO « 98# reco partout ». Les 24 questions sont tranchées selon la reco et le découpage 98a à 98e est validé.
- 18:15 UTC : `po-acceptance` reporte les réponses dans `acceptance.md` et `domain-model.md`, et retire les `@a-valider` du `.feature`. Arrêt de l'équipe jusqu'au merge de #97 (la session de code sera relancée).

## 2026-10-28 (reprise du cadrage)

- 19:20 UTC : relance par le responsable (session_015z4jmKzYovHSW4cJ2TUKT7). Le PO a changé 98.2 : **habillage par univers** (commentaires [Responsable] 6478159395 et 6478171371 sur #98). 98.1 et 98.3 confirmées, 98.10 confirmée (« A on garde le chrono »). Le cadrage de 98a est à reprendre, et le découpage (#126 à #129) à revoir.
- 19:22 UTC : #97 mergée dans `main` (`c477f3b`). `main` intégrée dans la branche (merge `6ffd582`, sans conflit). Pas de code avant la validation du nouveau cadrage.
- 19:25 UTC : étape 1, délégation à `domain-modeler` (habillage par univers, objets par univers, validation des planches, découpage, questions à partir de 98.25).
