# Thème WordPress « La Bienveillance »

> **Périmètre du lancement** : téléphone + e-mail + formulaire (Contact Form 7).
> **Calendly est hors périmètre** mais le filtre `labienveillance_calendly_url` est en place : ajout sans redéploiement post-lancement.

## Installation

1. Copier le dossier `labienveillance` dans `wp-content/themes/` du site (FTP / SSH / panneau).
2. Dans **Réglages → Général**, vérifier l’URL du site (HTTPS).
3. **Réglages → Permaliens** : structure **« Nom de l’article »** (`/%postname%/`) **fortement recommandée** ; les modèles utilisent `home_url('/{slug}/')`.
4. **Apparence → Thèmes** : activer **La Bienveillance**.
5. **Pages** : créer les pages avec **les slugs exacts** ci-dessous. Chaque slug déclenche automatiquement son modèle `page-{slug}.php` (la métabox « Modèle » de la sidebar n’a pas besoin d’être touchée) :
   - `monte-escaliers`         → `page-monte-escaliers.php`
   - `salle-de-bain`           → `page-salle-de-bain.php`
   - `amenagements`            → `page-amenagements.php`
   - `conseils`                → `page-conseils.php`
   - `aides-financieres`       → `page-aides-financieres.php`
   - `contact`                 → `page-contact.php`
   - `mentions-legales`        → `page-mentions-legales.php`

   Le **contenu Gutenberg/classique de ces pages WP peut rester vide** : tout le rendu est servi par les modèles.

   > **Parrainage** : le programme est reporté après le go-live. La page WP `parrainage` n'est donc **pas** créée, le lien a été retiré du footer, et l'URL `/parrainage.html` redirige vers la home. Le modèle `page-parrainage.php` reste disponible pour quand le contenu sera prêt — voir `migration-wp/redirections-wp.md` § 4.5.
6. **Devis estimatif JLM** (ex-[page Elementor](https://labienveillance.fr/elementor-1985/)) :
   - **Page « pleine page »** (avec menu, footer, etc.) : créer une page (slug suggéré `devis-estimatif`), modèle **« Devis estimatif monte-escalier (JLM) »**.
   - **Embed pour iframe** (intégrée dans la page Monte-escaliers, sans header ni pied du site) : créer une page (slug suggéré `embed-devis`), modèle **« Embed — Devis JLM seul »**. La page Monte-escaliers détecte automatiquement cette page ; sinon elle utilise `/devis-embed.html` à la racine (à copier depuis la maquette avec `js/jlm-lite-devis.js`).
   - Filtre PHP `labienveillance_devis_iframe_url` pour forcer une URL précise.
   - Filtre PHP `labienveillance_devis_sdb_url` pour pointer vers un futur configurateur **salle de bain** (par défaut on retombe sur le devis JLM, le temps que l’outil sdb existe).
   - Conserver les actions AJAX `jlm_get_config` / `jlm_save_config` (plugin ou code existant).
   - **Redirection 301** : `/elementor-1985/` → l’URL d’embed ou de page devis retenue (voir [`migration-wp/redirections-wp.csv`](../migration-wp/redirections-wp.csv) à la racine du dépôt).
7. **Réglages → Lecture** : page d’accueil = **Une page statique**, choisir la page « Accueil » (le contenu réel est fourni par `front-page.php` ; le corps WP peut rester vide).
8. **Apparence → Menus** : créer un menu et l’affecter à l’emplacement « Menu principal » (sinon le thème utilise le menu de secours déjà structuré). Pour retrouver la maquette : regrouper **Monte-escaliers**, **Salle de bain** et **Aménagements** sous un parent **Nos services** (lien personnalisé `#` ou URL vide) ; WordPress génère le sous-menu avec la classe `sub-menu` (comportement au survol / mobile géré par le thème).

## Modèles inclus

```
labienveillance/
├── style.css                       (entête WP)
├── functions.php                   (enqueue, GTM, menus, robots noindex pages secondaires)
├── header.php                      (logo, nav, theme-toggle, CTA)
├── footer.php                      (liens, contact, mentions)
├── front-page.php                  (accueil — utilise template-parts/home-front.php)
├── page.php                        (fallback : hero--page + contenu WP)
├── 404.php                         (page erreur cohérente avec le design)
├── index.php                       (liste de secours)
├── page-monte-escaliers.php        (page service Monte-escaliers + iframe devis JLM)
├── page-salle-de-bain.php          (page service Salle de bain + section devis sdb)
├── page-amenagements.php           (page service Aménagements + domotique)
├── page-conseils.php               (guide + nutrition + Zinzino)
├── page-aides-financieres.php     (6 fiches aides + accompagnement + FAQ)
├── page-contact.php                (formulaire CF7 ou fallback statique + infos contact + engagements ; Calendly conditionnel)
├── page-mentions-legales.php       (RGPD + cookies, sans mentions LCEN tant que les infos client ne sont pas fournies)
├── page-parrainage.php             (placeholder « en construction » — non actif au go-live)
├── page-devis-monte-escalier.php   (page « pleine page » avec menu, pour le devis JLM)
└── page-embed-devis-jlm.php        (modèle minimal sans header/footer pour iframe)
```

## Filtres PHP exposés (centralisation des paramètres clients)

| Filtre | Valeur retournée | Effet |
|---|---|---|
| `labienveillance_phone_display` | `'03 25 31 13 60'` | Numéro affiché (header, footer, CTA) |
| `labienveillance_phone_href`    | `'tel:+33325311360'` | Lien `tel:` correspondant |
| `labienveillance_contact_email` | `'contact@labienveillance.fr'` | E-mail public (footer + page contact + mentions) |
| `labienveillance_contact_shortcode` | `''` (vide) | Si renseigné (`[contact-form-7 id="…"]` ou autre), remplace le formulaire HTML statique de la page contact (recommandé pour la prod). Sans valeur, fallback maquette + JS de simulation. |
| `labienveillance_calendly_url`  | `''` (vide) | **Hors périmètre lancement** — si renseigné, charge `widget.css` / `widget.js` Calendly et intègre le widget inline sur `page-contact.php`. Sinon, aucun script Calendly n’est servi. |
| `labienveillance_devis_iframe_url`  | `null` | Force l’URL d’iframe utilisée par le devis JLM monte-escalier |
| `labienveillance_jlm_images`        | `array(27 URLs)` | **Outil devis monte-escalier** — URLs absolues des 27 illustrations. Défauts pointent vers `assets/img/devis-monte-escalier/`. Surcharger pour pointer vers la médiathèque WP quand le client envoie ses propres photos. Voir `labienveillance_jlm_image_urls()` dans `functions.php`. |
| `labienveillance_devis_sdb_config`  | `array(…)` | **Configurateur salle de bain natif** (cf. § dédié plus bas) — surcharge prix, photos, conseils. Toutes les clés sont optionnelles, défauts dans `assets/js/devis-sdb.js`. |
| `labienveillance_devis_sdb_url`     | _(déprécié)_ | Ancien filtre du temps où la sdb était une iframe. Plus utilisé depuis l’intégration directe ; conservé inerte pour rétrocompatibilité. |
| `labienveillance_gtm_container_id`  | `'GTM-NZVHPJ3Z'` | Renvoyer `''` pour désactiver GTM |

Un **mu-plugin de production prêt à l’emploi** est livré dans [`migration-wp/mu-plugin-labienveillance-config.php`](../migration-wp/mu-plugin-labienveillance-config.php). Le déposer dans `wp-content/mu-plugins/` et y reporter l’ID du formulaire CF7. Il pré-câble les filtres `labienveillance_phone_display`, `labienveillance_phone_href`, `labienveillance_contact_email` (`contact@labienveillance.fr` confirmé), `labienveillance_contact_shortcode`, `labienveillance_calendly_url`, ainsi que `wp_mail_from` / `wp_mail_from_name` (délivrabilité).

Exemple d’activation **lancement = Contact Form 7 seul** (ce que fait le mu-plugin) :

```php
add_filter( 'labienveillance_contact_shortcode', function () {
    return '[contact-form-7 id="42" title="Contact La Bienveillance"]';
} );
```

Exemple d’**activation Calendly post-lancement**, sans toucher au code du thème :

```php
add_filter( 'labienveillance_calendly_url', function () {
    return 'https://calendly.com/labienveillance/rdv';
} );
```

## Contact Form 7 — gabarits prêts à coller

Tout le contenu du formulaire de contact (champs, e-mail admin, accusé visiteur, messages FR, anti-spam Honeypot, procédure SMTP) est livré dans [`migration-wp/cf7/`](../migration-wp/cf7/). Procédure complète : [`migration-wp/cf7/README.md`](../migration-wp/cf7/README.md). Compter ~5 minutes pour recréer le formulaire en prod, puis reporter son ID dans le mu-plugin.

## Configurateur devis salle de bain — intégré directement (pas d’iframe)

La page **Salle de bain** embarque un configurateur multi-étapes (23 écrans — l’étape « Meubles de salle de bain » a été retirée le 11 mai 2026 car hors périmètre métier du client) qui produit une estimation chiffrée et la transmet au formulaire de contact via querystrings.

### Architecture

| Fichier | Rôle |
|---|---|
| `assets/css/devis-sdb.css` | Styles, calés sur les tokens du thème (mode sombre supporté) |
| `assets/js/devis-sdb.js` | Logique : étapes, validation, calcul, persistance localStorage, pictogrammes SVG inline |
| `assets/js/contact-prefill.js` | Lit `?projet=devis-sdb&total=…&recap=…` sur `/contact/` et pré-remplit les champs `sujet` / `message` (CF7 ou fallback) |
| `template-parts/devis-sdb.php` | Markup minimal injecté dans `page-salle-de-bain.php` |
| `functions.php` | Enqueue conditionnel + injection de `window.LBV_DEVIS_SDB` via filtre |

### Pourquoi pas d’iframe

- Indexable, accessible et responsive natif.
- Cohérent avec le design system (variables CSS du thème, mode sombre auto).
- Pré-remplissage CF7 possible parce qu’on partage la même origine et le même DOM que la page `/contact/`.
- Aucune dépendance image externe (pictogrammes SVG inline).

### Hand-off vers Contact Form 7

À la dernière étape du configurateur, un bouton « Envoyer mon projet à La Bienveillance » renvoie vers&nbsp;:

```
/contact/?projet=devis-sdb&total=12345&recap=Fenêtre%3Anon%0AImplantation%3A...
```

Le script `contact-prefill.js` (chargé sur la page contact) lit ces paramètres et&nbsp;:

1. Sélectionne automatiquement « Salle de bain » dans le `select[name="sujet"]` (qu’il s’agisse du select CF7 ou du fallback statique).
2. Remplit le `textarea[name="message"]` avec un texte structuré : intro + estimation TTC + récap des choix.
3. Surligne brièvement les champs préremplis et scrolle au formulaire.

Aucune modification du gabarit CF7 n’est nécessaire — les noms `sujet` / `message` sont partagés.

### Personnaliser prix, photos, conseils

Toutes les valeurs sont surchargeables depuis le mu-plugin de production via le filtre `labienveillance_devis_sdb_config`. Bloc d’exemple commenté déjà présent dans [`migration-wp/mu-plugin-labienveillance-config.php`](../migration-wp/mu-plugin-labienveillance-config.php) — il suffit de retirer les `//` au fur et à mesure que les valeurs réelles arrivent.

```php
add_filter( 'labienveillance_devis_sdb_config', function ( $cfg ) {
    $cfg['prices']['solAntiderapant']   = 990;
    $cfg['photos']['avant_1']           = 'https://labienveillance.fr/wp-content/uploads/sdb/avant-1.jpg';
    $cfg['hints']['fenetre']            = 'Texte personnalisé du conseiller…';
    return $cfg;
} );
```

Si aucune URL n'est renseignée pour une clé donnée, l'emplacement affiche un fond uni neutre (sans texte, pour rester customer-ready). Les valeurs par défaut livrées avec le thème pointent vers les visuels du dossier `assets/img/sdb/` ; les surcharger via le filtre permet d'utiliser des photos hébergées dans la médiathèque WP.

### Persistance utilisateur

L’état est sauvegardé dans `localStorage` (clé `labienveillance_devis_sdb_v1`, expiration 30 jours). Au rechargement, un bandeau propose de reprendre ou de recommencer. Aucune information ne quitte le navigateur tant que l’utilisateur n’envoie pas son projet.

### Accessibilité

- Boutons de choix avec `aria-pressed` / `aria-modal` pour la modale conseils.
- Champ progressbar avec `aria-valuemin/max/now`.
- Focus visible (`outline` sur tous les éléments interactifs), navigation clavier complète.
- Respecte `prefers-reduced-motion`.

## Contenu

- L’accueil reprend la maquette (`template-parts/home-front.php`).
- Les pages services / contact / mentions utilisent leur **modèle dédié** (`page-{slug}.php`) — il n’est pas nécessaire de saisir du contenu côté WP.
- Pour modifier un texte, **éditer le PHP du modèle** (recommandé tant que le client n’est pas autonome) ou **migrer le contenu vers Gutenberg** + `the_content()` page par page (effort plus important, à planifier après la mise en ligne).

## Assets

Les fichiers `assets/css/style.css`, `assets/js/main.js`, `assets/js/devis-choice.js`, `assets/js/jlm-lite-devis.js`, `assets/js/theme-init.js` et `assets/img/` sont une **copie** de la maquette ; lors d’une mise à jour design, mettre à jour la maquette puis recopier ou synchroniser.

## SEO

- Voir [`migration-wp/yoast-config.md`](../migration-wp/yoast-config.md)&nbsp;: titres SEO, méta descriptions, canoniques, OG, schema page par page (à recopier dans Yoast en production).
- La page `mentions-legales` reçoit automatiquement un `noindex, follow, noarchive` via `wp_robots` (filtre `labienveillance_robots_noindex` dans `functions.php`). La règle couvre aussi `parrainage` à titre défensif si la page était publiée un jour.
- Si Yoast est actif, **Yoast prime** : configurer dans la métabox « Avancé » de chaque page concernée pour rester cohérent.

## Redirections 301

- Voir [`migration-wp/redirections-wp.csv`](../migration-wp/redirections-wp.csv) (à importer dans le plugin **Redirection**) et [`migration-wp/redirections-wp.md`](../migration-wp/redirections-wp.md) pour la procédure et les pièges (`/wp-admin/*`, `/wp-content/*` à **ne pas** redériger).

## Numéro / e-mail / logo

- **Logo** : déjà intégré (`assets/img/logo-la-bienveillance.png`, 199×110 px) — le rendu utilise `.header__logo-img--full { height: 2.35rem; width: auto }`.
- **Numéro / e-mail** : centraliser via les filtres ci-dessus. Aucun numéro / e-mail en dur à modifier dans plusieurs fichiers.
