# Modèle du domaine : issue #130, le petit train de l'univers (98a-train)

Historique : 2026-11-04, premier cadrage (`domain-modeler`), à valider par le PO. 2026-11-04, réponses du PO : « 130 reco tout » ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)), toutes les recos sont retenues.

État : **cadrage validé** (questions #130.1 à #130.9 tranchées le 2026-11-04 : reco, [annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

Tranche **98a-train** de #98 (épopée #95), créée par le découpage révisé (98.30). Dépend de #98 (98a), mergée. Pas besoin du glisser : en `ordre`, toucher suffit (98.8).

Ce modèle est **court**. Il s'appuie sur le cadrage de #98 (`docs/stories/98/domain-model.md`) et ne le recopie pas : ligne `ordre` du tableau des types, pistes « Petit train et wagons d'`ordre` » (option A, 98.26), invariants 1 à 20, planches et captures. Les numéros « inv. 98-n » renvoient à ces invariants, les numéros « 98.n » aux questions tranchées. Les scénarios du train écrits et validés le 2026-10-28 dans le cadrage de 98a sont **gardés pour mémoire** dans `docs/stories/98/acceptance.md`, « Hors périmètre, #130 » : #130 les reprend.

Décisions du PO déjà prises, appliquées ici sans les reposer : habillage par univers (98.2) ; le même train décoré par univers, « petit train » et « wagon » restent justes (98.26) ; toucher suffit, pas de glisser en `ordre` (98.8) ; à 360 px le train passe à la ligne, un vers par wagon sur toute la largeur (98.21) ; les étiquettes gardent la même forme dans les 6 univers (98.27) ; planche par cible, une ligne par univers (98.28) ; captures jointes à la PR, sans test (98.29) ; la PR attend les 6 dessins validés (98.31).

## Contexte

**Apprentissage, affichage seulement.** La story change la façon de montrer les places d'un `ordre` et de l'ordre des vers de `memoriser`. Elle n'ajoute ni contexte, ni agrégat, ni value object, ni commande, ni événement de domaine, ni erreur métier, ni migration, ni Edge Function, ni donnée d'enfant. La context map ne change pas.

- **Apprentissage** reste la source de chaque fait montré (tableau ci-dessous). Aucune règle de correction ne change : le **Placement** d'`ordre` vise toujours **la place suivante** (`EtiquettesDOrdre.questionVisee`), l'aide après une erreur reste « Ce n'est pas le début. Lequel vient en premier ? » / « Pas encore celui-là. Lequel vient juste après ? », l'**Indication du geste** reste « Touche d'abord celle qui vient en premier. » (`indicationDuGeste`, 98.8 = non).
- **Catalogue pédagogique** fournit `ExerciceOrdre.elements` et `ExerciceMemoriser.vers` (par `PlanDeMemorisation.ordreDesVers`). Rien ne change.
- **Motivation** fournit la clé d'univers (`CleUnivers`), lue par `useUnivers()` ; le fournisseur est déjà posé autour de la séance.
- **#97** garde le rebond de la place remplie (`useRetourDe`), le balancement de l'étiquette refusée, les sons et les étincelles du texte complet.

### Les faits du domaine suffisent : vérification

| Ce que #130 montre | Fait nécessaire | Où il est | Existe ? |
|---|---|---|---|
| Nombre de wagons accrochés | Étiquettes posées | `ExerciceJoue.etiquettesPosees()` / `etiquettesAPlacer()` (aussi pour `memoriser`, par `MemorisationJouee`) ; le front compte `elements.length - restantes` | **Oui** |
| Texte de chaque wagon, dans l'ordre | Ordre attendu | `ExerciceOrdre.elements` ; `PlanDeMemorisation.de(exercice).ordreDesVers.elements` | **Oui** |
| Le wagon qui vient d'être accroché (accroche, train qui avance) | Dernière réponse juste | `seance.repondre(...) === "juste"` puis `signaler("juste", etiquette, …)` (`useEtiquettesAPlacer.placer`) ; rebond posé par `useRetourDe(element)` sur la place | **Oui** |
| Une mauvaise étiquette ne s'accroche pas | Placement refusé | `ResultatDeReponse` `"fausse"` : l'étiquette reste dans `etiquettesAPlacer()`, `etiquettesPosees()` inchangé, `signaler("fausse", etiquette)` la fait balancer | **Oui** |
| Dernière étiquette d'un `ordre` : étincelles | Exercice complété | `seance.exerciceCompleteParLaDerniereReponse()` (`EtiquettesAPlacer.derniereReponseCompleteLExercice`) | **Oui** |
| Dernier vers de l'ordre des vers | Ordre des vers fini | `MemorisationJouee.entrainement() === "motsCaches"`. **Ce n'est pas un exercice complété** : pour `memoriser`, `exerciceCompleteParLaDerniereReponse()` ne devient vrai qu'au dernier mot caché (glossaire, **Exercice complété** ; `ExerciceJoue.texteCompleteParLaDerniereReponse`). Donc **pas d'étincelles au dernier vers**, aujourd'hui comme avec #130 (voir #130.5) | **Oui** |
| « Je ne sais pas » en `ordre` : l'étiquette qui vient ensuite brille | Bonne réponse de la question en cours | `seance.direJeNeSaisPas()` → `EtiquettesDOrdre.bonneReponseDe` = l'étiquette de la place suivante ; rangée par le front sous la clé vide (`CLE_DE_L_ORDRE`, `useEtiquettesAPlacer`), lue par `brille()` (`ExerciceAEtiquettes`). Pour `memoriser`, `etiquetteViseeParJeNeSaisPas()` vaut `undefined` et `MemorisationJouee.direJeNeSaisPas` passe à l'ordre des vers : même chemin | **Oui** |
| Plus rien ne brille après la pose | Bonne réponse oubliée après un placement juste | `oublierLaBonneReponse` (front) | **Oui** |
| Mouvements réduits | Préférence de l'appareil | `useMouvementsReduits()` (`src/transitions/mouvements-reduits.ts`), `@media (prefers-reduced-motion: reduce)` | **Oui** |
| Rien à habiller en révision, au défi ni au test de départ | `ordre` et `memoriser` n'y sont jamais posés | `posables()` renvoie `[]` pour ces types (`question-de-revision.ts`, utilisé aussi par `plan-du-defi.ts`) ; `nombreDeQuestionsAdmissibles` renvoie 0 (`plan-du-test-de-depart.ts`) ; glossaire, **Défi** : « sans fluence, `ordre` ni `memoriser` » | **Oui** |

**Aucun fait ne manque.** Le seul point d'affichage à décider est le **moment où le train de l'ordre des vers disparaît** (#130.5) : aujourd'hui, dès que le dernier vers est posé, `entrainement()` passe à `motsCaches` et `Entrainement` (`ExerciceDeMemorisation.tsx`) affiche les mots cachés au même rendu. Le dernier wagon ne serait donc jamais vu. Le garder à l'écran le temps de la félicitation est un état du front (les vers posés restent lisibles par `etiquettesPosees()`), pas une règle métier.

### « Je ne sais pas » en `ordre`, aujourd'hui

Déjà livré (#23, `features/23-aide-et-je-ne-sais-pas.feature`, exemple `ordre` : « l'étiquette qui vient ensuite brille ») : l'étiquette de la place suivante, **parmi les étiquettes à poser**, porte `data-brille="true"` (signal commun de 98a, inv. 98-15) ; le bouton « Je ne sais pas » disparaît tant qu'elle n'est pas posée ; l'enfant la pose lui-même ; après la pose, plus rien ne brille et le bouton revient. Aucune place n'est remplie par « Je ne sais pas ». Même comportement dans l'ordre des vers (non couvert par un scénario aujourd'hui). #130 ne change rien à ce comportement : il ajoute seulement « le petit train n'a aucun wagon » et « l'étiquette qui brille devient le premier wagon quand Léa la pose » (scénarios R5 gardés pour mémoire).

## Ce qui existe déjà (98a) et ce que #130 ajoute

| | Aujourd'hui (`ExerciceAEtiquettes.tsx` : `Places`, `Place` ; `styles.css` : `.places`, `.place`) | Avec #130 |
|---|---|---|
| Places | Une `ol.places` (« Ordre des étiquettes »), une `li.place` par élément, centrées, à la ligne ; vide : contour en pointillés, « place libre » lu ; remplie : contour plein, fond `--succes-fond`, texte en syllabes | **Petit train de l'univers** : une tête (locomotive) dessinée, puis un **wagon** par place remplie. Mêmes `place` / `data-remplie`, même liste lue |
| Bon placement | La place suivante se remplit et rebondit (#97) | Le wagon s'**accroche** derrière le précédent et le train **avance d'un cran** (#130.2, #130.3) ; rebond de #97 d'abord |
| Mauvais placement | L'étiquette se balance, aucune place ne change | **Inchangé** : aucun wagon, le train ne bouge pas |
| Dernière étiquette d'un `ordre` | Étincelles du texte complet (#97) | **Inchangé**, après l'accroche du dernier wagon |
| « Je ne sais pas » | L'étiquette suivante brille dans le plateau | **Inchangé** ; à côté du train |
| Étiquettes à poser | Forme commune (`Etiquette`), glisser refusé en `ordre` (scénario de 98a) | **Inchangées** (98.27) |
| 360 px | Places à la ligne | Train à la ligne ; un vers par wagon sur toute la largeur (98.21) |
| Mouvements réduits | Règle globale `animation: none` | Le wagon apparaît à sa place, sans que le train roule |

Déjà dans `features/98-exercices-comme-des-jeux.feature` : seulement « Dans un ordre, essayer de glisser une étiquette ne la pose pas : on la touche » (« aucune place n'est remplie »), sans le mot « petit train ». Aucun scénario livré ne dit « wagon ». #130 reprend ce scénario avec « le petit train n'a aucun wagon » (`acceptance.md` de #98, ligne R2).

## Termes

| Terme | Statut |
|---|---|
| Étiquette, Placement, place suivante, Étiquettes mélangées (étiquettes à placer), Indication du geste, Je ne sais pas, Bonne réponse montrée, Exercice complété, Texte complet, `ordre`, `memoriser`, Ordre des vers, Univers, Personnage guide | Existants, réutilisés tels quels |
| **Petit train**, **wagon**, **tête du train** (locomotive), accrocher, avancer d'un cran | **Mots d'interface** (98, « Termes à signaler » ; comme « maison », décision n°24). Absents du glossaire, et c'est voulu : le domaine dit **la place suivante** du **Placement**. Rien n'est ajouté au glossaire |
| Étoile | **En conflit** : réservée à la récompense, et le signal « bonne réponse montrée » ne doit ressembler à aucun élément d'un dessin (inv. 98-15). Les pistes « étoile d'insigne » (Police) et « cheminée en étoile » (Princesses) sont à remplacer (#130.1, #130.4) |
| Note (de musique) | Synonyme interdit d'**Étoile** (« point, note, score ») : dans les planches et le code, on écrit « note de musique », jamais « note » seul |
| Wagon | Ne désigne jamais une question ni une place du domaine : `Wagon` n'apparaît pas dans `supabase/functions/_shared/` |

## Modèle

Aucun agrégat, aucun value object nouveau. Ce qui suit vit dans `src/` et ne décide de rien.

| Ce que le front montre | Lu dans | Décide de quoi ? |
|---|---|---|
| Tête du train | `CleUnivers` | Rien : affichage |
| Wagons accrochés et leur texte | `CleUnivers` + `elements` + nombre d'étiquettes posées | Rien : le nombre et l'ordre restent ceux du domaine |
| Accroche et train qui avance | Dernier placement juste (`signaler("juste", …)`) + mouvements réduits | Rien |
| Étiquette qui brille | Bonne réponse montrée (clé vide) | Rien : signal commun de 98a |
| Train complet gardé à l'écran (ordre des vers, #130.5) | `etiquettesPosees()` + parole en cours | Rien : seulement le moment de passer aux mots cachés à l'écran |

## Invariants

### Invariants de #98 qui s'appliquent

inv. 98-1 (mêmes erreurs, avancement, étoiles, revalidation), 98-2 (aucun geste de l'habillage ne produit de réponse ; seul le toucher ou Entrée sur une étiquette pose), 98-3 (ordre des étiquettes du domaine), 98-4 et 98-15 (« Je ne sais pas » et bonne réponse montrée reconnaissables, signal identique dans les 6 univers, rien dans un dessin ne lui ressemble), 98-5 (retours de #97 d'abord, mouvement en 150 à 400 ms, rien ne retarde l'écran suivant), 98-7 et 98-17 (44 px, 360 px, mise en page indépendante de l'univers, même passage à la ligne), 98-8 (Tab et Entrée, focus inchangé), 98-9 (mouvements réduits : aucun train qui roule), 98-10 (consigne au premier plan, mode dys, 4,5:1), 98-11 (lecteurs d'écran inchangés), 98-13 et 98-20 (règle absolue, univers par univers), 98-14 (changer d'univers ne change que le dessin ; « petit train » et « wagon » dans les 6), 98-16 (un dessin par univers, repli sur « animaux »), 98-18 (aucun chiffre ni texte dans un dessin). 98-12 (même habillage en séance, révision et test de départ) est **sans objet hors séance** : `ordre` et `memoriser` ne sont posés ni en révision, ni au défi, ni au test de départ ; en séance, il vaut pour toute leçon qui en contient (leçon de la bibliothèque, leçon personnelle).

### Invariants propres à #130 (les 5 règles de l'issue)

1. **Un bon placement accroche un wagon, et un seul.** Le wagon porte l'étiquette posée et s'accroche derrière le dernier wagon (le premier derrière la tête). Le train avance d'un cran, en 400 ms au plus, après le rebond de #97 (#130.2). Le nombre de wagons est toujours égal au nombre d'étiquettes posées ; l'ordre des wagons est celui du domaine. La dernière étiquette d'un `ordre` garde les étincelles de #97, après l'accroche ; le dernier vers de `memoriser` n'en a pas, comme aujourd'hui (#130.5).
2. **Une mauvaise étiquette ne s'accroche pas.** Aucun wagon de plus, aucun wagon vide qui s'accroche, le train ne bouge pas ; l'étiquette se balance et reste parmi les étiquettes à poser, avec l'aide d'aujourd'hui. Le train ne recule jamais et ne perd jamais un wagon.
3. **« Je ne sais pas » ne pose rien.** En `ordre` et dans l'ordre des vers, l'étiquette qui vient ensuite brille parmi les étiquettes à poser, avec le signal commun ; le train n'avance pas et ne gagne aucun wagon ; c'est l'enfant qui la pose, et elle devient alors le wagon suivant, comme un bon placement. Aucun élément du train (tête, wagon, décor) ne brille ni ne s'allume pour montrer une réponse.
4. **360 px : le train passe à la ligne, un vers tient dans son wagon.** Les wagons gardent 44 px au moins et passent à la ligne sans défilement horizontal (« De dix en dix », 10 wagons) ; un vers occupe un wagon sur toute la largeur et se lit en entier, en mode dys aussi ; le texte d'un wagon est sur un fond uni et clair à 4,5:1, le décor reste sur les bords, le toit et les roues. La place de chaque wagon ne dépend pas de l'univers.
5. **Le petit train de l'univers.** Le même train (une tête, des wagons rectangulaires) dans les 6 univers, décoré selon l'univers (98.26 ; objets tranchés le 2026-11-04, #130.1, #130.4, #130.6, #130.7). Les mots « petit train » et « wagon » restent justes partout ; aucun texte, aucun chiffre, aucun personnage dans un dessin ; aucun son nouveau (ni sifflet, ni cloche qui sonne, ni bruit de roues). Chaque dessin respecte la règle absolue à toutes les tailles (inv. 98-20).

Précisions communes aux 5 règles :
- **Lecteurs d'écran inchangés** : la liste « Ordre des étiquettes », le texte de chaque place remplie et « place libre » restent les seuls textes lus ; la tête, les roues et le décor sont cachés aux lecteurs d'écran.
- **Mouvements réduits** : le wagon apparaît à sa place, sans chemin animé, sans que le train roule ; aucune cheminée qui fume.
- **Ni la tête ni un wagon ne sont des cibles** : un toucher dessus ne fait rien (comme une place aujourd'hui).

## Événements

Aucun événement de domaine nouveau. L'affichage réagit aux faits existants (placement juste ou refusé, bonne réponse montrée, exercice complété) et aux retours de #97.

## Partage avec le front

Tout fonctionne déjà hors ligne : faits de `@domain/apprentissage` et `@domain/catalogue`, clé d'univers de `@domain/motivation`, dessins en SVG dans le code (décision 0027). Rien de nouveau n'est exporté par un `domain/index.ts`.

## Données d'enfants

Aucune donnée nouvelle.

## Emplacement

Domaine : **rien**. Aucun fichier sous `supabase/functions/_shared/` ne change.

Front (indicatif, pour l'implementer) :
- `src/seance/exercices/ExerciceAEtiquettes.tsx` : `Places` / `Place` deviennent le petit train (garder `data-testid="places"`, `place`, `data-remplie`, `aria-label`, « place libre ») ;
- `src/seance/exercices/petit-train/` (nouveau) : composant du train, accroche et cran d'avance ; `dessins/` avec une table `Record<CleUnivers, …>` (tête, wagon extensible), comme `maisons/dessins/index.ts` ;
- `src/seance/exercices/mot-qui-voyage/` : à réutiliser si l'étiquette rejoint son wagon (#130.3) ;
- `src/seance/exercices/ExerciceDeMemorisation.tsx` (`Entrainement`) : seulement si #130.5 = A (train gardé jusqu'à la consigne des mots cachés) ;
- `src/styles.css` : blocs `.places` / `.place` ;
- planches : `docs/stories/130/planches/` ; scénarios : `features/130-*.feature`.

Ne pas toucher : `Etiquette.tsx` (forme commune, 98.27), les maisons de `classer`, `indication-du-geste.ts`.

### Fichiers communs avec #129 (parchemin, en cours de merge)

#129 habille le **déroulement du texte** de `memoriser` (temps « écoute » et « redire » : `VersDeLaPoesie` dans `Parchemin`) ; #130 ne fait que **l'ordre des vers** (temps « entraînement »). Fichiers touchés par les deux :
- `src/seance/exercices/ExerciceDeMemorisation.tsx` : #129 remplace la liste des vers et ajoute la prop `voixCoupee` ; #130 ne touche que `Entrainement` (et seulement si #130.5 = A) ;
- `src/styles.css` : #129 ajoute un bloc « parchemin » en fin de fichier ; #130 modifie `.places` / `.place` (autre bloc) ;
- `features/steps/exercices-comme-des-jeux.steps.ts` : #129 ajoute `@issue-129` aux listes de tags des étapes « univers » ; #130 y ajoutera `@issue-130` (mêmes lignes : conflit sûr, à intégrer après le merge de #129) ;
- `features/steps/classer-ordre-trous.steps.ts` : #129 modifie `TYPES_JOUES` et l'étape « Léa voit « … » » ; #130 lit les places (`place`, `data-remplie`).
À faire : intégrer `main` après le merge de #129 avant de toucher ces fichiers.

Scénarios qui doivent rester verts : ceux de #18, #22 et #79 qui lisent `place` et `data-remplie` (`classer-ordre-trous.steps.ts`, `consigne-visible.steps.ts`, `memoriser-une-poesie.steps.ts`), #23 (exemple `ordre`), #97 (étincelles de la dernière étiquette), et celui de 98a sur le glisser refusé.

## Dessins et planches

### Les 6 trains (option A de 98.26), relus contre la règle absolue

| Univers | Piste de #98 | Relecture (règle absolue, inv. 98-15, inv. 98-18) | Proposition |
|---|---|---|---|
| Animaux de la forêt (`animaux`) | Train en bois, toit de feuilles, glands sur les wagons | Rien de choquant. Les glands ne doivent pas être alignés comme une quantité à compter dans un `ordre` de nombres : un ou deux, au bout du wagon | **Locomotive en bois, toit de feuilles ; wagons en bois, un gland sur le bord** |
| Princesses et fées (`princesse`) | Locomotive dorée à cheminée en étoile, wagons à volutes | **Étoile** : conflit avec la récompense et avec le signal « bonne réponse montrée » (#130.4) | **Locomotive de conte lilas et or mat, cheminée en couronne ; wagons à volutes** |
| Sports (`sports`) | Couleurs de maillots, fanions, **sans numéro** | Aucun numéro ni lettre (inv. 98-18 ; un chiffre se confondrait avec « De dix en dix ») ; ni coupe ni podium | **Locomotive et wagons aux couleurs de maillots, un fanion sur le toit** |
| Police (`police`) | Train bleu, insigne en étoile | **Étoile** (#130.1). Aucun gyrophare, aucune lampe qui clignote, rien qui évoque une poursuite, une arme ou un fourgon cellulaire (pas de barreaux aux fenêtres) | **Train bleu, écusson rond sans étoile sur la locomotive** (#130.1) |
| Pompiers (`pompier`) | Train rouge, cloche dorée, petite échelle sur le toit | Ni flamme, ni fumée noire, ni sirène ; la cloche est dessinée, elle ne sonne pas ; la cheminée ne fume pas (#130.6) | **Locomotive rouge à cloche, petite échelle sur le toit des wagons** |
| Danse (`danse`) | Train de manège, notes de musique et rubans | Aucun personnage dans les wagons (98) ; aucune musique jouée | **Petit train de manège, notes de musique et rubans sur les wagons** |

Commun aux 6 : le **centre du wagon**, derrière le texte, est une plaque unie et claire (comme le centre de la bulle de #126) ; le wagon **s'étire** en largeur (un mot court comme un vers entier) : le décor est sur les bouts, le toit et les roues, jamais répété le long du wagon ; la tête a la même taille dans les 6 univers ; aucun visage sur la locomotive (#130.7).

### Planche et captures

| Ce qui est dessiné | Nombre |
|---|---|
| Tête du train, wagon (extensible) | 6 × 2 = **12 dessins** |
| Planche (98.28) | **1** : `ordre-petit-train.png`, 6 lignes (animaux, princesse, sports, police, pompier, danse) × 5 colonnes (#130.8) : tête du train seule · un wagon accroché « do » · trois wagons avec le passage à la ligne à 360 px · étiquette qui brille après « Je ne sais pas », à côté du train · un vers long dans son wagon à 360 px, en mode dys = 30 cases, taille réelle et double, fond clair et sombre |
| Captures avec la PR (98.29) | **12** (#130.9) : par univers, un `ordre` avec deux wagons accrochés, et l'ordre des vers avec deux vers accrochés ; à 360 px, projet `telephone`, mouvements réduits. Elles ne font échouer aucun test |
| PR (98.31) | Attend les 6 univers validés sur la planche |

## Questions ouvertes

Aucune.

## Décisions

**#130.1 Police : quel décor sur la locomotive, à la place de l'« insigne en étoile » ?**
L'étoile est la récompense (**Étoile**) et le signal « bonne réponse montrée » ne doit ressembler à aucun dessin (inv. 98-15). #127 (retenue : loupe), #128 (marque du record : loupe) et #131 (boîte : écusson rond sans étoile ; jetons : casquettes) l'ont écartée ; seule la bulle de choix Police de #126 la garde (choix du PO, « reco tout »), mais la bulle n'est pas sur l'écran d'un `ordre`.
- A (reco) : **écusson rond sans étoile** sur l'avant de la locomotive, bleu et blanc. Raisons : même signe que la boîte de Police de #131, se lit « police » sans rien qui brille ; un rond plat ne ressemble pas au halo de la bonne réponse montrée.
- B : une **casquette de police** posée sur le toit de la cabine (déjà le jeton de Police de #131).
- C : un **sifflet** accroché à la cabine (dessiné seulement, aucun son).
- D : garder l'étoile d'insigne, petite et fixe, comme la bulle de #126.
Reco : **A**.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.2 « Le train avance d'un cran » : que voit l'enfant ?**
Exemple : Léa touche « mi ». A, le wagon « mi » s'accroche derrière « do », les roues tournent et tout le train fait un petit à-coup vers l'avant (quelques pixels), puis revient, en 400 ms au plus ; rien ne change de place. B, le train se déplace d'une longueur de wagon sur l'écran.
Reco : **A**. B ferait bouger toute la mise en page à chaque bon placement (inv. 98-17), et ne tient pas avec le passage à la ligne. Avec mouvements réduits : rien ne roule, le wagon apparaît à sa place.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.3 L'étiquette touchée rejoint-elle son wagon par un petit chemin (comme le mot qui rejoint son trou de #126), ou le wagon apparaît-il directement avec son texte ?**
Reco : **le chemin**, en 250 ms (durée du mot qui voyage de #126), parti après le rebond de #97 ; puis l'accroche. Le chemin d'un objet vers sa cible est prévu par #98 (« wagon qui s'accroche »). Option : pas de chemin, le wagon apparaît et l'étiquette disparaît du plateau.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.4 Princesses : quelle cheminée, à la place de la « cheminée en étoile » ?**
Même raison que #130.1. Reco : **une cheminée en couronne**, or mat, sans reflet qui scintille. Options : une petite fleur sur la cheminée (déjà la retenue de #127 et le jeton de #131 en Princesses) ; garder l'étoile.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.5 Ordre des vers : après le dernier vers, le train complet reste-t-il à l'écran pendant la félicitation de Noisette, avant les mots cachés ?**
Aujourd'hui, la liste des places disparaît au moment même où le dernier vers est posé : on passe aux mots cachés au même instant, et le dernier wagon ne serait jamais vu.
Exemple : Léa pose le 6ᵉ vers. A (reco), le 6ᵉ wagon s'accroche, le train avance d'un cran, Noisette félicite ; à la consigne des mots cachés, le train laisse la place aux vers joints par « / ». B, comme aujourd'hui : les mots cachés tout de suite.
Reco : **A**. Pas d'étincelles au dernier vers (ce n'est pas un exercice complété : la poésie continue avec les mots cachés), comme aujourd'hui. Rien ne change dans le domaine ni dans l'avancement.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.6 La cheminée des locomotives fume-t-elle ?**
Reco : **non, dans aucun univers**. Pas de fumée près du train des pompiers (règle absolue : rien qui évoque un feu), et un train qui fume serait une animation au repos de plus. Option : petits nuages blancs ronds, immobiles, sauf en Pompiers.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.7 La locomotive a-t-elle un visage (yeux, sourire) ?**
Reco : **non**. Le visage est celui du personnage guide ; un deuxième visage sur l'écran tirerait l'attention pendant la consigne (inv. 98-10). Option : un visage souriant, le même dans les 6 univers.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.8 Planche : 5 colonnes, dont une avec un vers long dans son wagon à 360 px (en plus des 4 colonnes prévues par #98) ?**
Reco : **oui**. Le vers sur toute la largeur (98.21) est le cas où le wagon s'étire le plus ; il doit être vu avant le code.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

**#130.9 Captures avec la PR : 12 (un `ordre` et l'ordre des vers, par univers), ou 6 (seulement l'`ordre`, comme prévu par #98) ?**
Reco : **12**, comme #131 pour ses deux écrans : le wagon d'un vers est le plus large et le plus risqué à 360 px.
Tranchée le 2026-11-04 : reco ([annonce](https://github.com/SBA-dev/github-move/issues/130#issuecomment-6641496239)).

## Risques pour l'implementer

1. **Fichiers communs avec #129** (voir plus haut) : intégrer `main` après son merge ; les listes de tags des étapes « univers » sont un conflit certain.
2. **Garder les attributs lus par les scénarios** : `places`, `place`, `data-remplie`, `aria-label="Ordre des étiquettes"`, « place libre ». Une place vide reste un élément `place` sans `data-remplie` : « le petit train n'a aucun wagon » se lit comme « aucune place remplie ». Une place vide garde son contour en pointillés (aujourd'hui) ; ne pas la dessiner comme un wagon.
3. **Wagon extensible** : un vers à 360 px en mode dys (Andika, espacement) peut prendre trois lignes ; le wagon grandit en hauteur, le décor reste aux bouts et au toit. Le texte reste du texte (`TexteEnSyllabes`), jamais dans le SVG.
4. **Hauteur à 360 px** : roues et toit ajoutent de la hauteur à chaque ligne du train ; vérifier que les étiquettes à poser, « Je ne sais pas » et la consigne restent visibles (bug de hauteur de #131 à 360 × 1180).
5. **Ordre de lecture** : le premier wagon doit rester le premier lu, à gauche, puis à la ligne ; la tête est en tête de la première ligne, cachée aux lecteurs d'écran.
6. **Rien ne retarde #97** : accroche et cran d'avance partent après le rebond et ne prolongent pas l'attente avant l'écran suivant (#79) ; un toucher pendant une célébration ne fait rien (97.17).
7. **#130.5 = A** touche le moment d'afficher les mots cachés dans `ExerciceDeMemorisation` : fondé sur la parole en cours (consigne des mots cachés), pas sur un minuteur ; sans voix ou en Muet, le passage reste immédiat après la félicitation.
8. **Étiquettes en double** (même texte deux fois) : le domaine accepte l'une ou l'autre ; le train montre `elements[rang]`, comme `Places` aujourd'hui.

## Termes à signaler au glossaire

Rien n'est écrit au glossaire par ce cadrage : **petit train**, **wagon** et **tête du train** restent des mots d'interface (98, « Termes à signaler »), comme « maison ». Rappels : **Étoile** n'est jamais un décor de cible ; « note » seul reste interdit (dire « note de musique »).
