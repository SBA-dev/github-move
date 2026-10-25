# Critères d'acceptance : issue #73, Aucun son pendant la connexion du parent ni dans l'Espace parent

État : **cadrage anticipé**, à valider par le PO avec le modèle (questions 73.1 à 73.7 dans `domain-model.md`, 73.8 à 73.10 ci-dessous).

Scénarios : `features/73-aucun-son-sur-les-ecrans-du-parent.feature` (tags `@issue-73 @wip`, `@wip` retiré par l'`e2e-tester` à la livraison ; aucun `@envoi-email`, aucun `@hors-beta`).
Modèle du domaine : `docs/stories/73/domain-model.md` (contextes **Famille** et **Voix**).

## Objectif

En tant que **parent**, je veux que le personnage guide ne lise rien de lui-même quand je me connecte, sur « Qui joue ? », pendant la question du contrôle parental et dans l'espace parent, afin de ne pas être surpris par sa voix sur des écrans qui ne sont pas destinés à l'enfant. Sur les écrans de l'enfant, rien ne change.

Comportement actuel (cible, `main`, voir le tableau du modèle) : la seule lecture sur un écran du parent est l'**invitation à créer le premier profil** sur « Qui joue ? » sans profil enfant (`InvitationDuPremierProfil`), et la **présentation** du personnage guide quand on remet le son, sur n'importe quel écran. Une lecture en cours est coupée aujourd'hui par chaque écran de l'enfant qui disparaît, sans règle qui le garantisse. Le legacy (`app/`) n'a ni connexion ni espace parent séparé : les exemples viennent de l'issue et du modèle.

Vocabulaire des scénarios :
- « Noisette dit « … » » vérifie la **bulle** du personnage guide ; « entend » et « **n'entend aucune voix** » vérifient la **voix** (#7, #15).
- On écrit « le personnage guide ne lit rien de lui-même », jamais « lecture automatique » (synonyme interdit de « Tout lire à voix haute ») ni « silencieux » (synonyme interdit de Muet).
- « **Invitation à créer le premier profil** », toujours en entier (« Invitation » seule est le lien du second parent, #13) : proposition de la question 73.6.
- « Écran du parent », « écran de l'enfant », « voix suspendue » : termes proposés par le modèle, à valider. Les scénarios n'emploient que « écran du parent » dans les titres de règles ; aucune étape ne dit « voix suspendue » (c'est un état interne).

## Example mapping

| # | Règle | Exemples clés |
|---|---|---|
| 1 | Sur un écran du parent, le personnage guide ne lit rien de lui-même, et ce qu'il dit reste affiché | « Se connecter », « Créer ton compte », « Mot de passe oublié » : aucune voix ; inscription puis espace parent sans profil : invitation à créer le premier profil affichée, non lue ; connexion d'un parent sans profil : idem ; « Qui joue ? » sans profil (ouverture, ou sortie de l'espace parent) : invitation affichée, non lue (le vrai changement) ; « Qui joue ? » avec Léa : aucune voix (73.2) ; question « 7 × 8 » du contrôle parental, espace parent : aucune voix ; l'invitation reste annoncée au lecteur d'écran |
| 2 | En arrivant sur un écran du parent, la lecture en cours s'arrête | consigne « Écoute bien l'histoire du petit chat. » en cours, Léa demande l'espace parent → question du contrôle parental, voix coupée ; même consigne, Léa touche le nom de l'application → « Qui joue ? », voix coupée ; « Bonjour Léa ! » en cours, Léa change d'enfant → voix coupée ; la consigne coupée ne reprend pas une fois l'espace parent ouvert |
| 3 | Sur un écran de l'enfant, la voix se comporte comme avant, même en revenant d'un écran du parent | après l'espace parent, Léa choisit son profil → « Bonjour Léa ! » entendu ; après avoir renoncé au contrôle parental, « Réécouter » relit « Combien font 3 plus 4 ? » ; profil créé dans l'espace parent → proposition du test de départ lue à Léa (73.9) |
| 4 | Passer par un écran du parent ne change jamais le choix Son/Muet de l'appareil | Son avant → Son après ; Muet avant → Muet après, et la question suivante n'est pas lue ; le choix Son/Muet reste proposé sur les 4 écrans du parent (73.3) ; y remettre le son ne fait rien lire (73.4) |
| 5 | Dans l'espace parent, l'essai de voix reste entendu, mais seulement quand le parent le demande | Paul écoute « Denise (Natural) » → essai de voix entendu (73.1) ; Paul ouvre le choix de voix → aucune voix ; en Muet, l'essai n'est pas lu (déjà couvert par #15) |

## Règles et scénarios

| # | Règle | Scénarios |
|---|---|---|
| 1 | Sur un écran du parent, le personnage guide ne lit rien de lui-même, et ce qu'il dit reste affiché | Sur l'écran « <écran> », aucune voix ne se fait entendre (Se connecter, Créer ton compte, Mot de passe oublié) · Juste après l'inscription, l'invitation à créer le premier profil s'affiche sans être lue · Un parent sans profil enfant se connecte : l'invitation à créer le premier profil s'affiche sans être lue · Sur « Qui joue ? » sans profil enfant, l'invitation à créer le premier profil s'affiche sans être lue · En quittant l'espace parent sans profil enfant, l'invitation à créer le premier profil n'est pas lue · Sur « Qui joue ? » avec des profils enfants, aucune voix ne se fait entendre (`@a-valider`, 73.2) · Pendant la question du contrôle parental, aucune voix ne se fait entendre · Dans l'espace parent, aucune voix ne se fait entendre · L'invitation à créer le premier profil reste annoncée au lecteur d'écran |
| 2 | En arrivant sur un écran du parent, la lecture en cours s'arrête | Pendant la lecture d'une consigne, <ce que fait Léa> arrête la voix (demande de l'espace parent, retour à l'accueil par le nom de l'application) · Pendant que Noisette salue Léa, changer d'enfant arrête la voix · La consigne coupée ne reprend pas dans l'espace parent |
| 3 | Sur un écran de l'enfant, la voix se comporte comme avant, même en revenant d'un écran du parent | Après l'espace parent, le personnage guide salue l'enfant qui choisit son profil · Après avoir renoncé au contrôle parental, Léa réécoute la question · Le profil créé dans l'espace parent, la proposition du test de départ est lue à l'enfant (`@a-valider`, 73.9) |
| 4 | Passer par un écran du parent ne change jamais le choix Son/Muet de l'appareil | Une tablette en <choix> l'est toujours après l'espace parent (Son, Muet) · En Muet avant l'espace parent, la consigne suivante n'est toujours pas lue · Sur <écran>, Paul peut passer la tablette en Muet (`@a-valider`, 73.3 ; 4 écrans du parent) · Sur <écran>, remettre le son ne fait rien lire (`@a-valider`, 73.4 ; 4 écrans du parent) |
| 5 | Dans l'espace parent, l'essai de voix reste entendu, mais seulement quand le parent le demande | Dans l'espace parent, Paul entend l'essai de voix qu'il demande (`@a-valider`, 73.1) · Ouvrir le choix de voix ne fait pas lire l'essai de voix |

Total : 5 règles, 21 scénarios (31 cas exécutés avec les exemples), dont 5 `@a-valider`.

Droits d'accès (`@acces`) : aucun. La story n'ajoute ni donnée ni table, et ne change pas qui accède à quoi : le contrôle parental et l'accès aux profils restent ceux de #10 et #11. L'enfant garde le choix Son/Muet (#7, #15) ; aucun scénario ne le lui retire.

Contre-exemples déjà couverts ailleurs, à garder verts (invariant 3 du modèle) : #7 « En remettant le son, le personnage guide se présente » (sur l'accueil de l'enfant), « Quitter l'écran coupe la voix », « Passer en Muet coupe la lecture en cours » ; #11 « Léa choisit son profil enfant et son personnage guide la salue » (bulle) ; #12 « tout lire à voix haute » ; #15 « En Muet, l'essai de voix n'est pas lu » et les autres essais de voix dans l'espace parent ; #27 la proposition du test de départ après la création d'un profil.

### Étapes

Réutilisées : « Paul n'est pas connecté sur la tablette », « personne n'est connecté sur la tablette », « j'ouvre l'écran « … » », « Paul s'inscrit avec … », « Paul est inscrit avec … », « Paul se connecte avec … », « il voit l'espace parent(, sans aucun profil enfant) », « aucun parent n'utilise l'adresse … » (#5, #72) ; « Paul est connecté sur la tablette », « le contrôle parental pose la question « 7 × 8 » », « \S+ demande l'entrée de l'espace parent », « Paul répond « 56 » au contrôle parental », « Paul quitte l'espace parent », « \S+ voit une question du contrôle parental » (#10) ; « Paul a créé le profil enfant … », « Léa choisit son profil enfant dans « Qui joue ? » », « je vois « Qui joue ? » avec le profil enfant de Léa », « « Qui joue ? » est affiché sur la tablette », « j'ouvre Savanturier » (#11) ; « Noisette est en train de lire la consigne « … » », « Léa n'entend plus Noisette », « Léa entend Noisette dire / lire « … » », « la tablette est en Muet », « la tablette est toujours en Muet », « Léa n'entend rien », « Léa demande à réécouter la question » (#7, #58) ; « Léa revient à l'accueil par le nom de l'application » (#6) ; « Paul est (dans|entré dans) l'espace parent », « Paul écoute la voix « … » », « Paul ouvre le choix de voix », « Paul voit le titre « … » », « personne ne jouait sur la tablette », « l'appareil a les voix françaises … », « Paul entend Noisette dire « … » avec la voix « … » » (#15) ; « Léa a un profil enfant préparé de niveau CP dans l'univers « … » », « Léa joue la question de test « … » », « la question « … » s'affiche » (#7, #58) ; « Paul crée le profil enfant … », « la proposition du test de départ s'affiche pour Léa » (#11, #27) ; « Noisette dit « … » » (bulle, #11, #72).

Nouvelles, à signaler à l'`e2e-tester` :
- « (Paul|Léa) n'entend aucune voix » : **aucune lecture ne commence** après l'arrivée sur l'écran (même vérification que « Paul n'entend rien » de #15 : `speaks` à 0 après le délai de lecture). Quand une lecture était en cours avant (« La consigne coupée ne reprend pas »), on compte seulement les lectures commencées après l'arrivée.
- « Paul n'est rattaché à aucun profil enfant » (proche de « Claire n'est rattachée à aucun profil enfant », #13).
- « l'invitation à créer le premier profil est annoncée au lecteur d'écran » (la bulle reste dans une zone `role="status"`).
- « Noisette est en train de saluer Léa sur son accueil », « Léa demande à changer d'enfant », « Léa voit « Qui joue ? » ».
- « Léa a demandé l'entrée de l'espace parent, et le contrôle parental pose la question « 7 × 8 » » ; « Léa a demandé l'entrée de l'espace parent, puis a renoncé à répondre au contrôle parental » ; « Paul est entré dans l'espace parent, puis l'a quitté » (variante, sans la question imposée, de « Paul est entré dans l'espace parent en répondant à « 7 × 8 », puis l'a quitté » de #10).
- « Léa entend Noisette lui proposer le test de départ » (le texte de #27 contient des guillemets, d'où une étape sans texte).
- « la tablette est en Son », « la tablette est toujours en Son » (pendant de « … en Muet »).
- « <écran> est affiché sur la tablette » pour « l'écran « Se connecter » », « la question du contrôle parental », « l'espace parent » (« « Qui joue ? » est affiché sur la tablette » existe).
- « Paul passe en Muet », « Paul remet le son » (pendants de « Léa passe en Muet » / « Léa remet le son », sans aller sur l'accueil de l'enfant) ; « le choix Son/Muet montre (Son|Muet) ».

Mise en garde : « Noisette est en train de lire la consigne » (#7) prépare une séance sans parent connecté ; ici il faut aussi « Paul est connecté sur la tablette » pour que la question du contrôle parental s'affiche.

## Scénarios existants à adapter

Ces scénarios restent vrais (ils vérifient la bulle) ; il faut seulement y **ajouter une ligne** « Mais Paul n'entend aucune voix ». Leurs `.feature` ne sont pas modifiés par le cadrage : l'ajout se fait pendant la livraison de #73.

| Fichier | Scénario | Ajout |
|---|---|---|
| `features/72-connexion-par-mot-de-passe.feature` (l. 18) | Juste après l'inscription, Noisette invite Paul à créer le premier profil enfant, sans question du contrôle parental | « Mais Paul n'entend aucune voix » après la phrase de Noisette |
| `features/11-profil-enfant.feature` (l. 197, `@envoi-email @hors-beta`) | Sans profil enfant, Noisette invite Paul à créer le premier dans l'espace parent | même ajout ; il ne tourne qu'après #45, mais son texte doit déjà dire la règle |

Facultatif (renfort, pas obligatoire) : `features/5-connexion-du-parent.feature` « Sans connexion, Savanturier invite d'abord le parent à se connecter » (aucune voix sur l'écran de connexion) et `features/10-controle-parental.feature` « En quittant l'espace parent, Paul arrive sur « Qui joue ? » ». Aucun scénario existant n'attend une voix sur un écran du parent : **aucun ne devient faux**. Le seul comportement retiré (présentation en remettant le son sur un écran du parent, 73.4) n'est vérifié par aucun scénario existant (#7 le vérifie sur l'accueil de l'enfant).

## Hors périmètre

- Les effets sonores (question 73.10) et le choix Son/Muet lui-même (#7).
- Masquer le choix Son/Muet sur les écrans du parent (73.3, proposition : non).
- La reprise d'une lecture coupée à l'endroit où elle s'était arrêtée : l'écran de l'enfant fait ce qu'il fait déjà en réapparaissant (73.8).
- Tout changement d'affichage : bulle du personnage guide, zones `role="status"`, en-tête restent identiques.
- Les écrans à venir (suivi, rapport de la semaine, devoirs, écrans de Motivation) : chacun sera classé par sa story (73.7).
- Ce qui se passe dans le domaine (`suspendre`, `reprendre`, tableau des écrans) : tests unitaires, pas de scénario (un `Alors` ne décrit pas un état interne).

## Questions ouvertes

Les questions 73.1 à 73.7 sont dans `docs/stories/73/domain-model.md`. Lien avec les scénarios `@a-valider` :

| Question | Scénarios `@a-valider` |
|---|---|
| 73.1 Essai de voix audible dans l'espace parent | Dans l'espace parent, Paul entend l'essai de voix qu'il demande |
| 73.2 « Qui joue ? » sans voix, avec ou sans profil | Sur « Qui joue ? » avec des profils enfants, aucune voix ne se fait entendre (le cas sans profil est demandé par l'issue, il n'est pas `@a-valider`) |
| 73.3 Choix Son/Muet visible sur les écrans du parent | Sur <écran>, Paul peut passer la tablette en Muet |
| 73.4 Remettre le son sans présentation sur un écran du parent | Sur <écran>, remettre le son ne fait rien lire |
| 73.5 L'écran de connexion est un écran du parent | aucun : l'issue le classe déjà ainsi (« Sur l'écran « Se connecter », aucune voix ne se fait entendre ») |
| 73.6 Nom « Invitation à créer le premier profil » | aucun : vocabulaire des titres des scénarios de la règle 1 |
| 73.7 Classement des écrans à venir | aucun |

Nouvelles questions :

**73.8** Quand Léa renonce au contrôle parental, ou revient sur un écran de l'enfant après un écran du parent, la lecture coupée doit-elle reprendre ?
Proposition : **non, pas de reprise spécifique**. L'écran de l'enfant fait ce qu'il fait déjà en réapparaissant aujourd'hui (par exemple, l'accueil de l'enfant ne salue pas une seconde fois quand on y revient par l'historique) ; Léa peut toujours « Réécouter ». Scénario écrit : « Après avoir renoncé au contrôle parental, Léa réécoute la question » (la voix fonctionne de nouveau), sans fixer de relecture automatique.

**73.9** Quand Paul crée un profil enfant dans l'espace parent, la proposition du test de départ s'affiche aussitôt pour l'enfant (#27). Est-ce bien un écran de l'enfant, où la proposition est lue, alors que c'est souvent encore le parent qui tient la tablette ?
Proposition : **oui**, c'est l'écran du test de départ (écran de l'enfant dans le modèle) : la proposition est lue comme aujourd'hui, pour que l'enfant puisse y répondre seul. Scénario `@a-valider` : « Le profil créé dans l'espace parent, la proposition du test de départ est lue à l'enfant ».

**73.10** L'issue dit « Aucun son ». La règle vaut-elle aussi pour les effets sonores, quand une story en ajoutera (le glossaire dit Muet « coupe la voix et les effets sonores, à confirmer ») ?
Proposition : **oui, par principe** : un écran du parent ne fait entendre ni voix ni effet sonore ; la story des effets sonores l'appliquera avec le même classement des écrans. Aucun scénario ici, puisqu'il n'y a pas encore d'effet sonore.

## Décisions

Aucune pour l'instant (cadrage anticipé, en attente de la validation du PO).
