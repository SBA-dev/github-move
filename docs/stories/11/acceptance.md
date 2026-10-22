# Critères d'acceptance : issue #11, Créer et modifier un profil enfant, et choisir qui joue

Scénarios : `features/11-profil-enfant.feature` (tags `@issue-11 @wip`).
Modèle du domaine : `docs/stories/11/domain-model.md` (contexte Famille).

## Objectif

En tant que **parent**, je veux créer le profil enfant de chacun de mes enfants (prénom, niveau, univers), afin que chacun joue dans son univers, à son niveau, et que je retrouve sa progression sur tous mes appareils.

Comportement actuel (`app/`) : `showHome`, `childForm`, `adultProfils`. Il donne les premiers exemples : prénom de 20 caractères au plus, espaces autour retirés ; niveau CP et univers « Animaux de la forêt » par défaut ; profils montrés dans l'ordre de création ; « Bonjour Léa ! » au choix d'un profil ; profil en cours non mémorisé ; deux profils peuvent avoir le même prénom.

Cette story remplace les **profils enfants préparés pour les tests** du lot 1 (décision n°2 du lot 1) : les scénarios partent de profils créés par un parent (« Paul a créé le profil enfant… », « Paul est rattaché au profil enfant… ») et l'enfant entre dans son univers en choisissant son profil dans « Qui joue ? ».

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Le parent crée un profil enfant avec un prénom, un niveau et un univers, et le retrouve sur tous ses appareils | Paul crée le profil enfant de Léa · Sans autre choix, un nouveau profil enfant est de niveau CP, dans l'univers « Animaux de la forêt » · Le profil enfant peut être de niveau <niveau> (CP à CM2) · Un profil enfant créé sur la tablette se retrouve sur le téléphone · Le profil enfant ne demande que le prénom, le niveau et l'univers · Deux profils enfants du même parent peuvent avoir le même prénom (`@a-valider`) |
| 2 | Le prénom est obligatoire et fait au plus 20 caractères, sans les espaces autour | Le prénom « <prénom> » (<cas>) est accepté tel quel (simple, 1 caractère, 20 caractères) · Les espaces autour du prénom sont retirés · Un prénom de plus de 20 caractères est coupé à 20 caractères (`@a-valider`) · Un prénom vide est refusé avec un message (`@a-valider`) · Un prénom fait seulement d'espaces est refusé avec un message (`@a-valider`) |
| 3 | Le parent rattaché modifie le prénom, le niveau ou l'univers d'un profil enfant | Paul fait passer Léa du CE1 au CE2 · Après un changement d'univers, Léa joue avec le personnage guide de son nouvel univers · Paul corrige le prénom de Léa · Une modification faite sur la tablette se retrouve sur le téléphone · Vider le prénom d'un profil enfant est refusé, et le prénom d'avant reste (`@a-valider`) |
| 4 | « Qui joue ? » montre les profils enfants du parent dans l'ordre de leur création, et l'enfant y choisit le sien pour jouer | Les profils enfants apparaissent dans l'ordre de leur création · Léa choisit son profil enfant et son personnage guide la salue · Léa choisit son profil enfant même sans réseau · À la réouverture de Savanturier, on repasse par « Qui joue ? » (`@a-valider`) · « Qui joue ? » tient dans un écran de 360 px, avec des choix assez grands pour un doigt d'enfant |
| 5 | Créer et modifier un profil enfant passent par l'espace parent, choisir qui joue reste à la portée de l'enfant | Ajouter un enfant depuis « Qui joue ? » demande le contrôle parental (`@acces @a-valider`) · En dehors de l'espace parent, la modification d'un profil enfant n'est pas proposée (`@acces`) · Choisir qui joue ne demande pas le contrôle parental (`@acces`) · Sans profil enfant, Noisette invite Paul à créer le premier dans l'espace parent (`@a-valider`) |
| 6 | Un parent ne voit et ne modifie que les profils enfants auxquels il est rattaché | Le parent qui crée un profil enfant y est rattaché d'office (`@acces`) · Claire ne voit jamais dans « Qui joue ? » les profils enfants de la famille de Paul (`@acces`) · Dans l'espace parent, Claire ne voit pas le profil enfant de Léa (`@acces`) · Claire ne peut pas modifier le profil enfant de Léa, auquel elle n'est pas rattachée (`@acces`) · Sans connexion, personne ne peut créer de profil enfant (`@acces`) |

Total : 6 règles, 28 scénarios (34 cas exécutés avec les exemples des plans).

Étapes réutilisées : « Paul est connecté sur la tablette », « Paul est connecté sur la tablette et sur le téléphone », « Paul est dans l'espace parent », « Claire est connectée sur la tablette », « Claire ouvre l'espace parent », « Claire ne voit pas le profil enfant de Léa », « personne n'est connecté sur la tablette », « je suis invité à me connecter avec mon adresse e-mail », « aucun parent n'utilise l'adresse … », « Paul a demandé un lien de connexion pour … sur la tablette », « Paul suit le lien de connexion reçu », « il voit l'espace parent », « Savanturier a été fermé sur la tablette » (`features/5-…`) ; « elle voit <personnage guide> dans le paysage de l'univers « … » », « l'en-tête affiche « Léa · CE1 » », « l'en-tête n'affiche aucun prénom ni aucun niveau », « l'écran de l'appareil mesure 360 px de large » (`features/6-…`) ; « Savanturier a déjà été chargé une fois sur la tablette », « le réseau est coupé » (`features/8-…`) ; « j'ouvre Savanturier », « la page tient dans la largeur de l'écran » (`features/0-socle.feature`) ; « Léa voit une question du contrôle parental » (`features/10-…`).

Propositions retenues dans les scénarios `@a-valider` (questions du modèle) :
- prénom trop long **coupé** à 20 caractères, comme le legacy (modèle n°3) ;
- prénom vide **refusé avec un message**, écart voulu avec le legacy qui l'ignore sans rien dire (modèle n°7) ;
- deux profils du même parent **peuvent** avoir le même prénom, comme le legacy (modèle n°2) ;
- le premier profil se crée dans l'espace parent, où le parent arrive juste après sa connexion (décision n°2 du lot 1) ; Noisette y dit le texte d'accueil du legacy ; « + Ajouter un enfant » dans « Qui joue ? » demande le contrôle parental (modèle n°4) ;
- le profil en cours **n'est pas mémorisé** : à la réouverture, on repasse par « Qui joue ? », comme le legacy (modèle n°8).

Ce qui n'est pas vérifié en E2E mais par les tests unitaires du domaine (`@domain/famille`) : `NiveauInconnu` et `UniversInconnu` (l'interface ne propose que les 5 niveaux et les 6 univers), l'invariant « un ou deux parents », la date de création qui fixe l'ordre.

Droits d'accès (`@acces`) : les scénarios de la règle 6 vérifient les policies RLS de `profils_enfants` et `rattachements` (lecture et modification réservées aux parents rattachés, création par un parent connecté). Un profil auquel le parent n'est pas rattaché est présenté comme **introuvable**, sans dire s'il existe (`ParentNonRattache`, modèle).

## Hors périmètre

- Les réglages du profil enfant (mode dys, tout lire à voix haute, clavier des dictées…) : story #12. Le formulaire les garde repliés.
- Le rattachement d'un second parent par une invitation : story #13. Ici, le seul rattachement est celui du parent qui crée le profil.
- La suppression du profil et l'export des données du profil : story #14.
- Le contrôle parental lui-même (question, bonne et mauvaise réponse) : story #10. Ici, on vérifie seulement quand il est demandé.
- La proposition du test de départ après la création, et « Refaire le test de départ » : lot 4.
- Ce que devient la progression quand le niveau change (modèle n°5) : lot 4.
- La création ou la modification d'un profil hors ligne, puis sa synchronisation (modèle n°11) : lot 7. Seul le choix dans « Qui joue ? » est vérifié sans réseau.
- La reprise des profils existants du legacy (décision n°7 de la réécriture).

## Questions ouvertes

Les questions du modèle (`docs/stories/11/domain-model.md`, n°1 à 12) restent ouvertes et ne sont pas répétées ici. Les scénarios qui en dépendent sont tagués `@a-valider` : n°2 (même prénom), n°3 (prénom coupé), n°4 (premier profil et « + Ajouter un enfant »), n°7 (message du prénom vide), n°8 (profil en cours non mémorisé). Le n°10 (« Bonjour <prénom> ! » toujours dit) suit le legacy sans tag : le scénario ne règle pas « tout lire à voix haute ». Le n°1 (nombre maximal de profils) et le n°6 (caractères permis) n'ont encore aucun exemple écrit.

Nouvelles questions :

1. **Où arrive l'enfant après avoir choisi son profil ?** Le legacy dit « sur sa carte », mais « carte » est un synonyme interdit de **parcours**. L'écran d'arrivée est-il l'accueil « Aujourd'hui » du lot 4 (même question que la n°5 de la story #6) ? En attendant, les scénarios vérifient seulement l'univers, le personnage guide et l'en-tête.
2. **Après la création d'un profil**, en attendant le test de départ du lot 4, le parent reste-t-il dans l'espace parent (oui), ou l'application passe-t-elle directement à « Qui joue ? » (non) ? Les scénarios vérifient seulement que le profil apparaît dans « Qui joue ? ».
3. **Modification pendant que l'enfant joue sur un autre appareil** : si Paul change l'univers de Léa sur le téléphone pendant qu'elle joue sur la tablette, le changement s'applique-t-il tout de suite (oui) ou au prochain choix dans « Qui joue ? » (non) ? Aucun scénario écrit.
4. **Textes exacts** vus par le parent : prénom obligatoire (proposition du modèle n°7 : « Écris le prénom de l'enfant. ») et profil enfant introuvable. Les scénarios ne décrivent que le sens.
