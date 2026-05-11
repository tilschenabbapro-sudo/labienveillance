"""18 - Mettre a jour le formulaire CF7 #709 avec les gabarits LBV.

Lit migration-wp/cf7/* et patche le formulaire existant via PUT.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import ROOT, wp_get, wp_post, wp_put

CF7_DIR = ROOT / "migration-wp" / "cf7"
FORM_FILE = CF7_DIR / "contact-form.txt"

FORM_ID = 709

MAIL_TO_ADMIN = {
    "subject": "[La Bienveillance] Nouvelle demande - [sujet] - [prenom] [nom]",
    "sender": "La Bienveillance <contact@labienveillance.fr>",
    "recipient": "contact@labienveillance.fr",
    "body": (
        "Nouveau message recu via le formulaire de contact du site.\n\n"
        "Coordonnees\n"
        "-----------\n"
        "Prenom    : [prenom]\n"
        "Nom       : [nom]\n"
        "Telephone : [telephone]\n"
        "E-mail    : [votre-email]\n"
        "Sujet     : [sujet]\n\n"
        "Message\n"
        "-------\n"
        "[message]\n\n\n"
        "--\n"
        "Envoye depuis [_site_url] le [_date] a [_time]\n"
        "IP : [_remote_ip]   |   User-Agent : [_user_agent]\n"
    ),
    "additional_headers": "Reply-To: [votre-email]\nX-Origine: Formulaire site labienveillance.fr",
    "attachments": "",
    "use_html": 0,
    "exclude_blank": 1,
}

MAIL_TO_USER = {
    "active": True,
    "subject": "Nous avons bien recu votre demande - La Bienveillance",
    "sender": "La Bienveillance <contact@labienveillance.fr>",
    "recipient": "[votre-email]",
    "body": (
        "Bonjour [prenom],\n\n"
        "Merci pour votre message. Nous avons bien recu votre demande concernant\n"
        "\"[sujet]\" et un membre de l'equipe La Bienveillance vous recontacte\n"
        "sous 24 a 48 h ouvrees, par telephone ou par e-mail selon vos preferences.\n\n"
        "Si votre demande est urgente, vous pouvez nous joindre directement\n"
        "au 03 25 31 13 60 (du lundi au vendredi, 9 h - 18 h).\n\n"
        "Pour rappel, voici le message que vous nous avez transmis :\n\n"
        "------------------------------------------------------------\n"
        "[message]\n"
        "------------------------------------------------------------\n\n"
        "A tres bientot,\n"
        "L'equipe La Bienveillance\n\n"
        "--\n"
        "La Bienveillance\n"
        "Amenagement et adaptation du domicile\n"
        "Tel. : 03 25 31 13 60\n"
        "E-mail : contact@labienveillance.fr\n"
        "Site : https://labienveillance.fr/\n"
    ),
    "additional_headers": "Reply-To: contact@labienveillance.fr",
    "attachments": "",
    "use_html": 0,
    "exclude_blank": 1,
}

MESSAGES_OVERRIDE = {
    "mail_sent_ok": "Merci, votre message a bien ete envoye. Nous vous recontactons sous 24 a 48 h ouvrees.",
    "mail_sent_ng": "L'envoi du message a echoue. Merci de reessayer dans quelques instants ou de nous contacter au 03 25 31 13 60.",
    "validation_error": "Une ou plusieurs informations ne sont pas valides. Merci de verifier les champs en rouge avant de renvoyer le formulaire.",
    "spam": "L'envoi du message a echoue. Notre filtre anti-spam a bloque votre demande, merci de reessayer ou de nous ecrire a contact@labienveillance.fr.",
    "invalid_required": "Merci de remplir ce champ.",
    "invalid_too_long": "Le contenu de ce champ est trop long.",
    "invalid_too_short": "Le contenu de ce champ est trop court.",
    "upload_failed": "Le televersement du fichier a echoue.",
    "upload_file_type_invalid": "Type de fichier non autorise.",
    "upload_file_too_large": "Le fichier est trop volumineux.",
    "upload_failed_php_error": "Echec du televersement.",
    "invalid_date": "La date est invalide.",
    "date_too_early": "La date est anterieure a la valeur autorisee.",
    "date_too_late": "La date est posterieure a la valeur autorisee.",
    "invalid_email": "Adresse e-mail invalide.",
    "invalid_url": "URL invalide.",
    "invalid_tel": "Numero de telephone invalide.",
    "quiz_answer_not_correct": "Reponse incorrecte a la question.",
}


def main() -> None:
    form_content = FORM_FILE.read_text(encoding="utf-8")
    print(f"== Form gabarit : {len(form_content)} chars")

    # Lire l'etat actuel pour fusionner les messages
    st, current = wp_get(f"/contact-form-7/v1/contact-forms/{FORM_ID}")
    if not isinstance(current, dict):
        print(f"  ! ECHEC lecture form {FORM_ID} : {current}")
        sys.exit(1)

    current_props = current.get("properties", {})
    current_messages = current_props.get("messages", {}) or {}
    merged_messages = dict(current_messages)
    merged_messages.update(MESSAGES_OVERRIDE)

    # CF7 attend les champs au TOP-LEVEL (pas dans 'properties')
    payload = {
        "title": "Contact - La Bienveillance",
        "locale": "fr_FR",
        "form": form_content,
        "mail": MAIL_TO_ADMIN,
        "mail_2": MAIL_TO_USER,
        "messages": merged_messages,
        "additional_settings": (
            "skip_mail: off\n"
            "demo_mode: off\n"
        ),
    }

    print(f"\n== PUT /contact-form-7/v1/contact-forms/{FORM_ID} ==")
    st, body = wp_put(f"/contact-form-7/v1/contact-forms/{FORM_ID}", body=payload)
    print(f"HTTP {st}")
    if isinstance(body, dict):
        print(f"  Title    : {body.get('title')}")
        print(f"  Slug     : {body.get('slug')}")
        print(f"  Form len : {len(body.get('properties', {}).get('form', ''))}")
        mail = body.get('properties', {}).get('mail', {})
        print(f"  Mail recip : {mail.get('recipient')}")
        print(f"  Mail subj  : {mail.get('subject')}")
        mail2 = body.get('properties', {}).get('mail_2', {})
        print(f"  Mail2 active : {mail2.get('active')}")
        print(f"  Mail2 recip  : {mail2.get('recipient')}")
    else:
        print(json.dumps(body, ensure_ascii=False)[:600])

    # Test : recuperer le shortcode CF7
    print("\n== Shortcode a utiliser ==")
    print(f'  [contact-form-7 id="{FORM_ID}" title="Contact - La Bienveillance"]')


if __name__ == "__main__":
    main()
