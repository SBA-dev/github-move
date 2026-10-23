-- Boîte de test des e-mails de connexion (décision 0011).
-- Réservée au projet de développement : la fonction `envoyer-email` y range les e-mails,
-- les tests E2E les relisent. Aucune policy : seule la clé service_role y accède.
create table public.boite_de_test_emails (
  id uuid primary key default gen_random_uuid(),
  destinataire text not null,
  sujet text not null,
  texte text not null,
  range_le timestamptz not null default now()
);

alter table public.boite_de_test_emails enable row level security;

revoke all on public.boite_de_test_emails from anon, authenticated;

create index boite_de_test_emails_destinataire_range_le_idx
  on public.boite_de_test_emails (destinataire, range_le desc);
