# Critères d'acceptance : story #130, le petit train de l'univers (98a-train)

Historique : 2026-11-04, premier jet (`po-acceptance`), à valider par le PO avec les questions #130.1 à #130.13. 2026-11-04, réponses du PO : « 130 reco tout » ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)), toutes les recos sont retenues ; `@a-valider` retirés.

Scénarios : `features/130-petit-train-de-l-univers.feature`. Modèle : `docs/stories/130/domain-model.md` (invariants propres 1 à 5, questions #130.1 à #130.9). Cadrage parent : `docs/stories/98/acceptance.md`, « Hors périmètre, #130 » (scénarios du train validés le 2026-10-28, repris ici).

Tags :
- `@issue-130 @wip` sur la fonctionnalité (`@wip` reste jusqu'au passage des steps E2E) ;
- plus aucun `@a-valider` : les 6 scénarios écrits selon une reco sont confirmés par le PO (voir « Scénarios qui dépendaient d'une réponse du PO ») ;
- aucun `@acces` (aucune donnée nouvelle, voir « Droits d'accès ») ;
- aucun `@depend-de-…` : #97 et #98 (98a) sont mergées.

État : **validé** (questions #130.1 à #130.13 tranchées le 2026-11-04 : reco, [annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

## Objectif

En tant qu'**enfant**, je veux que les étiquettes à remettre dans l'ordre deviennent les wagons d'un petit train décoré comme mon univers, afin que reconstituer un mot, une suite de nombres ou un poème ressemble à un jeu.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : chaque bon placement se voit grandir (un wagon de plus, le train avance d'un cran) ; l'ordre reconstitué se lit d'un coup d'œil, wagon après wagon ;
- **autonomie** : l'enfant retrouve son univers (#6) jusque dans le train.

La story ne change que l'affichage : aucune règle de correction, aucune erreur, aucune étoile, aucun avancement, aucune parole, aucune donnée. Aucun garde-fou de la section 5 du skill n'est franchi : pas de coffre (98.6), pas d'étoile ni de chiffre dans un dessin (inv. 98-15 et 98-18), aucun son nouveau (ni sifflet, ni cloche qui sonne, ni bruit de roues), aucun hasard, aucune pénalité, aucun train qui recule.

Décisions déjà prises, appliquées sans les reposer : habillage par univers (98.2) ; le même train décoré par univers, « petit train » et « wagon » justes partout (98.26) ; toucher suffit, pas de glisser en `ordre` (98.8, 98.22) ; à 360 px le train passe à la ligne, un vers par wagon sur toute la largeur (98.21) ; étiquettes de même forme dans les 6 univers (98.27) ; planche (98.28), captures (98.29), PR qui attend les 6 dessins validés (98.31) ; Muet coupe seulement la voix (97.2) ; un toucher pendant une célébration ne fait rien (97.17).

**Hors séance** : ni la révision, ni le défi, ni le test de départ ne posent un `ordre` ou un `memoriser` (`posables()` et `nombreDeQuestionsAdmissibles`, modèle « Les faits du domaine suffisent ») : **aucun scénario** ne le décrit.

**Les scénarios ne lisent jamais un tracé** (skill `illustration`, section 3) : ils restent vrais quelle que soit la réponse à #130.1, #130.4, #130.6 (sauf l'immobilité au repos), #130.7, #130.8 et #130.9. Ce qui est dessiné se valide sur la planche `ordre-petit-train.png`.

## Règles (example mapping)

| # | Règle | Exemples (scénarios, n° de ligne du `.feature`) |
|---|---|---|
| R1 | Chaque bon placement accroche un wagon derrière le dernier, et le train avance d'un cran ; autant de wagons que d'étiquettes posées, dans l'ordre ; la dernière étiquette d'un `ordre` garde les étincelles de #97 ; étoiles et avancement inchangés | l.54 « Au début de l'exercice, le petit train n'a que sa tête, suivie des places libres » (#130.10) · l.61 « La bonne première étiquette « do » devient le premier wagon du petit train » · l.68 « La deuxième bonne étiquette s'accroche derrière la première » · l.76 « En avançant d'un cran, le petit train ne change pas de place sur l'écran » (#130.2) · l.85 « L'étiquette touchée rejoint sa place au bout du petit train, puis s'y accroche » (#130.3) · l.91 « À un bon placement, l'effet sonore « réponse juste » part avant que le wagon s'accroche » · l.98 « La dernière étiquette accroche le dernier wagon, puis les étincelles de #97 apparaissent » · l.107 « Une fois le wagon accroché, le petit train reste immobile jusqu'au placement suivant » (#130.6) · l.114 « Le bon premier vers devient le premier wagon du petit train » · l.121 « Le dernier vers accroche le sixième wagon, sans étincelles » · l.130 « Après le dernier vers, le petit train complet reste à l'écran pendant la félicitation » (#130.5) · l.138 Plan « Léa remet « Le mot en morceaux » dans l'ordre <geste>, sans erreur, et gagne 3 étoiles » (du doigt, clavier seulement) · l.149 Plan « Léa remet les 6 vers dans l'ordre <geste>, puis passe aux mots cachés » |
| R2 | Une mauvaise étiquette ne s'accroche pas : le train ne bouge pas, ne recule jamais, ne perd aucun wagon, même aide qu'avant ; ni un glisser, ni un toucher sur le train, ni un toucher pendant la félicitation n'accrochent un wagon | l.163 « Une mauvaise première étiquette ne s'accroche pas, et le petit train n'avance pas » · l.170 « Une mauvaise étiquette suivante ne s'accroche pas, et le petit train garde son wagon » · l.178 « À une mauvaise étiquette, l'effet sonore « réponse fausse » part, et le petit train ne bouge pas » · l.185 « Un mauvais premier vers ne s'accroche pas au petit train » · l.193 « Essayer de glisser une étiquette jusqu'au petit train ne la pose pas : on la touche » (98.8) · l.200 « Toucher le petit train ne donne aucune réponse » · l.209 « Pendant la félicitation, toucher le petit train complet ne change rien » (97.17) |
| R3 | « Je ne sais pas » ne pose rien : l'étiquette ou le vers suivant brille parmi les étiquettes à poser, le train n'avance pas, rien ne brille sur lui ; l'enfant la pose, et elle devient le wagon suivant | l.219 « « Je ne sais pas » fait briller l'étiquette « do », et le petit train n'a aucun wagon » · l.227 « Après « Je ne sais pas », l'étiquette qui brille devient le premier wagon quand Léa la pose » · l.234 « « Je ne sais pas » au milieu de l'ordre fait briller l'étiquette suivante, et le petit train garde ses wagons » · l.241 « « Je ne sais pas » dans l'ordre des vers fait briller le premier vers, sans l'accrocher » |
| R4 | 360 px : le train passe à la ligne, sans défilement horizontal, wagons de 44 px, un vers par wagon sur toute la largeur, mise en page indépendante de l'univers ; mouvements réduits : rien ne roule ; texte des wagons en mode dys et à 4,5:1 ; lecteurs d'écran inchangés ; Muet ne coupe que la voix ; aucun son nouveau | l.251 Plan « …à 360 px, le petit train de 10 wagons passe à la ligne et tient dans la largeur de l'écran » (6 univers) · l.271 « À 360 px, les wagons passés à la ligne se lisent dans l'ordre, de « 10 » à « 100 » » (#130.13) · l.280 Plan « …à 360 px, chaque vers accroché se lit en entier, dans un wagon sur toute la largeur » (6 univers) · l.298 « À 360 px, les étiquettes à poser et « Je ne sais pas » restent visibles sous le petit train » · l.306 Plan « …avec les mouvements réduits, « do » apparaît dans le premier wagon, sans que le petit train roule » (6 univers) · l.323 « Avec les mouvements réduits, le bon vers apparaît dans son wagon, sans que le petit train roule » · l.329 « Avec les mouvements réduits, l'étiquette montrée par « Je ne sais pas » brille sans bouger » · l.336 Plan « …le texte de chaque wagon se lit sur son wagon » (6 univers, 4,5:1) · l.352 « En mode dys, les étiquettes à poser et le texte des wagons s'affichent en mode dys » · l.359 « En mode dys, à 360 px, chaque vers accroché se lit en entier dans son wagon » · l.368 Plan « …les lecteurs d'écran lisent les places comme avant, sans décrire le petit train » (6 univers) · l.385 « En Muet, le wagon s'accroche de la même façon » · l.392 « Aucun effet sonore nouveau n'accompagne le petit train qui avance » |
| R5 | Le même petit train, avec le dessin de chacun des 6 univers ; changer d'univers ne change ni gestes, ni textes lus, ni erreurs, ni étoiles, ni la bonne réponse montrée ; un profil sans univers connu voit le train « Animaux de la forêt » | l.401 Plan « …le petit train d'un ordre a le dessin de cet univers » (6 univers) · l.418 Plan « …le petit train de l'ordre des vers a le dessin de cet univers » (6 univers) · l.435 Plan « …<erreurs> mauvais placement(s) dans « Le mot en morceaux » donnent <résultat>, comme avant » (0 → 3, 1 → 2, 3 → 2, 4 → 1 étoile) · l.450 Plan « …une mauvaise étiquette fait dire à <personnage guide> la même aide que dans tous les univers » (Sports, Police) · l.463 Plan « …l'étiquette montrée par « Je ne sais pas » brille comme dans tous les univers » (5 univers) · l.479 Plan « Un profil enfant <cas> voit le petit train de l'univers « Animaux de la forêt » » (sans univers, univers inconnu) |

Au total : **5 règles, 43 scénarios** (dont 13 plans de scénario, 59 exemples), soit **89 cas** par projet. Aucun ne porte `@a-valider` (les 6 qui le portaient sont confirmés le 2026-11-04).

Les Plans sur les univers suivent la sobriété de 98a et de #131 : les 6 univers là où le dessin peut changer ce qu'on vérifie (dessin, 360 px, contraste, mouvements réduits, lecteurs d'écran) ; 5 univers là où « Animaux de la forêt » sert de référence (bonne réponse montrée) ; 2 à 4 univers là où le dessin ne peut rien changer (aide lue, étoiles).

### Exemples aux bornes

| Cas | Exemple |
|---|---|
| Train vide | début de « Le mot en morceaux » : la tête seule, 3 places libres (#130.10) ; après une mauvaise première étiquette ou « Je ne sais pas » : toujours aucun wagon |
| Premier wagon | « do » ; premier vers « La Cigale, ayant chanté » |
| Dernier wagon d'un `ordre` | « no » : 3 wagons, étincelles de #97 |
| Dernier vers | « De mouche ou de vermisseau. » : 6 wagons, **pas** d'étincelles (pas un exercice complété), mots cachés après la félicitation (#130.5) |
| Plus long `ordre` de la bibliothèque | « De dix en dix », 10 wagons de « 10 » à « 100 », à 360 px |
| Wagon le plus large | un vers à 360 px, en mode dys (plusieurs lignes dans son wagon) |
| Erreurs | 0 → 3 étoiles, 1 → 2, 3 → 2, 4 → 1 (#18, #24) |

### Checklist `po-acceptance` du skill `gamification`

- besoin nourri : compétence et autonomie (ci-dessus) ;
- déclencheur métier de chaque retour : le **bon placement** (accroche et cran d'avance), l'**exercice complété** (étincelles de #97, `ordre` seulement), la **bonne réponse montrée** (l'étiquette qui brille) ; aucune récompense nouvelle ; le dessin de l'univers n'est déclenché par rien ;
- retour après une erreur : R2 (encouragement et aide de #18 et #22, le train ne bouge pas, ne recule pas) ;
- mouvements réduits : R4, l'information reste (le wagon est là, l'étiquette brille), dans chaque univers ;
- aucun garde-fou franchi : pas de coffre, pas d'étoile ni de chiffre dessinés, aucun son nouveau, rien qui roule au repos (#130.6).

### Droits d'accès

La story ne crée, ne lit et n'enregistre aucune donnée nouvelle : **pas de scénario `@acces`**. L'univers est lu sur le profil enfant en cours (#6, #96). Les séances terminées restent enregistrées comme aujourd'hui (#24), par un parent rattaché seulement. Les écrans du parent ne montrent pas de petit train.

## Scénarios qui dépendaient d'une réponse du PO

Le PO a retenu la reco de chaque question le 2026-11-04 ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)) : les scénarios ci-dessous sont gardés tels quels, sans `@a-valider`. La colonne « Si le PO choisit autrement » est gardée pour mémoire.

| Question | Scénarios (écrits selon la reco, confirmés) | Si le PO choisit autrement |
|---|---|---|
| #130.1 (Police : écusson rond) · #130.4 (Princesses : cheminée en couronne) · #130.7 (pas de visage) | Aucun : planche seulement. « rien ne brille sur le petit train » (l.219, l.463) reste vrai avec toute réponse | Option D de #130.1 ou « garder l'étoile » de #130.4 : l.463 reste vrai (une étoile fixe ne brille pas), mais la review vérifiera qu'elle ne ressemble pas au signal |
| #130.2 (A : à-coup, puis retour à sa place) | l.76 « En avançant d'un cran, le petit train ne change pas de place sur l'écran » | B (le train se déplace d'une longueur de wagon) : l.76 est inversé et les Plans 360 px (l.251, l.280) sont à revoir |
| #130.3 (chemin de l'étiquette vers son wagon) | l.85 « L'étiquette touchée rejoint sa place au bout du petit train, puis s'y accroche » | Pas de chemin : l.85 devient « …l'étiquette « do » quitte les étiquettes à poser et apparaît dans le premier wagon » |
| #130.5 (A : train complet gardé pendant la félicitation) | l.130 « Après le dernier vers, le petit train complet reste à l'écran pendant la félicitation » | B : l.130 est retiré ; l.121 (« 6 wagons, sans étincelles ») ne se voit plus : il devient « …Léa voit les vers joints par « / » » |
| #130.6 (pas de fumée) | l.107 « Une fois le wagon accroché, le petit train reste immobile jusqu'au placement suivant » | Option nuages immobiles : l.107 reste vrai ; toute fumée animée : l.107 est retiré |
| #130.8 (planche à 5 colonnes) · #130.9 (12 captures) | Aucun : planche et PR | — |
| #130.10 (places libres visibles) | l.54 ; le Plan l.368 (« 2 fois « place libre » ») | Non : l.54 devient « …n'a que sa tête » ; l.368 change ce que lisent les lecteurs d'écran (contraire à inv. 98-11), à éviter |
| #130.13 (tête à gauche, lecture de gauche à droite) | l.271 « À 360 px, les wagons passés à la ligne se lisent dans l'ordre, de « 10 » à « 100 » » | B : l.271 dit « …de droite à gauche » : contraire à l'ordre de lecture des lecteurs d'écran, à éviter |

## Questions ouvertes

Aucune.

## Décisions

Les questions #130.1 à #130.9 sont dans `docs/stories/130/domain-model.md` (section « Décisions »), toutes tranchées le 2026-11-04 : reco. Questions de ce cadrage :

**#130.10 Les places libres restent-elles visibles à la suite du petit train ?**
Exemple : Léa commence « Le mot en morceaux ». A (reco), elle voit la tête du train suivie de 3 places libres en pointillés ; chaque bon placement remplace la première place libre par un wagon. B, elle ne voit que la tête ; les wagons apparaissent un par un.
Reco : **A**. Les lecteurs d'écran lisent aujourd'hui « place libre » pour chaque place vide (inv. 98-11 : inchangé) ; l'enfant voit combien il en reste ; la mise en page ne saute pas à chaque wagon. Une place libre n'est pas dessinée comme un wagon (risque 2 du modèle). Scénarios : l.54, l.368.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.11 Une leçon personnelle avec « Dans l'ordre » (#39) a-t-elle besoin d'un scénario dédié ?**
L'invariant 98-12 vaut pour toute leçon jouée en séance, leçon personnelle comprise ; le composant est le même.
Reco : **non**. Le cas se vérifie en review (même composant, aucune condition sur l'origine de la leçon) ; un scénario demanderait un vrai compte parent et un texte documentaire, pour un risque nul. Option : un scénario « Dans une leçon personnelle, les phrases remises dans l'ordre deviennent les wagons du petit train ».
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.12 À 360 px, dans l'ordre des vers, la tête du train est-elle seule sur sa ligne, devant le premier vers ?**
Un vers occupe un wagon sur toute la largeur (98.21) : il ne tient pas à côté de la tête.
Reco : **oui**, la tête reste en tête de la première ligne, à sa taille ; le premier vers passe à la ligne suivante, sur toute la largeur. Option : la tête rapetisse et se pose au-dessus du premier wagon. Aucun scénario n'en dépend (planche, colonne 5 de #130.8).
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.13 Dans quel sens roule le petit train ?**
A (reco) : la tête à gauche de la première ligne ; les wagons suivent vers la droite, puis à la ligne, dans l'ordre de lecture ; le cran d'avance pousse vers la gauche. B : la tête à droite, comme un train qui roule vers la droite ; les wagons se liraient alors de droite à gauche.
Reco : **A**. L'enfant lit le mot ou le poème dans l'ordre de lecture, et les lecteurs d'écran lisent la liste dans le même ordre (risque 5 du modèle). Scénario : l.271.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

## Hors périmètre

- La **révision**, le **défi** et le **test de départ** : aucun `ordre` ni `memoriser` (voir plus haut).
- Le **déroulement du texte** de `memoriser` (temps « écoute » et « redire » : parchemin de #129) et les **mots cachés** (#126 pour le mot qui rejoint son trou).
- Le **glisser** d'une étiquette en `ordre` : refusé (98.8) ; seul un scénario vérifie qu'il ne pose rien (l.193).
- Toute nouvelle **parole** ou nouveau texte lu : consigne, Indication du geste « Touche d'abord celle qui vient en premier. », aides « Ce n'est pas le début. Lequel vient en premier ? » / « Pas encore celui-là. Lequel vient juste après ? », félicitations : inchangés.
- Tout **effet sonore** nouveau (sifflet, cloche, roues) : seuls les retours de #97 existent.
- Le choix de **ce qui est dessiné** (objets, matières, teintes) : planche `docs/stories/130/planches/ordre-petit-train.png`, validée par le PO univers par univers (98.28) ; les 12 captures de la PR (#130.9).
- Les **étiquettes à poser** : même forme dans les 6 univers (98.27), non redessinées.

## Scénarios existants

**Aucun texte de scénario existant ne change.** Doivent rester verts : #18 (« prend la première place », « revient parmi les étiquettes à poser », Tom et les étiquettes en double), #22 (ordre des vers, « le vers prend la troisième place », passage aux mots cachés), #23 (exemple `ordre` : « l'étiquette qui vient ensuite brille »), #79 (consigne visible, « l'étiquette « do » reste à la première place »), #97 (étincelles de la dernière étiquette d'un `ordre`, pas d'étincelles avant), et le scénario de 98a « Dans un ordre, essayer de glisser une étiquette ne la pose pas : on la touche » (« aucune place n'est remplie »).

Attention avec #130.5 = A : le passage aux mots cachés attend la fin de la félicitation. Les étapes de #22 et #126 qui attendent les mots cachés (« l'entraînement des mots cachés commence », « Léa voit les vers joints par « / » ») doivent attendre ce passage sans changer de phrase.

## Précisions pour les étapes (pour `e2e-tester`)

- **Séances complètes (délais longs)** : l.138 (Plan, 2 exemples) et l.435 (Plan, 4 exemples) jouent l'exercice jusqu'à ses étoiles : **ajouter `@issue-130` au `Before` de `features/steps/delais.steps.ts`**. l.130 et l.149 attendent aussi la félicitation puis les mots cachés.
- **Projets** : tous les scénarios tournent sur `tablette` et `telephone` (mise au point sur `telephone`, décision 0020).
- **Petit train et wagons** : un wagon est une place remplie (`data-testid="place"` avec `data-remplie`), dans `data-testid="places"` (« Ordre des étiquettes ») ; « le petit train n'a aucun wagon » = aucune place remplie ; « le petit train a 2 wagons, « do » puis « mi » » lit le texte des places remplies dans l'ordre du DOM. La tête est un élément à part, `aria-hidden`.
- **Dessin de l'univers** : « la tête du petit train et ses wagons ont le dessin de l'univers « … » » se vérifie par un attribut `data-univers` (clé : `animaux`, `princesse`, `sports`, `police`, `pompier`, `danse`) sur la tête et chaque wagon, **jamais par un tracé**.
- **Accroche, cran, chemin** : vérifier qu'un mouvement a lieu (attribut d'état posé par le code, par exemple `data-etat="accroche"`, ou l'enregistreur d'animations de 98a), jamais une durée. « …commence avant que le wagon « do » s'accroche » compare le début de l'effet sonore au début de l'accroche, comme les étapes d'ordre de #97, #127 et #131. « ensuite, la tête du petit train et le wagon « do » sont à la même place qu'avant » compare leurs boîtes englobantes avant le placement et après la fin du mouvement. « plus rien ne bouge sur le petit train… » : aucune animation en cours sur le train après l'accroche.
- **Mouvements réduits** : « « do » apparaît dans le premier wagon, sans que le petit train roule » : aucune animation ni transition sur la tête et les wagons. « ni l'étiquette « do » ni le petit train ne bougent » : idem, plus l'étiquette qui brille.
- **Brille** : « l'étiquette « do » brille parmi les étiquettes à poser » lit `data-brille="true"` sur l'étiquette à poser (signal commun de 98a) ; « rien ne brille sur le petit train » : aucun `data-brille` sur la tête ni sur une place. « elle brille de la même façon que dans l'univers « Animaux de la forêt » » : étape de 98a, à ouvrir à `@issue-130`.
- **Toucher** : « Léa touche le petit train » est un vrai toucher sur la tête (cible non interactive) ; « …pendant la félicitation » : pendant que la bulle a `data-nature="felicitation"`.
- **360 px** : « la page tient dans la largeur de l'écran » (étape existante) ; « chaque wagon mesure au moins 44 px de haut et de large » ; « le petit train passe à la ligne » : les places remplies sont sur au moins deux lignes ; « …dans un wagon sur toute la largeur du petit train » : la largeur du wagon d'un vers est celle de la ligne du train ; « se lit en entier » : aucun texte coupé ni masqué (`scrollWidth` ≤ `clientWidth`, aucune ellipse). « …se voient sans faire défiler l'écran de côté » : visibles dans la largeur de la fenêtre.
- **Contraste** : « le texte de chaque wagon se détache de son wagon avec un contraste d'au moins 4,5:1 » calcule le contraste entre la couleur du texte et celle du fond uni du centre du wagon (couleurs calculées).
- **Mode dys** : les textes des wagons et des étiquettes sont des textes (pas un tracé), en police Andika, espacés.
- **Lecteurs d'écran** : « les lecteurs d'écran lisent la liste « Ordre des étiquettes » : « do », puis 2 fois « place libre » » lit l'arbre d'accessibilité de la liste ; tête, roues et décor `aria-hidden`.
- **Muet** : l'étape « la tablette est en Muet » de #7 ; l'effet sonore « réponse juste » reste (97.2).
- **Données de test** : prénoms fictifs déjà employés (Léa, Paul), leçons de la bibliothèque déjà employées, aucune donnée réelle.

### Étapes nouvelles (à écrire, ou à généraliser depuis une étape voisine)

- « Léa voit le petit train, sans aucun wagon, suivi de <n> places libres »
- « le petit train avance d'un cran, avec « … » dans le premier wagon » / « …dans le deuxième wagon »
- « le petit train a <n> wagons, « … » puis « … » » (et la variante à trois, « …, « … » puis « … » »)
- « le petit train a 6 wagons, de « … » à « … » »
- « le petit train a toujours <n> wagon(s), … »
- « le petit train n'a aucun wagon » ; « le petit train ne bouge pas »
- « ensuite, la tête du petit train et le wagon « … » sont à la même place qu'avant »
- « l'étiquette « … » rejoint le bout du petit train, puis s'y accroche comme premier wagon »
- « l'étiquette « … » n'est plus parmi les étiquettes à poser »
- « l'effet sonore « réponse juste » commence avant que le wagon « … » s'accroche »
- « ensuite, plus rien ne bouge sur le petit train tant que Léa ne pose pas d'autre étiquette »
- « le vers « … » devient le premier wagon du petit train » ; « le vers se lit en entier dans son wagon »
- « Léa a remis en place les <quatre|cinq> premiers vers » (généraliser « les deux premiers vers » de #22)
- « Léa voit le petit train de 6 wagons pendant que Noisette dit une félicitation » ; « ensuite seulement, Léa voit les vers joints par « / », avec un trou dans chaque vers »
- « Léa pose les étiquettes « do », « mi » puis « no » <du doigt|au clavier seulement> » ; « Léa remet les 6 vers dans l'ordre <du doigt|au clavier seulement> »
- « Léa essaie de faire glisser du doigt l'étiquette « … » jusqu'au petit train »
- « Léa touche le petit train » ; « Léa touche le petit train pendant la félicitation »
- « l'étiquette « … » brille parmi les étiquettes à poser » ; « le vers « … » brille parmi les vers à poser » ; « rien ne brille sur le petit train » ; « plus aucune étiquette ne brille »
- « Léa a posé les étiquettes de « 10 » à « … » » ; « le petit train passe à la ligne » ; « chaque wagon mesure au moins 44 px de haut et de large » ; « ses 10 wagons se lisent dans l'ordre, de « 10 » à « 100 », de gauche à droite puis ligne après ligne »
- « chaque vers posé se lit en entier, dans un wagon sur toute la largeur du petit train »
- « le petit train, les étiquettes à poser et « Je ne sais pas » se voient sans faire défiler l'écran de côté »
- « « … » apparaît dans le premier wagon, sans que le petit train roule » ; « ni l'étiquette « … » ni le petit train ne bougent »
- « le texte de chaque wagon se détache de son wagon avec un contraste d'au moins 4,5:1 »
- « Léa voit les étiquettes à poser et le texte des wagons en mode dys : … » ; « Léa voit les vers posés en mode dys : … »
- « les lecteurs d'écran lisent la liste « Ordre des étiquettes » : « … », puis <n> fois « place libre » » ; « les lecteurs d'écran n'annoncent ni la tête du petit train, ni ses roues, ni son décor, ni l'univers du dessin »
- « Léa n'entend aucun autre effet sonore pendant que le petit train avance »
- « la tête du petit train et ses wagons ont le dessin de l'univers « … » »

Étapes existantes à ouvrir à `@issue-130` (listes de tags) : profil préparé dans un univers, « Léa a choisi l'univers … », profils sans univers ou à l'univers inconnu, « Léa a dit « Je ne sais pas » », « elle brille de la même façon… », « (Coach Léo|Agent Max…) dit un encouragement, suivi de … » (`exercices-comme-des-jeux.steps.ts`, conflit attendu avec #129, voir le modèle) ; « Léa a répondu faux <n> fois à la première question », « Léa termine l'exercice sans autre erreur » (#127, #131) ; « Noisette dit une félicitation commune ou l'une de ses expressions, en entier » (#126).

## Termes

Aucun terme nouveau du domaine. Mots d'interface employés : **petit train**, **wagon**, **tête du petit train**, s'accrocher, avancer d'un cran, rouler, place libre, dessin de l'univers (98, « Termes à signaler » ; comme « maison »). Ils ne vont pas au glossaire : le domaine dit **Placement** et **la place suivante**. « Étoile » n'apparaît que pour les étoiles gagnées ; « note » seul n'est jamais employé.
