<?php
/**
 * Template part — Configurateur devis salle de bain (outil douche 23 étapes)
 *
 * Inclus depuis page-salle-de-bain.php (et potentiellement d'autres pages).
 * Le JS se branche sur #jlmDoucheAppRoot (assets/js/jlm-douche-app.js).
 *
 * Défauts et persistance : functions.php (labienveillance_jlm_douche_defaults,
 * option labienveillance_jlm_douche_cfg, AJAX jlm_load_douche_config).
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<section class="section section--alt devis-sdb devis-sdb--dark-strip" id="devis-estimatif-salle-de-bain" aria-labelledby="devis-sdb-title">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2rem;">
			<p class="section-label">Estimation personnalisée</p>
			<h2 class="section-title" id="devis-sdb-title">Devis estimatif salle de bain</h2>
			<p class="section-subtitle centered" style="max-width:640px;margin-left:auto;margin-right:auto;">
				En <strong>23 étapes</strong>, obtenez une estimation chiffrée de votre future salle de bain sécurisée
				(baignoire remplacée par une douche, options de rénovation complète).
				<strong>Visite technique gratuite et sans engagement.</strong>
			</p>
		</div>

		<div
			class="devis-sdb__app fade-in"
			id="jlmDoucheAppRoot"
			data-devis-sdb-theme="dark"
			role="application"
			aria-label="<?php esc_attr_e( 'Configurateur de devis salle de bain', 'labienveillance' ); ?>"
		>
			<noscript>
				<div class="devis-sdb__noscript">
					<h3>Activez JavaScript pour utiliser le configurateur</h3>
					<p>
						Vous pouvez aussi nous contacter directement&nbsp;:
						<a href="<?php echo esc_url( apply_filters( 'labienveillance_phone_href', 'tel:+33325311360' ) ); ?>"><?php echo esc_html( apply_filters( 'labienveillance_phone_display', '03 25 31 13 60' ) ); ?></a>
						ou via notre
						<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>">formulaire de contact</a>.
					</p>
				</div>
			</noscript>
		</div>
	</div>
</section>
