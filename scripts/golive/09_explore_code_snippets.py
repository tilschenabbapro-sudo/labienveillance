"""09 - Explorer l'API du plugin Code Snippets."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get


def main() -> None:
    # Discovery namespaces
    st, body = wp_get("/")
    routes = body.get("routes", {}) if isinstance(body, dict) else {}
    cs_routes = sorted([r for r in routes if r.startswith("/code-snippets/")])
    print(f"== Routes /code-snippets/ ({len(cs_routes)}) ==")
    for r in cs_routes:
        info = routes.get(r, {})
        methods = sorted({m for ep in (info.get("endpoints") or []) for m in (ep.get("methods") or [])})
        print(f"  {r:<60} {methods}")

    # Lister les snippets existants
    print("\n== Snippets existants ==")
    st, body = wp_get("/code-snippets/v1/snippets")
    print(f"HTTP {st}, type={type(body).__name__}")
    if isinstance(body, list):
        for s in body:
            print(f"  #{s.get('id')} {s.get('name'):<50} [{'ACTIVE' if s.get('active') else 'inactive'}] scope={s.get('scope')}")
    else:
        print(f"  body: {json.dumps(body, ensure_ascii=False)[:600]}")


if __name__ == "__main__":
    main()
