# Critères d'acceptance : issue #72, Connexion du parent par adresse e-mail et mot de passe, sans envoi d'e-mail

Scénarios : `features/72-connexion-par-mot-de-passe.feature` (tags `@issue-72 @wip`, aucun `@envoi-email`).
Modèle du domaine : `docs/stories/72/domain-model.md` (contexte **Famille**). Décision : `docs/decisions/0019-connexion-par-mot-de-passe-sans-e-mail-dans-la-beta.md`.

## Objectif

En tant que **parent**, je veux m'inscrire puis me connecter avec mon adresse e-mail et un **mot de passe du parent**, sans attendre d'e-mail, afin de commencer à tester Savanturier tout de suite, avec ma propre adresse (par exemple Gmail). Pendant la beta, si j'oublie mon mot de passe du parent, je le **réinitialise** avec le prénom d'un des enfants qui me sont rattachés.

Comportement actuel (cible, #5) : un seul champ « Adresse e-mail » et le bouton « Recevoir un lien de connexion » ; avec une vraie adresse, la demande échoue sur le projet de développement (« Un souci est survenu. Réessaie dans un instant. »). Le legacy (`app/`) n'a pas d'écran de connexion : les exemples viennent de l'issue (pistes de critères, réponses du PO n°1 à 11) et du modèle.

Vocabulaire : les scénarios disent **mot de passe du parent**, **inscription** (« s'inscrit », interface « Créer ton compte »), **réinitialisation du mot de passe**, **essai de réinitialisation** (jamais « essai » seul), **blocage de la réinitialisation**, **connexion du parent**, **déconnexion**. Jamais « compte » dans une étape, sauf le nom d'écran « Créer ton compte ».

## Example mapping

| # | Règle | Exemples clés |
|---|---|---|
| 1 | Le parent s'inscrit avec son adresse e-mail et un mot de passe du parent, et il est connecté aussitôt, sans aucun e-mail | `paul@exemple.test` et `paul.savanturier@gmail.com` avec `Abcdefg%` → espace parent, aucun e-mail ; confirmation `Abcdefg!` ≠ `Abcdefg%` → refus ; adresse déjà utilisée → on propose de se connecter ; adresse vide, `paul`, `paul@exemple` → refus |
| 2 | Le mot de passe du parent respecte 4 règles, affichées pendant la saisie, et chacune passe au vert dès qu'elle est respectée | `abcdefgh` → 8 caractères et minuscule au vert ; `Abcdefgù` → caractère spécial à faire ; `Abcde%g` (7) → 8 caractères à faire ; `Abcdefg%`, `@`, `!`, `?`, `€` → 4 au vert, inscription réussie ; refus qui nomme la ou les règles manquantes |
| 3 | Le parent se connecte avec son adresse e-mail et son mot de passe du parent ; aucun lien de connexion n'est proposé dans la beta | connexion, déconnexion puis reconnexion ; `  Paul@Exemple.TEST  ` reconnu ; `Abcdefg!`, `abcdefg%`, adresse inconnue → « Adresse e-mail ou mot de passe incorrect », réessai possible ; plus de « Recevoir un lien de connexion » |
| 4 | Le parent qui a oublié son mot de passe du parent le réinitialise avec le prénom d'un enfant qui lui est rattaché (beta seulement), sans que rien ne révèle l'adresse ni le prénom attendu | « Léa », « lea », « LÉA », «   Léa   » → connecté ; « Tom », « Léane », « Lé », adresse inconnue, parent sans enfant → « Ces informations ne correspondent pas. » ; prénom de l'enfant d'un autre parent refusé |
| 5 | Après 5 essais de réinitialisation ratés pour une même adresse, la réinitialisation est bloquée une heure, même avec un prénom juste | 4 ratés puis bon prénom → réussi ; 5 ratés puis bon prénom → « Trop d'essais. Réessaie dans une heure. » ; 59 min → bloqué, 61 min → rouvert ; une réussite remet à zéro ; adresse inconnue bloquée aussi |
| 6 | Se connecter, s'inscrire et réinitialiser se font sur un écran de 360 px, au clavier, et le mot de passe saisi peut être affiché | 3 écrans à 360 px, cibles de 44 px ; connexion au clavier ; « Afficher le mot de passe » ; règle respectée signalée sans la couleur seule et annoncée au lecteur d'écran |

## Règles et scénarios

| # | Règle | Scénarios |
|---|---|---|
| 1 | Inscription du parent, connecté aussitôt, sans e-mail | Paul s'inscrit avec l'adresse « <adresse> » et arrive dans l'espace parent sans recevoir d'e-mail (adresse de test, Gmail) · Juste après l'inscription, Noisette invite Paul à créer le premier profil enfant, sans question du contrôle parental · La confirmation différente du mot de passe du parent est refusée · Une adresse déjà utilisée par un parent est refusée, et on propose de se connecter · À l'inscription, l'adresse « <adresse> » est refusée (vide, sans @, domaine sans point) |
| 2 | Les 4 règles du mot de passe du parent | Avant toute saisie, les 4 règles sont affichées, avec la liste des caractères spéciaux acceptés · En tapant « <saisie> » (<cas>), seules les règles respectées passent au vert (`abcdefgh`, `Abcdefgù`, `Abcde%g`, `ABCDEFG%`, `Abcdefg%`) · Avec le caractère spécial « <special> », les 4 règles sont au vert et l'inscription réussit (`%`, `@`, `!`, `?`, `€`) · Le mot de passe du parent « <saisie> » est refusé, et le message dit qu'il manque <manque> (5 exemples) |
| 3 | Connexion par mot de passe du parent, sans lien de connexion | L'écran de connexion demande l'adresse e-mail et le mot de passe du parent, sans proposer de lien de connexion · Paul se connecte avec son adresse et son mot de passe du parent, et l'espace parent s'ouvre sans question du contrôle parental · Paul se déconnecte, puis se reconnecte avec son mot de passe du parent · Les majuscules et les espaces autour de l'adresse ne changent pas le parent reconnu · Avec <cas>, la connexion est refusée sans dire si l'adresse existe (mauvais mot de passe, casse différente, adresse inconnue) · Après un mauvais mot de passe du parent, Paul se connecte avec le bon · Un mot de passe du parent vide est refusé avant toute vérification · Un parent connecté par mot de passe du parent ne voit jamais les profils enfants d'une autre famille (`@acces`) |
| 4 | Réinitialisation par prénom d'enfant rattaché | Paul réinitialise son mot de passe du parent avec le prénom « <prénom saisi> » et il est connecté (Léa, lea, LÉA) · Les espaces autour du prénom saisi sont ignorés · Le prénom de n'importe lequel de ses enfants suffit · Après la réinitialisation, l'ancien mot de passe du parent ne marche plus · Après la réinitialisation, Paul se reconnecte avec son nouveau mot de passe du parent · Le nouveau mot de passe du parent « <saisie> » est refusé, et le message dit qu'il manque <manque> · Au choix du nouveau mot de passe du parent, la liste des règles passe au vert pendant la saisie · Avec <cas>, le même message s'affiche et le prénom attendu n'est jamais dit (Tom, Léane, Lé, adresse inconnue) · Un parent sans aucun profil enfant ne peut pas réinitialiser son mot de passe du parent ainsi · Après un essai de réinitialisation raté, l'ancien mot de passe du parent marche toujours · Claire ne peut pas réinitialiser le mot de passe du parent de Paul avec le prénom de son propre enfant (`@acces`) · Claire ne peut pas réinitialiser son propre mot de passe du parent avec le prénom d'un enfant de Paul (`@acces`) · Un second parent réinitialise son mot de passe du parent avec le prénom d'un enfant auquel il est rattaché (`@acces @depend-de-13`) |
| 5 | Blocage de la réinitialisation | Au 6ᵉ essai de réinitialisation, même le bon prénom est refusé · Après 4 essais de réinitialisation ratés, le bon prénom marche encore · Le 5ᵉ essai de réinitialisation raté bloque aussitôt la réinitialisation · Une adresse qu'aucun parent n'utilise est bloquée de la même façon · 59 minutes après le 5ᵉ essai de réinitialisation raté, la réinitialisation est encore bloquée · 61 minutes après le 5ᵉ essai de réinitialisation raté, la réinitialisation est rouverte · Une réinitialisation réussie remet à zéro les essais de réinitialisation ratés · Le blocage de l'adresse de Paul ne bloque pas la réinitialisation de Claire (`@acces`) · Pendant le blocage de la réinitialisation, Paul peut encore se connecter avec son mot de passe du parent (`@a-valider`, question 4) |
| 6 | Accessibilité | L'écran « <écran> » tient dans un écran de 360 px, avec des cibles d'au moins 44 px (Se connecter, Créer ton compte, Mot de passe oublié) · Paul se connecte au clavier seulement · Le mot de passe du parent saisi est masqué tant que Paul ne demande pas à l'afficher · Paul affiche le mot de passe du parent qu'il vient de saisir · Une règle respectée se reconnaît sans la couleur et elle est annoncée au lecteur d'écran |

Total : 6 règles, 44 scénarios (69 cas exécutés avec les exemples).

Droits d'accès (`@acces`) : un parent connecté par mot de passe ne voit jamais les profils d'une autre famille (RLS, inchangé) ; le prénom d'un enfant ne vaut que pour un parent qui lui est rattaché, dans les deux sens (Claire avec l'adresse de Paul et le prénom de son enfant, Claire avec son adresse et le prénom de l'enfant de Paul) ; un second parent rattaché peut s'en servir (#13) ; le blocage d'une adresse ne touche pas une autre adresse. Aucun scénario ne vérifie un état de la base (essais de réinitialisation sans prénom, table sans policy) : c'est l'affaire des tests unitaires et de la review.

Étapes réutilisées : « aucun parent n'utilise l'adresse … », « Paul n'est pas connecté sur la tablette », « personne n'est connecté sur la tablette », « Paul s'est déconnecté de Savanturier sur la tablette », « … est connecté(e) sur la tablette », « il/elle n'est pas connecté(e) », « il voit l'espace parent(, sans aucun profil enfant) », « il est reconnu comme le parent … », « aucun e-mail n'est envoyé », « Paul est informé que l'adresse e-mail n'est pas valide » (`features/5-connexion-du-parent.feature`) ; « Paul est rattaché au profil enfant "Léa" de niveau CE1 », « Claire est rattachée au profil enfant "Tom" de niveau CM2 », « Marie est rattachée au profil enfant de Léa », « Claire ne voit pas le profil enfant de Léa », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », la phrase de Noisette (`features/11-profil-enfant.feature`) ; « aucune question du contrôle parental n'est posée » (`features/10-controle-parental.feature`).

À signaler à l'`e2e-tester` : l'étape existante « je suis invité à me connecter avec mon adresse e-mail » (#5, #11) vérifie sans doute le bouton « Recevoir un lien de connexion », qui disparaît. Sa formulation reste, son implémentation devra suivre le nouvel écran.

Données de test : adresses fictives en `@exemple.test`, sauf l'exemple Gmail voulu par le PO (question 3). Aucun e-mail n'est envoyé : aucun scénario ne porte `@envoi-email`.

## Scénarios existants qui deviennent hors beta

Proposition de tag : **`@hors-beta`** (à ajouter, pas à supprimer ; décision 0019 n°2). Les exécutions courantes et de non-régression l'excluent (`--grep-invert "@depend-de|@envoi-email|@hors-beta"`, à reporter dans le tableau des commandes de `CLAUDE.md`) ; #45 le retire en rétablissant l'e-mail.

Dans `features/5-connexion-du-parent.feature` :
- Règle 1 (lien de connexion) : « Paul demande un lien de connexion et le reçoit par e-mail avec un code de connexion », « Paul arrive dans l'espace parent en suivant le lien de connexion », « Les majuscules et les espaces autour de l'adresse ne changent pas le parent reconnu » (repris ici par mot de passe), « Une adresse jamais vue devient un nouveau parent dès son premier lien de connexion » (remplacé ici par l'inscription). **Reste** dans la beta : « Sans connexion, Savanturier invite d'abord le parent à se connecter ».
- Règle 2 (code de connexion) : ses 3 scénarios (« Paul saisit sur la tablette le code de connexion reçu », « Un code de connexion faux est refusé », « Refuser le code de connexion « <code> », qui n'a pas 6 chiffres »).
- Règle 3 (adresse mal formée avant tout envoi) : « Refuser l'adresse « <adresse> » » (sans `@envoi-email`, mais son action « demande un lien de connexion » n'existe plus à l'écran ; l'équivalent pour l'inscription est ici) et « Paul corrige son adresse après un refus ».
- Règle 4 (durée et usage unique) : ses 6 scénarios.
- Règle 5 : « Paul peut être connecté sur deux appareils à la fois » (il passe par un lien). **Reste** : « La connexion reste ouverte après la fermeture et la réouverture de Savanturier ».
- Règles 6 et 7 (déconnexion, accès) : **restent** toutes dans la beta (leurs étapes préparent un parent connecté sans e-mail).

Ailleurs (même tag proposé, pour l'orchestrateur) : `features/10-controle-parental.feature` « Juste après la connexion du parent, l'espace parent s'ouvre sans question du contrôle parental » (repris ici par mot de passe), `features/11-profil-enfant.feature` « Sans profil enfant, Noisette invite Paul à créer le premier dans l'espace parent » (repris ici après l'inscription), `features/13-invitation-second-parent.feature` le scénario où Marie « demande un lien de connexion » après le lien d'invitation (à réécrire par #13 avec l'inscription par mot de passe).

## Hors périmètre

- La réinitialisation par e-mail, le retour du lien de connexion et une limite d'essais de connexion : #45.
- La limite de demandes de Supabase Auth à la connexion (réponse n°4 du PO) : pas de scénario, elle n'est pas une règle de l'application.
- Le changement du mot de passe du parent quand il le connaît, depuis l'espace parent.
- L'inscription d'un second parent par le lien d'invitation : #13.
- L'export et la suppression des données du parent, dont ses essais de réinitialisation (questions n°13 et n°14 du modèle).
- Ce que l'application garde ou non (mot de passe, prénom saisi) : vérifié par les tests unitaires et la review, pas par un scénario (un `Alors` ne décrit pas la base).

## Questions ouvertes

Les miennes :

1. **Libellés des 4 règles** affichées : « 8 caractères », « une majuscule », « une minuscule », « un caractère spécial » (ceux de l'issue), ou une forme longue (« Au moins 8 caractères »…) ? Les scénarios utilisent la forme courte.
2. **Textes exacts** des messages non fixés par l'issue : règle manquante (proposé « Il manque : une majuscule. »), confirmation différente (proposé « Les deux mots de passe ne sont pas pareils. »), adresse déjà utilisée (avec l'invitation à se connecter), mot de passe du parent vide (proposé « Écris ton mot de passe. »), service indisponible. Les scénarios restent déclaratifs (« Paul est informé que… ») en attendant.
3. **Adresse Gmail dans les tests** : les données de test sont fictives (`@exemple.test`), mais le PO veut la preuve qu'une vraie adresse marche. Quelle adresse utiliser dans l'exemple « vraie adresse (Gmail) » (`paul.savanturier@gmail.com` provisoire, qui pourrait appartenir à quelqu'un) : une adresse du PO, un alias dédié, ou garder cette preuve en test manuel seulement ?
4. **Le blocage de la réinitialisation n'empêche pas la connexion** avec le bon mot de passe du parent (scénario `@a-valider`). Le glossaire dit « toute réinitialisation est refusée », rien sur la connexion. Confirmez-vous ? (oui / non)
5. **Service de connexion indisponible** : faut-il un scénario E2E (réseau coupé pendant l'inscription, la connexion ou la réinitialisation) avec le message « réessaie dans un instant », ou les tests unitaires de l'ACL suffisent-ils ? Aucun scénario écrit.
6. **Mode dys** sur les écrans « Se connecter », « Créer ton compte » et « Mot de passe oublié » : le mode dys est un réglage d'un profil enfant ; avant toute connexion, aucun profil n'est choisi. Ces écrans le suivent-ils (lequel ?), ou ne sont-ils pas concernés ? Aucun scénario écrit.
7. **« Mot de passe oublié » proposé où ?** Seulement sur l'écran « Se connecter » (scénario écrit), ou aussi dans le message « Adresse e-mail ou mot de passe incorrect » ?
8. **Tag des scénarios hors beta** : `@hors-beta` vous convient-il ? Faut-il l'exclure dans les commandes de `CLAUDE.md` dès cette story ?
9. **#13** : le scénario du second parent porte `@depend-de-13`. Si #13 est déjà livrée sur `main`, le tag est à retirer.

Questions du modèle (`docs/stories/72/domain-model.md`) dont dépend un scénario :

- **n°1** (Inscription du parent) : les étapes disent « s'inscrit » / « son inscription » et l'écran « Créer ton compte ». À reformuler si le terme change.
- **n°3** (majuscule accentuée), **n°5** (chiffres et autres signes permis), **n°6** (espaces autour du mot de passe) : aucun exemple ne les touche. Les mots de passe des scénarios n'ont ni chiffre, ni `É`, ni espace (d'où `Noisette#`, `Claire#ok`).
- **n°7** (confirmation à la réinitialisation) : les étapes de réinitialisation n'ont pas de confirmation ; à ajouter si la réponse est oui.
- **n°8** (tirets et espaces dans le prénom) : seuls la casse, les accents et les espaces autour sont illustrés.
- **n°9** (réinitialisation en une ou deux étapes) : l'action « réinitialise le mot de passe du parent de … avec le prénom … et le nouveau mot de passe du parent … » est volontairement d'un seul tenant ; elle reste juste dans les deux cas. Si la réponse est oui, un scénario « le prénom est vérifié avant le choix du nouveau mot de passe » s'ajoute.
- **n°10** (prénom vide sans compter un essai) : aucun scénario écrit.
- **n°11** et **n°12** (prolongation du blocage, oubli des ratés) : aucun scénario ; les scénarios 59 / 61 minutes supposent que le blocage finit 1 heure après le 5ᵉ raté.
- **n°15** (texte fixe « Réessaie dans une heure ») : les scénarios supposent le texte fixe.
- **n°16** (« essai de réinitialisation », jamais « essai » seul) : appliqué partout.
- **n°17** (autres appareils après une réinitialisation) : aucun scénario écrit.
