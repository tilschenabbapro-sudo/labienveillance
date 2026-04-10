<?php
/**
 * Pied de page
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<footer class="footer">
	<div class="container">
		<div class="footer__grid">
			<div>
				<div class="footer__brand"><?php esc_html_e( 'La ', 'labienveillance' ); ?><span><?php esc_html_e( 'Bienveillance', 'labienveillance' ); ?></span></div>
				<p class="footer__desc">
					<?php esc_html_e( 'Nous vous accompagnons dans l’aménagement de votre maison pour qu’elle reste un lieu de confort et de sécurité, à chaque étape de la vie. Épinal & Vosges.', 'labienveillance' ); ?>
				</p>
			</div>
			<div>
				<h4><?php esc_html_e( 'Nos services', 'labienveillance' ); ?></h4>
				<ul class="footer__links">
					<li><a href="<?php echo esc_url( labienveillance_page_url( 'monte-escaliers' ) ); ?>"><?php esc_html_e( 'Monte-escaliers', 'labienveillance' ); ?></a></li>
					<li><a href="<?php echo esc_url( labienveillance_page_url( 'salle-de-bain' ) ); ?>"><?php esc_html_e( 'Salle de bain', 'labienveillance' ); ?></a></li>
					<li><a href="<?php echo esc_url( labienveillance_page_url( 'amenagements' ) ); ?>"><?php esc_html_e( 'Aménagements', 'labienveillance' ); ?></a></li>
					<li><a href="<?php echo esc_url( labienveillance_page_url( 'conseils' ) ); ?>"><?php esc_html_e( 'Conseils & Santé', 'labienveillance' ); ?></a></li>
				</ul>
			</div>
			<div>
				<h4><?php esc_html_e( 'Informations', 'labienveillance' ); ?></h4>
				<ul class="footer__links">
					<li><a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>"><?php esc_html_e( 'Contact', 'labienveillance' ); ?></a></li>
					<li><a href="<?php echo esc_url( labienveillance_page_url( 'aides-financieres' ) ); ?>"><?php esc_html_e( 'Aides financières', 'labienveillance' ); ?></a></li>
					<li><a href="<?php echo esc_url( labienveillance_page_url( 'mentions-legales' ) ); ?>"><?php esc_html_e( 'Mentions légales', 'labienveillance' ); ?></a></li>
				</ul>
			</div>
			<div>
				<h4><?php esc_html_e( 'Nous contacter', 'labienveillance' ); ?></h4>
				<div class="footer__contact-item">📍 <?php esc_html_e( 'Épinal, Vosges (88)', 'labienveillance' ); ?></div>
				<div class="footer__contact-item">
					☎ <a href="tel:+33325311360"><?php echo esc_html( apply_filters( 'labienveillance_phone_display', '03 25 31 13 60' ) ); ?></a>
				</div>
				<div class="footer__contact-item">
					✉ <a href="mailto:contact@labienveillance.fr">contact@labienveillance.fr</a>
				</div>
			</div>
		</div>
		<div class="footer__bottom">
			<span>&copy; <?php echo esc_html( (string) gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'Tous droits réservés.', 'labienveillance' ); ?></span>
			<a href="<?php echo esc_url( labienveillance_page_url( 'mentions-legales' ) ); ?>"><?php esc_html_e( 'Politique de confidentialité', 'labienveillance' ); ?></a>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
