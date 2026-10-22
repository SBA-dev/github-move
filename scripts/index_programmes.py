"""Construit l'index des sections des programmes officiels (français et mathématiques, CP → CM2).

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
EXTRACT_CHARS = 5000


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


def main():
    index = []
    for args in SOURCES:
        index += build(*args)
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
