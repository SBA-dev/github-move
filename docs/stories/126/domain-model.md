# Modèle du domaine : issue #126, bulles de choix (tranche 98b)

Épopée #95. Tranche **98b** du découpage de #98 (`docs/stories/98/domain-model.md`, abrégé « #98 » ci-dessous). Dépendances mergées : #97 (retours animés et sonores) et #98 (98a : socle, maison de `classer`).

Ce modèle ne recopie pas #98. Il renvoie à ses **invariants** (I1 à I20) et à ses **questions tranchées** (98.1 à 98.32), et ne garde que ce qui est propre aux bulles de choix.

## Contexte

### Rien de nouveau dans le domaine

La tranche change seulement l'**affichage** des choix (#98, « Contexte »). Il n'y a **ni agrégat, ni value object, ni commande, ni événement de domaine, ni erreur métier, ni migration, ni Edge Function, ni donnée d'enfant nouvelle**. La context map ne change pas : le front lit déjà la clé d'univers (`CleUnivers`, Motivation) par `useUnivers()` (`src/univers/ContexteDeLUnivers.ts`), comme la maison de 98a.

Contexte concerné : **Apprentissage** (source des faits), lu par `src/`. **Motivation** fournit la clé d'univers et garde les paroles. #97 garde le rebond, le balancement, les sons et les étincelles du texte complet.

### Ce qui est lu du domaine (faits existants)

| Règle de la tranche | Fait lu | Où | Existe ? |
|---|---|---|---|
| Ordre des bulles | `choix.textes()` | `QuestionJouee`, `CalculEnCours.mode.choix` | Oui (I3) |
| Choix écarté | `choix.ecartes()` | idem, `mode.ecartes` | Oui |
| Bonne réponse montrée | `bonneReponseMontree`, `choix.possibles()[0]` ; au calcul, `jeNeSaisPasPropose` faux | `QuestionJouee`, `CalculEnCours` | Oui |
| Réponse juste ou fausse | `ResultatDeReponse` (`juste`, `fausse`, `dejaEcartee`) | `Seance.repondre` | Oui |
| Flotte ou non (98.4 : `bulles` et `ecoute`) | En séance : `exercice.type` (Catalogue). En séance de révision et au test de départ : `question.type` (`TypeDExerciceAChoix`) | `Lecon.exercices`, `QuestionJouee.type` | Oui, **avec un écart** : voir ci-dessous et #126.5 |
| Immobile après le premier toucher | La question a reçu une réponse : `choix.ecartes().length > 0`, `reussie`, ou `bonneReponseMontree` | `QuestionJouee` | Oui |
| Immobile pendant la consigne | La parole en cours est de nature `consigne` ou `question` (`deroulement.parole.nature`), et les choix n'apparaissent qu'**après** la lecture de la question (`choixVisiblesPour`) | `src/seance/useDeroulementDeSeance.ts`, `useQuestionsAChoix.ts` | Oui, **dans le front** (Voix et déroulé, pas Apprentissage). Ce n'est pas une règle métier : c'est l'état de la parole |
| Mot juste qui rejoint son trou | Le trou rempli par la dernière réponse : `texteATrous()` avant / après (un trou passe de `en-cours` à `rempli`) | `ExerciceJoue.texteATrous()` | Oui, **indirectement** : voir « Points de vigilance », point 6 |
| Mot juste qui rejoint sa ligne | La ligne passée de `en-cours` à `ecrite` | `ExerciceJoue.tableauDeConjugaison()` | Oui, indirectement (même remarque) |
| Mots cachés de `memoriser` | Mêmes segments (`memorisation.segmentsAffiches()`, `motsTrouves()`), questions de type `trous` | `ExerciceJoue`, `PlanDeMemorisation` | Oui |
| Dernier trou, dernière personne | `texteCompleteParLaDerniereReponse()`, `exerciceCompleteParLaDerniereReponse()` (#97) | `Seance` | Oui |

**Écart repéré sur `question.type`** : le domaine type `"bulles"` aussi la question à choix d'un `classer` en séance de révision et au test de départ (`questions-de-l-exercice.ts`, Plan 98.18), et la question de calcul en mode par choix (`question-de-calcul.ts`). Le calcul s'affiche par `ReponseAuCalcul`, qui ne flotte pas : sans effet. Mais la question de `classer` en révision **flotterait** si le front se fie à `question.type`. Question #126.5.

### Périmètre : la forme de bulle vaut pour les 10 types (98.4, tranché)

`ChoixDeLaQuestion` sert à deux composants : `QuestionAChoix` (`bulles`, `ecoute`, `lecture`, `trous`, `conjugaison`, mots cachés de `memoriser`, et en révision la question de `classer`) et `ReponseAuCalcul` (mode par choix de `calcul`, `boite`, `barres` et de l'étape calculer d'`addition`).

98.4 est tranchée : la **forme** pour tous les choix, le **flottement** pour `bulles` et `ecoute` seulement. Le découpage de #98 le dit (« si 98.4 = toutes les bulles de choix, la story touche aussi le mode par choix… »), et le commentaire du responsable aussi (« Elle sert à tous les types de choix (98.4) »).

**Reco : #126 habille les 10 types**, puisque c'est un seul composant. Ce n'est pas une question nouvelle. Les scénarios prouvent au moins un mode par choix (calcul au CP) : il a la bulle de l'univers et il ne flotte pas. #127 et #131 ne touchent pas à la bulle de choix.

## Règles de la tranche (6)

Reformulées depuis l'issue et le commentaire du responsable (règles 1 et 2 fondues, règle « bulle de l'univers » ajoutée).

1. **Bulles qui flottent, légèrement.** Les choix de `bulles` et `ecoute` flottent doucement (98.3), tous de la même façon (I6). Ils sont immobiles pendant la lecture de la consigne (I10), et pour de bon dès le premier toucher. La zone de toucher reste fixe, d'au moins 44 px (I7). Avec les mouvements réduits, aucune bulle ne flotte (I9). Les autres types ont la forme de bulle sans flotter (98.4).
2. **Bulle de l'univers.** Dans chacun des 6 univers, la bulle a le dessin de l'univers. Les gestes, les textes et les signaux ne changent pas (I14, I15). Elle sert aux 10 types (98.4). Un ballon ne crève jamais (98.5).
3. **La bulle juste s'efface.** Après le rebond de #97, la bulle juste s'efface en douceur, sans étincelles (98.5, I5). Elle garde sa place pendant ce temps, et les autres bulles ne bougent pas. Un toucher pendant la félicitation ne fait rien (97.17).
4. **Le mot juste rejoint sa place.** Dans `trous`, `conjugaison` et les mots cachés, le mot juste rejoint son trou ou sa ligne, puis s'y illumine. Cet éclat ne ressemble pas à la bonne réponse montrée (I4). Le dernier trou et la dernière personne gardent les étincelles de #97.
5. **Choix écarté et bonne réponse montrée reconnaissables.** Sur une bulle, ils restent reconnaissables par un signal d'état commun aux 6 univers, posé par-dessus le dessin (I4, I15). Le halo de la bonne réponse montrée est celui de la maison de 98a (`.signal-brille`).
6. **Clavier.** Tab et Entrée répondent comme avant, et le focus va au premier choix possible, comme aujourd'hui. Les flèches passent d'une bulle à l'autre (98.15, I8). Les lecteurs d'écran annoncent la même chose qu'avant (I11).

Invariants de #98 qui s'appliquent sans changement : I1, I2, I3, I5, I12 (séance, séance de révision, test de départ : 98.13), I13, I16 (repli sur « animaux »), I17, I18, I20.

## Objets par univers (bulle de choix)

Ils partent de la ligne 98b du tableau « Pistes pour les tranches suivantes » de #98. Les noms d'objets viennent du PO (skill `illustration`, section 2.1). Les propositions ci-dessous sont **des questions** (#126.1), pas des décisions.

### Contraintes communes à tous les univers

- **Forme** : toutes les bulles d'une même question ont la même forme et la même hauteur (I6). Les choix vont de « 3 » à **97 caractères** (`bulles` : une phrase qui résume un conte) ; en `lecture`, jusqu'à 42. Un dessin rond de taille fixe ne reçoit donc pas tous les choix : la bulle est une **capsule qui s'allonge** avec le texte et passe sur plusieurs lignes (#126.2).
- **Texte** : à 4,5:1 sur le fond de la bulle (I18), en mode dys aussi, syllabes en couleur comprises. Le centre de la bulle, derrière le texte, est **uni et clair**. Reflets, coutures, étoiles et paillettes restent sur le contour et les bouts.
- **Aucun texte, lettre ni chiffre** dans le dessin (skill `illustration`, section 1). Pas de numéro sur un ballon : il se confondrait avec un choix de calcul.
- **Rien qui brille comme la bonne réponse montrée** (I15) : pas de halo, pas de reflet qui pulse, pas d'étoile qui scintille.
- **S'efface en douceur** (98.5) : rien n'éclate, ne crève ni ne se déchire, aucun bruit de détonation. Le son reste celui de #97.
- **Règle absolue** (I20), à toutes les tailles.

### Propositions (reco A pour chaque univers)

| Univers | A (reco) | Autre idée | À éviter |
|---|---|---|---|
| Animaux de la forêt | **Bulle de savon** : capsule claire, reflet irisé sur le bord haut, petit reflet blanc en haut à gauche | Bulle de rosée posée sur une feuille | Bulle transparente (le texte ne se lit plus sur le fond) |
| Princesses et fées | **Bulle magique irisée** : contour aux couleurs de l'arc-en-ciel pâle, petite étoile fixe sur un bout | Perle nacrée | Halo doré ou étoile qui scintille (I15) |
| Sports | **Ballon de sport** : capsule claire avec les coutures d'un ballon sur les deux bouts seulement (exemple du PO : « des ballons pour Sports ») | Ballon de rugby ovale (forme propre à l'univers, voir #126.2) | Ballon de baudruche (il crève, ficelle) ; ballon de foot à motifs derrière le texte (contraste) ; numéro, coupe, podium |
| Police | **Bulle bleue à étoile d'insigne** : capsule bleu très clair, petite étoile d'insigne fixe sur un bout | Bulle bleue à liseré de casquette | « Jeton » (terme du glossaire, Boîte à jetons) et « badge » (Motivation) comme noms ; arme, menottes ; gyrophare ou lampe qui clignote |
| Pompiers | **Bulle d'eau** : capsule bleu-vert claire, reflet en goutte, comme une bulle sortie de la lance à eau | Bulle de mousse (la piste de #98) | La mousse d'un extincteur, qui fait penser au feu ; flamme, fumée, sirène |
| Danse | **Bulle à paillettes** : capsule claire, paillettes **fixes** sur le contour seulement | Bulle-ruban (un ruban de danse fait le tour) | Paillettes derrière le texte (contraste) ou qui scintillent (I15, étincelles de #97) ; personnage, tenue |

### États à dessiner (planche `bulle-de-choix.png`, 98.28)

Une ligne par univers (animaux, princesse, sports, police, pompier, danse), une colonne par état, à la taille réelle sur 360 px et au double, fond clair et fond sombre. Texte d'exemple dans chaque case : un mot court (« lune ») et un choix long sur deux lignes (« Le chat dort sur le tapis du salon. »).

| Colonne | État | Signal |
|---|---|---|
| 1 | Repos | Dessin de l'univers seul |
| 2 | Focus clavier | Contour de focus **commun** (celui du front), par-dessus le dessin |
| 3 | Choix écarté | Signal **commun** : voir #126.10 |
| 4 | Bonne réponse montrée par « Je ne sais pas » | `.signal-brille` **commun**, identique sur les 6 lignes (I15) |
| 5 | Bulle juste, à mi-effacement | Dessin de l'univers, plus pâle et un peu plus grand. Rien ne se déchire |

Esquisses, contrôle et planches dans `docs/stories/126/planches/` (méthode de #98, « Validation des dessins par le PO »). Le code avance pendant l'attente ; la PR attend les 6 dessins validés (98.31). 6 captures de l'écran réel jointes à la PR (98.29, #126.8).

Total : 6 dessins d'univers (plus l'état « écarté » s'il est dessiné par univers, #126.10), 1 planche de 30 cases, 6 captures.

## Points de vigilance techniques

1. **360 px et plusieurs choix.** Il y a 2 à 4 choix (4 au calcul : `choixAutourDuResultat`). Les choix courts tiennent sur une ligne. Les choix longs (`bulles` jusqu'à 97 caractères, `lecture` jusqu'à 42) prennent toute la largeur, en colonne, sur 2 ou 3 lignes. Le dessin doit s'étirer sans se déformer : bouts fixes et milieu qui s'allonge, sans `viewBox` carré étiré.
2. **Cible fixe pendant que le dessin flotte.** La zone de toucher, c'est le bouton : elle ne bouge jamais. Seul un calque décoratif bouge (dessin et texte ensemble), de quelques pixels, **à l'intérieur** de la zone. Jamais `transform` sur le bouton lui-même : Motion le pilote déjà pour le ressort (#96) et pour le rebond et le balancement (#97, `useRetourDe`).
3. **Ordre des animations.** Aujourd'hui, `setBulleEclatee` part **en même temps** que le rebond (`useQuestionsAChoix.repondre`), et la bulle grandit et s'efface par une transition CSS de 0,3 s. 98.5 veut l'effacement **après** le rebond. Il doit tenir dans la durée d'un retour et ne jamais retarder l'écran suivant, qui reste fondé sur la parole (I5, #79).
4. **La bulle effacée garde sa place** (opacité, pas de retrait) : les autres bulles ne sautent pas pendant la félicitation.
5. **Mouvements réduits** : lire le réglage par le hook réactif `useMouvementsReduits()` (#102, `src/transitions/mouvements-reduits.ts`), pas une fois pour toutes. Une bulle qui flotte s'arrête si le réglage change pendant la question. Avec mouvements réduits, la bulle juste disparaît en fondu, et le mot apparaît dans son trou sans voyager (#98, tableau des types).
6. **Trou rempli par la dernière réponse.** Le domaine remplit les trous dans l'ordre. Le front sait déjà quel trou est en cours (`findIndex` dans `TexteATrous` et `TableauDeConjugaison`). Pour le chemin du mot, il compare le trou en cours avant la réponse à celui qui est rempli après : c'est une lecture d'affichage, sans nouvelle règle. Si la review y voit une règle, on ajoute une lecture pure sur `ExerciceJoue` (le rang du dernier trou rempli), par un cycle TDD dans le domaine, sans changer d'état.
7. **Trou hors de l'écran.** À 360 px, un texte à trous long ou un tableau de 6 personnes peut pousser le trou au-dessus de l'écran. Le mot ne voyage pas vers une place qu'on ne voit pas : il apparaît dans le trou (#126.6). Pas de défilement automatique, qui déplacerait les bulles sous le doigt.
8. **Mode dys.** Andika et l'espacement allongent les bulles. La couleur des syllabes doit rester à 4,5:1 sur le fond de chaque univers : il faut le vérifier sur la planche, en mode dys aussi.
9. **Signaux communs.** La bonne réponse montrée passe au `.signal-brille` de 98a (aujourd'hui, la bulle a son propre `box-shadow` animé), pour qu'elle soit la même sur une maison et sur une bulle. Le contour de focus et le signal « écarté » sont aussi posés hors des tables `Record<CleUnivers, …>`.
10. **Attributs lus par les scénarios** (comme 98a) : `data-univers` sur la bulle ; `data-flotte` (à nommer par l'implementer) ; `data-ecarte`, `data-brille` et `data-eclatee` gardés pour #17, #23 et #97. Le nom `data-eclatee` dit « éclatée », le contraire de 98.5 : le renommer serait une dette à part, car des étapes existantes le lisent.
11. **Fichiers partagés avec #106** (en parallèle) : seul `src/styles.css` risque d'être touché par les deux. Mettre les styles des bulles dans un bloc à part pour limiter les conflits. Rien dans les fichiers de Motivation ni dans ceux de la célébration.

## Événements

Aucun. L'affichage réagit aux faits existants (`ResultatDeReponse`, choix écarté, bonne réponse montrée, trous et lignes remplis, texte complet) et aux retours de #97.

## Partage avec le front et données d'enfants

Tout se passe déjà dans le navigateur, hors ligne compris (`@domain/apprentissage`, `@domain/motivation`). Les dessins sont des SVG dans le code (décision 0027). Aucune donnée nouvelle, rien d'enregistré ni d'envoyé.

## Emplacement

- Domaine : **rien**. Seule exception possible : la lecture pure du point 6 des vigilances, si la review la demande (`supabase/functions/_shared/apprentissage/domain/exercice-joue.ts` et son test, export dans `index.ts`).
- Front (indicatif) :
  - `src/seance/exercices/bulles-de-choix/` : le dessin de la bulle et la table `Record<CleUnivers, …>` des 6 dessins, sur le modèle de `maisons/dessins/`. Le dossier ne s'appelle pas `bulles/`, pour ne pas le confondre avec le type `bulles` ;
  - `ChoixDeLaQuestion.tsx` : flottement, signaux, flèches ;
  - `TexteATrous.tsx`, `TableauDeConjugaison.tsx` : le mot qui arrive et l'éclat ;
  - `useQuestionsAChoix.ts` : l'effacement après le rebond ;
  - `src/styles.css`.
- Planches : `docs/stories/126/planches/`. Captures : `docs/stories/126/captures/`.
- Scénarios : `features/126-bulles-de-choix.feature`. Les dessins ne sont jamais lus par un tracé : on lit `data-univers` et les attributs d'état.

## Questions ouvertes

Ces questions ne reposent aucune question déjà tranchée (98.1 à 98.32).

**#126.1 Quel objet dessine-t-on pour la bulle de choix dans chaque univers ?**
Contexte : 98.2 (un dessin par univers). La piste de #98 est reprise, avec deux changements : « jeton » (Police) est déjà un terme du glossaire, et la « mousse » (Pompiers) fait penser à un extincteur.
Exemple : en Sports, une question « le / la / les » montre trois ballons clairs, avec des coutures sur les bouts et le mot au milieu.
Reco : **A**. Animaux : bulle de savon. Princesses : bulle magique irisée. Sports : ballon de sport, coutures sur les bouts. Police : bulle bleue à étoile d'insigne. Pompiers : bulle d'eau. Danse : bulle à paillettes fixes sur le contour.
Options : B, la piste de #98 telle quelle (jeton rond à étoile, bulle de mousse, bulle-paillette) ; C, tu donnes l'objet d'un ou de plusieurs univers.

**#126.2 La bulle a-t-elle la même forme de capsule dans les 6 univers, l'univers ne changeant que son décor ?**
Contexte : un choix va jusqu'à 97 caractères et passe sur 2 ou 3 lignes à 360 px. Un rond ou un ballon de taille fixe ne le reçoit pas.
Exemple : en Sports, « Le chat dort sur le tapis du salon. » est un ballon allongé sur deux lignes, avec ses coutures aux deux bouts.
Reco : **oui**. Même capsule partout ; le décor (reflet, coutures, étoile, paillettes) est sur le contour et les bouts.
Options : A, une forme propre à l'univers quand elle peut s'allonger (ballon de rugby ovale en Sports) ; B, rond pour les choix courts, capsule pour les longs (la forme dépend alors du texte).

**#126.3 Toutes les bulles d'une question ont-elles la même largeur ?**
Contexte : I6 (« même taille et même forme »). Aujourd'hui, la largeur suit le texte.
Exemple : « il / ils / elles » : trois bulles de la même largeur, celle de « elles ».
Reco : **oui**. Même largeur, celle du choix le plus long, sans dépasser l'écran ; même hauteur sur une même ligne.
Option : la largeur suit le texte comme aujourd'hui, seules la forme et la hauteur sont communes.

**#126.4 Quand les bulles sont-elles immobiles ?**
Contexte : 98.3 dit « immobile pendant la lecture de la consigne, et pour de bon dès le premier toucher ». Les choix n'apparaissent qu'après la lecture de la question. Mais trois cas ne sont pas tranchés : « Relire la consigne », la question relue quand on la touche, et les choix lus à voix haute (réglage « tout lire à voix haute »).
Exemple : Léa touche « Relire la consigne » pendant qu'elle cherche ; les bulles s'arrêtent tant que la consigne est lue, puis reprennent.
Reco : immobiles **pendant toute lecture** de la consigne, de la question ou des choix (relectures comprises), puis elles flottent ; immobiles pour de bon dès le premier toucher **sur une bulle ou sur « Je ne sais pas »**. En Muet ou sans voix, elles flottent dès qu'elles apparaissent.
Options : A, seule la première lecture de la consigne les arrête ; B, « Je ne sais pas » ne les arrête pas.

**#126.5 En séance de révision et au test de départ, la question d'un `classer` (« « loup » va dans quelle maison ? ») a-t-elle des bulles qui flottent ?**
Contexte : 98.4 réserve le flottement à `bulles` et `ecoute`. Le domaine donne à cette question le type `bulles` (Plan 98.18).
Exemple : en révision, Léa voit « « loup » va dans quelle maison ? » et trois bulles « ou », « on », « an ».
Reco : **oui**, elles flottent. À l'écran, c'est une question à bulles comme une autre, et aucun fait n'est à ajouter au domaine.
Option : non. Le domaine dirait alors le type d'exercice d'origine de la question (un petit changement d'Apprentissage, par TDD).

**#126.6 Dans `trous`, `conjugaison` et les mots cachés, que devient la bulle juste ?**
Contexte : règle 3 (la bulle s'efface) et règle 4 (le mot rejoint son trou).
Exemple : « Le … dort » ; Léa touche « chat ». La bulle rebondit, le mot « chat » part vers le trou et s'y écrit, le trou s'éclaire un instant, et la bulle vide s'efface sur place.
Reco : **le mot seul voyage** jusqu'au trou ou à la ligne (moins de 400 ms), et la bulle s'efface sur place. L'éclat du trou est court, sans halo qui dure. Si le trou n'est pas visible à l'écran, le mot apparaît dans le trou sans voyager.
Options : A, toute la bulle voyage, puis s'efface dans le trou ; B, pas de voyage : la bulle s'efface et le mot apparaît dans le trou en s'éclairant.

**#126.7 Que font les flèches du clavier sur les bulles ?**
Contexte : 98.15. Les maisons de 98a ne suivent que ← et →, et s'arrêtent aux bouts. Mais à 360 px, les bulles longues sont en colonne.
Exemple : focus sur « le » ; → va sur « la », ↓ aussi ; sur la dernière bulle, → ne fait rien.
Reco : ← → ↑ ↓ suivent l'ordre des bulles et s'arrêtent aux bouts, comme les maisons. Elles **passent les choix écartés**, qui ne répondent plus.
Options : A, ← → seulement, comme les maisons ; B, les écartés restent atteignables, comme avec Tab.

**#126.8 Quelles 6 captures joindre à la PR ?**
Contexte : 98.29 (une capture par univers, sans test). Les états « bonne réponse montrée » et « juste » sont déjà sur la planche.
Exemple : univers Police, à 360 px, avec les mouvements réduits : une question de `bulles` à trois choix, dont un écarté.
Reco : **une question de `bulles` à 3 choix, après une erreur** (un choix écarté, deux au repos), à 360 px, avec les mouvements réduits, dans chacun des 6 univers.
Options : A, 12 captures (en plus, un `trous` avec la bonne réponse montrée) ; B, un choix long sur deux lignes à la place.

**#126.9 Les bulles flottent-elles toutes ensemble, ou chacune à son tour ?**
Contexte : I6 (« toutes flottent pareil ») et I3 (pas de hasard dans l'habillage).
Exemple : trois bulles qui ondulent de 3 px en 3 s ; la deuxième part un tiers de temps après la première.
Reco : même amplitude (3 px au plus) et même durée ; un **décalage régulier selon le rang**, jamais tiré au hasard.
Option : toutes en même temps, du même mouvement.

**#126.10 Un choix écarté : comment le montrer sur un dessin d'univers ?**
Contexte : aujourd'hui, la bulle écartée est pâle (opacité 0,45). Sur un dessin coloré, le texte devient difficile à lire.
Exemple : en Danse, « ils » est écarté : la bulle devient gris pâle, sans paillettes, et le mot reste lisible.
Reco : un **signal commun** : le dessin passe en gris pâle, sans décor de l'univers, et le texte garde un contraste d'au moins 4,5:1. Il est identique dans les 6 univers.
Option : comme aujourd'hui, toute la bulle pâlit, dessin compris.

## Termes à signaler (glossaire, ajouts seulement)

Rien n'est écrit au glossaire par ce modèle.

- **Bulle de l'univers** (mot de cadrage et de planche, comme « dessin de l'univers » de #98) : le dessin de la bulle de choix propre à un univers. Jamais à l'écran ni dans le domaine.
- **Bulle** : deux sens à l'écran. C'est la **bulle de choix** (décision n°30, mot d'interface d'un **Choix**) et la **bulle** du personnage guide (où il parle ; voir **Consigne affichée**). Proposition : toujours écrire « bulle de choix » dans les scénarios et le cadrage, jamais « bulle » seul.
- **Ballon**, **bulle de savon**, **bulle d'eau**, **bulle à paillettes**, **étoile d'insigne** : mots de planche seulement. Aucun n'est lu à voix haute ni affiché : le libellé lu reste le texte du choix (I11, I14).
- **Jeton** : déjà un terme d'Apprentissage (**Boîte à jetons**, **Jeton**). Il ne nomme pas la bulle de choix en Police. **Badge** : terme de Motivation, pas employé non plus.
- **Éclater**, **crever** : à ne pas employer pour la bulle juste (98.5). Dire « s'efface ». Le nom technique `data-eclatee` reste, par dette (vigilance 10).
- **Choix écarté** : son synonyme interdit « bulle grisée » vaut aussi pour les nouveaux noms du code (pas de `grisee`).
- **Flotter**, **le mot rejoint son trou**, **éclat du trou** : mots d'interface, comme ceux de #98 (décision n°30).
