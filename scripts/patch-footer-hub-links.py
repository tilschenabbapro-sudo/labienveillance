from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
needle = """        <p class="footer__desc">
          Nous vous accompagnons dans l'aménagement de votre maison pour qu'elle reste un lieu de confort et de sécurité,
          à chaque étape de la vie.
        </p>"""
extra = """
        <p class="footer__hub-links">
          <a href="index.html#nos-engagements">Nos quatre engagements</a>
          <span class="footer__hub-links-sep" aria-hidden="true"> · </span>
          <a href="index.html#solutions-quotidien">Solutions du quotidien</a>
          <span class="footer__hub-links-sep" aria-hidden="true"> · </span>
          <a href="index.html#resume-aides-financieres">Aperçu des aides</a>
        </p>"""
repl = needle + extra

for p in ROOT.glob("*.html"):
    if p.name == "index.html":
        continue
    t = p.read_text(encoding="utf-8")
    if "footer__hub-links" in t or needle not in t:
        continue
    p.write_text(t.replace(needle, repl, 1), encoding="utf-8")
    print("patched", p.name)
