"""Recalcule les données du tableau de bord d'avancement.

Entrées (dossier passé en argument), écrites par la session qui rafraîchit :
  issues.json    liste des issues (number, title, state, labels)
  prs.json       liste des pull requests (number, title, state, head.ref)
  sessions-nouvelles.json  sessions Claude récentes : id, title, created_at, tags, cost_usd, branches
                 (fusionnées dans sessions.json, qui garde les anciennes d'un relevé à l'autre)
  comments/<n>.json  commentaire « Avancement » des issues en cours : [{body, updated_at}]

Sorties (dans <entrées>/sortie) : stories, equipes, etapes, couverture,
tests, sessions, previsions, releve (.json), au format attendu par le tableau de bord.
"""

import json
import re
from datetime import datetime, timedelta, timezone
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

RACINE = Path.cwd()  # lancé depuis la racine d'un clone à jour de main
ETAPES = ["Domaine", "Critères", "Validation PO", "TDD", "Câblage", "Review", "E2E", "Merge"]

# Sessions d'avant la vague 1 : une session livrait plusieurs stories,
# son coût est réparti à parts égales entre elles.
SESSIONS_PARTAGEES = {
    "session_01NcG9BPKHzmbEBUTXP6ybhk": [5, 6, 7, 8],
    "session_01RV3LrDw6fonmXm9vGr2yrQ": [10, 15],
    "session_01UbwpSdV5Hz9rdFBEKdSrJ3": [16, 17, 11, 12, 23, 24, 18, 19],
}
SESSIONS_PILOTAGE = {"session_018DHEojxGzCST2osos9gKVm", "session_015JPSRQbSeUWinMuhQJ4URi"}
DEBUT_REECRITURE = "2026-10-22T15:00"

# Épopée « Leçons plus ludiques » (#95), après la beta : ses stories portent le label `ludique`.
# Dépendances et chemin critique recopiés de l'issue #95, tant qu'elles manquent à docs/graphe/stories.md.
LUDIQUE = "ludique"
LOT_LUDIQUE = "8. Leçons plus ludiques"
DEPENDANCES_LUDIQUE = {96: "#45", 97: "#96", 98: "#97", 99: "#96", 100: "#98, #99", 101: "#99", 102: "#96", 106: "#100, #96",
                       126: "#97, #98", 127: "#97, #98", 128: "#97, #98", 129: "#97, #98"}
CHEMIN_CRITIQUE_LUDIQUE = [96, 97, 98, 100, 106]


def lire(chemin, defaut=None):
    try:
        return json.loads(Path(chemin).read_text())
    except FileNotFoundError:
        return defaut


def noms_labels(issue):
    return [l if isinstance(l, str) else l.get("name", "") for l in issue.get("labels", [])]


# Stories ajoutées après coup à un lot : leur numéro ne suit plus l'ordre des lots.
LOTS_AJOUTES = {72: "2. Famille", 73: "2. Famille"}


def est_story(issue):
    labels = noms_labels(issue)
    return "reecriture" in labels or (LUDIQUE in labels and not issue["title"].startswith("[Épopée]"))


def lot(n, labels=()):
    if LUDIQUE in labels:
        return LOT_LUDIQUE
    if n in LOTS_AJOUTES:
        return LOTS_AJOUTES[n]
    for borne, nom in ((8, "1. Socle"), (15, "2. Famille"), (24, "3. Jouer une leçon"), (29, "4. Parcours")):
        if n <= borne:
            return nom
    if n <= 33 or n == 65:
        return "5. Motivation"
    if n <= 43:
        return "6. Accompagnement"
    if n <= 46:
        return "7. Bascule"
    return "Transverse"


def lire_graphe():
    """Dépendances, niveau et appartenance à la beta, depuis docs/graphe/stories.md."""
    texte = (RACINE / "docs/graphe/stories.md").read_text()
    graphe, section = {}, None
    for ligne in texte.splitlines():
        if ligne.startswith("### "):
            section = "beta" if "Beta" in ligne else "apres" if "Après" in ligne else None
        cellules = [c.strip() for c in ligne.strip().strip("|").split("|")]
        if section and len(cellules) >= 5 and cellules[0].isdigit():
            graphe[int(cellules[0])] = {
                "beta": section == "beta",
                "depend_de": cellules[3],
                "niveau": int(cellules[5]) if section == "beta" and len(cellules) > 5 and cellules[5].isdigit() else None,
            }
    return graphe


def dependances(texte, ouvertes, beta_ouvertes):
    if "toute la beta" in texte:
        return set(beta_ouvertes)
    if "toutes les autres" in texte:
        return set(ouvertes)
    return {int(n) for n in re.findall(r"\d+", texte)}


def etat_etape(texte):
    t = texte.lower().strip()
    if t in ("—", "-", ""):
        return "à faire"
    if "attente" in t or t.startswith("attend"):
        return "en attente"
    if "en cours" in t:
        return "en cours"
    if "fait" in t or "sauté" in t or "verts" in t or "approuvé" in t or t.startswith(("ok", "vert", "mergé")):
        return "fait"
    return "en cours"


def lire_avancement(commentaires):
    """Dernier commentaire « Avancement » d'une équipe : étapes et champs."""
    avancements = [c for c in commentaires if "] Avancement" in c.get("body", "")]
    if not avancements:
        return None
    c = max(avancements, key=lambda c: c.get("updated_at", ""))
    corps = c["body"]
    etapes = {}
    for ligne in corps.splitlines():
        cellules = [x.strip() for x in ligne.strip().strip("|").split("|")]
        if len(cellules) == 2 and cellules[0] in ETAPES:
            etapes[cellules[0]] = (etat_etape(cellules[1]), cellules[1])

    def champ(nom):
        m = re.search(rf"^{nom}\s*:\s*(.+)$", corps, re.M)
        return m.group(1).strip() if m else "—"

    return {
        "etapes": etapes,
        "branche": champ("Branche").split("·")[0].strip(),
        "attend": champ("Attend"),
        "verrou": champ("Verrous détenus"),
        "maj": c.get("updated_at", "")[:16].replace("T", " ") + " UTC",
    }


def couverture():
    dossier = Path("/tmp/couverture-tableau-de-bord")
    subprocess.run(["rm", "-rf", str(dossier)])
    sortie = subprocess.run(
        ["deno", "test", "--permit-no-files", f"--coverage={dossier}", "supabase/functions/"],
        cwd=RACINE, capture_output=True, text=True,
    ).stdout
    subprocess.run(["deno", "coverage", str(dossier), "--lcov", f"--output={dossier}/lcov.info"], cwd=RACINE, capture_output=True)
    m = re.search(r"(\d+) passed \| (\d+) failed", re.sub(r"\x1b\[[0-9;]*m", "", sortie))
    reussis, echoues = (int(m.group(1)), int(m.group(2))) if m else (0, 0)
    par_contexte = defaultdict(lambda: [0, 0, 0, 0])
    for bloc in (dossier / "lcov.info").read_text().split("end_of_record"):
        fichier = re.search(r"SF:(.*)", bloc)
        if not fichier or "test_utils" in fichier.group(1) or fichier.group(1).endswith("_test.ts"):
            continue
        contexte = re.search(r"_shared/([^/]+)/", fichier.group(1))
        if not contexte:
            continue
        valeurs = [int((re.search(rf"{k}:(\d+)", bloc) or [0, 0])[1]) for k in ("LH", "LF", "BRH", "BRF")]
        cumul = par_contexte[contexte.group(1)]
        for i, v in enumerate(valeurs):
            cumul[i] += v
    lignes = [
        {"contexte": k.capitalize(), "lignes_couvertes": v[0], "lignes": v[1], "branches_couvertes": v[2], "branches": v[3],
         "taux_lignes": round(v[0] / v[1], 4) if v[1] else 0}
        for k, v in sorted(par_contexte.items())
    ]
    return lignes, reussis, echoues


def suites_de_tests(reussis, echoues, date):
    features = list((RACINE / "features").glob("*.feature"))
    scenarios = sum(len(re.findall(r"^\s*(Scénario|Plan du scénario)", f.read_text(), re.M)) for f in features)
    pytest = subprocess.run([sys.executable, "-m", "pytest", "scripts/tests", "-q", "--co"], cwd=RACINE, capture_output=True, text=True).stdout
    cas = int((re.search(r"(\d+) tests? collected", pytest) or [0, 0])[1])
    front = len([p for p in (RACINE / "src").rglob("*") if p.suffix in (".ts", ".tsx")])
    mesure = f"main, {date}"
    return [
        {"suite": "Tests unitaires (Deno)", "nombre": reussis + echoues, "unite": "tests", "etat": f"{reussis} verts, {echoues} rouge(s)", "mesure": mesure},
        {"suite": "Scénarios E2E (Gherkin)", "nombre": scenarios, "unite": "scénarios", "etat": f"{len(features)} fichiers .feature", "mesure": mesure},
        {"suite": "Tests du pipeline (pytest)", "nombre": cas, "unite": "cas", "etat": "pipeline de contenu", "mesure": mesure},
        {"suite": "Front React (src/)", "nombre": front, "unite": "fichiers", "etat": "couverture non mesurée", "mesure": mesure},
    ]


def commit_main():
    return subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=RACINE, capture_output=True, text=True).stdout.strip()


def cout(session):
    return float(session.get("cost_usd") or session.get("external_metadata", {}).get("usage", {}).get("cost_usd") or 0)


def branches(session):
    return session.get("branches") or list(session.get("external_metadata", {}).get("current_branches", {}).values())


PAUSE_MAX_S = 45 * 60  # au-delà, l'écart entre deux commits n'est pas compté comme du travail


def temps_de_developpement(n):
    """Dates des commits « (#n) » de toutes les branches : début, fin, durée calendaire et temps actif (heures)."""
    sortie = subprocess.run(
        ["git", "log", "--all", "-E", f"--grep=\\(#{n}[),]", "--format=%cI"], cwd=RACINE, capture_output=True, text=True,
    ).stdout.split()
    dates = sorted({datetime.fromisoformat(d).astimezone(timezone.utc) for d in sortie})
    if not dates:
        return None
    actif = sum(min((b - a).total_seconds(), PAUSE_MAX_S) for a, b in zip(dates, dates[1:]))
    return {"debut": dates[0], "fin": dates[-1], "calendaire_h": (dates[-1] - dates[0]).total_seconds() / 3600, "actif_h": actif / 3600}


def chemin_critique():
    m = re.search(r"## Chemin critique.*?`([^`]+)`", (RACINE / "docs/graphe/stories.md").read_text(), re.S)
    return [int(x) for x in re.findall(r"#(\d+)", m.group(1))] if m else []


def previsions(lignes_stories, temps, maintenant):
    """Date de fin estimée : vitesse des 7 derniers jours, et plancher du chemin critique."""
    livrees = [s for s in lignes_stories if s["etat"] == "Livrée" and temps.get(s["numero"])]
    debut = min((t["debut"] for t in temps.values()), default=maintenant)
    fenetre_j = max(min(7.0, (maintenant - debut).total_seconds() / 86400), 0.5)
    recentes = [s for s in livrees if (maintenant - temps[s["numero"]]["fin"]).total_seconds() <= fenetre_j * 86400]
    en_cours = sum(s["avancement"] for s in lignes_stories if s["etat"] in ("En cours", "En revue"))
    vitesse = (len(recentes) + en_cours) / fenetre_j
    durees = sorted(temps[s["numero"]]["calendaire_h"] for s in livrees)
    mediane_h = durees[len(durees) // 2] if durees else 24.0
    etat = {s["numero"]: s for s in lignes_stories}
    critique_beta = chemin_critique()
    lignes = []
    # Après la beta, le retrait de app/ (#46) attend toutes les autres stories : il allonge le chemin d'une story.
    for perimetre, filtre, critique in (
        ("Beta", lambda s: s["beta"] == "oui", critique_beta),
        ("Toute la réécriture", lambda s: s["lot"] != LOT_LUDIQUE, critique_beta + [46]),
        ("Leçons plus ludiques", lambda s: s["lot"] == LOT_LUDIQUE, CHEMIN_CRITIQUE_LUDIQUE),
    ):
        reste = sum(1 - s["avancement"] for s in lignes_stories if filtre(s))
        jours_vitesse = reste / vitesse if vitesse else None
        jours_critique = sum(1 - etat[n]["avancement"] for n in critique if n in etat) * mediane_h / 24
        jours = max(jours_vitesse or 0, jours_critique)
        lignes.append({
            "perimetre": perimetre, "reste_stories": round(reste, 2), "vitesse_par_jour": round(vitesse, 2),
            "jours_selon_vitesse": round(jours_vitesse, 1) if jours_vitesse else None, "jours_chemin_critique": round(jours_critique, 1),
            "stories_chemin_critique": " → ".join(f"#{n}" for n in critique),
            "duree_mediane_story_h": round(mediane_h, 1), "jours_restants": round(jours, 1),
            "limite": "chemin critique" if jours_critique >= (jours_vitesse or 0) else "vitesse",
            "fin_estimee": (maintenant + timedelta(days=jours)).strftime("%Y-%m-%d"),
        })
    return lignes


def story_d_equipe(session):
    for tag in session.get("tags", []):
        m = re.fullmatch(r"graphe:(\d+)", tag)
        if m:
            return int(m.group(1))
    return None


def main(dossier):
    dossier = Path(dossier)
    issues = lire(dossier / "issues.json", [])
    prs = lire(dossier / "prs.json", [])
    connues = {s["id"]: s for s in lire(dossier / "sessions.json", [])}
    connues.update({s["id"]: s for s in lire(dossier / "sessions-nouvelles.json", [])})
    (dossier / "sessions.json").write_text(json.dumps(list(connues.values()), ensure_ascii=False))
    sessions = [s for s in connues.values() if s.get("created_at", "") >= DEBUT_REECRITURE]
    graphe = lire_graphe()
    date = max((i.get("updated_at", "") for i in issues), default="")[:10]

    stories = {i["number"]: i for i in issues if est_story(i)}
    fermees = {n for n, i in stories.items() if i["state"].upper() == "CLOSED"}
    ouvertes = set(stories) - fermees
    reecriture_ouvertes = {n for n in ouvertes if LUDIQUE not in noms_labels(stories[n])}
    beta_ouvertes = {n for n in reecriture_ouvertes if graphe.get(n, {}).get("beta", True)}
    pr_ouvertes = {}
    for pr in prs:
        m = re.match(r"\D*#(\d+)", pr.get("title", ""))
        if pr.get("state") == "open" and m:
            pr_ouvertes[int(m.group(1))] = pr

    # Coûts : exact pour une session d'équipe, réparti pour une session partagée.
    couts, lignes_sessions, session_de = {}, [], {}
    rafraichissements = 0.0
    for s in sessions:
        sid, titre, c = s["id"], s.get("title", ""), cout(s)
        n = story_d_equipe(s)
        if n:
            couts[n] = (round(c, 2), "exact" if n in fermees else "exact, en cours")
            session_de[n] = s
            lignes_sessions.append({"session": titre, "periode": s["created_at"][:10], "stories": f"#{n}", "cout_usd": round(c, 2), "role": "Livraison"})
        elif sid in SESSIONS_PARTAGEES:
            part = SESSIONS_PARTAGEES[sid]
            for k in part:
                couts.setdefault(k, (round(c / len(part), 2), "réparti"))
            lignes_sessions.append({"session": titre, "periode": s["created_at"][:10], "stories": ", ".join(f"#{k}" for k in part), "cout_usd": round(c, 2), "role": "Livraison"})
            for k, pr in pr_ouvertes.items():
                if pr.get("head", {}).get("ref") in branches(s):
                    session_de.setdefault(k, s)
        elif sid in SESSIONS_PILOTAGE or titre.startswith("Graphe"):
            lignes_sessions.append({"session": titre, "periode": s["created_at"][:10], "stories": "coordination des équipes", "cout_usd": round(c, 2), "role": "Pilotage"})
        elif "tableau de bord" in titre.lower():
            rafraichissements += c
    if rafraichissements:
        lignes_sessions.append({"session": "Tableau de bord et ses mises à jour", "periode": "depuis le 24 oct.", "stories": "ce tableau", "cout_usd": round(rafraichissements, 2), "role": "Outillage"})

    maintenant = datetime.now(timezone.utc)
    temps = {n: t for n in stories if (t := temps_de_developpement(n))}
    lignes_stories, lignes_equipes, lignes_etapes = [], [], []
    for n in sorted(stories):
        labels = noms_labels(stories[n])
        ludique = LUDIQUE in labels
        defaut = {"beta": not ludique, "depend_de": DEPENDANCES_LUDIQUE.get(n, "—"), "niveau": None}
        g = graphe.get(n, defaut)
        en_cours = any(l.startswith("graphe:") and l != "graphe:coordination" for l in labels)
        avancement_equipe = lire_avancement(lire(dossier / "comments" / f"{n}.json", []))
        if avancement_equipe and "graphe:revue" in labels:
            # Le label est plus frais que le commentaire « Avancement » : tout ce qui précède la review est fait.
            etapes = avancement_equipe["etapes"]
            for e in ETAPES[:ETAPES.index("Review")]:
                etapes[e] = ("fait", "fait")
            if etapes.get("Review", ("à faire",))[0] == "à faire":
                etapes["Review"] = ("en cours", "en revue (label graphe:revue)")
        if n in fermees:
            etat, avancement = "Livrée", 1.0
        elif n in pr_ouvertes and not (avancement_equipe and avancement_equipe["etapes"].get("Merge", ("à faire",))[0] == "à faire" and en_cours):
            etat, avancement = "En revue", 0.875
        elif en_cours or avancement_equipe:
            etat = "En cours"
            poids = {"fait": 1, "en cours": 0.5, "en attente": 0.5, "à faire": 0}
            etapes = avancement_equipe["etapes"] if avancement_equipe else {}
            avancement = round(sum(poids[etapes.get(e, ("à faire",))[0]] for e in ETAPES) / len(ETAPES), 4)
        elif not (dependances(g["depend_de"], reecriture_ouvertes, beta_ouvertes) & ouvertes):
            etat, avancement = "Prête", 0.0
        else:
            etat, avancement = "Bloquée", 0.0
        c = couts.get(n)
        t = temps.get(n)
        lignes_stories.append({
            "story": f"#{n}", "numero": n, "titre": stories[n]["title"], "lot": lot(n, labels), "beta": "oui" if g["beta"] else "non",
            "etat": etat, "avancement": avancement, "depend_de": "—" if n in fermees else g["depend_de"], "niveau": g["niveau"],
            "cout_usd": c[0] if c else None, "methode_cout": c[1] if c else None,
            "temps_actif_h": round(t["actif_h"], 1) if t else None,
            "duree_calendaire_h": round(t["calendaire_h"], 1) if t else None,
            "premier_commit": t["debut"].strftime("%Y-%m-%d %H:%M") if t else None,
            "dernier_commit": t["fin"].strftime("%Y-%m-%d %H:%M") if t else None,
        })
        if etat in ("En cours", "En revue"):
            s = session_de.get(n, {})
            a = avancement_equipe or {}
            etapes = a.get("etapes") or {e: ("fait", "fait") for e in ETAPES[:-1]} | {"Merge": ("en attente", "merge par le PO")}
            pas_fait = next((e for e in ETAPES if etapes.get(e, ("à faire",))[0] != "fait"), "Merge")
            pr = pr_ouvertes.get(n)
            lignes_equipes.append({
                "story": f"#{n}", "equipe": (s.get("title") or "").split("—")[0].strip() or f"Équipe #{n}", "titre": stories[n]["title"],
                "branche": a.get("branche") or (pr or {}).get("head", {}).get("ref", "—"),
                "etape": f"{pas_fait} : {etapes.get(pas_fait, ('', 'à faire'))[1]}" if a else f"PR #{pr['number']} ouverte" if pr else pas_fait,
                "avancement": avancement, "attend": a.get("attend", "merge par le PO" if pr else "—"), "verrou": a.get("verrou", "aucun"),
                "cout_usd": c[0] if c else 0, "maj": a.get("maj", (pr or {}).get("updated_at", "")[:16].replace("T", " ") + " UTC"),
                "cadre": "Vague en cours" if story_d_equipe(s) == n else "Hors vague",
            })
            for i, e in enumerate(ETAPES):
                lignes_etapes.append({"story": f"#{n}", "ordre": i + 1, "etape": e, "etat": etapes.get(e, ("à faire",))[0]})

    lignes_couverture, reussis, echoues = couverture()
    sortie = dossier / "sortie"
    sortie.mkdir(exist_ok=True)
    for nom, donnees in {
        "stories": lignes_stories, "equipes": lignes_equipes, "etapes": lignes_etapes,
        "previsions": previsions(lignes_stories, temps, maintenant),
        "releve": [{"releve": maintenant.strftime("%Y-%m-%d %H:%M UTC"), "commit_main": commit_main()}],
        "couverture": lignes_couverture, "tests": suites_de_tests(reussis, echoues, date), "sessions": lignes_sessions,
    }.items():
        (sortie / f"{nom}.json").write_text(json.dumps(donnees, ensure_ascii=False, indent=0))
    print(f"{len(lignes_stories)} stories, {len(lignes_equipes)} en cours, {reussis} tests verts, {echoues} rouges -> {sortie}")


if __name__ == "__main__":
    main(sys.argv[1])
