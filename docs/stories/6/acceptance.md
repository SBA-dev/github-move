# Critères d'acceptance : issue #6, Design, univers et personnage guide

Scénarios : `features/6-univers-et-personnage-guide.feature` (tags `@issue-6 @wip`).
Modèle du domaine : `docs/stories/6/domain-model.md` (contexte Motivation).

## Objectif

En tant qu'**enfant**, je veux jouer dans l'univers que j'ai choisi, avec son personnage guide qui me parle et réagit, afin d'avoir envie de revenir réviser.

Comportement actuel (`app/`) : `WORLDS` et `PALETTES` (6 univers), `setChild` (univers par défaut `animaux`), humeurs `think` / `cheer`, `PRAISE`, `OOPS`, `VOICE_STYLE.cri`, en-tête de `app/index.html`, `REDUCED` et `@media (prefers-reduced-motion)`. Il donne les premiers exemples.

Le choix de l'univers dans le profil enfant arrive au lot 2. Ici, les scénarios partent d'un profil enfant qui a déjà un univers (précondition `Étant donné`).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Chaque univers a son personnage guide et son paysage | Dans l'univers « <univers> », le personnage guide est <personnage guide> (6 univers) · <personnage guide> se présente avec son titre et son royaume (6 univers, `@a-valider`) · Deux univers différents donnent deux paysages et deux couleurs principales différents · L'univers ne change pas les couleurs des colonnes de calcul (`@a-valider`) |
| 2 | Sans univers connu, l'enfant joue dans l'univers « Animaux de la forêt », avec Noisette | Sans profil enfant en cours, Noisette accueille l'enfant · Un profil enfant <cas> joue avec Noisette (sans univers, univers inconnu, `@a-valider`) |
| 3 | Le personnage guide montre son humeur : content par défaut, il applaudit après une bonne réponse et réfléchit après une erreur | Le personnage guide est content quand l'enfant commence à jouer · Le personnage guide applaudit après une bonne réponse (`@a-valider`) · Le personnage guide réfléchit après une erreur (`@a-valider`) · Après avoir réfléchi, le personnage guide applaudit la bonne réponse suivante (`@a-valider`) |
| 4 | Le personnage guide félicite avec ses propres expressions ou une félicitation commune, et encourage sans jamais punir | Après une bonne réponse, <personnage guide> dit une félicitation commune ou une de ses expressions (6 univers, `@a-valider`) · Les félicitations communes sont les mêmes dans tous les univers (`@a-valider`) · Après une erreur, le personnage guide encourage et laisse une nouvelle chance (`@a-valider`) |
| 5 | L'en-tête donne toujours accès à l'accueil, au son, au retour et à l'espace parent, et montre l'enfant en cours | L'en-tête montre le prénom et le niveau de l'enfant en cours · Sans profil enfant en cours, l'en-tête n'affiche aucun prénom (`@acces`) · Le nom de l'application ramène à l'accueil · Le retour n'est proposé que s'il y a un écran précédent · L'entrée de l'espace parent s'appelle « Espace parent » · Le choix Muet est gardé sur l'appareil · En repassant au son, le personnage guide se présente (`@a-valider`) |
| 6 | L'univers et le personnage guide restent utilisables sur un petit écran et avec les mouvements réduits | L'univers tient dans la largeur d'un écran de <largeur> px (360, 820, 1280) · Les commandes de l'en-tête sont assez grandes pour un doigt d'enfant · L'en-tête s'utilise au clavier · Avec les mouvements réduits, le personnage guide ne saute pas mais montre qu'il applaudit (`@a-valider`) · Avec les mouvements réduits, le personnage guide ne penche pas la tête mais montre qu'il réfléchit (`@a-valider`) · Avec les mouvements réduits, le paysage reste immobile |

Total : 6 règles, 26 scénarios (44 cas exécutés avec les exemples des plans).

Étapes réutilisées : « j'ouvre Savanturier », « je vois le nom de l'application », « la page tient dans la largeur de l'écran » (`features/0-socle.feature`), « l'écran de l'appareil mesure <largeur> px de large » (`features/8-pwa-installable.feature`).

Écart voulu avec le legacy, déjà tranché par `CLAUDE.md` : l'entrée s'appelle « Espace parent », et non plus « Espace adulte ».

Ce qui n'est pas vérifié en E2E mais par les tests unitaires du domaine (`@domain/motivation`) : la proportion des expressions du personnage guide parmi les félicitations (question n°5 du modèle), le tirage uniforme, le catalogue complet des 6 univers.

Droits d'accès : la story ne crée ni table ni donnée de famille, donc aucune policy RLS. Le seul scénario `@acces` vérifie que, sans profil enfant en cours, l'en-tête n'affiche le prénom d'aucun enfant.

## Hors périmètre

- Le choix et le changement d'univers dans le profil enfant (lot 2, « Créer et modifier un profil enfant »).
- Le contrôle parental derrière l'entrée « Espace parent » (lot 2). Ici, on vérifie seulement que l'entrée est présente.
- La voix du personnage guide : lecture à voix haute, caractère de la voix, effet de Muet sur la voix (story #7). Ici, on vérifie seulement le bouton Son/Muet de l'en-tête et que le choix est gardé sur l'appareil.
- Les exercices eux-mêmes, la correction des réponses et l'aide propre à chaque question (lot 3).
- L'écran de fin qui commence toujours par une expression du personnage guide avec 3 étoiles (lot 3, « Étoiles et écran de fin »).
- Le mode dys (lot 2, « Réglages »).
- Les épisodes, la cabane et les badges de l'univers (lot 5).

## Questions ouvertes

Les questions 1 à 9 du modèle du domaine (`docs/stories/6/domain-model.md`) restent valables et ne sont pas répétées ici. Les scénarios `@a-valider` des règles 2, 3 et 4 dépendent des questions 3, 4 et 6 du modèle.

1. **Humeurs et paroles observables au lot 1** : les séances, les questions et les réponses n'arrivent qu'au lot 3. Comment vérifier au lot 1 les scénarios des règles 3, 4 et 6 (« Léa répond 7 à « 3 + 4 » ») ? Propositions : (a) les vérifier au lot 3, en gardant ici seulement l'humeur `content` ; (b) livrer une petite question de démonstration dès le lot 1. Même question pour « L'univers ne change pas les couleurs des colonnes de calcul » (addition posée, lot 3).
2. **Entrée dans l'univers au lot 1** : les scénarios disent « Quand Léa commence à jouer ». Sans choix du profil enfant (lot 2), quel écran du lot 1 montre l'univers d'un profil existant ? Est-ce l'écran « qui joue ? » du legacy, avancé au lot 1, ou un profil préparé seulement pour les tests ?
3. **Royaume et titre affichés** : dans le legacy, `realm` et `title` ne sont affichés nulle part (seul le nom du personnage guide l'est). Faut-il que le personnage guide se présente avec son titre et son royaume (scénario `@a-valider`), et où (accueil, première séance) ? Lié à la question 8 du modèle.
4. **Accueil sans profil enfant** : dans le legacy, l'accueil (« qui joue ? ») et le retour par le nom de l'application repassent dans l'univers « Animaux de la forêt », même si l'enfant jouait dans un autre univers. On garde ce comportement ? (oui / non ; sinon, l'accueil garde l'univers du dernier enfant)
5. **Mouvements réduits** : dans le legacy, avec `prefers-reduced-motion`, le personnage guide ne bouge plus mais son visage change encore (il sourit ou réfléchit). On garde ce changement de visage comme seul signe de l'humeur ? (oui / non)
6. **Présentation au retour du son** : le legacy fait dire « Je t'entends ! Je suis Noisette. » quand on repasse au son. Le garde-t-on ? Ce scénario touche aussi la story #7.
7. **Retour dans l'en-tête** : sur quels écrans du lot 1 le retour doit-il apparaître ? Le seul scénario écrit vérifie qu'il est absent à l'accueil.
8. **Vocabulaire** absent du glossaire :
   - « paysage » et « couleur principale » : présentation, hors domaine selon le modèle. Peut-on les employer dans les scénarios sans les ajouter au glossaire ?
   - « accueil » de l'application : même question que la question 7 de la story #8 (est-ce l'écran « Aujourd'hui » du lot 4 ?).
   - « en-tête » et « mouvements réduits » : termes d'interface. Les garder hors du langage ubiquitaire ?
   - « colonnes de calcul » (centaines, dizaines, unités) : faut-il un terme du glossaire, le jour où l'addition posée sera réécrite (lot 3) ?

## Décisions

Aucune pour l'instant.
