"""19 - Mise a jour du form CF7 via un snippet PHP one-shot (contourne le sanitize REST)."""
from __future__ import annotations

import json
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import ROOT, wp_get, wp_post

FORM_ID = 709
FORM_HTML = (ROOT / "migration-wp" / "cf7" / "contact-form.txt").read_text(encoding="utf-8")


def php_escape(s: str) -> str:
    """Echappe une chaine Python pour la mettre entre apostrophes PHP."""
    return s.replace("\\", "\\\\").replace("'", "\\'")


MAIL_ADMIN_BODY = (
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
)

MAIL_USER_BODY = (
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
)

MESSAGES_OVERRIDE = {
    "mail_sent_ok": "Merci, votre message a bien ete envoye. Nous vous recontactons sous 24 a 48 h ouvrees.",
    "mail_sent_ng": "L'envoi du message a echoue. Merci de reessayer dans quelques instants ou de nous contacter au 03 25 31 13 60.",
    "validation_error": "Une ou plusieurs informations ne sont pas valides. Merci de verifier les champs en rouge avant de renvoyer le formulaire.",
    "spam": "L'envoi du message a echoue. Notre filtre anti-spam a bloque votre demande, merci de reessayer ou de nous ecrire a contact@labienveillance.fr.",
    "invalid_required": "Merci de remplir ce champ.",
    "invalid_email": "Adresse e-mail invalide.",
    "invalid_tel": "Numero de telephone invalide.",
}


def php_array(items: dict) -> str:
    """Convertit dict Python en array PHP."""
    parts = []
    for k, v in items.items():
        parts.append(f"'{php_escape(k)}' => '{php_escape(v)}'")
    return "array(\n        " + ",\n        ".join(parts) + ",\n    )"


SNIPPET = f"""
if ( get_option( 'lbv_cf7_configured_v2' ) ) {{
    return;
}}
if ( ! class_exists( 'WPCF7_ContactForm' ) ) {{
    return;
}}
$cf = WPCF7_ContactForm::get_instance( {FORM_ID} );
if ( ! $cf ) {{
    return;
}}

$form_html = '{php_escape(FORM_HTML)}';

$mail_admin = array(
    'subject'             => '[La Bienveillance] Nouvelle demande - [sujet] - [prenom] [nom]',
    'sender'              => 'La Bienveillance <contact@labienveillance.fr>',
    'recipient'           => 'contact@labienveillance.fr',
    'body'                => '{php_escape(MAIL_ADMIN_BODY)}',
    'additional_headers'  => 'Reply-To: [votre-email]' . "\\n" . 'X-Origine: Formulaire site labienveillance.fr',
    'attachments'         => '',
    'use_html'            => 0,
    'exclude_blank'       => 1,
);

$mail_user = array(
    'active'              => true,
    'subject'             => 'Nous avons bien recu votre demande - La Bienveillance',
    'sender'              => 'La Bienveillance <contact@labienveillance.fr>',
    'recipient'           => '[votre-email]',
    'body'                => '{php_escape(MAIL_USER_BODY)}',
    'additional_headers'  => 'Reply-To: contact@labienveillance.fr',
    'attachments'         => '',
    'use_html'            => 0,
    'exclude_blank'       => 1,
);

$current_messages = $cf->prop( 'messages' );
if ( ! is_array( $current_messages ) ) $current_messages = array();
$overrides = {php_array(MESSAGES_OVERRIDE)};
$messages = array_merge( $current_messages, $overrides );

$cf->set_title( 'Contact - La Bienveillance' );
$cf->set_properties( array(
    'form'                 => $form_html,
    'mail'                 => $mail_admin,
    'mail_2'               => $mail_user,
    'messages'             => $messages,
    'additional_settings'  => "skip_mail: off\\n",
) );
$cf->save();

update_option( 'lbv_cf7_configured_v2', current_time( 'mysql' ) );
"""


def main() -> None:
    # Lister snippets pour eviter doublons
    st, snippets = wp_get("/code-snippets/v1/snippets")
    for sp in (snippets or []):
        if "LBV CF7" in (sp.get("name") or ""):
            print(f"  Snippet existant trouve #{sp['id']}, suppression...")
            wp_post(f"/code-snippets/v1/snippets/{sp['id']}/deactivate", body={})

    payload = {
        "name": "LBV CF7 Configuration (one-shot)",
        "description": "Configure le formulaire CF7 #709 avec les gabarits LBV.",
        "code": SNIPPET,
        "scope": "global",
        "active": True,
        "tags": ["golive", "lbv", "cf7"],
    }
    st, body = wp_post("/code-snippets/v1/snippets", body=payload)
    print(f"== Snippet HTTP {st}")
    if st not in (200, 201):
        print(json.dumps(body, ensure_ascii=False)[:1500])
        return
    sid = body.get("id") if isinstance(body, dict) else None
    print(f"   id={sid} active={body.get('active')}")

    print("\n== Trigger requete pour declencher l'execution ==")
    for i in range(3):
        wp_get("/", params={})
        time.sleep(1)

    print("\n== Verification CF7 ==")
    st, body = wp_get(f"/contact-form-7/v1/contact-forms/{FORM_ID}")
    if isinstance(body, dict):
        props = body.get("properties", {})
        form = props.get("form", {})
        content = form.get("content") if isinstance(form, dict) else form
        print(f"  Title : {body.get('title')}")
        print(f"  Form content len : {len(content or '')}")
        print(f"  Form sample : {(content or '')[:200]}...")
        mail = props.get("mail", {})
        print(f"  Mail subject : {mail.get('subject') if isinstance(mail, dict) else mail}")
        print(f"  Mail recipient : {mail.get('recipient') if isinstance(mail, dict) else mail}")
        mail2 = props.get("mail_2", {})
        active = mail2.get("active") if isinstance(mail2, dict) else mail2
        print(f"  Mail2 active : {active}")
        print(f"  Mail2 recipient : {mail2.get('recipient') if isinstance(mail2, dict) else mail2}")
        msgs = props.get("messages", {})
        if isinstance(msgs, dict):
            print(f"  mail_sent_ok : {msgs.get('mail_sent_ok')!r}")


if __name__ == "__main__":
    main()
