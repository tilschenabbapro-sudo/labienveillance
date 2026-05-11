"""13 - Explorer l'API du plugin Redirection."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get


def main() -> None:
    st, body = wp_get("/")
    routes = body.get("routes", {}) if isinstance(body, dict) else {}
    red_routes = sorted([r for r in routes if "redirect" in r.lower()])
    print(f"== Routes Redirection ({len(red_routes)}) ==")
    for r in red_routes[:60]:
        info = routes.get(r, {})
        methods = sorted({m for ep in (info.get("endpoints") or []) for m in (ep.get("methods") or [])})
        print(f"  {r:<70} {methods}")


if __name__ == "__main__":
    main()
