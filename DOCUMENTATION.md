# LA BIENVEILLANCE — Documentation technique complète

> Dernière mise à jour : 31 mars 2026
> Client : labienveillance.fr — Micro-entreprise (Épinal, Vosges)
> Activité : Monte-escaliers, douches sécurisées, aménagement du domicile pour seniors
>
> **Mise en production prévue :** intégration sous **WordPress** sur **l’hébergement actuel** du client. Ce dépôt sert de **maquette** (HTML/CSS/JS) pour le design et les textes ; ne pas confondre avec le déploiement final (voir `MIGRATION.md`, parties B4, C3, C4).

Thème WordPress amorcé : `wp-theme/labienveillance/` (copier dans `wp-content/themes/` — voir `wp-theme/README.md`).

**Prévisualisation en ligne (maquette statique) :** déploiement **GitHub Pages** — voir **§ 12** en fin de document. L’URL publique de démo n’est **pas** le domaine de production (`labienveillance.fr`). **Archive figée** de la session agent (contexte, dépannage, URL client) : `ARCHIVE-AGENT-DEPLOIEMENT.md`.

---

## 1. Structure du projet

```
labienveillance/
├── css/
│   └── style.css            (≈1 325 lignes — design system complet)
├── js/
│   └── main.js              (79 lignes — interactions front-end)
├── img/
│   ├── hero-seniors.jpg            (1.7 Mo — AI)
│   ├── accompagnement-conseil.jpg  (1.7 Mo — AI)
│   ├── visite-conseil.jpg          (1.7 Mo — AI)
│   ├── monte-escalier.jpg          (1.6 Mo — AI)
│   ├── monte-escalier-courbe.jpg   (1.4 Mo — AI)
│   ├── douche-securisee.jpg        (1.6 Mo — AI)
│   ├── installateur-sdb.jpg        (1.5 Mo — AI)
│   ├── amenagement-interieur.jpg   (1.5 Mo — AI)
│   ├── sante-vitalite.jpg          (1.7 Mo — AI)
│   ├── nutrition-seniors.jpg       (1.6 Mo — AI)
│   ├── dossier-aides.jpg           (1.8 Mo — AI)
│   ├── conseil-domicile.jpg        (1.7 Mo — AI)
│   └── bambous.jpg                 (715 Ko — récupéré de l'ancien site)
├── index.html               (339 lignes — page d'accueil)
├── monte-escaliers.html     (272 lignes — monte-escaliers)
├── salle-de-bain.html       (234 lignes — douche sécurisée)
├── amenagements.html        (256 lignes — aménagements divers)
├── conseils.html             (298 lignes — guide + nutrition)
├── aides-financieres.html   (413 lignes — aides financières)
├── contact.html              (256 lignes — Calendly + formulaire)
├── mentions-legales.html     (206 lignes — mentions légales)
└── DOCUMENTATION.md          (ce fichier)
```

---

## 2. Pages — Contenu détaillé

### 2.1 index.html (Accueil)

| Élément | Détail |
|---------|--------|
| Title | Monte-escalier & Douche sénior à Épinal – La Bienveillance |
| Meta description | La Bienveillance vous accompagne pour bien vieillir chez soi : monte-escaliers, douches sécurisées, aménagement du domicile. Devis gratuit dans les Vosges. |
| Canonical | https://labienveillance.fr/ |
| Schema.org | `LocalBusiness` (name, description, url, email, address Épinal/Vosges, areaServed) |
| Open Graph | title, description, type=website, url |
| Images | `hero-seniors.jpg` (hero), `accompagnement-conseil.jpg` (section accompagnement) |

**Sections :**
1. Hero avec badges (Vosges, Devis gratuit) + CTA "Devis gratuit" / "Nos solutions"
2. 4 piliers (Monte-escaliers, Salle de bain, Aménagements, Conseils & Santé) — liens internes
3. Problèmes / Solutions — 4 feature cards (Chutes, Isolement, Baignoire, Escaliers)
4. Histoire et accompagnement — grille texte + image
5. Témoignage client (Mme Dupont, Épinal)
6. Résumé aides financières — 3 aid cards (ANAH, Crédit d'impôt, APA)
7. Bandeau citation avec fond bambou + CTA

### 2.2 monte-escaliers.html

| Élément | Détail |
|---------|--------|
| Title | Monte-escalier à Épinal : installation dès 29€/mois – La Bienveillance |
| Meta description | Installation de monte-escaliers à Épinal et dans les Vosges. Modèles Up Stairlift et Acorn, neufs ou reconditionnés, location dès 29€/mois. Devis gratuit. |
| Canonical | https://labienveillance.fr/monte-escaliers |
| Schema.org | `Product` (name, brand Up Stairlift + Acorn, offers 29€/mois) |
| Images | `monte-escalier.jpg` (hero + UP card), `monte-escalier-courbe.jpg` (ACORN card) |

**Sections :**
1. Hero page (fond bambou)
2. Introduction service — grille texte + image + 4 bénéfices (check-list)
3. Modèles — 2 product cards (UP Stairlift droit, ACORN courbe)
4. Bandeau CTA citation + bouton

### 2.3 salle-de-bain.html

| Élément | Détail |
|---------|--------|
| Title | Remplacement baignoire par douche sénior à Épinal – La Bienveillance |
| Meta description | Transformez votre baignoire en douche sécurisée en une journée à Épinal et dans les Vosges. Sol antidérapant, siège intégré, barres de maintien. Devis gratuit. |
| Canonical | https://labienveillance.fr/salle-de-bain |
| Schema.org | `Service` (name, description, provider LocalBusiness) |
| Images | `douche-securisee.jpg` (hero), `installateur-sdb.jpg` (installateurs) |

**Sections :**
1. Hero page (fond bambou)
2. Le problème — texte d'accroche
3. La solution — 4 feature cards (douche plain-pied, siège, barres, anti-dérapant)
4. Nos installateurs — grille inversée texte + image
5. Bandeau CTA

### 2.4 amenagements.html

| Élément | Détail |
|---------|--------|
| Title | Aménagement logement perte d'autonomie à Épinal – La Bienveillance |
| Meta description | Aménagement du logement pour la perte d'autonomie à Épinal et Vosges : éclairage, domotique, WC surélevé, poignées de maintien, sols antidérapants. Devis gratuit. |
| Canonical | https://labienveillance.fr/amenagements |
| Schema.org | `Service` (name, description, provider LocalBusiness) |
| Images | `amenagement-interieur.jpg` (intro) |

**Sections :**
1. Hero page (fond bambou)
2. Introduction — grille texte + image + bénéfices
3. Les aménagements — grille 6 items (éclairage, WC, sol, poignées, cuisine, mobilier)
4. Domotique — 4 feature cards
5. Bandeau CTA

### 2.5 conseils.html

| Élément | Détail |
|---------|--------|
| Title | Guide bien vieillir chez soi : conseils pratiques – La Bienveillance |
| Meta description | Guide pratique pour bien vieillir chez soi : alimentation, adaptation du logement, bien-être psychologique, aides financières. Conseils nutrition et équilibre Oméga 3/6. |
| Canonical | https://labienveillance.fr/conseils |
| Schema.org | `Article` (headline, description, author, publisher) |
| Images | `nutrition-seniors.jpg` (section oméga), `sante-vitalite.jpg` (section Zinzino) |

**Sections :**
1. Hero page (fond bambou)
2. Le guide "Bien vieillir chez soi" — 6 étapes colorées :
   - Vieillir en bonne santé
   - Adapter son logement
   - Bien-être psychologique et social
   - Soutiens et accompagnements
   - Fiches pratiques
   - Conclusion
3. Santé & Vitalité — Oméga-3/6 + statistique 75%
4. Test Zinzino — section partenariat
5. Bandeau CTA

### 2.6 aides-financieres.html

| Élément | Détail |
|---------|--------|
| Title | Aides financières monte-escalier & douche sénior – La Bienveillance Épinal |
| Meta description | Toutes les aides financières pour adapter votre logement : Ma Prime Adapt', crédit d'impôt 25%, APA, aides ANAH, TVA réduite. Accompagnement complet à Épinal et Vosges. |
| Canonical | https://labienveillance.fr/aides-financieres |
| Schema.org | `FAQPage` (4 questions/réponses) |
| Images | `dossier-aides.jpg` (intro), `conseil-domicile.jpg` (accompagnement) |

**Sections :**
1. Hero page (fond bambou)
2. Introduction — grille texte + image
3. Les principales aides — 6 fiches colorées :
   - 🏛️ Ma Prime Adapt' (ANAH, 50-70%, max 22 000€)
   - 📋 Crédit d'impôt 25% (max 5 000€/10 000€)
   - 🤝 APA (département, GIR 1-4)
   - 💰 TVA réduite (5,5% ou 10%)
   - ♿ PCH (max 10 000€/10 ans)
   - 🏦 Aides caisses de retraite (CARSAT, MSA)
4. Cumul des aides — 2 exemples chiffrés (Monte-escalier 5 900€, Salle de bain 8 500€)
5. Notre accompagnement — grille inversée + 4 bénéfices
6. FAQ — 4 questions Schema.org
7. Bandeau CTA

### 2.7 contact.html

| Élément | Détail |
|---------|--------|
| Title | Contactez La Bienveillance – Devis gratuit monte-escalier & douche |
| Meta description | Contactez La Bienveillance pour un devis gratuit : monte-escalier, douche sécurisée, aménagement du domicile. Réponse rapide garantie. |
| Canonical | https://labienveillance.fr/contact |
| Schema.org | `ContactPage` avec mainEntity `LocalBusiness` |
| Images | `visite-conseil.jpg` (section contact) |
| CDN externes | Calendly CSS + JS widget |

**Sections :**
1. Hero page (fond bambou)
2. Grille contact : infos (téléphone, email, horaires, zone) + image
3. Calendly — widget intégré (data-url placeholder)
4. Séparateur "ou envoyez-nous un message"
5. Formulaire de contact (nom, prénom, email, téléphone, sujet, message)
6. Footer

### 2.8 mentions-legales.html

| Élément | Détail |
|---------|--------|
| Title | Mentions légales et politique de confidentialité – La Bienveillance |
| Meta description | Mentions légales, politique de confidentialité et politique de cookies du site labienveillance.fr. |
| Canonical | https://labienveillance.fr/mentions-legales |
| Meta robots | `noindex, follow` |
| Schema.org | Aucun |
| Images | Aucune |

**Sections :**
1. Hero page (fond bambou)
2. Éditeur du site
3. Hébergement
4. Propriété intellectuelle
5. Responsabilité
6. Liens hypertextes
7. Protection des données personnelles
8. Politique de cookies (strictement nécessaires, analytiques, marketing)
9. Vos droits

---

## 3. Design System (style.css)

### 3.1 Palette de couleurs

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--primary` | `#1A365D` | Bleu marine — couleur principale |
| `--primary-dark` | `#12284A` | Hover / emphasis |
| `--primary-light` | `#EBF0F7` | Fonds légers, badges |
| `--primary-lighter` | `#F4F7FB` | Hero gradient |
| `--accent` | `#E67E22` | Orange chaud — CTA, accents |
| `--accent-dark` | `#CF6D1B` | Hover accent |
| `--accent-light` | `#FDF0E4` | Fonds légers accent |
| `--bg` | `#FAFAF7` | Fond de page |
| `--bg-warm` | `#F5F0EA` | Sections alternées |
| `--surface` | `#FFFFFF` | Cartes, formulaires |
| `--text` | `#2C2C2C` | Texte principal |
| `--text-muted` | `#6B6B6B` | Texte secondaire |
| `--text-light` | `#999999` | Labels, hints |
| `--border` | `#E8E2D9` | Bordures |
| `--danger` | `#C0392B` | Erreurs |

### 3.2 Typographie

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--font-serif` | `Playfair Display` | Titres (h1-h6) |
| `--font-sans` | `Source Sans 3` | Corps de texte, UI |

| Élément | Taille |
|---------|--------|
| h1 | `clamp(2rem, 4.5vw, 3.25rem)` |
| h2 | `clamp(1.6rem, 3.5vw, 2.5rem)` |
| h3 | `clamp(1.25rem, 2.5vw, 1.625rem)` |
| body | `18px` (16px sous 480px) |

### 3.3 Espacements & rayons

| Variable | Valeur |
|----------|--------|
| `--radius-sm` | `6px` |
| `--radius` | `12px` |
| `--radius-lg` | `20px` |
| `--radius-full` | `9999px` (pills) |
| `--container` | `1200px` |
| Section padding | `clamp(3rem, 6vw, 5.5rem)` |

### 3.4 Ombres

| Variable | Valeur |
|----------|--------|
| `--shadow` | `0 2px 12px rgba(0,0,0,0.06)` |
| `--shadow-md` | `0 4px 20px rgba(0,0,0,0.08)` |
| `--shadow-lg` | `0 8px 30px rgba(0,0,0,0.12)` |

### 3.5 Breakpoints responsive

| Breakpoint | Adaptations principales |
|------------|------------------------|
| `≤1024px` | Piliers 2 colonnes, aides/produits 1 colonne |
| `≤768px` | Menu hamburger, grilles 1 colonne, nav plein écran |
| `≤480px` | Font 16px, boutons full-width, badges empilés |
| `prefers-reduced-motion` | Animations désactivées |

### 3.6 Composants CSS principaux

| Composant | Classe(s) | Pages concernées |
|-----------|-----------|-----------------|
| Header sticky | `.header`, `.header__topbar`, `.header__main` | Toutes |
| Hero accueil | `.hero--home`, `.hero__grid`, `.hero__badges` | index |
| Hero sous-pages | `.hero--page` (fond bambou + overlay navy) | 7 pages |
| Pilier cards | `.pillar-card`, `.pillar-card__icon--*` | index |
| Feature cards | `.feature-card`, `.feature-card__icon` | index, salle-de-bain, amenagements |
| Product cards | `.product-card`, `.product-card__img` | monte-escaliers |
| Guide steps | `.guide-steps`, `.guide-step` (colorés, 6 couleurs) | conseils, aides-financieres |
| Aid cards | `.aid-card` | index |
| Amenagement items | `.amenagement-item` | amenagements |
| Service intro | `.service-intro`, `.service-intro--reverse` | monte-escaliers, salle-de-bain, amenagements, aides-financieres |
| Testimonial | `.testimonial-card` | index |
| Bandeau citation | `.quote-banner` (fond bambou + overlay) | toutes sauf mentions-legales |
| Nutrition stat | `.nutrition-stat`, `.nutrition-split` | conseils |
| Formulaire | `.form-card`, `.form-group`, `.form-row` | contact |
| Calendly | `.calendly-section`, `.calendly-inline-widget` | contact |
| Footer | `.footer`, `.footer__grid`, `.footer__bottom` | toutes |
| Boutons | `.btn--primary`, `--accent`, `--outline`, `--white`, `--lg`, `--sm` | toutes |
| Animations | `.fade-in` + `.visible` (IntersectionObserver) | toutes |

---

## 4. JavaScript (main.js)

| Fonctionnalité | Description |
|----------------|-------------|
| Menu mobile | Toggle `.menu-toggle` + `.nav.open`, verrouille le scroll du body |
| Header sticky | Ajoute `.scrolled` au header quand `scrollY > 10` |
| Animations scroll | `IntersectionObserver` sur `.fade-in` (threshold 0.15, rootMargin -40px) |
| Nav active | Met en surbrillance le lien correspondant à `window.location.pathname` |
| Formulaire contact | Simule l'envoi (désactive le bouton, affiche "Envoi en cours…" puis "Message envoyé ✓", reset après 3s) |

---

## 5. Images — Inventaire complet

| Fichier | Source | Utilisé dans | Description |
|---------|--------|-------------|-------------|
| `hero-seniors.jpg` | AI | index.html | Couple senior heureux dans leur salon |
| `accompagnement-conseil.jpg` | AI | index.html | Conseiller en visite à domicile |
| `visite-conseil.jpg` | AI | contact.html | Conseillère avec tablette chez des seniors |
| `monte-escalier.jpg` | AI | monte-escaliers.html | Monte-escalier droit installé |
| `monte-escalier-courbe.jpg` | AI | monte-escaliers.html | Monte-escalier courbe (ACORN) |
| `douche-securisee.jpg` | AI | salle-de-bain.html | Douche sécurisée avec barres et siège |
| `installateur-sdb.jpg` | AI | salle-de-bain.html | Installateur posant des barres de maintien |
| `amenagement-interieur.jpg` | AI | amenagements.html | Intérieur aménagé pour accessibilité |
| `sante-vitalite.jpg` | AI | conseils.html | Alimentation et compléments nutritionnels |
| `nutrition-seniors.jpg` | AI | conseils.html | Femme senior prenant des Oméga-3 |
| `dossier-aides.jpg` | AI | aides-financieres.html | Documents administratifs sur un bureau |
| `conseil-domicile.jpg` | AI | aides-financieres.html | Conseiller avec couple et plan d'aménagement |
| `bambous.jpg` | Ancien site | CSS (hero--page + quote-banner) | Fond bambou utilisé en background |

**Aucun doublon inter-pages.** `monte-escalier.jpg` apparaît 2× sur monte-escaliers.html (hero + product card UP Stairlift — même produit).

---

## 6. SEO — Récapitulatif

### 6.1 Balises par page

| Page | Title | Meta desc | Canonical | OG | Schema.org |
|------|-------|-----------|-----------|-----|-----------|
| index | ✅ | ✅ | ✅ | ✅ | LocalBusiness |
| monte-escaliers | ✅ | ✅ | ✅ | ✅ | Product |
| salle-de-bain | ✅ | ✅ | ✅ | ✅ | Service |
| amenagements | ✅ | ✅ | ✅ | ✅ | Service |
| conseils | ✅ | ✅ | ✅ | ✅ | Article |
| aides-financieres | ✅ | ✅ | ✅ | ✅ | FAQPage |
| contact | ✅ | ✅ | ✅ | ✅ | ContactPage |
| mentions-legales | ✅ | ✅ | ✅ | ✅ | — (noindex) |

### 6.2 Bonnes pratiques appliquées

- Titres uniques et optimisés par page (mots-clés locaux : Épinal, Vosges)
- Meta descriptions uniques ≤160 caractères
- URLs canoniques
- Open Graph pour le partage social
- Schema.org structuré (LocalBusiness, Product, Service, Article, FAQPage, ContactPage)
- `noindex` sur mentions légales
- `hreflang="fr"` implicite via `<html lang="fr">`
- Images avec `alt` descriptifs, `width`/`height`, `loading="lazy"` / `"eager"`

### 6.3 Manquant ou placeholder

- Fichiers favicon réels (`img/favicon-32x32.png`, `img/apple-touch-icon.png` — balises déjà en place)
- Image Open Graph **dédiée** 1200×630 (les pages pointent pour l’instant vers `hero-seniors.jpg`, fichier réel — à remplacer par un visuel client sur WP / Yoast)

**Déjà en place (maquette) :** `sitemap.xml`, `robots.txt`, redirections (`.htaccess`, `_redirects`) — voir `MIGRATION.md` C4 en **production WordPress** : sitemap/robots et `.htaccess` racine sont ceux de Yoast / WP, pas une copie aveugle du dépôt statique.

---

## 7. Accessibilité

| Fonctionnalité | Implémentation |
|----------------|---------------|
| Skip-link | `<a href="#main" class="skip-link">` sur chaque page |
| ARIA labels | `aria-label` sur menu toggle, liens téléphone |
| Focus visible | `outline: 3px solid var(--accent)` via `:focus-visible` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` — désactive transitions/animations |
| Sémantique | `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>` |
| Alt textes | Tous les `<img>` ont un `alt` descriptif |

---

## 8. Dépendances externes

| Ressource | URL | Pages |
|-----------|-----|-------|
| Google Fonts | `fonts.googleapis.com` (Playfair Display + Source Sans 3) | Toutes |
| Calendly CSS | `assets.calendly.com/assets/external/widget.css` | contact |
| Calendly JS | `assets.calendly.com/assets/external/widget.js` | contact |

Aucune autre dépendance (pas de jQuery, pas de framework CSS, pas de build tool).

---

## 9. Points nécessitant une intervention humaine

### 9.1 OBLIGATOIRE avant mise en ligne

| # | Action | Détail | Fichiers concernés |
|---|--------|--------|-------------------|
| 1 | **Numéro de téléphone** | `03 25 31 13 60` (`+33325311360`) | Toutes les pages (header + footer + contact) |
| 2 | **URL Calendly** | Créer le compte Calendly et remplacer `https://calendly.com/labienveillance/rdv` | contact.html |
| 3 | **Logo** | Fournir logo SVG ou PNG, le placer dans `img/`, remplacer l'emoji 🤝 dans le header | Toutes les pages |
| 4 | **Formulaire de contact** | **Prod WP :** Contact Form 7 (ou équivalent). *Maquette statique :* Formspree, PHP, etc. | contact.html, main.js ; puis thème WP |
| 5 | **Photos réelles** | Remplacer les images AI par des photos de réalisations réelles si disponibles | Toutes les pages |
| 6 | **Hébergement** | Choisir un hébergeur, configurer le domaine, déployer | — |

### 9.2 RECOMMANDÉ

| # | Action | Détail |
|---|--------|--------|
| 7 | **Favicon** | Créer un favicon 32×32 et apple-touch-icon 180×180 |
| 8 | **Google Analytics / GTM** | Ajouter le script de tracking |
| 9 | **sitemap.xml** | Générer et soumettre à Google Search Console |
| 10 | **robots.txt** | Créer avec référence au sitemap |
| 11 | **OG image** | Créer une image 1200×630 pour le partage social |
| 12 | **Photos monte-escaliers** | Photos spécifiques UP Stairlift vs ACORN |
| 13 | **Adresse postale** | Ajouter l'adresse exacte si souhaitée |
| 14 | **Horaires** | Confirmer "Lundi-Vendredi 9h-18h" ou ajuster |
| 15 | **Zone géographique** | Confirmer "Épinal et Vosges" ou étendre |
| 16 | **Témoignages** | Ajouter 2-3 témoignages clients réels |
| 17 | **Montants des aides** | Vérifier les chiffres avec la réglementation en vigueur |
| 18 | **Certificats SSL** | S'assurer que l'hébergeur fournit HTTPS |

### 9.3 Questions en suspens pour le client

| # | Question |
|---|---------|
| Q1 | Le guide "Bien vieillir chez soi" est-il un PDF téléchargeable ? Si oui, fournir le fichier et ajouter un lien de téléchargement sur `conseils.html`. |
| Q2 | Le partenariat Zinzino est-il actif ? Faut-il un lien affilié ou une landing page dédiée ? |
| Q3 | Y a-t-il des certifications ou labels à afficher (Qualibat, RGE, etc.) ? |
| Q4 | L'email `contact@labienveillance.fr` est-il bien le bon ? |
| Q5 | Faut-il une page "À propos" distincte ou l'introduction sur l'accueil suffit-elle ? |

---

## 10. Navigation du site

```
Accueil (index.html)
├── Monte-escaliers (monte-escaliers.html)
├── Salle de bain (salle-de-bain.html)
├── Aménagements (amenagements.html)
├── Conseils & Santé (conseils.html)
├── Aides (aides-financieres.html)
├── Contact (contact.html)
└── Mentions légales (mentions-legales.html)  [footer uniquement]
```

**Header :** Logo + téléphone (topbar) → Nav 7 liens + CTA "Devis gratuit"
**Footer :** 4 colonnes (marque, services, informations, contact) + copyright

---

## 11. Historique des modifications

| Date | Modification |
|------|-------------|
| — | Création du projet statique HTML/CSS/JS à partir de l'analyse de labienveillance.fr |
| — | Palette originale verte/dorée → refonte bleu marine (#1A365D) / orange (#E67E22) |
| — | Ajout de la page `aides-financieres.html` (absente du site original) |
| — | Intégration Calendly préparée sur `contact.html` |
| — | Génération de 12 images AI uniques (+ 1 récupérée de l'ancien site) |
| — | Application du fond bambou sur `.hero--page` et `.quote-banner` |
| — | Restyle complet des `.guide-step` (bordures colorées, coches, hover, 6 couleurs cycliques) |
| — | Suppression des galeries de réalisations vides (monte-escaliers + salle-de-bain) |
| — | Nettoyage CSS (suppression classes `.gallery-*` inutilisées) |
| — | Dédoublonnage complet des images (5 nouvelles images + 1 pour contact) |
| 31 mars 2026 | Mise en place GitHub Pages (Actions), script d’activation API, documentation § 12 + fichier d’archive agent |

---

## 12. Déploiement GitHub Pages (prévisualisation)

### 12.1 Rôle

- Héberger une **copie statique** de la maquette (HTML, CSS, JS, images) sur une **URL stable et gratuite**, pour **démo client** ou relecture, **sans** remplacer la production WordPress sur `labienveillance.fr`.
- Le dossier **`wp-theme/`** reste dans le dépôt Git mais **n’est pas publié** sur Pages (PHP non exécuté ; le déploiement utilise `rsync` avec exclusion de `wp-theme` dans `.github/workflows/pages.yml`).

### 12.2 URL à communiquer (démo)

| Usage | URL |
|--------|-----|
| **Maquette déployée (projet)** | `https://tilschenabbapro-sudo.github.io/labienveillance/` |
| **Dépôt** | `https://github.com/tilschenabbapro-sudo/labienveillance` |

Si un **domaine personnalisé** est configuré dans GitHub (**Settings → Pages**), communiquer plutôt ce domaine.

### 12.3 Compte GitHub gratuit

- **Pages gratuit** avec un dépôt **public**. Un dépôt **privé** + compte gratuit ne permet en général **pas** d’héberger Pages sans offre payante ; dans ce cas, utiliser un autre hébergeur (Cloudflare Pages, Netlify, Vercel).

### 12.4 Activation initiale (une fois par dépôt)

1. **Settings → Pages → Build and deployment → Source** : **GitHub Actions** (obligatoire avant le premier succès du workflow ; sinon l’étape `actions/configure-pages` échoue avec *Not Found*).
2. Chaque **`git push`** sur la branche **`main`** déclenche le workflow **Deploy GitHub Pages**.

Alternative sans interface : script `scripts/Enable-GitHubPages.ps1` (PAT avec scope `repo` ; variable d’environnement `GITHUB_TOKEN`). Voir commentaires en tête du script.

### 12.5 Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `.github/workflows/pages.yml` | Workflow : préparation `_site`, `upload-pages-artifact`, `deploy-pages` |
| `.nojekyll` | Désactive Jekyll sur Pages |
| `.gitignore` | Fichiers locaux / secrets à ne pas versionner |
| `scripts/Enable-GitHubPages.ps1` | Activation Pages en `build_type: workflow` via l’API REST |

### 12.6 Production finale

La mise en production prévue reste celle décrite en en-tête et dans `MIGRATION.md` (WordPress sur l’hébergement du client). L’URL GitHub Pages sert de **prévisualisation** ou de **partage temporaire**, pas de canon SEO (canonicals du site pointent vers `labienveillance.fr`).
