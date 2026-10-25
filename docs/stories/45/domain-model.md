# #45 : Mise en ligne de Savanturier (cadrage anticipé)

Story transverse, lot 7 (Bascule), dernière du chemin critique de la beta. Cadrage du 2026-10-25, sans code.
Entrées : issue #45 et le commentaire `[Responsable]` du 2026-10-25 (décision du PO : #13 et #14 sortent de la beta, suppression des données à la main sur demande écrite du parent), décisions 0001, 0002, 0009, 0010, 0011, 0014, 0019, 0021, 0022, dettes de #72 (PR #83, `docs/stories/72/journal.md`), #8 (`docs/stories/8/`).

## Contexte

**Story d'infrastructure.** Elle ne crée **aucun agrégat, aucune commande ni aucun événement de domaine** dans le code. Elle touche :

| Contexte | Ce que #45 y change |
|---|---|
| Famille | configuration d'Auth en production (adresse du site, adresses de retour, inscriptions publiques fermées, hook d'e-mail), sort des dettes de #72, procédure de suppression des données à la main (hors application) |
| Accompagnement | expiration des enregistrements de lecture, **seulement si #38 est dans la beta en ligne** (question 45.17) |
| Tous | publication : migrations, Edge Functions, front ; aucun changement de règle |

**Concepts examinés** :

- **Demande de suppression des données** : concept **métier mais hors application** pendant la beta. Le parent l'écrit (adresse de contact de la politique de confidentialité) ; l'équipe l'exécute à la main. Elle n'a ni agrégat ni écran : c'est une **procédure** écrite dans `docs/`, avec un script d'exploitation. Son effet doit être **exactement** celui de la future **Suppression du profil** (#14) ou de la suppression du compte du parent (décision 0014), pour que #14 la remplace sans changer la promesse faite aux familles. Terme proposé au glossaire (voir la fin).
- **Production**, **procédure de publication**, **politique de confidentialité**, **mentions légales** : termes d'exploitation ou juridiques, utiles dans les docs, les issues et l'interface (liens en pied de page). Ce ne sont pas des concepts du domaine : rien dans `domain/`.
- **Beta** : déjà employé partout (feuille de route, décision 0019, tag `@hors-beta`) mais absent du glossaire. Proposé.

Conflit de langage à éviter : « suppression à la main » ne doit pas devenir un second sens de **Suppression du profil** (#14 : action du parent dans l'application, immédiate). On parle de **demande de suppression des données** (ce que fait le parent) et de son **traitement** (ce que fait l'équipe).

## Ce que le PO fait lui-même

Décisions et comptes qu'aucune équipe ne peut prendre à sa place. Les éléments marqués **[beta]** bloquent la mise en ligne de demain.

| # | À faire | Pourquoi | Bloquant |
|---|---|---|---|
| P1 | **Choisir l'hébergeur du front** et créer le compte (45.1) | HTTPS, en-têtes de cache, renvoi des adresses inconnues vers `index.html` (0021) | [beta] |
| P2 | **Acheter le nom de domaine** et le relier à l'hébergeur (45.2) | adresse stable, installation sur l'écran d'accueil liée à l'origine (#8) | [beta] (sinon adresse de l'hébergeur, 45.2) |
| P3 | **Créer le projet Supabase de production**, dans l'UE, distinct de `savanturier-dev` (45.3, 45.4) | 0010 n°3 : jamais de données d'un vrai enfant sur le projet de développement | [beta] |
| P4 | Choisir l'**offre Supabase** et accepter son coût (45.3) | sauvegardes, pas de mise en pause | [beta] |
| P5 | Fournir à la session les **accès au projet de production** (référence, jeton de gestion) sans les écrire dans le dépôt, ou appliquer lui-même la procédure | migrations et déploiement des fonctions | [beta] |
| P6 | **Politique de confidentialité** : texte (ou validation d'un brouillon de l'équipe) : responsable, données gardées, finalité, hébergement UE, durée, absence de traceur, droits, **moyen de faire une demande de suppression des données** et son délai (45.9, 45.15) | RGPD, commentaire du PO du 25/10 | [beta] |
| P7 | **Mentions légales** : éditeur, directeur de publication, hébergeur (nom, adresse) | obligation légale d'un site édité en France | [beta] |
| P8 | **Adresse de contact** pour les demandes (boîte e-mail qu'il lit) | moyen écrit de la demande | [beta] |
| P9 | Choisir un **fournisseur d'e-mails** européen et une adresse d'expéditeur (45.5) | réinitialisation par e-mail, lien de connexion | après la beta (45b) |
| P10 | **Contrôle manuel sur une vraie tablette** (et un téléphone) sur l'adresse de production | voir « Vérification finale » | [beta] |
| P11 | Dire **qui a accès** à la beta (45.13) et inviter les familles | limite d'inscriptions, risque accepté de 0019 | [beta] |
| P12 | Faire **une restauration d'essai** de sauvegarde, ou la confier à une session qui a accès à Postgres (le conteneur cloud n'y a pas accès, 0010) | critère de l'issue | 45a si l'offre a des sauvegardes, sinon 45b |

## Ce qu'une équipe peut coder

Chaque élément suit TDD/BDD comme une story ordinaire. **[beta]** = bloquant pour demain ; **[après]** = peut attendre (45b).

### Front et hébergement

| # | Travail | Bloquant |
|---|---|---|
| C1 | **Configuration de l'hébergeur dans le dépôt** (fichier d'en-têtes et de redirections propre à l'hébergeur choisi) : `sw.js` et `index.html` en `no-cache` ; `manifest.webmanifest`, `bibliotheque.json`, `programmes-index.json` revalidés ; `/assets/*` en cache long immuable ; toute adresse inconnue sert `index.html` (0021). Vérifié par un test (lecture des en-têtes de l'adresse publiée) | [beta] |
| C2 | **Police Andika auto-hébergée** pour le mode dys : `src/styles.css` la nomme déjà mais ne la charge pas (repli sur Trebuchet MS). Fichiers `woff2` sous licence libre (SIL OFL) servis par notre domaine, `@font-face`, ajout à la coquille du service worker si le PO veut le mode dys sans réseau. Lexend : seulement si le PO la veut (45.6) | [beta] si le mode dys doit avoir sa police ; sinon [après] |
| C3 | **Aucun Google Fonts** : la cible n'en charge aucun aujourd'hui (vérifié : `index.html`, `src/`). Le test C4 le garantit pour l'avenir. `app/` et `prototype/` ne sont pas publiés (45.12) | [beta] via C4 |
| C4 | **Scénario E2E des origines appelées** : en ouvrant Savanturier, en se connectant et en jouant une séance, toute requête part vers l'origine du front ou celle du projet Supabase configuré ; aucune autre. Tourne aussi contre la production (lecture seule, compte de test du PO, 45.18) | [beta] |
| C5 | **Pages légales dans le front** : « Politique de confidentialité » et « Mentions légales », accessibles sans connexion (écran de connexion et Espace parent), textes du PO (P6, P7), 360 px, sans lecture automatique à voix haute (écrans du parent, #73) | [beta] |
| C6 | **Recherche de secrets dans `dist/`** : script lancé après `npm run build`, échoue si le build contient une clé `service_role`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `SEND_EMAIL_HOOK_SECRET`, un jeton de gestion, ou `profil-prepare` (0021) ; seules l'adresse du projet et la clé publique `anon` sont permises | [beta] |

### Supabase de production

| # | Travail | Bloquant |
|---|---|---|
| C7 | **Configuration d'Auth par projet** : `supabase/config.toml` ne décrit aujourd'hui que le développement (`site_url` et adresses de retour sur `localhost`, **adresse du hook `send_email` écrite en dur sur `savanturier-dev`**). Il faut une configuration propre à la production (bloc par projet de la CLI, à vérifier, sinon réglage écrit dans la procédure) : `site_url` et adresses de retour sur le domaine de production, inscriptions publiques fermées, confirmations désactivées (0019), longueur minimale 8 | [beta] |
| C8 | **Hook « Send Email » désactivé en production pendant la beta**, et `MODE_EMAIL=boite-de-test` **interdit** en production : sinon l'adresse d'un vrai parent pourrait être rangée dans la boîte de test (0011). La procédure le vérifie | [beta] |
| C9 | **Secrets des Edge Functions de production** : `ORIGINES_AUTORISEES` = domaine de production seulement (pas `localhost`) ; aucun `ANTHROPIC_API_KEY` tant que l'IA n'est pas là ; `.env.example` complété (`ORIGINES_AUTORISEES` y manque) | [beta] |
| C10 | **Vérification de la RLS** : requête qui liste les tables de `public` sans RLS active, et les tables sans policy (attendu : `boite_de_test_emails`, `essais_de_reinitialisation`, `tests_de_depart_comptes` si voulu) ; elle échoue sur toute autre. Lancée sur dev puis sur production | [beta] |
| C11 | **Tâches planifiées** (pg_cron) actives en production : effacement des essais de réinitialisation oubliés (24 h, 0019 n°6) ; expiration des enregistrements de lecture si #38 est livrée (45.17) | [beta] pour les essais ; [après] ou avec #38 pour les enregistrements |
| C12 | **Région des Edge Functions** : fixer l'exécution en Europe (réglage du projet ou option de région à l'appel, à vérifier dans la doc Supabase) et la vérifier (en-tête de réponse) | [beta] (45.4) |
| C13 | **Aucune donnée de test en production** : `seed.sql` jamais appliqué ; aucun scénario E2E qui écrit (préparation par `service_role`) ne vise la production | [beta] |

### Procédure et exploitation

| # | Travail | Bloquant |
|---|---|---|
| C14 | **Procédure de publication** `docs/publication.md` : vérifications (unitaires, lint, format, typecheck, build, C6, non-régression E2E complète **verte sur le commit publié**, 0022) → migrations → Edge Functions et secrets → configuration d'Auth → front → contrôles après publication (C1, C4, C10, C12) ; **retour en arrière** (front : republier la version précédente ; fonctions : redéployer le commit précédent ; migrations : uniquement additives pendant la beta, pas de retour automatique) ; journal des publications. Commandes ajoutées au tableau de `CLAUDE.md` | [beta] |
| C15 | **Procédure et script du traitement d'une demande de suppression des données** : voir plus bas | [beta] (procédure) ; script [beta] si 45.15 dit « sous 72 h », sinon [après] |
| C16 | **Erreurs en production** : lecture des journaux des Edge Functions de Supabase, écrite dans la procédure (qui regarde, quand) ; aucun service tiers (45.8) | [beta] (doc seulement) |
| C17 | **CI GitHub Actions** (vérifications à chaque PR, publication à chaque merge) | [après] (45.7) |
| C18 | **Sort des dettes de #72** : voir plus bas | selon 45.13 et 45.14 |
| C19 | **Réinitialisation par e-mail**, lien et code de connexion rétablis (tag `@hors-beta` retiré), fournisseur d'e-mails (adaptateur « fournisseur européen » de 0011), limite d'essais de connexion propre à l'application (0019 n°8) | [après] (45b) |

### Traitement d'une demande de suppression des données (C15)

Pendant la beta, sans #13, un profil enfant n'a qu'**un** parent. La procédure couvre deux demandes :

1. **Supprimer le compte du parent** : supprimer l'utilisateur dans Supabase Auth. Par cascade (décision 0014), ses rattachements disparaissent, puis chaque profil dont il était le dernier parent, puis toutes les données du profil (séances terminées, questions des séances, résultats des leçons, records de fluence, résultats et comptes du test de départ). Les essais de réinitialisation de son adresse s'effacent seuls sous 24 h.
2. **Supprimer un seul profil enfant** : supprimer le profil ; ses données suivent par cascade.

Le script (exploitation, sous `scripts/` ou `supabase/`, avec test) prend l'identifiant du parent ou du profil, **jamais un prénom**, affiche ce qui sera effacé (nombres par table, sans contenu), demande confirmation, efface, puis vérifie qu'il ne reste rien. Ce qui n'est pas en base : Storage (rien avant #38), appareils (profil en cours, Son/Muet, choix de la voix dans le stockage local ; le service worker ne garde aucune donnée de famille, #8) : la réponse au parent lui dit comment les effacer sur ses appareils.

**Vérification de l'identité** : la demande doit venir de l'adresse e-mail du compte (45.15). **Trace** : un registre des demandes traitées (date de la demande, date du traitement, identifiant technique) tenu **hors** de la base de production, sans prénom ni contenu ; à confirmer (45.16).

### Dettes de #72 (C18)

| Dette | Proposition pour 45a (beta en ligne) | 45b (après la beta) |
|---|---|---|
| `service_role` dans `inscrire-le-parent` | **garder** : seule façon de créer un parent avec les règles du mot de passe (0019 n°3, n°5) | garder, ou passer à un hook « avant création d'un utilisateur » si l'inscription publique rouvre (à étudier) |
| `service_role` dans `reinitialiser-le-mot-de-passe` | dépend de 45.14 | retirée avec la fonction |
| Réinitialisation par prénom d'un enfant (secret faible) | **garder seulement si la beta est sur invitation** (45.13, 45.14) : le risque a été accepté « pour la beta » et « avant toute ouverture au public » (0019) | **retirée** (fonction, table, cas d'usage, écran), remplacée par la réinitialisation par e-mail ; nouvelle décision qui remplace 0019 |
| Aucune limite d'inscriptions | dépend de 45.13 et 45.20 | limite décidée avec l'ouverture au public |
| Pas de limite d'essais de connexion propre à l'application | limite de Supabase Auth seulement (0019 n°7) | décidée par 45b (0019 n°8) |
| Champs `lienRefuse` / `arriveParLeLien` de `useConnexion` | **rien** : ils servent au retour du lien de connexion | supprimés si le lien n'est pas rétabli, sinon réutilisés (45.21) |
| Tag `@hors-beta` | **gardé**, exclu comme aujourd'hui | retiré en rétablissant l'e-mail ; scénarios `@envoi-email` relancés (verrou `email`) |
| `service_role` aussi dans `terminer-la-seance`, `terminer-le-test-de-depart`, `envoyer-email` | relevé pour la revue : usages déjà décidés (0016, 0011) ; la procédure vérifie qu'ils ne sont jamais exposés | inchangé |

## Vérification finale

Une seule fois, juste avant la mise en ligne, sur le **commit publié** de `main` (0022 : rien ne part en ligne sans non-régression complète verte sur ce commit) :

1. tests unitaires, lint, format, typecheck, build, recherche de secrets dans `dist/` (C6), tests du pipeline de contenu ;
2. **non-régression E2E complète sur les deux projets, `tablette` et `telephone`**, avec toutes les stories livrées, contre `savanturier-dev` (exclusions habituelles `@depend-de`, `@envoi-email`, `@hors-beta`) ;
3. tests de la PWA sur le build de production (`playwright.pwa.config.ts`) ;
4. après publication, contre la **production**, en lecture seule ou avec le compte de test du PO : en-têtes (C1), origines appelées (C4), RLS (C10), région des fonctions (C12) ;
5. **contrôle manuel du PO sur une vraie tablette** (et un téléphone) : ouvrir l'adresse, installer sur l'écran d'accueil, s'inscrire, créer un profil, jouer une séance, mode dys, voix, Son/Muet, ouvrir les pages légales ; puis publier une petite version et vérifier qu'elle s'applique au lancement suivant sans recharger l'écran de l'enfant (#8, règle 4).

## Découpage proposé

| Partie | Contenu | Quand |
|---|---|---|
| **45a Beta en ligne** | P1 à P8, P10, P11 ; C1 à C10, C11 (essais), C12 à C14, C15 (procédure), C16 ; dettes de #72 selon 45.13/45.14 ; vérification finale | demain. La préparation (C1 à C6, C10, C14, C15) peut commencer **avant** que les dernières stories de la beta soient mergées : seule la vérification finale et la publication attendent la dernière |
| **45b Après la beta** | fournisseur d'e-mails (P9), réinitialisation par e-mail et retrait de celle par prénom, lien et code rétablis (`@hors-beta`), limites d'inscriptions et d'essais de connexion, CI (C17), restauration d'essai si non faite (P12), expiration des enregistrements (si #38 après), domaine définitif si 45a part sur l'adresse de l'hébergeur | avant toute ouverture au public |

Le découpage en deux issues est recommandé (45.19).

## Emplacement

Aucun fichier sous `supabase/functions/_shared/<contexte>/domain/`.

- `docs/publication.md` : procédure de publication et traitement d'une demande de suppression des données.
- Configuration de l'hébergeur à la racine (nom imposé par l'hébergeur choisi) ou dans `public/`.
- `public/polices/` : police Andika (`woff2`) et sa licence.
- `src/` : pages « Politique de confidentialité » et « Mentions légales ».
- `features/45-mise-en-ligne.feature` et `features/steps/` : origines appelées, en-têtes, pages légales.
- `scripts/` ou `supabase/` : vérification de la RLS, recherche de secrets dans `dist/`, script de suppression à la main, avec leurs tests.
- `supabase/config.toml` : configuration de production (C7) ; `.env.example` : `ORIGINES_AUTORISEES`.
- `docs/decisions/` : une décision pour l'hébergement et la production ; en 45b, une décision qui remplace 0019.
- `CLAUDE.md` : commandes de publication ; région à corriger (45.4).

## Données d'enfants

Aucune donnée nouvelle sur l'enfant. #45 met en production les données déjà décrites par les stories livrées (profil : prénom ou pseudo, niveau, réglages ; séances, résultats, records, test de départ). Points RGPD de la story : hébergement UE (base **et** fonctions), aucun tiers dans le navigateur (C4), suppression à la main (C15), journaux de l'hébergeur et de Supabase (adresses IP) mentionnés dans la politique de confidentialité, aucune donnée d'enfant dans les issues, la procédure ni le registre des demandes.

## Questions au PO

Les questions 45.1 à 45.12 reprennent celles de l'issue. Chaque recommandation vise une mise en ligne **demain**.

1. **45.1 Hébergeur du front** : lequel ? Recommandation : un hébergeur de fichiers statiques **dont la société et les serveurs sont dans l'UE**, sans traceur, qui permet de régler les en-têtes et le renvoi vers `index.html`, avec HTTPS automatique (exemples à comparer par le PO : Clever Cloud, alwaysdata, Scaleway). Repli si le temps manque : un hébergeur statique connu (Netlify, Cloudflare Pages), le front ne transportant aucune donnée d'enfant, mais sa société n'est pas européenne et il faudra le dire dans la politique de confidentialité. Choisis-tu un hébergeur européen ? (oui / non, et lequel)
2. **45.2 Nom de domaine** : lequel, et qui l'achète ? Recommandation : le PO l'achète chez un registraire européen (par exemple `savanturier.fr` s'il est libre). S'il n'est pas actif demain, la beta part sur l'adresse fournie par l'hébergeur, en sachant qu'un changement d'adresse oblige chaque famille à réinstaller l'application et à se reconnecter. Acceptes-tu ce risque ? (oui / non)
3. **45.3 Offre Supabase de production** : la gratuite suffit-elle ? Recommandation : **offre payante (Pro)** pour la production : sauvegardes quotidiennes et pas de mise en pause d'un projet peu utilisé ; l'offre gratuite met le projet en pause après une période sans activité et n'offre pas de sauvegarde utilisable (à vérifier par le PO sur la page des tarifs). À défaut : offre gratuite + sauvegarde manuelle faite par le PO avant chaque publication. Prends-tu l'offre payante ? (oui / non)
4. **45.4 Région** : la base de production va-t-elle en **Irlande (`eu-west-1`)** ou à **Francfort** ? L'issue dit Francfort ; la décision 0010, `CLAUDE.md`, `docs/reecriture.md` et la feuille de route disent que `savanturier-dev` est en Irlande et que **le PO garde l'Irlande**. Les deux sont dans l'UE. Recommandation : Irlande, comme le développement et comme `CLAUDE.md` (l'issue est à corriger). Et pour les Edge Functions : les fixer dans la même région. Confirmes-tu l'Irlande ? (oui / non)
5. **45.5 E-mails** : Supabase ou un fournisseur à nous, et quelle adresse d'expéditeur ? Recommandation : **aucun e-mail dans la beta en ligne** (0019 reste vraie pour 45a) ; fournisseur européen choisi en 45b, expéditeur sur notre domaine (`ne-pas-repondre@<domaine>`). D'accord ? (oui / non)
6. **45.6 Polices** : les héberge-t-on nous-mêmes ? Recommandation : oui ; **Andika** seulement (mode dys, déjà nommée par le front), Lexend non reprise pour la beta. Le mode dys doit-il avoir sa police dès la beta ? (oui / non)
7. **45.7 Publication automatique** : CI ou à la main ? Recommandation : **à la main en suivant la procédure** pour la beta (la non-régression complète tourne contre `savanturier-dev`, dans le conteneur) ; CI en 45b. D'accord ? (oui / non)
8. **45.8 Erreurs en production** : les journaux de Supabase suffisent-ils ? Recommandation : oui pour la beta ; le PO (ou la session) les regarde après chaque publication et une fois par jour ; plus les retours des familles par l'adresse de contact. D'accord ? (oui / non)
9. **45.9 Politique de confidentialité et mentions légales** : avec la mise en ligne ? Qui écrit ? Recommandation : **oui, avec 45a** (données d'enfants, demande de suppression à décrire) ; l'équipe propose un brouillon à partir des faits du dépôt, le PO le relit, le complète (identité, adresse) et en reste responsable. D'accord ? (oui / non)
10. **45.10 Fichiers servis par le CDN** (MP3 des voix) : hébergeur du front ou Supabase Storage ? Recommandation : **hors de 45a** (rien à servir aujourd'hui, la voix du navigateur est utilisée) ; à décider avec la story des MP3, de préférence par l'hébergeur du front (même origine, pas de tiers). D'accord ? (oui / non)
11. **45.11 Environnement de recette** : en faut-il un ? Recommandation : **non pour la beta** ; `savanturier-dev` + la vérification finale + le contrôle sur tablette en tiennent lieu. D'accord ? (oui / non)
12. **45.12 `prototype/`** : le garde-t-on dans le dépôt ? Recommandation : il n'est jamais publié (hors du build) ; décision reportée à #46 (retrait de `app/`). D'accord ? (oui / non)
13. **45.13 Beta ouverte ou sur invitation** : l'adresse est-elle donnée **seulement à quelques familles connues** ? Recommandation : **sur invitation** (le PO donne l'adresse à la main), c'est la condition du risque accepté par 0019. Beta sur invitation ? (oui / non)
14. **45.14 Réinitialisation par prénom d'un enfant** : la garde-t-on dans la beta en ligne, alors que 0019 dit « retirée par #45 » ? Recommandation : **oui, jusqu'à 45b**, si 45.13 = oui (sinon un parent qui oublie son mot de passe perd l'accès sans e-mail ; risque déjà accepté pour des familles connues). La retirer avant toute ouverture au public. La garde-t-on ? (oui / non)
15. **45.15 Délai et preuve d'une demande de suppression** : recommandation : demande envoyée **depuis l'adresse e-mail du compte** à l'adresse de contact ; traitement **sous 7 jours** (le RGPD permet un mois au plus) ; réponse écrite au parent une fois fait. D'accord ? (oui / non, ou autre délai)
16. **45.16 Trace des demandes** : tient-on un registre des demandes traitées (dates et identifiant technique seulement, hors de la base de production) ? Recommandation : oui, tenu par le PO. (oui / non)
17. **45.17 Enregistrements de lecture et beta** : #38 dépend de #14, qui sort de la beta. #38 reste-t-elle dans la beta en ligne ? Recommandation : **non** ; alors aucun enregistrement n'existe en production et l'expiration à 30 jours passe en 45b (ou avec #38). (oui / non)
18. **45.18 Compte de test du PO en production** : accepte-t-on un compte parent de test (adresse du PO, profil au pseudo fictif) pour les contrôles après publication (C4) ? Recommandation : oui, jamais de clé `service_role` côté test. (oui / non)
19. **45.19 Découpage** : découpe-t-on en **45a beta en ligne** (cette issue) et **45b après la beta** (nouvelle issue : e-mail, retrait de la réinitialisation par prénom, limites, CI, restauration, expiration) ? Recommandation : oui. (oui / non)
20. **45.20 Limite d'inscriptions** : met-on une limite dans 45a ? Recommandation : **non si beta sur invitation** (le PO surveille le nombre de parents dans le tableau de bord après la mise en ligne) ; limite par réseau ou plafond global en 45b. Pas de limite dans 45a ? (oui / non)
21. **45.21 Lien de connexion après la beta** : rétablit-on le lien et le code de connexion par e-mail en 45b, ou garde-t-on seulement le mot de passe et la réinitialisation par e-mail ? Recommandation : seulement la réinitialisation par e-mail (le mot de passe reste, 0019) ; alors on supprime `lienRefuse`, `arriveParLeLien` et les scénarios `@hors-beta` du lien. (rétablir / ne pas rétablir)
22. **45.22 Retour en arrière d'une migration** : accepte-t-on qu'en beta une migration publiée ne se défasse pas (seulement des migrations qui ajoutent, sauvegarde avant chaque publication) ? Recommandation : oui. (oui / non)

## Ajouts proposés au glossaire

Ajouts seulement (le glossaire et la context map ne sont pas modifiés par ce cadrage). Aucune nouvelle relation dans la context map.

| Terme | Définition | Contexte | Synonymes interdits |
|---|---|---|---|
| Beta (à valider) | Première version de la nouvelle application, en ligne pour le PO et quelques familles invitées, avec un périmètre fixé par le PO (`docs/feuille-de-route.md`). Certains comportements y sont propres (connexion par mot de passe sans e-mail, décision 0019 ; suppression des données à la main). | transverse | version de test, préproduction, recette |
| Production (à valider) | Le projet Supabase et l'adresse du front utilisés par les familles. Seul endroit où se trouvent les données de vrais enfants ; jamais de données de test. S'oppose au projet de développement (`savanturier-dev`). | transverse | prod (dans l'interface), live |
| Procédure de publication (à valider) | Étapes écrites et répétables pour mettre une version en production : vérifications, migrations, Edge Functions, puis front, avec contrôles après publication et retour en arrière (#45). | transverse | déploiement (seul), mise en prod, release |
| Demande de suppression des données (à valider) | Demande écrite d'un parent, envoyée depuis l'adresse de son compte à l'adresse de contact, pour effacer un profil enfant ou tout son compte. Pendant la beta, l'équipe la **traite à la main** ; son effet est celui de la Suppression du profil (#14) ou de la suppression du compte du parent (décision 0014). | Famille | suppression à la main, désinscription, droit à l'oubli (dans l'interface) |
| Politique de confidentialité (à valider) | Page du front, lisible sans connexion, qui dit quelles données sont gardées, pourquoi, où (UE), combien de temps, et comment faire une demande de suppression des données. | transverse | charte, CGU |
| Mentions légales (à valider) | Page du front, lisible sans connexion, qui nomme l'éditeur et l'hébergeur. | transverse | à propos |
