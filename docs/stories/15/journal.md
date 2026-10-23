# Journal : issue #15, Choisir la voix des personnages guides sur l'appareil

- 21:05 · Issue créée (lot 2 de `docs/reecriture.md`). Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-2-modele-et-scenarios` (partie de `feature/5-connexion-du-parent`, la PR du lot 1 n'étant pas encore mergée).
- 21:05 · Validation des scénarios par lot (décision de démarrage n°2).
- 21:05 · Étape 1 : modèle déjà préparé dans `docs/stories/7/domain-model.md` (« Hors périmètre : voix imposée, lot 2 ») ; `domain-modeler` le reprend dans `docs/stories/15/`.
- 21:13 · Modèle écrit (`docs/stories/15/domain-model.md`). Étape 2 : délégation à `po-acceptance`.
- 21:18 · Étape 2 : scénarios écrits par `po-acceptance`, syntaxe vérifiée par `npx bddgen`. ⛔ Validation humaine n°1 demandée pour tout le lot 2.
- 21:43 · Validation n°1 : « OK » du PO pour les propositions du lot (`docs/stories/lot-2-decisions.md`, décision 0009). Mise à jour du modèle et des scénarios.
- 21:52 · Modèles mis à jour (`domain-modeler`). Arbitrages de l'orchestrateur : T6 (lecture de l'invitation avant acceptation) ajouté à la décision 0009 (point 3 bis, décision du jour, pas encore mergée) ; décision n°11 appliquée : le profil en cours reste connu pendant l'espace parent, pour l'essai de voix (le scénario « Noisette quel que soit l'univers » est à revoir).
- 21:55 · Scénarios mis à jour avec les décisions du PO. Questions restantes non bloquantes dans `acceptance.md`.
- 07:53 · Étape 3 lancée (« TDD de #15 » du PO). Branche `feature/15-choix-de-la-voix`, partie de `feature/10-controle-parental` (l'onglet « Voix » vit dans l'espace parent de #10). Comportements : choix de voix et voix montrée comme choisie ; voix très naturelle et phrase d'essai ; lecture avec le choix de l'appareil et essai d'une voix.
- 07:55 · Cycle 1 (choix de voix ; voix très naturelle et phrase d'essai) : red 21c699b et 6ab5223, green f97d32e et eefb476. 156 tests.
- 07:57 · Cycle 2 (lecture et essai avec le choix de l'appareil) : red 1a5b03a, green 8fe70d8. 167 tests. Points à surveiller en review : dépendance `choixDeVoix` optionnelle, chaîne « automatique » utilisée comme valeur spéciale dans `essayerUneVoix`.
- 08:01 · Câblage : 4be1e78. tsc, build, 167 tests Deno, non-régression E2E 140/140. Étape 4 : review.
- 09:09 · Review 1 : À CORRIGER (2 bloquants : voix imposée non française utilisée pour le français ; mentions calculées dans React). Red 0443dd3, 0a3c835, 988a14e ; fix eec5cec, feat 77a449f et 630ce86 (`voixProposees`, `essayerUneVoix(ChoixDeVoix)`, dépendance obligatoire), refactor 7d4580b. 175 tests, E2E 140/140. Notes : en production, l'essai de voix parle toujours avec Noisette tant que les profils (#11) n'existent pas ; la clé de l'appareil passe de `ecole-voix` (legacy) à `savanturier:voix`, sans reprise (décision n°7). Relance de la review.
- 09:10 · Review 2 : APPROUVÉ. Non bloquant noté : la ligne automatique de `voixProposees` porte encore un nom vide, comparé dans React (mieux : un `ChoixDeVoix` ou un booléen `choisie` calculé par le domaine). Étape 5 : E2E.
