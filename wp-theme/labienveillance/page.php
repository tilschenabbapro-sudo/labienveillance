<?php
/**
 * Page standard : titre + contenu éditable (Gutenberg / éditeur classique).
 *
 * @package Labienveillance
 */

get_header();
?>
<main id="main" class="section hero hero--page">
	<div class="container">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article <?php post_class(); ?>>
				<h1 class="section-title" style="margin-bottom: 1.5rem;"><?php the_title(); ?></h1>
				<div class="entry-content" style="max-width: 800px;">
					<?php the_content(); ?>
				</div>
			</article>
		<?php endwhile; ?>
	</div>
</main>
<?php
get_footer();
