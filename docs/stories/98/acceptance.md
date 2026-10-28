# Critères d'acceptance : story #98, des exercices qui ressemblent à des jeux (tranche 98a)

Scénarios : `features/98-exercices-comme-des-jeux.feature`. Tags :
- `@issue-98 @wip` sur la fonctionnalité ;
- `@a-valider` sur les scénarios qui dépendent d'une question ouverte (commentaire « Question 98.n » au-dessus) ;
- `@depend-de-97` sur les 4 scénarios qui s'appuient sur un retour de #97 (effet sonore, étincelles) sans le redécrire.

État : **cadrage seulement** (décision 0020). #98 dépend de #97, qui dépend de #96 : aucun code avant le merge de #97. Modèle : `docs/stories/98/domain-model.md`.

## Objectif

En tant qu'**enfant**, je veux glisser mes étiquettes du doigt dans des maisons qui s'ouvrent, et accrocher les bonnes à un petit train, afin que ranger et remettre dans l'ordre ressemblent à un petit jeu, et d'avoir envie de faire la question suivante.

Cette tranche (98a) est celle que garde l'issue #98. Elle pose le **geste glisser au doigt**, qui servira aussi à l'addition (98c), et les **invariants transverses** du modèle (mêmes faits, même résultat ; aucune réponse de plus ni de moins ; « Je ne sais pas » reconnaissable ; mouvements réduits ; 44 px ; 360 px ; mode dys ; lecteurs d'écran). Elle touche `classer`, `ordre` et l'ordre des vers de `memoriser`.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : chaque bon placement se voit (la maison s'ouvre et s'allume, le petit train avance d'un wagon), et la progression de l'exercice reste visible (wagons accrochés, maisons remplies) ;
- **autonomie** : l'enfant choisit son geste (glisser, toucher puis toucher, clavier) et, dans `classer`, l'ordre de ses étiquettes (#18).

La story ne change que l'affichage : aucune règle de correction, aucune erreur, aucune étoile, aucun avancement, aucune parole du personnage guide. Aucune donnée nouvelle, aucune migration, aucune Edge Function. Elle ne franchit aucun garde-fou de la section 5 du skill : pas de coffre (98.6), pas de hasard, pas de pénalité ; un glisser raté ne coûte rien (98.11). Les dessins (maison, porte, petit train, wagons) suivent le skill `illustration`, section 0 : rien d'effrayant ni d'agressif, rien ne se casse.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Pour les mêmes réponses, l'habillage de jeu ne change rien : mêmes erreurs, même avancement de la séance, mêmes étoiles ; un exercice `classer`, un `ordre` et l'ordre des vers se terminent au doigt comme au clavier seulement ; en séance de révision et au test de départ, une question de `classer` reste une question à choix | Plan « Léa range toutes les étiquettes <geste>, sans erreur, et gagne 3 étoiles » : glisser du doigt, toucher puis toucher, clavier seulement · Plan « Léa remet « Le mot en morceaux » dans l'ordre <geste>… » : du doigt, clavier seulement · Plan « Léa remet les 6 vers dans l'ordre <geste>, puis passe aux mots cachés » · Plan « Avec <erreurs> mauvais placement(s) faits en glissant du doigt, Léa gagne <résultat>, comme en touchant » : 0 → 3, 1 → 2, 3 → 2, 4 → 1 · Plan « <Où>, une question de classer reste une question à choix, sans étiquette à faire glisser » : séance de révision, test de départ (98.18) |
| R2 | Une étiquette de `classer` se glisse du doigt jusqu'à une maison ; seul un lâcher sur une maison est une réponse : lâchée ailleurs, elle revient à sa place sans coûter d'erreur ; toucher puis toucher et le clavier restent possibles, et une étiquette rangée ne se déplace plus | « Glissée du doigt dans la maison « ou », l'étiquette « loup » y reste » (98.17) · « Sur un écran de 360 px, Léa glisse du doigt une étiquette jusqu'à la dernière maison » (98.17, 98.24) · « Une étiquette qui passe au-dessus d'une maison, sans être lâchée, ne donne aucune réponse » (98.20) · « Lâchée hors de toute maison, l'étiquette revient à sa place, sans encouragement » (98.11) · « Lâchée hors de toute maison, l'étiquette ne fait entendre aucun son de réponse » (98.11, `@depend-de-97`) · « Lâcher 5 fois une étiquette hors de toute maison ne coûte aucune étoile » (98.11) · « Une étiquette rangée dans sa maison ne se déplace plus » · « Dans un ordre, essayer de glisser une étiquette ne la pose pas : on la touche » (98.8, 98.22) · « Au clavier, les flèches passent d'une maison à l'autre » (98.15) |
| R3 | Dans `classer`, la bonne maison ouvre sa porte, garde l'étiquette et s'allume ; dans une mauvaise maison, l'étiquette revient en glissant parmi les étiquettes à poser, avec l'encouragement de #18, sans retarder l'effet sonore de #97 | « Au début de l'exercice, les trois maisons sont fermées et éteintes » (98.6) · « L'étiquette « loup » bien rangée fait ouvrir la porte de la maison « ou », qui s'allume » (98.6) · « Glissée du doigt dans la mauvaise maison, l'étiquette revient en glissant, avec l'aide par défaut » (98.6) · « Le retour de l'étiquette ne retarde ni « réponse fausse » ni l'encouragement » (`@depend-de-97`) |
| R4 | Dans un `ordre` et dans l'ordre des vers, chaque bonne étiquette s'accroche comme un wagon au petit train, qui avance d'un wagon ; une mauvaise étiquette ne s'accroche pas ; la dernière garde les étincelles de #97 | « La bonne première étiquette « do » devient le premier wagon du petit train » · « La deuxième bonne étiquette s'accroche derrière la première » · « Une mauvaise première étiquette ne s'accroche pas, et le petit train n'avance pas » · « La dernière étiquette accroche le dernier wagon, puis les étincelles de #97 apparaissent » (`@depend-de-97`) · « Le bon premier vers devient le premier wagon du petit train » (98.21) — tous 98.1 |
| R5 | « Je ne sais pas » montre toujours la bonne maison ou l'étiquette qui vient ensuite, reconnaissable dans le nouveau dessin et jamais confondue avec une maison allumée ; l'enfant la pose ensuite lui-même, au doigt ou au clavier | Plan « « Je ne sais pas » dans un exercice <type> : <ce qui est montré>, et <ce qui ne bouge pas> » : `classer`, `ordre` · « Après « Je ne sais pas », Léa glisse elle-même l'étiquette dans la maison qui brille » · « Après « Je ne sais pas », l'étiquette qui brille devient le premier wagon quand Léa la pose » · « Après « Je ne sais pas », un mauvais placement fait en glissant ne coûte plus d'erreur » |
| R6 | Avec les mouvements réduits, rien ne glisse, ne s'ouvre ni ne roule de lui-même, et l'information reste ; étiquettes, maisons et wagons gardent 44 px, tiennent à 360 px de large, s'affichent en mode dys et gardent ce que lisent les lecteurs d'écran | Plan « Avec les mouvements réduits, <cas> se voit sans mouvement » : étiquette bien rangée, mauvaise maison, lâchée hors de toute maison, bonne étiquette d'un ordre · « Avec les mouvements réduits, l'étiquette suit toujours le doigt de l'enfant » (98.23) · « Avec les mouvements réduits, la maison montrée par « Je ne sais pas » brille sans bouger » · « À 360 px, le petit train de 10 wagons tient dans la largeur de l'écran » (98.21) · « À 360 px, les vers accrochés au petit train se lisent en entier » (98.21) · Plan « En mode dys, <ce qui est vu> de « <exercice> » s'affichent en mode dys » : `classer`, `ordre` · « Les lecteurs d'écran annoncent les maisons comme avant, sans décrire leur dessin » |

Au total : **6 règles, 34 scénarios** (dont 8 plans de scénario). 21 portent `@a-valider`, 4 portent `@depend-de-97`.

Checklist `po-acceptance` du skill `gamification` :
- besoin nourri : compétence et autonomie (ci-dessus) ;
- déclencheur métier de chaque retour : un **Placement** juste (maison qui s'ouvre, wagon accroché), un placement faux (retour en glissant), « Je ne sais pas » (bonne réponse montrée) ; aucune récompense nouvelle ;
- retour après une erreur : R3 (« Glissée du doigt dans la mauvaise maison… », encouragement et nouvelle chance) et R4 (« Une mauvaise première étiquette… ») ;
- mouvements réduits : R6, l'information reste (maison allumée, wagon posé, étiquette revenue) ;
- aucun garde-fou franchi ; les pistes non validées (wagons, porte qui s'ouvre) sont `@a-valider`.

### Droits d'accès

La story ne crée, ne lit et n'enregistre aucune donnée : **pas de scénario `@acces`**. Les séances terminées restent enregistrées comme aujourd'hui (#24), par un parent rattaché seulement.

### Précisions pour les étapes (pour `e2e-tester`)

- **Projets** : tous les scénarios tournent sur `tablette` et `telephone`. « faire glisser du doigt » est un **vrai glisser au toucher** (événements tactiles ou pointeur de type toucher), pas `dragTo` à la souris. Aujourd'hui, seul le projet `telephone` a `hasTouch: true` (`playwright.config.ts`) : voir 98.19.
- **Mêmes étoiles** : le Plan « Avec <erreurs> mauvais placement(s) faits en glissant… » reprend exactement les données du scénario de #18 « Reposer une étiquette dans la même mauvaise maison coûte une nouvelle erreur » (4 erreurs → 1 étoile). Les deux doivent donner le même nombre d'étoiles.
- **« revient en glissant jusqu'à sa place »** : l'étiquette se voit en mouvement entre la maison et sa place, puis est de nouveau parmi les étiquettes à poser. Ne pas mesurer de durée dans l'étape ; vérifier l'état d'arrivée et la présence d'un mouvement (sauf mouvements réduits).
- **« s'allume » contre « brille »** : la maison allumée et la maison qui brille (bonne réponse montrée) doivent se distinguer par un attribut différent (aujourd'hui `data-brille` est réservé à la bonne réponse montrée). L'étape « ne brille pas comme une bonne réponse montrée » vérifie que `data-brille` est absent.
- **Wagons** : les places d'un `ordre` gardent `data-testid="place"` et `data-remplie` (les étapes de #18, #22 et #79 s'en servent).
- **Maisons** : elles gardent `data-testid="maison"`, `data-groupe`, `aria-label="Maison « … »"` et les boutons « Poser dans la maison « … » » (#18).
- Étapes nouvelles : « Léa fait glisser du doigt l'étiquette « … » dans la maison « … » » (et sa forme d'état « a fait glisser du doigt <n> fois… »), « … et la lâche hors de toute maison », « Léa a lâché <n> fois l'étiquette « … » hors de toute maison », « Léa fait passer du doigt l'étiquette « … » au-dessus de la maison « … », sans la lâcher », « Léa essaie de faire glisser du doigt l'étiquette « … » … », « Léa pose chaque étiquette dans sa maison <geste> », « Léa pose les étiquettes « do », « mi » puis « no » <geste> », « Léa remet les 6 vers dans l'ordre <geste> », « le petit train … », « … devient le premier wagon du petit train », « la porte de la maison « … » … », « Léa a dit « Je ne sais pas » (pour l'étiquette « … ») », « Léa a posé les étiquettes de « 10 » à « 90 » », « Léa a remis en place les quatre premiers vers », « Léa voit <ce qui est vu> en mode dys : … », les deux situations du Plan 98.18.
- Étapes existantes reprises : « Léa joue seulement l'exercice « … » de la leçon « … » », « Léa pose l'étiquette « … » (dans la maison « … ») », « l'étiquette « … » reste dans la maison « … » », « l'étiquette « … » revient parmi les étiquettes à poser », « il reste <n> étiquettes à poser », « l'étiquette « … » prend la première place », « Léa a posé l'étiquette « … » », « Léa a posé les étiquettes « do » et « mi » », « Noisette applaudit en sautant », « Noisette ne dit aucun encouragement », « Noisette dit un encouragement, suivi de « … » », « une leçon de test a un seul exercice classer de deux étiquettes… », « Léa a ensuite posé « … » dans « … » », « Léa voit les maisons …, et <n> étiquettes à poser » (#18) ; « Léa joue un exercice classer|ordre d'une leçon de test », « Léa dit « Je ne sais pas » », « la bonne maison de l'étiquette choisie brille », « l'étiquette qui vient ensuite brille », « Léa doit encore donner elle-même la bonne réponse » (#23) ; « Léa remet dans l'ordre les vers de « … » », « Léa pose le vers « … » en premier », « Léa voit les vers joints par « / »… » (#22) ; « Léa voit <n> étoiles allumées sur 3 », « l'écran indique en texte « … » », « Léa gagne <n> étoile(s) », « l'appareil demande des mouvements réduits » (#24) ; « l'avancement de la séance montre … » (#16) ; « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran » (socle) ; « Paul a réglé « mode dys » sur « oui » pour Léa », « Léa commence l'exercice « … » de la leçon « … » » (#17) ; « Léa commence la séance de révision » (#28) ; « Léa entend l'effet sonore « … », puis Noisette dit un encouragement », « Léa n'entend pas l'effet sonore « … » », « des étincelles apparaissent autour des étiquettes » (#97).

## Scénarios existants à mettre à jour

### Si les questions suivent les recos

**Aucun texte de scénario ne change.** Le mot « maison » (98.6), l'Indication du geste (98.8) et les libellés lus restent les mêmes. Seules des **étapes** (code de `features/steps/`) sont à adapter :

| Fichier | Scénario | Ce qui change dans l'étape |
|---|---|---|
| `features/18-classer-ordre-trous.feature` (l. 152-161) | Plan « L'étiquette « loup » se pose dans la maison « ou » <geste> », exemple « en la faisant glisser » | Aujourd'hui `dragTo` à la souris sur le glisser-déposer HTML5 (`classer-ordre-trous.steps.ts`, l. 131-132). Si le glisser est réécrit (événements de pointeur, pour marcher au doigt sur iPad et iPhone), l'étape garde la souris (cas de l'ordinateur) mais doit passer par le nouveau geste. Le texte du Plan reste. |
| `features/18-classer-ordre-trous.feature` (l. 168-173) et `features/79-consigne-visible-pendant-l-exercice.feature` (l. 244-250) | « Les maisons et les étiquettes tiennent dans un écran de 360 px de large », « La consigne, les maisons et les étiquettes tiennent ensemble… » | L'étape « chaque étiquette et chaque maison mesurent au moins 44 px » mesure `data-testid="maison"` : la maison dessinée doit garder ce repère sur sa zone de toucher, pas sur le seul dessin. |
| `features/23-aide-et-je-ne-sais-pas.feature` (l. 118-127) | Plan « « Je ne sais pas » dans un exercice <type> … », exemples `classer` et `ordre` | L'étape vérifie `data-brille="true"` sur une seule maison ou une seule étiquette : la maison allumée (bon placement) ne doit **pas** porter `data-brille`. |
| `features/18-classer-ordre-trous.feature` (l. 68-99), `features/22-memoriser-une-poesie.feature` (l. 68-79), `features/79-…` (l. 119-124) | Places d'un `ordre` et des vers (« prend la première place », « prend la troisième place », « reste à la première place ») | Les étapes lisent `data-testid="place"` et `data-remplie` : les wagons doivent les garder. |
| `features/97-retours-animes-et-sonores.feature` (branche de #97) | « Une étiquette posée dans la mauvaise maison fait entendre « réponse fausse » et revient » | Rien : il est joué par toucher. Le scénario `@depend-de-97` de R3 ajoute seulement que le retour en glissant ne retarde pas ce son. |

### Si le PO choisit une autre option

| Question, option | Scénarios existants dont le **texte** change |
|---|---|
| **98.6 = paniers** (option A) | `features/18-…` : l. 22 (Indication du geste « … touche une maison. »), l. 25-35, 37-41, 43-47 (« « loup » n'habite pas dans la maison « on ». Essaie une autre maison. »), 49-59, 146 (consigne par défaut « Range chaque étiquette dans la bonne maison. »), 150-161, 168-173 ; `features/79-…` : l. 25-30, 61, 81-86, 95-99, 109-115, 141-160, 194-198, 236-250 ; `features/16-…` : l. 108-113, 170-175 ; `features/23-…` : l. 126 ; `features/97-…` : « Une étiquette posée dans la mauvaise maison… » et l'exemple `classer` du Plan 97.6. Dans le domaine : l'aide par défaut de `classer`, l'Indication du geste, la consigne par défaut, et les libellés lus « Maison « … » », « Poser dans la maison « … » ». Le mot **Groupe** du glossaire (décision n°24) change de mot d'interface. Dans ce `.feature`, toutes les étapes qui disent « maison » passent à « panier », et « porte » devient « couvercle » ou disparaît. |
| **98.8 = oui** (glisser aussi dans un `ordre`) | `features/18-…` l. 66, `features/22-…` l. 65, `features/79-…` l. 68 : l'Indication du geste « Touche d'abord celle qui vient en premier. » change (texte d'Apprentissage à fixer). Dans ce `.feature`, le scénario « Dans un ordre, essayer de glisser une étiquette ne la pose pas » s'inverse : l'étiquette glissée sur le petit train prend la place suivante, quel que soit le wagon visé. |
| **98.15 = non** (pas de flèches) | Aucun existant. Ce `.feature` perd « Au clavier, les flèches passent d'une maison à l'autre ». |

## Hors périmètre

### Tranches suivantes proposées (aucun scénario ici)

Le détail est dans `docs/stories/98/domain-model.md`, « Proposition de découpage ». Les numéros d'issues sont à créer par le PO (98.16).

| Tranche | Types | Contenu proposé | Questions qui la conditionnent |
|---|---|---|---|
| **98b** bulles de choix | `bulles`, `ecoute`, questions de `lecture`, `trous`, `conjugaison`, mots cachés de `memoriser` (et, selon 98.4, le mode par choix de `calcul`, `boite`, `barres`, `addition`) | Choix en bulles, flottement léger après la consigne, cible fixe ; bulle juste qui s'efface en douceur après le rebond de #97 ; mot juste qui rejoint son trou ou sa ligne ; flèches entre les bulles | 98.3, 98.4, 98.5, 98.15 |
| **98c** quantités | `addition`, `boite`, `barres` | Chiffre glissé au doigt dans sa maison (geste de 98a) ; maison qui s'allume quand le chiffre est juste ; retenue qui saute ; jetons qui tombent ; barres en jauge sans trahir la valeur cherchée | 98.2 (couleurs des colonnes) |
| **98d** claviers | `dictee`, `calcul`, `fluence` | Case de la dictée qui s'allume quand une lettre y est écrite, puis cases illuminées quand le mot est juste ; cristal touché qui s'illumine sans ressembler à la bonne réponse montrée ; record de fluence montré pendant la fluence | 98.7, 98.9, 98.10 |
| **98e** textes qui se dévoilent | `lecture`, `memoriser` (écoute des vers) | Parchemin qui se déroule pendant la lecture du personnage guide, puis tout reste visible ; texte entier tout de suite en Muet, sans voix ou avec les mouvements réduits | 98.12 |

### Hors de toute tranche de #98

- Les retours de #97 : effets sonores, rebond, balancement, point qui vole, étincelles du texte complet (y compris la dernière étiquette de `classer`, question 97.6), confettis, « bouton touché », leurs variantes de mouvements réduits. 98a s'appuie dessus (`@depend-de-97`) sans les redécrire.
- Ce que fait #96 : couleur principale de l'univers, polices, jetons, boutons en relief, transitions, personnages guides. 98a utilise les jetons, sans les changer.
- Les animations des personnages guides (#106).
- Toute règle de correction : le placement reste « la place suivante » pour un `ordre`, le groupe pour `classer` ; les étiquettes mélangées restent celles du domaine (invariant 3).
- Un habillage par univers (98.2, reco : un habillage par type, le même dans tous les univers).

## Questions ouvertes

### Questions du modèle (98.1 à 98.17)

Le détail et les options sont dans `docs/stories/98/domain-model.md`, « Questions ouvertes ». La dernière colonne dit quels scénarios de **cette** tranche changeraient si le PO ne suit pas la reco.

| # | Question | Reco | Scénarios de 98a touchés si autre option |
|---|---|---|---|
| 98.1 | Les pistes du tableau de l'issue te plaisent-elles ? | Garder bulles, wagons, maisons, jetons, jauge, parchemin ; changer l'éclat de la bonne bulle (98.5), le feu d'artifice de la dictée (98.7), les coffres (98.6) | Toute la règle R4 (petit train, wagons) si le PO refuse le train ; les mentions « le petit train n'a aucun wagon » de R2, R5 et R6 |
| 98.2 | Habillage par type, ou par univers ? | Par type, le même dans tous les univers, coloré par les jetons de #96 | Aucun texte ; les dessins de la maison et du train seraient à faire 6 fois |
| 98.3 | Des bulles qui bougent sont-elles faciles à toucher au CP ? | Mouvement très léger, cible fixe d'au moins 44 px, immobile pendant la consigne | Aucun (98b) |
| 98.4 | Le flottement vaut-il pour toutes les bulles de choix ? | Forme de bulle partout, flottement seulement pour `bulles` et `ecoute` | Aucun (98b) ; les choix de la question de `classer` en révision (Plan 98.18) prendraient la forme de 98b |
| 98.5 | La bonne bulle s'efface-t-elle en douceur, sans étincelles ? | Oui | Aucun (98b) |
| 98.6 | `classer` : paniers, coffres ou maisons ? | Garder « maison », petite maison dont la porte s'ouvre et qui s'allume | R3 entière, R2 et R6 (toutes les étapes « maison », « porte »), et les scénarios existants listés plus haut |
| 98.7 | Dictée : case allumée quand une lettre y est écrite, sans feu d'artifice ? | Oui | Aucun (98d) |
| 98.8 | `ordre` : peut-on aussi glisser une étiquette sur le train ? | Non, toucher suffit | « Dans un ordre, essayer de glisser une étiquette ne la pose pas » s'inverse ; Plans de R1 « … dans l'ordre <geste> » : « du doigt » voudrait dire glisser ; Indication du geste dans #18, #22, #79 |
| 98.9 | Les cristaux « brillent » quand on les touche ? | Éclat court, différent de la bonne réponse montrée | Aucun (98d) |
| 98.10 | Fluence comme course contre son record ; record visible pendant la fluence ? | Oui, sous trois conditions (pas le mot « course », marque « Ton record : 12 », changement de couleur seulement) | Aucun (98d) |
| 98.11 | Un glisser lâché hors de toute cible revient-il sans coûter d'erreur ? | Oui : ce n'est pas une réponse | « Lâchée hors de toute maison… » (×2), « Lâcher 5 fois… ne coûte aucune étoile », exemple « lâchée hors de toute maison » du Plan des mouvements réduits |
| 98.12 | Le parchemin cache-t-il les lignes pas encore lues ? | Seulement pendant la première lecture | Aucun (98e) |
| 98.13 | L'habillage vaut-il aussi en séance de révision et au test de départ ? | Oui | Pour 98a, sans effet : les étiquettes n'y apparaissent jamais (voir 98.18) |
| 98.14 | « Habillage de jeu » : terme du domaine ou mot de cadrage ? | Mot de cadrage seulement, jamais à l'écran ni dans le domaine | Aucun : les scénarios ne l'emploient pas |
| 98.15 | Les flèches passent-elles d'une bulle à l'autre et d'une maison à l'autre ? | Oui pour les bulles et les maisons ; les étiquettes gardent Tab | « Au clavier, les flèches passent d'une maison à l'autre » disparaît |
| 98.16 | Découpage en cinq tranches, 98a à 98e, dans cet ordre ? | Oui ; 98e peut rejoindre 98c ou 98d | Aucun ; la section « Hors périmètre » changerait |
| 98.17 | Le glisser au doigt doit-il marcher sur iPad et iPhone autant que sur Android ? | Oui, prouvé sur `tablette` et `telephone` | « Glissée du doigt dans la maison « ou »… », « Sur un écran de 360 px… » : sinon, le glisser au doigt n'est garanti que sur Android, et l'enfant n'a que toucher puis toucher ailleurs |

### Questions nouvelles (98.18 à 98.24)

**98.18 En séance de révision et au test de départ, une question de `classer` reste-t-elle une question à choix (« « loup » va dans quelle maison ? »), sans étiquette à glisser ?**
Les décisions 27.11 et 28.13 la rejouent en question à choix ; `ordre` et `memoriser` n'y sont jamais. Donc, pour 98a, la question 98.13 ne change rien : l'enfant ne voit jamais d'étiquette en révision ni au test de départ.
Reco : **oui**, garder la question à choix ; elle recevra la forme de bulle de 98b. Option : rejouer l'étiquette dans les maisons (forme de `classer` complète avec une seule étiquette), ce qui changerait le domaine de #27 et #28.
Scénario touché : Plan « <Où>, une question de classer reste une question à choix… ».

**98.19 Le projet Playwright `tablette` doit-il simuler un écran tactile ?**
Aujourd'hui, seul `telephone` a `hasTouch: true`. Sans cela, « au doigt sur la tablette » n'est pas prouvé (98.17).
Reco : **activer le toucher sur le projet `tablette`** (une vraie tablette est tactile), et le vérifier par le passage complet de non-régression. Option : un projet `tablette-tactile` réservé aux scénarios de #98, pour ne pas toucher aux autres.
Scénarios touchés : tous ceux qui disent « du doigt » (sur la tablette).

**98.20 Une maison survolée par une étiquette en train de glisser se signale-t-elle ?**
Reco : **oui, toutes de la même façon** (la maison grossit un peu ou son contour s'épaissit), sans couleur de réussite ni d'erreur, pour que l'enfant sache où il va lâcher sans que l'habillage donne la réponse (invariant 6). Avec les mouvements réduits, seul le contour change. Option : rien ne se signale.
Scénario touché : « Une étiquette qui passe au-dessus d'une maison, sans être lâchée… » (son étape « se signale comme toute maison survolée » disparaîtrait).

**98.21 Comment le petit train tient-il à 360 px : 10 wagons (« De dix en dix ») et des vers longs (« Quand la bise fut venue : ») ?**
Reco : **le train passe à la ligne** (il serpente, rangée après rangée), chaque wagon garde 44 px au moins ; pour les vers, **un vers par wagon, sur toute la largeur**, les wagons les uns sous les autres, pour que le vers se lise en entier et en mode dys. Option : pas de train pour les vers (seulement la place qui se remplit, comme aujourd'hui).
Scénarios touchés : « Le bon premier vers devient le premier wagon… », « À 360 px, le petit train de 10 wagons… », « À 360 px, les vers accrochés au petit train se lisent en entier ».

**98.22 Si 98.8 = non : que se passe-t-il quand l'enfant essaie de glisser une étiquette d'un `ordre` ?**
Reco : **l'étiquette ne se soulève pas**, rien ne bouge, aucune réponse, aucune erreur ; seul le toucher la pose (l'Indication du geste le dit déjà). Option : un glisser vers le train compte comme un toucher (ce qui revient à 98.8 = oui).
Scénario touché : « Dans un ordre, essayer de glisser une étiquette ne la pose pas : on la touche ».

**98.23 Avec les mouvements réduits, l'étiquette suit-elle encore le doigt pendant le glisser ?**
Reco : **oui** : c'est l'enfant qui la déplace, ce n'est pas un mouvement « de lui-même » (invariant 9). Seuls le retour en glissant, la porte qui s'ouvre et le train qui roule disparaissent : l'étiquette réapparaît à sa place, la maison s'allume, le wagon apparaît. Option : avec les mouvements réduits, pas de glisser, seulement toucher puis toucher.
Scénario touché : « Avec les mouvements réduits, l'étiquette suit toujours le doigt de l'enfant ».

**98.24 Sur un téléphone, les maisons sont sous les étiquettes (le scénario de #18 fait défiler la page avant de glisser). Comment l'enfant glisse-t-il une étiquette jusqu'à une maison hors de l'écran ?**
Reco : **les maisons et les étiquettes à poser tiennent ensemble dans l'écran** à 360 × 740 pour un `classer` de la bibliothèque (3 maisons, 9 étiquettes au plus) ; sinon, la page défile d'elle-même quand l'étiquette approche du bas de l'écran. Toucher puis toucher reste toujours possible. Option : pas de défilement pendant le glisser ; l'enfant fait d'abord défiler, puis glisse.
Scénario touché : « Sur un écran de 360 px, Léa glisse du doigt une étiquette jusqu'à la dernière maison ».

## Termes

Aucun terme nouveau du domaine. Mots d'interface employés : maison (déjà, décision n°24), porte, s'allume, petit train, wagon, revenir en glissant, faire glisser du doigt. « glisser » nomme le **geste** ; la réponse reste un **Placement** ; « glisser-déposer » et « drop » restent interdits (glossaire). « Habillage de jeu » n'apparaît dans aucun scénario (98.14). Les propositions de glossaire du modèle (section « Termes à signaler ») restent à valider par le PO.

## Décisions

Aucune pour l'instant : les questions 98.1 à 98.24 attendent la validation du PO.
