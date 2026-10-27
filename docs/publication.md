# Procédure de publication de Savanturier (beta)

Cette procédure met en ligne une version de Savanturier : le front chez alwaysdata, la base et les Edge Functions chez Supabase (offre Free, Irlande `eu-west-1`). Elle vient de la story #45 (45a) et de la décision 0025.

**Règle absolue** : aucune valeur secrète, aucune adresse réelle, aucune référence de projet dans ce fichier, dans le dépôt, dans les commits, les issues ou les journaux. On y trouve seulement des **noms de variables d'environnement**. Les valeurs vivent dans l'environnement de la session de publication (réglé par le PO) et dans le gestionnaire de mots de passe du PO.

## 1. Qui fait quoi

| Qui | Fait |
|---|---|
| **Session de publication** : une session Claude **créée après** les réglages d'environnement du PO. Seule une session créée après ces réglages reçoit le réseau vers alwaysdata et le projet de production, et les variables | vérifications, migrations, Edge Functions, secrets, configuration d'Auth, envoi du front, contrôles après publication, journal des publications, lecture des journaux, traitement des demandes de suppression (requêtes SQL) |
| **PO** | comptes alwaysdata et Supabase, réglages d'environnement, **sauvegarde et restauration d'essai** sur sa machine (la base d'enfants ne passe jamais par le conteneur ni par le dépôt), contrôle sur tablette et téléphone, invitations des familles, registre des demandes de suppression, réponses écrites aux parents |

Une session créée avant les réglages ne voit ni l'hôte du site ni celui de l'envoi WebDAV (le proxy du conteneur répond 403) : elle ne peut pas publier. Dans ce cas, on crée une nouvelle session.

## 2. Préparation, une seule fois

### 2.1 Compte alwaysdata (PO, P1, P2)

1. Créer un compte alwaysdata gratuit. Le **nom du compte donne l'adresse de production** (`https://<compte>.alwaysdata.net`) : il ne doit plus changer pendant la beta (changer d'adresse oblige chaque famille à réinstaller l'application et à se reconnecter, risque accepté par le PO).
2. Créer le site du front : type **« Fichiers statiques »**, racine **`www/`**, adresse du compte.
3. Onglet SSL du site : cocher **« Forcer HTTPS »** (la redirection de `http://` est faite par alwaysdata, pas par `.htaccess`).
4. Activer l'**accès WebDAV** (« Accès distant » / WebDAV), avec un utilisateur et un mot de passe dédiés à l'envoi du front, limité au dossier `www/`. Ces identifiants ne servent qu'à l'envoi (variables `ALWAYSDATA_WEBDAV_URL`, `ALWAYSDATA_WEBDAV_UTILISATEUR`, `ALWAYSDATA_WEBDAV_MOT_DE_PASSE`).
5. Facultatif, pour le repli (§ 3.7) : un accès SSH avec une clé, depuis la machine du PO.
6. Le quota gratuit est d'environ 100 Mo : le build doit y tenir.

### 2.2 Projet Supabase de production (PO, P3, P4)

1. Créer un projet **distinct de `savanturier-dev`**, offre **Free**, région **Irlande (`eu-west-1`)**. Jamais de donnée d'un vrai enfant sur le projet de développement (décision 0010).
2. Relever dans le tableau de bord : la référence du projet, l'URL de l'API, la clé publique `anon`, un jeton de gestion (« Access Tokens »).
3. **Ne jamais** mettre la clé `service_role` de production dans l'environnement de la session ni dans un fichier : les scripts et la configuration `@production` refusent de démarrer si `SUPABASE_SERVICE_ROLE_KEY` est présente.
4. Connaître les limites de l'offre Free : pause après environ une semaine sans activité (voir § 7), aucune sauvegarde automatique, environ 500 Mo de base, 1 Go de fichiers, 5 Go de trafic par mois.

### 2.3 Variables d'environnement de la session de publication (PO, P5)

Le PO règle l'environnement avant de créer la session (liste commentée dans `.env.example`) :

| Variable | Rôle |
|---|---|
| `ADRESSE_DE_PRODUCTION` | adresse du front, en `https://` |
| `SUPABASE_PRODUCTION_REF` | référence du projet de production |
| `SUPABASE_PRODUCTION_URL` | URL de l'API du projet |
| `SUPABASE_PRODUCTION_ANON_KEY` | clé publique `anon` (jamais `service_role`) |
| `SUPABASE_ACCESS_TOKEN` | jeton de gestion (API de gestion, migrations, fonctions, secrets, Auth) |
| `PARENT_DE_TEST_PRODUCTION_EMAIL`, `PARENT_DE_TEST_PRODUCTION_MOT_DE_PASSE` | parent de test de la production |
| `ALWAYSDATA_WEBDAV_URL`, `ALWAYSDATA_WEBDAV_UTILISATEUR`, `ALWAYSDATA_WEBDAV_MOT_DE_PASSE` | envoi du front |

Dans la session de publication, `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` ne sont **pas** posées dans l'environnement : elles ne servent qu'au **build de production** (§ 3.7), posées pour cette seule commande à partir de `SUPABASE_PRODUCTION_URL` et `SUPABASE_PRODUCTION_ANON_KEY`. Ainsi aucune commande de test ne vise la production par erreur.

Le réseau de la session autorise : l'hôte du site, l'hôte WebDAV, l'API de gestion de Supabase et le projet de production.
Absentes de cet environnement, toujours : `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `SEND_EMAIL_HOOK_SECRET`, `MODE_EMAIL`.

### 2.4 Adresse de contact (PO, P8)

P6 et P7 sans objet pendant la beta (45.36) ; l'adresse de contact reste le moyen des demandes de suppression des données (§ 8).

### 2.5 Après la première publication seulement (PO, 45.18, 45.24)

Créer **à la main**, depuis l'application publiée :
- le **parent de test de la production** (adresse du PO, mot de passe dédié) ;
- son seul profil, **« Pilote »**, niveau CP.

Les scénarios `@production` et la tâche planifiée du § 7 s'en servent. Aucune autre donnée de test n'existe en production (`seed.sql` n'y est jamais appliqué).

## 3. Publier une version

Toujours dans cet ordre. Au premier échec, on s'arrête, on corrige sur `main` et on reprend à l'étape 3.1 sur le nouveau commit.

Rien ne part en ligne sans non-régression E2E complète verte sur **le commit publié** (décision 0023). Cette non-régression se fait **avant** la publication, dans une session de **développement** (§ 3.1), pas dans la session de publication.

### 3.1 Vérifications sur le commit publié (session de développement, avant la publication)

Dans une session de **développement**, contre `savanturier-dev`, sur le commit à publier :

```
deno test --permit-no-files supabase/functions/
deno lint --permit-no-files supabase/functions/ && deno fmt --check --permit-no-files supabase/functions/
npx tsc --noEmit
python3 -m pytest scripts/tests
```

**Non-régression E2E complète, verte sur les deux projets (`tablette` et `telephone`), sur le commit publié**, avec toutes les stories livrées (le tableau des commandes de `CLAUDE.md` donne la ligne, avec les exclusions `@depend-de`, `@envoi-email`, `@hors-beta`). Les scénarios `@production` et `@pwa` en sont exclus par la configuration principale.

Tests de la PWA sur le build de production (ligne « Tests E2E de la PWA » de `CLAUDE.md`), toujours contre `savanturier-dev`.

La **session de publication** ne relance pas ces tests : elle vérifie seulement que **ce commit est vert** (lien vers le résultat publié de la session de développement ou de la PR) et que `git rev-parse HEAD` est bien ce commit. Un commit sans résultat vert, on ne publie pas.

### 3.2 Projet actif (V12)

Le contrôle du projet (`controles_production.py`, § 3.8) échoue si le projet est en pause. Si le projet est en pause, le **réveiller** (§ 7) et attendre qu'il réponde, avant de continuer.

### 3.3 Sauvegarde manuelle (PO, P12, M2, 45.34)

L'offre Free n'a pas de sauvegarde automatique : **avant chaque publication**, le PO sauvegarde la base de production **sur sa machine**, jamais dans le dépôt ni dans le conteneur (elle contient des données d'enfants). Avec la CLI Supabase (`supabase db dump --db-url <chaîne de connexion du projet>`), trois fichiers :

```
supabase db dump --db-url "$URL_DE_LA_BASE" -f roles.sql  --role-only
supabase db dump --db-url "$URL_DE_LA_BASE" -f schema.sql
supabase db dump --db-url "$URL_DE_LA_BASE" -f data.sql    --use-copy --data-only
```

(`$URL_DE_LA_BASE` : chaîne de connexion du tableau de bord, mot de passe de la base inclus ; elle reste dans le terminal du PO.)

La sauvegarde est **notée au journal des publications** (date, emplacement sur la machine du PO, jamais son contenu) et **gardée 30 jours**, puis effacée (45.34). Pendant la beta (45.36), les familles en sont informées par l'invitation (P11) et par la réponse écrite au parent.

### 3.4 Migrations (45.22)

Seulement **additives** pendant la beta. Une migration publiée ne se défait pas.

```
python3 scripts/exploitation/migrations.py
```

Le script lit les versions déjà appliquées dans `supabase_migrations.schema_migrations` par l'API de gestion, applique dans l'ordre les seules migrations manquantes et les enregistre. Il refuse de démarrer si `SUPABASE_SERVICE_ROLE_KEY` est présente. Ne jamais lancer `supabase db reset` ni appliquer `seed.sql` en production.

### 3.5 Edge Functions et secrets

Déployer chaque fonction, par l'API de gestion, vers le projet de production (le jeton est lu dans `SUPABASE_ACCESS_TOKEN`) :

```
for f in creer-profil-enfant creer-une-lecon-personnelle inscrire-le-parent modifier-profil-enfant \
         reinitialiser-le-mot-de-passe supprimer-une-lecon-personnelle terminer-la-seance \
         terminer-la-seance-de-revision terminer-le-test-de-depart; do
  npx supabase functions deploy "$f" --project-ref "$SUPABASE_PRODUCTION_REF" --use-api
done
```

La liste est celle des dossiers de `supabase/functions/` **sans `envoyer-email`** : aucun e-mail n'est envoyé pendant la beta (décision 0019, 45.5). Si une nouvelle fonction est ajoutée au dépôt, l'ajouter à la liste (sauf `envoyer-email`).

Secrets des fonctions (noms seulement ici) :
- `ORIGINES_AUTORISEES` = l'adresse de production **seule**, sans `/` final (pas de `localhost`) ;
- **ni** `ANTHROPIC_API_KEY` (pas encore d'IA), **ni** `MODE_EMAIL` (`boite-de-test` est interdit en production), **ni** `SEND_EMAIL_HOOK_SECRET`.

```
npx supabase secrets set ORIGINES_AUTORISEES="${ADRESSE_DE_PRODUCTION%/}" --project-ref "$SUPABASE_PRODUCTION_REF"
```

Les fonctions sont appelées dans la région `eu-west-1` : le front fixe l'en-tête `x-region` à chaque appel (C12), et le contrôle V3 lit `x-sb-edge-region` dans la réponse.

### 3.6 Configuration d'Auth

**Ne pas utiliser `supabase config push` vers la production.** `supabase/config.toml` décrit le développement (adresses en `localhost`, hook `send_email` écrit en dur sur `savanturier-dev`) : un `config push` pousserait aussi ce hook vers la production, et l'adresse d'un vrai parent serait envoyée au projet de développement.

À la place, appliquer le corps produit par `auth_de_production.configuration_d_auth` (adresse du site et adresses de retour sur l'adresse de production, inscriptions publiques fermées, confirmations désactivées, mot de passe de 8 caractères au moins, hook `send_email` désactivé) par l'API de gestion. Aucun point d'entrée dédié n'existe : cette commande d'une ligne l'utilise, sans aucune valeur écrite en dur.

```
PYTHONPATH=scripts python3 -c "import os; from exploitation.auth_de_production import configuration_d_auth as c; from exploitation.client_http import ClientHttp as H; r = H().envoyer('PATCH', 'https://api.supabase.com/v1/projects/' + os.environ['SUPABASE_PRODUCTION_REF'] + '/config/auth', {'Authorization': 'Bearer ' + os.environ['SUPABASE_ACCESS_TOKEN']}, c(os.environ['ADRESSE_DE_PRODUCTION'])); print(r.statut)"
```

Elle affiche le statut HTTP (200 attendu) et rien d'autre. Les contrôles V6 et V7 (§ 3.8) relisent ensuite la configuration.

### 3.7 Front, par WebDAV (45.33)

**Build de production et V1, en dernier**, juste avant l'envoi : le projet de production n'est posé que pour cette commande.

```
VITE_SUPABASE_URL=$SUPABASE_PRODUCTION_URL VITE_SUPABASE_ANON_KEY=$SUPABASE_PRODUCTION_ANON_KEY npm run build
python3 scripts/exploitation/secrets_du_build.py dist      # V1
```

V1 échoue si `dist/` contient une clé `service_role`, un nom de secret interdit, un jeton de gestion, ou `profil-prepare`. Seules l'adresse du projet et la clé publique `anon` sont permises. Au premier échec, on n'envoie rien.

Puis l'envoi :

```
python3 scripts/exploitation/envoi_webdav.py dist
```

Le script crée les dossiers (`MKCOL`), envoie `/assets/` d'abord, puis le reste, **`index.html` et `sw.js` en dernier** : aucune page servie ne vise un fichier pas encore envoyé. Il refuse un `dist/` construit pour le développement et une adresse WebDAV qui ne commence pas par `https://`.

**Repli** si WebDAV échoue : le PO envoie `dist/` (construit au § 3.7, copié sur sa machine) avec `rsync -av --delete-after dist/ <compte>@ssh-<compte>.alwaysdata.net:www/`, **`--delete-after`** pour ne retirer les anciens fichiers qu'une fois les nouveaux en place.

### 3.8 Contrôles après publication

```
env -u SUPABASE_SERVICE_ROLE_KEY python3 scripts/exploitation/controles_production.py
```

Il lit la production sans rien écrire (V2 RLS, V3 région, V4 en-têtes et redirection HTTPS, V5 origines autorisées, V6 hook et `MODE_EMAIL`, V7 Auth, V8 secrets, V9 aucune donnée de test, V10 tâche planifiée active et sans échec, V11 version du service worker servi, V12 projet actif). Code de sortie non nul au premier écart.

Puis les scénarios `@production`, sur `tablette` et `telephone`, sans la clé `service_role` :

```
env -u SUPABASE_SERVICE_ROLE_KEY npx bddgen -c playwright.production.config.ts && \
env -u SUPABASE_SERVICE_ROLE_KEY npx playwright test -c playwright.production.config.ts
```

Ces scénarios n'écrivent qu'une séance terminée du profil « Pilote » (parent de test). Ils ne tournent jamais dans les exécutions courantes.

### 3.9 Journal des publications

Le PO (ou la session, qui le lui transmet) ajoute une ligne à son journal, **hors du dépôt** s'il y met un emplacement de sauvegarde : date, commit publié, emplacement de la sauvegarde (sans son contenu), résultat de chaque contrôle (V1, lien du résultat vert E2E et PWA, V2 à V12, `@production`). Le contrôle manuel sur tablette (M1) est fait par le PO après la première publication, puis après une petite version pour vérifier qu'elle s'applique au lancement suivant sans recharger l'écran de l'enfant.

## 4. Première publication

Ce qui change la première fois :

1. **Projet vide** : le § 3.4 applique toutes les migrations. Pas de sauvegarde à faire avant (rien à sauvegarder), mais la restauration d'essai ci-dessous se fait après quelques données.
2. **`.htaccess`** : vérifier que le fichier publié avec `dist/` est bien lu par alwaysdata (V4 : les en-têtes `no-cache`, `immutable` et HSTS sont présents). Si le serveur refuse la directive `<If>` (erreur 500 sur `/assets/`), la remplacer : retirer le bloc `<If>` du `.htaccess` à la racine et placer dans `assets/` (donc dans `public/assets/`) un `.htaccess` contenant `Header set Cache-Control "public, max-age=31536000, immutable"`. Si `.htaccess` n'est pas lu du tout, les réglages se font dans l'interface du site : le noter à la décision 0025.
3. **Parent de test et profil « Pilote »** : créés à la main (§ 2.5), puis lancer les scénarios `@production`.
4. **Restauration d'essai (PO, M2, 45.32)**, avant d'inviter les familles, **sur la machine du PO** et nulle part ailleurs (ni production, ni `savanturier-dev`) : installer Docker, `supabase start` ; restaurer avec `psql --single-transaction --file roles.sql --file schema.sql --file data.sql --dbname postgresql://postgres:postgres@127.0.0.1:54322/postgres` ; comparer le **nombre** de parents, de profils et de séances terminées avec ceux de la production au moment de la sauvegarde ; puis effacer : `supabase stop --no-backup`, et supprimer les fichiers de la sauvegarde d'essai.
5. **Retour en arrière du front essayé une fois** (§ 5) et **demande de suppression essayée sur un parent de test** (§ 8, M4).
6. **Tâche planifiée** (§ 7), créée **après** cette première publication.
7. Inviter les familles seulement ensuite (P11) : le PO leur donne l'adresse à la main.
   *Recommandation au PO (pas une obligation nouvelle)* : l'invitation donne aussi l'adresse de contact pour une demande de suppression des données, le délai de 7 jours (45.15) et la garde des sauvegardes (30 jours, 45.34). Pendant la beta, c'est le seul canal d'information (45.36).

## 5. Retour en arrière

| Quoi | Comment |
|---|---|
| **Front** | republier le `dist/` du commit précédent : `git checkout <commit précédent>`, reconstruire (§ 3.7, mêmes variables), puis `envoi_webdav.py dist`. Le service worker de l'ancienne version est servi au lancement suivant |
| **Edge Functions** | redéployer le commit précédent (§ 3.5 depuis ce commit) |
| **Migrations** | **aucun retour automatique pendant la beta** (45.22) : elles sont additives. La **sauvegarde du § 3.3 est le seul recours** ; sa restauration en production est une décision du PO, jamais automatique |

Après un retour en arrière, refaire les contrôles du § 3.8 et noter l'incident au journal des publications.

## 6. Erreurs en production (C16, 45.8)

Aucun service tiers (aucun traceur, aucun service d'analyse). La session de publication, ou le PO :
- lit les **journaux des Edge Functions** (tableau de bord Supabase, « Edge Functions » > « Logs », ou l'API de gestion) **après chaque publication** et **une fois par jour** : erreurs 5xx, erreurs de CORS, appels refusés ;
- relève dans le tableau de bord les **quotas de l'offre Free** (base, trafic, invocations) et le **nombre de parents** (aucune limite d'inscriptions en 45a, 45.20) ;
- lit les retours des familles reçus à l'adresse de contact.

Une anomalie devient une issue GitHub, sans donnée d'enfant ni adresse e-mail.

## 7. Projet en pause (offre Free) et tâche planifiée qui le garde actif (45.31, 45.35)

Un projet Free est mis en **pause après environ une semaine sans activité** : une famille revenant de vacances ne pourrait plus se connecter ni enregistrer de séance (l'application installée s'ouvre, mais rien ne se synchronise). Supabase prévient par e-mail avant la pause.

**Ce que Supabase compte comme activité** : des requêtes à la base (les appels de l'API en font partie). Une tâche pg_cron interne n'est pas garantie de compter. D'où `garder_actif.py` : il connecte le parent de test puis **lit le profil « Pilote » sous la RLS avec le JWT de ce parent**. Aucune donnée d'enfant autre que ce profil fictif n'est lue, rien n'est affiché de ce qui est lu, la clé `service_role` n'est jamais utilisée.

### Tâche planifiée Claude

Créée par une session Claude **après la première publication** (le parent de test doit exister), **tous les 2 jours, la nuit** (par exemple 03:00 UTC). L'environnement de la tâche contient `SUPABASE_PRODUCTION_URL`, `SUPABASE_PRODUCTION_ANON_KEY`, `PARENT_DE_TEST_PRODUCTION_EMAIL`, `PARENT_DE_TEST_PRODUCTION_MOT_DE_PASSE` (et le réseau vers le projet de production), pas d'autre secret. **Texte du prompt, à reproduire tel quel** (il ne contient aucun secret) :

```
Dépôt Savanturier, branche main à jour. Lance : python3 scripts/exploitation/garder_actif.py
Ce script connecte le parent de test de la production puis lit son profil fictif, pour garder le projet Supabase Free actif.
Les identifiants sont dans l'environnement : ne les affiche jamais, ne les écris nulle part.
Si le code de sortie est 0, réponds seulement « Projet de production actif » et la date.
S'il est différent de 0, recopie les messages du script (ils ne contiennent aucun secret) et ouvre une issue GitHub « [Exploitation] Le projet de production ne répond pas », sans aucune donnée d'enfant ni adresse e-mail.
Ne lis, ne modifie et ne supprime aucune autre donnée. N'utilise aucune clé service_role. Ne publie rien.
```

Le script refuse de démarrer si `SUPABASE_SERVICE_ROLE_KEY` est présente. Quand la tâche signale un échec, réveiller le projet (ci-dessous).

### Réveil manuel, en secours (M5)

Depuis le tableau de bord de Supabase : ouvrir le projet, **« Restore project »**, attendre qu'il redevienne actif, puis relancer `controles_production.py` (V12). Le PO l'essaie **une fois** avant d'inviter les familles ; l'application installée sur sa tablette doit fonctionner à nouveau ensuite, sans réinstallation. Un projet en pause depuis plus longtemps que la période de restauration de l'offre ne se réveille plus : c'est une raison de plus de passer à Pro (45b).

## 8. Traitement d'une demande de suppression des données (C15, 45.15, 45.16)

Pendant la beta, ni #13 ni #14 : la demande passe par écrit, à l'adresse de contact. Terminologie : le parent fait une **demande de suppression des données**, l'équipe en fait le **traitement** (ce n'est pas la « Suppression du profil » de #14, action du parent dans l'application, dont l'effet doit être exactement le même).

### 8.1 Avant de toucher à la base

1. **Vérifier que la demande vient de l'adresse du compte du parent** (l'adresse expéditrice est celle du compte, pas une autre). Sinon : répondre à l'adresse du compte pour confirmer, ne rien supprimer.
2. **Délai : sous 7 jours** après la demande.
3. Identifier le parent par son **identifiant technique** (`id` dans Auth, retrouvé à partir de son adresse dans le tableau de bord Supabase). Les requêtes ci-dessous prennent un identifiant, **jamais un prénom**.
4. Préciser avec le parent ce qu'il demande : un seul profil, ou tout son compte.

### 8.2 Les requêtes

Elles se lancent par l'API de gestion (`POST /v1/projects/{ref}/database/query`, jeton de `SUPABASE_ACCESS_TOKEN`) ou dans l'éditeur SQL du tableau de bord. Remplacer `:parent` et `:profil` par l'identifiant (uuid) **entre apostrophes** (`'<uuid>'`) ; ne jamais le copier dans une issue.

**Comptage par table, avant et après** (sans contenu), pour un **profil** (`'<uuid>'` : l'identifiant du profil, entre apostrophes) :

```sql
select 'profils_enfants' as table_, count(*) from public.profils_enfants where id = '<uuid>'::uuid
union all select 'rattachements', count(*) from public.rattachements where profil = '<uuid>'::uuid
union all select 'seances_terminees', count(*) from public.seances_terminees where profil = '<uuid>'::uuid
union all select 'questions_des_seances', count(*) from public.questions_des_seances q join public.seances_terminees s on s.id = q.seance where s.profil = '<uuid>'::uuid
union all select 'resultats_des_lecons', count(*) from public.resultats_des_lecons where profil = '<uuid>'::uuid
union all select 'records_de_fluence', count(*) from public.records_de_fluence where profil = '<uuid>'::uuid
union all select 'resultats_des_tests_de_depart', count(*) from public.resultats_des_tests_de_depart where profil = '<uuid>'::uuid
union all select 'tests_de_depart_comptes', count(*) from public.tests_de_depart_comptes where profil = '<uuid>'::uuid
union all select 'files_de_revision', count(*) from public.files_de_revision where profil = '<uuid>'::uuid
union all select 'questions_retenues', count(*) from public.questions_retenues where profil = '<uuid>'::uuid
union all select 'seances_de_revision_terminees', count(*) from public.seances_de_revision_terminees where profil = '<uuid>'::uuid
union all select 'lecons_personnelles', count(*) from public.lecons_personnelles where profil = '<uuid>'::uuid;
```

Pour un **parent**, **relever avant la suppression** la liste des identifiants de ses profils, puis faire les comptages avant **et** après sur cette liste littérale (après la suppression, `rattachements` ne permet plus de la retrouver) :

```sql
select profil from public.rattachements where parent = '<uuid du parent>'::uuid;
```

Même requête de comptage avec `profil in ('<uuid 1>'::uuid, '<uuid 2>'::uuid)` à la place de `= '<uuid>'::uuid` (et `id in (…)` pour `profils_enfants`), plus `select 'utilisateur', count(*) from auth.users where id = '<uuid du parent>'::uuid`. Relever aussi les profils dont ce parent est le **seul** parent (un profil avec deux parents survit au départ de l'un, décision 0014) : ce sont ceux dont les lignes doivent tomber à 0 ; les autres restent.

**(a) Supprimer un profil** (les données suivent par cascade) :

```sql
delete from public.profils_enfants where id = '<uuid>'::uuid;
```

**(b) Supprimer le compte du parent** :

```sql
delete from auth.users where id = '<uuid du parent>'::uuid;
```

**Cascade** (décision 0014) : la suppression de l'utilisateur supprime ses rattachements, puis chaque profil dont il était le **dernier** parent, puis toutes les données de ces profils (séances terminées et leurs questions, résultats des leçons, records de fluence, tests de départ et leurs comptes, file de révision, questions retenues, séances de révision, leçons personnelles). Les essais de réinitialisation liés à son adresse s'effacent seuls sous 24 h (tâche planifiée).

### 8.3 Après

1. Relancer le même comptage, sur la **même liste littérale** de profils : **toutes les lignes à 0** (pour un parent, seuls les profils dont il était le dernier parent ; les profils partagés avec un autre parent restent, comptés à part). Sinon, ne pas répondre : corriger et en faire une issue sans donnée.
2. Vérifier qu'**aucun autre parent** n'est touché (nombre de parents et de profils avant/après : écart égal à ce qui était demandé).
3. **Répondre par écrit au parent**, à l'adresse de son compte : ce qui a été supprimé, la date, et ce qui **reste sur ses appareils** : le choix Son/Muet et le choix de la voix (stockage local du navigateur) ; la liste des profils du parent (prénom ou pseudo, classe, réglages) et les séances, tests de départ et séances de révision pas encore envoyés (IndexedDB) ; le service worker ne garde aucune donnée de famille (#8). Il peut les effacer en se déconnectant (la liste des profils et ce qui n'est pas encore envoyé ; le choix Son/Muet et la voix restent), en supprimant les données du site dans les réglages du navigateur, et en désinstallant l'application de l'écran d'accueil. Les données déjà envoyées à Supabase sont, elles, supprimées par le traitement.
4. **Registre des demandes**, tenu par le PO **hors de la base de production** : date de la demande, date du traitement, identifiant technique. Ni prénom, ni contenu.
5. **Sauvegardes** : une sauvegarde faite avant le traitement contient encore les données effacées. Elle est gardée **30 jours** puis effacée (§ 3.3) ; pendant la beta (45.36), les familles en sont informées par l'invitation (P11) et par la réponse écrite au parent.

Le script de traitement est prévu en 45b (C15) ; en attendant, ce sont ces requêtes.

## 9. Dettes de #72 gardées pendant la beta (C18)

Rappel court de ce qui est gardé jusqu'à 45b (décisions 45.13, 45.14, 45.20, 45.21) :
- la beta est **sur invitation** ; aucune limite d'inscriptions (le PO surveille le nombre de parents, § 6) ;
- la **réinitialisation du mot de passe par le prénom d'un enfant** est gardée jusqu'à 45b, et **retirée avant toute ouverture au public** (0019), avec la fonction `reinitialiser-le-mot-de-passe` ;
- pas de limite d'essais de connexion propre à l'application : seule celle de Supabase Auth ;
- `service_role` reste utilisé dans `inscrire-le-parent`, `reinitialiser-le-mot-de-passe`, `terminer-la-seance`, `terminer-le-test-de-depart` (décisions 0016 et 0019) : jamais exposé au front, vérifié par V1 ;
- `lienRefuse` / `arriveParLeLien` et les scénarios `@hors-beta` restent jusqu'à 45b ; le lien et le code de connexion ne sont pas rétablis ;
- aucun e-mail : le hook `send_email` est désactivé en production et `envoyer-email` n'est pas déployée.

Avant l'ouverture au public (45b) : e-mails d'un fournisseur européen, retrait de la réinitialisation par prénom, limites d'inscriptions et d'essais, passage à Supabase Pro, domaine définitif (annoncé aux familles : réinstallation et reconnexion), CI de publication.
