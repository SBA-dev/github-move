# Critères d'acceptance : story #127, maisons de l'addition posée (98c-addition)

Scénarios : `features/127-maisons-de-l-addition.feature`. Modèle : `docs/stories/127/domain-model.md` (invariants propres 1 à 10, questions #127.1 à #127.7).

Tags :
- `@issue-127 @wip` sur la fonctionnalité ;
- `@a-valider` sur les 4 scénarios qui dépendent de #127.3 ou de #127.5, écrits selon la recommandation du modèle ;
- aucun `@acces` (aucune donnée nouvelle, voir « Droits d'accès ») ;
- aucun `@depend-de-…` : #97 et #98 (98a) sont mergées.

État : **critères proposés**, en attente de la validation du PO (⛔). Aucun code.

## Objectif

En tant qu'**enfant**, je veux glisser mes chiffres du doigt dans les maisons de mon univers, voir une maison s'allumer quand le calcul de sa colonne est juste, et voir la retenue sauter d'une maison à l'autre, afin que l'addition posée ressemble à un jeu dans mon univers.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : chaque colonne juste se voit (la maison s'allume), la retenue se voit passer d'une colonne à la suivante (elle « saute »), ce qui rend visible la règle de la retenue que le personnage guide dit déjà (« … monte en retenue ») ;
- **autonomie** : l'enfant choisit son geste (glisser, toucher puis toucher, clavier) et retrouve son univers (#6).

La story ne change que l'affichage : aucune règle de correction, aucune erreur, aucune étoile, aucun avancement, aucune parole du personnage guide, aucune donnée. Elle ne franchit aucun garde-fou de la section 5 du skill : pas de coffre, pas de hasard, pas de pénalité ; un chiffre lâché hors de toute maison ne coûte rien.

Décisions déjà prises, appliquées sans les reposer : habillage par univers (98.2) ; couleurs des colonnes communes aux 6 univers ; la retenue saute d'une maison à la suivante et, avec mouvements réduits, apparaît en haut de la maison ; aucun geste de l'habillage ne produit de réponse ; les retours de #97 passent d'abord ; mêmes erreurs, avancement et étoiles ; 360 px, mode dys, lecteurs d'écran inchangés ; règle absolue de contenu univers par univers ; planches et 6 captures (98.28, 98.29, 98.31).

**Les scénarios ne lisent jamais un tracé** (skill `illustration`, section 3) : ils restent vrais quelle que soit la réponse à #127.1 (réutiliser ou redessiner la maison), #127.2 (objet de la retenue), #127.4 (partie colorée), #127.6 (taille) et #127.7 (chiffre sur l'objet ou pastille). Ce qui est dessiné se valide sur les planches, pas par un scénario.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Pour les mêmes réponses, l'habillage ne change rien : mêmes erreurs, même avancement, mêmes étoiles ; une addition posée se termine au doigt comme au clavier seulement ; en séance de révision et au test de départ, une addition reste un calcul en ligne | Plan « Léa pose chaque chiffre <geste>, calcule chaque colonne sans erreur, et gagne 3 étoiles » : glisser du doigt, toucher puis toucher, clavier seulement · Plan « Avec <erreurs> chiffre(s) glissé(s) du doigt dans la mauvaise maison, Léa gagne <résultat>, comme en touchant » : 0 → 3, 1 → 2, 3 → 2 · « Un chiffre glissé du doigt dans sa maison fait avancer la séance comme un chiffre touché » · Plan « <Où>, une addition reste un calcul en ligne, sans maison ni chiffre à faire glisser » : séance de révision, test de départ (#127.9) |
| R2 | À l'étape poser, un chiffre se glisse du doigt jusqu'à une maison ; seul un lâcher sur une maison est une réponse : lâché ailleurs, il revient à sa place sans coûter d'erreur ; toucher puis toucher et le clavier restent possibles, et un chiffre posé ne se déplace plus | Plan « Le chiffre « 5 » de 45 se pose dans la maison des unités <geste> » : 3 gestes · « Glissé du doigt dans la mauvaise maison, le chiffre revient en glissant, avec l'aide de son rang » · « Le retour du chiffre ne retarde ni « réponse fausse » ni l'encouragement » · « Un chiffre qui passe au-dessus d'une maison, sans être lâché, ne donne aucune réponse » · « Lâché hors de toute maison, le chiffre revient à sa place, sans encouragement » · « Lâché hors de toute maison, le chiffre ne fait entendre aucun son de réponse » · « Lâcher 5 fois un chiffre hors de toute maison ne coûte aucune étoile » · « Un chiffre posé dans sa maison ne se déplace plus » · « À l'étape calculer, toucher une maison ne donne aucune réponse » (#127.8) |
| R3 | À l'étape calculer, une maison s'allume quand le chiffre de sa colonne est juste, jamais avant, jamais au survol, jamais à cause de « Je ne sais pas » ; une maison allumée ne brille pas comme une bonne réponse montrée | « La colonne des unités juste fait s'allumer la maison des unités » · « Une somme fausse laisse la maison éteinte et donne une nouvelle chance » · « La dernière colonne juste allume la dernière maison : toutes les maisons sont allumées » · « « Je ne sais pas » à l'étape calculer montre la bonne somme, sans allumer la maison » · « « Je ne sais pas » à l'étape poser fait briller la bonne maison, sans en allumer aucune » · `@a-valider` « À l'étape poser, un chiffre juste fait ouvrir la porte de sa maison, qui reste éteinte » (#127.3) · `@a-valider` « Au début de l'étape calculer, aucune maison n'est allumée » (#127.3) |
| R4 | La retenue posée par le domaine saute de la maison dont le chiffre vient d'être écrit jusqu'en haut de la maison suivante ; sans retenue, rien ne saute ; le saut ne retarde ni l'effet sonore, ni la parole, ni la suite | « La retenue « 1 » saute de la maison des unités jusqu'en haut de la maison des dizaines » · « La retenue « 1 » saute de la maison des dizaines jusqu'en haut de la maison des centaines » · « Une colonne dont la somme est plus petite que 10 ne fait sauter aucune retenue » · « La dernière colonne écrit toute sa somme, sans faire sauter de retenue ni ajouter de maison » · « Une somme fausse ne fait sauter aucune retenue » · « Le saut de la retenue ne retarde pas l'effet sonore « réponse juste » » · `@a-valider` « La retenue saute sans attendre la parole du personnage guide » (#127.5) · `@a-valider` « En Muet, la retenue saute de la même façon » (#127.5) |
| R5 | Dans chacun des 6 univers, la maison et la retenue ont le dessin de cet univers, et les colonnes gardent leurs couleurs (unités bleue, dizaines rose, centaines verte) ; changer d'univers ne change ni les gestes, ni les textes lus, ni les étoiles, ni la façon dont brille la bonne réponse montrée ; un profil sans univers connu voit les dessins de « Animaux de la forêt » | Plan « …les maisons gardent les couleurs des colonnes » : 6 univers · Plan « …la retenue ne prend jamais la couleur d'une autre maison » : 6 univers (invariant propre 2) · Plan « …la maison et la retenue ont le dessin de cet univers » : 6 univers · Plan « …la retenue saute de la maison des unités jusqu'en haut de la maison des dizaines » : 5 univers autres qu'Animaux (déjà couvert en R4) · Plan « …un chiffre dans la mauvaise maison fait dire à <personnage guide> la même aide, avec la même couleur de maison » : Sports, Police · Plan « …un chiffre glissé dans la mauvaise maison donne 2 étoiles, comme dans l'univers « Animaux de la forêt » » : Princesses et fées, Pompiers · Plan « …la maison montrée par « Je ne sais pas » brille comme dans tous les univers » : 5 univers · Plan « Un profil enfant <cas> voit la maison et la retenue de l'univers « Animaux de la forêt » » : sans univers, univers inconnu |
| R6 | Avec les mouvements réduits, rien ne glisse, ne saute ni ne s'ouvre de lui-même, et l'information reste ; dans chacun des 6 univers, une addition à trois colonnes tient à 360 px avec des cibles de 44 px ; chiffres, noms des maisons et retenue s'affichent en mode dys ; les lecteurs d'écran lisent les mêmes libellés qu'avant | Plan « …avec les mouvements réduits, la maison s'allume et la retenue apparaît en haut de la maison, sans mouvement » : 6 univers · « Avec les mouvements réduits, un chiffre posé dans la mauvaise maison réapparaît à sa place, sans glisser » · « Avec les mouvements réduits, le chiffre suit toujours le doigt de l'enfant » (98.23) · « Sur un écran de 360 px, Léa glisse du doigt un chiffre jusqu'à la maison des centaines » · Plan « …une addition à trois colonnes tient dans un écran de 360 px et garde des cibles de 44 px » : 6 univers · « Sur un écran de 360 px, la retenue et le chiffre écrit restent lisibles dans une addition à trois colonnes » · « En mode dys, les chiffres à poser et le nom de chaque maison s'affichent en mode dys » · « En mode dys, le chiffre de la retenue reste un texte affiché en mode dys » (invariant propre 3) · Plan « …les lecteurs d'écran lisent les maisons et la retenue comme avant, sans décrire leur dessin » : 6 univers |

Au total : **6 règles, 45 scénarios** (dont 15 plans de scénario, 63 exemples). 4 scénarios portent `@a-valider`.

Les Plans sur les univers suivent la sobriété de 98a : les 6 univers là où le dessin peut changer ce qu'on vérifie (couleur, dessin, retenue, 360 px et 44 px, mouvements réduits, lecteurs d'écran) ; 5 univers là où Animaux de la forêt est déjà couvert ailleurs (saut, « Je ne sais pas ») ; 2 univers là où le dessin ne peut rien changer (aide lue, étoiles).

### Exemples aux bornes

| Cas | Exemple |
|---|---|
| Retenue vers la colonne des dizaines | 45 + 37, unités : 12 → « 2 » écrit, la retenue « 1 » saute jusqu'en haut de la maison des dizaines |
| Retenue vers la colonne des centaines (la maison verte) | 45 + 65, dizaines : 11 → « 1 » écrit, la retenue « 1 » saute jusqu'en haut de la maison des centaines |
| Aucune retenue | 123 + 45, unités : 8 → rien ne saute |
| Dernière colonne | 45 + 65, centaines : 1 → résultat « 110 », rien ne saute, toujours 3 maisons. Le domaine fait toujours écrire toute sa somme à la dernière colonne (`EtapeCalculer.validerLaColonne`) |
| Réponse fausse | 45 + 37, unités : 13 → maison éteinte, rien ne saute, nouvelle chance |
| Plus grande addition à l'écran | 145 + 237 : 3 maisons à 360 px |
| Lâcher raté répété | 5 lâchers hors de toute maison → toujours 3 étoiles |

### Checklist `po-acceptance` du skill `gamification`

- besoin nourri : compétence et autonomie (ci-dessus) ;
- déclencheur métier de chaque retour : un **Placement** juste (chiffre qui reste, et porte qui s'ouvre si #127.3 = A), un placement faux (retour en glissant, aide de #20), un **chiffre écrit** à l'étape calculer (maison allumée), une **retenue** posée par le domaine (saut), « Je ne sais pas » (bonne réponse montrée) ; aucune récompense nouvelle ; le dessin de l'univers n'est déclenché par rien ;
- retour après une erreur : R2 (encouragement et nouvelle chance, aide « … il va dans la maison rose. »), R3 (somme fausse : nouvelle chance) ;
- mouvements réduits : R6, l'information reste (maison allumée, retenue en haut de la maison, chiffre revenu), dans chaque univers ;
- aucun garde-fou franchi ; les objets de la retenue sont à trancher (#127.2) : le modèle déconseille l'étoile (confusion avec la récompense et avec la bonne réponse montrée) et le ballon (confusion avec une bulle de choix de #126).

### Droits d'accès

La story ne crée, ne lit et n'enregistre aucune donnée nouvelle : **pas de scénario `@acces`**. L'univers est lu sur le profil enfant en cours (#6, #96). Les séances terminées restent enregistrées comme aujourd'hui (#24), par un parent rattaché seulement. Les écrans du parent ne montrent aucune addition posée.

## Scénarios qui dépendent d'une réponse du PO

| Question | Scénarios | Écrits selon | Si le PO choisit autre chose |
|---|---|---|---|
| **#127.3** (étape poser : que fait la maison quand un chiffre juste y est rangé ?) | `@a-valider` « À l'étape poser, un chiffre juste fait ouvrir la porte de sa maison, qui reste éteinte » · `@a-valider` « Au début de l'étape calculer, aucune maison n'est allumée » | **A** : la porte s'ouvre, la maison reste éteinte | **B** : le premier scénario devient « …la porte de la maison des unités reste fermée, et la maison reste éteinte » ; le second reste vrai. **C** : le premier devient « …la porte s'ouvre, puis la maison s'allume » ; le second est supprimé, et « « Je ne sais pas » à l'étape calculer… sans allumer la maison » et « La colonne des unités juste fait s'allumer… » perdent leur sens (toutes les maisons seraient déjà allumées) |
| **#127.5** (quand la retenue saute-t-elle ?) | `@a-valider` « La retenue saute sans attendre la parole du personnage guide » · `@a-valider` « En Muet, la retenue saute de la même façon » | **A** : tout de suite après le rebond, sans attendre la voix | **B** : le premier devient « …la retenue saute quand Noisette dit « monte en retenue » » ; le second doit dire ce qui se passe sans voix (question à poser alors). « Le saut de la retenue ne retarde pas l'effet sonore « réponse juste » » reste vrai dans les deux cas |

Les questions #127.1, #127.2, #127.4, #127.6 et #127.7 ne changent **aucun** scénario : elles se tranchent sur les planches.

## Hors périmètre

- Les **bulles de choix** de l'étape calculer et leur dessin par univers : #126. Ici, on répond à l'étape calculer comme dans #20 (« Léa répond « 12 » pour la colonne des unités »), quel que soit le dessin des choix.
- La **fin de séance** : #106.
- La boîte et les barres (#131), le petit train (#130), les autres tranches de #98.
- L'addition en **séance de révision** et au **test de départ** : elle y reste un calcul en ligne, sans colonne (invariant propre 9) ; le Plan de R1 le vérifie seulement (voir #127.9).
- Toute nouvelle **parole** ou nouveau texte lu : la consigne « … range chaque chiffre dans sa maison. Le chiffre des unités va toujours dans la maison bleue, tout à droite. » et la parole « J'écris 2, et 1 monte en retenue. » ne changent pas (voir #127.10).
- Tout **effet sonore** nouveau pour le saut de la retenue ou l'allumage d'une maison : seuls les retours de #97 existent.
- Le choix de **ce qui est dessiné** (maison, objet de la retenue, partie colorée, taille) : planches `docs/stories/127/planches/`, validées par le PO univers par univers.

## Scénarios existants

**Aucun texte de scénario existant ne change.** Les scénarios de `features/20-calcul-fluence-addition-posee.feature` (couleurs des colonnes, retenue en haut de la colonne des dizaines, retenue sans mouvement avec mouvements réduits, aides de l'étape poser) et l'exemple « addition à l'étape poser » du Plan de `features/23-aide-et-je-ne-sais-pas.feature` restent verts sans changement.

Étapes (code de `features/steps/`) à surveiller :

| Fichier | Ce qui peut changer |
|---|---|
| `calcul-fluence-addition.steps.ts` | « Léa pose le chiffre … dans la colonne des … » (toucher puis toucher) : inchangé, mais la maison dessinée doit garder `data-testid="maison-de-la-colonne"` et son nom « Poser dans la colonne des … » sur la zone de toucher, pas sur le seul dessin. Les expressions régulières limitées à `(unités\|dizaines)` doivent accepter `centaines` (voir plus bas). |
| `calcul-pour-les-autres-stories.steps.ts` | « la bonne colonne du chiffre choisi brille » : la maison allumée ne doit **pas** porter `data-brille`. |
| `exercices-comme-des-jeux.steps.ts` | Les étapes de 98a sont gardées par `{ tags: "@issue-98" }` (profil réel, « Léa a choisi l'univers … », profils sans univers, enregistreur du geste) : à ouvrir à `@issue-127`. |

## Précisions pour les étapes (pour `e2e-tester`)

- **Séances complètes** : 4 scénarios (9 exemples) jouent une séance jusqu'à ses étoiles (Plan « …gagne 3 étoiles » × 3, Plan « Avec <erreurs>… » × 3, « Lâcher 5 fois… », Plan « …donne 2 étoiles… » × 2). Il faut **ajouter `@issue-127` au `Before` de `features/steps/delais.steps.ts`**.
- **Projets** : tous les scénarios tournent sur `tablette` et `telephone`. « faire glisser du doigt » est le **vrai glisser au toucher** de 98a (événements tactiles CDP de `exercices-comme-des-jeux.steps.ts`), jamais `dragTo`.
- **Maison** : « la maison des unités » (des dizaines, des centaines) désigne `data-testid="maison-de-la-colonne"` dans la `data-testid="colonne"` de `data-rang` correspondant (`unites`, `dizaines`, `centaines`).
- **Allumée, porte, brille** : comme dans 98a, attributs distincts sur la maison : allumée (`data-allumee`), porte ouverte (`data-ouverte`), bonne réponse montrée (`data-brille`, réservé). « reste éteinte » : pas de `data-allumee="true"`. « aucune maison ne s'allume » doit compter aussi les maisons de colonne (l'étape de 98a ne vise aujourd'hui que `data-testid="maison"`).
- **Dessin de l'univers** : « ont le dessin de l'univers « … » » et « la retenue « 1 » a le dessin de l'univers « … » » se vérifient par un attribut `data-univers` (clé : `animaux`, `princesse`, `sports`, `police`, `pompier`, `danse`) sur la maison et sur la retenue, **jamais par un tracé**.
- **Couleurs** : « la maison des … en vert / rose / bleu » lit `data-couleur` (`verte`, `rose`, `bleue`) de la colonne, et l'ordre de gauche à droite par la position à l'écran. « n'est ni bleue ni verte » lit l'attribut de couleur posé sur la retenue (neutre ou `rose`, couleur de sa maison d'arrivée) ; jamais une couleur lue dans le SVG.
- **Saut de la retenue** : « la retenue « 1 » saute de la maison des unités jusqu'en haut de la maison des dizaines » vérifie qu'un mouvement a lieu (enregistreur de 98a ou attribut d'état du saut), qu'il part de la colonne dont le chiffre vient d'être écrit et que la retenue finit dans la colonne d'arrivée. Ne jamais mesurer de durée dans l'étape. « aucune retenue ne saute » : aucun mouvement de retenue n'est enregistré. « le saut commence avant que Noisette dise « monte en retenue » » compare le début du saut au début de la parole (comme les étapes d'ordre de #97).
- **Mouvements réduits** : « la retenue « 1 » apparaît en haut de la colonne des dizaines, sans mouvement » est l'étape de #20, reprise telle quelle.
- **Écran de 360 px** : « les trois maisons, les chiffres à poser et « Je ne sais pas » se voient sans faire défiler l'écran » se vérifie dans la fenêtre de 360 × 740 du projet `telephone`, sans défilement vertical.
- **Mode dys** : « Léa voit la retenue « 1 » en mode dys » vérifie que le chiffre de la retenue est un texte (pas un tracé) avec la police Andika.
- **Lecteurs d'écran** : « annoncent « Colonne des dizaines », « Colonne des unités » et « Retenue 1 » » lit les noms accessibles existants (`aria-label` de la colonne et de la retenue). Le dessin de la maison et celui de la retenue sont `aria-hidden`.
- **Révision et test de départ** : « Léa a pour question retenue l'addition « 45 + 37 »… » écrit une question retenue de type `addition` (clé du domaine `cleDeLAddition`) ; « le test de départ de Léa pose la question de l'addition « 45 + 37 » » sert une bibliothèque de test du test de départ. Vérifier que la question en ligne s'affiche bien « 45 + 37 = ? » (sinon me le signaler : le texte du scénario suivra le domaine).
- **Données de test** : prénoms fictifs déjà employés (Léa, Paul), additions neutres, aucune donnée réelle.

### Étapes nouvelles

- « Léa pose chaque chiffre dans sa maison <geste>, puis calcule chaque colonne sans erreur »
- « Léa a fait glisser du doigt <n> fois le chiffre « … » de <nombre> dans la maison des … »
- « Léa termine l'exercice sans autre erreur »
- « Léa ne voit aucune maison ni aucun chiffre à faire glisser »
- « Léa a pour question retenue l'addition « … » de l'exercice « … », due aujourd'hui »
- « le test de départ de Léa pose la question de l'addition « … » »
- « Léa pose le chiffre « … » de <nombre> dans la maison des … <geste> »
- « Léa fait glisser du doigt le chiffre « … » de <nombre> dans la maison des … »
- « Léa fait glisser du doigt le chiffre « … » de <nombre> et le lâche hors de toute maison »
- « Léa a lâché <n> fois le chiffre « … » de <nombre> hors de toute maison »
- « Léa fait passer du doigt le chiffre « … » de <nombre> au-dessus de la maison des …, sans le lâcher »
- « Léa essaie de faire glisser du doigt le chiffre « … » hors de la maison des … »
- « Léa touche la maison des … »
- « Léa pose les chiffres de <nombre> dans leurs colonnes »
- « le chiffre « … » revient en glissant jusqu'à sa place parmi les chiffres à poser »
- « le chiffre « … » réapparaît à sa place, sans glisser »
- « le chiffre « … » suit le doigt de Léa »
- « l'effet sonore « réponse fausse » commence avant que le chiffre « … » soit revenu à sa place »
- « l'effet sonore « réponse juste » commence avant que la retenue « … » ait fini de sauter »
- « il reste <n> chiffres à poser »
- « la maison des … se signale comme toute maison survolée, sans dire si c'est la bonne »
- « la maison des … s'allume », « … reste éteinte », « … s'allume, sans que sa porte bouge »
- « la maison des … ne brille pas comme une bonne réponse montrée »
- « la porte de la maison des … s'ouvre », « la porte de la maison des … reste fermée »
- « les maisons des unités et des dizaines sont allumées »
- « la retenue « … » saute de la maison des … jusqu'en haut de la maison des … »
- « le saut commence avant que Noisette dise « … » »
- « aucune retenue ne saute », « aucune retenue n'apparaît en haut de la maison des … »
- « Léa voit « … » écrit sous la colonne des … » (sans retenue)
- « Léa voit toujours <n> maisons »
- « Léa voit, de gauche à droite, la maison des centaines en vert, la maison des dizaines en rose et la maison des unités en bleu »
- « la retenue « … » en haut de la maison des … n'est ni bleue ni verte »
- « les maisons des unités et des dizaines ont le dessin de l'univers « … » »
- « la retenue « … » a le dessin de l'univers « … » »
- « chaque maison et chaque chiffre à poser mesurent au moins 44 px de haut et de large »
- « les trois maisons, les chiffres à poser et « Je ne sais pas » se voient sans faire défiler l'écran »
- « Léa voit les chiffres à poser et le nom de chaque maison en mode dys : … »
- « Léa voit la retenue « … » en mode dys : police Andika »
- « les lecteurs d'écran annoncent « Colonne des dizaines », « Colonne des unités » et « Retenue 1 » »

### Étapes existantes reprises

- #20 (`calcul-fluence-addition.steps.ts`) : « Léa joue l'exercice « … » à l'étape (poser|calculer) », « une leçon de test a une addition posée « … » à l'étape (poser|calculer) », « Léa a posé le nombre … », « Léa (a posé|pose) le chiffre « … » de … dans la colonne des … », « le chiffre « … » reste dans la colonne des … », « le chiffre « … » revient parmi les chiffres à poser », « Léa a calculé la colonne des … », « Léa répond « … » pour la colonne des … », « la colonne des … est à calculer », « Léa voit « … » écrit sous la colonne des …, et la retenue « … » en haut de la colonne des … », « la retenue « … » apparaît en haut de la colonne des …, sans mouvement », « Léa voit le résultat « … » », « Noisette dit « … » », « Noisette ne dit aucun encouragement », « Léa voit « … = ? » ». **À étendre à `centaines`** : « Léa (a posé|pose) le chiffre… », « le chiffre « … » reste dans la colonne des … », « Léa répond « … » pour la colonne des … », « Léa voit « … » écrit sous la colonne des …, et la retenue … en haut de la colonne des … » (aujourd'hui `(unités|dizaines)`).
- #23 : « Léa dit « Je ne sais pas » », « seul le choix « … » reste, et il brille », « Léa doit encore donner elle-même la bonne réponse », « Léa joue un exercice addition à l'étape poser d'une leçon de test », « la bonne colonne du chiffre choisi brille », « Noisette dit un encouragement », « Noisette dit un encouragement, suivi de « … » ».
- #24 : « Léa voit 3 étoiles allumées sur 3 », « l'écran indique en texte « … » », « Léa gagne <n> étoile(s) », « l'avancement de la séance montre … question réussie sur … », « l'appareil demande des mouvements réduits ».
- #97 : « Léa entend l'effet sonore « … » », « Léa entend l'effet sonore « … », puis Noisette dit un encouragement », « Léa n'entend pas l'effet sonore « … » », « la tablette est en Muet ».
- #98 : « Léa a choisi l'univers <clé> », « Léa a un profil enfant préparé sans univers | dont l'univers est inconnu », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « <personnage guide> dit un encouragement, suivi de « … » », « aucune maison ne s'allume » (à élargir aux maisons de colonne), « elle brille de la même façon que dans l'univers « Animaux de la forêt » » (à élargir à la colonne), « les lecteurs d'écran n'annoncent ni porte, ni toit, ni lumière, ni l'univers du dessin » (à élargir au dessin de la maison de colonne et de la retenue), « Noisette applaudit en sautant », « Léa commence cet exercice ».
- #28 et #98 : « Léa commence la séance de révision », « Léa arrive à cette question du test de départ ».
- #17 et socle : « Paul a réglé « mode dys » sur « oui » pour Léa », « Léa commence l'exercice « … » de la leçon « … » », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran » ; #6 : « aucun message d'erreur n'apparaît ».

## Questions ouvertes

Les questions **#127.1 à #127.7** sont posées dans `docs/stories/127/domain-model.md` (avec options et recommandation). Rappel de leur effet sur les scénarios :
- #127.1, #127.2, #127.4, #127.6, #127.7 : **aucun scénario ne change** (planches) ;
- #127.3 et #127.5 : 4 scénarios `@a-valider`, voir « Scénarios qui dépendent d'une réponse du PO ».

Questions nouvelles :

**#127.8 À l'étape calculer, que fait une maison qu'on touche ?** Exemple : 45 + 37, la colonne des unités est à calculer, Léa touche la maison des unités.
- A (reco) : **rien** (ni son, ni mouvement, ni parole). La maison n'est pas une cible à l'étape calculer ; on évite que l'enfant croie avoir répondu.
- B : un petit retour décoratif (la maison frémit), sans son ni réponse.
- C : le personnage guide relit la phrase de la colonne (comme toucher la phrase aujourd'hui).
Le scénario « À l'étape calculer, toucher une maison ne donne aucune réponse » est vrai avec A, B et C (il ne vérifie que l'absence de réponse et d'encouragement). Seul A garde la règle « aucun geste de l'habillage » au plus simple.

**#127.9 En séance de révision et au test de départ, l'addition reste-t-elle un calcul en ligne ?** L'issue reprend l'invariant commun « même habillage en séance, en révision et au test de départ » ; le domaine pose aujourd'hui une addition retenue ou du test de départ comme un calcul en ligne (« 45 + 37 = ? »), sans colonne (invariant propre 9).
- A (reco) : **oui, calcul en ligne, sans maison** : il n'y a rien à habiller, comme une question de `classer` qui reste une question à choix (98.18). Le Plan de R1 le vérifie.
- B : l'addition y devient une addition posée, avec ses maisons. Ce serait un changement du domaine (question de révision, test de départ, avancement), hors de cette story d'affichage : une story à part.

**#127.10 Faut-il une Indication du geste pour l'addition, comme pour `classer` ?** `classer` lit « Fais glisser chaque étiquette, ou touche-la puis touche une maison. » (#18). L'addition lit seulement « Pose l'addition 45 + 37 : range chaque chiffre dans sa maison. Le chiffre des unités va toujours dans la maison bleue, tout à droite. »
- A (reco) : **non, texte inchangé**. La consigne ne dit pas de geste et reste vraie avec les trois gestes ; les textes lus et les voix ne changent pas (inv. 98-14), aucun MP3 à regénérer.
- B : ajouter une Indication du geste lue après la consigne. Change un texte du domaine et demande de nouveaux MP3 : à faire dans une story à part.

**#127.11 Plan des étoiles : 3 erreurs sur un même chiffre.** Le Plan « Avec <erreurs> chiffre(s) glissé(s)… » s'arrête à 3 erreurs (→ 2 étoiles) : #24 limite à 3 les erreurs comptées par question, et chaque chiffre à poser est une question de l'addition. Je n'ai pas écrit d'exemple « 4 erreurs → 1 étoile » sur un même chiffre (98a le fait pour `classer`) pour ne pas inventer de règle.
- A (reco) : garder 0, 1 et 3 erreurs, qui suffisent à prouver « comme en touchant ».
- B : ajouter un exemple à 4 erreurs **réparties sur deux chiffres** (3 sur le « 4 », 1 sur le « 3 »), qui doit donner 1 étoile si la règle de #24 s'applique telle quelle.

## Termes à signaler au glossaire

Repris du modèle (aucun ajout ici) : **Placement** (ajouter « une colonne pour l'addition posée ») ; **Colonne** (« tour » interdit, « château » pour Princesses) ; **Maison allumée**, **la retenue saute** : mots d'interface, hors glossaire ; **Étoile** réservée à la récompense ; **Ballon** (si #126 en fait la bulle de choix de Sports).

Mot d'interface employé dans les scénarios, à confirmer comme tel : « la maison des unités / des dizaines / des centaines » (interface de **Colonne**, décision n°24). Les étapes qui disent où reste un chiffre gardent « colonne », comme #20.
