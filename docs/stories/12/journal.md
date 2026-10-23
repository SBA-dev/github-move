# Journal : issue #12, Réglages d'un profil enfant

- 21:05 · Issue créée (lot 2 de `docs/reecriture.md`). Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-2-modele-et-scenarios` (partie de `feature/5-connexion-du-parent`, la PR du lot 1 n'étant pas encore mergée).
- 21:05 · Validation des scénarios par lot (décision de démarrage n°2).
- 21:05 · Étape 1 : délégation à `domain-modeler`.
- 21:13 · Modèle écrit (`docs/stories/12/domain-model.md`). Étape 2 : délégation à `po-acceptance`.
- 21:18 · Étape 2 : scénarios écrits par `po-acceptance`, syntaxe vérifiée par `npx bddgen`. ⛔ Validation humaine n°1 demandée pour tout le lot 2.
- 21:43 · Validation n°1 : « OK » du PO pour les propositions du lot (`docs/stories/lot-2-decisions.md`, décision 0009). Mise à jour du modèle et des scénarios.
- 21:52 · Modèles mis à jour (`domain-modeler`). Arbitrages de l'orchestrateur : T6 (lecture de l'invitation avant acceptation) ajouté à la décision 0009 (point 3 bis, décision du jour, pas encore mergée) ; décision n°11 appliquée : le profil en cours reste connu pendant l'espace parent, pour l'essai de voix (le scénario « Noisette quel que soit l'univers » est à revoir).
- 21:55 · Scénarios mis à jour avec les décisions du PO. Questions restantes non bloquantes dans `acceptance.md`.
- 2026-10-24 · Reprise de la story sur `claude/nice-mendel-cp9syg`, repartie de `main` à jour (#11 mergée, PR #55). Modèle et scénarios validés (lot 2). Point de #11 reporté (à soumettre au PO) : un profil créé depuis un autre appareil n'apparaît qu'après rechargement.
- Question technique T3 (emplacement du découpage en syllabes) tranchée par l'orchestrateur : `voix/domain/`, à côté des mots de la consigne (le découpage sert l'affichage du texte lu, pour tous les contextes).
- Étape 3 : boucle TDD. Comportements :
  1. Famille : `Reglages` (défauts), `ClavierDesDictees`, `LangueDuParent` (20 langues du legacy), réglages dans `ProfilEnfant` (création, `changerLesReglages`, fait `ReglagesChanges`), cas d'usage de création et de changement des réglages, réglages dans le profil en cours.
  2. Voix : découpage d'un mot en syllabes pour le mode dys (mots de plus de trois lettres, comme `readable` du legacy).
  Puis câblage : colonnes de réglages dans `profils_enfants`, Edge Functions, formulaire « Réglages », mode dys appliqué au profil en cours, « tout lire à voix haute » (lecture des choix, #17).
