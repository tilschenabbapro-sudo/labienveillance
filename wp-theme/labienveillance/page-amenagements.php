<?php
/**
 * Template Name: Aménagements
 * Description: Page service « Aménagements du domicile » — reprise de la maquette amenagements.html.
 *
 * Auto-application si la page a le slug `amenagements`.
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
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a><span aria-hidden="true">›</span><span><?php esc_html_e( 'Aménagements', 'labienveillance' ); ?></span>
		</nav>
		<?php get_template_part( 'template-parts/cross-hub-links' ); ?>
		<h1>Aménagements du domicile</h1>
		<p class="hero__subtitle" style="color:rgba(255,255,255,0.85);max-width:700px;">
			L'aménagement d'un logement à la perte d'autonomie consiste à adapter chaque pièce
			pour préserver la sécurité, le confort et l'indépendance des habitants.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="service-intro fade-in">
			<div>
				<p class="section-label">Adapter son logement</p>
				<h2 class="section-title">Permettre à chacun de continuer à vivre chez soi</h2>
				<p style="margin-bottom:1rem;">
					Avec l'âge ou une mobilité réduite, le domicile peut rapidement devenir source de difficultés et d'inquiétudes.
					L'objectif est simple&nbsp;: permettre à chacun de continuer à vivre chez soi, en toute sérénité,
					malgré une perte de mobilité.
				</p>
				<p style="margin-bottom:1.5rem;">
					Ces travaux d'adaptation ne sont pas seulement une question de confort, ils sont aussi une garantie
					de sécurité, de dignité et de qualité de vie au quotidien.
				</p>
				<p>
					La liste des adaptations de l'habitat est longue. Vous trouverez toutes les explications et astuces
					dans le livre «&nbsp;Bien vieillir chez soi&nbsp;» dans la rubrique conseils.
				</p>
				<a href="<?php echo esc_url( labienveillance_page_url( 'conseils' ) ); ?>" class="btn btn--primary" style="margin-top:1.25rem;">Découvrir nos conseils</a>
			</div>
			<img src="<?php echo esc_url( labienveillance_img( 'amenagement-interieur.jpg' ) ); ?>" alt="Intérieur de maison aménagé pour l'accessibilité des seniors" class="hero__image" width="600" height="450" loading="eager">
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2.5rem;">
			<p class="section-label">Nos solutions</p>
			<h2 class="section-title">Transformez votre maison en un cocon sûr et confortable</h2>
			<p class="section-subtitle centered">Pensé pour le bien-être des seniors</p>
		</div>
		<div class="amenagement-grid fade-in">
			<div class="amenagement-item">
				<div class="amenagement-item__icon" aria-hidden="true">💡</div>
				<h3>Éclairage de nuit</h3>
				<p>Un éclairage adapté pour avancer sans crainte, détecteurs de mouvement et veilleuses automatiques.</p>
			</div>
			<div class="amenagement-item">
				<div class="amenagement-item__icon" aria-hidden="true">🍳</div>
				<h3>Cuisine adaptée</h3>
				<p>Adapter la cuisine pour un accès facilité aux rangements, plan de travail ergonomique et équipements sécurisés.</p>
			</div>
			<div class="amenagement-item">
				<div class="amenagement-item__icon" aria-hidden="true">🤚</div>
				<h3>Poignées de maintien</h3>
				<p>Des poignées et barres d'appui stratégiquement placées dans les zones à risque pour prévenir les chutes.</p>
			</div>
			<div class="amenagement-item">
				<div class="amenagement-item__icon" aria-hidden="true">🚽</div>
				<h3>WC surélevé</h3>
				<p>Des WC surélevés pour se relever sans effort et en toute sécurité, avec barres d'appui latérales.</p>
			</div>
			<div class="amenagement-item">
				<div class="amenagement-item__icon" aria-hidden="true">🪑</div>
				<h3>Meubles adaptés</h3>
				<p>Mobilier ergonomique aux bonnes hauteurs, poignées faciles à saisir, fauteuils releveurs.</p>
			</div>
			<div class="amenagement-item">
				<div class="amenagement-item__icon" aria-hidden="true">🏗️</div>
				<h3>Sols antidérapants et panneaux muraux</h3>
				<p>Revêtements de sol sécurisés et panneaux muraux faciles d'entretien pour toutes les pièces.</p>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2.5rem;">
			<p class="section-label">Domotique</p>
			<h2 class="section-title">Des aides domotiques très efficaces</h2>
			<p class="section-subtitle centered">La technologie au service de votre sécurité et confort</p>
		</div>
		<div class="features-grid fade-in">
			<div class="feature-card">
				<div class="feature-card__icon" aria-hidden="true">📡</div>
				<div>
					<h3>Téléassistance</h3>
					<p>Un dispositif d'alerte pour être secouru rapidement en cas de chute ou de malaise, 24h/24 et 7j/7.</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="feature-card__icon" aria-hidden="true">🗣️</div>
				<div>
					<h3>Commande vocale</h3>
					<p>Les différents éléments se déclenchent à la voix&nbsp;: éclairage, volets, chauffage, télévision.</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="feature-card__icon" aria-hidden="true">🔥</div>
				<div>
					<h3>Détecteur de fumée et de CO2</h3>
					<p>Absolument indispensable pour votre sécurité. Alerte sonore et notification en cas de danger.</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="feature-card__icon" aria-hidden="true">🪟</div>
				<div>
					<h3>Volets électriques</h3>
					<p>Volets commandés à distance ou par programmation horaire, plus besoin de manivelle ou de sangle.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="quote-banner">
	<div class="container fade-in">
		<h2 style="color:#fff;margin-bottom:0.75rem;">Transformez votre maison en un cocon sûr et confortable</h2>
		<p style="color:rgba(255,255,255,0.85);max-width:600px;margin:0 auto 2rem;font-size:1.1rem;">
			Pensé pour le bien-être des seniors.
		</p>
		<div class="btn-group" style="justify-content:center;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>" class="btn btn--white btn--lg">Contactez-nous</a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php echo esc_html( $phone_display ); ?></a>
		</div>
	</div>
</section>

<?php
get_footer();
