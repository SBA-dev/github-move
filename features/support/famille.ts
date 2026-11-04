import { type Browser, expect, type Page } from "@playwright/test";
import { deposerLaSession, ouvrirUneSessionSansEmail } from "./connexion-sans-email.ts";
import { installerLeHasardFixe } from "./hasard-fixe.ts";
import { supprimerLesEssaisDuSuffixe } from "./mot-de-passe.ts";
import {
  emailsRecus,
  emailsRecusParLesSuffixes,
  extraireLienEtCode,
  jetonAccepte,
  nettoyerLeParent,
  reculerLEnvoi,
  remettreLeParentAZero,
  supprimerLesProfilsDuParent,
  supprimerParent,
  trouverOuCreerParent,
  trouverParent,
  viderLaBoite,
} from "./supabase-test.ts";

export type Appareil = "tablette" | "telephone";

const ADRESSES_DES_PARENTS: Readonly<Record<string, string>> = {
  Paul: "paul@exemple.test",
  Claire: "claire@exemple.test",
  Marie: "marie@exemple.test",
};

const ADRESSE_DE_TEST = /^(\s*[^@\s+]+)(@exemple\.test\s*)$/i;

const ADRESSE_BIEN_FORMEE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type SessionStockee = { access_token: string; user: { id: string; email: string } };

const PARTIE_LIBRE = ".libre";

/**
 * Le « monde » des scénarios de connexion : les appareils du parent (tablette = page du test, téléphone = second
 * contexte), les adresses de test et le suivi des e-mails reçus.
 *
 * Isolation : les projets Playwright (tablette, téléphone), leurs workers et les exécutions d'autres équipes tournent
 * en même temps sur le même projet Supabase avec les mêmes adresses de scénario. Chacun reçoit donc un suffixe stable :
 * « paul@exemple.test » devient « paul+<équipe>-<projet><worker>@exemple.test », en gardant la casse et les espaces de
 * l'adresse saisie.
 *
 * Réutilisation (décision 0040) : ces parents ne sont pas supprimés en fin de scénario, pour ne pas consommer le quota
 * d'utilisateurs actifs de Supabase.
 * - Début du scénario : la boîte de test et les essais du suffixe sont vidés (restes d'un scénario interrompu).
 * - Première préparation d'un parent : il est trouvé ou créé, ses profils enfants sont supprimés, puis il est remis à
 *   zéro (mot de passe, e-mail confirmé).
 * - Fin du scénario : ses profils enfants sont supprimés, la boîte de test et les essais du suffixe sont vidés.
 *
 * Adresse « libre » : quand un scénario affirme qu'aucun parent n'utilise une adresse, il va souvent l'inscrire pour de
 * vrai. Cette adresse prend alors une partie locale distincte (« paul.libre+<suffixe>@exemple.test ») pour ne pas
 * toucher le parent réutilisé du même prénom ; son parent, créé par l'inscription, est supprimé en fin de scénario.
 */
export class Famille {
  adresseCourante: string | undefined;
  lienUtilise: string | undefined;
  readonly requetesDeLien: string[] = [];
  private readonly envois = new Map<string, number>();
  private readonly adressesUtilisees = new Set<string>();
  private readonly adressesLibres = new Set<string>();
  private readonly adressesLibresUtilisees = new Set<string>();
  private readonly parentsPrepares = new Set<string>();
  private pageDuTelephone: Page | undefined;
  private contexteDuTelephone: Awaited<ReturnType<Browser["newContext"]>> | undefined;

  constructor(
    private readonly suffixe: string,
    private readonly tablette: Page,
    private readonly browser: Browser,
    private readonly baseURL: string,
  ) {
    tablette.on("request", (requete) => {
      if (requete.url().includes("/auth/v1/otp")) this.requetesDeLien.push(requete.url());
    });
  }

  // --- Adresses

  adresse(brute: string): string {
    const adresse = this.transformer(brute);
    const normalisee = adresse.trim().toLowerCase();
    if (this.estDuSuffixe(normalisee)) {
      this.adressesUtilisees.add(normalisee);
      if (this.adressesLibres.has(brute.trim().toLowerCase())) this.adressesLibresUtilisees.add(normalisee);
    }
    return adresse;
  }

  private estDuSuffixe(adresse: string): boolean {
    return adresse.endsWith(`+${this.suffixe}@exemple.test`);
  }

  private garantirUneAdresseDuSuffixe(adresse: string): void {
    if (!this.estDuSuffixe(adresse)) throw new Error(`Adresse hors du suffixe de ce scénario : ${adresse}`);
  }

  normalisee(brute: string): string {
    return this.adresse(brute).trim().toLowerCase();
  }

  private transformer(brute: string): string {
    const partieLibre = this.adressesLibres.has(brute.trim().toLowerCase()) ? PARTIE_LIBRE : "";
    return brute.replace(ADRESSE_DE_TEST, `$1${partieLibre}+${this.suffixe}$2`);
  }

  adresseDe(prenom: string): string {
    const adresse = ADRESSES_DES_PARENTS[prenom];
    if (!adresse) throw new Error(`Parent de test inconnu : ${prenom}`);
    return adresse;
  }

  // --- Appareils

  async page(appareil: Appareil): Promise<Page> {
    if (appareil === "tablette") return this.tablette;
    if (!this.pageDuTelephone) {
      this.contexteDuTelephone = await this.browser.newContext({
        baseURL: this.baseURL,
        viewport: { width: 360, height: 740 },
        hasTouch: true,
      });
      this.pageDuTelephone = await this.contexteDuTelephone.newPage();
    }
    return this.pageDuTelephone;
  }

  // --- Demande d'un lien de connexion (côté parent : on remplit l'écran de connexion)

  async saisirEtEnvoyer(appareil: Appareil, brute: string): Promise<void> {
    const page = await this.page(appareil);
    if (page.url() === "about:blank") await page.goto("/");
    const nouveauLien = page.getByRole("button", { name: "Demander un nouveau lien" });
    if (await nouveauLien.isVisible()) await nouveauLien.click();
    await page.getByLabel("Adresse e-mail").fill(this.adresse(brute));
    await page.getByRole("button", { name: "Recevoir un lien de connexion" }).click();
    if (ADRESSE_BIEN_FORMEE.test(this.normalisee(brute))) {
      const adresse = this.normalisee(brute);
      this.adresseCourante = adresse;
      this.envois.set(adresse, (this.envois.get(adresse) ?? 0) + 1);
    }
  }

  async demanderUnLien(appareil: Appareil, brute: string): Promise<void> {
    await this.saisirEtEnvoyer(appareil, brute);
    const adresse = this.normalisee(brute);
    const page = await this.page(appareil);
    await expect(page.getByRole("status").filter({ hasText: "Un lien de connexion a été envoyé à" })).toContainText(adresse, { ignoreCase: true });
    await this.attendreLEmail(adresse);
  }

  // --- E-mail de connexion reçu (lu dans la boîte de test)

  async attendreLEmail(adresse: string): Promise<void> {
    const attendus = this.envois.get(adresse) ?? 1;
    await expect.poll(async () => (await emailsRecus(adresse)).length).toBeGreaterThanOrEqual(attendus);
  }

  async dernierEmail(adresse: string) {
    await this.attendreLEmail(adresse);
    const recus = await emailsRecus(adresse);
    const dernier = recus[recus.length - 1];
    if (!dernier) throw new Error(`Aucun e-mail reçu pour ${adresse}`);
    return dernier;
  }

  async dernierLien(adresse: string): Promise<string> {
    const { lien } = extraireLienEtCode((await this.dernierEmail(adresse)).texte);
    if (!lien) throw new Error("L'e-mail reçu ne contient pas de lien de connexion.");
    return lien;
  }

  async dernierCode(adresse: string): Promise<string> {
    const { code } = extraireLienEtCode((await this.dernierEmail(adresse)).texte);
    if (!code) throw new Error("L'e-mail reçu ne contient pas de code de connexion.");
    return code;
  }

  async suivreLeLien(appareil: Appareil, adresse: string): Promise<void> {
    const lien = await this.dernierLien(adresse);
    this.lienUtilise = lien;
    await (await this.page(appareil)).goto(lien);
  }

  async reculerLEnvoi(adresse: string, minutes: number): Promise<void> {
    await reculerLEnvoi(adresse, minutes);
  }

  async aucunEmailEnvoye(): Promise<number> {
    return (await emailsRecusParLesSuffixes(this.suffixe)).length;
  }

  // --- Parents préparés

  /**
   * Remise à zéro une seule fois par scénario et par adresse : profils enfants d'un scénario interrompu supprimés, puis
   * mot de passe remis (celui demandé, ou une valeur aléatoire). Un appel ultérieur sans mot de passe ne touche à rien ;
   * un mot de passe explicite est toujours posé.
   */
  async preparerUnParent(brute: string, motDePasse?: string) {
    const adresse = this.normalisee(brute);
    this.garantirUneAdresseDuSuffixe(adresse);
    const parent = await trouverOuCreerParent(adresse);
    const premiere = !this.parentsPrepares.has(adresse);
    if (premiere) await supprimerLesProfilsDuParent(parent.id);
    if (!premiere && motDePasse === undefined) return parent;
    const remis = await remettreLeParentAZero(parent, motDePasse);
    this.parentsPrepares.add(adresse);
    return remis;
  }

  /** Début de scénario : les restes d'un scénario précédent de ce suffixe (nettoyage interrompu) sont effacés. */
  async preparerLeDebut(): Promise<void> {
    await toutEssayer([() => viderLaBoite(this.suffixe), () => supprimerLesEssaisDuSuffixe(this.suffixe)]);
  }

  async verifierQuAucunParentNUtilise(brute: string): Promise<void> {
    const habituelle = brute.trim().toLowerCase();
    if (this.adressesUtilisees.has(this.transformer(brute).trim().toLowerCase())) {
      throw new Error(`L'adresse ${brute} a déjà servi dans ce scénario : elle ne peut plus être déclarée libre.`);
    }
    this.adressesLibres.add(habituelle);
    const libre = this.normalisee(brute);
    this.garantirUneAdresseDuSuffixe(libre);
    const reste = await trouverParent(libre);
    if (reste) {
      await supprimerLesProfilsDuParent(reste.id);
      await supprimerParent(reste.id);
    }
    expect(await trouverParent(libre)).toBeUndefined();
  }

  async parent(adresse: string) {
    return trouverParent(adresse);
  }

  // --- Connexion vue depuis l'appareil

  async session(page: Page): Promise<SessionStockee | null> {
    try {
      const brut = await page.evaluate(() => {
        const cle = Object.keys(localStorage).find((k) => /^sb-.+-auth-token$/.test(k));
        return cle ? localStorage.getItem(cle) : null;
      });
      return brut ? (JSON.parse(brut) as SessionStockee) : null;
    } catch {
      return null;
    }
  }

  async verifierConnecte(appareil: Appareil): Promise<void> {
    const page = await this.page(appareil);
    await expect.poll(async () => (await this.session(page)) !== null).toBe(true);
    const session = await this.session(page);
    expect(await jetonAccepte(session?.access_token ?? "")).toBe(true);
    await expect(page.getByRole("button", { name: "Recevoir un lien de connexion" })).toBeHidden();
  }

  async verifierNonConnecte(appareil: Appareil): Promise<void> {
    const page = await this.page(appareil);
    await expect.poll(async () => await this.session(page)).toBeNull();
    await expect(page.getByRole("button", { name: "Se déconnecter" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "Espace parent" })).toBeHidden();
  }

  async connecter(appareil: Appareil, prenom: string): Promise<void> {
    const adresse = this.normalisee(this.adresseDe(prenom));
    await this.demanderUnLien(appareil, this.adresseDe(prenom));
    await this.suivreLeLien(appareil, adresse);
    await this.verifierConnecte(appareil);
    await expect((await this.page(appareil)).getByRole("heading", { name: "Espace parent" })).toBeVisible();
  }

  // Connexion de préparation sans e-mail (voir connexion-sans-email.ts). L'application s'ouvre sur l'accueil,
  // espace parent fermé : pour y entrer, il faut répondre au contrôle parental.
  async connecterSansEmail(appareil: Appareil, prenom: string): Promise<void> {
    const adresse = this.normalisee(this.adresseDe(prenom));
    await this.preparerUnParent(adresse);
    const page = await this.page(appareil);
    await installerLeHasardFixe(page);
    await deposerLaSession(page, await ouvrirUneSessionSansEmail(adresse));
    await this.verifierConnecte(appareil);
  }

  async demanderLEntreeDeLEspaceParent(appareil: Appareil): Promise<void> {
    const page = await this.page(appareil);
    await page.getByRole("banner").getByRole("button", { name: "Espace parent", exact: true }).click();
  }

  async allerDansLEspaceParent(appareil: Appareil): Promise<void> {
    const page = await this.page(appareil);
    const titre = page.getByRole("heading", { name: "Espace parent" });
    if (!(await titre.isVisible())) {
      await this.demanderLEntreeDeLEspaceParent(appareil);
      const question = page.getByText(/Question pour un adulte : combien font \d × \d \?/);
      await expect(question.or(titre)).toBeVisible();
      if (await question.isVisible()) {
        const [, a, b] = (await question.innerText()).match(/(\d) × (\d)/) ?? [];
        await page.getByRole("textbox").fill(String(Number(a) * Number(b)));
        await page.getByRole("button", { name: "Entrer" }).click();
      }
    }
    await expect(titre).toBeVisible();
  }

  async seDeconnecter(appareil: Appareil): Promise<void> {
    await (await this.page(appareil)).getByRole("button", { name: "Se déconnecter" }).click();
  }

  // --- Nettoyage de fin de scénario : boîte de test, essais, profils des parents réutilisés, parents des adresses libres

  async nettoyer(): Promise<void> {
    await toutEssayer([
      async () => {
        await this.contexteDuTelephone?.close();
      },
      () => viderLaBoite(this.suffixe),
      ...[...this.adressesUtilisees].map((adresse) => () =>
        this.adressesLibresUtilisees.has(adresse) ? this.supprimerLeParentLibre(adresse) : nettoyerLeParent(adresse)
      ),
      () => supprimerLesEssaisDuSuffixe(this.suffixe),
    ]);
  }

  private async supprimerLeParentLibre(adresse: string): Promise<void> {
    const parent = await trouverParent(adresse);
    if (!parent) return;
    await supprimerLesProfilsDuParent(parent.id);
    await supprimerParent(parent.id);
  }
}

/** Exécute toutes les étapes, même si l'une échoue, puis relève toutes les erreurs. */
async function toutEssayer(etapes: ReadonlyArray<() => Promise<void>>): Promise<void> {
  const erreurs: unknown[] = [];
  for (const etape of etapes) {
    try {
      await etape();
    } catch (erreur) {
      erreurs.push(erreur);
    }
  }
  if (erreurs.length > 0) {
    const messages = erreurs.map((erreur) => (erreur instanceof Error ? erreur.message : String(erreur)));
    throw new AggregateError(erreurs, messages.join(" | "));
  }
}
