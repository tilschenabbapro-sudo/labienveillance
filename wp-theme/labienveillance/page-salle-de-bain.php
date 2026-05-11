<?php
/**
 * Template Name: Salle de bain
 * Description: Page service « Salle de bain » — reprise de la maquette salle-de-bain.html.
 *
 * Auto-application si la page a le slug `salle-de-bain`.
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
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a><span aria-hidden="true">›</span><span><?php esc_html_e( 'Salle de bain', 'labienveillance' ); ?></span>
		</nav>
		<?php get_template_part( 'template-parts/cross-hub-links' ); ?>
		<h1>Douches adaptées</h1>
		<p class="hero__subtitle" style="color:rgba(255,255,255,0.85);max-width:650px;">
			Transformez votre baignoire en douche sécurisée en une journée, sans dégâts.
		</p>
		<div class="btn-group" style="margin-top:1.5rem;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--white btn--lg">Demander un rdv</a>
			<button type="button" class="btn btn--accent btn--lg" data-devis-modal>Devis estimatif en ligne</button>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ Appelez-nous</a>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="service-intro fade-in">
			<div>
				<p class="section-label">Le constat</p>
				<h2 class="section-title">La baignoire, certainement l'endroit le plus dangereux</h2>
				<p style="margin-bottom:1rem;">
					Enjamber une baignoire devient une source d'angoisse permanente, où chaque geste peut se
					transformer en risque de chute.
				</p>
				<p>
					La baignoire, loin d'être un confort, peut devenir un obstacle dangereux qui fragilise
					la confiance et la sécurité au quotidien. <strong>Transformer votre baignoire en douche sécurisée
					se fait dans la journée</strong> et cela sans dégâts.
				</p>
			</div>
			<img src="<?php echo esc_url( labienveillance_img( 'douche-securisee.jpg' ) ); ?>" alt="Petite salle de bain simple avec douche accessible, siège et barre de maintien" class="hero__image" width="600" height="450" loading="eager">
		</div>
		<div class="sdb-showcase fade-in" style="margin-top:2.5rem;">
			<figure>
				<img src="<?php echo esc_url( labienveillance_img( 'sdb-baignoire-vintage-style.jpg' ) ); ?>" alt="Salle de bain avec baignoire et carrelage type années 1970" width="600" height="450" loading="lazy">
				<figcaption>Salle de bain «&nbsp;avant&nbsp;» typique&nbsp;: baignoire à franchir et carrelage d’époque — situation souvent à l’origine des appréhensions au quotidien.</figcaption>
			</figure>
			<figure>
				<img src="<?php echo esc_url( labienveillance_img( 'sdb-avant-apres-douche.jpg' ) ); ?>" alt="Après travaux : douche sécurisée accessible" width="600" height="450" loading="lazy">
				<figcaption>Après transformation&nbsp;: douche accessible, sol antidérapant, barres de maintien et confort retrouvé.</figcaption>
			</figure>
			<p class="sdb-showcase__note">Visuels de démonstration générés pour la maquette ; remplacez-les par vos photos réelles de chantier lorsque disponibles.</p>
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2.5rem;">
			<p class="section-label">La solution</p>
			<h2 class="section-title">La douche sécurisée</h2>
			<p class="section-subtitle centered">
				Une douche sécurisée transforme la salle de bain en un espace de confort et de confiance,
				particulièrement pour les personnes âgées ou en perte de mobilité.
			</p>
		</div>
		<div class="features-grid fade-in">
			<div class="feature-card">
				<div class="feature-card__icon" aria-hidden="true">🪑</div>
				<div>
					<h3>Confort quotidien</h3>
					<p>Siège intégré, robinetterie ergonomique et espace optimisé apportent une expérience agréable et adaptée aux besoins de chacun.</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="feature-card__icon" aria-hidden="true">🛡️</div>
				<div>
					<h3>Sécurité optimale</h3>
					<p>Grâce à un receveur extra-plat, un sol antidérapant et des barres de maintien, les risques de glissade ou de chute sont considérablement réduits.</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="feature-card__icon" aria-hidden="true">♿</div>
				<div>
					<h3>Accessibilité totale</h3>
					<p>Sans rebord à enjamber, l'entrée se fait en un pas, rendant la douche utilisable même avec une canne, un déambulateur ou un fauteuil roulant.</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="feature-card__icon" aria-hidden="true">💪</div>
				<div>
					<h3>Autonomie préservée</h3>
					<p>La douche sécurisée permet de continuer à se laver seul(e), sans dépendre de l'aide d'un proche ou d'un soignant.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="service-intro service-intro--reverse fade-in">
			<div>
				<p class="section-label">Nos installateurs</p>
				<h2 class="section-title">La garantie d'un travail bien fait</h2>
				<p style="margin-bottom:1rem;">
					Confier votre projet à nos installateurs, c'est choisir la tranquillité d'esprit.
					Experts de l'aménagement de salles de bain, ils travaillent avec rigueur et professionnalisme
					pour vous garantir une installation fiable, sécurisée et sans surprise.
				</p>
				<p style="margin-bottom:1.5rem;">
					Attentifs à vos attentes, ils prennent le temps d'expliquer chaque étape et veillent à ce que
					le résultat final corresponde parfaitement à vos besoins. Leur objectif&nbsp;: que vous profitiez
					d'une salle de bain à la fois pratique, esthétique et durable, en toute sérénité.
				</p>
				<a href="<?php echo esc_url( labienveillance_page_url( 'amenagements' ) ); ?>" class="btn btn--primary">Découvrir nos aménagements</a>
			</div>
			<img src="<?php echo esc_url( labienveillance_img( 'installateur-sdb.jpg' ) ); ?>" alt="Artisan installant une barre de maintien dans une salle de bain modeste" class="hero__image" width="600" height="450" loading="lazy">
		</div>
	</div>
</section>

<?php
/**
 * Devis estimatif salle de bain — configurateur intégré (pas d'iframe).
 *
 * Le markup est dans template-parts/devis-sdb.php ; le JS et le CSS sont
 * enqueued conditionnellement par functions.php sur cette page (slug
 * `salle-de-bain` ou modèle `page-salle-de-bain.php`).
 *
 * La configuration client (prix, hints, photos) est surchargée via le filtre
 * `labienveillance_devis_sdb_config` — cf. mu-plugin de production.
 */
get_template_part( 'template-parts/devis-sdb' );
?>

<section class="quote-banner">
	<div class="container fade-in">
		<h2 style="color:#fff;margin-bottom:0.75rem;">Votre douche, votre autonomie, votre sérénité</h2>
		<p style="color:rgba(255,255,255,0.85);max-width:600px;margin:0 auto 2rem;font-size:1.1rem;">
			Demandez un rendez-vous ou un devis gratuit et sans engagement.
		</p>
		<div class="btn-group" style="justify-content:center;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--white btn--lg">Demander un rdv</a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php echo esc_html( $phone_display ); ?></a>
		</div>
	</div>
</section>

<?php
get_footer();
