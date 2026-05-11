<?php
/**
 * Template Name: Devis estimatif monte-escalier (JLM)
 * Description: Outil de devis pas à pas — requiert les actions AJAX jlm_get_config / jlm_save_config sur le site.
 *
 * @package Labienveillance
 */

get_header();
?>
<main id="main" class="section" style="padding-top:1.5rem;padding-bottom:3rem;">
	<div class="container">
		<nav class="breadcrumb" aria-label="<?php esc_attr_e( 'Fil d’Ariane', 'labienveillance' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a>
			<span aria-hidden="true">›</span>
			<a href="<?php echo esc_url( labienveillance_page_url( 'monte-escaliers' ) ); ?>"><?php esc_html_e( 'Monte-escaliers', 'labienveillance' ); ?></a>
			<span aria-hidden="true">›</span>
			<span><?php the_title(); ?></span>
		</nav>

		<?php
		while ( have_posts() ) :
			the_post();
			$content = get_post()->post_content;
			if ( trim( wp_strip_all_tags( $content ) ) !== '' || ( function_exists( 'has_blocks' ) && has_blocks( $content ) ) ) {
				echo '<div class="entry-content" style="margin-bottom:2rem;max-width:800px;">';
				the_content();
				echo '</div>';
			}
		endwhile;
		?>

		<section class="devis-jlm devis-jlm--dark-strip devis-jlm--inline" aria-label="<?php esc_attr_e( 'Estimation monte-escalier', 'labienveillance' ); ?>" style="margin-top:1.5rem;">
			<div id="jlmLiteAppRoot" class="devis-jlm__root-wrap lab-jlm-devis-root" role="application" aria-live="polite" aria-label="<?php esc_attr_e( 'Configurateur de devis monte-escalier', 'labienveillance' ); ?>"></div>
		</section>
	</div>
</main>
<?php
get_footer();
