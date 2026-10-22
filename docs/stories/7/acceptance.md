# Critères d'acceptance : issue #7, Voix : lecture à voix haute par le personnage guide

Scénarios : `features/7-voix.feature` (tags `@issue-7 @wip`).
Modèle du domaine : `docs/stories/7/domain-model.md`.
Décisions du PO : `docs/stories/lot-1-decisions.md` (validation n°1 du lot 1, 2026-10-22).

## Objectif

En tant qu'**enfant** qui ne lit pas encore bien, je veux que le **personnage guide** me lise les consignes à voix haute, afin de pouvoir jouer seul.

Comportement actuel (`app/app.js`, section « Sons et voix », lignes 148-345) : il donne les premiers exemples (messages, nettoyage du texte, choix de la voix). Seule la voix du navigateur est utilisée pour l'instant (décision n°6 de `docs/reecriture.md`).

Où l'on vérifie (décision n°1) : aucun exercice n'existe avant le lot 3. Les consignes s'affichent sur la **page de démonstration réservée aux tests**, retirée au lot 3 quand les exercices la remplacent. Les tests partent de profils enfants préparés (décision n°2).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Le personnage guide lit la consigne à voix haute, une seule lecture à la fois | La consigne est lue à voix haute dès qu'elle s'affiche · L'enfant peut réécouter la consigne · Le mot prononcé est surligné pendant la lecture · Une nouvelle lecture coupe la lecture en cours · Quitter l'écran coupe la voix |
| 2 | Le texte est lu comme on le dit à voix haute, jamais avec ses symboles | Les symboles d'une consigne sont dits avec des mots (plan : `+`, `=`, guillemets) · Un trou à compléter est lu comme un silence · La mise en forme de la consigne n'est jamais prononcée · Un texte sans rien à dire n'est pas lu |
| 3 | La voix a le caractère du personnage guide de l'univers choisi | Le personnage guide parle avec sa voix à lui (plan : Noisette, Lumi, Coach Léo, Capitaine Sam) · La voix la plus naturelle de l'appareil est choisie · Sans voix d'homme sur l'appareil, un personnage guide masculin parle plus grave · Sans univers choisi, c'est Noisette qui lit · Une consigne en anglais est lue avec une voix anglaise |
| 4 | En Muet, rien n'est lu, et ce choix est mémorisé sur l'appareil | Le son est activé au premier lancement · En Muet, la consigne s'affiche sans être lue · Passer en Muet coupe la lecture en cours · Le Muet reste choisi au lancement suivant · En remettant le son, le personnage guide se présente (« Je t'entends ! Je suis Lumi. ») |
| 5 | Sans voix, l'enfant peut quand même jouer | Quand la voix est bloquée, l'enfant est prévenu sans être bloqué · Le message de voix bloquée n'apparaît qu'une fois · Réécouter permet de réessayer quand la voix était bloquée · Sur un navigateur qui ne sait pas lire à voix haute, l'enfant joue quand même |

Total : 5 règles, 23 scénarios dont 2 plans (28 cas exécutés avec les exemples). Aucun `@a-valider`.

Étapes réutilisées : « j'ouvre Savanturier » (`0-socle.feature`), « Léa relance Savanturier » (`8-pwa-installable.feature`).

### Ce que les scénarios vérifient, et ce qu'ils laissent aux tests unitaires

Les scénarios décrivent ce que l'enfant **entend ou voit** : quel personnage guide lit, avec une voix féminine ou masculine, plus grave ou non, avec quelle voix de l'appareil, et quel texte est prononcé. Pour les exécuter, les step definitions remplaceront la synthèse vocale du navigateur par une voix factice qui enregistre ce qui est dit.

Les **règles chiffrées** du choix de la voix et de l'intonation (nombres du legacy, gardés) ne sont pas dans les scénarios. Elles sont couvertes par les tests unitaires du domaine `voix` (`Deno.test`) :
- score de chaque voix (fr-FR, autre fr, bonus « Natural/Neural/Online », « Premium », « Enhanced/améliorée », « Google », malus « compact/espeak/robot ») et tri des voix françaises ;
- écart de 15 points pour préférer une voix du bon sexe, reconnaissance du sexe par le prénom de la voix ;
- hauteur et rythme de chaque caractère de la voix, −0,25 pour une voix plus grave, +0,08 sur une phrase qui finit par « ! », variation de ±0,03, bornes de hauteur (0,5 à 2) et de rythme (1,4 au plus) ;
- score des voix d'une autre langue, caractère fixe pour l'anglais (voix féminine, hauteur 1,05, rythme 0,95) ;
- nettoyage du texte et découpage en phrases (`.`, `!`, `?`, `…`, `:`).

### Droits d'accès

La story ne crée **aucune table** ni donnée de la famille : le choix Son/Muet est une préférence de l'appareil. Il n'y a donc pas de policy RLS à vérifier, et aucun scénario `@acces` depuis que la voix imposée est sortie de la story. Le bouton Son/Muet reste à la portée de l'enfant (en-tête, story #6).

Rien de ce que produit l'enfant n'est lu ni envoyé ailleurs.

## Hors périmètre

- **Effets sonores** (bonne réponse, erreur, étoile…) : hors du périmètre retenu par la décision n°10. Le lien entre Muet et effets sonores sera tranché avec la story qui les introduit (question ouverte n°1).
- **Tout lire à voix haute** (lire aussi les réponses proposées) : réglage du lot 2.
- Les **MP3 pré-générés** (voix neuronale servie par le CDN) : plus tard (décisions 0004 et n°6). La story prépare seulement le port qui permettra de les ajouter sans changer les écrans.
- La **dictée** sans voix (« la dictée demande alors un adulte ») : lot 3, avec l'exercice `dictee`.
- Le **déverrouillage audio** au premier toucher : contrainte technique de l'adaptateur, vérifiée indirectement par les scénarios où l'enfant entend la consigne.
- La lecture des étapes de leçon, des félicitations et des encouragements : même lecture à voix haute, mais leurs scénarios viennent avec leurs stories (lots 3 et 5).

### Hors périmètre (lot 2) : voix imposée par le parent

Décision n°10 : le choix de la voix par le parent passe au lot 2, avec l'espace parent. Il reste mémorisé **sur l'appareil**. Scénarios retirés de #7, à reprendre dans la future story (ancienne règle 6 : « Le parent, et lui seul, peut imposer une voix de l'appareil à la place de la voix automatique ») :

1. Le parent voit les voix françaises de l'appareil (« Automatique (recommandé) » en premier, voix françaises triées, voix anglaise absente)
2. Une voix très naturelle est signalée au parent (« Denise (Natural) » oui, « Amélie (compact) » non)
3. Le parent essaie une voix avant de la choisir (« Coucou ! Je suis Noisette. On apprend en s'amusant ? Youpi ! », la voix automatique reste choisie)
4. La voix imposée lit les consignes, quel que soit le personnage guide
5. Le parent revient à la voix automatique
6. Une voix imposée qui n'existe plus sur l'appareil laisse place à la voix automatique
7. Le parent est prévenu quand l'appareil ne peut pas lire en français (plan : « Aucune voix française trouvée sur cet appareil : installe-en une (voir ci-dessous), puis recharge la page. » ; « Ce navigateur ne sait pas lire à voix haute. »)
8. Le parent trouve des conseils pour installer des voix plus naturelles (iPad ou iPhone, tablette Android, ordinateur) : à valider au lot 2
9. `@acces` L'enfant ne peut pas changer la voix en dehors de l'espace parent
10. `@acces` La voix imposée sur un appareil ne change pas les autres appareils
11. `@acces` La voix imposée vaut pour tous les profils enfants de l'appareil

Questions reportées avec elle : conseils d'installation des voix (ancienne M13), personnage guide de la phrase d'essai quand plusieurs profils enfants ont des univers différents (ancienne n°8), voix imposée commune à tous les profils de l'appareil, par exemple Léa (CP) et Tom (CM2) (ancienne n°6).

## Décisions

Validation n°1 du lot 1 par le PO, le 2026-10-22. « Tranchée » = réponse explicite ; « proposition appliquée » = question de détail qui suit la proposition déjà faite.

| Question | Réponse | Source |
|---|---|---|
| 1. Surlignage de toutes les consignes | Le mot surligné est **toujours celui qui est prononcé**, dans **toutes** les consignes. `@a-valider` retiré. | Proposition appliquée |
| 2. Lecture automatique | Une consigne est **toujours** lue dès qu'elle s'affiche. | Proposition appliquée |
| 3. Ce qui est observable au lot 1 | La **page de démonstration réservée aux tests**, retirée au lot 3. | Tranchée, décision n°1 |
| 4. Navigateur qui ne sait pas lire | L'enfant joue **sans message**. `@a-valider` retiré. | Proposition appliquée |
| 5. Son/Muet à la portée de l'enfant, choix de la voix réservé au parent | Son/Muet reste dans l'en-tête (story #6) ; le choix de la voix part au lot 2. | Proposition appliquée, décision n°10 |
| 6. Voix imposée et profils enfants | Reportée au lot 2 avec la voix imposée. | Décision n°10 |
| 8. Personnage guide de la phrase d'essai | Reportée au lot 2 avec la voix imposée. | Décision n°10 |
| 9. Vocabulaire : « consigne », « voix bloquée » | « Consigne » est un terme du format des leçons ; « voix bloquée » est un terme `(à valider)` du sous-domaine Voix. « Essayer une voix » part au lot 2. | Proposition appliquée (modèle) |
| 10. Taille de la story | La règle 6 (voix imposée, 11 scénarios) **sort de #7** et passe au lot 2. | Tranchée, décision n°10 |
| Modèle M6. Nom dit en remettant le son | « Je t'entends ! Je suis <nom du personnage guide en cours>. », texte du legacy mot pour mot. `@a-valider` retiré. | Tranchée, décision n°3 |
| Modèle M7. Sans univers choisi | Noisette lit. `@a-valider` retiré. | Proposition appliquée |
| Modèle M12. Message de voix bloquée | Un seul message par ouverture de l'application. `@a-valider` retiré. | Proposition appliquée |
| Modèle M4. Effets sonores | Hors périmètre de #7. | Décision n°10 (périmètre) |
| Modèle M9. Nombres du legacy | Gardés (tests unitaires). | Proposition appliquée |

## Questions ouvertes

Aucune n'est bloquante pour la story. Elles n'ont pas reçu de proposition.

1. **Muet et effets sonores** (modèle n°1) : le Muet coupera-t-il aussi les effets sonores, comme aujourd'hui ? À trancher avec la story qui les introduit (lot 3).
2. **Aucune voix française sur l'appareil** (ancienne n°7, modèle n°2) : lire quand même avec la voix par défaut du navigateur, souvent à l'accent étranger (comme aujourd'hui), ou se taire comme quand le navigateur ne sait pas lire ? Aucun scénario écrit tant que ce n'est pas décidé.
3. **« écran »** (« quitter l'écran coupe la voix », modèle n°3) : le laisse-t-on hors du langage ubiquitaire, comme terme d'interface ?
4. **« réécouter »** (modèle n°4) : terme du glossaire, ou simple libellé de bouton ?
5. **Interface `Hasard`** (modèle n°5, technique) : importée de `@domain/motivation` ou déclarée par Voix ? À trancher par l'implementer ou par une décision dans `docs/decisions/`.

Remarque de cohérence (sans question au PO) : la story #6 a aussi deux scénarios sur le Muet (« Le choix Muet est gardé sur l'appareil », « En repassant au son, le personnage guide se présente ») avec des formulations différentes de #7 (« Léa a choisi Muet » / « la tablette est en Muet », « repasse au son » / « remet le son »). Il faudra harmoniser les étapes, ou laisser ces deux comportements à une seule des deux stories.
