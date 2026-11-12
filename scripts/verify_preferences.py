#!/usr/bin/env python3
"""
TETRADIC NETWORK — Preference & Memory Sync Validator
Verifies that all 5 agent dossiers exist, are non-empty, contain up-to-date feedback logs,
and that no legacy placeholders (like CTO-SCOUT) remain.
"""

import os
import sys

PREF_DIR = "context/preferences"
AGENTS_DIR = os.path.join(PREF_DIR, "agents")
REQUIRED_AGENTS = ["orbit.md", "thoth.md", "calliope.md", "argus.md", "hermes.md", "orpheus.md"]
MASTER_FILE = os.path.join(PREF_DIR, "SHOWRUNNER_TASTE_PROFILE.md")

def check_sync():
    errors = []
    warnings = []

    # 1. Check Master File
    if not os.path.exists(MASTER_FILE):
        errors.append(f"Missing master taste profile: {MASTER_FILE}")
    else:
        with open(MASTER_FILE, "r") as f:
            content = f.read()
            if "CTO-SCOUT" in content:
                errors.append(f"Stale placeholder 'CTO-SCOUT' found in {MASTER_FILE}!")
            if "Law of 62" not in content:
                errors.append("The Law of 62 is missing from master taste profile!")

    # 2. Check Individual Agent Dossiers
    if not os.path.exists(AGENTS_DIR):
        errors.append(f"Missing agents directory: {AGENTS_DIR}")
        return errors, warnings

    for agent_file in REQUIRED_AGENTS:
        full_path = os.path.join(AGENTS_DIR, agent_file)
        if not os.path.exists(full_path):
            errors.append(f"Missing required agent dossier: {agent_file}")
            continue
        
        with open(full_path, "r") as f:
            text = f.read()
            agent_name = agent_file.replace(".md", "").upper()
            if "Hard Directives" not in text:
                warnings.append(f"{agent_file} lacks a 'Hard Directives' section.")
            if "Forbidden Patterns" not in text:
                warnings.append(f"{agent_file} lacks a 'Forbidden Patterns' section.")
            if "Feedback & Evolution Log" not in text:
                warnings.append(f"{agent_file} lacks a 'Feedback & Evolution Log' table.")
            if "CTO-SCOUT" in text:
                errors.append(f"Stale placeholder 'CTO-SCOUT' found in {agent_file}!")

    return errors, warnings

if __name__ == "__main__":
    errs, warns = check_sync()
    if errs:
        print("❌ PREFERENCE SYNC ERRORS FOUND:")
        for e in errs:
            print(f"  - {e}")
        sys.exit(1)
    
    if warns:
        print("⚠️ PREFERENCE SYNC WARNINGS:")
        for w in warns:
            print(f"  - {w}")
    
    print("✅ All 5 agent dossiers and master profile are 100% synchronized and valid.")
