# Critères d'acceptance : story #99, « Mon parcours » se dessine dans le royaume du personnage guide

Scénarios : `features/99-dessin-du-parcours.feature`. Tags :
- `@issue-99 @wip` sur la fonctionnalité ;
- `@a-valider` sur les 14 scénarios qui dépendent d'une question ouverte ; le commentaire au-dessus de chacun nomme la question ;
- pas de `@acces` : la story ne crée, ne lit et n'envoie aucune donnée nouvelle (voir « Droits d'accès »).

Le nom du fichier et le titre de la fonctionnalité évitent « carte » (Décision n°34, question #99.1). L'issue garde son titre.

État : **cadrage**, en attente des réponses du PO (#99.1 à #99.15 du modèle de domaine, #99.16 à #99.22 ci-dessous).

## Objectif

En tant qu'**enfant**, je veux voir le parcours de chaque matière dessiné dans le paysage de mon univers, avec mon personnage guide sur la prochaine leçon, afin de voir jusqu'où je suis allé et ce qui m'attend.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : le chemin déjà fait se voit d'un coup d'œil (étoiles sur chaque leçon réussie, personnage guide qui avance) ;
- **lien** : le personnage guide accompagne l'enfant et marche avec lui jusqu'à la nouvelle prochaine leçon ;
- **autonomie** : toutes les leçons du dessin s'ouvrent, comme aujourd'hui (aucun verrou, Décision n°33).

La story ne change **aucune règle du parcours** : elle dessine ce que le domaine Apprentissage calcule déjà (#25, #26, #27). Seule lecture nouvelle : l'**avancée dans le parcours** (de quelle leçon à quelle leçon le personnage guide marche), voir `domain-model.md`. Aucun garde-fou de la section 5 du skill n'est franchi : le décor d'arrivée ne donne rien, rien ne s'achète ni ne se tire au hasard, la marche ne bloque jamais l'enfant (#99.20). Thème « trésor » inoffensif (règle absolue de `CLAUDE.md`) : un coffre ouvert rempli d'étoiles dessinées, sans pirate, arme, squelette, piège ni lieu effrayant.

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Le dessin du parcours montre, dans l'ordre, les leçons du parcours de la matière, chacune avec sa place et son état ; seule la prochaine leçon brille ; les leçons hors du parcours restent à part, sous le dessin | « Le dessin du parcours montre chaque leçon avec sa place et son état » (étoiles, réussie au test de départ, « à toi », « à découvrir », N8) · `@a-valider` « Seule la prochaine leçon brille, et aucune leçon du dessin du parcours n'a de cadenas » (#99.4, #99.18) · `@a-valider` « Les leçons réussies d'une classe au-dessus et les leçons des classes d'avant restent à part, sous le dessin du parcours » (#99.7) |
| R2 | Le personnage guide se tient sur la prochaine leçon du dessin du parcours ; quand la matière est réussie, il se tient à la fin du dessin, sans rien donner de plus | Plan « Dans l'univers « <univers> », <personnage guide> se tient sur la prochaine leçon » : Noisette, Coach Léo · `@a-valider` « Le personnage guide n'est plus à côté du titre : il n'est que sur le dessin du parcours » (#99.14) · `@a-valider` « Quand la matière est réussie, le personnage guide se tient à la fin du dessin du parcours, sans récompense de plus » (#99.12) |
| R3 | Quand la prochaine leçon a avancé depuis la dernière fois, le personnage guide marche jusqu'à la nouvelle prochaine leçon, une seule fois ; jamais en arrière, jamais pour une leçon réussie plus loin ; avec les mouvements réduits, il y est déjà | « Après avoir réussi la leçon 3, au retour sur « Mon parcours », le personnage guide marche jusqu'à la leçon 4 » · « Avec les mouvements réduits, le personnage guide est déjà sur la nouvelle prochaine leçon, sans marcher » · `@a-valider` « Quand les leçons d'après sont déjà réussies, le personnage guide marche d'un trait jusqu'à la nouvelle prochaine leçon » (#99.10) · `@a-valider` « Une leçon réussie plus loin que la prochaine leçon ne fait pas marcher le personnage guide » (#99.11, N8) · « Une marche ne se montre qu'une fois » · `@a-valider` « Une leçon réussie avant d'ouvrir « Mon parcours » fait marcher le personnage guide à la première ouverture » (#99.9) · `@a-valider` « Après une fermeture de l'application, le personnage guide est déjà sur sa leçon, sans marcher » (#99.9) · `@a-valider` « Revenue par « Qui joue ? » après sa séance, l'enfant voit quand même le personnage guide marcher » (#99.16) · « Après un changement de classe, le personnage guide est posé sur la prochaine leçon, sans marcher » · `@a-valider` « Quand la dernière leçon devient réussie, le personnage guide marche jusqu'à la fin du dessin du parcours » (#99.12) · `@a-valider` « Le personnage guide marche dans l'onglet de la matière où la prochaine leçon a avancé » (#99.21) · `@a-valider` « Pendant la marche du personnage guide, une leçon s'ouvre tout de suite » (#99.20) · « Sans réseau, le personnage guide marche quand même après une séance » |
| R4 | Le dessin du parcours est décoratif : lecteurs d'écran et clavier ont la liste ordonnée des leçons, dans l'ordre du parcours ; l'arrivée du personnage guide s'annonce une fois, sans effet sonore ni parole | « Les lecteurs d'écran lisent les leçons comme une liste ordonnée, sans le dessin du parcours » · « Au clavier, le focus passe de leçon en leçon dans l'ordre du parcours, sans se perdre hors de l'écran » · `@a-valider` « À l'arrivée du personnage guide, les lecteurs d'écran l'annoncent une fois, sans effet sonore ni parole » (#99.13) |
| R5 | Sur un écran de 360 px, le dessin du parcours défile verticalement, jamais horizontalement, s'ouvre sur la prochaine leçon et garde des cibles assez grandes pour un doigt d'enfant | `@a-valider` « À 360 px, un parcours de 31 leçons tient dans la largeur et s'ouvre sur la prochaine leçon » (#99.6) · « À 360 px, le personnage guide ne cache rien de la leçon sur laquelle il se tient » |

Au total : **5 règles, 24 scénarios** (dont 1 plan de scénario à 2 exemples), **14 tagués `@a-valider`**.

R3 porte 13 scénarios : c'est le seul endroit où la story décide quelque chose (faut-il marcher, d'où, jusqu'où). Ses cas viennent des invariants 1 à 7 du modèle de domaine ; la fonction pure `avanceeDansLeParcours` les couvre aussi en tests unitaires, les scénarios n'en gardent que ce que l'enfant voit.

### Exemples retenus (données de test)

Bibliothèque de test du dessin du parcours, identifiants `e2e-99-`, servie à la place de la vraie bibliothèque comme celle de #25 (`features/support/bibliotheque-du-parcours.ts` en modèle) : français du CP « Les voyelles » ; français du CE1 « Le son in », « L'ordre alphabétique », « Les mots contraires », « Le pluriel des noms », « Le féminin des noms », « Les accents » (6 leçons, assez pour un saut de 3 à 6) ; français du CE2 « Le futur », « L'imparfait » ; maths du CE1 « Maths 1 » à « Maths 31 » (le plus long parcours d'aujourd'hui, maths CP, a 31 leçons : #99.6).

| Cas | Prochaine leçon connue | Ce qui s'est passé | Ce que voit Léa |
|---|---|---|---|
| Nominal | Leçon 3 | séance de la leçon 3, 1 étoile | Noisette marche de 3 à 4 |
| Saut | Leçon 3 | leçon 4 déjà réussie (3 étoiles), leçon 5 réussie au test de départ, séance de la 3 | marche de 3 à 6 d'un trait |
| Leçon plus loin (N8) | Leçon 3 | séance de la leçon 5, 2 étoiles | aucune marche ; la 5 montre 2 étoiles |
| Matière réussie | Leçon 6 | séance de la leçon 6 | marche jusqu'à la fin du dessin, coffre d'étoiles |
| Mouvements réduits | Leçon 3 | séance de la 3 | déjà sur la 4 |
| Déjà montrée | Leçon 4 (marche vue) | retour à l'accueil, puis « Mon parcours » | déjà sur la 4 |
| Changement de classe | Leçon 3 de CE1 | Paul passe Léa en CE2 | déjà sur la leçon 1 « Le futur » (pas une avancée) |
| Application rouverte | aucune | séance avant la fermeture | déjà sur la 2 |

### Précisions pour les étapes

- « la bibliothèque de test du dessin du parcours est servie » : comme « la bibliothèque de test du parcours est servie » (#25), avec la liste ci-dessus et le préfixe `e2e-99-`. Les étapes reprises de #25 qui choisissent leurs leçons dans `LECONS_DU_PARCOURS` (« Léa a réussi <n> leçons de français du CE1 ») doivent lire la bibliothèque de #99 pour `@issue-99`, comme elles le font déjà pour `@issue-26`.
- « Léa a réussi les 24 premières leçons de maths du CE1 » : nouvelle étape, même préparation que « Léa a réussi <n> leçons de français du CE1 ».
- « le dessin du parcours montre, dans l'ordre : » (tableau place, leçon, état) et « le dessin du parcours montre « … » réussie avec <n> étoiles » : mêmes vérifications que « le parcours montre », faites sur le dessin (ce que l'enfant voit), pas sur la liste pour les lecteurs d'écran.
- « <personnage guide> se tient sur la leçon <n> « … » » : le dessin du personnage guide est sur la leçon de cette place (attribut ou rôle exposé par le composant, jamais une position en pixels dans le scénario).
- « Noisette marche de la leçon <a> à la leçon <b> » : une marche a lieu, qui part de la leçon <a> et s'arrête sur la leçon <b> ; « … en passant par les leçons 4 et 5 » : le tracé suivi passe par ces leçons. « Noisette est déjà sur la leçon <n> « … », sans marcher » : posé dès l'arrivée sur l'écran, aucune marche.
- « Léa a vu Noisette marcher jusqu'à la leçon 4, puis est revenue à son accueil » : la marche est allée au bout (pas interrompue), puis retour par le dock.
- « Léa a terminé une séance de la leçon « … » avec 1 étoile, sans avoir ouvert son parcours » : la séance est ouverte depuis l'accueil (leçon du jour ou « Toutes les leçons »), jamais depuis « Mon parcours ».
- « …, puis s'est choisie de nouveau dans « Qui joue ? » » : depuis la fin de la séance, « Accueil » mène à « Qui joue ? » (constaté par #32 et #97), où Léa choisit son profil enfant, sans recharger la page.
- « Léa a fermé puis rouvert l'application » : la page est rechargée (nouvelle utilisation), puis Léa choisit son profil enfant.
- « Léa a ouvert le parcours de français, pendant que Noisette marche » : l'étape s'arrête dès que la marche a commencé.
- « les lecteurs d'écran annoncent une liste ordonnée de 6 leçons » : une liste ordonnée (`ol`) de 6 éléments ; « ils n'annoncent ni le dessin du parcours ni le dessin de Noisette » : le dessin est caché aux lecteurs d'écran (`aria-hidden`).
- « Léa passe d'une leçon du parcours à la suivante au clavier » : touche Tab depuis la première leçon ; « chaque leçon qui a le focus est visible à l'écran » : la page défile pour la montrer.
- « Léa n'entend ni effet sonore ni parole pendant que Noisette marche » : le journal des effets sonores et des paroles (#97) ne reçoit rien entre le début et la fin de la marche.
- « visible sans que Léa ait fait défiler l'écran » : à l'arrivée sur l'onglet, la leçon 25 et le personnage guide sont dans la partie visible de l'écran.
- Étapes reprises : « Paul est connecté sur la tablette », « Léa a un profil enfant préparé de niveau … dans l'univers « … » », « Léa a pour meilleures étoiles : », « Léa a pour leçons réussies au test de départ : » (#27), « Léa a ouvert le parcours de français », « Léa a terminé une séance de la leçon « … » avec <n> étoile(s) », « Paul a changé sur la tablette le niveau du profil enfant de Léa en … », « Léa ouvre le parcours de français », « Léa choisit « Maths » dans son parcours », « Léa ouvre la leçon « … » depuis son parcours », « Léa voit la page de la leçon « … » », « aucune leçon du parcours n'est marquée « À toi ! » », « les lecteurs d'écran annoncent les leçons du parcours ainsi : », « chaque onglet de matière et chaque leçon du parcours mesurent au moins 44 px de haut » (#25) ; « l'appareil demande des mouvements réduits », « l'écran de l'appareil mesure 360 px de large », « Léa joue sur un ordinateur, au clavier » (#6) ; « le réseau est coupé » (#8) ; « la page tient dans la largeur de l'écran » (socle) ; « les lecteurs d'écran annoncent une seule fois « … » » (#97).
- `npx bddgen --tags "@issue-99"` génère les tests et liste les étapes manquantes (normal à ce stade) ; la génération des autres tags (`@socle`, `@issue-25`, `@issue-26`, `@issue-27`, `@issue-96`, `@issue-97`) reste intacte.

### Droits d'accès

La story ne crée, ne lit et n'envoie aucune donnée nouvelle : **pas de scénario `@acces`**. La prochaine leçon connue est gardée en mémoire le temps de l'utilisation, jamais enregistrée ni envoyée (modèle de domaine). Les droits sur la progression qui fait le parcours sont ceux de #25 (scénarios `@acces` de #25 inchangés : second parent rattaché, autre enfant, parent non rattaché). Rien ne part à l'IA ni à un service tiers.

### Scénarios existants touchés

Aucun scénario existant n'est modifié par ce cadrage. Revue de #25, #26, #27, #29, #96 et #97 :

| Scénario | Fichier | Effet de #99 | Suite proposée |
|---|---|---|---|
| Plan `@visuel` « <écran> ressemble à sa capture de référence « <capture> » », exemple « Mon parcours » / `mon-parcours` | `features/96-refonte-visuelle.feature`, l. 355 à 367 | **Change de sens** : la capture validée par le PO montre la liste ; avec le dessin, l'écran ne lui ressemblera plus et le scénario échouera. La réponse 96.9 dit qu'une capture ne change qu'après validation du PO, dans un commit dédié | Question #99.17 |
| « Sur « Mon parcours », Léa voit Coach Léo dans le paysage de l'univers « Sports » » (plan, R2 de #96) ; « Un profil enfant sans univers retrouve Noisette et son paysage sur « Mon parcours » » | `features/96-refonte-visuelle.feature`, l. 144 à 205 | Reste vrai : le personnage guide est toujours dans le paysage, mais sur la prochaine leçon et non plus à côté du titre (#99.14). Les steps doivent trouver le personnage guide sur le dessin | Aucune, si #99.14 est suivie |
| « Avec les mouvements réduits, le paysage et le personnage guide restent immobiles sur « Mon parcours » » | `features/96-refonte-visuelle.feature`, l. 214 à 223 | Reste vrai (sans marche, rien ne bouge ; avec mouvements réduits, il n'y a jamais de marche, R3) | Aucune |
| « Les lecteurs d'écran n'annoncent ni le paysage ni le dessin du personnage guide » | `features/96-refonte-visuelle.feature`, l. 226 | Reste vrai, renforcé par R4 (le dessin du parcours est caché aux lecteurs d'écran) | Aucune |
| « Sur « Mon parcours », la couleur principale de l'univers « Sports » se voit sur la leçon marquée « À toi ! » … » | `features/96-refonte-visuelle.feature`, l. 67 à 76 | Reste vrai : la leçon « À toi ! » du dessin garde la couleur principale | Aucune |
| « Toucher la leçon « Les sons ou, on, an » le fait s'enfoncer puis revenir » (plan, R3 de #96) ; « Toucher deux fois de suite une leçon n'ouvre sa page qu'une seule fois » | `features/96-refonte-visuelle.feature`, l. 234 à 327 | Reste vrai : une leçon du dessin reste un bouton de l'enfant, avec relief et « bouton touché » (#97) | Aucune |
| Tous les scénarios de #25 qui lisent le parcours (« le parcours montre : », états, « À toi ! », compteur, ouverture des leçons au toucher et au clavier, lecteur d'écran, 360 px et 44 px) | `features/25-parcours-par-matiere.feature` | Restent vrais : mêmes leçons, mêmes places, mêmes états, toutes les leçons s'ouvrent. Les steps qui cherchent la leçon dans la liste visible devront la trouver sur le dessin (affichage seul) | Aucune |
| « Le bloc des leçons des classes d'avant vient après les leçons réussies d'une classe au-dessus » et les blocs de #26 dans « Mon parcours » | `features/26-lecons-des-classes-d-avant.feature`, l. 35 à 128 | Restent vrais si #99.7 est suivie (blocs à part, sous le dessin) | Aucune, si #99.7 est suivie |
| « « Voir mon parcours » ouvre le parcours de l'enfant » | `features/27-test-de-depart.feature`, l. 389 | Reste vrai ; avec #99.9, le personnage guide y marchera de la leçon 1 à la nouvelle prochaine leçon | Question #99.22 |
| Scénarios du dock vers « Mon parcours » | `features/29-aujourd-hui.feature`, l. 437 à 472 | Restent vrais | Aucune |

## Hors périmètre

- Décors différents le long du dessin (forêt, rivière, montagne) et dessins propres à chaque univers (#99.8) : story à part.
- Groupes de leçons, défi de fin de chapitre (#99.6, story 5 de l'épopée #95).
- Le réglage « parcours libre » (#99.5) : ni lu ni retiré par #99.
- Tout effet sonore nouveau, toute parole du personnage guide pendant la marche (#99.13) ; animations de célébration du personnage guide (#106).
- « Toutes les leçons », l'accueil de l'enfant, les écrans du parent : inchangés.
- Toute règle du parcours (prochaine leçon, leçon à découvrir, place, leçon suivante, leçons des classes d'avant) : inchangée, #25, #26, #27.
- Toute récompense : le décor d'arrivée ne donne ni étoile, ni badge, ni objet de la cabane.

## Questions ouvertes

Les questions **#99.1 à #99.15** sont celles du modèle de domaine (`docs/stories/99/domain-model.md`, section « Questions ouvertes »), non renumérotées. Les scénarios suivent leurs recommandations et sont tagués `@a-valider` quand ils en dépendent : #99.4, #99.6, #99.7, #99.9, #99.10, #99.11, #99.12, #99.13, #99.14. Les questions de langage #99.1 à #99.3 portent sur tout le fichier (« dessin du parcours », « Leçon 4 », jamais « carte », « chemin » ni « étape ») ; si le PO choisit d'autres mots, le fichier est réécrit sans changer de sens.

Questions nouvelles de l'example mapping :

- **#99.16 Retour par « Qui joue ? »** : depuis la fin de la séance, « Accueil » mène aujourd'hui à « Qui joue ? », où l'enfant se choisit de nouveau. Si la prochaine leçon connue était relevée à chaque choix du profil (#99.9), elle le serait juste après la séance et l'enfant ne verrait presque jamais la marche. *Recommandation* : la prochaine leçon connue d'un profil enfant n'est relevée qu'au **premier** choix de ce profil pendant l'utilisation en cours, puis à chaque passage sur « Mon parcours » ; choisir de nouveau le même profil ne la remplace pas. D'accord ?
- **#99.17 Capture de référence « mon-parcours » de #96** : elle montre la liste et fera échouer le scénario `@visuel` de #96 dès que le dessin arrive. *Recommandation* : #99 remplace cette capture par une nouvelle (même cadre que la réponse 96.9 : univers « Sports », 360 px, mouvements réduits, 23 octobre 2026, données fixées, sans marche), que le PO valide à la vue d'une planche avant le merge, dans un commit dédié ; le scénario de #96 garde son texte. D'accord ?
- **#99.18 Éclat de « À toi ! » avec les mouvements réduits** : *Recommandation* : la prochaine leçon garde un éclat fixe (contour lumineux, couleur principale), sans scintiller ; sans mouvements réduits, un scintillement doux, jamais plus de 3 éclats par seconde. L'information « À toi ! » reste écrite dans les deux cas. D'accord ?
- **#99.19 Toucher le personnage guide** : *Recommandation* : le personnage guide est décoratif ; le toucher ne fait rien, c'est la leçon sous lui qui s'ouvre (une seule cible par leçon, pas de double sens pour le lecteur d'écran). Pas de scénario tant que le PO ne veut pas autre chose. D'accord ?
- **#99.20 La marche ne bloque jamais** : *Recommandation* : pendant la marche, toutes les leçons, les onglets et le dock restent utilisables ; toucher une leçon l'ouvre tout de suite (skill `gamification` : une animation ne retient jamais l'enfant). D'accord ?
- **#99.21 Avancée dans une autre matière** : exemple : Léa réussit « Maths 1 » depuis l'accueil, puis « Mon parcours » s'ouvre sur le français. *Recommandation* : chaque matière garde sa prochaine leçon connue ; le personnage guide ne marche pas en français, et marche de la leçon 1 à la leçon 2 quand Léa choisit l'onglet « Maths ». D'accord ?
- **#99.22 Après le test de départ** : exemple de #99.10 : après le test de départ, « Voir mon parcours » ouvre le parcours dont la prochaine leçon est passée de la leçon 1 à la leçon 12. *Recommandation* : oui, le personnage guide y marche de la leçon 1 à la leçon 12 (le profil a été choisi avant le test de départ, #99.9) ; pas de scénario de plus, le cas est couvert par le saut de R3 et par #99.9. Faut-il un scénario dédié dans le fichier de #99 (il demanderait la bibliothèque de test de #27) ?

## Termes à signaler (glossaire)

- Mots employés dans les scénarios, proposés comme **mots d'interface** hors glossaire (comme « paysage », Décision n°16) : « dessin du parcours », « fin du dessin du parcours », « se tient sur », « marche », « brille », « coffre ouvert rempli d'étoiles dessinées » (#99.1, #99.12, #99.15).
- Termes du domaine nouveaux, déjà au glossaire « à valider (#99) » : **Avancée dans le parcours**, **Prochaine leçon connue** ; les scénarios ne les emploient pas (ils décrivent ce que l'enfant voit).
- Aucun emploi de « carte », « chemin », « étape », « verrouillée » ni « cadenas » comme terme ; « cadenas » n'apparaît que dans une étape qui vérifie son **absence** (#99.4).

## Décisions

Aucune pour l'instant.
