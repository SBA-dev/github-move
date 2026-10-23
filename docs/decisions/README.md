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
| [0006](0006-methode-tdd-bdd-ddd-agents.md) | Méthode TDD, BDD et DDD avec une équipe de subagents | Acceptée |
| [0007](0007-ports-du-front-dans-le-domaine.md) | Ports utilisés par le front déclarés dans le domaine, sous-domaine Voix | Acceptée, précisée par 0008 |
| [0008](0008-voix-en-amont-et-service-de-lecture.md) | Voix publie le caractère de la voix ; service de lecture dans le domaine | Acceptée |
| [0009](0009-ecritures-famille-par-edge-functions.md) | Écritures de Famille par Edge Functions, acceptation d'invitation et suppression | Acceptée |
| [0010](0010-tests-contre-le-projet-de-developpement.md) | Tests qui touchent la base exécutés contre le projet de développement en ligne | Acceptée |
| [0011](0011-emails-de-connexion-par-edge-function.md) | E-mails de connexion envoyés par une Edge Function, boîte de test en développement | Acceptée |
| [0012](0012-lecture-des-lecons-dans-le-domaine-catalogue.md) | Lecture du format JSON des leçons dans le domaine du Catalogue | Acceptée |
| [0013](0013-ecritures-d-apprentissage-par-edge-function.md) | Écritures d'Apprentissage par Edge Function, séance revalidée par le serveur | Acceptée |
| [0014](0014-profil-supprime-avec-son-dernier-parent.md) | Un profil enfant est supprimé avec son dernier parent | Acceptée |
| [0015](0015-decoupage-en-syllabes-dans-voix.md) | Le découpage en syllabes du mode dys est dans le domaine Voix | Acceptée |
