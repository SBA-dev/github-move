-- Story #30 (30.6) : le jour de la séance terminée est celui de l'appareil de l'enfant (`p_jour`), pas celui du
-- serveur. Il sert à calculer la série. Additif : la colonne est nullable, et `p_jour` est le dernier paramètre
-- avec `default null`, donc les Edge Functions déployées avant cette migration continuent d'appeler les fonctions.
-- Sans `p_jour`, le jour est celui de `termine_le` à Paris. Les séances déjà enregistrées sont reprises une fois.
-- Lecture par les parents rattachés : policy `seances_terminees_lecture_par_ses_parents`, inchangée.
-- `security invoker`, exécutables par `service_role` seul (décision 0016).

alter table public.seances_terminees add column jour date;

update public.seances_terminees
set jour = (termine_le at time zone 'Europe/Paris')::date
where jour is null;

-- Séance et résultat de la leçon (définition de 20261024120000).
drop function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer
);

create function public.enregistrer_la_seance_terminee(
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
  p_jour date default null
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_seance uuid;
  v_resultat uuid;
begin
  insert into public.seances_terminees (id, profil, lecon, choix, termine_le, jour, etoiles, erreurs, par_type)
  values (
    p_id, p_profil, p_lecon, p_choix, p_termine_le,
    coalesce(p_jour, (p_termine_le at time zone 'Europe/Paris')::date),
    p_etoiles, p_erreurs, p_par_type
  )
  on conflict (id) do nothing
  returning id into v_seance;

  if v_seance is null then
    return false;
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
  return true;
end;
$$;

-- Séance sans résultat de leçon (définition de 20261024150000).
drop function public.enregistrer_la_seance_terminee_sans_resultat(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb
);

create function public.enregistrer_la_seance_terminee_sans_resultat(
  p_id uuid,
  p_profil uuid,
  p_lecon text,
  p_choix jsonb,
  p_termine_le timestamptz,
  p_etoiles smallint,
  p_erreurs integer,
  p_par_type jsonb,
  p_questions jsonb,
  p_jour date default null
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_seance uuid;
begin
  insert into public.seances_terminees (id, profil, lecon, choix, termine_le, jour, etoiles, erreurs, par_type)
  values (
    p_id, p_profil, p_lecon, p_choix, p_termine_le,
    coalesce(p_jour, (p_termine_le at time zone 'Europe/Paris')::date),
    p_etoiles, p_erreurs, p_par_type
  )
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

-- Séance, résultat de la leçon et file de révision (définition de 20261025090000).
drop function public.enregistrer_la_seance_terminee_et_la_file_de_revision(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer,
  integer, integer, jsonb
);

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
  p_questions_retenues jsonb,
  p_jour date default null
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
    insert into public.seances_terminees (id, profil, lecon, choix, termine_le, jour, etoiles, erreurs, par_type)
    values (
      p_id, p_profil, p_lecon, p_choix, p_termine_le,
      coalesce(p_jour, (p_termine_le at time zone 'Europe/Paris')::date),
      p_etoiles, p_erreurs, p_par_type
    )
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

revoke all on function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer, date
) from public, anon, authenticated;
revoke all on function public.enregistrer_la_seance_terminee_sans_resultat(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, date
) from public, anon, authenticated;
revoke all on function public.enregistrer_la_seance_terminee_et_la_file_de_revision(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer,
  integer, integer, jsonb, date
) from public, anon, authenticated;
grant execute on function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer, date
) to service_role;
grant execute on function public.enregistrer_la_seance_terminee_sans_resultat(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, date
) to service_role;
grant execute on function public.enregistrer_la_seance_terminee_et_la_file_de_revision(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer,
  integer, integer, jsonb, date
) to service_role;
