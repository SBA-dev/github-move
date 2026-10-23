# Modèle du domaine : issue #5, Connexion du parent par lien magique

## Contexte

**Famille** (contexte existant). Le parent est le seul adulte qui a un compte (glossaire, décision n°2). La connexion sert à reconnaître ce parent, pour lui donner accès plus tard aux profils enfants auxquels il est rattaché (lot 2).

Peu de règles métier dans cette story : l'envoi du lien et du code, leur vérification, leur durée de validité et le maintien de la connexion sont assurés par **Supabase Auth**. On le traite comme un **système externe**, derrière un port. Le domaine se limite à :
- l'adresse e-mail du parent et sa validité ;
- la forme du code de connexion (6 chiffres) ;
- l'identité du parent connecté (`ParentId`), qui servira de référence aux rattachements du lot 2 ;
- les erreurs métier nommées que l'interface présente au parent.

Relation : Supabase Auth → Famille, **Anti-Corruption Layer** (décidée). Les erreurs et l'utilisateur de Supabase sont traduits en erreurs métier et en `ParentId` par un adaptateur d'infrastructure. Le reste du domaine ne voit jamais l'objet utilisateur de Supabase.

Note d'infrastructure : `supabase/config.toml` règle déjà `otp_length = 6` et `otp_expiry = 3600` (1 heure), ce qui correspond aux décisions n°6 et n°7.

### Comportement actuel (`app/`, `Store.init()`)

- Aucun écran de connexion : l'application prend l'identité du compte claude.ai (capacités `user` et `db`).
- Avec une identité, les données vont dans un espace privé propre à ce compte, retrouvé sur tous les appareils (« mode cloud »). Sans identité, ou si la capacité échoue, tout reste dans le navigateur (« mode local »).
- À la première connexion, si l'espace du compte est vide et que l'appareil contient des données, elles sont recopiées dans le compte.
- Si une sauvegarde en ligne échoue (hors quota plein), l'application repasse en mode local pour la suite et prévient : « Sauvegarde en ligne impossible : la progression est gardée sur cet appareil. »
- L'accueil et l'espace parent indiquent où sont enregistrées les données (compte ou appareil).
- Il n'y a pas de déconnexion.

La cible change ces points (issue, décisions de démarrage n°5 et n°7, décisions du lot 1) : connexion obligatoire, lien de connexion et code de connexion, déconnexion depuis l'espace parent, pas de « mode local » sans connexion, pas de reprise des données.

## Termes

| Terme | Statut | Remarque |
|---|---|---|
| Parent | au glossaire (confirmé) | Seul rôle adulte. |
| Connexion du parent | **nouveau** (à valider) | État d'un appareil sur lequel un parent est reconnu. Elle reste ouverte jusqu'à la déconnexion. Obligatoire pour utiliser l'application. |
| Lien de connexion | **nouveau** (à valider) | Lien envoyé par e-mail, valable 1 heure, à usage unique. L'issue dit « lien magique ». |
| Code de connexion | **nouveau** (à valider) | Code de 6 chiffres, dans le même e-mail que le lien de connexion. Le parent le saisit sur l'appareil qui a fait la demande. Même durée (1 heure) et même usage unique que le lien. |
| Déconnexion | **nouveau** (à valider) | Fin de la connexion du parent sur un appareil, faite depuis l'espace parent. Plus aucune donnée de la famille n'y reste visible. |
| Appareil | **nouveau** (à valider) | Tablette, téléphone ou ordinateur où l'application est ouverte. Sert aussi aux stories #6 et #7 (« mémorisé sur l'appareil »). |
| Compte | conflit **résolu** | Dans le domaine on dit « Parent » et « Connexion du parent ». L'interface peut dire « ton compte » (proposition appliquée, voir Décisions). |
| Session | conflit **résolu** | « session » reste un synonyme interdit de **Séance**. On dit « la connexion reste ouverte ». |
| Lien magique | conflit **résolu** | **Lien de connexion** dans le domaine, « lien magique » possible dans l'interface. |
| Code | **attention** | « code » seul est interdit : il désigne aussi le contrôle parental ou l'invitation dans d'autres sens. On dit toujours **code de connexion**. |

## Modèle

```mermaid
classDiagram
  class Parent {
    <<agrégat (racine)>>
    ParentId id
    AdresseEmail email
  }
  class ParentId {
    <<value object>>
    valeur
  }
  class AdresseEmail {
    <<value object>>
    valeur
    de(brut) AdresseEmail
  }
  class CodeDeConnexion {
    <<value object>>
    valeur : 6 chiffres
    de(brut) CodeDeConnexion
  }
  class ServiceDeConnexion {
    <<port>>
    envoyerLienEtCodeDeConnexion(AdresseEmail)
    ouvrirLaConnexionAvecLeCode(AdresseEmail, CodeDeConnexion)
    parentConnecte() ParentId ou rien
    deconnecter()
  }
  Parent --> ParentId
  Parent --> AdresseEmail
```

### Agrégat `Parent` (minimal dans cette story)

- Racine : `Parent`, identifié par `ParentId` (l'identifiant fourni par le service de connexion, traduit par l'ACL).
- Contient son `AdresseEmail`.
- Dans cette story, l'agrégat ne protège aucun invariant propre au-delà de la validité de ses value objects. Les rattachements aux profils enfants (lot 2) ne sont **pas** dans cet agrégat : ce sont des agrégats à part qui référencent `ParentId` et `ProfilEnfantId` par identifiant.
- Une adresse jamais vue crée un nouveau parent à sa première connexion (inscription et connexion confondues, voir Décisions).
- Le lien et le code de connexion ne sont **pas** dans l'agrégat : ils sont émis et vérifiés par Supabase Auth. Le domaine ne les conserve jamais.
- Question ouverte n°1 : faut-il un agrégat `Parent` dans cette story, ou suffit-il d'un `ParentId` tant que rien d'autre n'est stocké sur le parent ?

### Value objects

| Value object | Règle de validité |
|---|---|
| `AdresseEmail` | Une seule `@`, une partie avant et un domaine avec un point, sans espace. Espaces au début et à la fin ignorés. Comparée sans tenir compte des majuscules. Sinon : erreur `AdresseEmailInvalide`. Règle validée par les 7 exemples du plan de la règle 2 des scénarios (vide, sans @, rien avant le @, pas de domaine, domaine sans point, deux @, espace). |
| `CodeDeConnexion` | Exactement 6 chiffres. Sinon : erreur `CodeDeConnexionMalForme`, sans appel au service de connexion. Le traitement des espaces saisis entre les chiffres est la question ouverte n°2. |
| `ParentId` | Identifiant opaque, non vide. |

### Port (couche `application/`)

`ServiceDeConnexion` : envoyer à une adresse l'e-mail qui contient le lien et le code de connexion, ouvrir la connexion avec un code, dire quel parent est connecté sur cet appareil, déconnecter. Adaptateur : Supabase Auth (`infrastructure/`), qui traduit ses erreurs en erreurs métier.

### Commandes (cas d'usage)

| Commande | Effet | Erreurs métier |
|---|---|---|
| `DemanderLienDeConnexion(email)` | Valide l'adresse, puis demande l'envoi d'un e-mail qui contient un lien de connexion et un code de connexion. | `AdresseEmailInvalide` |
| `OuvrirLaConnexion(lien)` | Le parent suit le lien et arrive connecté, dans l'espace parent. Réalisé par Supabase Auth côté front, le domaine ne voit que le résultat. | `LienDeConnexionInvalide` |
| `OuvrirLaConnexionAvecLeCode(email, code)` | Sur l'appareil qui a fait la demande, le parent saisit le code de connexion reçu et arrive connecté, dans l'espace parent. | `CodeDeConnexionMalForme`, `CodeDeConnexionInvalide` |
| `SeDeconnecter` | Depuis l'espace parent seulement : ferme la connexion du parent sur cet appareil et efface de l'appareil les données de la famille. Les autres appareils restent connectés. | (aucune) |

### Erreurs métier

- `AdresseEmailInvalide`
- `LienDeConnexionInvalide` : lien expiré **ou** déjà utilisé. Un seul message pour les deux (décision n°6), qui propose d'en demander un nouveau.
- `CodeDeConnexionMalForme` : la saisie n'a pas 6 chiffres. Refusée avant tout appel.
- `CodeDeConnexionInvalide` : code expiré, déjà utilisé ou qui ne correspond pas. Qu'il y ait un seul message pour ces trois cas est la question ouverte n°3.

## Invariants

1. On ne peut pas utiliser l'application sans connexion du parent : sans elle, seul l'écran de connexion est montré (décision n°5).
2. Une adresse e-mail mal formée n'est jamais envoyée au service de connexion. Un code de connexion qui n'a pas 6 chiffres non plus.
3. Seul un parent a un compte : aucune connexion n'existe pour un profil enfant (CLAUDE.md, RGPD).
4. Un lien de connexion et un code de connexion valent **1 heure** et servent **une seule fois** (règle assurée par Supabase Auth, décisions n°6 et n°7).
5. Le code de connexion se saisit sur l'appareil qui a fait la demande.
6. La connexion reste ouverte sur l'appareil jusqu'à la déconnexion (l'enfant n'a rien à ressaisir). Un parent peut être connecté sur plusieurs appareils à la fois.
7. La déconnexion ne se fait que depuis l'espace parent (protégé par le contrôle parental au lot 2) et ne ferme que l'appareil où elle est faite.
8. Après la déconnexion, aucune donnée de la famille ne reste visible sur l'appareil. Le sort des résultats faits hors ligne et pas encore synchronisés est la question ouverte n°4.

## Événements

Aucun événement de domaine n'est nécessaire dans cette story : aucun autre contexte ne réagit à la connexion.
Si un contexte devait réagir plus tard (par exemple Famille à la première connexion d'un parent invité, lot 2), on pourra ajouter `ParentConnecte` (à valider).

## Partage avec le front

- `AdresseEmail` et `CodeDeConnexion` sont du TypeScript pur sous `famille/domain/`, importés par le front via `@domain/famille`, pour refuser une adresse ou un code mal formés avant tout envoi. La demande de lien et la vérification du code exigent le réseau.
- Le reste relève de l'infrastructure : SDK Supabase Auth côté front (envoi de l'e-mail, lecture du lien au retour, vérification du code, maintien de la connexion, déconnexion) et effacement des données locales (IndexedDB) à la déconnexion.

## Données personnelles

- Nouvelle donnée personnelle : l'**adresse e-mail du parent** (donnée d'un adulte, pas d'un enfant). Stockée par Supabase Auth, hébergé dans l'UE. Elle doit figurer dans l'export et la suppression des données (lot 2).
- Le code de connexion n'est jamais conservé par l'application.
- Aucune donnée nouvelle sur l'enfant.

## Emplacement

```
supabase/functions/_shared/famille/
  domain/
    adresse-email.ts          # value object AdresseEmail
    code-de-connexion.ts      # value object CodeDeConnexion (6 chiffres)
    parent-id.ts              # identifiant typé ParentId
    parent.ts                 # agrégat Parent (si la question ouverte n°1 le demande)
    erreurs.ts                # AdresseEmailInvalide, LienDeConnexionInvalide, CodeDeConnexionMalForme, CodeDeConnexionInvalide
    index.ts                  # exporte le domaine pour @domain/famille
  application/
    ports/service-de-connexion.ts
    demander-lien-de-connexion.ts
    ouvrir-la-connexion-avec-le-code.ts
    se-deconnecter.ts
  infrastructure/
    service-de-connexion-supabase.ts   # ACL Supabase Auth → erreurs métier, ParentId
  test_utils/
    service-de-connexion-en-memoire.ts
```

## Décisions

Validation n°1 du lot 1 par le PO, le 2026-10-22 (`docs/stories/lot-1-decisions.md`). « Tranchée » = réponse explicite du PO ; « proposition appliquée » = question de détail qui suit la proposition déjà faite (règle générale de la validation).

Numéros d'origine : « M » = ancienne liste du modèle, « A » = `docs/stories/5/acceptance.md`.

| Question | Réponse | Source |
|---|---|---|
| M1 / A1. Utiliser l'application sans être connecté ? | **Non**. La connexion est obligatoire. | Tranchée, décision n°5 |
| M2 / A2. L'écran de connexion est-il le premier écran ? | **Oui**. « Qui joue ? » arrive au lot 2 ; en attendant, les tests partent de profils enfants préparés. | Tranchée, décision n°2 |
| M3 / A3. Durée du lien de connexion | **1 heure**, usage unique. | Tranchée, décision n°6 |
| M6 / A6. Un ou deux messages pour un lien expiré ou déjà utilisé ? | **Un seul** message : une seule erreur `LienDeConnexionInvalide`. | Tranchée, décision n°6 |
| A11. Écran après la connexion | **L'espace parent**. | Tranchée, décision n°2 |
| A12. Lien ouvert sur un autre appareil | L'e-mail contient aussi un **code de connexion à 6 chiffres**, à saisir sur l'appareil qui a fait la demande. Même durée et même usage unique que le lien. | Tranchée, décision n°7 |
| A16. Qui peut se déconnecter | La déconnexion se fait **seulement depuis l'espace parent**, protégé par le contrôle parental (lot 2). | Tranchée, décision n°8 |
| M5 / A5. Règle de validité de l'adresse | Les 7 exemples du plan de la règle 2. | Proposition appliquée (scénarios) |
| M8 / A8. Une adresse jamais vue crée-t-elle un nouveau parent ? | **Oui** : inscription et connexion confondues. | Proposition appliquée (scénario `@a-valider`) |
| A14. Confirmation d'envoi neutre | **Sans objet**, puisque toute adresse devient un parent (M8). | Conséquence de M8 (`acceptance.md`) |
| A15. Plusieurs appareils | **Oui**, un parent peut être connecté sur plusieurs appareils ; la déconnexion ne ferme que l'appareil où elle est faite. | Proposition appliquée (scénarios `@a-valider`) |
| M9. Le mot « compte » | Interdit dans le domaine (« Parent », « Connexion du parent ») ; l'interface peut dire « ton compte ». | Proposition appliquée (modèle, glossaire) |

## Questions ouvertes

Aucune n'est bloquante pour la story : chacune touche un détail d'interface ou une story suivante.

1. (ancienne M7) Faut-il conserver quelque chose sur le parent en plus de son identité et de son e-mail dans cette story (prénom, langue du parent…) ? (oui / non ; la langue du parent est aujourd'hui un réglage du profil enfant). Sans effet sur les scénarios.
2. (nouvelle) Code de connexion saisi avec des espaces (« 123 456 ») : l'accepte-t-on comme « 123456 » ? (oui / non)
3. (nouvelle) Un seul message pour un code de connexion **faux**, **expiré** ou **déjà utilisé**, comme pour le lien (« Ce code ne marche plus, demande-en un nouveau ») ? (un / plusieurs). Supabase Auth ne distingue pas ces cas.
4. (nouvelle) Lien et code du **même e-mail** : quand le parent s'est connecté avec l'un, l'autre est-il aussi épuisé ? (oui / non). Supabase Auth fait ainsi par défaut.
5. (nouvelle) **Lien suivi sur un autre appareil** (Paul demande sur la tablette, touche le lien sur son téléphone) : le téléphone est-il connecté (oui), ou le parent voit-il seulement un message l'invitant à saisir le code sur la tablette (non) ?
6. (nouvelle) **Nombre d'essais** du code de connexion : faut-il limiter les essais faux (par exemple 5), puis demander un nouvel e-mail ? (oui / non ; sinon, Supabase applique seulement sa limite de demandes)
7. (ancienne M4) Si le parent se déconnecte alors que des séances faites hors ligne ne sont pas encore synchronisées, faut-il le prévenir et lui proposer d'attendre la synchronisation ? (oui / non). À trancher avant la synchronisation (lot 7).
8. (ancienne M10) Le message de l'accueil (« Les profils et la progression sont enregistrés dans ton compte : tu les retrouves sur tous tes appareils. ») est-il repris tel quel ? (oui / non). Sa variante « sur cet appareil » disparaît, puisque la connexion est obligatoire.
9. (ancienne A13) **Deux demandes de suite** : le premier lien et le premier code restent-ils valables jusqu'à leur expiration ? (oui / non) Que voit le parent s'il redemande trop vite (Supabase limite à une demande par minute) ?
10. (ancienne A15, suite) Faut-il aussi « se déconnecter de tous les appareils » (par exemple après la perte d'un téléphone) ? (oui / non ; si oui, plutôt au lot 2 avec l'espace parent)
11. (ancienne A16, suite) La déconnexion demande-t-elle une confirmation (« Veux-tu vraiment te déconnecter ? ») ? (oui / non)
12. (ancienne A17) **Durée de la connexion** : reste-t-elle ouverte sans limite tant que l'appareil sert (oui), ou se ferme-t-elle après une longue période sans utilisation, par exemple plusieurs semaines (non) ?
13. (ancienne A18) Le scénario « Un parent connecté ne voit jamais les profils enfants d'une autre famille » reste-t-il dans #5, exécuté au lot 2 (oui), ou passe-t-il dans la story de rattachement (non) ?
14. (ancienne A19) **Textes exacts** vus par le parent : confirmation d'envoi, adresse refusée, lien qui ne marche plus, code refusé. Les scénarios ne décrivent que le sens. (donner les textes, par exemple)
