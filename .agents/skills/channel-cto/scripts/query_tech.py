#!/usr/bin/env python3
"""
ORBIT Channel CTO — Tech Stack & Open-Source Recommendation Engine.
Powered by index.opensource (412 curated creative code, math & simulation repositories).

Usage:
  python3 query_tech.py --query "fluid simulation"
  python3 query_tech.py --show simulation
  python3 query_tech.py --principle "Physics · numerical models"
  python3 query_tech.py --recommend "Simulating the collapse of a 4096-bit cryptographic key"
"""

import os
import sys
import json
import sqlite3
import argparse
from typing import List, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "index_opensource.db")

SHOW_PRINCIPLES = {
    "blueprint": [
        "Geometry · structure",
        "Data · spatial analysis",
        "Making · integration tools"
    ],
    "simulation": [
        "Physics · numerical models",
        "Rules · generation",
        "Time · motion control"
    ],
    "paradox": [
        "Image · signal transformation",
        "Learning · inference",
        "Rules · generation",
        "Geometry · structure"
    ],
    "network-reel": [
        "Making · integration tools",
        "Image · signal transformation",
        "Physics · numerical models"
    ]
}

def get_connection():
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database not found at {DB_PATH}")
    return sqlite3.connect(DB_PATH)

def format_project_card(p: Dict[str, Any]) -> str:
    lines = [
        f"\033[1;36m[{p['code']}] {p['name']}\033[0m — \033[1;33m{p['key_concept']}\033[0m",
        f"  \033[1mPrinciple:\033[0m {p['operating_principle']} | \033[1mMedium:\033[0m {p['output_medium']}",
        f"  \033[1mRepository:\033[0m https://github.com/{p['repository']}" if p['repository'] else "  \033[1mRepository:\033[0m None",
        f"  \033[1mLicense:\033[0m {p['license']} | \033[1mCreator:\033[0m {p['creator']}",
        f"  \033[1mSummary:\033[0m {p['description']}",
        f"  \033[1mKeywords:\033[0m {p['keywords']}",
    ]
    if p.get('application'):
        lines.append(f"  \033[1mApplication:\033[0m {p['application']}")
    return "\n".join(lines)

def search_projects(query: str = "", principle: str = "", medium: str = "", show: str = "", limit: int = 10) -> List[Dict[str, Any]]:
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    params = []
    where_clauses = []

    order_clause = "no ASC"

    if query:
        words = [w for w in query.replace('"', '').replace("'", '').split() if len(w) > 1]
        if words:
            # First check if exact phrase or AND produces results
            and_q = " AND ".join([f'"{w}"*' for w in words])
            cur.execute("SELECT code FROM projects_fts WHERE projects_fts MATCH ? ORDER BY rank LIMIT ?", (and_q, limit))
            and_codes = [r[0] for r in cur.fetchall()]
            
            if len(and_codes) >= limit:
                where_clauses.append(f"code IN ({','.join(['?']*len(and_codes))})")
                params.extend(and_codes)
                order_clause = f"CASE code " + " ".join([f"WHEN '{c}' THEN {i}" for i, c in enumerate(and_codes)]) + " END"
            else:
                or_q = " OR ".join([f'"{w}"*' for w in words])
                where_clauses.append("code IN (SELECT code FROM projects_fts WHERE projects_fts MATCH ?)")
                params.append(or_q)
                order_clause = "(SELECT rank FROM projects_fts WHERE projects_fts.code = projects.code)"

    if principle:
        where_clauses.append("operating_principle LIKE ?")
        params.append(f"%{principle}%")

    if medium:
        where_clauses.append("output_medium LIKE ?")
        params.append(f"%{medium}%")

    if show and show.lower() in SHOW_PRINCIPLES:
        principles = SHOW_PRINCIPLES[show.lower()]
        p_clause = " OR ".join(["operating_principle LIKE ?" for _ in principles])
        where_clauses.append(f"({p_clause})")
        for p in principles:
            params.append(f"%{p}%")

    sql = "SELECT * FROM projects"
    if where_clauses:
        sql += " WHERE " + " AND ".join(where_clauses)
    sql += f" ORDER BY {order_clause} LIMIT {limit}"

    cur.execute(sql, params)
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

def main():
    parser = argparse.ArgumentParser(description="ORBIT CTO Tech Query Engine")
    parser.add_argument("--query", "-q", type=str, default="", help="Natural language or keyword search")
    parser.add_argument("--show", "-s", type=str, default="", choices=["blueprint", "simulation", "paradox", "network-reel"], help="Filter by broadcast show")
    parser.add_argument("--principle", "-p", type=str, default="", help="Filter by operating principle")
    parser.add_argument("--medium", "-m", type=str, default="", help="Filter by output medium")
    parser.add_argument("--recommend", "-r", type=str, default="", help="Recommend tech stack for an episode idea")
    parser.add_argument("--limit", "-n", type=int, default=10, help="Max results to display")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")

    args = parser.parse_args()

    q = args.recommend or args.query
    results = search_projects(query=q, principle=args.principle, medium=args.medium, show=args.show, limit=args.limit)

    if args.json:
        print(json.dumps(results, indent=2))
        return

    print(f"\n\033[1;35m=== ORBIT CTO TECH ADVISORY ===\033[0m")
    if args.recommend:
        print(f"\033[1mEpisode Concept:\033[0m {args.recommend}")
    if q:
        print(f"\033[1mSearch Query:\033[0m {q}")
    if args.show:
        print(f"\033[1mShow Filter:\033[0m {args.show.upper()}")
    print(f"Found {len(results)} candidate open-source engines:\n")

    for p in results:
        print(format_project_card(p))
        print("-" * 70)

if __name__ == "__main__":
    main()
