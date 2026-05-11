<?php
/**
 * Plugin Name:       La Bienveillance — Configuration de production
 * Description:       Centralise les filtres du thème La Bienveillance (téléphone, e-mail, CF7, GTM, Calendly). Ce fichier est un mu-plugin : déposer dans wp-content/mu-plugins/ pour qu'il se charge automatiquement, sans page « Extensions » à activer.
 * Version:           1.0.0
 * Author:            La Bienveillance — équipe technique
 * Requires at least: 6.0
 * Requires PHP:      7.4
 *
 * ============================================================================
 *  COMMENT UTILISER CE FICHIER
 * ============================================================================
 *
 *  1. Copier ce fichier vers     wp-content/mu-plugins/labienveillance-config.php
 *     (créer le dossier mu-plugins/ s'il n'existe pas).
 *
 *  2. Ajuster les CONSTANTES ci-dessous (cf. bloc « Valeurs à confirmer »).
 *     Une seule chose à changer obligatoirement avant la mise en ligne :
 *     l'identifiant du formulaire CF7 dans LBV_CONTACT_CF7_ID après l'avoir
 *     créé dans l'admin (cf. migration-wp/cf7/README.md).
 *
 *  3. Aucune activation à faire dans WordPress : un mu-plugin se charge
 *     automatiquement.
 *
 *  POURQUOI un mu-plugin et pas le functions.php d'un thème enfant ?
 *  --------------------------------------------------------------------------
 *  - Persiste si on change de thème par accident ;
 *  - N'apparaît pas dans la page « Extensions », donc impossible à désactiver
 *    par mégarde ;
 *  - Facile à versionner / livrer comme livrable client.
 *
 *  Si une valeur ci-dessous n'est pas encore connue, laisser la chaîne vide :
 *  le thème retombe alors sur sa valeur par défaut (téléphone, e-mail) ou
 *  désactive la fonctionnalité (Calendly, CF7).
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ============================================================================
 *  VALEURS À CONFIRMER / AJUSTER
 * ============================================================================ */

/** Téléphone — version affichée à l'écran. */
const LBV_PHONE_DISPLAY = '03 25 31 13 60';

/** Téléphone — lien tel: (format international, sans espaces). */
const LBV_PHONE_HREF = 'tel:+33325311360';

/** Adresse e-mail de contact (confirmée par le client le 8 mai 2026). */
const LBV_CONTACT_EMAIL = 'contact@labienveillance.fr';

/**
 * Identifiant du formulaire Contact Form 7.
 *
 * À renseigner APRÈS avoir créé le formulaire dans l'admin
 * (cf. migration-wp/cf7/README.md). Tant qu'il vaut 0, le thème affiche
 * le formulaire HTML statique de secours.
 */
const LBV_CONTACT_CF7_ID = 709;

/** Titre interne du formulaire CF7 (informatif, doit correspondre au titre saisi dans l'admin). */
const LBV_CONTACT_CF7_TITLE = 'Contact La Bienveillance';

/**
 * URL Calendly (post-lancement uniquement).
 * Laisser vide tant que le compte n'est pas créé : la section « Prendre RDV »
 * de la page contact reste alors masquée. Format attendu :
 *   https://calendly.com/labienveillance/rdv
 */
const LBV_CALENDLY_URL = '';

/**
 * Identifiant Google Tag Manager.
 * Le thème en fournit un par défaut (GTM-NZVHPJ3Z). Renseigner ici
 * uniquement pour le surcharger ou retourner '' pour désactiver GTM.
 * Laisser null pour conserver la valeur par défaut du thème.
 */
const LBV_GTM_ID_OVERRIDE = null;


/* ============================================================================
 *  Configurateur devis salle de bain — surcharges optionnelles
 * ============================================================================
 *  Toutes les valeurs ci-dessous sont OPTIONNELLES. Les défauts vivent dans
 *  le JS du thème (assets/js/devis-sdb.js, constante DEFAULTS). Surcharger
 *  uniquement ce que le client souhaite ajuster (prix réels, photos uploadées
 *  dans la médiathèque, conseils personnalisés…).
 *
 *  Pour activer une surcharge, retirer le `//` au début de la ligne et adapter.
 * ============================================================================ */

add_filter(
	'labienveillance_devis_sdb_config',
	function ( $config ) {
		/* ---- Prix réels (à confirmer avec La Bienveillance) ---- */
		// $config['prices']['base']['fixe']             = 1200;
		// $config['prices']['base']['fixe_volet']       = 1450;
		// $config['prices']['verre']['depoli']          = 180;
		// $config['prices']['robinetterie']['oui']      = 390;
		// $config['prices']['habillageMursM2']          = 120;
		// $config['prices']['solAntiderapant']          = 990;
		// $config['prices']['porteCoulissante']         = 990;
		// $config['prices']['secheServiettes']          = 790;
		// $config['prices']['wcSureleve']               = 590;
		// $config['prices']['wcSuspenduHabillage']      = 1490;
		// $config['prices']['wcBroyeurSilencieux']      = 990;

		/* ---- Photos client (URL absolues vers la médiathèque WP) ---- */
		// $base = 'https://labienveillance.fr/wp-content/uploads/sdb/';
		// $config['photos']['avant_1']           = $base . 'avant-1.jpg';
		// $config['photos']['apres_1']           = $base . 'apres-1.jpg';
		// $config['photos']['avant_2']           = $base . 'avant-2.jpg';
		// $config['photos']['apres_2']           = $base . 'apres-2.jpg';
		// $config['photos']['habillage_1']       = $base . 'habillage-1.jpg';
		// $config['photos']['habillage_2']       = $base . 'habillage-2.jpg';
		// $config['photos']['sol_1']             = $base . 'sol-1.jpg';
		// $config['photos']['sol_2']             = $base . 'sol-2.jpg';
		// $config['photos']['porte_coulissante'] = $base . 'porte-coulissante.jpg';
		// $config['photos']['seche_serviettes']  = $base . 'seche-serviettes.jpg';
		// $config['photos']['proposition_sdb']   = $base . 'proposition-sdb.jpg';

		/* ---- Conseils personnalisés (textes du conseiller, popovers) ---- */
		// $config['hints']['fenetre']  = 'Texte personnalisé du conseiller pour l’étape fenêtre…';
		// $config['hints']['modele']   = '…';

		return $config;
	}
);

/* ============================================================================
 *  BRANCHEMENT DES FILTRES (ne pas modifier en principe)
 * ============================================================================ */

add_filter(
	'labienveillance_phone_display',
	function () {
		return LBV_PHONE_DISPLAY;
	}
);

add_filter(
	'labienveillance_phone_href',
	function () {
		return LBV_PHONE_HREF;
	}
);

add_filter(
	'labienveillance_contact_email',
	function () {
		return LBV_CONTACT_EMAIL;
	}
);

add_filter(
	'labienveillance_contact_shortcode',
	function () {
		$id = (int) LBV_CONTACT_CF7_ID;
		if ( $id <= 0 ) {
			return '';
		}
		$title = LBV_CONTACT_CF7_TITLE;
		return sprintf(
			'[contact-form-7 id="%d" title="%s"]',
			$id,
			esc_attr( $title )
		);
	}
);

add_filter(
	'labienveillance_calendly_url',
	function () {
		return LBV_CALENDLY_URL;
	}
);

if ( LBV_GTM_ID_OVERRIDE !== null ) {
	add_filter(
		'labienveillance_gtm_container_id',
		function () {
			return (string) LBV_GTM_ID_OVERRIDE;
		}
	);
}

/* ============================================================================
 *  E-MAIL — délivrabilité (recommandé)
 * ============================================================================
 *  Force le « From » des e-mails sortants WordPress sur l'adresse du domaine
 *  (sinon WP envoie depuis wordpress@labienveillance.fr et certains
 *  serveurs DMARC bloquent). À combiner avec un plugin SMTP type
 *  WP Mail SMTP / FluentSMTP — voir migration-wp/cf7/README.md §5.
 * ============================================================================ */

add_filter(
	'wp_mail_from',
	function ( $email ) {
		// On ne ré-écrit que si WP a posé son défaut wordpress@…
		if ( strpos( (string) $email, 'wordpress@' ) === 0 ) {
			return LBV_CONTACT_EMAIL;
		}
		return $email;
	}
);

add_filter(
	'wp_mail_from_name',
	function ( $name ) {
		if ( $name === 'WordPress' ) {
			return 'La Bienveillance';
		}
		return $name;
	}
);
