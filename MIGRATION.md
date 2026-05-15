# LA BIENVEILLANCE — Étapes finales & Plan de migration

> Dernière mise à jour : 11 mai 2026
> **Cible de mise en production :** intégration du nouveau site sur **l’hébergement actuel**, dans **WordPress** (pas un remplacement « tout statique » à la racine). Le dossier `labienveillance/` (HTML/CSS/JS) sert de **référence design + contenu** à transposer en thème / pages WP.
>
> **Statut customer-ready** : aucun champ « à compléter » n’est visible côté visiteur. Mentions légales réduites à la confidentialité + cookies (les mentions LCEN société/SIRET/hébergeur restent à ajouter dès que les infos officielles seront fournies — obligation légale française). Page Parrainage différée. **Configurateur Salle de bain** : étape « Meubles de salle de bain » retirée à la demande du client (hors métier). **Outil devis monte-escalier** : 27 illustrations rapatriées depuis le staging WP.com → hébergement local dans le thème, l’outil est désormais 100 % autonome (aucune dépendance externe). Set d’images complet en place (55 fichiers, ~7 Mo après optimisation).

## Ressources prêtes pour la prod WP

| Ressource | Chemin | Rôle |
|---|---|---|
| Thème WordPress | [`wp-theme/labienveillance/`](wp-theme/labienveillance/) | Thème actif sur l’hébergement client : header/footer, accueil, **9 modèles `page-{slug}.php`**, 404, devis JLM. Filtres clients : téléphone, e-mail, Calendly, shortcode CF7, devis. |
| README thème | [`wp-theme/README.md`](wp-theme/README.md) | Procédure d’installation + slugs requis + table des filtres |
| Redirections 301 | [`migration-wp/redirections-wp.csv`](migration-wp/redirections-wp.csv) | À importer dans le plugin Redirection |
| Doc redirections | [`migration-wp/redirections-wp.md`](migration-wp/redirections-wp.md) | Procédure import + pièges (`/wp-admin` à ne pas casser) |
| Config Yoast SEO | [`migration-wp/yoast-config.md`](migration-wp/yoast-config.md) | Titres / méta / canonical / OG / schema page par page |
| Formulaire CF7 (gabarits) | [`migration-wp/cf7/`](migration-wp/cf7/) | Gabarit du formulaire + e-mail admin + accusé visiteur + messages FR + procédure d’installation (Honeypot, SMTP, Flamingo) |
| Mu-plugin de prod | [`migration-wp/mu-plugin-labienveillance-config.php`](migration-wp/mu-plugin-labienveillance-config.php) | Fichier unique à déposer dans `wp-content/mu-plugins/` : centralise tous les filtres clients (téléphone, e-mail, ID CF7, Calendly, GTM, From e-mail, **prix / photos / conseils du configurateur sdb**) |
| Configurateur Devis SdB | `wp-theme/labienveillance/assets/{css,js}/devis-sdb.{css,js}` + `template-parts/devis-sdb.php` | **Configurateur 23 étapes intégré** dans la page Salle de bain (pas d’iframe, pictogrammes SVG inline, persistance localStorage, hand-off CF7). Surcharges via filtre `labienveillance_devis_sdb_config` (cf. mu-plugin). Voir détails dans `wp-theme/README.md`. |
| Outil devis monte-escalier | `wp-theme/labienveillance/assets/js/jlm-lite-devis.js` + `page-embed-devis-jlm.php` + 27 photos dans `assets/img/devis-monte-escalier/` | **Devis estimatif monte-escalier** chargé en iframe (modèle « Embed — Devis JLM seul »). Photos rapatriées en local, surchargeables via filtre `labienveillance_jlm_images` (cf. `labienveillance_jlm_image_urls()` dans `functions.php`). UI admin frontend désactivée (`ADMIN_CODE = null`). |

---

## PARTIE A : Informations à fournir par le client

### A1. OBLIGATOIRE (bloque la mise en ligne)

| # | Information | État | Détail |
|---|-------------|------|--------|
| 1 | **Numéro de téléphone** | ✅ | `03 25 31 13 60` |
| 2 | **Logo** | ✅ | PNG livré (199×110), intégré dans `img/logo-la-bienveillance.png` et `wp-theme/.../assets/img/logo-la-bienveillance.png`. Affiché dans le header (`.header__logo-img--full`) à hauteur 2.35rem auto. |
| 3 | **Formulaire de contact** | ✅ Prêt à coller en prod | Gabarit Contact Form 7 livré dans [`migration-wp/cf7/`](migration-wp/cf7/) (formulaire + 2 e-mails — admin & accusé visiteur — + messages FR + anti-spam Honeypot + procédure SMTP). Reste : installer CF7 + Honeypot for CF7, créer le formulaire (5 min), reporter l'ID dans le mu-plugin. Branchement automatique côté thème via `labienveillance_contact_shortcode`. |
| 4 | **Email de réception** | ✅ | `contact@labienveillance.fr` — confirmé client le 8 mai 2026, pré-câblé dans [`mu-plugin-labienveillance-config.php`](migration-wp/mu-plugin-labienveillance-config.php). |

> **Calendly et prise de RDV en ligne sont retirés du périmètre du lancement** : on part en production avec **téléphone + e-mail + formulaire** uniquement (cf. § A2 plus bas pour l’ajout post-lancement).

### A2. RECOMMANDÉ (améliore la qualité, peut être livré après le lancement)

| # | Information | État |
|---|-------------|------|
| 5 | **Photos réelles** de réalisations (monte-escaliers installés, salles de bain avant/après) | ✅ Set complet livré : (a) 11 photos IA cohérentes pour le configurateur SDB (`img/sdb/*.jpg`) — style « vraie maison française rénovée intelligemment » validé client le 11 mai 2026 ; (b) 27 photos rapatriées depuis le staging WP.com pour l’outil monte-escalier (`img/devis-monte-escalier/*`) — vraies photos de chantier déjà utilisées par le client + 1 photo IA pour combler un 404 (`depart-pivot-180.jpg`). À remplacer par des photos de chantiers récents au fil du temps via les filtres `labienveillance_devis_sdb_config` (SDB) et `labienveillance_jlm_images` (monte-escalier) — pas de redéploiement nécessaire. |
| 6 | **Adresse postale** exacte (si affichage souhaité) | ❌ Manquant — non affichée sur le site tant que non fournie (pas de placeholder visible). |
| 7 | **Horaires d'ouverture** à confirmer (actuellement "Lun-Ven 9h-18h") | ⚠️ À confirmer |
| 8 | **Zone géographique** exacte (actuellement "Épinal et les Vosges") | ⚠️ À confirmer |
| 9 | **2-3 témoignages clients** réels avec prénom + ville | ⚠️ Optionnel |
| 10 | **Favicon** PNG 32×32 + apple-touch 180×180 | ⚠️ Placeholder SVG en place (`img/favicon.svg`) ; PNG/apple-touch optionnels jusqu’au branding final |
| 11 | **ID Google Tag Manager** | ✅ `GTM-NZVHPJ3Z` (configurable via `labienveillance_gtm_container_id`) |
| 12 | **OG Image** pour partage social (1200×630 px) | ✅ Fait — `og-labienveillance.jpg` (1200×630, 73 Ko) généré et placé dans `img/` et `wp-theme/.../assets/img/`. À référencer dans Yoast → Réglages → Représentation du site. |
| 13 | **Compte Calendly** — prise de RDV en ligne | ❌ **Hors lancement** — branchement prévu via le filtre `labienveillance_calendly_url` ; à activer plus tard sans toucher au code (voir § A3) |
| 14 | **Mentions légales société** (raison sociale, forme juridique, capital, SIRET, hébergeur, directeur de publication) | ⚠️ Obligatoires LCEN — non affichées tant que non fournies. La page `mentions-legales` est en version « politique de confidentialité + cookies » uniquement, juridiquement viable telle quelle (RGPD), mais doit être complétée des mentions LCEN dès que possible. |

### A3. Questions en suspens

| # | Question |
|---|---------|
| Q1 | Le guide « Bien vieillir chez soi » est-il un PDF téléchargeable ? Si oui, fournir le fichier |
| Q2 | Le partenariat Zinzino est-il actif ? Faut-il un lien affilié ou une landing page dédiée ? |
| Q3 | Y a-t-il des certifications/labels à afficher (Qualibat, RGE, etc.) ? |
| Q4 | Le set d’images IA est-il définitivement validé, ou le client souhaite-t-il à terme le remplacer par des photos de chantiers réels ? Si oui, lesquelles en priorité ? |
| Q5 | Faut-il conserver le lien vers l'outil de devis immédiat (`/monte-escaliers/monte-escalier.html`) visible sur l'ancien site ? Si oui, fournir l'URL ou le formulaire tiers |
| Q5b | **Configurateur salle de bain** — photos désormais ✅ livrées (11 visuels cohérents, étape « Meubles » retirée à la demande du client le 11 mai 2026 car hors périmètre). Reste à valider avec le client : **prix officiels** des prestations (le JS embarque des défauts raisonnables) et **conseils texte personnalisés** par étape (sinon, défauts génériques). Surcharge sans redéploiement via le filtre `labienveillance_devis_sdb_config` (cf. mu-plugin). |
| Q5c | **Outil devis monte-escalier** — 27 illustrations désormais hébergées localement (`wp-theme/labienveillance/assets/img/devis-monte-escalier/`), plus de dépendance vers `laseptiemecom.wpcomstaging.com`. URLs injectées via filtre `labienveillance_jlm_images` (cf. `functions.php → labienveillance_jlm_image_urls()`). Prix et marques (Up Stairlift / Acorn) restent éditables côté JS (`prices.up.droit.base` etc.) ; pas d’UI d’admin frontend exposée — la constante `ADMIN_CODE` est désactivée en production. |
| Q6 | **Calendly** — quand le client souhaite-t-il l’activer ? L’ajout après lancement consiste à&nbsp;: créer le compte, fournir l’URL, ajouter un mu-plugin d’une ligne (`add_filter('labienveillance_calendly_url', fn() => 'https://calendly.com/…')`). Aucune sortie de prod ni redéploiement nécessaire. |
| Q7 | **Mentions légales société** (LCEN) — quand le client peut-il fournir raison sociale exacte, forme juridique, capital, SIRET, adresse, directeur de publication, et hébergeur ? Tant que ces infos manquent, la page Mentions légales reste limitée à la politique de confidentialité + cookies (pas de placeholder visible, mais obligation légale non couverte intégralement). |
| Q8 | **Parrainage** — quand le contenu du programme sera-t-il prêt ? Le modèle de page existe (`page-parrainage.php`) mais la page WP n’est pas publiée et le lien a été retiré du footer pour le go-live. Procédure de réactivation documentée dans `migration-wp/redirections-wp.md` § 4.5. |

---

## PARTIE B : Tâches techniques — État d'avancement

> Le bloc **B1** décrit la **maquette statique** du dépôt (utile à la recette visuelle et au copier-coller de contenu). La **livraison client** prévue est une **intégration WordPress** (partie **B4** + **C**).

### B1. TERMINÉ — Maquette statique (référence)

| # | Tâche | Fichier(s) créé(s) | Statut |
|---|-------|--------------------|--------|
| 1 | `robots.txt` | `robots.txt` | ✅ Fait |
| 2 | `sitemap.xml` (7 URLs, mentions-legales exclue) | `sitemap.xml` | ✅ Fait |
| 3 | Redirections 301 Apache | `.htaccess` | ✅ Fait |
| 4 | Redirections 301 Netlify | `_redirects` | ✅ Fait |
| 5 | Page 404 personnalisée (design cohérent + liens services) | `404.html` | ✅ Fait |
| 6 | Compression images (1.5 Mo → 75-200 Ko, -92 à 94%) | 13 fichiers `img/*.jpg` | ✅ Fait |
| 6b | 2e passe : recompression maquette + thème + nouveau set SDB + OG dédiée via `scripts/optimize-images.py` (Pillow ; max 1600px, quality 82, OG 1200×630 quality 85). Conversion PNG `sdb-baignoire-vintage-style` + `sdb-avant-apres-douche` → JPG (-90 % chacun). | `img/*.jpg`, `img/sdb/*.jpg`, `wp-theme/labienveillance/assets/img/**` | ✅ Fait (11 mai 2026) |
| 7 | Balises `<link rel="icon">` + `<link rel="apple-touch-icon">` | 9 fichiers HTML | ✅ Fait (placeholder — attend les vrais fichiers) |
| 8 | Balise `<meta property="og:image">` | 7 fichiers HTML (pages avec OG) | ✅ Fait + visuel dédié `og-labienveillance.jpg` (1200×630, 73 Ko) disponible |
| 9 | Script Google Tag Manager (commenté, prêt à activer) | 9 fichiers HTML | ✅ Fait (placeholder — attend l'ID GTM) |
| 10 | URLs canoniques sans `.html` — rewrite Apache + `_redirects` Netlify (301 depuis `.html`, 200 shadow) | `.htaccess`, `_redirects` | ✅ Fait |
| 11 | `sitemap.xml` aligné sur les canonicals (chemins sans extension) | `sitemap.xml` | ✅ Fait |
| 12 | Formulaire prêt pour Formspree ou Netlify (`action` / `data-netlify`, logique dans `main.js`) | `contact.html`, `main.js` | ✅ Fait (attend l’ID / attribut côté client) |

### B2. À faire sur la maquette statique (optionnel, avant ou en parallèle du portage WP)

| # | Tâche | Fichiers | Temps estimé |
|---|-------|----------|-------------|
| 13 | Numéro affiché sur le site | ✅ Fait (`03 25 31 13 60`) | — |
| 14 | Intégrer le logo (remplacer emoji 🤝) | ✅ Fait — PNG 199×110 dans `img/logo-la-bienveillance.png`, dimensions HTML mises à jour sur les 9 pages + thème | — |
| 15 | URL Calendly | ⏭️ **Hors périmètre lancement** — voir A2 #13 et A3 Q6 | — |
| 16 | Formulaire tiers (Formspree, etc.) **si pas encore de CF7 en WP** | `contact.html`, `main.js` | 5-15 min |
| 17 | Favicon PNG / OG image dédiée dans `img/` | `img/` | 5 min |
| 18 | GTM | ✅ Activé (`GTM-NZVHPJ3Z`) — décommenter sur les 9 fichiers HTML statiques équivaut à `display:block` côté thème WP, déjà en place via `functions.php` | — |
| 19 | Remplacer images AI par photos réelles (si fournies) | HTML + `img/` | 15 min |

### B3. Tests maquette statique (optionnel)

| # | Tâche | Temps estimé |
|---|-------|-------------|
| 20 | Test mobile + desktop (9 pages) | 30 min |
| 21 | Lighthouse / A11y / SEO | 15 min |
| 22 | Cross-navigateurs | 15 min |

### B4. Intégration WordPress sur l’hébergement existant — **cible production**

| # | Tâche | Détail |
|---|-------|--------|
| 1 | **Sauvegarde + staging** | Sauvegarde fichiers + base avant toute modif ; idéalement copie de travail (sous-domaine ou préproduction) |
| 2 | **Thème** | Thème enfant ou thème sur mesure ; transposer `css/style.css` et `js/main.js` via `wp_enqueue_script` / `wp_enqueue_style` |
| 3 | **Découpage** | `header.php`, `footer.php`, `front-page.php`, modèles de page pour les grandes sections (ou blocs Gutenberg / builder si choix métier) |
| 4 | **Pages** | Créer les pages avec slugs alignés sur **C2** ; menu principal ; contenu repris des HTML statiques |
| 5 | **Médias** | Importer les fichiers de `img/` dans la médiathèque WP ; ajuster `src` et tailles |
| 6 | **Contact** | Formulaire **Contact Form 7** (ou autre plugin) relié à la boîte du client + anti-spam (reCAPTCHA ou honeypot). Calendly **hors périmètre lancement** — branchement post-prod via `labienveillance_calendly_url`. |
| 7 | **Yoast SEO** (ou équivalent) | Titres, méta, canonical, Open Graph, Schema, sitemap XML — reprendre les intentions de la maquette |
| 8 | **Redirections** | Plugin type **Redirection** : 301 depuis anciennes URL WP obsolètes (ex. `/monte-escalier/` → `/monte-escaliers/`) **sans** bloquer `/wp-admin` |
| 9 | **404** | Modèle d’erreur 404 cohérent avec le design (thème ou plugin) |
|10 | **Recette prod** | Permaliens, HTTPS, cache (plugin / hébergeur), envoi e-mail formulaire, prise de RDV test |

---

## PARTIE C : Plan de migration (ancien site → nouveau site)

### C1. État de l'ancien site

| Élément | Valeur |
|---------|--------|
| Plateforme | WordPress (Yoast SEO) |
| URL de connexion | `https://labienveillance.fr/wp-login.php` (confirmé client le 11 mai 2026) |
| Responsable | Jean-Laurent MOHR |
| Email | contact@labienveillance.fr |
| Indexation Google | **Aucune** (0 page indexée — `site:labienveillance.fr` = 0 résultats) |
| Sitemap | `sitemap_index.xml` — **erreur 500** (ne fonctionne pas) |
| SSL/HTTPS | ✅ Actif |
| Serveur | **Apache** (en-tête `Server: Apache`) |
| PHP | **8.2.30** (en-tête `X-Powered-By`) — moderne, compatible mu-plugin et thème |
| Headers spécifiques | `X-WS-RateLimit-*` (proxy/edge type WS) |
| Page parasite `/admin/` | Post ID 8 répond 200 OK — **à rediriger 301 vers `/` puis supprimer** (cf. `redirections-wp.csv`, groupe `nettoyage`) |

### C2. Slugs & redirections (référence SEO, une fois en WordPress)

À reproduire via **permaliens** WordPress + **plugin Redirection** (ou équivalent). La forme exacte des URL peut inclure une **barre finale** selon la config du site (`/monte-escaliers/` vs `/monte-escaliers`) ; l’important est la **cohérence** et une **canonical unique** par page (Yoast).

| Ancienne URL (à traiter en 301 si encore utilisée) | Nouvelle page WP (slug cible) | Note |
|-----------------------------------------------------|------------------------------|------|
| `/` | Accueil | Inchangé |
| `/monte-escalier/` | `monte-escaliers` | Singulier → pluriel |
| `/salle-de-bain/` | `salle-de-bain` | Conserver |
| `/amenagements/` | `amenagements` | Conserver |
| `/conseils/` | `conseils` | Conserver |
| `/contact/` | `contact` | Conserver |
| `/mentions-legales/` | `mentions-legales` | Conserver |
| *(nouvelle)* | `aides-financieres` | Créer la page |
| `/elementor-1985/` | **`/estimation-monte-escalier/`** (page dédiée configurateur) ; **embed** : page au modèle « Embed — Devis JLM seul » ou `/devis-embed.html` pour iframe sans chrome | **301** — ne plus charger toute la page Elementor : cible pleine page = estimation dédiée ; iframe = embed minimal + `jlm-lite-devis.js` (AJAX `admin-ajax.php`) |
| `/monte-escaliers/monte-escalier.html` | **`/estimation-monte-escalier/`** (CSV) | Ajuster si la décision métier diffère (cf. `redirections-wp.md` § 4.3) |

**Ne pas** configurer de redirections qui bloquent `/wp-admin`, `/wp-login.php` ou `/wp-content` : l’administration WordPress doit rester accessible.

### C3. Parcours de livraison retenu — même hébergement, WordPress

1. Sauvegarde complète (fichiers + base de données).  
2. Développement du **nouveau thème** (ou majeur du thème enfant) à partir de la maquette statique (partie **B4**).  
3. Recette sur **préproduction** ou bascule de thème en « maintenance courte » si pas de staging.  
4. Mise en ligne : contenus, médias, formulaires, Yoast, redirections, tests.  
5. Ancien thème désactivé ; mises à jour **cœur + plugins** planifiées comme sur tout site WP.

*(Déploiement « tout statique » à la racine et changement d’hébergeur vers Netlify/Vercel ne sont **pas** la cible de ce dossier ; les fichiers `.htaccess` / `_redirects` du dépôt restent une référence **uniquement** pour qui ferait une preview HTML hors WordPress.)*

### C4. ⚠️ Fichiers `.htaccess` et `_redirects` du dépôt statique

Le `.htaccess` présent dans `labienveillance/` a été pensé pour un hébergement **sans** WordPress (y compris des règles redirigeant `wp-admin` vers `/`).  

**Ne pas copier-coller ce fichier à la racine d’une installation WordPress en production** : cela **couperait l’accès à l’administration**.

Sur WordPress : utiliser le `.htaccess` **standard** généré par WP (permaliens) et gérer les 301 **uniquement** pour les anciennes URL de contenu, via plugin ou règles ajoutées **sans** supprimer les blocs nécessaires au CMS.

---

## PARTIE D : Accès nécessaires

### D1. Accès OBLIGATOIRES

| # | Accès | Pourquoi | Qui le fournit |
|---|-------|----------|---------------|
| 1 | **Hébergement** (FTP/SFTP ou panneau cPanel/Plesk) | Déposer thème, médias, sauvegardes ; accès base si besoin | Le client ou son prestataire actuel |
| 2 | **Registrar du domaine** (OVH, Gandi, Ionos, etc.) | Modifier les DNS seulement si changement d’hébergeur *(non requis si on reste en place)* | Le client |
| 3 | **WordPress admin** (`/wp-login.php`) | Créer pages, menus, plugins ; mise à jour du thème | Le client / prestataire |

### D2. Accès RECOMMANDÉS

| # | Accès | Pourquoi |
|---|-------|----------|
| 4 | **Google Search Console** | Soumettre le nouveau sitemap, vérifier l'indexation, monitorer les erreurs |
| 5 | **Google Analytics / GTM** | Configurer le suivi de trafic |
| 6 | **Google Business Profile** | Mettre à jour les infos et lier au site |
| 7 | **Boîte email** `contact@labienveillance.fr` | Vérifier la réception des formulaires (et plus tard, des notifications Calendly une fois le compte branché) |

### D3. Comptes à créer

| # | Compte | Pourquoi | Coût | Phase |
|---|--------|----------|------|-------|
| 8 | **Google Search Console** (si inexistant) | SEO et indexation | Gratuit | **Lancement** |
| 9 | **Google Analytics 4** (si inexistant) | Suivi de trafic | Gratuit | **Lancement** |
| 10 | **Formspree** (option si pas de formulaire WP) | Réception des messages hors CF7 | Gratuit (50/mois) ou 10$/mois | **Lancement** (en secours si CF7 non installé) |
| 11 | **Calendly** | Prise de RDV en ligne | Gratuit (plan Basic) ou 10€/mois (Standard) | **Post-lancement** (filtre déjà câblé dans le thème) |

---

## PARTIE E : Checklist de mise en ligne (WordPress, hébergement actuel)

```
PRÉPARATION — Maquette dans le dépôt (référence)
■ Contenus + design en HTML/CSS/JS (partie B1)
■ robots.txt / sitemap.xml statiques = référence d’URLs (Yoast prendra le relais en prod)
■ Ne pas utiliser le .htaccess du dépôt tel quel sur WP (voir C4)

PRÉ-LANCEMENT — Intégration WP (partie B4)
□ Sauvegarde site + base avant modifications
□ Thème (enfant ou sur mesure) déployé sur staging ou préprod
□ Pages WP créées avec les slugs exacts (cf. wp-theme/README.md) — PAS de page « parrainage »
□ Médias importés (ou conservés dans le thème, à trancher)
□ Mu-plugin de prod déposé dans wp-content/mu-plugins/ (cf. migration-wp/mu-plugin-labienveillance-config.php)
□ Plugin Contact Form 7 + Honeypot for Contact Form 7 installés
□ Formulaire CF7 créé en collant les 4 gabarits (cf. migration-wp/cf7/README.md)
□ ID CF7 reporté dans le mu-plugin (LBV_CONTACT_CF7_ID)
□ Plugin SMTP installé et configuré (WP Mail SMTP / FluentSMTP) — délivrabilité
□ Yoast : titres, métas, canonical, OG, schema, sitemap XML fonctionnel (cf. migration-wp/yoast-config.md)
□ Yoast → Représentation du site → image OG par défaut : og-labienveillance.jpg (1200×630)
□ Redirections 301 importées (cf. migration-wp/redirections-wp.csv) sans bloquer wp-admin
□ Page WP « admin » (post ID 8) supprimée après import des 301
□ GTM actif (déjà configuré dans le thème : GTM-NZVHPJ3Z)
□ Logo intégré (déjà fait — PNG 199×110)
□ E-mail de réception : contact@labienveillance.fr (✅ confirmé)
□ Vérifier qu'aucun lien « Parrainage » ne reste visible (footer + menus)

PRÉ-LANCEMENT — Tests
□ Mobile + desktop sur toutes les pages publiées
□ Envoi réel du formulaire et e-mail reçu
□ Connexion wp-admin toujours OK
□ HTTPS, permaliens, pas d’erreurs PHP apparentes

LANCEMENT (sans Calendly)
□ Bascule thème / mise en prod validée
□ Corriger sitemap Yoast (ancienne erreur 500)
□ Soumettre le sitemap dans Google Search Console
□ Google Business Profile à jour

POST-LANCEMENT (48h+)
□ Pages en 200, pas de 404 inattendues (logs plugin Redirection)
□ Search Console : couverture / redirections
□ Suivi formulaires côté client
□ Plan de mises à jour WP (cœur, plugins, thème)

POST-LANCEMENT (chantier Calendly, sans urgence)
□ Création du compte Calendly + type de RDV
□ Activation via filtre labienveillance_calendly_url (mu-plugin d’une ligne)
□ Test de la prise de RDV en ligne
□ Communication client (page contact, footer, signatures e-mail)
```

---

## PARTIE G : Rôle du dépôt statique vs WordPress final

| Élément | Rôle |
|---------|------|
| `*.html`, `css/`, `js/`, `img/` | **Source visuelle et textuelle** pour construire le thème et les contenus WP |
| `.htaccess` / `_redirects` | **Non** à appliquer tels quels sur le serveur WordPress (risque de bloquer l’admin) |
| `robots.txt` / `sitemap.xml` statiques | **Référence** ; en production, privilégier la génération Yoast (ou équivalent) |

Après livraison, le client **continue d’utiliser WordPress** pour les habituelles mises à jour de contenu ; la maquette HTML peut rester dans le dépôt pour documentation ou previews locales.

---

## PARTIE F : Inventaire final du projet

```
labienveillance/
├── .htaccess                  (réf. statique uniquement — voir C4 si WordPress)
├── _redirects                 (réf. Netlify / preview — pas le flux prod WP)
├── robots.txt                 (sitemap, disallow mentions-legales)
├── sitemap.xml                (7 URLs)
├── 404.html                   (page erreur personnalisée)
├── index.html                 (accueil)
├── monte-escaliers.html       (monte-escaliers)
├── salle-de-bain.html         (douche sécurisée)
├── amenagements.html          (aménagements)
├── conseils.html              (guide + nutrition)
├── aides-financieres.html     (aides financières)
├── contact.html               (formulaire de contact ; Calendly hors lancement)
├── mentions-legales.html      (RGPD + cookies)
├── css/
│   └── style.css              (design system complet)
├── js/
│   └── main.js                (menu, header, animations, formulaire)
├── img/
│   ├── favicon.svg                (temporaire — initiales LB, couleurs marque)
│   ├── og-labienveillance.jpg     (1200×630, 73 Ko — visuel social dédié)
│   ├── hero-seniors.jpg           (137 Ko)
│   ├── accompagnement-conseil.jpg (122 Ko)
│   ├── visite-conseil.jpg         (144 Ko)
│   ├── monte-escalier.jpg         (114 Ko)
│   ├── monte-escalier-courbe.jpg  (76 Ko)
│   ├── douche-securisee.jpg       (130 Ko après recompression)
│   ├── installateur-sdb.jpg       (138 Ko après recompression)
│   ├── amenagement-interieur.jpg  (87 Ko)
│   ├── sante-vitalite.jpg         (130 Ko)
│   ├── nutrition-seniors.jpg      (111 Ko)
│   ├── dossier-aides.jpg          (143 Ko)
│   ├── conseil-domicile.jpg       (122 Ko)
│   ├── bambous.jpg                (261 Ko après recompression)
│   ├── sdb-baignoire-vintage-style.jpg  (169 Ko — anc. PNG converti en JPG)
│   ├── sdb-avant-apres-douche.jpg       (105 Ko — anc. PNG converti en JPG)
│   ├── sdb/
│   │   ├── sdb-avant-1.jpg           ├── sdb-apres-1.jpg          (paire 1)
│   │   ├── sdb-avant-2.jpg           ├── sdb-apres-2.jpg          (paire 2)
│   │   ├── sdb-habillage-1.jpg       ├── sdb-habillage-2.jpg      (revêtements muraux)
│   │   ├── sdb-sol-1.jpg             ├── sdb-sol-2.jpg            (sols antidérapants)
│   │   ├── sdb-porte-coulissante.jpg ├── sdb-seche-serviettes.jpg
│   │   └── sdb-proposition-renovation.jpg                          (vue d'ensemble)
│   └── devis-monte-escalier/
│       ├── logo-jlm.png                                              (logo outil)
│       ├── escalier-droit.jpg / escalier-90.jpg / escalier-180.jpg / escalier-exterieur.jpg
│       ├── marque-up-stairlift.jpg / marque-acorn.png                (marques produits)
│       ├── depart-standard.jpg / depart-rallonge.jpg                 (départs)
│       ├── depart-pivot-90.jpg / depart-pivot-180.jpg                (départs avec pivot)
│       ├── obstacle-exemple-1.jpg / obstacle-exemple-2.jpg
│       ├── obstacle-oui.jpg / obstacle-non.jpg                       (obstacles)
│       ├── rail-exemple-1.jpg / rail-exemple-2.jpg / rail-oui.jpg / rail-non.jpg
│       ├── arrivee-nez-marche.jpg / arrivee-prolongement.jpg
│       ├── arrivee-90.jpg / arrivee-180.jpg                          (arrivées)
│       ├── pivot-manuel.jpg / pivot-electrique.jpg                   (pivots de stationnement)
│       ├── garanties.jpg / aides.jpg                                 (informatifs)
│       └── 27 photos rapatriées du staging WP.com + 1 générée IA (depart-pivot-180)
├── scripts/
│   ├── optimize-images.py            (compression + crop OG, idempotent — Pillow)
│   ├── fetch-jlm-images.py           (rapatriement initial des 27 images JLM)
│   ├── patch-jlm-lite.py             (réécriture URLs externes → locales + neutralisation ADMIN_CODE)
│   └── Enable-GitHubPages.ps1
├── DOCUMENTATION.md           (documentation technique)
└── MIGRATION.md               (ce fichier)

Poids total images après optimisation : ~7 Mo (55 fichiers, IA + métiers + 27 photos outil JLM)
Poids total maquette : ~9 Mo (hors documentation). **Production :** thème + médias WP sur l’hébergement existant.

wp-theme/                      (déploiement vers wp-content/themes/)
└── labienveillance/           (thème amorcé — voir wp-theme/README.md)
    ├── style.css
    ├── functions.php          (enqueue, GTM, menus, filtres, configurateur sdb)
    ├── header.php
    ├── footer.php
    ├── index.php
    ├── front-page.php
    ├── page.php
    ├── 404.php
    ├── page-{slug}.php        (9 modèles dédiés : monte-escaliers, salle-de-bain, …)
    ├── assets/
    │   ├── css/style.css
    │   ├── css/devis-sdb.css      ← styles configurateur salle de bain
    │   ├── js/main.js
    │   ├── js/devis-choice.js
    │   ├── js/jlm-lite-devis.js   ← devis monte-escalier (chargé en iframe)
    │   ├── js/devis-sdb.js        ← configurateur salle de bain (intégré)
    │   ├── js/contact-prefill.js  ← pré-remplit CF7 depuis ?projet=…
    │   ├── js/theme-init.js
    │   └── img/…
    └── template-parts/
        ├── home-front.php
        └── devis-sdb.php          ← markup du configurateur salle de bain
```

---

## PARTIE H : Tâches prestataire **sans attente d’infos client** (pré « go » mise en ligne)

> Tout ce qui suit est réalisable **avant** la mise en ligne. Logo final ✅ déjà livré. La création du compte Calendly est désormais **post-lancement** (cf. § A2/A3) et n’entre donc pas dans cette liste.

### H1. Maquette statique (cohérence & qualité technique)

| # | Tâche | État |
|---|--------|------|
| 1 | Vérifier que **toutes les images référencées** dans les HTML existent sous `img/` (pas de 404 locaux) | ✅ Fait — set complet (visuels métier + 14 photos `img/sdb/`) ; aucune 404 attendue |
| 2 | **`og:image`** : visuel dédié 1200×630 livré (`img/og-labienveillance.jpg` + `wp-theme/labienveillance/assets/img/og-labienveillance.jpg`). À référencer dans Yoast en prod. | ✅ Fait |
| 3 | **Favicon** : `favicon.svg` dans `img/` ; PNG / apple-touch **optionnels** jusqu’au branding final | ✅ Fait (maquette) |
| 4 | Repasse **A11y** rapide : un `<h1>` par page, `alt` sur les `<img>` ; **`aria-expanded`** sur le bouton menu mobile (`main.js`) | Menu : ✅ ; relecture globale : À faire |
| 5 | Repasse **Lighthouse** (Perf / SEO / A11y / BP) sur les 9 pages en ouverture locale ou staging | À faire |
| 6 | Harmoniser les **icônes téléphone** (entité vs caractère Unicode) si souhait de cohérence visuelle | Optionnel |

### H2. Intégration WordPress (travailleur principal avant prod)

| # | Tâche | Remarque |
|---|--------|----------|
| 1 | Créer le **thème** (enfant ou autonome) : `style.css` en-tête WP, `functions.php`, enqueue de `css/style.css` et `js/main.js`, dépendances (ex. Google Fonts) | ✅ Fait — `wp-theme/labienveillance/` (filtres `labienveillance_*`, GTM, theme-toggle) |
| 2 | Découper **`header.php` / `footer.php`** et modèles de page (accueil, pages services, contact, 404) en reprenant la structure HTML actuelle | ✅ Fait — `header.php`, `footer.php`, `front-page.php`, `404.php`, **9 `page-{slug}.php`** dédiés (monte-escaliers, salle-de-bain, amenagements, conseils, aides-financieres, contact, mentions-legales, parrainage, devis JLM) |
| 3 | Enregistrer **menu** + emplacement, **logo** (custom logo ou zone texte en attendant le fichier) | ✅ Fait — emplacement `primary` + menu de secours structuré (sous-menu services) ; `add_theme_support('custom-logo')` actif |
| 4 | Créer les **pages** et slugs alignés sur **C2** ; migrer contenu depuis les `.html` | ⚠️ Côté client : créer les 8 pages avec slugs exacts → contenu rendu **automatiquement** par les modèles (cf. `wp-theme/README.md`) |
| 5 | **Médiathèque** : importer les JPG de `img/` ; corriger les chemins dans le contenu / ACF / blocs | À faire en prod (les modèles utilisent `assets/img/` côté thème — décision : laisser ainsi ou migrer vers la médiathèque pour permettre l’éditorial) |
| 6 | **Contact** : **Contact Form 7** (champs alignés sur la maquette, mail de test) — Calendly hors périmètre lancement | ✅ Préparé — gabarits CF7 prêts à coller dans [`migration-wp/cf7/`](migration-wp/cf7/) (formulaire + 2 e-mails + messages FR), mu-plugin de branchement [`migration-wp/mu-plugin-labienveillance-config.php`](migration-wp/mu-plugin-labienveillance-config.php). Filtres `labienveillance_contact_shortcode` (CF7) et `labienveillance_calendly_url` (post-lancement). Reste à faire en prod : installer CF7 + _Honeypot for CF7_, copier-coller les gabarits (5 min), reporter l'ID dans le mu-plugin. |
| 7 | **Yoast** (ou équivalent) : titres, métas, OG, schema, **sitemap XML** opérationnel (corriger l’historique **erreur 500**) | ✅ Préparé — `migration-wp/yoast-config.md` (valeurs page par page + schema JSON-LD) |
| 8 | **Redirection** : plugin pour `/monte-escalier/` → `/monte-escaliers/` etc., **sans** règles bloquant `wp-admin` | ✅ Préparé — `migration-wp/redirections-wp.csv` + `migration-wp/redirections-wp.md` |
| 9 | **404** : template reproduisant l’esprit de `404.html` | ✅ Fait — `wp-theme/labienveillance/404.php` |
|10 | **Recette** : cache, SMTP si besoin, pas d’erreur PHP, `wp-admin` accessible, HTTPS | À faire en prod (cf. checklist § E) |

### H3. Contrôles croisés dépôt ↔ prod

| # | Contrôle |
|---|----------|
| 1 | Liste des **URL publiques** identique à l’intention du `sitemap.xml` maquette (modulo barre finale selon réglage WP) |
| 2 | **Pas de déploiement** du `.htaccess` maquette à la racine WP (voir **C4**) |
| 3 | Après mise en ligne : **Search Console** — soumission sitemap, pas de explosion de crawl errors |

### H4. Hors périmètre de cette liste (dépend du client)

Numéro réel ✅, logo définitif ✅, ID GTM ✅, image OG dédiée ✅, photos cohérentes IA livrées ✅. Restent ouverts&nbsp;: **mentions légales société (LCEN)** — Q7, **photos de chantiers réels** si souhaitées un jour à la place du set IA — Q4, **réponses aux questions A3** non encore tranchées, **création du compte Calendly post-lancement** — Q6, **contenu du programme parrainage** — Q8. Ces éléments **ne bloquent pas** la mise en ligne mais enrichissent le « top » métier au fil du temps.
