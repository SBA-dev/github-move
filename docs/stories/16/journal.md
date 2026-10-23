# Journal : issue #16, Étapes lues puis exercices

- 07:40 · Issue créée (lot 3 de `docs/reecriture.md`), label `reecriture`.
- 11:10 · Branche de base : `main`. Modèle et scénarios préparés sur `feature/lot-3-modele-et-scenarios` (partie de `feature/15-choix-de-la-voix`, rien n'étant encore mergé dans `main`).
- 11:10 · Validation des scénarios par lot (décision de démarrage n°2).
- 11:45 · Étape 1 : modèle du domaine écrit par `domain-modeler` (`docs/stories/16/domain-model.md`). Story porteuse de la séance (plan, avancement) et de la leçon lue par le Catalogue. Ordre de livraison conseillé pour le lot : #16 → #17 → #23 → #24 → #18 → #19 → #20 → #21 → #22. Questions ouvertes à trancher à la validation du lot.
- 11:41 · Étape 2 : critères d'acceptance écrits par `po-acceptance` (`features/16-etapes-puis-exercices.feature`, `docs/stories/16/acceptance.md`) : 7 règles, 30 scénarios (35 cas), 8 `@a-valider`. Propositions du modèle appliquées comme hypothèse de travail. Syntaxe vérifiée (`npx bddgen` : seules des étapes manquantes). Numérotation unique des questions du lot (1 à 78, nouvelles à partir de 79) définie dans `docs/stories/16/acceptance.md`. ⛔ Validation du lot attendue.
- 12:10 · Validation n°1 du lot 3 : « OK pour tout » du PO (`docs/stories/lot-3-decisions.md`, décisions 0012 et 0013). Scénarios mis à jour par `po-acceptance` : 8 `@a-valider` retirés, comportement inchangé ; questions passées en « Décisions » dans `acceptance.md`. Syntaxe vérifiée.
- 12:12 · Modèle mis à jour par `domain-modeler` : questions passées en « Décisions du PO » (réponse = proposition), règles du modèle alignées sur ces décisions, renvois vers les décisions 0012 et 0013 ; termes du lot 3 validés au glossaire (conflits n°8 à n°14 tranchés, Décisions n°23 à n°30).
- 14:05 · Reprise de la story sur `claude/nice-mendel-cp9syg`, partie de `main` à jour (lots 1 et 2 et scénarios du lot 3 mergés). Branche de base : `main`.
- 14:10 · Périmètre arbitré par le PO (« Cadre seul ») : #16 livre le domaine (lecture des leçons, séance, plan, avancement, paroles de séance) et le front (page de la leçon, étapes, annonce, « Réécouter », abandon, récipient). Les scénarios qui demandent de répondre à une question (#17, bulles) ou de poser une étiquette (#18, classer), et celui du mode dys (#12, réglages pas encore livrés), sont déclarés « dépend de #n » et exclus de l'exécution, comme pour #11. La page de démonstration du lot 1 reste jusqu'à #17 (les scénarios de #6 et #7 ont besoin d'une réponse juste ou fausse).
- 14:12 · Étape 3 : boucle TDD. Comportements, dans l'ordre :
  1. Catalogue : `lireLecon` lit les champs de la leçon et ses étapes de leçon (`LeconMalFormee`).
  2. Catalogue : types d'exercices et leurs libellés ; un exercice d'un type inconnu est écarté.
  3. Catalogue : `pageDeLaLecon` (titre, « niveau · matière », exercices proposés, passage pour les adultes).
  4. Apprentissage : nombre de questions de chaque type d'exercice.
  5. Apprentissage : commencer une séance (plan complet ou d'un exercice, `ExerciceIntrouvable`, `LeconSansExercice`).
  6. Apprentissage : continuer d'étape de leçon en étape de leçon, texte à lire d'une étape (`PasDEtapeDeLeconEnCours`).
  7. Apprentissage : question réussie, avancement, exercice suivant (annoncé s'il a un titre), séance finie.
  8. Motivation : paroles de séance (accueil, fin des étapes, annonce de l'exercice).
- 15:20 · Boucle TDD du domaine terminée, 8 comportements en 7 cycles RED → GREEN (314 tests Deno verts). Le comportement 4 (avancement) a demandé une correction de la fixture « Les sons ou, on, an » (3 étiquettes au lieu des 9 réelles), faite par `test-writer`. Noms ajoutés au modèle : erreur `PasDeQuestionEnCours`, faits `EtapesDeLeconFinies` et `ExerciceSuivantCommence`, commande `reussirLaQuestionEnCours` (appelée par `repondre` à partir de #17). `texteALireDeLEtape` rend deux phrases (le texte, puis les exemples joints par « . »), comme le legacy.
