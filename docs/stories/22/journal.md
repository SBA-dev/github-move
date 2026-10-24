# Journal : issue #22, Mémoriser une poésie

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/22/domain-model.md`). Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/22-memoriser-une-poesie.feature`, `docs/stories/22/acceptance.md`) : 5 règles, 17 scénarios (21 cas), 5 `@a-valider`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). Nouvelle question Q81 (pas de mention de l'enregistrement avant le lot 6). ⛔ Validation du lot attendue.
- 12:10 · Validation n°1 du lot 3 : « OK pour tout » du PO (`docs/stories/lot-3-decisions.md`, décisions 0012 et 0013). Scénarios mis à jour par `po-acceptance` : 5 `@a-valider` retirés, comportement inchangé ; questions passées en « Décisions » dans `acceptance.md`. Syntaxe vérifiée.
- 12:12 · Modèle mis à jour par `domain-modeler` : questions passées en « Décisions du PO » (réponse = proposition), règles du modèle alignées sur ces décisions, renvois vers les décisions 0012 et 0013 ; termes du lot 3 validés au glossaire (conflits n°8 à n°14 tranchés, Décisions n°23 à n°30).

## Livraison (vague 1, équipe #22)

- 17:55 · Équipe lancée par le responsable (`/graphe`, issue de coordination #64). Branche `feature/22-memoriser-une-poesie` partie de `main` (`6aedff7`). Branche de base : `main`. Étapes 1 et 2 déjà faites et validées au lot 3 (« OK pour tout ») : `CADRAGE PRÊT` pour information seulement, pas de question nouvelle.
- 17:55 · Base : 1136 tests unitaires verts.
- 18:00 · Découpage TDD (composition des mécaniques de #18 : `ExerciceOrdre` pour les vers, `ExerciceTrous` pour les mots cachés) :
  1. Catalogue : `lireMemoriser` (type spécifique `ExerciceMemoriser` : titre, auteur, vers ; au moins 2 vers, au plus 20, vers non vides).
  2. Catalogue : `estUneChanson` (« chanson » ou « comptine » dans le titre ou l'auteur, sans tenir compte des majuscules).
  3. Apprentissage : `motCache(vers)` (le plus long d'au moins 3 caractères, le premier à égalité, sans l'élision).
  4. Apprentissage : `PlanDeMemorisation` : ordre des vers (`ExerciceOrdre`, « Remets les vers dans l'ordre. ») et mots cachés (`ExerciceTrous`, vers joints par « / », vers sans mot caché sans trou, « Des mots se sont envolés ! Retrouve-les. »).
  5. Apprentissage : choix d'un mot caché complétés par d'autres mots de la poésie pour en avoir trois.
  6. Apprentissage : `ExerciceJoue` d'un `memoriser` : ordre des vers puis mots cachés, 2 questions par vers, vers sans mot caché réussi d'office.
  7. Apprentissage : paroles du personnage guide (écoute vers par vers, « À toi ! », redire ou chanter).
  8. Apprentissage : tirages et revalidation de la séance par le serveur.
- « Je suis prêt » : étape d'affichage (comme le texte lu avant les questions de #17) ; le domaine ne pose aucune question avant l'ordre des vers, et l'écran ne montre les vers à poser qu'après « Je suis prêt ».
- Interprétation notée (Q61, « sans l'article élidé ») : on retire toute élision d'une lettre ou « qu' » en tête du mot (l', d', j', n', s', c', m', t', qu'), pas seulement l'article : « dont s'éclaire » cache « éclaire ». À signaler dans la PR.
- Constat : « Chanson d'automne » (Verlaine) est traitée comme une chanson (titre), comme dans le legacy.
