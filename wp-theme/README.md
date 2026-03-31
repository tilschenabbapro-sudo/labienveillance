# Thème WordPress « La Bienveillance »

## Installation

1. Copier le dossier `labienveillance` dans `wp-content/themes/` du site (FTP / SSH / panneau).
2. Dans **Réglages → Général**, vérifier l’URL du site (HTTPS).
3. **Réglages → Permaliens** : enregistrer (structure avec nom de l’article recommandée).
4. **Apparence → Thèmes** : activer **La Bienveillance**.
5. **Pages** : créer les pages avec les slugs exacts :
   - `monte-escaliers`, `salle-de-bain`, `amenagements`, `conseils`, `aides-financieres`, `contact`, `mentions-legales`
6. **Devis estimatif JLM** (ex-[page Elementor](https://labienveillance.fr/elementor-1985/)) :
   - **Page « pleine page »** (menu, etc.) : créer une page (ex. slug `devis-estimatif`), modèle **« Devis estimatif monte-escalier (JLM) »**.
   - **Embed pour iframe** (accueil / Monte-escaliers, sans header ni pied du site) : créer une page (ex. slug `embed-devis`), modèle **« Embed — Devis JLM seul »**. L’accueil du thème détecte automatiquement cette page ; sinon il utilise `/devis-embed.html` à la racine (copier depuis la maquette avec `js/jlm-lite-devis.js`).
   - Filtre PHP `labienveillance_devis_iframe_url` pour forcer une URL précise si besoin.
   - Conserver les actions AJAX `jlm_get_config` et `jlm_save_config` (plugin ou code existant).
   - **Redirection 301** : `/elementor-1985/` → l’URL d’embed ou de page devis retenue.
7. **Réglages → Lecture** : page d’accueil = **Une page statique**, choisir la page d’accueil (souvent « Accueil » — le contenu réel est fourni par `front-page.php` ; le corps de cette page WP peut rester vide).
8. **Apparence → Menus** : créer un menu et l’affecter à l’emplacement « Menu principal » (sinon le thème utilise le menu de secours déjà structuré). Pour retrouver la maquette : regrouper **Monte-escaliers**, **Salle de bain** et **Aménagements** sous un parent **Nos services** (lien personnalisé `#` ou URL vide) ; WordPress génère le sous-menu avec la classe `sub-menu` (comportement au survol / mobile géré par le thème).

## Contenu

- L’accueil reprend la maquette (`template-parts/home-front.php`).
- Les autres pages utilisent `page.php` : coller le HTML de la maquette dans l’éditeur ou créer des modèles de page dédiés plus tard.

## Assets

Les fichiers `assets/css/style.css`, `assets/js/main.js` et `assets/img/` sont une **copie** de la maquette ; lors d’une maj design, mettre à jour la maquette puis recopier ou synchroniser.

## Numéro affiché

Filtre `labienveillance_phone_display` (voir `header.php` / `footer.php`) pour centraliser le numéro une fois le vrai indicatif connu.
