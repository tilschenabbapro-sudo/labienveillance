<?php
/**
 * Page 404
 *
 * @package Labienveillance
 */

get_header();
?>
<main id="main" class="section" style="text-align:center;padding:4rem 0;">
	<div class="container fade-in">
		<p class="section-label"><?php esc_html_e( 'Erreur', 'labienveillance' ); ?></p>
		<h1 class="section-title" style="font-size:clamp(3rem,8vw,6rem);">404</h1>
		<p class="section-subtitle centered"><?php esc_html_e( 'Cette page n’existe pas ou a été déplacée.', 'labienveillance' ); ?></p>
		<div class="btn-group" style="justify-content:center;margin-top:2rem;">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn--primary btn--lg"><?php esc_html_e( 'Retour à l’accueil', 'labienveillance' ); ?></a>
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>" class="btn btn--accent btn--lg"><?php esc_html_e( 'Contact', 'labienveillance' ); ?></a>
		</div>
	</div>
</main>
<?php
get_footer();
