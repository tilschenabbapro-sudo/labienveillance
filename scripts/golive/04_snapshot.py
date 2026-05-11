"""04 - Snapshot complet de l'etat WP avant intervention."""
from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import ROOT, wp_get


def main() -> None:
    snap_dir = ROOT / "dist" / "snapshots"
    snap_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    out = snap_dir / f"wp-state-{ts}.json"

    snapshot: dict = {"taken_at": ts}

    print("== Site identity ==")
    st, body = wp_get("/", params={})
    snapshot["site"] = {k: body.get(k) for k in (
        "name", "description", "url", "home", "gmt_offset", "timezone_string"
    )} if isinstance(body, dict) else {"raw": str(body)[:400]}
    for k, v in snapshot["site"].items():
        print(f"  {k:18} : {v}")

    print("\n== Themes installes ==")
    st, body = wp_get("/wp/v2/themes")
    if isinstance(body, list):
        snapshot["themes"] = [
            {
                "stylesheet": t.get("stylesheet"),
                "name": (t.get("name") or {}).get("rendered"),
                "status": t.get("status"),
                "version": t.get("version"),
            }
            for t in body
        ]
        for t in snapshot["themes"]:
            mark = "* " if t["status"] == "active" else "  "
            print(f"  {mark}{t['stylesheet']:<40} {str(t['name'])[:40]} ({t['version']})")
    else:
        snapshot["themes_error"] = body

    print("\n== Plugins installes ==")
    st, body = wp_get("/wp/v2/plugins")
    if isinstance(body, list):
        snapshot["plugins"] = [
            {
                "plugin": p.get("plugin"),
                "name": p.get("name"),
                "version": p.get("version"),
                "status": p.get("status"),
            }
            for p in body
        ]
        for p in snapshot["plugins"]:
            mark = "* " if p["status"] == "active" else "  "
            print(f"  {mark}{p['plugin']:<50} v{p.get('version', '?')} [{p['status']}]")
    else:
        snapshot["plugins_error"] = body

    print("\n== Pages publiees ==")
    st, body = wp_get("/wp/v2/pages", params={"per_page": "100", "status": "publish,draft,private"})
    if isinstance(body, list):
        snapshot["pages"] = [
            {
                "id": p.get("id"),
                "title": (p.get("title") or {}).get("rendered"),
                "slug": p.get("slug"),
                "status": p.get("status"),
                "template": p.get("template"),
                "link": p.get("link"),
                "parent": p.get("parent"),
            }
            for p in body
        ]
        for p in snapshot["pages"]:
            print(f"  #{p['id']:<6} {p['slug']:<35} \"{str(p['title'])[:60]}\" [{p['status']}] tpl={p['template'] or 'default'}")
    else:
        snapshot["pages_error"] = body

    print("\n== Articles (posts) ==")
    st, body = wp_get("/wp/v2/posts", params={"per_page": "20", "status": "publish,draft"})
    if isinstance(body, list):
        snapshot["posts_count"] = len(body)
        print(f"  {len(body)} article(s) au total")

    print("\n== Options critiques (via settings) ==")
    st, body = wp_get("/wp/v2/settings")
    if isinstance(body, dict):
        snapshot["settings"] = body
        for k in ("title", "description", "url", "language", "show_on_front", "page_on_front", "page_for_posts", "default_category", "posts_per_page", "permalink_structure"):
            print(f"  {k:22} : {body.get(k)}")
    else:
        snapshot["settings_error"] = body

    out.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n== Snapshot ecrit dans {out.relative_to(ROOT)} ==")


if __name__ == "__main__":
    main()
