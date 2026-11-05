# Critères d'acceptance : issue #106, une célébration propre à chaque univers

Scénarios : `features/106-celebration-de-l-univers.feature` (`@issue-106 @wip`).
Modèle : `docs/stories/106/domain-model.md` (questions 106.1 à 106.23).
État : **cadrage validé par le PO le 2026-11-02** (« 106 reco tout », https://github.com/SBA-dev/github-move/issues/106#issuecomment-6588450629) :
toutes les recommandations des questions 106.1 à 106.27 sont retenues (section « Décisions ») ; 106.28 est tranchée ensuite par le PO (« cacher »). Le fichier couvre la
livraison **106a** ; les scénarios des livraisons suivantes (106b à 106h) sont tagués en plus `@hors-106a`, exclus
de 106a, et restent `@a-valider` jusqu'à leur livraison (mise en place, noms des variantes, 106.26). Aucun scénario
de 106a n'est `@a-valider`.

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

Durées (pour l'implémentation et la review, jamais dans les étapes) : 3 s au plus (106.9 B), boutons, clavier et
annonce disponibles dès la première image ; écart à 97.23 noté dans la décision 0039 (106.9 B retenue).

## Règles

| # | Règle | Scénarios (106a) |
|---|---|---|
| R1 | Au premier défi relevé dans l'univers « Sports », Coach Léo joue la célébration de l'univers à la place de la célébration commune, avant de féliciter l'enfant ; il n'apparaît qu'une fois, dans la scène, sa bulle gardant ses paroles (106.28) | Au premier défi relevé, Coach Léo marque un but et le fête, puis félicite Léa · Le hasard ne choisit que la variante (Plan, 3 exemples) · Un défi relevé avec des erreurs est fêté par la même célébration · Sans réseau, Coach Léo joue quand même la célébration |
| R2 | L'univers ne change que la mise en scène : même annonce, mêmes boutons, aucune étoile, même suite du parcours | Dans l'univers « <univers> », la fin du défi annonce et propose la même chose (Plan : Sports, Danse, Animaux de la forêt) · Après la célébration, le parcours de Léa est le même que dans un autre univers |
| R3 | Seul le premier défi relevé est fêté par la célébration de l'univers ; un défi rejoué garde la célébration commune (confettis compris, 106.25) et « séance terminée » | Rejouer un défi relevé fait entendre « séance terminée », avec la célébration commune et sans but de Coach Léo |
| R4 | La célébration est celle de l'univers du profil au moment du défi relevé ; un univers pas encore livré garde la célébration commune | Dans l'univers « <univers> », pas encore livré, le premier défi relevé garde la célébration commune (Plan, 4 univers depuis 106c : Princesses et fées, Police, Pompiers, Danse) · Un enfant passé dans l'univers « Sports » voit Coach Léo fêter son premier défi relevé |
| R5 | La célébration ne retient jamais l'enfant : un toucher hors des boutons ne fait rien ; boutons et clavier agissent tout de suite et arrêtent la musique | Toucher l'écran en dehors des boutons ne change rien · Toucher « Mon parcours » y mène tout de suite et arrête la musique · Le clavier n'est jamais bloqué · À 360 px, la célébration tient dans la largeur et ses boutons restent assez grands |
| R6 | Mouvements réduits : image fixe de la même scène, cri et annonce, sans mouvement ni confettis ; une seule annonce aux lecteurs d'écran | Avec les mouvements réduits, image fixe sans mouvement ni confettis · Les lecteurs d'écran annoncent une seule fois « Défi relevé ! », sans lire le cri de victoire |
| R7 | La musique est un effet sonore : jouée en Muet (seule la parole est coupée), arrêtée par un écran du parent | En Muet, la musique se fait entendre, sans parole · En arrivant sur un écran du parent, la musique s'arrête |

Livraisons suivantes, scénarios tagués `@hors-106a` (tous `@a-valider`) :

| Livraison | Règle | Scénarios |
|---|---|---|
| 106b à 106f | Chaque univers a sa célébration, jouée par son personnage guide, avec son cri de victoire | Dans l'univers « <univers> », <personnage guide> fête le premier défi relevé à sa façon (Plan : Danse, Princesses et fées, Police, Pompiers ; Animaux de la forêt livré en 106c) |
| 106g | La séance qui rend une matière réussie est fêtée par la célébration de l'univers, annonce « Matière réussie ! » | La séance qui rend réussie la dernière leçon de sciences du CE1 fait jouer la célébration · Rejouer une leçon d'une matière déjà réussie ne la fait pas jouer |
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

Retour après une erreur (checklist `gamification`) : sans objet dans la célébration elle-même ; un défi relevé avec
des erreurs est fêté pareil (R1), et les erreurs du défi suivent les règles de #100.

Droits d'accès : **aucun scénario `@acces`**. La story ne lit que l'univers du profil (déjà couvert par #6) et le défi
relevé (couvert par #100) ; elle n'enregistre rien et n'ajoute ni table, ni policy, ni Edge Function.

Règle absolue sur les contenus : vérifiée par la review et la planche (skill `illustration`, section 0), pas par un
scénario. Sports : une fête joyeuse, ni adversaire moqué, ni coupe, ni podium, ni classement ; aucun coffre. Les
scénarios ne décrivent jamais de contenu interdit.

Pour l'équipe (pas une question au PO) : le Plan « Le hasard ne choisit que la variante » demande une étape de mise en
place qui fixe le tirage (« le hasard de la célébration de l'univers tire « … » »), par le port `Hasard`, comme les
autres scénarios à hasard fixé. Le scénario de la musique sans réseau est visuel ; la musique hors ligne relève de
`@pwa` (comme #97).

## Hors périmètre

- Les autres univers (106b à 106f), la matière réussie (106g) et les danses de victoire aux paliers des tenues (106h) :
  livraisons suivantes, scénarios `@hors-106a`.
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

## Questions ouvertes

Aucune pour 106a. Reste en attente, sans bloquer 106a :
- le **choix des musiques** des six univers par le PO, à l'écoute (106.12) : d'ici là, la musique de la célébration
  de Coach Léo est « grande victoire » ;
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
| 106.4 Fin d'une matière | Réponse du PO 2026-11-02 : reco. A, en livraison 106g | Scénarios 106g (`@hors-106a`) |
| 106.5 Matière plus grande ? | Réponse du PO 2026-11-02 : reco. Même célébration, annonce « Matière réussie ! » | Scénarios 106g |
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
| 106.24 Confettis de Coach Léo | Réponse du PO 2026-11-02 : reco. Ils font partie de sa célébration de l'univers, distincts des confettis de la célébration commune, qui ne tombent pas ; en mouvements réduits, aucun confetti | R1 (« la célébration commune n'est pas jouée »), R6 (« aucun confetti ne tombe ») |
| 106.25 Défi rejoué | Réponse du PO 2026-11-02 : reco. Il garde les confettis de la célébration commune en plus de « séance terminée » | R3 (« des confettis tombent ») |
| 106.26 Noms des variantes (hors 106a) | Réponse du PO 2026-11-02 : reco. Fixés à la livraison de chaque univers, d'après sa maquette | Scénarios 106b à 106e restent `@a-valider` |
| 106.27 Accès réseau aux musiques | Réponse du PO 2026-11-02 : reco (oui), mais l'accès ne peut être ouvert que par le PO ; 106a part avec « grande victoire » | Aucun |
| 106.28 Personnage guide à côté de la bulle pendant la célébration de l'univers : le garder ou le cacher ? | Réponse du PO 2026-11-02 : « cacher ». Pendant la célébration de l'univers, le personnage guide n'apparaît qu'une fois, dans la scène ; sa bulle garde ses paroles et « Réécouter ». Avec la célébration commune (défi rejoué, univers pas encore livré), rien ne change : il reste à côté de sa bulle | R1 (« Coach Léo n'apparaît qu'une fois, dans la célébration de l'univers, la bulle gardant ses paroles »), R3 (« Coach Léo apparaît à côté de la bulle de ses paroles ») |
| 106.31 Tenue portée pendant la célébration (106c) | Réponse du PO 2026-11-05 : reco. Renvoyée à 106h pour tous les univers ; Noisette, comme Coach Léo et Lili, est dans sa tenue de base pendant la célébration (https://github.com/SBA-dev/github-move/issues/64#issuecomment-6651992972) | Aucun |
| 106.32 Planche de Noisette (106c) | Réponse du PO 2026-11-05 : reco. Planche validée | Aucun |
| 106.33 Jonglage (106c) | Réponse du PO 2026-11-05 : reco. Le jonglage reste comme dans la maquette | Aucun |
| 106.35 Étoiles à cinq branches (posée par 106d) | Réponse du PO 2026-11-05 : reco (oui). Aucune étoile à cinq branches dans les scènes de Lili et de Noisette : fleurs ou étincelles à quatre branches à la place ; appliquée dans 106c pour Noisette | Aucun (les scénarios ne parlent que des « feuilles de la forêt »)

Correction du 2026-11-02 (sans changement de règle) : dans « Pendant la célébration de l'univers, le clavier n'est jamais bloqué », « Alors Léa voit « Qui joue ? » » devient « Alors Léa voit son accueil », car depuis #100 « Accueil » à la fin d'un défi mène à l'accueil de l'enfant (et non à « Qui joue ? » comme à la fin d'une séance, #97) ; `@wip` est retiré de la fonctionnalité.
