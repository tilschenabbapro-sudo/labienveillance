<?php
/**
 * Liste des articles (secours)
 *
 * @package Labienveillance
 */

get_header();
?>
<main id="main" class="section">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<?php while ( have_posts() ) : ?>
				<?php the_post(); ?>
				<article <?php post_class( 'fade-in' ); ?> style="margin-bottom:2rem;">
					<h2 class="section-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
					<div class="entry-excerpt"><?php the_excerpt(); ?></div>
				</article>
			<?php endwhile; ?>
			<?php the_posts_navigation(); ?>
		<?php else : ?>
			<p><?php esc_html_e( 'Aucun contenu pour le moment.', 'labienveillance' ); ?></p>
		<?php endif; ?>
	</div>
</main>
<?php
get_footer();
