<?php
/**
 * Template Name: Estimation douche / salle de bain
 * Description: Configurateur devis salle de bain — page dédiée (même bloc que l’ancienne intégration sur la page service).
 *
 * Slug conseillé : estimation-douche
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
			<a href="<?php echo esc_url( labienveillance_page_url( 'salle-de-bain' ) ); ?>"><?php esc_html_e( 'Salle de bain', 'labienveillance' ); ?></a>
			<span aria-hidden="true">›</span>
			<span><?php esc_html_e( 'Devis estimatif', 'labienveillance' ); ?></span>
		</nav>
		<?php get_template_part( 'template-parts/cross-hub-links' ); ?>
		<h1><?php esc_html_e( 'Estimation douche sécurisée', 'labienveillance' ); ?></h1>
		<p class="hero__subtitle" style="color:rgba(255,255,255,0.85);max-width:650px;">
			<?php esc_html_e( 'Configurez votre projet en ligne, puis validez avec une visite technique gratuite.', 'labienveillance' ); ?>
		</p>
		<div class="btn-group" style="margin-top:1.5rem;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'salle-de-bain' ) ); ?>" class="btn btn--white btn--lg"><?php esc_html_e( 'Présentation salle de bain', 'labienveillance' ); ?></a>
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--accent btn--lg"><?php esc_html_e( 'Demander un rdv', 'labienveillance' ); ?></a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php esc_html_e( 'Appelez-nous', 'labienveillance' ); ?></a>
		</div>
	</div>
</section>

<?php
/**
 * Markup : template-parts/devis-sdb.php — enqueue dans functions.php sur cette page.
 */
get_template_part( 'template-parts/devis-sdb' );
?>

<section class="quote-banner">
	<div class="container fade-in">
		<h2 style="color:#fff;margin-bottom:0.75rem;"><?php esc_html_e( 'Votre douche, votre autonomie, votre sérénité', 'labienveillance' ); ?></h2>
		<p style="color:rgba(255,255,255,0.85);max-width:600px;margin:0 auto 2rem;font-size:1.1rem;">
			<?php esc_html_e( 'Demandez un rendez-vous ou un devis gratuit et sans engagement.', 'labienveillance' ); ?>
		</p>
		<div class="btn-group" style="justify-content:center;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--white btn--lg"><?php esc_html_e( 'Demander un rdv', 'labienveillance' ); ?></a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php echo esc_html( $phone_display ); ?></a>
		</div>
	</div>
</section>

<?php
get_footer();
