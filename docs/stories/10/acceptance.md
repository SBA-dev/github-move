# Critères d'acceptance : issue #10, Contrôle parental de l'espace parent

Scénarios : `features/10-controle-parental.feature` (tags `@issue-10 @wip`).
Modèle du domaine : `docs/stories/10/domain-model.md` (contexte **Famille**).
Décisions du PO : `docs/stories/lot-2-decisions.md` (validation n°1 du lot 2, décision n°4 surtout).

## Objectif

En tant que **parent**, je veux que l'**espace parent** soit protégé par une **question du contrôle parental** (une multiplication que seul un adulte sait résoudre), afin que mon enfant ne change pas les réglages ni ne supprime un profil enfant par erreur.

Le contrôle parental n'est pas une sécurité : la connexion du parent (#5) et la RLS protègent les données. Il ne protège que l'accès à l'écran, sur un appareil où l'enfant joue. Tout se passe dans le navigateur, hors ligne compris.

Comportement actuel (`app/`, `adultGate`, `gateForm`) repris comme premiers exemples : multiplication de deux facteurs entre 6 et 9, réponse comparée en nombre (espaces autour ignorés), message « Ce n'est pas la bonne réponse. », même question après une erreur, essais illimités, retour vers « Qui joue ? » en quittant. Écart voulu par l'issue : l'interface dit « Espace parent », jamais « Espace adulte ».

Vocabulaire : **contrôle parental**, **question du contrôle parental**, **espace parent**, **déconnexion**, **profil en cours**, **Qui joue ?** (termes `(à valider)` du glossaire). Les scénarios écrivent la question sous la forme « 7 × 8 » : le texte exact de l'énoncé est la question ouverte n°3.

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | L'espace parent ne s'ouvre qu'après une bonne réponse à la question du contrôle parental | Paul entre dans l'espace parent en répondant « <reponse> » à « <question> » (7 × 8, 6 × 6, 9 × 9, 6 × 9) · Les espaces autour de la réponse sont ignorés · Sans bonne réponse, l'enfant qui joue ne voit pas l'espace parent (`@acces`) · Léa renonce à la question du contrôle parental et retrouve son jeu (`@acces`) · Le contrôle parental fonctionne sans réseau · Juste après la connexion du parent, l'espace parent s'ouvre sans question du contrôle parental |
| 2 | Une mauvaise réponse n'est jamais punitive : un message, puis une nouvelle chance | La réponse « <reponse> » à « 7 × 8 » est refusée sans blocage (54, 15, vide, « cinquante-six ») · Après une mauvaise réponse, la bonne réponse ouvre l'espace parent · Après une mauvaise réponse, la même question est reposée · Le nombre d'essais n'est pas limité |
| 3 | Chaque entrée dans l'espace parent pose une nouvelle question, qui multiplie deux nombres entre 6 et 9 | La question du contrôle parental multiplie deux nombres entre 6 et 9 · Une nouvelle entrée pose une nouvelle question |
| 4 | Quitter l'espace parent le ferme : pour y revenir, il faut répondre de nouveau | Après avoir quitté l'espace parent, y revenir demande une nouvelle réponse (`@acces`) · En quittant l'espace parent, Paul arrive sur « Qui joue ? » · Savanturier fermé puis rouvert ne rouvre pas l'espace parent (`@acces`) |
| 5 | Seule l'entrée de l'espace parent est protégée par le contrôle parental | Une fois dans l'espace parent, Paul agit sans nouvelle question du contrôle parental |
| 6 | L'espace parent ouvert s'appelle « Espace parent » et donne accès à la déconnexion | L'espace parent ouvert s'appelle « Espace parent » et propose la déconnexion · L'espace parent s'ouvre sur les profils enfants de la famille · Une bonne réponse au contrôle parental ne montre jamais les profils enfants d'une autre famille (`@acces`) |
| 7 | Le contrôle parental s'utilise sur tablette, au clavier et sur un petit écran | Sur tablette, la réponse se saisit avec le pavé numérique · Au clavier, Paul répond et entre sans souris · La question du contrôle parental tient dans un écran de 360 px de large |

Total : 7 règles, 22 scénarios (28 cas exécutés avec les exemples des deux plans). Aucun scénario `@a-valider`.

Étapes réutilisées : « Paul est connecté sur la tablette », « il voit l'espace parent », « Paul est dans l'espace parent », « Paul a demandé un lien de connexion pour … sur la tablette », « Paul suit le lien de connexion reçu », « la déconnexion n'est pas proposée à Léa », « Paul est rattaché au profil enfant de Léa », « Claire est connectée sur la tablette », « Claire ne voit pas le profil enfant de Léa », « je ne vois pas l'espace parent », « Paul est toujours connecté sur la tablette », « Savanturier a été fermé sur la tablette » (`features/5-connexion-du-parent.feature`) ; « Léa a un profil enfant préparé de niveau CE1 », « Léa joue », « l'en-tête n'affiche aucun prénom ni aucun niveau », « jamais un « Espace adulte » », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran » (`features/6-…`) ; « Paul commence la création d'un profil enfant », « on lui demande le prénom, la classe et l'univers de l'enfant », « aucune question du contrôle parental n'est posée » (`features/11-profil-enfant.feature`) ; « le réseau est coupé » (`features/8-pwa-installable.feature`) ; « j'ouvre Savanturier » (`features/0-socle.feature`).

Testabilité du hasard : les scénarios fixent la question posée (« le contrôle parental pose la question « 7 × 8 » », « la prochaine question du contrôle parental tirée est … ») par le port `Hasard` du domaine. Le tirage lui-même (deux facteurs indépendants entre 6 et 9, 16 questions possibles) est vérifié par les tests unitaires du domaine ; l'E2E vérifie seulement que les deux nombres affichés sont entre 6 et 9.

Droits d'accès (`@acces`) : l'enfant qui ne sait pas répondre ne voit ni l'espace parent ni la déconnexion ; renoncer à la question ramène l'enfant à son jeu ; quitter l'espace parent le referme ; rouvrir Savanturier ne le rouvre pas ; une bonne réponse ne donne jamais accès aux profils d'une autre famille (le contrôle parental ne remplace pas la RLS, invariant n°6 du modèle).

## Hors périmètre

- Les onglets de l'espace parent (Suivi, Devoirs et dictée, Profils, Créer une leçon, Mes leçons, Audio des chansons, Voix) : ils arrivent avec leurs stories (lots 2 et 6). Ici, on livre la porte d'entrée et la coquille.
- La déconnexion elle-même (story #5) : ici, on vérifie seulement qu'elle est proposée dans l'espace parent ouvert.
- « + Ajouter un enfant » dans « Qui joue ? », qui demande le contrôle parental parce qu'il mène à l'espace parent : scénario de la story #11 (décision n°5).
- Le profil en cours gardé pendant l'espace parent : il ne s'observe que par l'essai de voix, vérifié dans la story #15 (décision n°11).
- Le traitement de « 056 », « 56,0 » ou « 5 6 » : question ouverte n°2. Aucun exemple écrit.
- La fermeture automatique après un temps sans utilisation : question ouverte n°1. Seul le cas de Savanturier fermé puis rouvert est écrit.

## Décisions

Validation n°1 du lot 2 par le PO, le 2026-10-22 (`docs/stories/lot-2-decisions.md`), et arbitrage de l'orchestrateur consigné dans `docs/stories/10/journal.md`. Numéros d'origine : « M » = ancienne liste du modèle, « A » = ancienne liste de ce fichier.

| Question | Réponse | Effet sur les scénarios |
|---|---|---|
| M1. Même question après une erreur ? | **Oui** (décision n°4). | « la même question est reposée » : `@a-valider` retiré. |
| M4. Nombre d'essais limité ? | **Non**, essais illimités (décision n°4). | « Le nombre d'essais n'est pas limité » : `@a-valider` retiré. |
| M3. Autres actions protégées ? | **Non** : seule l'entrée de l'espace parent est protégée (décision n°4). | Nouvelle règle n°5 et son scénario. |
| A-A. Question juste après la connexion du parent ? | **Non** : l'espace parent s'ouvre sans question (décision n°4). | « Juste après la connexion du parent… » : `@a-valider` retiré. |
| M5. Où mène la sortie ? | Sur **« Qui joue ? »** (décision n°4). | « En quittant l'espace parent, Paul arrive sur « Qui joue ? » » : `@a-valider` retiré. |
| M2 (en partie). Espace parent à la réouverture ? | **Refermé** (décision n°4). | « Savanturier fermé puis rouvert… » : `@a-valider` retiré. |
| M8. Onglet d'ouverture ? | **« Profils »** tant que « Suivi » (lot 6) n'existe pas (proposition appliquée). | « L'espace parent s'ouvre sur les profils enfants de la famille » : `@a-valider` retiré. |
| A-C. Renoncer à la question ? | L'enfant revient là où il jouait, comme le legacy (proposition appliquée). | Scénario « Léa renonce… » inchangé. |
| M5 suite. Profil en cours pendant l'espace parent ? | Le profil qui jouait **reste le profil en cours** pendant l'espace parent (décision n°11, arbitrage du journal) ; la sortie ramène toujours à « Qui joue ? ». | Aucun scénario ici : vérifié par l'essai de voix (#15). |
| Glossaire. « Espace adulte » | Synonyme interdit de **Espace parent** (proposition appliquée). | « … mais jamais un « Espace adulte » » inchangé. |

## Questions ouvertes

Aucune n'est bloquante pour la story. Numérotation de `docs/stories/10/domain-model.md`.

1. L'espace parent se referme-t-il **tout seul** après un temps sans utilisation, ou quand l'application passe en arrière-plan (oui : combien de minutes ?) ? Sinon (non), il reste ouvert jusqu'à ce que le parent le quitte ou ferme l'application.
2. Réponse saisie « 056 », « 56,0 » ou « 5 6 » : acceptée comme 56 (oui / non) ? Aujourd'hui « 056 » et « 56.0 » sont acceptés, « 56,0 » et « 5 6 » refusés (effet de la conversion en nombre, pas une règle voulue).
3. **Textes** : garde-t-on « Question pour un adulte : combien font a × b ? » et « Ce n'est pas la bonne réponse. » (oui), ou faut-il « Question pour un parent » (non : donner le texte) ?
4. La **question du contrôle parental est-elle lue à voix haute**, comme toute consigne (oui), ou reste-t-elle seulement écrite, puisqu'elle s'adresse au parent (non) ?
