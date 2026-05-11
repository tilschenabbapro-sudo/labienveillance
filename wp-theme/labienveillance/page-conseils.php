<?php
/**
 * Template Name: Conseils & Santé
 * Description: Page « Conseils & Santé » — reprise de la maquette conseils.html.
 *
 * Auto-application si la page a le slug `conseils`.
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
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a><span aria-hidden="true">›</span><span>Conseils &amp; Santé</span>
		</nav>
		<?php get_template_part( 'template-parts/cross-hub-links' ); ?>
		<h1>Nos conseils</h1>
		<p class="hero__subtitle" style="color:rgba(255,255,255,0.85);max-width:700px;">
			Un guide complet et des conseils santé pour accompagner les seniors et leurs proches
			dans le maintien de l'autonomie, du confort et du bien-être à domicile.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2.5rem;">
			<p class="section-label">Ressource gratuite</p>
			<h2 class="section-title">Le guide «&nbsp;Bien vieillir chez soi&nbsp;»</h2>
			<p class="section-subtitle centered">
				Un guide pratique conçu pour aider les seniors et leurs proches à maintenir
				autonomie, confort et bien-être tout en restant à domicile.
			</p>
		</div>
		<div class="guide-steps fade-in">
			<div class="guide-step">
				<div class="guide-step__number">1</div>
				<div>
					<h3>Adapter son logement</h3>
					<ul>
						<li>Installer des équipements&nbsp;: monte-escalier, douche à l'italienne, lit médicalisé</li>
						<li>Sécuriser les espaces pour prévenir les chutes (barres d'appui, éclairage, tapis antidérapants)</li>
						<li>Intégrer des solutions ergonomiques dans la cuisine et la domotique</li>
						<li>Profiter des aides financières (crédit d'impôt, ANAH, APA)</li>
					</ul>
				</div>
			</div>
			<div class="guide-step">
				<div class="guide-step__number">2</div>
				<div>
					<h3>Bien-être psychologique et social</h3>
					<ul>
						<li>Maintenir des liens sociaux pour prévenir l'isolement et réduire les risques de dépression</li>
						<li>Stimuler le cerveau par des activités cognitives (lecture, jeux, apprentissages)</li>
						<li>Participer à des activités sociales, créatives ou bénévoles</li>
					</ul>
				</div>
			</div>
			<div class="guide-step">
				<div class="guide-step__number">3</div>
				<div>
					<h3>Soutiens et accompagnements</h3>
					<ul>
						<li>Faire appel à des professionnels spécialisés (ergothérapeutes, kinés, psychologues)</li>
						<li>Recourir à des services d'aide à domicile (ménage, soins, portage de repas)</li>
						<li>Mobiliser les aides financières pour alléger les charges</li>
						<li>Anticiper les démarches administratives et juridiques (mandat de protection future, directives anticipées)</li>
					</ul>
				</div>
			</div>
			<div class="guide-step">
				<div class="guide-step__number">4</div>
				<div>
					<h3>Fiches pratiques</h3>
					<ul>
						<li>Check-lists pour sécuriser chaque pièce du logement</li>
						<li>Exercices physiques simples pour maintenir l'équilibre et la force</li>
						<li>Menus types pour éviter les carences alimentaires</li>
						<li>Tableaux de suivi santé et annuaire des contacts utiles</li>
					</ul>
				</div>
			</div>
			<div class="guide-step">
				<div class="guide-step__number">5</div>
				<div>
					<h3>Conclusion</h3>
					<p>
						Le guide met l'accent sur la préparation et la bienveillance pour vieillir chez soi dans de bonnes conditions.
						Il encourage à voir le vieillissement comme une nouvelle étape de vie, riche de sens et non comme une contrainte.
						L'objectif est de rester acteur de sa vie, entouré et soutenu.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2.5rem;">
			<p class="section-label">Santé &amp; Vitalité</p>
			<h2 class="section-title">L'équilibre Oméga-3 / Oméga-6</h2>
			<p class="section-subtitle centered">
				Avec l'âge, l'alimentation joue un rôle clé dans le maintien de la vitalité
				et la prévention des troubles chroniques.
			</p>
		</div>
		<div class="nutrition-split fade-in">
			<div>
				<p style="margin-bottom:1rem;">
					Les acides gras essentiels Oméga-3 et Oméga-6 sont indispensables au bon fonctionnement de l'organisme.
					Cependant, l'équilibre entre les deux est fondamental&nbsp;: trop d'Oméga-6 et pas assez d'Oméga-3
					favorisent l'inflammation silencieuse.
				</p>
				<p style="margin-bottom:1rem;">
					Les Oméga-3, présents dans les poissons gras, les noix ou l'huile de colza, soutiennent le cœur et le cerveau.
					Les Oméga-6, que l'on retrouve surtout dans les huiles végétales raffinées, restent nécessaires mais en quantité modérée.
				</p>
				<p style="margin-bottom:1rem;">
					Un rapport équilibré Oméga-6 / Oméga-3 contribue à fluidifier les membranes cellulaires.
					Des cellules plus souples échangent mieux les nutriments et l'oxygène.
					Cet assouplissement cellulaire facilite aussi l'absorption des vitamines et minéraux.
				</p>
				<p style="margin-bottom:1rem;">
					Chez les séniors, il favorise une meilleure mémoire, une concentration plus stable et un sommeil réparateur.
					Il contribue aussi à maintenir une bonne santé cardiovasculaire, à préserver la masse musculaire, l'énergie au quotidien
					et à renforcer les défenses immunitaires — élément crucial après 60 ans.
				</p>
				<p>
					<strong>En résumé, prendre soin de l'équilibre Oméga-3 / Oméga-6, c'est optimiser toutes les autres actions nutritionnelles et compléments.</strong>
				</p>
			</div>
			<div>
				<div class="nutrition-stat">
					<div class="nutrition-stat__number">75%</div>
					<p>des personnes testées ont un ratio<br>au-delà de <strong>15:1</strong></p>
					<p style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-light);">L'équilibre idéal est de <strong>3:1</strong></p>
				</div>
				<img src="<?php echo esc_url( labienveillance_img( 'nutrition-seniors.jpg' ) ); ?>" alt="Femme senior prenant un complément alimentaire Oméga-3 avec des fruits frais" class="hero__image" style="margin-top:1.5rem;aspect-ratio:16/9;" width="600" height="338" loading="lazy">
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="service-intro fade-in">
			<div>
				<p class="section-label">Test sanguin</p>
				<h2 class="section-title">Pensez-vous manger équilibré&nbsp;?</h2>
				<p style="margin-bottom:1rem;">
					Voulez-vous savoir ce que vous ne savez pas sur votre équilibre alimentaire&nbsp;?
				</p>
				<p style="margin-bottom:1rem;">
					Avec le <strong>test ZINZINO</strong>, vous allez connaître précisément votre équilibre Oméga-3 / Oméga-6.
					L'équilibre parfait est de 3:1.
				</p>
				<p style="margin-bottom:1.5rem;">
					Aujourd'hui nous sommes passés d'une nutrition basée sur des suppositions
					à une <strong>nutrition basée sur des tests sanguins</strong>.
				</p>
				<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>" class="btn btn--accent btn--lg">Contactez-nous pour en savoir plus</a>
			</div>
			<img src="<?php echo esc_url( labienveillance_img( 'sante-vitalite.jpg' ) ); ?>" alt="Alimentation équilibrée et compléments nutritionnels pour seniors" class="hero__image" width="600" height="450" loading="lazy">
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2rem;">
			<p class="section-label">Nos solutions</p>
			<h2 class="section-title">Envie d’aller plus loin&nbsp;?</h2>
			<p class="section-subtitle centered" style="max-width:640px;margin-left:auto;margin-right:auto;">
				Monte-escalier, douche sécurisée, aménagements du logement&nbsp;: nous vous accompagnons sur votre projet,
				avec étude gratuite et devis sans engagement.
			</p>
		</div>
		<div class="btn-group fade-in" style="justify-content:center;flex-wrap:wrap;gap:0.75rem;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'monte-escaliers' ) ); ?>" class="btn btn--primary btn--lg">Monte-escaliers</a>
			<button type="button" class="btn btn--accent btn--lg" data-devis-modal>Devis estimatif en ligne</button>
			<a href="<?php echo esc_url( labienveillance_page_url( 'salle-de-bain' ) ); ?>" class="btn btn--outline btn--lg">Salle de bain</a>
			<a href="<?php echo esc_url( labienveillance_page_url( 'amenagements' ) ); ?>" class="btn btn--outline btn--lg">Aménagements</a>
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) . '#demander-rdv' ); ?>" class="btn btn--outline btn--lg">Demander un rdv</a>
		</div>
	</div>
</section>

<section class="quote-banner">
	<div class="container fade-in">
		<blockquote>
			Ensemble, faisons de votre quotidien un environnement plus sûr, plus confortable et plus agréable,
			pour savourer chaque moment avec sérénité.
		</blockquote>
		<div class="btn-group" style="justify-content:center;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>" class="btn btn--white btn--lg">Contactez-nous</a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php echo esc_html( $phone_display ); ?></a>
		</div>
	</div>
</section>

<?php
get_footer();
