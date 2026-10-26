# Critères d'acceptance : issue #45, mise en ligne de Savanturier

Scénarios : `features/45-mise-en-ligne.feature` (tags `@issue-45 @wip`).
Modèle : `docs/stories/45/domain-model.md` (P1 à P12 : ce que fait le PO ; C1 à C19 : ce que code une équipe ; décisions 45.1 à 45.22).
Story transverse d'infrastructure : aucun agrégat, aucune règle du domaine pédagogique. Cadrage du 2026-10-25, sans code.

**État : validé par le PO le 2026-10-25** (voir « Décisions »). Beta sur l'adresse gratuite d'alwaysdata, Supabase Free en Irlande (`eu-west-1`), sauvegarde manuelle avant chaque publication.

## Objectif

En tant que **parent**, je veux ouvrir Savanturier à une adresse stable pendant toute la beta (l'adresse gratuite d'alwaysdata) et l'installer sur mes appareils, afin que mes enfants l'utilisent tous les jours, avec des données gardées dans l'UE et sans aucun traceur.

En tant qu'**équipe**, je veux une procédure de publication écrite et répétable, afin de publier une nouvelle version sans casser l'application d'une famille.

Comportement actuel (`app/`) : artifact claude.ai, sans adresse à nous, polices chargées chez Google Fonts. Il ne donne aucun exemple à reprendre : ce qu'il fait (Google Fonts, données gardées par claude.ai) est justement ce que la cible écarte.

## Trois sortes de vérification

Seul ce que voit le parent ou l'enfant est écrit en Gherkin. Le reste est vérifié par un script, ou à la main par le PO. Les trois sortes sont exigées pour la mise en ligne de 45a.

### 1. Scénarios automatisés (E2E Playwright)

| # | Règle | Scénarios | Où ils tournent |
|---|---|---|---|
| 1 | À l'adresse de production, Savanturier s'ouvre en connexion sécurisée et s'installe comme une application | Savanturier s'ouvre à l'adresse de production, en connexion sécurisée · L'adresse de production sans connexion sécurisée mène à la même adresse sécurisée (45.23) · À l'adresse de production, le navigateur propose d'installer Savanturier · Après un premier chargement à l'adresse de production, Savanturier s'ouvre sans réseau · À l'adresse de production, une adresse inconnue mène à Savanturier | `@production` |
| 2 | En se connectant et en jouant une séance, le navigateur ne contacte aucun autre site que Savanturier | La connexion du parent ne contacte aucun autre site que Savanturier · Une séance terminée ne contacte aucun autre site que Savanturier · Avec le mode dys, aucune police n'est chargée depuis un autre site · À l'adresse de production, la connexion du parent ne contacte aucun autre site que Savanturier (45.18, 45.24) · À l'adresse de production, une séance terminée ne contacte aucun autre site que Savanturier (45.18, 45.24) | courantes (3 premiers), `@production` (2 derniers) |
| 3 | La politique de confidentialité et les mentions légales se lisent sans connexion, depuis l'écran de connexion et depuis l'espace parent | Sans connexion, Paul lit la politique de confidentialité depuis l'écran de connexion · Sans connexion, Paul lit les mentions légales depuis l'écran de connexion (45.9) · Depuis l'espace parent, Paul lit la politique de confidentialité (45.25) · La politique de confidentialité donne le délai de traitement d'une demande de suppression des données (45.15) · Sur les pages légales, le personnage guide ne lit rien de lui-même (45.26) · La page « <page> » tient dans la largeur d'un téléphone de 360 px (2 exemples) · À l'adresse de production, la politique de confidentialité se lit sans connexion | courantes, sauf le dernier (`@production`) |
| 4 | Avec le mode dys, le texte s'affiche vraiment en police Andika, servie par Savanturier, même sans réseau | Avec le mode dys, l'étape de leçon s'affiche dans la police Andika chargée par Savanturier (45.6) · Sans réseau, le mode dys garde la police Andika (45.6) | courantes ; `@pwa` pour le second |
| 5 | En production, un parent ne voit que les profils enfants auxquels il est rattaché, et personne ne voit rien sans connexion (`@acces`) | À l'adresse de production, sans connexion, aucun profil enfant n'est visible · À l'adresse de production, le parent de test ne voit que son propre profil enfant (45.18, 45.24) | `@production` |

Total : 5 règles, 21 scénarios (22 cas exécutés avec les exemples du plan) : 11 dans les exécutions courantes ou `@pwa`, 10 `@production`. Tous relèvent de **45a**.

Précisions sur les exemples :
- **« Savanturier », dans « aucun autre site que Savanturier »**, désigne exactement deux origines : celle du front (adresse de production chez alwaysdata, ou `http://localhost:5173` dans les exécutions courantes) et celle du projet Supabase visé par le build (`VITE_SUPABASE_URL` : production, ou `savanturier-dev`). Toute autre origine fait échouer le scénario : Google Fonts, CDN, service d'analyse, traceur. Les adresses `data:` et `blob:` ne sont pas des sites.
- **Règle 2, cas limites** : la connexion (aucune donnée encore chargée) et la fin d'une séance (l'envoi de la séance terminée appelle une Edge Function) sont les deux moments où le front parle au serveur ; le mode dys est celui qui charge une police.
- **Règle 1** : l'installation et le hors réseau sont déjà vérifiés par #8 sur le build de production (`localhost`). #45 les **rejoue sur l'adresse de production**, parce que le service worker et l'installation dépendent de HTTPS et des en-têtes d'alwaysdata, que #8 ne peut pas voir. Le scénario de l'adresse inconnue vérifie le renvoi vers `index.html` (décision 0021) chez alwaysdata. L'adresse de production est l'adresse gratuite d'alwaysdata (45.2) ; les étapes ne l'écrivent jamais, elle est lue dans l'environnement : le jour où un domaine est acheté (45b), seuls l'environnement et la configuration d'alwaysdata changent, pas les scénarios.
- **Règle 3** : la politique de confidentialité doit donner le moyen de faire une demande de suppression des données (commentaire du PO du 2026-10-25). Le texte vient du PO (P6, P7) ; les scénarios vérifient la présence de l'adresse de contact, du délai (7 jours, 45.15), de l'éditeur et de l'hébergeur (alwaysdata), pas la rédaction. Le scénario du personnage guide reprend l'étape de #73 « Paul n'entend aucune voix » (45.26) : les pages légales s'ajoutent aux écrans du parent de #73.
- **Règle 4** : Andika est chargée par `@fontsource/andika` depuis #12. Le scénario de #45 vérifie qu'elle est bien **chargée** et **utilisée** (par exemple par l'API des polices du navigateur), et non seulement nommée dans le style (par exemple par l'API des polices du navigateur), et non seulement son nom dans le style.
- **Règle 5** (`@acces`) : la RLS elle-même est vérifiée par le script de la section 2 sur toutes les tables ; les deux scénarios vérifient ce que voit un visiteur et le parent de test en production, où de vraies familles existent.

Ce que #45 rejoue sans nouveau scénario : la règle 4 de #8 (« Une nouvelle version s'applique au lancement suivant ») tourne sur le build de production avec les tests PWA ; sur l'adresse de production, elle est vérifiée par l'en-tête `no-cache` de `sw.js` et `index.html` (section 2) puis à la main sur la tablette (section 3). La connexion sans aucun e-mail de la beta reste couverte par #72.

#### Où tournent les scénarios

| Tag | Où | Données | Quand |
|---|---|---|---|
| aucun (ni `@production` ni `@pwa`) | configuration principale (`playwright.config.ts`), serveur de dev, contre `savanturier-dev` | préparées et nettoyées par les tests (`service_role` de dev, comme aujourd'hui) | exécutions courantes, non-régression |
| `@pwa` | `playwright.pwa.config.ts` (build de production sur `localhost`), dont le filtre s'élargit à `features/45-*.feature` avec `@pwa` | idem | tests PWA |
| `@production` | une configuration à part (par exemple `playwright.production.config.ts`), dont l'adresse de base est l'adresse de production (adresse gratuite d'alwaysdata), lue dans l'environnement, sur les projets `tablette` et `telephone` (45.30), depuis le conteneur (45.29) | **aucune préparation ni aucun nettoyage** : seuls le parent de test de la production et son profil « Pilote », créés une fois à la main par le PO (45.18, 45.24). Identifiants lus dans l'environnement, jamais commités. La configuration refuse de démarrer si `SUPABASE_SERVICE_ROLE_KEY` est présente | après chaque publication, étape « contrôles après publication » de la procédure |

Les scénarios `@production` **ne doivent jamais tourner dans les exécutions courantes** : ils viseraient `localhost` et `savanturier-dev` avec des étapes faites pour la production, et une exécution courante ne doit jamais écrire en production (C13). La configuration principale les exclut donc d'elle-même (filtre `not @production and not @pwa` dans `defineBddConfig`, comme `playwright.pwa.config.ts` exclut déjà `@acces`) : les commandes du tableau de `CLAUDE.md` ne changent pas. La commande des contrôles en production s'ajoute au tableau avec la procédure (C14).

Les scénarios `@production` qui terminent une séance écrivent une séance terminée du profil « Pilote », avec le JWT du parent de test : c'est la seule écriture permise en production par les tests (45.24). Ils comptent aussi comme activité du projet Supabase Free, mais ce n'est pas eux qui empêchent sa pause : on ne publie pas forcément chaque semaine. C'est la tâche planifiée Claude de 45.31 qui maintient le projet actif (voir M5, section 3).

### 2. Vérifications techniques scriptées

Chaque vérification est un script (avec son test) lancé par la procédure de publication. Elle échoue avec un message qui nomme le problème.

| # | Vérification | Exemple qui passe | Exemple qui échoue | Quand |
|---|---|---|---|---|
| V1 | **Aucun secret dans `dist/`** (C6) | seules l'adresse du projet et la clé publique `anon` sont présentes | le build contient une clé dont le rôle est `service_role`, ou le texte `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `SEND_EMAIL_HOOK_SECRET`, un jeton de gestion (`sbp_…`), `profil-prepare` (0021), ou les valeurs fictives des pages légales du développement (`exemple.test`) | après `npm run build`, avant toute publication |
| V2 | **RLS active sur chaque table de `public`** (C10) | toutes les tables ont la RLS ; seules `boite_de_test_emails`, `essais_de_reinitialisation` et `tests_de_depart_comptes` n'ont aucune policy (liste fermée, 45.27) | une table sans RLS, ou une autre table sans policy | sur `savanturier-dev` à chaque story qui ajoute une migration ; sur la production après les migrations |
| V3 | **Région Irlande** (45.4) | le projet de production est en Irlande (`eu-west-1`) ; une Edge Function répond depuis cette région (en-tête de réponse) | projet ou fonction hors de l'Irlande | après la création du projet ; après chaque publication des fonctions |
| V4 | **En-têtes de l'adresse publiée chez alwaysdata** (C1) | `sw.js` et `index.html` : `no-cache` ; `manifest.webmanifest`, `bibliotheque.json`, `programmes-index.json` : revalidés ; `/assets/<nom haché>` : cache long immuable ; `http://` redirigé vers `https://` ; HSTS d'un an sans « preload » (45.23). Ces en-têtes viennent de la configuration d'alwaysdata (`.htaccess` publié avec le front, ou réglages du site, C1) | `sw.js` ou `index.html` gardés par le navigateur (`max-age` > 0 sans revalidation) ; en-têtes par défaut d'alwaysdata (signe que la configuration n'est pas lue) ; pas de redirection vers HTTPS | après chaque publication du front |
| V5 | **`ORIGINES_AUTORISEES` des Edge Functions** (C9) | une requête venant de l'adresse de production est acceptée | une requête venant de `http://localhost:5173` ou d'une autre origine est refusée ; la variable est absente ou vide | après la publication des fonctions et de leurs secrets |
| V6 | **Hook « Send Email » désactivé en production** (C8) | le hook est désactivé ; `MODE_EMAIL` est absent ou différent de `boite-de-test` | le hook est actif, ou `MODE_EMAIL=boite-de-test` en production | après le réglage d'Auth |
| V7 | **Configuration d'Auth de production** (C7) | adresse du site et adresses de retour sur l'adresse de production (alwaysdata) ; inscriptions publiques fermées (un `signUp` public est refusé) ; confirmations désactivées ; longueur minimale 8 | une adresse en `localhost` ou sur `savanturier-dev` ; inscription publique ouverte | après le réglage d'Auth |
| V8 | **Secrets des fonctions** (C9) | aucun `ANTHROPIC_API_KEY` tant que l'IA n'est pas là | une clé d'IA présente sans story qui l'utilise | après la publication des fonctions |
| V9 | **Aucune donnée de test en production** (C13) | aucun parent en `@exemple.test` ; `seed.sql` jamais appliqué | un parent ou un profil de test des scénarios courants en production | après les migrations |
| V10 | **Tâche planifiée active** (C11) | l'effacement des essais de réinitialisation de plus de 24 h est planifié en production, et son dernier passage (`cron.job_run_details`) a réussi | tâche absente, ou dernier passage en échec | après les migrations |
| V11 | **Version publiée** | la version du service worker servi par l'adresse de production est celle du commit publié | ancienne version encore servie | après la publication du front |
| V12 | **Projet de production actif** (offre Free) | le projet répond (il n'est pas en pause) | projet en pause : la procédure dit de le réveiller avant de continuer | au début de chaque publication, et à chaque passage de la tâche planifiée qui maintient le projet actif (voir M5) |

V3, V5 à V8, V10 et V12 lisent la production par l'API de gestion de Supabase ou par des requêtes HTTP ; V2 et V9 ont besoin d'une requête SQL en lecture seule (par l'API de gestion depuis le conteneur cloud, décision 0010).

### 3. Vérifications manuelles du PO

| # | Vérification | Attendu |
|---|---|---|
| M1 | **Contrôle sur une vraie tablette** (et un téléphone), à l'adresse de production (P10) | ouvrir l'adresse ; installer sur l'écran d'accueil ; s'inscrire ; créer un profil au pseudo fictif ; jouer une séance ; mode dys (police Andika visible) ; voix ; Son/Muet ; ouvrir les deux pages légales ; puis publier une petite version et constater qu'elle s'applique au lancement suivant, sans recharger l'écran de l'enfant ouvert (#8, règle 4) |
| M2 | **Sauvegarde manuelle et restauration d'essai** (P12) | l'offre Free n'a pas de sauvegarde automatique : **avant chaque publication**, une sauvegarde manuelle de la base de production est faite et notée au journal des publications (date, emplacement, jamais son contenu) ; **une restauration d'essai** de cette sauvegarde est faite au moins une fois avant d'inviter les familles, ailleurs que sur la production et que sur `savanturier-dev` (sur une base locale de la machine du PO, 45.32), et les données restaurées se lisent (nombre de parents, de profils et de séances terminées égal à celui de la production au moment de la sauvegarde) ; la copie restaurée est ensuite effacée. Aucune sauvegarde dans le dépôt ni dans le conteneur cloud |
| M3 | **Procédure de publication suivie une fois de bout en bout** (C14) | la procédure écrite est suivie dans l'ordre (vérifications, migrations, Edge Functions et secrets, Auth, front, contrôles après publication), sans étape improvisée ; le journal des publications le note ; un retour en arrière du front (version précédente republiée) est essayé une fois |
| M4 | **Demande de suppression des données essayée sur un parent de test** (C15) | un parent de test (pas celui des scénarios `@production`), avec deux profils au pseudo fictif, écrit depuis son adresse à l'adresse de contact. (a) Suppression d'un seul profil : le profil et ses données disparaissent, l'autre profil reste intact. (b) Suppression du parent : plus rien de lui ni de ses profils. Les nombres par table sont relevés avant, puis on vérifie qu'il ne reste rien (par les requêtes de la procédure en 45a ; par le script quand il existe, C15 [après]). Aucun autre parent n'est touché. Le délai de 7 jours est tenu (45.15) ; le registre des demandes est rempli par le PO (45.16) |
| M5 | **Risque de pause du projet Free** (P4) | une **tâche planifiée Claude** maintient le projet de production actif par une activité réelle, plus souvent qu'une fois par semaine (45.31) : elle a tourné au moins une fois avec succès, avec le parent de test seulement, sans lire aucune donnée d'enfant et sans aucun secret dans son prompt ; l'équipe a vérifié ce que Supabase compte comme activité pour l'offre gratuite et que le conteneur cloud atteint l'adresse de production. La procédure (C14) garde le **réveil manuel** depuis le tableau de bord de Supabase, en secours : un réveil est essayé une fois, et l'application installée sur la tablette fonctionne à nouveau ensuite, sans réinstallation |

## Vérification finale avant la mise en ligne

Une **seule fois**, juste avant la mise en ligne, sur le **commit publié** de `main` (décision 0022 : rien ne part en ligne sans non-régression complète verte sur ce commit), dans cet ordre :

1. tests unitaires, lint, format, typecheck, build, **V1** (secrets dans `dist/`), tests du pipeline de contenu ;
2. **non-régression E2E complète, une seule fois, sur les deux projets `tablette` et `telephone`**, avec toutes les stories livrées, contre `savanturier-dev` (exclusions habituelles `@depend-de`, `@envoi-email`, `@hors-beta` ; `@production` est exclu par la configuration). Les scénarios courants de #45 en font partie ;
3. **tests de la PWA** sur le build de production (`playwright.pwa.config.ts`), dont les scénarios `@pwa` de #45 ;
4. V12 (projet actif), **sauvegarde manuelle** (M2), publication selon la procédure, puis **contrôles après publication** contre la production : V2 à V11, puis les scénarios `@production` ;
5. **contrôle manuel sur une vraie tablette** (M1) par le PO.

Si une étape échoue, on corrige sur `main` et on reprend à l'étape 1 sur le nouveau commit. La sauvegarde manuelle (M2) précède l'étape 4 à chaque publication ; la restauration d'essai (M2), M3, M4 et M5 sont faits au moins une fois avant d'inviter les familles (P11).

## Hors périmètre

Hors de #45 :
- l'export et la suppression d'un profil dans l'application (#14, sortie de la beta) : pendant la beta, la demande de suppression des données passe par écrit ;
- le second parent (#13, sorti de la beta) ;
- les MP3 des voix servis par le CDN (45.10) ;
- l'expiration des enregistrements de lecture (#38 hors de la beta en ligne, 45.17) ;
- le retrait de `app/` et le sort de `prototype/` (#46, 45.12) ;
- un environnement de recette (45.11).

**45b, après la beta** (sans scénario pour l'instant, à écrire avec l'issue 45b, 45.19) :
- le lien et le code de connexion ne sont pas rétablis (45.21) : leurs scénarios `@hors-beta` sont supprimés ;
- la réinitialisation par e-mail remplace celle par le prénom d'un enfant (0019, 45.14) ; fournisseur d'e-mails européen avec offre gratuite, à choisir (P9, 45.5) ;
- limite d'inscriptions (45.20) et limite d'essais de connexion propre à l'application (0019 n°8) ;
- CI GitHub Actions (45.7) ;
- script du traitement d'une demande de suppression des données (C15) ;
- passage à Supabase Pro (45.3) ;
- expiration des enregistrements de lecture à 30 jours, avec #38 (45.17) ;
- domaine définitif à la place de l'adresse d'alwaysdata (45.2), annoncé aux familles (réinstallation et reconnexion).

## Décisions

Réponses du PO le **2026-10-25** (commentaire `[Responsable] VALIDÉ` sur #45, 17:48 UTC), mot pour mot :

1. « #45 : je veux une solution gratuite. fais moi les propositions pour pouvoir déployer gratuitement »
2. « 45. : alwaysdata »
3. Aux précisions : « reco OK »

Décisions qui en découlent :

- **45.1 Hébergeur : alwaysdata**, offre gratuite (environ 100 Mo : assez pour le front ; les MP3 restent hors 45a).
- **45.2 Adresse : l'adresse gratuite d'alwaysdata** (par exemple `savanturier.alwaysdata.net`), sans domaine acheté pendant la beta. Le PO sait que changer d'adresse plus tard obligera les familles à réinstaller l'application et à se reconnecter.
- **45.3 Supabase : offre gratuite (Free), Irlande `eu-west-1`**, avec une **sauvegarde manuelle avant chaque publication**. Limites connues : pause après environ une semaine sans activité, pas de sauvegarde automatique, quotas (environ 500 Mo de base, 1 Go de fichiers, 5 Go de trafic par mois). Passage à Pro avant l'ouverture au public.
- **45.4 Région : Irlande (`eu-west-1`)**, pour la base et les Edge Functions.
- **45.5 E-mails (45b)** : un fournisseur européen avec offre gratuite, à choisir plus tard.
- **45.6 à 45.22** : recommandations retenues (détail dans `domain-model.md`), dont : Andika dès la beta, y compris sans réseau (45.6) ; publication à la main (45.7) ; pages légales avec 45a, brouillon de l'équipe relu par le PO (45.9) ; beta **sur invitation** (45.13) ; réinitialisation par prénom gardée jusqu'à 45b (45.14) ; demande depuis l'adresse du compte, traitée sous 7 jours (45.15) ; registre tenu par le PO (45.16) ; **#38 hors de la beta en ligne** (45.17) ; parent de test en production (45.18) ; découpage **45a / 45b** (45.19) ; pas de limite d'inscriptions en 45a (45.20) ; lien de connexion non rétabli (45.21) ; migrations seulement additives (45.22).
- **45.23** : `http://` redirigé vers `https://` ; HSTS d'un an sans « preload » pendant la beta.
- **45.24** : parent de test en production avec un seul profil « Pilote », niveau CP, créé à la main par le PO ; les scénarios `@production` y ajoutent une séance terminée à chaque publication, sans rien nettoyer ; identifiants dans l'environnement de la session, jamais commités.
- **45.25** : pages légales accessibles depuis l'écran de connexion et l'espace parent, pas depuis les écrans de l'enfant.
- **45.26** : les pages légales sont des écrans du parent au sens de #73. #73 est mergée : le scénario reprend son étape « Paul n'entend aucune voix » et n'a plus de tag `@depend-de-73` ; les pages légales s'ajoutent à la liste des écrans du parent de #73.
- **45.27** : liste fermée des tables sans policy : `boite_de_test_emails`, `essais_de_reinitialisation`, `tests_de_depart_comptes` ; `boite_de_test_emails` reste vide en production.
- **45.28** : les six termes du modèle sont au glossaire (section Exploitation et Famille) ; « adresse de production », « connexion sécurisée », « aucun autre site que Savanturier », « parent de test de la production », « adresse de contact », « police de remplacement », « pages légales » restent des mots de scénario ou d'interface.
- **45.29** : contrôles en production depuis le conteneur ; le PO autorise l'adresse alwaysdata et le projet de production dans le proxy et fournit les accès à la session de publication seulement.
- **45.30** : scénarios `@production` sur `tablette` et `telephone`.

Réponses du PO le **2026-10-26** (commentaire `[Responsable]` sur #45, 15:30 UTC), mot pour mot :

- **45.31 Qui empêche la pause du projet Supabase Free ?** Le PO a d'abord demandé « peux avoir une routine qui maintient le projet toujours up? ». Deux options lui ont été proposées : **A**, une tâche planifiée GitHub Actions ; **B**, une tâche planifiée Claude, qui consomme la limite d'usage et dépend de l'accès réseau du conteneur cloud vers la production. Réponse : « B ».
  Décision : **une tâche planifiée Claude maintient le projet de production actif**, par une activité réelle, plus souvent qu'une fois par semaine. La procédure (C14, M5) garde le **réveil manuel** depuis le tableau de bord de Supabase, en secours. Dans la story, l'équipe vérifie : ce que Supabase compte comme activité pour l'offre gratuite ; que le conteneur cloud atteint l'adresse de production ; qu'aucune donnée d'enfant n'est lue (parent de test seulement, aucun secret dans le prompt de la tâche).
- **45.32 Où faire la restauration d'essai ?** Réponse : « Reco ».
  Décision : la restauration d'essai se fait sur une **base locale de la machine du PO** (`supabase start`, avec Docker), effacée juste après l'essai, qui a lieu avant l'arrivée des familles. Ni la production ni `savanturier-dev` (0010 n°3).
- **45.33 à 45.35** (réponse du PO du 2026-10-26, relayée par le responsable à 20:11 UTC, mot pour mot : « 45. Reco OK mais tu'peux pas publier le site toi même et créer le compte always data également »). Lecture :
  - **45.33 Qui publie le front ?** La session de publication, par **WebDAV** d'alwaysdata (repli : `rsync` depuis la machine du PO). Le compte alwaysdata et le projet Supabase de production sont créés par le **PO**.
  - **45.34 Durée de garde d'une sauvegarde manuelle** : **30 jours**, puis effacée.
  - **45.35 Fréquence de la tâche planifiée** (45.31) : **tous les 2 jours, la nuit**.

## Questions ouvertes

Aucune.
