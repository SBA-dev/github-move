# Journal de la story #141 — Fin de séance : son de la quête, « Accueil », « bouton touché »

Branche de base : `main` (46ca728). Branche : `feature/141-fin-de-seance`. Équipe lancée par `/graphe` (« graphe 141 »).
Nature : correctifs `fix(#141)`. Décisions du PO : « son A, accueil A, issue oui » (02/11).

## 2026-11-04

- Étape 0 : issue, coordination #64 lues. Branche créée depuis `main`.
- Étape 1 (domaine) : **sautée**. Aucun nouveau concept ni règle : trois défauts d'une règle déjà validée (101.18 (a), 97.7, R7 de #97) et une destination de bouton décidée par le PO.
- Repérage « Accueil » : l'écran de fin de séance (`src/Application.tsx`, `onAccueil={() => aller("accueil")}`) mène à « Qui joue ? » ; la fin de révision, du test de départ et du défi mènent déjà à `revenirA("jeu")` (accueil de l'enfant).
- Diagnostic du défaut 1 (vérifié) : dans le scénario #97 « Rejouer une leçon déjà acquise… », Léa passe de 4 à 5 étoiles en tout (2 + 2, puis 3 étoiles sur la leçon rejouée). 5 est le palier de l'écharpe rayée (`motivation/domain/tenues.ts:11`) : la tenue reçue fait jouer « découverte » (#102.16, `effets-sonores.ts:42`). La quête du jour n'ajoute aucun son (`effetsDeLaFinDeSeance` ne la reçoit pas ; `AnnonceDeLaQueteAccomplie` est du texte seul) : 101.18 (a) est déjà respectée. Le scénario date de #97 (28/10), avant les tenues de #102 (29/10). → question #141.1 au PO.
- Famille « Quête du jour accomplie ! » : cause différente. Les steps de fin comparent la fin exacte de la phrase de fin ; quand la séance accomplit la quête, #101 y ajoute « Quête du jour accomplie ! Bravo Léa ! ». → question #141.2.
- Défaut 3 : step fragile. `laisserLaParoleFinir` conclut avant que la phrase de fin (dite une fois toutes les lectures prêtes, dont celle de la quête ajoutée par #101) ne commence ; le clic sur « Rejouer » tombe pendant la parole, R7 s'applique. L'application est conforme ; correction dans le step (attendre la phrase de fin dite), sans changer son sens.
- CADRAGE PRÊT publié, questions #141.1 à #141.3. Attente de l'annonce du responsable.
