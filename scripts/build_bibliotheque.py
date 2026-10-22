"""Construit la bibliothèque de leçons (app/bibliotheque.json) à partir des leçons écrites dans scripts/lecons/.

Chaque leçon est rattachée à une section de app/programmes-index.json (à reconstruire d'abord avec
scripts/index_programmes.py). La citation du programme n'est jamais écrite à la main : le script choisit,
dans le texte officiel de la section, la phrase qui contient le plus de mots-clés donnés par la leçon,
et la recopie mot pour mot. Le script s'arrête si une section n'existe pas ou ne couvre pas le niveau.

Les leçons déjà présentes dans la bibliothèque (écrites et vérifiées à la main) sont conservées telles quelles.

Usage : python3 scripts/build_bibliotheque.py
"""
import importlib
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "app" / "bibliotheque.json"
INDEX = {e["id"]: e for e in json.loads((ROOT / "app" / "programmes-index.json").read_text(encoding="utf-8"))}
MODULES = ["francais", "francais2", "maths", "maths2", "sciences", "histoire", "anglais"]


def norm(s):
    return unicodedata.normalize("NFKD", s.lower()).encode("ascii", "ignore").decode()


def propre(p):
    """Une phrase lisible : majuscule au début, ponctuation à la fin, parenthèses fermées, et pas deux
    colonnes du PDF mélangées (une nouvelle phrase « L'élève… » qui surgit au milieu d'une autre)."""
    melange = re.search(r"[a-zéèàù,]\s+(L’élève|L'élève|Il |Elle |Les élèves|Dès la période|Au plus tard)", p) or re.search(r"\s(du|de|la|le|les|des|un|une|et|à|en)\s*$", p)
    coupe = re.search(r"(grapho|phono|[,:(—-])$", p)   # phrase coupée en fin de ligne
    return p[0].isupper() and not coupe and p.count("(") == p.count(")") and not melange


def citation(section, mots):
    """Phrase du texte officiel de la section qui contient le plus de mots-clés (recopiée telle quelle)."""
    texte = INDEX[section]["extrait"]
    morceaux = re.split(r"(?<=[.;!?])\s+|\s{2,}|•|\||\s[-−—]\s|(?<=[a-zéèêàùûôîç)])\s+(?=[A-ZÉÈÀ][a-zéèêàùûôîç])", texte)
    phrases = [p.strip(" -−—") for p in morceaux if 25 <= len(p.strip(" -−—")) <= 450]
    if not phrases:
        raise SystemExit(f"la section {section} n'a pas de texte")
    best = max(phrases, key=lambda p: (any(norm(m) in norm(p) for m in mots), propre(p), sum(norm(m) in norm(p) for m in mots), -abs(len(p) - 120)))
    if not any(norm(m) in norm(best) for m in mots):
        raise SystemExit(f"Aucune phrase de {section} ne contient {mots}")
    return best


# ---------- Petites fonctions pour écrire les leçons ----------
ERREURS = []


def lecon(id, matiere, niveau, titre, ordre, section, cite, etapes, exercices, competence=None, citation_exacte=None):
    try:
        if section not in INDEX:
            raise SystemExit(f"section inconnue {section}")
        if niveau not in INDEX[section]["niveaux"]:
            raise SystemExit(f"la section {section} ne couvre pas le {niveau}")
        if citation_exacte:   # passage choisi à la main : il doit figurer tel quel dans le texte officiel
            if " ".join(citation_exacte.split()) not in " ".join(INDEX[section]["extrait"].split()):
                raise SystemExit(f"citation introuvable dans {section} : {citation_exacte}")
            cit = citation_exacte
        else:
            cit = citation(section, cite)
    except SystemExit as e:
        ERREURS.append(f"{id} : {e}")
        cit = ""
    l = {"id": id, "matiere": matiere, "niveau": niveau, "titre": titre, "ordre": ordre,
         "programme": {"section": section, "citation": cit},
         "lecon": [{"texte": e, "exemples": []} if isinstance(e, str) else {"texte": e[0], "exemples": list(e[1])} for e in etapes],
         "exercices": exercices}
    if competence:
        l["competence"] = competence
    return l


def bulles(titre, questions):
    """questions : (question, [bonne réponse, autres choix…], aide facultative). La première réponse est la bonne."""
    return {"type": "bulles", "titre": titre, "questions": [
        {"question": q[0], "choix": [str(c) for c in q[1]], "reponse": str(q[1][0]), **({"aide": q[2]} if len(q) > 2 else {})} for q in questions]}


def classer(titre, consigne, groupes):
    """groupes : {nom de la maison: [étiquettes]}"""
    gs = [{"id": str(i + 1), "nom": n} for i, n in enumerate(groupes)]
    items = [{"texte": t, "groupe": str(i + 1)} for i, (n, ts) in enumerate(groupes.items()) for t in ts]
    return {"type": "classer", "titre": titre, "consigne": consigne, "groupes": gs, "items": items}


def dictee(titre, mots):
    return {"type": "dictee", "titre": titre, "mots": [{"mot": m} if isinstance(m, str) else {"mot": m[0], "phrase": m[1]} for m in mots]}


def ordre(titre, consigne, elements):
    return {"type": "ordre", "titre": titre, "consigne": consigne, "elements": elements}


def trous(titre, consigne, texte, distracteurs=()):
    return {"type": "trous", "titre": titre, "consigne": consigne, "texte": texte, "distracteurs": list(distracteurs)}


def conjugaison(verbe, temps, formes, distracteurs=(), titre=None):
    pr = ["je", "tu", "il", "nous", "vous", "ils"] if len(formes) == 6 else None
    fs = [{"pronom": p, "forme": f} for p, f in (zip(pr, formes) if pr else formes)]
    return {"type": "conjugaison", "titre": titre or f"{verbe.capitalize()} au {temps}", "verbe": verbe, "temps": temps, "formes": fs, "distracteurs": list(distracteurs)}


def lecture(titre, texte, questions):
    return {"type": "lecture", "titre": titre, "texte": texte, "questions": bulles("", questions)["questions"]}


def memoriser(titre, auteur, vers):
    return {"type": "memoriser", "titre": titre, "auteur": auteur, "vers": vers}


def calcul(titre, operations=None, **gen):
    """operations : [(« 7 + 5 », 12), …] ; ou générateur : op, a=[min, max], b=[min, max], combien, cible."""
    if operations:
        return {"type": "calcul", "titre": titre, "operations": [{"q": q, "r": r, **({"aide": a[0]} if a else {})} for q, r, *a in operations]}
    return {"type": "calcul", "titre": titre, "generateur": {"combien": 6, **gen}}


def fluence(titre, duree=60, **gen):
    return {"type": "fluence", "titre": titre, "duree": duree, "generateur": gen}


def addition(titre, operations, etapes=("poser", "calculer")):
    return {"type": "addition", "titre": titre, "operations": operations, "etapes": list(etapes)}


def ecoute(titre, items, langue="en-GB"):
    """items : (mot anglais, bonne traduction, autres choix…)"""
    return {"type": "ecoute", "titre": titre, "langue": langue, "items": [
        {"dire": d, "question": "Écoute bien. Que veut dire ce mot ?" if " " not in d else "Écoute bien. Que veut dire cette phrase ?", "choix": list(c), "reponse": c[0]} for d, *c in items]}


def main():
    sys.path.insert(0, str(Path(__file__).parent))
    existing = json.loads(LIB.read_text(encoding="utf-8"))
    keep = {l["id"]: l for l in existing if not l.get("genere")}
    lessons = list(keep.values())
    for m in MODULES:
        mod = importlib.import_module(f"lecons.{m}")
        for l in mod.LECONS:
            if l["id"] in keep:
                raise SystemExit(f"identifiant déjà utilisé : {l['id']}")
            l["genere"] = True
            lessons.append(l)
    import build_bibliotheque as bb   # les leçons sont construites par ce module importé
    if bb.ERREURS:
        raise SystemExit("\n".join(bb.ERREURS))
    ids = [l["id"] for l in lessons]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        raise SystemExit(f"identifiants en double : {dup}")
    for l in lessons:
        for ex in l["exercices"]:
            for q in ex.get("questions", []):
                assert q["reponse"] in q["choix"], (l["id"], q)
                assert len(set(q["choix"])) == len(q["choix"]), (l["id"], q)
            for it in ex.get("items", []):
                if ex["type"] == "ecoute":
                    assert len(set(it["choix"])) == len(it["choix"]), (l["id"], it)
    order = {m: i for i, m in enumerate(["francais", "maths", "sciences", "histoire", "anglais", "emc"])}
    lv = ["CP", "CE1", "CE2", "CM1", "CM2"]
    lessons.sort(key=lambda l: (order.get(l["matiere"], 9), lv.index(l["niveau"]), l["ordre"]))
    LIB.write_text(json.dumps(lessons, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    from collections import Counter
    c = Counter((l["matiere"], l["niveau"]) for l in lessons)
    print(f"{len(lessons)} leçons -> {LIB.relative_to(ROOT)}")
    for m in order:
        print(f"  {m:9}", " ".join(f"{n}:{c.get((m, n), 0):2}" for n in lv))


if __name__ == "__main__":
    main()
