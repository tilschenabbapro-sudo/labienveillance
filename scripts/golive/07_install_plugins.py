"""07 - Installer/activer les plugins requis."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get, wp_post, wp_put

TO_INSTALL = [
    ("contact-form-7-honeypot",        "Honeypot for Contact Form 7"),
    ("redirection",                    "Redirection"),
]

TO_ACTIVATE = [
    ("wp-mail-smtp/wp_mail_smtp",      "WP Mail SMTP"),
]


def list_plugins() -> list[dict]:
    status, body = wp_get("/wp/v2/plugins")
    return body if isinstance(body, list) else []


def find_plugin(plugins, slug_or_path):
    for p in plugins:
        if not isinstance(p, dict):
            continue
        if p.get("plugin") == slug_or_path:
            return p
        if p.get("plugin", "").startswith(slug_or_path + "/"):
            return p
    return None


def fmt(body) -> str:
    return json.dumps(body, ensure_ascii=False)[:400]


def main() -> None:
    plugins_before = list_plugins()
    print(f"== {len(plugins_before)} plugin(s) avant ==")

    for slug, label in TO_INSTALL:
        existing = find_plugin(plugins_before, slug)
        if existing:
            print(f"[INSTALL] {label} ({slug}) deja installe : {existing['plugin']} [{existing['status']}]")
            if existing["status"] != "active":
                print(f"  -> activation...")
                st, body = wp_put("/wp/v2/plugins/" + existing["plugin"], body={"status": "active"})
                print(f"  -> HTTP {st} | {fmt(body)}")
            continue

        print(f"[INSTALL] {label} ({slug}) -> installation...")
        st, body = wp_post(
            "/wp/v2/plugins",
            body={"slug": slug, "status": "active"},
        )
        print(f"  HTTP {st} | {fmt(body)}")

    plugins_after_install = list_plugins()
    for path, label in TO_ACTIVATE:
        p = find_plugin(plugins_after_install, path)
        if not p:
            print(f"[ACTIVATE] {label} : INTROUVABLE")
            continue
        if p["status"] == "active":
            print(f"[ACTIVATE] {label} deja actif")
            continue
        print(f"[ACTIVATE] {label} ({p['plugin']}) -> activation...")
        st, body = wp_put("/wp/v2/plugins/" + p["plugin"], body={"status": "active"})
        print(f"  HTTP {st} | {fmt(body)}")

    print("\n== Etat final des plugins requis ==")
    final = list_plugins()
    for path_or_slug, label in [(s, l) for s, l in TO_INSTALL] + TO_ACTIVATE:
        p = find_plugin(final, path_or_slug)
        if p:
            print(f"  {label:<40} {p['plugin']:<50} v{p.get('version', '?'):<10} [{p['status']}]")
        else:
            print(f"  {label:<40} (introuvable)")


if __name__ == "__main__":
    main()
