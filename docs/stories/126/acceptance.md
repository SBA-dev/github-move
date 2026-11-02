# Critères d'acceptance : story #126, bulles de choix (tranche 98b)

Scénarios : `features/126-bulles-de-choix.feature`. Modèle : `docs/stories/126/domain-model.md`. Épopée #95, tranche 98b de #98 (`docs/stories/98/acceptance.md`, abrégé « #98 »).

Tags :
- `@issue-126 @wip` sur la fonctionnalité ;
- `@a-valider` sur les scénarios (ou le bloc d'exemples) qui dépendent d'une question ouverte, cité en commentaire au-dessus ;
- pas de `@acces` (voir « Droits d'accès ») ; pas de `@depend-de-…` : #97 et #98 sont mergées.

État : **cadrage à valider** par le PO (⛔). Aucun code.

## Objectif

En tant qu'**enfant**, je veux que les choix de réponse soient des bulles de mon univers, qui flottent doucement, afin que répondre ressemble à un petit jeu.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : la bonne réponse se voit (la bulle de choix rebondit puis s'efface ; le mot juste rejoint son trou et s'y illumine) ; le dernier trou garde la fête de #97 ;
- **autonomie** : l'enfant retrouve dans chaque question l'univers qu'il a choisi (#6) ; il répond au doigt, au clavier par Tab ou par les flèches.

La story ne change que l'affichage des choix. Aucune règle de correction, aucune erreur, aucune étoile, aucun avancement, aucune parole du personnage guide ne change. Aucune donnée nouvelle, aucune migration, aucune Edge Function. Elle ne franchit aucun garde-fou de la section 5 du skill : pas de hasard (le flottement est régulier, #126.9), pas de pénalité, pas de cible qui fuit le doigt (la zone de toucher ne bouge jamais, 98.3). Les dessins suivent le skill `illustration`, section 0, et l'invariant 20 de #98 : rien n'éclate ni ne crève (98.5), aucun bruit de détonation, aucune arme, flamme, fumée, sirène ni lampe qui clignote, aucun texte, lettre ni chiffre dans le dessin.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Dans `bulles` et `ecoute`, les bulles de choix flottent doucement, toutes de la même façon, une fois la question lue ; elles s'arrêtent pour de bon au premier toucher ; leur zone de toucher ne bouge jamais et garde 44 px ; avec les mouvements réduits, aucune ne flotte ; dans les autres types, les choix ont la forme de bulle de choix sans flotter | Plan « Dans <exercice>, les bulles de choix flottent doucement une fois la question lue » : bulles, écoute (98.3, 98.4) · Plan « Après <premier toucher>, plus aucune bulle de choix ne flotte jusqu'à la fin de la question » : réponse fausse ; « Je ne sais pas » `@a-valider` (#126.4) · Plan `@a-valider` « Pendant <parole>, les bulles de choix ne flottent pas, puis reprennent » : consigne relue (#126.4), mot à écouter redit (#126.11) · Plan « Dans <exercice>, les choix sont des bulles de choix de l'univers, qui ne flottent pas » : lecture, texte à trous, conjugaison, mots cachés, calcul au CP (98.4) · « Avec les mouvements réduits, aucune bulle de choix ne flotte, et les choix sont là » · Plan « Dans l'univers « <univers> », les bulles de choix tiennent dans un écran de 360 px, gardent 44 px, et leur zone de toucher ne bouge pas » : les 6 univers · « Sur un écran de 360 px, une bulle de choix au texte long passe sur plusieurs lignes et se lit en entier » (#126.2) · `@a-valider` « Les bulles de choix d'une même question ont la même largeur, celle du choix le plus long » (#126.3) · `@a-valider` « En séance de révision, la question d'un classer a des bulles de choix qui flottent » (#126.5) |
| R2 | Dans chacun des 6 univers, les bulles de choix ont le dessin de cet univers, pour tous les types d'exercices, en séance, en séance de révision et au test de départ ; changer d'univers ne change ni les textes lus, ni les annonces des lecteurs d'écran, ni les erreurs, ni les étoiles ; un profil sans univers connu voit les bulles de choix de l'univers « Animaux de la forêt » | Plan « Dans l'univers « <univers> », les bulles de choix ont le dessin de cet univers, et les lecteurs d'écran n'annoncent que leur texte » : les 6 univers (98.2, 98.31) · Plan « Un profil enfant <cas> voit les bulles de choix de l'univers « Animaux de la forêt » » : sans univers, univers inconnu · Plan « <Où>, les bulles de choix ont le dessin de l'univers et flottent comme en séance » : séance de révision, test de départ (98.13) · Plan « Dans l'univers « <univers> », une réponse fausse sur une bulle de choix coûte une erreur, comme avant » : Sports, Danse |
| R3 | Après le rebond de #97, la bulle de choix juste s'efface en douceur sur place, sans étincelles et sans éclater ; les autres bulles de choix ne bougent pas ; un toucher pendant la félicitation ne fait rien | Plan « Dans l'univers « <univers> », la bulle de choix juste rebondit, puis s'efface en douceur, sans étincelles » : les 6 univers (98.5) · « Avec les mouvements réduits, la bulle de choix juste disparaît en fondu, sans grandir » · « Pendant la félicitation, toucher une autre bulle de choix ne coûte rien et ne retarde rien » (97.17) |
| R4 | Dans un texte à trous, une conjugaison et les mots cachés, le mot juste rejoint son trou ou sa ligne, puis s'y illumine, sans briller comme une bonne réponse montrée ; le dernier trou et la dernière personne gardent les étincelles de #97 | Plan « Dans <exercice>, le mot juste « <réponse> » rejoint sa place, puis s'y illumine » : texte à trous, conjugaison, mots cachés · Plan « <dernière réponse> rejoint sa place, puis les étincelles de #97 apparaissent » : dernier trou, dernière personne · « Avec les mouvements réduits, le mot juste apparaît dans son trou, sans voyager » · `@a-valider` « Dans un texte à trous, seul le mot voyage jusqu'au trou, et sa bulle de choix vide s'efface à sa place » (#126.6) |
| R5 | Sur une bulle de choix, le choix écarté et la bonne réponse montrée restent reconnaissables, par un signal d'état identique dans les 6 univers, posé par-dessus le dessin | Plan « Dans l'univers « <univers> », un choix écarté se voit comme dans tous les univers » : les 5 univers autres qu'Animaux de la forêt (#126.10) · Plan « Dans l'univers « <univers> », la bulle de choix montrée par « Je ne sais pas » brille comme dans tous les univers » : les 5 mêmes univers |
| R6 | Au clavier, Tab et Entrée répondent comme avant, et les flèches passent d'une bulle de choix à l'autre ; le mode dys et les lecteurs d'écran restent inchangés | « Au clavier seulement, Léa répond avec Tab et Entrée, comme avant » · « Au clavier, les flèches passent d'une bulle de choix à l'autre, et Entrée répond » (98.15) · `@a-valider` « Les flèches passent le choix écarté et s'arrêtent à la dernière bulle de choix » (#126.7) · « En mode dys, les bulles de choix de l'univers s'affichent en mode dys » |

Au total : **6 règles, 26 scénarios** (dont 14 plans de scénario, **50 exemples**), soit 62 cas exécutés. **6 portent `@a-valider`** : 5 scénarios (dont 1 plan) et 1 bloc d'exemples (« Je ne sais pas » du Plan du premier toucher).

Les Plans sur les univers suivent la mesure de #98 : les 6 univers là où le dessin peut changer ce qu'on vérifie (dessin, tenue à 360 px et zone de toucher, effacement de la bulle de choix juste) ; les 5 autres univers là où l'on compare à Animaux de la forêt (signaux communs) ; 2 univers là où le dessin ne peut rien changer (étoiles) ; un seul univers ailleurs (Sports pour la séance de révision et le test de départ).

Les lecteurs d'écran sont vérifiés dans R2 (Plan des 6 univers : ils n'annoncent que le texte du choix, ni le dessin ni le mouvement), avec R6 pour le clavier et le mode dys.

Checklist `po-acceptance` du skill `gamification` :
- besoin nourri : compétence et autonomie (ci-dessus) ;
- déclencheur métier de chaque retour : une **Réponse** juste (rebond de #97, puis effacement ; mot qui rejoint son trou), une réponse fausse (balancement de #97, choix écarté), « Je ne sais pas » (bonne réponse montrée), le **Texte complet** (étincelles de #97) ; le flottement n'est déclenché par rien de métier : il est l'état de repos d'une question de `bulles` ou d'`ecoute`, et s'arrête dès le premier toucher ;
- retour après une erreur : R5 et le Plan des étoiles de R2 (même erreur, même encouragement, nouvelle chance) ;
- mouvements réduits : R1, R3, R4, l'information reste (choix présents, couleur de réussite, mot dans son trou) ;
- aucun garde-fou franchi ; aucune récompense nouvelle.

### Droits d'accès

La story ne crée, ne lit et n'enregistre aucune donnée nouvelle : **pas de scénario `@acces`**. L'univers est lu sur le profil enfant en cours (#6, #96). Les écrans du parent ne montrent aucun exercice.

### Séance complète et délais

**Aucun scénario ne joue une séance complète** : il n'y a pas besoin d'ajouter `@issue-126` à `features/steps/delais.steps.ts`. Deux scénarios passent par une séance de révision ou un test de départ, sans aller jusqu'à leur fin : le Plan « <Où>, les bulles de choix ont le dessin de l'univers et flottent comme en séance » (2 exemples) et `@a-valider` « En séance de révision, la question d'un classer… ». #98 a joué les mêmes situations sans délai allongé. Si `e2e-tester` mesure plus de 30 s, il demande l'ajout.

### Précisions pour les étapes (pour `e2e-tester`)

- **Projets** : tous les scénarios tournent sur `telephone` (mise au point) et `tablette` (non-régression).
- **Dessin de l'univers** : « les bulles de choix de la question ont le dessin de l'univers « … » » se vérifie par **`data-univers`** sur chaque bulle de choix (`data-testid="choix"`, zone de toucher), égal à la clé de l'univers. **Jamais par un tracé** SVG. Elle vaut pour `QuestionAChoix` et pour `ReponseAuCalcul` (calcul au CP par choix).
- **Flotter** : un attribut d'état sur la bulle de choix (nom choisi par l'implementer, `data-flotte` par exemple : vigilance 10 du modèle). « ne flotte pas tant que Noisette lit la question » : l'attribut est absent tant que la parole en cours est la question (ou la consigne) ; « toutes de la même façon » : même attribut, même animation calculée (nom et durée) sur chaque bulle de choix ; un décalage régulier selon le rang reste permis (#126.9). Avec les mouvements réduits : attribut absent et aucune animation calculée.
- **Zone de toucher immobile** : la boîte englobante du bouton (`data-testid="choix"`) est la même à deux instants du flottement ; seul un calque décoratif à l'intérieur bouge (vigilance 2). Elle mesure au moins 44 px (étape existante « chaque choix mesure au moins 44 px de haut et de large »).
- **Bulle de choix juste** : « rebondit, puis … s'efface en douceur à sa place, sans éclater » lit l'ordre des états (rebond de #97 d'abord, puis l'état d'effacement, `data-eclatee` gardé par dette, vigilance 10) ; la bulle reste dans la mise en page (opacité, pas de retrait du DOM) ; aucun élément d'étincelles. « les bulles de choix « on » et « an » restent à leur place » : leur boîte englobante ne change pas pendant l'effacement. Avec les mouvements réduits : pas d'agrandissement (échelle calculée 1), fondu seulement.
- **Toucher pendant la félicitation** : le toucher sur « on » arrive pendant que la parole en cours est la félicitation ; aucune erreur, aucun effet sonore « réponse fausse », la félicitation finit en entier, la question suivante vient ensuite.
- **Mot qui rejoint sa place** : un élément du mot en mouvement entre la bulle de choix et le trou (ou la ligne du tableau), puis le trou (ou la ligne) porte un état d'éclat bref, **jamais `data-brille`** (« il ne brille pas comme une bonne réponse montrée »). Au dernier trou et à la dernière personne, les étincelles et « texte complet » de #97 viennent ensuite (étapes existantes). Avec les mouvements réduits : aucun mot en mouvement, le mot est dans le trou.
- **Choix écarté commun** : « il est écarté de la même façon que dans l'univers « Animaux de la forêt » » compare l'attribut (`data-ecarte="true"`) et les styles calculés du signal d'état commun (opacité, filtre, couleur du texte) à ceux de l'univers Animaux de la forêt, sur le modèle de « elle brille de la même façon… » de #98.
- **Bonne réponse montrée commune** : « il brille de la même façon que dans l'univers « Animaux de la forêt » » reprend l'étape « elle brille de la même façon… » de #98 (le `.signal-brille` commun, `data-brille="true"`), appliquée à une bulle de choix ; elle ne change pas le sens de l'étape existante.
- **Flèches** : « Léa répond « 7 » au clavier, en passant d'une bulle de choix à l'autre avec les flèches » part du focus posé sur le premier choix possible, avance par → jusqu'à « 7 », puis Entrée ; jamais Tab. Le scénario `@a-valider` (#126.7) lit l'élément qui a le focus après chaque → .
- **Choix long** : la question de test reprend l'étape de #17 (« une question de test « … » a les choix « … », « … » et « … », de réponse « … » ») ; le choix long fait 96 caractères, proche du maximum de la bibliothèque (97).
- **Étapes de #98 à ouvrir à `@issue-126`** (elles portent `{ tags: "@issue-98" }` dans `exercices-comme-des-jeux.steps.ts`) : « Léa a un profil enfant préparé de niveau CP dans l'univers « … » » (version de #98), « Léa a choisi l'univers <clé> », « Léa a un profil enfant préparé sans univers », « … dont l'univers est inconnu », et le `Before` de la ligne 106 si les étapes de #126 en ont besoin.

#### Étapes nouvelles

- « aucune bulle de choix ne flotte tant que Noisette lit la question »
- « ensuite, les bulles de choix flottent doucement, toutes de la même façon »
- « aucune bulle de choix ne flotte plus jusqu'à la fin de la question »
- « aucune bulle de choix ne flotte » et sa forme « aucune bulle de choix ne flotte pendant que Noisette relit la consigne | pendant que la voix anglaise redit « … » »
- « les bulles de choix de la question ont le dessin de l'univers « … » »
- « la zone de toucher de chaque bulle de choix reste immobile pendant que son dessin flotte »
- « les bulles de choix « … », « … » et « … » ont la même largeur et la même hauteur »
- « les lecteurs d'écran annoncent les choix « … », « … » et « … », sans décrire leur dessin ni leur mouvement »
- « le choix « … » rebondit, puis sa bulle de choix s'efface en douceur à sa place, sans éclater »
- « les bulles de choix « … » et « … » restent à leur place »
- « sa bulle de choix disparaît en fondu, sans grandir »
- « Léa touche la bulle de choix « … » pendant que Noisette la félicite »
- « le mot « … » rejoint le trou de « … » | la ligne « … » du tableau, puis s'y illumine »
- « il ne brille pas comme une bonne réponse montrée »
- « le mot « … » apparaît dans le trou de « … », sans voyager »
- « seul le mot « … » voyage jusqu'au trou de « … » » et « sa bulle de choix, vide, s'efface en douceur à sa place »
- « il est écarté de la même façon que dans l'univers « Animaux de la forêt » »
- « il brille de la même façon que dans l'univers « Animaux de la forêt » »
- « Léa répond « … » au clavier, en passant d'une bulle de choix à l'autre avec les flèches »
- « Léa passe d'une bulle de choix à l'autre avec la flèche droite, depuis « … », jusqu'au bout et une fois de plus », « le focus passe, dans l'ordre, sur les bulles de choix « … », « … » et « … » », « le focus reste sur la bulle de choix « … » » (l'étape « le focus va, dans l'ordre, sur … » de #99 lit les leçons du parcours : elle n'est pas reprise)

#### Étapes existantes reprises

« Léa joue l'exercice « … » de la leçon « … » », « Léa joue la leçon « … » », « Léa joue l'item « … » de l'exercice « … » », « Léa joue la question de test « … » », « une question de test « … » a les choix …, de réponse « … » », « les choix sont affichés dans l'ordre … », « Noisette a fini de lire la question « … » », « Léa en est à la question « … » », « Léa a répondu « … » (à la question « … ») », « Léa répond « … » (, au clavier seulement) », « Léa demande à écouter de nouveau », « l'item « … » commence », « la question « … » s'affiche », « ensuite seulement, Léa voit les choix … », « ensuite seulement, la question « … » s'affiche », « la question « … » est réussie », « la question « … » reste posée », « le choix « … » reste visible, pâle, et ne réagit plus », « Noisette applaudit en sautant », « Noisette dit une félicitation commune ou l'une de ses expressions, en entier », « l'appareil a une voix française et une voix anglaise », « chaque choix mesure au moins 44 px de haut et de large » (#17) ; « Léa est sur la page de la leçon « … » », « Léa choisit seulement l'exercice « … » », « Léa joue seulement l'exercice « … » de la leçon « … » », « le trou de « … » est mis en avant », « Léa a rempli les trois premiers trous », « Léa voit « … » » (#18) ; « Léa en est à « … » » (#19) ; « Léa retrouve les mots cachés de « … » » (#22) ; « le calcul « … » s'affiche » (#20) ; « une question de test bulles « … » n'a pas d'aide », « Léa dit « Je ne sais pas » », « seul le choix « … » reste, et il brille », « Léa joue une leçon de test d'une seule question à quatre choix » (#23) ; « Léa gagne <n> étoiles » (#24) ; « la bibliothèque de test des révisions est servie », « Léa a <n> questions dues de la leçon « … » », « Léa commence la séance de révision » (#28) ; « la bibliothèque de test du test de départ est servie », « la proposition du test de départ est affichée pour Léa », « Léa accepte la proposition du test de départ » (#27) ; « l'appareil demande des mouvements réduits », « aucun message d'erreur n'apparaît » (#6) ; « Léa demande à réécouter la consigne » (#7) ; « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran » (socle) ; « la consigne et tous les choix de la question restent visibles en entier » (#96) ; « Paul a réglé « mode dys » sur « oui » pour Léa », « Léa voit la question et les choix en mode dys : … » (#12, #17) ; « le choix « … » rebondit » (dans une phrase plus longue, voir ci-dessus), « le choix « … » prend la couleur de réussite sans rebondir », « aucune étincelle n'apparaît », « des étincelles apparaissent », « Léa entend l'effet sonore « … » », « Léa n'entend pas l'effet sonore « … » » (#97) ; « Léa a choisi l'univers <clé> », « Léa a un profil enfant préparé sans univers | dont l'univers est inconnu », « Léa a pour question retenue l'étiquette « … » de l'exercice « … », due aujourd'hui », « Léa voit la question « … », avec les choix … » (#98).

## Scénarios existants à mettre à jour

**Aucun texte de scénario existant ne change** avec les recos de #126.1 à #126.11. Points à surveiller dans les étapes :

| Fichier | Scénario | Ce qui peut changer dans l'étape |
|---|---|---|
| `features/17-…`, `18-…`, `19-…` | « le choix « … » reste visible, pâle, et ne réagit plus », « les choix écartés … restent visibles, pâles » | Le texte reste. Si l'étape mesure l'opacité de la bulle, elle suit le signal commun du choix écarté (#126.10 : gris pâle, texte à 4,5:1) au lieu de l'opacité 0,45. |
| `features/23-…`, `97-…` | « seul le choix « 7 » reste, et il brille », « le choix « … » est mis en avant sans bouger » | Le halo de la bulle de choix passe au `.signal-brille` de 98a (vigilance 9) : `data-brille="true"` reste ; une étape qui lirait le `box-shadow` animé d'avant doit lire le signal commun. |
| `features/97-…` | « le choix « 7 » rebondit » | Le rebond reste le premier retour ; l'effacement vient **après** (98.5). Si l'étape attend la fin du rebond sur un bouton déjà effacé, elle doit lire l'état du rebond d'abord. |
| `features/18-…`, `19-…`, `22-…` | « Léa voit « Je suis dans le jardin. » », « Léa voit « je suis » dans le tableau » | Le mot arrive dans le trou après son chemin (moins de 400 ms) : les attentes Playwright (`expect` qui réessaie) suffisent, aucun texte ne change. |

## Hors périmètre

- **Le dessin de chaque univers** : il est choisi par le PO (#126.1, #126.2) et validé sur la planche `bulle-de-choix.png` (98.28), pas par un scénario. La PR attend les 6 dessins validés (98.31).
- **Les 6 captures jointes à la PR** (98.29, #126.8) : sans tag `@visuel`, sans capture de référence ; elles ne font échouer aucun test.
- **Le trou hors de l'écran** à 360 px (vigilance 7) : selon la reco de #126.6, le mot apparaît dans le trou sans voyager ; pas de scénario (cas de mise en page, vérifié sur la capture et par la review).
- **Le réglage des mouvements réduits qui change pendant une question** (vigilance 5) : le hook réactif `useMouvementsReduits()` le couvre déjà (#102) ; pas de scénario ici.
- Les autres tranches de #98 : #130 (petit train), #127 (addition), #131 (boîte et barres), #128 (claviers), #129 (textes qui se dévoilent). Le mode par choix de `boite`, `barres` et de l'étape calculer d'`addition` reçoit la même bulle de choix (même composant, 98.4) ; seul le calcul au CP est prouvé par un scénario.
- Aucune donnée, aucune règle du domaine, aucun son nouveau : les sons restent ceux de #97.

## Questions ouvertes

Les questions **#126.1 à #126.10** sont posées dans `docs/stories/126/domain-model.md`, avec leur contexte, leur exemple, leur reco et leurs options. Elles sont reprises ici en bref, avec les scénarios qui en dépendent.

| # | Question | Reco | Scénarios concernés |
|---|---|---|---|
| #126.1 | Quel objet dessine-t-on pour la bulle de choix dans chaque univers ? | A : bulle de savon, bulle magique irisée, ballon de sport à coutures sur les bouts, bulle bleue à étoile d'insigne, bulle d'eau, bulle à paillettes fixes | Aucun texte (planche) |
| #126.2 | La bulle a-t-elle la même forme de capsule dans les 6 univers ? | Oui, même capsule qui s'allonge, décor sur le contour et les bouts | « Sur un écran de 360 px, une bulle de choix au texte long… » (le texte ne change pas selon la réponse ; seule la planche change) |
| #126.3 | Toutes les bulles d'une question ont-elles la même largeur ? | Oui, celle du choix le plus long, sans dépasser l'écran | `@a-valider` « Les bulles de choix d'une même question ont la même largeur… » |
| #126.4 | Quand les bulles sont-elles immobiles (relectures, choix lus à voix haute, « Je ne sais pas ») ? | Immobiles pendant toute lecture, puis elles flottent ; « Je ne sais pas » les arrête pour de bon ; en Muet, elles flottent dès qu'elles apparaissent | `@a-valider` bloc « Je ne sais pas » du Plan « Après <premier toucher>… » ; `@a-valider` Plan « Pendant <parole>… », exemple « la consigne relue » |
| #126.5 | En séance de révision et au test de départ, la question d'un `classer` a-t-elle des bulles qui flottent ? | Oui | `@a-valider` « En séance de révision, la question d'un classer a des bulles de choix qui flottent » |
| #126.6 | Dans `trous`, `conjugaison` et les mots cachés, que devient la bulle juste ? | Le mot seul voyage (moins de 400 ms), la bulle vide s'efface sur place ; trou hors de l'écran : le mot y apparaît sans voyager | `@a-valider` « Dans un texte à trous, seul le mot voyage… ». Avec l'option B (pas de voyage), le Plan « … rejoint sa place, puis s'y illumine » deviendrait « … apparaît dans sa place, puis s'y illumine » |
| #126.7 | Que font les flèches du clavier sur les bulles ? | ← → ↑ ↓ dans l'ordre des bulles, arrêt aux bouts, choix écartés passés | `@a-valider` « Les flèches passent le choix écarté et s'arrêtent à la dernière bulle de choix » |
| #126.8 | Quelles 6 captures joindre à la PR ? | Une question de `bulles` à 3 choix après une erreur, à 360 px, mouvements réduits, dans chaque univers | Aucun (hors test) |
| #126.9 | Les bulles flottent-elles ensemble ou chacune à son tour ? | Même amplitude et même durée, décalage régulier selon le rang, jamais au hasard | Aucun texte : « toutes de la même façon » vaut pour les deux options (voir « Précisions ») |
| #126.10 | Comment montrer un choix écarté sur un dessin d'univers ? | Signal commun : gris pâle, sans décor de l'univers, texte à 4,5:1 | Plan « … un choix écarté se voit comme dans tous les univers » (le texte « pâle » vaut pour les deux options) |

**#126.11 (nouvelle) Pendant que la voix anglaise dit ou redit le mot à écouter d'un exercice `ecoute`, les bulles de choix flottent-elles ?**
Contexte : #126.4 parle de la consigne, de la question et des choix lus. Dans `ecoute`, il y a une autre parole : le mot ou la phrase à écouter, dit par la voix anglaise après la question, et redit quand l'enfant demande à écouter de nouveau (#17). C'est le moment où l'enfant doit le plus se concentrer sur ce qu'il entend.
Exemple : Léa entend « a cat », puis demande à écouter de nouveau ; pendant que la voix anglaise redit « a cat », les bulles de choix « un chat », « un chien », « un oiseau » restent immobiles, puis reprennent.
Reco : **immobiles pendant toute parole de l'exercice**, mot à écouter compris (même règle que #126.4), puis elles flottent ; pour de bon dès le premier toucher.
Options : A, le mot à écouter ne les arrête pas (seules la consigne et la question les arrêtent) ; B, en `ecoute`, les bulles ne flottent qu'après la première réponse fausse (non recommandé : contraire à 98.4).
Scénario : `@a-valider` Plan « Pendant <parole>, les bulles de choix ne flottent pas, puis reprennent », exemple « le mot à écouter redit ».

## Termes

Rien n'est écrit au glossaire. Mots d'interface employés dans les scénarios (décision n°30, comme « maison » de #98), à confirmer par le PO avec le cadrage :
- **bulle de choix** : toujours en entier, jamais « bulle » seul (la bulle du personnage guide existe déjà) ;
- **flotter**, **s'efface en douceur**, **rejoint son trou**, **s'y illumine** ;
- **ligne du tableau** (« la ligne « je … ? » du tableau ») : la place d'une personne dans le tableau de conjugaison (#19). Le glossaire ne la nomme pas ; c'est un mot d'interface, comme « tableau des pronoms » de #19.
- À ne pas employer : « éclater », « crever » pour la bulle de choix juste (98.5) ; « bulle grisée » (synonyme interdit de **Choix écarté**) ; « jeton » et « badge » pour le dessin de l'univers Police.

## Décisions

Aucune pour l'instant : le cadrage attend la validation du PO.
