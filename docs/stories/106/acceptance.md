# Critères d'acceptance : issue #106, une célébration propre à chaque univers

Scénarios : `features/106-celebration-de-l-univers.feature` (`@issue-106 @wip`).
Modèle : `docs/stories/106/domain-model.md` (questions 106.1 à 106.23).
État : **cadrage, en attente de validation du PO**. Hypothèse de travail : les recommandations du modèle du domaine,
en particulier le découpage 106.17. Le fichier couvre la livraison **106a** ; les scénarios des livraisons suivantes
(106b à 106h) sont tagués en plus `@hors-106a` et sont exclus de 106a. Les scénarios `@a-valider` dépendent d'une
question encore ouverte.

## Objectif

En tant qu'**enfant**, quand je **relève un défi** pour la première fois (et plus tard quand je rends une **matière
réussie**), je veux que mon **personnage guide** fasse une **célébration de l'univers** (nom proposé, 106.1) propre à
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
  cri de victoire « BUT ! » ; musique de la célébration (« grande victoire » tant que le PO n'a pas choisi, 106.12).
- Les cinq autres univers gardent la **célébration commune** de #97 (106.18).

Durées (pour l'implémentation et la review, jamais dans les étapes) : 3 s au plus (106.9 B), boutons, clavier et
annonce disponibles dès la première image ; écart à 97.23 noté dans la décision 0039 si 106.9 B est retenue.

## Règles

| # | Règle | Scénarios (106a) |
|---|---|---|
| R1 | Au premier défi relevé dans l'univers « Sports », Coach Léo joue la célébration de l'univers à la place de la célébration commune, avant de féliciter l'enfant | Au premier défi relevé, Coach Léo marque un but et le fête, puis félicite Léa · Le hasard ne choisit que la variante (Plan, 3 exemples, `@a-valider`) · Un défi relevé avec des erreurs est fêté par la même célébration · Sans réseau, Coach Léo joue quand même la célébration |
| R2 | L'univers ne change que la mise en scène : même annonce, mêmes boutons, aucune étoile, même suite du parcours | Dans l'univers « <univers> », la fin du défi annonce et propose la même chose (Plan : Sports, Danse, Animaux de la forêt) · Après la célébration, le parcours de Léa est le même que dans un autre univers |
| R3 | Seul le premier défi relevé est fêté par la célébration de l'univers ; un défi rejoué garde la célébration commune et « séance terminée » | Rejouer un défi relevé fait entendre « séance terminée », avec la célébration commune et sans but de Coach Léo |
| R4 | La célébration est celle de l'univers du profil au moment du défi relevé ; un univers pas encore livré garde la célébration commune | Dans l'univers « <univers> », pas encore livré, le premier défi relevé garde la célébration commune (Plan, 5 univers) · Un enfant passé dans l'univers « Sports » voit Coach Léo fêter son premier défi relevé |
| R5 | La célébration ne retient jamais l'enfant : un toucher hors des boutons ne fait rien ; boutons et clavier agissent tout de suite et arrêtent la musique | Toucher l'écran en dehors des boutons ne change rien · Toucher « Mon parcours » y mène tout de suite et arrête la musique · Le clavier n'est jamais bloqué · À 360 px, la célébration tient dans la largeur et ses boutons restent assez grands |
| R6 | Mouvements réduits : image fixe de la même scène, cri et annonce, sans mouvement ni confettis ; une seule annonce aux lecteurs d'écran | Avec les mouvements réduits, image fixe sans mouvement ni confettis · Les lecteurs d'écran annoncent une seule fois « Défi relevé ! », sans lire le cri de victoire |
| R7 | La musique est un effet sonore : jouée en Muet (seule la parole est coupée), arrêtée par un écran du parent | En Muet, la musique se fait entendre, sans parole · En arrivant sur un écran du parent, la musique s'arrête |

Livraisons suivantes, tagués `@hors-106a` (tous `@a-valider`) :

| Livraison | Règle | Scénarios |
|---|---|---|
| 106b à 106f | Chaque univers a sa célébration, jouée par son personnage guide, avec son cri de victoire | Dans l'univers « <univers> », <personnage guide> fête le premier défi relevé à sa façon (Plan : Danse, Animaux de la forêt, Princesses et fées, Police, Pompiers) |
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

## Questions ouvertes

Les questions 106.1 à 106.23 du modèle du domaine restent ouvertes ; les scénarios suivent leurs recommandations.
Questions nouvelles :

**106.24 Confettis de Coach Léo.** Le tableau de l'issue met des confettis dans la scène de Sports. Sont-ils une
partie de la célébration de l'univers (dessinés avec la scène), distincts des confettis de la célébration commune qui,
eux, ne tombent pas ? *Reco : oui si la maquette validée en a ; avec mouvements réduits, aucun confetti ne tombe dans
les deux cas.*

**106.25 Défi rejoué.** La fin d'un défi rejoué garde-t-elle les confettis de la célébration commune en plus de
« séance terminée » (#100 ne le dit pas) ? *Reco : oui, comme toute fin de séance (#97).*

**106.26 Noms des variantes (hors 106a).** Pour les scénarios de 106b à 106e, les variantes sont nommées d'après les
clés des maquettes (`jete`, `ruban`, `sauts` ; `jongle`, `mange`, `joues` ; `arc`, `envol`, `signes` ; `orchestre`,
`trottinette`, `danse`) : « le grand jeté », « la noisette croquée », « les joues gonflées »… Ces noms ne sont pas
montrés à l'enfant ; on les fixe à la livraison de chaque univers, d'après sa maquette ? *Reco : oui.*
