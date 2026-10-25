# Critères d'acceptance : issue #72, Connexion du parent par adresse e-mail et mot de passe, sans envoi d'e-mail

Scénarios : `features/72-connexion-par-mot-de-passe.feature` (tags `@issue-72 @wip`, `@wip` retiré par l'`e2e-tester` à la livraison ; aucun `@envoi-email`).
Modèle du domaine : `docs/stories/72/domain-model.md` (contexte **Famille**). Décision : `docs/decisions/0019-connexion-par-mot-de-passe-sans-e-mail-dans-la-beta.md`.

## Objectif

En tant que **parent**, je veux m'inscrire puis me connecter avec mon adresse e-mail et un **mot de passe du parent**, sans attendre d'e-mail, afin de commencer à tester Savanturier tout de suite, avec ma propre adresse. Pendant la beta, si j'oublie mon mot de passe du parent, je le **réinitialise** avec le prénom d'un des enfants qui me sont rattachés.

Comportement actuel (cible, #5) : un seul champ « Adresse e-mail » et le bouton « Recevoir un lien de connexion » ; avec une vraie adresse, la demande échoue sur le projet de développement (« Un souci est survenu. Réessaie dans un instant. »). Le legacy (`app/`) n'a pas d'écran de connexion : les exemples viennent de l'issue (pistes de critères, réponses du PO n°1 à 11) et du modèle.

Vocabulaire : les scénarios disent **mot de passe du parent**, **inscription** (« s'inscrit », interface « Créer ton compte »), **réinitialisation du mot de passe**, **essai de réinitialisation** (jamais « essai » seul), **blocage de la réinitialisation**, **connexion du parent**, **déconnexion**. Jamais « compte » dans une étape, sauf le nom d'écran « Créer ton compte ».

## Example mapping

| # | Règle | Exemples clés |
|---|---|---|
| 1 | Le parent s'inscrit avec son adresse e-mail et un mot de passe du parent, et il est connecté aussitôt, sans aucun e-mail | `paul@exemple.test` avec `Abcdefg%` → espace parent, aucun e-mail ; confirmation `Abcdefg!` ≠ `Abcdefg%` → refus ; adresse déjà utilisée → on propose de se connecter ; adresse vide, `paul`, `paul@exemple` → refus |
| 2 | Le mot de passe du parent respecte 4 règles, affichées pendant la saisie, et chacune passe au vert dès qu'elle est respectée | `abcdefgh` → 8 caractères et minuscule au vert ; `Abcdefgù` → caractère spécial à faire ; `Écolier%` → É compte comme majuscule ; `Abcdef1-` → chiffre et tiret permis, pas spéciaux ; `Abcde%g` (7) → 8 caractères à faire ; `Abcdefg%`, `@`, `!`, `?`, `€` → 4 au vert, inscription réussie ; `Paul-2024_*.!` accepté ; 64 caractères accepté, 65 refusé ; refus qui nomme la ou les règles manquantes |
| 3 | Le parent se connecte avec son adresse e-mail et son mot de passe du parent ; aucun lien de connexion n'est proposé dans la beta | connexion, déconnexion puis reconnexion ; `  Paul@Exemple.TEST  ` reconnu ; `Abcdefg!`, `abcdefg%`, adresse inconnue → « Adresse e-mail ou mot de passe incorrect », réessai possible, « Mot de passe oublié » proposé sous le message ; inscrit avec ` Abcdefg% `, `Abcdefg%` refusé ; plus de « Recevoir un lien de connexion » |
| 4 | Le parent qui a oublié son mot de passe du parent le réinitialise avec le prénom d'un enfant qui lui est rattaché (beta seulement), sans que rien ne révèle l'adresse ni le prénom attendu | « Léa », « lea », « LÉA », «   Léa   » → connecté ; confirmation différente → refus ; « Tom », « Léane », « Lé », adresse inconnue, parent sans enfant → « Ces informations ne correspondent pas. » ; « Marie Lou », « MarieLou » pour « Marie-Lou » → refus ; prénom vide, adresse `paul@exemple` → refus immédiat, sans compter d'essai de réinitialisation raté ; prénom de l'enfant d'un autre parent refusé ; le téléphone de Paul est déconnecté après la réinitialisation |
| 5 | Après 5 essais de réinitialisation ratés pour une même adresse, la réinitialisation est bloquée une heure, même avec un prénom juste | 4 ratés puis bon prénom → réussi ; 5 ratés puis bon prénom → « Trop d'essais. Réessaie dans une heure. » ; 59 min → bloqué, 61 min → rouvert ; un essai pendant le blocage ne le prolonge pas ; 4 ratés il y a 23 h comptent, il y a 25 h sont oubliés ; une réussite remet à zéro ; adresse inconnue bloquée aussi ; la connexion par mot de passe reste possible |
| 6 | Se connecter, s'inscrire et réinitialiser se font sur un écran de 360 px, au clavier, et le mot de passe saisi peut être affiché | 3 écrans à 360 px, cibles de 44 px ; connexion au clavier ; « Afficher le mot de passe » ; règle respectée signalée sans la couleur seule et annoncée au lecteur d'écran |

## Règles et scénarios

| # | Règle | Scénarios |
|---|---|---|
| 1 | Inscription du parent, connecté aussitôt, sans e-mail | Paul s'inscrit et arrive dans l'espace parent sans recevoir d'e-mail · Juste après l'inscription, Noisette invite Paul à créer le premier profil enfant, sans question du contrôle parental · La confirmation différente du mot de passe du parent est refusée · Une adresse déjà utilisée par un parent est refusée, et on propose de se connecter · À l'inscription, l'adresse « <adresse> » est refusée (vide, sans @, domaine sans point) |
| 2 | Les 4 règles du mot de passe du parent | Avant toute saisie, les 4 règles sont affichées, avec la liste des caractères spéciaux acceptés · En tapant « <saisie> » (<cas>), seules les règles respectées passent au vert (`abcdefgh`, `Abcdefgù`, `Abcde%g`, `ABCDEFG%`, `Écolier%`, `Abcdef1-`, `Abcdefg%`) · Avec le caractère spécial « <special> », les 4 règles sont au vert et l'inscription réussit (`%`, `@`, `!`, `?`, `€`) · Le mot de passe du parent « <saisie> » est refusé, et le message dit qu'il manque <manque> (6 exemples) · Les chiffres et les signes « * - _ . » sont permis à côté d'un caractère spécial · Un mot de passe du parent de 64 caractères est accepté · Un mot de passe du parent de 65 caractères est refusé |
| 3 | Connexion par mot de passe du parent, sans lien de connexion | L'écran de connexion demande l'adresse e-mail et le mot de passe du parent, sans proposer de lien de connexion · Paul se connecte avec son adresse et son mot de passe du parent, et l'espace parent s'ouvre sans question du contrôle parental · Paul se déconnecte, puis se reconnecte avec son mot de passe du parent · Les majuscules et les espaces autour de l'adresse ne changent pas le parent reconnu · Avec <cas>, la connexion est refusée sans dire si l'adresse existe (mauvais mot de passe, casse différente, adresse inconnue ; « Mot de passe oublié » proposé sous le message) · Les espaces au début et à la fin du mot de passe du parent en font partie · Après un mauvais mot de passe du parent, Paul se connecte avec le bon · Un mot de passe du parent vide est refusé avant toute vérification · Un parent connecté par mot de passe du parent ne voit jamais les profils enfants d'une autre famille (`@acces`) |
| 4 | Réinitialisation par prénom d'enfant rattaché | Paul réinitialise son mot de passe du parent avec le prénom « <prénom saisi> » et il est connecté (Léa, lea, LÉA) · Les espaces autour du prénom saisi sont ignorés · Le prénom de n'importe lequel de ses enfants suffit · Après la réinitialisation, l'ancien mot de passe du parent ne marche plus · Après la réinitialisation, Paul se reconnecte avec son nouveau mot de passe du parent · Le nouveau mot de passe du parent « <saisie> » est refusé, et le message dit qu'il manque <manque> · À la réinitialisation, une confirmation différente du nouveau mot de passe du parent est refusée · Au choix du nouveau mot de passe du parent, la liste des règles passe au vert pendant la saisie · Avec <cas>, le même message s'affiche et le prénom attendu n'est jamais dit (Tom, Léane, Lé, adresse inconnue) · Le prénom « <prénom> » ne correspond pas au profil enfant « Marie-Lou » (<cas>) · À la réinitialisation, <cas> est refusé tout de suite (prénom vide, adresse mal formée) · Un prénom vide ne compte pas comme un essai de réinitialisation raté · Un parent sans aucun profil enfant ne peut pas réinitialiser son mot de passe du parent ainsi · Après un essai de réinitialisation raté, l'ancien mot de passe du parent marche toujours · Claire ne peut pas réinitialiser le mot de passe du parent de Paul avec le prénom de son propre enfant (`@acces`) · Claire ne peut pas réinitialiser son propre mot de passe du parent avec le prénom d'un enfant de Paul (`@acces`) · Un second parent réinitialise son mot de passe du parent avec le prénom d'un enfant auquel il est rattaché (`@acces @depend-de-13`) · Après une réinitialisation, Paul n'est plus connecté sur ses autres appareils (`@acces`) |
| 5 | Blocage de la réinitialisation | Au 6ᵉ essai de réinitialisation, même le bon prénom est refusé · Après 4 essais de réinitialisation ratés, le bon prénom marche encore · Le 5ᵉ essai de réinitialisation raté bloque aussitôt la réinitialisation · Une adresse qu'aucun parent n'utilise est bloquée de la même façon · 59 minutes après le 5ᵉ essai de réinitialisation raté, la réinitialisation est encore bloquée · 61 minutes après le 5ᵉ essai de réinitialisation raté, la réinitialisation est rouverte · Un essai de réinitialisation pendant le blocage ne prolonge pas le blocage · 4 essais de réinitialisation ratés il y a <âge> <effet> (23 heures, 25 heures) · Une réinitialisation réussie remet à zéro les essais de réinitialisation ratés · Le blocage de l'adresse de Paul ne bloque pas la réinitialisation de Claire (`@acces`) · Pendant le blocage de la réinitialisation, Paul peut encore se connecter avec son mot de passe du parent |
| 6 | Accessibilité | L'écran « <écran> » tient dans un écran de 360 px, avec des cibles d'au moins 44 px (Se connecter, Créer ton compte, Mot de passe oublié) · Paul se connecte au clavier seulement · Le mot de passe du parent saisi est masqué tant que Paul ne demande pas à l'afficher · Paul affiche le mot de passe du parent qu'il vient de saisir · Une règle respectée se reconnaît sans la couleur et elle est annoncée au lecteur d'écran |

Total : 6 règles, 55 scénarios (85 cas exécutés avec les exemples). Aucun `@a-valider`.

Droits d'accès (`@acces`) : un parent connecté par mot de passe ne voit jamais les profils d'une autre famille (RLS, inchangé) ; le prénom d'un enfant ne vaut que pour un parent qui lui est rattaché, dans les deux sens (Claire avec l'adresse de Paul et le prénom de son enfant, Claire avec son adresse et le prénom de l'enfant de Paul) ; un second parent rattaché peut s'en servir (#13) ; le blocage d'une adresse ne touche pas une autre adresse ; après une réinitialisation, les autres appareils du parent sont déconnectés. Aucun scénario ne vérifie un état de la base (essais de réinitialisation sans prénom, durée de conservation de 24 h, table sans policy, inscriptions directes fermées) : c'est l'affaire des tests unitaires et de la review.

Étapes réutilisées : « aucun parent n'utilise l'adresse … », « Paul n'est pas connecté sur la tablette », « personne n'est connecté sur la tablette », « Paul s'est déconnecté de Savanturier sur la tablette », « … est connecté(e) sur la tablette », « il/elle n'est pas connecté(e) », « Paul est connecté sur le téléphone », « Paul n'est plus connecté sur … », « il voit l'espace parent(, sans aucun profil enfant) », « il est reconnu comme le parent … », « aucun e-mail n'est envoyé », « Paul est informé que l'adresse e-mail n'est pas valide » (`features/5-connexion-du-parent.feature`) ; « Paul est rattaché au profil enfant "Léa" de niveau CE1 », « Claire est rattachée au profil enfant "Tom" de niveau CM2 », « Marie est rattachée au profil enfant de Léa », « Claire ne voit pas le profil enfant de Léa », « l'écran de l'appareil mesure 360 px de large », « la page tient dans la largeur de l'écran », la phrase de Noisette (`features/11-profil-enfant.feature`) ; « aucune question du contrôle parental n'est posée » (`features/10-controle-parental.feature`).

Nouvelles étapes à signaler à l'`e2e-tester` : l'action de réinitialisation porte désormais la confirmation (« … avec le prénom "…", le nouveau mot de passe du parent "…" et la confirmation "…" ») ; « s'inscrit avec "…" et un mot de passe du parent de <n> caractères qui respecte les 4 règles » ; « « Mot de passe oublié » lui est proposé sous le message » ; « Paul est informé que le mot de passe du parent ne doit pas dépasser 64 caractères » ; « Paul est informé que le prénom est obligatoire » ; « la réinitialisation pour "…" a ensuite été refusée à Paul pour un prénom vide » ; « Paul a refait un essai de réinitialisation pour "…" pendant le blocage, il y a 30 minutes » ; « Paul a raté 4 essais de réinitialisation pour "…", tous il y a <âge> ». Les étapes avec une durée (59 / 61 minutes, 23 / 25 heures) demandent de régler l'horloge des essais de réinitialisation. L'étape existante « je suis invité à me connecter avec mon adresse e-mail » (#5, #11) vérifie sans doute le bouton « Recevoir un lien de connexion », qui disparaît. Sa formulation reste, son implémentation devra suivre le nouvel écran.

Données de test : uniquement des adresses fictives en `@exemple.test` (réponse n°20). La preuve qu'une vraie adresse (Gmail) fonctionne est faite **à la main par le PO**, hors des tests automatisés. Aucun e-mail n'est envoyé : aucun scénario ne porte `@envoi-email`.

## Scénarios existants qui deviennent hors beta

Tag **`@hors-beta`**, posé dès cette story (réponse n°19), sans changer le texte des scénarios (19 scénarios, 28 cas). Les commandes E2E du tableau de `CLAUDE.md` l'excluent (`--grep-invert "@depend-de|@envoi-email|@hors-beta"`) : `bddgen --tags` génère encore ces scénarios, c'est `--grep-invert` qui les écarte. Tous les scénarios `@envoi-email` sont aussi `@hors-beta` : la commande `--grep @envoi-email` ne sert plus avant #45, qui retire ce tag en rétablissant l'e-mail.

Dans `features/5-connexion-du-parent.feature` :
- Règle 1 (lien de connexion) : « Paul demande un lien de connexion et le reçoit par e-mail avec un code de connexion », « Paul arrive dans l'espace parent en suivant le lien de connexion », « Les majuscules et les espaces autour de l'adresse ne changent pas le parent reconnu » (repris ici par mot de passe), « Une adresse jamais vue devient un nouveau parent dès son premier lien de connexion » (remplacé ici par l'inscription). **Reste** dans la beta : « Sans connexion, Savanturier invite d'abord le parent à se connecter ».
- Règle 2 (code de connexion) : ses 3 scénarios (« Paul saisit sur la tablette le code de connexion reçu », « Un code de connexion faux est refusé », « Refuser le code de connexion « <code> », qui n'a pas 6 chiffres »).
- Règle 3 (adresse mal formée avant tout envoi) : « Refuser l'adresse « <adresse> » » (sans `@envoi-email`, mais son action « demande un lien de connexion » n'existe plus à l'écran ; l'équivalent pour l'inscription est ici) et « Paul corrige son adresse après un refus ».
- Règle 4 (durée et usage unique) : ses 6 scénarios.
- Règle 5 : « Paul peut être connecté sur deux appareils à la fois » (il passe par un lien). **Reste** : « La connexion reste ouverte après la fermeture et la réouverture de Savanturier ».
- Règles 6 et 7 (déconnexion, accès) : **restent** toutes dans la beta (leurs étapes préparent un parent connecté sans e-mail).

Ailleurs (même tag posé) : `features/10-controle-parental.feature` « Juste après la connexion du parent, l'espace parent s'ouvre sans question du contrôle parental » (repris ici par mot de passe), `features/11-profil-enfant.feature` « Sans profil enfant, Noisette invite Paul à créer le premier dans l'espace parent » (repris ici après l'inscription), `features/13-invitation-second-parent.feature` le scénario où Marie « demande un lien de connexion » après le lien d'invitation (à réécrire par #13 avec l'inscription par mot de passe).

## Hors périmètre

- La réinitialisation par e-mail, le retour du lien de connexion et une limite d'essais de connexion : #45.
- La limite de demandes de Supabase Auth à la connexion (réponse n°4 du PO) : pas de scénario, elle n'est pas une règle de l'application.
- Le changement du mot de passe du parent quand il le connaît, depuis l'espace parent.
- L'inscription d'un second parent par le lien d'invitation : #13.
- L'export et la suppression des données du parent, dont ses essais de réinitialisation (questions n°13 et n°14 du modèle).
- Ce que l'application garde ou non (mot de passe, prénom saisi) : vérifié par les tests unitaires et la review, pas par un scénario (un `Alors` ne décrit pas la base).

## Questions ouvertes

1. **Confirmation différente ou nouveau mot de passe du parent qui ne respecte pas les 4 règles, à la réinitialisation** : ces refus comptent-ils comme un essai de réinitialisation raté ? Proposition : non (comme le prénom vide, réponse n°9), car ils ne disent rien sur le prénom. Aucun scénario ne le fixe.
2. **Prénom fait seulement d'espaces** à la réinitialisation : traité comme un prénom vide (refusé sans compter d'essai de réinitialisation raté) ? Proposition : oui, puisque les espaces autour du prénom sont ignorés. Aucun scénario écrit.

## Décisions

Validation n°1 du PO (« OK aux propositions », 2026-10-24, détail dans `journal.md`) :

| # | Question | Réponse | Effet sur les scénarios |
|---|---|---|---|
| 1 | Majuscule accentuée | Compte comme majuscule | Exemple `Écolier%` |
| 2 | Chiffres et autres signes | Chiffres et `* - _ .` permis, sans compter comme caractère spécial | Exemples `Abcdef1-`, `Abc1*-_.` ; scénario « Les chiffres et les signes « * - _ . » sont permis… » |
| 3 | Longueur maximale | 64 caractères | Scénarios 64 accepté / 65 refusé |
| 4 | Espaces au début et à la fin du mot de passe du parent | Gardés tels quels | Scénario « Les espaces au début et à la fin du mot de passe du parent en font partie » |
| 5 | Libellés des 4 règles | Forme courte (« 8 caractères », « une majuscule », « une minuscule », « un caractère spécial ») | Inchangé |
| 6 | Inscription | Par une fonction serveur ; inscriptions directes fermées | Aucun scénario (pas d'effet visible) ; vérifié par les tests et la review |
| 7 | Confirmation à la réinitialisation | Oui | Confirmation ajoutée à toutes les actions de réinitialisation ; scénario de confirmation différente |
| 8 | Tirets, espaces internes, ligatures dans le prénom | Pas de normalisation | Plan « Marie-Lou » (« Marie Lou », « MarieLou » refusés) |
| 9 | Prénom vide, adresse mal formée | Refusés sans compter d'essai de réinitialisation raté | Plan « refusé tout de suite » ; scénario « Un prénom vide ne compte pas… » |
| 10 | Essai pendant le blocage | Ne prolonge pas le blocage | Scénario « Un essai de réinitialisation pendant le blocage ne prolonge pas le blocage » |
| 11 | Oubli d'un raté | Après 24 h | Plan 23 h / 25 h |
| 12 | Conservation des essais | 24 h après le dernier | Aucun scénario (état de la base) |
| 13 | Autres appareils après une réinitialisation | Déconnectés | Scénario `@acces` « Après une réinitialisation, Paul n'est plus connecté sur ses autres appareils » |
| 14 | Blocage et connexion | Le blocage n'empêche pas la connexion avec le bon mot de passe du parent | `@a-valider` retiré |
| 15 | Message de blocage | Fixe : « Trop d'essais. Réessaie dans une heure. » | Inchangé |
| 16 | Où proposer « Mot de passe oublié » | Sur l'écran de connexion et sous « Adresse e-mail ou mot de passe incorrect » | Étape ajoutée au plan de refus de connexion |
| 17 | Terme | « s'inscrit » dans les étapes, écran « Créer ton compte » | Inchangé |
| 18 | Terme | Toujours « essai de réinitialisation » | Inchangé |
| 19 | Tag des scénarios hors beta | `@hors-beta` dès cette story, exclu des commandes de `CLAUDE.md` | Tag posé dans #5, #10, #11, #13 ; commandes mises à jour |
| 20 | Données de test | `@exemple.test` seulement ; preuve Gmail manuelle par le PO | Exemple Gmail retiré |
| 21 | Service indisponible | Pas de scénario E2E | Aucun |
| 22 | Mode dys sur les écrans de connexion | Non concernés | Aucun |

Le tag `@depend-de-13` reste sur le scénario du second parent tant que #13 n'est pas livrée sur `main`.
