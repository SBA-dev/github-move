-- Story #28 : file de révision d'un profil (questions ratées à reposer à 1, 3 puis 7 jours) et séances de révision
-- terminées (idempotence, série, suivi). Aucune réponse brute n'est gardée.
-- Migration additive : aucune table ni fonction existante n'est modifiée.
-- Écrit par les Edge Functions avec `service_role` (décision 0016) : `anon` et `authenticated` ne peuvent que lire,
-- sous RLS (parent rattaché). Tout part en cascade avec le profil enfant (RGPD).
-- Contrat d'export (#14) : ajouter `files_de_revision`, `questions_retenues` et `seances_de_revision_terminees`
-- à ce que l'export d'un profil doit contenir.

create table public.files_de_revision (
  profil uuid primary key references public.profils_enfants (id) on delete cascade,
  erreurs_corrigees_pour_de_bon integer not null default 0 check (erreurs_corrigees_pour_de_bon >= 0),
  version integer not null default 0 check (version >= 0)
);

create table public.questions_retenues (
  profil uuid not null references public.profils_enfants (id) on delete cascade,
  cle text not null check (char_length(cle) between 1 and 500),
  lecon_d_origine text not null check (char_length(lecon_d_origine) between 1 and 100),
  position integer not null check (position >= 0),
  type text not null check (char_length(type) between 1 and 50),
  tirage text check (char_length(tirage) <= 1000),
  intervalle smallint not null check (intervalle in (1, 3, 7)),
  date_de_revision date not null,
  derniere_erreur_le timestamptz not null,
  nombre_de_fois_ratee integer not null check (nombre_de_fois_ratee >= 1),
  primary key (profil, cle)
);

create index questions_retenues_profil_date_de_revision_idx
  on public.questions_retenues (profil, date_de_revision);

create table public.seances_de_revision_terminees (
  id uuid primary key,
  profil uuid not null references public.profils_enfants (id) on delete cascade,
  termine_le timestamptz not null,
  jour date not null,
  nombre_de_questions smallint not null check (nombre_de_questions between 0 and 10),
  nombre_de_questions_justes smallint not null,
  check (nombre_de_questions_justes between 0 and nombre_de_questions)
);

create index seances_de_revision_terminees_profil_jour_idx
  on public.seances_de_revision_terminees (profil, jour);

alter table public.files_de_revision enable row level security;
alter table public.questions_retenues enable row level security;
alter table public.seances_de_revision_terminees enable row level security;

create policy files_de_revision_lecture_par_ses_parents on public.files_de_revision
  for select to authenticated
  using (private.est_rattache_au_profil(profil));

create policy questions_retenues_lecture_par_ses_parents on public.questions_retenues
  for select to authenticated
  using (private.est_rattache_au_profil(profil));

create policy seances_de_revision_terminees_lecture_par_ses_parents on public.seances_de_revision_terminees
  for select to authenticated
  using (private.est_rattache_au_profil(profil));

revoke all on public.files_de_revision from anon, authenticated;
revoke all on public.questions_retenues from anon, authenticated;
revoke all on public.seances_de_revision_terminees from anon, authenticated;
grant select on public.files_de_revision to authenticated;
grant select on public.questions_retenues to authenticated;
grant select on public.seances_de_revision_terminees to authenticated;
grant select, insert, update on public.files_de_revision to service_role;
grant select, insert, update, delete on public.questions_retenues to service_role;
grant select, insert on public.seances_de_revision_terminees to service_role;

-- Remplace la file du profil : ses questions retenues sont remplacées par `p_questions` (tableau d'objets
-- { cle, lecon_d_origine, position, type, tirage, intervalle, date_de_revision, derniere_erreur_le,
-- nombre_de_fois_ratee }), le compteur est écrit et la version passe de `p_version_lue` à `p_version_lue + 1`.
-- Une version lue à 0 signifie « file jamais écrite ». Si la version stockée n'est plus `p_version_lue`, elle échoue
-- avec le code 40001 : l'appelant (transaction englobante) annule tout.
create function public.remplacer_la_file_de_revision(
  p_profil uuid,
  p_version_lue integer,
  p_erreurs_corrigees_pour_de_bon integer,
  p_questions jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_profil uuid;
begin
  if p_version_lue = 0 then
    insert into public.files_de_revision (profil, erreurs_corrigees_pour_de_bon, version)
    values (p_profil, p_erreurs_corrigees_pour_de_bon, 1)
    on conflict (profil) do nothing
    returning profil into v_profil;
  else
    update public.files_de_revision
    set erreurs_corrigees_pour_de_bon = p_erreurs_corrigees_pour_de_bon,
        version = p_version_lue + 1
    where profil = p_profil and version = p_version_lue
    returning profil into v_profil;
  end if;

  if v_profil is null then
    raise exception 'La file de révision a changé entre la lecture et l''écriture.'
      using errcode = '40001';
  end if;

  delete from public.questions_retenues where profil = p_profil;
  insert into public.questions_retenues
    (profil, cle, lecon_d_origine, position, type, tirage, intervalle, date_de_revision, derniere_erreur_le,
     nombre_de_fois_ratee)
  select p_profil, q.cle, q.lecon_d_origine, q.position, q.type, q.tirage, q.intervalle, q.date_de_revision,
         q.derniere_erreur_le, q.nombre_de_fois_ratee
  from jsonb_to_recordset(p_questions) as q(
    cle text, lecon_d_origine text, position integer, type text, tirage text, intervalle smallint,
    date_de_revision date, derniere_erreur_le timestamptz, nombre_de_fois_ratee integer
  );
end;
$$;

-- Séance, résultat de la leçon et file de révision écrits d'un seul geste (tout ou rien).
-- Rend 'enregistree', 'dejaEnregistree' (la séance existait : rien n'est écrit) ou 'conflit' (le nombre de séances
-- de la leçon ou la version de la file n'est plus celui lu : rien n'est écrit).
-- La fonction `enregistrer_la_seance_terminee` (sans file) reste pour la compatibilité.
create function public.enregistrer_la_seance_terminee_et_la_file_de_revision(
  p_id uuid,
  p_profil uuid,
  p_lecon text,
  p_choix jsonb,
  p_termine_le timestamptz,
  p_etoiles smallint,
  p_erreurs integer,
  p_par_type jsonb,
  p_questions jsonb,
  p_meilleures_etoiles smallint,
  p_dernieres_etoiles smallint,
  p_nombre_de_seances_lu integer,
  p_version_de_la_file_lue integer,
  p_erreurs_corrigees_pour_de_bon integer,
  p_questions_retenues jsonb
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_seance uuid;
  v_resultat uuid;
begin
  begin
    insert into public.seances_terminees (id, profil, lecon, choix, termine_le, etoiles, erreurs, par_type)
    values (p_id, p_profil, p_lecon, p_choix, p_termine_le, p_etoiles, p_erreurs, p_par_type)
    on conflict (id) do nothing
    returning id into v_seance;

    if v_seance is null then
      return 'dejaEnregistree';
    end if;

    if p_nombre_de_seances_lu = 0 then
      insert into public.resultats_des_lecons
        (profil, lecon, meilleures_etoiles, dernieres_etoiles, nombre_de_seances)
      values (p_profil, p_lecon, p_meilleures_etoiles, p_dernieres_etoiles, 1)
      on conflict (profil, lecon) do nothing
      returning profil into v_resultat;
    else
      update public.resultats_des_lecons
      set meilleures_etoiles = p_meilleures_etoiles,
          dernieres_etoiles = p_dernieres_etoiles,
          nombre_de_seances = p_nombre_de_seances_lu + 1
      where profil = p_profil and lecon = p_lecon and nombre_de_seances = p_nombre_de_seances_lu
      returning profil into v_resultat;
    end if;

    if v_resultat is null then
      raise exception 'Le résultat de la leçon a changé entre la lecture et l''écriture.'
        using errcode = '40001';
    end if;

    insert into public.questions_des_seances (seance, cle, erreurs, je_ne_sais_pas)
    select p_id, q.cle, q.erreurs, q.je_ne_sais_pas
    from jsonb_to_recordset(p_questions) as q(cle text, erreurs integer, je_ne_sais_pas boolean);

    perform public.remplacer_la_file_de_revision(
      p_profil, p_version_de_la_file_lue, p_erreurs_corrigees_pour_de_bon, p_questions_retenues
    );
    return 'enregistree';
  exception
    when serialization_failure then
      return 'conflit';
  end;
end;
$$;

-- Séance de révision terminée et file de révision écrites d'un seul geste (tout ou rien), idempotent par `p_id`.
-- Rend 'enregistree', 'dejaEnregistree' (rien n'est écrit) ou 'conflit' (la version de la file n'est plus celle lue :
-- rien n'est écrit).
create function public.enregistrer_la_seance_de_revision_terminee(
  p_id uuid,
  p_profil uuid,
  p_termine_le timestamptz,
  p_jour date,
  p_nombre_de_questions smallint,
  p_nombre_de_questions_justes smallint,
  p_version_de_la_file_lue integer,
  p_erreurs_corrigees_pour_de_bon integer,
  p_questions_retenues jsonb
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_seance uuid;
begin
  begin
    insert into public.seances_de_revision_terminees
      (id, profil, termine_le, jour, nombre_de_questions, nombre_de_questions_justes)
    values (p_id, p_profil, p_termine_le, p_jour, p_nombre_de_questions, p_nombre_de_questions_justes)
    on conflict (id) do nothing
    returning id into v_seance;

    if v_seance is null then
      return 'dejaEnregistree';
    end if;

    perform public.remplacer_la_file_de_revision(
      p_profil, p_version_de_la_file_lue, p_erreurs_corrigees_pour_de_bon, p_questions_retenues
    );
    return 'enregistree';
  exception
    when serialization_failure then
      return 'conflit';
  end;
end;
$$;

revoke all on function public.remplacer_la_file_de_revision(uuid, integer, integer, jsonb)
  from public, anon, authenticated;
revoke all on function public.enregistrer_la_seance_terminee_et_la_file_de_revision(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer,
  integer, integer, jsonb
) from public, anon, authenticated;
revoke all on function public.enregistrer_la_seance_de_revision_terminee(
  uuid, uuid, timestamptz, date, smallint, smallint, integer, integer, jsonb
) from public, anon, authenticated;
grant execute on function public.remplacer_la_file_de_revision(uuid, integer, integer, jsonb) to service_role;
grant execute on function public.enregistrer_la_seance_terminee_et_la_file_de_revision(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer,
  integer, integer, jsonb
) to service_role;
grant execute on function public.enregistrer_la_seance_de_revision_terminee(
  uuid, uuid, timestamptz, date, smallint, smallint, integer, integer, jsonb
) to service_role;
