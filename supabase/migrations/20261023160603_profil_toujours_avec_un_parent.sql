-- Story #11, correctifs de la review n°1 : un profil enfant a toujours un ou deux parents (RGPD : aucune donnée
-- d'enfant ne reste sans parent), les fonctions d'aide ne sont plus exposées par PostgREST, le prénom est aligné
-- sur le domaine.

-- 1. Fonctions d'aide dans un schéma non exposé (config.toml : `schemas = ["public", "graphql_public"]`).
-- Les policies gardent leur référence : elles pointent la fonction, pas son nom.
create schema private;
grant usage on schema private to authenticated;

alter function public.est_rattache_au_profil(uuid) set schema private;
alter function public.profil_sans_parent(uuid) set schema private;

-- 2. Prénom : pas d'espace au début ni à la fin, comme `Prenom.de` (en plus de 1 à 20 caractères).
alter table public.profils_enfants
  add constraint profils_enfants_prenom_sans_espace_autour check (prenom !~ '^[[:space:]]|[[:space:]]$');

-- 3. Un profil enfant a toujours 1 ou 2 rattachements, vérifié au commit.
-- `security definer` : le compte des rattachements ne dépend pas de ce que la RLS laisse voir à l'appelant.
create function private.verifier_les_rattachements_du_profil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profil uuid;
  v_rattachements integer;
begin
  if tg_op = 'INSERT' then
    v_profil := new.id;
  else
    v_profil := old.profil;
  end if;
  -- Un profil supprimé entre-temps (par exemple avec son dernier parent) n'a plus rien à vérifier.
  if not exists (select 1 from public.profils_enfants where id = v_profil) then
    return null;
  end if;
  select count(*) into v_rattachements from public.rattachements where profil = v_profil;
  if v_rattachements not between 1 and 2 then
    raise exception 'Un profil enfant a un ou deux parents (profil %, % rattachement(s)).', v_profil, v_rattachements
      using errcode = 'check_violation';
  end if;
  return null;
end;
$$;

revoke all on function private.verifier_les_rattachements_du_profil() from public, anon, authenticated;

create constraint trigger profil_enfant_avec_un_parent
  after insert on public.profils_enfants
  deferrable initially deferred
  for each row execute function private.verifier_les_rattachements_du_profil();

create constraint trigger profil_enfant_garde_un_parent
  after delete on public.rattachements
  deferrable initially deferred
  for each row execute function private.verifier_les_rattachements_du_profil();

-- 4. Le dernier rattachement supprimé (par exemple le compte du parent, en cascade depuis `auth.users`)
-- emporte le profil enfant. Ce trigger est immédiat : au commit, le profil n'existe plus et la vérification
-- ci-dessus n'a rien à refuser. Les données du profil partent par cascade des tables qui y seront rattachées.
-- (#14 ajoutera l'export des données avant toute suppression.)
create function private.supprimer_le_profil_sans_parent()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.profils_enfants
  where id = old.profil
    and not exists (select 1 from public.rattachements where profil = old.profil);
  return null;
end;
$$;

revoke all on function private.supprimer_le_profil_sans_parent() from public, anon, authenticated;

create trigger profil_enfant_supprime_avec_son_dernier_parent
  after delete on public.rattachements
  for each row execute function private.supprimer_le_profil_sans_parent();
