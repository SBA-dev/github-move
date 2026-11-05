# Critères d'acceptance de la story #166 : une musique propre à chaque univers pour les célébrations

Scénarios : `features/166-musiques-des-univers.feature` (nouveaux), plus les scénarios existants de #106, #102 et #97
listés plus bas. Les décisions « 106.n » et « 97.n » renvoient à `docs/stories/106/acceptance.md` et
`docs/stories/97/acceptance.md`.

## Objectif

En tant qu'enfant, je veux entendre la musique de mon univers quand mon personnage guide fête ma victoire (premier
défi relevé, matière réussie, tenue reçue), afin de reconnaître le monde que j'ai choisi.

Aujourd'hui, les six célébrations de l'univers jouent toutes « grande victoire » (106.27 resté ouvert). La story
remplace ce son par une musique choisie par le PO pour chaque univers (décision 106.12 : la musique remplace
« grande victoire », un seul son, 3 s au plus, décision 0039 ; la parole vient après).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| R1 | Chaque univers a sa musique de célébration, qui remplace « grande victoire » : jamais les deux, et jamais « grande victoire » pendant une célébration de l'univers | **Nouveaux** (`166`) : « Au premier défi relevé dans l'univers « <univers> », <musique> se fait entendre à la place de « grande victoire » » (6 exemples, un par univers) · « La séance qui rend les sciences du CE1 réussies fait entendre la musique de la célébration de Coach Léo, pas « grande victoire » » |
| R2 | La musique passe avant la parole du personnage guide, jamais par-dessus ; quand la séance donne aussi une nouveauté : la musique, puis « découverte », puis la parole (106.46) | **Existants** (`106`) : les six « Au premier défi relevé dans l'univers … » (l. 98, 254, 317, 380, 443, 506), dont l'étape « Léa entend la musique de la célébration de <personnage guide>, puis … dit … » attendra désormais la musique de **cet** univers · **Modifié** (`102`, l. 141) : « Une séance qui fait recevoir une tenue <cas> fait entendre <effets sonores> avant la phrase de fin » (exemples passés de « grande victoire » à « la musique de la célébration de Noisette puis l'effet sonore « découverte » ») |
| R3 | La musique ne retient jamais l'enfant : un toucher hors des boutons la laisse finir, un bouton ou le clavier l'arrête | **Existants** (`106`, l. 185 et 191, avec Coach Léo) |
| R4 | Muet et écrans du parent : le Muet ne coupe pas la musique (seule la parole), un écran du parent l'arrête (97.2, 106.11, 97.13) | **Existants** (`106`, règle l. 228 : scénarios l. 230 et 238). À confirmer par #166.1 |
| R5 | Non-régression : quand aucune célébration de l'univers n'est jouée, « grande victoire » reste le son de la leçon acquise et du record de fluence ; un défi rejoué garde « séance terminée » | **Existants** (`97`) : Plan l. 203, exemples « qui rend la leçon acquise… » (l. 216 à 218, univers « Animaux de la forêt », aucun palier des tenues franchi) · « Rejouer une leçon déjà acquise… » (l. 222) · fluence l. 256, 268, 283 · (`106`) « Rejouer un défi relevé fait entendre « séance terminée »… » (l. 163) |

Couverture sans scénario (tests du domaine et review) :
- les six entrées du catalogue des célébrations ont une musique, et aucune n'est `grandeVictoire` (sauf univers en attente, #166.4) ;
- les six musiques sont distinctes entre elles et des 8 effets sonores existants (#166.2) ; poids par son (#166.3) ;
- chaque musique est un `EffetSonore` de Voix, nommé d'après le son et pas d'après l'univers (106.12) ;
- durée : 3 s au plus (garde existante du lecteur d'effets sonores, décision 0039) ;
- hors ligne : les nouveaux MP3 sont précachés comme les 8 effets sonores existants (#8) ; le mécanisme est déjà
  couvert par le scénario `@pwa` de #97 (l. 354), voir #166.5 ;
- contenu (règle absolue de `CLAUDE.md`) : sons joyeux, sans voix ni parole, sans sirène, alarme, cri, bruit d'arme
  ni son effrayant, même pour Police et Pompiers ; licence CC0 consignée dans `docs/sons.md`. Vérifié à l'écoute
  par le PO et en review.

## Étapes Gherkin

Aucune étape nouvelle dans `features/166-musiques-des-univers.feature` : toutes existent déjà (steps de #106 et
#97). Travail pour l'e2e-tester :
1. `features/steps/celebration-de-l-univers.steps.ts` : la constante `MUSIQUE = "grande victoire"` devient une
   musique **par personnage guide** (Coach Léo, Lili, Noisette, Lumi, Agent Max, Capitaine Sam), pour les étapes
   « Léa entend la musique de la célébration de <personnage guide>, puis … dit … », « Léa entend la musique de la
   célébration de Coach Léo », « … jusqu'au bout », « Léa n'entend plus la musique … ».
2. Vérifier que l'étape générique de #97 « Léa n'entend pas l'effet sonore « grande victoire » »
   (`retours-animes-et-sonores.steps.ts`, l. 555) fonctionne dans le contexte de la célébration de l'univers
   (même observation des effets sonores).
3. **Une étape à adapter** (formulation nouvelle, dans `features/102-personnage-guide-evolue.feature`, l. 147 avec
   l'exemple) :
   `Alors Léa entend la musique de la célébration de Noisette puis l'effet sonore « découverte », puis Noisette dit sa phrase de fin`
   (aujourd'hui : « Léa entend les effets sonores « grande victoire » puis « découverte », puis Noisette dit sa
   phrase de fin », qui deviendrait faux dès que la musique de Noisette n'est plus « grande victoire »).

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

## Choix des musiques par le PO (protocole, pas un scénario)

1. Préalable : accès réseau du conteneur à `kenney.nl` (ou `opengameart.org`), ou fichiers déposés dans le dépôt
   (aujourd'hui : 403 du proxy, voir `journal.md`).
2. L'équipe propose **2 ou 3 sons par univers** (Sports, Danse, Animaux de la forêt, Princesses et fées, Police,
   Pompiers), CC0, 3 s au plus, joyeux, conformes à la règle absolue de `CLAUDE.md`, sur une **page d'écoute**
   (un lecteur par son, repéré A, B, C dans chaque univers).
3. Le PO écoute et répond en une ligne, du type **« 166 Sports B, Danse A, Animaux A, Princesses C, Police B,
   Pompiers A »**.
4. Les sons retenus prennent un nom d'après le son (pas d'après l'univers) et leur licence va dans `docs/sons.md`.

## Hors périmètre

- Les célébrations elles-mêmes (dessins, variantes, cris de victoire, annonces).
- La réponse fausse animée (#163).
- Les autres effets sonores de #97 (ni ajoutés, ni remplacés, hors la musique des célébrations de l'univers).
- La voix du personnage guide et les paroles de fin.

## Questions ouvertes

1. **#166.1 Muet et musique.** L'issue (point 5) dit « Muet coupe la musique » ; les décisions 97.2 et 106.11
   disent l'inverse (le Muet coupe la parole, pas les effets sonores, donc pas la musique ; seule la voix suspendue
   des écrans du parent la coupe, 97.13), et le scénario `106` l. 230 le vérifie.
   - A : suivre 97.2 et 106.11, rien ne change (scénarios `106` l. 230 et 238 gardés).
   - B : le Muet coupe aussi la musique des célébrations : nouvelle décision, la règle `106` l. 228 et la ligne
     « Muet » du glossaire changent, et la musique devient une exception parmi les effets sonores.
   - **Reco : A** (cohérence avec tous les autres effets sonores ; l'issue reprend sans doute mal 97.2).
2. **#166.2 Six musiques différentes ?** Le PO peut-il retenir le même son pour deux univers ?
   - A : non, six musiques différentes (vérifié par un test du domaine, pas par un scénario).
   - B : oui, si le même son lui plaît pour deux univers.
   - **Reco : A** (c'est l'objet de la story : reconnaître son univers à l'oreille).
3. **#166.3 Budget de poids.** Les 8 sons existants pèsent environ 83 Ko (« grande victoire » : 20 Ko).
   - A : 30 Ko au plus par musique, MP3 mono 128 kbit/s comme les autres, soit 180 Ko au plus pour les six.
   - B : pas de plafond par son, seulement la durée de 3 s (environ 48 Ko à 128 kbit/s).
   - **Reco : A** (voir `domain-model.md`).
4. **#166.4 Un univers sans aucun son convenable parmi ceux proposés.**
   - A : cet univers garde « grande victoire » et une issue de suivi est ouverte ; dans ce cas, l'exemple de son
     univers dans le Plan de R1 est retiré jusqu'à l'issue de suivi.
   - B : la story attend qu'un son convenable soit trouvé pour les six univers.
   - **Reco : A.**
5. **#166.5 Hors ligne : faut-il un scénario `@pwa` pour la musique ?**
   - A : oui, « Sans réseau, après un premier chargement, la musique de la célébration se fait entendre ».
   - B : non, le scénario `@pwa` de #97 (l. 354) couvre le mécanisme, et la review vérifie que chaque nouveau son
     est précaché.
   - **Reco : B** (pas de nouvelle étape, et le build PWA n'est rejoué qu'à la publication).

Préalable, hors questions : l'accès réseau à `kenney.nl` (ou `opengameart.org`) ou les fichiers CC0 déposés par le
PO (voir « Choix des musiques par le PO »). « Musique de la célébration (à valider) » est au glossaire
(domain-modeler).

## Décisions

Aucune pour l'instant.
