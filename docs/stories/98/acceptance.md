# Critères d'acceptance : story #98, des exercices qui ressemblent à des jeux (tranche 98a)

**Cadrage à revalider par le PO.** Le 2026-10-28, le PO avait validé tout le cadrage (« 98# reco partout », issue #64 : questions 98.1 à 98.24 et découpage 98a à 98e). Il a ensuite **changé 98.2 : habillage par univers** (chaque type d'exercice a un dessin différent dans chacun des 6 univers), et confirmé 98.1, 98.3 et 98.10. Ce cadrage est donc repris : le modèle (`docs/stories/98/domain-model.md`, « Habillage par univers », invariants 14 à 20, « Validation des dessins par le PO », « Découpage révisé ») pose les questions **98.25 à 98.31**, et ces critères suivent leurs recos en attendant la réponse du PO.

Scénarios : `features/98-exercices-comme-des-jeux.feature`. Tags :
- `@issue-98 @wip` sur la fonctionnalité ;
- `@a-valider` sur le seul scénario qui dépend d'une question encore ouverte (98.30 et 98.31) ;
- plus aucun `@depend-de-97` : #97 est mergée dans `main` (`c477f3b`), ses étapes existent (`retours-animes-et-sonores.steps.ts`), les 2 scénarios qui s'appuient sur ses retours tournent donc avec les autres.

Les commentaires « Décision 98.n » du `.feature` renvoient aux questions ci-dessous.

État : **cadrage repris, à revalider ; aucun code** (décision 0020). #97 est mergée : le code pourra commencer dès la validation. Modèle : `docs/stories/98/domain-model.md`.

## Objectif

En tant qu'**enfant**, je veux glisser mes étiquettes du doigt dans des maisons de mon univers, qui s'ouvrent et s'allument, afin que ranger ressemble à un petit jeu dans mon univers, et d'avoir envie de faire la question suivante.

Cette tranche (98a) est celle que garde l'issue #98. Elle pose le **geste glisser au doigt**, qui servira aussi à l'addition (98c), les **invariants transverses** du modèle (mêmes faits, même résultat ; aucune réponse de plus ni de moins ; « Je ne sais pas » reconnaissable ; mouvements réduits ; 44 px ; 360 px ; mode dys ; lecteurs d'écran), et la **maison de `classer` dessinée dans chacun des 6 univers** (98.2). Le petit train (`ordre`, ordre des vers de `memoriser`) sort de 98a vers une nouvelle tranche (reco de 98.30, voir « Hors périmètre »).

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : chaque bon placement se voit (la maison s'ouvre et s'allume), et la progression de l'exercice reste visible (maisons remplies) ;
- **autonomie** : l'enfant choisit son geste (glisser, toucher puis toucher, clavier) et, dans `classer`, l'ordre de ses étiquettes (#18) ; il retrouve dans l'exercice l'univers qu'il a choisi (#6).

La story ne change que l'affichage : aucune règle de correction, aucune erreur, aucune étoile, aucun avancement, aucune parole du personnage guide. Aucune donnée nouvelle, aucune migration, aucune Edge Function ; l'univers du profil est déjà enregistré (#6) et déjà lu par l'écran de séance (#96). Elle ne franchit aucun garde-fou de la section 5 du skill : pas de coffre (98.6), pas de hasard, pas de pénalité ; un glisser raté ne coûte rien (98.11). Les dessins de la maison, dans les 6 univers, suivent le skill `illustration`, section 0, et l'invariant 20 du modèle : rien d'effrayant ni d'agressif, rien ne se casse ; en particulier aucune arme, barreau ni lampe qui clignote (Police), aucune flamme ni fumée ni sirène (Pompiers), aucune coupe ni podium (Sports), aucune tenue suggestive ni stéréotype (Princesses et fées, Danse).

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Pour les mêmes réponses, l'habillage de jeu ne change rien : mêmes erreurs, même avancement de la séance, mêmes étoiles ; un exercice `classer` se termine au doigt comme au clavier seulement ; en séance de révision et au test de départ, une question de `classer` reste une question à choix | Plan « Léa range toutes les étiquettes <geste>, sans erreur, et gagne 3 étoiles » : glisser du doigt, toucher puis toucher, clavier seulement · Plan « Avec <erreurs> mauvais placement(s) faits en glissant du doigt, Léa gagne <résultat>, comme en touchant » : 0 → 3, 1 → 2, 3 → 2, 4 → 1 · Plan « <Où>, une question de classer reste une question à choix, sans étiquette à faire glisser » : séance de révision, test de départ (98.18) |
| R2 | Une étiquette de `classer` se glisse du doigt jusqu'à une maison ; seul un lâcher sur une maison est une réponse : lâchée ailleurs, elle revient à sa place sans coûter d'erreur ; toucher puis toucher et le clavier restent possibles, et une étiquette rangée ne se déplace plus | « Glissée du doigt dans la maison « ou », l'étiquette « loup » y reste » (98.17) · « Sur un écran de 360 px, Léa glisse du doigt une étiquette jusqu'à la dernière maison » (98.17, 98.24) · « Une étiquette qui passe au-dessus d'une maison, sans être lâchée, ne donne aucune réponse » (98.20) · « Lâchée hors de toute maison, l'étiquette revient à sa place, sans encouragement » (98.11) · « Lâchée hors de toute maison, l'étiquette ne fait entendre aucun son de réponse » (98.11) · « Lâcher 5 fois une étiquette hors de toute maison ne coûte aucune étoile » (98.11) · « Une étiquette rangée dans sa maison ne se déplace plus » · « Dans un ordre, essayer de glisser une étiquette ne la pose pas : on la touche » (98.8, 98.22) · « Au clavier, les flèches passent d'une maison à l'autre » (98.15) |
| R3 | Dans `classer`, la bonne maison ouvre sa porte, garde l'étiquette et s'allume ; dans une mauvaise maison, l'étiquette revient en glissant parmi les étiquettes à poser, avec l'encouragement de #18, sans retarder l'effet sonore de #97 | « Au début de l'exercice, les trois maisons sont fermées et éteintes » (98.6) · « L'étiquette « loup » bien rangée fait ouvrir la porte de la maison « ou », qui s'allume » (98.6) · « Glissée du doigt dans la mauvaise maison, l'étiquette revient en glissant, avec l'aide par défaut » (98.6) · « Le retour de l'étiquette ne retarde ni « réponse fausse » ni l'encouragement » |
| R4 | **Nouvelle (98.2)** : dans chacun des 6 univers, les maisons de `classer` ont le dessin de cet univers ; changer d'univers ne change ni les gestes, ni les textes lus, ni les étoiles, ni la façon dont brille la bonne réponse montrée ; un profil sans univers connu voit les maisons de l'univers « Animaux de la forêt » | Plan « Dans l'univers « <univers> », les maisons ont le dessin de cet univers et s'annoncent toujours « Maison « … » » » : les 6 univers (`@a-valider`, 98.30 et 98.31) · Plan « Dans l'univers « <univers> », l'étiquette glissée du doigt dans la bonne maison fait ouvrir sa porte, et la maison s'allume » : les 6 univers · Plan « Dans l'univers « <univers> », une mauvaise maison fait dire à <personnage guide> la même aide que dans tous les univers » : Sports (Coach Léo), Police (Agent Max) · Plan « Dans l'univers « <univers> », un mauvais placement fait en glissant du doigt donne 2 étoiles, comme dans l'univers « Animaux de la forêt » » : Princesses et fées, Pompiers · Plan « Dans l'univers « <univers> », la maison montrée par « Je ne sais pas » brille comme dans tous les univers » : les 5 univers autres qu'Animaux de la forêt · Plan « Un profil enfant <cas> voit les maisons de l'univers « Animaux de la forêt » » : sans univers, univers inconnu |
| R5 | « Je ne sais pas » montre toujours la bonne maison, reconnaissable dans le nouveau dessin et jamais confondue avec une maison allumée ; l'enfant y pose ensuite l'étiquette lui-même, au doigt ou au clavier | « « Je ne sais pas » dans un exercice classer : la bonne maison brille, et aucune maison n'ouvre sa porte » · « Après « Je ne sais pas », Léa glisse elle-même l'étiquette dans la maison qui brille » · « Après « Je ne sais pas », un mauvais placement fait en glissant ne coûte plus d'erreur » |
| R6 | Avec les mouvements réduits, rien ne glisse ni ne s'ouvre de lui-même, et l'information reste ; dans chacun des 6 univers, étiquettes et maisons gardent 44 px et tiennent à 360 px de large ; elles s'affichent en mode dys et gardent ce que lisent les lecteurs d'écran | Plan « Avec les mouvements réduits, <cas> se voit sans mouvement » : étiquette bien rangée, mauvaise maison, lâchée hors de toute maison · « Avec les mouvements réduits, l'étiquette suit toujours le doigt de l'enfant » (98.23) · « Avec les mouvements réduits, la maison montrée par « Je ne sais pas » brille sans bouger » · Plan « Dans l'univers « <univers> », les maisons et les étiquettes tiennent dans un écran de 360 px et gardent 44 px » : les 6 univers · Plan « Dans l'univers « <univers> », avec les mouvements réduits, la maison bien rangée s'allume sans bouger » : les 5 univers autres qu'Animaux de la forêt (déjà couvert par le premier Plan) · « En mode dys, les étiquettes et le nom de chaque maison s'affichent en mode dys » · « Les lecteurs d'écran annoncent les maisons comme avant, sans décrire leur dessin » |

Au total : **6 règles, 32 scénarios** (dont 12 plans de scénario, 46 exemples). **1** porte `@a-valider`. Aucun ne porte plus `@depend-de-97`.

Les Plans sur les univers sont sobres : les 6 univers là où le dessin peut changer ce qu'on vérifie (dessin de la maison, zone où l'on lâche l'étiquette, tenue à 360 px et 44 px) ; les 5 autres univers là où Animaux de la forêt est déjà couvert par un autre scénario (« Je ne sais pas », mouvements réduits) ; 2 univers là où le dessin ne peut rien changer, pour prouver la règle sans la répéter (aide lue, étoiles).

Checklist `po-acceptance` du skill `gamification` :
- besoin nourri : compétence et autonomie (ci-dessus) ;
- déclencheur métier de chaque retour : un **Placement** juste (maison qui s'ouvre et s'allume), un placement faux (retour en glissant), « Je ne sais pas » (bonne réponse montrée) ; aucune récompense nouvelle ; le dessin de l'univers n'est déclenché par rien, il est là dès le début de l'exercice ;
- retour après une erreur : R3 (« Glissée du doigt dans la mauvaise maison… », encouragement et nouvelle chance), et R4 pour les autres univers (même aide, même personnage guide que l'univers) ;
- mouvements réduits : R6, l'information reste (maison allumée, étiquette revenue), dans chaque univers ;
- aucun garde-fou franchi ; les pistes retenues (maison qui s'ouvre) sont validées par le PO (98.1, 98.6) ; les objets dessinés dans chaque univers attendent 98.25.

### Droits d'accès

La story ne crée, ne lit et n'enregistre aucune donnée nouvelle : **pas de scénario `@acces`**. L'univers est lu sur le profil enfant en cours, comme le fait déjà #96. Les séances terminées restent enregistrées comme aujourd'hui (#24), par un parent rattaché seulement. Les écrans du parent ne montrent aucun exercice : l'habillage par univers ne les touche pas (réponse 96.13).

### Précisions pour les étapes (pour `e2e-tester`)

- **Projets** : tous les scénarios tournent sur `tablette` et `telephone`. « faire glisser du doigt » est un **vrai glisser au toucher** (événements tactiles ou pointeur de type toucher), pas `dragTo` à la souris. Le projet `tablette` reçoit le toucher (98.19).
- **Dessin de l'univers** : « les maisons … ont le dessin de l'univers « … » » se vérifie par un attribut **`data-univers`** sur chaque maison (`data-testid="maison"`), égal à la clé de l'univers (`animaux`, `princesse`, `sports`, `police`, `pompier`, `danse`), comme `data-univers` du paysage de #96. **Jamais par un tracé** SVG (skill `illustration`, section 3) : un dessin refait ne casse aucun test.
- **Univers choisi** : « Léa a choisi l'univers <clé> » est l'étape existante (`voix.steps.ts`), déjà combinée avec un Contexte « … dans l'univers « Animaux de la forêt » » par #32 et #65. Elle écrit aujourd'hui un profil de niveau CE1 : dans ce `.feature`, Léa garde son niveau CP (la leçon « Les sons ou, on, an » est du CP), à adapter dans l'étape. « Léa a un profil enfant préparé sans univers » et « … dont l'univers est inconnu » sont les étapes de #6 (`univers.steps.ts`) ; ici elles suivent le Contexte et doivent remplacer le profil qu'il a préparé.
- **Personnage guide qui parle** : « <personnage guide> dit un encouragement, suivi de « … » » généralise l'étape de #23 (« Noisette dit un encouragement, suivi de… ») aux personnages guides des autres univers.
- **Même façon de briller** : « elle brille de la même façon que dans l'univers « Animaux de la forêt » » vérifie que le signal « bonne réponse montrée » est le même composant commun, posé par-dessus le dessin (invariant 15) : même attribut `data-brille="true"`, même élément de signal, mêmes styles calculés que dans l'univers Animaux de la forêt. « aucune maison ne s'allume » vérifie qu'aucune maison ne porte l'attribut de la maison allumée.
- **Mêmes étoiles** : le Plan « Avec <erreurs> mauvais placement(s) faits en glissant… » reprend exactement les données du scénario de #18 « Reposer une étiquette dans la même mauvaise maison coûte une nouvelle erreur » (4 erreurs → 1 étoile). Les deux doivent donner le même nombre d'étoiles.
- **« revient en glissant jusqu'à sa place »** : l'étiquette se voit en mouvement entre la maison et sa place, puis est de nouveau parmi les étiquettes à poser. Ne pas mesurer de durée dans l'étape ; vérifier l'état d'arrivée et la présence d'un mouvement (sauf mouvements réduits).
- **« s'allume » contre « brille »** : la maison allumée et la maison qui brille (bonne réponse montrée) se distinguent par un attribut différent (`data-brille` reste réservé à la bonne réponse montrée), dans les 6 univers. L'étape « ne brille pas comme une bonne réponse montrée » vérifie que `data-brille` est absent.
- **Ordre sans train** : « Léa essaie de faire glisser du doigt l'étiquette « do » vers les places à remplir » et « aucune place n'est remplie » lisent `data-testid="place"` et `data-remplie` (étapes de #18, #22 et #79) ; aucun wagon n'existe dans cette tranche.
- **Maisons** : elles gardent `data-testid="maison"` sur leur zone de toucher (pas sur le seul dessin), `data-groupe`, `aria-label="Maison « … »"` et les boutons « Poser dans la maison « … » » (#18), dans les 6 univers. « n'annoncent ni porte, ni toit, ni lumière, ni l'univers du dessin » : le dessin est `aria-hidden`.
- **Captures dans les 6 univers** (98.29, reco) : avant la PR, une capture de l'écran réel à 360 px (projet `telephone`, mouvements réduits) **dans chacun des 6 univers** pour `classer` : une maison allumée, une maison qui brille après « Je ne sais pas ». Elles sont **jointes à la PR** pour le ⛔ du merge, **sans tag `@visuel`** et sans capture de référence : elles ne font échouer aucun test.
- Étapes nouvelles : « Léa fait glisser du doigt l'étiquette « … » dans la maison « … » » (et sa forme d'état « a fait glisser du doigt <n> fois… »), « … et la lâche hors de toute maison », « Léa a lâché <n> fois l'étiquette « … » hors de toute maison », « Léa fait passer du doigt l'étiquette « … » au-dessus de la maison « … », sans la lâcher », « Léa essaie de faire glisser du doigt l'étiquette « … » … », « Léa pose chaque étiquette dans sa maison <geste> », « la porte de la maison « … » … », « les maisons … ont le dessin de l'univers « … » », « elle brille de la même façon que dans l'univers « … » », « aucune maison ne s'allume », « aucune place n'est remplie », « <personnage guide> dit un encouragement, suivi de « … » », « Léa a dit « Je ne sais pas » (pour l'étiquette « … ») », « Léa voit les étiquettes et le nom de chaque maison en mode dys : … », les deux situations du Plan 98.18.
- Étapes existantes reprises : « Léa joue seulement l'exercice « … » de la leçon « … » », « Léa pose l'étiquette « … » (dans la maison « … ») », « l'étiquette « … » reste dans la maison « … » », « l'étiquette « … » revient parmi les étiquettes à poser », « il reste <n> étiquettes à poser », « Noisette applaudit en sautant », « Noisette ne dit aucun encouragement », « Noisette dit un encouragement, suivi de « … » », « une leçon de test a un seul exercice classer de deux étiquettes… », « Léa a ensuite posé « … » dans « … » », « Léa voit les maisons …, et <n> étiquettes à poser », « chaque étiquette et chaque maison mesurent au moins 44 px de haut et de large » (#18) ; « Léa joue un exercice classer d'une leçon de test », « Léa dit « Je ne sais pas » », « la bonne maison de l'étiquette choisie brille », « Léa doit encore donner elle-même la bonne réponse » (#23) ; « Léa voit <n> étoiles allumées sur 3 », « l'écran indique en texte « … » », « Léa gagne <n> étoile(s) », « l'appareil demande des mouvements réduits » (#24) ; « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran » (socle) ; « Paul a réglé « mode dys » sur « oui » pour Léa », « Léa commence l'exercice « … » de la leçon « … » » (#17) ; « Léa commence la séance de révision » (#28) ; « Léa entend l'effet sonore « … », puis Noisette dit un encouragement », « Léa n'entend pas l'effet sonore « … » » (#97) ; « Léa a choisi l'univers <clé> » (#7, #32, #65) ; « Léa a un profil enfant préparé sans univers | dont l'univers est inconnu », « aucun message d'erreur n'apparaît » (#6).

## Scénarios existants à mettre à jour

**Aucun texte de scénario existant ne change**, ni avec les recos de 98.1 à 98.24, ni avec l'habillage par univers : le mot « maison » (98.6), l'Indication du geste (98.8) et les libellés lus restent les mêmes dans les 6 univers (invariant 14). Seules des **étapes** (code de `features/steps/`) sont à adapter :

| Fichier | Scénario | Ce qui change dans l'étape |
|---|---|---|
| `features/18-classer-ordre-trous.feature` (l. 152-161) | Plan « L'étiquette « loup » se pose dans la maison « ou » <geste> », exemple « en la faisant glisser » | Aujourd'hui `dragTo` à la souris sur le glisser-déposer HTML5 (`classer-ordre-trous.steps.ts`). Si le glisser est réécrit (événements de pointeur, pour marcher au doigt sur iPad et iPhone), l'étape garde la souris (cas de l'ordinateur) mais doit passer par le nouveau geste. Le texte du Plan reste. |
| `features/18-classer-ordre-trous.feature` (l. 168-173) et `features/79-consigne-visible-pendant-l-exercice.feature` (l. 244-250) | « Les maisons et les étiquettes tiennent dans un écran de 360 px de large », « La consigne, les maisons et les étiquettes tiennent ensemble… » | L'étape « chaque étiquette et chaque maison mesurent au moins 44 px » mesure `data-testid="maison"` : la maison dessinée doit garder ce repère sur sa zone de toucher, pas sur le seul dessin, dans chaque univers. |
| `features/23-aide-et-je-ne-sais-pas.feature` (l. 118-127) | Plan « « Je ne sais pas » dans un exercice <type> … », exemple `classer` | L'étape vérifie `data-brille="true"` sur une seule maison : la maison allumée (bon placement) ne doit **pas** porter `data-brille`. |
| `features/97-retours-animes-et-sonores.feature` | « Une étiquette posée dans la mauvaise maison fait entendre « réponse fausse » et revient » | Rien : il est joué par toucher. Le scénario de R3 ajoute seulement que le retour en glissant ne retarde pas ce son. |

Les places d'un `ordre` et des vers (`data-testid="place"`, `data-remplie`) ne changent pas dans 98a ; elles concernent la tranche du petit train.

### Options écartées le 2026-10-28 (pour mémoire)

| Question, option écartée | Scénarios existants dont le **texte** aurait changé |
|---|---|
| **98.6 = paniers** (option A) | `features/18-…` : l. 22 (Indication du geste « … touche une maison. »), l. 25-35, 37-41, 43-47, 49-59, 146, 150-161, 168-173 ; `features/79-…` : l. 25-30, 61, 81-86, 95-99, 109-115, 141-160, 194-198, 236-250 ; `features/16-…` : l. 108-113, 170-175 ; `features/23-…` : l. 126 ; `features/97-…` : « Une étiquette posée dans la mauvaise maison… » et l'exemple `classer` du Plan 97.6. Le mot **Groupe** du glossaire (décision n°24) aurait changé de mot d'interface. |
| **98.8 = oui** (glisser aussi dans un `ordre`) | `features/18-…` l. 66, `features/22-…` l. 65, `features/79-…` l. 68 : l'Indication du geste change. Dans ce `.feature`, « Dans un ordre, essayer de glisser une étiquette ne la pose pas » s'inverserait. |
| **98.15 = non** (pas de flèches) | Aucun existant. Ce `.feature` perdrait « Au clavier, les flèches passent d'une maison à l'autre ». |

## Hors périmètre

### Nouvelle tranche proposée : le petit train (reco de 98.30, issue à créer par le PO)

`ordre`, ordre des vers de `memoriser`, petit train **dessiné dans chacun des 6 univers** (98.26). Elle dépend de 98a (geste, invariants, signal « bonne réponse montrée » commun). Ses scénarios ont été écrits et validés le 2026-10-28 dans le cadrage de 98a ; ils sont retirés du `.feature` de #98 et **gardés ici pour mémoire**, pour que cette tranche les reprenne (il lui faudra ajouter la règle « petit train de l'univers », sur le modèle de R4).

| Règle d'origine | Scénario retiré de 98a (texte validé le 2026-10-28) | Décisions |
|---|---|---|
| R1 | Plan « Léa remet « Le mot en morceaux » dans l'ordre <geste>, sans erreur, et gagne 3 étoiles » : du doigt, clavier seulement (« Léa pose les étiquettes « do », « mi » puis « no » <geste> » → « Léa voit 3 étoiles allumées sur 3 ») | 98.8 |
| R1 | Plan « Léa remet les 6 vers dans l'ordre <geste>, puis passe aux mots cachés » : du doigt, clavier seulement (« l'avancement de la séance montre 6 questions réussies sur 12 », « Léa voit les vers joints par « / », avec un trou dans chaque vers ») | 98.8 |
| ancienne R4 « Dans un `ordre` et dans l'ordre des vers, chaque bonne étiquette s'accroche comme un wagon au petit train, qui avance d'un wagon ; une mauvaise étiquette ne s'accroche pas ; la dernière garde les étincelles de #97 » | « La bonne première étiquette « do » devient le premier wagon du petit train » · « La deuxième bonne étiquette s'accroche derrière la première » (« le petit train a 2 wagons, « do » puis « mi » ») · « Une mauvaise première étiquette ne s'accroche pas, et le petit train n'avance pas » (« Ce n'est pas le début. Lequel vient en premier ? ») · « La dernière étiquette accroche le dernier wagon, puis les étincelles de #97 apparaissent » · « Le bon premier vers devient le premier wagon du petit train » (« le vers se lit en entier dans son wagon ») | 98.1, 98.21 |
| R5 | Exemple `ordre` du Plan « « Je ne sais pas » dans un exercice <type>… » : « l'étiquette qui vient ensuite brille », « le petit train n'a aucun wagon » · « Après « Je ne sais pas », l'étiquette qui brille devient le premier wagon quand Léa la pose » (« plus aucune étiquette ne brille ») | — |
| R6 | Exemple « une bonne étiquette d'un ordre » du Plan des mouvements réduits : « « do » apparaît dans le premier wagon, sans que le petit train roule » · « À 360 px, le petit train de 10 wagons tient dans la largeur de l'écran » (« De dix en dix », de « 10 » à « 100 », chaque wagon d'au moins 44 px) · « À 360 px, les vers accrochés au petit train se lisent en entier » (« Pas un seul petit morceau ») · exemple « Le mot en morceaux » du Plan du mode dys (« les étiquettes à poser ») | 98.21, 98.23 |
| R2 | « Dans un ordre, essayer de glisser une étiquette ne la pose pas » **reste dans 98a**, sans le train (voir ci-dessous) ; la tranche du train le reprendra avec « le petit train n'a aucun wagon » | 98.8, 98.22 |

**Pourquoi ce scénario reste dans 98a** : c'est 98a qui introduit le glisser au doigt sur les étiquettes, avec un composant que `classer` et `ordre` peuvent partager. Le garder protège l'invariant 2 (aucune réponse de plus) au moment même où le geste arrive, sans rien dire du train : l'étiquette ne se pose pas, aucune place n'est remplie.

### Tranches suivantes (aucun scénario ici)

Le détail est dans `docs/stories/98/domain-model.md`, « Proposition de découpage » et « Découpage révisé ». Avec l'habillage par univers, **chaque tranche gagne une règle « dessin de l'univers » et une planche à valider** (reco de 98.30).

| Tranche | Issue | Types | Contenu retenu | Questions qui la cadrent |
|---|---|---|---|---|
| **petit train** | à créer | `ordre`, ordre des vers de `memoriser` | Voir ci-dessus ; petit train de l'univers | 98.1, 98.8, 98.21, 98.22, 98.26 |
| **98b** bulles de choix | #126 | `bulles`, `ecoute`, questions de `lecture`, `trous`, `conjugaison`, mots cachés de `memoriser` (et le mode par choix de `calcul`, `boite`, `barres`, `addition`) | Bulle de l'univers ; flottement léger après la consigne, cible fixe ; bulle juste qui s'efface en douceur (un ballon ne crève jamais) ; flèches entre les bulles | 98.3, 98.4, 98.5, 98.15 |
| **98c** quantités | #127, coupée en « addition » et « boîte et barres » (reco de 98.30) | `addition`, `boite`, `barres` | Chiffre glissé au doigt (geste de 98a) ; maison de colonne de l'univers, **couleurs des colonnes communes** ; retenue qui saute ; jetons, boîte (jamais un coffre) et jauge de l'univers | 98.2, invariant 19 |
| **98d** claviers | #128 | `dictee`, `calcul`, `fluence` | Case, touche et marque du record de l'univers ; record de fluence montré pendant la fluence, sans course | 98.7, 98.9, 98.10 |
| **98e** textes qui se dévoilent | #129, à part | `lecture`, `memoriser` (écoute des vers) | Parchemin de l'univers, qui se déroule pendant la première lecture | 98.12 |

### Hors de toute tranche de #98

- Les retours de #97 : effets sonores, rebond, balancement, point qui vole, étincelles du texte complet (question 97.6), confettis, « bouton touché », leurs variantes de mouvements réduits. 98a s'appuie dessus sans les redécrire.
- Ce que fait #96 : couleur principale de l'univers, polices, jetons, boutons en relief, transitions, personnages guides, paysage. 98a utilise les jetons et la clé d'univers, sans les changer.
- Les animations des personnages guides (#106).
- Le dessin des **étiquettes** : même forme dans les 6 univers, couleur de l'univers seulement (reco de 98.27).
- Toute règle de correction : le placement reste le groupe pour `classer` ; les étiquettes mélangées restent celles du domaine (invariant 3).
- Les écrans du parent (réponse 96.13).

L'habillage par univers **n'est plus hors périmètre** (98.2 changée) : il fait la règle R4 de 98a.

## Questions ouvertes (habillage par univers)

Posées par le modèle (`docs/stories/98/domain-model.md`, « Questions ouvertes (habillage par univers) »), avec leurs options. Ces critères suivent la reco de chacune. La dernière colonne dit ce qui change dans 98a si le PO choisit une autre option.

| # | Question | Reco suivie ici | Scénarios de 98a touchés par une autre option |
|---|---|---|---|
| 98.25 | Quelle maison dessine-t-on dans chaque univers ? | **A** : maison dans un tronc d'arbre (Animaux de la forêt), petit château à une tour (Princesses et fées), petit vestiaire en forme de maison (Sports), petit commissariat sans barreaux (Police), petite caserne sans flamme, porte de garage qui se lève (Pompiers), petit opéra en forme de maison, porte à rideau (Danse) | **Aucun texte** : les scénarios ne nomment jamais l'objet dessiné, seulement « le dessin de l'univers » ; l'objet est validé sur la planche `classer-maison.png`. Seule condition : avec l'option C, l'objet choisi doit garder une **porte** qui s'ouvre et un intérieur qui s'allume, sinon R3 (« porte fermée », « la porte … s'ouvre ») et les Plans de R4 et R6 deviennent faux |
| 98.26 | Le petit train change-t-il d'objet selon l'univers ? | A : le même train, décoré par univers | Aucun dans 98a (le train sort de 98a) ; il cadre la tranche du petit train |
| 98.27 | Les étiquettes changent-elles de dessin selon l'univers ? | Non : même forme, couleur de l'univers seulement | Aucun texte ; avec l'option (petit motif dans un coin), le Plan du mode dys et les Plans 360 px et 44 px de R6 vérifieraient aussi l'étiquette décorée |
| 98.28 | Une planche par cible, une ligne par univers, une colonne par état, réponse univers par univers ? | Oui (planche `classer-maison.png` : 6 lignes × 4 colonnes : fermée, survolée, porte ouverte et allumée, « Je ne sais pas ») | Aucun scénario : c'est la validation des dessins, pas un E2E |
| 98.29 | Les captures de l'écran réel dans les 6 univers deviennent-elles des captures de référence ? | Non : 6 captures `classer` jointes à la PR, sans `@visuel` | Avec l'option, R4 gagnerait un Plan `@visuel` sur les 6 univers (6 captures de référence de `classer`) |
| 98.30 | Revoir le découpage : sortir le petit train de 98a, couper 98c en deux ? | Oui : 98a = glisser au doigt + `classer` et sa maison par univers ; le petit train dans une nouvelle tranche | **Option A** (mécanique d'abord dans le seul univers Animaux) : le Plan `@a-valider` de R4 se réduit à Animaux de la forêt, les 5 autres univers montrant un dessin commun provisoire ; le train revient dans 98a. **Option B** (garder 98a entière) : les scénarios du train (« Hors périmètre ») reviennent, R4 est fondue dans R6, et une règle « petit train de l'univers » s'ajoute aux Plans |
| 98.31 | Si les dessins d'un univers ne sont pas validés au moment de la PR, la PR attend-elle ? | Oui, elle attend les 6 univers | Avec l'option (dessin commun provisoire), le Plan `@a-valider` de R4 ne pourrait pas passer pour cet univers : la maison n'y aurait pas le dessin de l'univers |

Aucune question nouvelle (98.32 et suivantes) : l'habillage par univers ne rend incohérent aucun scénario ni aucune question déjà tranchée, sous la condition de 98.25 (une porte dans chaque maison).

## Questions tranchées

Les questions 98.1 à 98.24 ont été tranchées le 2026-10-28 (« 98# reco partout », issue #64). Le PO a ensuite répondu aux 4 questions de l'issue : **98.2 change** (« PAR UNIVERS ») ; 98.1, 98.3 et 98.10 sont **confirmées**. Les autres restent tranchées selon la reco.

### Questions du modèle (98.1 à 98.17)

Le détail et les options sont dans `docs/stories/98/domain-model.md`, « Questions tranchées ». La dernière colonne dit quels scénarios de **cette** tranche auraient changé avec une autre option (pour mémoire).

| # | Question | Reco retenue | Réponse du PO | Scénarios de 98a qu'une autre option aurait touchés |
|---|---|---|---|---|
| 98.1 | Les pistes du tableau de l'issue te plaisent-elles ? | Garder bulles, wagons, maisons, jetons, jauge, parchemin ; changer l'éclat de la bonne bulle (98.5), le feu d'artifice de la dictée (98.7), les coffres (98.6) | 2026-10-28 : reco, puis confirmée (« OK ») | Aucun dans 98a depuis que le train en sort (98.30) ; il cadre la tranche du petit train |
| 98.2 | Habillage par type, ou par univers ? | Reco d'origine : par type, le même dans tous les univers (écartée) | 2026-10-28 : reco, puis **changée : « PAR UNIVERS »** (option B) : chaque type d'exercice a un dessin différent dans chacun des 6 univers ; gestes, textes lus, signaux d'état et couleurs des colonnes de l'addition restent communs | Nouvelle règle R4 ; Plans sur les 6 univers dans R6 ; captures dans les 6 univers ; nouvelles questions 98.25 à 98.31 |
| 98.3 | Des bulles qui bougent sont-elles faciles à toucher au CP ? | Mouvement très léger, cible fixe d'au moins 44 px, immobile pendant la consigne | 2026-10-28 : reco, puis confirmée (« les bulles doivent bouger mais légèrement ») | Aucun (98b) |
| 98.4 | Le flottement vaut-il pour toutes les bulles de choix ? | Forme de bulle partout, flottement seulement pour `bulles` et `ecoute` | 2026-10-28 : reco | Aucun (98b) ; les choix de la question de `classer` en révision (Plan 98.18) prendront la forme de 98b |
| 98.5 | La bonne bulle s'efface-t-elle en douceur, sans étincelles ? | Oui | 2026-10-28 : reco | Aucun (98b) |
| 98.6 | `classer` : paniers, coffres ou maisons ? | Garder « maison », petite maison dont la porte s'ouvre et qui s'allume ; avec 98.2, une maison de chaque univers (98.25) | 2026-10-28 : reco | R3 entière, R2, R4 et R6 (toutes les étapes « maison », « porte »), et les scénarios existants listés plus haut |
| 98.7 | Dictée : case allumée quand une lettre y est écrite, sans feu d'artifice ? | Oui | 2026-10-28 : reco | Aucun (98d) |
| 98.8 | `ordre` : peut-on aussi glisser une étiquette sur le train ? | Non, toucher suffit | 2026-10-28 : reco | « Dans un ordre, essayer de glisser une étiquette ne la pose pas » s'inverserait |
| 98.9 | Les cristaux « brillent » quand on les touche ? | Éclat court, différent de la bonne réponse montrée | 2026-10-28 : reco | Aucun (98d) |
| 98.10 | Fluence comme course contre son record ; record visible pendant la fluence ? | Oui, sous trois conditions (pas le mot « course », marque « Ton record : 12 », changement de couleur seulement) | 2026-10-28 : reco, puis confirmée (« A on garde le chrono ») | Aucun (98d) |
| 98.11 | Un glisser lâché hors de toute cible revient-il sans coûter d'erreur ? | Oui : ce n'est pas une réponse | 2026-10-28 : reco | « Lâchée hors de toute maison… » (×2), « Lâcher 5 fois… ne coûte aucune étoile », exemple « lâchée hors de toute maison » du Plan des mouvements réduits |
| 98.12 | Le parchemin cache-t-il les lignes pas encore lues ? | Seulement pendant la première lecture | 2026-10-28 : reco | Aucun (98e) |
| 98.13 | L'habillage vaut-il aussi en séance de révision et au test de départ ? | Oui | 2026-10-28 : reco | Pour 98a, sans effet : les étiquettes n'y apparaissent jamais (voir 98.18) |
| 98.14 | « Habillage de jeu » : terme du domaine ou mot de cadrage ? | Mot de cadrage seulement, jamais à l'écran ni dans le domaine | 2026-10-28 : reco (la reco tient avec 98.2, voir la note du modèle) | Aucun : les scénarios ne l'emploient que dans le titre de R1, comme avant |
| 98.15 | Les flèches passent-elles d'une bulle à l'autre et d'une maison à l'autre ? | Oui pour les bulles et les maisons ; les étiquettes gardent Tab | 2026-10-28 : reco | « Au clavier, les flèches passent d'une maison à l'autre » disparaîtrait |
| 98.16 | Découpage en cinq tranches, 98a à 98e, dans cet ordre ? | Oui | 2026-10-28 : reco ; **revu par 98.30** (habillage par univers) | Voir 98.30 |
| 98.17 | Le glisser au doigt doit-il marcher sur iPad et iPhone autant que sur Android ? | Oui, prouvé sur `tablette` et `telephone` | 2026-10-28 : reco | « Glissée du doigt dans la maison « ou »… », « Sur un écran de 360 px… », et les Plans « du doigt » de R4 |

### Questions de cadrage (98.18 à 98.24)

Chacune est tranchée selon sa reco (réponse du PO du 2026-10-28) ; les options restent écrites pour mémoire.

**98.18 En séance de révision et au test de départ, une question de `classer` reste-t-elle une question à choix (« « loup » va dans quelle maison ? »), sans étiquette à glisser ?**
Les décisions 27.11 et 28.13 la rejouent en question à choix ; `ordre` et `memoriser` n'y sont jamais.
Reco : **oui**, garder la question à choix ; elle recevra la forme de bulle de 98b (et donc la bulle de l'univers). Option : rejouer l'étiquette dans les maisons, ce qui changerait le domaine de #27 et #28.
Scénario touché : Plan « <Où>, une question de classer reste une question à choix… ».
**Réponse du PO (2026-10-28) : reco.**

**98.19 Le projet Playwright `tablette` doit-il simuler un écran tactile ?**
Reco : **activer le toucher sur le projet `tablette`**, vérifié par le passage complet de non-régression. Option : un projet `tablette-tactile` réservé aux scénarios de #98.
Scénarios touchés : tous ceux qui disent « du doigt » (sur la tablette).
**Réponse du PO (2026-10-28) : reco.**

**98.20 Une maison survolée par une étiquette en train de glisser se signale-t-elle ?**
Reco : **oui, toutes de la même façon** (contour qui s'épaissit), sans couleur de réussite ni d'erreur. Avec les mouvements réduits, seul le contour change. Avec 98.2, ce signal est **commun aux 6 univers** (invariant 15). Option : rien ne se signale.
Scénario touché : « Une étiquette qui passe au-dessus d'une maison, sans être lâchée… ».
**Réponse du PO (2026-10-28) : reco.**

**98.21 Comment le petit train tient-il à 360 px ?**
Reco : **le train passe à la ligne** ; un vers par wagon, sur toute la largeur. Option : pas de train pour les vers.
Scénarios touchés : ceux du train, sortis de 98a (voir « Hors périmètre »).
**Réponse du PO (2026-10-28) : reco.** Elle cadre la tranche du petit train.

**98.22 Si 98.8 = non : que se passe-t-il quand l'enfant essaie de glisser une étiquette d'un `ordre` ?**
Reco : **l'étiquette ne se soulève pas**, rien ne bouge, aucune réponse, aucune erreur. Option : un glisser vers le train compte comme un toucher.
Scénario touché : « Dans un ordre, essayer de glisser une étiquette ne la pose pas : on la touche » (gardé dans 98a, sans le train).
**Réponse du PO (2026-10-28) : reco.**

**98.23 Avec les mouvements réduits, l'étiquette suit-elle encore le doigt pendant le glisser ?**
Reco : **oui** : c'est l'enfant qui la déplace (invariant 9). Seuls le retour en glissant et la porte qui s'ouvre disparaissent. Option : avec les mouvements réduits, seulement toucher puis toucher.
Scénario touché : « Avec les mouvements réduits, l'étiquette suit toujours le doigt de l'enfant ».
**Réponse du PO (2026-10-28) : reco.**

**98.24 Sur un téléphone, comment l'enfant glisse-t-il une étiquette jusqu'à une maison hors de l'écran ?**
Reco : **les maisons et les étiquettes à poser tiennent ensemble dans l'écran** à 360 × 740 pour un `classer` de la bibliothèque ; sinon, la page défile d'elle-même quand l'étiquette approche du bas de l'écran. Avec 98.2, c'est vrai dans les 6 univers (invariant 17). Option : l'enfant fait d'abord défiler, puis glisse.
Scénario touché : « Sur un écran de 360 px, Léa glisse du doigt une étiquette jusqu'à la dernière maison ».
**Réponse du PO (2026-10-28) : reco.**

## Termes

Aucun terme nouveau du domaine. Mots d'interface employés : maison (déjà, décision n°24), porte, s'allume, revenir en glissant, faire glisser du doigt, **dessin de l'univers** (mot de cadrage proposé par le modèle, « Termes à signaler », pas encore au glossaire : il ne nomme rien du domaine, seulement l'affichage d'une maison selon l'univers, déjà défini au glossaire). « glisser » nomme le **geste** ; la réponse reste un **Placement** ; « glisser-déposer » et « drop » restent interdits (glossaire). « Habillage de jeu » n'apparaît que dans le titre de R1 (98.14). « petit train » et « wagon » ne sont plus employés dans 98a. Les propositions de glossaire du modèle ne sont pas reportées au glossaire par ce cadrage.

## Décisions

- **2026-10-28, PO** (annonce du responsable sur l'issue #64, réponse « 98# reco partout ») : les questions 98.1 à 98.24 sont tranchées selon la reco.
- **2026-10-28, PO** : le découpage en tranches 98a à 98e est validé (98.16). #98 garde 98a ; 98b à 98e sont les issues #126 à #129.
- **2026-10-28, PO** (commentaires du responsable sur #98) : **98.2 = « PAR UNIVERS »** ; 98.1, 98.3 et 98.10 confirmées. Conséquences dans ces critères : nouvelle règle R4 (maison de l'univers), Plans sur les univers dans R6, scénarios du petit train retirés vers une nouvelle tranche (reco de 98.30, en attente), `@depend-de-97` retiré (#97 mergée). Le cadrage est **à revalider** sur 98.25 à 98.31.
- Le glossaire n'est pas modifié par ce cadrage : les propositions de la section « Termes à signaler » du modèle restent à reporter.
