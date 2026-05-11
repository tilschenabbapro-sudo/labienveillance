"""22 - Batterie de tests finaux sur le site mis en ligne."""
from __future__ import annotations

import json
import re
import sys
import urllib.request
import urllib.error
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))


def fetch(url: str, allow_redirects: bool = True, head_only: bool = False) -> tuple[int, dict, str, str]:
    """Retourne (status, headers, body, final_url)."""
    if not allow_redirects:
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):
                return None
        opener = urllib.request.build_opener(NoRedirect)
    else:
        opener = urllib.request.build_opener()
    req = urllib.request.Request(url, method=("HEAD" if head_only else "GET"), headers={
        "User-Agent": "LBV-Probe/1.0",
        "Cache-Control": "no-cache",
    })
    try:
        with opener.open(req, timeout=15) as r:
            body = "" if head_only else r.read().decode("utf-8", errors="replace")
            return r.status, dict(r.headers), body, r.url
    except urllib.error.HTTPError as e:
        body = "" if head_only else e.read().decode("utf-8", errors="replace")
        return e.code, dict(e.headers), body, getattr(e, "url", url)


def title_of(html: str) -> str:
    m = re.search(r"<title[^>]*>([^<]+)</title>", html, re.IGNORECASE)
    return (m.group(1).strip() if m else "(no title)")


def main() -> None:
    print("=" * 100)
    print(" 1) PAGES PUBLIQUES")
    print("=" * 100)

    pages = [
        ("Home",            "https://labienveillance.fr/",                     ["Bien vieillir chez soi", "Monte-escaliers", "Salle de bain", "header__logo"]),
        ("Monte-escaliers", "https://labienveillance.fr/monte-escaliers/",     ["Monte-escaliers", "Up Stairlift", "Acorn", "jlmLiteAppRoot", "jlm-lite-devis.js"]),
        ("Salle de bain",   "https://labienveillance.fr/salle-de-bain/",       ["Salle de bain", "devis-sdb-app", "devis-sdb.js"]),
        ("Amenagements",    "https://labienveillance.fr/amenagements/",        ["nagements"]),
        ("Conseils",        "https://labienveillance.fr/conseils/",            ["Conseils"]),
        ("Contact",         "https://labienveillance.fr/contact/",             ["Contact", "wpcf7", "sujet", "03 25 31 13 60"]),
        ("Mentions",        "https://labienveillance.fr/mentions-legales/",    ["confidentialit", "RGPD", "cookies"]),
        ("Embed JLM",       "https://labienveillance.fr/embed-devis-jlm/",     ["jlmLiteAppRoot", "jlm-lite-devis.js"]),
    ]
    for label, url, markers in pages:
        st, hd, body, fu = fetch(url)
        found = [m for m in markers if m.lower() in body.lower()]
        miss = [m for m in markers if m.lower() not in body.lower()]
        mark = f"{len(found)}/{len(markers)}"
        title = title_of(body)[:60]
        print(f"  {label:<18} HTTP {st} | {len(body):>7}b | {mark} | {title:<55} | missing={miss or ''}")

    print()
    print("=" * 100)
    print(" 2) ASSETS THEME (CSS/JS/images)")
    print("=" * 100)
    assets = [
        "https://labienveillance.fr/wp-content/themes/labienveillance/assets/css/style.css",
        "https://labienveillance.fr/wp-content/themes/labienveillance/assets/js/main.js",
        "https://labienveillance.fr/wp-content/themes/labienveillance/assets/js/devis-sdb.js",
        "https://labienveillance.fr/wp-content/themes/labienveillance/assets/js/jlm-lite-devis.js",
        "https://labienveillance.fr/wp-content/themes/labienveillance/assets/img/logo-la-bienveillance.png",
        "https://labienveillance.fr/wp-content/themes/labienveillance/assets/img/sdb/sdb-avant-1.jpg",
        "https://labienveillance.fr/wp-content/themes/labienveillance/assets/img/devis-monte-escalier/escalier-droit.jpg",
    ]
    for url in assets:
        st, hd, _, _ = fetch(url, head_only=True)
        size = hd.get("Content-Length", "?")
        ct = hd.get("Content-Type", "?")[:30]
        print(f"  HTTP {st} | {size:>8}b | {ct:<30} | {url[55:]}")

    print()
    print("=" * 100)
    print(" 3) REDIRECTIONS 301 (sans suivre)")
    print("=" * 100)
    redirects = [
        ("/monte-escalier/",    "https://labienveillance.fr/monte-escalier/",         "/monte-escaliers/"),
        ("/parrainage.html",    "https://labienveillance.fr/parrainage.html",         "/"),
        ("/contact.html",       "https://labienveillance.fr/contact.html",            "/contact/"),
        ("/elementor-1985/",    "https://labienveillance.fr/elementor-1985/",         "/monte-escaliers/#devis-estimatif-en-ligne"),
        ("/configurateur-douche/", "https://labienveillance.fr/configurateur-douche/", "/salle-de-bain/#devis-estimatif-salle-de-bain"),
        ("/index.html",         "https://labienveillance.fr/index.html",              "/"),
    ]
    for label, url, expected_target in redirects:
        st, hd, _, _ = fetch(url, allow_redirects=False, head_only=True)
        loc = hd.get("Location", "")
        ok = st in (301, 302, 308) and loc.endswith(expected_target)
        mark = "OK " if ok else "?? "
        print(f"  [{mark}] {label:<28} HTTP {st} -> {loc}")

    print()
    print("=" * 100)
    print(" 4) BACK-OFFICE (ne doit PAS etre casse)")
    print("=" * 100)
    for url in [
        "https://labienveillance.fr/wp-admin/",
        "https://labienveillance.fr/wp-login.php",
        "https://labienveillance.fr/admin/",
    ]:
        st, hd, _, fu = fetch(url, allow_redirects=False, head_only=True)
        print(f"  HTTP {st} | {url:<55} -> {hd.get('Location', '(no redirect)')}")

    print()
    print("=" * 100)
    print(" 5) SITEMAP YOAST")
    print("=" * 100)
    for url in [
        "https://labienveillance.fr/sitemap_index.xml",
        "https://labienveillance.fr/page-sitemap.xml",
    ]:
        st, hd, body, _ = fetch(url)
        ct = hd.get("Content-Type", "?")
        count = body.count("<loc>") if "xml" in ct else 0
        print(f"  HTTP {st} | {ct:<35} | {count} URLs | {url[27:]}")

    print()
    print("=" * 100)
    print(" 6) CONFIGURATEURS : verifs profondes")
    print("=" * 100)

    # SDB
    st, hd, body, _ = fetch("https://labienveillance.fr/salle-de-bain/")
    has_app_root = 'id="devis-sdb-app"' in body
    has_js = "devis-sdb.js" in body
    has_inline_cfg = "labienveillanceDevisSdb" in body  # via wp_localize_script
    print(f"  Salle de bain : app-root={has_app_root}  js={has_js}  inline-cfg={has_inline_cfg}")

    # JLM
    st, hd, body, _ = fetch("https://labienveillance.fr/embed-devis-jlm/")
    has_jlm_root = 'id="jlmLiteAppRoot"' in body
    has_jlm_js = "jlm-lite-devis.js" in body
    has_jlm_images = "labienveillanceJlm" in body
    print(f"  Embed JLM     : app-root={has_jlm_root}  js={has_jlm_js}  images-cfg={has_jlm_images}")

    # Iframe outil JLM (ignorer l'iframe noscript GTM en tete de page)
    st, hd, body, _ = fetch("https://labienveillance.fr/monte-escaliers/")
    iframe_srcs = re.findall(r'<iframe[^>]+src="([^"]+)"', body)
    devis_iframe = next((s for s in iframe_srcs if "embed-devis-jlm" in s), None)
    print(f"  Monte-escaliers iframe(s) devis : {devis_iframe or iframe_srcs}")

    print()
    print("=" * 100)
    print(" 7) FORMULAIRE CONTACT - check assets CF7")
    print("=" * 100)
    st, hd, body, _ = fetch("https://labienveillance.fr/contact/")
    fields = [
        ("Champ prenom",     'name="prenom"'),
        ("Champ nom",        'name="nom"'),
        ("Champ telephone",  'name="telephone"'),
        ("Champ email",      'name="votre-email"'),
        ("Champ sujet",      'name="sujet"'),
        ("Champ message",    'name="message"'),
        ("Honeypot",         'lbv-website'),
        ("Submit",           'class="btn btn--accent'),
        ("Nonce CF7",        '_wpcf7'),
        ("Mentions",         '/mentions-legales/'),
    ]
    for label, marker in fields:
        ok = marker in body
        print(f"  [{('OK' if ok else '??'):<2}] {label:<22} ({marker})")

    print()
    print("=" * 100)
    print(" 8) SEO / METADATA / SERVICES GOOGLE (smoke test)")
    print("=" * 100)
    st, hd, body, _ = fetch("https://labienveillance.fr/")
    has_canon = 'rel="canonical"' in body
    has_robots_meta = "name='robots'" in body or 'name="robots"' in body
    has_gtm = "GTM-NZVHPJ3Z" in body or "googletagmanager" in body
    has_schema = 'application/ld+json' in body and "schema.org" in body
    ogm = re.search(r'<meta property="og:image" content="([^"]+)"', body)
    og_url = ogm.group(1) if ogm else ""
    og_ok = False
    if og_url:
        st_og, _, _, _ = fetch(og_url, head_only=True)
        og_ok = st_og == 200
    st_rb, _, rbody, _ = fetch("https://labienveillance.fr/robots.txt")
    has_sitemap_line = "sitemap" in rbody.lower() if st_rb == 200 else False
    print(f"  Home canonical present    : {has_canon}")
    print(f"  Home meta robots present  : {has_robots_meta}")
    print(f"  GTM charge (snippet)      : {has_gtm}")
    print(f"  JSON-LD Yoast / schema    : {has_schema}")
    print(f"  og:image URL              : {(og_url[:72] + '...') if len(og_url) > 75 else (og_url or '(none)')}")
    print(f"  og:image HTTP             : {'200 OK' if og_ok else 'FAIL'}")
    print(f"  robots.txt + Sitemap URL  : HTTP {st_rb}, sitemap line={has_sitemap_line}")


if __name__ == "__main__":
    main()
