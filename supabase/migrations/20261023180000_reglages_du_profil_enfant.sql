-- Story #12 : réglages d'un profil enfant (mode dys, tout lire à voix haute, parcours libre, clavier des dictées,
-- langue du parent). Colonnes de `profils_enfants`, sous les mêmes policies (lecture et modification par les parents
-- rattachés). Ces réglages partent avec l'export et la suppression du profil (#14).

alter table public.profils_enfants
  add column mode_dys boolean not null default false,
  add column tout_lire_a_voix_haute boolean not null default false,
  add column parcours_libre boolean not null default false,
  add column clavier_des_dictees text not null default 'automatique'
    check (clavier_des_dictees in ('automatique', 'lettresDuMot', 'clavierComplet')),
  add column langue_du_parent text not null default 'aucune'
    check (langue_du_parent in ('aucune', 'anglais', 'arabe', 'espagnol', 'portugais', 'turc', 'roumain', 'polonais', 'italien', 'allemand', 'russe', 'ukrainien', 'chinois', 'vietnamien', 'tamoul', 'wolof', 'bambara', 'lingala', 'persan', 'albanais', 'serbe'));

grant update (mode_dys, tout_lire_a_voix_haute, parcours_libre, clavier_des_dictees, langue_du_parent)
  on public.profils_enfants to authenticated;

-- Création du profil, de ses réglages et de son premier rattachement dans une seule transaction.
drop function public.creer_profil_enfant(uuid, uuid, text, text, text, timestamptz);

create function public.creer_profil_enfant(
  p_id uuid,
  p_parent uuid,
  p_prenom text,
  p_niveau text,
  p_univers text,
  p_cree_le timestamptz,
  p_mode_dys boolean,
  p_tout_lire_a_voix_haute boolean,
  p_parcours_libre boolean,
  p_clavier_des_dictees text,
  p_langue_du_parent text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.profils_enfants (
    id, prenom, niveau, univers, cree_le,
    mode_dys, tout_lire_a_voix_haute, parcours_libre, clavier_des_dictees, langue_du_parent
  )
  values (
    p_id, p_prenom, p_niveau, p_univers, p_cree_le,
    p_mode_dys, p_tout_lire_a_voix_haute, p_parcours_libre, p_clavier_des_dictees, p_langue_du_parent
  );
  insert into public.rattachements (profil, parent)
  values (p_id, p_parent);
end;
$$;

revoke all on function public.creer_profil_enfant(
  uuid, uuid, text, text, text, timestamptz, boolean, boolean, boolean, text, text
) from public, anon;
grant execute on function public.creer_profil_enfant(
  uuid, uuid, text, text, text, timestamptz, boolean, boolean, boolean, text, text
) to authenticated;
