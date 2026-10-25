# Critères d'acceptance : issue #45, mise en ligne de Savanturier

Scénarios : `features/45-mise-en-ligne.feature` (tags `@issue-45 @wip`).
Modèle : `docs/stories/45/domain-model.md` (P1 à P12 : ce que fait le PO ; C1 à C19 : ce que code une équipe ; questions 45.1 à 45.22).
Story transverse d'infrastructure : aucun agrégat, aucune règle du domaine pédagogique. Cadrage anticipé du 2026-10-25, sans code.

## Objectif

En tant que **parent**, je veux ouvrir Savanturier à une adresse stable et l'installer sur mes appareils, afin que mes enfants l'utilisent tous les jours, avec des données gardées dans l'UE et sans aucun traceur.

En tant qu'**équipe**, je veux une procédure de publication écrite et répétable, afin de publier une nouvelle version sans casser l'application d'une famille.

Comportement actuel (`app/`) : artifact claude.ai, sans adresse à nous, polices chargées chez Google Fonts. Il ne donne aucun exemple à reprendre : ce qu'il fait (Google Fonts, données gardées par claude.ai) est justement ce que la cible écarte.

## Trois sortes de vérification

Seul ce que voit le parent ou l'enfant est écrit en Gherkin. Le reste est vérifié par un script, ou à la main par le PO. Les trois sortes sont exigées pour la mise en ligne de 45a.

### 1. Scénarios automatisés (E2E Playwright)

| # | Règle | Scénarios | Où ils tournent |
|---|---|---|---|
| 1 | À l'adresse de production, Savanturier s'ouvre en connexion sécurisée et s'installe comme une application | Savanturier s'ouvre à l'adresse de production, en connexion sécurisée · L'adresse de production sans connexion sécurisée mène à la même adresse sécurisée (`@a-valider`, 45.23) · À l'adresse de production, le navigateur propose d'installer Savanturier · Après un premier chargement à l'adresse de production, Savanturier s'ouvre sans réseau · À l'adresse de production, une adresse inconnue mène à Savanturier | `@production` |
| 2 | En se connectant et en jouant une séance, le navigateur ne contacte aucun autre site que Savanturier | La connexion du parent ne contacte aucun autre site que Savanturier · Une séance terminée ne contacte aucun autre site que Savanturier · Avec le mode dys, aucune police n'est chargée depuis un autre site · À l'adresse de production, la connexion du parent ne contacte aucun autre site que Savanturier (`@a-valider`, 45.18, 45.24) · À l'adresse de production, une séance terminée ne contacte aucun autre site que Savanturier (`@a-valider`, 45.18, 45.24) | courantes (3 premiers), `@production` (2 derniers) |
| 3 | La politique de confidentialité et les mentions légales se lisent sans connexion, depuis l'écran de connexion et depuis l'espace parent | Sans connexion, Paul lit la politique de confidentialité depuis l'écran de connexion · Sans connexion, Paul lit les mentions légales depuis l'écran de connexion (`@a-valider`, 45.9) · Depuis l'espace parent, Paul lit la politique de confidentialité (`@a-valider`, 45.25) · La politique de confidentialité donne le délai de traitement d'une demande de suppression des données (`@a-valider`, 45.15) · Sur les pages légales, le personnage guide ne lit rien de lui-même (`@a-valider`, 45.26) · La page « <page> » tient dans la largeur d'un téléphone de 360 px (2 exemples) · À l'adresse de production, la politique de confidentialité se lit sans connexion | courantes, sauf le dernier (`@production`) |
| 4 | Avec le mode dys, le texte s'affiche vraiment en police Andika, servie par Savanturier, même sans réseau | Avec le mode dys, l'étape de leçon s'affiche dans la police Andika chargée par Savanturier (`@a-valider`, 45.6) · Sans réseau, le mode dys garde la police Andika (`@a-valider`, 45.6) | courantes ; `@pwa` pour le second |
| 5 | En production, un parent ne voit que les profils enfants auxquels il est rattaché, et personne ne voit rien sans connexion (`@acces`) | À l'adresse de production, sans connexion, aucun profil enfant n'est visible · À l'adresse de production, le parent de test ne voit que son propre profil enfant (`@a-valider`, 45.18, 45.24) | `@production` |

Total : 5 règles, 21 scénarios (22 cas exécutés avec les exemples du plan) : 11 dans les exécutions courantes ou `@pwa`, 10 `@production`. Tous relèvent de **45a**.

Précisions sur les exemples :
- **« Savanturier », dans « aucun autre site que Savanturier »**, désigne exactement deux origines : celle du front (adresse de production, ou `http://localhost:5173` dans les exécutions courantes) et celle du projet Supabase visé par le build (`VITE_SUPABASE_URL` : production, ou `savanturier-dev`). Toute autre origine fait échouer le scénario : Google Fonts, CDN, service d'analyse, traceur. Les adresses `data:` et `blob:` ne sont pas des sites.
- **Règle 2, cas limites** : la connexion (aucune donnée encore chargée) et la fin d'une séance (l'envoi de la séance terminée appelle une Edge Function) sont les deux moments où le front parle au serveur ; le mode dys est celui qui charge une police.
- **Règle 1** : l'installation et le hors réseau sont déjà vérifiés par #8 sur le build de production (`localhost`). #45 les **rejoue sur l'adresse de production**, parce que le service worker et l'installation dépendent de HTTPS et des en-têtes de l'hébergeur, que #8 ne peut pas voir. Le scénario de l'adresse inconnue vérifie le renvoi vers `index.html` (décision 0021) chez l'hébergeur.
- **Règle 3** : la politique de confidentialité doit donner le moyen de faire une demande de suppression des données (commentaire du PO du 2026-10-25 : scénario non `@a-valider`). Le texte vient du PO (P6, P7) ; les scénarios vérifient la présence de l'adresse de contact, du délai, de l'éditeur et de l'hébergeur, pas la rédaction.
- **Règle 4** : aujourd'hui, `src/styles.css` nomme Andika sans la charger, et le scénario de #12 (« police Andika, lettres, mots et lignes espacés ») passe avec la police de remplacement. Le scénario de #45 vérifie que la police **chargée** est Andika (par exemple par l'API des polices du navigateur), et non seulement son nom dans le style.
- **Règle 5** (`@acces`) : la RLS elle-même est vérifiée par le script de la section 2 sur toutes les tables ; les deux scénarios vérifient ce que voit un visiteur et le parent de test en production, où de vraies familles existent.

Ce que #45 rejoue sans nouveau scénario : la règle 4 de #8 (« Une nouvelle version s'applique au lancement suivant ») tourne sur le build de production avec les tests PWA ; sur l'adresse de production, elle est vérifiée par l'en-tête `no-cache` de `sw.js` et `index.html` (section 2) puis à la main sur la tablette (section 3). La connexion sans aucun e-mail de la beta reste couverte par #72.

#### Où tournent les scénarios

| Tag | Où | Données | Quand |
|---|---|---|---|
| aucun (ni `@production` ni `@pwa`) | configuration principale (`playwright.config.ts`), serveur de dev, contre `savanturier-dev` | préparées et nettoyées par les tests (`service_role` de dev, comme aujourd'hui) | exécutions courantes, non-régression |
| `@pwa` | `playwright.pwa.config.ts` (build de production sur `localhost`), dont le filtre s'élargit à `features/45-*.feature` avec `@pwa` | idem | tests PWA |
| `@production` | une configuration à part (par exemple `playwright.production.config.ts`), dont l'adresse de base est l'adresse de production, lue dans l'environnement | **aucune préparation ni aucun nettoyage** : seuls le parent de test de la production et son profil « Pilote », créés une fois à la main par le PO (45.18, 45.24). Identifiants lus dans l'environnement, jamais commités. La configuration refuse de démarrer si `SUPABASE_SERVICE_ROLE_KEY` est présente | après chaque publication, étape « contrôles après publication » de la procédure |

Les scénarios `@production` **ne doivent jamais tourner dans les exécutions courantes** : ils viseraient `localhost` et `savanturier-dev` avec des étapes faites pour la production, et une exécution courante ne doit jamais écrire en production (C13). La configuration principale les exclut donc d'elle-même (filtre `not @production and not @pwa` dans `defineBddConfig`, comme `playwright.pwa.config.ts` exclut déjà `@acces`) : les commandes du tableau de `CLAUDE.md` ne changent pas. La commande des contrôles en production s'ajoute au tableau avec la procédure (C14).

Les scénarios `@production` qui terminent une séance écrivent une séance terminée du profil « Pilote », avec le JWT du parent de test : c'est la seule écriture permise en production par les tests (45.24).

### 2. Vérifications techniques scriptées

Chaque vérification est un script (avec son test) lancé par la procédure de publication. Elle échoue avec un message qui nomme le problème.

| # | Vérification | Exemple qui passe | Exemple qui échoue | Quand |
|---|---|---|---|---|
| V1 | **Aucun secret dans `dist/`** (C6) | seules l'adresse du projet et la clé publique `anon` sont présentes | le build contient une clé dont le rôle est `service_role`, ou le texte `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `SEND_EMAIL_HOOK_SECRET`, un jeton de gestion (`sbp_…`), `profil-prepare` (0021) | après `npm run build`, avant toute publication |
| V2 | **RLS active sur chaque table de `public`** (C10) | toutes les tables ont la RLS ; seules `boite_de_test_emails`, `essais_de_reinitialisation` et `tests_de_depart_comptes` n'ont aucune policy (liste fermée, 45.27) | une table sans RLS, ou une autre table sans policy | sur `savanturier-dev` à chaque story qui ajoute une migration ; sur la production après les migrations |
| V3 | **Région** (45.4) | le projet de production est dans la région décidée par le PO (Irlande `eu-west-1` recommandée) ; une Edge Function répond depuis une région européenne (en-tête de réponse) | région hors UE, ou fonction exécutée hors d'Europe | après la création du projet ; après chaque publication des fonctions |
| V4 | **En-têtes de cache de l'adresse publiée** (C1) | `sw.js` et `index.html` : `no-cache` ; `manifest.webmanifest`, `bibliotheque.json`, `programmes-index.json` : revalidés ; `/assets/<nom haché>` : cache long immuable | `sw.js` ou `index.html` gardés par le navigateur (`max-age` > 0 sans revalidation) | après chaque publication du front |
| V5 | **`ORIGINES_AUTORISEES` des Edge Functions** (C9) | une requête venant de l'adresse de production est acceptée | une requête venant de `http://localhost:5173` ou d'une autre origine est refusée ; la variable est absente ou vide | après la publication des fonctions et de leurs secrets |
| V6 | **Hook « Send Email » désactivé en production** (C8) | le hook est désactivé ; `MODE_EMAIL` est absent ou différent de `boite-de-test` | le hook est actif, ou `MODE_EMAIL=boite-de-test` en production | après le réglage d'Auth |
| V7 | **Configuration d'Auth de production** (C7) | adresse du site et adresses de retour sur le domaine de production ; inscriptions publiques fermées (un `signUp` public est refusé) ; confirmations désactivées ; longueur minimale 8 | une adresse en `localhost` ou sur `savanturier-dev` ; inscription publique ouverte | après le réglage d'Auth |
| V8 | **Secrets des fonctions** (C9) | aucun `ANTHROPIC_API_KEY` tant que l'IA n'est pas là | une clé d'IA présente sans story qui l'utilise | après la publication des fonctions |
| V9 | **Aucune donnée de test en production** (C13) | aucun parent en `@exemple.test` ; `seed.sql` jamais appliqué | un parent ou un profil de test des scénarios courants en production | après les migrations |
| V10 | **Tâche planifiée active** (C11) | l'effacement des essais de réinitialisation de plus de 24 h est planifié en production | tâche absente ou en échec | après les migrations |
| V11 | **Version publiée** | la version du service worker servi par l'adresse de production est celle du commit publié | ancienne version encore servie | après la publication du front |

V3, V5 à V8 et V10 lisent la production par l'API de gestion de Supabase ou par des requêtes HTTP ; V2 et V9 ont besoin d'une requête SQL en lecture seule (par l'API de gestion depuis le conteneur cloud, décision 0010).

### 3. Vérifications manuelles du PO

| # | Vérification | Attendu |
|---|---|---|
| M1 | **Contrôle sur une vraie tablette** (et un téléphone), à l'adresse de production (P10) | ouvrir l'adresse ; installer sur l'écran d'accueil ; s'inscrire ; créer un profil au pseudo fictif ; jouer une séance ; mode dys (police Andika visible) ; voix ; Son/Muet ; ouvrir les deux pages légales ; puis publier une petite version et constater qu'elle s'applique au lancement suivant, sans recharger l'écran de l'enfant ouvert (#8, règle 4) |
| M2 | **Sauvegarde et restauration essayée** (P12) | une sauvegarde de la base de production existe ; une restauration a été faite au moins une fois (sur un projet de test, jamais par-dessus la production), et les données restaurées se lisent. En 45a si l'offre choisie a des sauvegardes (45.3), sinon en 45b |
| M3 | **Procédure de publication suivie une fois de bout en bout** (C14) | la procédure écrite est suivie dans l'ordre (vérifications, migrations, Edge Functions et secrets, Auth, front, contrôles après publication), sans étape improvisée ; le journal des publications le note ; un retour en arrière du front (version précédente republiée) est essayé une fois |
| M4 | **Demande de suppression des données essayée sur un parent de test** (C15) | un parent de test (pas celui des scénarios `@production`), avec deux profils au pseudo fictif, écrit depuis son adresse à l'adresse de contact. (a) Suppression d'un seul profil : le profil et ses données disparaissent, l'autre profil reste intact. (b) Suppression du parent : plus rien de lui ni de ses profils. Le script affiche les nombres par table avant, demande confirmation, puis vérifie qu'il ne reste rien. Aucun autre parent n'est touché. Le délai annoncé est tenu ; le registre des demandes est rempli (45.16) |

## Vérification finale avant la mise en ligne

Une **seule fois**, juste avant la mise en ligne, sur le **commit publié** de `main` (décision 0022 : rien ne part en ligne sans non-régression complète verte sur ce commit), dans cet ordre :

1. tests unitaires, lint, format, typecheck, build, **V1** (secrets dans `dist/`), tests du pipeline de contenu ;
2. **non-régression E2E complète, une seule fois, sur les deux projets `tablette` et `telephone`**, avec toutes les stories livrées, contre `savanturier-dev` (exclusions habituelles `@depend-de`, `@envoi-email`, `@hors-beta` ; `@production` est exclu par la configuration). Les scénarios courants de #45 en font partie ;
3. **tests de la PWA** sur le build de production (`playwright.pwa.config.ts`), dont les scénarios `@pwa` de #45 ;
4. publication selon la procédure, puis **contrôles après publication** contre la production : V2 à V11, puis les scénarios `@production` ;
5. **contrôle manuel sur une vraie tablette** (M1) par le PO.

Si une étape échoue, on corrige sur `main` et on reprend à l'étape 1 sur le nouveau commit. M2, M3 et M4 sont faits au moins une fois avant d'inviter les familles (P11).

## Hors périmètre

Hors de #45 :
- l'export et la suppression d'un profil dans l'application (#14, sortie de la beta) : pendant la beta, la demande de suppression des données passe par écrit ;
- le second parent (#13, sorti de la beta) ;
- les MP3 des voix servis par le CDN (45.10) ;
- le retrait de `app/` et le sort de `prototype/` (#46, 45.12) ;
- un environnement de recette (45.11).

**45b, après la beta** (sans scénario pour l'instant, à écrire avec l'issue 45b, 45.19) :
- le lien de connexion reçu par e-mail ramène à l'adresse de production (#5), si le lien est rétabli (45.21) ; retrait du tag `@hors-beta` ;
- la réinitialisation par e-mail remplace celle par le prénom d'un enfant (0019, 45.14) ; fournisseur d'e-mails européen (P9, 45.5) ;
- limite d'inscriptions (45.20) et limite d'essais de connexion propre à l'application (0019 n°8) ;
- CI GitHub Actions (45.7) ;
- restauration d'essai si elle n'est pas faite en 45a (P12) ;
- expiration des enregistrements de lecture à 30 jours, avec #38 (45.17) ;
- domaine définitif si 45a part sur l'adresse de l'hébergeur (45.2).

## Questions ouvertes

Les questions **45.1 à 45.22** sont dans `docs/stories/45/domain-model.md`, avec leur recommandation. Scénarios qui en dépendent :
- 45.6 (police du mode dys dès la beta) : règle 4, les deux scénarios ;
- 45.9 (pages légales avec 45a, qui écrit) : mentions légales ;
- 45.15 (délai et preuve de la demande) : délai de traitement ;
- 45.18 (parent de test en production) : les trois scénarios `@production` qui se connectent ;
- 45.1, 45.2 (hébergeur, domaine) : tous les `@production` attendent l'adresse de production ;
- 45.13, 45.14 (beta sur invitation, réinitialisation par prénom gardée) : aucun scénario de #45 ; #72 reste en vigueur tant que 45b n'est pas fait.

Questions nouvelles :

23. **45.23 Adresse sans connexion sécurisée** : une adresse en `http://` mène-t-elle à la même adresse en `https://`, et le navigateur retient-il de n'utiliser que HTTPS (en-tête HSTS) ? Recommandation : oui pour la redirection ; HSTS d'un an sans « preload » pendant la beta (le preload est difficile à retirer si le domaine change, 45.2). D'accord ? (oui / non)
24. **45.24 Profil de test en production** : complète 45.18. Le parent de test a un seul profil enfant au pseudo fictif « Pilote », niveau CP, créé à la main par le PO ; les scénarios `@production` y ajoutent une séance terminée à chaque publication, avec le JWT du parent, sans jamais rien nettoyer ; ses identifiants sont des variables d'environnement de la session, jamais commitées. Recommandation : oui ; le PO peut supprimer ce profil par une demande de suppression des données s'il gêne. D'accord ? (oui / non)
25. **45.25 Pages légales dans l'espace parent** : en plus de l'écran de connexion, sont-elles accessibles depuis l'espace parent ? Et depuis les écrans de l'enfant ? Recommandation : oui depuis l'espace parent (le parent connecté doit retrouver le moyen de faire une demande de suppression des données) ; non depuis les écrans de l'enfant. D'accord ? (oui / non)
26. **45.26 Pages légales, écrans du parent** : sont-elles des écrans du parent au sens de #73, où le personnage guide ne lit rien de lui-même ? Recommandation : oui (texte long pour l'adulte) ; le scénario dépend aussi de la livraison de #73. D'accord ? (oui / non)
27. **45.27 Tables sans policy** : la liste fermée des tables sans aucune policy est-elle `boite_de_test_emails`, `essais_de_reinitialisation`, `tests_de_depart_comptes` ? Recommandation : oui, et `boite_de_test_emails` reste vide en production (hook désactivé, V6) ; toute nouvelle table sans policy demande une décision. D'accord ? (oui / non)
28. **45.28 Vocabulaire des scénarios** : termes employés hors du glossaire, à classer comme termes d'exploitation (hors glossaire) ou à ajouter : « adresse de production », « connexion sécurisée » (pour HTTPS), « aucun autre site que Savanturier » (pour les deux origines permises), « parent de test de la production », « adresse de contact », « police de remplacement », « pages légales ». S'y ajoutent les termes déjà proposés `(à valider)` par le modèle : Beta, Production, Procédure de publication, Demande de suppression des données, Politique de confidentialité, Mentions légales. Recommandation : les six termes du modèle au glossaire ; les autres restent des mots de scénario ou d'interface, hors glossaire. D'accord ? (oui / non)
29. **45.29 Où tournent les contrôles en production** : depuis le conteneur cloud, il faut autoriser l'adresse de production et le projet Supabase de production dans le proxy (comme pour `savanturier-dev`, décision 0010), et fournir à la session le jeton de gestion de la production. Recommandation : oui, le PO autorise ces domaines et fournit les accès à la session de publication seulement (P5) ; à défaut, le PO lance lui-même la commande des contrôles en production sur sa machine. Lequel ? (conteneur / machine du PO)
30. **45.30 Projets des contrôles en production** : les scénarios `@production` tournent-ils sur `tablette` et `telephone` ? Recommandation : oui, sur les deux : ils sont peu nombreux (10, soit 20 cas ; une séance terminée de plus pour « Pilote » par projet et par publication). D'accord ? (oui / non)
