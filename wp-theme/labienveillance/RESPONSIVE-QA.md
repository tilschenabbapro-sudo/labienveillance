# Grille QA — Responsive (La Bienveillance, thème WordPress)

Document de contrôle pour valider le site **après chaque livraison** touchant au layout. Cocher **Clair** et **Sombre** (`data-theme`) pour chaque largeur.

## 1. Largeurs de test (priorité iPhone)

| # | Largeur | Hauteur indicative | Appareil / usage |
|---|---------|-------------------|------------------|
| 1 | 375 × 812 | Portrait | iPhone X–13 mini |
| 2 | 390 × 844 | Portrait | iPhone 14–15 |
| 3 | 393 × 852 | Portrait | Pixel / Android ref. |
| 4 | 414 × 896 | Portrait | iPhone Plus |
| 5 | 428 × 926 | Portrait | iPhone Pro Max |
| 6 | 390 × 390 | Paysage court | Modales / hero |
| 7 | 768 × 1024 | Portrait | Seuil « tablette » thème |
| 8 | 1024 × 768 | Paysage | Desktop compact |

Outils : DevTools responsive, ou Safari Web Inspector sur appareil réel.

## 2. Breakpoints CSS du thème (référence)

| Fichier | Seuils |
|---------|--------|
| `style.css` | 1024, 768, 560 (tabs), 480 |
| `jlm-lite-devis.css` / `jlm-douche-app.css` | 640, 768 (grilles), 800, 560, 900 (WC douche) |

## 3. Pages à parcourir systématiquement

Pour chaque page : pas de **scroll horizontal** involontaire, pas de texte coupé de façon illisible, CTA utilisables.

- [ ] `/` — Accueil (`front-page.php` + `template-parts/home-front.php`)
- [ ] `/monte-escaliers/` — page service (sans configurateur intégré)
- [ ] `/salle-de-bain/` — page service (sans configurateur intégré)
- [ ] `/estimation-monte-escalier/` — configurateur JLM
- [ ] `/estimation-douche/` — configurateur douche
- [ ] `/amenagements/`
- [ ] `/conseils/`
- [ ] `/aides-financieres/`
- [ ] `/contact/` — CF7 ou formulaire statique ; Calendly si filtre actif
- [ ] `/mentions-legales/`
- [ ] `/parrainage/` (si publiée)
- [ ] `/embed-devis-jlm/` — page minimale (viewport + safe-area)
- [ ] Une URL **404** volontaire

## 4. Checklist par zone (toutes pages concernées)

### En-tête & navigation

- [ ] Logo lisible, ne chevauche pas le burger / thème
- [ ] `menu-toggle` et `theme-toggle` ≥ 44×44 px (≤768 px)
- [ ] Menu plein écran : contenu sous encoche / home indicator OK
- [ ] Fermeture : lien touché, **Échap** ferme le menu
- [ ] Sous-menu « Nos services » : tap ouvre/ferme (mobile)
- [ ] Pas de scroll de fond iOS quand le menu est ouvert (body lock)

### Contenu général

- [ ] `.container` : marges latérales + safe-area (bords arrondis iPhone)
- [ ] Grilles 2 colonnes → 1 colonne ≤768 px (hero, services, contact, produits)
- [ ] Images / cartes : pas de débordement (`min-width: 0` sur colonnes grid)
- [ ] Fil d’Ariane hero : zone tactile lien ≥44 px hauteur (≤768 px)

### Modale « Choix devis »

- [ ] Panneau centré, bouton fermer ≥44×44, safe-area respectée

### Formulaires & CF7

- [ ] Champs **≥16 px** côté iOS (≤768 px : règles `.wpcf7`)
- [ ] Bouton envoi pleine largeur, hauteur confortable

### Configurateurs JLM (monte-escalier + douche)

- [ ] ≤560 px : une colonne, barre progression lisible
- [ ] Boutons **Retour / Suivant / Réinitialiser** : min-height 48 px, empilés
- [ ] SDB : modale « Conseils » et back-office ne sortent pas de l’écran (`dvh`)

### Pied de page

- [ ] Dernier bloc au-dessus de l’indicateur d’accueil (safe-bottom)

### Légal

- [ ] `pre` / `code` / tableaux : scroll horizontal si contenu large

### Calendly (si actif)

- [ ] Widget dans `.calendly-inline-widget--responsive` : pas de débordement horizontal

## 5. Automatisation (à relancer après gros changements)

```bash
npx lighthouse https://labienveillance.fr/ --only-categories=performance,accessibility,best-practices,seo --screenEmulation.mobile=true --form-factor=mobile --output=html --output-path=lh-accueil-mobile.html
```

Sous **Windows**, si Lighthouse renvoie `EPERM` sur le dossier temporaire système, fixer `TMP` / `TEMP` sur la racine du dépôt avant la commande, par exemple :

```powershell
$env:TMP = (Get-Location).Path; $env:TEMP = $env:TMP
npx --yes lighthouse@11.7.1 "https://labienveillance.fr/contact/" --only-categories=performance,accessibility --screenEmulation.mobile=true --form-factor=mobile --output=json --output-path=lighthouse-contact-mobile.json
```

**Exemple de mesure locale** (réseau + GTM variables) : `/contact/` mobile — Performance **71**, Accessibilité **92** (Lighthouse 11.7).

Répéter pour `/`, `/estimation-douche/`, `/estimation-monte-escalier/`. Conserver les rapports HTML dans un dossier interne (hors dépôt ou listés dans `.gitignore`).

## 6. Non-régression desktop

Après session mobile : vérifier **≥1200 px** menu déroulant « Nos services », hero 2 colonnes, pas de scrollbar horizontale sur le nav desktop.

---

**Dernière passe complète (thème)** : correctifs safe-area, scroll lock menu iOS, grilles `min-width: 0`, CF7 16 px, Calendly responsive, légal overflow, alignement breakpoints JLM 768 px, embed devis viewport-fit, touches configurateurs 48 px.
