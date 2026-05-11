"""15 - Debug API Redirection : explorer reels formats acceptes."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get, wp_post


def main() -> None:
    print("== GET /redirection/v1/group (no params) ==")
    st, body = wp_get("/redirection/v1/group")
    print(f"HTTP {st}")
    print(json.dumps(body, ensure_ascii=False, indent=2)[:1200])

    print("\n== GET /redirection/v1/plugin ==")
    st, body = wp_get("/redirection/v1/plugin")
    print(f"HTTP {st}")
    print(json.dumps(body, ensure_ascii=False, indent=2)[:1200])

    print("\n== GET /redirection/v1/redirect ==")
    st, body = wp_get("/redirection/v1/redirect")
    print(f"HTTP {st}")
    print(json.dumps(body, ensure_ascii=False, indent=2)[:600])

    print("\n== POST /redirection/v1/group (essai minimal) ==")
    st, body = wp_post("/redirection/v1/group", body={"name": "Test LBV", "moduleId": 1})
    print(f"HTTP {st}")
    print(json.dumps(body, ensure_ascii=False, indent=2)[:800])


if __name__ == "__main__":
    main()
