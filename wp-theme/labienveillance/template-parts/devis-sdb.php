<?php
/**
 * Template part — Configurateur devis salle de bain (outil douche)
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

<section class="section section--alt devis-jlm devis-jlm--dark-strip" id="devis-estimatif-salle-de-bain" aria-labelledby="devis-sdb-title">
	<div class="container">
		<div class="devis-jlm__head fade-in">
			<p class="section-label">Estimation personnalisée</p>
			<h2 class="section-title" id="devis-sdb-title">Estimation de votre projet douche</h2>
			<p class="section-subtitle centered" style="max-width:640px;margin-left:auto;margin-right:auto;">
				Indiquez la configuration de votre pièce et les options souhaitées&nbsp;: vous obtenez une fourchette de prix cohérente avec votre cahier des charges
				(remplacement baignoire par une douche sécurisée, puis aménagements possibles autour).
				<strong>La visite technique reste gratuite et sans engagement</strong> pour affiner le devis avec un conseiller.
			</p>
		</div>

		<div
			id="jlmDoucheAppRoot"
			class="devis-jlm__root-wrap fade-in"
			role="application"
			aria-label="<?php esc_attr_e( 'Configurateur de devis salle de bain', 'labienveillance' ); ?>"
		>
			<noscript>
				<div class="devis-jlm__noscript">
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
