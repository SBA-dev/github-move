import type { Page } from "@playwright/test";

export async function terminerLaLecture(page: Page) {
  await page.evaluate(() => {
    const faux = Reflect.get(window, "__faux") as {
      enonces: Array<{ lot: number; enonce: { onend: (() => void) | null } }>;
      actifs: unknown[];
    };
    const dernier = faux.enonces[faux.enonces.length - 1];
    faux.actifs = [];
    dernier?.enonce.onend?.();
  });
}
