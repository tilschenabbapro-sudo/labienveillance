<?php
/**
 * Template Name: Embed — Devis JLM seul
 * Description: Sans menu ni pied de page du site : uniquement l’outil (#jlmLiteAppRoot). Idéal comme URL d’iframe.
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$dir = get_template_directory();
$uri = get_template_directory_uri();
$js  = $dir . '/assets/js/jlm-lite-devis.js';
$ver = is_readable( $js ) ? (string) filemtime( $js ) : LABIENVEILANCE_VERSION;

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex, nofollow">
	<title><?php echo esc_html( get_bloginfo( 'name' ) ); ?> — <?php esc_html_e( 'Devis estimatif', 'labienveillance' ); ?></title>
	<style>
		html, body { margin: 0; min-height: 100%; background: #050c19; }
	</style>
	<script>
		window.labienveillanceJlm = {
			ajaxUrl: <?php echo wp_json_encode( admin_url( 'admin-ajax.php' ) ); ?>,
			contactUrl: <?php echo wp_json_encode( home_url( '/contact/' ) ); ?>,
			contactLabel: <?php echo wp_json_encode( __( 'CONTACTEZ-NOUS', 'labienveillance' ) ); ?>,
			silentAjaxFail: true
		};
	</script>
	<script src="<?php echo esc_url( $uri . '/assets/js/jlm-lite-devis.js' ); ?>?ver=<?php echo esc_attr( $ver ); ?>" defer></script>
</head>
<body>
<div id="jlmLiteAppRoot"></div>
</body>
</html>
<?php
exit;
