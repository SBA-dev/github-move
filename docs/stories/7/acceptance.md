# Critères d'acceptance : issue #7, Voix : lecture à voix haute par le personnage guide

Scénarios : `features/7-voix.feature` (tags `@issue-7 @wip`).
Modèle du domaine : `docs/stories/7/domain-model.md` (ses 13 questions ouvertes ne sont pas reprises ici, seulement citées quand un scénario en dépend).

## Objectif

En tant qu'**enfant** qui ne lit pas encore bien, je veux que le **personnage guide** me lise les consignes à voix haute, afin de pouvoir jouer seul.
En tant que **parent**, je veux pouvoir imposer la voix de l'appareil que je trouve la plus agréable, afin que mon enfant entende une voix naturelle.

Comportement actuel (`app/app.js`, section « Sons et voix », lignes 148-345, et `adultVoix`, ligne 2253) : il donne les premiers exemples (messages, phrase d'essai, nettoyage du texte, choix de la voix). Seule la voix du navigateur est utilisée pour l'instant (décision n°6 de `docs/reecriture.md`).

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Le personnage guide lit la consigne à voix haute, une seule lecture à la fois | La consigne est lue à voix haute dès qu'elle s'affiche · L'enfant peut réécouter la consigne · Le mot prononcé est surligné pendant la lecture (`@a-valider`) · Une nouvelle lecture coupe la lecture en cours · Quitter l'écran coupe la voix |
| 2 | Le texte est lu comme on le dit à voix haute, jamais avec ses symboles | Les symboles d'une consigne sont dits avec des mots (plan : `+`, `=`, guillemets) · Un trou à compléter est lu comme un silence · La mise en forme de la consigne n'est jamais prononcée · Un texte sans rien à dire n'est pas lu |
| 3 | La voix a le caractère du personnage guide de l'univers choisi | Le personnage guide parle avec sa voix à lui (plan : Noisette, Lumi, Coach Léo, Capitaine Sam) · La voix la plus naturelle de l'appareil est choisie · Sans voix d'homme sur l'appareil, un personnage guide masculin parle plus grave · Sans univers choisi, c'est Noisette qui lit (`@a-valider`, question n°7 du modèle) · Une consigne en anglais est lue avec une voix anglaise |
| 4 | En Muet, rien n'est lu, et ce choix est mémorisé sur l'appareil | Le son est activé au premier lancement · En Muet, la consigne s'affiche sans être lue · Passer en Muet coupe la lecture en cours · Le Muet reste choisi au lancement suivant · En remettant le son, le personnage guide se présente (`@a-valider`, question n°6 du modèle) |
| 5 | Sans voix, l'enfant peut quand même jouer | Quand la voix est bloquée, l'enfant est prévenu sans être bloqué · Le message de voix bloquée n'apparaît qu'une fois (`@a-valider`, question n°12 du modèle) · Réécouter permet de réessayer quand la voix était bloquée · Sur un navigateur qui ne sait pas lire à voix haute, l'enfant joue quand même (`@a-valider`) |
| 6 | Le parent, et lui seul, peut imposer une voix de l'appareil à la place de la voix automatique | Le parent voit les voix françaises de l'appareil · Une voix très naturelle est signalée au parent · Le parent essaie une voix avant de la choisir · La voix imposée lit les consignes, quel que soit le personnage guide · Le parent revient à la voix automatique · Une voix imposée qui n'existe plus sur l'appareil laisse place à la voix automatique · Le parent est prévenu quand l'appareil ne peut pas lire en français (plan : aucune voix française, navigateur qui ne sait pas lire) · Le parent trouve des conseils pour installer des voix plus naturelles (`@a-valider`, question n°13 du modèle) · L'enfant ne peut pas changer la voix en dehors de l'espace parent (`@acces @a-valider`) · La voix imposée sur un appareil ne change pas les autres appareils (`@acces @a-valider`, question n°2 du modèle) · La voix imposée vaut pour tous les profils enfants de l'appareil (`@acces @a-valider`, question n°2 du modèle) |

Total : 6 règles, 28 scénarios dont 3 plans (34 cas exécutés avec les exemples).

Étapes réutilisées : « j'ouvre Savanturier » (`0-socle.feature`), « Léa relance Savanturier » (`8-pwa-installable.feature`).

### Ce que les scénarios vérifient, et ce qu'ils laissent aux tests unitaires

Les scénarios décrivent ce que l'enfant **entend ou voit** : quel personnage guide lit, avec une voix féminine ou masculine, plus grave ou non, avec quelle voix de l'appareil, et quel texte est prononcé. Pour les exécuter, les step definitions remplaceront la synthèse vocale du navigateur par une voix factice qui enregistre ce qui est dit.

Les **règles chiffrées** du choix de la voix et de l'intonation ne sont pas dans les scénarios. Elles sont couvertes par les tests unitaires du domaine `voix` (`Deno.test`) :
- score de chaque voix (fr-FR, autre fr, bonus « Natural/Neural/Online », « Premium », « Enhanced/améliorée », « Google », malus « compact/espeak/robot ») et tri des voix françaises ;
- écart de 15 points pour préférer une voix du bon sexe, reconnaissance du sexe par le prénom de la voix ;
- hauteur et rythme de chaque caractère de la voix, −0,25 pour une voix plus grave, +0,08 sur une phrase qui finit par « ! », variation de ±0,03, bornes de hauteur (0,5 à 2) et de rythme (1,4 au plus) ;
- seuil « très naturelle » (score d'au moins 60) ;
- score des voix d'une autre langue ;
- nettoyage du texte et découpage en phrases (`.`, `!`, `?`, `…`, `:`).

Ces nombres attendent la réponse à la question n°9 du modèle.

### Droits d'accès

La story ne crée **aucune table** ni donnée de la famille : la voix imposée et le choix Son/Muet sont des préférences de l'appareil (si la question n°2 du modèle est confirmée). Il n'y a donc pas de policy RLS à vérifier. Les scénarios `@acces` vérifient :
- que seul le parent, dans l'espace parent, choisit la voix ;
- que cette préférence reste sur l'appareil où elle a été faite et vaut pour tous les profils enfants qui y jouent.

Rien de ce que produit l'enfant n'est lu ni envoyé ailleurs.

## Hors périmètre

- **Tout lire à voix haute** (lire aussi les réponses proposées) : réglage du lot 2.
- L'**espace parent** lui-même et son **contrôle parental** : lot 2. Ici, on suppose que le parent est déjà dans l'espace parent.
- Les **MP3 pré-générés** (voix neuronale servie par le CDN) : plus tard (décisions 0004 et n°6). La story prépare seulement le port qui permettra de les ajouter sans changer les écrans.
- La **dictée** sans voix (« la dictée demande alors un adulte ») : lot 3, avec l'exercice `dictee`.
- Le **déverrouillage audio** au premier toucher : contrainte technique de l'adaptateur, sans comportement métier propre. Il est vérifié indirectement par les scénarios où l'enfant entend la consigne.
- Les **effets sonores** (bonne réponse, erreur, étoile…) : hors des scénarios tant que les questions n°4 et n°5 du modèle ne sont pas tranchées.
- La lecture des étapes de leçon, des félicitations et des encouragements : elles utiliseront la même lecture à voix haute, mais leurs scénarios viennent avec leurs stories (lots 3 et 5).

## Questions ouvertes

Questions nouvelles, en plus de celles du modèle du domaine :

1. **Surlignage de toutes les consignes** : dans le code actuel, seuls certains textes surlignent le mot lu (texte à lire, poésie, épisode). La consigne dans la bulle du personnage guide est lue **sans** surlignage. L'issue dit « chaque mot lu est surligné ». Faut-il surligner le mot lu dans **toutes** les consignes (scénario `@a-valider` de la règle 1), ou seulement dans les textes à lire ?
2. **Lecture automatique** : une consigne est-elle toujours lue dès qu'elle s'affiche (comme aujourd'hui), ou certaines attendent-elles que l'enfant demande à l'écouter ?
3. **Ce qui est observable au lot 1** : aucun exercice n'existe avant le lot 3. Sur quel écran du lot 1 vérifie-t-on la lecture d'une consigne (accueil, présentation du personnage guide de la story #6) ? Sinon, accepte-t-on une page de démonstration réservée aux tests jusqu'au lot 3 ?
4. **Navigateur qui ne sait pas lire à voix haute** : aujourd'hui l'enfant ne voit **aucun** message (scénario `@a-valider`), seul le parent est prévenu dans l'espace parent. Faut-il aussi prévenir l'enfant, par exemple « Lis avec un adulte » ?
5. **Choix de la voix interdit à l'enfant** (scénario `@acces @a-valider`) : confirme-t-on que le choix de la voix n'est **que** dans l'espace parent, et que le bouton Son / Muet, lui, reste à la portée de l'enfant, comme aujourd'hui ?
6. **Voix imposée et profils enfants** : si le choix reste sur l'appareil (question n°2 du modèle), il vaut pour **tous** les profils enfants qui jouent sur cet appareil (scénario `@acces @a-valider`). Est-ce voulu, par exemple pour Léa (CP) et Tom (CM2) sur la même tablette ?
7. **Voix française absente pour le français** : si l'appareil n'a aucune voix française, le code actuel laisse le navigateur lire quand même avec sa voix par défaut (souvent une voix d'une autre langue, à l'accent étranger). Faut-il lire quand même, ou se taire et prévenir comme quand le navigateur ne sait pas lire ? Aucun scénario écrit tant que ce n'est pas décidé.
8. **Nom de la phrase d'essai** : la phrase « Coucou ! Je suis Noisette. On apprend en s'amusant ? Youpi ! » reprend le personnage guide de l'univers en cours. Dans l'espace parent, quel est l'univers en cours quand plusieurs profils enfants ont des univers différents ?
9. **Vocabulaire** absent du glossaire :
   - « consigne » : utilisée dans la définition de **Personnage guide** et comme champ du format des leçons (`consigne`), mais sans entrée propre. Faut-il l'ajouter (texte qui dit à l'enfant ce qu'il doit faire dans un exercice) ?
   - « écran » (« quitter l'écran de la consigne ») : terme d'interface. Le laisse-t-on hors du domaine ?
   - « essayer une voix », « voix bloquée », « réécouter » : à ajouter au sous-domaine Voix, ou à laisser au niveau de l'interface ?
10. **Taille de la story** : avec 6 règles, la story est à la limite. Le choix de la voix par le parent (règle 6, 11 scénarios) pourrait devenir une story à part, livrée avec l'espace parent au lot 2. Garde-t-on tout dans la story #7 ?

## Décisions

Aucune pour l'instant.
