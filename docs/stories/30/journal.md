# Journal de livraison : issue #30, Série

Équipe lancée par le responsable des équipes (vague 1, issue de coordination #64), le 2026-10-26 à 06:45 UTC.
Session : session_01KTi6ku6tbmrsypKaSCnGkq. Branche : `feature/30-serie`, partie de `main` `0c6641c`. Base : `main`.

## Étapes 0 à 2

- 06:50 Préparation. Dépendances mergées : #24, #27, #28, #29 (et #79).
- Étape 1 (domaine) et étape 2 (critères) **sautées** : cadrage déjà validé par le PO (« OK #29 #30 reco partout », 2026-10-25), `domain-model.md` et `acceptance.md` sont dans `main`, 0 `@a-valider`. Pas de nouvelle ⛔ n°1.
- Constat : le front envoie déjà `jour` (jour de l'appareil, #28) avec chaque séance terminée ; le serveur le valide (`jourDeLAppareil`) mais ne le stocke pas. 30.6 se limite donc à la colonne, à la reprise des séances déjà enregistrées et à l'écriture par les fonctions Postgres.

## Découpage TDD

Bloc A, Motivation (domaine pur) :
1. `JoursDeSeance` : union sans doublon des jours de séance.
2. `serieDeJours` : série jusqu'à aujourd'hui ou hier, jour futur ignoré.
3. `texteDeLaPastille` : quatre textes, longue série.
4. `saluerAvecLaSerie` : « Bonjour <prénom> ! <pastille> ».

Bloc B, Apprentissage (30.6) :
5. La ligne de la séance terminée porte son jour (jour envoyé, sinon jour de la date de fin).
6. Les fonctions Postgres d'enregistrement reçoivent `p_jour` (migration additive : colonne nullable, reprise à l'heure de Paris, paramètre `p_jour default null`).

Bloc C, front :
7. Lecture des jours de séance (serveur, séances gardées, séances jouées dans ce navigateur), jour enregistré plutôt que recalculé (30.6, aussi pour l'objectif du jour de #29).
8. Pastille de série sur l'accueil de l'enfant, lecture « tout lire ».

## Cycles
