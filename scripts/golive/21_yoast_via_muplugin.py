"""21 - Configurer Yoast SEO + nettoyer les snippets LBV via mu-plugin SFTP one-shot."""
from __future__ import annotations

import json
import sys
import time
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import sftp_connect, wp_get

REMOTE = "clickandbuilds/laseptieme/wp-content/mu-plugins/lbv-yoast-config.php"

# IMPORTANT : on n'inclut PAS de modifications de options globales Yoast
# (wpseo, wpseo_titles) qui peuvent crasher. On se limite a update_post_meta
# qui est inoffensif.

PAGES_SEO = [
    ("accueil",          "Monte-escalier & Douche senior a Epinal - La Bienveillance",
     "La Bienveillance vous accompagne pour bien vieillir chez soi : monte-escaliers, douches securisees, amenagement du domicile. Devis gratuit dans les Vosges.",
     "monte-escalier Epinal", "https://labienveillance.fr/",
     "La Bienveillance - Monte-escalier, douche senior, amenagement du domicile",
     "La Bienveillance vous accompagne pour bien vieillir chez soi : monte-escaliers, douches securisees, amenagement du domicile. Devis gratuit dans les Vosges.",
     "WebPage", False, None),
    ("monte-escaliers",  "Monte-escalier : installation des 29 EUR/mois - La Bienveillance",
     "Installation de monte-escaliers. Modeles Up Stairlift et Acorn, neufs ou reconditionnes, location des 29 EUR/mois. Devis gratuit.",
     "monte-escalier", "https://labienveillance.fr/monte-escaliers/",
     "Monte-escalier - La Bienveillance",
     "Retrouvez votre liberte de mouvement avec nos monte-escaliers adaptes. Installation rapide, garantie a vie sur le rail.",
     "WebPage", False, None),
    ("salle-de-bain",    "Remplacement baignoire par douche senior - La Bienveillance",
     "Transformez votre baignoire en douche securisee en une journee. Sol antiderapant, siege integre, barres de maintien. Devis gratuit.",
     "douche securisee senior", "https://labienveillance.fr/salle-de-bain/",
     "Douche securisee - La Bienveillance",
     "Remplacement de baignoire par douche adaptee pour seniors. Installation en une journee, sans degats.",
     "WebPage", False, None),
    ("amenagements",     "Amenagement logement perte d'autonomie - La Bienveillance",
     "Amenagement du logement pour la perte d'autonomie : eclairage, domotique, WC sureleve, poignees de maintien, sols antiderapants. Devis gratuit.",
     "amenagement logement senior", "https://labienveillance.fr/amenagements/",
     "Amenagement du domicile pour seniors - La Bienveillance",
     "Adaptez votre logement a la perte d'autonomie avec nos solutions sur mesure : domotique, eclairage, accessibilite.",
     "WebPage", False, None),
    ("conseils",         "Guide bien vieillir chez soi : conseils pratiques - La Bienveillance",
     "Guide pratique pour bien vieillir chez soi : alimentation, adaptation du logement, bien-etre psychologique, aides financieres.",
     "bien vieillir chez soi", "https://labienveillance.fr/conseils/",
     "Conseils pour bien vieillir chez soi - La Bienveillance",
     "Decouvrez notre guide complet et nos conseils sante pour maintenir votre autonomie et votre vitalite.",
     "Article", False, None),
    ("contact",          "Contactez La Bienveillance - Devis gratuit monte-escalier & douche",
     "Contactez La Bienveillance pour un devis gratuit : monte-escalier, douche securisee, amenagement du domicile. Reponse rapide garantie.",
     "contact La Bienveillance", "https://labienveillance.fr/contact/",
     "Contact - La Bienveillance",
     "Demandez votre devis gratuit pour monte-escalier, douche adaptee ou amenagement du domicile.",
     "ContactPage", False, None),
    ("mentions-legales", "Politique de confidentialite et cookies - La Bienveillance",
     "Politique de confidentialite et politique de cookies du site labienveillance.fr.",
     "politique confidentialite", "https://labienveillance.fr/mentions-legales/",
     "Politique de confidentialite - La Bienveillance",
     "Politique de confidentialite et cookies du site labienveillance.fr.",
     "WebPage", True, "Politique de confidentialite"),
    ("embed-devis-jlm",  "Devis estimatif monte-escalier - La Bienveillance",
     "Outil d'estimation rapide pour votre projet de monte-escalier.",
     "", "https://labienveillance.fr/embed-devis-jlm/",
     "Devis estimatif - La Bienveillance",
     "Outil d'estimation rapide pour votre projet de monte-escalier.",
     "WebPage", True, None),
]


def esc(s: str) -> str:
    if s is None:
        return ""
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\r", "")


def main() -> None:
    php_array_items = []
    for slug, title, metadesc, focuskw, canonical, og_title, og_desc, schema_type, noindex, title_post in PAGES_SEO:
        php_array_items.append(
            f"    '{esc(slug)}' => array(\n"
            f"        'title'         => '{esc(title)}',\n"
            f"        'metadesc'      => '{esc(metadesc)}',\n"
            f"        'focuskw'       => '{esc(focuskw)}',\n"
            f"        'canonical'     => '{esc(canonical)}',\n"
            f"        'og_title'      => '{esc(og_title)}',\n"
            f"        'og_desc'       => '{esc(og_desc)}',\n"
            f"        'schema_type'   => '{esc(schema_type)}',\n"
            f"        'noindex'       => " + ("true" if noindex else "false") + ",\n"
            f"        'title_post'    => '{esc(title_post or '')}',\n"
            f"    )"
        )
    php_array = ",\n".join(php_array_items)

    php_code = f"""<?php
/**
 * Plugin Name: LBV Yoast Config (one-shot, SFTP)
 * Description: Configure les meta Yoast par page + corrige titre. Idempotent. A supprimer apres usage.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'init', function () {{
    if ( get_option( 'lbv_yoast_done' ) ) {{
        return;
    }}

    global $wpdb;

    // Desactiver tous les snippets LBV en DB pour eviter qu'ils recrashent au reload
    $tbl = $wpdb->prefix . 'snippets';
    if ( $wpdb->get_var( "SHOW TABLES LIKE '{{$tbl}}'" ) ) {{
        $wpdb->query(
            "UPDATE {{$tbl}} SET active = 0 WHERE name LIKE 'LBV %'"
        );
    }}

    $pages = array(
{php_array}
    );

    foreach ( $pages as $slug => $cfg ) {{
        $p = get_page_by_path( $slug );
        if ( ! $p ) continue;
        $id = $p->ID;

        if ( ! empty( $cfg['title'] ) )       update_post_meta( $id, '_yoast_wpseo_title', $cfg['title'] );
        if ( ! empty( $cfg['metadesc'] ) )    update_post_meta( $id, '_yoast_wpseo_metadesc', $cfg['metadesc'] );
        if ( ! empty( $cfg['canonical'] ) )   update_post_meta( $id, '_yoast_wpseo_canonical', $cfg['canonical'] );
        if ( ! empty( $cfg['focuskw'] ) )     update_post_meta( $id, '_yoast_wpseo_focuskw', $cfg['focuskw'] );
        if ( ! empty( $cfg['og_title'] ) ) {{
            update_post_meta( $id, '_yoast_wpseo_opengraph-title', $cfg['og_title'] );
            update_post_meta( $id, '_yoast_wpseo_twitter-title', $cfg['og_title'] );
        }}
        if ( ! empty( $cfg['og_desc'] ) ) {{
            update_post_meta( $id, '_yoast_wpseo_opengraph-description', $cfg['og_desc'] );
            update_post_meta( $id, '_yoast_wpseo_twitter-description', $cfg['og_desc'] );
        }}
        if ( ! empty( $cfg['schema_type'] ) ) {{
            update_post_meta( $id, '_yoast_wpseo_schema_page_type', $cfg['schema_type'] );
        }}
        update_post_meta( $id, '_yoast_wpseo_meta-robots-noindex', ! empty( $cfg['noindex'] ) ? '1' : '0' );

        if ( ! empty( $cfg['title_post'] ) ) {{
            wp_update_post( array(
                'ID'         => $id,
                'post_title' => $cfg['title_post'],
            ) );
        }}
    }}

    update_option( 'lbv_yoast_done', current_time( 'mysql' ) );
}}, 99 );
"""

    # 1. Deposer le mu-plugin
    t, s = sftp_connect()
    try:
        with s.open(REMOTE, "w") as f:
            f.write(php_code.encode("utf-8"))
        st = s.stat(REMOTE)
        print(f"  Mu-plugin deploye : {st.st_size} bytes")
    finally:
        s.close(); t.close()

    # 2. Triggers
    for i in range(3):
        try:
            urllib.request.urlopen("https://labienveillance.fr/", timeout=10).read()
        except Exception as e:
            print(f"  trigger #{i+1} : {e}")
        time.sleep(1)

    # 3. Verification (rest API doit etre OK car snippet desactive)
    print("\n== Verification yoast_head_json par page ==")
    for slug, expected_title, *_ in PAGES_SEO:
        st, body = wp_get("/wp/v2/pages", params={"slug": slug, "per_page": "1"})
        if isinstance(body, list) and body:
            p = body[0]
            yhj = p.get("yoast_head_json", {})
            actual_title = yhj.get("title", "")
            match = expected_title[:40].lower() in actual_title.lower()
            mark = "OK" if match else "??"
            print(f"  [{mark}] {slug:<20} title='{actual_title[:70]}'  robots={yhj.get('robots', {}).get('index')}")
        else:
            print(f"  [ERR] {slug} : {str(body)[:200]}")


if __name__ == "__main__":
    main()
