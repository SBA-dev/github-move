import { assertEquals } from "@std/assert";
import { groupeDuVerbe } from "./groupe-du-verbe.ts";

const casAttendus: [string, "1" | "2" | "3"][] = [
  ["chanter", "1"],
  ["manger", "1"],
  ["Chanter", "1"],
  ["aller", "3"],
  ["finir", "2"],
  ["grandir", "2"],
  ["venir", "3"],
  ["partir", "3"],
  ["acquérir", "3"],
  ["voir", "3"],
  ["savoir", "3"],
  ["prendre", "3"],
  ["faire", "3"],
];

for (const [infinitif, groupe] of casAttendus) {
  Deno.test(`le verbe « ${infinitif} » est du ${groupe}er groupe`.replace("er groupe", groupe === "1" ? "er groupe" : "e groupe"), () => {
    assertEquals(groupeDuVerbe(infinitif), groupe);
  });
}
