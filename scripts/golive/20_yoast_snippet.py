"""20 - Configurer Yoast SEO par page via un snippet PHP one-shot.

Champs configures pour chaque page :
- _yoast_wpseo_title
- _yoast_wpseo_metadesc
- _yoast_wpseo_canonical
- _yoast_wpseo_focuskw
- _yoast_wpseo_opengraph-title / -description
- _yoast_wpseo_meta-robots-noindex (mentions-legales et embed-devis-jlm)
- _yoast_wpseo_schema_page_type

Aussi : corriger la typo du titre 'Politique de cofidentialite' -> 'Politique de confidentialite'.
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import wp_get, wp_post

PAGES_SEO = [
    {
        "slug": "accueil",
        "title": "Monte-escalier & Douche senior a Epinal - La Bienveillance",
        "metadesc": "La Bienveillance vous accompagne pour bien vieillir chez soi : monte-escaliers, douches securisees, amenagement du domicile. Devis gratuit dans les Vosges.",
        "focuskw": "monte-escalier Epinal",
        "canonical": "https://labienveillance.fr/",
        "og_title": "La Bienveillance - Monte-escalier, douche senior, amenagement du domicile",
        "og_description": "La Bienveillance vous accompagne pour bien vieillir chez soi : monte-escaliers, douches securisees, amenagement du domicile. Devis gratuit dans les Vosges.",
        "schema_page_type": "WebPage",
        "noindex": False,
    },
    {
        "slug": "monte-escaliers",
        "title": "Monte-escalier : installation des 29 EUR/mois - La Bienveillance",
        "metadesc": "Installation de monte-escaliers. Modeles Up Stairlift et Acorn, neufs ou reconditionnes, location des 29 EUR/mois. Devis gratuit.",
        "focuskw": "monte-escalier",
        "canonical": "https://labienveillance.fr/monte-escaliers/",
        "og_title": "Monte-escalier - La Bienveillance",
        "og_description": "Retrouvez votre liberte de mouvement avec nos monte-escaliers adaptes. Installation rapide, garantie a vie sur le rail.",
        "schema_page_type": "WebPage",
        "noindex": False,
    },
    {
        "slug": "salle-de-bain",
        "title": "Remplacement baignoire par douche senior - La Bienveillance",
        "metadesc": "Transformez votre baignoire en douche securisee en une journee. Sol antiderapant, siege integre, barres de maintien. Devis gratuit.",
        "focuskw": "douche securisee senior",
        "canonical": "https://labienveillance.fr/salle-de-bain/",
        "og_title": "Douche securisee - La Bienveillance",
        "og_description": "Remplacement de baignoire par douche adaptee pour seniors. Installation en une journee, sans degats.",
        "schema_page_type": "WebPage",
        "noindex": False,
    },
    {
        "slug": "amenagements",
        "title": "Amenagement logement perte d'autonomie - La Bienveillance",
        "metadesc": "Amenagement du logement pour la perte d'autonomie : eclairage, domotique, WC sureleve, poignees de maintien, sols antiderapants. Devis gratuit.",
        "focuskw": "amenagement logement senior",
        "canonical": "https://labienveillance.fr/amenagements/",
        "og_title": "Amenagement du domicile pour seniors - La Bienveillance",
        "og_description": "Adaptez votre logement a la perte d'autonomie avec nos solutions sur mesure : domotique, eclairage, accessibilite.",
        "schema_page_type": "WebPage",
        "noindex": False,
    },
    {
        "slug": "conseils",
        "title": "Guide bien vieillir chez soi : conseils pratiques - La Bienveillance",
        "metadesc": "Guide pratique pour bien vieillir chez soi : alimentation, adaptation du logement, bien-etre psychologique, aides financieres. Conseils nutrition et equilibre Omega 3/6.",
        "focuskw": "bien vieillir chez soi",
        "canonical": "https://labienveillance.fr/conseils/",
        "og_title": "Conseils pour bien vieillir chez soi - La Bienveillance",
        "og_description": "Decouvrez notre guide complet et nos conseils sante pour maintenir votre autonomie et votre vitalite.",
        "schema_page_type": "Article",
        "noindex": False,
    },
    {
        "slug": "contact",
        "title": "Contactez La Bienveillance - Devis gratuit monte-escalier & douche",
        "metadesc": "Contactez La Bienveillance pour un devis gratuit : monte-escalier, douche securisee, amenagement du domicile. Reponse rapide garantie.",
        "focuskw": "contact La Bienveillance",
        "canonical": "https://labienveillance.fr/contact/",
        "og_title": "Contact - La Bienveillance",
        "og_description": "Demandez votre devis gratuit pour monte-escalier, douche adaptee ou amenagement du domicile.",
        "schema_page_type": "ContactPage",
        "noindex": False,
    },
    {
        "slug": "mentions-legales",
        "title": "Politique de confidentialite et cookies - La Bienveillance",
        "title_post": "Politique de confidentialite",  # corriger la typo du post_title
        "metadesc": "Politique de confidentialite et politique de cookies du site labienveillance.fr.",
        "focuskw": "politique confidentialite",
        "canonical": "https://labienveillance.fr/mentions-legales/",
        "og_title": "Politique de confidentialite - La Bienveillance",
        "og_description": "Politique de confidentialite et cookies du site labienveillance.fr.",
        "schema_page_type": "WebPage",
        "noindex": True,
    },
    {
        "slug": "embed-devis-jlm",
        "title": "Devis estimatif monte-escalier - La Bienveillance",
        "metadesc": "Outil d'estimation rapide pour votre projet de monte-escalier.",
        "canonical": "https://labienveillance.fr/embed-devis-jlm/",
        "schema_page_type": "WebPage",
        "noindex": True,
    },
]


def php_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\r", "")


def main() -> None:
    # Construire le payload PHP
    php_pages = []
    for p in PAGES_SEO:
        kv = [f"'slug' => '{php_escape(p['slug'])}'"]
        for k in ("title", "title_post", "metadesc", "focuskw", "canonical", "og_title", "og_description", "schema_page_type"):
            if k in p:
                kv.append(f"'{k}' => '{php_escape(p[k])}'")
        kv.append(f"'noindex' => " + ("true" if p.get("noindex") else "false"))
        php_pages.append("    array(\n        " + ",\n        ".join(kv) + ",\n    )")

    php = "$pages = array(\n" + ",\n".join(php_pages) + "\n);\n"
    php += """
foreach ( $pages as $cfg ) {
    $p = get_page_by_path( $cfg['slug'] );
    if ( ! $p ) continue;
    $id = $p->ID;

    if ( ! empty( $cfg['title'] ) ) {
        update_post_meta( $id, '_yoast_wpseo_title', $cfg['title'] );
    }
    if ( ! empty( $cfg['metadesc'] ) ) {
        update_post_meta( $id, '_yoast_wpseo_metadesc', $cfg['metadesc'] );
    }
    if ( ! empty( $cfg['canonical'] ) ) {
        update_post_meta( $id, '_yoast_wpseo_canonical', $cfg['canonical'] );
    }
    if ( ! empty( $cfg['focuskw'] ) ) {
        update_post_meta( $id, '_yoast_wpseo_focuskw', $cfg['focuskw'] );
    }
    if ( ! empty( $cfg['og_title'] ) ) {
        update_post_meta( $id, '_yoast_wpseo_opengraph-title', $cfg['og_title'] );
        update_post_meta( $id, '_yoast_wpseo_twitter-title', $cfg['og_title'] );
    }
    if ( ! empty( $cfg['og_description'] ) ) {
        update_post_meta( $id, '_yoast_wpseo_opengraph-description', $cfg['og_description'] );
        update_post_meta( $id, '_yoast_wpseo_twitter-description', $cfg['og_description'] );
    }
    if ( ! empty( $cfg['schema_page_type'] ) ) {
        update_post_meta( $id, '_yoast_wpseo_schema_page_type', $cfg['schema_page_type'] );
    }
    // noindex : 1 = noindex, 2 = index, 0 = default
    update_post_meta( $id, '_yoast_wpseo_meta-robots-noindex', ! empty( $cfg['noindex'] ) ? '1' : '0' );

    // Corriger le post_title si demande
    if ( ! empty( $cfg['title_post'] ) ) {
        wp_update_post( array(
            'ID'         => $id,
            'post_title' => $cfg['title_post'],
        ) );
    }
}

// Reglages globaux Yoast SEO
$opts = get_option( 'wpseo', array() );
if ( ! is_array( $opts ) ) $opts = array();
$opts['company_name'] = 'La Bienveillance';
$opts['company_or_person'] = 'company';
$opts['website_name'] = 'La Bienveillance';
$opts['company_or_person_user_id'] = false;
update_option( 'wpseo', $opts );

// Titre du separateur (Yoast V14+)
$titles = get_option( 'wpseo_titles', array() );
if ( ! is_array( $titles ) ) $titles = array();
$titles['separator'] = 'sc-ndash';  // tiret demi-cadratin
// Titre/desc page d'accueil :
$titles['title-page-accueil'] = ''; // utiliser le meta de la page directement
update_option( 'wpseo_titles', $titles );

update_option( 'lbv_yoast_configured', current_time( 'mysql' ) );
"""

    payload = {
        "name": "LBV Yoast Configuration (one-shot)",
        "description": "Configure les meta Yoast par page",
        "code": php,
        "scope": "global",
        "active": True,
        "tags": ["golive", "lbv", "yoast"],
    }

    # Supprimer ancien snippet meme nom
    st, sn = wp_get("/code-snippets/v1/snippets")
    for sp in (sn or []):
        if "LBV Yoast" in (sp.get("name") or ""):
            wp_post(f"/code-snippets/v1/snippets/{sp['id']}/deactivate", body={})

    st, body = wp_post("/code-snippets/v1/snippets", body=payload)
    print(f"== Snippet Yoast HTTP {st}")
    if st not in (200, 201):
        print(json.dumps(body, ensure_ascii=False, indent=2)[:1500])
        return
    sid = body.get("id") if isinstance(body, dict) else None
    print(f"   id={sid}")

    for i in range(3):
        wp_get("/", params={})
        time.sleep(1)

    # Verification
    print("\n== Verification meta Yoast ==")
    for cfg in PAGES_SEO:
        st, p = wp_get("/wp/v2/pages", params={"slug": cfg["slug"], "per_page": "1"})
        if isinstance(p, list) and p:
            page = p[0]
            yhj = page.get("yoast_head_json", {})
            print(f"  {cfg['slug']:<22} title='{(yhj.get('title') or '')[:55]}'  canonical={yhj.get('canonical')}")
            if cfg.get("noindex"):
                robots = yhj.get("robots", {})
                noindex_marker = robots.get("index") if isinstance(robots, dict) else robots
                print(f"  {'':<22}   robots: {robots}")

    # Desactiver le snippet
    print("\n== Desactivation snippet ==")
    if sid:
        wp_post(f"/code-snippets/v1/snippets/{sid}/deactivate", body={})


if __name__ == "__main__":
    main()
