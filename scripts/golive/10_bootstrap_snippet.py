"""10 - Creer + activer un snippet one-shot qui :
 1) Bascule permalink_structure en /%postname%/
 2) Switch theme vers labienveillance
 3) Cree page embed-devis-jlm avec le bon template
 4) Flush rewrite rules
 5) Marque comme done (idempotent)

Puis on relit l'etat pour confirmer.
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get, wp_post

SNIPPET_NAME = "LBV Bootstrap GO-LIVE (one-shot)"

# Note: pas de balises <?php, code-snippets prefere du PHP "naked".
PHP_CODE = r"""
// LBV Bootstrap one-shot. Idempotent grace a l'option 'lbv_bootstrap_done'.
if ( get_option( 'lbv_bootstrap_done' ) ) {
    return;
}

$report = array();

// 1. Permaliens jolis
$old_perma = get_option( 'permalink_structure' );
update_option( 'permalink_structure', '/%postname%/' );
$report['permalink_old'] = $old_perma;
$report['permalink_new'] = get_option( 'permalink_structure' );

// 2. Theme
$current = get_option( 'stylesheet' );
if ( $current !== 'labienveillance' ) {
    switch_theme( 'labienveillance' );
}
$report['theme_before'] = $current;
$report['theme_after']  = get_option( 'stylesheet' );

// 3. Page embed-devis-jlm
$existing = get_page_by_path( 'embed-devis-jlm' );
if ( ! $existing ) {
    $pid = wp_insert_post( array(
        'post_title'    => 'Embed devis JLM',
        'post_name'     => 'embed-devis-jlm',
        'post_status'   => 'publish',
        'post_type'     => 'page',
        'post_content'  => '',
        'page_template' => 'page-embed-devis-jlm.php',
        'meta_input'    => array(
            '_wp_page_template' => 'page-embed-devis-jlm.php',
        ),
    ) );
    $report['embed_page_id'] = $pid;
} else {
    update_post_meta( $existing->ID, '_wp_page_template', 'page-embed-devis-jlm.php' );
    $report['embed_page_id'] = $existing->ID;
}

// 4. Flush rewrite rules
flush_rewrite_rules( true );

// 5. Marquer comme fait
update_option( 'lbv_bootstrap_done', current_time( 'mysql' ) );
update_option( 'lbv_bootstrap_report', $report );
"""


def main() -> None:
    print("== Creation du snippet bootstrap ==")
    # Code Snippets attend ces champs (cf schema)
    payload = {
        "name": SNIPPET_NAME,
        "description": "Snippet one-shot lance par la mise en ligne automatisee. A supprimer apres.",
        "code": PHP_CODE,
        "scope": "global",
        "active": True,
        "tags": ["golive", "lbv"],
    }
    st, body = wp_post("/code-snippets/v1/snippets", body=payload)
    print(f"  HTTP {st}")
    if st not in (200, 201):
        print(f"  ECHEC : {json.dumps(body, ensure_ascii=False)[:800]}")
        sys.exit(1)
    snippet_id = body.get("id") if isinstance(body, dict) else None
    print(f"  Snippet id #{snippet_id} [{body.get('scope') if isinstance(body, dict) else '?'}] active={body.get('active') if isinstance(body, dict) else '?'}")

    # Attendre un peu pour que le snippet s'execute (global scope)
    print("\n== Attente 3s execution ==")
    time.sleep(3)

    # Forcer une requete pour s'assurer que le snippet a tourne
    print("\n== Trigger requete vers le site (force l'execution PHP) ==")
    st, body = wp_get("/", params={})
    if isinstance(body, dict):
        print(f"  Site : {body.get('name')} | url : {body.get('url')}")

    # Verifier le rapport
    print("\n== Lire option lbv_bootstrap_report (via snippet de lecture ?) ==")
    # On va passer par /wp/v2/settings et /wp/v2/themes pour confirmer
    st, body = wp_get("/wp/v2/settings")
    print(f"  show_on_front  : {body.get('show_on_front')}")
    print(f"  page_on_front  : {body.get('page_on_front')}")
    print(f"  permalink_structure (REST) : {body.get('permalink_structure')!r}")

    st, body = wp_get("/wp/v2/themes")
    for t in body if isinstance(body, list) else []:
        mark = "* " if t["status"] == "active" else "  "
        print(f"  {mark}{t['stylesheet']:<35} v{t.get('version', '?')}")

    # Verifier page embed-devis-jlm
    st, body = wp_get("/wp/v2/pages", params={"slug": "embed-devis-jlm", "per_page": "1"})
    if isinstance(body, list) and body:
        page = body[0]
        print(f"\n== Page embed-devis-jlm : id={page['id']} title={(page.get('title') or {}).get('rendered')} template={page.get('template')}")
    else:
        print("\n== Page embed-devis-jlm : ABSENTE")

    print(f"\nSnippet id={snippet_id} a desactiver une fois l'etape verifiee.")


if __name__ == "__main__":
    main()
