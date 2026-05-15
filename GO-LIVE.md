# GO-LIVE — La Bienveillance — Runbook condensé

> **Date prévue :** _à confirmer_  •  **Domaine :** labienveillance.fr  •  **Approche :** thème actif sur l'hébergement WordPress existant.
>
> Tous les livrables sont dans `dist/` (à la racine du dépôt) :
> - `dist/labienveillance-theme.zip` — Thème WordPress prêt à uploader (7,2 Mo)
> - `dist/labienveillance-migration-wp.zip` — mu-plugin + CF7 + redirections + Yoast (~30 Ko)

---

## 0. Pré-flight (CRITIQUE — à faire AVANT de cliquer sur quoi que ce soit)

| # | Action | Pourquoi |
|---|---|---|
| 0.1 | **Sauvegarde complète** du WP actuel (BDD + `wp-content/`) | Filet de sécurité — si quelque chose dérape, rollback en 5 min |
| 0.2 | **Activer le mode maintenance** (plugin « WP Maintenance » ou via `.maintenance`) | Pas de visiteur pendant la bascule |
| 0.3 | Vérifier la **version PHP** ≥ 8.0 (PHP 8.2.30 sur l'hébergement actuel ✅) | Le thème déclare `function …(): array` (typage de retour PHP 7+) |
| 0.4 | Lister les **plugins actifs** actuellement, screenshot | Si on doit revenir en arrière, on sait quoi réactiver |
| 0.5 | Noter l'**URL admin actuelle** (`labienveillance.fr/admin/` est une PAGE WP, pas le wp-admin) | Important pour ne pas se mélanger les pinceaux |

---

## 1. Installer le thème (5 min)

1. **Téléverser** `dist/labienveillance-theme.zip` via `Apparence → Thèmes → Ajouter → Téléverser un thème`.
2. **Ne pas activer immédiatement** : copier d'abord le mu-plugin (étape 2).
3. Vérifier que le dossier `wp-content/themes/labienveillance/` existe bien après upload.

## 2. Installer le mu-plugin (3 min)

1. Dézipper `dist/labienveillance-migration-wp.zip` localement.
2. Via FTP/SFTP ou gestionnaire de fichiers, créer le dossier `wp-content/mu-plugins/` s'il n'existe pas.
3. Déposer `mu-plugin-labienveillance-config.php` dans `wp-content/mu-plugins/`.
4. Vérifier dans `Extensions → Indispensables` que **« La Bienveillance — Config »** est listé (pas de bouton activer/désactiver, c'est normal).

## 3. Installer les plugins requis (10 min)

| Plugin | Source | Notes |
|---|---|---|
| **Contact Form 7** | wordpress.org | Formulaire de contact |
| **Honeypot for Contact Form 7** | wordpress.org | Anti-spam — obligatoire |
| **Flamingo** | wordpress.org | Backup des messages CF7 — recommandé |
| **WP Mail SMTP** | wordpress.org | Délivrabilité — recommandé (config OVH/Brevo) |
| **Yoast SEO** | wordpress.org | SEO (déjà présent sur l'ancien site ?) |
| **Redirection** | wordpress.org | 301 |

## 4. Activer le thème (1 min)

`Apparence → Thèmes → La Bienveillance → Activer`.

> Si erreur fatale : désactiver via FTP en renommant `wp-content/themes/labienveillance/` → fix → re-renommer.

## 5. Créer les pages WordPress (15 min)

Créer **dans cet ordre** (titre + slug + modèle de page) :

| Titre | Slug | Modèle de page |
|---|---|---|
| Accueil | (accueil) | _Front page_ (Réglages → Lecture : Page d'accueil statique) |
| Monte-escaliers | `monte-escaliers` | Monte-escaliers |
| Salle de bain | `salle-de-bain` | Salle de bain |
| **Devis estimatif monte-escalier** | **`estimation-monte-escalier`** | **Estimation monte-escalier** (ou laisser vide : `page-estimation-monte-escalier.php` s’applique au slug) |
| **Estimation douche** | **`estimation-douche`** | **Estimation douche / salle de bain** (ou laisser vide : `page-estimation-douche.php` s’applique au slug) |
| Aménagements | `amenagements` | Aménagements |
| Santé & vitalité | `sante-vitalite` | Santé & vitalité |
| Conseil à domicile | `conseil-domicile` | Conseil à domicile |
| Contact | `contact` | Contact |
| Politique de confidentialité | `mentions-legales` | Mentions légales |
| Embed devis JLM | `embed-devis-jlm` | Embed — Devis JLM seul |

> Le contenu des pages **peut rester vide** : les modèles PHP fournissent tout. La page Embed doit obligatoirement utiliser le modèle « Embed — Devis JLM seul » (sans header/footer).

**Automatisation (recommandé)** : avec les identifiants du fichier `dist/.creds.env` ou `.creds.env`, exécuter `python scripts/golive/23_create_estimation_pages.py` — crée les deux pages estimation si elles n’existent pas encore (API REST).

**Réglages → Permaliens** → choisir **« Nom de l'article »** (pour avoir `/contact/` et non `/?p=42`).

## 6. Créer le formulaire CF7 (5 min)

1. `Contact → Ajouter` → nommer **« Contact La Bienveillance »**.
2. **Onglet Formulaire** : remplacer le contenu par le gabarit de `migration-wp/cf7/contact-form.txt`.
3. **Onglet E-mail** : copier `migration-wp/cf7/contact-mail-to-admin.txt`. Activer le 2e e-mail (accusé) avec `contact-mail-to-user.txt`.
4. **Onglet Messages** : reporter les chaînes FR de `contact-messages.txt`.
5. **Onglet Additional Settings** : ajouter `flamingo_email: "[your-email]"` si Flamingo est installé.
6. Cliquer **Enregistrer**.
7. **Copier l'ID** affiché dans l'URL (`post=42` → ID = 42).

## 7. Brancher le formulaire (1 min)

Éditer `wp-content/mu-plugins/mu-plugin-labienveillance-config.php` → remplacer la ligne `define( 'LBV_CONTACT_CF7_ID', 0 );` par l'ID copié à l'étape précédente.

## 8. Configurer Yoast SEO (15 min)

Suivre **`migration-wp/yoast-config.md`** :

- Réglages → Représentation du site → OG image par défaut : uploader `og-labienveillance.jpg`.
- Pour chaque page WP : reporter le **Titre SEO**, **Méta-description**, et la **case `noindex`** pour `mentions-legales` et `embed-devis-jlm`.
- Activer le **schema Organization** + **LocalBusiness** sur l'accueil.

## 9. Importer les redirections 301 (5 min)

1. `Outils → Redirection` → onglet « Import/Export ».
2. Importer `migration-wp/redirections-wp.csv` (format CSV).
3. Vérifier que les 30+ règles sont bien chargées (groupes : `maquette`, `slugs`, `nettoyage`).
4. **Supprimer manuellement** la page WordPress `/admin/` héritée de l'ancien site (`Pages → Toutes les pages → admin → Mettre à la corbeille`). La redirection 301 (déjà importée) ferait double emploi sinon.

## 10. WP Mail SMTP — délivrabilité (10 min, recommandé)

Configurer l'expéditeur : `contact@labienveillance.fr` (cf. `wp_mail_from` filtre déjà dans le mu-plugin). Backend : SMTP OVH ou Brevo (anciennement Sendinblue, gratuit < 300 mails/jour).

## 11. Tests fonctionnels (15 min)

Cocher **tout** avant de désactiver le mode maintenance :

- [ ] Accueil charge OK (HTTP 200, design conforme à `index.html` de la maquette)
- [ ] Header : logo affiché à la bonne taille, téléphone cliquable, menu navigation OK
- [ ] Footer : 4 colonnes, lien « Confidentialité » présent (pas « Mentions légales »), pas de lien « Parrainage »
- [ ] Page **`/estimation-monte-escalier/`** : configurateur JLM intégré (pas d’iframe) — clic « Escalier droit », photo OK (pas de 404 vers wpcomstaging)
- [ ] Page **`/estimation-douche/`** : configurateur douche (23 étapes, pas 24, pas d’étape « Meubles »), photos depuis le thème
- [ ] Pages **Monte-escaliers** et **Salle de bain** : **sans** `#jlmLiteAppRoot` / `#jlmDoucheAppRoot` dans le HTML ; le CTA « Devis estimatif en ligne » pointe vers les URLs ci-dessus
- [ ] À la fin du configurateur SDB : bouton « Envoyer mon projet » → redirige vers `/contact/?projet=devis-sdb&total=…&recap=…` et le formulaire est pré-rempli
- [ ] Page **Contact** : formulaire envoie, e-mail reçu côté `contact@labienveillance.fr`, accusé reçu côté visiteur
- [ ] Page **404** : design custom, liens vers services
- [ ] Anciennes URLs : `/parrainage.html`, `/admin/`, `/monte-escalier.html` redirigent en 301 (test : `curl -I https://labienveillance.fr/parrainage.html`)
- [ ] `og:image` rendu sur Facebook/LinkedIn (debugger : developers.facebook.com/tools/debug/)
- [ ] Lighthouse mobile : objectif Performance ≥ 80, SEO 100, Accessibility ≥ 90

## 12. GO ! (1 min)

- [ ] Désactiver le mode maintenance
- [ ] Forcer le ré-indexage : `Yoast → Outils → Indexation` + `Search Console → demander indexation`
- [ ] Notifier le client

---

## Rollback (en cas de problème majeur)

1. Réactiver le mode maintenance
2. `Apparence → Thèmes` → réactiver l'ancien thème
3. Restaurer la BDD depuis la sauvegarde 0.1
4. Désactiver le mode maintenance
5. Diagnostiquer à froid

---

## Post go-live (sous 7 jours)

- [ ] Recevoir les **mentions légales société** du client (raison sociale, SIRET, capital, hébergeur, directeur de publication) → injecter dans `page-mentions-legales.php` (section LCEN à ajouter)
- [ ] Décider de l'**activation Calendly** (filtre `labienveillance_calendly_url` dans le mu-plugin)
- [ ] Décider de la **réactivation Parrainage** (cf. `migration-wp/redirections-wp.md` § 4.5)
- [ ] Si le client envoie de **vraies photos de chantiers** → injection via filtres `labienveillance_devis_sdb_config` (SDB) et `labienveillance_jlm_images` (monte-escalier), pas de redéploiement
