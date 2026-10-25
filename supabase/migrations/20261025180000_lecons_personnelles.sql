-- Story #39 : leçons personnelles (Accompagnement), décision 0024. Migration additive : une table, rien d'existant n'est touché.
-- Écrites par les Edge Functions `creer-une-lecon-personnelle` et `supprimer-une-lecon-personnelle` avec le JWT du parent
-- (pas de service_role) : la RLS est la barrière d'accès. Aucun droit de modification (une leçon ne se modifie pas).
-- Le texte du parent est conservé avec la leçon (même ligne, même RLS) ; tout part en cascade avec le profil enfant (RGPD).

create table public.lecons_personnelles (
  id text primary key check (id ~ '^perso-[0-9a-f-]{36}$'),
  profil uuid not null references public.profils_enfants (id) on delete cascade,
  texte_du_parent text not null check (char_length(texte_du_parent) between 3 and 3000),
  lecon jsonb not null check (lecon ->> 'id' = id and octet_length(lecon::text) <= 60000),
  cree_le timestamptz not null default now()
);

create index lecons_personnelles_profil_idx on public.lecons_personnelles (profil, cree_le);

revoke all on public.lecons_personnelles from anon, authenticated;
grant select, insert, delete on public.lecons_personnelles to authenticated;

alter table public.lecons_personnelles enable row level security;

create policy lecons_personnelles_lecture_par_ses_parents on public.lecons_personnelles
  for select to authenticated
  using (private.est_rattache_au_profil(profil));

create policy lecons_personnelles_creation_par_ses_parents on public.lecons_personnelles
  for insert to authenticated
  with check (private.est_rattache_au_profil(profil));

create policy lecons_personnelles_suppression_par_ses_parents on public.lecons_personnelles
  for delete to authenticated
  using (private.est_rattache_au_profil(profil));
