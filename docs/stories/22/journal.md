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
- 18:05 · TDD, comportements 1 à 8 verts (1187 tests). Écart : après le `feat` du comportement 1, trois tests existants ne compilaient plus (type `memoriser` devenu spécifique) ; adaptés par `test-writer` dans un commit `test` séparé (6e06a1b). Le test « Je ne sais pas vise le vers suivant » a été retiré (consigne corrigée : la poésie se comporte comme un `ordre`).
- 18:15 · Revue intermédiaire du bloc domaine (`6aedff7..dc081cc`) : À CORRIGER (cycle 1) — refrain d'une poésie courte (moins de trois choix), comportements délégués sans test. Corrigé par 71d4978 (red), fdce1f3, e2f8c0e ; énoncé d'un mot caché = le vers (sans « / »).
- 18:25 · Revue delta cycle 2 (`dc081cc..e2f8c0e`) : APPROUVÉ. Dernier commit relu : `e2f8c0e`. Non bloquants notés : le séparateur « / » est connu de `trous.ts` (coupure de l'énoncé) et du plan ; questions d'une poésie rangées sous `ordre` et `trous` pour les statistiques (à voir au lot 4) ; une poésie dont tous les mots non cachés font moins de 3 lettres ne peut offrir que 2 choix ; élision « lorsqu' », « puisqu' » non retirée.
- 18:25 · Câblage (front) lancé : pas de migration, la revalidation serveur est couverte par le domaine.
- 18:35 · Câblage front (8f00db1) : `ExerciceDeMemorisation.tsx`, `useMemorisation.ts`, ajouts dans `useDeroulementDeSeance.ts` et `EcranDeSeance.tsx`. Export de `PlanDeMemorisation` par l'index du domaine (le front y lit les consignes, sans règle). Verrou `base` demandé (redéploiement de `terminer-la-seance`), en file derrière #21.
- 18:45 · Review étape 4, cycle 1 : À CORRIGER — interligne du mode dys écrasé sur les vers et le texte à trous. Corrigé (bfe4120), plus `consigneLueAuDebut("memoriser")` = faux (250990f red, 5fd3167) et garde de `useMemorisation` (33f8cb7).
- 18:55 · Review étape 4, cycle 2 : APPROUVÉ (dernier commit relu 33f8cb7). Dette notée pour la PR : vitesse 0,85 du legacy non reprise (le domaine voix n'offre que lent/normal) ; « Réécouter » pendant « redire » relit l'invitation, pas la poésie ; sans voix, la mise en avant vers par vers est trop rapide pour être vue ; props bouche-trou passées à `ExerciceAChoix` ; `.texte-de-lecture` (#17) a le même défaut d'interligne en mode dys.
