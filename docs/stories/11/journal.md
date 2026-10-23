# Journal : issue #11, Créer et modifier un profil enfant, et choisir qui joue

- 21:05 · Issue créée (lot 2 de `docs/reecriture.md`). Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-2-modele-et-scenarios` (partie de `feature/5-connexion-du-parent`, la PR du lot 1 n'étant pas encore mergée).
- 21:05 · Validation des scénarios par lot (décision de démarrage n°2).
- 21:05 · Étape 1 : délégation à `domain-modeler`.
- 21:13 · Modèle écrit (`docs/stories/11/domain-model.md`). Étape 2 : délégation à `po-acceptance`.
- 21:18 · Étape 2 : scénarios écrits par `po-acceptance`, syntaxe vérifiée par `npx bddgen`. ⛔ Validation humaine n°1 demandée pour tout le lot 2.
- 21:43 · Validation n°1 : « OK » du PO pour les propositions du lot (`docs/stories/lot-2-decisions.md`, décision 0009). Mise à jour du modèle et des scénarios.
- 21:52 · Modèles mis à jour (`domain-modeler`). Arbitrages de l'orchestrateur : T6 (lecture de l'invitation avant acceptation) ajouté à la décision 0009 (point 3 bis, décision du jour, pas encore mergée) ; décision n°11 appliquée : le profil en cours reste connu pendant l'espace parent, pour l'essai de voix (le scénario « Noisette quel que soit l'univers » est à revoir).
- 21:55 · Scénarios mis à jour avec les décisions du PO. Questions restantes non bloquantes dans `acceptance.md`.
- 2026-10-23 20:40 · Reprise de la story sur `claude/nice-mendel-cp9syg`, repartie de `main` à jour (#16 et #17 mergées, PR #53 et #54). Branche de base : `main`. Modèle et scénarios validés (lot 2) : étapes 1 et 2 sautées. Le PO a choisi de faire #11 puis #12 avant #23 et #24.
- 20:42 · Étape 3 : boucle TDD. Comportements :
  1. Value objects : `Niveau` (publié par le Catalogue, remplace `NiveauDeLecon`), `Prenom` (espaces retirés, vide refusé, coupé à 20), clé d'univers validée (`UniversInconnu`), `ProfilEnfantId`.
  2. Agrégat `ProfilEnfant` : création avec le parent rattaché d'office, modification par un parent rattaché (`ParentNonRattache`), défauts CP et `animaux`.
  3. Cas d'usage `CreerProfilEnfant` et `ModifierProfilEnfant` (port `ProfilsEnfants`, fake en mémoire).
  4. `ChoisirQuiJoue` (port `ProfilEnCoursSurLAppareil`) et salut du personnage guide « Bonjour <prénom> ! » (Motivation).
  Puis câblage : migration `profils_enfants` et `rattachements` avec RLS, repository Supabase, Edge Functions `creer-profil-enfant` et `modifier-profil-enfant` (déployées sur `savanturier-dev`, décision 0010), front (« Qui joue ? », onglet Profils de l'espace parent, profil en cours à la place du profil préparé).
