# Critères d'acceptance : story #96, refonte visuelle de l'application de l'enfant

Scénarios : `features/96-refonte-visuelle.feature`. Tags :
- `@issue-96 @wip` sur la fonctionnalité ;
- `@a-valider` pour ce qui dépend d'une question ouverte ;
- `@visuel` pour les captures de référence, lancées à part.

## Objectif

En tant qu'**enfant**, je veux une application colorée et vivante, qui ressemble à mon univers, afin d'avoir l'impression d'entrer dans un jeu.

Besoins nourris (skill `gamification`, section 1) :
- **autonomie** : l'univers choisi se retrouve partout ;
- **lien** : le personnage guide, redessiné, accompagne l'enfant sur chaque écran de l'enfant ;
- **compétence** : les boutons répondent tout de suite au geste (retour immédiat).

La story ne change que l'affichage, à une exception près : le personnage guide de l'univers « Police » s'appelle désormais **Agent Max**. Elle ne modifie aucune récompense ni aucune note, et ne franchit aucun garde-fou de la section 5 du skill `gamification`.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Chaque écran de l'enfant prend la couleur principale de l'univers choisi, et tout son texte reste lisible | Plan « Dans l'univers « <univers> », la couleur principale se voit sur <écran> » : 8 écrans, 6 univers ; 2 écrans de plus `@a-valider` (#96.7) · Plan « … tout texte et chaque bouton des écrans de l'enfant se lisent bien <mode> » : 6 univers × sans mode dys / en mode dys, ≥ 4,5:1 · Plan « Les colonnes de l'addition posée gardent leurs couleurs … » · « Sans le mode dys, les titres s'affichent en Baloo 2 et le texte en Andika » · « En mode dys, les titres et les boutons s'affichent dans la même police que le texte » · « Les polices de l'application viennent de Savanturier, jamais d'un service tiers » · « Sur un appareil réglé en mode sombre, l'enfant garde les couleurs de son univers » |
| R2 | Le paysage et le personnage guide de l'univers, au dessin validé par le PO, accompagnent l'enfant sur chaque écran de l'enfant | Plan « Sur <écran>, Léa voit <personnage guide> dans le paysage … » : 8 écrans, 6 personnages guides ; 2 écrans de plus `@a-valider` (#96.7) · Plan « Dans l'univers « <univers> », <personnage guide> a <son dessin> » : 5 dessins validés, et Capitaine Sam inchangé · « Dans l'univers « Police », Agent Max salue l'enfant » · `@a-valider` « Après une bonne réponse, Agent Max dit une félicitation commune ou une de ses expressions » (#96.8) · `@a-valider` « Agent Max lit la consigne avec une voix masculine » (#96.8) · « Un profil enfant sans univers retrouve Noisette et son paysage sur « Mon parcours » » · « Sur un écran de 360 px, le personnage guide ne cache ni la consigne ni les choix » · Plan « Avec les mouvements réduits, le paysage et le personnage guide restent immobiles sur <écran> » · « Les lecteurs d'écran n'annoncent ni le paysage ni le dessin du personnage guide » |
| R3 | Un bouton de l'enfant réagit dès qu'on le touche : il s'enfonce puis revient ; avec les mouvements réduits, il change seulement de couleur | Plan « Toucher <bouton> le fait s'enfoncer puis revenir à sa place » · « Au clavier, valider un bouton le fait aussi s'enfoncer puis revenir » · « Avec les mouvements réduits, un bouton touché change seulement de couleur » · `@a-valider` « Un bouton touché puis quitté du doigt revient à sa place sans rien ouvrir » (#96.11) · « Après une erreur, le choix touché revient à sa place et Léa a une nouvelle chance » · « Avec leur relief, les boutons de l'accueil restent assez grands pour un doigt d'enfant » |
| R4 | Avancer d'un écran de l'enfant au suivant le fait arriver en glissant, revenir le fait glisser dans l'autre sens, « Mes médailles » arrive en fondu ; avec les mouvements réduits, aucun mouvement | Plan « <écran> arrive <transition> » : « Mon parcours », la page de la leçon et la séance en glissant ; retour en arrière en glissant dans l'autre sens ; « Mes médailles » en fondu ; « Toutes les leçons » `@a-valider` (#96.12) · « Avec les mouvements réduits, la page de la leçon s'affiche sans aucun mouvement » · « Avec les mouvements réduits, « Mes médailles » s'affiche sans fondu » · `@a-valider` « Toucher deux fois de suite une leçon n'ouvre sa page qu'une seule fois » (#96.11) |
| R5 | Les écrans de l'enfant tiennent à 360 px de large, et les écrans clés gardent l'apparence validée par le PO | Plan « À 360 px de large, <écran> s'affiche sans défilement horizontal » : 8 écrans ; 2 de plus `@a-valider` (#96.7) · `@visuel @a-valider` Plan « <écran> ressemble à sa capture de référence « <capture> » » : accueil (« aujourd-hui »), « Mon parcours », un exercice en séance, fin de la séance (#96.9) |
| R6 | L'Espace parent reprend les jetons de l'enfant, mais reste sobre : ni couleur de l'univers de l'enfant, ni paysage, ni personnage guide, ni rebond | « L'Espace parent ne prend pas la couleur principale de l'univers de l'enfant qui jouait » · « L'Espace parent n'a ni paysage ni personnage guide » · « Les titres de l'Espace parent s'affichent en Baloo 2 et son texte en Andika » · `@a-valider` « Dans l'Espace parent, un bouton touché s'enfonce et revient sans rebondir » (#96.13) · `@a-valider` « Entrer dans l'Espace parent se fait sans glissement » (#96.13) |

Au total : **6 règles, 33 scénarios** (dont 11 plans de scénario). Le tag `@a-valider` apparaît **11 fois** : 7 scénarios et 4 blocs d'exemples.

Si la story doit maigrir, deux morceaux peuvent partir ailleurs :
- **Agent Max** (renommage, paroles, voix) : une petite story Motivation.
- **R6** : une story Famille.

### Précisions pour les étapes

- « Léa ouvre tour à tour chaque écran de l'enfant » : elle parcourt la liste de la description de la `Fonctionnalité`.
- « en glissant », « en fondu » : 300 ms au plus, en n'animant que `transform` et `opacity` (réponse 96.6). Le chiffre est dans la description, pour que les scénarios restent déclaratifs.
- « le dessin validé : … » : ce sont les signes visibles de chaque maquette (`docs/maquettes/README.md`). Le PO valide en plus la planche de chaque personnage guide, rendue avec `rendre.mjs`, avant la PR (décision 0026).
- Le Plan des transitions met des étapes existantes dans ses colonnes : « Léa a ouvert son parcours depuis son accueil », « Léa ouvre la leçon « … » depuis son parcours », « Léa ouvre « … » par le dock », « Léa revient en arrière ».
- Le scénario « Après une erreur… » vérifie que la refonte garde un retour d'erreur doux.

### Droits d'accès

La story ne crée et ne lit aucune donnée : **pas de scénario `@acces`**. L'Espace parent reste derrière le contrôle parental, sans changement (#10). Les captures ne montrent que des données de test fictives.

### Scénarios existants à mettre à jour (« Agente Mila » → « Agent Max »)

Les mises à jour remplacent seulement le nom. Le sens d'une étape existante ne change pas : on ajoute « Agent Max » aux noms acceptés.
- `features/6-univers-et-personnage-guide.feature` :
  - ligne 24 : Plan « Dans l'univers « <univers> », le personnage guide est <personnage guide> », ligne Police ;
  - ligne 97 : Plan des expressions, ligne Police ;
  - ligne 106 : « Les félicitations communes sont les mêmes dans tous les univers », « dite par Agente Mila ».
- Étapes qui citent le nom :
  - `features/steps/univers.steps.ts` : table des expressions par personnage guide ;
  - `features/steps/profils-enfants.steps.ts:449` : `(Lumi|Coach Léo|Agente Mila|Capitaine Sam|Lili) dit « Bonjour … »`.
- Hors scénarios, pour l'implementer et le test-writer :
  - `supabase/functions/_shared/motivation/domain/univers.ts` : nom, titre « la policière détective », voix féminine ;
  - `univers_test.ts` et `paroles_test.ts` ;
  - `docs/stories/7/domain-model.md` : tableau des voix, pour l'historique.

## Hors périmètre

- Retours de réponse et effets sonores, dont le son au toucher d'un bouton : #97. Les boutons de #96 sont muets.
- « Mon parcours » en carte au trésor : #99. Sa capture de référence sera alors mise à jour.
- **Animations** de célébration des personnages guides : #106. #96 ne reprend que leur dessin fixe.
- Nouveau dessin de Capitaine Sam : plus tard, quand le PO l'aura validé.
- Nouveaux paysages au style des maquettes (but de foot, théâtre…) : voir #96.10.
- Personnage guide qui évolue : #102.
- Mode sombre : non (réponse 96.2). Les jetons sont nommés par rôle (`--fond`, `--texte`…) pour en permettre un plus tard.
- Règles du domaine et legacy `app/` : rien ne change.
- Vérifiés par la review, pas par un scénario :
  - « aucune couleur en dur dans les écrans de l'enfant » ;
  - « rien qui imite une interface Pokémon (Pokéball, cadres de combat, barres de PV), ni néon ni 3D » (réponse 96.1) ;
  - contour `#33304A` et coins de 16 à 24 px.

## Questions ouvertes

Les questions 96.1 à 96.6 sont tranchées (voir « Décisions »). La numérotation reprend à #96.7.

**#96.7 Quelle est la liste exacte des écrans de l'enfant ?**
Le glossaire (#73) cite : accueil de l'enfant, Mon parcours, Toutes les leçons, Mes médailles, test de départ, page de la leçon, séance.
Reco : y ajouter la fin de la séance, la fin du test de départ, la séance de révision et sa fin (#28), et l'épisode (#33). La ligne « Écran de l'enfant » du glossaire serait complétée par un ajout.
- « Qui joue ? » reste un écran du parent : voir #96.13.
- Concerne les blocs d'exemples `@a-valider` de R1, R2 et R5.

**#96.8 Agent Max : quelles paroles, quel titre, quelle voix ?**
Reco :
- il garde les trois expressions d'Agente Mila (« Enquête résolue ! », « Bien vu, détective ! », « Affaire classée ! »), qui ne marquent pas le genre ;
- son titre devient « le détective futé », comme dans la maquette, au lieu de « la policière détective » ;
- il parle avec une **voix masculine**, comme Coach Léo et Capitaine Sam ;
- le royaume (« le Commissariat des Savanturiers ») ne change pas.

Concerne deux scénarios `@a-valider`.

**#96.9 Quel est le périmètre des captures de référence, et que fait-on quand une capture change ?**
Reco pour le périmètre :
- **4 captures dans le seul univers Sports** (style de référence) : l'accueil de l'enfant, « Mon parcours », l'exercice « Quel son entends-tu ? » en séance, et la fin de la séance ;
- en 360 px, en mouvements réduits, avec une date fixée, des données fixes et le hasard fixé par son port ;
- sur le seul projet `telephone`, dans le Chromium du conteneur ;
- tag `@visuel`, lancé une fois avant la PR ;
- les captures sont prises **après** le redessin des personnages guides de #96.

Reco pour une capture qui change :
- une différence fait échouer le scénario ;
- on ne met à jour une capture que volontairement, après validation du PO, dans un commit dédié `test(#n): mise à jour de la capture <nom>`, avec l'avant et l'après dans la PR ;
- un seuil faible absorbe l'anticrénelage.

**#96.10 Les paysages sont-ils redessinés au style des maquettes dans #96 ?**
Les maquettes ont leurs propres décors : terrain et but, scène de théâtre, prairie et arbre à noisettes, jardin féerique, place du commissariat.
Reco : **non**. #96 garde les paysages actuels, avec les palettes retouchées (96.4). Les nouveaux décors iraient avec les animations de #106, univers par univers.

**#96.11 Que se passe-t-il dans les cas limites des gestes ?**
Reco :
- deux touchers rapides sur une leçon n'ouvrent sa page qu'une fois ;
- un doigt posé puis glissé hors du bouton le laisse revenir sans rien ouvrir.

Concerne deux scénarios `@a-valider`.

**#96.12 Quelle transition pour les écrans que la réponse 96.6 ne cite pas ?**
Reco :
- « Toutes les leçons », le test de départ et la séance de révision : **en glissant**, car on avance ;
- l'épisode : **en fondu**, comme « Mes médailles », d'où il s'ouvre ;
- passer de la séance à sa fin : **en fondu**, car l'enfant reste dans la même séance.

**#96.13 Dans l'Espace parent, les boutons en relief s'enfoncent-ils ? Y a-t-il une transition ? Et « Qui joue ? » ?**
Reco :
- les boutons de l'Espace parent ont le même relief et **s'enfoncent puis reviennent, sans ressort ni rebond** ;
- on entre dans l'Espace parent **sans glissement**, l'écran s'affiche aussitôt ;
- « Qui joue ? » et les autres écrans du parent (connexion, contrôle parental) suivent la même règle que l'Espace parent ; « Qui joue ? » garde le dessin du personnage guide de chaque profil, pour que l'enfant se reconnaisse.

Remarque : aujourd'hui, le paysage d'« Animaux de la forêt » s'affiche derrière les écrans du parent ; la réponse 96.3 le retire de l'Espace parent.

**#96.14 Comment vérifie-t-on la fluidité (60 images par seconde visées, premier écran en moins de 3 s en 4G) sur le Honor Magic ?**
Reco : par une **vérification manuelle du PO** avant le merge, notée dans `docs/stories/96/journal.md`. Le parcours à suivre : accueil, puis « Mon parcours », page de la leçon, séance. Ce n'est pas un scénario automatisé. La review vérifie que seules `transform` et `opacity` sont animées.

**#96.15 Qu'est-ce qui montre « la couleur principale » sur un écran ?**
Reco : au moins le bouton principal ou l'élément marqué comme en cours (bouton du dock, « À toi ! »), et les titres.

## Termes à signaler (glossaire)

- **Agent Max** : nouveau nom du personnage guide de l'univers « Police » (réponse 96.5). À **ajouter** en fin de section Motivation : « Agent Max remplace Agente Mila (#96) ». La ligne « Personnage guide » cite seulement « Noisette, Lumi, Coach Léo… » et n'est pas à réécrire.
- **« Carte au trésor »** : absente du glossaire, et « carte » est interdit pour **Parcours** (décision n°34). Les scénarios disent « Mon parcours » ; le terme reviendra à #99.
- **« Aujourd'hui »** : mot de cadrage ; l'écran est l'**Accueil de l'enfant** (réponse 29.5). Ici, ce n'est qu'un nom de capture.
- **« Décor »** : déjà employé dans la définition de **Cabane**. Les scénarios disent « le paysage et le personnage guide », jamais « décor de l'univers ».
- **« Écran de l'enfant »** : la définition est à compléter (#96.7).
- Mots d'interface ou de test proposés hors glossaire : en glissant, en fondu, capture de référence, écran clé, dessin validé, mode sombre, panneau d'aventure, jetons (technique).

## Décisions

Réponses du PO du 2026-10-27, relayées sur #96 (commentaire 6454802102), mot pour mot : « 96.1 A 96.2 A 96.3 A 96.4 A 96.5 B 96.6 A ».

| Question | Réponse | Effet sur les scénarios |
|---|---|---|
| 96.1 Direction artistique | A : aventure cartoon ; boutons épais en relief qui s'enfoncent ; contour `#33304A` ; coins de 16 à 24 px ; cartes en « panneaux d'aventure » ; titres en Baloo 2 servie par le projet, texte en Andika, tout en Andika en mode dys ; rien qui imite une interface Pokémon, ni néon ni 3D | Scénarios des polices (R1, R6) validés ; le style est vérifié par la review |
| 96.2 Mode sombre | A : pas de mode sombre ; jetons nommés par rôle | Scénario du mode sombre validé |
| 96.3 Espace parent | A : reprend les jetons (couleurs, rayons, police, boutons en relief), sans paysage, sans personnage guide, sans rebond | R6 réécrite ; restent `@a-valider` l'enfoncement des boutons et la transition (#96.13) |
| 96.4 Palettes | A : plus vives, alignées sur les maquettes, même teinte par univers ; texte et boutons à 4,5:1 au moins, dans les 6 univers et en mode dys, vérifiés par un test (Animaux `#C9452F` sur `#f6f1e7` = 4,26:1 aujourd'hui) ; colonnes de l'addition posée inchangées | Plan du contraste étendu aux boutons |
| 96.5 Personnages guides | B : #96 reprend le dessin fixe de Coach Léo, Lili, Noisette, Lumi et Agent Max ; animations dans #106 ; Capitaine Sam inchangé ; « Agent Max » remplace « Agente Mila » (glossaire, paroles) | Plan des dessins et scénario « Agent Max salue l'enfant » ajoutés ; scénarios existants à mettre à jour, listés plus haut |
| 96.6 Transitions | A : glissement latéral quand on avance (accueil → parcours → page de la leçon → séance), glissement inverse quand on revient, fondu pour « Mes médailles », 300 ms au plus, `transform` et `opacity` seulement ; mouvements réduits : aucun mouvement | R4 réécrite ; le retour en arrière n'est plus `@a-valider` ; reste « Toutes les leçons » (#96.12) |
