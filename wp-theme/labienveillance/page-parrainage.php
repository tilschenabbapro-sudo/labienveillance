<?php
/**
 * Template Name: Parrainage
 * Description: Page « Parrainage » — placeholder « en construction » repris de la maquette parrainage.html.
 *
 * Auto-application si la page a le slug `parrainage`.
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
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a><span aria-hidden="true">›</span><span><?php esc_html_e( 'Parrainage', 'labienveillance' ); ?></span>
		</nav>
		<h1>Parrainage</h1>
		<p class="hero__subtitle" style="color:rgba(255,255,255,0.85);max-width:640px;">
			Cette page est en cours de préparation.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<?php
		while ( have_posts() ) :
			the_post();
			$content = get_post()->post_content;
			$has_content = trim( wp_strip_all_tags( $content ) ) !== '' || ( function_exists( 'has_blocks' ) && has_blocks( $content ) );
			?>
			<?php if ( $has_content ) : ?>
				<article <?php post_class( 'fade-in' ); ?>>
					<div class="entry-content" style="max-width:800px;margin:0 auto;">
						<?php the_content(); ?>
					</div>
				</article>
			<?php else : ?>
				<div class="legal-content fade-in page-under-construction" style="max-width:640px;margin:0 auto;text-align:center;padding:2.5rem 1.5rem;background:var(--surface);border-radius:var(--radius-lg);box-shadow:var(--shadow);border:1px solid var(--border-light);">
					<p class="section-label">Bientôt</p>
					<h2 class="section-title" style="font-size:1.6rem;margin-bottom:1rem;">Page en construction</h2>
					<p style="margin-bottom:1.5rem;line-height:1.65;color:var(--text-muted);">
						Le programme de parrainage et ses modalités seront publiés prochainement. Pour toute question ou recommandation en attendant, contactez-nous par téléphone ou via le formulaire.
					</p>
					<div class="btn-group" style="justify-content:center;">
						<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--primary btn--lg">Demander un rdv</a>
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn--outline btn--lg">Retour à l’accueil</a>
					</div>
				</div>
			<?php endif; ?>
		<?php
		endwhile;
		?>
	</div>
</section>

<?php
get_footer();
