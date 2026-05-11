<?php
/**
 * Liens contextuels accueil (maillage hub ⇄ pages filles).
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<p class="hero__cross-hub">
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>#nos-engagements"><?php esc_html_e( 'Nos quatre engagements (Liberté, Sécurité, Confort, Santé)', 'labienveillance' ); ?></a>
	<span class="hero__cross-hub-sep" aria-hidden="true"> · </span>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>#solutions-quotidien"><?php esc_html_e( 'Situations du quotidien à l’accueil', 'labienveillance' ); ?></a>
	<span class="hero__cross-hub-sep" aria-hidden="true"> · </span>
	<a href="<?php echo esc_url( labienveillance_page_url( 'aides-financieres' ) ); ?>#faq-aides-financieres"><?php esc_html_e( 'Aides financières (FAQ)', 'labienveillance' ); ?></a>
</p>
