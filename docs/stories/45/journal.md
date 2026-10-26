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
