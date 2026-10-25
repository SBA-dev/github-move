-- Story #27 : résultat du test de départ d'un profil (date du dernier test fini et leçons réussies au test de départ)
-- et tests déjà comptés (idempotence du rejeu d'un envoi). Seuls la date et les leçons sont gardées : ni réponses ni erreurs.
-- Écrit par l'Edge Function `terminer-le-test-de-depart` avec `service_role` (décision 0016) : `anon` et `authenticated`
-- ne peuvent que lire le résultat, sous RLS (parent rattaché). Tout part en cascade avec le profil enfant (RGPD).
-- Contrat d'export (#14) : ajouter `resultats_des_tests_de_depart` à ce que l'export d'un profil doit contenir.

create table public.resultats_des_tests_de_depart (
  profil uuid primary key references public.profils_enfants (id) on delete cascade,
  fait_le timestamptz not null,
  lecons_reussies text[] not null default '{}' check (cardinality(lecons_reussies) <= 1000)
);

create table public.tests_de_depart_comptes (
  test uuid primary key,
  profil uuid not null references public.profils_enfants (id) on delete cascade
);

create index tests_de_depart_comptes_profil_idx on public.tests_de_depart_comptes (profil);

alter table public.resultats_des_tests_de_depart enable row level security;
alter table public.tests_de_depart_comptes enable row level security;

create policy resultats_des_tests_de_depart_lecture_par_ses_parents on public.resultats_des_tests_de_depart
  for select to authenticated
  using (private.est_rattache_au_profil(profil));

revoke all on public.resultats_des_tests_de_depart from anon, authenticated;
revoke all on public.tests_de_depart_comptes from anon, authenticated;
grant select on public.resultats_des_tests_de_depart to authenticated;
grant select, insert, update on public.resultats_des_tests_de_depart to service_role;
grant select, insert on public.tests_de_depart_comptes to service_role;

-- Compte le test (rien d'écrit s'il l'est déjà : rend false) puis réunit les leçons avec ce qui est enregistré
-- et garde la date la plus récente. Une seule transaction : deux envois simultanés ne s'écrasent pas.
create function public.enregistrer_un_resultat_de_test_de_depart(
  p_profil uuid,
  p_test uuid,
  p_fait_le timestamptz,
  p_lecons_reussies text[]
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_test uuid;
begin
  insert into public.tests_de_depart_comptes (test, profil)
  values (p_test, p_profil)
  on conflict (test) do nothing
  returning test into v_test;

  if v_test is null then
    return false;
  end if;

  insert into public.resultats_des_tests_de_depart (profil, fait_le, lecons_reussies)
  values (p_profil, p_fait_le, p_lecons_reussies)
  on conflict (profil) do update
  set fait_le = greatest(public.resultats_des_tests_de_depart.fait_le, excluded.fait_le),
      lecons_reussies = (
        select coalesce(array_agg(distinct lecon order by lecon), '{}')
        from unnest(public.resultats_des_tests_de_depart.lecons_reussies || excluded.lecons_reussies) as lecon
      );
  return true;
end;
$$;

revoke all on function public.enregistrer_un_resultat_de_test_de_depart(uuid, uuid, timestamptz, text[])
  from public, anon, authenticated;
grant execute on function public.enregistrer_un_resultat_de_test_de_depart(uuid, uuid, timestamptz, text[])
  to service_role;
