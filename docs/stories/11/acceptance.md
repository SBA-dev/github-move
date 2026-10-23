# Critères d'acceptance : issue #11, Créer et modifier un profil enfant, et choisir qui joue

Scénarios : `features/11-profil-enfant.feature` (tag `@issue-11`).
Modèle du domaine : `docs/stories/11/domain-model.md` (contexte Famille).

## Objectif

En tant que **parent**, je veux créer le profil enfant de chacun de mes enfants (prénom, niveau, univers), afin que chacun joue dans son univers, à son niveau, et que je retrouve sa progression sur tous mes appareils.

Comportement actuel (`app/`) : `showHome`, `childForm`, `adultProfils`. Il donne les premiers exemples : prénom de 20 caractères au plus, espaces autour retirés ; niveau CP et univers « Animaux de la forêt » par défaut ; profils montrés dans l'ordre de création ; « Bonjour Léa ! » au choix d'un profil ; profil en cours non mémorisé ; deux profils peuvent avoir le même prénom.

Cette story remplace les **profils enfants préparés pour les tests** du lot 1 (décision n°2 du lot 1) : les scénarios partent de profils créés par un parent (« Paul a créé le profil enfant… », « Paul est rattaché au profil enfant… ») et l'enfant entre dans son univers en choisissant son profil dans « Qui joue ? ».

## Règles

| # | Règle | Scénarios |
|---|---|---|
| 1 | Le parent crée un profil enfant avec un prénom, un niveau et un univers, et le retrouve sur tous ses appareils | Paul crée le profil enfant de Léa · Sans autre choix, un nouveau profil enfant est de niveau CP, dans l'univers « Animaux de la forêt » · Le profil enfant peut être de niveau <niveau> (CP à CM2) · Un profil enfant créé sur la tablette se retrouve sur le téléphone · Le profil enfant ne demande que le prénom, le niveau et l'univers · Deux profils enfants du même parent peuvent avoir le même prénom · Il n'y a pas de nombre maximal de profils enfants |
| 2 | Le prénom est obligatoire, sans les espaces autour, et il est coupé à 20 caractères | Le prénom « <prénom> » (<cas>) est accepté tel quel (simple, 1 caractère, 20 caractères) · Les espaces autour du prénom sont retirés · Un prénom de plus de 20 caractères est coupé à 20 caractères · Un prénom vide est refusé avec un message · Un prénom fait seulement d'espaces est refusé avec un message |
| 3 | Le parent rattaché modifie le prénom, le niveau ou l'univers d'un profil enfant | Paul fait passer Léa du CE1 au CE2 · Après un changement d'univers, Léa joue avec le personnage guide de son nouvel univers · Paul corrige le prénom de Léa · Une modification faite sur la tablette se retrouve sur le téléphone · Vider le prénom d'un profil enfant est refusé, et le prénom d'avant reste |
| 4 | « Qui joue ? » montre les profils enfants du parent dans l'ordre de leur création, et l'enfant y choisit le sien pour jouer | Les profils enfants apparaissent dans l'ordre de leur création · Léa choisit son profil enfant et son personnage guide la salue · Léa choisit son profil enfant même sans réseau · À la réouverture de Savanturier, on repasse par « Qui joue ? » · « Qui joue ? » tient dans un écran de 360 px, avec des choix assez grands pour un doigt d'enfant |
| 5 | Créer et modifier un profil enfant passent par l'espace parent, choisir qui joue reste à la portée de l'enfant | Ajouter un enfant depuis « Qui joue ? » demande le contrôle parental (`@acces`) · En dehors de l'espace parent, la modification d'un profil enfant n'est pas proposée (`@acces`) · Choisir qui joue ne demande pas le contrôle parental (`@acces`) · Sans profil enfant, Noisette invite Paul à créer le premier dans l'espace parent |
| 6 | Un parent ne voit et ne modifie que les profils enfants auxquels il est rattaché | Le parent qui crée un profil enfant y est rattaché d'office (`@acces`) · Claire ne voit jamais dans « Qui joue ? » les profils enfants de la famille de Paul (`@acces`) · Dans l'espace parent, Claire ne voit pas le profil enfant de Léa (`@acces`) · Claire ne peut pas modifier le profil enfant de Léa, auquel elle n'est pas rattachée (`@acces`) · Sans connexion, personne ne peut créer de profil enfant (`@acces`) |

Total : 6 règles, 31 scénarios (37 cas exécutés avec les exemples des plans). Aucun scénario n'est encore `@a-valider`.

Étapes réutilisées : « Paul est connecté sur la tablette », « Paul est connecté sur la tablette et sur le téléphone », « Paul est dans l'espace parent », « Claire est connectée sur la tablette », « Claire ouvre l'espace parent », « Claire ne voit pas le profil enfant de Léa », « personne n'est connecté sur la tablette », « je suis invité à me connecter avec mon adresse e-mail », « aucun parent n'utilise l'adresse … », « Paul a demandé un lien de connexion pour … sur la tablette », « Paul suit le lien de connexion reçu », « il voit l'espace parent », « Savanturier a été fermé sur la tablette » (`features/5-…`) ; « elle voit <personnage guide> dans le paysage de l'univers « … » », « l'en-tête affiche « Léa · CE1 » », « l'en-tête n'affiche aucun prénom ni aucun niveau », « l'écran de l'appareil mesure 360 px de large » (`features/6-…`) ; « Savanturier a déjà été chargé une fois sur la tablette », « le réseau est coupé » (`features/8-…`) ; « j'ouvre Savanturier », « la page tient dans la largeur de l'écran » (`features/0-socle.feature`) ; « Léa voit une question du contrôle parental » (`features/10-…`).

Textes retenus : prénom obligatoire, « Écris le prénom de l'enfant. » ; accueil sans profil, celui du legacy (« Bonjour ! Pour commencer, crée le profil de l'enfant qui va jouer. Tu pourras en ajouter d'autres ensuite. »). Les scénarios disent « Paul est informé que le prénom de l'enfant est obligatoire », comme les autres stories ; la step definition vérifie ce texte.

Ce qui n'est pas vérifié en E2E mais par les tests unitaires du domaine (`@domain/famille`) : `NiveauInconnu` et `UniversInconnu` (l'interface ne propose que les 5 niveaux et les 6 univers), l'invariant « un ou deux parents », la date de création qui fixe l'ordre.

Droits d'accès (`@acces`) : les scénarios de la règle 6 vérifient les policies RLS de `profils_enfants` et `rattachements` (lecture et modification réservées aux parents rattachés, création par un parent connecté). Un profil auquel le parent n'est pas rattaché est présenté comme **introuvable**, sans dire s'il existe (`ParentNonRattache`, modèle). Les deux parents rattachés ont les mêmes droits de modification (décision n°1 du lot 2) ; leur cas est illustré dans la story #13.

## Hors périmètre

- Les réglages du profil enfant (mode dys, tout lire à voix haute, clavier des dictées…) : story #12. Le formulaire les garde repliés.
- Le rattachement d'un second parent par une invitation : story #13. Ici, le seul rattachement est celui du parent qui crée le profil.
- La suppression du profil et l'export des données du profil : story #14.
- Le contrôle parental lui-même (question, bonne et mauvaise réponse) : story #10. Ici, on vérifie seulement quand il est demandé.
- La proposition du test de départ après la création, et « Refaire le test de départ » : lot 4.
- **Changer de classe garde la progression** (décision n°7 du lot 2) : règle acquise, mais **pas vérifiable au lot 2**, qui n'a encore ni étoiles (lot 3) ni parcours (lot 4). Le scénario est à écrire au lot 4 (« Parcours libre et leçons des classes d'avant ») : par exemple, Léa a 2 étoiles à une leçon du CE1, Paul la fait passer en CE2, et elle retrouve ses 2 étoiles. Au lot 2, seul l'invariant du domaine (le changement de niveau ne retire rien) est couvert par les tests unitaires.
- La création ou la modification d'un profil hors ligne, puis sa synchronisation : lot 7 (question ouverte n°3). Seul le choix dans « Qui joue ? » est vérifié sans réseau.
- La reprise des profils existants du legacy (décision n°7 de la réécriture).

## Décisions

Validation n°1 du lot 2 par le PO, le 2026-10-22 (`docs/stories/lot-2-decisions.md`). « Tranchée » = réponse explicite du PO ; « proposition appliquée » = proposition déjà faite dans les scénarios ou le modèle.

| Question | Réponse | Effet sur les scénarios | Source |
|---|---|---|---|
| Même prénom pour deux profils (modèle M2) | Permis. | « Deux profils enfants du même parent peuvent avoir le même prénom » : tag `@a-valider` retiré. | Tranchée, décision n°6 |
| Prénom de plus de 20 caractères (M3) | Coupé à 20 caractères. | « Un prénom de plus de 20 caractères est coupé à 20 caractères » : tag retiré ; titre de la règle 2 ajusté. | Tranchée, décision n°6 |
| Prénom vide (M7) | Refusé avec un message, écart voulu avec le legacy. Texte : « Écris le prénom de l'enfant. » | Les trois scénarios du prénom vide : tags retirés. | Tranchée, décision n°6 ; texte : proposition appliquée |
| Nombre maximal de profils (M1) | Aucun. | Nouveau scénario « Il n'y a pas de nombre maximal de profils enfants ». | Tranchée, décision n°6 |
| Premier profil et « + Ajouter un enfant » (M4) | Le premier profil se crée dans l'espace parent, juste après la connexion ; « + Ajouter un enfant » demande le contrôle parental ; choisir qui joue reste libre. | « Ajouter un enfant depuis « Qui joue ? » demande le contrôle parental » et « Sans profil enfant, Noisette invite Paul… » : tags retirés. | Tranchée, décision n°5 |
| Profil en cours mémorisé (M8) | Non : « Qui joue ? » s'affiche à chaque ouverture. | « À la réouverture de Savanturier, on repasse par « Qui joue ? » » : tag retiré. | Tranchée, décision n°7 |
| Changer de classe (M5) | La progression est gardée. | Scénario renvoyé au lot 4 (voir Hors périmètre). | Tranchée, décision n°7 |
| « Bonjour <prénom> ! » à chaque choix (M10) | Oui, même sans « tout lire à voix haute ». | « Léa choisit son profil enfant et son personnage guide la salue » inchangé. | Proposition appliquée |
| Droits des deux parents | Les deux parents rattachés modifient le profil. | Aucun changement ici (story #13). | Tranchée, décision n°1 |

## Questions ouvertes

Aucune n'est bloquante. Numéros identiques à ceux de `docs/stories/11/domain-model.md`.

1. Quels **caractères** sont permis dans un prénom ou pseudo : lettres, accents, trait d'union, apostrophe, espaces (oui) ; chiffres, émojis (oui / non) ? Aucun scénario écrit.
2. « **Qui joue ?** » est-il un terme du glossaire (oui) ou un simple titre d'écran (non) ? Le titre exact reste-t-il « Qui joue aujourd'hui ? » ?
3. Au **lot 7**, faut-il pouvoir créer ou modifier un profil hors ligne, puis l'envoyer à la synchronisation (oui / non) ?
4. Le message « Les profils et la progression sont enregistrés dans ton compte… » de « Qui joue ? » : même question que la n°8 de la story #5, à trancher une seule fois.
5. **Où arrive l'enfant après avoir choisi son profil ?** « Carte » est un synonyme interdit de **parcours**. L'écran d'arrivée est-il l'accueil « Aujourd'hui » du lot 4 (même question que la n°5 de la story #6) ? En attendant, les scénarios vérifient seulement l'univers, le personnage guide et l'en-tête.
6. **Après la création d'un profil**, en attendant le test de départ du lot 4, le parent reste-t-il dans l'espace parent (oui), ou l'application passe-t-elle directement à « Qui joue ? » (non) ? Les scénarios vérifient seulement que le profil apparaît dans « Qui joue ? ».
7. Si Paul change l'univers de Léa sur le téléphone pendant qu'elle joue sur la tablette, le changement s'applique-t-il **tout de suite** (oui) ou au prochain choix dans « Qui joue ? » (non) ? Aucun scénario écrit.
8. Texte exact du **profil enfant introuvable** vu par le parent (par exemple « Ce profil enfant est introuvable. ») ? Le scénario ne décrit que le sens.
