# Configuration **Yoast SEO** — La Bienveillance (WordPress)

> Cible : `https://labienveillance.fr/`
> Source des valeurs : maquette HTML statique du dépôt (validée 31 mars 2026).
> À reprendre **page par page** dans Yoast après création des pages WP (slugs alignés sur `wp-theme/README.md`).

Yoast prime sur les balises générées par défaut par WordPress / le thème : c’est lui qui sortira `<title>`, `meta description`, `canonical`, `og:*`, `twitter:*` et le schema JSON-LD en production.

---

## 0. Réglages globaux Yoast

### 0.1 Réglages de base
- **SEO → Réglages → Représentation du site**
  - **Type d’organisation** : *Organisation*
  - **Nom de l’organisation** : `La Bienveillance`
  - **Logo de l’organisation** : logo carré (≥ 696×696 px, format PNG ou SVG) — **à fournir** (cf. `MIGRATION.md` A1.2)
  - **Image par défaut OG / Twitter** : visuel 1200×630 px — **à fournir** (cf. `MIGRATION.md` A2.13)
- **SEO → Réglages → Réseaux sociaux**
  - À remplir si comptes ouverts par le client (laisser vide sinon).

### 0.2 Plans de site XML
- **SEO → Réglages → Fonctionnalités → Plans de site XML : Activé**.
- L’URL `https://labienveillance.fr/sitemap_index.xml` **doit revenir 200**. C’est l’URL qui retournait **500** sur l’ancien site — vérifier qu’elle fonctionne après réactivation Yoast et **soumettre** à Google Search Console.
- Dans **Apparence pour la recherche → Types de contenu → Pages**, vérifier que les pages sont incluses dans le sitemap.

### 0.3 Apparence pour la recherche
- **Apparence pour la recherche → Général → Séparateur de titre** : `–` (tiret demi-cadratin), c’est celui utilisé dans la maquette (`Titre – La Bienveillance`).
- **Apparence pour la recherche → Page d’accueil** :
  - **Titre SEO** : `Monte-escalier & Douche sénior à Épinal – La Bienveillance`
  - **Méta description** : `La Bienveillance vous accompagne pour bien vieillir chez soi : monte-escaliers, douches sécurisées, aménagement du domicile. Devis gratuit dans les Vosges.`
- **Apparence pour la recherche → Pages → Type de contenu** : `Indexer : Oui`.
- **Apparence pour la recherche → Articles** : laisser sur `Indexer : Oui` même si pas d’articles aujourd’hui (réserve pour un blog futur).
- **Apparence pour la recherche → Taxonomies → Catégories / Étiquettes** : **`Indexer : Non`** (pas utilisées).
- **Apparence pour la recherche → Médias → Pages d’attachement** : **`Désactivées (rediriger vers le fichier)`**.

### 0.4 Catégories à exclure du sitemap

Pages avec `noindex` (le thème les marque déjà via `wp_robots`, mais Yoast prend la main quand il est actif) :
- `/mentions-legales/`

Pour cette page : éditer la page → métabox Yoast → onglet **Avancé** → **Autoriser les moteurs de recherche à afficher cette page dans les résultats ? : Non** (= `noindex, follow`).

> _Note&nbsp;: la page `/parrainage/` n'est volontairement **pas créée** au go-live (programme reporté). Le thème conserve un `noindex` défensif si elle l'était. Voir `redirections-wp.md` § 4.5._

---

## 1. Configuration **page par page**

Pour chaque page : créer la page WP avec le **slug exact**, puis dans la métabox Yoast :

- **Onglet SEO** :
  - *Snippet preview* → **Titre SEO**, **Slug**, **Méta description**, **Mot-clé principal**.
  - *Avancé* → **Méta robots** (laisser sur `Index, Follow` sauf mentions ci-dessous), **Canonical** (laisser vide pour utiliser le permalien).
- **Onglet Social** :
  - **Facebook (OG)** → **Titre OG**, **Description OG**, **Image OG**.
  - **X / Twitter** → si différent de OG.
- **Onglet Schéma** :
  - **Type de page** (= `WebPage`, `ContactPage`, `FAQPage`, `AboutPage`…), **Type d’article** (vide pour les pages).

### 1.1 Accueil — slug `accueil` (page front statique)

Concept : `/`

| Champ Yoast | Valeur |
|---|---|
| Titre SEO | `Monte-escalier & Douche sénior à Épinal – La Bienveillance` |
| Slug | `accueil` (ou laisser le réglage *Page d’accueil* gérer la chose) |
| Méta description | `La Bienveillance vous accompagne pour bien vieillir chez soi : monte-escaliers, douches sécurisées, aménagement du domicile. Devis gratuit dans les Vosges.` |
| Mot-clé principal | `monte-escalier Épinal` |
| Canonical | `https://labienveillance.fr/` |
| Titre OG | `La Bienveillance – Monte-escalier, douche sénior, aménagement du domicile` |
| Description OG | identique à la méta description |
| Image OG | visuel dédié 1200×630 (sinon `hero-seniors.jpg` en attendant) |
| Type de page Schema | `WebPage` |
| Yoast Local SEO (option payante) ou Schema → Organisation | `LocalBusiness` (Épinal, Vosges) — voir § 2.1 |

### 1.2 Monte-escaliers — slug `monte-escaliers`

| Champ | Valeur |
|---|---|
| Titre SEO | `Monte-escalier : installation dès 29€/mois – La Bienveillance` |
| Slug | `monte-escaliers` |
| Méta description | `Installation de monte-escaliers. Modèles Up Stairlift et Acorn, neufs ou reconditionnés, location dès 29€/mois. Devis gratuit.` |
| Mot-clé principal | `monte-escalier` |
| Canonical | `https://labienveillance.fr/monte-escaliers/` |
| Titre OG | `Monte-escalier – La Bienveillance` |
| Description OG | `Retrouvez votre liberté de mouvement avec nos monte-escaliers adaptés. Installation rapide, garantie à vie sur le rail.` |
| Image OG | image dédiée OU `monte-escalier.jpg` |
| Type de page Schema | `WebPage` |
| Schema produit | voir § 2.2 (`Product`, `Up Stairlift`, `Acorn`, offre 29€/mois) |

### 1.3 Salle de bain — slug `salle-de-bain`

| Champ | Valeur |
|---|---|
| Titre SEO | `Remplacement baignoire par douche sénior – La Bienveillance` |
| Slug | `salle-de-bain` |
| Méta description | `Transformez votre baignoire en douche sécurisée en une journée. Sol antidérapant, siège intégré, barres de maintien. Devis gratuit.` |
| Mot-clé principal | `douche sécurisée senior` |
| Canonical | `https://labienveillance.fr/salle-de-bain/` |
| Titre OG | `Douche sécurisée – La Bienveillance` |
| Description OG | `Remplacement de baignoire par douche adaptée pour seniors. Installation en une journée, sans dégâts.` |
| Image OG | `douche-securisee.jpg` ou visuel dédié |
| Type de page Schema | `WebPage` |
| Schema service | `Service` (voir § 2.3) |

### 1.4 Aménagements — slug `amenagements`

| Champ | Valeur |
|---|---|
| Titre SEO | `Aménagement logement perte d'autonomie – La Bienveillance` |
| Slug | `amenagements` |
| Méta description | `Aménagement du logement pour la perte d'autonomie : éclairage, domotique, WC surélevé, poignées de maintien, sols antidérapants. Devis gratuit.` |
| Mot-clé principal | `aménagement logement senior` |
| Canonical | `https://labienveillance.fr/amenagements/` |
| Titre OG | `Aménagement du domicile pour seniors – La Bienveillance` |
| Description OG | `Adaptez votre logement à la perte d'autonomie avec nos solutions sur mesure : domotique, éclairage, accessibilité.` |
| Image OG | `amenagement-interieur.jpg` ou visuel dédié |
| Type de page Schema | `WebPage` |
| Schema service | `Service` (voir § 2.3) |

### 1.5 Conseils & Santé — slug `conseils`

| Champ | Valeur |
|---|---|
| Titre SEO | `Guide bien vieillir chez soi : conseils pratiques – La Bienveillance` |
| Slug | `conseils` |
| Méta description | `Guide pratique pour bien vieillir chez soi : alimentation, adaptation du logement, bien-être psychologique, aides financières. Conseils nutrition et équilibre Oméga 3/6.` |
| Mot-clé principal | `bien vieillir chez soi` |
| Canonical | `https://labienveillance.fr/conseils/` |
| Titre OG | `Conseils pour bien vieillir chez soi – La Bienveillance` |
| Description OG | `Découvrez notre guide complet et nos conseils santé pour maintenir votre autonomie et votre vitalité.` |
| Image OG | `nutrition-seniors.jpg` ou visuel dédié |
| Type de page Schema | `Article` |
| Type d’article Schema | `Article` (publisher : La Bienveillance) |

### 1.6 Aides financières — slug `aides-financieres`

| Champ | Valeur |
|---|---|
| Titre SEO | `Aides financières monte-escalier & douche sénior – La Bienveillance` |
| Slug | `aides-financieres` |
| Méta description | `Toutes les aides financières pour adapter votre logement : crédit d'impôt 25%, Ma Prime Adapt', APA, aides ANAH, TVA réduite. Accompagnement pour monter votre dossier.` |
| Mot-clé principal | `aides financières adaptation logement` |
| Canonical | `https://labienveillance.fr/aides-financieres/` |
| Titre OG | `Aides financières pour l'adaptation du logement – La Bienveillance` |
| Description OG | `Ma Prime Adapt', crédit d'impôt, APA… découvrez toutes les aides pour financer votre monte-escalier, douche sécurisée ou aménagement.` |
| Image OG | `dossier-aides.jpg` ou visuel dédié |
| Type de page Schema | `FAQPage` |
| FAQ | voir § 2.4 (4 questions/réponses) |

### 1.7 Contact — slug `contact`

| Champ | Valeur |
|---|---|
| Titre SEO | `Contactez La Bienveillance – Devis gratuit monte-escalier & douche` |
| Slug | `contact` |
| Méta description | `Contactez La Bienveillance pour un devis gratuit : monte-escalier, douche sécurisée, aménagement du domicile. Réponse rapide garantie.` |
| Mot-clé principal | `contact La Bienveillance` |
| Canonical | `https://labienveillance.fr/contact/` |
| Titre OG | `Contact – La Bienveillance` |
| Description OG | `Demandez votre devis gratuit pour monte-escalier, douche adaptée ou aménagement du domicile.` |
| Image OG | `visite-conseil.jpg` ou visuel dédié |
| Type de page Schema | `ContactPage` |

### 1.8 Mentions légales — slug `mentions-legales`

| Champ | Valeur |
|---|---|
| Titre SEO | `Mentions légales et politique de confidentialité – La Bienveillance` |
| Slug | `mentions-legales` |
| Méta description | `Mentions légales, politique de confidentialité et politique de cookies du site labienveillance.fr.` |
| Méta robots (Avancé) | **`noindex, follow`** |
| Canonical | `https://labienveillance.fr/mentions-legales/` |
| Type de page Schema | `WebPage` |

### 1.9 Parrainage — _différé après le go-live_

> Page **non créée** pour la mise en ligne (programme de parrainage reporté).
> Quand le contenu sera prêt&nbsp;: créer la page WP avec slug `parrainage`,
> remettre le lien dans le footer (`footer.php` + maquettes HTML),
> basculer la 301 `/parrainage.html → /` vers `/parrainage/` dans le CSV,
> puis configurer Yoast (titre, méta, OG ; laisser `noindex, follow` tant
> que le contenu n'est pas finalisé).

---

## 2. Schémas JSON-LD (équivalent aux balises `<script type="application/ld+json">` de la maquette)

### 2.1 Accueil — LocalBusiness

À configurer dans **Yoast → Réglages → Représentation du site** (ou via **Yoast Local SEO** payant) :

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "La Bienveillance",
  "description": "Monte-escaliers, douches sécurisées et aménagement du domicile pour bien vieillir chez soi à Épinal et dans les Vosges.",
  "url": "https://labienveillance.fr",
  "email": "contact@labienveillance.fr",
  "telephone": "+33325311360",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Épinal",
    "addressRegion": "Vosges",
    "addressCountry": "FR"
  },
  "areaServed": [
    { "@type": "City", "name": "Épinal" },
    { "@type": "AdministrativeArea", "name": "Vosges" }
  ]
}
```

Confirmer **adresse postale exacte** et **horaires** (cf. `MIGRATION.md` A2.7 et A2.8) avant publication. Sans Yoast Local SEO, ce JSON-LD peut être ajouté via :
- option **Yoast → Apparence pour la recherche → Données structurées**, ou
- un **mu-plugin** qui injecte le bloc dans `wp_head` (alternative économique).

### 2.2 Monte-escaliers — Product

Yoast ne génère pas de `Product` automatiquement. Deux options :
1. Ajouter un **bloc Yoast Product structured data** (extension Premium) **non requis** pour cette page.
2. Injecter manuellement le JSON-LD via mu-plugin uniquement sur `is_page('monte-escaliers')` :

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Monte-escalier",
  "description": "Monte-escaliers adaptés aux escaliers droits ou tournants, neufs, reconditionnés ou en location.",
  "brand": [
    { "@type": "Brand", "name": "Up Stairlift" },
    { "@type": "Brand", "name": "Acorn" }
  ],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": "29",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "description": "Location à partir de 29€ par mois"
  }
}
```

### 2.3 Salle de bain et Aménagements — Service

Yoast ne propose pas non plus `Service`. Idem § 2.2 : à injecter via mu-plugin si l’on veut conserver le markup de la maquette.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Remplacement baignoire par douche sécurisée",
  "description": "Transformation de baignoire en douche sécurisée pour seniors, avec sol antidérapant, barres de maintien et siège intégré.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "La Bienveillance",
    "url": "https://labienveillance.fr"
  },
  "areaServed": { "@type": "Country", "name": "France" }
}
```

(Et l’équivalent « Aménagement du logement pour seniors » sur `/amenagements/`.)

### 2.4 Aides financières — FAQPage

Yoast **gère nativement** les blocs FAQ via le bloc Gutenberg « Yoast FAQ ». Recoller les 4 paires question/réponse de `aides-financieres.html` :

1. **Peut-on bénéficier d'un crédit d'impôt pour un monte-escalier ?** — *Oui, un crédit d'impôt de 25 % est accessible pour les équipements d'accessibilité et d'adaptation du logement (monte-escalier, douche sécurisée, barres de maintien, etc.), dans la limite de 5 000 € pour une personne seule et 10 000 € pour un couple.*
2. **Qu'est-ce que Ma Prime Adapt' ?** — *Ma Prime Adapt' est une aide de l'ANAH destinée aux personnes âgées ou en situation de handicap souhaitant adapter leur logement. Elle peut couvrir de 50 % à 70 % du montant des travaux selon vos revenus, dans la limite de 22 000 € HT.*
3. **Qu'est-ce que l'APA et comment en bénéficier ?** — *L'Allocation Personnalisée d'Autonomie (APA) est versée par le département aux personnes de 60 ans et plus en perte d'autonomie (GIR 1 à 4). Elle peut financer des aménagements du domicile dans le cadre d'un plan d'aide personnalisé.*
4. **Faut-il avancer les frais ?** — *Cela dépend des aides. Certaines, comme Ma Prime Adapt', peuvent faire l'objet d'un versement anticipé. Le crédit d'impôt est déduit l'année suivante (ou versé si vous n'êtes pas imposable).*

→ Yoast génère automatiquement le `FAQPage` JSON-LD à partir du bloc.

### 2.5 Conseils — Article

Le contenu de la maquette est très long et structuré : Yoast détectera correctement `Article` quand on définit *Type de page Schema = Article* + *Type d’article = Article*. La sortie inclura `headline`, `description`, `author`, `publisher` automatiquement à partir des réglages globaux et du H1.

### 2.6 Contact — ContactPage

Standard via le réglage *Type de page Schema = ContactPage*. Yoast lie automatiquement `mainEntity = LocalBusiness` au schéma global de l’organisation (§ 2.1).

---

## 3. Hreflang et lang

- `<html lang="fr">` est sorti par WordPress automatiquement (réglage **Réglages → Général → Langue du site = Français**).
- Pas de version anglaise prévue → ne pas activer hreflang.

---

## 4. Lien Search Console

1. **Search Console → Ajouter une propriété** → propriété **Domaine** : `labienveillance.fr`.
2. Vérification DNS via TXT (à demander au registrar — cf. `MIGRATION.md` D1).
3. Une fois validée :
   - **Soumettre le sitemap** : `https://labienveillance.fr/sitemap_index.xml` (≠ historique 500).
   - Surveiller la **couverture** et les **pages exclues** (`mentions-legales`).
   - Vérifier la **migration** (URL change) : pas nécessaire si l’on reste sur le même domaine, juste reconfigurer slugs et redirections.

## 5. GTM / GA4 (rappel — pas Yoast)

GTM est déjà câblé dans `wp-theme/labienveillance/functions.php` via la constante `LABIENVEILANCE_GTM_ID = 'GTM-NZVHPJ3Z'` (équivalent du script de la maquette). Pour désactiver, retourner `''` via `add_filter( 'labienveillance_gtm_container_id', fn() => '' )`.

GA4 → à configurer **dans GTM**, pas en hard-codé dans le thème.

---

## 6. Checklist de recette SEO (avant retrait du `noindex` global éventuel)

```
□ 7 pages publiques accessibles aux URL canoniques (slugs alignés)
□ Yoast actif, sitemap_index.xml = 200, soumis à Search Console
□ Title et meta description uniques par page (cf. § 1)
□ canonical correct (=permalien)
□ OG image dédiée OU image existante référencée (1200×630)
□ noindex sur mentions-legales (page parrainage non publiée pour le go-live)
□ FAQ Yoast sur aides-financieres
□ Schema JSON-LD : LocalBusiness (accueil), Product (monte-escaliers),
  Service (sdb / amenagements), FAQPage (aides), Article (conseils),
  ContactPage (contact)
□ Redirections 301 importées et testées (cf. redirections-wp.csv)
□ wp-admin / wp-login / wp-content fonctionnels (aucune redirection ne casse l’admin)
□ Lighthouse SEO ≥ 95 sur les 7 pages publiques
□ Test mobile-friendly OK (Search Console)
```
