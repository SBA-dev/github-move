# Critères d'acceptance : issue #12, Réglages d'un profil enfant

Scénarios : `features/12-reglages.feature` (`@issue-12 @wip`).
Modèle du domaine : `docs/stories/12/domain-model.md` (ses questions ouvertes n°1 à n°9 ne sont pas répétées ici, elles sont seulement référencées).

## Objectif

En tant que **parent**, je veux adapter l'application à mon enfant (mode dys, tout lire à voix haute, parcours libre, clavier des dictées, langue du parent), afin qu'il joue dans de bonnes conditions et que je comprenne les consignes.

Les réglages sont enregistrés avec le profil enfant et retrouvés sur tous les appareils. Leur effet est vérifié là où l'écran existe déjà : la page de démonstration du lot 1 (mode dys, tout lire à voix haute). Pour le parcours libre, le clavier des dictées et la langue du parent, seul l'enregistrement est vérifié.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| R1 | Un profil enfant a toujours ses cinq réglages ; sans choix du parent, ils ont leurs valeurs par défaut | Un profil créé sans toucher aux réglages reçoit les réglages par défaut · Les réglages se choisissent dès la création du profil · Les réglages proposés sont les cinq réglages du profil, sans aucune limite de durée de jeu |
| R2 | Un parent rattaché change les réglages du profil, et les retrouve sur tous ses appareils | Paul règle « <réglage> » sur « <valeur> » pour Léa (plan, 9 exemples) · Le clavier des dictées se choisit parmi trois claviers · La langue du parent se choisit parmi les vingt langues proposées, ou aucune (`@a-valider`, question n°3 du modèle) · Les réglages changés sur la tablette sont retrouvés sur le téléphone · Changer les réglages de Léa ne change pas ceux de Tom |
| R3 | Seul un parent rattaché au profil voit et change ses réglages (`@acces`) | Le second parent rattaché change aussi les réglages (`@a-valider`, question n°4 du modèle) · Un parent d'une autre famille ne voit pas les réglages de Léa · Un parent d'une autre famille ne peut pas changer les réglages de Léa · Sans connexion du parent, personne ne change les réglages de Léa · L'enfant ne se voit pas proposer les réglages en jouant |
| R4 | Le mode dys adapte l'affichage du texte quand le profil en cours l'a choisi | Avec le mode dys, la consigne s'affiche avec la police de lecture et un texte espacé · Sans le mode dys, la consigne s'affiche comme d'habitude · Avec le mode dys, ce que dit le personnage guide s'affiche aussi en mode dys · Avec le mode dys, les syllabes des mots de plus de trois lettres sont en couleurs alternées (`@a-valider`, question n°1 du modèle) · En mode dys, le mot prononcé est toujours surligné pendant la lecture · Le mode dys suit le profil en cours, pas l'appareil · Le mode dys réglé sur la tablette s'applique quand Léa joue sur le téléphone · Le mode dys s'applique aussi sans réseau · En mode dys, la page de démonstration tient dans un écran de 360 px |
| R5 | Avec « tout lire à voix haute », le personnage guide lit aussi la salutation et les choix proposés (tous `@a-valider`, question n°8 du modèle et question n°1 ci-dessous) | Avec « tout lire à voix haute », les choix proposés sont lus après la consigne · Avec deux choix proposés, la question n'a que deux choix · Avec un seul choix proposé, seule la consigne est lue · Sans « tout lire à voix haute », la consigne est lue mais pas les choix proposés · En Muet, « tout lire à voix haute » ne fait rien lire · Avec « tout lire à voix haute », le personnage guide salue l'enfant (question n°9 du modèle) |

Total : 5 règles, 27 scénarios (dont un plan de 9 exemples), 5 `@acces` (le scénario du second parent compris), 9 `@a-valider`.

Exemples tirés du legacy (`app/app.js`) : valeurs par défaut (tout décoché, clavier « Automatique », langue « Non »), les trois claviers des dictées, les 20 langues, la phrase « Est-ce a, b, ou c ? » lue seulement avec le son et au moins deux choix proposés, les syllabes en couleurs alternées pour les mots de plus de 3 lettres. Écart voulu : « temps d'écran » n'est pas repris (décision 0005), d'où le scénario « aucun réglage ne limite la durée de jeu ».

## Hors périmètre

- Effet du **parcours libre** sur les verrous du parcours (lot 4).
- Effet du **clavier des dictées** pendant une dictée, dont la règle « automatique » (lot 3).
- **Traduction des consignes** dans la langue du parent, par l'IA depuis une Edge Function (lot 6).
- Lecture des choix proposés et salutation sur les vrais écrans (bulles, accueil de l'enfant avec la série) : lots 3 et 4.
- **Changer les réglages hors ligne** : dépend de la question n°11 de #11 (création et modification d'un profil hors ligne).
- Refus d'une valeur inconnue (`ClavierDesDicteesInconnu`, `LangueDuParentInconnue`) : l'interface ne propose que les valeurs permises ; le refus est couvert par les tests unitaires du domaine et de l'Edge Function, pas par un scénario.
- Export et suppression des réglages avec le profil (#14). Choix de voix de l'appareil (#15).
- Contrôle parental à l'entrée de l'espace parent (#10).

## Questions ouvertes

1. La page de démonstration n'a aujourd'hui **aucun choix proposé** (seulement « Bonne réponse » et « Erreur »). Si l'effet de « tout lire à voix haute » y est vérifié (question n°8 du modèle), accepte-t-on qu'elle affiche trois choix proposés de démonstration (« ami », « lune », « chat ») (oui) ?
2. La phrase lue garde-t-elle la forme du legacy, **virgule comprise avant « ou »**, y compris avec deux choix : « Est-ce ami, ou lune ? » (oui) ?
3. Le mode dys s'applique-t-il **seulement quand un profil qui l'a choisi est en cours**, sur les écrans de l'enfant (oui), ou aussi dans l'espace parent et dans « Qui joue ? » (legacy : la classe `dys` reste sur toute la page tant que le profil est en cours) ?
4. Un réglage changé sur un appareil pendant que l'enfant joue sur un autre s'applique-t-il **au prochain choix du profil** dans « Qui joue ? » (oui), ou tout de suite ?
5. Après l'enregistrement des réglages, le parent voit-il une **confirmation** (« Réglages enregistrés ») (oui), ou le retour à la liste suffit-il, comme aujourd'hui (non) ?
6. Termes absents du glossaire, employés par les scénarios du mode dys : **police de lecture**, **texte espacé** et **syllabe** (si la question n°1 du modèle est tranchée par oui). À ajouter au glossaire, ou à traiter comme termes d'interface (comme « page de démonstration ») ?
7. Le **mode dys des voisins** : quand Léa (mode dys) et Tom (sans) jouent l'un après l'autre sur la même tablette, rien du mode dys de Léa ne reste pour Tom. C'est le scénario écrit ; confirmez-vous qu'aucun réglage n'est **mémorisé sur l'appareil**, contrairement à Son/Muet et au choix de voix (oui) ?
