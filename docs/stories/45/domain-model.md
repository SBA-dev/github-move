# #45 : Mise en ligne de Savanturier

**État : validé par le PO le 2026-10-25** (commentaire `[Responsable] VALIDÉ` sur #45, 17:48 UTC). Les questions 45.1 à 45.22 ont chacune leur décision, plus bas ; les questions 45.23 à 45.30 sont tranchées dans `acceptance.md`.

Story transverse, lot 7 (Bascule), dernière du chemin critique de la beta. Cadrage du 2026-10-25, sans code. Le code de 45a se fait en fin de chemin critique ; la partie configuration (C1 à C16) peut commencer plus tôt si une place se libère.

**Choix de la beta, en bref** : front chez **alwaysdata** (offre gratuite, environ 100 Mo), à **l'adresse gratuite d'alwaysdata** (par exemple `savanturier.alwaysdata.net`), sans domaine acheté ; **Supabase Free** en **Irlande (`eu-west-1`)**, avec une **sauvegarde manuelle avant chaque publication** ; aucun e-mail (45b) ; beta **sur invitation**. Passage à Supabase Pro avant l'ouverture au public.
Entrées : issue #45 et le commentaire `[Responsable]` du 2026-10-25 (décision du PO : #13 et #14 sortent de la beta, suppression des données à la main sur demande écrite du parent), décisions 0001, 0002, 0009, 0010, 0011, 0014, 0019, 0021, 0022, dettes de #72 (PR #83, `docs/stories/72/journal.md`), #8 (`docs/stories/8/`).

## Contexte

**Story d'infrastructure.** Elle ne crée **aucun agrégat, aucune commande ni aucun événement de domaine** dans le code. Elle touche :

| Contexte | Ce que #45 y change |
|---|---|
| Famille | configuration d'Auth en production (adresse du site, adresses de retour, inscriptions publiques fermées, hook d'e-mail), sort des dettes de #72, procédure de suppression des données à la main (hors application) |
| Accompagnement | rien en 45a : #38 n'est pas dans la beta en ligne (45.17), l'expiration des enregistrements de lecture passe en 45b ou avec #38 |
| Tous | publication : migrations, Edge Functions, front ; aucun changement de règle |

**Concepts examinés** :

- **Demande de suppression des données** : concept **métier mais hors application** pendant la beta. Le parent l'écrit (adresse de contact de la politique de confidentialité) ; l'équipe l'exécute à la main. Elle n'a ni agrégat ni écran : c'est une **procédure** écrite dans `docs/`, avec un script d'exploitation. Son effet doit être **exactement** celui de la future **Suppression du profil** (#14) ou de la suppression du compte du parent (décision 0014), pour que #14 la remplace sans changer la promesse faite aux familles. Terme présent au glossaire.
- **Production**, **procédure de publication**, **politique de confidentialité**, **mentions légales** : termes d'exploitation ou juridiques, utiles dans les docs, les issues et l'interface (liens en pied de page). Ce ne sont pas des concepts du domaine : rien dans `domain/`.
- **Beta** : déjà employé partout (feuille de route, décision 0019, tag `@hors-beta`) ; présent au glossaire (section Exploitation).

Conflit de langage à éviter : « suppression à la main » ne doit pas devenir un second sens de **Suppression du profil** (#14 : action du parent dans l'application, immédiate). On parle de **demande de suppression des données** (ce que fait le parent) et de son **traitement** (ce que fait l'équipe).

## Ce que le PO fait lui-même

Décisions et comptes qu'aucune équipe ne peut prendre à sa place. Les éléments marqués **[beta]** bloquent la mise en ligne de demain.

| # | À faire | Pourquoi | Bloquant |
|---|---|---|---|
| P1 | **Créer le compte alwaysdata gratuit** (offre gratuite, environ 100 Mo) et y créer le site du front (45.1) | HTTPS, en-têtes de cache, renvoi des adresses inconnues vers `index.html` (0021) ; aucun coût | [beta] |
| P2 | **Pas de domaine pendant la beta** : choisir le nom du compte alwaysdata, qui donne l'adresse de production (par exemple `savanturier.alwaysdata.net`) (45.2). Ce nom ne doit plus changer pendant la beta : changer d'adresse oblige chaque famille à réinstaller l'application et à se reconnecter (risque accepté par le PO) | adresse stable pour la beta, installation sur l'écran d'accueil liée à l'origine (#8) | [beta] |
| P3 | **Créer le projet Supabase de production** en **Irlande (`eu-west-1`)**, distinct de `savanturier-dev` (45.3, 45.4) | 0010 n°3 : jamais de données d'un vrai enfant sur le projet de développement | [beta] |
| P4 | Prendre l'**offre Supabase Free**, sans coût (45.3), en connaissant ses limites : **pause du projet après environ une semaine sans activité**, pas de sauvegarde automatique, quotas (environ 500 Mo de base, 1 Go de fichiers, 5 Go de trafic par mois). **Désigner qui réveille le projet** s'il est en pause, et comment on le voit (voir « Risques ») ; passer à Pro avant l'ouverture au public | une famille ne doit pas trouver l'application en panne après une semaine de vacances | [beta] |
| P5 | Fournir à la session de publication les **accès au projet de production** (référence, jeton de gestion) sans les écrire dans le dépôt, et autoriser l'adresse alwaysdata et le projet de production dans le proxy du conteneur (45.29) | migrations, déploiement des fonctions, contrôles après publication | [beta] |
| P6 | **Politique de confidentialité** : relire et compléter le brouillon de l'équipe (45.9) : responsable, données gardées, finalité, hébergement UE (alwaysdata pour le front, Supabase en Irlande pour les données), durée, absence de traceur, droits, **moyen de faire une demande de suppression des données** et son délai de 7 jours (45.15) | RGPD, commentaire du PO du 25/10 | [beta] |
| P7 | **Mentions légales** : éditeur, directeur de publication, hébergeur (alwaysdata : nom, adresse ; Supabase pour les données) | obligation légale d'un site édité en France | [beta] |
| P8 | **Adresse de contact** pour les demandes (boîte e-mail qu'il lit) | moyen écrit de la demande | [beta] |
| P9 | Choisir un **fournisseur d'e-mails européen avec offre gratuite** et une adresse d'expéditeur (45.5) | réinitialisation par e-mail | après la beta (45b) |
| P10 | **Contrôle manuel sur une vraie tablette** (et un téléphone) sur l'adresse de production | voir « Vérification finale » | [beta] |
| P11 | Dire **qui a accès** à la beta et inviter les familles, en leur donnant l'adresse à la main (beta sur invitation, 45.13) | risque accepté de 0019, pas de limite d'inscriptions (45.20) | [beta] |
| P12 | **Sauvegarde manuelle de la base de production avant chaque publication** (l'offre Free n'a pas de sauvegarde automatique), et **une restauration d'essai** de cette sauvegarde, au moins une fois avant d'inviter les familles. Faites par le PO ou par une session qui a accès à Postgres (le conteneur cloud n'y a pas accès, 0010) ; outil exact écrit dans la procédure (par exemple la CLI Supabase, à vérifier). La sauvegarde contient des données d'enfants : gardée hors du dépôt, sur une machine du PO, et la copie restaurée est effacée après l'essai (voir 45.32) | critère de l'issue ; seul moyen de revenir en arrière après une migration (45.22) | [beta] |

## Ce qu'une équipe peut coder

Chaque élément suit TDD/BDD comme une story ordinaire. **[beta]** = bloquant pour demain ; **[après]** = peut attendre (45b).

### Front et hébergement

| # | Travail | Bloquant |
|---|---|---|
| C1 | **Configuration d'alwaysdata dans le dépôt** : `sw.js` et `index.html` en `no-cache` ; `manifest.webmanifest`, `bibliotheque.json`, `programmes-index.json` revalidés ; `/assets/*` en cache long immuable ; `http://` redirigé vers `https://`, avec HSTS d'un an sans « preload » (45.23) ; toute adresse inconnue sert `index.html` (0021). Sur alwaysdata, ces réglages passent par un fichier **`.htaccess`** publié avec `dist/` (depuis `public/`) si le site est de type Apache servant des fichiers statiques ; le type « fichiers statiques » d'alwaysdata pourrait ne pas lire `.htaccess`, et la redirection vers HTTPS peut aussi être une option du site dans l'interface d'alwaysdata : **à vérifier par l'équipe**, et à écrire dans la procédure. Le build doit tenir dans le quota de l'offre gratuite (environ 100 Mo). Vérifié par un test (lecture des en-têtes de l'adresse publiée) | [beta] |
| C2 | **Police Andika auto-hébergée** pour le mode dys : `src/styles.css` la nomme déjà mais ne la charge pas (repli sur Trebuchet MS). Fichiers `woff2` sous licence libre (SIL OFL) servis par l'adresse de production, `@font-face`, ajout à la coquille du service worker pour le mode dys sans réseau. Pas de Lexend (45.6) | [beta] (45.6) |
| C3 | **Aucun Google Fonts** : la cible n'en charge aucun aujourd'hui (vérifié : `index.html`, `src/`). Le test C4 le garantit pour l'avenir. `app/` et `prototype/` ne sont pas publiés (45.12) | [beta] via C4 |
| C4 | **Scénario E2E des origines appelées** : en ouvrant Savanturier, en se connectant et en jouant une séance, toute requête part vers l'origine du front ou celle du projet Supabase configuré ; aucune autre. Tourne aussi contre la production (compte de test du PO, 45.18, 45.24) | [beta] |
| C5 | **Pages légales dans le front** : « Politique de confidentialité » et « Mentions légales », accessibles sans connexion (écran de connexion et Espace parent), textes du PO (P6, P7), 360 px, sans lecture automatique à voix haute (écrans du parent, #73) | [beta] |
| C6 | **Recherche de secrets dans `dist/`** : script lancé après `npm run build`, échoue si le build contient une clé `service_role`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `SEND_EMAIL_HOOK_SECRET`, un jeton de gestion, ou `profil-prepare` (0021) ; seules l'adresse du projet et la clé publique `anon` sont permises | [beta] |

### Supabase de production

| # | Travail | Bloquant |
|---|---|---|
| C7 | **Configuration d'Auth par projet** : `supabase/config.toml` ne décrit aujourd'hui que le développement (`site_url` et adresses de retour sur `localhost`, **adresse du hook `send_email` écrite en dur sur `savanturier-dev`**). Il faut une configuration propre à la production (bloc par projet de la CLI, à vérifier, sinon réglage écrit dans la procédure) : `site_url` et adresses de retour sur l'adresse de production (alwaysdata), inscriptions publiques fermées, confirmations désactivées (0019), longueur minimale 8 | [beta] |
| C8 | **Hook « Send Email » désactivé en production pendant la beta**, et `MODE_EMAIL=boite-de-test` **interdit** en production : sinon l'adresse d'un vrai parent pourrait être rangée dans la boîte de test (0011). La procédure le vérifie | [beta] |
| C9 | **Secrets des Edge Functions de production** : `ORIGINES_AUTORISEES` = adresse de production (alwaysdata) seulement (pas `localhost`) ; aucun `ANTHROPIC_API_KEY` tant que l'IA n'est pas là ; `.env.example` complété (`ORIGINES_AUTORISEES` y manque) | [beta] |
| C10 | **Vérification de la RLS** : requête qui liste les tables de `public` sans RLS active, et les tables sans policy (liste fermée, 45.27 : `boite_de_test_emails`, `essais_de_reinitialisation`, `tests_de_depart_comptes`) ; elle échoue sur toute autre. Lancée sur dev puis sur production | [beta] |
| C11 | **Tâches planifiées** (pg_cron) actives en production : effacement des essais de réinitialisation oubliés (24 h, 0019 n°6). L'expiration des enregistrements de lecture vient avec #38, hors de la beta en ligne (45.17). Une tâche planifiée ne compte pas comme activité contre la pause de l'offre Free (à vérifier) | [beta] pour les essais ; avec #38 pour les enregistrements |
| C12 | **Région Irlande (`eu-west-1`)** : le projet de production y est créé (P3) ; les Edge Functions sont fixées dans la même région (réglage du projet ou option de région à l'appel, à vérifier dans la doc Supabase, y compris en offre Free) et vérifiées (en-tête de réponse) | [beta] (45.4) |
| C13 | **Aucune donnée de test en production** : `seed.sql` jamais appliqué ; aucun scénario E2E qui écrit (préparation par `service_role`) ne vise la production | [beta] |

### Procédure et exploitation

| # | Travail | Bloquant |
|---|---|---|
| C14 | **Procédure de publication** `docs/publication.md` : vérifications (unitaires, lint, format, typecheck, build, C6, non-régression E2E complète **verte sur le commit publié**, 0022) → projet de production réveillé s'il est en pause → **sauvegarde manuelle de la base** (P12) → migrations → Edge Functions et secrets → configuration d'Auth → front → contrôles après publication (C1, C4, C10, C12) ; **retour en arrière** (front : republier la version précédente ; fonctions : redéployer le commit précédent ; migrations : uniquement additives pendant la beta, pas de retour automatique) ; journal des publications (avec l'emplacement de la sauvegarde, sans son contenu) ; **réveil du projet en pause** (qui, comment, voir « Risques ») ; envoi du front sur alwaysdata (outil à préciser par l'équipe : SFTP, SSH ou rsync). Commandes ajoutées au tableau de `CLAUDE.md` | [beta] |
| C15 | **Procédure et script du traitement d'une demande de suppression des données** : voir plus bas | [beta] (procédure) ; script [après] (délai de 7 jours, 45.15) : en attendant, la procédure donne les requêtes à lancer |
| C16 | **Erreurs en production** : lecture des journaux des Edge Functions de Supabase après chaque publication et une fois par jour, écrite dans la procédure ; aucun service tiers (45.8). La même lecture quotidienne surveille les quotas de l'offre Free et le nombre de parents (45.20) | [beta] (doc seulement) |
| C17 | **CI GitHub Actions** (vérifications à chaque PR, publication à chaque merge) | [après] (45.7) |
| C18 | **Sort des dettes de #72** : voir plus bas | selon 45.13 et 45.14 |
| C19 | **Réinitialisation par e-mail** (le lien et le code de connexion ne sont pas rétablis, 45.21 : scénarios `@hors-beta` du lien supprimés), fournisseur d'e-mails européen avec offre gratuite (adaptateur « fournisseur européen » de 0011), limite d'essais de connexion propre à l'application (0019 n°8) | [après] (45b) |

### Traitement d'une demande de suppression des données (C15)

Pendant la beta, sans #13, un profil enfant n'a qu'**un** parent. La procédure couvre deux demandes :

1. **Supprimer le compte du parent** : supprimer l'utilisateur dans Supabase Auth. Par cascade (décision 0014), ses rattachements disparaissent, puis chaque profil dont il était le dernier parent, puis toutes les données du profil (séances terminées, questions des séances, résultats des leçons, records de fluence, résultats et comptes du test de départ). Les essais de réinitialisation de son adresse s'effacent seuls sous 24 h.
2. **Supprimer un seul profil enfant** : supprimer le profil ; ses données suivent par cascade.

Le script (exploitation, sous `scripts/` ou `supabase/`, avec test) prend l'identifiant du parent ou du profil, **jamais un prénom**, affiche ce qui sera effacé (nombres par table, sans contenu), demande confirmation, efface, puis vérifie qu'il ne reste rien. Ce qui n'est pas en base : Storage (rien avant #38), appareils (profil en cours, Son/Muet, choix de la voix dans le stockage local ; le service worker ne garde aucune donnée de famille, #8) : la réponse au parent lui dit comment les effacer sur ses appareils.

**Vérification de l'identité** : la demande doit venir de l'adresse e-mail du compte ; traitement **sous 7 jours**, réponse écrite au parent une fois fait (45.15). **Trace** : un registre des demandes traitées (date de la demande, date du traitement, identifiant technique) tenu **par le PO**, **hors** de la base de production, sans prénom ni contenu (45.16).

**Sauvegardes** : une sauvegarde manuelle faite avant le traitement contient encore les données effacées. La politique de confidentialité le dit, et la procédure dit combien de temps on garde une sauvegarde (à écrire avec P6).

### Dettes de #72 (C18)

| Dette | 45a (beta en ligne), décidé | 45b (après la beta) |
|---|---|---|
| `service_role` dans `inscrire-le-parent` | **gardé** : seule façon de créer un parent avec les règles du mot de passe (0019 n°3, n°5) | garder, ou passer à un hook « avant création d'un utilisateur » si l'inscription publique rouvre (à étudier) |
| `service_role` dans `reinitialiser-le-mot-de-passe` | **gardé** avec la fonction (45.14) | retirée avec la fonction |
| Réinitialisation par prénom d'un enfant (secret faible) | **gardée**, la beta étant sur invitation (45.13, 45.14) : le risque a été accepté « pour la beta » et « avant toute ouverture au public » (0019) | **retirée** (fonction, table, cas d'usage, écran), remplacée par la réinitialisation par e-mail ; nouvelle décision qui remplace 0019 |
| Aucune limite d'inscriptions | **aucune limite** (45.20) : le PO surveille le nombre de parents | limite par réseau ou plafond global, décidée avec l'ouverture au public |
| Pas de limite d'essais de connexion propre à l'application | limite de Supabase Auth seulement (0019 n°7) | décidée par 45b (0019 n°8) |
| Champs `lienRefuse` / `arriveParLeLien` de `useConnexion` | **rien** | **supprimés** : le lien de connexion n'est pas rétabli (45.21) |
| Tag `@hors-beta` | **gardé**, exclu comme aujourd'hui | scénarios du lien et du code de connexion supprimés (45.21) ; ceux de la réinitialisation par e-mail réécrits avec 45b ; scénarios `@envoi-email` restants relancés (verrou `email`) |
| `service_role` aussi dans `terminer-la-seance`, `terminer-le-test-de-depart`, `envoyer-email` | relevé pour la revue : usages déjà décidés (0016, 0011) ; la procédure vérifie qu'ils ne sont jamais exposés | inchangé |

## Risques de l'offre gratuite

| Risque | Effet | Parade |
|---|---|---|
| **Pause du projet Supabase Free** après environ une semaine sans activité | une famille revenant de vacances ne peut plus se connecter ni enregistrer ses séances ; l'application installée s'ouvre, mais rien ne se synchronise | une **activité au moins hebdomadaire** sur le projet (le PO ou le parent de test se connecte et joue une séance, comme les contrôles `@production`), **ou réveil manuel par le PO** depuis le tableau de bord de Supabase. Les deux sont écrits dans la procédure (C14), avec qui le fait (45.31). La procédure vérifie aussi que le projet est actif avant chaque publication |
| **Pas de sauvegarde automatique** | une erreur de migration ou de manipulation perd les données des familles | sauvegarde manuelle avant chaque publication et restauration d'essai (P12, M2) ; migrations uniquement additives (45.22) |
| **Quotas** (environ 500 Mo de base, 1 Go de fichiers, 5 Go de trafic par mois ; environ 100 Mo chez alwaysdata) | au-delà, service limité | lecture quotidienne du tableau de bord (C16) ; aucun fichier dans Storage pendant la beta (#38 et les MP3 sont hors 45a) ; passage à Pro avant l'ouverture au public |
| **Adresse alwaysdata provisoire** | un domaine acheté plus tard change l'origine : réinstallation et reconnexion de chaque famille | risque accepté par le PO (45.2) ; HSTS sans « preload » (45.23) ; changement d'adresse prévu en 45b, annoncé aux familles |

## Vérification finale

Une seule fois, juste avant la mise en ligne, sur le **commit publié** de `main` (0022 : rien ne part en ligne sans non-régression complète verte sur ce commit) :

1. tests unitaires, lint, format, typecheck, build, recherche de secrets dans `dist/` (C6), tests du pipeline de contenu ;
2. **non-régression E2E complète sur les deux projets, `tablette` et `telephone`**, avec toutes les stories livrées, contre `savanturier-dev` (exclusions habituelles `@depend-de`, `@envoi-email`, `@hors-beta`) ;
3. tests de la PWA sur le build de production (`playwright.pwa.config.ts`) ;
4. après publication, contre la **production** (adresse alwaysdata), avec le compte de test du PO : en-têtes (C1), origines appelées (C4), RLS (C10), région Irlande des fonctions (C12) ;
5. **contrôle manuel du PO sur une vraie tablette** (et un téléphone) : ouvrir l'adresse, installer sur l'écran d'accueil, s'inscrire, créer un profil, jouer une séance, mode dys, voix, Son/Muet, ouvrir les pages légales ; puis publier une petite version et vérifier qu'elle s'applique au lancement suivant sans recharger l'écran de l'enfant (#8, règle 4).

## Découpage décidé (45.19)

| Partie | Contenu | Quand |
|---|---|---|
| **45a Beta en ligne** (cette issue) | P1 à P8, P10 à P12 ; C1 à C10, C11 (essais), C12 à C14, C15 (procédure), C16 ; dettes de #72 telles que décidées ; vérification finale | en fin de chemin critique. La configuration (C1 à C16) peut commencer plus tôt si une place se libère : seules la vérification finale et la publication attendent la dernière story de la beta |
| **45b Après la beta** (nouvelle issue) | fournisseur d'e-mails européen avec offre gratuite (P9), réinitialisation par e-mail et retrait de celle par prénom, suppression du lien et du code de connexion (45.21), limites d'inscriptions et d'essais de connexion, CI (C17), script de suppression (C15), expiration des enregistrements (avec #38), domaine définitif et passage à Supabase Pro | avant toute ouverture au public |

## Emplacement

Aucun fichier sous `supabase/functions/_shared/<contexte>/domain/`.

- `docs/publication.md` : procédure de publication et traitement d'une demande de suppression des données.
- `public/.htaccess` (copié dans `dist/`) : configuration d'alwaysdata, si le type de site la lit (C1, à vérifier).
- `public/polices/` : police Andika (`woff2`) et sa licence.
- `src/` : pages « Politique de confidentialité » et « Mentions légales ».
- `features/45-mise-en-ligne.feature` et `features/steps/` : origines appelées, en-têtes, pages légales.
- `scripts/` ou `supabase/` : vérification de la RLS, recherche de secrets dans `dist/`, script de suppression à la main, avec leurs tests.
- `supabase/config.toml` : configuration de production (C7) ; `.env.example` : `ORIGINES_AUTORISEES`.
- `docs/decisions/` : une décision pour l'hébergement et la production (alwaysdata gratuit, Supabase Free en Irlande, sauvegarde manuelle) ; en 45b, une décision qui remplace 0019.
- `CLAUDE.md` : commandes de publication et des contrôles en production (la région Irlande y est déjà).

## Données d'enfants

Aucune donnée nouvelle sur l'enfant. #45 met en production les données déjà décrites par les stories livrées (profil : prénom ou pseudo, niveau, réglages ; séances, résultats, records, test de départ). Points RGPD de la story : hébergement UE (front chez alwaysdata, base **et** fonctions en Irlande), aucun tiers dans le navigateur (C4), suppression à la main (C15), journaux d'alwaysdata et de Supabase (adresses IP) mentionnés dans la politique de confidentialité, aucune donnée d'enfant dans les issues, la procédure ni le registre des demandes. Les sauvegardes manuelles (P12) contiennent des données d'enfants : jamais dans le dépôt ni dans le conteneur, gardées par le PO, durée écrite dans la politique de confidentialité.

## Questions au PO et décisions

Réponses du PO (2026-10-25, mot pour mot) : « #45 : je veux une solution gratuite. fais moi les propositions pour pouvoir déployer gratuitement », « 45. : alwaysdata », puis aux précisions : « reco OK ». Les décisions ci-dessous en découlent (commentaire `[Responsable] VALIDÉ` du 2026-10-25, 17:48 UTC).

1. **45.1 Hébergeur du front** : lequel ? Décision : **alwaysdata**, offre gratuite (environ 100 Mo : assez pour le front ; les MP3 restent hors 45a). Société et serveurs dans l'UE, HTTPS sur l'adresse fournie.
2. **45.2 Nom de domaine** : lequel, et qui l'achète ? Décision : **aucun domaine acheté pendant la beta** ; adresse gratuite d'alwaysdata (par exemple `savanturier.alwaysdata.net`). Le PO sait que changer d'adresse plus tard obligera les familles à réinstaller l'application et à se reconnecter.
3. **45.3 Offre Supabase de production** : Décision : **offre gratuite (Free)**, avec une **sauvegarde manuelle avant chaque publication**. Limites connues : pause après environ une semaine sans activité, pas de sauvegarde automatique, quotas (environ 500 Mo de base, 1 Go de fichiers, 5 Go de trafic par mois). Passage à Pro avant l'ouverture au public.
4. **45.4 Région** : Décision : **Irlande (`eu-west-1`)**, comme `savanturier-dev`, la décision 0010 et `CLAUDE.md` (le texte de l'issue est à corriger) ; Edge Functions dans la même région.
5. **45.5 E-mails** : Décision : **aucun e-mail dans la beta en ligne** (0019 reste vraie pour 45a) ; en 45b, un **fournisseur européen avec offre gratuite**, à choisir plus tard, avec son adresse d'expéditeur.
6. **45.6 Polices** : Décision : auto-hébergées ; **Andika** seulement, dès la beta, y compris sans réseau ; pas de Lexend.
7. **45.7 Publication automatique** : Décision : **à la main en suivant la procédure** pour la beta ; CI en 45b.
8. **45.8 Erreurs en production** : Décision : journaux de Supabase, regardés après chaque publication et une fois par jour ; plus les retours des familles par l'adresse de contact.
9. **45.9 Politique de confidentialité et mentions légales** : Décision : **avec 45a** ; l'équipe propose un brouillon à partir des faits du dépôt, le PO le relit, le complète (identité, adresse) et en reste responsable.
10. **45.10 Fichiers servis par le CDN** (MP3 des voix) : Décision : **hors de 45a** ; à décider avec la story des MP3, de préférence par l'hébergeur du front (même origine, pas de tiers), dans la limite du quota d'alwaysdata.
11. **45.11 Environnement de recette** : Décision : **aucun pour la beta** ; `savanturier-dev`, la vérification finale et le contrôle sur tablette en tiennent lieu.
12. **45.12 `prototype/`** : Décision : jamais publié (hors du build) ; son sort est reporté à #46.
13. **45.13 Beta ouverte ou sur invitation** : Décision : **sur invitation** (le PO donne l'adresse à la main).
14. **45.14 Réinitialisation par prénom d'un enfant** : Décision : **gardée jusqu'à 45b**, retirée avant toute ouverture au public.
15. **45.15 Délai et preuve d'une demande de suppression** : Décision : demande envoyée **depuis l'adresse e-mail du compte** à l'adresse de contact ; traitement **sous 7 jours** ; réponse écrite au parent une fois fait.
16. **45.16 Trace des demandes** : Décision : registre des demandes traitées (dates et identifiant technique seulement, hors de la base de production), **tenu par le PO**.
17. **45.17 Enregistrements de lecture et beta** : Décision : **#38 hors de la beta en ligne** ; aucun enregistrement en production, l'expiration à 30 jours passe en 45b ou avec #38.
18. **45.18 Compte de test du PO en production** : Décision : oui, un compte parent de test (adresse du PO, profil au pseudo fictif) ; jamais de clé `service_role` côté test.
19. **45.19 Découpage** : Décision : **45a beta en ligne** (cette issue) et **45b après la beta** (nouvelle issue).
20. **45.20 Limite d'inscriptions** : Décision : **aucune limite dans 45a** ; le PO surveille le nombre de parents ; limite par réseau ou plafond global en 45b.
21. **45.21 Lien de connexion après la beta** : Décision : **non rétabli** ; seulement le mot de passe et la réinitialisation par e-mail ; `lienRefuse`, `arriveParLeLien` et les scénarios `@hors-beta` du lien sont supprimés en 45b.
22. **45.22 Retour en arrière d'une migration** : Décision : une migration publiée ne se défait pas pendant la beta ; migrations uniquement additives, et sauvegarde manuelle avant chaque publication (P12).

Les questions 45.23 à 45.30 et leurs décisions sont dans `acceptance.md`. Deux questions nouvelles, non bloquantes pour le code, nées de l'offre gratuite (45.31, 45.32), y sont aussi.

## Glossaire

Les six termes proposés par le cadrage (Beta, Production, Procédure de publication, Demande de suppression des données, Politique de confidentialité, Mentions légales) sont au glossaire (45.28). Ce cadrage ne le modifie pas. Aucune nouvelle relation dans la context map.
