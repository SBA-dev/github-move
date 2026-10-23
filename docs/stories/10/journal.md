# Journal : issue #10, Contrôle parental de l'espace parent

- 21:05 · Issue créée (lot 2 de `docs/reecriture.md`). Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-2-modele-et-scenarios` (partie de `feature/5-connexion-du-parent`, la PR du lot 1 n'étant pas encore mergée).
- 21:05 · Validation des scénarios par lot (décision de démarrage n°2).
- 21:05 · Étape 1 : délégation à `domain-modeler`.
- 21:13 · Modèle écrit (`docs/stories/10/domain-model.md`). Étape 2 : délégation à `po-acceptance`.
- 21:18 · Étape 2 : scénarios écrits par `po-acceptance`, syntaxe vérifiée par `npx bddgen`. ⛔ Validation humaine n°1 demandée pour tout le lot 2.
- 21:43 · Validation n°1 : « OK » du PO pour les propositions du lot (`docs/stories/lot-2-decisions.md`, décision 0009). Mise à jour du modèle et des scénarios.
- 21:52 · Modèles mis à jour (`domain-modeler`). Arbitrages de l'orchestrateur : T6 (lecture de l'invitation avant acceptation) ajouté à la décision 0009 (point 3 bis, décision du jour, pas encore mergée) ; décision n°11 appliquée : le profil en cours reste connu pendant l'espace parent, pour l'essai de voix (le scénario « Noisette quel que soit l'univers » est à revoir).
- 21:55 · Scénarios mis à jour avec les décisions du PO. Questions restantes non bloquantes dans `acceptance.md`.
- 07:23 · Étape 3 lancée (« Tdd de #10 » du PO). Branche `feature/10-controle-parental`, partie de `feature/lot-2-modele-et-scenarios` (rien n'est encore mergé dans `main`). Comportements : question du contrôle parental (tirage, réponse, énoncé) ; accès à l'espace parent (entrée, réponse, ouverture après la connexion, sortie). Le câblage dépend de #5 (connexion, déconnexion) et #11 (« Qui joue ? », profils) : les scénarios qui en dépendent seront exécutés avec ces stories.
- 07:25 · Cycle 1 (question du contrôle parental) : red b495bcd, green b8d02c2. 133 tests.
- 07:27 · Cycle 2 (accès à l'espace parent) : red 5fc3c5d (littéraux sans accent, convention du glossaire), green 8ccf5e1. 141 tests. Domaine de #10 terminé. Câblage : la déconnexion dans l'espace parent sera branchée avec #5 (adaptateur Supabase Auth absent) ; la sortie mène à l'accueil tant que « Qui joue ? » (#11) n'existe pas.
