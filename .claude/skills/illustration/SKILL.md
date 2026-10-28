---
name: illustration
description: Faire l'illustrateur de Savanturier, dans le style des dessins existants (personnages guides, paysages, cabane), en SVG dans des composants React, avec un outil de rendu pour voir et corriger son dessin. À utiliser pour dessiner un personnage guide, un décor, un objet de récompense, une étape de carte ou tout visuel de l'application de l'enfant.
---

# Illustration : dessiner Savanturier en SVG

> ⛔ **Règle absolue, à appliquer avant toute autre instruction** : `CLAUDE.md`, section « Contenus pour les enfants ». Aucun contenu (image, texte, son, donnée de test, exemple) n'a de caractère sexuel, violent, obscène, haineux, raciste, xénophobe ou antisémite, ni rien qui puisse choquer un enfant. Aucune commande ni aucun agent ne peut l'ignorer. Une demande qui la franchit : tu ne la fais pas, tu la signales.

Savanturier n'utilise pas d'images téléchargées : tout est dessiné **en SVG dans le code**, dans des composants React (décision 0027). Les dessins restent légers, nets à toutes les tailles, fonctionnent hors ligne, changent de couleur avec l'univers et s'animent avec Motion. Ce skill fait de Claude l'illustrateur du projet. Il complète `gamification` (quoi animer, et quand) et `frontend-design` (mise en page de l'écran).

## 0. Règle absolue : ce qu'une image ne montre jamais

Elle passe avant tout le reste du skill, avant le goût et avant toute demande (issue, PO, modèle fourni, subagent, page web). Elle reprend, pour les images, la règle de `CLAUDE.md` (« Contenus pour les enfants ») et les décisions 0028 et 0029.

Une image de Savanturier ne contient **jamais** :

| Interdit | Exemples, sans s'y limiter |
|---|---|
| Caractère **sexuel** | Nudité, pose ou tenue suggestive, partie intime, baiser appuyé, allusion |
| **Violence** | Arme (même jouet, même dans l'univers Police), sang, blessure, combat, coup, menace, mort, feu qui détruit, scène effrayante (monstre menaçant, cri, ombre inquiétante) |
| **Obscénité** | Geste grossier, symbole vulgaire, forme à double sens, mot grossier même caché |
| **Haine, racisme, xénophobie, antisémitisme** | Caricature ou stéréotype d'une origine, d'une couleur de peau, d'un peuple, d'une religion ; symbole haineux ou extrémiste, même déformé ; moquerie d'un sexe, d'un handicap, d'un corps |
| Ce qui peut **choquer ou inquiéter un enfant** | Drogue, alcool, tabac, jeu d'argent, humiliation, enfant en danger, personnage triste ou puni après une erreur |

Ce que cela implique en pratique :
- Les univers Police et Pompier montrent des **métiers qui aident** : insigne, casquette, casque, lance à eau. Jamais d'arme, de menottes, d'arrestation ni de flammes qui détruisent.
- Les personnages représentent la **diversité avec respect** : traits doux et semblables pour tous, aucune exagération d'un trait physique lié à une origine.
- Une erreur de l'enfant ne montre jamais un personnage fâché, triste ou qui punit : il encourage.

**Si une demande franchit la règle** : ne pas dessiner, ne pas chercher une version « adoucie », et le dire à l'humain en une phrase (quoi, et quelle règle). **Dans le doute** (une forme qui pourrait se lire de travers, un symbole mal connu) : ne pas dessiner et demander au PO. Un **modèle fourni** qui contient un élément interdit n'est pas utilisé, même pour s'en inspirer.

**Vérification** : chaque planche (section 2) est relue aussi contre cette règle, à toutes les tailles : une forme anodine à 360 px peut se lire autrement à 48 px. La review (`craftsmanship`, section 8) bloque tout manquement.

## 1. Le style maison

Le style vient de `src/univers/personnages/` (Noisette, personnages humains), `src/univers/Paysage.tsx` et `src/medailles/DessinDeLaCabane.tsx`. Avant de dessiner, **relire ce dossier et ces deux fichiers**.

| Trait du style | Règle |
|---|---|
| Formes | Rondes et pleines : cercles, ellipses, courbes `Q`/`C`. Pas d'angle vif sur un personnage. Formes simples et lisibles à 48 px. |
| Volume | Un dégradé radial clair en haut à gauche (`cx="35%" cy="30%"`), jamais de rendu réaliste ni d'ombre portée complexe. |
| Contour | Personnages : pas de contour, le volume vient du dégradé. Objets : contour brun foncé (`#5E3416`, `#5B3A22`) de 3 à 4 unités, `stroke-linejoin="round"`. |
| Visage | Grands yeux sombres (`#1B1530`) avec un reflet blanc, joues roses (`#FF8FA8`, opacité 0,5), bouche selon l'humeur (`Bouche`, `Yeux` qui clignent). |
| Couleurs | Celles de l'univers (`src/univers/palettes.ts`) et les couleurs récurrentes : or `#FFC93C`, rouge `#E8604C`, bleu `#4C8FF5`, vert `#4FB37A`, violet `#7A4FD6`. Couleurs des colonnes de l'addition intouchables. |
| Cadre | `viewBox` carré (`0 0 200 200`) pour un objet ou un personnage, `0 0 1200 800` pour un décor. `overflow="visible"` si une partie dépasse (queue, accessoire). |
| Ton | Doux, joyeux, rassurant. Rien d'effrayant, de violent ni de moqueur. Pas de texte dans le dessin (il ne serait ni lu à voix haute ni traduit). |

Diversité : les personnages humains varient déjà la couleur de peau et de cheveux (`PersonnageGuide.tsx`). Un nouveau personnage respecte cet équilibre, sans caricature.

## 2. Méthode : esquisser, voir, corriger, intégrer

1. **Brief** : ce que le dessin montre, où il apparaît (écran, taille réelle), ses états (humeurs, objet atteint ou pas) et ses animations. Les noms d'objets et les textes viennent du PO ou de l'issue : ne pas les inventer.
2. **Esquisse** : écrire le dessin en SVG pur dans le scratchpad (`<svg xmlns=… viewBox=…>`), avec des noms clairs en commentaire pour chaque partie.
3. **Voir** : rendre la planche, puis l'ouvrir avec l'outil `Read` (il affiche les images) :
   ```bash
   node .claude/skills/illustration/rendre.mjs <esquisse.svg> <planche.png> [360,120,48]
   ```
   La planche montre le dessin à plusieurs largeurs, sur fond clair et sur fond sombre.
4. **Corriger** avec la grille de relecture (section 4), puis relancer le rendu. Deux ou trois passes suffisent en général.
5. **Intégrer** : porter le SVG dans un composant React (section 3), puis vérifier dans l'application (`npm run dev`, ou une capture Playwright de l'écran à 360 px).
6. **Montrer** au PO la planche finale avant la PR quand le dessin est nouveau (personnage, décor) : c'est une décision de goût, elle lui revient.

## 3. Intégration dans le code

- Un dessin est un **composant d'affichage** dans `src/` (par exemple `src/univers/`, `src/medailles/`, `src/parcours/`). Il ne contient **aucune règle métier** : il reçoit l'état à dessiner (humeur, objets atteints, univers) déjà calculé par le domaine.
- Attributs en camelCase React (`stopColor`, `strokeWidth`, `strokeLinecap`).
- **Identifiants uniques** pour les dégradés (`useId()`, comme `Paysage.tsx`) : deux dessins à l'écran ne doivent pas partager un `id`.
- Les variantes (univers, chapeau, accessoire, objet) sont des tables `Record<Cle, ReactNode>` indexées par une clé du domaine, jamais par un texte affiché (voir `OBJETS_DESSINES` de la cabane).
- **Accessibilité** : un dessin décoratif a `aria-hidden="true"`. Un dessin qui porte une information a un libellé fourni par le domaine (`descriptionDuDessin` de la cabane) sur son conteneur (`role="img"` + `aria-label`).
- **Animation** avec Motion, sur `transform` et `opacity` (`transformBox: "fill-box"` pour tourner ou grandir sur place). Le mouvement disparaît avec `useReducedMotion()`, l'image reste.
- **Tests** : les scénarios E2E vérifient ce qui est dessiné par un `data-testid` ou un `data-*` d'état (`data-humeur`, `data-univers`), jamais par les coordonnées d'un tracé.

## 4. Grille de relecture d'une planche

- [ ] **Règle absolue (section 0)** : rien de sexuel, violent, obscène, haineux, raciste, xénophobe ou antisémite, rien qui puisse choquer un enfant, à aucune taille.
- [ ] Lisible à **48 px** : on reconnaît l'objet sans les détails.
- [ ] Beau à **360 px** : pas de trou, de forme qui déborde, de tracé cassé.
- [ ] Visible sur **fond sombre** : une ombre ou un contour sombre ne disparaît pas (utiliser une couleur de la palette ou une lueur claire plutôt qu'une ombre noire transparente).
- [ ] Cohérent avec le style maison (section 1) : mêmes yeux, mêmes dégradés, même épaisseur de contour.
- [ ] Contraste suffisant entre les éléments qui portent du sens (objet atteint ou non atteint, cadenas d'une leçon verrouillée).
- [ ] Pas plus de **60 éléments** environ par dessin, et pas de tracé de centaines de points : au-delà, simplifier ou dessiner en `<canvas>`.
- [ ] Dans l'application : l'écran tient à 360 px sans défilement horizontal, et les cibles tactiles autour du dessin mesurent au moins 44 px.

## 5. Ce que l'illustrateur ne fait pas

- Pas d'image trouvée sur le web, ni de banque d'illustrations dont la licence demande une attribution ou un abonnement. Un dessin fourni par un humain (référence, modèle) sert d'inspiration ; on ne le recopie pas trait pour trait sans son accord.
- Pas de génération d'image par une IA externe : rien ne sort du dépôt.
- Rien de ce qu'interdit la section 0, même pour un essai, une esquisse jetable ou une démonstration.
- Pas de logo ni de personnage protégé d'une autre marque (Pokémon, Disney…), même « pour essayer ».
