# Archive — session agent Cursor (déploiement & GitHub Pages)

> **Date de clôture documentaire :** 31 mars 2026  
> **Statut :** déploiement GitHub Pages **réussi** (maquette statique).  
> **Ne pas supprimer** : ce fichier fige le contexte d’une série d’échanges avec l’agent (hébergement stable, configuration Pages, dépannage).

Ce document est **complémentaire** à `DOCUMENTATION.md` (§ 12 — référence opérationnelle) et à `MIGRATION.md` (WordPress / production).

---

## 1. Objectif de la session

- Disposer d’une **URL d’accès stable et gratuite** pour la **maquette HTML/CSS/JS** (relecture client, démo), en parallèle du site de production prévu sous WordPress sur `labienveillance.fr`.
- Éviter les tunnels locaux type Cloudflare Quick Tunnel (URLs **éphémères**).

---

## 2. Décisions et livrables techniques

| Élément | Description |
|---------|-------------|
| Hébergeur choisi | **GitHub Pages** + **GitHub Actions** (pas « Deploy from a branch » seul). |
| Dépôt | `https://github.com/tilschenabbapro-sudo/labienveillance` — branche **`main`**. |
| Workflow | `.github/workflows/pages.yml` — nom affiché **Deploy GitHub Pages**. |
| Contenu publié | HTML, CSS, JS, images, etc. **sans** le dossier **`wp-theme/`** (exclu par `rsync` : PHP inutile sur Pages). |
| Fichiers racine | `.gitignore`, `.nojekyll` (désactive Jekyll). |
| Script optionnel | `scripts/Enable-GitHubPages.ps1` — active Pages en `build_type: workflow` via l’API si l’UI n’a pas été utilisée. |
| Identité Git locale (machine dev) | Config locale `user.name` / `user.email` dans le dépôt pour permettre les commits si le global Git était vide. |

---

## 3. URL à transmettre au client (démo)

**Maquette en ligne :**  
`https://tilschenabbapro-sudo.github.io/labienveillance/`

Rappel : ce n’est **pas** le domaine de production. Les balises **canonical** des pages HTML pointent vers `https://labienveillance.fr/...` — comportement voulu pour le SEO une fois le site réel en ligne.

Si un **domaine personnalisé** est ajouté dans GitHub (**Settings → Pages**), utiliser cette URL pour le client.

---

## 4. Contraintes GitHub (compte gratuit)

- **Dépôt public** : GitHub Pages pour un site projet est **inclus** sur l’offre gratuite.
- **Dépôt privé** sur compte gratuit : Pages n’est en général **pas** disponible comme sur un dépôt public — d’où la confusion possible (« Pages = payant »). Alternative : Cloudflare Pages, Netlify ou Vercel pour un dépôt privé.

---

## 5. Problème rencontré et résolution (référence)

### Symptôme

- Échec du job Actions sur l’étape **Configurer Pages** (`actions/configure-pages@v4`).
- Messages du type : *Get Pages site failed*, *HttpError: Not Found*.

### Cause

- Aucun site Pages **créé** tant que la source n’est pas passée sur **GitHub Actions** dans les réglages du dépôt.

### Résolution

1. **GitHub → dépôt → Settings → Pages → Source** : **GitHub Actions**.  
2. Relancer le workflow (ou un nouveau `git push` sur `main`).

Alternative : exécuter `scripts/Enable-GitHubPages.ps1` avec un PAT (`GITHUB_TOKEN` dans l’environnement), puis relancer le workflow.

---

## 6. Maintenance courante

- **Mise à jour du site démo :** modifier les fichiers, `git add`, `git commit`, `git push` sur **`main`** → redéploiement automatique.
- **Outils** : `gh` (GitHub CLI) **non requis** si l’interface web et Git suffisent.

---

## 7. Périmètre hors session agent

- Contenu éditorial, SEO final, mise en ligne WordPress sur l’hébergement client : voir `MIGRATION.md` et le reste de `DOCUMENTATION.md`.
- GTM : conteneur documenté ailleurs dans le projet (pages HTML + thème WP).

---

## 8. Conservation de l’historique de conversation

Les **transcriptions de chat Cursor** liées au workspace sont stockées **localement** sur la machine de développement (dossier de projet Cursor / historique des conversations). Ce fichier **ARCHIVE** résume l’essentiel pour le dépôt Git ; il reste la **référence versionnée** si les chats locaux sont perdus ou changent de machine.
