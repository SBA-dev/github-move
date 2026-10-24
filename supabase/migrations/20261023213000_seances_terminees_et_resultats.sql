-- Story #24 : séances terminées et résultats des leçons (décision 0013).
-- Seul le résumé d'une séance est gardé (minimisation) : jamais les réponses données ni les tirages.
-- Les écritures passent par l'Edge Function `terminer-la-seance`, avec le JWT du parent rattaché au profil.
-- Tout part en cascade avec le profil enfant (RGPD) ; l'export arrive avec #14.

create table public.seances_terminees (
  id uuid primary key,
  profil uuid not null references public.profils_enfants (id) on delete cascade,
  lecon text not null check (char_length(lecon) between 1 and 100),
  choix jsonb not null check (
    choix ->> 'genre' in ('complete', 'unExercice')
  ),
  termine_le timestamptz not null,
  etoiles smallint not null check (etoiles between 1 and 3),
  erreurs integer not null check (erreurs >= 0),
  par_type jsonb not null default '{}'::jsonb
);

create index seances_terminees_profil_idx on public.seances_terminees (profil, termine_le);

create table public.questions_des_seances (
  id bigint generated always as identity primary key,
  seance uuid not null references public.seances_terminees (id) on delete cascade,
  cle text not null check (char_length(cle) between 1 and 500),
  erreurs integer not null check (erreurs >= 0),
  je_ne_sais_pas boolean not null default false
);

create index questions_des_seances_seance_idx on public.questions_des_seances (seance);

create table public.resultats_des_lecons (
  profil uuid not null references public.profils_enfants (id) on delete cascade,
  lecon text not null check (char_length(lecon) between 1 and 100),
  meilleures_etoiles smallint not null check (meilleures_etoiles between 1 and 3),
  dernieres_etoiles smallint not null check (dernieres_etoiles between 1 and 3),
  nombre_de_seances integer not null check (nombre_de_seances >= 1),
  primary key (profil, lecon),
  check (meilleures_etoiles >= dernieres_etoiles)
);

-- Droits : rien pour `anon`. `authenticated` lit, insère, et ne modifie que les trois colonnes du résultat d'une
-- leçon. Aucun update ni delete sur les séances (une séance terminée ne change plus) : seule la cascade les supprime.
revoke all on public.seances_terminees, public.questions_des_seances, public.resultats_des_lecons
  from anon, authenticated;
grant select, insert on public.seances_terminees, public.questions_des_seances, public.resultats_des_lecons
  to authenticated;
grant update (meilleures_etoiles, dernieres_etoiles, nombre_de_seances) on public.resultats_des_lecons
  to authenticated;

alter table public.seances_terminees enable row level security;
alter table public.questions_des_seances enable row level security;
alter table public.resultats_des_lecons enable row level security;

create policy seances_terminees_lecture_par_ses_parents on public.seances_terminees
  for select to authenticated
  using (private.est_rattache_au_profil(profil));

create policy seances_terminees_enregistrement_par_ses_parents on public.seances_terminees
  for insert to authenticated
  with check (private.est_rattache_au_profil(profil));

-- Les questions suivent leur séance : la sous-requête passe par la policy de lecture des séances (invoker).
create policy questions_des_seances_lecture_par_ses_parents on public.questions_des_seances
  for select to authenticated
  using (exists (select 1 from public.seances_terminees s where s.id = seance));

create policy questions_des_seances_enregistrement_par_ses_parents on public.questions_des_seances
  for insert to authenticated
  with check (exists (select 1 from public.seances_terminees s where s.id = seance));

create policy resultats_des_lecons_lecture_par_ses_parents on public.resultats_des_lecons
  for select to authenticated
  using (private.est_rattache_au_profil(profil));

create policy resultats_des_lecons_creation_par_ses_parents on public.resultats_des_lecons
  for insert to authenticated
  with check (private.est_rattache_au_profil(profil));

create policy resultats_des_lecons_modification_par_ses_parents on public.resultats_des_lecons
  for update to authenticated
  using (private.est_rattache_au_profil(profil))
  with check (private.est_rattache_au_profil(profil));

-- Enregistrement idempotent d'une séance terminée et de ses questions, dans une seule transaction.
-- `security invoker` : appelée avec le JWT du parent, elle ne contourne aucune policy. La clé primaire rend
-- l'idempotence sûre même pour deux envois simultanés : le second attend la fin du premier, puis ne crée rien.
-- Rend true si la séance vient d'être enregistrée, false si elle l'était déjà.
create function public.enregistrer_la_seance_terminee(
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
  v_enregistree uuid;
begin
  insert into public.seances_terminees (id, profil, lecon, choix, termine_le, etoiles, erreurs, par_type)
  values (p_id, p_profil, p_lecon, p_choix, p_termine_le, p_etoiles, p_erreurs, p_par_type)
  on conflict (id) do nothing
  returning id into v_enregistree;

  if v_enregistree is null then
    return false;
  end if;

  insert into public.questions_des_seances (seance, cle, erreurs, je_ne_sais_pas)
  select p_id, q.cle, q.erreurs, q.je_ne_sais_pas
  from jsonb_to_recordset(p_questions) as q(cle text, erreurs integer, je_ne_sais_pas boolean);
  return true;
end;
$$;

revoke all on function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb
) from public, anon;
grant execute on function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb
) to authenticated;
