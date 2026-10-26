# 0025 : Hébergement de la beta : alwaysdata gratuit, Supabase Free en Irlande, publication par une session dédiée

**Statut** : Acceptée · 2026-10-26 (réponses du PO du 25 et du 26/10, story #45)

## Contexte

Le PO veut mettre la beta en ligne sans dépense (« je veux une solution gratuite »), avec des données d'enfants gardées dans l'UE, sur invitation, sans aucun e-mail (0019). Aucun domaine n'est acheté. La story #45 (45a) livre la procédure `docs/publication.md` et les scripts d'exploitation.

## Décision

1. **Front chez alwaysdata, offre gratuite** (environ 100 Mo), site « Fichiers statiques », à l'**adresse gratuite** `<compte>.alwaysdata.net`. Les en-têtes de cache, le renvoi des adresses inconnues vers `index.html` (0021) et HSTS d'un an sans « preload » passent par `public/.htaccess` ; « Forcer HTTPS » est une option du site.
2. **Supabase Free, `eu-west-1`**, projet distinct de `savanturier-dev` (0010 n°3). Pas de sauvegarde automatique : **sauvegarde manuelle avant chaque publication**, faite par le PO sur sa machine, **gardée 30 jours** (45.34), restauration d'essai sur une base locale (`supabase start`, 45.32).
3. **Tâche planifiée Claude contre la pause du projet Free** (45.31, 45.35) : tous les 2 jours la nuit, `garder_actif.py` connecte le parent de test et lit son profil fictif sous la RLS. Aucun secret dans le prompt.
4. **Publication par une session dédiée** (45.33), créée après les réglages d'environnement du PO, qui donnent seuls le réseau et les variables. Le front part par **WebDAV** (`envoi_webdav.py`) ; repli : `rsync` depuis la machine du PO. Le compte alwaysdata et le projet Supabase sont créés par le PO.
5. **Scripts d'exploitation en Python, bibliothèque standard seulement** (`scripts/exploitation/`, tests pytest) : ce n'est pas du code métier. Chaque vérification est une fonction pure testée ; les appels HTTP passent par un petit client remplacé par un faux dans les tests.
6. **Migrations de production par l'API de gestion** (`migrations.py`), additives seulement (45.22) : le conteneur n'a pas accès direct à Postgres (0010).
7. **Auth de production par l'API de gestion** (`PATCH /v1/projects/{ref}/config/auth`), **pas de `supabase config push`** : `config.toml` décrit le développement et pousserait le hook `send_email` de dev vers la production.
8. **Edge Functions appelées en `eu-west-1`** : l'en-tête `x-region` est fixé par le front à chaque appel (aucun réglage par projet n'existe) et autorisé en CORS ; la région servie est lue dans `x-sb-edge-region` (V3).
9. Aucune fonction `envoyer-email` déployée, aucun `MODE_EMAIL`, aucun `ANTHROPIC_API_KEY`, aucune clé `service_role` dans l'environnement de publication.

## Options écartées

- **Hébergeur payant ou domaine acheté** : contraire au souhait du PO ; reporté à 45b.
- **Tâche planifiée GitHub Actions** contre la pause (option A de 45.31) : le PO a choisi une tâche Claude (B).
- **`supabase config push` vers la production** : voir point 7.
- **Restauration d'essai sur la production ou `savanturier-dev`** : jamais de données d'enfants hors de la production (0010 n°3).
- **Publication par la CI** : reportée à 45b (45.7).

## Conséquences

- Changer d'adresse plus tard oblige chaque famille à réinstaller l'application et à se reconnecter (risque accepté, 45.2).
- La tâche Claude consomme la limite d'usage et dépend du réseau de la session vers la production ; le réveil manuel depuis le tableau de bord reste le secours.
- Les certitudes sur alwaysdata (lecture de `.htaccess`, directive `<If>`, WebDAV, SSH sur l'offre gratuite) sont à confirmer par la première publication ; la procédure donne le repli de chaque cas.
- Avant l'ouverture au public (45b) : Supabase Pro (sauvegardes, pas de pause), domaine définitif, fournisseur d'e-mails européen, CI.
