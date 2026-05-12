# Extraction de l'outil de devis estimatif — La Bienveillance

> **Source :** `https://labienveillance.fr/?page_id=2016` (WordPress de production du client)
> **Date d'extraction :** 8 mai 2026
> **Mainteneur du dossier :** ce dossier est destiné à archiver une copie figée de l'outil
> tel qu'il tourne en prod, et à permettre de le rejouer **sans dépendance WordPress**.

### Mise à jour 11 mai 2026 — page WP brouillon « Titi 1 » (`page_id=2577`)

La **maquette statique** (`monte-escaliers.html`, `devis-embed.html`, iframe studio) utilise désormais :

| Fichier | Rôle |
|---|---|
| `jlm-lite-devis-titi1-from-wp.js` | Widget **byte-for-byte** extrait du rendu Elementor (HTML widget) de la page brouillon *Titi 1* — modales « Conseils », `nbMarches` / longueur estimée, styles injectés dans `#jlmLiteAppRoot`. |
| `jlm-config-titi1-inline.js` | Snapshot `jlm_get_config` (prod) au moment de l’extraction — même structure que attendu par le widget. |

Les fichiers `jlm-lite-devis-from-wp.js` / `jlm-config-inline.js` restent comme archive de l’extraction du 8 mai (page_id 2016).

---

## 1. Constat — Où est l'outil de devis sur le WordPress du client ?

Contrairement à ce qui peut sembler à première vue, l'outil de devis **n'est pas un widget tiers
externe**. C'est un widget « maison » :

| Élément | Détail |
|---|---|
| Nom interne | `JLM Lite Devis` (variable racine `jlmLiteAppRoot`) |
| Page WP | `https://labienveillance.fr/?page_id=2016` (slug "Devis estimatif monte escalier") |
| Intégration | **Inline** dans un widget Elementor `html.default` (id `55d6b59`) — HTML + JS + CSS dans la même balise `<script>` (~1 124 lignes JS et ~140 lignes CSS injectées par `document.createElement("style")`) |
| Persistance | Deux endpoints AJAX WordPress : `GET /wp-admin/admin-ajax.php?action=jlm_get_config` et `POST .../action=jlm_save_config` |
| Plugin associé | Plugin custom **non** présent dans `wp-theme/labienveillance/` du repo (à demander au client / ancien intégrateur) |
| Code admin | `Loli424720` — déclenche le back-office complet (raccourci `Ctrl + Alt + A`) |
| Devis salle de bain (douche) | Page WP `?page_id=2539` actuellement **404 publique**, mais le bootstrap `jlm-douche-bootstrap-v2` (variable `JLM_DOUCHE_WP`) est encore enqueué — outil en cours de développement |

**Différences avec la version `js/jlm-lite-devis.js` du repo (25/03/2026, 870 lignes) :**

1. Code admin allongé : `Loli424720` (vs `424720`).
2. **Système de commentaires/conseils en modale** : sur chaque étape, si `cfg.comments[step]`
   est rempli, un bouton « ✦ Conseils » apparaît et ouvre une grande modale stylisée
   (classes `commentToggle`, `commentModalOverlay`, `commentModal`).
3. Échappement par `Esc` qui ferme la modale conseils ET le back-office.
4. Police `Arial, Helvetica, sans-serif` (palette inchangée).
5. ~250 lignes JS et ~60 lignes CSS supplémentaires.

➡️ La version déployée en prod est **plus récente** que celle du repo. Avant tout merge,
vérifier avec le client/le développeur original pour ne rien régresser.

---

## 2. Contenu du dossier

| Fichier | Rôle |
|---|---|
| `jlm-config-from-wp.json` | Réponse brute (15 Ko) de `GET /wp-admin/admin-ajax.php?action=jlm_get_config` au moment de l'extraction. Contient prix, commentaires et URLs d'images pour les **deux** outils (monte-escalier *et* salle de bain). |
| `jlm-lite-devis-from-wp.js` | Script JS du widget extrait propre (commentaires d'origine + en-tête expliquant les diffs). Réutilisable côté WordPress (à enregistrer dans Elementor / le thème) ou en standalone. |
| `jlm-config-inline.js` | Le même JSON, encapsulé dans `window.JLM_CONFIG_INJECTED` pour pouvoir être chargé sans backend AJAX. |
| `jlm-monte-escalier-standalone.html` | Page autonome qui charge le widget + la config figée + un mock `fetch` qui intercepte les appels admin-ajax. Aucune dépendance externe (à part les images CDN du WordPress prod). |
| `README.md` | Ce fichier. |

---

## 3. Comment ouvrir la copie autonome ?

```bash
# depuis la racine du repo
python -m http.server 8765 --directory migration-wp/devis-tool-extracted
```

Puis dans le navigateur : http://localhost:8765/jlm-monte-escalier-standalone.html

Le double-clic direct sur le fichier `.html` **ne marchera pas** parce que les modules JS
externes (`jlm-config-inline.js`, `jlm-lite-devis-from-wp.js`) sont bloqués par CORS sur
`file://`. Un mini serveur HTTP local (Python, Node `http-server`, l'extension *Live Server*
de VS Code, etc.) suffit.

### Accéder au back-office complet

1. Ouvrir la page autonome (ou la version WP en étant connecté admin)
2. `Ctrl + Alt + A`
3. Saisir le code `Loli424720`
4. Le panneau admin s'ouvre — modifier prix, commentaires, URLs d'images
5. Bouton « Enregistrer » :
   - Sur la page autonome → simulé en local (pas persistant après refresh)
   - Sur le WordPress prod → POST vers `jlm_save_config` (réservé admin authentifié)

### Note sur la config

⚠️ Le commentaire `home` dans la config WP actuelle parle de **salle de bain** (« remplacer
votre baignoire par une douche ») alors qu'il est affiché sur la page d'accueil de l'outil
**monte-escalier**. C'est probablement un bug d'éditorialisation côté client — à corriger via
le back-office (`Ctrl + Alt + A` → onglet Commentaires → champ « Accueil »).

---

## 4. Que faire pour aligner le repo et la prod ?

Trois options selon ce que vous voulez livrer :

### Option A — Synchroniser le repo avec la prod (recommandé pour la migration)

1. Remplacer `js/jlm-lite-devis.js` (et son jumeau `wp-theme/labienveillance/assets/js/jlm-lite-devis.js`) par `migration-wp/devis-tool-extracted/jlm-lite-devis-from-wp.js`.
2. Vérifier que le thème WP (`wp-theme/labienveillance/functions.php`) charge bien le script — déjà OK (`labienveillance_should_load_jlm_devis()`).
3. Ajouter au thème (ou à un plugin custom à part) l'enregistrement des deux endpoints AJAX `jlm_get_config` / `jlm_save_config` (actuellement absents du repo). Voir `migration-wp/mu-plugin-labienveillance-config.php` qui semble déjà être un mu-plugin de configuration — à compléter.

### Option B — Conserver l'inline dans Elementor

1. Garder l'intégration Elementor existante (widget `html.default`).
2. Si modification : éditer la page Elementor et coller le contenu de `jlm-lite-devis-from-wp.js` (sans le wrapper `<script>`) à la place de l'ancien.

### Option C — Iframe vers la copie autonome

Si l'intégration WP devient un point de friction, on peut héberger la page `jlm-monte-escalier-standalone.html` sur un sous-domaine (ou GitHub Pages) et l'iframer dans WordPress avec :

```html
<iframe src="https://devis.labienveillance.fr/" style="border:0;width:100%;height:1100px"></iframe>
```

⚠️ Cette option nécessite de stocker la config quelque part (le mock fetch local ne persiste pas) — il faudrait alors un mini backend (Cloudflare Worker / Netlify Function) pour `jlm_save_config`.

---

## 5. À demander au client / aux anciens intégrateurs

- **Code source du plugin custom** qui expose `jlm_get_config` / `jlm_save_config` (et le pendant `jlm_save_config_douche` / `JLM_DOUCHE_WP` pour la salle de bain).
- État du **devis salle de bain** (`page_id=2539`) : il y a déjà des prix et commentaires dans la config (`prixBase: 4790`, `habillageMursM2: 120`, etc.), mais le widget HTML n'est pas encore visible publiquement.
- Confirmation que le code admin `Loli424720` peut être rotaté (il est en clair dans le JS public).

---

## 6. Inventaire des images

Les images sont hébergées sur deux domaines :

- `laseptiemecom.wpcomstaging.com` (ancien staging mutualisé) — pour le monte-escalier
- `labienveillance.fr/wp-content/uploads/` — pour la salle de bain

➡️ Action recommandée pour la migration : **rapatrier toutes les images de `laseptiemecom.wpcomstaging.com`
sur `labienveillance.fr`** afin que l'outil ne dépende plus du staging d'un tiers.

Liste complète : voir `jlm-config-from-wp.json` → champ `data.images.*.url`.
