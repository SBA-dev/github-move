# Critères d'acceptance de la story #166 : une musique propre à chaque univers pour les célébrations

Scénarios : `features/166-musiques-des-univers.feature` (nouveaux), plus les scénarios existants de #106, #102 et #97
listés plus bas. Les décisions « 106.n » et « 97.n » renvoient à `docs/stories/106/acceptance.md` et
`docs/stories/97/acceptance.md`.

## Objectif

En tant qu'enfant, je veux entendre la musique de mon univers quand mon personnage guide fête ma victoire (premier
défi relevé, matière réussie, tenue reçue), afin de reconnaître le monde que j'ai choisi.

Aujourd'hui, les six célébrations de l'univers jouent toutes « grande victoire » (106.27 resté ouvert). La story
remplace ce son par une musique choisie par le PO à l'écoute pour chaque univers (décision 106.12 : la musique
remplace « grande victoire », un seul son, 3 s au plus, décision 0039 ; la parole vient après).

Choix du PO à l'écoute (2026-11-06, mot pour mot) : « 166 Sports aucun, Danse A, Animaux de la forêt B, Princesses
et fées C, Police aucun, Pompiers C ». Danse (Lili), Animaux de la forêt (Noisette), Princesses et fées (Lumi) et
Pompiers (Capitaine Sam) ont leur musique ; Sports (Coach Léo) et Police (Agent Max) gardent « grande victoire »
(166.4 A), une issue de suivi est ouverte pour eux.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| R1 | Un univers qui a sa musique de célébration la fait entendre à la place de « grande victoire » : jamais les deux, et jamais « grande victoire » pendant sa célébration de l'univers | **Nouveaux** (`166`) : « Au premier défi relevé dans l'univers « <univers> », <musique> se fait entendre à la place de « grande victoire » » (4 exemples : Danse, Animaux de la forêt, Princesses et fées, Pompiers) · « La séance qui rend les sciences du CE1 réussies fait entendre la musique de la célébration de Noisette, pas « grande victoire » » |
| R1b | Un univers pour lequel le PO n'a retenu aucune musique garde « grande victoire » pour sa célébration de l'univers, jusqu'à l'issue de suivi (166.4 A) | **Nouveau** (`166`) : « Au premier défi relevé dans l'univers « <univers> », la célébration de l'univers fait toujours entendre « grande victoire » » (2 exemples : Sports, Police) |
| R2 | La musique passe avant la parole du personnage guide, jamais par-dessus ; quand la séance donne aussi une nouveauté : la musique, puis « découverte », puis la parole (106.46) | **Existants** (`106`) : les six « Au premier défi relevé dans l'univers … » (l. 98, 254, 317, 380, 443, 506), dont l'étape « Léa entend la musique de la célébration de <personnage guide>, puis … dit … » attendra désormais la musique de **cet** univers (« grande victoire » pour Coach Léo et Agent Max, 166.4 A) · **Modifié** (`102`, l. 141) : « Une séance qui fait recevoir une tenue <cas> fait entendre <effets sonores> avant la phrase de fin » (exemples passés de « grande victoire » à « la musique de la célébration de Noisette puis l'effet sonore « découverte » ») |
| R3 | La musique ne retient jamais l'enfant : un toucher hors des boutons la laisse finir, un bouton ou le clavier l'arrête | **Existants** (`106`, l. 185 et 191, avec Coach Léo) |
| R4 | Muet et écrans du parent : le Muet ne coupe pas la musique (seule la parole), un écran du parent l'arrête (97.2, 106.11, 97.13) | **Existants** (`106`, règle l. 228 : scénarios l. 230 et 238), confirmés par 166.1 A |
| R5 | Non-régression : quand aucune célébration de l'univers n'est jouée, « grande victoire » reste le son de la leçon acquise et du record de fluence ; un défi rejoué garde « séance terminée » | **Existants** (`97`) : Plan l. 203, exemples « qui rend la leçon acquise… » (l. 216 à 218, univers « Animaux de la forêt », aucun palier des tenues franchi) · « Rejouer une leçon déjà acquise… » (l. 222) · fluence l. 256, 268, 283 · (`106`) « Rejouer un défi relevé fait entendre « séance terminée »… » (l. 163) |

Couverture sans scénario (tests du domaine et review) :
- les entrées Danse, Animaux de la forêt, Princesses et fées et Pompiers du catalogue des célébrations ont leur
  musique, aucune n'est `grandeVictoire` ; Sports et Police gardent `grandeVictoire` (166.4 A) ;
- les quatre musiques sont distinctes entre elles et des 8 effets sonores existants (166.2 A) ; 30 Ko au plus par
  musique, MP3 mono 128 kbit/s (166.3 A) ;
- chaque musique est un `EffetSonore` de Voix, nommé d'après le son et pas d'après l'univers (106.12) ;
- durée : 3 s au plus (garde existante du lecteur d'effets sonores, décision 0039) ;
- hors ligne : les nouveaux MP3 sont précachés comme les 8 effets sonores existants (#8) ; le mécanisme est déjà
  couvert par le scénario `@pwa` de #97 (l. 354), sans nouveau scénario (166.5 B) ;
- contenu (règle absolue de `CLAUDE.md`) : sons joyeux, sans voix ni parole, sans sirène, alarme, cri, bruit d'arme
  ni son effrayant, même pour Police et Pompiers ; licence CC0 consignée dans `docs/sons.md`. Vérifié à l'écoute
  par le PO et en review.

## Étapes Gherkin

Une étape nouvelle dans `features/166-musiques-des-univers.feature` ; les autres existent déjà (steps de #106, #97
et #4). Travail pour l'e2e-tester :
1. **Étape nouvelle** (scénario « La séance qui rend les sciences du CE1 réussies fait entendre la musique de la
   célébration de Noisette, pas « grande victoire » ») :
   `Alors Léa entend la musique de la célébration de Noisette`
   (même vérification que l'étape existante « Léa entend la musique de la célébration de Coach Léo »,
   `celebration-de-l-univers.steps.ts` l. 483, avec la musique de Noisette ; on peut généraliser l'expression aux
   personnages guides).
2. `features/steps/celebration-de-l-univers.steps.ts` : la constante `MUSIQUE = "grande victoire"` devient une
   musique **par personnage guide** : Lili, Noisette, Lumi, Capitaine Sam ont leur musique ; Coach Léo et Agent Max
   gardent « grande victoire » (166.4 A). Étapes concernées : « Léa entend la musique de la célébration de
   <personnage guide>, puis … dit … », « Léa entend la musique de la célébration de Coach Léo », « … jusqu'au
   bout », « Léa n'entend plus la musique … ».
3. L'étape existante « Léa entend l'effet sonore « grande victoire », puis <personnage guide> dit « … » »
   (`celebration-de-l-univers.steps.ts` l. 535, accepte Coach Léo et Agent Max) sert au Plan de R1b.
4. L'étape « Paul a changé l'univers du profil enfant de Léa en « … » » (`profils-enfants.steps.ts` l. 253) ne
   rechoisit l'enfant après le changement d'univers que sous `@issue-106` : à étendre à `@issue-166` (Plans de R1
   et R1b, scénario des sciences).
5. Vérifier que l'étape générique de #97 « Léa n'entend pas l'effet sonore « grande victoire » »
   (`retours-animes-et-sonores.steps.ts`, l. 555) fonctionne dans le contexte de la célébration de l'univers.
6. Étape déjà adaptée dans `features/102-personnage-guide-evolue.feature` (l. 147 et exemples l. 154-155) :
   `Alors Léa entend la musique de la célébration de Noisette puis l'effet sonore « découverte », puis Noisette dit sa phrase de fin`
   (Noisette a sa musique : reste valable).

## Périmètre E2E à rejouer avant la PR

Génération : `npx bddgen --tags "@socle or @issue-97 or @issue-102 or @issue-106 or @issue-141 or @issue-166"` (à
ajuster aux stories livrées du contexte, voir `CLAUDE.md`), puis, sur le projet `telephone` :
- tout `@issue-106` et tout `@issue-166` ;
- `@issue-102` : le Plan « Une séance qui fait recevoir une tenue <cas> fait entendre <effets sonores> avant la
  phrase de fin » (l. 141) ;
- `@issue-97`, son de fin et « grande victoire » :
  - l. 203 « Une séance terminée <cas> fait entendre <effets sonores> avant la phrase de fin » ;
  - l. 222 « Rejouer une leçon déjà acquise fait entendre « séance terminée », pas « grande victoire » » ;
  - l. 256, 268, 275, 283 (record de fluence et « grande victoire ») ;
  - l. 308 « En Muet, la fin de la séance fait entendre son effet sonore, sans phrase de fin dite » et l. 318
    « Passer en Muet pendant l'effet sonore de fin le laisse finir, sans phrase de fin dite » ;
  - l. 397, 407, 416 (confettis de la fin : toucher, « Accueil », clavier).

Filtre proposé :
`--grep "@issue-106|@issue-166|Une séance terminée|Rejouer une leçon déjà acquise|fluence|record|En Muet, la fin de la séance|Passer en Muet pendant l'effet sonore de fin|Pendant les confettis|pendant les confettis|Une séance qui fait recevoir une tenue" --grep-invert "@depend-de|@envoi-email|@hors-beta"`

## Choix des musiques par le PO

Protocole suivi (page d'écoute `docs/stories/166/ecoute.md`, 2 ou 3 sons CC0 par univers, repérés A, B, C). Réponse
du PO, mot pour mot : « 166 Sports aucun, Danse A, Animaux de la forêt B, Princesses et fées C, Police aucun,
Pompiers C ».

| Univers | Personnage guide | Choix | Effet sonore (code) |
|---|---|---|---|
| Sports | Coach Léo | aucun | « grande victoire » gardé (166.4 A) |
| Danse | Lili | A | `airDeSaxophone` |
| Animaux de la forêt | Noisette | B | `airDeCordesPincees` |
| Princesses et fées | Lumi | C | `airDeSteelDrumCourt` |
| Police | Agent Max | aucun | « grande victoire » gardé (166.4 A) |
| Pompiers | Capitaine Sam | C | `airDeSteelDrumLong` |

Les sons retenus portent un nom d'après le son (pas d'après l'univers) et leur licence va dans `docs/sons.md`.
Sports et Police : issue de suivi pour leur trouver une musique.

## Hors périmètre

- Les célébrations elles-mêmes (dessins, variantes, cris de victoire, annonces).
- La réponse fausse animée (#163).
- Les autres effets sonores de #97 (ni ajoutés, ni remplacés, hors la musique des célébrations de l'univers).
- La voix du personnage guide et les paroles de fin.

## Questions ouvertes

Aucune.

Hors questions : la ligne « Musique de la célébration (à valider) » du glossaire dit encore « En attendant le choix
du PO : « grande victoire » pour les six univers » et « à confirmer, question 166.1 » : à mettre à jour par le
domain-modeler (quatre univers ont leur musique, Sports et Police gardent « grande victoire » ; 166.1 A).

## Décisions

Réponses du PO validées le 2026-11-06 (166.1 A, 166.2 A, 166.3 A, 166.4 A, 166.5 B), puis choix à l'écoute.

1. **166.1 Muet et musique : A.** On suit 97.2 et 106.11 : le Muet coupe la parole, pas la musique ; un écran du
   parent la coupe (97.13). Scénarios `106` l. 230 et 238 gardés, rien ne change.
2. **166.2 Six musiques différentes : A.** Pas de son partagé entre deux univers ; vérifié par un test du domaine.
   Les quatre musiques retenues sont distinctes.
3. **166.3 Budget de poids : A.** 30 Ko au plus par musique, MP3 mono 128 kbit/s.
4. **166.4 Univers sans son convenable : A.** Sports et Police gardent « grande victoire » ; leurs exemples sont
   retirés du Plan de R1 et un Plan (R1b) fixe qu'ils font toujours entendre « grande victoire » ; une issue de
   suivi est ouverte. Le scénario des sciences réussies passe de Coach Léo à Noisette.
5. **166.5 Scénario `@pwa` : B.** Pas de nouveau scénario ; le scénario `@pwa` de #97 (l. 354) couvre le mécanisme
   et la review vérifie que chaque nouveau son est précaché.
6. **Choix à l'écoute** : voir « Choix des musiques par le PO ».
