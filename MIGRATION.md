# LA BIENVEILLANCE — Étapes finales & Plan de migration

> Dernière mise à jour : 25 mars 2026  
> **Cible de mise en production :** intégration du nouveau site sur **l’hébergement actuel**, dans **WordPress** (pas un remplacement « tout statique » à la racine). Le dossier `labienveillance/` (HTML/CSS/JS) sert de **référence design + contenu** à transposer en thème / pages WP.

---

## PARTIE A : Informations à fournir par le client

### A1. OBLIGATOIRE (bloque la mise en ligne)

| # | Information | État | Détail |
|---|-------------|------|--------|
| 1 | **Numéro de téléphone** | ✅ | `03 25 31 13 60` |
| 2 | **Logo** | ❌ Manquant | Format SVG ou PNG haute résolution. Si inexistant, en créer un |
| 3 | **Compte Calendly** | ❌ À créer | Créer un compte Calendly, configurer le type de RDV, fournir l'URL du lien de prise de RDV |
| 4 | **Formulaire de contact** | ❌ À décider | **Priorité WordPress :** Contact Form 7, WPForms ou équivalent (e-mail vers `contact@…`). Calendly reste intégré en iframe/embed comme sur la maquette. *Hors WP seulement :* script PHP maison ou service tiers type Formspree |
| 5 | **Email de réception** | ⚠️ À confirmer | Est-ce bien `contact@labienveillance.fr` ? Les messages du formulaire et notifications Calendly y seront envoyés |

### A2. RECOMMANDÉ (améliore la qualité)

| # | Information | État |
|---|-------------|------|
| 6 | **Photos réelles** de réalisations (monte-escaliers installés, salles de bain avant/après) | ❌ Manquant |
| 7 | **Adresse postale** exacte (si affichage souhaité) | ❌ Manquant |
| 8 | **Horaires d'ouverture** à confirmer (actuellement "Lun-Ven 9h-18h") | ⚠️ À confirmer |
| 9 | **Zone géographique** exacte (actuellement "Épinal et les Vosges") | ⚠️ À confirmer |
| 10 | **2-3 témoignages clients** réels avec prénom + ville | ⚠️ Optionnel |
| 11 | **Favicon** — fichier icône 32×32 + 180×180 px | ❌ Manquant (balises HTML déjà en place) |
| 12 | **ID Google Tag Manager** (GTM-XXXXXXX) | ❌ Manquant (script commenté déjà en place) |
| 13 | **OG Image** pour partage social (1200×630 px) | ❌ Manquant (balise `og:image` déjà en place sur la maquette statique ; à reporter dans Yoast / champs WP) |

### A3. Questions en suspens

| # | Question |
|---|---------|
| Q1 | Le guide « Bien vieillir chez soi » est-il un PDF téléchargeable ? Si oui, fournir le fichier |
| Q2 | Le partenariat Zinzino est-il actif ? Faut-il un lien affilié ou une landing page dédiée ? |
| Q3 | Y a-t-il des certifications/labels à afficher (Qualibat, RGE, etc.) ? |
| Q4 | Le client souhaite-t-il remplacer les images AI par des photos réelles ? Si oui, lesquelles en priorité ? |
| Q5 | Faut-il conserver le lien vers l'outil de devis immédiat (`/monte-escaliers/monte-escalier.html`) visible sur l'ancien site ? Si oui, fournir l'URL ou le formulaire tiers |

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
| 7 | Balises `<link rel="icon">` + `<link rel="apple-touch-icon">` | 9 fichiers HTML | ✅ Fait (placeholder — attend les vrais fichiers) |
| 8 | Balise `<meta property="og:image">` | 7 fichiers HTML (pages avec OG) | ✅ Fait (placeholder — attend le vrai fichier) |
| 9 | Script Google Tag Manager (commenté, prêt à activer) | 9 fichiers HTML | ✅ Fait (placeholder — attend l'ID GTM) |
| 10 | URLs canoniques sans `.html` — rewrite Apache + `_redirects` Netlify (301 depuis `.html`, 200 shadow) | `.htaccess`, `_redirects` | ✅ Fait |
| 11 | `sitemap.xml` aligné sur les canonicals (chemins sans extension) | `sitemap.xml` | ✅ Fait |
| 12 | Formulaire prêt pour Formspree ou Netlify (`action` / `data-netlify`, logique dans `main.js`) | `contact.html`, `main.js` | ✅ Fait (attend l’ID / attribut côté client) |

### B2. À faire sur la maquette statique (optionnel, avant ou en parallèle du portage WP)

| # | Tâche | Fichiers | Temps estimé |
|---|-------|----------|-------------|
| 13 | Numéro affiché sur le site | Fait (`03 25 31 13 60`) | — |
| 14 | Intégrer le logo (remplacer emoji 🤝) | 9 fichiers HTML | 10 min |
| 15 | Configurer l'URL Calendly réelle | `contact.html` | 2 min |
| 16 | Formulaire tiers (Formspree, etc.) **si pas encore de CF7 en WP** | `contact.html`, `main.js` | 5-15 min |
| 17 | Favicon / OG image dans `img/` | `img/` | 5 min |
| 18 | Décommenter le script GTM | 9 fichiers HTML | 5 min |
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
| 6 | **Contact** | Embed Calendly ; formulaire **Contact Form 7** (ou autre plugin) relié à la boîte du client ; anti-spam (reCAPTCHA ou honeypot) |
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
| URL de connexion | `https://labienveillance.fr/wp-login.php` |
| Responsable | Jean-Laurent MOHR |
| Email | contact@labienveillance.fr |
| Indexation Google | **Aucune** (0 page indexée — `site:labienveillance.fr` = 0 résultats) |
| Sitemap | `sitemap_index.xml` — **erreur 500** (ne fonctionne pas) |
| SSL/HTTPS | ✅ Actif |

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
| `/elementor-1985/` | URL d’**embed** (page WP au modèle « Embed — Devis JLM seul », ou fichier `/devis-embed.html` à la racine) ; éventuellement aussi `/devis-estimatif/` pour la page « pleine écran » avec le même modèle que la maquette | **301** — ne plus charger toute la page Elementor dans une iframe : cible = embed minimal + `js/jlm-lite-devis.js` (AJAX same-origin vers `admin-ajax.php`) |
| `/monte-escaliers/monte-escalier.html` | *(à décider)* | Outil de devis tiers : garder, 301 ou lien interne |

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
| 7 | **Boîte email** `contact@labienveillance.fr` | Vérifier la réception des formulaires et notifications Calendly |

### D3. Comptes à créer

| # | Compte | Pourquoi | Coût |
|---|--------|----------|------|
| 8 | **Calendly** | Prise de RDV en ligne | Gratuit (plan Basic) ou 10€/mois (Standard) |
| 9 | **Formspree** (option si pas de formulaire WP) | Réception des messages hors CF7 | Gratuit (50/mois) ou 10$/mois |
| 10 | **Google Search Console** (si inexistant) | SEO et indexation | Gratuit |
| 11 | **Google Analytics 4** (si inexistant) | Suivi de trafic | Gratuit |

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
□ Pages, menus, médias, Calendly, formulaire (CF7 ou équivalent)
□ Yoast : titres, métas, canonical, OG, schema, sitemap XML fonctionnel
□ Redirections 301 (anciennes URL) sans bloquer wp-admin
□ Favicon, GTM si applicable
□ Infos client intégrées (tél., logo, e-mail test)

PRÉ-LANCEMENT — Tests
□ Mobile + desktop sur toutes les pages publiées
□ Envoi réel du formulaire et e-mail reçu
□ Prise de RDV Calendly test
□ Connexion wp-admin toujours OK
□ HTTPS, permaliens, pas d’erreurs PHP apparentes

LANCEMENT
□ Bascule thème / mise en prod validée
□ Corriger sitemap Yoast (ancienne erreur 500)
□ Soumettre le sitemap dans Google Search Console
□ Google Business Profile à jour

POST-LANCEMENT (48h+)
□ Pages en 200, pas de 404 inattendues
□ Search Console : couverture / redirections
□ Suivi formulaires et Calendly côté client
□ Plan de mises à jour WP (cœur, plugins, thème)
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
├── contact.html               (Calendly + formulaire)
├── mentions-legales.html      (RGPD + cookies)
├── css/
│   └── style.css              (design system complet)
├── js/
│   └── main.js                (menu, header, animations, formulaire)
├── img/
│   ├── favicon.svg                (temporaire — initiales LB, couleurs marque)
│   ├── hero-seniors.jpg           (137 Ko)
│   ├── accompagnement-conseil.jpg (122 Ko)
│   ├── visite-conseil.jpg         (144 Ko)
│   ├── monte-escalier.jpg         (114 Ko)
│   ├── monte-escalier-courbe.jpg  (76 Ko)
│   ├── douche-securisee.jpg       (93 Ko)
│   ├── installateur-sdb.jpg       (101 Ko)
│   ├── amenagement-interieur.jpg  (87 Ko)
│   ├── sante-vitalite.jpg         (130 Ko)
│   ├── nutrition-seniors.jpg      (111 Ko)
│   ├── dossier-aides.jpg          (143 Ko)
│   ├── conseil-domicile.jpg       (122 Ko)
│   └── bambous.jpg                (198 Ko)
├── DOCUMENTATION.md           (documentation technique)
└── MIGRATION.md               (ce fichier)

Poids total images : ~1.6 Mo (13 fichiers)
Poids total maquette : ~2 Mo (hors documentation). **Production :** thème + médias WP sur l’hébergement existant.

wp-theme/                      (déploiement vers wp-content/themes/)
└── labienveillance/           (thème amorcé — voir wp-theme/README.md)
    ├── style.css
    ├── functions.php
    ├── header.php
    ├── footer.php
    ├── index.php
    ├── front-page.php
    ├── page.php
    ├── 404.php
    ├── assets/
    │   ├── css/style.css
    │   ├── js/main.js
    │   └── img/…
    └── template-parts/
        └── home-front.php
```

---

## PARTIE H : Tâches prestataire **sans attente d’infos client** (pré « go » mise en ligne)

> Tout ce qui suit est réalisable **avant** réception du vrai téléphone, logo final, URL Calendly définitive, etc. À cocher en fin de prestation technique.

### H1. Maquette statique (cohérence & qualité technique)

| # | Tâche | État |
|---|--------|------|
| 1 | Vérifier que **toutes les images référencées** dans les HTML existent sous `img/` (pas de 404 locaux) | À maintenir à chaque commit |
| 2 | **`og:image`** : jusqu’à livraison d’un visuel 1200×630 dédié, pointer vers une image **existante** dans `img/` (actuellement `hero-seniors.jpg` sur les pages OG) | ✅ Fait (maquette) |
| 3 | **Favicon** : `favicon.svg` dans `img/` ; PNG / apple-touch **optionnels** jusqu’au branding final | ✅ Fait (maquette) |
| 4 | Repasse **A11y** rapide : un `<h1>` par page, `alt` sur les `<img>` ; **`aria-expanded`** sur le bouton menu mobile (`main.js`) | Menu : ✅ ; relecture globale : À faire |
| 5 | Repasse **Lighthouse** (Perf / SEO / A11y / BP) sur les 9 pages en ouverture locale ou staging | À faire |
| 6 | Harmoniser les **icônes téléphone** (entité vs caractère Unicode) si souhait de cohérence visuelle | Optionnel |

### H2. Intégration WordPress (travailleur principal avant prod)

| # | Tâche | Remarque |
|---|--------|----------|
| 1 | Créer le **thème** (enfant ou autonome) : `style.css` en-tête WP, `functions.php`, enqueue de `css/style.css` et `js/main.js`, dépendances (ex. Google Fonts) | **Amorcé** — dossier `wp-theme/labienveillance/` |
| 2 | Découper **`header.php` / `footer.php`** et modèles de page (accueil, pages services, contact, 404) en reprenant la structure HTML actuelle | |
| 3 | Enregistrer **menu** + emplacement, **logo** (custom logo ou zone texte en attendant le fichier) | |
| 4 | Créer les **pages** et slugs alignés sur **C2** ; migrer contenu depuis les `.html` | |
| 5 | **Médiathèque** : importer les JPG de `img/` ; corriger les chemins dans le contenu / ACF / blocs | |
| 6 | **Contact** : bloc Calendly (shortcode ou HTML widget) + **Contact Form 7** (champs alignés sur la maquette, mail de test) | |
| 7 | **Yoast** (ou équivalent) : titres, métas, OG, schema, **sitemap XML** opérationnel (corriger l’historique **erreur 500**) | |
| 8 | **Redirection** : plugin pour `/monte-escalier/` → `/monte-escaliers/` etc., **sans** règles bloquant `wp-admin` | |
| 9 | **404** : template reproduisant l’esprit de `404.html` | |
|10 | **Recette** : cache, SMTP si besoin, pas d’erreur PHP, `wp-admin` accessible, HTTPS | |

### H3. Contrôles croisés dépôt ↔ prod

| # | Contrôle |
|---|----------|
| 1 | Liste des **URL publiques** identique à l’intention du `sitemap.xml` maquette (modulo barre finale selon réglage WP) |
| 2 | **Pas de déploiement** du `.htaccess` maquette à la racine WP (voir **C4**) |
| 3 | Après mise en ligne : **Search Console** — soumission sitemap, pas de explosion de crawl errors |

### H4. Hors périmètre de cette liste (dépend du client)

Numéro réel, logo définitif, Calendly production, validation textes légaux, photos réelles, ID GTM, image OG dédiée, réponses aux questions A3 — **ne bloquent pas** la préparation technique H1/H2 mais **bloquent** un « top » métier final.
