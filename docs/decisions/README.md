# Décisions d'architecture

Une décision par fichier, numérotée. Chaque fichier donne le contexte, la décision, les options écartées et les conséquences.
Une décision n'est jamais réécrite : si elle change, une nouvelle décision la remplace et l'ancienne passe au statut « Remplacée par NNNN ».

| N° | Décision | Statut |
|---|---|---|
| [0001](0001-front-web-react-pwa.md) | Front web React + TypeScript en PWA, plutôt que Flutter | Acceptée |
| [0002](0002-backend-supabase.md) | Backend Supabase, plutôt qu'un backend Java | Acceptée |
| [0003](0003-domaine-partage-hors-ligne.md) | Domaine TypeScript partagé entre le serveur et le front, pour le hors ligne | Acceptée |
| [0004](0004-voix-synthetique.md) | Poésies et chansons lues par une voix de synthèse, pas d'enregistrement audio | Acceptée |
| [0005](0005-pas-de-temps-ecran.md) | Pas de limite de temps d'écran | Acceptée |
| [0006](0006-methode-tdd-bdd-ddd-agents.md) | Méthode TDD, BDD et DDD avec une équipe de subagents | Acceptée, précisée par 0017 et 0020 |
| [0007](0007-ports-du-front-dans-le-domaine.md) | Ports utilisés par le front déclarés dans le domaine, sous-domaine Voix | Acceptée, précisée par 0008 |
| [0008](0008-voix-en-amont-et-service-de-lecture.md) | Voix publie le caractère de la voix ; service de lecture dans le domaine | Acceptée |
| [0009](0009-ecritures-famille-par-edge-functions.md) | Écritures de Famille par Edge Functions, acceptation d'invitation et suppression | Acceptée |
| [0010](0010-tests-contre-le-projet-de-developpement.md) | Tests qui touchent la base exécutés contre le projet de développement en ligne | Acceptée |
| [0011](0011-emails-de-connexion-par-edge-function.md) | E-mails de connexion envoyés par une Edge Function, boîte de test en développement | Acceptée |
| [0012](0012-lecture-des-lecons-dans-le-domaine-catalogue.md) | Lecture du format JSON des leçons dans le domaine du Catalogue | Acceptée |
| [0013](0013-ecritures-d-apprentissage-par-edge-function.md) | Écritures d'Apprentissage par Edge Function, séance revalidée par le serveur | Acceptée |
| [0014](0014-profil-supprime-avec-son-dernier-parent.md) | Un profil enfant est supprimé avec son dernier parent | Acceptée |
| [0015](0015-decoupage-en-syllabes-dans-voix.md) | Le découpage en syllabes du mode dys est dans le domaine Voix | Acceptée |
| [0016](0016-ecritures-d-apprentissage-par-le-serveur-seul.md) | Les séances terminées ne sont écrites que par le serveur | Acceptée |
| [0017](0017-livraison-en-parallele-par-equipes.md) | Stories livrées en parallèle, une équipe par story, selon un graphe de dépendances | Acceptée |
| [0018](0018-revalidation-de-la-dictee-sans-le-profil.md) | La dictée est revalidée sans relire le profil de l'enfant (complète 0016) | Acceptée |
| [0019](0019-connexion-par-mot-de-passe-sans-e-mail-dans-la-beta.md) | Connexion par mot de passe, sans aucun e-mail, dans la beta ; inscription par Edge Function ; réinitialisation par le prénom d'un enfant jusqu'à #45 | Acceptée |
| [0020](0020-accelerer-la-livraison-d-une-story.md) | Livraison d'une story accélérée : une seule non-régression E2E, scénarios en parallèle, review plus tôt | Acceptée, précisée par 0022 |
| [0021](0021-porte-de-test-du-profil-prepare.md) | Le profil préparé, seule porte de test, en développement seulement | Acceptée |
| [0022](0022-non-regression-groupee-sur-main.md) | Non-régression complète groupée sur `main` après 3 merges ; merges autorisés pour la vague | Acceptée, points 2 et 3 remplacés par 0023 |
| [0023](0023-non-regression-sur-main-seulement.md) | Non-régression complète sur `main` seulement, deux fois par jour ; merge par les équipes | Acceptée |
| [0024](0024-lecons-personnelles-par-edge-function-sous-rls.md) | Leçons personnelles écrites par deux Edge Functions avec le JWT du parent, sous RLS ; préparation refaite par le serveur ; texte du parent conservé | Acceptée |
| [0025](0025-hebergement-de-la-beta.md) | Hébergement de la beta : alwaysdata gratuit, Supabase Free en Irlande, sauvegarde manuelle de 30 jours, publication par une session dédiée | Acceptée |
| [0026](0026-gamification-encadree-et-plugins-de-design.md) | Gamification encadrée par le skill `gamification` ; plugins `frontend-design`, `design` et `education-agent-skills` | Acceptée |
| [0027](0027-illustrations-dessinees-en-svg-dans-le-code.md) | Illustrations dessinées en SVG dans le code par Claude, skill `illustration` et son outil de rendu | Acceptée |
| [0028](0028-images-sans-contenu-choquant-pour-les-enfants.md) | Aucune image sexuelle, violente, obscène, haineuse, raciste, xénophobe ou antisémite : règle absolue, bloquante en review | Acceptée, étendue par 0029 |
| [0029](0029-regle-absolue-etendue-a-tous-les-contenus.md) | La règle de 0028 s'étend à tous les contenus (textes, sons, IA, saisies du parent, données de test) ; aucune commande ni aucun agent ne peut l'ignorer | Acceptée, précisée par 0030 |
| [0030](0030-fait-historique-et-contenu-violent.md) | Un fait du programme (une guerre en histoire) est accepté s'il est factuel, neutre, sans détail violent ni image de combat ; ses mots n'entrent jamais dans la liste des termes refusés | Acceptée |
| [0031](0031-traces-des-refus-lues-par-le-po-dans-supabase.md) | Les traces des refus (#103) sont lues par le PO dans le tableau de bord Supabase ; pas de rôle d'administration dans l'application | Acceptée |
| [0032](0032-skills-d-animation-et-de-design-tiers.md) | Skills tiers `motion-design` et `design-dna` copiés, plugin `genjutsu` figé (sans `bunshin`) ; GSAP et three.js écartés | Acceptée |
| [0033](0033-systeme-de-design-de-l-enfant.md) | Système de design de l'enfant : jetons CSS par rôle déclinés par univers (pas de mode sombre), Baloo 2 et Andika servies par le projet, écouteur unique pour le ressort des boutons, transitions par écran sur `transform` et `opacity` en 300 ms au plus, repères `data-signe` et `data-dessin` | Acceptée |
| [0038](0038-defi-de-la-partie-du-parcours-dans-apprentissage.md) | Défi d'une partie du parcours dans Apprentissage, écrit dans `defis_termines` par l'Edge Function seule avec ses questions ratées dans la file de révision ; Motivation en lecture ; parties en blocs de 5 leçons en attendant un champ du format | Acceptée |
