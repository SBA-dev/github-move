// Utilitaires de test pour les scénarios qui touchent le projet Supabase de développement (savanturier-dev).
// La clé service_role ne sert qu'ici : préparer des parents, lire la boîte de test des e-mails et nettoyer.
// Elle ne simule jamais une action du parent, et n'est jamais donnée au navigateur.

function variable(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) throw new Error(`Variable d'environnement absente : ${nom}`);
  return valeur;
}

const urlSupabase = () => variable("SUPABASE_URL");

function entetesServiceRole(): Record<string, string> {
  const cle = variable("SUPABASE_SERVICE_ROLE_KEY");
  return { apikey: cle, Authorization: `Bearer ${cle}`, "Content-Type": "application/json" };
}

async function appeler(chemin: string, init: RequestInit = {}): Promise<Response> {
  const reponse = await fetch(`${urlSupabase()}${chemin}`, {
    ...init,
    headers: { ...entetesServiceRole(), ...init.headers },
  });
  if (!reponse.ok) throw new Error(`Supabase ${init.method ?? "GET"} ${chemin.split("?")[0]} : ${reponse.status}`);
  return reponse;
}

// --- Parents (API d'administration de Supabase Auth)

type ParentExistant = { readonly id: string; readonly email: string };

export async function parentsExistants(): Promise<ParentExistant[]> {
  const reponse = await appeler("/auth/v1/admin/users?per_page=1000");
  const { users } = (await reponse.json()) as { users: { id: string; email?: string }[] };
  return users.map((u) => ({ id: u.id, email: (u.email ?? "").toLowerCase() }));
}

export async function trouverParent(email: string): Promise<ParentExistant | undefined> {
  return (await parentsExistants()).find((p) => p.email === email.toLowerCase());
}

export async function creerParent(email: string): Promise<ParentExistant> {
  const reponse = await appeler("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({ email, email_confirm: true }),
  });
  const { id } = (await reponse.json()) as { id: string };
  return { id, email: email.toLowerCase() };
}

export async function supprimerParent(id: string): Promise<void> {
  await appeler(`/auth/v1/admin/users/${id}`, { method: "DELETE" });
}

// --- Boîte de test des e-mails de connexion (table protégée par la RLS, sans policy)

export type EmailRecu = { readonly destinataire: string; readonly sujet: string; readonly texte: string; readonly range_le: string };

export async function emailsRecus(destinataire: string): Promise<EmailRecu[]> {
  const reponse = await appeler(
    `/rest/v1/boite_de_test_emails?select=destinataire,sujet,texte,range_le&destinataire=eq.${encodeURIComponent(destinataire)}&order=range_le.asc`,
  );
  return (await reponse.json()) as EmailRecu[];
}

export async function emailsRecusParLesSuffixes(suffixe: string): Promise<EmailRecu[]> {
  const reponse = await appeler(
    `/rest/v1/boite_de_test_emails?select=destinataire,sujet,texte,range_le&destinataire=like.${encodeURIComponent(`*+${suffixe}@exemple.test`)}`,
  );
  return (await reponse.json()) as EmailRecu[];
}

export async function viderLaBoite(suffixe: string): Promise<void> {
  await appeler(`/rest/v1/boite_de_test_emails?destinataire=like.${encodeURIComponent(`*+${suffixe}@exemple.test`)}`, {
    method: "DELETE",
  });
}

// --- Profils enfants (story #11) : nettoyage seulement, par identifiant

/** Supprime les profils enfants rattachés au parent (leurs rattachements partent avec eux), un par un. */
export async function supprimerLesProfilsDuParent(parent: string): Promise<void> {
  const reponse = await appeler(`/rest/v1/rattachements?select=profil&parent=eq.${encodeURIComponent(parent)}`);
  const rattachements = (await reponse.json()) as { profil: string }[];
  for (const { profil } of rattachements) {
    await appeler(`/rest/v1/profils_enfants?id=eq.${encodeURIComponent(profil)}`, { method: "DELETE" });
  }
}

export async function supprimerLesParentsDuSuffixe(suffixe: string): Promise<void> {
  const fin = `+${suffixe}@exemple.test`;
  for (const parent of await parentsExistants()) {
    if (!parent.email.endsWith(fin)) continue;
    await supprimerLesProfilsDuParent(parent.id);
    await supprimerParent(parent.id);
  }
}

export function extraireLienEtCode(texte: string): { lien: string | undefined; code: string | undefined } {
  const lien = texte.match(/https?:\/\/\S+\/auth\/v1\/verify\?\S+/)?.[0];
  const code = texte.match(/^\d{6}$/m)?.[0];
  return { lien, code };
}

// --- Vérification côté serveur qu'une connexion est bien ouverte (jeton d'accès accepté par Supabase Auth)

export async function jetonAccepte(jetonAcces: string): Promise<boolean> {
  const reponse = await fetch(`${urlSupabase()}/auth/v1/user`, {
    headers: { apikey: variable("SUPABASE_ANON_KEY"), Authorization: `Bearer ${jetonAcces}` },
  });
  return reponse.ok;
}

// --- Antidatage : le vrai serveur décide ensuite si le lien et le code sont encore valables (décision 0011)
// Supabase Auth juge l'expiration du lien d'après auth.users.recovery_sent_at (vérifié : seule cette colonne compte pour le lien).
// On recule aussi auth.one_time_tokens.created_at pour que l'état reste cohérent.

export async function reculerLEnvoi(email: string, minutes: number): Promise<void> {
  if (!/^[\w.+-]+@exemple\.test$/.test(email) || !Number.isInteger(minutes)) {
    throw new Error("Antidatage refusé : adresse de test et nombre entier de minutes attendus.");
  }
  const requete = `
    update auth.users set recovery_sent_at = now() - interval '${minutes} minutes' where lower(email) = '${email}';
    update auth.one_time_tokens set created_at = now() - interval '${minutes} minutes', updated_at = now() - interval '${minutes} minutes'
      where user_id in (select id from auth.users where lower(email) = '${email}');`;
  const reponse = await fetch(`https://api.supabase.com/v1/projects/${variable("SUPABASE_PROJECT_REF")}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${variable("SUPABASE_ACCESS_TOKEN")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: requete }),
  });
  if (!reponse.ok) throw new Error(`Antidatage impossible : ${reponse.status}`);
}
