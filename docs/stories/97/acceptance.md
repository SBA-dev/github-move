# Critères d'acceptance : story #97, retours animés et sonores pendant la séance

Scénarios : `features/97-retours-animes-et-sonores.feature`. Tags :
- `@issue-97 @wip` sur la fonctionnalité ;
- `@a-valider` sur les 25 scénarios qui dépendent d'une question ouverte (commentaire « Question 97.n » au-dessus) ;
- `@pwa` sur le scénario hors ligne, lancé avec `playwright.pwa.config.ts` comme ceux de #8.

État : **cadrage seulement**. #97 dépend de #96 (PR #124, non mergée) : aucun code avant son merge.

## Objectif

En tant qu'**enfant**, je veux que chaque réponse, chaque point gagné et chaque fin de séance se voient et s'entendent, afin de sentir tout de suite que j'ai réussi, ou que je peux réessayer.

Besoins nourris (skill `gamification`, section 1) :
- **compétence** : la réussite s'entend et se voit tout de suite (réponse juste, point qui vole jusqu'au récipient, texte complet, étoiles, record de fluence) ; la récompense est proportionnée (petite pour une réponse, grande pour une séance terminée ou une leçon acquise) ;
- **lien** : l'effet sonore prépare la parole du personnage guide sans jamais la couvrir ; après une erreur, un son doux puis l'encouragement donnent une nouvelle chance.

La story ne change ni étoile, ni avancement, ni record, ni parole du personnage guide (règle d'or de Motivation). Elle ne franchit aucun garde-fou de la section 5 du skill : pas de hasard à gagner, pas de pénalité, pas de son punitif ; une célébration ne retient jamais l'enfant (un toucher la passe, le clavier n'est jamais bloqué). Les 8 sons sont des sons d'interface sans voix ni parole, choisis à l'écoute par le PO (`docs/sons.md`) : rien d'effrayant, d'agressif ni de moqueur (règle absolue de `CLAUDE.md`).

## Règles (example mapping)

| # | Règle | Exemples (scénarios) |
|---|---|---|
| R1 | Après chaque réponse, un effet sonore se fait entendre tout de suite, avant le personnage guide : « réponse juste » et un rebond pour une réponse juste, « réponse fausse » et un léger balancement pour une réponse fausse, jamais de croix ni de rouge plein écran | « Une réponse juste fait entendre « réponse juste », puis la félicitation du personnage guide » · « Une réponse fausse fait entendre un son doux, puis l'encouragement, sans croix ni rouge plein écran » (97.4) · Plan « Dans <exercice>, une bonne réponse fait entendre « réponse juste » » : bulles, texte à trous, ordre · « Une bonne forme de conjugaison, sans félicitation, fait quand même entendre « réponse juste » » · « Une étiquette posée dans la mauvaise maison fait entendre « réponse fausse » et revient » · « « Je ne sais pas » ne fait entendre aucun son d'erreur » (97.11) · « Après « Je ne sais pas », la bonne réponse donnée par l'enfant fait entendre « réponse juste » » (97.19) · « En séance de révision, une réponse fausse fait entendre « réponse fausse », puis l'encouragement » · « Au test de départ, une réponse juste fait entendre « réponse juste » » · Plan « Pendant la fluence, une <réponse> fait entendre « <effet sonore> », sans point qui vole » (97.10) |
| R2 | Une question réussie fait voler un point jusqu'au récipient avec « point du récipient » ; la dernière réponse d'un texte à trous ou d'un `ordre` fait pleuvoir des étincelles avec « texte complet », à la place de « réponse juste » | « Une question réussie fait voler un point jusqu'au récipient, après le son de la réponse juste » (97.5) · « Une erreur ne fait voler aucun point » · « Après une erreur, la bonne réponse fait quand même voler le point » · « Au dernier trou, des étincelles et « texte complet » remplacent « réponse juste » » (97.5) · « La dernière étiquette d'un ordre fait pleuvoir des étincelles avec « texte complet » » (97.5) · « Une étiquette d'un ordre qui n'est pas la dernière ne fait pas pleuvoir d'étincelles » · Plan « <dernière réponse> fait aussi pleuvoir des étincelles avec « texte complet » » : dernière étiquette de `classer`, dernière personne de `conjugaison` (97.6) |
| R3 | La fin d'une séance se fête : les étoiles apparaissent une à une, des confettis tombent, et un effet sonore de fin se fait entendre avant la phrase de fin ; « grande victoire » quand la séance rend la leçon acquise, puis « découverte » pour un nouvel objet de la cabane ou un nouvel épisode | « À la fin de la séance, les étoiles apparaissent une à une, puis des confettis tombent » · Plan « Une séance terminée <cas> fait entendre <effets sonores> avant la phrase de fin » : 1 étoile sans nouveauté, 1 étoile avec épisode, leçon acquise sans nouveauté, leçon acquise avec objet, objet et épisode ensemble (un seul « découverte ») (97.7) · « Rejouer une leçon déjà acquise fait entendre « séance terminée », pas « grande victoire » » (97.7) · « La fin de la séance de révision fait entendre « séance terminée » et « découverte », avec des confettis, sans étoile » (97.9, 97.16) · « La fin du test de départ fait entendre seulement « séance terminée », avec des confettis » (97.9, 97.16) |
| R4 | Un record de fluence se fête : le compteur défile jusqu'au nouveau record et « grande victoire » se fait entendre avant que le personnage guide l'annonce ; sans record, rien de plus | Plan « À la fin de la fluence, <cas> fait défiler le compteur et entendre « grande victoire » » : premier record, nouveau record (97.8) · « Quand le record reste, le compteur ne défile pas et « grande victoire » ne se fait pas entendre » · « Un score de fluence de 0 n'est pas fêté comme un record » · « Une séance faite seulement d'une fluence, avec un record, fait entendre « grande victoire » une seule fois » (97.18) |
| R5 | Un effet sonore passe avant la parole, jamais par-dessus, et suit le son de l'appareil : en Muet, ni effet sonore ni parole ; sur un écran du parent, aucun effet sonore ; quand la voix manque, les effets sonores restent | « Un effet sonore et la parole du personnage guide ne se chevauchent jamais » · « En Muet, une réponse juste ne fait entendre ni effet sonore ni parole, mais se voit toujours » · « En Muet, la fin de la séance se fête sans aucun son » · « Passer en Muet arrête l'effet sonore en cours » · « Pendant la fluence, une nouvelle réponse coupe l'effet sonore de la précédente » · « En arrivant sur un écran du parent, l'effet sonore en cours s'arrête » (97.13) · « Quand le navigateur ne sait pas lire à voix haute, les effets sonores se font quand même entendre » (97.14) · « Un effet sonore qui ne peut pas être joué n'empêche jamais la parole » (97.14) · `@pwa` « Sans réseau, après un premier chargement, les effets sonores se font entendre » |
| R6 | Une célébration ne retient jamais l'enfant et se vit sans mouvement : avec les mouvements réduits, l'information reste sans animation ; un toucher la passe ; le clavier n'est jamais bloqué ; le lecteur d'écran annonce le résultat une seule fois | « Avec les mouvements réduits, les étoiles de fin s'affichent sans animation et sans confettis » · « Avec les mouvements réduits, une réponse juste ne rebondit pas, et le point s'ajoute au récipient sans voler » · « Avec les mouvements réduits, une réponse fausse ne se balance pas, et l'encouragement est dit » · « Avec les mouvements réduits, les effets sonores se font toujours entendre » (97.14) · « Toucher l'écran pendant les confettis passe la célébration » (97.17) · « Pendant les confettis, le clavier n'est jamais bloqué » · Plan « Les lecteurs d'écran annoncent une seule fois « <annonce> » » : « Tu as gagné 3 étoiles », « Tu as gagné 1 étoile » (97.15) |
| R7 | Toucher un bouton d'un écran de l'enfant fait entendre « bouton touché » ; un bouton qui donne une réponse garde le son de la réponse, et les écrans du parent restent sans effet sonore | Plan « <geste> fait entendre « bouton touché » » : « Réécouter », « Mes médailles », « Rejouer » (97.12) · « Un choix de réponse fait entendre le son de la réponse, pas « bouton touché » » (97.12) · « « Je ne sais pas » fait entendre « bouton touché », jamais « réponse fausse » » (97.19) · Plan « Remettre le son <écran> ne fait entendre aucun effet sonore » : pendant une séance, dans l'espace parent (97.12) · Plan « Sur <écran du parent>, toucher un bouton ne fait entendre aucun effet sonore » : question du contrôle parental, espace parent (97.12, 97.13) |

Au total : **7 règles, 47 scénarios** (dont 9 plans de scénario), 25 tagués `@a-valider`.

Sept règles, c'est au-dessus de la limite du skill `bdd-gherkin` (6). Si la story doit maigrir, deux morceaux peuvent partir ailleurs :
- **R7** (son du bouton touché) : une petite story, indépendante des faits d'Apprentissage (aucun passage par Motivation) ;
- **R4** (record de fluence) : une petite story Motivation, qui ne touche que la fin de la fluence.

### Précisions pour les étapes

- **Effets sonores** : l'étape « Léa entend l'effet sonore « … » » vérifie l'effet joué par le lecteur d'effets sonores (fichier `public/sons/<nom>.mp3`, nom en kebab-case : « réponse juste » → `reponse-juste.mp3`). Il faut un faux du lecteur d'effets sonores, à côté du faux de la synthèse vocale (`installerLeFaux`, `voix.steps.ts`), qui note chaque effet dans **le même journal** que les paroles, pour vérifier l'ordre « effet sonore, puis parole ».
- « …, puis Noisette dit … » : la parole commence après la fin de l'effet sonore. « … avant que Noisette dise … » ou « … avant que Noisette parle » : l'effet sonore est entendu avant la parole, d'autres effets peuvent venir entre les deux. Comme le rappelle le responsable des équipes (annonce du 25/10), une étape attend **la parole qu'elle vérifie**, jamais un lot quelconque du journal.
- « Léa n'entend jamais un effet sonore et Noisette en même temps », « Léa n'entend jamais deux effets sonores en même temps » : aucun effet ne démarre pendant une parole ou un autre effet du journal (comme « Léa n'entend jamais deux lectures en même temps »).
- « Léa n'entend rien » (`voix.steps.ts`, l. 625) doit aussi vérifier qu'aucun effet sonore n'est joué. Toutes ses utilisations actuelles (#7, #12, #33, #65, #73, #79) sont en Muet ou sans geste de l'enfant : elles restent vraies (voir plus bas). « Paul n'entend aucune voix » et « Léa n'entend aucune voix » restent limitées à la voix ; « n'entend aucun effet sonore » est une étape nouvelle.
- Visuel : « le choix « … » rebondit », « se balance doucement », « un point vole jusqu'au récipient », « des étincelles apparaissent », « les étoiles apparaissent une à une, puis des confettis tombent », « le compteur défile » se vérifient par la présence de l'animation (attribut ou rôle exposé par le composant), jamais par une durée ni une classe CSS dans le scénario. Les chiffres (1 → 1,15 → 1 ; ±6 px, 2 allers-retours ; 150 à 400 ms ; 1,5 s ; moins de 2 s pour les sons de la fin) sont dans la description de la fonctionnalité, pour l'implémentation et la review.
- « aucune croix ni aucun rouge plein écran n'apparaît » : aucun élément qui couvre l'écran en rouge, aucun signe « × » ou croix ajouté à la réponse fausse (le choix écarté reste pâle, #17).
- « l'appareil ne peut pas jouer les effets sonores » : le faux du lecteur d'effets sonores refuse chaque effet (fichier absent ou audio refusé).
- « Léa voit tomber les confettis de la fin de la séance de la leçon « … » » et « Léa entend l'effet sonore « séance terminée » à la fin de la séance de la leçon « … » » : Léa joue la séance complète de la leçon de test et réussit la dernière question ; l'étape attend que la célébration ou l'effet soit en cours.
- « Léa touche l'écran en dehors des boutons » : toucher sur le fond de la fin de la séance, hors de « Leçon suivante », « Accueil », « Rejouer » et « Lire l'épisode ».
- « les lecteurs d'écran annoncent une seule fois « … » » : une seule région `aria-live="polite"` reçoit la phrase, une seule fois, même pendant l'apparition des étoiles une à une.
- Étapes existantes reprises : « Léa joue la question de test « Combien font 3 + 4 ? » », « Léa répond « … » », « Noisette applaudit en sautant », « Noisette applaudit en sautant, sans dire de félicitation » (#19), « Noisette dit un encouragement », « … suivi de « Essaie une autre bulle. » » (#28), « Léa pose l'étiquette « … » (dans la maison « … ») », « Léa a posé les étiquettes « do » et « mi » », « Léa a rempli les trois premiers trous » (#18), « il ne reste que l'étiquette « dent » à poser » (#16), « Léa en est à « ils … ? » » (#19), « Léa dit « Je ne sais pas » », « seul le choix « 7 » reste, et il brille » (#23), « Léa fait la fluence « … », avec 3 calculs réussis », « Léa donne une bonne réponse / une réponse fausse », « le temps de la fluence est écoulé avec … calculs réussis » (#20), « Léa a terminé <n> séances » (#33), « Léa a gagné <n> étoiles en tout », « Léa a pour meilleures étoiles » (#24, #32), « la tablette est en Muet », « Léa passe en Muet », « Léa / Paul remet le son » (#7, #73), « l'appareil demande des mouvements réduits » (#24), « le navigateur ne sait pas lire à voix haute » (#7), « le contrôle parental pose la question « 7 × 8 » », « Paul répond « 56 » au contrôle parental » (#10), « Léa demande l'entrée de l'espace parent », « Léa voit une question du contrôle parental » (#73), « Savanturier a déjà été chargé une fois sur la tablette », « le réseau est coupé » (#8), les étapes de la séance de révision (#28) et du test de départ (#27, profil CP : la dernière question est « Le son an », après « Les additions »).
- Plan de la fin de la séance (R3) : « Les sons de test » est jouée pour la première fois. Avec 6 étoiles en tout, 1 étoile (5 erreurs) mène à 7 et 2 étoiles (2 erreurs) à 8, sans palier de la cabane ; avec 8 étoiles en tout, 2 étoiles atteignent le palier 10 et font recevoir un objet. 0 séance terminée avant : la séance ouvre l'épisode 1 ; 20 séances avant : aucun nouvel épisode (#33).
- Dernier mot d'un `memoriser` : déjà compté comme un texte complet par le domaine (`texteCompleteParLaDerniereReponse`) ; pas de scénario de plus, les tests unitaires de Motivation le couvrent.

### Droits d'accès

La story ne crée, ne lit et n'envoie aucune donnée : **pas de scénario `@acces`**. Le Muet reste une préférence de l'appareil (#7). Les écrans du parent restent sans son (R5, R7, en continuité de #73). Rien de ce que fait l'enfant n'est envoyé au serveur, à l'IA ni à un service tiers ; les sons sont servis par l'application elle-même et mis en cache par le service worker.

### Scénarios existants à mettre à jour

**Aucun scénario existant ne change de sens.** Vérifications faites :
- Les scénarios qui disent « Léa n'entend rien » (#7 l. 63 et 112, #12 l. 220, #33 l. 292, #65 l. 223, #73 l. 153, #79 l. 43 et 145) sont en Muet ou sans geste de l'enfant : ils restent vrais quand l'étape vérifie aussi les effets sonores. Seule l'**étape** change (voir « Précisions pour les étapes »).
- #73 : « Paul n'entend aucune voix » reste limité à la voix ; R5 et R7 ajoutent « aucun effet sonore » dans des scénarios de #97, sans toucher ceux de #73.
- #20, « Une réponse fausse pendant la fluence ne coûte pas d'erreur » : « Noisette ne dit aucun encouragement » reste vrai, même si 97.10 ajoute l'effet sonore « réponse fausse » (un effet sonore n'est pas une parole).
- #24, « Avec les mouvements réduits, la fin de la séance s'affiche sans étincelles » : reste vrai ; R6 le complète (sans confettis).
- #96 (non mergée) : R3 « Toucher <bouton> le fait s'enfoncer puis revenir » n'affirme pas que le bouton est muet ; « Les boutons de #96 sont muets » est dans son hors périmètre, pas dans un scénario. R7 ajoute le son sans changer ses scénarios.

## Hors périmètre

- **Leçon acquise et badge gagné** : seulement leur effet sonore (« grande victoire », R3). L'animation « badge qui tourne et brille, personnage guide qui danse » va avec les animations des personnages guides : #106.
- **Nouvel objet de la cabane, nouvel épisode** : seulement leur effet sonore (« découverte », R3). La révélation animée (coffre ou rideau qui s'ouvre) n'est pas demandée par l'issue ; elle pourra venir avec #106 ou une story de la cabane.
- **Humeurs du personnage guide** : inchangées (il saute, il se penche) ; nouvelles animations : #106.
- Vibration (question 97.3, reco : non).
- Réglage « effets sonores » séparé du Muet (question 97.2, reco : non).
- Nouveaux sons : tout nouveau son suit `docs/sons.md` (licence vérifiée, écoute du PO).
- Effets sonores dans les écrans de l'enfant hors séance (accueil, « Mon parcours », « Mes médailles ») autres que le bouton touché.
- Vérifiés par la review, pas par un scénario : animations sur `transform` et `opacity` seulement ; aucun clignotement de plus de 3 fois par seconde ; durées de la section 3 du skill ; mode dys actif dans les écrans de récompense (déjà couvert par #24 et #96) ; les 8 fichiers ajoutés à la coquille du service worker (`public/sw.js`) ; React ne choisit aucun effet sonore (Motivation le choisit, Voix le joue).

## Questions ouvertes

Les questions 97.2 à 97.14 viennent du modèle de domaine (`docs/stories/97/domain-model.md`), reprises telles quelles. La question 1 de l'issue (source et licence des sons) est réglée : 8 fichiers dans `public/sons/`, provenance dans `docs/sons.md`.

**#97.2 Un réglage « effets sonores » séparé de la voix, ou seulement le Muet actuel ?**
Reco : **seulement le Muet**. Un seul geste coupe tout le son, ce qui est simple pour l'enfant ; le glossaire annonçait déjà « Muet coupe la voix (et les effets sonores, à confirmer avec leur story) ». Un réglage à part ajouterait un état à mémoriser et un écran du parent, sans demande. Il pourra venir avec une story si un parent le demande.

**#97.3 Faut-il une vibration (sur téléphone) pour une réponse juste ?**
Reco : **non**. L'iPhone et l'iPad ne la proposent pas dans le navigateur, une tablette ne vibre pas : le retour serait inégal selon l'appareil. Elle doublerait le son sans rien apprendre de plus, et il faudrait décider si le Muet la coupe aussi.

**#97.4 Le son d'une réponse fausse : un son doux, ou aucun son du tout ?**
Reco : **un son doux**, `reponse-fausse.mp3` (0,37 s), déjà choisi à l'écoute par le PO pour cet usage. Le skill demande « jamais de silence après un geste » ; ce son dit « on réessaie » sans punir, et l'encouragement suit.

**#97.5 Après une bonne réponse qui fait gagner un point, l'ordre est-il : son de la réponse juste, puis « pop » du point, puis la félicitation ? Le son du texte complet remplace-t-il celui de la réponse juste ?**
Exemple : dernier trou d'un texte à trous → « texte-complet » (0,55 s), « pop » (0,24 s), puis « Bravo ! Le texte est complet ! ».
Reco : **oui aux deux**. Le premier son part tout de suite (moins de 300 ms), les deux tiennent en moins de 0,8 s, et la parole ne les couvre jamais. Un seul son de réponse évite d'empiler deux sons pour un même geste.

**#97.6 Le son « texte complet » vaut-il aussi pour la dernière étiquette de `classer`, la dernière personne de `conjugaison` et le dernier mot de `memoriser` ?**
Le catalogue cite le texte complet et la dernière étiquette d'un `ordre`. Le domaine compte déjà le dernier mot de `memoriser` comme un texte complet.
Reco : **oui**, pour tous les exercices à plusieurs réponses sur le même écran (texte à trous, `ordre`, `classer`, `conjugaison`, `memoriser`) : l'enfant ressent la même chose, « j'ai fini l'ensemble ». Cela demande une lecture de plus dans Apprentissage (« la dernière réponse complète l'exercice ») et le terme **Exercice complété (à valider)**. Si non : seulement le texte à trous, `memoriser` et `ordre`.

**#97.7 À la fin d'une séance, au plus deux sons avant la parole de fin : « grande-victoire » si la leçon devient acquise (sinon « seance-terminee »), puis « decouverte » s'il y a un nouvel objet de la cabane ou un nouvel épisode ?**
Exemple : séance à 2 étoiles qui rend la leçon acquise et ouvre l'épisode 4 → « grande-victoire », « decouverte », puis la phrase de fin avec les nouveautés.
Reco : **oui**. Moins de 2 s en tout (catalogue : fanfare < 2 s) ; la plus grande réussite s'entend, la découverte aussi ; une leçon acquise sans nouveau badge (compétence déjà gagnée) garde « grande-victoire », car elle est acquise quand même. Une leçon personnelle acquise aussi.

**#97.8 Un record de fluence joue-t-il « grande-victoire », juste avant la phrase de fin de la fluence ? Le premier record (première fluence de l'exercice) compte-t-il ?**
Reco : **oui, et oui pour le premier record** (0 n'est jamais un record) : l'enfant se compare à lui-même, c'est le seul « record » qu'il peut avoir. Le son est joué une fois, à la fin de la fluence, pas de nouveau à l'écran de fin. Le PO a choisi « grande-victoire » pour le record : le « roulement et cymbale » du catalogue est remplacé.

**#97.9 La fin de la séance de révision et la fin du test de départ jouent-elles aussi « seance-terminee » (et « decouverte » si la séance de révision ouvre un épisode) ?**
Reco : **oui**. Le skill demande de récompenser l'effort autant que la réussite. Le test de départ n'est pas une séance (pas d'épisode, pas d'étoile) : il n'a que le son de fin, jamais « grande-victoire » ni « decouverte ».

**#97.10 Pendant le chrono d'une fluence, chaque calcul juste joue-t-il « reponse-juste » et chaque calcul faux « reponse-fausse » ?**
Aujourd'hui, une réponse fausse en fluence « s'efface sans rien dire ».
Reco : **oui, sans « pop »** : le récipient ne se remplit qu'à la fin de la fluence. Un nouveau calcul coupe le son du précédent (invariant 4), pour ne pas gêner un enfant qui répond vite.

**#97.11 « Je ne sais pas » joue-t-il un son ?**
Reco : **non**. Ce n'est pas une réponse fausse mais une demande d'aide ; le personnage guide réfléchit et montre la réponse. Un son d'erreur la ferait vivre comme un échec.

**#97.12 Quels boutons jouent « bouton-touche » ?**
Reco : **les boutons des écrans de l'enfant** (navigation, « Continuer », « Réécouter », touches du clavier de la dictée et du clavier de cristaux), **pas ceux qui donnent une réponse** (choix, bulle, étiquette posée, nombre validé), qui jouent déjà le son de la réponse juste ou fausse. **Aucun dans les écrans du parent** (registre parent de #96, #73). Pas de son au bouton Muet lui-même.

**#97.13 Sur un écran du parent (voix suspendue, #73), aucun effet sonore n'est-il joué ?**
Reco : **oui, aucun**. `features/73-aucun-son-sur-les-ecrans-du-parent.feature` promet « aucun son » ; la voix suspendue coupe donc aussi les effets sonores.

**#97.14 Quand l'appareil ne sait pas lire à voix haute, ou que la voix est bloquée, les effets sonores se jouent-ils quand même ? Et avec mouvements réduits ?**
Reco : **oui dans les trois cas** : seul le Muet (et la voix suspendue) coupe les effets sonores. Un effet qui ne peut pas être joué ne fait pas apparaître le message de voix bloquée, qui parle de la voix du personnage guide. Les mouvements réduits retirent le mouvement, pas le son.

Questions ajoutées par le cadrage des critères :

**#97.15 Quelle phrase les lecteurs d'écran annoncent-ils à la fin, et quand il n'y a pas d'étoile ?**
L'issue cite « Tu as gagné 3 étoiles ». L'écran de fin écrit aujourd'hui « 3 étoiles sur 3 » (#24), sans annonce dédiée.
Reco : à la fin d'une séance, **« Tu as gagné <n> étoile(s) »** (« Tu as gagné 1 étoile », « Tu as gagné 3 étoiles »), annoncée **une seule fois**, quand toutes les étoiles sont affichées (tout de suite avec les mouvements réduits), jamais étoile par étoile. Sans étoile (séance de révision, test de départ, séance faite seulement d'une fluence) : **aucune annonce de plus**, la bulle du personnage guide dit déjà le résultat.

**#97.16 Des confettis tombent-ils aussi à la fin de la séance de révision et à la fin du test de départ, qui n'ont pas d'étoiles ?**
Reco : **oui**, sans étoiles : le skill demande de récompenser l'effort autant que la réussite, et ces deux fins viennent d'un vrai travail. Mêmes règles qu'à la fin d'une séance : absents avec les mouvements réduits, passés d'un toucher, clavier jamais bloqué.

**#97.17 Que fait un toucher pendant la célébration de la fin ?**
Reco : un toucher **en dehors des boutons** fait disparaître les confettis, affiche d'un coup toutes les étoiles gagnées, **arrête l'effet sonore de fin** et laisse la phrase de fin commencer aussitôt (elle dit les étoiles et les nouveautés, elle n'est pas coupée). Un toucher **sur un bouton** (« Accueil », « Leçon suivante »…) fait tout de suite ce que dit le bouton, sans toucher de plus. Les boutons sont affichés et utilisables pendant toute la célébration.

**#97.18 Quel effet sonore de fin pour une séance faite seulement d'une fluence (sans étoiles) ?**
#24 : elle montre le score de fluence, sans étoiles ; #33 : elle ouvre un épisode.
Reco : **un seul effet sonore de fin**, comme une séance : « grande victoire » s'il y a un record (joué une seule fois, pas de nouveau à l'écran de fin, 97.8), sinon « séance terminée » ; puis « découverte » s'il y a un nouvel épisode ou un nouvel objet. Le compteur qui défile tient lieu des étoiles une à une ; confettis comme à la fin d'une séance.

**#97.19 « Je ne sais pas » et la bonne réponse qui suit : quels sons ?**
97.11 retire le son d'erreur de « Je ne sais pas », et 97.12 donne « bouton touché » aux boutons des écrans de l'enfant qui ne donnent pas de réponse.
Reco : le bouton « Je ne sais pas » fait entendre **« bouton touché »** (jamais « réponse fausse », jamais de silence après un geste) ; ensuite, la bonne réponse donnée par l'enfant fait entendre **« réponse juste »** et, si la question devient réussie, « point du récipient », comme toute bonne réponse : c'est lui qui l'a donnée.

## Termes à signaler (glossaire)

- **Effet sonore (à valider)** : déjà ajouté au glossaire par le modèle de domaine (contexte Voix), à valider par le PO.
- **Muet, précisé par #97 (à valider)** : déjà ajouté en note (le Muet coupe aussi les effets sonores ; la voix suspendue aussi, 97.13).
- **Noms des 8 effets sonores** (« réponse juste », « réponse fausse », « point du récipient », « texte complet », « séance terminée », « grande victoire », « découverte », « bouton touché ») : valeurs tirées des noms de fichiers choisis par le PO (`docs/sons.md`), pas des termes du glossaire. Les scénarios les citent entre guillemets, comme des noms de sons. « séance terminée » et « texte complet » reprennent des termes du glossaire comme nom de son, sans en changer le sens.
- **Exercice complété (à valider)** : seulement si 97.6 = oui ; il élargirait **Texte complet** (aujourd'hui limité au texte à trous) sans le remplacer. Les scénarios de R2 évitent le mot et disent « la dernière réponse d'un texte à trous ou d'un `ordre` ».
- **Phrase de fin** : employée par les scénarios de #31, #32 et #33 (« le personnage guide termine sa phrase de fin… ») mais absente du glossaire ; reprise ici telle quelle. À ajouter, ou à confirmer comme mot d'interface.
- **Mots d'interface** (hors glossaire, comme « mouvements réduits », décision n°16) : rebondit, se balance, point qui vole, récipient (déjà cité par **Avancement de la séance**), étincelles, confettis, compteur qui défile, célébration, couleur de réussite.
- **Vibration** : seulement si 97.3 = oui.
- Synonymes à éviter (modèle de domaine) : « bruitage », « SFX », « jingle » seul, « sound » ; pour Muet, « silencieux », « mute ».
