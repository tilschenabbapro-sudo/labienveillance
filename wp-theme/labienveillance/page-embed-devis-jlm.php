<?php
/**
 * Template Name: Embed — Devis JLM seul
 * Description: Page minimale (sans menu ni pied de page) avec uniquement l’outil — utile en lien direct.
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$dir = get_template_directory();
$uri = get_template_directory_uri();
$js  = $dir . '/assets/js/jlm-lite-devis.js';
$css = $dir . '/assets/css/jlm-lite-devis.css';
$ver = is_readable( $js ) ? (string) filemtime( $js ) : LABIENVEILANCE_VERSION;
$css_ver = is_readable( $css ) ? (string) filemtime( $css ) : LABIENVEILANCE_VERSION;

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex, nofollow">
	<title><?php echo esc_html( get_bloginfo( 'name' ) ); ?> — <?php esc_html_e( 'Devis estimatif', 'labienveillance' ); ?></title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="<?php echo esc_url( $uri . '/assets/css/jlm-lite-devis.css' ); ?>?ver=<?php echo esc_attr( $css_ver ); ?>">
	<style>
		html, body { margin: 0; min-height: 100%; background: #0e1319; color: #e8eaef; }
	</style>
	<script>
		window.labienveillanceJlm = {
			ajaxUrl: <?php echo wp_json_encode( admin_url( 'admin-ajax.php' ) ); ?>,
			contactUrl: <?php echo wp_json_encode( home_url( '/contact/' ) ); ?>,
			contactLabel: <?php echo wp_json_encode( __( 'CONTACTEZ-NOUS', 'labienveillance' ) ); ?>,
			images: <?php echo wp_json_encode( labienveillance_jlm_image_urls() ); ?>,
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
