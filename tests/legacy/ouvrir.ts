import { readFile } from "node:fs/promises";
import type { Page } from "@playwright/test";

// app/index.html est un fragment publié comme artifact claude.ai : la plateforme ajoute
// le doctype et l'encodage. On fait de même pour le servir dans les tests.
export async function ouvrirApplicationActuelle(page: Page): Promise<void> {
  const fragment = await readFile(new URL("../../app/index.html", import.meta.url), "utf8");
  const pageComplete = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${fragment}`;
  await page.route("**/index.html", (route) => route.fulfill({ contentType: "text/html", body: pageComplete }));
  await page.goto("/index.html");
}
