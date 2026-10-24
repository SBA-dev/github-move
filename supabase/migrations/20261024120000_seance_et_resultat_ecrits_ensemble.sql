-- Story #24, revue n°1 : la séance terminée, ses questions et le résultat de la leçon sont écrits dans une seule
-- transaction. Avant, le résultat s'écrivait à part : un échec entre les deux, ou deux séances simultanées de la
-- même leçon, pouvaient perdre des étoiles ou compter une séance deux fois.
--
-- La fonction rend true si la séance vient d'être enregistrée, false si elle l'était déjà (rien n'est écrit).
-- Si le nombre de séances stocké n'est plus `p_nombre_de_seances_lu` (une autre séance de la même leçon est passée),
-- elle échoue avec le code 40001 : la transaction est annulée, rien n'est écrit, l'appelant relit et recommence.
-- Les valeurs du résultat sont calculées par le domaine ; le nombre de séances écrit est `p_nombre_de_seances_lu + 1`.
-- `security invoker`, exécutable par `service_role` seul (décision 0016).

drop function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb
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
  p_nombre_de_seances_lu integer
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
  insert into public.seances_terminees (id, profil, lecon, choix, termine_le, etoiles, erreurs, par_type)
  values (p_id, p_profil, p_lecon, p_choix, p_termine_le, p_etoiles, p_erreurs, p_par_type)
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

revoke all on function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer
) from public, anon, authenticated;
grant execute on function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb, smallint, smallint, integer
) to service_role;
