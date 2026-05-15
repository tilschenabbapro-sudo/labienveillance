<?php
/**
 * Template Name: Estimation monte-escalier
 * Description: Configurateur devis monte-escalier — page dédiée (même bloc que l’ancienne intégration sur la page service).
 *
 * Slug conseillé : estimation-monte-escalier
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$phone_display = apply_filters( 'labienveillance_phone_display', '03 25 31 13 60' );
$phone_href    = apply_filters( 'labienveillance_phone_href', 'tel:+33325311360' );

get_header();
?>

<section class="hero hero--page" id="main">
	<div class="container">
		<nav class="breadcrumb" aria-label="<?php esc_attr_e( 'Fil d’Ariane', 'labienveillance' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a>
			<span aria-hidden="true">›</span>
			<a href="<?php echo esc_url( labienveillance_page_url( 'monte-escaliers' ) ); ?>"><?php esc_html_e( 'Monte-escaliers', 'labienveillance' ); ?></a>
			<span aria-hidden="true">›</span>
			<span><?php esc_html_e( 'Devis estimatif', 'labienveillance' ); ?></span>
		</nav>
		<?php get_template_part( 'template-parts/cross-hub-links' ); ?>
		<h1><?php esc_html_e( 'Devis estimatif monte-escalier', 'labienveillance' ); ?></h1>
		<p class="hero__subtitle" style="color:rgba(255,255,255,0.85);max-width:650px;">
			<?php esc_html_e( 'Estimez votre projet en ligne, puis affinez avec une visite technique gratuite et sans engagement.', 'labienveillance' ); ?>
		</p>
		<div class="btn-group" style="margin-top:1.5rem;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'monte-escaliers' ) ); ?>" class="btn btn--white btn--lg"><?php esc_html_e( 'Présentation monte-escaliers', 'labienveillance' ); ?></a>
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--accent btn--lg"><?php esc_html_e( 'Demander un rdv', 'labienveillance' ); ?></a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php esc_html_e( 'Appelez-nous', 'labienveillance' ); ?></a>
		</div>
	</div>
</section>

<?php get_template_part( 'template-parts/devis-monte-escalier' ); ?>

<section class="quote-banner">
	<div class="container fade-in">
		<h2 style="color:#fff;margin-bottom:0.75rem;"><?php esc_html_e( 'Retrouvez votre liberté de mouvement', 'labienveillance' ); ?></h2>
		<p style="color:rgba(255,255,255,0.85);max-width:600px;margin:0 auto 2rem;font-size:1.1rem;">
			<?php esc_html_e( 'Et la sérénité d’un foyer accessible à chaque étage.', 'labienveillance' ); ?>
		</p>
		<div class="btn-group" style="justify-content:center;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--white btn--lg"><?php esc_html_e( 'Demander un rdv', 'labienveillance' ); ?></a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php echo esc_html( $phone_display ); ?></a>
		</div>
	</div>
</section>

<?php
get_footer();
