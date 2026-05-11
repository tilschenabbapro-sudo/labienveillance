# Redirections 301 — plugin **Redirection** (WP)

> Cible : `labienveillance.fr` (WordPress, hébergement actuel).
> Plugin : [Redirection](https://wordpress.org/plugins/redirection/) de John Godley — gratuit, géré dans **Outils → Redirection**.

## 1. À ne JAMAIS faire

Le `.htaccess` et `_redirects` du dépôt **statique** contiennent ces règles :

```
RedirectMatch 301 ^/wp-login\.php$ /
RedirectMatch 301 ^/wp-admin(.*)$  /
RedirectMatch 301 ^/wp-content(.*)$  /
RedirectMatch 301 ^/wp-includes(.*)$ /
RedirectMatch 301 ^/xmlrpc\.php$ /
```

Elles existent **parce que la maquette statique n’a pas WordPress**. Sur la prod WP :

> **Ne jamais ajouter ces règles** : elles **couperaient l’accès à `/wp-admin`, `/wp-content`, `/wp-login.php`** — donc à toute l’administration et à tous les médias / thèmes / plugins.

Si quelqu’un copie le `.htaccess` du dépôt à la racine WP, **le restaurer** depuis WordPress (Réglages → Permaliens → Enregistrer regénère le `.htaccess` standard).

## 2. Import CSV (chemin recommandé)

1. **Plugins → Ajouter → Redirection → Installer puis Activer**.
2. Suivre l’assistant initial (laisser **« Surveiller les modifications de permaliens »** activé pour les futurs renommages côté Pages).
3. **Outils → Redirection → Importer/Exporter → CSV**.
4. Choisir le fichier [`redirections-wp.csv`](redirections-wp.csv) → **Téléverser**.
5. Le plugin propose un **groupe** ; on a déjà préparé `services`, `maquette`, `devis` dans la colonne `group` du CSV. Si le plugin ne respecte pas les groupes, recréer 3 groupes dans **Groupes** puis re-affecter en bloc.

Le fichier suit le format **Source URL, Target URL, HTTP code, Regex, Group, Enabled**, accepté par Redirection (les commentaires `#` sont ignorés à l’import).

## 3. Vérifications après import

| Action | Comment |
|---|---|
| Test `/monte-escalier/` (singulier) | Doit renvoyer **301** vers `/monte-escaliers/` |
| Test `/monte-escaliers.html` | Doit renvoyer **301** vers `/monte-escaliers/` |
| Test `/elementor-1985/` | Doit renvoyer **301** vers la page WP qui porte le modèle « Devis estimatif monte-escalier (JLM) » (slug suggéré `devis-estimatif`) |
| `wp-admin/` | Doit s’ouvrir **normalement** (200) — aucune redirection ne l’intercepte |
| `wp-login.php` | Idem — doit afficher la page de connexion |
| `wp-content/uploads/...` | Doit servir les médias en 200 |

Outil pratique : `curl -I https://labienveillance.fr/monte-escalier/` doit montrer `HTTP/1.1 301` et un en-tête `Location:` correct.

## 4. Particularités

### 4.1 Slash final

WordPress, avec la structure de permaliens **« Nom de l’article »**, force par défaut un **slash final** : `/monte-escaliers/` (et redirige automatiquement `/monte-escaliers` → `/monte-escaliers/` en interne). Les cibles du CSV sont donc avec slash final : c’est la **canonique unique** que Yoast / le sitemap reprendront ensuite.

### 4.2 Page Elementor → page WP « devis estimatif »

L’URL cible `/devis-estimatif/` n’existe **que si la page WP a été créée** au modèle « Devis estimatif monte-escalier (JLM) » (cf. `wp-theme/README.md` étape 6). Tant que la page n’existe pas, **désactiver** la redirection (colonne `enabled` à `0`) ou pointer temporairement vers `/monte-escaliers/#devis-estimatif-en-ligne`.

### 4.3 Outil de devis tiers

`/monte-escaliers/monte-escalier.html` correspond à un outil tiers présent sur l’ancien site (à confirmer côté client). La redirection proposée pointe vers la page WP devis ; ajuster ou désactiver selon la décision métier (Q5 dans `MIGRATION.md`).

### 4.4 Page parasite `/admin/` (post ID 8)

Audit pré-migration (11 mai 2026) : `https://labienveillance.fr/admin/` répond `200 OK` — c’est une **page WP éditoriale** (slug `admin`), **pas** le login. Décision client : la **rediriger 301 vers la home** et **supprimer la page** côté WP pour qu’elle ne réapparaisse pas dans le sitemap / les recherches internes.

Procédure une fois la prod accessible :

1. La 301 `/admin/ → /` est déjà dans le CSV (groupe `nettoyage`).
2. Dans **Pages → Toutes les pages**, repérer la page « Admin » (post ID 8) → **Mettre à la corbeille** puis vider la corbeille.
3. Vérifier dans Yoast → Sitemaps qu’elle n’y figure plus.
4. Le plugin Redirection a un suivi des changements de slug : si on l’avait juste renommée plutôt que supprimée, il aurait posé sa propre 301 — c’est désactivé ici parce qu’on supprime franchement.

### 4.5 Page parrainage différée

Le programme de parrainage n'est **pas** publié au go-live (pas de contenu finalisé). Conséquences&nbsp;:

- Le lien « Parrainage » a été **retiré du footer** (thème WP + maquette statique) : il n'y a donc aucun chemin de navigation vers `/parrainage/`.
- La page WP `/parrainage/` **n'est pas créée**. Si elle l'était, le modèle `page-parrainage.php` (placeholder « en construction ») et le `noindex` automatique servent quand même de filet de sécurité.
- L'URL héritée `/parrainage.html` (ancienne maquette) est redirigée **301 vers `/`** dans le groupe `nettoyage` plutôt que vers `/parrainage/` — ça évite une 404 si une vieille URL circule encore.
- Quand le contenu sera prêt&nbsp;: créer la page WP avec slug `parrainage`, remettre la ligne `<li>` dans le footer (`footer.php` + 10 maquettes HTML), et basculer la 301 ci-dessus vers `/parrainage/`.

### 4.6 Sitemap Yoast

L’ancien `sitemap_index.xml` renvoyait **500**. Aucune redirection à mettre&nbsp;; il faut **réactiver Yoast** sur la nouvelle install et **regénérer le sitemap** (Yoast → Réglages → Fonctionnalités → Plans de site XML), puis le **soumettre** à Google Search Console. Voir [`yoast-config.md`](yoast-config.md).

### 4.7 Logs et 404

Activer dans **Redirection → Options** :
- **Logs** : 7 jours de rétention pour repérer 404 récurrents post-bascule.
- **Suivi des modifications de pages** : ajoute automatiquement une 301 si on renomme un slug (ex. déplacer une page de `aides-financieres` à `aide-financiere`).

## 5. Format du CSV

```csv
source,target,code,regex,group,enabled
/monte-escalier,/monte-escaliers/,301,0,services,1
```

| Colonne | Description |
|---|---|
| `source` | URL relative (commence par `/`) ou regex selon `regex` |
| `target` | URL relative (avec slash final pour les pages WP) ou absolue |
| `code` | Code HTTP : **301** pour permanent, 302 pour temporaire (préférer 301 ici) |
| `regex` | `1` pour activer le motif PCRE sur `source`, `0` pour comparaison littérale |
| `group` | Nom du groupe (créé automatiquement à l’import) |
| `enabled` | `1` actif, `0` désactivé |

## 6. Alternative : règles côté serveur (à éviter)

Sur l’hébergement Apache/cPanel, on **pourrait** ajouter ces règles dans le `.htaccess` racine **après** le bloc géré par WordPress (`# BEGIN WordPress` / `# END WordPress`). On déconseille fortement ici parce que :

- Le plugin **journalise** les hits, ce qui aide à repérer les vraies vieilles URL fréquentées.
- Les règles **ne sont pas perdues** lors d’un changement d’hébergeur ou d’une réinstallation tant que la base WP suit.
- L’équipe support du client peut piloter sans accès SSH/FTP.

Garder le `.htaccess` **standard** WordPress ; toutes les redirections passent par le plugin.
