-- Story #72, décision 0019 : essais de réinitialisation du mot de passe, comptés côté serveur.
-- Une ligne par adresse (en minuscules), même si l'adresse n'a aucun parent. Jamais de prénom, de mot de passe
-- ni d'identifiant de parent. Aucune policy : seule la fonction `reinitialiser-le-mot-de-passe` y accède (service_role).
create table public.essais_de_reinitialisation (
  adresse text primary key check (adresse = lower(adresse)),
  essais_rates smallint not null check (essais_rates between 0 and 5),
  dernier_rate_le timestamptz,
  bloque_jusqua timestamptz,
  -- Contrôle de version : deux essais simultanés ne comptent pas pour un seul (mise à jour conditionnelle).
  version integer not null default 1
);

alter table public.essais_de_reinitialisation enable row level security;

revoke all on public.essais_de_reinitialisation from anon, authenticated;
grant select, insert, update, delete on public.essais_de_reinitialisation to service_role;

create index essais_de_reinitialisation_dernier_rate_le_idx
  on public.essais_de_reinitialisation (dernier_rate_le);

-- Conservation : 24 heures au plus après le dernier raté (RGPD). Le registre efface déjà les essais oubliés à chaque
-- enregistrement ; cette fonction efface aussi ceux d'adresses qui ne reviennent jamais.
create function public.effacer_les_essais_de_reinitialisation_oublies()
returns void
language sql
security invoker
set search_path = ''
as $$
  delete from public.essais_de_reinitialisation
  where dernier_rate_le is null or dernier_rate_le <= now() - interval '24 hours';
$$;

revoke all on function public.effacer_les_essais_de_reinitialisation_oublies() from public, anon, authenticated;
grant execute on function public.effacer_les_essais_de_reinitialisation_oublies() to service_role;

create extension if not exists pg_cron;

select cron.schedule(
  'effacer-les-essais-de-reinitialisation-oublies',
  '*/15 * * * *',
  'select public.effacer_les_essais_de_reinitialisation_oublies()'
);

-- Recherche d'un parent par son adresse (la réinitialisation n'a pas de JWT). L'API d'administration de Supabase Auth
-- ne sait pas chercher par adresse ; cette fonction ne rend que l'identifiant, et seul service_role peut l'exécuter.
create function public.parent_de_l_adresse(p_adresse text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from auth.users where lower(email) = lower(p_adresse) limit 1;
$$;

revoke all on function public.parent_de_l_adresse(text) from public, anon, authenticated;
grant execute on function public.parent_de_l_adresse(text) to service_role;
