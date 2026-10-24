import { type Browser, expect, type Page } from "@playwright/test";
import { deposerLaSession, ouvrirUneSessionSansEmail } from "./connexion-sans-email.ts";
import { installerLeHasardFixe } from "./hasard-fixe.ts";
import { supprimerLesEssaisDuSuffixe } from "./mot-de-passe.ts";
import {
  creerParent,
  emailsRecus,
  emailsRecusParLesSuffixes,
  extraireLienEtCode,
  jetonAccepte,
  reculerLEnvoi,
  supprimerLesParentsDuSuffixe,
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

/**
 * Le « monde » des scénarios de connexion : les appareils du parent (tablette = page du test, téléphone = second
 * contexte), les adresses de test et le suivi des e-mails reçus.
 *
 * Isolation : les projets Playwright (tablette, téléphone), leurs workers et les exécutions d'autres équipes tournent
 * en même temps sur le même projet Supabase avec les mêmes adresses de scénario. Chacun reçoit donc un suffixe :
 * « paul@exemple.test » devient « paul+<projet><worker>-<jeton>@exemple.test », en gardant la casse et les espaces de
 * l'adresse saisie. Le nettoyage de fin de
 * scénario (boîte de test, parents) ne touche que les adresses de son suffixe.
 */
export class Famille {
  adresseCourante: string | undefined;
  lienUtilise: string | undefined;
  readonly requetesDeLien: string[] = [];
  private readonly envois = new Map<string, number>();
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
    return brute.replace(ADRESSE_DE_TEST, `$1+${this.suffixe}$2`);
  }

  normalisee(brute: string): string {
    return this.adresse(brute).trim().toLowerCase();
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

  async preparerUnParent(brute: string) {
    const adresse = this.normalisee(brute);
    return (await trouverParent(adresse)) ?? (await creerParent(adresse));
  }

  async verifierQuAucunParentNUtilise(brute: string): Promise<void> {
    expect(await trouverParent(this.normalisee(brute))).toBeUndefined();
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

  // --- Nettoyage de fin de scénario : boîte de test et parents créés pour ce suffixe

  async nettoyer(): Promise<void> {
    await this.contexteDuTelephone?.close();
    await viderLaBoite(this.suffixe);
    await supprimerLesParentsDuSuffixe(this.suffixe);
    await supprimerLesEssaisDuSuffixe(this.suffixe);
  }
}
