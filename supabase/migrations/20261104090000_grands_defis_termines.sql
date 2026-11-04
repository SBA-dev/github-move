-- Story #137 : grand défi d'une matière terminé (décision 0041), enregistré à part de `defis_termines`.
-- Le grand défi est identifié par (matière, classe), sans numéro de partie. Il est relevé quand le profil a au moins
-- une ligne pour (matière, classe). Aucune réponse ni aucune question n'est gardée (minimisation) ; les questions
-- ratées entrent dans la file de révision (#28).
-- Migration strictement additive : aucune table ni fonction existante n'est modifiée.
-- Écrit par l'Edge Function `terminer-le-defi` avec `service_role` (décision 0016) : `anon` et `authenticated` ne
-- peuvent que lire, sous RLS (parent rattaché). Tout part en cascade avec le profil enfant (RGPD).
-- Contrat d'export (#14) : ajouter `grands_defis_termines` à ce que l'export d'un profil doit contenir.

create table public.grands_defis_termines (
  id uuid primary key,
  profil uuid not null references public.profils_enfants (id) on delete cascade,
  matiere text not null check (matiere in ('francais', 'maths', 'sciences', 'histoire', 'anglais', 'emc')),
  classe text not null check (classe in ('CP', 'CE1', 'CE2', 'CM1', 'CM2')),
  termine_le timestamptz not null,
  jour date not null
);

create index grands_defis_termines_profil_defi_idx
  on public.grands_defis_termines (profil, matiere, classe);

alter table public.grands_defis_termines enable row level security;

create policy grands_defis_termines_lecture_par_ses_parents on public.grands_defis_termines
  for select to authenticated
  using (private.est_rattache_au_profil(profil));

revoke all on public.grands_defis_termines from anon, authenticated;
grant select on public.grands_defis_termines to authenticated;
grant select, insert on public.grands_defis_termines to service_role;

-- Grand défi terminé et file de révision écrits d'un seul geste (tout ou rien), idempotent par `p_id`.
-- Rend 'enregistree', 'dejaEnregistree' (rien n'est écrit) ou 'conflit' (la version de la file n'est plus celle lue :
-- rien n'est écrit). La file est écrite par `remplacer_la_file_de_revision` (#28).
create function public.enregistrer_le_grand_defi_termine(
  p_id uuid,
  p_profil uuid,
  p_matiere text,
  p_classe text,
  p_termine_le timestamptz,
  p_jour date,
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
  v_defi uuid;
begin
  begin
    insert into public.grands_defis_termines (id, profil, matiere, classe, termine_le, jour)
    values (p_id, p_profil, p_matiere, p_classe, p_termine_le, p_jour)
    on conflict (id) do nothing
    returning id into v_defi;

    if v_defi is null then
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

revoke all on function public.enregistrer_le_grand_defi_termine(
  uuid, uuid, text, text, timestamptz, date, integer, integer, jsonb
) from public, anon, authenticated;
grant execute on function public.enregistrer_le_grand_defi_termine(
  uuid, uuid, text, text, timestamptz, date, integer, integer, jsonb
) to service_role;
