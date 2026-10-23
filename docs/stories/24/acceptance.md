# Critères d'acceptance : issue #24, Étoiles et fin de la séance

Scénarios : `features/24-etoiles-et-fin-de-seance.feature` (tags `@issue-24 @wip`).
Modèle du domaine : `docs/stories/24/domain-model.md` (contexte **Apprentissage**, avec **Catalogue pédagogique**, **Motivation**, **Accompagnement** et **Famille**).
Numérotation des questions : unique pour le lot 3, voir `docs/stories/16/acceptance.md` (#24 → Q69 à Q78 ; nouvelle question Q79 ; décisions du PO après les E2E : Q82 à Q84).

## Objectif

En tant qu'**enfant**, je veux voir combien d'**étoiles** j'ai gagnées à la fin d'une **séance**, puis rejouer ou passer à la suite, afin de savoir où j'en suis et d'avoir envie de continuer.

En tant que **parent**, je veux que les **séances terminées** et les **meilleures étoiles** de mon enfant soient gardées et retrouvées sur mes appareils, et que personne d'autre n'y ait accès.

Première story d'Apprentissage qui écrit en base : calcul des étoiles dans le navigateur (affichage immédiat), puis **revalidation par le serveur** qui rejoue les réponses (Edge Function `terminer-la-seance`, JWT du parent), **résultat de la leçon** (meilleures étoiles, dernières étoiles, nombre de séances), RLS fondée sur le rattachement, suppression et export avec le profil (#14).

Comportement actuel (`app/`, `playLesson`) repris comme premiers exemples. Écarts voulus, validés par le PO (voir « Décisions ») : une séance faite seulement d'une fluence ne donne pas d'étoiles (Q69), « Leçon suivante » sans parcours (Q73), séance gardée sur l'appareil et renvoyée si l'envoi échoue (Q76), résumé seulement gardé (Q71), étoiles écrites en texte (accessibilité, défaut du legacy corrigé).

## Règles

Validation n°1 du lot 3 par le PO, le 2026-10-23 : « OK pour tout » (`docs/stories/lot-3-decisions.md` ; décisions `docs/decisions/0012-*` et `docs/decisions/0013-*`). Les propositions sont acceptées telles quelles : plus aucun scénario n'est `@a-valider`, et le comportement décrit n'a pas changé.

| # | Règle | Scénarios |
|---|---|---|
| 1 | Une séance terminée donne 3 étoiles sans erreur, 2 avec 1 à 3 erreurs, et 1 au-delà | Avec <erreurs> erreur(s) dans la séance, Léa gagne <étoiles> étoile(s) (5 cas : 0, 1, 3, 4, 9) · Les erreurs de tous les exercices de la séance comptent ensemble |
| 2 | À la fin de la séance, le personnage guide dit à l'enfant combien d'étoiles il a gagnées | Avec 3 étoiles, le personnage guide dit son expression et salue l'enfant · Avec <étoiles>, le personnage guide propose de rejouer pour les autres étoiles (2 cas : 2 étoiles, 1 étoile) |
| 3 | Une séance d'un exercice donne aussi les étoiles de la leçon, sauf une séance faite seulement d'une fluence | Une séance d'un exercice donne les étoiles de la leçon · Une séance faite seulement d'une fluence ne donne pas d'étoiles (`@depend-de-20`) |
| 4 | Les meilleures étoiles d'une leçon ne baissent jamais | Une séance moins bonne ne fait pas baisser les meilleures étoiles · Une meilleure séance fait monter les meilleures étoiles · Les étoiles gagnées sur la tablette se retrouvent sur un autre appareil du parent (`@acces`) |
| 5 | À la fin de la séance, l'enfant rejoue, passe à la leçon suivante ou revient à l'accueil | La fin de la séance propose la leçon suivante, l'accueil et de rejouer · La leçon suivante est la leçon d'ordre suivant de la même matière et du même niveau · Après la dernière leçon d'une matière, aucune leçon suivante n'est proposée · Rejouer relance le même choix de séance · Rejouer tire de nouveaux calculs (`@depend-de-20`) |
| 6 | Une séance terminée est enregistrée une seule fois, par le serveur, et seulement pour un parent rattaché | Le serveur refuse une séance terminée qui annonce des étoiles · Le serveur recalcule les étoiles à partir des réponses de la séance · Une séance terminée incohérente n'est pas enregistrée, sans rien montrer de plus à l'enfant · Le second parent rattaché voit les étoiles de Léa (`@acces`) · Un parent qui n'est pas rattaché ne peut pas enregistrer une séance pour Léa (`@acces`) · Un parent qui n'est pas rattaché ne voit pas les étoiles de Léa (`@acces`) · Une séance quittée avant la fin n'est pas enregistrée · Sans réseau, la fin de la séance s'affiche et la séance terminée est envoyée plus tard · Au retour du réseau, la séance gardée sur l'appareil est enregistrée |
| 7 | Les séances terminées font partie des données du profil enfant | L'export du profil contient les séances terminées et les étoiles, sans les réponses données (`@depend-de-14`) · La suppression du profil efface ses séances terminées et ses étoiles (`@depend-de-14`) |
| 8 | La fin de la séance se lit sans les dessins, sans mouvement et sur un petit écran | Avec les mouvements réduits, la fin de la séance s'affiche sans étincelles · La fin de la séance tient dans un écran de 360 px de large |

Total : 8 règles, 27 scénarios (32 cas), dont 4 `@acces`, aucun `@a-valider`. Tags `@depend-de-<n>` (scénario exclu par `--grep-invert @depend-de` jusqu'à la livraison de #<n>) : `@depend-de-14` (export et suppression du profil), `@depend-de-20` (fluence, calculs tirés). Plus de 6 règles : la story peut se livrer en deux temps, les étoiles et la fin de la séance dans le navigateur (règles 1, 2, 5, 8), puis l'enregistrement (règles 3, 4, 6, 7).

Droits d'accès (`@acces`) : les deux parents rattachés lisent les étoiles de Léa, sur tous leurs appareils ; un parent non rattaché (Claire) ne peut ni enregistrer une séance pour Léa (refus présenté comme un profil introuvable, comme #11) ni lire ses étoiles. Les écritures passent par l'Edge Function avec le JWT de l'appelant ; la lecture se fait sous RLS.

Idempotence : une même séance terminée envoyée deux fois n'est comptée qu'une fois. Invisible pour l'enfant (les meilleures étoiles ne changent pas, et le nombre de séances n'est pas affiché au lot 3) : vérifiée par les tests du cas d'usage `TerminerLaSeance` et par un test d'intégration de l'Edge Function, pas en E2E.

Où l'enfant voit ses meilleures étoiles : les scénarios les observent sur la **page de la leçon** (« la page de la leçon montre 2 étoiles pour Léa »). Décision du PO (Q79).

## Données de test

| Leçon | Id | Utilisée pour |
|---|---|---|
| Les sons de test (test) | — | français, CP, ordre 901 : une étape de leçon, puis deux exercices bulles de 5 questions à quatre choix, « Premières bulles » (consigne « Touche le mot qui a le son ou. ») et « Dernières bulles » (consigne « Touche le mot qui a le son on. »). Séance complète de 10 questions (jusqu'à 3 erreurs par question) : étoiles (0, 1, 3, 4, 5, 9 erreurs), erreurs de deux exercices, phrases de fin, meilleures étoiles, rejouer, envoi au serveur, sans réseau, mouvements réduits, 360 px |
| La suite de test (test) | — | français, CP, ordre 903 : leçon suivante de « Les sons de test » (aucune leçon de français du CP entre les ordres 901 et 903) |
| Les sons ou, on, an | `fr-cp-sons-ou-on-an` | scénarios où la séance n'a pas besoin de se terminer dans l'interface (séances préparées, séance quittée, envois directs, droits d'accès, export) et séance de son seul exercice bulles « Quel son entends-tu ? » |
| Les animaux | `an-cp-animaux` | dernière leçon d'anglais du CP (ordre 40) : pas de leçon suivante |
| Les doubles | `ma-cp-doubles` | séance faite seulement de la fluence « Calcul rapide : les doubles » |
| « Additions » (test) | — | calcul tiré par un générateur, pour « Rejouer » |

Parents et appareils : Paul (tablette et téléphone) et Marie (téléphone), rattachés à Léa ; Claire (téléphone), non rattachée. Les séances déjà jouées (« Léa a déjà gagné 3 étoiles… ») sont préparées par le jeu de données, avec la clé `service_role` réservée à la préparation (skill BDD). Les leçons de test sont ajoutées à la bibliothèque servie au navigateur du test (comme #16 et #17) ; la vraie bibliothèque reste intacte. Elles remplacent « Les sons ou, on, an » dans les scénarios qui jouent la séance complète jusqu'à la fin : son second exercice est un `classer`, jouable seulement avec #18. « L'appareil envoie une séance terminée … avec 5 erreurs, en annonçant 3 étoiles / sans annoncer d'étoiles » et « une question qui ne finit pas par la bonne réponse » sont des appels directs à l'Edge Function avec le JWT de Paul.

## Hors périmètre

- Zone « nouveautés » (épisode, cabane, badge) et badge dit à voix haute (Q74) : lot 5.
- « Leçon suivante » selon le parcours et les verrous : lot 4 (au lot 3 : ordre suivant, Q73).
- Révisions, test de départ, mots de la semaine (séances spéciales) : lots 4 et 6.
- Reprise d'une séance en cours et hors ligne complet : #44. Seul l'envoi différé d'une séance terminée est couvert ici (Q76).
- Le suivi du parent (Accompagnement) : lot 6. Les étoiles sont observées sur la page de la leçon (Q79).

## Décisions

Source : validation du PO du 2026-10-23 (`docs/stories/lot-3-decisions.md`). Chaque question reçoit pour réponse sa proposition.

69. *(#24 n°1)* **Séance d'un exercice** : elle donne les étoiles de la leçon, **sauf** une séance faite seulement d'une fluence (qui garde le record, sans étoiles) ? **Décision** : oui. → règle 3.
70. *(#24 n°2)* **Seuils des étoiles** gardés (0 / 1 à 3 / 4 et plus), quel que soit le nombre de questions ? **Décision** : oui pour la beta ; à revoir avec les données du suivi. → plan de la règle 1.
71. *(#24 n°3)* **Ce qu'on garde d'une séance** : le résumé seulement (étoiles, erreurs, par question : clé, erreurs, « Je ne sais pas » ; réussites et erreurs par type), les réponses données étant oubliées après la revalidation ? **Décision** : oui. → « L'export du profil contient les séances terminées… sans les réponses données ».
72. *(#24 n°4)* **Séance abandonnée** : rien n'est enregistré ? **Décision** : oui (comme Q2). → « Une séance quittée avant la fin n'est pas enregistrée ».
73. *(#24 n°5)* **« Leçon suivante » au lot 3** : la leçon d'`ordre` suivant, même matière et même niveau, et pas de bouton après la dernière ? **Décision** : oui ; le lot 4 la remplace par la règle du parcours. → deux scénarios de la règle 5.
74. *(#24 n°6)* **Nouveau badge dit à voix haute** ? **Décision** : oui, au lot 5. Pas de scénario.
75. *(#24 n°7)* « Écran de fin » terme d'interface ; « essai » interdit, on dit **nombre de séances** ? **Décision** : oui. Les scénarios disent « la fin de la séance ».
76. *(#24 n°8)* **Envoi impossible** : la fin de la séance s'affiche, avec « Sauvegarde en ligne impossible : la progression est gardée sur cet appareil. », et la séance terminée est renvoyée au retour du réseau ? **Décision** : oui. → deux scénarios de la règle 6.
77. *(#24 n°9, architecture)* Écritures d'Apprentissage par Edge Function seulement, revalidation par rejeu (décision 0011 ou 0012) ? **Décision** : oui. → « Le serveur recalcule les étoiles… ».
78. *(#24 n°10)* **Séance incohérente** refusée : l'enfant ne voit rien de plus, rien n'est enregistré, l'erreur est journalisée sans donnée d'enfant ? **Décision** : oui. → « Une séance terminée incohérente n'est pas enregistrée… ».

Question née des scénarios :

79. **Où l'enfant voit-il ses meilleures étoiles au lot 3 ?** Le parcours (lot 4) et le suivi (lot 6) n'existent pas encore ; sans un endroit qui les montre, ni l'enfant ni le parent ne voient qu'elles sont gardées. **Décision** : sur la page de la leçon, sous le titre, en dessin et en texte (« Tes meilleures étoiles : 2 sur 3 »), rien avant la première séance terminée. Le lot 4 les reprendra sur le parcours. → tous les scénarios qui disent « la page de la leçon montre … étoiles pour Léa ».

Décisions du PO après le premier passage des E2E (2026-10-23) :

82. **Séance complète jouable avant #18** : les scénarios qui jouent la séance complète jusqu'à la fin utilisent une leçon de test faite seulement de questions à bulles (« Les sons de test », suivie de « La suite de test »), au lieu de « Les sons ou, on, an » dont le second exercice est un `classer`. Le comportement vérifié ne change pas, seules les données changent.
83. **Envoi qui annonce des étoiles** : le serveur **refuse** une séance terminée qui annonce des étoiles (l'application n'en envoie jamais ; seul le rejeu des réponses compte), et les étoiles de l'enfant ne changent pas. Un envoi normal de la même séance donne les étoiles recalculées (1 étoile pour 5 erreurs). → « Le serveur refuse une séance terminée qui annonce des étoiles » et « Le serveur recalcule les étoiles à partir des réponses de la séance ».
84. **Dépendances** : `@depend-de-14` sur l'export et la suppression du profil, `@depend-de-20` sur la fluence et les calculs tirés. Les scénarios de #23 qui attendaient #24 passent : leur tag `@depend-de-24` est retiré.

## Questions ouvertes

Aucune.
