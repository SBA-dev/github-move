# Critères d'acceptance : issue #106, une célébration propre à chaque univers

Scénarios : `features/106-celebration-de-l-univers.feature` (`@issue-106 @wip`).
Modèle : `docs/stories/106/domain-model.md` (questions 106.1 à 106.23).
État : **cadrage validé par le PO le 2026-11-02** (« 106 reco tout », https://github.com/SBA-dev/github-move/issues/106#issuecomment-6588450629) :
toutes les recommandations des questions 106.1 à 106.27 sont retenues (section « Décisions ») ; 106.28 est tranchée ensuite par le PO (« cacher »). Le fichier couvre les
livraisons **106a** (mécanisme et univers « Sports », mergée), **106b** (univers « Danse », mergée, scénarios tagués
en plus `@livraison-106b`), **106c** (univers « Animaux de la forêt », mergée, scénarios tagués en plus
`@livraison-106c`), **106d** (univers « Princesses et fées », mergée, scénarios tagués en plus `@livraison-106d`) et
**106e** (univers « Police », scénarios tagués en plus `@livraison-106e`) et **106g** (moment « matière réussie » à la
fin de la séance, scénarios tagués en plus `@livraison-106g`) ; les scénarios des livraisons suivantes (106f et 106h)
sont tagués en plus `@hors-106a`, exclus, et restent `@a-valider` jusqu'à leur livraison (mise en place, noms des
variantes, 106.26). Aucun scénario de 106a à 106e ni de 106g n'est `@a-valider`. Sélection des scénarios actifs : `@issue-106 and not @hors-106a`.

## Objectif

En tant qu'**enfant**, quand je **relève un défi** pour la première fois (et plus tard quand je rends une **matière
réussie**), je veux que mon **personnage guide** fasse une **célébration de l'univers** (nom validé, 106.1) propre à
mon **univers**, afin de vivre un vrai moment de victoire dans le monde que j'ai choisi.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : le défi relevé, déjà fêté par l'annonce « Défi relevé ! » (#100), devient un moment fort et visible ;
- **autonomie** : l'enfant retrouve l'univers qu'il a choisi, jusque dans la victoire ;
- **lien** : c'est son personnage guide qui fête avec lui.

Déclencheur métier : le **défi relevé pour la première fois** (#100, `defiReleveParLaSeance`). Garde-fous respectés :
le hasard ne choisit que la variante de la célébration, jamais si l'enfant est fêté ni ce qu'il reçoit ; aucune étoile,
aucun objet, rien d'enregistré ; aucune comparaison entre enfants ; rien ne retient l'enfant (boutons et clavier
utilisables dès la première image).

## Ce que couvre 106a

- Mécanisme : moment « défi relevé » (première fois seulement), choix de la célébration selon l'univers du profil au
  moment où elle est jouée, tirage de la variante, image fixe en mouvements réduits, annonce unique, boutons.
- Univers **Sports** : Coach Léo marque un but, puis fait la glissade à genoux, l'avion ou la danse avec clin d'œil ;
  cri de victoire « BUT ! » ; musique de la célébration (« grande victoire » tant que le PO n'a pas choisi, 106.12) ;
  les confettis de la scène de Coach Léo font partie de sa célébration (106.24).
- Les cinq autres univers gardent la **célébration commune** de #97 (106.18).

## Ce que couvre 106b

- Univers **Danse** : Lili entre en scène et fait une pirouette, puis fait le grand jeté, le ruban ou les petits sauts
  (noms en clair fixés d'après la maquette validée `docs/maquettes/lili-danse.html`, boutons « A · Grand jeté »,
  « B · Ruban », « C · Petits sauts » : 106.26) ; cri de victoire « Bravo ! », affiché et jamais lu ; musique de la
  célébration de Lili (« grande victoire » tant que le PO n'a pas choisi, 106.12).
- Les fleurs et les pétales lancés depuis la salle (« les pétales de la salle ») font partie de la célébration de
  l'univers « Danse », comme les confettis de la scène de Coach Léo (106.24 appliquée) : ils remplacent les confettis
  de la célébration commune et ne tombent pas en mouvements réduits.
- Lili n'apparaît qu'une fois, dans la scène, sa bulle gardant ses paroles (106.28).
- « Chapitre réussi ! » de la maquette n'est pas repris : l'annonce reste « Défi relevé ! » (glossaire, n° 41).
- Ce qui ne dépend pas de l'univers reste décrit une seule fois, avec Coach Léo, et n'est pas dupliqué en Danse :
  toucher hors des boutons, boutons et clavier (R5), Muet et écran du parent (R7), défi rejoué (R3, où le petit
  personnage guide à côté de la bulle revient parce que la célébration commune est jouée, quel que soit l'univers),
  annonce, boutons et parcours identiques (R2, dont le Plan contient déjà Danse). Ne sont repris en Danse que les
  scénarios qui vérifient la scène propre à l'univers : son contenu, sa variante, son image fixe, son cri de victoire
  caché aux lecteurs d'écran et sa place à 360 px.
- La règle 106b porte un `Contexte` de règle : « Paul a changé l'univers du profil enfant de Léa en « Danse » ».

Durées (pour l'implémentation et la review, jamais dans les étapes) : 3 s au plus (106.9 B), boutons, clavier et
annonce disponibles dès la première image ; écart à 97.23 noté dans la décision 0039 (106.9 B retenue).

## Règles

| # | Règle | Scénarios (106a) |
|---|---|---|
| R1 | Au premier défi relevé dans l'univers « Sports », Coach Léo joue la célébration de l'univers à la place de la célébration commune, avant de féliciter l'enfant ; il n'apparaît qu'une fois, dans la scène, sa bulle gardant ses paroles (106.28) | Au premier défi relevé, Coach Léo marque un but et le fête, puis félicite Léa · Le hasard ne choisit que la variante (Plan, 3 exemples) · Un défi relevé avec des erreurs est fêté par la même célébration · Sans réseau, Coach Léo joue quand même la célébration |
| R2 | L'univers ne change que la mise en scène : même annonce, mêmes boutons, aucune étoile, même suite du parcours | Dans l'univers « <univers> », la fin du défi annonce et propose la même chose (Plan : Sports, Danse, Animaux de la forêt) · Après la célébration, le parcours de Léa est le même que dans un autre univers |
| R3 | Seul le premier défi relevé est fêté par la célébration de l'univers ; un défi rejoué garde la célébration commune (confettis compris, 106.25) et « séance terminée » | Rejouer un défi relevé fait entendre « séance terminée », avec la célébration commune et sans but de Coach Léo |
| R4 | La célébration est celle de l'univers du profil au moment du défi relevé ; un univers pas encore livré garde la célébration commune | Dans l'univers « <univers> », pas encore livré, le premier défi relevé garde la célébration commune (Plan, 1 univers depuis 106e : Pompiers ; Princesses et fées retiré en 106d, Police en 106e) · Un enfant passé dans l'univers « Sports » voit Coach Léo fêter son premier défi relevé |
| R5 | La célébration ne retient jamais l'enfant : un toucher hors des boutons ne fait rien ; boutons et clavier agissent tout de suite et arrêtent la musique | Toucher l'écran en dehors des boutons ne change rien · Toucher « Mon parcours » y mène tout de suite et arrête la musique · Le clavier n'est jamais bloqué · À 360 px, la célébration tient dans la largeur et ses boutons restent assez grands |
| R6 | Mouvements réduits : image fixe de la même scène, cri et annonce, sans mouvement ni confettis ; une seule annonce aux lecteurs d'écran | Avec les mouvements réduits, image fixe sans mouvement ni confettis · Les lecteurs d'écran annoncent une seule fois « Défi relevé ! », sans lire le cri de victoire |
| R7 | La musique est un effet sonore : jouée en Muet (seule la parole est coupée), arrêtée par un écran du parent | En Muet, la musique se fait entendre, sans parole · En arrivant sur un écran du parent, la musique s'arrête |

Livraison 106b, scénarios tagués `@livraison-106b` :

| # | Règle | Scénarios (106b) |
|---|---|---|
| R8 | Dans l'univers « Danse », Lili joue au premier défi relevé sa célébration de l'univers à la place de la célébration commune, avec les mêmes garanties que Coach Léo : image fixe en mouvements réduits, cri de victoire jamais lu, place tenue à 360 px | Au premier défi relevé dans l'univers « Danse », Lili entre en scène, fait une pirouette et le fête, puis félicite Léa · Le hasard ne choisit que la variante : avec « <variante> », Lili entre toujours en scène et fait sa pirouette (Plan : le grand jeté, le ruban, les petits sauts) · Avec les mouvements réduits, Léa voit l'image fixe de la célébration de l'univers « Danse », sans mouvement, ni confettis, ni pétales · Dans l'univers « Danse », les lecteurs d'écran annoncent une seule fois « Défi relevé ! », sans lire « Bravo ! » · À 360 px, la célébration de l'univers « Danse » tient dans la largeur et ses boutons restent assez grands |

Livraisons suivantes, scénarios tagués `@hors-106a` (tous `@a-valider` ; 106g, livrée, a sa section plus bas) :

| Livraison | Règle | Scénarios |
|---|---|---|
| 106f | Chaque univers a sa célébration, jouée par son personnage guide, avec son cri de victoire | Dans l'univers « <univers> », <personnage guide> fête le premier défi relevé à sa façon (Plan : Pompiers ; Danse livré en 106b, Animaux de la forêt en 106c, Princesses et fées en 106d, Police en 106e) |
| 106h | Au palier des tenues, le personnage guide joue sa célébration en portant la tenue reçue ; une seule célébration par fin | La séance qui fait recevoir une tenue fait danser Coach Léo avec sa nouvelle tenue · Une séance qui rend la matière réussie et fait recevoir une tenue ne joue qu'une célébration |

Leur mise en place (bibliothèque de test, étoiles) sera reprise dans leur livraison ; ils servent ici à rendre
visible le périmètre complet.

## Example mapping (106a)

- **R1** : Léa (CE1, Sports) relève le défi 1 de maths sans erreur → Coach Léo marque un but, puis une des trois
  variantes ; « BUT ! » ; musique, puis « Bravo Léa ! Tu as relevé le défi 1 ! ». Même chose avec une erreur à chaque
  question, et sans réseau. Le tirage fixé à « l'avion » → but, puis l'avion.
- **R2** : Léa en Sports, en Danse, en Animaux de la forêt → toujours « Défi relevé ! », « Mon parcours » et
  « Accueil », aucune étoile ; ensuite Coach Léo se tient sur « Maths 6 », repère « Défi 1 » relevé.
- **R3** : Léa rejoue le défi 1 → « séance terminée », « Tu as encore relevé le défi 1 ! », confettis, pas de but.
- **R4** : Léa passée en Danse (Lili), Police (Agent Max)… → confettis et « grande victoire » de #97 ; Tom passé
  d'Animaux de la forêt à Sports → Coach Léo.
- **R5** : toucher le fond → la célébration continue et la musique finit ; « Mon parcours » → parcours, musique
  arrêtée ; « Accueil » au clavier → « Qui joue ? » ; 360 px → rien ne dépasse, boutons de 44 px.
- **R6** : mouvements réduits → image fixe avec « BUT ! », « Défi relevé ! », aucun confetti ; lecteur d'écran :
  « Défi relevé ! » une fois, jamais « BUT ! ».
- **R7** : Muet → musique entendue, aucune parole ; « espace parent » pendant la célébration → musique arrêtée.

## Example mapping (106b)

- **R8** : Léa (CE1) passée en Danse relève le défi 1 de maths → Lili entre en scène et fait une pirouette, puis le
  grand jeté, le ruban ou les petits sauts ; « Bravo ! » ; musique, puis « Bravo Léa ! Tu as relevé le défi 1 ! » ;
  Lili seulement dans la scène ; ni confettis ni « séance terminée » de la célébration commune. Tirage fixé à « le
  ruban » → pirouette, puis le ruban. Mouvements réduits → image fixe avec « Bravo ! », « Défi relevé ! », aucun
  confetti ni pétale. Lecteur d'écran → « Défi relevé ! » une fois, jamais « Bravo ! » (la bulle « Bravo Léa ! … »
  reste lisible : elle n'est pas le cri de victoire). 360 px → « Bravo ! » visible, rien ne dépasse, boutons de 44 px.

Retour après une erreur (checklist `gamification`) : sans objet dans la célébration elle-même ; un défi relevé avec
des erreurs est fêté pareil (R1), et les erreurs du défi suivent les règles de #100.

Droits d'accès : **aucun scénario `@acces`**. La story ne lit que l'univers du profil (déjà couvert par #6) et le défi
relevé (couvert par #100) ; elle n'enregistre rien et n'ajoute ni table, ni policy, ni Edge Function.

Règle absolue sur les contenus : vérifiée par la review et la planche (skill `illustration`, section 0), pas par un
scénario. Sports : une fête joyeuse, ni adversaire moqué, ni coupe, ni podium, ni classement ; aucun coffre. Danse :
tenue adaptée aux enfants (collant opaque, tutu, poses de danse classique), sans stéréotype ; public discret ; aucun
coffre. Les
scénarios ne décrivent jamais de contenu interdit.

Pour l'équipe (pas une question au PO) : le Plan « Le hasard ne choisit que la variante » demande une étape de mise en
place qui fixe le tirage (« le hasard de la célébration de l'univers tire « … » »), par le port `Hasard`, comme les
autres scénarios à hasard fixé. Le scénario de la musique sans réseau est visuel ; la musique hors ligne relève de
`@pwa` (comme #97).

## Hors périmètre

- L'univers « Pompiers » (106f) et les danses de victoire aux paliers des tenues (106h) : livraisons suivantes,
  scénarios `@hors-106a`. La matière réussie (106g) a sa section plus bas.
- Petites célébrations à chaque fin de séance (106.8), réaction animée à une réponse fausse (106.20), grand défi de
  la matière (#137).
- Toute étoile, tout objet, tout enregistrement : la célébration n'en crée aucun.

## Livraison 106c

Univers **Animaux de la forêt**, scénarios tagués `@livraison-106c`, dans une règle à `Contexte` (« Paul a changé
l'univers du profil enfant de Léa en « Animaux de la forêt » »). Mêmes scénarios que pour la livraison 106b (Danse) :

| # | Règle | Scénarios (106c) |
|---|---|---|
| R9 | Dans l'univers « Animaux de la forêt », Noisette joue au premier défi relevé sa célébration de l'univers à la place de la célébration commune, avec les mêmes garanties que Coach Léo : image fixe en mouvements réduits, cri de victoire jamais lu, place tenue à 360 px | Au premier défi relevé dans l'univers « Animaux de la forêt », Noisette attrape une noisette dorée et le fête, puis félicite Léa · Le hasard ne choisit que la variante : avec « <variante> », Noisette attrape toujours une noisette dorée (Plan : le jonglage, la noisette croquée, les joues pleines) · Avec les mouvements réduits, Léa voit l'image fixe de la célébration de l'univers « Animaux de la forêt », sans mouvement, ni confettis, ni feuilles · Dans l'univers « Animaux de la forêt », les lecteurs d'écran annoncent une seule fois « Défi relevé ! », sans lire « Hourra ! » · À 360 px, la célébration de l'univers « Animaux de la forêt » tient dans la largeur et ses boutons restent assez grands |

- Noms des variantes fixés d'après la maquette validée `docs/maquettes/noisette-animaux.html` (boutons
  « A · Jonglage », « B · Croque », « C · Joues pleines ») : « le jonglage », « la noisette croquée », « les joues
  pleines » (106.26 ; l'ancien exemple disait « les joues gonflées »). Libellés neutres : rien de moqueur ni de
  dégoûtant (règle absolue sur les contenus).
- Cri de victoire « Hourra ! », affiché et jamais lu ; musique de la célébration de Noisette (« grande victoire » tant
  que le PO n'a pas choisi, 106.12).
- Les feuilles qui tombent sur la forêt (« les feuilles de la forêt ») font partie de la célébration de l'univers,
  comme les confettis de la scène de Coach Léo (106.24 appliquée) : elles remplacent les confettis de la célébration
  commune et ne tombent pas en mouvements réduits.
- Noisette n'apparaît qu'une fois, dans la scène, sa bulle gardant ses paroles (106.28). « Chapitre réussi ! » de la
  maquette n'est pas repris : l'annonce reste « Défi relevé ! ».
- Ce qui ne dépend pas de l'univers (toucher, boutons et clavier, Muet, espace parent, défi rejoué, annonce et
  parcours identiques : R2, R3, R5, R7) reste décrit une seule fois, avec Coach Léo.
- Example mapping : Léa (CE1) passée en Animaux de la forêt relève le défi 1 de maths → Noisette attrape une noisette
  dorée, puis le jonglage, la noisette croquée ou les joues pleines ; « Hourra ! » ; musique, puis « Bravo Léa ! Tu
  as relevé le défi 1 ! » ; ni confettis ni « séance terminée » de la célébration commune. Tirage fixé à « le
  jonglage » → noisette dorée attrapée, puis le jonglage. Mouvements réduits → image fixe avec « Hourra ! » et
  « Défi relevé ! », aucun confetti ni feuille. Lecteur d'écran → « Défi relevé ! » une fois, jamais « Hourra ! ».
  360 px → « Hourra ! » visible, rien ne dépasse, boutons de 44 px.
- Contenus : une fête joyeuse dans la forêt, Noisette fière et souriante ; aucun coffre. Aucune question nouvelle.
- Réponses du PO du 2026-11-05 (« 106c reco tout ») : la tenue portée pendant la célébration est renvoyée à 106h
  (106.31), la planche de Noisette est validée (106.32), le jonglage reste comme dans la maquette (106.33) et aucune
  étoile à cinq branches ne tombe avec les feuilles (106.35). Aucun scénario ne change.

## Livraison 106d

Univers **Princesses et fées**, scénarios tagués `@livraison-106d`, dans une règle à `Contexte` (« Paul a changé
l'univers du profil enfant de Léa en « Princesses et fées » »). Mêmes scénarios que pour les livraisons 106b (Danse)
et 106c (Animaux de la forêt) :

| # | Règle | Scénarios (106d) |
|---|---|---|
| R10 | Dans l'univers « Princesses et fées », Lumi joue au premier défi relevé sa célébration de l'univers à la place de la célébration commune, avec les mêmes garanties que Coach Léo : image fixe en mouvements réduits, cri de victoire jamais lu, place tenue à 360 px | Au premier défi relevé dans l'univers « Princesses et fées », Lumi fait éclore une fleur magique d'un sort et le fête, puis félicite Léa · Le hasard ne choisit que la variante : avec « <variante> », Lumi fait toujours éclore une fleur magique d'un sort (Plan : l'arc-en-ciel, l'envol, les chiffres et les lettres) · Avec les mouvements réduits, Léa voit l'image fixe de la célébration de l'univers « Princesses et fées », sans mouvement, ni confettis, ni étincelles du jardin · Dans l'univers « Princesses et fées », les lecteurs d'écran annoncent une seule fois « Défi relevé ! », sans lire « Magique ! » · À 360 px, la célébration de l'univers « Princesses et fées » tient dans la largeur et ses boutons restent assez grands |

- Noms des variantes fixés d'après la maquette validée `docs/maquettes/lumi-princesse.html` (106.26) : « l'arc-en-ciel »,
  « l'envol », « les chiffres et les lettres ». L'ancien exemple disait « les signes », trop vague : la maquette montre
  des chiffres et des lettres (bouton « C · Chiffres ») et Lumi est la fée des nombres et des mots. La clé `signes` du
  domaine ne change pas ; ces libellés ne sont jamais montrés à l'enfant.
- Action : Lumi fait éclore une fleur magique d'un sort (geste doux de baguette, `domain-model.md`, « Règle absolue de
  contenu pour Lumi »). L'ancien exemple disait « un sort fait éclore une fleur ».
- Cri de victoire « Magique ! », affiché et jamais lu ; musique de la célébration de Lumi (« grande victoire » tant que
  le PO n'a pas choisi, 106.12).
- Les étincelles et les pétales qui tombent sur le jardin (« les étincelles du jardin ») font partie de la célébration
  de l'univers, comme les confettis de la scène de Coach Léo (106.24 appliquée) : ils remplacent les confettis de la
  célébration commune et ne tombent pas en mouvements réduits. Les traînées de la baguette et de l'envol font partie de
  l'action et de la variante ; elles n'apparaissent pas sur l'image fixe.
- Lumi n'apparaît qu'une fois, dans la scène, sa bulle gardant ses paroles (106.28). « Chapitre réussi ! » de la
  maquette n'est pas repris : l'annonce reste « Défi relevé ! ».
- Ce qui ne dépend pas de l'univers (toucher, boutons et clavier, Muet, espace parent, défi rejoué, annonce et
  parcours identiques : R2, R3, R5, R7) reste décrit une seule fois, avec Coach Léo.
- Les scénarios ne parlent ni des étoiles ni de ce que deviennent les chiffres et les lettres : ils ne dépendent pas
  de la réponse à 106.34 (tranchée le 2026-11-05, voir plus bas).
- Example mapping : Léa (CE1) passée en Princesses et fées relève le défi 1 de maths → Lumi fait éclore une fleur
  magique d'un sort, puis l'arc-en-ciel, l'envol ou les chiffres et les lettres ; « Magique ! » ; musique, puis
  « Bravo Léa ! Tu as relevé le défi 1 ! » ; ni confettis ni « séance terminée » de la célébration commune. Tirage
  fixé à « l'envol » → fleur éclose, puis l'envol (« Magique ! » après la redescente). Mouvements réduits → image fixe
  avec « Magique ! » et « Défi relevé ! », aucun confetti ni étincelle du jardin. Lecteur d'écran → « Défi relevé ! »
  une fois, jamais « Magique ! ». 360 px → « Magique ! » visible, rien ne dépasse, boutons de 44 px.
- Contenus (vérifiés par la review et la planche, pas par un scénario) : une fête joyeuse dans un jardin féerique ;
  tenue de fée couvrante, jupe jamais au-dessus des genoux, même pendant l'envol ; baguette courte et arrondie, geste
  doux qui ne ressemble ni à une frappe ni à un tir ; envol sans chute ni danger ; château accueillant, ciel clair ;
  Lumi agit, elle n'est pas fêtée pour son apparence ; aucun coffre.

Décisions de la livraison 106d : **2026-11-05**. Réponse du PO, mot pour mot : « 106d reco tout »
(https://github.com/SBA-dev/github-move/issues/106#issuecomment-6652002035). Chaque question est tranchée par sa
recommandation (détail dans `docs/stories/106/domain-model.md`, section « Livraison 106d ») ; aucune ne change de
scénario `@livraison-106d` (vérifié : aucun ne parle d'étoiles, aucun n'est `@a-valider`).

| Question | Réponse | Effet sur les scénarios |
|---|---|---|
| 106.31 Tenue portée pendant la célébration (posée par 106c) | Réponse du PO 2026-11-05 : reco. Renvoyée à 106h | Aucun en 106d ; 106h |
| 106.34 Étoiles de la scène de Lumi | Réponse du PO 2026-11-05 : reco A. Aucune étoile à cinq branches dans la scène de Lumi (fleurs et étincelles à quatre branches à la place), pour ne pas la confondre avec l'étoile gagnée à la fin d'une séance | Aucun (vérifié par la planche et la review) |
| 106.35 Même règle pour Lili et Noisette | Réponse du PO 2026-11-05 : reco (oui). 106c retire les petites étoiles des feuilles de Noisette dans sa propre livraison ; le correctif de l'étoile dorée du ruban de Lili revient à 106d, après le merge de 106b | Aucun : pas de scénario pour le ruban de Lili (vérifié par la planche et la review) |
| 106.36 Planche de Lumi | Réponse du PO 2026-11-05 : reco. Planche validée, écarts compris ; préfixe `princesse-` accepté | Aucun |

## Livraison 106e

Univers **Police**, scénarios tagués `@livraison-106e`, dans une règle à `Contexte` (« Paul a changé l'univers du
profil enfant de Léa en « Police » »). Mêmes scénarios que pour les livraisons 106b, 106c et 106d (5 scénarios, 7 cas) :

| # | Règle | Scénarios (106e) |
|---|---|---|
| R11 | Dans l'univers « Police », Agent Max joue au premier défi relevé sa célébration de l'univers à la place de la célébration commune, avec les mêmes garanties que Coach Léo : image fixe en mouvements réduits, cri de victoire jamais lu, place tenue à 360 px | Au premier défi relevé dans l'univers « Police », Agent Max retrouve un chiot perdu et le fête, puis félicite Léa · Le hasard ne choisit que la variante : avec « <variante> », Agent Max retrouve toujours le chiot perdu (Plan : le chef d'orchestre, le tour en trottinette, la danse de la victoire) · Avec les mouvements réduits, Léa voit l'image fixe de la célébration de l'univers « Police », sans mouvement, ni confettis, ni confettis du commissariat · Dans l'univers « Police », les lecteurs d'écran annoncent une seule fois « Défi relevé ! », sans lire « Enquête résolue ! » · À 360 px, la célébration de l'univers « Police » tient dans la largeur et ses boutons restent assez grands |

- Noms des variantes fixés d'après la maquette validée `docs/maquettes/agent-max-police.html` (boutons
  « A · Orchestre », « B · Trottinette », « C · Danse ») : « le chef d'orchestre », « le tour en trottinette », « la
  danse de la victoire » (106.26 ; l'ancien exemple disait « l'orchestre, la trottinette ou la danse »). Ils sont
  toujours écrits en entier : « la danse de la victoire » est une variante d'Agent Max, pas la **danse de victoire**
  du glossaire (106.6 A, 106h).
- Cri de victoire « Enquête résolue ! », affiché et jamais lu ; musique de la célébration d'Agent Max (« grande
  victoire » tant que le PO n'a pas choisi, 106.12). « tuut ! », « dring ! » et l'enseigne du commissariat font
  partie du dessin : ni joués, ni annoncés.
- Les confettis lancés sur la place (« les confettis du commissariat ») font partie de la célébration de l'univers,
  comme les confettis de la scène de Coach Léo (106.24 appliquée) : ils remplacent les confettis de la célébration
  commune et ne tombent pas en mouvements réduits.
- Agent Max n'apparaît qu'une fois, dans la scène, sa bulle gardant ses paroles (106.28). « Chapitre réussi ! » de la
  maquette n'est pas repris : l'annonce reste « Défi relevé ! ».
- Police est retiré du Plan « pas encore livré » (R4) et des exemples `@hors-106a` (106f).
- Ce qui ne dépend pas de l'univers (toucher, boutons et clavier, Muet, espace parent, défi rejoué, annonce et
  parcours identiques : R2, R3, R5, R7) reste décrit une seule fois, avec Coach Léo.
- Example mapping : Léa (CE1) passée en Police relève le défi 1 de maths → Agent Max retrouve un chiot perdu, puis le
  chef d'orchestre, le tour en trottinette ou la danse de la victoire ; « Enquête résolue ! » ; musique, puis « Bravo
  Léa ! Tu as relevé le défi 1 ! » ; ni confettis ni « séance terminée » de la célébration commune. Tirage fixé à « le
  tour en trottinette » → chiot retrouvé, puis le tour en trottinette. Mouvements réduits → image fixe avec
  « Enquête résolue ! » et « Défi relevé ! », ni confettis de la célébration commune ni confettis du commissariat.
  Lecteur d'écran → « Défi relevé ! » une fois, jamais « Enquête résolue ! ». 360 px → « Enquête résolue ! »
  visible, rien ne dépasse, boutons de 44 px.
- Contenus (vérifiés par la review et la planche, pas par un scénario) : une enquête résolue qui aide ; le chiot est
  content et en bonne santé ; ni arrestation, ni menottes, ni arme, ni sirène, ni gyrophare, ni lumière qui
  clignote ; les petites voitures sont civiles ; aucune étoile à cinq branches (écusson à la place) ; aucun coffre.
  Les scénarios ne décrivent aucun contenu interdit.
- Questions du modèle, sans effet sur les scénarios : 106.38 (durée de la scène d'Agent Max), 106.39 (étoile du
  dessin fixe d'Agent Max) et 106.40 (planche d'Agent Max), tranchées le 2026-11-05 (section « Livraison 106e » de
  `docs/stories/106/domain-model.md`, et « Décisions » ci-dessous).

## Livraison 106g

Moment **« matière réussie »**, à la fin de la séance (106.4 A, 106.5), scénarios tagués `@livraison-106g`. La
séance qui rend une matière réussie (toutes les leçons de la matière de la classe du profil réussies, au moins
1 étoile ; glossaire, « Matière réussie ») fait jouer la célébration de l'univers du profil : même scène et mêmes
variantes qu'au défi relevé, seule l'annonce change (invariant 1). Une séance complète est longue en E2E : 3
scénarios seulement, chacun sur la leçon « L'eau » de la bibliothèque de test du défi (sciences du CE1, 3 leçons de
2 questions, #100 et #137), avec Coach Léo (Contexte du fichier : Léa en « Sports »).

| # | Règle | Scénarios (106g) |
|---|---|---|
| R12 | La séance qui rend une matière réussie fait jouer la célébration de l'univers à la place de la célébration commune, avec l'annonce « Matière réussie ! », annoncée une seule fois aux lecteurs d'écran ; les autres annonces de la fin restent | La séance qui rend les sciences du CE1 réussies fait jouer la célébration de l'univers « Sports » et annonce « Matière réussie ! » |
| R13 | Seule la séance qui rend la matière réussie est fêtée ; rejouer une leçon d'une matière déjà réussie garde la célébration commune | Rejouer une leçon d'une matière déjà réussie garde la célébration commune, sans « Matière réussie ! » |
| R14 | Avec les mouvements réduits : image fixe de la célébration de l'univers, cri de victoire et annonce, sans confettis | Avec les mouvements réduits, la séance qui rend les sciences réussies montre l'image fixe de la célébration de l'univers « Sports » et « Matière réussie ! » |

Example mapping :
- **R12** : Léa (CE1, Sports) a réussi « Les êtres vivants » et « Les saisons » ; elle réussit la séance complète de
  « L'eau » → Coach Léo marque un but, puis une des trois variantes ; « Matière réussie ! » affichée et annoncée une
  seule fois aux lecteurs d'écran (jamais « BUT ! », invariant 8) ; Coach Léo seulement dans la scène, sa bulle
  gardant ses paroles de fin de séance (106.28 « cacher » ; celles de la séance qui ouvre le grand défi, #137.4) ; « Le grand défi des sciences est ouvert ! » reste
  affiché (en dernier dans la zone des nouveautés, `docs/stories/137/acceptance.md`) ; ni confettis ni effet sonore
  de la célébration commune, la musique de la célébration de Coach Léo (« grande victoire ») une seule fois.
- **R13** : Léa a déjà réussi les 3 leçons de sciences et rejoue « L'eau » → confettis de la célébration commune,
  Coach Léo à côté de sa bulle, pas de « Matière réussie ! », pas de but (même règle que le défi rejoué, R3).
- **Univers sans célébration (règle retirée des scénarios)** : un univers sans célébration de l'univers garde la
  célébration commune, avec la même annonce « Matière réussie ! ». L'annonce dépend du fait, pas de la scène
  (invariants 1 et 8 ; `titreDeLaMatiereReussie()` hors de `CelebrationDeLUnivers`, modèle, section « Livraison 106g »).
  Le scénario E2E « Pompiers » (univers pas encore livré) est retiré : 106f livre Pompiers et sera mergée avant les
  E2E de 106g, il n'aurait plus de sujet. La règle reste couverte par les tests unitaires du domaine
  (`celebration-de-la-fin_test.ts` : pompier → commune ; annonce tirée du seul fait).
- **R14** : mouvements réduits → image fixe de la scène de Coach Léo avec « BUT ! », « Matière réussie ! » sans
  mouvement, aucun confetti (ni ceux de la scène, ni ceux de la célébration commune ; 106.15, 106.24).

Décisions appliquées, sans question nouvelle :
- **Annonces de la fin** (106.7, R6 de #100, #137) : la célébration de l'univers remplace seulement la célébration
  commune (confettis et effet sonore). Toutes les autres annonces de la fin restent affichées : étoiles, objet de la
  cabane, épisode, badge, tenue reçue, grand défi ouvert. Ordre de l'écran de fin (modèle, « Zone des
  nouveautés ») : la scène à la place des confettis, les étoiles, « Matière réussie ! » dans sa propre zone
  `role="status"` (texte de `titreDeLaMatiereReussie()`), les annonces actuelles, « Le grand défi des sciences est
  ouvert ! » en dernier. Seul le grand défi est vérifié par un scénario (R12), parce
  que c'est lui qui accompagne toujours une matière réussie (#137). Les autres sont couverts par leurs stories (#24,
  #31, #32, #33, #102), puisque l'univers ne change que la mise en scène (invariant 1). La tenue reçue à la même fin
  reste annoncée dans les nouveautés (106.7). Jouer la célébration avec la tenue reçue, c'est 106h : ses scénarios
  (`@hors-106a`) ne changent pas.
- **Ce qui ne dépend ni de l'univers ni du moment** : toucher hors des boutons, boutons et clavier, Muet, écran du
  parent, place à 360 px, variantes tirées au hasard. Ces points sont décrits une fois, à la fin du défi (R1, R5, R6,
  R7), et ne sont pas repris à la fin de la séance. Ils restent vérifiés par la review et par les tests du domaine
  (`momentDeCelebrationDeLaFin`, `matiereReussieParLaSeance`).
- **Séance de révision et test de départ** : aucun moment de célébration (27.4, glossaire « Moment de célébration ») ;
  la séance de révision ne rend aucune leçon réussie. **Aucun scénario E2E** n'est ajouté pour eux si 106g ne change
  aucun code de ces écrans : la règle est vérifiée par les tests du domaine (`momentDeCelebrationDeLaFin`). Si
  l'implémentation touche la fin de la séance de révision ou du test de départ, un scénario de non-régression sera
  à ajouter.
- **Droits d'accès** : aucun scénario `@acces`. La matière réussie est recalculée dans le navigateur à partir des
  meilleures étoiles du profil, déjà protégées par la RLS (#24, #25). Rien n'est enregistré.
- **Contenus** : aucun dessin nouveau (scène de Coach Léo de 106a) ; « Matière réussie ! » est un texte neutre.
  « Chapitre réussi ! » des maquettes n'est pas repris.

Pour l'équipe (pas une question au PO) :
- `npx bddgen --tags "@issue-106 and not @hors-106a"` ne signale que deux étapes manquantes : « la fin de la séance
  n'annonce pas « Matière réussie ! » » et « la fin de la séance annonce « Matière réussie ! », sans mouvement ».
- D'autres étapes ont déjà une définition, mais pour un autre écran. Elles doivent être reprises à la fin de la
  séance pour `@issue-106` :
  - « la fin de la séance annonce « Matière réussie ! » » tombe sur l'étape générique de #24 (`ensuite`) ;
  - « la fin de la séance annonce « Le grand défi des sciences est ouvert ! » » tombe aussi sur cette étape générique,
    car celle de #137 est réservée à `@issue-137` ;
  - « les lecteurs d'écran annoncent une seule fois » tombe sur l'étape de #97 ;
  - les étapes de la scène (« Coach Léo joue la célébration de l'univers … », « n'apparaît qu'une fois … »,
    « la célébration commune n'est pas jouée », « Coach Léo ne joue
    pas la célébration de l'univers », « apparaît à côté de la bulle de ses paroles », image fixe) attendent
    aujourd'hui la fin du défi (`attendreLaFinDuDefi`).
- Les 3 scénarios jouent une séance complète. `@issue-106` est déjà dans le `Before` de `features/steps/delais.steps.ts`.

## Questions ouvertes

Aucune pour 106a, 106b ni 106c. Aucune pour 106d : 106.31, 106.34, 106.35 et 106.36 tranchées le
2026-11-05 (section « Livraison 106d »). Aucune pour 106e : 106.38, 106.39 et 106.40 tranchées le 2026-11-05
(section « Décisions »). Aucune pour 106g : 106.44 à 106.46 tranchées le 2026-11-05 (section « Décisions ») ;
aucune ne change les scénarios. L'annonce « Matière réussie ! » dans un
univers sans célébration découle des invariants 1 et 8 (tests du domaine). Reste en attente, sans bloquer :
- le **choix des musiques** des six univers par le PO, à l'écoute (106.12) : d'ici là, la musique de la célébration
  de Coach Léo et celle de Lili sont « grande victoire » ;
- l'**accès réseau** à `opengameart.org` ou `kenney.nl` (106.27) : seul le PO peut l'ouvrir dans l'environnement.

## Décisions

Validation du cadrage : **2026-11-02**. Réponse du PO, mot pour mot : « 106 reco tout »
(https://github.com/SBA-dev/github-move/issues/106#issuecomment-6588450629). Chaque question ci-dessous est tranchée
par sa recommandation. Les questions 106.1 à 106.23 sont détaillées dans `docs/stories/106/domain-model.md`.

| Question | Réponse | Effet sur les scénarios |
|---|---|---|
| 106.1 Nom | Réponse du PO 2026-11-02 : reco. « Célébration de l'univers » et « célébration commune » (celle de #97) ; « célébration » seul est évité | Termes employés partout ; à ajouter au glossaire |
| 106.2 Référence | Réponse du PO 2026-11-02 : reco. Les maquettes validées remplacent le tableau de l'issue (Agent Max, « Défi relevé ! ») | Variantes de Sports d'après la maquette |
| 106.3 Défi rejoué | Réponse du PO 2026-11-02 : reco. Seul le premier défi relevé est fêté ; un défi rejoué garde la célébration commune et « séance terminée » | R3 |
| 106.4 Fin d'une matière | Réponse du PO 2026-11-02 : reco. A, en livraison 106g | R12 à R14 (`@livraison-106g`) |
| 106.5 Matière plus grande ? | Réponse du PO 2026-11-02 : reco. Même célébration, annonce « Matière réussie ! » | R12, R14 |
| 106.6 Danses de victoire | Réponse du PO 2026-11-02 : reco. A, la célébration de l'univers jouée en portant la tenue reçue | Scénarios 106h |
| 106.7 Deux moments à la même fin | Réponse du PO 2026-11-02 : reco. Une seule célébration, celle de la matière | Scénarios 106h |
| 106.8 Fin de chaque séance | Réponse du PO 2026-11-02 : reco. Non dans #106 | Hors périmètre |
| 106.9 Durée | Réponse du PO 2026-11-02 : reco. B, jusqu'à 3 s, boutons, clavier et annonce dès la première image ; écart à 97.23 dans la décision 0039 | R5 ; durée hors des étapes |
| 106.10 Toucher | Réponse du PO 2026-11-02 : reco. On suit 97.17 : un toucher hors des boutons ne fait rien | R5 |
| 106.11 Muet | Réponse du PO 2026-11-02 : reco. On suit 97.2 : la musique est jouée en Muet, seule la parole est coupée | R7 |
| 106.12 Musique | Réponse du PO 2026-11-02 : reco. La musique de l'univers remplace « grande victoire » et passe avant la parole ; le PO la choisit à l'écoute, « grande victoire » d'ici là | R1, R5, R7 : « la musique de la célébration de Coach Léo » est « grande victoire » pour l'instant |
| 106.13 Hasard | Réponse du PO 2026-11-02 : reco. Tirage à chaque fois, sans mémoire | R1 (Plan à hasard fixé) |
| 106.14 Cri de victoire | Réponse du PO 2026-11-02 : reco. Affiché, jamais lu ; lecteur d'écran : seulement le moment ; Pompiers « Mission accomplie ! » | R1, R6 |
| 106.15 Mouvements réduits | Réponse du PO 2026-11-02 : reco. Image fixe de l'état final de la variante tirée, avec le cri et l'annonce | R6 |
| 106.16 Pompiers | Réponse du PO 2026-11-02 : reco. Planche et maquette validées avant 106f | Scénarios 106f |
| 106.17 Découpage | Réponse du PO 2026-11-02 : reco. 106a, puis 106b à 106h | `@hors-106a` |
| 106.18 Univers pas encore livrés | Réponse du PO 2026-11-02 : reco. Ils gardent la célébration commune | R4 |
| 106.19 Noisette | Réponse du PO 2026-11-02 : reco. « elle » | Aucun |
| 106.20 Réponse fausse animée | Réponse du PO 2026-11-02 : reco. Hors de #106, story à part liée à #97 | Hors périmètre |
| 106.21 Changement d'univers | Réponse du PO 2026-11-02 : reco. Célébration du nouvel univers dès le moment suivant | R4 |
| 106.22 Moteur d'animation | Réponse du PO 2026-11-02 : reco. Moteur des maquettes porté dans un composant isolé, Motion pour l'entrée et la sortie ; décision 0039 | Aucun (implémentation) |
| 106.23 Tenue portée | Réponse du PO 2026-11-02 : reco. Le personnage guide garde sa tenue portée pendant la célébration | Aucun en 106a (vérifié par la review) ; 106h |
| 106.24 Confettis de Coach Léo | Réponse du PO 2026-11-02 : reco. Ils font partie de sa célébration de l'univers, distincts des confettis de la célébration commune, qui ne tombent pas ; en mouvements réduits, aucun confetti | R1 (« la célébration commune n'est pas jouée »), R6 (« aucun confetti ne tombe ») ; appliquée en 106b aux pétales de la salle de Lili : R8 (« la célébration commune n'est pas jouée », « aucun confetti ni pétale ne tombe ») |
| 106.25 Défi rejoué | Réponse du PO 2026-11-02 : reco. Il garde les confettis de la célébration commune en plus de « séance terminée » | R3 (« des confettis tombent ») |
| 106.26 Noms des variantes (hors 106a) | Réponse du PO 2026-11-02 : reco. Fixés à la livraison de chaque univers, d'après sa maquette | Danse, fixés en 106b d'après `lili-danse.html` : « le grand jeté », « le ruban », « les petits sauts » (R8, mots employés du `.feature`) ; Animaux, fixés en 106c d'après `noisette-animaux.html` : « le jonglage », « la noisette croquée », « les joues pleines » (R9) ; Princesses et fées, fixés en 106d d'après `lumi-princesse.html` : « l'arc-en-ciel », « l'envol », « les chiffres et les lettres » (R10) ; Police, fixés en 106e d'après `agent-max-police.html` : « le chef d'orchestre », « le tour en trottinette », « la danse de la victoire » (R11) ; scénarios 106f restent `@a-valider` |
| 106.27 Accès réseau aux musiques | Réponse du PO 2026-11-02 : reco (oui), mais l'accès ne peut être ouvert que par le PO ; 106a part avec « grande victoire » | Aucun |
| 106.28 Personnage guide à côté de la bulle pendant la célébration de l'univers : le garder ou le cacher ? | Réponse du PO 2026-11-02 : « cacher ». Pendant la célébration de l'univers, le personnage guide n'apparaît qu'une fois, dans la scène ; sa bulle garde ses paroles et « Réécouter ». Avec la célébration commune (défi rejoué, univers pas encore livré), rien ne change : il reste à côté de sa bulle | R1 (« Coach Léo n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles »), R3 (« Coach Léo apparaît à côté de la bulle de ses paroles ») |
| 106.31 Tenue portée pendant la célébration (106c) | Réponse du PO 2026-11-05 : reco. Renvoyée à 106h pour tous les univers ; Noisette, comme Coach Léo et Lili, est dans sa tenue de base pendant la célébration (https://github.com/SBA-dev/github-move/issues/64#issuecomment-6651992972) | Aucun |
| 106.32 Planche de Noisette (106c) | Réponse du PO 2026-11-05 : reco. Planche validée | Aucun |
| 106.33 Jonglage (106c) | Réponse du PO 2026-11-05 : reco. Le jonglage reste comme dans la maquette | Aucun |
| 106.35 Étoiles à cinq branches (posée par 106d) | Réponse du PO 2026-11-05 : reco (oui). Aucune étoile à cinq branches dans les scènes de Lili et de Noisette : fleurs ou étincelles à quatre branches à la place ; appliquée dans 106c pour Noisette | Aucun (les scénarios ne parlent que des « feuilles de la forêt ») |
| 106.38 Durée de la scène d'Agent Max (106e) | Réponse du PO 2026-11-05 : « 106e reco tout » (https://github.com/SBA-dev/github-move/issues/106#issuecomment-6654943666), reco A. Le port resserre la maquette à environ 5 s en gardant chaque temps fort, puis l'accélère comme les autres pour tenir en 3 s | Aucun |
| 106.39 Étoile du dessin fixe d'Agent Max (106e) | Réponse du PO 2026-11-05 : reco A. Le correctif du dessin fixe est l'issue #158, hors de 106e ; 106e ne touche pas le dessin fixe d'Agent Max | Aucun |
| 106.40 Planche d'Agent Max (106e) | Réponse du PO 2026-11-05 : reco. Planche validée (`docs/stories/106/captures/106e-agent-max-*.png`) | Aucun |
| 106.44 Nom « Matière réussie » (106g) | Réponse du PO 2026-11-05 : « 106g reco tout » (https://github.com/SBA-dev/github-move/issues/106#issuecomment-6665711170), reco (oui). « (à valider) » retiré du glossaire, définition inchangée | Aucun |
| 106.45 Matière réussie une seconde fois (106g) | Réponse du PO 2026-11-05 : reco (oui). Une matière redevenue réussie après l'ajout d'une leçon est fêtée à nouveau ; le grand défi déjà relevé reste relevé | Aucun (règle couverte par les tests du domaine) |
| 106.46 « Découverte » avec la musique (106g) | Réponse du PO 2026-11-05 : reco (oui). La musique de la célébration, puis « découverte » quand la séance donne un objet de la cabane, une tenue ou un épisode, puis la parole | Aucun (ordre des sons couvert par les tests du domaine) |

Correction du 2026-11-02 (sans changement de règle) : dans « Pendant la célébration de l'univers, le clavier n'est jamais bloqué », « Alors Léa voit « Qui joue ? » » devient « Alors Léa voit son accueil », car depuis #100 « Accueil » à la fin d'un défi mène à l'accueil de l'enfant (et non à « Qui joue ? » comme à la fin d'une séance, #97) ; `@wip` est retiré de la fonctionnalité.
