# Critères d'acceptance : issue #15, Choisir la voix des personnages guides sur l'appareil

Scénarios : `features/15-choix-de-la-voix.feature` (tags `@issue-15 @wip`).
Modèle du domaine : `docs/stories/15/domain-model.md`.
Origine : les 11 scénarios préparés pour la règle 6 de #7 (`docs/stories/7/acceptance.md`, « Hors périmètre (lot 2) »), repris et précisés à la lecture de `adultVoix` (`app/app.js`, l. 2253).

## Objectif

En tant que **parent**, je veux choisir la voix qui lit les consignes sur cet appareil, afin que mon enfant entende la voix la plus agréable que l'appareil propose.

Le choix de voix est mémorisé **sur l'appareil** (décision n°10 du lot 1). Il vaut pour tous les profils enfants qui y jouent. Les consignes s'affichent sur la page de démonstration réservée aux tests jusqu'au lot 3, comme pour #7.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Dans l'espace parent, le parent voit les voix françaises de l'appareil, la plus naturelle en tête | Le parent voit les voix françaises de l'appareil, de la plus naturelle à la moins naturelle · Sans voix imposée, la voix automatique est choisie et le parent sait laquelle elle utilise · La voix « <voix> » porte la mention « <mention> » (plan : « très naturelle », « la meilleure ici ») · Une voix qui n'est ni très naturelle ni la meilleure de l'appareil ne porte aucune mention · `@a-valider` Le choix de voix s'intitule « La voix des personnages guides » |
| 2 | Quand l'appareil ne peut pas lire en français, le parent est prévenu et sait comment obtenir des voix plus naturelles | Le parent est prévenu quand <situation> (plan : aucune voix française, navigateur qui ne sait pas lire) · `@a-valider` Le parent trouve des conseils pour installer des voix plus naturelles |
| 3 | Écouter une voix lit l'essai de voix, sans changer le choix de voix | Le parent écoute une voix sans changer la voix choisie · Écouter la voix automatique lit l'essai de voix avec la voix la plus naturelle · `@a-valider` Dans l'essai de voix, c'est Noisette qui se présente, quel que soit l'univers des profils enfants · `@a-valider` En Muet, l'essai de voix n'est pas lu |
| 4 | La voix imposée lit les consignes à la place de la voix automatique, avec le caractère du personnage guide | Le parent impose une voix de l'appareil · La voix imposée lit les consignes de <personnage guide> (plan : Noisette, Lumi, Coach Léo) · Le caractère du personnage guide s'applique aussi à la voix imposée · Après le retour à la voix automatique, les consignes retrouvent la voix la plus naturelle · `@a-valider` Une consigne en anglais garde la voix anglaise malgré la voix imposée |
| 5 | Une voix imposée qui n'existe plus sur l'appareil laisse place à la voix automatique | Sans la voix imposée, les consignes sont lues avec la voix automatique, sans message pour l'enfant · `@a-valider` Le parent voit que la voix automatique a repris · `@a-valider` Une voix imposée de nouveau installée reprend la lecture des consignes |
| 6 | Seul le parent change le choix de voix, et ce choix vaut pour tout l'appareil, et pour lui seul | `@acces` L'enfant ne peut pas changer la voix en dehors de l'espace parent · `@acces` Pour atteindre le choix de voix, il faut répondre au contrôle parental · `@acces` La voix imposée sur la tablette ne change pas les autres appareils · `@acces` La voix imposée vaut pour tous les profils enfants de l'appareil · La voix imposée reste choisie au lancement suivant · `@a-valider` La voix imposée reste sur l'appareil après la déconnexion du parent |

Total : 6 règles, 25 scénarios dont 3 plans (29 cas exécutés avec les exemples). 4 scénarios `@acces`, 8 scénarios `@a-valider`.

Correspondance avec les 11 scénarios préparés dans #7 : n°1 → règle 1 (premier scénario) ; n°2 → plan des mentions ; n°3 → règle 3 (Noisette isolée dans un scénario `@a-valider`) ; n°4 → plan de la règle 4 ; n°5 → retour à la voix automatique ; n°6 → règle 5 ; n°7 → plan de la règle 2 ; n°8 → conseils `@a-valider` ; n°9 à n°11 → règle 6.

Étapes réutilisées :
- #7 : « l'appareil a les voix françaises « … » et « … » », « Léa a choisi l'univers … », « la consigne « … » s'affiche », « Léa entend … lire la consigne avec la voix « … » », « … en plus grave », « la tablette est en Muet », « la tablette est toujours en Muet », « le navigateur ne sait pas lire à voix haute », « l'appareil a une voix française et une voix anglaise », « Léa fait une leçon d'anglais », « Léa relance Savanturier », « aucun message d'erreur n'apparaît ».
- #5 : « Paul est dans l'espace parent », « Paul est connecté sur la tablette et sur le téléphone », « Paul est connecté sur la tablette ».
- #6 : « Léa commence à jouer », « Léa joue », « l'en-tête propose le choix Son/Muet, l'accueil et l'espace parent ».
- #10 : « Léa a un profil enfant préparé de niveau CE1 », « Léa demande l'entrée de l'espace parent », « Léa voit une question du contrôle parental ».

### Ce que les scénarios vérifient, et ce qu'ils laissent aux tests unitaires

Les scénarios décrivent ce que le parent **voit et entend** dans l'espace parent (voix proposées, mentions, voix choisie, essai de voix, messages) et ce que l'enfant **entend** ensuite (quelle voix lit la consigne). Les step definitions réutilisent la voix factice de #7.

Restent aux tests unitaires du domaine `voix` : le score qui donne « très naturelle » (au moins 60) et le tri des voix (#7), la règle « voix imposée présente sinon voix automatique » de `choisirVoix`, un nom vide qui vaut la voix automatique, le réglage de la hauteur et du rythme appliqué à la voix imposée.

### Droits d'accès

La story ne crée **aucune table** : le choix de voix est une préférence de l'appareil, jamais envoyée au serveur. Il n'y a donc pas de policy RLS à vérifier. Les scénarios `@acces` vérifient les deux frontières de la règle :
- **qui** peut changer la voix : le parent seul, dans l'espace parent, derrière le contrôle parental. L'enfant garde le choix Son/Muet dans l'en-tête.
- **où** le choix s'applique : sur tous les profils enfants de l'appareil, jamais sur un autre appareil de la famille.

Le choix de voix ne contient aucune donnée d'enfant.

## Hors périmètre

- **Une voix différente par personnage guide** (question n°3 du modèle) : aucun scénario tant qu'elle n'est pas tranchée. Les scénarios supposent une seule voix imposée pour tous les personnages guides, comme aujourd'hui.
- **Message au parent quand la voix imposée a disparu** (question n°4 du modèle) : le scénario `@a-valider` de la règle 5 n'en montre pas, comme le propose le modèle.
- Les **MP3 pré-générés** (voix neuronale servie par le CDN) : plus tard (décisions 0004 et n°6). Le choix de voix ne porte que sur les voix de l'appareil.
- **Tout lire à voix haute** : réglage du profil enfant (#12), pas une préférence de l'appareil.
- Le texte d'explication en tête du choix de voix et l'onglet sur lequel s'ouvre l'espace parent (#10) : interface, sans règle (voir la question n°3 ci-dessous pour le texte).

## Questions ouvertes

Les questions n°1 à n°9 de `docs/stories/15/domain-model.md` restent ouvertes et ne sont pas répétées ici. Correspondance avec les scénarios `@a-valider` :
- modèle n°1 (conseils d'installation) → « Le parent trouve des conseils pour installer des voix plus naturelles »
- modèle n°2 (personnage guide de l'essai) → « Dans l'essai de voix, c'est Noisette qui se présente… » ; les deux autres scénarios d'essai disent aussi « Je suis Noisette »
- modèle n°4 (message au parent) → « Le parent voit que la voix automatique a repris »
- modèle n°5 (déconnexion) → « La voix imposée reste sur l'appareil après la déconnexion du parent »
- modèle n°7 (essai en Muet) → « En Muet, l'essai de voix n'est pas lu » (comportement actuel)
- modèle n°8 (titre) → « Le choix de voix s'intitule « La voix des personnages guides » »
- modèle n°9 (anglais) → « Une consigne en anglais garde la voix anglaise malgré la voix imposée » (comportement actuel)
- modèle n°6 (mention « actuellement : … ») : le scénario choisit un exemple où la meilleure voix et la voix prise par Noisette sont la même, il ne tranche donc pas la question.

Nouvelles questions :

1. **Voix imposée disparue : ce que montre le choix de voix.** Aujourd'hui, quand la voix imposée n'est plus sur l'appareil, **aucune ligne n'est choisie** (ni « Automatique (recommandé) », ni une voix). Le scénario `@a-valider` propose que « Automatique (recommandé) » apparaisse choisi, puisque c'est la voix automatique qui lit. D'accord (oui) ?
2. **Voix imposée disparue puis réinstallée.** Aujourd'hui, le choix reste mémorisé : si la voix revient sur l'appareil, elle lit de nouveau les consignes. Garde-t-on ce comportement (oui, scénario `@a-valider`), ou le choix est-il effacé dès que la voix automatique a repris (non) ? La réponse dépend de la question n°1 : si « Automatique » apparaît choisi alors que la voix imposée est encore mémorisée, le parent ne voit pas ce qui se passera au retour de la voix.
3. **Texte d'explication du choix de voix.** Le legacy dit : « L'application utilise les voix installées sur cet appareil. Elle choisit automatiquement la plus naturelle, puis chaque guide lui donne son caractère (plus aiguë pour l'écureuil, plus grave pour le capitaine pompier…). Tu peux aussi imposer une voix. » Il emploie « guide » seul et tutoie le parent (comme le message « installe-en une »). Reprend-on ce texte en remplaçant seulement « guide » par « personnage guide » (oui), ou le réécrit-on, et vouvoie-t-on le parent ?
4. **Essai de voix avec le caractère du personnage guide.** Le scénario d'essai dit seulement « avec la voix « Amélie (compact) » ». Le parent doit-il entendre l'essai **avec le caractère** du personnage guide (Noisette plus aiguë, comme aujourd'hui et comme le propose le modèle) (oui), ou la voix brute, pour juger la voix elle-même (non) ?

Remarques de cohérence (sans question au PO) :
- Dans `docs/stories/15/domain-model.md`, la ligne `choisirVoix` du tableau renvoie à la « question ouverte n°6 » pour l'égalité exacte des noms de voix, alors que la n°6 porte sur la mention « actuellement : … ». À corriger par `domain-modeler`.
- Les univers sont nommés « animaux », « sports », « pompier » dans les étapes de #7 et « Animaux de la forêt », « Sports », « Pompiers » dans celles de #6. Cette story reprend la forme de #7 (étapes de la voix). Il faudra harmoniser les deux formes.
