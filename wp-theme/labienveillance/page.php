<?php
/**
 * Page standard (fallback)
 *
 * Reproduit la structure d’une page service&nbsp;: hero hero--page (bambou + breadcrumb + h1)
 * puis le contenu éditable WP (Gutenberg / éditeur classique).
 *
 * Les pages aux slugs connus (`monte-escaliers`, `salle-de-bain`, `estimation-monte-escalier`, `estimation-douche`, `amenagements`,
 * `conseils`, `aides-financieres`, `contact`, `mentions-legales`) sont prises en
 * charge par leurs modèles dédiés `page-{slug}.php`. Le slug `parrainage` dispose
 * également d'un modèle (`page-parrainage.php`), mais la page WP correspondante
 * n'est pas créée au go-live (programme reporté).
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<section class="hero hero--page" id="main">
	<div class="container">
		<nav class="breadcrumb" aria-label="<?php esc_attr_e( 'Fil d’Ariane', 'labienveillance' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a><span aria-hidden="true">›</span><span><?php the_title(); ?></span>
		</nav>
		<h1><?php the_title(); ?></h1>
	</div>
</section>

<section class="section">
	<div class="container">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article <?php post_class( 'fade-in' ); ?>>
				<div class="entry-content" style="max-width:800px;margin:0 auto;">
					<?php the_content(); ?>
					<?php
					wp_link_pages(
						array(
							'before' => '<div class="page-links">' . esc_html__( 'Pages :', 'labienveillance' ),
							'after'  => '</div>',
						)
					);
					?>
				</div>
			</article>
		<?php endwhile; ?>
	</div>
</section>
<?php
get_footer();
