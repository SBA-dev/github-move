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
| 1 | Dans l'espace parent, le parent voit les voix françaises de l'appareil, la plus naturelle en tête | Le parent voit les voix françaises de l'appareil, de la plus naturelle à la moins naturelle · Sans voix imposée, la voix automatique est choisie et le parent sait laquelle elle utilise · La voix « <voix> » porte la mention « <mention> » (plan : « très naturelle », « la meilleure ici ») · Une voix qui n'est ni très naturelle ni la meilleure de l'appareil ne porte aucune mention · Le choix de voix s'intitule « La voix des personnages guides » |
| 2 | Quand l'appareil ne peut pas lire en français, le parent est prévenu et sait comment obtenir des voix plus naturelles | Le parent est prévenu quand <situation> (plan : aucune voix française, navigateur qui ne sait pas lire) · Le parent trouve des conseils pour installer des voix plus naturelles |
| 3 | Écouter une voix fait lire l'essai de voix par le personnage guide du profil en cours, sans changer le choix de voix | Le parent écoute une voix sans changer la voix choisie · Écouter la voix automatique lit l'essai de voix avec la voix la plus naturelle · L'essai de voix est lu par <personnage guide> quand <situation> (plan : Coach Léo, Lumi, Noisette sans univers, Noisette sans profil en cours) · L'essai de voix garde le caractère du personnage guide du profil en cours · En Muet, l'essai de voix n'est pas lu |
| 4 | La voix imposée lit les consignes à la place de la voix automatique, avec le caractère du personnage guide | Le parent impose une voix de l'appareil · La voix imposée lit les consignes de <personnage guide> (plan : Noisette, Lumi, Coach Léo) · Le caractère du personnage guide s'applique aussi à la voix imposée · Après le retour à la voix automatique, les consignes retrouvent la voix la plus naturelle · Une consigne en anglais garde la voix anglaise malgré la voix imposée |
| 5 | Une voix imposée qui n'existe plus sur l'appareil laisse place à la voix automatique | Sans la voix imposée, les consignes sont lues avec la voix automatique, sans message pour l'enfant · Le parent voit « Automatique (recommandé) » choisi, sans message, quand la voix imposée a disparu · Une voix imposée de nouveau installée reprend la lecture des consignes |
| 6 | Seul le parent change le choix de voix, et ce choix vaut pour tout l'appareil, et pour lui seul | `@acces` L'enfant ne peut pas changer la voix en dehors de l'espace parent · `@acces` Pour atteindre le choix de voix, il faut répondre au contrôle parental · `@acces` La voix imposée sur la tablette ne change pas les autres appareils · `@acces` La voix imposée vaut pour tous les profils enfants de l'appareil · La voix imposée reste choisie au lancement suivant · La voix imposée reste sur l'appareil après la déconnexion du parent |

Total : 6 règles, 26 scénarios dont 4 plans (33 cas exécutés avec les exemples). 4 scénarios `@acces`, aucun scénario `@a-valider`.

Correspondance avec les 11 scénarios préparés dans #7 : n°1 → règle 1 (premier scénario) ; n°2 → plan des mentions ; n°3 → règle 3 (personnage guide du profil en cours, décision n°11) ; n°4 → plan de la règle 4 ; n°5 → retour à la voix automatique ; n°6 → règle 5 ; n°7 → plan de la règle 2 ; n°8 → conseils ; n°9 à n°11 → règle 6.

Étapes réutilisées :
- #7 : « l'appareil a les voix françaises « … » et « … » », « Léa a choisi l'univers … », « la consigne « … » s'affiche », « Léa entend … lire la consigne avec la voix « … » », « … en plus grave », « la tablette est en Muet », « la tablette est toujours en Muet », « le navigateur ne sait pas lire à voix haute », « l'appareil a une voix française et une voix anglaise », « Léa fait une leçon d'anglais », « Léa relance Savanturier », « aucun message d'erreur n'apparaît ».
- #5 : « Paul est dans l'espace parent », « Paul est connecté sur la tablette et sur le téléphone », « Paul est connecté sur la tablette ».
- #6 : « Léa commence à jouer », « Léa joue », « l'en-tête propose le choix Son/Muet, l'accueil et l'espace parent ».
- #10 : « Léa a un profil enfant préparé de niveau CE1 », « Léa demande l'entrée de l'espace parent », « Léa voit une question du contrôle parental ».
- Nouvelles (règle 3, profil en cours) : « Paul est entré dans l'espace parent », « Tom jouait dans l'univers … », « Léa jouait sans avoir choisi d'univers », « personne ne jouait sur la tablette », « Paul entend <personnage guide> dire « … » avec la voix « … » ».

### Ce que les scénarios vérifient, et ce qu'ils laissent aux tests unitaires

Les scénarios décrivent ce que le parent **voit et entend** dans l'espace parent (voix proposées, mentions, voix choisie, essai de voix, messages) et ce que l'enfant **entend** ensuite (quelle voix lit la consigne). Les step definitions réutilisent la voix factice de #7.

Restent aux tests unitaires du domaine `voix` : le score qui donne « très naturelle » (au moins 60) et le tri des voix (#7), la règle « voix imposée présente sinon voix automatique » de `choisirVoix`, un nom vide qui vaut la voix automatique, le réglage de la hauteur et du rythme appliqué à la voix imposée.

### Droits d'accès

La story ne crée **aucune table** : le choix de voix est une préférence de l'appareil, jamais envoyée au serveur. Il n'y a donc pas de policy RLS à vérifier. Les scénarios `@acces` vérifient les deux frontières de la règle :
- **qui** peut changer la voix : le parent seul, dans l'espace parent, derrière le contrôle parental. L'enfant garde le choix Son/Muet dans l'en-tête.
- **où** le choix s'applique : sur tous les profils enfants de l'appareil, jamais sur un autre appareil de la famille.

Le choix de voix ne contient aucune donnée d'enfant.

## Hors périmètre

- **Une voix différente par personnage guide** (question ouverte n°1) : aucun scénario tant qu'elle n'est pas tranchée. Les scénarios supposent une seule voix imposée pour tous les personnages guides, comme aujourd'hui.
- **Message au parent quand la voix imposée a disparu** : il n'y en a pas (décision ci-dessous).
- Les **MP3 pré-générés** (voix neuronale servie par le CDN) : plus tard (décisions 0004 et n°6). Le choix de voix ne porte que sur les voix de l'appareil.
- **Tout lire à voix haute** : réglage du profil enfant (#12), pas une préférence de l'appareil.
- Le texte d'explication en tête du choix de voix et l'onglet sur lequel s'ouvre l'espace parent (#10) : interface, sans règle. Le texte est repris du legacy (décision ci-dessous).

## Décisions

Validation n°1 du lot 2 par le PO, le 2026-10-22 (`docs/stories/lot-2-decisions.md`, décision n°11 ; détail dans la section « Décisions » de `docs/stories/15/domain-model.md`). Les tags `@a-valider` correspondants sont retirés.

| Question | Réponse | Scénarios |
|---|---|---|
| Modèle M1. Conseils d'installation | Repris tels quels (iPad / iPhone, Android, ordinateur). Proposition appliquée. | Le parent trouve des conseils pour installer des voix plus naturelles |
| Modèle M2. Personnage guide de l'essai de voix | Celui du **profil en cours**, ou **Noisette** s'il n'y en a pas. Le profil en cours reste connu pendant l'espace parent (arbitrage du 22/10, `docs/stories/15/journal.md`, question n°5 de #10). Tranchée, décision n°11. | L'essai de voix est lu par <personnage guide> quand <situation> (remplace « c'est Noisette qui se présente, quel que soit l'univers ») ; les deux premiers scénarios d'essai précisent que personne ne jouait |
| Modèle M4 / acceptance n°1. Voix imposée disparue : ce que voit le parent | « Automatique (recommandé) » apparaît **choisi**, sans message. Tranchée, décision n°11. | Le parent voit « Automatique (recommandé) » choisi, sans message, quand la voix imposée a disparu |
| Acceptance n°2. Voix imposée réinstallée | Le choix est **gardé en mémoire** : la voix revenue lit de nouveau les consignes. Tranchée, décision n°11. | Une voix imposée de nouveau installée reprend la lecture des consignes (étape « Étant donné » réécrite : la voix a été imposée, a disparu, puis a été réinstallée) |
| Modèle M5. Déconnexion du parent | Le choix de voix **reste** sur l'appareil. Tranchée, décision n°11. | La voix imposée reste sur l'appareil après la déconnexion du parent |
| Modèle M7. Essai de voix en Muet | Rien n'est lu, comme aujourd'hui. Proposition appliquée. | En Muet, l'essai de voix n'est pas lu |
| Modèle M8. Titre | « La voix des personnages guides ». Proposition appliquée. | Le choix de voix s'intitule « La voix des personnages guides » |
| Modèle M9. Leçons d'anglais | L'anglais garde sa voix anglaise. Tranchée, décision n°11. | Une consigne en anglais garde la voix anglaise malgré la voix imposée |
| Acceptance n°3. Texte d'explication | Repris du legacy en remplaçant seulement « guide » par « personnage guide » ; le tutoiement est gardé. Proposition appliquée. | Aucun (interface) |
| Acceptance n°4. Essai avec le caractère du personnage guide | **Oui**, essai compris. Tranchée, décision n°11. | L'essai de voix garde le caractère du personnage guide du profil en cours ; les scénarios d'essai disent « Paul entend <personnage guide> dire … » |

## Questions ouvertes

Aucune n'est bloquante pour la story. Elles n'ont pas reçu de proposition tranchée et restent celles du modèle (`docs/stories/15/domain-model.md`) :

1. (modèle M3) Faut-il pouvoir **imposer une voix différente par personnage guide** (oui / non) ? Les scénarios supposent une seule voix pour tous, comme aujourd'hui.
2. (modèle M6) La mention « actuellement : <voix> » de « Automatique » montre aujourd'hui la **meilleure voix**, pas celle que prendra le personnage guide de l'essai (qui peut être une voix masculine pour Coach Léo, maintenant que l'essai suit le profil en cours). Montrer la voix réellement prise pour ce personnage guide (oui), ou garder la meilleure voix (non) ? Le scénario « Sans voix imposée, la voix automatique est choisie… » prend un exemple où les deux coïncident, il ne tranche pas.

Remarques de cohérence (sans question au PO) :
- Les univers sont nommés « animaux », « princesse », « sports », « pompier », comme dans les étapes de `features/7-voix.feature` (vérifié). #6 écrit « Animaux de la forêt », « Pompiers »… : l'écart entre #6 et #7 reste à harmoniser hors de cette story.
