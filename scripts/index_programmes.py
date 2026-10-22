"""Construit l'index des sections des programmes officiels (CP → CM2) : français, mathématiques,
sciences et technologie, histoire-géographie, langues vivantes (anglais), et un passage d'EMC.

Lit les textes extraits dans sources/texte/ et écrit app/programmes-index.json : une entrée par
(matière, niveau, domaine, section), avec un extrait du texte officiel. Cet index sert à retrouver
la section du programme qui correspond à un texte fourni par un adulte, et à donner à l'IA le
passage officiel exact sur lequel s'appuyer.

Usage : python3 scripts/index_programmes.py
"""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEXTE = ROOT / "sources" / "texte"
OUT = ROOT / "app" / "programmes-index.json"

SOURCES = [
    ("francais", "c2-francais", "Programme de français du cycle 2", "BO n° 41 du 31 octobre 2024"),
    ("francais", "c3-francais", "Programme de français du cycle 3", "BO du 17 avril 2025"),
    ("maths", "c2-mathematiques", "Programme de mathématiques du cycle 2", "BO n° 41 du 31 octobre 2024"),
    ("maths", "c3-mathematiques", "Programme de mathématiques du cycle 3", "BO du 17 avril 2025"),
]
LEVELS = {
    "Cours préparatoire": ["CP"],
    "Cours élémentaire première année": ["CE1"],
    "Cours élémentaire deuxième année": ["CE2"],
    "Cours moyen première année": ["CM1"],
    "Cours moyen deuxième année": ["CM2"],
    "Cours moyen première et deuxième années": ["CM1", "CM2"],
    "Sixième": None,  # hors école élémentaire
}
EXTRACT_CHARS = 12000


def clean(line):
    return re.sub(r"\s*_{3,}.*$", "", line).strip()


def read_toc(lines):
    """Lit le sommaire : domaines (lignes non indentées) et sections (lignes indentées)."""
    domains, sections = [], set()
    start = next(i for i, l in enumerate(lines) if l.strip() == "Sommaire")
    seen_principes = 0
    for l in lines[start + 1:]:
        if not l.strip():
            continue
        t = clean(l)
        if t == "Principes" and not l.startswith(" "):
            seen_principes += 1
            if seen_principes == 2:  # le corps du texte commence
                break
            continue
        if t in LEVELS:
            continue
        if l.startswith(" "):
            sections.add(t)
        else:
            domains.append(t)
    return domains, sections


def build(matiere, stem, titre, bo):
    lines = (TEXTE / f"{stem}.txt").read_text(encoding="utf-8").splitlines()
    domains, sections = read_toc(lines)
    sections -= {"Principes", "Points de vigilance pour les professeurs", "Point de vigilance pour les professeurs", "Repères"}
    body_start = [i for i, l in enumerate(lines) if l.strip() == "Principes"][1]
    entries, cur = {}, {"domaine": None, "niveaux": None, "section": None}
    order = []
    for l in lines[body_start:]:
        t = clean(l)
        if t in domains and not l.startswith(" "):
            cur = {"domaine": t, "niveaux": None, "section": None}
            continue
        if t in LEVELS:
            cur["niveaux"] = LEVELS[t]
            if t != "Cours moyen première et deuxième années":
                cur["section"] = cur["section"] if stem.startswith("c3-francais") else None
            continue
        if t in sections:
            cur["section"] = t
            continue
        if not (cur["domaine"] and cur["niveaux"] and t):
            continue
        key = (cur["domaine"], tuple(cur["niveaux"]), cur["section"] or cur["domaine"])
        if key not in entries:
            entries[key] = []
            order.append(key)
        entries[key].append(re.sub(r"\s{2,}", "  ", t))
    out = []
    for n, key in enumerate(order):
        domaine, niveaux, section = key
        texte = " ".join(entries[key])
        ascii_ = unicodedata.normalize("NFKD", f"{stem}-{'-'.join(niveaux)}-{section}").encode("ascii", "ignore").decode()
        slug = re.sub(r"[^a-z0-9]+", "-", ascii_.lower())[:90]
        out.append({
            "id": slug.strip("-"),
            "matiere": matiere,
            "niveaux": list(niveaux),
            "domaine": domaine,
            "section": section,
            "ordre": n,
            "source": {"texte": titre, "bo": bo, "fichier": f"sources/pdf/{stem}.pdf"},
            "extrait": texte[:EXTRACT_CHARS],
        })
    return out


LEVEL_RE = re.compile(r"^(Cours préparatoire|Cours élémentaire première année|Cours élémentaire deuxième année|Cours moyen première année|Cours moyen deuxième année|Sixième)")
FIRST_LEVEL = re.compile(r"^(Cours préparatoire|Cours moyen première année)")
LEVEL_OF = {"Cours préparatoire": ["CP"], "Cours élémentaire première année": ["CE1"], "Cours élémentaire deuxième année": ["CE2"],
            "Cours moyen première année": ["CM1"], "Cours moyen deuxième année": ["CM2"], "Sixième": None}
SKIP = ("Principes", "Organisation du programme", "Contribution", "L'égalité", "L’égalité", "Repères", "Points de vigilance", "Point de vigilance")


def slugify(stem, niveaux, section):
    ascii_ = unicodedata.normalize("NFKD", f"{stem}-{'-'.join(niveaux)}-{section}").encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_.lower())[:90].strip("-")


def entry(matiere, stem, titre, bo, niveaux, domaine, section, n, texte):
    return {"id": slugify(stem, niveaux, section), "matiere": matiere, "niveaux": niveaux, "domaine": domaine, "section": section, "ordre": n,
            "source": {"texte": titre, "bo": bo, "fichier": f"sources/pdf/{stem}.pdf"}, "extrait": texte[:EXTRACT_CHARS]}


def build_sequential(matiere, stem, titre, bo):
    """Sommaire « domaine / niveau / sections » : on retrouve chaque titre du sommaire, dans l'ordre, dans le corps du texte."""
    lines = (TEXTE / f"{stem}.txt").read_text(encoding="utf-8").splitlines()
    start = next(i for i, l in enumerate(lines) if l.strip() == "Sommaire")
    body = [i for i, l in enumerate(lines) if l.strip() == "Principes" and i > start][-1]
    toc = []
    for l in lines[start + 1:body]:
        t = clean(l)
        if not t:
            continue
        if t.startswith("(") and toc:
            toc[-1] += " " + t
        else:
            toc.append(t)
    kinds = []
    for k, t in enumerate(toc):
        nxt = toc[k + 1] if k + 1 < len(toc) else ""
        kinds.append("niveau" if LEVEL_RE.match(t) else "domaine" if FIRST_LEVEL.match(nxt) else "section")
    found, pos = [], body
    for t, kind in zip(toc, kinds):
        if t.startswith(SKIP):
            continue
        key = t[:38]
        for i in range(pos + 1, len(lines)):
            if clean(lines[i]).startswith(key):
                found.append((i, t, kind)); pos = i; break
    out, dom, lev = [], None, None
    for k, (i, t, kind) in enumerate(found):
        end = found[k + 1][0] if k + 1 < len(found) else len(lines)
        if kind == "domaine":
            dom, lev = t, None
            continue
        if kind == "niveau":
            lev = LEVEL_OF[LEVEL_RE.match(t).group(1)]
            sub = t.split(":", 1)[1].strip() if ":" in t and lev else ""
            if k + 1 < len(found) and found[k + 1][2] == "section":
                continue
            t = sub or dom
        if not (dom and lev):
            continue
        texte = " ".join(re.sub(r"\s{2,}", "  ", clean(x)) for x in lines[i + 1:end] if clean(x))
        out.append(entry(matiere, stem, titre, bo, lev, dom, t, len(out), texte))
    return out


LV_ACT = re.compile(r"^(Compréhension de l’oral|Expression orale en continu|Expression orale en interaction|Compréhension de l’écrit|Expression écrite)\s*:|^Médiation$")
LV_OBJ = re.compile(r"\((CO|EOC|EOI|CE|EE|M)-(CP|CE1|CE2|CM1|CM2)\)\s*$")


def build_langues(stem, titre, bo):
    lines = (TEXTE / f"{stem}.txt").read_text(encoding="utf-8").splitlines()
    heads = []
    for i, l in enumerate(lines):
        t = clean(l)
        if LV_ACT.match(t) and len(t) < 90:
            heads.append((i, "act", t))
        elif LV_OBJ.search(t) and len(t) < 200:
            heads.append((i, "obj", t))
    out, act = [], None
    for k, (i, kind, t) in enumerate(heads):
        if kind == "act":
            act = t
            continue
        end = heads[k + 1][0] if k + 1 < len(heads) else len(lines)
        niveau = LV_OBJ.search(t).group(2)
        section = LV_OBJ.sub("", t).strip()
        if len(section) < 12 or section[0].islower():
            continue
        texte = " ".join(re.sub(r"\s{2,}", "  ", clean(x)) for x in lines[i + 1:end] if clean(x))
        out.append(entry("anglais", stem, titre, bo, [niveau], act, section, len(out), texte))
    return out


def main():
    index = []
    for args in SOURCES:
        index += build(*args)
    index += build_sequential("sciences", "c2-sciences-technologie", "Programme de sciences et technologie du cycle 2", "BO n° 24 du 11 juin 2026")
    index += build_sequential("sciences", "c3-sciences-technologie", "Programme de sciences et technologie du cycle 3", "BO n° 24 du 11 juin 2026")
    index += build_sequential("histoire", "c2-histoire-geographie", "Programme d'histoire-géographie du cycle 2", "programme 2026")
    index += build_sequential("histoire", "c3-histoire-geographie", "Programme d'histoire-géographie du cycle 3", "programme 2026")
    index += build_langues("c2-langues-vivantes", "Programme de langues vivantes du cycle 2", "BO n° 12 du 19 mars 2026")
    index += build_langues("c3-langues-vivantes", "Programme de langues vivantes du cycle 3 (CM1, CM2)", "BO n° 12 du 19 mars 2026")
    # EMC : un seul passage utile ici (découverte des métiers du service public, CE2).
    emc = (TEXTE / "cp-terminale-emc.txt").read_text(encoding="utf-8").splitlines()
    passage = " ".join(re.sub(r"\s{2,}", "  ", l.strip()) for l in emc[574:584] if l.strip())
    index.append({
        "id": "emc-ce2-service-public", "matiere": "emc", "niveaux": ["CE2"], "domaine": "Apprendre ensemble et vivre ensemble",
        "section": "Service public : institutions au service du bien commun (pompiers, police, métiers de la santé)", "ordre": 0,
        "source": {"texte": "Programme d'enseignement moral et civique, du CP à la terminale", "bo": "BO n° 24 du 13 juin 2024", "fichier": "sources/pdf/cp-terminale-emc.pdf"},
        "extrait": passage,
    })
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(index)} sections -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
