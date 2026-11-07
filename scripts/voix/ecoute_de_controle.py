"""Page d'écoute de contrôle des sons de phrases, par niveau (#182) : `docs/voix.md`.

    python3 scripts/voix/ecoute_de_controle.py <niveau> [--paroles-communes] [--inventaire inventaire.json]

Écrit `ecoute/ecoute-<niveau>.html` (jamais publié, ignoré par git).
"""
import argparse
import html
import json
import subprocess
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
DOSSIER_DES_PAGES = RACINE / "ecoute"
REPERTOIRE_DES_SONS = RACINE / "public" / "voix" / "repertoire.json"
BIBLIOTHEQUE = RACINE / "app" / "bibliotheque.json"
SCRIPT_D_INVENTAIRE = Path(__file__).with_name("inventaire-des-phrases.ts")
PAROLES_COMMUNES = "paroles-communes"

SCRIPT_DE_LA_PAGE = """
document.querySelectorAll("button[data-phrase]").forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    var liste = document.getElementById("mal-prononcees");
    liste.value += bouton.dataset.phrase + "\\n";
  });
});
"""


def echapper(texte):
    return html.escape(texte, quote=True)


def _cles_du_niveau(bibliotheque, niveau, inventaire, avec_paroles_communes):
    lecons_du_niveau = [lecon["id"] for lecon in bibliotheque if lecon["niveau"] == niveau]
    if not lecons_du_niveau:
        raise ValueError(f"Aucune leçon au niveau {niveau}")
    sources = lecons_du_niveau + ([PAROLES_COMMUNES] if avec_paroles_communes else [])
    cles = []
    for source in sources:
        for cle in inventaire["lecons"].get(source, []):
            if cle not in cles:
                cles.append(cle)
    return cles


def _lecteur(son):
    if son is None:
        return "<em>son absent</em>"
    return f'<audio controls preload="none" src="../public/voix/{echapper(son["fichier"])}"></audio>'


def _ligne(phrase, son):
    texte = echapper(phrase)
    return (
        f"<li><p>{texte}</p>{_lecteur(son)} "
        f'<button type="button" data-phrase="{texte}">mal prononcé</button></li>'
    )


def page_d_ecoute(repertoire, bibliotheque, niveau, inventaire, avec_paroles_communes=False):
    phrases = {p["cle"]: p["phrase"] for p in inventaire["phrases"]}
    cles = _cles_du_niveau(bibliotheque, niveau, inventaire, avec_paroles_communes)
    lignes = "\n".join(_ligne(phrases[cle], repertoire["sons"].get(cle)) for cle in cles)
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Écoute de contrôle : {echapper(niveau)}</title>
</head>
<body>
<h1>Écoute de contrôle : {echapper(niveau)}</h1>
<ul>
{lignes}
</ul>
<h2>Phrases mal prononcées</h2>
<textarea id="mal-prononcees" rows="10" cols="80"></textarea>
<script>{SCRIPT_DE_LA_PAGE}</script>
</body>
</html>
"""


def inventaire_des_phrases(chemin):
    if chemin:
        return json.loads(Path(chemin).read_text(encoding="utf-8"))
    sortie = subprocess.run(
        ["deno", "run", "--allow-read", str(SCRIPT_D_INVENTAIRE)], check=True, capture_output=True, text=True
    ).stdout
    return json.loads(sortie)


def principal(arguments=None):
    analyseur = argparse.ArgumentParser(description=__doc__)
    analyseur.add_argument("niveau")
    analyseur.add_argument("--paroles-communes", action="store_true")
    analyseur.add_argument("--inventaire", help="inventaire JSON déjà produit (sinon lancé par deno)")
    options = analyseur.parse_args(arguments)
    repertoire = json.loads(REPERTOIRE_DES_SONS.read_text(encoding="utf-8"))
    bibliotheque = json.loads(BIBLIOTHEQUE.read_text(encoding="utf-8"))
    inventaire = inventaire_des_phrases(options.inventaire)
    try:
        contenu = page_d_ecoute(repertoire, bibliotheque, options.niveau, inventaire, options.paroles_communes)
    except ValueError as erreur:
        raise SystemExit(str(erreur))
    DOSSIER_DES_PAGES.mkdir(exist_ok=True)
    chemin = DOSSIER_DES_PAGES / f"ecoute-{options.niveau}.html"
    chemin.write_text(contenu, encoding="utf-8")
    print(chemin)
    return 0


if __name__ == "__main__":
    sys.exit(principal())
