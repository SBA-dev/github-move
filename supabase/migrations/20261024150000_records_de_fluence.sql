-- Story #20 : records de fluence (meilleur score par enfant, leçon et exercice) et séances de fluence seule.
-- Le record est calculé par le domaine et écrit par l'Edge Function `terminer-la-seance` avec `service_role`
-- (décision 0016) : `anon` et `authenticated` ne peuvent que le lire, sous RLS (parent rattaché).
-- Tout part en cascade avec le profil enfant (RGPD) ; l'export arrive avec #14.
-- Migration additive : une séance de fluence seule n'a pas d'étoiles, donc `etoiles` accepte null (le check reste).

create table public.records_de_fluence (
  profil uuid not null references public.profils_enfants (id) on delete cascade,
  lecon text not null check (char_length(lecon) between 1 and 100),
  exercice text not null check (char_length(exercice) between 1 and 100),
  meilleur_score integer not null check (meilleur_score > 0),
  mis_a_jour_le timestamptz not null default now(),
  primary key (profil, lecon, exercice)
);

alter table public.records_de_fluence enable row level security;

create policy records_de_fluence_lecture_par_ses_parents on public.records_de_fluence
  for select to authenticated
  using (private.est_rattache_au_profil(profil));

revoke all on public.records_de_fluence from anon, authenticated;
grant select on public.records_de_fluence to authenticated;
grant select, insert, update on public.records_de_fluence to service_role;

alter table public.seances_terminees alter column etoiles drop not null;

-- Le record ne baisse jamais, même si deux séances simultanées écrivent : `greatest` est évalué sous verrou de ligne.
create function public.enregistrer_un_record_de_fluence(
  p_profil uuid,
  p_lecon text,
  p_exercice text,
  p_meilleur_score integer
)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.records_de_fluence (profil, lecon, exercice, meilleur_score)
  values (p_profil, p_lecon, p_exercice, p_meilleur_score)
  on conflict (profil, lecon, exercice) do update
  set meilleur_score = greatest(public.records_de_fluence.meilleur_score, excluded.meilleur_score),
      mis_a_jour_le = now();
$$;

revoke all on function public.enregistrer_un_record_de_fluence(uuid, text, text, integer)
  from public, anon, authenticated;
grant execute on function public.enregistrer_un_record_de_fluence(uuid, text, text, integer) to service_role;

-- Séance sans résultat de leçon (fluence seule) : la séance et ses questions, dans une transaction, idempotente.
-- Rend true si la séance vient d'être enregistrée, false si elle l'était déjà (rien n'est écrit).
create function public.enregistrer_la_seance_terminee_sans_resultat(
  p_id uuid,
  p_profil uuid,
  p_lecon text,
  p_choix jsonb,
  p_termine_le timestamptz,
  p_etoiles smallint,
  p_erreurs integer,
  p_par_type jsonb,
  p_questions jsonb
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_seance uuid;
begin
  insert into public.seances_terminees (id, profil, lecon, choix, termine_le, etoiles, erreurs, par_type)
  values (p_id, p_profil, p_lecon, p_choix, p_termine_le, p_etoiles, p_erreurs, p_par_type)
  on conflict (id) do nothing
  returning id into v_seance;

  if v_seance is null then
    return false;
  end if;

  insert into public.questions_des_seances (seance, cle, erreurs, je_ne_sais_pas)
  select p_id, q.cle, q.erreurs, q.je_ne_sais_pas
  from jsonb_to_recordset(p_questions) as q(cle text, erreurs integer, je_ne_sais_pas boolean);
  return true;
end;
$$;

revoke all on function public.enregistrer_la_seance_terminee_sans_resultat(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb
) from public, anon, authenticated;
grant execute on function public.enregistrer_la_seance_terminee_sans_resultat(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb
) to service_role;
