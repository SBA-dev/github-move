-- Story #24, décision 0016 : les séances terminées ne sont écrites que par le serveur.
-- `anon` et `authenticated` perdent tout droit d'écriture sur les trois tables d'Apprentissage : la fonction
-- `terminer-la-seance` vérifie le rattachement avec le JWT du parent, revalide la séance, puis écrit avec `service_role`.
-- La lecture reste sous RLS (parent rattaché).

drop policy seances_terminees_enregistrement_par_ses_parents on public.seances_terminees;
drop policy questions_des_seances_enregistrement_par_ses_parents on public.questions_des_seances;
drop policy resultats_des_lecons_creation_par_ses_parents on public.resultats_des_lecons;
drop policy resultats_des_lecons_modification_par_ses_parents on public.resultats_des_lecons;

revoke insert, update, delete on public.seances_terminees, public.questions_des_seances, public.resultats_des_lecons
  from anon, authenticated;
revoke update (meilleures_etoiles, dernieres_etoiles, nombre_de_seances) on public.resultats_des_lecons
  from anon, authenticated;

-- Écrire pour un profil suppose que l'appelant ait vérifié le rattachement : seul `service_role` peut l'exécuter.
revoke all on function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb
) from public, anon, authenticated;
grant execute on function public.enregistrer_la_seance_terminee(
  uuid, uuid, text, jsonb, timestamptz, smallint, integer, jsonb, jsonb
) to service_role;

grant select, insert, update on public.seances_terminees, public.questions_des_seances, public.resultats_des_lecons
  to service_role;
grant usage, select on sequence public.questions_des_seances_id_seq to service_role;
