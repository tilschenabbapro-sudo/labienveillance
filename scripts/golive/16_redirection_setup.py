"""16 - Setup initial du plugin Redirection (creation des tables SQL)."""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get, wp_post


def show_status() -> None:
    st, body = wp_get("/redirection/v1/plugin")
    if isinstance(body, dict):
        for s in body.get("status", []):
            print(f"  [{s.get('status'):<7}] {s.get('id'):<20} {s.get('message')[:80]}")


def main() -> None:
    print("== 1. Status initial ==")
    show_status()

    print("\n== 2. POST /plugin/fix (creation des tables) ==")
    st, body = wp_post("/redirection/v1/plugin/fix", body={})
    print(f"HTTP {st}")
    print(json.dumps(body, ensure_ascii=False, indent=2)[:1200])

    print("\n== 3. Status apres fix ==")
    show_status()

    # Si /plugin/fix n'a pas suffit, tenter via Code Snippets
    st, body = wp_get("/redirection/v1/plugin")
    needs_install = False
    if isinstance(body, dict):
        for s in body.get("status", []):
            if s.get("id") == "db" and s.get("status") != "good":
                needs_install = True

    if needs_install:
        print("\n== 4. Plan B : installer via Code Snippet (Red_Installer::install) ==")
        php = """
        if ( ! function_exists( 'red_install_or_upgrade_database' ) ) {
            if ( ! class_exists( 'Red_Database' ) ) {
                $base = dirname( __FILE__ );
                @include WP_PLUGIN_DIR . '/redirection/database/database.php';
                @include WP_PLUGIN_DIR . '/redirection/database/schema.php';
            }
            if ( class_exists( 'Red_Database' ) ) {
                $db = new Red_Database();
                $status = $db->get_status();
                $status->start_install();
                $status->install_complete();
            }
        }
        if ( class_exists( 'Red_Database_Status' ) ) {
            $status = new Red_Database_Status();
            $status->set_install_complete();
        }
        if ( class_exists( 'Red_Database' ) ) {
            $db = new Red_Database();
            $status = $db->get_status();
            $status->set_install_complete();
            $db->apply_upgrade( $status );
        }
        """
        st, body = wp_post("/code-snippets/v1/snippets", body={
            "name": "LBV Redirection Setup (one-shot)",
            "description": "Force la creation des tables du plugin Redirection",
            "code": php,
            "scope": "global",
            "active": True,
            "tags": ["golive", "lbv", "redirection-setup"],
        })
        print(f"  Snippet HTTP {st}, id={body.get('id') if isinstance(body, dict) else '?'}")
        time.sleep(3)
        # Trigger
        wp_get("/", params={})
        time.sleep(2)
        print("\n== 5. Status final ==")
        show_status()


if __name__ == "__main__":
    main()
