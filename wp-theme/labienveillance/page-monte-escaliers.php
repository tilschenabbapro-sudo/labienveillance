<?php
/**
 * Template Name: Monte-escaliers
 * Description: Page service « Monte-escaliers » — reprise de la maquette monte-escaliers.html.
 *
 * Le HTML / contenu éditable de la page WP est ignoré : tout le contenu est servi par ce modèle.
 * Pour activer ce template manuellement, choisir « Monte-escaliers » dans la métabox « Attributs de page ».
 * Auto-application : si la page a le slug `monte-escaliers`, WordPress utilise automatiquement
 * `page-monte-escaliers.php` (convention de la hiérarchie de templates).
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
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a><span aria-hidden="true">›</span><span><?php esc_html_e( 'Monte-escaliers', 'labienveillance' ); ?></span>
		</nav>
		<?php get_template_part( 'template-parts/cross-hub-links' ); ?>
		<h1>Nos monte-escaliers</h1>
		<p class="hero__subtitle" style="color:rgba(255,255,255,0.85);max-width:650px;">
			Retrouvez votre liberté de mouvement grâce à des solutions fiables, élégantes et adaptées à tous les types d'escaliers.
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
				<p class="section-label">La solution pour tous les escaliers</p>
				<h2 class="section-title">Nous avons la solution pour tous les escaliers</h2>
				<p style="margin-bottom:1.25rem;">
					Nous avons sélectionné pour vous les marques <strong>Up Stairlift</strong> et <strong>Acorn</strong>,
					reconnues pour leur fiabilité et leur confort. Avec nos monte-escaliers, vous pouvez rester chez vous,
					conserver votre autonomie et continuer à vivre sereinement dans votre maison.
				</p>
				<div class="service-benefits">
					<div class="service-benefit">
						<div class="service-benefit__check">✓</div>
						<p><strong>Installation rapide</strong> — parfois en une seule journée</p>
					</div>
					<div class="service-benefit">
						<div class="service-benefit__check">✓</div>
						<p><strong>Adaptable</strong> aux escaliers droits ou tournants</p>
					</div>
					<div class="service-benefit">
						<div class="service-benefit__check">✓</div>
						<p><strong>Éligible à Ma Prime Adapt'</strong> sous conditions</p>
					</div>
					<div class="service-benefit">
						<div class="service-benefit__check">✓</div>
						<p><strong>Matériel neuf, reconditionné ou en location</strong> à partir de 29&nbsp;€ par mois</p>
					</div>
				</div>
			</div>
			<img src="<?php echo esc_url( labienveillance_img( 'monte-escalier-intro-solution.png' ) ); ?>" alt="Couple senior : monte-escalier en pied d’escalier bois, ambiance intérieure lumineuse et chaleureuse" class="hero__image" width="600" height="450" loading="eager">
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="service-intro service-intro--reverse fade-in">
			<div>
				<p class="section-label">Autre solution pour les étages</p>
				<h2 class="section-title">Plateformes élévatrices</h2>
				<p style="margin-bottom:1rem;">
					Lorsque l’escalier est très étroit, en colimaçon complexe, ou lorsqu’il faut transporter une personne en fauteuil roulant entre deux niveaux,
					la <strong>plateforme élévatrice</strong> (verticale ou sur rampe inclinée) peut être plus adaptée qu’un fauteuil monte-escalier classique sur rail.
				</p>
				<p style="margin-bottom:1rem;">
					Nous étudions avec vous la configuration de votre logement&nbsp;: dégagements, portes, alimentation électrique et normes en vigueur,
					pour vous proposer une solution sûre et confortable — monte-escalier, plateforme, ou combinaison sur mesure.
				</p>
				<p>
					<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--primary btn--sm">Demander un rdv pour un conseil personnalisé</a>
				</p>
			</div>
			<img src="<?php echo esc_url( labienveillance_img( 'plateforme-elevatrice.png' ) ); ?>" alt="Plateforme élévatrice inclinée pour fauteuil roulant, installation intérieure" class="hero__image" width="600" height="450" loading="lazy">
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2.5rem;">
			<p class="section-label">Nos modèles</p>
			<h2 class="section-title">Deux marques de référence pour votre confort</h2>
		</div>
		<div class="products-grid fade-in">
			<div class="product-card">
				<img src="<?php echo esc_url( labienveillance_img( 'monte-escalier-up-stairlift.png' ) ); ?>" alt="Monte-escalier UP Stairlift, siège en simili cuir brun capitonné, rail métal dans un escalier droit bois clair" class="product-card__img" width="500" height="312" loading="lazy">
				<div class="product-card__body">
					<h3>Modèle UP Stairlift</h3>
					<p>
						Nous allons rendre votre vie plus facile avec notre monte-escalier UP.
						Design, technologie, confort et sécurité&nbsp;: tout est pensé pour vous permettre
						de profiter de votre indépendance plus longtemps, sans contrainte au quotidien.
					</p>
					<p>
						Tous nos monte-escaliers sont <strong>garantis 4 ans</strong> pièces, main-d'œuvre et déplacement.
						Le rail et le moteur sont <strong>garantis à vie</strong>.
					</p>
					<span class="product-card__tag">Garantie à vie sur le rail</span>
				</div>
			</div>
			<div class="product-card">
				<img src="<?php echo esc_url( labienveillance_img( 'monte-escalier-acorn.png' ) ); ?>" alt="Monte-escalier Acorn beige et blanc sur rail rectiligne, pied d’un escalier bois résidentiel" class="product-card__img" width="500" height="312" loading="lazy">
				<div class="product-card__body">
					<h3>Modèle ACORN</h3>
					<p>
						<strong>En une seule journée&nbsp;!</strong> Le système unique de rail Acorn permet une mise en place
						simple et rapide dans bien des configurations.
					</p>
					<p>
						Un monte-escalier Acorn vous offre un moyen sûr, simple et confortable de monter
						et descendre vos escaliers. Chaque appareil est conçu pour répondre à vos besoins,
						avec un grand confort d'usage et une adaptation à presque tous les types d'escaliers.
					</p>
					<span class="product-card__tag">Installation en 1 journée</span>
				</div>
			</div>
		</div>
	</div>
</section>

<?php
/**
 * Devis estimatif JLM — configurateur intégré (pas d’iframe).
 * CSS/JS : `jlm-lite-devis.*` enqueued sur cette page depuis functions.php.
 */
?>
<section class="section section--alt devis-jlm devis-jlm--dark-strip" id="devis-estimatif-en-ligne" aria-labelledby="devis-jlm-title">
	<div class="container">
		<div class="devis-jlm__head fade-in">
			<p class="section-label">Estimation personnalisée</p>
			<h2 class="section-title" id="devis-jlm-title">Devis estimatif monte-escalier</h2>
			<p class="section-subtitle centered" style="max-width:640px;margin-left:auto;margin-right:auto;">
				Estimez votre projet en quelques étapes&nbsp;: type d’escalier, configuration, photos utiles et un prix estimatif indicatif.
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

<section class="quote-banner">
	<div class="container fade-in">
		<h2 style="color:#fff;margin-bottom:0.75rem;">Retrouvez votre liberté de mouvement</h2>
		<p style="color:rgba(255,255,255,0.85);max-width:600px;margin:0 auto 2rem;font-size:1.1rem;">
			Et la sérénité d'un foyer accessible à chaque étage.
		</p>
		<div class="btn-group" style="justify-content:center;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--white btn--lg">Demander un rdv</a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php echo esc_html( $phone_display ); ?></a>
		</div>
	</div>
</section>

<?php
get_footer();
