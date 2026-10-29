import { Before } from "./fixtures.ts";

// Diagnostic du 29/10 : un scénario qui joue une séance complète ou utilise deux appareils dure 19 à 53 s, au-delà du délai
// de 30 s. On ne baisse jamais un délai déjà plus long (#96 à #102 en fixent 120 s).
const DELAI_D_UN_SCENARIO_LONG_MS = 90_000;

Before({
  tags: "@issue-16 or @issue-20 or @issue-24 or @issue-25 or @issue-27 or @issue-28 or @issue-29 or @issue-30 or @issue-31 or @issue-32 or @issue-33 or @issue-39 or @issue-65 or @issue-79",
}, async ({ $testInfo }) => {
  $testInfo.setTimeout(Math.max($testInfo.timeout, DELAI_D_UN_SCENARIO_LONG_MS));
});
