# Critères d'acceptance : story #131, boîte à jetons et schéma en barres de l'univers (98c-boîte et barres)

Historique : 2026-11-03 08:00 UTC, cadrage validé par le PO (« 131 reco tout », annonces [Responsable] 6598437358 sur #64 et 6598436875 sur #131).

Scénarios : `features/131-boite-et-barres-de-l-univers.feature`. Modèle : `docs/stories/131/domain-model.md` (invariants propres 1 à 13, questions #131.1 à #131.11).

Tags :
- `@issue-131 @wip` sur la fonctionnalité (`@wip` reste jusqu'au passage des steps E2E, convention du projet : il n'exclut aucun scénario des runs) ;
- plus aucun `@a-valider` : les 11 scénarios qui suivaient la reco d'une question (#131.3, #131.4, #131.5, #131.6, #131.7, #131.8, #131.10, #131.12, #131.13) gardent leur texte ; leur commentaire « Question 131.n » dit maintenant que la question est tranchée (reco retenue) ;
- aucun `@acces` (aucune donnée nouvelle, voir « Droits d'accès ») ;
- aucun `@depend-de-…` : #97, #98 (98a) et #127 sont mergées.

État : **cadrage validé** (2026-11-03 : reco retenue pour les questions #131.1 à #131.13, voir « Décisions »).

## Objectif

En tant qu'**enfant**, je veux voir les jetons tomber dans la boîte et les barres se remplir comme une jauge, aux couleurs et au dessin de mon univers, afin que les quantités ressemblent à un jeu.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : la quantité se voit arriver (les jetons tombent dans la boîte, rangés par 5 ; les jetons retirés s'en vont sans disparaître), la valeur cherchée reste visiblement « vide » jusqu'à ce que l'enfant la trouve, puis sa barre se remplit : la réussite se voit sur le schéma ;
- **autonomie** : l'enfant retrouve son univers (#6) jusque dans la boîte et le schéma.

La story ne change que l'affichage : aucune règle de correction, aucune erreur, aucune étoile, aucun avancement, aucune parole du personnage guide, aucune donnée. Elle ne franchit aucun garde-fou de la section 5 du skill : la boîte n'est jamais un coffre (98.6), aucun jeton ne ressemble à de l'argent, à une étoile ou à une bulle de choix, aucun hasard, aucune pénalité, aucun son nouveau.

Décisions déjà prises, appliquées sans les reposer : habillage par univers dans les 6 univers (98.2) ; jamais un coffre (98.6) ; mêmes erreurs, avancement et étoiles qu'avant ; retours de #97 d'abord ; même habillage en séance et en séance de révision ; 360 px sans défilement horizontal, mode dys, lecteurs d'écran inchangés ; Muet coupe seulement la voix (97.2) ; un toucher pendant une célébration ne fait rien (97.17) ; mouvements réduits : jetons posés et barres pleines tout de suite ; l'habillage ne donne jamais la réponse (la barre « ? » garde son « ? » et reste vide jusqu'à la bonne réponse, même après une erreur, « Je ne sais pas » ou « Réécouter ») ; planches et captures (98.28, 98.29, 98.31).

**Test de départ** : il ne pose jamais de boîte à jetons ni de schéma en barres (`nombreDeQuestionsAdmissibles` renvoie 0 pour `boite` et `barres`, invariant propre 11). Il n'y a rien à y habiller : **aucun scénario** ne le décrit (un scénario y serait impossible à jouer).

**Les scénarios ne lisent jamais un tracé** (skill `illustration`, section 3) : ils restent vrais quelle que soit la réponse à #131.1 (objets de la boîte, du jeton et de la jauge), #131.2 (jeton seul ou pastille) et #131.11 (captures). Ce qui est dessiné se valide sur les planches, pas par un scénario. En particulier « jamais un coffre », « jeton ni doré ni métallique » et « jauge sans graduation » (invariants propres 2, 4 et 6) se vérifient sur les planches et en review.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Pour les mêmes réponses, l'habillage ne change rien : mêmes erreurs, même avancement, mêmes étoiles ; ni les jetons, ni la boîte, ni les barres ne sont des cibles ; même habillage en séance et en séance de révision | Plan « Dans l'univers « <univers> », <erreurs> erreur(s) à l'exercice « <exercice> » donnent <résultat>, comme avant » : 5 exemples (les 5 exercices de boîte et de barres du CP, 0 → 3, 1 → 2, 3 → 2) · « Une boîte à jetons réussie fait avancer la séance comme avant » · « Toucher la boîte fermée ne donne aucune réponse » · « Toucher une barre du schéma ne donne aucune réponse » · « Pendant la félicitation, toucher la boîte ouverte ne change rien » (97.17) · Plan « En séance de révision, <objet> a le dessin de l'univers « <univers> », comme en séance » : boîte (Pompiers), schéma (Danse) · « En séance de révision, la barre « ? » reste vide jusqu'à la bonne réponse, comme en séance » |
| R2 | Boîte à jetons : les jetons qui entrent tombent avec un petit rebond, ceux qui sortent s'en vont en douceur ; nombre et rangées de 5 inchangés ; la boîte fermée ne laisse rien deviner ; à la bonne réponse, la boîte s'ouvre après les retours de #97 | « Les 3 jetons ajoutés tombent dans la boîte, à part des 4 premiers » · « Les 4 premiers jetons tombent aussi dans la boîte » (#131.5) · « Les jetons ajoutés tombent ensemble, pas un par un » (#131.4) · « Les 3 jetons retirés s'en vont en douceur, sans disparaître d'un coup » · « Les jetons retirés restent visibles, pâles, à leur place, jusqu'à la fermeture de la boîte » (#131.6) · « En Muet, les jetons ajoutés tombent de la même façon » · Plan « Avec <jetons> jetons dedans, la boîte fermée ne laisse voir aucun jeton et garde sa taille » : 7, 20 · « À la bonne réponse, la boîte s'ouvre sur ses jetons, qui ne tombent pas de nouveau » (#131.7) · « À la bonne réponse, l'effet sonore « réponse juste » part avant que la boîte s'ouvre » |
| R3 | Schéma en barres : les barres connues se remplissent comme une jauge jusqu'au bout de leur barre ; la barre « ? » garde son « ? » et reste vide jusqu'à la bonne réponse de l'enfant (même après une erreur, « Je ne sais pas », « Réécouter ») ; elle se remplit après les retours de #97 ; l'habillage ne donne jamais la réponse | « Les barres de 4 et de 2 se remplissent comme une jauge, et la barre « ? » reste vide » · « Les barres connues se remplissent quand Noisette commence à expliquer le schéma, pas pendant l'énoncé du problème » (#131.8) · « Réécouter la question ne vide pas les barres déjà remplies » (#131.8) · « En Muet, les barres connues se remplissent aussi, et la barre « ? » reste vide » · « À la bonne réponse, le « ? » devient 3 et sa barre se remplit comme une jauge » · « À la bonne réponse, l'effet sonore « réponse juste » part avant que la barre « ? » se remplisse » · Plan « <Cas>, la barre « ? » reste vide et ne montre pas la réponse » : erreur, « Je ne sais pas », « Réécouter » · « Après « Je ne sais pas », la barre « ? » se remplit seulement quand Léa donne elle-même la réponse » · « En se remplissant, la barre « ? » garde la largeur qu'elle avait avant la réponse » (#131.10) · « Dans une comparaison, l'écart connu reste en pointillés, sans jauge » · « Quand l'écart est la valeur cherchée, il reçoit la réponse et reste en pointillés » (#131.12) · « Quand le nombre de parts est la valeur cherchée, les 6 parts apparaissent remplies à la bonne réponse » (#131.13) |
| R4 | Dans chacun des 6 univers, la boîte, les jetons et la jauge ont le dessin de cet univers ; changer d'univers ne change ni le nombre de jetons, ni leurs rangées, ni la taille des barres, ni les textes lus, ni les étoiles, ni la bonne réponse montrée ; un profil sans univers connu voit les dessins de « Animaux de la forêt » | Plan « …la boîte fermée a le dessin de cet univers et ne laisse voir aucun jeton » : 6 univers · Plan « …la boîte ouverte et ses jetons ont le dessin de cet univers, rangés par 5 » : 6 univers · Plan « …le cinquième jeton de chaque rangée porte la même marque que dans tous les univers » : 5 univers (#131.3) · Plan « …les barres ont la jauge de cet univers, et le tout garde une teinte à lui » : 6 univers (invariant propre 3) · Plan « …avant la bonne réponse, la barre « ? » reste vide comme dans tous les univers » : 5 univers · Plan « …après une erreur, <personnage guide> dit la même aide que dans tous les univers » : Sports (boîte), Police (schéma) · Plan « …« Je ne sais pas » montre la bonne réponse comme dans tous les univers, sans ouvrir la boîte » : Princesses et fées, Pompiers · Plan « Un profil enfant <cas> voit <objet> de l'univers « Animaux de la forêt » » : 4 exemples (sans univers, univers inconnu × boîte, jauge) |
| R5 | Mouvements réduits : rien ne tombe ni ne se remplit progressivement, l'information reste ; 360 px dans les 6 univers ; nombres des barres lisibles (4,5:1) et en mode dys ; lecteurs d'écran inchangés ; aucun mouvement ne fait de bruit | Plan « …avec les mouvements réduits, la boîte s'ouvre sur ses 7 jetons, sans mouvement » : 6 univers · « Avec les mouvements réduits, les jetons ajoutés sont posés dans la boîte, sans tomber » · « Avec les mouvements réduits, les jetons retirés sont pâles à leur place, sans bouger » (#131.6) · Plan « …avec les mouvements réduits, les barres connues sont pleines dès l'affichage et la barre « ? » vide » : 6 univers · « Avec les mouvements réduits, à la bonne réponse, la barre « ? » est pleine d'un coup » · Plan « …la boîte fermée, les choix et « Je ne sais pas » tiennent dans un écran de 360 px » : 6 univers · Plan « …la boîte ouverte avec 20 jetons tient dans la largeur d'un écran de 360 px » : 6 univers · Plan « …le schéma d'une comparaison tient dans un écran de 360 px et reste proportionnel » : 6 univers · Plan « …chaque nombre écrit sur une barre pleine se lit sur sa jauge » : 6 univers · « En mode dys, les nombres écrits sur les barres s'affichent en mode dys » · Plan « …les lecteurs d'écran annoncent la boîte ouverte comme avant, sans décrire son dessin » : 6 univers · Plan « …les lecteurs d'écran lisent le schéma résolu comme avant, sans décrire la jauge » : 6 univers · Plan « Aucun effet sonore n'accompagne <le mouvement> » : chute, sortie, remplissage (invariant propre 9) |

Au total : **5 règles, 49 scénarios** (dont 21 plans de scénario, 99 exemples), soit **127 cas** joués par projet. Aucun ne porte `@a-valider` (les 11 qui le portaient, soit 15 cas, sont confirmés par le PO le 2026-11-03).

Les Plans sur les univers suivent la sobriété de 98a et de #127 : les 6 univers là où le dessin peut changer ce qu'on vérifie (dessin, teintes, 360 px, contraste, mouvements réduits, lecteurs d'écran) ; 5 univers là où « Animaux de la forêt » sert de référence (marque du cinquième jeton, barre « ? » vide) ; 2 univers là où le dessin ne peut rien changer (aide lue, bonne réponse montrée, révision).

### Exemples aux bornes

| Cas | Exemple |
|---|---|
| Jetons ajoutés | 4 + 3 : une rangée de 4, puis à part une rangée de 3 qui tombe ; boîte ouverte : 7 jetons, une rangée de 5 et une de 2 |
| Jetons retirés | 8 − 3 : les 3 derniers s'en vont en douceur ; il en reste 5 (avec #131.6 = A : 5 jetons et 3 jetons pâles) |
| Rangées pleines | 6 + 4 : 10 jetons, 2 rangées de 5, cinquième de chaque rangée marqué (#131.3) |
| Plus grande boîte ouverte avec des choix au CP | 12 + 8 : 20 jetons, 4 rangées, à 360 px |
| Boîte fermée | 7 ou 20 jetons dedans : aucun jeton visible, même taille |
| Valeur cherchée : le tout | « Au marché… » : barres de 4 et de 2 pleines, tout « ? » vide ; réponse 6 |
| Valeur cherchée : une partie | « Lina a 9 crayons… » : barre « ? » vide ; 5 (erreur), « Je ne sais pas », « Réécouter » : toujours vide ; 3 : remplie |
| Valeur cherchée : l'écart | « Léo a 37 billes… » : l'écart reçoit 6 et reste en pointillés (#131.12) |
| Valeur cherchée : le nombre de parts | « Il y a 18 élèves… » : 6 parts, remplies à la bonne réponse (#131.13) |
| Écart connu | « Sam a 9 ans… » : barre de 9 pleine, écart de 4 en pointillés, « ? » vide |
| Plus grand écart de taille à l'écran | comparaison 37 / 43 à 360 px, proportions gardées |

### Checklist `po-acceptance` du skill `gamification`

- besoin nourri : compétence et autonomie (ci-dessus) ;
- déclencheur métier de chaque retour : une **phrase du déroulé** dite (jetons qui tombent ou s'en vont), la **boîte ouverte** fournie par le domaine après la bonne réponse (le couvercle s'ouvre), le **schéma résolu** fourni par le domaine après la bonne réponse (la barre « ? » se remplit), l'explication du schéma (barres connues, #131.8) ; aucune récompense nouvelle ; le dessin de l'univers n'est déclenché par rien ;
- retour après une erreur : R1 et R4 (encouragement et aide de #21, boîte fermée, barre « ? » vide), R3 (Plan « <Cas>… ») ;
- mouvements réduits : R5, l'information reste (jetons posés, sortants pâles, barres pleines, barre « ? » vide puis pleine d'un coup), dans chaque univers ;
- aucun garde-fou franchi : pas de coffre, pas de jeton qui ressemble à de l'argent, à une étoile ou à une bulle de choix ; aucun son nouveau (aucun tintement).

### Droits d'accès

La story ne crée, ne lit et n'enregistre aucune donnée nouvelle : **pas de scénario `@acces`**. L'univers est lu sur le profil enfant en cours (#6, #96). Les séances terminées et la file de révision restent enregistrées comme aujourd'hui (#24, #28), par un parent rattaché seulement. Les écrans du parent ne montrent ni boîte ni schéma.

## Scénarios qui dépendaient d'une réponse du PO (anciens `@a-valider`)

**Tableau caduc depuis le 2026-11-03** : le PO a retenu la reco partout, les scénarios restent tels qu'écrits ; la colonne « Si le PO choisit autrement » n'a plus d'objet, gardée pour l'historique.

| Question | Scénarios (écrits selon la reco, confirmés) | Si le PO choisit autrement (caduc) |
|---|---|---|
| #131.3 (marque du cinquième jeton commune aux 6 univers) | Plan « …le cinquième jeton de chaque rangée porte la même marque que dans tous les univers » (5 exemples) | Non : le Plan est retiré ; le scénario de #21 « rangés par 5 » reste vrai |
| #131.4 (tous ensemble, rangée par rangée) | « Les jetons ajoutés tombent ensemble, pas un par un » | Un par un : le scénario devient « …tombent l'un après l'autre » (et la durée de 400 ms est à revoir) |
| #131.5 (les premiers jetons tombent aussi) | « Les 4 premiers jetons tombent aussi dans la boîte » | Non : remplacé par « …les 4 premiers jetons apparaissent dans la boîte, sans tomber » |
| #131.6 (A : sortants pâles à leur place) | « Les jetons retirés restent visibles, pâles, à leur place, jusqu'à la fermeture de la boîte » ; « Avec les mouvements réduits, les jetons retirés sont pâles à leur place, sans bouger » | B : « …les 3 jetons retirés quittent la boîte et s'effacent ; Léa voit 5 jetons » ; avec mouvements réduits « …disparaissent sans mouvement » |
| #131.7 (pas de chute à l'ouverture) | « À la bonne réponse, la boîte s'ouvre sur ses jetons, qui ne tombent pas de nouveau » | Oui à une chute : le scénario est inversé |
| #131.8 (A : au début de l'explication du schéma, « Réécouter » ne vide pas) | « Les barres connues se remplissent quand Noisette commence à expliquer le schéma, pas pendant l'énoncé du problème » ; « Réécouter la question ne vide pas les barres déjà remplies » | B : « …se remplissent dès l'affichage du schéma » ; C : « …l'une après l'autre ». Les scénarios sans `@a-valider` (« …se remplissent comme une jauge », Muet) restent vrais avec A, B et C |
| #131.10 (la barre « ? » garde sa taille proportionnelle) | « En se remplissant, la barre « ? » garde la largeur qu'elle avait avant la réponse » | Non : ce n'est plus de l'affichage seul (`dessin-du-schema.ts` et un scénario de #21 changent) ; story à part |
| #131.12 (écart cherché en pointillés) | « Quand l'écart est la valeur cherchée, il reçoit la réponse et reste en pointillés » | B : « …l'écart de 6 se remplit de la jauge » |
| #131.13 (parts cherchées remplies d'un coup) | « Quand le nombre de parts est la valeur cherchée, les 6 parts apparaissent remplies à la bonne réponse » | B : « …les 6 parts apparaissent vides, puis se remplissent comme une jauge » |

**#131.9** (barre « ? » vide, contour en pointillés, puis remplie après le rebond) : la règle du PO transmise avec la demande (« la barre « ? » garde son « ? » et reste vide jusqu'à la bonne réponse ») correspond à la reco A. Les scénarios concernés étaient écrits **sans** `@a-valider` ; le cadrage validé le 2026-11-03 confirme #131.9 = A.

> Précisé par la planche validée (P6, 2026-11-03 11:05 UTC) : le décor des bouts suit l'univers, en pointillés. Tout le reste est pareil dans les 6 univers : vide, contour en pointillés, « ? », largeur, aucune jauge. Le plan « …se voit de la même façon que dans l'univers « Animaux de la forêt » » compare le contour, le fond, la couleur du texte, l'opacité, la taille, le texte et l'absence de jauge, pas le décor des bouts : il reste vrai.

## Hors périmètre

- Les **bulles de choix** du mode par choix (#126) et le **clavier de cristaux** (#128), même dans la boîte et le schéma : on y répond comme dans #21 (« Léa répond « 7 » »), quel que soit leur dessin. Aucun scénario ne décrit leur dessin.
- Le **test de départ** : il ne pose ni boîte ni schéma (voir plus haut).
- Toute nouvelle **parole** ou nouveau texte lu : « Je mets 4 jetons dans la boîte. », « On ouvre la boîte pour vérifier… », « Regarde le schéma : le point d'interrogation, c'est ce qu'on cherche. » et les libellés lus (« Boîte fermée », « Boîte ouverte : 7 jetons », description du schéma) ne changent pas.
- Tout **effet sonore** nouveau (chute, ouverture, remplissage) : seuls les retours de #97 existent.
- Le choix de **ce qui est dessiné** (objets, matière, teintes, pastille ou objet seul) : planches `docs/stories/131/planches/`, validées par le PO univers par univers (98.28).
- La **fin de séance** (#106), l'addition posée (#127), les autres tranches de #98.

## Scénarios existants

**Aucun texte de scénario existant ne change.** Les scénarios de `features/21-boite-et-barres.feature` restent verts sans changement, en particulier « Des jetons entrent dans la boîte, puis elle se ferme » (« Léa ne voit plus les jetons »), « La bonne réponse … ouvre la boîte » (« rangés par 5 »), « Après une erreur … » (« la boîte reste fermée »), « le « ? » du schéma est remplacé par … », la description aux lecteurs d'écran, « Avec les mouvements réduits, la boîte s'ouvre sans animation » et « La boîte et le schéma tiennent dans un écran de 360 px de large ». Les exemples `boite` et `barres` du Plan de `features/23-aide-et-je-ne-sais-pas.feature` aussi.

Étapes (code de `features/steps/`) à surveiller :

| Fichier | Ce qui peut changer |
|---|---|
| `boite-et-barres.steps.ts` | Toutes ses étapes sont gardées par `{ tags: "@issue-21" }` : à ouvrir à `@issue-131`. « Léa voit la boîte ouverte et ses … jetons, sans mouvement » lit le couvercle dans `.boite::before` : si le couvercle devient un dessin SVG, l'étape est à adapter **sans changer sa phrase** (elle doit alors vérifier l'absence d'animation et de transition sur le couvercle dessiné). « la boîte s'ouvre et Léa voit … jetons, rangés par 5 » lit `data-cinquieme` : à garder. |
| `addition-posee-maisons.steps.ts` | « Léa termine l'exercice sans autre erreur » est gardée par `@issue-127` : à ouvrir à `@issue-131` (ou à généraliser aux exercices de calcul). |
| `exercices-comme-des-jeux.steps.ts` | Profils sans univers ou à l'univers inconnu (`@issue-98 or @issue-127`), « Léa a dit « Je ne sais pas » » : à ouvrir à `@issue-131`. |
| `calcul-fluence-addition.steps.ts` | « Noisette dit « … » », « Noisette ne dit aucun encouragement » (gardées par `@issue-20 or @issue-65 or @issue-127`) : à ouvrir à `@issue-131`. |

## Précisions pour les étapes (pour `e2e-tester`)

- **Séances complètes** : le Plan « Dans l'univers « <univers> », <erreurs> erreur(s) à l'exercice « <exercice> » donnent <résultat>, comme avant » (5 exemples) joue un exercice entier jusqu'à ses étoiles. Il faut **ajouter `@issue-131` au `Before` de `features/steps/delais.steps.ts`**. Les scénarios en séance de révision (2 exemples + 1 scénario) rechargent avec le profil réel et peuvent aussi en avoir besoin.
- **Projets** : tous les scénarios tournent sur `tablette` et `telephone` (mise au point sur `telephone`, décision 0020).
- **Volume** : 127 cas par projet ; les 6 univers pèsent 66 cas. Si la durée est un problème, me le signaler plutôt que de retirer des exemples.
- **Dessin de l'univers** : « la boîte a le dessin de l'univers « … » », « la boîte et ses jetons ont le dessin de l'univers « … » » et « les barres du schéma ont la jauge de l'univers « … » » se vérifient par un attribut `data-univers` (clé : `animaux`, `princesse`, `sports`, `police`, `pompier`, `danse`) sur la boîte, chaque jeton et chaque barre, **jamais par un tracé**.
- **Tomber, s'en aller, se remplir** : vérifier qu'un mouvement a lieu (attribut d'état, par exemple `data-etat="nouveau"` déjà posé par `RangeesDeJetons`, ou enregistreur de 98a), jamais une durée. « …commencent à tomber en même temps » compare les débuts des mouvements. « sans disparaître d'un coup » : le jeton est encore présent juste après le début de sa sortie. « jusqu'au bout de leur barre » : à la fin, la jauge occupe toute la barre, et la barre garde sa largeur.
- **Barre « ? » vide** : `data-cherchee="true"`, `data-valeur="?"`, « ? » écrit, aucune jauge (attribut de remplissage absent ou à 0). « …se voit de la même façon que dans l'univers « Animaux de la forêt » » compare les attributs d'état et de style de la barre (contour, fond), pas un tracé.
- **Barres de 4 et de 2** : les barres de `data-valeur` 4 et 2. « l'écart de … reste en pointillés, sans jauge » vise `data-testid="ecart-du-schema"`. « Léa voit 6 parts, toutes pleines de la jauge » vise les barres `data-role="part"`.
- **Teinte du tout** : « la barre du tout n'a pas la même teinte que les barres des parties » compare un attribut de teinte posé par le code (ou la couleur calculée du remplissage), jamais une couleur lue dans un SVG.
- **Taille de la boîte fermée** : comparer la boîte englobante de `data-testid="boite"` pour 7 et 20 jetons, à la même largeur d'écran.
- **Ordre son puis mouvement** : « l'effet sonore « réponse juste » commence avant que la boîte s'ouvre / que la barre de … se remplisse » compare le début de l'effet sonore au passage de la boîte à `data-etat="ouverte"` (ou au début du remplissage), comme les étapes d'ordre de #97 et de #127.
- **Toucher** : « Léa touche la boîte », « Léa touche la barre de 4 » sont de vrais touchers sur l'élément ; « …pendant la félicitation » : pendant que la bulle a `data-nature="felicitation"`.
- **Muet** : l'étape « la tablette est en Muet » de #7 ; vérifier que le déroulé avance sans voix (phrases affichées).
- **Contraste** : « …avec un contraste d'au moins 4,5:1 » calcule le contraste entre la couleur du nombre et celle du remplissage de sa barre (couleurs calculées).
- **Mode dys** : « Léa voit les nombres écrits sur les barres en mode dys : police Andika » vérifie que chaque nombre est un texte (pas un tracé) en police Andika.
- **Lecteurs d'écran** : « les lecteurs d'écran annoncent « Boîte ouverte : 7 jetons » » lit l'`aria-label` existant (`libelleDeLaBoite`). Les dessins de la boîte, des jetons et de la jauge sont `aria-hidden`.
- **Révision** : « Léa a pour question retenue la boîte à jetons « 4 + 3 » de l'exercice « Combien dans la boîte ? », due aujourd'hui » et « …le problème « … » de l'exercice « … », due aujourd'hui » écrivent une question retenue de type `boite` ou `barres` (clé du domaine), comme l'étape de #127 pour l'addition.
- **Données de test** : prénoms fictifs déjà employés (Léa, Paul), boîtes et problèmes de la bibliothèque ou neutres, aucune donnée réelle.

### Étapes nouvelles

- « Léa a répondu faux <n> fois à la première question »
- « Léa touche la boîte »
- « Léa touche la barre de <n> »
- « Léa touche la boîte ouverte pendant la félicitation »
- « Léa voit toujours la boîte ouverte et ses <n> jetons »
- « Léa a pour question retenue la boîte à jetons « … » de l'exercice « … », due aujourd'hui »
- « Léa a pour question retenue le problème « … » de l'exercice « … », due aujourd'hui »
- « la boîte a le dessin de l'univers « … » »
- « la boîte et ses jetons ont le dessin de l'univers « … » »
- « les barres du schéma ont la jauge de l'univers « … » »
- « tous les jetons de la boîte ont le même dessin et la même taille »
- « le cinquième jeton de chaque rangée porte la même marque que dans l'univers « Animaux de la forêt » »
- « les <n> jetons ajoutés tombent dans la boîte, avec un petit rebond »
- « les <n> premiers jetons tombent dans la boîte, avec un petit rebond »
- « les <n> jetons ajoutés commencent à tomber en même temps »
- « les <n> jetons ajoutés sont posés dans la boîte, sans tomber »
- « les <n> derniers jetons s'en vont en douceur, sans disparaître d'un coup »
- « Léa voit une rangée de <a> jetons et, à part, une rangée de <b> jetons »
- « Léa voit <a> jetons et, à leur suite, <b> jetons pâles » (et sa variante « …, sans mouvement »)
- « la boîte fermée a la même taille, quel que soit le nombre de jetons dedans »
- « aucun jeton ne tombe à l'ouverture de la boîte »
- « l'effet sonore « réponse juste » commence avant que la boîte s'ouvre »
- « la barre « ? » reste vide, avec son « ? » »
- « la barre « ? » vide se voit de la même façon que dans l'univers « Animaux de la forêt » »
- « les barres de <a> et de <b> se remplissent comme une jauge, jusqu'au bout de leur barre »
- « les barres de <a> et de <b> sont encore vides pendant que Noisette lit l'énoncé du problème »
- « les barres de <a> et de <b> se remplissent quand Noisette dit « … » »
- « les barres de <a> et de <b> sont pleines » (Étant donné)
- « les barres de <a> et de <b> restent pleines, sans se remplir de nouveau »
- « les barres de <a> et de <b> sont pleines dès l'affichage, sans mouvement »
- « la barre de <n> se remplit comme une jauge, jusqu'au bout de sa barre »
- « la barre de <n> est pleine d'un coup, sans mouvement »
- « la barre de <n> a la même largeur que la barre « ? » avant la réponse »
- « l'effet sonore « réponse juste » commence avant que la barre de <n> se remplisse »
- « le nombre <n> n'est écrit sur aucune barre du schéma »
- « l'écart de <n> reste en pointillés, sans jauge »
- « Léa voit <n> parts, toutes pleines de la jauge »
- « la barre du tout n'a pas la même teinte que les barres des parties »
- « la boîte, les choix et « Je ne sais pas » se voient sans faire défiler l'écran »
- « chaque nombre écrit sur une barre se détache de sa jauge avec un contraste d'au moins 4,5:1 »
- « Léa voit les nombres écrits sur les barres en mode dys : police Andika »
- « les lecteurs d'écran annoncent « Boîte ouverte : 7 jetons » »
- « les lecteurs d'écran n'annoncent ni le dessin de la boîte, ni celui des jetons, ni l'univers du dessin »
- « les lecteurs d'écran n'annoncent ni la jauge, ni l'univers du dessin »
- « Léa n'entend aucun effet sonore pendant que <le mouvement> a lieu »

### Étapes existantes reprises

- #21 (`boite-et-barres.steps.ts`, à ouvrir à `@issue-131`) : « Léa joue la boîte à jetons « … » de la leçon « … » », « une leçon de test a une boîte à jetons « … » », « Léa joue cette boîte à jetons et que la boîte est fermée », « Léa joue le problème « … » de la leçon « … » », « le schéma s'affiche », « Noisette dit « … », puis « … » », « Léa ne voit plus les jetons », « la boîte s'ouvre et Léa voit … jetons, rangés par 5 », « Noisette dit « On ouvre la boîte pour vérifier… », puis une félicitation », « la boîte reste fermée », « le « ? » du schéma est remplacé par … », « les lecteurs d'écran lisent « … » », « Léa voit la boîte ouverte et ses … jetons, sans mouvement », « les barres du schéma restent proportionnelles aux nombres … et … ».
- #16, #17 : « Léa est sur la page de la leçon « … » », « Léa choisit seulement l'exercice « … » », « Léa répond « … » », « Léa a répondu « … » », « Léa demande à réécouter la question », « l'avancement de la séance montre … question réussie sur … », « Léa joue seulement l'exercice « … » de la leçon « … » ».
- #20 et #127 : « Noisette dit « … » », « Noisette ne dit aucun encouragement », « Léa termine l'exercice sans autre erreur ».
- #23 : « Léa dit « Je ne sais pas » », « seul le choix « … » reste, et il brille », « <personnage guide> dit un encouragement, suivi de « … » ».
- #24 : « Léa gagne <n> étoiles ».
- #28 : « Léa commence la séance de révision ».
- #97 : « Léa entend l'effet sonore « … » », « Léa n'entend pas l'effet sonore « … » ».
- #7 : « la tablette est en Muet ».
- #98 : « Léa a choisi l'univers <clé> », « Léa a un profil enfant préparé sans univers | dont l'univers est inconnu », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Léa a dit « Je ne sais pas » ».
- #6 et socle : « l'appareil demande des mouvements réduits », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », « aucun message d'erreur n'apparaît », « Paul a réglé « mode dys » sur « oui » pour Léa ».

## Questions ouvertes

Aucune.

## Décisions

2026-11-03 08:00 UTC, cadrage validé par le PO (« 131 reco tout », annonces [Responsable] 6598437358 sur #64 et 6598436875 sur #131). Toutes les recos sont retenues.

Les questions **#131.1 à #131.11** sont dans `docs/stories/131/domain-model.md` (options, reco et décision). Leur effet sur les scénarios :
- #131.1 (objets du tableau, à valider sur planche univers par univers), #131.2 (pastille ronde mate qui porte l'objet), #131.11 (12 captures) : aucun scénario ne dépend d'elles (planches) ;
- #131.3 (oui), #131.4 (ensemble, 400 ms au plus), #131.5 (oui), #131.6 (A), #131.7 (oui), #131.8 (une seule fois, toutes ensemble), #131.10 (oui, jauge sans échelle) : scénarios confirmés, `@a-valider` retiré ;
- #131.9 (oui, reco A) : confirmée, scénarios inchangés. Précisé par la planche validée (P6, 2026-11-03 11:05 UTC) : le décor des bouts suit l'univers, en pointillés. Tout le reste est pareil dans les 6 univers : vide, contour en pointillés, « ? », largeur, aucune jauge.

Questions posées ici :

**#131.12 Quand l'écart d'une comparaison est la valeur cherchée, se remplit-il de la jauge à la bonne réponse ?**
Exemple : « Léo a 37 billes, Lucie en a 43. Combien Lucie a-t-elle de billes de plus que Léo ? ». Le « ? » est porté par l'écart, à côté de la barre de Léo, et l'écart est aujourd'hui en pointillés, transparent. Le modèle dit à la fois « l'écart reste en pointillés, jamais rempli » (invariant propre 3) et « la barre « ? » se remplit à la bonne réponse » (invariant propre 1) : les deux se contredisent dans ce seul cas.
- A (reco) : **l'écart reste en pointillés**, sans jauge ; à la bonne réponse, son « ? » devient 6 et rien ne se remplit. L'écart n'est pas une quantité comme les deux barres, c'est la différence entre elles (guide fondamental) : le remplir le ferait lire comme une troisième barre.
- B : l'écart se remplit de la jauge à la bonne réponse, comme toute barre « ? ».

*Tranchée le 2026-11-03 : reco.* L'écart reste en pointillés.

**#131.13 Quand le nombre de parts est la valeur cherchée, comment apparaissent les parts à la bonne réponse ?**
Exemple : « Il y a 18 élèves. On fait des équipes de 3 élèves. Combien y aura-t-il d'équipes ? ». Avant la réponse : 2 parts, puis « … » ; après : 6 parts dessinées (`dessinerLeSchema`). Il n'y a pas de barre « ? » qui se remplit.
- A (reco) : **les 6 parts apparaissent remplies de la jauge d'un coup**, après le rebond de #97. Les 2 parts du début sont des parts connues (remplies au début comme toute barre connue), la suite « … » reste en pointillés jusqu'à la réponse.
- B : les 6 parts apparaissent vides, puis se remplissent comme une jauge.
Raisons de A : un seul mouvement nouveau en 400 ms au plus ; B ferait se remplir 6 morceaux, ce qui invite à compter un par un.

*Tranchée le 2026-11-03 : reco.* Les 6 parts apparaissent remplies d'un coup.

## Termes à signaler au glossaire

Repris du modèle (aucun ajout ici) : **Jeton** (trois sens dans le projet ; « jeton de design » ne s'abrège jamais en « jeton ») ; **Boîte à jetons** (ajouter « coffre », « caisse » aux synonymes interdits, 98.6) ; **Jauge** (mot d'interface, jamais un terme du domaine) ; **Étoile**, **Ballon**, **Noisette** : jamais un jeton.

Mots d'interface employés dans les scénarios, à confirmer comme tels : « tomber dans la boîte, avec un petit rebond », « s'en aller en douceur », « pâle » (jeton retiré), « se remplir comme une jauge », « la barre « ? » » (barre de la **Valeur cherchée**), « la barre de 4 », « la barre du tout », « l'écart » (mot de l'interface et de la description lue de la **Comparaison**).
