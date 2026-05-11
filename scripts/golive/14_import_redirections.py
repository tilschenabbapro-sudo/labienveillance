"""14 - Importer les redirections 301 dans le plugin Redirection.

Strategie : creer chaque redirection via l'API plutot que d'uploader le CSV
(plus simple, et permet de gerer les hashes # qui posent probleme en CSV import).
"""
from __future__ import annotations

import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import ROOT, wp_get, wp_post

CSV_FILE = ROOT / "migration-wp" / "redirections-wp.csv"


def parse_csv() -> list[dict]:
    rules = []
    with CSV_FILE.open(encoding="utf-8") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#") or line.startswith("source,"):
                continue
            parts = [p.strip() for p in line.split(",")]
            if len(parts) < 6:
                continue
            source, target, code, regex, group, enabled = parts[:6]
            rules.append({
                "source": source,
                "target": target,
                "code": int(code),
                "regex": int(regex),
                "group": group,
                "enabled": int(enabled),
            })
    return rules


def main() -> None:
    rules = parse_csv()
    print(f"== {len(rules)} regle(s) a importer ==")
    by_group = defaultdict(list)
    for r in rules:
        by_group[r["group"]].append(r)
    for g, items in by_group.items():
        print(f"  groupe '{g}' : {len(items)} regle(s)")

    # 1. Lister les groupes existants
    print("\n== Groupes existants ==")
    st, body = wp_get("/redirection/v1/group", params={"groupBy": "module", "per_page": "100"})
    existing_groups = {}
    if isinstance(body, dict) and "items" in body:
        for g in body["items"]:
            existing_groups[g.get("name", "")] = g.get("id")
            print(f"  #{g.get('id')} {g.get('name'):<30} module={g.get('module_name')} enabled={g.get('enabled')}")
    else:
        print(f"  body: {json.dumps(body)[:400]}")

    # 2. Pour chaque group LBV, creer ou recuperer son id
    target_group_map = {}
    for g in by_group.keys():
        readable = f"LBV {g}"
        if readable in existing_groups:
            target_group_map[g] = existing_groups[readable]
            print(f"  groupe '{g}' -> deja present id={target_group_map[g]}")
        else:
            print(f"  creation groupe '{readable}'...")
            st, body = wp_post("/redirection/v1/group", body={
                "name": readable,
                "moduleId": 1,  # 1 = WordPress (URL hooks)
            })
            if isinstance(body, dict) and "items" in body:
                # L'API renvoie la liste mise a jour. Cherche le nouveau.
                for gg in body["items"]:
                    if gg.get("name") == readable:
                        target_group_map[g] = gg.get("id")
                        break
            print(f"    HTTP {st}, id={target_group_map.get(g)}")

    # 3. Creer les redirections
    print("\n== Creation des redirections ==")
    created = 0
    failed = 0
    for r in rules:
        gid = target_group_map.get(r["group"])
        if not gid:
            print(f"  ! pas de group pour {r['source']}, skip")
            failed += 1
            continue
        payload = {
            "url": r["source"],
            "action_data": {"url": r["target"]},
            "action_type": "url",
            "action_code": r["code"],
            "match_type": "url",
            "group_id": gid,
            "regex": bool(r["regex"]),
            "enabled": bool(r["enabled"]),
        }
        st, body = wp_post("/redirection/v1/redirect", body=payload)
        if st in (200, 201):
            print(f"  + {r['source']:<55} -> {r['target']}")
            created += 1
        else:
            print(f"  ! {r['source']} : HTTP {st} {json.dumps(body)[:200]}")
            failed += 1
    print(f"\n== {created} cree(s), {failed} echec(s) ==")


if __name__ == "__main__":
    main()
