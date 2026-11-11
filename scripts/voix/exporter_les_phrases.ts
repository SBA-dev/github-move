import { phrasesAFabriquer } from "../../supabase/functions/_shared/voix/application/phrases-a-fabriquer.ts";
import { parolesFixesDApprentissage } from "../../supabase/functions/_shared/apprentissage/domain/index.ts";
import { parolesFixes } from "../../supabase/functions/_shared/motivation/domain/index.ts";
import { lireLecon } from "../../supabase/functions/_shared/catalogue/domain/lire-lecon.ts";
import bibliotheque from "../../app/bibliotheque.json" with { type: "json" };

const arguments_ = [...Deno.args];
const positionNiveau = arguments_.indexOf("--niveau");
const niveau = positionNiveau === -1 ? undefined : arguments_.splice(positionNiveau, 2)[1];
const [sortie] = arguments_;

const phrases = phrasesAFabriquer(bibliotheque.map(lireLecon), [...parolesFixes(), ...parolesFixesDApprentissage()], {
  niveau,
});
const json = JSON.stringify(phrases, null, 2) + "\n";

if (sortie === undefined) console.log(json);
else Deno.writeTextFileSync(sortie, json);
