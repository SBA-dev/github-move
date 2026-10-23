export interface ChargeDuHookSendEmail {
  user: { email: string };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

export interface DemandeDEmail {
  adresse: string;
  code: string;
  lien: string;
}

export class TypeDActionNonPrisEnCharge extends Error {
  constructor(typeDAction: string) {
    super(`Le type d'action « ${typeDAction} » ne sert pas à la connexion.`);
    this.name = "TypeDActionNonPrisEnCharge";
  }
}

const typesDActionDeConnexion = ["magiclink", "signup"];

export function traduireLaDemandeDEmailSupabase(
  charge: ChargeDuHookSendEmail,
  urlDuServiceAuth: string,
): DemandeDEmail {
  const { token, token_hash, redirect_to, email_action_type } = charge.email_data;
  if (!typesDActionDeConnexion.includes(email_action_type)) {
    throw new TypeDActionNonPrisEnCharge(email_action_type);
  }
  const parametres = new URLSearchParams({ token: token_hash, type: email_action_type, redirect_to });
  return {
    adresse: charge.user.email,
    code: token,
    lien: `${urlDuServiceAuth}/verify?${parametres}`,
  };
}
