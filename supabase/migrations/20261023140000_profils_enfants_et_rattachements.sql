-- Profils enfants et rattachements des parents (story #11, décision 0009).
-- Un profil enfant a toujours un ou deux parents. Il ne contient que : prénom ou pseudo, niveau, univers,
-- date de création (RGPD : ni e-mail, ni mot de passe, ni date de naissance). Les réglages arrivent avec #12.

create table public.profils_enfants (
  id uuid primary key,
  prenom text not null check (char_length(prenom) between 1 and 20),
  niveau text not null check (niveau in ('CP', 'CE1', 'CE2', 'CM1', 'CM2')),
  univers text not null check (univers in ('animaux', 'princesse', 'sports', 'police', 'pompier', 'danse')),
  cree_le timestamptz not null default now()
);

create table public.rattachements (
  profil uuid not null references public.profils_enfants (id) on delete cascade,
  parent uuid not null references auth.users (id) on delete cascade,
  rattache_le timestamptz not null default now(),
  primary key (profil, parent)
);

-- La clé primaire couvre la recherche par profil ; celle par parent sert toutes les policies.
create index rattachements_parent_idx on public.rattachements (parent);

-- Droits : rien pour `anon`, le strict nécessaire pour `authenticated` (les écritures passent par les Edge Functions).
revoke all on public.profils_enfants, public.rattachements from anon, authenticated;
grant select, insert on public.profils_enfants, public.rattachements to authenticated;
grant update (prenom, niveau, univers) on public.profils_enfants to authenticated;

-- Fonctions d'aide `security definer`, à périmètre minimal et `search_path` fixé. Elles lisent `rattachements`
-- sans repasser par ses policies : sinon la policy de lecture des rattachements se référerait à elle-même.
-- `est_rattache_au_profil` est aussi la fonction que les futures tables d'un profil (progression, devoirs…)
-- utiliseront dans leurs policies.
create function public.est_rattache_au_profil(p_profil uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.rattachements
    where profil = p_profil and parent = auth.uid()
  );
$$;

create function public.profil_sans_parent(p_profil uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.rattachements where profil = p_profil);
$$;

revoke all on function public.est_rattache_au_profil(uuid), public.profil_sans_parent(uuid) from public, anon;
grant execute on function public.est_rattache_au_profil(uuid), public.profil_sans_parent(uuid) to authenticated;

alter table public.profils_enfants enable row level security;
alter table public.rattachements enable row level security;

create policy profils_enfants_lecture_par_ses_parents on public.profils_enfants
  for select to authenticated
  using (public.est_rattache_au_profil(id));

create policy profils_enfants_creation_par_un_parent on public.profils_enfants
  for insert to authenticated
  with check (auth.uid() is not null);

create policy profils_enfants_modification_par_ses_parents on public.profils_enfants
  for update to authenticated
  using (public.est_rattache_au_profil(id))
  with check (public.est_rattache_au_profil(id));

-- Lecture : les rattachements des profils du parent (donc les siens). Aucune adresse e-mail dans cette table.
create policy rattachements_lecture_des_profils_du_parent on public.rattachements
  for select to authenticated
  using (public.est_rattache_au_profil(profil));

-- Création : le parent ne peut rattacher que lui-même, et seulement à un profil encore sans parent
-- (le premier rattachement). Le second parent passera par la fonction d'acceptation d'une invitation (#13).
create policy rattachements_premier_rattachement_du_parent on public.rattachements
  for insert to authenticated
  with check (parent = auth.uid() and public.profil_sans_parent(profil));

-- Création du profil et de son premier rattachement dans une seule transaction (décision 0009, n°2).
-- `security invoker` : appelée avec le JWT du parent, elle ne contourne aucune policy. Le corps d'une fonction
-- s'exécute dans la transaction de l'appel : si le rattachement échoue, le profil n'est pas créé.
create function public.creer_profil_enfant(
  p_id uuid,
  p_parent uuid,
  p_prenom text,
  p_niveau text,
  p_univers text,
  p_cree_le timestamptz
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.profils_enfants (id, prenom, niveau, univers, cree_le)
  values (p_id, p_prenom, p_niveau, p_univers, p_cree_le);
  insert into public.rattachements (profil, parent)
  values (p_id, p_parent);
end;
$$;

revoke all on function public.creer_profil_enfant(uuid, uuid, text, text, text, timestamptz) from public, anon;
grant execute on function public.creer_profil_enfant(uuid, uuid, text, text, text, timestamptz) to authenticated;
