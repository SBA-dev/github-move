---
name: ddd
description: Domain-Driven Design stratégique et tactique adapté au projet (TypeScript, Edge Functions Supabase, architecture hexagonale) avec exemples de value objects, agrégats, ports, repositories et handlers. À utiliser pour modéliser le domaine, écrire du code métier ou le relire.
---

# DDD dans ce projet

## 1. DDD stratégique

- **Bounded context** : la frontière à l'intérieur de laquelle un modèle et un vocabulaire sont cohérents. Dans le code, c'est un dossier `supabase/functions/_shared/<contexte>/`.
- **Langage ubiquitaire** : les mêmes mots servent dans les conversations, les scénarios, le code et la base. La référence est `docs/domain/glossaire.md`.
- **Context map** (`docs/domain/context-map.md`) décrit les relations entre contextes :
  - *Partnership*
  - *Customer/Supplier*
  - *Conformist*
  - *Anti-Corruption Layer* : obligatoire face à un système externe ou legacy
  - *Shared Kernel* : à éviter
- **Lien avec l'Event Storming** :
  - 🟧 événements, qui deviennent des événements de domaine
  - 🟦 commandes, qui deviennent des cas d'usage
  - 🟨 agrégats
  - 🟪 policies, qui deviennent des réactions à des événements
  - 🟩 read models, qui deviennent des vues ou requêtes

### Savanturier : point de départ

Les contextes sont décidés dans `docs/domain/context-map.md` : Catalogue pédagogique, Apprentissage, Motivation (à part), Famille, Accompagnement. `domain-modeler` les complète à chaque story et signale tout besoin de les redécouper. Relations clés :
- **Programmes officiels et guides Eduscol → Catalogue pédagogique** : *Conformist*. On reprend leurs termes et leur découpage, sans les réinterpréter.
- **Format JSON des leçons** (`docs/format-lecons.md`) : *Published Language* entre le pipeline de contenu (`scripts/`) et les contextes qui lisent les leçons. Le domaine le lit via un mapper dans `infrastructure/`.
- **Apprentissage → Motivation** et **Apprentissage → Accompagnement** : par **événements** (`SeanceTerminee`, `LeconAcquise`, à valider). Apprentissage ne connaît ni les badges ni la cabane.
- **Accompagnement → Apprentissage** : les devoirs et les leçons personnelles sont fournis à Apprentissage, qui les joue comme les leçons de la bibliothèque.
- **API Claude → Accompagnement** : *Anti-Corruption Layer*. La réponse de l'IA est validée puis traduite en leçon avant d'entrer dans le domaine.
- **Application legacy (`app/`)** : *Anti-Corruption Layer* obligatoire. Une donnée reprise du legacy (profils, progression stockés par l'artifact) passe par un traducteur, jamais directement dans le domaine.

## 2. Où mettre quoi

| Élément | Dossier | Peut importer |
|---|---|---|
| Value object, entité, agrégat, événement, erreur métier | `domain/` | `domain/` uniquement |
| Cas d'usage, port (interface de repository, horloge, notifier) | `application/` | `domain/` |
| Repository Supabase, mapper, client externe | `infrastructure/` | `application/`, `domain/`, Supabase |
| Handler HTTP | `<fonction>/index.ts` | tout `_shared/<contexte>/` |
| Fakes pour les tests | `test_utils/` | `application/`, `domain/` |
| Front React | `src/` | `domain/` seulement, via l'alias `@domain/<contexte>` (exercices hors ligne). Jamais `application/` ni `infrastructure/` |

## 3. DDD tactique en TypeScript

> Les exemples ci-dessous sont **génériques** (équipe, invitation) pour montrer la forme. Ce ne sont pas des règles de Savanturier. Dans `domain/`, les imports sont relatifs avec l'extension `.ts` et sans `jsr:`/`npm:`, pour que Deno **et** Vite puissent charger le même code.

### Value object : immuable, auto-validé, égalité par valeur

```ts
// domain/email.ts
import { EmailInvalide } from "./erreurs.ts";

export class Email {
  private constructor(readonly valeur: string) {}

  static de(brut: string): Email {
    const v = brut.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) throw new EmailInvalide(brut);
    return new Email(v);
  }

  equals(autre: Email): boolean {
    return this.valeur === autre.valeur;
  }
}
```

### Identifiant typé

```ts
export class EquipeId {
  private constructor(readonly valeur: string) {}
  static de(v: string) { return new EquipeId(v); }
}
```

Un nouvel identifiant est fourni par un port (`GenerateurId`) dans le cas d'usage, jamais tiré au hasard dans le domaine : les tests restent déterministes.

### Erreurs métier nommées

```ts
// domain/erreurs.ts
export class ErreurMetier extends Error {}
export class EmailInvalide extends ErreurMetier {
  constructor(brut: string) { super(`Adresse e-mail invalide : ${brut}`); }
}
export class MembreDejaPresent extends ErreurMetier {}
```

### Agrégat : protège ses invariants et émet des événements

```ts
// domain/equipe.ts
export class Equipe {
  private readonly evenements: EvenementDomaine[] = [];

  private constructor(
    readonly id: EquipeId,
    private membres: Email[],
    private invitations: Invitation[],
  ) {}

  static reconstituer(id: EquipeId, membres: Email[], invitations: Invitation[]) {
    return new Equipe(id, membres, invitations);
  }

  inviter(email: Email, maintenant: Date): void {
    if (this.membres.some((m) => m.equals(email))) throw new MembreDejaPresent();
    if (this.invitations.some((i) => i.estEnAttentePour(email, maintenant))) throw new InvitationDejaEnvoyee();
    this.invitations.push(Invitation.nouvelle(email, maintenant));
    this.evenements.push({ type: "MembreInvite", equipeId: this.id.valeur, email: email.valeur, le: maintenant });
  }

  retirerEvenements(): EvenementDomaine[] {
    return this.evenements.splice(0);
  }
}
```

Règles des agrégats :
- On modifie l'état **uniquement** via des méthodes métier nommées, jamais via des setters publics.
- Un agrégat = une transaction. On ne modifie pas deux agrégats dans le même cas d'usage : on passe par un événement.
- Un agrégat en référence un autre **par identifiant**.
- On garde les agrégats petits. Un élément y entre seulement si un invariant l'exige.
- L'heure, l'aléatoire et les identifiants externes sont **passés en paramètre**, jamais lus directement dans le domaine.

### Port et cas d'usage

```ts
// application/ports.ts
export interface EquipeRepository {
  parId(id: EquipeId): Promise<Equipe | null>;
  enregistrer(equipe: Equipe): Promise<void>;
}
export interface Horloge { maintenant(): Date; }
export interface GenerateurId { nouveau(): string; }
```

```ts
// application/inviter-membre.ts
export class InviterMembre {
  constructor(private readonly equipes: EquipeRepository, private readonly horloge: Horloge) {}

  async executer(cmd: { equipeId: string; email: string }): Promise<EvenementDomaine[]> {
    const equipe = await this.equipes.parId(EquipeId.de(cmd.equipeId));
    if (!equipe) throw new EquipeIntrouvable(cmd.equipeId);
    equipe.inviter(Email.de(cmd.email), this.horloge.maintenant());
    await this.equipes.enregistrer(equipe);
    return equipe.retirerEvenements();
  }
}
```

### Adaptateur Supabase

```ts
// infrastructure/supabase-equipe-repository.ts
import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";

export class SupabaseEquipeRepository implements EquipeRepository {
  constructor(private readonly db: SupabaseClient) {}

  async parId(id: EquipeId): Promise<Equipe | null> {
    const { data, error } = await this.db.from("equipes").select("*, invitations(*), membres(*)").eq("id", id.valeur).maybeSingle();
    if (error) throw error;
    return data ? EquipeMapper.versDomaine(data) : null; // mapper explicite : les types "row" ne sortent pas d'ici
  }
  // enregistrer(...) via EquipeMapper.versLignes(...)
}
```

### Handler fin

```ts
// supabase/functions/inviter-membre/index.ts
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  // Le JWT de l'appelant est transmis pour que la RLS s'applique
  const db = createClient(envObligatoire("SUPABASE_URL"), envObligatoire("SUPABASE_ANON_KEY"), {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });

  const entree = await lireEntree(req); // validation de forme : 400 si invalide
  try {
    const evenements = await new InviterMembre(new SupabaseEquipeRepository(db), horlogeSysteme).executer(entree);
    return Response.json({ evenements }, { status: 201 });
  } catch (e) {
    return versReponseHttp(e); // ErreurMetier → 409/422, Introuvable → 404, refus RLS → 403. Aucune donnée d'enfant dans les logs.
  }
});
```

## 4. Anti-patterns (refusés en review)

- **Modèle anémique** : des classes avec seulement des données, et la logique dans les cas d'usage ou les handlers.
- Logique métier dans React, dans un handler ou uniquement dans une policy RLS. La RLS **protège l'accès**, elle n'est pas le modèle.
- Types générés par Supabase (`Database["public"]["Tables"]…`) utilisés dans `domain/` ou `application/`.
- Un import de `supabase-js`, de `Deno.env`, de `fetch`, du DOM ou de `jsr:`/`npm:` dans `domain/`.
- Une règle métier recopiée dans le front au lieu d'être importée depuis `domain/`.
- L'heure, le hasard ou `crypto.randomUUID()` utilisés directement dans `domain/`.
- Des primitives partout (*primitive obsession*) : `string` pour un e-mail, `number` pour un montant.
- Des agrégats géants qui chargent tout le graphe.
- Des synonymes : « client », « utilisateur » et « compte » employés pour la même chose. Le glossaire tranche.
