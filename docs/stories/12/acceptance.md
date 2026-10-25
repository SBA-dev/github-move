# Critères d'acceptance : issue #12, Réglages d'un profil enfant

Scénarios : `features/12-reglages.feature` (`@issue-12`, livrés : 27 scénarios verts, « Le mode dys s'applique aussi sans réseau » en attente de #44).
Modèle du domaine : `docs/stories/12/domain-model.md` (ses questions ouvertes restantes ne sont pas répétées ici).

## Objectif

En tant que **parent**, je veux adapter l'application à mon enfant (mode dys, tout lire à voix haute, parcours libre, clavier des dictées, langue du parent), afin qu'il joue dans de bonnes conditions et que je comprenne les consignes.

Les réglages sont enregistrés avec le profil enfant et retrouvés sur tous les appareils. Ils suivent le profil, jamais l'appareil (décision n°8 du lot 2). Leur effet est vérifié là où l'écran existe déjà : la page de démonstration du lot 1 (mode dys, tout lire à voix haute, avec trois choix proposés « ami », « lune », « chat »). Pour le parcours libre, le clavier des dictées et la langue du parent, seul l'enregistrement est vérifié.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| R1 | Un profil enfant a toujours ses cinq réglages ; sans choix du parent, ils ont leurs valeurs par défaut | Un profil créé sans toucher aux réglages reçoit les réglages par défaut · Les réglages se choisissent dès la création du profil · Les réglages proposés sont les cinq réglages du profil, sans aucune limite de durée de jeu |
| R2 | Un parent rattaché change les réglages du profil, et les retrouve sur tous ses appareils | Paul règle « <réglage> » sur « <valeur> » pour Léa (plan, 9 exemples) · Le clavier des dictées se choisit parmi trois claviers · La langue du parent se choisit parmi les vingt langues proposées, ou aucune · Les réglages changés sur la tablette sont retrouvés sur le téléphone · Changer les réglages de Léa ne change pas ceux de Tom |
| R3 | Seul un parent rattaché au profil voit et change ses réglages (`@acces`) | Le second parent rattaché change aussi les réglages · Un parent d'une autre famille ne voit pas les réglages de Léa · Un parent d'une autre famille ne peut pas changer les réglages de Léa · Sans connexion du parent, personne ne change les réglages de Léa · L'enfant ne se voit pas proposer les réglages en jouant |
| R4 | Le mode dys adapte l'affichage du texte quand le profil en cours l'a choisi | Avec le mode dys, la consigne s'affiche en police Andika et avec un texte espacé · Sans le mode dys, la consigne s'affiche comme d'habitude · Avec le mode dys, ce que dit le personnage guide s'affiche aussi en mode dys · Avec le mode dys, les syllabes des mots de plus de trois lettres sont en couleurs alternées · En mode dys, le mot prononcé est toujours surligné pendant la lecture · Le mode dys suit le profil en cours, pas l'appareil · Un réglage changé pendant que Léa joue s'applique au prochain choix de son profil · Le mode dys réglé sur la tablette s'applique quand Léa joue sur le téléphone · Le mode dys s'applique aussi sans réseau · En mode dys, la page de démonstration tient dans un écran de 360 px |
| R5 | Avec « tout lire à voix haute », le personnage guide lit aussi les choix proposés | Avec « tout lire à voix haute », les choix proposés sont lus après la consigne · Avec deux choix proposés, la question n'a que deux choix · Avec un seul choix proposé, seule la consigne est lue · Sans « tout lire à voix haute », la consigne est lue mais pas les choix proposés · En Muet, « tout lire à voix haute » ne fait rien lire |

Total : 5 règles, 28 scénarios (dont un plan de 9 exemples), 5 `@acces`, aucun `@a-valider`.

« Le mode dys s'applique aussi sans réseau » est tagué `@depend-de-44` : rouvrir la page sans réseau demande le service worker du build de production, alors que la page de démonstration et son profil préparé n'existent qu'en dev ; il attend le hors ligne complet (#44, lot 7).

Exemples tirés du legacy (`app/app.js`) : valeurs par défaut (tout décoché, clavier « Automatique », langue « Non »), les trois claviers des dictées, les 20 langues, la phrase « Est-ce a, b, ou c ? » lue seulement avec le son et au moins deux choix proposés, la police Andika, le texte espacé et les syllabes en couleurs alternées pour les mots de plus de 3 lettres. Écarts voulus : « temps d'écran » n'est pas repris (décision 0005), d'où le scénario « aucun réglage ne limite la durée de jeu » ; le mode dys ne s'applique qu'aux écrans de l'enfant quand le profil en cours l'a choisi (le legacy le garde sur toute la page).

## Hors périmètre

- Effet du **parcours libre** sur les verrous du parcours (lot 4).
- Effet du **clavier des dictées** pendant une dictée, dont la règle « automatique » (lot 3).
- **Traduction des consignes** dans la langue du parent, par l'IA depuis une Edge Function, avec seulement le texte de la consigne (lot 6).
- **Salutation de « tout lire à voix haute »** sur l'accueil de l'enfant, avec le texte de la série, et lecture des choix proposés dans les vraies bulles : lots 3 et 4. La salutation dite au choix du profil dans « Qui joue ? » est celle de #11, toujours dite, indépendante de ce réglage.
- **Changer les réglages hors ligne** : dépend de #11 (création et modification d'un profil hors ligne).
- Refus d'une valeur inconnue (`ClavierDesDicteesInconnu`, `LangueDuParentInconnue`) : l'interface ne propose que les valeurs permises ; le refus est couvert par les tests unitaires du domaine et de l'Edge Function, pas par un scénario.
- Export et suppression des réglages avec le profil (#14). Choix de voix de l'appareil (#15).
- Contrôle parental à l'entrée de l'espace parent (#10).

## Décisions

Validation n°1 du lot 2 par le PO, le 2026-10-22 (`docs/stories/lot-2-decisions.md`). « Tranchée » = réponse explicite du PO ; « proposition appliquée » = question de détail qui suit la proposition déjà faite. Les numéros sont ceux de l'ancienne liste de ce fichier (A) et du modèle (M).

| Question | Réponse | Effet sur les scénarios | Source |
|---|---|---|---|
| A1 / M8. Où vérifier « tout lire à voix haute » | Sur la **page de démonstration**, avec trois choix proposés (« ami », « lune », « chat »). | `@a-valider` retiré des scénarios de R5. | Tranchée, décision n°8 |
| A2. Virgule avant « ou » | **Oui** : « Est-ce ami, lune, ou chat ? » et « Est-ce ami, ou lune ? ». | `@a-valider` retiré. | Proposition appliquée |
| A3. Périmètre du mode dys | Sur les écrans de l'enfant, **quand le profil en cours l'a choisi**. | Scénario « Le mode dys suit le profil en cours, pas l'appareil » (Tom choisit son profil dans « Qui joue ? »). | Proposition appliquée |
| A4. Réglage changé sur un autre appareil pendant le jeu | S'applique **au prochain choix du profil** dans « Qui joue ? ». | Nouveau scénario « Un réglage changé pendant que Léa joue s'applique au prochain choix de son profil ». | Proposition appliquée |
| A7. Réglages mémorisés sur l'appareil ? | **Jamais** : ils suivent le profil, pas l'appareil (contrairement à Son/Muet et au choix de voix). | Phrase ajoutée à la description de la fonctionnalité ; scénarios de R4 inchangés. | Tranchée, décision n°8 |
| M1. Mode dys | Police **Andika**, texte espacé, **syllabes en couleurs alternées**. | « police de lecture » remplacé par « police Andika » ; `@a-valider` retiré du scénario des syllabes. | Tranchée, décision n°8 |
| M2. Ce qui part à l'IA | Seul le texte de la consigne. | Hors périmètre (lot 6) précisé. | Tranchée, décision n°8 |
| M3. Liste des langues | Les **20 langues** sont gardées. | `@a-valider` retiré du scénario des vingt langues. | Tranchée, décision n°8 |
| M4. Le second parent change les réglages ? | **Oui**, mêmes droits. | `@a-valider` retiré du scénario du second parent. | Tranchée, décision n°1 |
| M9. Deux salutations « Bonjour Léa ! » | **Gardées** : celle du choix du profil (#11, toujours dite) et celle de « tout lire » (accueil de l'enfant, avec la série). | Le scénario « le personnage guide salue l'enfant » est retiré : sur la page de démonstration il ne se distinguait pas de la salutation de #11, et l'accueil avec la série arrive aux lots 3 et 4 (hors périmètre). La règle R5 ne parle plus que des choix proposés. | Proposition appliquée |
| (sans numéro) Muet | En Muet, rien n'est lu, comme dans le legacy. | `@a-valider` retiré. | Proposition appliquée |

### Après la création d'un profil (story #27)

Décision de #27 (réponses 27.16 et 27.19, PO, 2026-10-24, « 27# reco OK ») : après la création d'un profil enfant dans l'espace parent, l'espace parent se ferme, le profil créé devient le profil en cours et la proposition du test de départ s'affiche ; « Plus tard » mène à l'accueil de cet enfant. Sans bibliothèque chargée, on va directement à l'accueil de l'enfant (réponse 27.5). Pour créer un autre profil, le parent rentre dans l'espace parent (contrôle parental).

Effet ici : aucun texte de scénario ne change ; adaptation dans les steps (`e2e-tester` de #27).
- « Les réglages se choisissent dès la création du profil » : « les réglages de Léa indiquent « mode dys » : « oui » » et « les autres réglages de Léa ont leurs valeurs par défaut » rentrent dans l'espace parent s'il n'est plus affiché.
- « Un profil créé sans toucher aux réglages reçoit les réglages par défaut » : l'étape « Paul est dans l'espace parent » qui suit la création y rentre déjà ; inchangé.

## Questions ouvertes

Aucune n'est bloquante. Celles du modèle restent ouvertes : n°1 (expliquer au parent que le mode dys est une donnée gardée sur l'enfant) et la question technique T3 (emplacement du découpage en syllabes).

1. (ancienne A5) Après l'enregistrement des réglages, le parent voit-il une **confirmation** (« Réglages enregistrés ») (oui), ou le retour à la liste suffit-il, comme aujourd'hui (non) ?
2. (ancienne A6) **Police Andika**, **texte espacé** et **syllabe** : termes du glossaire (oui), ou termes d'interface, comme « page de démonstration » (non) ? Le glossaire ne les définit pas séparément (il les cite dans la définition du mode dys).
