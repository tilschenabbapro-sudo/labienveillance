# Contact Form 7 — Formulaire de contact La Bienveillance

Ce dossier contient **tout ce qu'il faut pour recréer en 5 minutes** le formulaire de contact de la maquette dans Contact Form 7, une fois WordPress installé sur l'hébergement définitif.

> Le thème La Bienveillance est **déjà compatible CF7** : la page « Contact » (slug `contact`) bascule automatiquement du formulaire HTML statique de secours vers le shortcode CF7 dès que le filtre `labienveillance_contact_shortcode` renvoie une valeur. Voir le mu-plugin fourni dans `migration-wp/mu-plugin-labienveillance-config.php`.

## 1. Plugins à installer (depuis l'admin WordPress)

| Plugin | Auteur | Statut | Rôle |
| --- | --- | --- | --- |
| **Contact Form 7** | Takayuki Miyoshi | **obligatoire** | Moteur du formulaire |
| **Honeypot for Contact Form 7** | Nocean | **fortement recommandé** | Anti-spam invisible (le tag `[honeypot site-web]` du gabarit en dépend) |
| Flamingo | Takayuki Miyoshi | recommandé | Sauvegarde des messages reçus dans la base WP (filet de sécurité) |
| WP Mail SMTP _ou_ FluentSMTP | divers | recommandé | Délivrabilité — envoie les e-mails via un vrai serveur SMTP plutôt que `mail()` PHP de l'hébergeur (voir §5) |

> Pas besoin de reCAPTCHA v3 dans un premier temps : le honeypot suffit pour 99 % du spam de masse. À installer plus tard **si** on observe du spam ciblé.

## 2. Création du formulaire dans CF7

1. **Contact → Ajouter** dans le menu admin.
2. **Titre** : `Contact La Bienveillance` (ou ce que tu veux, c'est uniquement interne).
3. **Onglet « Formulaire »** : remplacer entièrement le contenu par celui de [`contact-form.txt`](./contact-form.txt).
4. **Onglet « E-mail »** :
   - **Mail** : recopier exactement les valeurs de [`contact-mail-to-admin.txt`](./contact-mail-to-admin.txt).
   - Cocher **« Utiliser Mail (2) »** puis recopier les valeurs de [`contact-mail-to-user.txt`](./contact-mail-to-user.txt) (accusé de réception envoyé au visiteur).
5. **Onglet « Messages »** : remplacer les chaînes par celles de [`contact-messages.txt`](./contact-messages.txt) (version FR, ton + cohérent avec la maquette).
6. **Onglet « Réglages additionnels »** : laisser vide pour l'instant.
7. **Enregistrer** → CF7 affiche en haut du formulaire un shortcode du type :

   ```
   [contact-form-7 id="42" title="Contact La Bienveillance"]
   ```

   **Noter cet ID** (ici `42`) — il sert à brancher le mu-plugin.

## 3. Brancher le shortcode dans le thème

Dans le mu-plugin `labienveillance-config.php` (livré dans `migration-wp/`), remplacer la ligne :

```php
return '[contact-form-7 id="REPLACE_ID" title="Contact La Bienveillance"]';
```

par l'ID réel récupéré à l'étape 2.7. Sauvegarder, recharger la page `/contact/` → le formulaire CF7 remplace automatiquement le formulaire HTML de secours.

## 4. Tests à effectuer (5 min)

Une fois le formulaire en place :

- [ ] **Champs obligatoires** : tester un envoi avec un champ vide → message d'erreur en français bien affiché ;
- [ ] **E-mail invalide** : tester `foobar` dans le champ e-mail → message d'erreur ;
- [ ] **Envoi nominal** : remplir tous les champs → vérifier que `contact@labienveillance.fr` reçoit bien le mail ;
- [ ] **Accusé de réception** : vérifier que l'adresse saisie reçoit aussi le mail (2) ;
- [ ] **Reply-To** : depuis la boîte `contact@…`, cliquer « Répondre » → l'adresse pré-remplie doit être celle du visiteur, pas `contact@labienveillance.fr` ;
- [ ] **Honeypot** : si le plugin est installé, ouvrir le DOM (F12) et confirmer la présence d'un champ `site-web` masqué avec `display:none` ou `visibility:hidden` ;
- [ ] **Flamingo** (si activé) : vérifier dans **Flamingo → Messages reçus** que la soumission est archivée.

## 5. Délivrabilité — pourquoi un plugin SMTP est important

Par défaut, WordPress envoie les e-mails via `mail()` PHP, ce qui pose deux problèmes sur un site `.fr` à fort enjeu :

1. Le `From:` est généralement réécrit en `wordpress@labienveillance.fr` → si **SPF/DKIM/DMARC** ne sont pas configurés sur le domaine, les mails finissent en spam (ou sont bloqués) chez Gmail, Outlook, Orange, Free…
2. Beaucoup d'hébergeurs mutualisés rate-limitent ou désactivent `mail()`.

**Solution recommandée**, dans cet ordre de simplicité :

- **WP Mail SMTP** ou **FluentSMTP**, configuré avec :
  - le serveur **SMTP de l'hébergeur** (le plus simple : OVH, Infomaniak, o2switch fournissent des identifiants SMTP du domaine) ;
  - **OU** un service transactionnel (Brevo / Sendinblue, Mailgun, Postmark) — gratuit jusqu'à un certain volume.
- **From address** : `contact@labienveillance.fr` (boîte qui existe vraiment, sinon DMARC rejette).
- **From name** : `La Bienveillance`.
- Une fois en place, faire un envoi test depuis l'écran « Email Test » du plugin, puis un envoi réel depuis le formulaire de contact.

> Sans plugin SMTP, **les mails peuvent partir mais ne pas arriver**. Comme c'est invisible en local, c'est typiquement le bug n° 1 post-mise-en-ligne d'un site WordPress contact-form. Mieux vaut le brancher dès J0.

## 6. Anti-spam — graduation

| Niveau | Quand l'activer | Comment |
| --- | --- | --- |
| Honeypot | **dès J0** | Plugin _Honeypot for Contact Form 7_ + tag `[honeypot site-web]` déjà présent dans `contact-form.txt` |
| Flamingo (archivage + détection doublons) | dès J0 | Plugin _Flamingo_, aucune config nécessaire |
| reCAPTCHA v3 | si spam après 1 mois | CF7 → **Intégration → reCAPTCHA**, clés Google v3, sans case à cocher |
| Cloudflare Turnstile | alternative à reCAPTCHA | Via plugin _CF7 Cloudflare Turnstile_ |

## 7. RGPD — note rapide

- La page `/mentions-legales/` couvre déjà l'usage des données du formulaire (finalité, destinataire, durée).
- Le mini-paragraphe au-dessus du bouton « Envoyer ma demande » dans `contact-form.txt` informe explicitement l'utilisateur, sans imposer de case à cocher (la finalité est limpide : répondre à la demande, base légale = mesures précontractuelles + intérêt légitime).
- **Si** le client demande plus tard une case à cocher de consentement explicite, ajouter au formulaire :

  ```
  [acceptance accepte-rgpd] J'accepte que mes informations soient utilisées pour répondre à ma demande. [/acceptance]
  ```

  → CF7 bloquera l'envoi tant que la case n'est pas cochée.

## 8. Fichiers livrés

| Fichier | Usage |
| --- | --- |
| `contact-form.txt` | Onglet « Formulaire » de CF7 (à coller tel quel) |
| `contact-mail-to-admin.txt` | Onglet « E-mail », bloc 1 — vers `contact@labienveillance.fr` |
| `contact-mail-to-user.txt` | Onglet « E-mail », bloc 2 — accusé de réception au visiteur |
| `contact-messages.txt` | Onglet « Messages » — chaînes FR cohérentes avec la maquette |

Voir aussi : [`../mu-plugin-labienveillance-config.php`](../mu-plugin-labienveillance-config.php) pour brancher le shortcode dans le thème.
