<?php
/**
 * Contenu statique de la page d’accueil (reprise maquette).
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<section class="hero hero--home" id="main">
	<div class="container">
		<div class="hero__grid">
			<div class="hero__content fade-in">
				<p class="section-label"><?php esc_html_e( 'Bienvenue sur La Bienveillance', 'labienveillance' ); ?></p>
				<h1 class="hero__title"><?php esc_html_e( 'Améliorer votre ', 'labienveillance' ); ?><em><?php esc_html_e( 'qualité de vie', 'labienveillance' ); ?></em><?php esc_html_e( ' et votre santé au quotidien', 'labienveillance' ); ?></h1>
				<p class="hero__subtitle">
					<?php esc_html_e( 'Parce que bien vieillir, c’est avant tout rester libre, en sécurité et en bonne santé. Notre mission est simple : vous accompagner dans l’aménagement de votre maison pour qu’elle reste un lieu de confort et de sécurité, à chaque étape de la vie.', 'labienveillance' ); ?>
				</p>
				<div class="hero__badges">
					<div class="hero__badge">
						<span class="hero__badge-icon hero__badge-icon--green" aria-hidden="true">🕊️</span>
						<?php esc_html_e( 'Liberté de mouvement', 'labienveillance' ); ?>
					</div>
					<div class="hero__badge">
						<span class="hero__badge-icon hero__badge-icon--gold" aria-hidden="true">🛡️</span>
						<?php esc_html_e( 'Sécurité au quotidien', 'labienveillance' ); ?>
					</div>
					<div class="hero__badge">
						<span class="hero__badge-icon hero__badge-icon--green" aria-hidden="true">🏡</span>
						<?php esc_html_e( 'Confort & sérénité', 'labienveillance' ); ?>
					</div>
					<div class="hero__badge">
						<span class="hero__badge-icon hero__badge-icon--gold" aria-hidden="true">💚</span>
						<?php esc_html_e( 'Vitalité & bien-être', 'labienveillance' ); ?>
					</div>
				</div>
				<div class="btn-group">
					<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>" class="btn btn--primary btn--lg"><?php esc_html_e( 'Demander un devis gratuit', 'labienveillance' ); ?></a>
					<a href="#devis-estimatif-en-ligne" class="btn btn--accent btn--lg"><?php esc_html_e( 'Devis estimatif en ligne', 'labienveillance' ); ?></a>
					<a href="tel:+33329000000" class="btn btn--outline btn--lg">☎ <?php echo esc_html( apply_filters( 'labienveillance_phone_display', '03 29 00 00 00' ) ); ?></a>
				</div>
			</div>
			<div class="hero__visual fade-in">
				<img src="<?php echo esc_url( labienveillance_img( 'hero-seniors.jpg' ) ); ?>" alt="<?php esc_attr_e( 'Couple senior heureux dans leur salon aménagé', 'labienveillance' ); ?>" class="hero__image" width="600" height="450" loading="eager">
				<div class="hero__floating-card hero__floating-card--bottom">
					<strong><?php esc_html_e( '+ de 15 ans', 'labienveillance' ); ?></strong>
					<?php esc_html_e( 'd’accompagnement bienveillant', 'labienveillance' ); ?>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom: 2.5rem;">
			<p class="section-label"><?php esc_html_e( 'Nos engagements', 'labienveillance' ); ?></p>
			<h2 class="section-title"><?php esc_html_e( 'Nous plaçons l’humain au cœur de nos solutions', 'labienveillance' ); ?></h2>
			<p class="section-subtitle centered"><?php esc_html_e( 'Avec écoute, professionnalisme et proximité', 'labienveillance' ); ?></p>
		</div>
		<div class="pillars fade-in">
			<a href="<?php echo esc_url( labienveillance_page_url( 'monte-escaliers' ) ); ?>" class="pillar-card">
				<div class="pillar-card__icon pillar-card__icon--green" aria-hidden="true">🕊️</div>
				<h3><?php esc_html_e( 'Liberté', 'labienveillance' ); ?></h3>
				<p><?php esc_html_e( 'Des monte-escaliers adaptés à chaque intérieur pour retrouver votre liberté de mouvement.', 'labienveillance' ); ?></p>
			</a>
			<a href="<?php echo esc_url( labienveillance_page_url( 'salle-de-bain' ) ); ?>" class="pillar-card">
				<div class="pillar-card__icon pillar-card__icon--gold" aria-hidden="true">🛡️</div>
				<h3><?php esc_html_e( 'Sécurité', 'labienveillance' ); ?></h3>
				<p><?php esc_html_e( 'Remplacement de baignoires par des douches accessibles et sécurisées.', 'labienveillance' ); ?></p>
			</a>
			<a href="<?php echo esc_url( labienveillance_page_url( 'amenagements' ) ); ?>" class="pillar-card">
				<div class="pillar-card__icon pillar-card__icon--blue" aria-hidden="true">🏡</div>
				<h3><?php esc_html_e( 'Confort', 'labienveillance' ); ?></h3>
				<p><?php esc_html_e( 'WC surélevés, mains courantes, volets électriques commandés à distance.', 'labienveillance' ); ?></p>
			</a>
			<a href="<?php echo esc_url( labienveillance_page_url( 'conseils' ) ); ?>" class="pillar-card">
				<div class="pillar-card__icon pillar-card__icon--rose" aria-hidden="true">💚</div>
				<h3><?php esc_html_e( 'Santé', 'labienveillance' ); ?></h3>
				<p><?php esc_html_e( 'Compléments alimentaires sélectionnés et personnalisés pour votre vitalité.', 'labienveillance' ); ?></p>
			</a>
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom: 2.5rem;">
			<p class="section-label"><?php esc_html_e( 'Tout faire pour rester chez soi', 'labienveillance' ); ?></p>
			<h2 class="section-title"><?php esc_html_e( 'Des solutions concrètes pour chaque défi du quotidien', 'labienveillance' ); ?></h2>
		</div>
		<div class="features-grid">
			<div class="feature-card fade-in">
				<div class="feature-card__icon" aria-hidden="true">🪜</div>
				<div>
					<h3><?php esc_html_e( 'Terminé la galère de l’escalier', 'labienveillance' ); ?></h3>
					<p><?php esc_html_e( 'Nos monte-escaliers vous redonnent accès à chaque étage en toute sécurité. Ma liberté retrouvée !', 'labienveillance' ); ?></p>
				</div>
			</div>
			<div class="feature-card fade-in">
				<div class="feature-card__icon" aria-hidden="true">🚿</div>
				<div>
					<h3><?php esc_html_e( 'Terminé la peur de la baignoire', 'labienveillance' ); ?></h3>
					<p><?php esc_html_e( 'Transformation en douche sécurisée en une journée, sans dégâts. Plus de toilette de chat !', 'labienveillance' ); ?></p>
				</div>
			</div>
			<div class="feature-card fade-in">
				<div class="feature-card__icon" aria-hidden="true">💡</div>
				<div>
					<h3><?php esc_html_e( 'Bien éclairé, c’est rassurant', 'labienveillance' ); ?></h3>
					<p><?php esc_html_e( 'Un éclairage adapté réduit les risques de chute et renforce le sentiment de sécurité.', 'labienveillance' ); ?></p>
				</div>
			</div>
			<div class="feature-card fade-in">
				<div class="feature-card__icon" aria-hidden="true">🏠</div>
				<div>
					<h3><?php esc_html_e( 'Un logement adapté, une vie sereine', 'labienveillance' ); ?></h3>
					<p><?php esc_html_e( 'WC surélevés, poignées de maintien, domotique… chaque détail compte pour votre bien-être.', 'labienveillance' ); ?></p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="service-intro fade-in">
			<div>
				<p class="section-label"><?php esc_html_e( 'Notre approche', 'labienveillance' ); ?></p>
				<h2 class="section-title"><?php esc_html_e( 'Pour vivre sereinement les années à venir', 'labienveillance' ); ?></h2>
				<p style="margin-bottom:1rem;">
					<?php esc_html_e( '« Pour vivre sereinement les années à venir, avec mon mari, nous organisons notre maison. Objectif : l’adapter pour vivre libre, sans angoisses et risques de chutes. Tout faire pour rester chez soi. »', 'labienveillance' ); ?>
				</p>
				<div class="service-benefits">
					<div class="service-benefit">
						<div class="service-benefit__check" aria-hidden="true">✓</div>
						<p><strong><?php esc_html_e( 'Liberté de mouvement', 'labienveillance' ); ?></strong> <?php esc_html_e( 'grâce à des monte-escaliers adaptés à chaque intérieur', 'labienveillance' ); ?></p>
					</div>
					<div class="service-benefit">
						<div class="service-benefit__check" aria-hidden="true">✓</div>
						<p><strong><?php esc_html_e( 'Sécurité au quotidien', 'labienveillance' ); ?></strong> <?php esc_html_e( 'en remplaçant les baignoires par des douches accessibles et sécurisées', 'labienveillance' ); ?></p>
					</div>
					<div class="service-benefit">
						<div class="service-benefit__check" aria-hidden="true">✓</div>
						<p><strong><?php esc_html_e( 'Confort et sécurité', 'labienveillance' ); ?></strong> <?php esc_html_e( 'en aménageant le domicile : WC surélevés, mains courantes, volets électriques', 'labienveillance' ); ?></p>
					</div>
					<div class="service-benefit">
						<div class="service-benefit__check" aria-hidden="true">✓</div>
						<p><strong><?php esc_html_e( 'Vitalité et bien-être', 'labienveillance' ); ?></strong> <?php esc_html_e( 'grâce à des compléments alimentaires sélectionnés et personnalisés', 'labienveillance' ); ?></p>
					</div>
				</div>
			</div>
			<img src="<?php echo esc_url( labienveillance_img( 'accompagnement-conseil.jpg' ) ); ?>" alt="<?php esc_attr_e( 'Conseiller La Bienveillance en visite à domicile avec un couple senior', 'labienveillance' ); ?>" class="hero__image" width="600" height="450" loading="lazy">
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom: 2rem;">
			<p class="section-label"><?php esc_html_e( 'Témoignage', 'labienveillance' ); ?></p>
			<h2 class="section-title"><?php esc_html_e( 'Ils nous font confiance', 'labienveillance' ); ?></h2>
		</div>
		<div class="testimonial-card fade-in">
			<blockquote>
				<?php esc_html_e( 'Quel bonheur, grâce au monte-escalier, mon mari peut à nouveau coucher dans notre chambre à l’étage et quitter ce lit médicalisé que nous avions installé au milieu du salon. Merci !', 'labienveillance' ); ?>
			</blockquote>
			<div class="testimonial-card__author">
				<div class="testimonial-card__avatar" aria-hidden="true">MS</div>
				<div>
					<div class="testimonial-card__name"><?php esc_html_e( 'Mme Scholler', 'labienveillance' ); ?></div>
					<div class="testimonial-card__location"><?php esc_html_e( 'Épinal', 'labienveillance' ); ?></div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom: 2.5rem;">
			<p class="section-label"><?php esc_html_e( 'Aides financières', 'labienveillance' ); ?></p>
			<h2 class="section-title"><?php esc_html_e( 'Des dispositifs pour alléger votre investissement', 'labienveillance' ); ?></h2>
			<p class="section-subtitle centered"><?php esc_html_e( 'Nos équipements sont éligibles à plusieurs aides de l’État et des collectivités.', 'labienveillance' ); ?></p>
			<a href="<?php echo esc_url( labienveillance_page_url( 'aides-financieres' ) ); ?>" class="btn btn--outline btn--sm" style="margin-top:1rem;"><?php esc_html_e( 'Voir toutes les aides en détail', 'labienveillance' ); ?></a>
		</div>
		<div class="aids-grid fade-in">
			<div class="aid-card">
				<div class="aid-card__icon" aria-hidden="true">🏛️</div>
				<h3><?php esc_html_e( 'Ma Prime Adapt’', 'labienveillance' ); ?></h3>
				<p><?php esc_html_e( 'Aide de l’ANAH pour financer l’adaptation de votre logement à la perte d’autonomie. Sous conditions de ressources.', 'labienveillance' ); ?></p>
			</div>
			<div class="aid-card">
				<div class="aid-card__icon" aria-hidden="true">📋</div>
				<h3><?php esc_html_e( 'Crédit d’impôt', 'labienveillance' ); ?></h3>
				<p><?php esc_html_e( 'Bénéficiez d’un crédit d’impôt de 25 % pour les travaux d’accessibilité et d’adaptation du logement.', 'labienveillance' ); ?></p>
			</div>
			<div class="aid-card">
				<div class="aid-card__icon" aria-hidden="true">🤝</div>
				<h3><?php esc_html_e( 'APA & aides locales', 'labienveillance' ); ?></h3>
				<p><?php esc_html_e( 'L’Allocation Personnalisée d’Autonomie et les aides du département des Vosges peuvent participer au financement.', 'labienveillance' ); ?></p>
			</div>
		</div>
	</div>
</section>

<?php
$lab_devis_iframe_src = labienveillance_get_devis_embed_url();
?>
<section class="section section--alt devis-jlm" id="devis-estimatif-en-ligne" aria-labelledby="devis-jlm-title-home">
	<div class="container">
		<div class="devis-jlm__head fade-in">
			<p class="section-label"><?php esc_html_e( 'Estimation personnalisée', 'labienveillance' ); ?></p>
			<h2 class="section-title" id="devis-jlm-title-home"><?php esc_html_e( 'Devis estimatif monte-escalier', 'labienveillance' ); ?></h2>
			<p class="section-subtitle centered" style="max-width:640px;margin-left:auto;margin-right:auto;">
				<?php esc_html_e( 'Estimez votre projet en quelques étapes : type d’escalier, configuration, photos utiles et fourchettes indicatives de prix.', 'labienveillance' ); ?>
			</p>
			<p class="devis-jlm__fallback">
				<a href="<?php echo esc_url( $lab_devis_iframe_src ); ?>" class="btn btn--primary btn--sm" target="_blank" rel="noopener"><?php esc_html_e( 'Ouvrir l’outil dans un nouvel onglet', 'labienveillance' ); ?></a>
			</p>
		</div>
		<div class="devis-jlm__frame-wrap fade-in">
			<iframe
				title="<?php echo esc_attr__( 'Devis estimatif monte-escalier — La Bienveillance', 'labienveillance' ); ?>"
				src="<?php echo esc_url( $lab_devis_iframe_src ); ?>"
				loading="lazy"
				referrerpolicy="strict-origin-when-cross-origin"
				allow="clipboard-write"
			></iframe>
		</div>
	</div>
</section>

<section class="quote-banner">
	<div class="container fade-in">
		<blockquote>
			<?php esc_html_e( '« Être sénior, ce n’est pas tourner une page, c’est écrire un nouveau chapitre rempli de liberté et de joie. »', 'labienveillance' ); ?>
		</blockquote>
		<div class="btn-group" style="justify-content: center;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>" class="btn btn--white btn--lg"><?php esc_html_e( 'Contactez-nous', 'labienveillance' ); ?></a>
			<a href="tel:+33329000000" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php echo esc_html( apply_filters( 'labienveillance_phone_display', '03 29 00 00 00' ) ); ?></a>
		</div>
	</div>
</section>
