# Context map

Première version, tirée de l'application existante. Les contextes sont des **pistes** que `domain-modeler` confirme ou corrige à chaque story.

## Bounded contexts

| Contexte | Responsabilité | Dossier |
|---|---|---|
| Catalogue pédagogique | Leçons, exercices, compétences, rattachement aux programmes officiels et aux guides fondamentaux. Lit et valide le format JSON des leçons (`lireLecon`, dans `domain/`, importé par le front via `@domain/catalogue`, #16) : texte à trous découpé, réponse et écriture des schémas en barres calculées, consignes par défaut. Lecture seule pour les autres contextes. | `supabase/functions/_shared/catalogue/` |
| Apprentissage | Séances (agrégat `Seance` : plan, questions jouées, réponses, erreurs, avancement, étoiles), correction de chaque type d'exercice, aide et « Je ne sais pas », résultat de la leçon, record de fluence (#16 à #24) ; parcours et verrous, test de départ, révisions (lot 4). Doit fonctionner hors ligne (domaine importé par le front). | `supabase/functions/_shared/apprentissage/` |
| Motivation | Série, badges, cabane, épisodes de l'histoire, univers. | `supabase/functions/_shared/motivation/` |
| Famille | Parents, profils enfants, rattachements et invitations, réglages, contrôle parental, données personnelles et RGPD. | `supabase/functions/_shared/famille/` |
| Accompagnement | Suivi, rapport de la semaine, carte des compétences, devoirs, mots de la semaine, enregistrements de lecture, leçons personnelles. | `supabase/functions/_shared/accompagnement/` |

### Sous-domaine générique

Décidé à la validation n°1 du lot 1 (décision 0007).

| Contexte | Responsabilité | Dossier |
|---|---|---|
| Voix | Lecture à voix haute : nettoyage et découpage du texte, choix de la voix de l'appareil, hauteur et rythme selon le caractère de la voix du personnage guide. Port de lecture (voix du navigateur aujourd'hui, MP3 plus tard). Fonctionne entièrement dans le navigateur, importé par le front via `@domain/voix`. Utilisé par Apprentissage, Motivation et Accompagnement. | `supabase/functions/_shared/voix/` |

### Systèmes externes

| Système | Rôle |
|---|---|
| Programmes officiels et guides Eduscol | Source de vérité pédagogique (`sources/`) |
| Pipeline de contenu (`scripts/`, Python) | Produit `bibliotheque.json` et `programmes-index.json` |
| API Claude | Création de leçons personnelles, lecture de photos de devoirs |
| Synthèse vocale | Voix qui lit les consignes (MP3 pré-générés, ou voix du navigateur) |
| Supabase Auth | Connexion du parent par lien de connexion ou code de connexion envoyés par e-mail (story #5). Émet et vérifie le lien et le code ; confie l'e-mail à une Edge Function (hook « Send Email », décision 0011) |
| Supabase Auth (beta, #72) | Connexion du parent par adresse e-mail et mot de passe du parent, sans aucun e-mail (confirmation désactivée). Garde l'empreinte du mot de passe ; son API d'administration change le mot de passe lors d'une réinitialisation (Edge Function, `service_role` dans `Deno.env`) (décision 0019) |
| Expéditeur d'e-mails | Envoi de l'e-mail de connexion : boîte de test sur le projet de développement, fournisseur européen en production (#45) (décision 0011) |
| Application legacy (`app/`) | Source des règles métier à reprendre. Pas de reprise des données (décision de démarrage n°7) |

## Relations

```mermaid
flowchart LR
  Eduscol[Programmes et guides Eduscol] -- "Conformist" --> Pipeline[Pipeline de contenu]
  Pipeline -- "Published Language (format JSON des leçons)" --> Catalogue
  Catalogue -- "Customer/Supplier" --> Apprentissage
  Catalogue -- "Published Language (Lecon, #16)" --> Apprentissage
  Famille -- "Customer/Supplier (profil, niveau, réglages)" --> Apprentissage
  Apprentissage -- "événements" --> Motivation
  Apprentissage -- "événements" --> Accompagnement
  Accompagnement -- "Customer/Supplier (devoirs, leçons personnelles)" --> Apprentissage
  Claude[API Claude] -- "ACL" --> Accompagnement
  Legacy[Application legacy] -- "ACL" --> Famille
  Legacy -- "ACL" --> Apprentissage
  Auth[Supabase Auth] -- "ACL (#5)" --> Famille
  Famille -- "port ExpediteurDEmails (#5)" --> Expediteur[Expéditeur d'e-mails]
  Famille -- "Customer/Supplier (clé de l'univers, #6)" --> Motivation
  Motivation -- "Customer/Supplier (paroles et humeur du personnage guide, #6)" --> Apprentissage
  Motivation -- "Customer/Supplier (caractère de la voix, #7)" --> Voix
  Synthese[Synthèse vocale du navigateur] -- "ACL (#7)" --> Voix
  Voix -- "appel (#7)" --> Apprentissage
  Voix -- "appel (#7)" --> Accompagnement
  Famille -- "Customer/Supplier (langue du parent, #12)" --> Accompagnement
  Famille -- "contrat de données personnelles (effacer, exporter, #14)" --> Apprentissage
  Famille -- "contrat de données personnelles (#14)" --> Motivation
  Famille -- "contrat de données personnelles (#14)" --> Accompagnement
  Motivation -- "Published Language (CleUnivers, #11)" --> Famille
  Catalogue -- "Published Language (Niveau, #11)" --> Famille
  Auth -- "ACL : mot de passe, API d'administration (#72)" --> Famille
```

| Amont | Aval | Type de relation | Mécanisme (événement, appel, ACL) |
|---|---|---|---|
| Programmes officiels et guides | Pipeline de contenu | Conformist | Citations recopiées mot pour mot, vérifiées au build |
| Pipeline de contenu | Catalogue pédagogique | Published Language | Fichier `bibliotheque.json` au format `docs/format-lecons.md`, lu par un mapper d'infrastructure |
| Catalogue pédagogique | Apprentissage | Customer/Supplier | Appel en lecture : leçon par identifiant, leçons d'une matière et d'un niveau. Côté serveur, port `LeconsDuCatalogue` : `TerminerLaSeance` relit la leçon pour revalider la séance (#24) |
| Catalogue pédagogique | Apprentissage | Published Language (stories #16 à #22) | Le Catalogue publie le type `Lecon` (étapes de leçon, exercices validés de chaque type) dans `@domain/catalogue` ; Apprentissage l'importe et ne lit jamais le JSON brut (ni les crochets d'un texte à trous, ni les `null` d'un schéma en barres). Lecture du format dans `catalogue/domain/` (décision 0012) ; un type d'exercice inconnu est écarté |
| Famille | Apprentissage | Customer/Supplier | Appel en lecture : niveau, prénom et réglages du profil enfant (parcours libre, clavier des dictées, tout lire à voix haute, #12). Au lot 3, le front les passe à la séance (`ContexteDeSeance`, #16) : choix des calculs au CP (#20), clavier des dictées (#19), lecture des choix (#17). `TerminerLaSeance` vérifie le rattachement du parent au profil (#24) |
| Apprentissage | Motivation | Événements | `SeanceTerminee` et `LeconAcquise` (données précisées par #24), qui font avancer la série, les badges, la cabane et les épisodes (lot 5). Motivation remplit la zone « nouveautés » de l'écran de fin, sans jamais modifier une étoile |
| Apprentissage | Apprentissage | Événements internes (story #24) | `SeanceTerminee` met à jour le `ResultatDeLaLecon` et le `RecordDeFluence` (un agrégat par transaction) ; `LeconReussie` servira au parcours et aux verrous (lot 4) |
| Apprentissage | Accompagnement | Événements | `SeanceTerminee` (#24) alimente le suivi et le rapport de la semaine |
| Accompagnement | Apprentissage | Customer/Supplier | Appel en lecture : les devoirs du jour et les leçons personnelles de la famille, que l'enfant joue comme les autres leçons |
| API Claude | Accompagnement | Anti-Corruption Layer | Port `GenerateurDeLecon` (à valider) : la réponse de l'IA est validée et traduite en leçon avant d'entrer dans le domaine |
| Application legacy | Famille, Apprentissage | Anti-Corruption Layer | Traducteur de migration ponctuel : profils et progression de l'artifact → agrégats du domaine |
| Supabase Auth | Famille | Anti-Corruption Layer (stories #5 et #13) | Port `ServiceDeConnexion` (aussi utilisé par le parent invité avant d'accepter une invitation ; l'acceptation elle-même passe par une fonction Postgres `security definer` appelée avec son JWT, décision 0009, n°3) : l'utilisateur et les erreurs de Supabase sont traduits en `ParentId` et en erreurs métier (`AdresseEmailInvalide`, `LienDeConnexionInvalide`, `CodeDeConnexionMalForme`, `CodeDeConnexionInvalide`) |
| Supabase Auth | Famille | Anti-Corruption Layer (story #5, décision 0011) | Hook « Send Email » : l'ACL `DemandeDEmailSupabase` traduit la demande signée (adresse, `token`, `token_hash`, `redirect_to`, type d'action) en adresse, lien de connexion et code de connexion, puis appelle le cas d'usage serveur `EnvoyerEmailDeConnexion` |
| Famille | Expéditeur d'e-mails | Port et adaptateurs (story #5, décision 0011) | Port `ExpediteurDEmails` (couche `application/`) : adaptateur boîte de test (développement), fournisseur européen (production, #45). Le domaine compose l'e-mail de connexion, l'adaptateur ne fait que l'envoyer |
| Supabase Auth | Famille | Anti-Corruption Layer (story #72, décision 0019) | Port `ServiceDeConnexion` élargi (navigateur) : inscription du parent et connexion par mot de passe ; erreurs de Supabase traduites en `AdresseOuMotDePasseIncorrect`, `AdresseDejaUtilisee`, `MotDePasseNonConforme`, `ServiceDeConnexionIndisponible`. Côté serveur, ports `ParentsDesAdresses` et `MotsDePasseDesParents` (API d'administration) pour le cas d'usage `ReinitialiserLeMotDePasse`, qui lit seulement les prénoms des enfants rattachés (port `PrenomsDesEnfantsRattaches`) et compte les essais de réinitialisation (port `RegistreDesEssaisDeReinitialisation`, table sans policy). Les règles du mot de passe sont dans `famille/domain/`, importées par le front via `@domain/famille` |
| Famille | Motivation | Customer/Supplier (story #6) | Le profil enfant garde la clé de son univers ; Motivation retrouve l'univers et son personnage guide (clé inconnue → `animaux`) |
| Motivation | Apprentissage | Customer/Supplier (story #6) | Appel en lecture au domaine de Motivation, depuis le front : pendant une séance, Apprentissage dit seulement « réponse juste / fausse » ; Motivation donne la félicitation ou l'encouragement et l'humeur du personnage guide. Aucune note n'est modifiée. Au lot 3, Motivation ajoute les paroles de séance : accueil de la leçon, fin des étapes, annonce de l'exercice, « Je ne sais pas », phrase de fin selon les étoiles (#16, #23, #24). Les aides et explications propres aux exercices restent dans Apprentissage |
| Voix | Motivation | Published Language (story #7, décision 0008) | Voix publie le type `CaractereDeLaVoix` ; Motivation l'importe et fournit les valeurs de chaque personnage guide. Voix ne connaît pas les univers |
| Famille | Accompagnement | Customer/Supplier (story #12) | Appel en lecture : la langue du parent, réglage de chaque profil enfant (décision n°8 du lot 2), pour la traduction des consignes (lot 6). Seul le texte de la consigne part à l'IA |
| Famille | Apprentissage, Motivation, Accompagnement | Contrat de données personnelles (story #14, décision 0009, n°4) | Suppression en cascade en base pour les tables du profil, plus le port `DonneesPersonnellesDuProfil` (effacer, exporter) pour ce qui n'est pas en base (Storage, caches), et l'événement `ProfilEnfantSupprime`. Chaque contexte qui détient des données d'un enfant fournit son adaptateur ; Famille orchestre la suppression et l'export sans lire leurs tables. Toute story qui ajoute une donnée d'enfant l'ajoute à la suppression et à l'export |
| Motivation | Famille | Published Language (story #11, décision 0009, n°5) | Famille valide la clé de l'univers d'un profil avec le value object `CleUnivers` publié par Motivation (`@domain/motivation`) |
| Catalogue pédagogique | Famille | Published Language (story #11, décision 0009, n°5) | Famille importe le value object `Niveau` (CP à CM2) publié par le Catalogue (`@domain/catalogue`, créé avec #11) |
| Synthèse vocale du navigateur | Voix | Anti-Corruption Layer (story #7) | Port `VoixDeLAppareil` (voix traduites en nom et langue) et port `LecteurAVoixHaute` (adaptateur `speechSynthesis`, plus tard MP3) |
| Voix | Apprentissage, Motivation, Accompagnement | Appel (story #7) | Depuis le front, par le port `LecteurAVoixHaute` déclaré dans `voix/domain/` (décision 0007) : lire une consigne, une étape de leçon, une félicitation ou un encouragement. Au lot 3 : le mot à écouter avec la voix anglaise (#17), le mot dicté à vitesse normale ou lente (#19), les vers (#22) ; l'état Muet ou « ne sait pas lire » décide des messages de la dictée et de l'écoute |

## Décisions

- Les leçons personnelles appartiennent à Accompagnement. Elles respectent le même format JSON que la bibliothèque, pour qu'Apprentissage les joue de la même façon.

- **Motivation est un contexte à part.** Apprentissage annonce seulement les faits (« séance terminée avec 2 étoiles »). Motivation décide seule des récompenses (série, badges, cabane, épisodes). Une récompense ne modifie jamais une note.
- **Pas de temps d'écran** dans l'application : aucune limite de durée de jeu, ni dans Famille ni dans Apprentissage.
- **Voix est un sous-domaine générique** (décision 0007) : aucun des cinq contextes ne le possède. Les interfaces des ports qu'une règle du domaine utilise dans le navigateur (`Hasard`, `LecteurAVoixHaute`, `VoixDeLAppareil`) sont déclarées dans `domain/`.
- **La connexion du parent est obligatoire** (lot 1, décision n°5) : Supabase Auth reste derrière l'ACL de Famille, avec un lien de connexion et un code de connexion.
- **Rattachements et invitation en attente dans l'agrégat `ProfilEnfant`** (proposition des stories #11 et #13, appliquée à la validation n°1 du lot 2) : les invariants « un ou deux parents » et « une invitation acceptée rattache un seul parent » demandent une seule frontière de cohérence. Le `Parent` reste un agrégat à part ; « les enfants d'un parent » est une lecture. Les deux parents ont les mêmes droits (décision n°1 du lot 2).
- **Accès** : toute table d'un contexte qui porte un identifiant de profil enfant a des policies RLS fondées sur le rattachement du parent connecté, et une suppression en cascade avec le profil (#11, #14). Le domaine vérifie aussi le rattachement : la RLS protège l'accès, elle n'est pas le modèle.
- **Séance dans le navigateur, revalidée par le serveur** (proposition des stories #16 et #24, appliquée à la validation n°1 du lot 3 ; décision 0013) : la séance se joue entièrement dans le navigateur (`@domain/apprentissage`). À la fin, le front envoie la séance (tirages et réponses) à l'Edge Function `terminer-la-seance`, avec le JWT du parent ; le serveur relit la leçon, **rejoue les réponses** avec le même domaine et recalcule les étoiles (décision 0003). Il garde seulement le résumé (étoiles, erreurs par question, « Je ne sais pas »). Les écritures d'Apprentissage passent toutes par des Edge Functions, comme celles de Famille (décision 0013) ; une séance incohérente est refusée sans rien enregistrer, et l'enregistrement est idempotent (identifiant de séance) : une séance gardée sur l'appareil après un envoi impossible et renvoyée au retour du réseau n'est comptée qu'une fois. Tables d'Apprentissage (`seances_terminees`, `questions_des_seances`, `resultats_des_lecons`, `records_de_fluence`) sous RLS fondée sur le rattachement, supprimées en cascade avec le profil et incluses dans l'export (contrat de #14).
- **Écritures de Famille** (décision 0009) : création, modification, réglages, invitation, annulation, suppression et export passent par des Edge Functions avec le JWT du parent ; le front ne fait que des lectures directes, sous RLS. Le profil et son premier rattachement sont créés en une seule transaction. L'acceptation d'une invitation passe par une fonction Postgres `security definer` à périmètre minimal, appelée avec le JWT du parent invité ; jamais de `service_role`. Le contrôle parental, le choix du profil en cours et le choix de voix tournent dans le navigateur.
- **Connexion par mot de passe dans la beta** (story #72, décision 0019) : aucun e-mail n'est envoyé dans la beta. Le lien de connexion et le code de connexion (#5) restent dans le domaine sans être proposés par l'écran. La réinitialisation du mot de passe par le prénom d'un enfant rattaché est une exception de la beta : seule Edge Function de Famille qui utilise `service_role`, parce que l'appelant n'est pas connecté ; elle est retirée par #45.
