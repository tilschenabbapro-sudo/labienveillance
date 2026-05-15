<?php
/**
 * Template part — Configurateur devis monte-escalier (JLM Lite)
 *
 * Inclus depuis les pages dédiées estimation / ancien modèle « Devis JLM ».
 * CSS/JS : jlm-lite-devis.* (enqueue conditionnel dans functions.php).
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<section class="section section--alt devis-jlm devis-jlm--dark-strip" id="devis-estimatif-en-ligne" aria-labelledby="devis-jlm-title">
	<div class="container">
		<div class="devis-jlm__head fade-in">
			<p class="section-label">Estimation personnalisée</p>
			<h2 class="section-title" id="devis-jlm-title">Devis estimatif monte-escalier</h2>
			<p class="section-subtitle centered" style="max-width:640px;margin-left:auto;margin-right:auto;">
				Estimez votre projet en quelques étapes&nbsp;: type d’escalier, configuration, puis <strong>nombre de marches ou longueur de rail</strong>, arrivée du siège et prix indicatif.
				La visite technique gratuite permet d’affiner les mesures.
			</p>
		</div>
		<div
			id="jlmLiteAppRoot"
			class="devis-jlm__root-wrap fade-in"
			role="application"
			aria-label="<?php esc_attr_e( 'Configurateur de devis monte-escalier', 'labienveillance' ); ?>"
		></div>
	</div>
</section>
