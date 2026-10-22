# Critères d'acceptance : issue #10, Contrôle parental de l'espace parent

Scénarios : `features/10-controle-parental.feature` (tags `@issue-10 @wip`).
Modèle du domaine : `docs/stories/10/domain-model.md` (contexte **Famille**).

## Objectif

En tant que **parent**, je veux que l'**espace parent** soit protégé par une **question du contrôle parental** (une multiplication que seul un adulte sait résoudre), afin que mon enfant ne change pas les réglages ni ne supprime un profil enfant par erreur.

Le contrôle parental n'est pas une sécurité : la connexion du parent (#5) et la RLS protègent les données. Il ne protège que l'accès à l'écran, sur un appareil où l'enfant joue. Tout se passe dans le navigateur, hors ligne compris.

Comportement actuel (`app/`, `adultGate`, `gateForm`) repris comme premiers exemples : multiplication de deux facteurs entre 6 et 9, réponse comparée en nombre (espaces autour ignorés), message « Ce n'est pas la bonne réponse. », même question après une erreur, essais illimités, retour vers « Qui joue ? » en quittant. Écart voulu par l'issue : l'interface dit « Espace parent », jamais « Espace adulte ».

Vocabulaire : **contrôle parental**, **question du contrôle parental**, **espace parent**, **déconnexion**, **profil en cours**, **Qui joue ?** (termes `(à valider)` du glossaire). Les scénarios écrivent la question sous la forme « 7 × 8 » : le texte exact de l'énoncé est la question n°7 du modèle.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | L'espace parent ne s'ouvre qu'après une bonne réponse à la question du contrôle parental | Paul entre dans l'espace parent en répondant « <reponse> » à « <question> » (7 × 8, 6 × 6, 9 × 9, 6 × 9) · Les espaces autour de la réponse sont ignorés · Sans bonne réponse, l'enfant qui joue ne voit pas l'espace parent (`@acces`) · Léa renonce à la question du contrôle parental et retrouve son jeu (`@acces`) · Le contrôle parental fonctionne sans réseau · Juste après la connexion du parent, l'espace parent s'ouvre sans question du contrôle parental (`@a-valider`, question A) |
| 2 | Une mauvaise réponse n'est jamais punitive : un message, puis une nouvelle chance | La réponse « <reponse> » à « 7 × 8 » est refusée sans blocage (54, 15, vide, « cinquante-six ») · Après une mauvaise réponse, la bonne réponse ouvre l'espace parent · Après une mauvaise réponse, la même question est reposée (`@a-valider`, question 1 du modèle) · Le nombre d'essais n'est pas limité (`@a-valider`, question 4 du modèle) |
| 3 | Chaque entrée dans l'espace parent pose une nouvelle question, qui multiplie deux nombres entre 6 et 9 | La question du contrôle parental multiplie deux nombres entre 6 et 9 · Une nouvelle entrée pose une nouvelle question |
| 4 | Quitter l'espace parent le ferme : pour y revenir, il faut répondre de nouveau | Après avoir quitté l'espace parent, y revenir demande une nouvelle réponse (`@acces`) · En quittant l'espace parent, Paul arrive sur « Qui joue ? » (`@a-valider`, question 5 du modèle) · Savanturier fermé puis rouvert ne rouvre pas l'espace parent (`@a-valider @acces`, question 2 du modèle) |
| 5 | L'espace parent ouvert s'appelle « Espace parent » et donne accès à la déconnexion | L'espace parent ouvert s'appelle « Espace parent » et propose la déconnexion · L'espace parent s'ouvre sur les profils enfants de la famille (`@a-valider`, question 8 du modèle) · Une bonne réponse au contrôle parental ne montre jamais les profils enfants d'une autre famille (`@acces`) |
| 6 | Le contrôle parental s'utilise sur tablette, au clavier et sur un petit écran | Sur tablette, la réponse se saisit avec le pavé numérique · Au clavier, Paul répond et entre sans souris · La question du contrôle parental tient dans un écran de 360 px de large |

Total : 6 règles, 21 scénarios (27 cas exécutés avec les exemples des deux plans).

Étapes réutilisées : « Paul est connecté sur la tablette », « il voit l'espace parent », « Paul est dans l'espace parent », « Paul a demandé un lien de connexion pour … sur la tablette », « Paul suit le lien de connexion reçu », « la déconnexion n'est pas proposée à Léa », « Paul est rattaché au profil enfant de Léa », « Claire est connectée sur la tablette », « Claire ne voit pas le profil enfant de Léa », « je ne vois pas l'espace parent », « Paul est toujours connecté sur la tablette », « Savanturier a été fermé sur la tablette » (`features/5-connexion-du-parent.feature`) ; « Léa a un profil enfant préparé de niveau CE1 », « Léa joue », « l'en-tête n'affiche aucun prénom ni aucun niveau », « jamais un « Espace adulte » », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran » (`features/6-…`) ; « le réseau est coupé » (`features/8-pwa-installable.feature`) ; « j'ouvre Savanturier » (`features/0-socle.feature`).

Testabilité du hasard : les scénarios fixent la question posée (« le contrôle parental pose la question « 7 × 8 » », « la prochaine question du contrôle parental tirée est … ») par le port `Hasard` du domaine. Le tirage lui-même (deux facteurs indépendants entre 6 et 9, 16 questions possibles) est vérifié par les tests unitaires du domaine ; l'E2E vérifie seulement que les deux nombres affichés sont entre 6 et 9.

Droits d'accès (`@acces`) : l'enfant qui ne sait pas répondre ne voit ni l'espace parent ni la déconnexion ; renoncer à la question ramène l'enfant à son jeu ; quitter l'espace parent le referme ; rouvrir Savanturier ne le rouvre pas ; une bonne réponse ne donne jamais accès aux profils d'une autre famille (le contrôle parental ne remplace pas la RLS, invariant n°6 du modèle).

## Hors périmètre

- Les onglets de l'espace parent (Suivi, Devoirs et dictée, Profils, Créer une leçon, Mes leçons, Audio des chansons, Voix) : ils arrivent avec leurs stories (lots 2 et 6). Ici, on livre la porte d'entrée et la coquille.
- La déconnexion elle-même (story #5) : ici, on vérifie seulement qu'elle est proposée dans l'espace parent ouvert.
- La création du premier profil et « + Ajouter un enfant » dans « Qui joue ? » : question n°4 de `docs/stories/11/domain-model.md`.
- La protection d'autres actions hors de l'espace parent : question n°3 du modèle. Aucun scénario tant que la réponse n'est pas connue.
- Le traitement de « 056 », « 56,0 » ou « 5 6 » : question n°6 du modèle. Aucun exemple écrit.
- La fermeture automatique après un temps sans utilisation : question n°2 du modèle. Seul le cas de Savanturier fermé puis rouvert est écrit (`@a-valider`).

## Questions ouvertes

Les questions n°1 à n°8 de `docs/stories/10/domain-model.md` restent ouvertes ; elles ne sont pas répétées ici. Scénarios concernés : n°1 « la même question est reposée », n°2 « Savanturier fermé puis rouvert », n°4 « Le nombre d'essais n'est pas limité », n°5 « Paul arrive sur « Qui joue ? » », n°8 « s'ouvre sur les profils enfants » (tous `@a-valider`) ; n°3, n°6 et n°7 n'ont pas de scénario.

Nouvelles questions :

A. **Juste après la connexion du parent** (#5, décision n°2 du lot 1 : l'écran après la connexion est l'espace parent), l'espace parent s'ouvre-t-il **sans question du contrôle parental** (oui, proposition : le parent vient de prouver qui il est), ou la question est-elle posée aussi (non) ? Scénario `@a-valider` « Juste après la connexion du parent… ».
B. La **question du contrôle parental est-elle lue à voix haute** (comme toute consigne, `CLAUDE.md`) (oui), ou reste-t-elle seulement écrite, puisqu'elle s'adresse au parent (non) ? Aucun scénario écrit.
C. Quand l'enfant **renonce** à la question, revient-il exactement là où il jouait (oui, comme aujourd'hui : sa carte s'il y a un profil en cours, sinon « Qui joue ? ») ? Le scénario « Léa renonce… » le suppose ; sans tag, car c'est le comportement actuel.
