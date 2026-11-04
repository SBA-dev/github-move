# Modèle du domaine : issue #129, textes qui se dévoilent comme un parchemin (tranche 98e)

Épopée #95. Tranche **98e** du découpage de #98 (`docs/stories/98/domain-model.md`, abrégé « #98 » ci-dessous). Dépendances mergées : #97 (retours animés et sonores), #98 (98a, socle) et #126 (98b, bulles de choix). Stories voisines en parallèle : #128 (claviers) et #131 (boîte et barres).

État : **validé par le PO le 2026-11-03 (« 129 reco tout »)** : toutes les recos des questions #129.1 à #129.11 sont retenues (#129.10 et #129.11 sont posées dans `acceptance.md`). La planche `parchemin.png` attend encore sa validation univers par univers (98.28).

Ce modèle ne recopie pas #98. Il renvoie à ses **invariants** (I1 à I20) et à ses **questions tranchées** (98.1 à 98.32), et ne garde que ce qui est propre au parchemin.

## Contexte

### Rien de nouveau dans Apprentissage

La tranche change seulement l'**affichage** du texte de `lecture` et des vers de `memoriser` pendant leur première lecture. Il n'y a **ni agrégat, ni value object, ni commande, ni événement de domaine, ni erreur métier d'Apprentissage, ni migration, ni Edge Function, ni donnée d'enfant nouvelle**. La context map ne change pas : le front lit déjà la clé d'univers (`CleUnivers`, Motivation) par `useUnivers()`, et l'état de la voix par `useVoix()` (Voix).

Contexte concerné : **Apprentissage** (le texte, les vers, l'ordre des temps de la poésie), lu par `src/`. **Voix** dit quel mot est prononcé, si la parole a été entendue et si le son est en Muet. **Motivation** fournit la clé d'univers.

**Une seule exception possible, dans Voix** (et non dans React) : si la « ligne » de `lecture` est la **phrase** (#129.1, reco), le découpage du texte affiché en phrases est une règle de texte. Elle existe déjà dans Voix pour la lecture (`texteALire(...).phrases`, glossaire **Lecture à voix haute** : « phrase par phrase »), mais sur le texte **prononcé**, alors que l'écran numérote les mots du texte **affiché** (`motsDeLaConsigne`). Il faut une lecture pure de plus dans `@domain/voix` qui dise, pour chaque mot affiché, le rang de sa phrase, avec la **même** coupure que la voix. Elle se fait par TDD dans le domaine ; React ne recoupe jamais le texte lui-même.

### Ce qui est lu (faits existants)

| Règle de la tranche | Fait lu | Où | Existe ? |
|---|---|---|---|
| `lecture` : mot prononcé du texte | `rangDuMotDuTexte` (rang dans `motsDeLaConsigne(texte)`), remis à `undefined` par `onFin` | `useQuestionsAChoix.lireLeTexte`, `useDeroulementDeRevision.lireLeTexte` | Oui |
| `lecture` : phrase du mot prononcé | Rang de la phrase d'un mot affiché | `@domain/voix` | **Non** : lecture pure à ajouter si #129.1 = phrase |
| `lecture` : la lecture du texte est finie ou coupée | Fin de `lire(texte)` (`onFin`, appelé aussi quand la voix est bloquée ou coupée) et `ParoleEntendue.entendue` | `LectureAVoixHaute.lire` | Oui, mais `onFin` **n'est pas appelé en Muet** (retour immédiat) : voir vigilance 2 |
| `lecture` : « J'ai écouté » touché | `positionDuTexteEcoute` (séance), `texteEcoutePour` (révision) | idem | Oui |
| `memoriser` : vers en cours de lecture | `versLu.rang`, posé **avant** chaque `lire(vers)` | `useMemorisation.lireLesVers` | Oui |
| `memoriser` : fin de l'écoute | Passage du temps `ecoute` à `redire` (« Je suis prêt ») | `useMemorisation` | Oui |
| Muet, voix bloquée, pas de voix | `voix.son === "muet"`, `nomDuPersonnageGuideDeLaVoixBloquee`, `syntheseVocalePresente`, `paroleEntendue` | `useVoix`, `usePersonnageQuiParle` | Oui |
| Mouvements réduits | `useMouvementsReduits()` (réactif) | `src/transitions/mouvements-reduits.ts` | Oui |

### Où le texte est joué (I12, 98.13)

| Écran | `lecture` | `memoriser` |
|---|---|---|
| Séance | `ExerciceAChoix` → `TexteDeLecture` | `ExerciceDeMemorisation`, liste des vers (temps `ecoute` et `redire`) |
| Séance de révision et défi | `DeroulementDeLaRevision` → `TexteDeLecture` (même composant) | Pas de question de `memoriser` (`posables` n'en rend aucune) |
| Test de départ | Aucune question (`plan-du-test-de-depart.ts` : 0) | Aucune question |

Le parchemin vaut donc en séance (les deux types) et en séance de révision et défi (`lecture`), sans rien de propre au test de départ.

### Ce qu'est la « première lecture »

C'est la lecture **automatique** du texte quand l'exercice (ou la question de révision) s'ouvre : en `lecture`, l'introduction puis `lire(texte)` ; en `memoriser`, l'annonce puis les vers un par un. Aujourd'hui :
- en `lecture`, « Réécouter » pendant le texte relit la dernière **parole** du personnage guide, c'est-à-dire l'introduction, pas le texte ; et « J'ai écouté » coupe la voix (`faireSilence`) et passe aux questions ;
- en `memoriser`, « Réécouter » pendant l'écoute **reprend la poésie au premier vers** (`useMemorisation.reecouter`) ;
- une relecture de la présentation (« Réécouter » pendant la consigne) rouvre l'exercice et relance la lecture du texte.

Reco : **ce qui est dévoilé ne se cache plus** jusqu'à la fin de l'exercice. Une reprise (Réécouter, réouverture) ne réenroule pas le parchemin (#129.4).

## Règles de la tranche (4)

1. **Le texte se déroule pendant la première lecture.** En `lecture`, le texte se dévoile **phrase après phrase** (#129.1) : une phrase apparaît en entier quand la voix commence son premier mot, et le mot prononcé reste surligné comme aujourd'hui. En `memoriser`, les vers se dévoilent **vers après vers**, au début de la lecture de chacun, et le vers lu reste mis en avant (`data-lu`). Le titre (et la carte de la poésie) est visible dès le début. À la fin de la lecture, tout reste visible pour les questions, pour redire et pour les entraînements (98.12). Un toucher sur le parchemin ne fait rien : il ne saute pas la lecture (comme 97.17) ; c'est « J'ai écouté » qui la termine.
2. **Sans voix, tout le texte tout de suite.** En Muet, avec la voix bloquée ou sur un appareil qui ne sait pas lire à voix haute, le texte entier est visible dès l'ouverture (98.12 ; 97.2 : Muet coupe seulement la voix). Si la voix s'arrête avant la fin (« J'ai écouté », passage en Muet, voix bloquée en plein milieu, parole non entendue, sortie de l'exercice), **tout s'ouvre aussitôt** (#129.3). Un enfant qui lit seul n'attend jamais la voix.
3. **Mouvements réduits : tout le texte tout de suite.** Rien ne se déroule (I9). Le dessin du parchemin est là, ouvert, et le mot prononcé est surligné comme aujourd'hui. Le réglage est lu par le hook réactif : s'il change pendant la lecture, tout s'ouvre.
4. **Parchemin de l'univers.** Dans chacun des 6 univers, le support du texte a le dessin de l'univers (tableau ci-dessous). Le texte reste du **texte** (mode dys, syllabes en couleur, contraste 4,5:1 : I10, I18), jamais dans le dessin. Les gestes, les textes, les voix et les annonces ne changent pas (I14). Planche `parchemin.png` validée par le PO univers par univers (98.28), 6 captures avec la PR (98.29), PR qui attend les 6 dessins validés (98.31).

Invariants de #98 qui s'appliquent sans changement : I1, I2, I3, I5 (le déroulement ne retarde jamais la voix ni l'écran suivant), I9, I10, I11, I12, I13, I14, I16 (repli sur « animaux »), I17, I18, I20. I4, I6, I7, I8, I15 et I19 ne concernent pas le parchemin, qui n'est pas une cible de réponse ; I15 vaut pour ses signaux communs (mot prononcé surligné, vers lu).

## Termes

| Terme | Statut | Remarque |
|---|---|---|
| Parchemin | Mot d'interface (#98, décision n°30), hors glossaire | Nomme le support du texte et son déroulement. Jamais dans le domaine. Il n'est ni lu ni annoncé : le libellé reste le texte (I11) |
| Parchemin de l'univers | Mot de cadrage et de planche (comme « bulle de l'univers », #126) | Le dessin du parchemin propre à un univers |
| Première lecture | Mot de cadrage | La lecture automatique à l'ouverture (voir plus haut). Pas un fait du domaine |
| Phrase | Déjà employé par **Lecture à voix haute** (Voix, « phrase par phrase ») | Unité de déroulement de `lecture` si #129.1 = A |
| Vers | Glossaire (Catalogue), synonymes interdits « ligne, phrase » | En `memoriser`, on dit **vers après vers**, jamais « ligne après ligne » |
| Ligne | **Conflit** : synonyme interdit de **Vers** | L'issue dit « ligne après ligne » pour `lecture`. Un texte de `lecture` n'a pas de lignes dans le format (`texte` est une chaîne sans retour à la ligne : 29 textes de 170 à 489 caractères). Voir #129.1 |
| Muet, Voix bloquée, Parole entendue | Glossaire (Voix) | Sans changement |
| Feuille d'arbre, parchemin royal, tableau de l'entraîneur, carnet d'enquête, carnet de bord, partition | Mots de planche seulement | Jamais affichés ni lus (I14) |

Rien n'est écrit au glossaire ni à la context map par ce modèle (mots d'interface hors glossaire, décisions n°16 et n°30). Si #129.1 = A, la lecture pure ajoutée à Voix est nommée par le test-writer à partir de « phrase » et « mot affiché ».

## Modèle

Aucun agrégat, aucune entité, aucun value object nouveau. Diagramme inutile.

**Commandes** : aucune. « J'ai écouté » et « Je suis prêt » restent ce qu'ils sont.

**Lecture pure à ajouter (seulement si #129.1 = A)**, dans `@domain/voix` : pour un texte affiché, le rang de la phrase de chaque mot affiché (rangs de `motsDeLaConsigne`), avec la coupure de `texteALire` (après `.`, `!`, `?`, `…`, `:`). Règle de validité : chaque mot affiché a une phrase ; les rangs de phrase vont de 0 à n−1 sans trou ; un texte d'une seule phrase donne 0 partout. Cas à tester : guillemets « … », points de suspension, deux-points, texte sans ponctuation finale.

**Erreurs métier** : aucune.

## Objets par univers (parchemin)

Partent de la ligne 98e du tableau « Pistes pour les tranches suivantes » de #98. Ce sont **des propositions** (#129.6), soumises ensuite au PO sur la planche, univers par univers (98.28).

### Contraintes communes

- **Forme** : le texte de `lecture` va jusqu'à 489 caractères, soit une quinzaine de lignes à 360 px, plus en mode dys. Le parchemin est un **support qui s'allonge** : haut et bas dessinés et fixes (rouleaux, reliure, bord), milieu uni qui s'étire avec le texte, sans `viewBox` étiré.
- **Texte** : centre **uni et clair** derrière le texte, à 4,5:1 en mode dys aussi, avec le surlignage du mot prononcé et le vers lu mis en avant. Pas de lignes, de carreaux ni de portées derrière le texte (le mode dys les supporte mal).
- **Aucun texte, lettre ni chiffre** dans le dessin (skill `illustration`, section 1) : pas de « X » et « O » de tactique, pas de numéro de page, pas de note de musique écrite en lettres.
- **Rien qui brille comme la bonne réponse montrée** (I15).
- **Se déroule en douceur** : rien ne se déchire, ne brûle ni ne claque. Aucun son ajouté : le son reste celui de la voix et de #97.
- **Règle absolue** (I20), à toutes les tailles.

### Propositions

| Univers | A (reco) | Autre idée | À éviter |
|---|---|---|---|
| Animaux de la forêt | **Grande feuille d'arbre** : feuille vert clair, nervure seulement sur le bord, petite tige en haut ; le bas se déroule comme une feuille qui s'ouvre | Écorce de bouleau claire | Nervures derrière le texte (contraste) ; insecte |
| Princesses et fées | **Parchemin royal** : rouleaux dorés pâles en haut et en bas, petit ruban rose sur le rouleau du haut | Livre de contes ouvert | Sceau de cire rouge qui coule ; couronne qui brille (I15) |
| Sports | **Tableau de l'entraîneur** : tableau blanc à cadre arrondi, petit sifflet accroché au bord | Carnet de l'entraîneur | Croix et ronds de tactique (lettres), score, classement, podium, coupe (I20, skill `gamification` section 5). Voir #129.7 : c'est aussi la piste de la case de la dictée de #128 |
| Police | **Carnet d'enquête** : carnet bleu à spirale, petite loupe dessinée dans un coin | Carnet de l'agent, couverture bleue à liseré | Empreintes, avis de recherche, photo, menottes, arme, lampe qui clignote (I20). Voir #129.8 sur le mot « enquête » |
| Pompiers | **Carnet de bord de la caserne** : carnet rouge clair à reliure, petit casque de pompier dessiné sur la couverture | Tableau de la caserne | Flamme, fumée, maison qui brûle, sirène, gyrophare, extincteur (I20) |
| Danse | **Partition** : feuille claire, portées **seulement en haut et en bas**, une clé de sol dans un coin | Programme du spectacle | Portées derrière le texte (contraste, dys) ; personnage ou tenue (I20) |

### États à dessiner (planche `parchemin.png`, 98.28)

Une ligne par univers (animaux, princesse, sports, police, pompier, danse), une colonne par état, à la taille réelle sur 360 px et au double, fond clair et fond sombre. Texte d'exemple : un texte court et neutre de deux phrases, puis un texte long sur une quinzaine de lignes.

| Colonne | État |
|---|---|
| 1 | Roulé : titre seul, pendant l'introduction |
| 2 | À mi-déroulement : deux phrases visibles, un mot surligné |
| 3 | Ouvert, texte long, mode normal |
| 4 | Ouvert, texte long, mode dys (Andika, syllabes en couleur) |
| 5 | Poésie : quatre vers visibles, le troisième mis en avant (`data-lu`) |

Esquisses, contrôle et planches dans `docs/stories/129/planches/` (méthode de #98). Le code avance pendant l'attente ; la PR attend les 6 dessins validés (98.31). Total : 6 dessins d'univers, 1 planche de 30 cases, 6 captures (#129.9).

## Invariants

En plus des invariants de #98 rappelés plus haut, propres à la tranche :

- **P1. Le parchemin ne cache le texte que pendant la première lecture** (98.12), et seulement quand la voix lit vraiment. Une phrase ou un vers dévoilé ne se cache plus jusqu'à la fin de l'exercice.
- **P2. Aucun texte caché devant une question.** Quand les questions de `lecture` apparaissent, et quand « Je suis prêt » apparaît, tout le texte est visible.
- **P3. Le déroulement suit la voix, il ne la mène pas.** Il ne retarde ni la voix, ni « J'ai écouté », ni l'écran suivant (I5) ; chaque dévoilement tient en moins de 400 ms.
- **P4. La mise en page ne saute pas.** La place du texte entier est gardée dès l'ouverture : « J'ai écouté » et « Je suis prêt » ne bougent pas sous le doigt pendant le déroulement (#129.5).
- **P5. Les lecteurs d'écran lisent le texte entier, comme aujourd'hui** (I11) : une phrase pas encore dévoilée est cachée à l'œil, pas retirée de la page (#129.5).
- **P6. Le parchemin de l'univers ne change que le dessin** (I14, I16, I17, I18) : même texte, mêmes voix, même surlignage, même mise en page dans les 6 univers.

## Points de vigilance techniques

1. **Mot prononcé jamais signalé.** Certaines voix du navigateur ne signalent pas les mots (`onMot` jamais appelé). Le texte resterait roulé toute la lecture. Il faut une issue sans attente : voir #129.2.
2. **Muet.** En Muet, `lire` rend « non entendue » tout de suite et **n'appelle pas `onFin`** ; en `memoriser`, les vers défilent en environ 250 ms chacun. Le front décide « tout visible » d'après l'état du son **avant** de dérouler, pas d'après `onFin`. Même chose avec un message de voix bloquée déjà visible, ou sans synthèse vocale.
3. **Voix bloquée en plein milieu.** `lire` rend « non entendue » et appelle `onFin` : tout s'ouvre. En `memoriser`, une parole non entendue ouvre tous les vers, même si la boucle continue.
4. **Composants partagés.** `TexteSurligne` sert aussi à la bulle du personnage guide : on ne change pas son comportement pour tous, on habille `TexteDeLecture` et la liste des vers de `ExerciceDeMemorisation`. On ne touche ni à `ChoixDeLaQuestion`, ni au mot qui voyage (#126), ni aux composants de #128 et #131. `src/styles.css` : styles du parchemin dans un bloc à part.
5. **`TexteDeLecture` sert à la séance et à la révision** : les deux passent l'état « dévoilé jusqu'à » de la même façon, sans dupliquer la règle (un seul hook ou une seule fonction d'affichage).
6. **Attributs lus par les scénarios** (comme 98a et 98b) : `data-univers` sur le parchemin ; un attribut d'état de dévoilement par phrase et par vers (à nommer par l'implementer) ; `data-lu`, `data-prononce` et `data-temps` gardés. Les scénarios ne lisent jamais un tracé.

## Événements

Aucun. L'affichage réagit aux faits existants (mot prononcé, vers lu, fin de la lecture, parole entendue, temps de la poésie, état du son).

## Partage avec le front et données d'enfants

Tout se passe dans le navigateur, hors ligne compris (`@domain/apprentissage`, `@domain/voix`, `@domain/motivation`). Les dessins sont des SVG dans le code (décision 0027). Aucune donnée nouvelle, rien d'enregistré ni d'envoyé, rien envoyé à l'IA.

## Emplacement

- Domaine Apprentissage : **rien**.
- Domaine Voix (seulement si #129.1 = A) : `supabase/functions/_shared/voix/domain/mots-de-la-consigne.ts` (ou un fichier voisin) et son test, export dans `supabase/functions/_shared/voix/domain/index.ts`.
- Front (indicatif) :
  - `src/seance/exercices/parchemins/` : le dessin du parchemin et la table `Record<CleUnivers, …>` des 6 dessins, sur le modèle de `maisons/dessins/` et `bulles-de-choix/` ;
  - `src/seance/exercices/TexteDeLecture.tsx` et la liste des vers de `ExerciceDeMemorisation.tsx` ;
  - un hook d'affichage du dévoilement, branché sur `useQuestionsAChoix`, `useDeroulementDeRevision` et `useMemorisation` ;
  - `src/styles.css`.
- Planches : `docs/stories/129/planches/`. Captures : `docs/stories/129/captures/`.
- Scénarios : `features/129-parchemin.feature`.

## Questions tranchées

Toutes tranchées par le PO le 2026-11-03 (« 129 reco tout ») : la reco est retenue à chaque question. #129.10 (parchemin roulé pendant la présentation de l'histoire) et #129.11 (la séance de révision s'enchaîne comme la séance) sont dans `acceptance.md`.

**#129.1 En `lecture`, le texte se déroule-t-il phrase après phrase ?**
Contexte : l'issue dit « ligne après ligne », mais un texte de `lecture` n'a pas de lignes : c'est un seul paragraphe de 170 à 489 caractères. Une ligne à l'écran dépend de la largeur et du mode dys ; « ligne » est aussi un synonyme interdit de **Vers**. Le personnage guide lit déjà « phrase par phrase » (glossaire).
Exemple : « Le hérisson se réveille. Il cherche des pommes. » : la première phrase apparaît quand la voix dit « Le », la seconde quand elle dit « Il ».
Reco : **oui, phrase après phrase**, avec la coupure de la voix (lecture pure dans `@domain/voix`, par TDD).
Décision (PO, 2026-11-03, « 129 reco tout ») : **tranchée, reco retenue**.
Options : A, ligne d'écran après ligne d'écran (affichage seul, sans domaine, mais le déroulement change avec la largeur et le mode dys) ; B, mot après mot.

**#129.2 Si la voix lit sans signaler les mots, le texte s'ouvre-t-il en entier tout de suite ?**
Contexte : certaines voix d'appareil lisent sans dire quel mot est prononcé. Sans cela, le parchemin resterait roulé jusqu'à la fin de la lecture.
Exemple : sur une tablette dont la voix ne signale pas les mots, aucun mot n'est surligné après 2 secondes : le texte entier apparaît.
Reco : **oui** : si aucun mot n'est signalé dans les 2 premières secondes du texte, tout s'ouvre.
Décision (PO, 2026-11-03, « 129 reco tout ») : **tranchée, reco retenue**.
Option : dévoiler les phrases à un rythme fixe, sans suivre la voix (risque de décalage avec ce qu'on entend).

**#129.3 Si la lecture s'arrête avant la fin (« J'ai écouté », Muet, voix bloquée, sortie), tout le texte s'ouvre-t-il aussitôt ?**
Contexte : règle 2 et 98.12 (« un enfant qui lit seul n'attend jamais la voix »).
Exemple : Léa touche « J'ai écouté » à la deuxième phrase : le texte entier apparaît avec la question.
Reco : **oui**, dans tous ces cas.
Décision (PO, 2026-11-03, « 129 reco tout ») : **tranchée, reco retenue**.
Option : seul « J'ai écouté » ouvre tout ; une voix coupée laisse le parchemin où il en est (l'enfant ne pourrait plus lire la suite).

**#129.4 Quand la poésie reprend au premier vers (« Réécouter » pendant l'écoute), ou que l'exercice est rouvert, les vers déjà dévoilés restent-ils visibles ?**
Contexte : 98.12 limite le parchemin à la **première** lecture.
Exemple : Léa écoute trois vers, touche « Réécouter » : les trois vers restent visibles, le vers lu repasse au premier, puis le quatrième se dévoile à son tour.
Reco : **oui** : ce qui est dévoilé ne se cache plus jusqu'à la fin de l'exercice.
Décision (PO, 2026-11-03, « 129 reco tout ») : **tranchée, reco retenue**.
Option : le parchemin se réenroule et se déroule à nouveau à chaque reprise.

**#129.5 Pendant le déroulement, la place du texte entier est-elle gardée, et les lecteurs d'écran lisent-ils tout le texte ?**
Contexte : I11 (lecteurs d'écran inchangés), et règle de #126 (rien ne saute sous le doigt).
Exemple : pendant la lecture, le parchemin a déjà sa taille finale ; « J'ai écouté » ne descend pas au fil des phrases.
Reco : **oui aux deux** : le déroulement est visible seulement à l'œil (le bas du parchemin descend dans une place déjà réservée).
Décision (PO, 2026-11-03, « 129 reco tout ») : **tranchée, reco retenue**.
Option : le parchemin grandit avec le texte, et « J'ai écouté » descend au fil des phrases.

**#129.6 Quel parchemin dessine-t-on dans chaque univers ?**
Contexte : 98.2 (un dessin par univers), piste de #98 reprise avec des précautions (tableau « Propositions »).
Exemple : en Pompiers, le texte est écrit sur la page claire d'un carnet rouge clair, avec un petit casque sur la reliure.
Reco : **A** : Animaux, grande feuille d'arbre ; Princesses et fées, parchemin royal ; Sports, tableau de l'entraîneur ; Police, carnet d'enquête ; Pompiers, carnet de bord de la caserne ; Danse, partition (portées en haut et en bas seulement).
Décision (PO, 2026-11-03, « 129 reco tout ») : **tranchée, reco retenue**.
Options : B, l'« autre idée » du tableau pour un ou plusieurs univers ; C, tu donnes l'objet.

**#129.7 En Sports, le « tableau de l'entraîneur » est aussi la piste de la case de la dictée (#128). D'accord pour le garder pour le parchemin ?**
Contexte : deux écrans différents avec le même objet pourraient se confondre ; #128 n'a pas encore tranché.
Exemple : en dictée, les cases sont des cases d'un tableau ; en lecture, tout le texte est sur un tableau blanc.
Reco : **oui**, le garder : la forme est différente (cases contre grand tableau) et l'univers reste reconnaissable.
Décision (PO, 2026-11-03, « 129 reco tout ») : **tranchée, reco retenue**.
Option : en Sports, le parchemin devient un carnet de l'entraîneur.

**#129.8 En Police, garde-t-on « carnet d'enquête » comme nom de l'objet ?**
Contexte : « enquête » peut faire penser à un délit ; le nom n'est jamais affiché ni lu, mais il guide le dessin.
Exemple : un carnet bleu à spirale, avec une petite loupe dans un coin, sans aucun indice ni photo.
Reco : **oui**, avec un dessin limité au carnet et à la loupe.
Décision (PO, 2026-11-03, « 129 reco tout ») : **tranchée, reco retenue**.
Option : « carnet de l'agent ».

**#129.9 Quelles 6 captures joindre à la PR ?**
Contexte : 98.29 (une capture par univers, sans test). Les captures se font avec les mouvements réduits : le texte y est donc entier (règle 3). Les états de déroulement sont sur la planche.
Exemple : univers Danse, à 360 px : un texte de `lecture` ouvert, avec la première question en dessous.
Reco : **un exercice de `lecture`, texte entier visible avec sa première question**, à 360 px, dans chacun des 6 univers.
Décision (PO, 2026-11-03, « 129 reco tout ») : **tranchée, reco retenue**.
Options : A, 12 captures (en plus, une poésie au temps « redire ») ; B, la capture en mode dys.

## Historique

| Date | Changement |
|---|---|
| 2026-11-03 | Cadrage de la tranche, questions #129.1 à #129.9 posées au PO. |
| 2026-11-03 | Validé par le PO (« 129 reco tout ») : recos de #129.1 à #129.11 retenues. |
