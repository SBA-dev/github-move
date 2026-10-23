# Critères d'acceptance : issue #18, Classer, ordre, trous

Scénarios : `features/18-classer-ordre-trous.feature` (tags `@issue-18 @wip`).
Modèle du domaine : `docs/stories/18/domain-model.md` (contexte **Apprentissage**, avec **Catalogue pédagogique** et **Motivation**).
Numérotation des questions : unique pour le lot 3, voir `docs/stories/16/acceptance.md` (#18 → Q21 à Q29).

## Objectif

En tant qu'**enfant**, je veux ranger des **étiquettes** dans des maisons (exercice `classer`), les remettre dans l'ordre (exercice `ordre`) et compléter un **texte à trous** (exercice `trous`), afin de m'entraîner à trier, à ordonner et à choisir le mot juste.

Deux mécaniques : les **étiquettes à placer** (classer, ordre ; reprises par l'addition posée #20 et l'ordre des vers #22) et les **choix** de #17 appliqués à chaque **trou** (repris par les mots cachés #22). Le domaine dit **groupe** ; « maison » est le mot d'interface (Q27).

Comportement actuel (`app/`, `placeTags`, `RUNNERS.classer`, `ordre`, `trous`) repris comme premiers exemples. Écarts voulus, validés par le PO (voir « Décisions ») : « a » et « à » proposés ensemble (Q22, défaut de `fr-ce1-a-ou-a` corrigé), éléments d'ordre au même texte interchangeables (Q21), félicitation à la fin de l'ordre (Q25), `aide` des étiquettes de classer dans le format (Q26).

## Règles

Validation n°1 du lot 3 par le PO, le 2026-10-23 : « OK pour tout » (`docs/stories/lot-3-decisions.md` ; décisions `docs/decisions/0012-*` et `docs/decisions/0013-*`). Les propositions sont acceptées telles quelles : plus aucun scénario n'est `@a-valider`, et le comportement décrit n'a pas changé.

| # | Règle | Scénarios |
|---|---|---|
| 1 | Classer : chaque étiquette va dans la maison de son groupe, dans l'ordre que l'enfant choisit | La consigne est lue, puis la façon de poser les étiquettes · L'étiquette « <étiquette> » posée dans la maison « <maison> » y reste (3 cas) · L'enfant pose les étiquettes dans l'ordre qu'il veut · Une étiquette posée dans la mauvaise maison revient, avec l'aide par défaut · L'aide d'une étiquette passe avant l'aide par défaut · Reposer une étiquette dans la même mauvaise maison coûte une nouvelle erreur |
| 2 | Remettre dans l'ordre : seule l'étiquette qui vient ensuite est acceptée | La consigne est lue, puis la façon de commencer · La bonne étiquette prend sa place et le personnage guide demande la suite · Une mauvaise première étiquette est refusée · Une mauvaise étiquette suivante est refusée · La dernière étiquette bien posée est félicitée · Deux étiquettes au même texte sont interchangeables |
| 3 | Texte à trous : les trous se remplissent dans l'ordre du texte, en choisissant parmi trois mots | Le premier trou propose le mot attendu et deux autres mots · Le bon mot s'écrit dans le trou, et le trou suivant est proposé · Un mauvais mot est écarté et le personnage guide invite à relire la phrase · Au dernier trou, le personnage guide dit que le texte est complet · « a » et « à » sont proposés ensemble à chaque trou |
| 4 | Sans consigne, le personnage guide lit la consigne par défaut du type d'exercice | Un exercice <type> sans consigne commence par « <consigne par défaut> » (3 cas) |
| 5 | Les étiquettes se posent en glissant, en touchant ou au clavier, et le trou en cours est annoncé | L'étiquette « loup » se pose dans la maison « ou » <geste> (3 cas) · Le trou en cours est annoncé aux lecteurs d'écran · Les maisons et les étiquettes tiennent dans un écran de 360 px de large |

Total : 5 règles, 21 scénarios (27 cas), aucun `@a-valider`. « Je ne sais pas » en classer et en ordre : #23 (Q66).

Droits d'accès : aucun scénario `@acces` (rien n'est écrit en base).

Félicitation de classer « une fois sur deux » (Q23) : non écrite en scénario, parce qu'elle dépend du port `Hasard` ; seule l'humeur « applaudit » après chaque étiquette bien posée est vérifiée. Le tirage est couvert par les tests unitaires.

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Les sons ou, on, an | `fr-cp-sons-ou-on-an` | classer « Les maisons des sons » : maisons « ou », « on », « an » ; « loup », « pont », « dent », « savon » |
| Les syllabes | `fr-cp-syllabes` | ordre « Le mot en morceaux » : « do », « mi », « no » |
| Programmer un déplacement | `ma-cm1-programmation` | ordre « Le robot va chercher la pomme », où « Avancer de 1 case » revient deux fois (profil Tom, CM1) |
| Être et avoir au présent | `fr-cp-etre-avoir` | trous « Les phrases magiques » : « suis », « as », « sommes », « ont » ; distracteurs « es », « a », « avons », « sont » |
| a ou à ? | `fr-ce1-a-ou-a` | trous où « a » et « à » doivent être proposés ensemble (profil Tom, CE1) |
| Leçons de test | — | classer dont l'étiquette « baleine » a une aide ; classer de deux étiquettes (« loup », « pont ») ; classer, ordre et trous sans consigne |

## Hors périmètre

- Refus par le Catalogue d'un texte à trous qui ne peut pas proposer deux choix par trou (Q29) : vérifié par les tests du domaine et le test de la bibliothèque (`scripts/tests/`), pas en E2E (la bibliothèque n'en contient plus une fois le défaut corrigé).
- Erreurs d'ordre notées pour les révisions (Q24) : invisibles au lot 3 ; le lot 4 décide.
- Les durées et animations du plateau.

## Décisions

Source : validation du PO du 2026-10-23 (`docs/stories/lot-3-decisions.md`). Chaque question reçoit pour réponse sa proposition.

21. *(#18 n°1)* **Ordre** : deux éléments au même texte sont-ils interchangeables (on compare le texte) ? **Décision** : oui. → « Deux étiquettes au même texte sont interchangeables ».
22. *(#18 n°2)* **Trous** : un candidat n'est écarté que s'il est identique au mot attendu (accents et majuscules gardés), pour que « a » et « à » soient deux choix ? **Décision** : oui. → « « a » et « à » sont proposés ensemble à chaque trou ».
23. *(#18 n°3)* **Classer** : félicitation parlée une fois sur deux, humeur « applaudit » à chaque fois ? **Décision** : oui. Seule l'humeur est en scénario.
24. *(#18 n°4)* **Ordre** : ses questions ratées sont gardées par la séance comme les autres, le lot 4 décide ? **Décision** : oui. Pas de scénario (invisible au lot 3).
25. *(#18 n°5)* **Ordre** : une félicitation après la dernière étiquette ? **Décision** : oui. → « La dernière étiquette bien posée est félicitée ».
26. *(#18 n°6)* **`aide` des étiquettes de classer** dans le format ? **Décision** : oui, facultative (même réponse que Q67). → « L'aide d'une étiquette passe avant l'aide par défaut ».
27. *(#18 n°7)* **Glossaire** : étiquette, trou, distracteur au domaine ; « maison » mot d'interface (Groupe, Colonne) ? **Décision** : oui. Les scénarios disent « maison » seulement pour ce que voit l'enfant.
28. *(#18 n°8)* **Classer** : reposer une étiquette dans la même mauvaise maison coûte une nouvelle erreur ? **Décision** : oui. → « Reposer une étiquette dans la même mauvaise maison… » (4 erreurs, 1 étoile).
29. *(#18 n°9)* **Trous** : le Catalogue refuse un texte à trous qui ne peut pas proposer deux choix par trou ? **Décision** : oui. Tests unitaires et pytest seulement.

## Questions ouvertes

Aucune.
