# Journal : issue #45, Mise en ligne de Savanturier (45a, beta)

Équipe lancée par `/graphe` (vague 1), session `session_01WcPFH47e6wiF4owyQPrnFY`. Branche de base : `main`. Branche : `feature/45-mise-en-ligne`, partie de `main` `953f527`.
Décision réservée : 0025 (hébergement de la beta).

## 2026-10-26

- 15:31 UTC : démarrage. Dépendances toutes mergées (dont #8 et #73). Cadrage validé le 2026-10-25 ; 45.31 = B et 45.32 = reco (commentaire `[Responsable]` du 26/10, 15:30 UTC).
- Étape 1 sautée : story d'infrastructure, aucun agrégat (cadrage validé, `domain-model.md`).
- Étape 2 réduite : consigner 45.31 et 45.32 dans `acceptance.md`, lever `@depend-de-73` après vérification (`po-acceptance`).
- Pas d'E2E lourd sur `savanturier-dev` avant le résultat de la non-régression de `main` `953f527` (#33).
- Constat : Andika est déjà chargée par `@fontsource/andika` (`src/main.tsx`, depuis #12) et ses `woff2` passent dans `/assets/`, donc dans la coquille du service worker. C2 se réduit à le prouver par les scénarios de la règle 4.
- Environnement : contournement Playwright posé hors du dépôt (lien `chromium_headless_shell-1194` → 1243, `chrome-linux`, `headless_shell`).

### Choix techniques de l'orchestrateur

- Vérifications scriptées (V1 à V12) et configuration d'Auth de production : **Python** (bibliothèque standard seulement) sous `scripts/exploitation/`, tests pytest dans `scripts/tests/`. Ce n'est pas du code métier ; Python et pytest sont déjà la pile de `scripts/`. Fonctions pures testées, appels HTTP derrière une petite interface remplacée par un faux dans les tests.
- Pages légales : écrans du parent au sens de #73 (`estUnEcranDuParent`, contexte Famille) ; identité de l'éditeur et adresse de contact lues dans l'environnement du build (jamais dans le dépôt), valeurs fictives en développement, et le build de production refusé par V1 s'il contient encore ces valeurs fictives.
- 15:45 UTC : critères (`c65d639`) : 45.31 et 45.32 consignées ; `@depend-de-73` levé. La dernière étape du scénario du personnage guide devient « Mais Paul n'entend aucune voix » (step existant de #73, même sens ; aucun step « le personnage guide ne lit rien de lui-même » n'existait). À brancher : le `Before({ tags: "@issue-73" })` de `aucun-son-cote-parent.steps.ts` doit aussi couvrir ce scénario.
- 15:46 UTC : poussé (`c65d639`). Bloc A (Famille) : cycle 1 « les pages légales sont des écrans du parent ».

### Recherche documentaire (15:50 UTC, à reprendre dans `docs/publication.md` et la décision 0025)

Le proxy du conteneur bloque `help.alwaysdata.com` : pour alwaysdata, seuls des extraits de la doc ont été lus (certitude moyenne, à confirmer par le PO lors de P1).
- **alwaysdata, type de site « Fichiers statiques »** : servi par Apache, lit `.htaccess` (modules `mod_headers`, `mod_rewrite` à confirmer par un premier envoi). Aucun réglage d'en-têtes par fichier dans l'interface : les en-têtes de cache passent par `public/.htaccess`.
- **HTTPS** : case « Forcer HTTPS » du site (onglet SSL), redirection faite par le proxy d'alwaysdata avant Apache ; certificat de `*.alwaysdata.net` fourni d'office. **HSTS** : pas de case, `Header always set Strict-Transport-Security "max-age=31536000"` dans `.htaccess` (sans `preload`, 45.23).
- **Envoi** : SSH/SFTP sur `ssh-<compte>.alwaysdata.net` (utilisateur créé dans « Accès distant », clé SSH conseillée), racine du site réglable (par défaut `$HOME/www/`). rsync par SSH (déduit). SSH sur l'offre gratuite : à confirmer par le PO.
- **alwaysdata, mentions légales** : alwaysdata SARL, données en France ; adresse postale à confirmer par le PO sur les CGV en vigueur.
- **Supabase Free, pause** : l'activité comptée est celle de la base (« quelques requêtes par jour » suffisent, les appels de l'API comptent) ; pg_cron non garanti. Avertissement par e-mail avant la pause ; reprise depuis le tableau de bord ; `POST /v1/projects/{ref}/restore` existe. 2 projets Free actifs au plus.
- **`config.toml`, `[remotes.<nom>]`** : existe, mais `project_id` doit être écrit en clair (`env(...)` ignoré par la CLI 2.121.0). Choix : **ne pas** utiliser `supabase config push` vers la production (il pousserait aussi le hook `send_email` de dev) ; la configuration d'Auth de production passe par un script Python et l'API de gestion (`PATCH /v1/projects/{ref}/config/auth` : `site_url`, `uri_allow_list`, `disable_signup`, `mailer_autoconfirm`, `password_min_length`, `hook_send_email_enabled`).
- **API de gestion** : `GET /v1/projects/{ref}` (`region`, `status`), `GET /v1/projects/{ref}/secrets` (noms ; `value` est une empreinte), `POST /v1/projects/{ref}/database/query` (`read_only`).
- **Région des Edge Functions** : par défaut la plus proche de l'appelant ; fixée par l'en-tête `x-region: eu-west-1` (ou `region` de `functions.invoke`, ou `forceFunctionRegion`) ; lue dans l'en-tête de réponse `x-sb-edge-region`. Aucun réglage par projet trouvé : le front doit fixer la région à chaque appel (C12).
- **Sauvegarde** : `supabase db dump --db-url … -f roles.sql --role-only`, `-f schema.sql`, `-f data.sql --use-copy --data-only` ; restauration locale par `psql --single-transaction … --dbname postgresql://postgres:postgres@127.0.0.1:54322/postgres` après `supabase start`.
- **45.31, tâche planifiée** : l'activité retenue est une vraie requête à la base : lecture par l'API REST avec la clé publique `anon` (la RLS ne renvoie rien) puis connexion du parent de test (identifiants dans l'environnement de la tâche, jamais dans son prompt). Aucune donnée d'enfant lue en dehors du profil fictif « Pilote ».

### Découpage TDD

Bloc A « Famille, pages légales » : 1. les pages légales sont des écrans du parent (`4f13bdc` RED, `7e06dcb` GREEN, 2462 tests verts).

Bloc B « Exploitation, vérifications scriptées » : module Python `scripts/exploitation/` (paquet, bibliothèque standard seulement), tests `scripts/tests/test_exploitation_<sujet>.py`. Chaque vérification est une **fonction pure** qui reçoit ce qui a été lu (fichiers, lignes SQL, en-têtes, JSON de l'API) et rend la **liste des écarts** (messages en français qui nomment le problème ; liste vide = OK). Les lectures (HTTP, API de gestion) sont faites par un petit client passé en paramètre, remplacé par un faux dans les tests. Aucune valeur de secret n'est jamais affichée : seulement son nom ou son emplacement.

| Cycle | Fichier | Comportement |
|---|---|---|
| B1 | `secrets_du_build.py` | V1 : `ecarts_du_build(fichiers: dict[str, str])` signale une clé JWT dont le rôle est `service_role` (l'`anon` est permise), les noms `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `SEND_EMAIL_HOOK_SECRET`, un jeton de gestion `sbp_…`, `profil-prepare` (0021), et les valeurs fictives des pages légales du développement (`exemple.test`) ; nomme le fichier, jamais la valeur |
| B2 | `rls.py` | V2 : `REQUETE_RLS` (SQL en lecture seule) et `ecarts_de_la_rls(lignes)` : table de `public` sans RLS ; table sans policy hors de la liste fermée 45.27 |
| B3 | `en_tetes.py` | V4 : `ecarts_des_en_tetes(chemin, en_tetes)` : `sw.js` et `/` (`index.html`) en `no-cache` ; `manifest.webmanifest`, `bibliotheque.json`, `programmes-index.json` revalidés ; `/assets/…` cache long `immutable` ; HSTS `max-age=31536000` sans `preload` ; et `ecarts_de_la_redirection(statut, location, adresse)` (`http://` → même adresse en `https://`) |
| B4 | `auth_de_production.py` | C7 : `configuration_d_auth(adresse_de_production)` (corps du `PATCH /v1/projects/{ref}/config/auth` : `site_url`, `uri_allow_list`, `disable_signup`, `mailer_autoconfirm`, `password_min_length`, `hook_send_email_enabled=False`) ; V6/V7 : `ecarts_de_l_auth(config_lue, adresse)` |
| B5 | `secrets_des_fonctions.py` | V6/V8/C9 : `ecarts_des_secrets(noms)` : `ORIGINES_AUTORISEES` présent ; `ANTHROPIC_API_KEY`, `MODE_EMAIL`, `SEND_EMAIL_HOOK_SECRET` absents pendant la beta |
| B6 | `origines.py` | V5 : `ecarts_des_origines(reponses)` à partir de l'en-tête `Access-Control-Allow-Origin` d'un appel `OPTIONS` d'une Edge Function, depuis l'adresse de production (acceptée) et depuis `http://localhost:5173` (refusée) |
| B7 | `projet.py` | V3/V12 : `ecarts_du_projet(projet)` (`region` = `eu-west-1`, `status` = `ACTIVE_HEALTHY`, sinon « réveiller le projet ») ; `ecarts_de_la_region_des_fonctions(en_tetes)` (`x-sb-edge-region` = `eu-west-1`) |
| B8 | `donnees.py` | V9/V10 : `REQUETE_DONNEES_DE_TEST` + `ecarts_des_donnees_de_test(lignes)` ; `REQUETE_TACHES_PLANIFIEES` + `ecarts_des_taches_planifiees(lignes)` |
| B9 | `version.py` | V11 : `version_du_service_worker(texte)` et `ecarts_de_version(servie, attendue)` |
| B10 | `garder_actif.py` | 45.31 : lecture REST avec la clé `anon` puis connexion du parent de test (identifiants dans l'environnement), rapport sans aucune donnée ; écart si le projet ne répond pas |
| B11 | `controles_production.py` | orchestration de V2 à V12 contre la production (variables d'environnement lues, refus si `SUPABASE_SERVICE_ROLE_KEY` est présente), code de sortie non nul au premier écart |

### Cycles TDD (bloc B)

| Cycle | RED | GREEN / REFACTOR | Note |
|---|---|---|---|
| B1. V1 secrets du build | `8b52393` | `75775b0` | `dist/` du conteneur : aucun écart |
| B2. V2 RLS | `888c178` | `11f8c39` | lancée en lecture seule sur `savanturier-dev` : 14 tables, aucun écart. L'API de gestion refuse l'agent `Python-urllib` : B11 doit envoyer un `User-Agent` explicite |
| B3. V4 en-têtes | `5de4eb7` | `4a6c4ea` | |
| B4. Auth de production | `bc5e4ee` | `66bd06d` | |
| B5. Secrets des fonctions | `2a87fd0` | `7477bad` | |

- 15:45 → 20:06 UTC : **arrêt** (limite hebdomadaire d'usage atteinte pendant le RED de B6/B7, rien de perdu : tout était poussé jusqu'à `7477bad`). Reprise annoncée par le responsable sur #64 à 20:06.
| B6. V5 origines | `5fcc4fa` | `3468bc2` | |
| B7. V3/V12 projet | `2f365f8` | `407bf03` | |
| B8. V9/V10 données de test, tâche planifiée | `f5d40b1` | `0329772` | sur dev : tâche active ; 9 parents de test (normal sur dev) |
| B9. V11 version | `9821664` | `eb79c22` | |
| B10. Garder le projet actif (45.31) | `d176fe7` | en cours | |

- 20:10 UTC : ESCALADE groupée P1 à P12 publiée sur #45 (questions 45.33 à 45.35).
- 20:11 UTC : réponse du PO relayée par le responsable : 45.34 = 30 jours, 45.35 = tous les 2 jours la nuit ; 45.33 = **la session publie le front elle-même, variante WebDAV d'alwaysdata** (repli : rsync depuis la machine du PO) ; compte alwaysdata créé par le PO ; projet Supabase de production créé par l'API seulement si le PO dit oui.
- 20:14 UTC : constats réseau. `*.alwaysdata.com` et `*.alwaysdata.net` sont refusés par le proxy du conteneur (403 au CONNECT) : le PO doit autoriser l'hôte du site et l'hôte WebDAV dans « Network access » de l'environnement. Le `SUPABASE_ACCESS_TOKEN` du conteneur ne voit **aucune organisation** (seulement le projet de dev) : il ne peut pas créer le projet de production ; le PO le crée (P3) ou fournit un jeton qui voit son organisation.
- 20:12 UTC : B10, premier GREEN `58a4f6b` ; l'essai réel sur dev montre que la clé `anon` ne lit pas `profils_enfants` (401, droits retirés à `anon` par la migration de #5). Comportement corrigé : connexion du parent de test **puis** lecture avec son JWT (RED bis en cours).
- 20:12 UTC : le responsable précise que les réglages d'environnement ne valent que pour les sessions créées après eux. La vérification WebDAV et les étapes `@production` se feront dans une **nouvelle session de publication**, lancée après le merge ; `docs/publication.md` dit ce qu'elle doit faire. Ajout d'un cycle **B12** : envoi du front par WebDAV (`MKCOL` des dossiers, `PUT` des fichiers, `/assets/` d'abord puis `index.html` et `sw.js` en dernier, pour qu'aucune page servie ne vise un fichier pas encore envoyé).
- 20:20 UTC : B10 vert (`c75081e` RED bis, `8678eed` fix ; 1497 tests pytest). Essai sur dev avec un parent inexistant : connexion 400, aucune lecture.
- Cycles ajoutés au bloc B : **B12** `envoi_webdav.py` (45.33 : envoi du front par WebDAV, ordre `/assets/` puis le reste, `index.html` et `sw.js` en dernier) ; **B13** `migrations.py` (migrations de production par l'API de gestion, 0010 n°2 : versions déjà appliquées lues dans `supabase_migrations.schema_migrations`, seules les manquantes appliquées dans l'ordre et enregistrées).
| B10. Garder actif (45.31) | `d176fe7`, `c75081e` | `58a4f6b`, `8678eed` | lecture avec le JWT du parent de test (la clé `anon` n'a aucun droit) |
| B11. Contrôles après publication | `457d4fe` | `80c14fe` | essai contre dev : aucune exception, écarts lisibles ; la région des fonctions est bien fixée par `x-region` |
| B12. Envoi WebDAV (45.33) | `25e40f5` | `309fcef` | non essayé : alwaysdata refusé par le réseau de cette session |
| B13. Migrations par l'API | `894d30d`, `59bb9be` | `0e07624` | lecture sur dev : 13 appliquées, aucune à appliquer ; l'API répond 201 au `database/query` (tout 2xx accepté) |

- 20:20 UTC : bloc B terminé (1539 tests pytest). Revue intermédiaire du bloc B (delta `7e06dcb..0e07624`) lancée en parallèle du câblage du front.
- 20:23 UTC : revue intermédiaire du bloc B, cycle 1 : **À CORRIGER**, 4 bloquants : refus de `SUPABASE_SERVICE_ROLE_KEY` non testé (`controles_production`, `garder_actif`) ; refus d'un `dist/` de développement non testé (`envoi_webdav`) ; lecture de `dist/sw.js` non testée et asset témoin vide en silence ; V10 « tâche en échec » non vérifiée (`cron.job_run_details`). Non bloquants repris dans le même cycle : statuts de l'API de gestion lus (écart lisible au lieu d'une exception), refus de `service_role` aussi dans `migrations`, WebDAV en `https://` seulement, message d'usage, nom `l`. V1 étendu à `exemple.test` : à reporter dans `acceptance.md`. Ancrage C12 (région fixée par le front) : vérifié par le câblage, pas par V3.
- 20:30 UTC : corrections de la revue du bloc B : RED `ea9aa20`, GREEN `4d3db69`, `435805d` (1562 tests pytest). Câblage du front : `240f602` pages légales, `99e03d6` Edge Functions appelées en `eu-west-1` (`appelerUneFonction`), `8911769` `.htaccess`, `7647a69` configurations Playwright, `d4594e0` `.env.example`.
- 20:30 UTC : le câblage révèle que `x-region` (posé par `functions-js` avec la région) n'était pas autorisé en CORS par les fonctions : RED `456a0e8`, GREEN `d0f06bc` (2463 tests Deno). VERROU base demandé pour redéployer les 9 fonctions sur `savanturier-dev` ; accordé par le responsable (message de 20:27), à utiliser **après** MERGÉE + non-régression OK de #33.
- 20:40 UTC : documentation : `866166e` (`docs/publication.md`, décision 0025), `e0a3256` (`CLAUDE.md`), `a276f71` (`acceptance.md` : V1, V10, 45.33 à 45.35).
- 20:48 UTC : non-régression de `main` `a3f4d71` OK (1184/1184, annoncée par le responsable), verrou `base` vérifié au tableau de #64. 20:48 UTC : 9 Edge Functions redéployées sur `savanturier-dev` depuis la branche (`--use-api`) ; pré-requête vérifiée (204, `x-region` autorisé, `x-sb-edge-region: eu-west-1`). Annonces avant et après sur #45.
- 20:50 UTC : steps E2E `09fad33` : `@issue-45` sur `telephone` 10/11 verts (« Une séance terminée… » dépasse 30 s : marquée lente depuis les steps, en cours), PWA 2/2, steps `@production` générés sans step manquant.
- 20:52 UTC : revue globale, cycle 1 : **À CORRIGER**, 3 bloquants (procédure : E2E et build mélangeant dev et production ; comptage de vérification d'une suppression de parent qui ne vérifie rien ; politique de confidentialité incomplète sur les données gardées et sur l'appareil). Corrections en cours (documentation et textes), plus le non bloquant n°4 retenu en TDD (l'envoi WebDAV refuse un `dist/` sans `sw.js` ou qui échoue à V1). Non bloquant n°5 (assertion E2E sur `x-region` côté front) laissé en dette : vérifié dans `functions-js` et par la pré-requête déployée.
- 20:55 UTC : corrections de la revue globale : `b8177dc`, `817e38c`, `10525f2` ; envoi WebDAV RED `d1d7326`, GREEN `a3414a7` ; steps `015dd33` (séance lente par `$test.slow()`, étape propre à `@issue-45`, `@wip` retiré). `main` `a3f4d71` intégrée (merge `fa64a64`, sans conflit). Revue globale cycle 2 : **APPROUVÉ** (3 non bloquants en cours de correction).
- 21:03 UTC : vérifications sur `fa64a64` : Deno 2463/2463, pytest 1565/1565, lint, fmt, tsc OK. **E2E `telephone`, `--workers=2`, périmètre #45 + #5 + #72 + #12 : 135/135 verts** (8,1 min, aucun KO).
- 21:07 UTC : non bloquants du cycle 2 : `f972a97`, `32b4cde`, `70793ad` (texte seulement). Sur le dernier commit : **tests PWA 34/34** (#8 et `@pwa` de #45, tablette et téléphone) et **`@issue-45` sur `telephone` 11/11**. PR #112 ouverte en brouillon, puis passée en prête.

## Mesures

| Mesure | Valeur |
|---|---|
| Lancement → PRÊTE À MERGER | 15:31 → 21:10 UTC, soit 5 h 40 min, dont **4 h 20 min d'arrêt** (limite hebdomadaire d'usage, 15:45 → 20:06) : ≈ 1 h 20 min de travail |
| Attentes | réponses du PO aux escalades : 1 min (relayées aussitôt par le responsable) ; résultat de la non-régression de `main` avant le déploiement : ≈ 35 min, sans blocage (le code continuait) |
| Cycles TDD | bloc A : 1 ; bloc B : 13 (dont 2 RED corrigés en cours : B10 après l'essai réel, B13 pour le contrat du client) ; corrections de revue : 2 (scripts, envoi WebDAV) ; CORS `x-region` : 1 |
| Cycles de review | revue intermédiaire du bloc B : 1 À CORRIGER, puis corrigée ; revue globale : 1 À CORRIGER (3 bloquants de procédure et de texte), puis APPROUVÉ au cycle 2 |
| Cycles d'E2E | mise au point `@issue-45` : 2 (1 KO de durée, réglé par `$test.slow()`) ; périmètre #45/#5/#72/#12 : 1 run, 135/135 ; PWA : 1 run, 34/34 ; relance `@issue-45` sur le dernier commit : 11/11 |
| Intégrations de `main` | 1 (`a3f4d71`, `fix(#33)`), 0 conflit |
| Verrous | `base` (20:28 →, redéploiement des 9 fonctions pour le CORS `x-region`, à rendre au merge) |
| Escalades | 2 au PO (P1 à P12 et 45.33 à 45.35 ; réseau et jeton de gestion) |
