#!/bin/bash
# Installe les outils et dépendances du projet au démarrage d'une session cloud Claude Code.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Deno : tests unitaires, lint et format des Edge Functions.
command -v deno >/dev/null 2>&1 || npm install -g deno

# pytest : tests du pipeline de contenu (scripts/).
python3 -m pytest --version >/dev/null 2>&1 || pip install --quiet pytest

# Dépendances du front, des tests E2E et de la CLI Supabase.
npm install --no-audit --no-fund

# graphify : graphe de connaissances du code (compétence /graphify et hooks PreToolUse).
command -v graphify >/dev/null 2>&1 || uv tool install --quiet graphifyy==0.9.97 || pip install --quiet graphifyy==0.9.97
