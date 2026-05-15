"""23 - Creer les pages WP dediees aux configurateurs (REST API).

Prerequis : fichier .creds.env (voir scripts/golive/_env.py) avec WP_URL, WP_USER, WP_APP_PASS.

Usage (depuis la racine du depot) :
    python scripts/golive/23_create_estimation_pages.py

Idempotent : si la page existe deja (slug), affiche son id et ne recree pas.
Les slugs `estimation-monte-escalier` et `estimation-douche` declenchent
automatiquement `page-estimation-*.php` dans le theme (hierarchie WP).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get, wp_post

PAGES = (
    {
        "slug": "estimation-monte-escalier",
        "title": "Devis estimatif monte-escalier",
    },
    {
        "slug": "estimation-douche",
        "title": "Estimation douche sécurisée",
    },
)


def main() -> None:
    for spec in PAGES:
        slug = spec["slug"]
        title = spec["title"]
        st, body = wp_get("/wp/v2/pages", params={"slug": slug, "per_page": "1"})
        if isinstance(body, list) and body:
            p = body[0]
            tid = (p.get("title") or {}).get("rendered", "")
            print(f"OK  deja presente : slug={slug!r} id={p['id']} title={tid!r} link={p.get('link', '')}")
            continue
        if st != 200:
            print(f"!! GET pages slug={slug} HTTP {st} body={json.dumps(body, ensure_ascii=False)[:400]}")
            continue
        payload = {
            "title": title,
            "slug": slug,
            "status": "publish",
            "content": "",
        }
        st2, body2 = wp_post("/wp/v2/pages", body=payload)
        if st2 in (200, 201) and isinstance(body2, dict):
            print(f"OK  creee : slug={slug!r} id={body2.get('id')} link={body2.get('link', '')}")
        else:
            print(f"!! POST page slug={slug} HTTP {st2} body={json.dumps(body2, ensure_ascii=False)[:800]}")


if __name__ == "__main__":
    main()
